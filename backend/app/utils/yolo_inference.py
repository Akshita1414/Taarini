from ultralytics import YOLO
import torch
import os

def run_yolo_inference(image_path: str, model_path: str = "weights/yolov8/best.pt"):
    """
    Runs YOLOv8 inference on a given image and returns bounding boxes.

    Args:
        image_path (str): Path to the input image.
        model_path (str): Path to the YOLOv8 model weights.

    Returns:
        list: A list of bounding boxes in xywh format (center x, center y, width, height).
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"❌ Image path not found: {image_path}")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"❌ Model path not found: {model_path}")

    # Load model
    model = YOLO(model_path)

    # Run inference
    results = model(image_path)

    # Extract bounding boxes (xywh format)
    boxes = []
    for box in results[0].boxes:
        boxes.append(box.xywh.cpu())

    return boxes
