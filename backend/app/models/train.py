import os
import pandas as pd
from sklearn.ensemble import IsolationForest
import pickle
from app.utils.preprocess import preprocess_data


BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


data_path = os.path.join(BASE_DIR, "..", "dataset", "transactions.csv")

if not os.path.exists(data_path):
    raise FileNotFoundError(f"Dataset not found: {data_path}")


df = pd.read_csv(data_path)


df = preprocess_data(df)


if "description" in df.columns:
    df = df.drop(columns=["description"])


model = IsolationForest(contamination=0.2, random_state=42)
model.fit(df)


model_path = os.path.join(os.path.dirname(__file__), "model.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained successfully!")
print(f"📁 Saved at: {model_path}")