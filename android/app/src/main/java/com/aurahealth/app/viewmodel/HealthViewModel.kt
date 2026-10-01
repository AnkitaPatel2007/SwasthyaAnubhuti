package com.aurahealth.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aurahealth.app.data.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class HealthViewModel : ViewModel() {

    private val _vitals = MutableStateFlow(VitalsState())
    val vitals: StateFlow<VitalsState> = _vitals.asStateFlow()

    private val _alerts = MutableStateFlow<List<TrendAlert>>(emptyList())
    val alerts: StateFlow<List<TrendAlert>> = _alerts.asStateFlow()

    private val _reports = MutableStateFlow<List<LabReportItem>>(emptyList())
    val reports: StateFlow<List<LabReportItem>> = _reports.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(emptyList())
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    init {
        loadInitialData()
    }

    private fun loadInitialData() {
        _alerts.value = listOf(
            TrendAlert(
                id = "alert_sleep",
                biomarker = "sleep",
                title = "Sleep is dropping",
                summary = "Sleep dropped from 8.2h down to 5.3h this week.",
                severity = "critical",
                deltaText = "-2.9 hrs",
                impactExplanation = "Less sleep leads to brain fog, low focus, and fatigue.",
                dataPoints = listOf(
                    BiomarkerPoint("Wed", 8.2f),
                    BiomarkerPoint("Thu", 7.9f),
                    BiomarkerPoint("Fri", 7.4f),
                    BiomarkerPoint("Sat", 6.8f),
                    BiomarkerPoint("Sun", 6.2f),
                    BiomarkerPoint("Mon", 5.8f),
                    BiomarkerPoint("Tue", 5.3f)
                ),
                tips = listOf(
                    ActionTip("Wake up at the same time", "Resets your body clock within 2 days.", null, null),
                    ActionTip("Put away screens 45 mins before bed", "Turn off phone screen to help brain rest.", "Set 10:30 PM Reminder", "set_reminder")
                )
            ),
            TrendAlert(
                id = "alert_water",
                biomarker = "water",
                title = "Water intake is dropping",
                summary = "Water dropped from 9 glasses down to 4 glasses today.",
                severity = "warning",
                deltaText = "-5 glasses",
                impactExplanation = "Low water intake causes headaches, tiredness, and dry eyes.",
                dataPoints = listOf(
                    BiomarkerPoint("Wed", 9f),
                    BiomarkerPoint("Thu", 8f),
                    BiomarkerPoint("Fri", 7f),
                    BiomarkerPoint("Sat", 6f),
                    BiomarkerPoint("Sun", 5f),
                    BiomarkerPoint("Mon", 4f),
                    BiomarkerPoint("Tue", 4f)
                ),
                tips = listOf(
                    ActionTip("Drink 2 glasses upon waking", "Drink water before morning tea or coffee.", "Drink 1 Glass (+250ml)", "add_water"),
                    ActionTip("Keep water bottle on desk", "Visual reminder keeps you hydrated while studying.", null, null)
                )
            )
        )

        _reports.value = listOf(
            LabReportItem("1", "Serum Ferritin", "14.2", "ng/mL", "flagged_low", "15 - 150", "Low iron stores. Explains study exhaustion and afternoon sluggishness."),
            LabReportItem("2", "Hemoglobin (Hb)", "12.8", "g/dL", "normal", "12.0 - 16.0", "Normal range. Oxygen carriage to brain is healthy."),
            LabReportItem("3", "25-OH Vitamin D", "18.5", "ng/mL", "flagged_low", "30 - 100", "Sunlight insufficiency. Common in students studying indoors.")
        )

        _chatMessages.value = listOf(
            ChatMessage("m1", "assistant", "Namaste Alex! I am ArogyaSaathi, your personal health companion. I monitor your daily vitals, lab reports, and sleep trends. How are you feeling today?")
        )
    }

    fun addWaterGlass() {
        _vitals.update { it.copy(waterGlasses = it.waterGlasses + 1) }
    }

    fun dismissAlert(id: String) {
        _alerts.update { list -> list.filterNot { it.id == id } }
    }

    fun sendMessage(userText: String) {
        val userMsg = ChatMessage(System.currentTimeMillis().toString(), "user", userText)
        _chatMessages.update { it + userMsg }

        viewModelScope.launch {
            // Emulate AI companion response with empathetic clinical reasoning
            val replyText = when {
                userText.contains("sleep", ignoreCase = true) -> 
                    "Your sleep has dropped to 5.3 hours over the past 4 days. Try waking up at exactly 7:00 AM tomorrow and get 10 minutes of direct morning sunlight to restart your natural melatonin cycle."
                userText.contains("water", ignoreCase = true) -> 
                    "You've logged 4 glasses today. Keep a 1-liter bottle at eye level on your study desk. Would you like me to log another glass now?"
                else -> 
                    "I noticed your stress rating is elevated. Focus on a 10-minute fresh air walk and hydrating with 500ml water before resuming your studies."
            }
            val botMsg = ChatMessage((System.currentTimeMillis() + 1).toString(), "assistant", replyText)
            _chatMessages.update { it + botMsg }
        }
    }
}
