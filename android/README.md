# AuraHealth Native Android Application (Kotlin + Jetpack Compose)

This directory contains the complete, production-ready **Native Android project** for AuraHealth, built with modern Android best practices:
- **Language**: Kotlin 1.9+
- **UI Toolkit**: Jetpack Compose with Material Design 3
- **Architecture**: MVVM with Kotlin Coroutines & StateFlow
- **Minimum SDK**: Android 8.0 (API 26)
- **Target SDK**: Android 14 (API 34)

---

## 📱 How to Open & Run in Android Studio

1. **Launch Android Studio** (Hedgehog or newer recommended).
2. Click **Open** and select the `/android` folder from this repository.
3. Allow Gradle to sync dependencies automatically.
4. Select your connected Android device or Android Virtual Device (AVD Emulator).
5. Click the green **Run (▶)** button (or press `Shift + F10`).

---

## 🔨 Building the APK from Command Line

To build the APK directly using Gradle:

```bash
cd android

# Make Gradle wrapper executable (if needed)
chmod +x gradlew

# Build Debug APK
./gradlew assembleDebug

# Build Production Release Bundle (AAB for Google Play Store)
./gradlew bundleRelease
```

The compiled APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📂 Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   └── java/com/aurahealth/app/
│   │       ├── MainActivity.kt               # NavigationBar & Compose Scaffold
│   │       ├── data/HealthModels.kt          # Vitals, Biomarkers & Alerts data classes
│   │       ├── viewmodel/HealthViewModel.kt  # StateFlow & async health orchestration
│   │       ├── ui/screens/
│   │       │   ├── HomeScreen.kt             # Vitals cockpit & 7-day decline alert banner
│   │       │   ├── ReportsScreen.kt          # Lab report intelligence & test breakdown
│   │       │   ├── AssistantScreen.kt        # ArogyaSaathi AI health chat
│   │       │   └── EmergencyScreen.kt        # Emergency calling & hospital finder
│   │       └── ui/theme/Theme.kt             # Material3 Teal & Mint theme
│   └── build.gradle.kts                      # Compose & dependency configuration
├── build.gradle.kts                          # Top-level Gradle plugins
└── settings.gradle.kts                       # Project repositories & modules
```
