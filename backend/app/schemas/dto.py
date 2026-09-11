from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# --- Observation Schemas ---
class ObservationData(BaseModel):
    systolic_bp: float = Field(default=120.0, ge=60.0, le=250.0, description="Systolic Blood Pressure (mmHg)")
    diastolic_bp: float = Field(default=80.0, ge=40.0, le=150.0, description="Diastolic Blood Pressure (mmHg)")
    heart_rate: float = Field(default=72.0, ge=30.0, le=220.0, description="Heart Rate (bpm)")
    blood_glucose: float = Field(default=100.0, ge=40.0, le=500.0, description="Blood Glucose (mg/dL)")
    creatinine: float = Field(default=1.0, ge=0.2, le=15.0, description="Serum Creatinine (mg/dL)")
    alt_liver: float = Field(default=25.0, ge=5.0, le=500.0, description="Alanine Aminotransferase / ALT (U/L)")

class ObservationResponse(ObservationData):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: int
    recorded_at: datetime

# --- Medication Schemas ---
class MedicationItem(BaseModel):
    drug_name: str = Field(..., min_length=1, max_length=100, description="Name of the drug")
    dosage: str = Field(default="Standard", max_length=50, description="Dose amount e.g. 5mg, 1000mg")
    frequency: str = Field(default="Once daily", max_length=100, description="Frequency of intake")
    route: str = Field(default="Oral", max_length=50, description="Administration route")

class MedicationCreate(MedicationItem):
    patient_id: Optional[int] = None

class MedicationResponse(MedicationItem):
    model_config = ConfigDict(from_attributes=True)

    id: int
    patient_id: Optional[int] = None
    is_active: bool = True
    created_at: datetime

# --- Patient Schemas ---
class PatientBase(BaseModel):
    patient_code: str = Field(..., min_length=2, max_length=50, description="Unique code e.g. P001")
    name: str = Field(..., min_length=2, max_length=100, description="Full fictional name")
    age: int = Field(..., ge=0, le=125, description="Patient age in years")
    gender: str = Field(..., description="Biological sex / gender e.g. Male, Female, Other")
    primary_condition: str = Field(..., min_length=2, max_length=200, description="Diagnosed medical condition")

class PatientCreate(PatientBase):
    observations: Optional[ObservationData] = None
    medications: Optional[List[MedicationItem]] = []

class PatientResponse(PatientBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime

class PatientDetailResponse(PatientResponse):
    observations: Optional[ObservationData] = None
    medications: List[MedicationItem] = []

# --- Drug Interaction Schemas ---
class InteractionCheckRequest(BaseModel):
    drugs: List[str] = Field(..., min_length=2, description="List of drug names to evaluate")

class InteractionResult(BaseModel):
    drug_pair: List[str]
    severity: str  # High, Moderate, Low, None
    mechanism: Optional[str] = None
    description: str
    recommendation: str

class InteractionCheckResponse(BaseModel):
    interaction_detected: bool
    total_conflicts: int
    highest_severity: str  # None, Low, Moderate, High
    conflicts: List[InteractionResult]
    disclaimer: str

# --- ML Drug Response Prediction Schemas ---
class PredictionRequest(BaseModel):
    age: int = Field(..., ge=0, le=125)
    gender: str = Field(default="Male")
    condition: str = Field(default="General")
    drug_name: str = Field(..., description="Target drug being evaluated")
    dosage: str = Field(default="Standard")
    systolic_bp: float = Field(default=120.0)
    diastolic_bp: float = Field(default=80.0)
    heart_rate: float = Field(default=72.0)
    blood_glucose: float = Field(default=100.0)
    creatinine: float = Field(default=1.0)
    alt_liver: float = Field(default=25.0)
    previous_response: Optional[str] = Field(default="Unknown")

class ContributingFactor(BaseModel):
    factor: str
    impact: str  # Positive, Negative, Neutral
    detail: str

class PredictionResult(BaseModel):
    target_drug: str
    predicted_response: str  # Favorable, Moderate, Poor
    response_score: float = Field(..., description="Confidence / response probability (0.0 - 1.0)")
    risk_level: str  # Low, Moderate, High
    contributing_factors: List[ContributingFactor]
    model_version: str
    disclaimer: str

# --- Full /analyze Workflow Schemas ---
class DigitalTwinAnalyzeRequest(BaseModel):
    patient_id: Optional[str] = Field(default=None, description="Optional existing patient ID/code")
    name: str = Field(default="Simulated Patient")
    age: int = Field(default=55, ge=0, le=125)
    gender: str = Field(default="Female")
    primary_condition: str = Field(default="Cardiovascular")
    observations: ObservationData = Field(default_factory=ObservationData)
    medications: List[MedicationItem] = Field(default_factory=list)
    target_drug: Optional[str] = Field(default=None, description="Primary drug for response simulation")

class DigitalTwinSummary(BaseModel):
    patient_code: str
    name: str
    age: int
    gender: str
    condition: str
    vitals_summary: Dict[str, Any]
    active_regimen_count: int

class DigitalTwinAnalyzeResponse(BaseModel):
    timestamp: datetime
    digital_twin: DigitalTwinSummary
    fhir_resources: Dict[str, Any]
    medication_interactions: InteractionCheckResponse
    response_prediction: PredictionResult
    knowledge_graph_insights: Dict[str, Any]
    overall_simulation_risk: str  # Low, Moderate, High, Critical
    executive_summary: str
    disclaimer: str

# --- Knowledge Graph Schemas ---
class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # Patient, Drug, Condition, Observation
    properties: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str  # HAS_CONDITION, TAKES, HAS_OBSERVATION, INTERACTS_WITH, USED_FOR
    properties: Dict[str, Any] = {}

class KnowledgeGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    total_nodes: int
    total_edges: int
