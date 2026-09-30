import {
  UserProfile,
  DailyHealthUpdate,
  MedicalReport,
  HabitGoal,
  HabitReminder,
  ChatMessage,
  DiseaseCondition
} from '../types/index.ts';

const TOKEN_KEY = 'aurahealth_jwt_token';

export const apiClient = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    return response.json();
  },

  // Auth
  async login(email: string, password: string): Promise<{ token: string; profile: UserProfile }> {
    const data = await this.request<{ token: string; profile: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  },

  async register(email: string, password: string, name: string): Promise<{ token: string; profile: UserProfile }> {
    const data = await this.request<{ token: string; profile: UserProfile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(data.token);
    return data;
  },

  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/api/profile');
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.request<UserProfile>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Daily Health Updates & Vitals
  async getDailyUpdates(): Promise<DailyHealthUpdate[]> {
    return this.request<DailyHealthUpdate[]>('/api/health/updates');
  },

  async logDailyHealth(data: Partial<DailyHealthUpdate>): Promise<DailyHealthUpdate> {
    return this.request<DailyHealthUpdate>('/api/health/updates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Daily Habits & Goals
  async getHabitGoals(): Promise<HabitGoal[]> {
    return this.request<HabitGoal[]>('/api/habits/goals');
  },

  async updateHabitGoal(id: string, updates: Partial<HabitGoal>): Promise<HabitGoal[]> {
    return this.request<HabitGoal[]>(`/api/habits/goals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Diseases & Conditions
  async getDiseases(): Promise<DiseaseCondition[]> {
    return this.request<DiseaseCondition[]>('/api/diseases');
  },

  async getDiseaseById(id: string): Promise<DiseaseCondition> {
    return this.request<DiseaseCondition>(`/api/diseases/${id}`);
  },

  // Medical Reports
  async getReports(): Promise<MedicalReport[]> {
    return this.request<MedicalReport[]>('/api/reports');
  },

  async getReportById(id: string): Promise<MedicalReport> {
    return this.request<MedicalReport>(`/api/reports/${id}`);
  },

  async uploadReport(payload: { fileName: string; fileData?: string; mimeType?: string; title?: string }): Promise<MedicalReport> {
    return this.request<MedicalReport>('/api/reports/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteReport(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/reports/${id}`, {
      method: 'DELETE',
    });
  },

  // Longitudinal Trends
  async getTrends(parameterQuery?: string): Promise<{ parameterName: string; category: string; records: any[] }[]> {
    const qs = parameterQuery ? `?parameter=${encodeURIComponent(parameterQuery)}` : '';
    return this.request<any[]>(`/api/trends${qs}`);
  },

  // Reminders
  async getReminders(): Promise<HabitReminder[]> {
    return this.request<HabitReminder[]>('/api/reminders');
  },

  async addReminder(reminder: Omit<HabitReminder, 'id' | 'userId'>): Promise<HabitReminder> {
    return this.request<HabitReminder>('/api/reminders', {
      method: 'POST',
      body: JSON.stringify(reminder),
    });
  },

  async toggleReminder(id: string): Promise<HabitReminder[]> {
    return this.request<HabitReminder[]>(`/api/reminders/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteReminder(id: string): Promise<HabitReminder[]> {
    return this.request<HabitReminder[]>(`/api/reminders/${id}`, {
      method: 'DELETE',
    });
  },

  // Chat
  async getChatHistory(): Promise<ChatMessage[]> {
    return this.request<ChatMessage[]>('/api/chat/history');
  },

  async sendChatMessage(message: string): Promise<ChatMessage> {
    return this.request<ChatMessage>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async clearChat(): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/api/chat/history', {
      method: 'DELETE',
    });
  },

  // Privacy
  async exportData(): Promise<Blob> {
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/privacy/export', { headers });
    return res.blob();
  },

  async deleteAccount(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/api/privacy/account', {
      method: 'DELETE',
    });
  }
};
