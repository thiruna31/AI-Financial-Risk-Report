from fastapi import APIRouter, UploadFile, File
from app.services.anomaly_service import detect_anomalies

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    return await detect_anomalies(file)
