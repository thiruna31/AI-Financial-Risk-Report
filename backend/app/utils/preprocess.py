import pandas as pd

def preprocess_data(df):
    try:
        df = df.copy()

        
        if df.empty:
            return pd.DataFrame()

       
        categorical_cols = ["transaction_type", "vendor"]

        for col in categorical_cols:
            if col in df.columns:
                df[col] = df[col].astype("category").cat.codes

        text_cols = ["description"]

        for col in text_cols:
            if col in df.columns:
                df.drop(columns=[col], inplace=True)

        df = df.select_dtypes(include=["number"])

        
        df.fillna(0, inplace=True)

       
        if df.shape[1] == 0:
            return pd.DataFrame()

        return df

    except Exception:
     
        return pd.DataFrame()