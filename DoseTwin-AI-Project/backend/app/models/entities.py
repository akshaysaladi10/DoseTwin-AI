from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from app.database import Base

class PatientModel(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    primary_condition = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    observations = relationship("ObservationModel", back_populates="patient", cascade="all, delete-orphan")
    medications = relationship("MedicationModel", back_populates="patient", cascade="all, delete-orphan")

class ObservationModel(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    systolic_bp = Column(Float, nullable=True, default=120.0)
    diastolic_bp = Column(Float, nullable=True, default=80.0)
    heart_rate = Column(Float, nullable=True, default=72.0)
    blood_glucose = Column(Float, nullable=True, default=100.0)
    creatinine = Column(Float, nullable=True, default=1.0)
    alt_liver = Column(Float, nullable=True, default=25.0)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("PatientModel", back_populates="observations")

class MedicationModel(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=True)
    drug_name = Column(String(100), nullable=False, index=True)
    dosage = Column(String(50), nullable=False)
    frequency = Column(String(100), nullable=False)
    route = Column(String(50), default="Oral")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("PatientModel", back_populates="medications")

class InteractionRuleModel(Base):
    __tablename__ = "interaction_rules"

    id = Column(Integer, primary_key=True, index=True)
    drug_a = Column(String(100), nullable=False, index=True)
    drug_b = Column(String(100), nullable=False, index=True)
    severity = Column(String(20), nullable=False) # High, Moderate, Low
    mechanism = Column(Text, nullable=True)
    description = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
