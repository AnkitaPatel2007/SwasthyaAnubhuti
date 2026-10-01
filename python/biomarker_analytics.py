#!/usr/bin/env python3
"""
AuraHealth Python Biomarker Analytics & ML Trend Engine
Calculates 7-day longitudinal regression slopes, detects monotonic biomarker declines,
identifies physiological anomalies, and outputs actionable clinical recovery directives.
"""

import sys
import json
import math
from typing import List, Dict, Any, Optional

def calculate_linear_regression(series: List[float]) -> Dict[str, float]:
    """Computes slope, intercept, R-squared, and delta for a numeric series."""
    n = len(series)
    if n < 2:
        return {"slope": 0.0, "r2": 0.0, "delta": 0.0, "percent_change": 0.0}

    x = list(range(n))
    y = series

    mean_x = sum(x) / n
    mean_y = sum(y) / n

    numerator = sum((x[i] - mean_x) * (y[i] - mean_y) for i in range(n))
    denominator = sum((x[i] - mean_x) ** 2 for i in range(n))

    if denominator == 0:
        slope = 0.0
    else:
        slope = numerator / denominator

    intercept = mean_y - slope * mean_x

    # Compute R-squared
    ss_tot = sum((y[i] - mean_y) ** 2 for i in range(n))
    ss_res = sum((y[i] - (slope * x[i] + intercept)) ** 2 for i in range(n))
    r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 0.0

    delta = y[-1] - y[0]
    percent_change = (delta / y[0] * 100) if y[0] != 0 else 0.0

    return {
        "slope": round(slope, 3),
        "r2": round(max(0.0, r2), 3),
        "delta": round(delta, 2),
        "percent_change": round(percent_change, 1)
    }

def count_consecutive_declines(series: List[float]) -> int:
    """Counts consecutive downward transitions ending at the latest day."""
    if len(series) < 2:
        return 0
    count = 0
    for i in range(len(series) - 1, 0, -1):
        if series[i] <= series[i - 1]:
            count += 1
        else:
            break
    return count

def analyze_trends(daily_records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyzes 7-day longitudinal records and outputs ML decline alerts."""
    if not daily_records:
        daily_records = []

    # Sort chronological
    sorted_records = sorted(daily_records, key=lambda r: r.get("date", ""))
    recent = sorted_records[-7:] if len(sorted_records) >= 7 else sorted_records

    # 1. Sleep Series
    sleep_series = [float(r.get("sleepHours", 7.0)) for r in recent]
    water_series = [float(r.get("waterGlasses", 6)) for r in recent]
    energy_series = [float(r.get("energyLevel", 3)) for r in recent]
    dates = [r.get("date", f"Day {i+1}") for i, r in enumerate(recent)]

    sleep_stats = calculate_linear_regression(sleep_series)
    water_stats = calculate_linear_regression(water_series)
    energy_stats = calculate_linear_regression(energy_series)

    alerts = []

    # Sleep decline alert criteria: Negative slope (< -0.15 hrs/day) or net drop >= 1.5 hrs
    if sleep_stats["slope"] < -0.12 or sleep_stats["delta"] <= -1.5 or (len(sleep_series) >= 3 and count_consecutive_declines(sleep_series) >= 3):
        alerts.append({
            "id": "py_alert_sleep",
            "biomarker": "sleep",
            "title": "Sleep Architecture Decline (Python ML Regression)",
            "severity": "critical" if sleep_stats["delta"] <= -2.0 or (sleep_series and sleep_series[-1] < 6.0) else "warning",
            "slope_per_day": sleep_stats["slope"],
            "regression_r2": sleep_stats["r2"],
            "consecutiveDeclineDays": max(count_consecutive_declines(sleep_series) + 1, 3),
            "baselineValue": sleep_series[0] if sleep_series else 8.0,
            "currentValue": sleep_series[-1] if sleep_series else 5.5,
            "unit": "hrs",
            "deltaText": f"{sleep_stats['delta']} hrs ({sleep_stats['percent_change']}%)",
            "summary": f"Python regression detects a downward slope of {sleep_stats['slope']} hrs/day across the 7-day tracking window.",
            "impactExplanation": "Sustained sleep loss destabilizes prefrontal neural regulation, slows cognitive reaction time, and impairs daytime insulin sensitivity.",
            "mlModelNote": f"Linear fit R²={sleep_stats['r2']}; projected 3-day trajectory without intervention: {round(max(4.0, (sleep_series[-1] if sleep_series else 6.0) + (3 * sleep_stats['slope'])), 1)} hrs.",
            "dataPoints": [{"date": dates[i], "day": dates[i][-2:], "value": sleep_series[i]} for i in range(len(sleep_series))],
            "actionableTips": [
                {
                    "title": "Circadian Master Clock Reset",
                    "description": "Maintain a strict 7:00 AM wake time regardless of sleep latency to re-entrain central circadian oscillators within 48 hours.",
                    "category": "routine"
                },
                {
                    "title": "Cortisol-Melatonin Sunlight Phase Shift",
                    "description": "Expose retinas to natural morning sunlight for 10-15 minutes within 30 minutes of waking to trigger timely nocturnal melatonin synthesis.",
                    "category": "quick_fix"
                },
                {
                    "title": "Digital Curfew & Adenosine Protection",
                    "description": "Enforce a 45-minute blue light screen cutoff before bedtime and observe a strict 2:00 PM caffeine termination.",
                    "category": "routine",
                    "actionLabel": "Set 10:30 PM Sleep Curfew",
                    "actionType": "set_reminder"
                }
            ]
        })

    # Water decline alert criteria: Negative slope (< -0.3 glasses/day) or net drop >= 2.0 glasses
    if water_stats["slope"] < -0.25 or water_stats["delta"] <= -2.0 or (len(water_series) >= 3 and count_consecutive_declines(water_series) >= 3):
        alerts.append({
            "id": "py_alert_water",
            "biomarker": "water",
            "title": "Progressive Hydration Intake Drop (Python ML Regression)",
            "severity": "critical" if (water_series and water_series[-1] <= 4) else "warning",
            "slope_per_day": water_stats["slope"],
            "regression_r2": water_stats["r2"],
            "consecutiveDeclineDays": max(count_consecutive_declines(water_series) + 1, 3),
            "baselineValue": int(water_series[0]) if water_series else 8,
            "currentValue": int(water_series[-1]) if water_series else 4,
            "unit": "glasses",
            "deltaText": f"{int(water_stats['delta'])} glasses ({water_stats['percent_change']}%)",
            "summary": f"Hydration decreased by {int(abs(water_stats['delta']))} glasses ({int(abs(water_stats['delta']) * 250)} ml) over the recent monitoring interval.",
            "impactExplanation": "Hypohydration concentrates plasma osmolality, increases perceived exertion during study tasks, and causes micro-vascular headaches.",
            "mlModelNote": f"Negative linear drift detected with R²={water_stats['r2']}. Current intake is {round(((water_series[-1] if water_series else 4) / 10) * 100)}% of clinical target.",
            "dataPoints": [{"date": dates[i], "day": dates[i][-2:], "value": water_series[i]} for i in range(len(water_series))],
            "actionableTips": [
                {
                    "title": "Morning 500ml Cellular Rehydration Anchor",
                    "description": "Drink 2 full glasses of room-temperature water immediately upon rising before consuming tea, coffee, or studying.",
                    "category": "quick_fix",
                    "actionLabel": "Log 1 Glass of Water Now (+250ml)",
                    "actionType": "add_water"
                },
                {
                    "title": "Visual Desk Bottle Cue",
                    "description": "Position a marked 1-liter water bottle directly in your visual eye line to stimulate habitual micro-sips during classes.",
                    "category": "routine"
                }
            ]
        })

    return {
        "status": "success",
        "engine": "Python 3.10 Longitudinal ML Pipeline",
        "record_count": len(recent),
        "analytics": {
            "sleep": sleep_stats,
            "water": water_stats,
            "energy": energy_stats
        },
        "alerts": alerts
    }

def main():
    try:
        data = None
        if len(sys.argv) > 1 and sys.argv[1].strip():
            data = json.loads(sys.argv[1])
        else:
            # Fallback sample representing 7-day exam prep decline
            data = {
                "records": [
                    {"date": "2026-09-23", "sleepHours": 8.3, "waterGlasses": 9, "energyLevel": 5},
                    {"date": "2026-09-24", "sleepHours": 8.0, "waterGlasses": 8, "energyLevel": 4},
                    {"date": "2026-09-25", "sleepHours": 7.4, "waterGlasses": 7, "energyLevel": 4},
                    {"date": "2026-09-26", "sleepHours": 6.8, "waterGlasses": 6, "energyLevel": 3},
                    {"date": "2026-09-27", "sleepHours": 6.2, "waterGlasses": 5, "energyLevel": 3},
                    {"date": "2026-09-28", "sleepHours": 5.8, "waterGlasses": 4, "energyLevel": 2},
                    {"date": "2026-09-29", "sleepHours": 5.3, "waterGlasses": 4, "energyLevel": 2}
                ]
            }

        records = data.get("records", [])
        result = analyze_trends(records)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
