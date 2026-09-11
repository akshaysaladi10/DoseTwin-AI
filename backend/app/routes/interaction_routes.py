from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status

from app.schemas.dto import InteractionCheckRequest, InteractionCheckResponse
from app.services.interaction_service import interaction_service

router = APIRouter(prefix="/interactions", tags=["Drug Interactions"])

@router.post("/check", response_model=InteractionCheckResponse, summary="Check drug-drug interactions for a list of drugs")
def check_interactions(req: InteractionCheckRequest):
    if len(req.drugs) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least 2 drug names are required to check for drug-drug interactions."
        )
    return interaction_service.check_drug_interactions(req.drugs)

@router.get("/rules", response_model=List[Dict[str, Any]], summary="Get all synthetic drug interaction rules")
def get_all_rules():
    return interaction_service.get_all_rules()
