from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional
from google.cloud import vision
import logging

router = APIRouter()

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

client = vision.ImageAnnotatorClient()

class ClassifyResponse(BaseModel):
    """画像分類APIのレスポンスモデル"""
    predictions: Dict[str, float]
    best_match_label: Optional[str]
    trash_category: Optional[str]

@router.post("/api/classify", response_model=ClassifyResponse)
async def classify_image(image_file: UploadFile = File(...)):
    """画像をアップロードして分類し、ゴミの分類を検索します."""
    try:
        content = await image_file.read()
        image = vision.Image(content=content)
        response = client.annotate_image({"image": image, "features": [{"type": vision.Feature.Type.LABEL_DETECTION}]})
        labels = response.label_annotations
        predictions = {}
        for label in labels:
            predictions[label.description] = label.score
        best_match_label = max(predictions, key=predictions.get) if predictions else None

        logger.info(f"Vision API Best Match: {best_match_label}")

        trash_category = None
        if best_match_label:
            classification_map = {
                "Plastic": "Plastic",
                "Bottle": "Bottles",
                "Can": "Cans",
                "Paper": "Combustible",
                "Cardboard": "recyclable",
                "Food waste": "Combustible",
                "Garbage": "Combustible",
                "Glass": "Non-Combustible",
                "Metal": "Non-Combustible",
                "Battery": "hazardous",
                "Light bulb": "hazardous",
                "Tissue paper": "Combustible",
            }
            trash_category = classification_map.get(best_match_label, "unknown")
            logger.info(f"対応するゴミの分類: {trash_category}")

        # Vision API の結果から classification_map に一致するものを抽出
        matched_predictions = {k: v for k, v in predictions.items() if k in classification_map}

        return {"predictions": matched_predictions, "best_match_label": best_match_label, "trash_category": trash_category}

    except Exception as e:
        logger.error(f"画像処理エラー: {e}")
        raise HTTPException(status_code=500, detail=f"画像処理エラー: {e}")