import os
import json
from pathlib import Path
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.utils import to_categorical

from app.config import settings
from app.ml.data_pipeline import prepare_dataset

def train_drug_response_model():
    """Trains and serializes the personalized drug response TensorFlow model."""
    print("=== DoseTwin AI: Training TensorFlow Personalized Drug Response Model ===")
    
    # 1. Generate/Load structured academic dataset
    dataset_path = prepare_dataset(n_samples=4000)
    df = pd.read_csv(dataset_path)
    print(f"Loaded {len(df)} synthetic patient response records.")

    # Drop target
    X = df.drop(columns=["response_category"])
    y = df["response_category"]

    categorical_features = ["gender", "condition", "drug", "dosage"]
    numeric_features = [
        "age", "systolic_bp", "diastolic_bp", 
        "heart_rate", "blood_glucose", "creatinine", "alt_liver"
    ]

    # 2. Preprocessing pipeline for inputs
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
            ("num", StandardScaler(), numeric_features)
        ]
    )

    # Encode labels
    classes = ["Poor", "Moderate", "Favorable"]
    label_map = {c: i for i, c in enumerate(classes)}
    y_encoded = y.map(label_map).values
    y_categorical = to_categorical(y_encoded, num_classes=3)

    # 3. Train/Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_categorical, test_size=0.2, random_state=42, stratify=y_encoded
    )

    print("Fitting preprocessor...")
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    # 4. Build TensorFlow/Keras Neural Network
    model = Sequential([
        Dense(64, activation='relu', input_shape=(X_train_processed.shape[1],)),
        Dropout(0.3),
        Dense(32, activation='relu'),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(3, activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("Training TensorFlow model...")
    history = model.fit(
        X_train_processed, y_train,
        validation_split=0.2,
        epochs=30,
        batch_size=32,
        verbose=1
    )

    # 5. Evaluation
    loss, acc = model.evaluate(X_test_processed, y_test, verbose=0)
    print(f"Test Accuracy: {acc * 100:.2f}%")

    y_pred_probs = model.predict(X_test_processed)
    y_pred_classes = np.argmax(y_pred_probs, axis=1)
    y_true_classes = np.argmax(y_test, axis=1)

    print("\nClassification Report:")
    report = classification_report(y_true_classes, y_pred_classes, target_names=classes)
    print(report)
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_true_classes, y_pred_classes))

    # 6. Ensure model destination directory exists
    model_path = Path(settings.MODEL_PATH).parent / "drug_response_tf.keras"
    preprocessor_path = Path(settings.MODEL_PATH).parent / "tf_preprocessor.joblib"
    model_path.parent.mkdir(parents=True, exist_ok=True)

    # 7. Save serialized model and preprocessor
    model.save(model_path)
    joblib.dump(preprocessor, preprocessor_path)
    print(f"TensorFlow Model artifact successfully saved to: {model_path}")
    print(f"Preprocessor saved to: {preprocessor_path}")

    # 8. Save model training metadata
    meta = {
        "model_type": "TensorFlow Neural Network (Sequential)",
        "accuracy": round(float(acc), 4),
        "classes": classes,
        "features": {
            "categorical": categorical_features,
            "numerical": numeric_features
        },
        "training_samples": len(df),
        "metrics": {
            "loss": round(float(loss), 4)
        },
        "disclaimer": "Academic synthetic demonstration model using TensorFlow. Not for clinical diagnostic use."
    }
    meta_path = model_path.parent / "model_metadata.json"
    with open(meta_path, "w") as f:
        json.dump(meta, f, indent=2)

    return model, preprocessor

if __name__ == "__main__":
    train_drug_response_model()
