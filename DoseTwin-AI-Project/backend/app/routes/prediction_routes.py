from fastapi import APIRouter, HTTPException, status

from app.schemas.dto import PredictionRequest, PredictionResult
from app.ml.predict import predict_drug_response

router = APIRouter(prefix="/prediction", tags=["ML Drug Response Prediction"])

@router.post("/predict", response_model=PredictionResult, summary="Simulate personalized drug response using ML")
def predict_response(req: PredictionRequest):
    try:
        return predict_drug_response(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction simulation error: {str(e)}"
        )
