import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ReportsVault } from './components/ReportsVault.tsx';
import { TrendsVisualizer } from './components/TrendsVisualizer.tsx';
import { CoachPlanner } from './components/CoachPlanner.tsx';
import { HealthLibrary } from './components/HealthLibrary.tsx';
import { AssistantChat } from './components/AssistantChat.tsx';
import { DailyCheckinModal } from './components/DailyCheckinModal.tsx';
import { PrivacyModal } from './components/PrivacyModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { apiClient } from './services/api.ts';
import {
  UserProfile,
  DailySymptomLog,
  MedicalReport,
  HabitReminder,
  DailyWellnessPlan,
  ChatMessage,
  HealthStory
} from './types/index.ts';
import {
  SEED_PROFILE,
  SEED_REPORTS,
  SEED_SYMPTOM_LOGS,
  SEED_REMINDERS,
  SEED_WELLNESS_PLAN
} from './db/seedData.ts';
import { HEALTH_STORIES } from './db/knowledgeBase.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);

  // Core Data States (initialized with realistic seed data for instant zero-flicker render)
  const [profile, setProfile] = useState<UserProfile>(SEED_PROFILE);
  const [reports, setReports] = useState<MedicalReport[]>(SEED_REPORTS);
  const [symptomLogs, setSymptomLogs] = useState<DailySymptomLog[]>(SEED_SYMPTOM_LOGS);
  const [reminders, setReminders] = useState<HabitReminder[]>(SEED_REMINDERS);
  const [wellnessPlan, setWellnessPlan] = useState<DailyWellnessPlan>(SEED_WELLNESS_PLAN);
  const [stories, setStories] = useState<HealthStory[]>(HEALTH_STORIES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Navigation payload states
  const [selectedBiomarkerTrend, setSelectedBiomarkerTrend] = useState<string | undefined>(undefined);
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(undefined);

  // Modals
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Fetch initial data from server on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [profData, repsData, sympData, remsData, planData, storsData, msgsData] =
          await Promise.allSettled([
            apiClient.getProfile(),
            apiClient.getReports(),
            apiClient.getSymptoms(),
            apiClient.getReminders(),
            apiClient.getWellnessPlan(),
            apiClient.getStories(),
            apiClient.getChatHistory(),
          ]);

        if (profData.status === 'fulfilled') setProfile(profData.value);
        if (repsData.status === 'fulfilled') setReports(repsData.value);
        if (sympData.status === 'fulfilled') setSymptomLogs(sympData.value);
        if (remsData.status === 'fulfilled') setReminders(remsData.value);
        if (planData.status === 'fulfilled') setWellnessPlan(planData.value);
        if (storsData.status === 'fulfilled') setStories(storsData.value);
        if (msgsData.status === 'fulfilled') setChatMessages(msgsData.value);
      } catch (err) {
        console.warn('Initial server sync caught fallback:', err);
      }
    }
    loadData();
  }, []);

  const todayLog = symptomLogs[0] || null;

  // --- Handlers ---
  const handleSaveSymptomLog = async (logData: Partial<DailySymptomLog>) => {
    try {
      const saved = await apiClient.logSymptom(logData);
      setSymptomLogs((prev) => {
        const existingIdx = prev.findIndex((l) => l.date === saved.date);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = saved;
          return updated;
        }
        return [saved, ...prev];
      });
    } catch (err) {
      console.error('Failed to log symptom:', err);
    }
  };

  const handleQuickAddWater = async () => {
    const currentGlasses = todayLog?.waterGlasses ?? 5;
    const nextGlasses = currentGlasses + 1;
    await handleSaveSymptomLog({ waterGlasses: nextGlasses });
  };

  const handleToggleReminder = async (remId: string) => {
    try {
      const updatedList = await apiClient.toggleReminder(remId);
      setReminders(updatedList);
    } catch (err) {
      // optimistic fallback
      setReminders((prev) =>
        prev.map((r) => (r.id === remId ? { ...r, enabled: !r.enabled } : r))
      );
    }
  };

  const handleToggleRoutineItem = async (routineId: string) => {
    try {
      const updatedPlan = await apiClient.toggleRoutineItem(routineId);
      setWellnessPlan(updatedPlan);
    } catch (err) {
      setWellnessPlan((prev) => ({
        ...prev,
        routines: prev.routines.map((r) =>
          r.id === routineId ? { ...r, completed: !r.completed } : r
        ),
      }));
    }
  };

  const handleUploadReport = async (payload: {
    fileName: string;
    fileData?: string;
    mimeType?: string;
    title?: string;
  }) => {
    const saved = await apiClient.uploadReport(payload);
    setReports((prev) => [saved, ...prev]);
  };

  const handleDeleteReport = async (reportId: string) => {
    await apiClient.deleteReport(reportId);
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  const handleToggleTrackingMode = async (
    newMode: 'cycle_and_wellness' | 'energy_and_circadian'
  ) => {
    const updated = await apiClient.updateProfile({ trackingMode: newMode });
    setProfile(updated);
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    const assistantMsg = await apiClient.sendChatMessage(text);
    setChatMessages((prev) => [...prev, assistantMsg]);
  };

  const handleClearChatHistory = async () => {
    await apiClient.clearChat();
    setChatMessages([]);
  };

  const handleExportData = async () => {
    const blob = await apiClient.exportData();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraHealth_Records_${profile.id}_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    await apiClient.deleteAccount();
    apiClient.clearToken();
    setProfile(SEED_PROFILE);
    setReports([]);
    setSymptomLogs([]);
    setChatMessages([]);
    setCurrentTab('dashboard');
  };

  const handleLogin = async (email: string, pass: string) => {
    const res = await apiClient.login(email, pass);
    setProfile(res.profile);
    const [reps, symps, rems] = await Promise.all([
      apiClient.getReports(),
      apiClient.getSymptoms(),
      apiClient.getReminders(),
    ]);
    setReports(reps);
    setSymptomLogs(symps);
    setReminders(rems);
  };

  const handleRegister = async (email: string, pass: string, name: string) => {
    const res = await apiClient.register(email, pass, name);
    setProfile(res.profile);
    setReports([]);
    setSymptomLogs([]);
  };

  const handleLogout = () => {
    apiClient.clearToken();
    setProfile(SEED_PROFILE);
  };

  const handleLoadDemo = async () => {
    apiClient.clearToken();
    setProfile(SEED_PROFILE);
    setReports(SEED_REPORTS);
    setSymptomLogs(SEED_SYMPTOM_LOGS);
    setReminders(SEED_REMINDERS);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* 3-Zone Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        profile={profile}
        privacyMask={privacyMask}
        onTogglePrivacyMask={() => setPrivacyMask(!privacyMask)}
        onOpenCheckin={() => setIsCheckinOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 transition-all ${
          privacyMask ? 'privacy-masked' : ''
        }`}
      >
        {currentTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            todayLog={todayLog}
            reports={reports}
            reminders={reminders}
            wellnessPlan={wellnessPlan}
            stories={stories}
            onOpenCheckin={() => setIsCheckinOpen(true)}
            onOpenReports={() => setCurrentTab('reports')}
            onOpenTrends={(param) => {
              if (param) setSelectedBiomarkerTrend(param);
              setCurrentTab('trends');
            }}
            onOpenStories={(storyId) => {
              if (storyId) setSelectedStoryId(storyId);
              setCurrentTab('stories');
            }}
            onToggleReminder={handleToggleReminder}
            onQuickAddWater={handleQuickAddWater}
            onToggleRoutineItem={handleToggleRoutineItem}
            onToggleTrackingMode={handleToggleTrackingMode}
            onOpenChat={() => setCurrentTab('chat')}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsVault
            reports={reports}
            onUploadReport={handleUploadReport}
            onDeleteReport={handleDeleteReport}
            onSelectBiomarkerForTrend={(param) => {
              setSelectedBiomarkerTrend(param);
              setCurrentTab('trends');
            }}
          />
        )}

        {currentTab === 'trends' && (
          <TrendsVisualizer
            reports={reports}
            initialParam={selectedBiomarkerTrend}
            onOpenReport={(repId) => {
              setCurrentTab('reports');
            }}
          />
        )}

        {currentTab === 'coach' && (
          <CoachPlanner
            plan={wellnessPlan}
            onToggleRoutine={handleToggleRoutineItem}
            onRegeneratePlan={() => {}}
          />
        )}

        {currentTab === 'stories' && (
          <HealthLibrary
            stories={stories}
            initialStoryId={selectedStoryId}
          />
        )}

        {currentTab === 'chat' && (
          <AssistantChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearChatHistory}
          />
        )}
      </main>

      {/* Quiet, Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">AuraHealth</span>
            <span>·</span>
            <span>Preventive Youth Health & Wellness Assistant</span>
          </div>

          <div className="text-center sm:text-right">
            <span>Non-diagnostic educational tool. Not a substitute for medical advice.</span>
          </div>
        </div>
      </footer>

      {/* Flo-style Daily Check-in Modal */}
      <DailyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        existingLog={todayLog}
        onSave={handleSaveSymptomLog}
        isCycleTracking={profile.trackingMode === 'cycle_and_wellness'}
      />

      {/* Confidentiality & Privacy Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        profile={profile}
        privacyMask={privacyMask}
        onTogglePrivacyMask={() => setPrivacyMask(!privacyMask)}
        onUpdateProfile={async (updates) => {
          const res = await apiClient.updateProfile(updates);
          setProfile(res);
        }}
        onExportData={handleExportData}
        onDeleteAccount={handleDeleteAccount}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={profile}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onLoadDemo={handleLoadDemo}
      />
    </div>
  );
}
