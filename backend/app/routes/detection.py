from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from ultralytics import YOLO
from PIL import Image
import torch
import os
import cv2
import numpy as np
from ..utils.unet_model import UNet
from torchvision import transforms
import uuid
import logging
from types import SimpleNamespace
from typing import List, Dict

logger = logging.getLogger(__name__)


def _file_nonzero(path: str) -> bool:
    try:
        return os.path.exists(path) and os.path.getsize(path) > 0
    except Exception:
        return False

router = APIRouter()

# Load YOLOv8 model with fallback
YOLO_WEIGHTS = 'weights/best.pt'
if _file_nonzero(YOLO_WEIGHTS):
    try:
        yolo_model = YOLO(YOLO_WEIGHTS)
    except Exception as e:
        logger.warning(f"Failed to load {YOLO_WEIGHTS}: {e}. Falling back to 'yolov8n.pt'.")
        try:
            yolo_model = YOLO('yolov8n.pt')
        except Exception:
            # Final fallback: dummy model that returns empty results
            logger.warning("Could not load pretrained YOLO model. Using dummy stub.")
            class _DummyYOLO:
                def __call__(self, *a, **k):
                    return [SimpleNamespace(boxes=[])]
                def predict(self, *a, **k):
                    return None
            yolo_model = _DummyYOLO()
else:
    # weights file missing or empty: try official small model name (will download if needed)
    try:
        yolo_model = YOLO('yolov8n.pt')
    except Exception:
        logger.warning("Could not load 'yolov8n.pt'. Using dummy YOLO stub.")
        class _DummyYOLO:
            def __call__(self, *a, **k):
                return [SimpleNamespace(boxes=[])]
            def predict(self, *a, **k):
                return None
        yolo_model = _DummyYOLO()


# Load U-Net model (graceful if weights are missing/corrupt)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
unet_model = UNet(in_channels=3, num_classes=1).to(device)
UNET_WEIGHTS = 'weights/unet.pth'
if _file_nonzero(UNET_WEIGHTS):
    try:
        unet_model.load_state_dict(torch.load(UNET_WEIGHTS, map_location=device))
    except Exception as e:
        logger.warning(f"Failed to load UNet weights from {UNET_WEIGHTS}: {e}. Using freshly initialized UNet.")
else:
    logger.warning(f"UNet weights file not found or empty at {UNET_WEIGHTS}. Using freshly initialized UNet.")
unet_model.eval()

transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor()
])

SAVE_DIR = "static/uploads"
os.makedirs(SAVE_DIR, exist_ok=True)


@router.post("/detect")
async def detect(image: UploadFile = File(...)):
    try:
        # Save input image temporarily
        img_bytes = await image.read()
        file_name = f"{uuid.uuid4().hex}.jpg"
        input_path = os.path.join(SAVE_DIR, file_name)
        with open(input_path, "wb") as f:
            f.write(img_bytes)

        pil_img = Image.open(input_path).convert("RGB")

        # Run YOLOv8
        yolo_result = yolo_model(input_path)[0]
        yolo_img_path = os.path.join(SAVE_DIR, f"yolo_{file_name}")
        yolo_result.save(save_dir=SAVE_DIR)

        # Run U-Net
        input_tensor = transform(pil_img).unsqueeze(0).to(device)
        with torch.no_grad():
            pred_mask = unet_model(input_tensor)
            pred_mask = torch.sigmoid(pred_mask)
            pred_mask = (pred_mask > 0.5).float()

        # Convert mask to image
        mask_np = pred_mask.squeeze().cpu().numpy() * 255
        mask_img = Image.fromarray(mask_np.astype(np.uint8)).convert("L")
        unet_img_path = os.path.join(SAVE_DIR, f"unet_{file_name}")
        mask_img.save(unet_img_path)

        return JSONResponse(content={
            "original": f"/{input_path}",
            "yolo_output": f"/{yolo_img_path}",
            "unet_output": f"/{unet_img_path}"
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


def check_human_submerged(yolo_boxes, unet_mask, original_shape, threshold=0.3):
    """
    Check if detected humans are submerged in water.
    
    Args:
        yolo_boxes: YOLO detection results with bounding boxes
        unet_mask: Binary mask from U-Net (1 = water, 0 = land)
        original_shape: Original image shape (height, width)
        threshold: Minimum overlap ratio to consider human as submerged
    
    Returns:
        List of dicts with detection info and submerged status
    """
    detections = []
    mask_h, mask_w = unet_mask.shape
    
    for box in yolo_boxes:
        # Get bounding box coordinates (xyxy format)
        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
        conf = float(box.conf[0].cpu().numpy())
        cls = int(box.cls[0].cpu().numpy())
        
        # Check if it's a person (class 0 in COCO dataset)
        # Adjust class ID based on your YOLO model
        is_person = cls == 0  # COCO person class
        
        if is_person and conf > 0.5:  # Only consider confident detections
            # Scale coordinates to mask size
            orig_h, orig_w = original_shape[:2]
            x1_scaled = int((x1 / orig_w) * mask_w)
            y1_scaled = int((y1 / orig_h) * mask_h)
            x2_scaled = int((x2 / orig_w) * mask_w)
            y2_scaled = int((y2 / orig_h) * mask_h)
            
            # Ensure coordinates are within bounds
            x1_scaled = max(0, min(x1_scaled, mask_w - 1))
            y1_scaled = max(0, min(y1_scaled, mask_h - 1))
            x2_scaled = max(0, min(x2_scaled, mask_w - 1))
            y2_scaled = max(0, min(y2_scaled, mask_h - 1))
            
            # Extract mask region for this bounding box
            box_mask = unet_mask[y1_scaled:y2_scaled, x1_scaled:x2_scaled]
            
            if box_mask.size > 0:
                # Calculate water pixel ratio in bounding box
                water_ratio = float(np.sum(box_mask > 0.5) / box_mask.size)
                is_submerged = bool(water_ratio >= threshold)
            else:
                water_ratio = 0.0
                is_submerged = False
            
            detections.append({
                "bbox": [float(x1), float(y1), float(x2), float(y2)],
                "confidence": float(conf),
                "water_ratio": float(water_ratio),
                "is_submerged": bool(is_submerged)
            })
    
    return detections


@router.post("/detect-video")
async def detect_video(video: UploadFile = File(...)):
    """
    Process video: extract frames at 10-second intervals,
    run YOLO and U-Net on each frame, and determine if humans are submerged.
    """
    try:
        # Save uploaded video
        video_bytes = await video.read()
        video_id = uuid.uuid4().hex
        video_ext = os.path.splitext(video.filename)[1] or ".mp4"
        video_path = os.path.join(SAVE_DIR, f"video_{video_id}{video_ext}")
        
        with open(video_path, "wb") as f:
            f.write(video_bytes)
        
        # Open video with OpenCV
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return JSONResponse(status_code=400, content={"error": "Could not open video file"})
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        
        # Extract frames at 10-second intervals
        frame_results = []
        frame_interval = int(fps * 10) if fps > 0 else 300  # 10 seconds
        
        frame_number = 0
        timestamp = 0.0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process frame if it's at a 10-second interval
            if frame_number % frame_interval == 0 or frame_number == 0:
                timestamp = frame_number / fps if fps > 0 else frame_number * 0.033
                
                # Save frame temporarily
                frame_filename = f"frame_{video_id}_{int(timestamp)}.jpg"
                frame_path = os.path.join(SAVE_DIR, frame_filename)
                cv2.imwrite(frame_path, frame)
                
                # Convert to PIL Image for processing
                pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                original_shape = frame.shape
                
                # Run YOLOv8
                yolo_result = yolo_model(frame_path)[0]
                
                # Save YOLO annotated frame
                yolo_frame_filename = f"yolo_{frame_filename}"
                yolo_frame_path = os.path.join(SAVE_DIR, yolo_frame_filename)
                # Get annotated image from YOLO result
                annotated_img = yolo_result.plot()
                cv2.imwrite(yolo_frame_path, annotated_img)
                
                # Run U-Net
                input_tensor = transform(pil_img).unsqueeze(0).to(device)
                with torch.no_grad():
                    pred_mask = unet_model(input_tensor)
                    pred_mask = torch.sigmoid(pred_mask)
                    pred_mask_np = pred_mask.squeeze().cpu().numpy()
                
                # Resize mask to original frame size
                mask_resized = cv2.resize(pred_mask_np, (original_shape[1], original_shape[0]))
                binary_mask_for_save = (mask_resized > 0.5).astype(np.uint8) * 255
                binary_mask_for_check = (mask_resized > 0.5).astype(np.uint8)  # 0/1 format for checking
                
                # Save U-Net mask
                unet_frame_filename = f"unet_{frame_filename}"
                unet_frame_path = os.path.join(SAVE_DIR, unet_frame_filename)
                cv2.imwrite(unet_frame_path, binary_mask_for_save)
                
                # Check if humans are submerged
                detections = check_human_submerged(
                    yolo_result.boxes,
                    binary_mask_for_check,
                    original_shape
                )
                
                # Determine status and message
                human_count = len(detections)
                submerged_count = sum(1 for d in detections if d["is_submerged"])
                
                if human_count == 0:
                    status = "safe"
                    message = "No humans detected"
                    alert_level = "none"
                elif submerged_count > 0:
                    status = "critical"
                    message = f"⚠️ RESCUE NEEDED: {submerged_count} human(s) detected in water!"
                    alert_level = "critical"
                else:
                    status = "warning"
                    message = f"Human detected ({human_count}) - Monitoring"
                    alert_level = "warning"
                
                frame_results.append({
                    "timestamp": float(round(timestamp, 2)),
                    "frame_number": int(frame_number),
                    "original_frame": f"/static/uploads/{frame_filename}",
                    "yolo_output": f"/static/uploads/{yolo_frame_filename}",
                    "unet_output": f"/static/uploads/{unet_frame_filename}",
                    "detections": detections,
                    "human_count": int(human_count),
                    "submerged_count": int(submerged_count),
                    "status": str(status),
                    "message": str(message),
                    "alert_level": str(alert_level)
                })
            
            frame_number += 1
        
        cap.release()
        
        # Clean up video file (optional - you might want to keep it)
        # os.remove(video_path)
        
        # Determine overall video status
        total_humans = sum(fr["human_count"] for fr in frame_results)
        total_submerged = sum(fr["submerged_count"] for fr in frame_results)
        
        overall_status = "critical" if total_submerged > 0 else ("warning" if total_humans > 0 else "safe")
        overall_message = (
            f"⚠️ RESCUE ALERT: {total_submerged} submerged individual(s) detected!" 
            if total_submerged > 0 
            else f"Analysis complete: {total_humans} human(s) detected across {len(frame_results)} frames"
        )
        
        return JSONResponse(content={
            "video_id": str(video_id),
            "video_duration": float(round(duration, 2)),
            "total_frames_processed": int(len(frame_results)),
            "overall_status": str(overall_status),
            "overall_message": str(overall_message),
            "total_humans_detected": int(total_humans),
            "total_submerged": int(total_submerged),
            "frames": frame_results
        })
    
    except Exception as e:
        logger.error(f"Error processing video: {str(e)}", exc_info=True)
        return JSONResponse(status_code=500, content={"error": str(e)})
