import pandas as pd
import pickle
import os
from app.utils.preprocess import preprocess_data
from app.services.risk_engine import calculate_risk

# -------------------------------
# Load model safely
# -------------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


# -------------------------------
# Main prediction function
# -------------------------------
async def detect_anomalies(file):
    try:
        # -------------------------------
        # Validate file
        # -------------------------------
        if not file or not file.filename.endswith(".csv"):
            return {"error": "Please upload a valid CSV file"}

        # -------------------------------
        # Read CSV safely
        # -------------------------------
        df = pd.read_csv(file.file)

        if df.empty:
            return {"error": "Uploaded file is empty"}

       
        if len(df) > 10000:
            df = df.sample(10000, random_state=42)

       
        original_df = df.copy()

        
        processed = preprocess_data(df)

        if processed.empty:
            return {"error": "Data is not valid for prediction"}

        
        preds = model.predict(processed)

    
        original_df["anomaly"] = [1 if p == -1 else 0 for p in preds]

        # -------------------------------
        # Clean status (NO EMOJI ❗)
        # -------------------------------
        original_df["status"] = original_df["anomaly"].apply(
            lambda x: "High Risk" if x == 1 else "Safe"
        )

        # -------------------------------
        # Risk score
        # -------------------------------
        original_df["risk_score"] = original_df.apply(calculate_risk, axis=1)

        # -------------------------------
        # 🔥 LIMIT RESPONSE (VERY IMPORTANT)
        # -------------------------------
        result = original_df.head(200)

        return result.to_dict(orient="records")

    except pd.errors.EmptyDataError:
        return {"error": "CSV file is empty or invalid"}

    except Exception as e:
        return {
            "error": "Internal server error",
            "details": str(e)
        }