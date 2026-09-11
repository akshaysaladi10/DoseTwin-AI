from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.dto import DigitalTwinAnalyzeRequest, DigitalTwinAnalyzeResponse
from app.services.orchestrator_service import orchestrator_service

router = APIRouter(tags=["Digital Twin Simulation (/analyze)"])

@router.post("/analyze", response_model=DigitalTwinAnalyzeResponse, summary="Execute complete end-to-end Digital Twin analysis")
def analyze_digital_twin(req: DigitalTwinAnalyzeRequest, db: Session = Depends(get_db)):
    try:
        return orchestrator_service.analyze_digital_twin(db, req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation workflow execution error: {str(e)}"
        )
