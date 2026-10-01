#!/usr/bin/env python3
"""
AuraHealth Python Clinical Symptom Triaging & Disease Classifier
Classifies reported symptoms, evaluates red-flag urgency levels,
and maps clinical markers to known disease risk profiles.
"""

from typing import List, Dict, Any

RED_FLAG_PATTERNS = [
    "crushing chest pain", "shortness of breath at rest", "difficulty breathing",
    "face drooping", "arm weakness", "slurred speech", "sudden severe headache",
    "coughing blood", "loss of consciousness", "severe abdominal rigidity",
    "thoughts of self-harm", "anaphylaxis", "severe allergic reaction"
]

COMMON_YOUTH_CONDITIONS = {
    "iron_deficiency": {
        "title": "Iron Deficiency & Microcytic Anemia",
        "keywords": ["fatigue", "tired", "exhaustion", "pale", "brittle nails", "cold hands", "dizziness"],
        "critical_biomarkers": ["Hemoglobin (Hb)", "Serum Ferritin", "Total Iron Binding Capacity"],
        "lifestyle_triggers": ["irregular meals", "heavy menstrual cycles", "excessive tea/coffee with meals"],
        "urgency": "routine",
        "action": "Prioritize dietary heme iron (or legumes/spinach paired with Vitamin C), check recent ferritin lab stores."
    },
    "vitamin_d_deficiency": {
        "title": "Hypovitaminosis D3 (Sunlight Insufficiency)",
        "keywords": ["bone ache", "muscle weakness", "frequent colds", "low mood", "afternoon slump"],
        "critical_biomarkers": ["25-OH Vitamin D", "Serum Calcium"],
        "lifestyle_triggers": ["continuous indoor study", "sunscreen use", "winter seasons"],
        "urgency": "preventive",
        "action": "Aim for 15-20 mins mid-day sun exposure on forearms; consult doctor on weekly D3 oral protocols."
    },
    "circadian_exhaustion": {
        "title": "Circadian Rhythm Dysregulation & Sleep Debt",
        "keywords": ["brain fog", "insomnia", "delayed sleep", "eye strain", "headache", "irritability"],
        "critical_biomarkers": ["Resting Heart Rate", "Blood Pressure"],
        "lifestyle_triggers": ["screen exposure after 11 PM", "irregular bedtimes", "late evening caffeine"],
        "urgency": "preventive",
        "action": "Set strict 7:00 AM wake anchor; terminate caffeine at 2:00 PM; digital curfew 45 mins before bed."
    },
    "dehydration_headache": {
        "title": "Sub-clinical Dehydration & Tension Cephalea",
        "keywords": ["throbbing headache", "dry lips", "dark urine", "difficulty concentrating"],
        "critical_biomarkers": ["Hydration Glasses", "Blood Urea"],
        "lifestyle_triggers": ["long exam revision blocks", "high air-conditioned room exposure"],
        "urgency": "routine",
        "action": "Immediately consume 500ml water with pinch of electrolyte/lemon; aim for 2.5L daily baseline."
    }
}

def triage_symptoms(symptoms: List[str], reported_notes: str = "") -> Dict[str, Any]:
    text_corpus = (" ".join(symptoms) + " " + reported_notes).lower()

    # 1. Red Flag Evaluation
    detected_red_flags = [rf for rf in RED_FLAG_PATTERNS if rf in text_corpus]
    if detected_red_flags:
        return {
            "urgency": "emergency",
            "is_emergency": True,
            "category": "Immediate Emergency Triage",
            "detected_red_flags": detected_red_flags,
            "directive": "EMERGENCY PROTOCOL: Call national emergency line (112 / 108 / 911) or proceed immediately to nearest emergency room casualty department. Do not delay.",
            "associated_conditions": []
        }

    # 2. Condition Matching
    matched_conditions = []
    for cond_id, data in COMMON_YOUTH_CONDITIONS.items():
        score = sum(1 for kw in data["keywords"] if kw in text_corpus)
        if score > 0:
            matched_conditions.append({
                "condition_id": cond_id,
                "title": data["title"],
                "match_confidence": round(min(0.95, 0.4 + (score * 0.2)), 2),
                "critical_biomarkers": data["critical_biomarkers"],
                "lifestyle_triggers": data["lifestyle_triggers"],
                "recommended_action": data["action"],
                "urgency": data["urgency"]
            })

    matched_conditions.sort(key=lambda x: x["match_confidence"], reverse=True)

    urgency_level = "routine"
    if any(c["urgency"] == "urgent" for c in matched_conditions):
        urgency_level = "urgent"
    elif not matched_conditions:
        urgency_level = "wellness"

    return {
        "urgency": urgency_level,
        "is_emergency": False,
        "category": "Non-emergency Preventive Triage",
        "matched_count": len(matched_conditions),
        "primary_suspected_condition": matched_conditions[0]["title"] if matched_conditions else "General Fatigue / Stress",
        "matched_conditions": matched_conditions,
        "directive": "Log symptoms in your daily check-in and review biomarker trends with your physician."
    }

if __name__ == "__main__":
    test_result = triage_symptoms(["fatigue", "brain fog", "headache"], "studied all night, skipped breakfast")
    import json
    print(json.dumps(test_result, indent=2))
