def calculate_risk(row):
    score = 0

    if row["amount"] > 5000:
        score += 40

    if row["anomaly"] == 1:
        score += 50

    if "urgent" in str(row.get("description", "")).lower():
        score += 20

    return min(score, 100)
