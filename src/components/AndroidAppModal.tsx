import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  Code,
  CheckCircle2,
  X,
  ExternalLink,
  Layers,
  Terminal,
  Play
} from 'lucide-react';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'install' | 'source' | 'build'>('install');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-teal-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AuraHealth Android App</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Native Kotlin + PWA
                </span>
              </div>
              <p className="text-xs text-teal-200/80">
                Install directly on your phone or build the APK in Android Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('install')}
            className={`px-3 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-white text-teal-800 border-t border-x border-slate-200 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install on Phone</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`px-3 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'source'
                ? 'bg-white text-teal-800 border-t border-x border-slate-200 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Native Kotlin Code (`/android`)</span>
          </button>

          <button
            onClick={() => setActiveTab('build')}
            className={`px-3 py-2 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'build'
                ? 'bg-white text-teal-800 border-t border-x border-slate-200 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>APK Build Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-teal-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-teal-700" />
                    <span>Instant Android Installation</span>
                  </h4>
                  <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                    Install AuraHealth as a standalone Android app with home screen icon, fullscreen view, and offline mode.
                  </p>
                </div>

                {isInstalled ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>App Installed</span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>{installPrompt ? 'Install App Now' : 'Add to Home Screen'}</span>
                  </button>
                )}
              </div>

              {/* Instructions if installPrompt is not available */}
              {!installPrompt && !isInstalled && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  <span className="font-bold text-slate-900 block">How to install on your Android device:</span>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                    <li>Open this URL in <strong>Google Chrome for Android</strong>.</li>
                    <li>Tap the <strong>three dots menu (⋮)</strong> at the top right.</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>The AuraHealth icon will appear on your device launcher!</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {activeTab === 'source' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Native Android Kotlin + Jetpack Compose Structure:</span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-mono font-bold">Location: /android</span>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-xs overflow-x-auto space-y-1 border border-slate-800">
                <div className="text-teal-400">📁 android/</div>
                <div className="pl-4 text-slate-300">├── 📄 build.gradle.kts (Top-level Gradle)</div>
                <div className="pl-4 text-slate-300">├── 📄 settings.gradle.kts (Gradle Settings)</div>
                <div className="pl-4 text-teal-300">└── 📁 app/</div>
                <div className="pl-8 text-slate-300">├── 📄 build.gradle.kts (Compose & Dependencies)</div>
                <div className="pl-8 text-slate-300">├── 📁 src/main/AndroidManifest.xml</div>
                <div className="pl-8 text-slate-300">└── 📁 java/com/aurahealth/app/</div>
                <div className="pl-12 text-emerald-400">├── 📄 MainActivity.kt (Compose Navigation)</div>
                <div className="pl-12 text-emerald-400">├── 📄 viewmodel/HealthViewModel.kt</div>
                <div className="pl-12 text-emerald-400">├── 📄 data/HealthModels.kt</div>
                <div className="pl-12 text-emerald-400">├── 📄 ui/screens/HomeScreen.kt (Vitals + Alerts)</div>
                <div className="pl-12 text-emerald-400">├── 📄 ui/screens/ReportsScreen.kt (Lab Reports)</div>
                <div className="pl-12 text-emerald-400">├── 📄 ui/screens/AssistantScreen.kt (Gemini Chat)</div>
                <div className="pl-12 text-emerald-400">└── 📄 ui/screens/EmergencyScreen.kt (One-tap Calling)</div>
              </div>

              <p className="text-xs text-slate-600">
                All Kotlin source files have been written directly to the <code>/android</code> directory in this repository and are ready to be opened in Android Studio.
              </p>
            </div>
          )}

          {activeTab === 'build' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">How to build the Standalone APK:</span>

              <div className="p-3 bg-slate-900 rounded-xl text-xs font-mono text-emerald-400 space-y-2 border border-slate-800">
                <div className="text-slate-400"># 1. Navigate to the android folder</div>
                <div>cd android</div>
                <div className="text-slate-400 mt-2"># 2. Build Debug APK using Gradle</div>
                <div>./gradlew assembleDebug</div>
                <div className="text-slate-400 mt-2"># 3. Locate compiled APK</div>
                <div className="text-slate-300">app/build/outputs/apk/debug/app-debug.apk</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Or run directly on device via Android Studio:</span>
                <p>1. Open Android Studio → Click <strong>Open</strong> → Select the <code>android</code> folder.</p>
                <p>2. Connect your Android phone with USB Debugging enabled.</p>
                <p>3. Click the green <strong>Run (▶)</strong> button to install the app on your phone.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Target: Android 8.0+ (API 26 to 34)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
