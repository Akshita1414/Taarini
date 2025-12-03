import os
import torch
from app.utils.unet_model import UNet

WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'weights')
WEIGHTS_DIR = os.path.abspath(WEIGHTS_DIR)
if not os.path.exists(WEIGHTS_DIR):
    os.makedirs(WEIGHTS_DIR, exist_ok=True)

UNET_PATH = os.path.join(WEIGHTS_DIR, 'unet.pth')

if os.path.exists(UNET_PATH) and os.path.getsize(UNET_PATH) > 0:
    print(f"Found existing unet weights at {UNET_PATH} (size > 0). No action taken.")
else:
    model = UNet(in_channels=3, num_classes=1)
    torch.save(model.state_dict(), UNET_PATH)
    print(f"Saved dummy UNet state_dict to {UNET_PATH}")

# Note: we do not create a fake 'best.pt' for YOLO because ultralytics prefers
# to either receive a valid file or an official model name (e.g., 'yolov8n.pt').
# If you want a placeholder file, create your own and place it at weights/best.pt
