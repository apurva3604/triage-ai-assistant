import requests
import json

API_KEY = "FPW4kRH1q41RJgsqq5p1jaROikkxM4kXaPnEREK9"

URL = "https://api.scaledown.xyz/compress/raw/"


def generate_triage(context):

    # 🔴 Handle empty context safely
    if not context or len(context) == 0:
        return {
            "triage_level": "STABLE",
            "category": "GENERAL",
            "actions": [
                "Monitor patient",
                "Collect more information"
            ],
            "reason": "No significant clinical signals detected",
            "confidence": "Low"
        }

    text = " ".join(context).lower()

    # 🔹 CATEGORY SCORES
    scores = {
        "cardiac": 0,
        "neurological": 0,
        "respiratory": 0,
        "trauma": 0,
        "general": 0
    }

    # 🔴 CARDIAC
    if "chest pain" in text or "cardiac" in text or "heart" in text:
        scores["cardiac"] += 2
    if "low blood pressure" in text:
        scores["cardiac"] += 2

    # 🧠 NEUROLOGICAL
    if "stroke" in text or "weakness" in text or "slurred" in text:
        scores["neurological"] += 3
    if "unconscious" in text or "not responding" in text:
        scores["neurological"] += 2

    # 🫁 RESPIRATORY
    if "breathing" in text or "shortness of breath" in text or "oxygen" in text:
        scores["respiratory"] += 3

    # 🩸 TRAUMA
    if "bleeding" in text or "blood loss" in text:
        scores["trauma"] += 3
    if "injury" in text or "fracture" in text:
        scores["trauma"] += 2

    # ⚠️ CRITICAL FLAGS (cross-category severity)
    critical_flags = 0
    if "shock" in text:
        critical_flags += 2
    if "unconscious" in text:
        critical_flags += 2
    if "severe" in text:
        critical_flags += 1

    # 🔥 FIX: Avoid defaulting to cardiac
    if all(score == 0 for score in scores.values()):
        main_category = "general"
    else:
        main_category = max(scores, key=scores.get)

    total_score = scores[main_category] + critical_flags

    # 🔴 TRIAGE DECISION
    if total_score >= 5:
        triage = "CRITICAL"
    elif total_score >= 3:
        triage = "URGENT"
    else:
        triage = "STABLE"

    # 🔹 ACTIONS BASED ON CATEGORY
    if main_category == "cardiac":
        actions = [
            "Administer aspirin",
            "Start IV fluids",
            "Call cardiology team"
        ]

    elif main_category == "neurological":
        actions = [
            "Check neurological status",
            "Perform stroke assessment",
            "Urgent imaging required"
        ]

    elif main_category == "respiratory":
        actions = [
            "Provide oxygen support",
            "Monitor breathing",
            "Prepare airway management"
        ]

    elif main_category == "trauma":
        actions = [
            "Control bleeding",
            "Immobilize injury",
            "Prepare for emergency care"
        ]

    else:
        actions = [
            "Monitor patient",
            "Further evaluation required"
        ]

    # 🔹 CLEAN REASON
    reason = f"Detected category: {main_category}. Signals: {', '.join(context)}"

    return {
        "triage_level": triage,
        "category": main_category.upper(),
        "actions": actions,
        "reason": reason,
        "confidence": "High" if main_category != "general" else "Medium"
    }