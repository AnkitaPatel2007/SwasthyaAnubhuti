package com.aurahealth.app.data

data class VitalsState(
    val bloodPressureSystolic: Int = 118,
    val bloodPressureDiastolic: Int = 76,
    val restingHeartRate: Int = 71,
    val weightKg: Float = 62.1f,
    val energyLevel: Int = 4, // 1 to 5
    val stressLevel: Int = 2,
    val waterGlasses: Int = 7,
    val targetWaterGlasses: Int = 10,
    val sleepHours: Float = 7.8f,
    val bodyBatteryPercent: Int = 85
)

data class BiomarkerPoint(
    val day: String,
    val value: Float
)

data class TrendAlert(
    val id: String,
    val biomarker: String, // "sleep", "water", "energy"
    val title: String,
    val summary: String,
    val severity: String, // "critical", "warning"
    val deltaText: String,
    val impactExplanation: String,
    val dataPoints: List<BiomarkerPoint>,
    val tips: List<ActionTip>
)

data class ActionTip(
    val title: String,
    val description: String,
    val actionLabel: String? = null,
    val actionType: String? = null // "add_water", "set_reminder", "ask_ai"
)

data class LabReportItem(
    val id: String,
    val testName: String,
    val value: String,
    val unit: String,
    val status: String, // "normal", "flagged_low", "flagged_high"
    val referenceRange: String,
    val plainMeaning: String
)

data class ChatMessage(
    val id: String,
    val sender: String, // "user", "assistant"
    val text: String,
    val timestamp: Long = System.currentTimeMillis()
)
