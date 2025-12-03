from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

try:
	# relative import of router defined in routes/detection.py
	from .routes.detection import router as detection_router
except Exception:
	# fallback for different import contexts
	from app.routes.detection import router as detection_router

app = FastAPI(title="Taarini API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection_router, prefix="/api")

# Serve uploaded/static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
	return {"status": "ok", "message": "Taarini backend is running"}

