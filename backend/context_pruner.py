import re

def extract_key_points(query, documents):

    text = " ".join(documents).lower()
    query = query.lower()

    combined = query + " " + text

    key_points = []

    # 🔹 Core symptom detection
    if "chest pain" in combined:
        key_points.append("Chest pain detected")

    if "low blood pressure" in combined or "hypotension" in combined:
        key_points.append("Low blood pressure detected")

    # 🔹 Medical condition inference
    if "heart attack" in combined or "cardiac" in combined:
        key_points.append("Possible cardiac involvement")

    if "shock" in combined:
        key_points.append("Risk of shock")

    # 🔹 Associated symptoms
    if "dizziness" in combined or "sweating" in combined:
        key_points.append("Associated symptoms present")

    # 🔥 Critical condition logic (VERY IMPORTANT)
    if "chest pain" in combined and (
        "low blood pressure" in combined or "hypotension" in combined
    ):
        key_points.append("High risk: possible cardiac emergency")

    # fallback
    if not key_points:
        key_points.append("No critical condition detected")

    return key_points


def prune_context(query, documents):

    # 🔹 Always include query in analysis
    combined_text = query.lower() + " " + " ".join(documents).lower()

    key_points = []

    # 🫀 CARDIAC
    if "chest pain" in combined_text:
        key_points.append("Chest pain detected")

    if "low blood pressure" in combined_text or "hypotension" in combined_text:
        key_points.append("Low blood pressure detected")

    if "cardiac" in combined_text or "heart" in combined_text:
        key_points.append("Possible cardiac involvement")

    # 🧠 NEUROLOGICAL
    if "slurred speech" in combined_text:
        key_points.append("Slurred speech detected")

    if "weakness" in combined_text or "one side" in combined_text:
        key_points.append("One-sided weakness detected")

    if "unconscious" in combined_text:
        key_points.append("Loss of consciousness")

    if "stroke" in combined_text:
        key_points.append("Possible stroke")

    # 🫁 RESPIRATORY
    if "breathing" in combined_text or "shortness of breath" in combined_text:
        key_points.append("Breathing difficulty detected")

    # 🩸 TRAUMA
    if "bleeding" in combined_text:
        key_points.append("Active bleeding")

    if "injury" in combined_text:
        key_points.append("Physical injury detected")

    # ⚠️ CRITICAL
    if "shock" in combined_text:
        key_points.append("Risk of shock")

    # 🔥 fallback (IMPORTANT)
    if not key_points:
        key_points.append("General symptoms detected")

    return key_points