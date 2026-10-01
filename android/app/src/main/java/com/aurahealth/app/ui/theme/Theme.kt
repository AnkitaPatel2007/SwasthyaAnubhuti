package com.aurahealth.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val TealPrimary = Color(0xFF0F766E)
val TealDark = Color(0xFF042F2E)
val TealSecondary = Color(0xFF14B8A6)
val MintAccent = Color(0xFF2DD4BF)
val RoseAlert = Color(0xFFE11D48)
val AmberAlert = Color(0xFFD97706)
val BackgroundLight = Color(0xFFF8FAFC)
val SurfaceCard = Color(0xFFFFFFFF)

private val LightColorScheme = lightColorScheme(
    primary = TealPrimary,
    onPrimary = Color.White,
    secondary = TealSecondary,
    onSecondary = Color.White,
    background = BackgroundLight,
    surface = SurfaceCard,
    error = RoseAlert
)

@Composable
fun AuraHealthTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
