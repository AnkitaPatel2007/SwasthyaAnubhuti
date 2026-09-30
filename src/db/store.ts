import bcrypt from 'bcryptjs';
import {
  UserProfile,
  DailySymptomLog,
  MedicalReport,
  HealthBiomarker,
  HabitReminder,
  DailyWellnessPlan,
  ChatMessage
} from '../types/index.ts';
import {
  SEED_PROFILE,
  SEED_REPORTS,
  SEED_SYMPTOM_LOGS,
  SEED_REMINDERS,
  SEED_WELLNESS_PLAN
} from './seedData.ts';

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
  private symptomLogs: Map<string, DailySymptomLog[]> = new Map();
  private reminders: Map<string, HabitReminder[]> = new Map();
  private wellnessPlans: Map<string, DailyWellnessPlan> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // Default demo user: maya.student@aurahealth.internal / password123
    const defaultSalt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('password123', defaultSalt);

    const demoUser: StoredUser = {
      id: SEED_PROFILE.id,
      email: SEED_PROFILE.email,
      passwordHash: demoPasswordHash,
      createdAt: new Date().toISOString()
    };

    this.users.set(demoUser.id, demoUser);
    this.profiles.set(demoUser.id, { ...SEED_PROFILE });
    this.reports.set(demoUser.id, JSON.parse(JSON.stringify(SEED_REPORTS)));
    this.symptomLogs.set(demoUser.id, JSON.parse(JSON.stringify(SEED_SYMPTOM_LOGS)));
    this.reminders.set(demoUser.id, JSON.parse(JSON.stringify(SEED_REMINDERS)));
    this.wellnessPlans.set(demoUser.id, JSON.parse(JSON.stringify(SEED_WELLNESS_PLAN)));
    this.chatMessages.set(demoUser.id, [
      {
        id: 'msg_welcome',
        sender: 'assistant',
        content: `Hello Maya! I'm your AuraHealth companion. I noticed you're on **Cycle Day 14** today (estrogen peak window) and your recent lab showed **Ferritin at 18 ng/mL**. How is your energy holding up today? Feel free to ask about your lab tests, cycle phases, or daily habits.`,
        timestamp: new Date().toISOString(),
        citations: [
          { source: 'Quest Diagnostics Report (Sept 2026)', referenceText: 'Serum Ferritin: 18 ng/mL (Reference: 20-150)' },
          { source: 'ACOG Cycle Guide', referenceText: 'Estrogen peak in late follicular/ovulation window enhances verbal fluency & physical stamina.' }
        ]
      }
    ]);
  }

  // --- Auth & User ---
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
      gender: 'female',
      heightCm: 165,
      weightKg: 60,
      lifestyle: 'student',
      trackingMode: 'cycle_and_wellness',
      targetSleepHours: 8,
      targetWaterMl: 2500,
      cycleLengthDays: 28,
      periodLengthDays: 5,
      lastPeriodStartDate: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      anonymousMode: false
    };

    this.users.set(userId, newUser);
    this.profiles.set(userId, newProfile);
    this.reports.set(userId, []);
    this.symptomLogs.set(userId, []);
    this.reminders.set(userId, JSON.parse(JSON.stringify(SEED_REMINDERS.map(r => ({ ...r, userId, id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` })))));
    this.wellnessPlans.set(userId, { ...SEED_WELLNESS_PLAN, id: `plan_${Date.now()}`, userId });
    this.chatMessages.set(userId, [
      {
        id: `msg_init_${Date.now()}`,
        sender: 'assistant',
        content: `Welcome to AuraHealth, ${name}! Your private health sanctuary is ready. You can log your daily feelings, upload any medical reports for simple explanations, and track your cycle or energy rhythm.`,
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
      heightCm: 168,
      weightKg: 65,
      lifestyle: 'general',
      trackingMode: 'cycle_and_wellness',
      targetSleepHours: 8,
      targetWaterMl: 2500
    };

    return { user, profile };
  }

  public getUserById(userId: string): StoredUser | undefined {
    return this.users.get(userId);
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

  public getBiomarkerHistory(userId: string, parameterNameQuery?: string): { parameterName: string; category: string; records: { date: string; value: number; unit: string; status: string; refMin?: number; refMax?: number; reportTitle: string }[] }[] {
    const userReports = this.getReports(userId);
    const paramMap: Map<string, { parameterName: string; category: string; records: { date: string; value: number; unit: string; status: string; refMin?: number; refMax?: number; reportTitle: string }[] }> = new Map();

    for (const report of userReports) {
      for (const p of report.parameters) {
        const key = p.parameterName.trim().toLowerCase();
        if (parameterNameQuery && !key.includes(parameterNameQuery.toLowerCase())) {
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

    // Sort each biomarker's records chronologically
    for (const item of paramMap.values()) {
      item.records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return Array.from(paramMap.values());
  }

  // --- Daily Symptom Logs ---
  public getSymptomLogs(userId: string): DailySymptomLog[] {
    const logs = this.symptomLogs.get(userId) || [];
    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public logSymptoms(userId: string, logData: Partial<DailySymptomLog>): DailySymptomLog {
    const userLogs = this.getSymptomLogs(userId);
    const todayStr = logData.date || new Date().toISOString().split('T')[0];
    const existingIndex = userLogs.findIndex(l => l.date === todayStr);

    const fullLog: DailySymptomLog = {
      id: existingIndex >= 0 ? userLogs[existingIndex].id : `log_${Date.now()}`,
      userId,
      date: todayStr,
      fatigueLevel: logData.fatigueLevel ?? 2,
      mood: logData.mood ?? 'peaceful',
      stressLevel: logData.stressLevel ?? 2,
      mentalFocus: logData.mentalFocus ?? 3,
      sleepHours: logData.sleepHours ?? 7.5,
      sleepQuality: logData.sleepQuality ?? 4,
      waterGlasses: logData.waterGlasses ?? 6,
      exerciseMinutes: logData.exerciseMinutes ?? 30,
      caffeineCups: logData.caffeineCups ?? 1,
      supplementsTaken: logData.supplementsTaken ?? [],
      cramps: logData.cramps ?? 'none',
      headache: logData.headache ?? false,
      bloating: logData.bloating ?? false,
      breastTenderness: logData.breastTenderness ?? false,
      skinCondition: logData.skinCondition ?? 'clear',
      digestion: logData.digestion ?? 'normal',
      periodFlow: logData.periodFlow ?? 'none',
      exerciseType: logData.exerciseType,
      notes: logData.notes
    };

    if (existingIndex >= 0) {
      userLogs[existingIndex] = fullLog;
    } else {
      userLogs.unshift(fullLog);
    }

    this.symptomLogs.set(userId, userLogs);
    return fullLog;
  }

  // --- Wellness Plan ---
  public getWellnessPlan(userId: string): DailyWellnessPlan {
    let plan = this.wellnessPlans.get(userId);
    if (!plan) {
      plan = {
        ...SEED_WELLNESS_PLAN,
        id: `plan_${Date.now()}`,
        userId,
        date: new Date().toISOString().split('T')[0]
      };
      this.wellnessPlans.set(userId, plan);
    }
    return plan;
  }

  public saveWellnessPlan(userId: string, plan: DailyWellnessPlan): DailyWellnessPlan {
    this.wellnessPlans.set(userId, plan);
    return plan;
  }

  public toggleRoutineItem(userId: string, routineId: string): DailyWellnessPlan {
    const plan = this.getWellnessPlan(userId);
    const item = plan.routines.find(r => r.id === routineId);
    if (item) {
      item.completed = !item.completed;
    }
    this.wellnessPlans.set(userId, plan);
    return plan;
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

  // --- Data Privacy & Export ---
  public exportData(userId: string): object {
    return {
      exportedAt: new Date().toISOString(),
      userProfile: this.getProfile(userId),
      medicalReports: this.getReports(userId),
      dailySymptomLogs: this.getSymptomLogs(userId),
      reminders: this.getReminders(userId),
      wellnessPlan: this.getWellnessPlan(userId),
      complianceStatement: 'AuraHealth processes your data under strict user isolation and does not sell or share personal health telemetry.'
    };
  }

  public deleteAccount(userId: string): boolean {
    this.users.delete(userId);
    this.profiles.delete(userId);
    this.reports.delete(userId);
    this.symptomLogs.delete(userId);
    this.reminders.delete(userId);
    this.wellnessPlans.delete(userId);
    this.chatMessages.delete(userId);
    return true;
  }
}

export const dbStore = new HealthDataStore();
