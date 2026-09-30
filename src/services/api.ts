import {
  UserProfile,
  DailySymptomLog,
  MedicalReport,
  DailyWellnessPlan,
  HabitReminder,
  ChatMessage,
  HealthStory
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
  async login(email: string, password: string):Promise<{ token: string; profile: UserProfile }> {
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

  // Symptoms
  async getSymptoms(): Promise<DailySymptomLog[]> {
    return this.request<DailySymptomLog[]>('/api/symptoms');
  },

  async logSymptom(log: Partial<DailySymptomLog>): Promise<DailySymptomLog> {
    return this.request<DailySymptomLog>('/api/symptoms', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  },

  // Reports
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

  // Trends
  async getTrends(parameterQuery?: string): Promise<{ parameterName: string; category: string; records: any[] }[]> {
    const qs = parameterQuery ? `?parameter=${encodeURIComponent(parameterQuery)}` : '';
    return this.request<any[]>(`/api/trends${qs}`);
  },

  // Wellness Plan
  async getWellnessPlan(): Promise<DailyWellnessPlan> {
    return this.request<DailyWellnessPlan>('/api/wellness/plan');
  },

  async toggleRoutineItem(routineId: string): Promise<DailyWellnessPlan> {
    return this.request<DailyWellnessPlan>('/api/wellness/plan/routine/toggle', {
      method: 'POST',
      body: JSON.stringify({ routineId }),
    });
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

  // Stories
  async getStories(): Promise<HealthStory[]> {
    return this.request<HealthStory[]>('/api/stories');
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
