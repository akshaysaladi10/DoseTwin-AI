import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "DoseTwin AI"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database configuration (PostgreSQL or SQLite fallback for standalone run)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{BASE_DIR / 'dosetwin.db'}"
    )
    
    # Model storage path
    MODEL_PATH: str = str(MODELS_DIR / "drug_response_rf.joblib")
    PREPROCESSOR_PATH: str = str(MODELS_DIR / "preprocessor.joblib")
    
    # CORS Configuration
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Data paths
    PATIENTS_DATA_PATH: str = str(DATA_DIR / "synthetic_patients.json")
    MEDICATIONS_DATA_PATH: str = str(DATA_DIR / "synthetic_medications.json")
    INTERACTIONS_DATA_PATH: str = str(DATA_DIR / "interaction_data.json")

settings = Settings()
