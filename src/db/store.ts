import bcrypt from 'bcryptjs';
import {
  UserProfile,
  DailyHealthUpdate,
  MedicalReport,
  HealthBiomarker,
  HabitGoal,
  HabitReminder,
  ChatMessage,
  DiseaseCondition
} from '../types/index.ts';
import {
  SEED_PROFILE,
  SEED_REPORTS,
  SEED_DAILY_UPDATES,
  SEED_HABIT_GOALS,
  SEED_REMINDERS
} from './seedData.ts';
import { DISEASES_CATALOG } from './diseasesData.ts';

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

class HealthDataStore {
  private users: Map<string, StoredUser> = new Map();
  private profiles: Map<string, UserProfile> = new Map();
  private reports: Map<string, MedicalReport[]> = new Map();
  private dailyUpdates: Map<string, DailyHealthUpdate[]> = new Map();
  private habitGoals: Map<string, HabitGoal[]> = new Map();
  private reminders: Map<string, HabitReminder[]> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('password123', salt);

    const demoUser: StoredUser = {
      id: SEED_PROFILE.id,
      email: SEED_PROFILE.email,
      passwordHash: demoPasswordHash,
      createdAt: new Date().toISOString()
    };

    this.users.set(demoUser.id, demoUser);
    this.profiles.set(demoUser.id, { ...SEED_PROFILE });
    this.reports.set(demoUser.id, JSON.parse(JSON.stringify(SEED_REPORTS)));
    this.dailyUpdates.set(demoUser.id, JSON.parse(JSON.stringify(SEED_DAILY_UPDATES)));
    this.habitGoals.set(demoUser.id, JSON.parse(JSON.stringify(SEED_HABIT_GOALS)));
    this.reminders.set(demoUser.id, JSON.parse(JSON.stringify(SEED_REMINDERS)));
    this.chatMessages.set(demoUser.id, [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        content: `Hello Alex! I am your AuraHealth Medical & Wellness Assistant. I've analyzed your latest Complete Blood Count (CBC) and Vitamin Panel. 

Key Health Status:
• **Ferritin:** 18 ng/mL (depleted iron reserves; explains your afternoon study fatigue)
• **Vitamin D:** 24.2 ng/mL (sub-optimal indoor baseline)
• **Resting Vitals:** BP 118/76 mmHg, Resting HR 71 bpm (healthy cardiovascular baseline)
• **Habit Streaks:** 5-day hydration streak active!

How can I assist your health goals today? You can ask about disease prevention, understanding your lab values, or building consistent daily habits.`,
        timestamp: new Date().toISOString(),
        citations: [
          { source: 'Quest Diagnostics Screening (Sep 2026)', referenceText: 'Serum Ferritin 18 ng/mL; 25-OH Vitamin D 24.2 ng/mL' },
          { source: 'AuraHealth Vitals Log', referenceText: 'Resting Blood Pressure 118/76 mmHg' }
        ]
      }
    ]);
  }

  // --- Auth & Profile ---
  public async register(email: string, passwordPlain: string, name: string): Promise<{ user: StoredUser; profile: UserProfile }> {
    const existing = Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlain, salt);
    const userId = `usr_${Date.now()}`;

    const newUser: StoredUser = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString()
    };

    const newProfile: UserProfile = {
      id: userId,
      email: email.toLowerCase(),
      name,
      age: 22,
      gender: 'prefer-not-to-say',
      heightCm: 170,
      weightKg: 65,
      lifestyle: 'student',
      targetSleepHours: 8.0,
      targetWaterMl: 2500,
      targetActivityMins: 30,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      restingHeartRate: 72,
      bloodGroup: 'O+',
      existingConditions: [],
      familyHistory: [],
      anonymousMode: false
    };

    this.users.set(userId, newUser);
    this.profiles.set(userId, newProfile);
    this.reports.set(userId, []);
    this.dailyUpdates.set(userId, []);
    this.habitGoals.set(userId, JSON.parse(JSON.stringify(SEED_HABIT_GOALS.map(g => ({ ...g, userId, id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })))));
    this.reminders.set(userId, JSON.parse(JSON.stringify(SEED_REMINDERS.map(r => ({ ...r, userId, id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })))));
    this.chatMessages.set(userId, [
      {
        id: `msg_init_${Date.now()}`,
        sender: 'assistant',
        content: `Welcome to AuraHealth, ${name}! Your health profile is initialized. You can upload medical lab reports for instant parameter extraction, track your daily vitals and habits, and check disease risk factors.`,
        timestamp: new Date().toISOString()
      }
    ]);

    return { user: newUser, profile: newProfile };
  }

  public async login(email: string, passwordPlain: string): Promise<{ user: StoredUser; profile: UserProfile }> {
    const user = Array.from(this.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const profile = this.profiles.get(user.id) || {
      id: user.id,
      email: user.email,
      name: 'User',
      age: 22,
      gender: 'prefer-not-to-say',
      heightCm: 170,
      weightKg: 65,
      lifestyle: 'student',
      targetSleepHours: 8.0,
      targetWaterMl: 2500,
      targetActivityMins: 30
    };

    return { user, profile };
  }

  public getProfile(userId: string): UserProfile | undefined {
    return this.profiles.get(userId);
  }

  public updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const current = this.profiles.get(userId);
    if (!current) {
      throw new Error('Profile not found.');
    }
    const updated = { ...current, ...updates };
    this.profiles.set(userId, updated);
    return updated;
  }

  // --- Reports & Biomarkers ---
  public getReports(userId: string): MedicalReport[] {
    return this.reports.get(userId) || [];
  }

  public getReportById(userId: string, reportId: string): MedicalReport | undefined {
    const userReports = this.getReports(userId);
    return userReports.find(r => r.id === reportId);
  }

  public saveReport(userId: string, report: MedicalReport): MedicalReport {
    const userReports = this.getReports(userId);
    const existingIndex = userReports.findIndex(r => r.id === report.id);
    if (existingIndex >= 0) {
      userReports[existingIndex] = report;
    } else {
      userReports.unshift(report);
    }
    this.reports.set(userId, userReports);
    return report;
  }

  public deleteReport(userId: string, reportId: string): boolean {
    const userReports = this.getReports(userId);
    const filtered = userReports.filter(r => r.id !== reportId);
    this.reports.set(userId, filtered);
    return true;
  }

  public getBiomarkerHistory(userId: string, parameterQuery?: string): { parameterName: string; category: string; records: { date: string; value: number; unit: string; status: string; refMin?: number; refMax?: number; reportTitle: string }[] }[] {
    const userReports = this.getReports(userId);
    const paramMap = new Map<string, { parameterName: string; category: string; records: any[] }>();

    for (const report of userReports) {
      for (const p of report.parameters) {
        const key = p.parameterName.trim();
        if (parameterQuery && !key.toLowerCase().includes(parameterQuery.toLowerCase())) {
          continue;
        }

        if (!paramMap.has(key)) {
          paramMap.set(key, {
            parameterName: p.parameterName,
            category: p.category,
            records: []
          });
        }

        paramMap.get(key)!.records.push({
          date: p.reportDate || report.reportDate,
          value: p.value,
          unit: p.unit,
          status: p.status,
          refMin: p.referenceMin,
          refMax: p.referenceMax,
          reportTitle: report.title
        });
      }
    }

    for (const item of paramMap.values()) {
      item.records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return Array.from(paramMap.values());
  }

  // --- Daily Health Updates & Vitals ---
  public getDailyUpdates(userId: string): DailyHealthUpdate[] {
    const logs = this.dailyUpdates.get(userId) || [];
    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public logDailyHealth(userId: string, updateData: Partial<DailyHealthUpdate>): DailyHealthUpdate {
    const userLogs = this.getDailyUpdates(userId);
    const todayStr = updateData.date || new Date().toISOString().split('T')[0];
    const existingIndex = userLogs.findIndex(l => l.date === todayStr);

    const fullLog: DailyHealthUpdate = {
      id: existingIndex >= 0 ? userLogs[existingIndex].id : `log_${Date.now()}`,
      userId,
      date: todayStr,
      restingHeartRate: updateData.restingHeartRate ?? 72,
      bloodPressure: updateData.bloodPressure ?? '118/76',
      weightKg: updateData.weightKg ?? 62.0,
      energyLevel: updateData.energyLevel ?? 3,
      stressLevel: updateData.stressLevel ?? 2,
      mood: updateData.mood ?? 'productive',
      waterGlasses: updateData.waterGlasses ?? 6,
      sleepHours: updateData.sleepHours ?? 7.5,
      sleepQuality: updateData.sleepQuality ?? 4,
      activityMinutes: updateData.activityMinutes ?? 30,
      activityType: updateData.activityType ?? 'Brisk walking',
      screenTimeHours: updateData.screenTimeHours ?? 5.5,
      nutritionQuality: updateData.nutritionQuality ?? 'healthy_balanced',
      supplementsTaken: updateData.supplementsTaken ?? [],
      symptomsReported: updateData.symptomsReported ?? [],
      notes: updateData.notes
    };

    if (existingIndex >= 0) {
      userLogs[existingIndex] = fullLog;
    } else {
      userLogs.unshift(fullLog);
    }

    this.dailyUpdates.set(userId, userLogs);

    // Sync corresponding habit goal values
    this.syncHabitGoalsFromDailyUpdate(userId, fullLog);

    return fullLog;
  }

  // --- Daily Habit Goals & Streaks ---
  public getHabitGoals(userId: string): HabitGoal[] {
    return this.habitGoals.get(userId) || [];
  }

  public updateHabitGoal(userId: string, goalId: string, updates: Partial<HabitGoal>): HabitGoal[] {
    const goals = this.getHabitGoals(userId);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      Object.assign(goal, updates);
    }
    this.habitGoals.set(userId, goals);
    return goals;
  }

  private syncHabitGoalsFromDailyUpdate(userId: string, update: DailyHealthUpdate) {
    const goals = this.getHabitGoals(userId);
    for (const g of goals) {
      if (g.category === 'water') {
        g.currentValue = update.waterGlasses;
        g.completedToday = g.currentValue >= g.targetValue;
      } else if (g.category === 'sleep') {
        g.currentValue = update.sleepHours;
        g.completedToday = g.currentValue >= g.targetValue;
      } else if (g.category === 'activity') {
        g.currentValue = update.activityMinutes;
        g.completedToday = g.currentValue >= g.targetValue;
      } else if (g.category === 'screen_time') {
        g.currentValue = update.screenTimeHours;
        g.completedToday = g.currentValue <= g.targetValue;
      } else if (g.category === 'medication') {
        g.currentValue = update.supplementsTaken.length;
        g.completedToday = g.currentValue >= g.targetValue;
      }
    }
    this.habitGoals.set(userId, goals);
  }

  // --- Reminders ---
  public getReminders(userId: string): HabitReminder[] {
    return this.reminders.get(userId) || [];
  }

  public toggleReminder(userId: string, reminderId: string): HabitReminder[] {
    const list = this.getReminders(userId);
    const item = list.find(r => r.id === reminderId);
    if (item) {
      item.enabled = !item.enabled;
    }
    this.reminders.set(userId, list);
    return list;
  }

  public addReminder(userId: string, reminder: Omit<HabitReminder, 'id' | 'userId'>): HabitReminder {
    const list = this.getReminders(userId);
    const newRem: HabitReminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
      userId
    };
    list.push(newRem);
    this.reminders.set(userId, list);
    return newRem;
  }

  public deleteReminder(userId: string, reminderId: string): HabitReminder[] {
    const list = this.getReminders(userId);
    const filtered = list.filter(r => r.id !== reminderId);
    this.reminders.set(userId, filtered);
    return filtered;
  }

  // --- Disease Catalog ---
  public getDiseases(): DiseaseCondition[] {
    return DISEASES_CATALOG;
  }

  public getDiseaseById(id: string): DiseaseCondition | undefined {
    return DISEASES_CATALOG.find(d => d.id === id);
  }

  // --- Chat ---
  public getChatMessages(userId: string): ChatMessage[] {
    return this.chatMessages.get(userId) || [];
  }

  public addChatMessage(userId: string, msg: ChatMessage): ChatMessage {
    const list = this.getChatMessages(userId);
    list.push(msg);
    this.chatMessages.set(userId, list);
    return msg;
  }

  public clearChat(userId: string): void {
    this.chatMessages.set(userId, []);
  }

  // --- Privacy & Export ---
  public exportData(userId: string): object {
    return {
      exportedAt: new Date().toISOString(),
      userProfile: this.getProfile(userId),
      medicalReports: this.getReports(userId),
      dailyHealthUpdates: this.getDailyUpdates(userId),
      habitGoals: this.getHabitGoals(userId),
      reminders: this.getReminders(userId),
      privacyCommitment: 'AuraHealth adheres to strict tenant isolation and never monetizes youth health data.'
    };
  }

  public deleteAccount(userId: string): boolean {
    this.users.delete(userId);
    this.profiles.delete(userId);
    this.reports.delete(userId);
    this.dailyUpdates.delete(userId);
    this.habitGoals.delete(userId);
    this.reminders.delete(userId);
    this.chatMessages.delete(userId);
    return true;
  }
}

export const dbStore = new HealthDataStore();
