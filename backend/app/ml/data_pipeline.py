import os
from pathlib import Path
import pandas as pd
from app.config import settings
from app.ml.synthetic_data_generator import generate_synthetic_training_data

def prepare_dataset(n_samples=4000):
    """Generates the academic dataset and saves it to a persistent CSV for the ML pipeline."""
    print("=== DoseTwin AI: Data Pipeline ===")
    
    # 1. Path to data directory
    # Using parent of models (which is backend folder) then up to root/data
    base_path = Path(__file__).parent.parent.parent.parent
    data_dir = base_path / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    
    dataset_path = data_dir / "ml_dataset.csv"
    
    # 2. Generate and save
    print(f"Generating {n_samples} synthetic patient response records...")
    df = generate_synthetic_training_data(n_samples=n_samples, random_state=42)
    
    print(f"Saving dataset to: {dataset_path}")
    df.to_csv(dataset_path, index=False)
    
    print("Class distribution:")
    print(df["response_category"].value_counts(normalize=True))
    
    return dataset_path

if __name__ == "__main__":
    prepare_dataset()
