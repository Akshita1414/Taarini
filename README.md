# 🛰️ Taarini – AI-Powered Drone for Drowning Detection & Rescue

**Taarini** is a full-stack AI-powered project designed to detect drowning individuals using drone footage. It combines real-time object detection (YOLOv8), semantic segmentation (U-Net), and GPS-based location tracking to support emergency rescue operations efficiently.

---

## 🚀 Features

- ⚠️ **YOLOv8**: Detects drowning individuals from drone video frames.
- 🧠 **U-Net Segmentation**: Highlights water regions and drowning body outlines.
- 📍 **GPS Mapping**: Displays the exact location of detected individuals on a live dashboard.
- 📡 **Rescue Alerts**: Sends alerts to nearby rescue teams with coordinates.

---

## 🧑‍💻 Tech Stack

| Layer         | Technologies                     |
|---------------|----------------------------------|
| AI Models     | YOLOv8, U-Net, PyTorch           |
| Backend       | FastAPI, Python, OpenCV          |
| Frontend      | React.js, Tailwind CSS           |
| Utilities     | Lucide Icons, Leaflet.js (Map)   |

---


---

## 🧪 How It Works

1. **Input**: Drone footage or single frame is uploaded.
2. **Detection**: YOLOv8 identifies a person potentially drowning.
3. **Segmentation**: U-Net highlights the segmented water area and body.
4. **Verification**: A pixel-checking function validates detection based on white region presence.
5. **Output**:
   - Detection images
   - GPS coordinates
   - Live dashboard alert

---

## 🖼️ Sample Output

- **Original Frame**
- **YOLOv8 Detection**
- **U-Net Segmentation**
- **Live GPS Map**

---

## ⚙️ Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/yourusername/taarini-detection.git
cd taarini-detection

2. Backend Setup
bash
Copy
Edit
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
3. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Ensure best.pt and unet.pth are added inside /weights.

Future Enhancements
Live drone video streaming

Real-time alert integration with IoT devices

Drone automation for rescue drop

📬 Contact
For any queries or collaborations, feel free to reach out at aakshita_be22@thapar.edu

## ⭐ Acknowledgements
Ultralytics YOLOv8

PyTorch for U-Net

React and Tailwind UI

