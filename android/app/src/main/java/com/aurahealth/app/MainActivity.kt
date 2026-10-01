package com.aurahealth.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.aurahealth.app.ui.screens.*
import com.aurahealth.app.ui.theme.AuraHealthTheme
import com.aurahealth.app.viewmodel.HealthViewModel

class MainActivity : ComponentActivity() {

    private val healthViewModel: HealthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AuraHealthTheme {
                MainAppScaffold(healthViewModel)
            }
        }
    }
}

enum class Screen(val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    HOME("Vitals", Icons.Default.Favorite),
    REPORTS("Reports", Icons.Default.Description),
    ASSISTANT("Assistant", Icons.Default.ChatBubble),
    EMERGENCY("Emergency", Icons.Default.LocalHospital)
}

@Composable
fun MainAppScaffold(viewModel: HealthViewModel) {
    var currentScreen by remember { mutableStateOf(Screen.HOME) }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar(
                containerColor = Color.White
            ) {
                Screen.values().forEach { screen ->
                    NavigationBarItem(
                        selected = currentScreen == screen,
                        onClick = { currentScreen = screen },
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF0F766E),
                            selectedTextColor = Color(0xFF0F766E),
                            indicatorColor = Color(0xFFCCFBF1)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            color = MaterialTheme.colorScheme.background
        ) {
            when (currentScreen) {
                Screen.HOME -> HomeScreen(viewModel)
                Screen.REPORTS -> ReportsScreen(viewModel)
                Screen.ASSISTANT -> AssistantScreen(viewModel)
                Screen.EMERGENCY -> EmergencyScreen()
            }
        }
    }
}
