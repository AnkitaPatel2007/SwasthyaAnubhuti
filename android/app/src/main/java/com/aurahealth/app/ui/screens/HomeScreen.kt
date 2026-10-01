package com.aurahealth.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aurahealth.app.data.TrendAlert
import com.aurahealth.app.data.VitalsState
import com.aurahealth.app.viewmodel.HealthViewModel

@Composable
fun HomeScreen(viewModel: HealthViewModel) {
    val vitals by viewModel.vitals.collectAsState()
    val alerts by viewModel.alerts.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "AuraHealth",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F766E)
                )
                Text(
                    text = "Today's Health & Vitals",
                    fontSize = 13.sp,
                    color = Color.Gray
                )
            }
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color(0xFFE6FFFA),
                modifier = Modifier.padding(4.dp)
            ) {
                Text(
                    text = "Live Active",
                    color = Color(0xFF0D9488),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                )
            }
        }

        // Body Battery Card
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "BODY BATTERY",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0F766E)
                        )
                        Text(
                            text = "${vitals.bodyBatteryPercent}% Charged",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color(0xFF0F172A)
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.BatteryChargingFull,
                        contentDescription = "Battery",
                        tint = Color(0xFF10B981),
                        modifier = Modifier.size(32.dp)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))
                LinearProgressIndicator(
                    progress = vitals.bodyBatteryPercent / 100f,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp),
                    color = Color(0xFF10B981),
                    trackColor = Color(0xFFE2E8F0)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "High Stamina: 7.8 hours rest last night. Body is well recovered.",
                    fontSize = 12.sp,
                    color = Color(0xFF475569)
                )
            }
        }

        // 7-Day Trend Alerts Banner
        if (alerts.isNotEmpty()) {
            Text(
                text = "Health Alerts (${alerts.size})",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF0F172A)
            )

            alerts.forEach { alert ->
                TrendAlertCard(
                    alert = alert,
                    onAddWater = { viewModel.addWaterGlass() },
                    onDismiss = { viewModel.dismissAlert(alert.id) }
                )
            }
        }

        // Vitals Grid (Blood Pressure, Heart Rate, Water, Sleep)
        Text(
            text = "Daily Vitals",
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF0F172A)
        )

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            VitalTile(
                modifier = Modifier.weight(1f),
                title = "Blood Pressure",
                value = "${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}",
                unit = "mmHg",
                icon = Icons.Default.Favorite,
                tint = Color(0xFFE11D48)
            )
            VitalTile(
                modifier = Modifier.weight(1f),
                title = "Resting Pulse",
                value = "${vitals.restingHeartRate}",
                unit = "bpm",
                icon = Icons.Default.FavoriteBorder,
                tint = Color(0xFF0284C7)
            )
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            VitalTile(
                modifier = Modifier.weight(1f),
                title = "Hydration",
                value = "${vitals.waterGlasses}",
                unit = "/ ${vitals.targetWaterGlasses} glasses",
                icon = Icons.Default.WaterDrop,
                tint = Color(0xFF0EA5E9),
                actionLabel = "+ 1 Glass",
                onAction = { viewModel.addWaterGlass() }
            )
            VitalTile(
                modifier = Modifier.weight(1f),
                title = "Sleep",
                value = "${vitals.sleepHours}",
                unit = "hours",
                icon = Icons.Default.Bedtime,
                tint = Color(0xFF6366F1)
            )
        }
    }
}

@Composable
fun TrendAlertCard(
    alert: TrendAlert,
    onAddWater: () -> Unit,
    onDismiss: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (alert.severity == "critical") Color(0xFFFFF1F2) else Color(0xFFFFFBEB)
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = "Alert",
                        tint = if (alert.severity == "critical") Color(0xFFE11D48) else Color(0xFFD97706),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = alert.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF0F172A)
                    )
                }
                Text(
                    text = alert.deltaText,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFE11D48)
                )
            }

            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = alert.summary,
                fontSize = 12.sp,
                color = Color(0xFF475569)
            )

            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Why it matters: ${alert.impactExplanation}",
                fontSize = 11.sp,
                color = Color(0xFF334155),
                lineHeight = 14.sp
            )

            if (alert.biomarker == "water") {
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = onAddWater,
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0F766E)),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text("+ Drink 1 Glass Now", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun VitalTile(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    unit: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    tint: Color,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = title, fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
                Icon(imageVector = icon, contentDescription = title, tint = tint, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.Bottom) {
                Text(text = value, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF0F172A))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = unit, fontSize = 11.sp, color = Color.Gray, modifier = Modifier.padding(bottom = 2.dp))
            }

            if (actionLabel != null && onAction != null) {
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = onAction,
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(text = actionLabel, fontSize = 11.sp, color = Color(0xFF0F766E))
                }
            }
        }
    }
}
