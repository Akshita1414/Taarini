import torch
from torchvision import transforms
from PIL import Image
import numpy as np
import cv2
import os
from models.unet import UNet

def load_model(model_path, device):
    model = UNet(in_channels=3, num_classes=1).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    return model

def infer_unet(model, image_path, output_path, device):
    # Load and preprocess image
    img_pil = Image.open(image_path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((512, 512)),
        transforms.ToTensor()
    ])
    img_tensor = transform(img_pil).unsqueeze(0).to(device)

    # Predict mask
    with torch.no_grad():
        pred = model(img_tensor)
        pred = torch.sigmoid(pred)
        pred = (pred > 0.5).float()

    # Convert to NumPy image
    mask_np = pred.squeeze().cpu().numpy() * 255
    mask_img = Image.fromarray(mask_np.astype(np.uint8)).convert("L")
    
    # Save prediction
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    mask_img.save(output_path)
    print(f"Saved segmented output to {output_path}")

if __name__ == "__main__":
    IMAGE_PATH = "data/sample.jpg"  # input image
    MODEL_PATH = "weights/unet.pth" # trained weights
    OUTPUT_PATH = "output/unet_output.jpg"  # where to save output

    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    model = load_model(MODEL_PATH, DEVICE)
    infer_unet(model, IMAGE_PATH, OUTPUT_PATH, DEVICE)
