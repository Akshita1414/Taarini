import cv2

def check_corresponding_pixels(image1_path, image2_path, bbox, save_image=False, save_path="highlighted_result.jpg"):
    """
    Checks whether at least 2 corners of the bounding box have white (high) values in the segmentation mask.

    Args:
        image1_path (str): Path to the original RGB image.
        image2_path (str): Path to the predicted segmentation mask (grayscale or 3-channel).
        bbox (Tensor): YOLO bbox in format [x_center, y_center, width, height] as a torch.Tensor.
        save_image (bool): Whether to save the result with rectangle.
        save_path (str): Path to save the result image.

    Returns:
        int: Number of corners with white/high-intensity pixels.
    """

    image1 = cv2.imread(image1_path)
    image2 = cv2.imread(image2_path)

    if image1 is None or image2 is None:
        print("❌ Error: One or both images couldn't be loaded.")
        return 0

    # Unpack bbox from tensor to list
    x_center, y_center, width, height = bbox[0].tolist()

    # Convert to top-left and bottom-right
    x_min = int(max(0, x_center - width / 2))
    y_min = int(max(0, y_center - height / 2))
    x_max = int(min(image1.shape[1] - 1, x_center + width / 2))
    y_max = int(min(image1.shape[0] - 1, y_center + height / 2))

    # Define corners
    corners = [
        (x_min, y_min),  # top-left
        (x_max, y_min),  # top-right
        (x_max, y_max),  # bottom-right
        (x_min, y_max),  # bottom-left
    ]

    num_high_value_corners = 0

    for x, y in corners:
        if 0 <= x < image2.shape[1] and 0 <= y < image2.shape[0]:
            pixel = image2[y, x]  # OpenCV uses (y, x)
            if isinstance(pixel, (list, tuple)) or len(pixel.shape) == 1:
                # 3-channel image
                if all(p > 200 for p in pixel[:3]):
                    num_high_value_corners += 1
            else:
                # Single-channel image
                if pixel > 200:
                    num_high_value_corners += 1

    # Optionally draw rectangle
    if save_image:
        result_image = image1.copy()
        color = (0, 255, 0) if num_high_value_corners >= 2 else (0, 0, 255)
        cv2.rectangle(result_image, (x_min, y_min), (x_max, y_max), color, 2)
        cv2.imwrite(save_path, result_image)
        print(f"✅ Saved annotated image to {save_path}")

    return num_high_value_corners
