import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ReportsVault } from './components/ReportsVault.tsx';
import { DiseaseExplorer } from './components/DiseaseExplorer.tsx';
import { TrendsVisualizer } from './components/TrendsVisualizer.tsx';
import { DailyHabitsTracker } from './components/DailyHabitsTracker.tsx';
import { AssistantChat } from './components/AssistantChat.tsx';
import { DailyCheckinModal } from './components/DailyCheckinModal.tsx';
import { PrivacyModal } from './components/PrivacyModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { apiClient } from './services/api.ts';
import {
  UserProfile,
  DailyHealthUpdate,
  MedicalReport,
  HabitGoal,
  HabitReminder,
  ChatMessage,
  DiseaseCondition
} from './types/index.ts';
import {
  SEED_PROFILE,
  SEED_REPORTS,
  SEED_DAILY_UPDATES,
  SEED_HABIT_GOALS,
  SEED_REMINDERS
} from './db/seedData.ts';
import { DISEASES_CATALOG } from './db/diseasesData.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);

  // Core Data States (Pre-populated with realistic seed data for zero-latency initial load)
  const [profile, setProfile] = useState<UserProfile>(SEED_PROFILE);
  const [reports, setReports] = useState<MedicalReport[]>(SEED_REPORTS);
  const [dailyUpdates, setDailyUpdates] = useState<DailyHealthUpdate[]>(SEED_DAILY_UPDATES);
  const [habitGoals, setHabitGoals] = useState<HabitGoal[]>(SEED_HABIT_GOALS);
  const [reminders, setReminders] = useState<HabitReminder[]>(SEED_REMINDERS);
  const [diseases, setDiseases] = useState<DiseaseCondition[]>(DISEASES_CATALOG);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Navigation payload states
  const [selectedBiomarkerTrend, setSelectedBiomarkerTrend] = useState<string | undefined>(undefined);

  // Modals
  const [isCheckinOpen, setIsCheckinOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [profData, repsData, updsData, goalsData, remsData, disData, msgsData] =
          await Promise.allSettled([
            apiClient.getProfile(),
            apiClient.getReports(),
            apiClient.getDailyUpdates(),
            apiClient.getHabitGoals(),
            apiClient.getReminders(),
            apiClient.getDiseases(),
            apiClient.getChatHistory(),
          ]);

        if (profData.status === 'fulfilled') setProfile(profData.value);
        if (repsData.status === 'fulfilled') setReports(repsData.value);
        if (updsData.status === 'fulfilled') setDailyUpdates(updsData.value);
        if (goalsData.status === 'fulfilled') setHabitGoals(goalsData.value);
        if (remsData.status === 'fulfilled') setReminders(remsData.value);
        if (disData.status === 'fulfilled') setDiseases(disData.value);
        if (msgsData.status === 'fulfilled') setChatMessages(msgsData.value);
      } catch (err) {
        console.warn('Initial server sync caught fallback:', err);
      }
    }
    loadData();
  }, []);

  const latestUpdate = dailyUpdates[0] || null;

  // --- Handlers ---
  const handleSaveHealthUpdate = async (data: Partial<DailyHealthUpdate>) => {
    try {
      const saved = await apiClient.logDailyHealth(data);
      setDailyUpdates((prev) => {
        const existingIdx = prev.findIndex((u) => u.date === saved.date);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = saved;
          return updated;
        }
        return [saved, ...prev];
      });

      // Refresh goals sync
      const freshGoals = await apiClient.getHabitGoals();
      setHabitGoals(freshGoals);
    } catch (err) {
      console.error('Failed to log health update:', err);
    }
  };

  const handleQuickAddWater = async () => {
    const currentGlasses = latestUpdate?.waterGlasses ?? 6;
    await handleSaveHealthUpdate({ waterGlasses: currentGlasses + 1 });
  };

  const handleToggleReminder = async (remId: string) => {
    try {
      const updatedList = await apiClient.toggleReminder(remId);
      setReminders(updatedList);
    } catch (err) {
      setReminders((prev) =>
        prev.map((r) => (r.id === remId ? { ...r, enabled: !r.enabled } : r))
      );
    }
  };

  const handleAddReminder = async (rem: Omit<HabitReminder, 'id' | 'userId'>) => {
    const created = await apiClient.addReminder(rem);
    setReminders((prev) => [...prev, created]);
  };

  const handleDeleteReminder = async (remId: string) => {
    const updated = await apiClient.deleteReminder(remId);
    setReminders(updated);
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
    a.download = `AuraHealth_MedicalFile_${profile.id}_${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    await apiClient.deleteAccount();
    apiClient.clearToken();
    setProfile(SEED_PROFILE);
    setReports([]);
    setDailyUpdates([]);
    setChatMessages([]);
    setCurrentTab('dashboard');
  };

  const handleLogin = async (email: string, pass: string) => {
    const res = await apiClient.login(email, pass);
    setProfile(res.profile);
    const [reps, upds, rems, goals] = await Promise.all([
      apiClient.getReports(),
      apiClient.getDailyUpdates(),
      apiClient.getReminders(),
      apiClient.getHabitGoals(),
    ]);
    setReports(reps);
    setDailyUpdates(upds);
    setReminders(rems);
    setHabitGoals(goals);
  };

  const handleRegister = async (email: string, pass: string, name: string) => {
    const res = await apiClient.register(email, pass, name);
    setProfile(res.profile);
    setReports([]);
    setDailyUpdates([]);
  };

  const handleLogout = () => {
    apiClient.clearToken();
    setProfile(SEED_PROFILE);
  };

  const handleLoadDemo = async () => {
    apiClient.clearToken();
    setProfile(SEED_PROFILE);
    setReports(SEED_REPORTS);
    setDailyUpdates(SEED_DAILY_UPDATES);
    setReminders(SEED_REMINDERS);
    setHabitGoals(SEED_HABIT_GOALS);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* 3-Zone Navigation Header */}
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
            latestUpdate={latestUpdate}
            reports={reports}
            habitGoals={habitGoals}
            reminders={reminders}
            diseases={diseases}
            onOpenCheckin={() => setIsCheckinOpen(true)}
            onOpenReports={() => setCurrentTab('reports')}
            onOpenTrends={(param) => {
              if (param) setSelectedBiomarkerTrend(param);
              setCurrentTab('trends');
            }}
            onOpenDiseases={(diseaseId) => {
              setCurrentTab('diseases');
            }}
            onOpenHabits={() => setCurrentTab('habits')}
            onOpenChat={() => setCurrentTab('chat')}
            onQuickAddWater={handleQuickAddWater}
            onToggleReminder={handleToggleReminder}
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

        {currentTab === 'diseases' && (
          <DiseaseExplorer
            diseases={diseases}
            onSelectBiomarkerForTrend={(param) => {
              setSelectedBiomarkerTrend(param);
              setCurrentTab('trends');
            }}
            onOpenReportUpload={() => setCurrentTab('reports')}
          />
        )}

        {currentTab === 'trends' && (
          <TrendsVisualizer
            reports={reports}
            initialParam={selectedBiomarkerTrend}
            onOpenReport={(_repId) => {
              setCurrentTab('reports');
            }}
          />
        )}

        {currentTab === 'habits' && (
          <DailyHabitsTracker
            goals={habitGoals}
            reminders={reminders}
            latestUpdate={latestUpdate}
            profile={profile}
            onUpdateHealth={handleSaveHealthUpdate}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
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
            <span>Youth Health, Medical Reports & Preventive Habits Assistant</span>
          </div>

          <div className="text-center sm:text-right">
            <span>Non-diagnostic preventive educational tool. Always consult a qualified physician for clinical care.</span>
          </div>
        </div>
      </footer>

      {/* Daily Health & Vitals Check-in Modal */}
      <DailyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        existingLog={latestUpdate}
        onSave={handleSaveHealthUpdate}
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
