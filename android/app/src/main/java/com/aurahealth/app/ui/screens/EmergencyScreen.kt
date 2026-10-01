package com.aurahealth.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmergencyScreen() {
    val context = LocalContext.current

    fun dialNumber(number: String) {
        val intent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:$number")
        }
        context.startActivity(intent)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Column {
            Text(
                text = "Emergency Care",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFE11D48)
            )
            Text(
                text = "One-tap emergency dialing & nearest medical care",
                fontSize = 13.sp,
                color = Color.Gray
            )
        }

        // Quick Helplines
        EmergencyCallCard(
            title = "National Emergency Ambulance",
            number = "112",
            description = "Immediate 24/7 medical and trauma rescue",
            onDial = { dialNumber("112") }
        )

        EmergencyCallCard(
            title = "Disaster Medical Rescue",
            number = "108",
            description = "Government emergency and medical transit",
            onDial = { dialNumber("108") }
        )

        EmergencyCallCard(
            title = "Youth Mental Crisis & Suicide Line",
            number = "988",
            description = "Confidential, 24/7 mental wellness support",
            onDial = { dialNumber("988") }
        )

        Spacer(modifier = Modifier.height(8.dp))

        // Hospital Finder
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocalHospital, contentDescription = null, tint = Color(0xFF0F766E))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Nearest Emergency Facilities",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = Color(0xFF0F172A)
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "AI-grounded hospital search locates open 24-hour trauma wards within 5km radius.",
                    fontSize = 12.sp,
                    color = Color(0xFF475569)
                )
            }
        }
    }
}

@Composable
fun EmergencyCallCard(
    title: String,
    number: String,
    description: String,
    onDial: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF0F172A))
                Text(text = description, fontSize = 11.sp, color = Color.Gray, modifier = Modifier.padding(top = 2.dp))
                Text(text = "Tel: $number", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFFE11D48), modifier = Modifier.padding(top = 4.dp))
            }

            Button(
                onClick = onDial,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE11D48)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Phone, contentDescription = "Call", modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Dial", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}
