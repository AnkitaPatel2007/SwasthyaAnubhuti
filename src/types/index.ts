export type Gender = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
export type LifestyleType = 'student' | 'desk_professional' | 'active_athlete' | 'shift_worker' | 'general';
export type TrackingMode = 'cycle_and_wellness' | 'energy_and_circadian' | 'holistic_general';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  lifestyle: LifestyleType;
  trackingMode: TrackingMode;
  targetSleepHours: number;
  targetWaterMl: number;
  // Cycle tracking parameters (Flo-inspired)
  cycleLengthDays?: number; // e.g., 28
  periodLengthDays?: number; // e.g., 5
  lastPeriodStartDate?: string; // YYYY-MM-DD
  isTryingToConceive?: boolean;
  pinCode?: string; // for confidential lock
  anonymousMode?: boolean;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'circadian_day' | 'circadian_night';

export interface DailySymptomLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  // Physical symptoms
  cramps?: 'none' | 'mild' | 'moderate' | 'severe';
  headache?: boolean;
  bloating?: boolean;
  breastTenderness?: boolean;
  fatigueLevel: number; // 1 to 5
  skinCondition?: 'clear' | 'oily' | 'breakouts' | 'dry';
  digestion?: 'normal' | 'constipated' | 'bloated' | 'acidic' | 'nausea';
  // Mood and mental state
  mood: 'peaceful' | 'energetic' | 'focused' | 'anxious' | 'irritable' | 'low' | 'stressed';
  stressLevel: number; // 1 to 5
  mentalFocus: number; // 1 to 5
  // Habits and vitals
  sleepHours: number;
  sleepQuality: number; // 1 to 5
  waterGlasses: number; // 250ml each
  exerciseMinutes: number;
  exerciseType?: string;
  caffeineCups: number;
  supplementsTaken: string[]; // e.g., ['Iron', 'Vitamin D', 'Omega-3', 'Magnesium', 'Multivitamin']
  periodFlow?: 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
  notes?: string;
}

export interface HealthBiomarker {
  id: string;
  reportId: string;
  parameterName: string;
  category: 'hematology' | 'vitamins_minerals' | 'endocrine' | 'lipids' | 'metabolic' | 'urinalysis';
  value: number;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  status: 'optimal' | 'low' | 'high' | 'borderline';
  plainExplanation: string;
  youthRelevance: string;
  reportDate: string;
  confidenceScore: number; // 0 to 1
}

export interface MedicalReport {
  id: string;
  userId: string;
  title: string;
  reportType: 'complete_blood_count' | 'lipid_profile' | 'vitamin_panel' | 'hormone_panel' | 'comprehensive_metabolic' | 'general';
  reportDate: string;
  fileName: string;
  fileSize: number;
  status: 'processing' | 'completed' | 'flagged_review' | 'failed';
  summary: string;
  parameters: HealthBiomarker[];
  doctorDiscussionPoints: string[];
  extractedText?: string;
  createdAt: string;
}

export interface HealthStory {
  id: string;
  title: string;
  category: 'Cycle & Hormones' | 'Fatigue & Blood Health' | 'Sleep & Mind' | 'Skin & Gut' | 'Fitness & Food';
  readTime: string;
  summary: string;
  evidenceSource: string;
  contentMarkdown: string;
  tags: string[];
  highlightMetric?: string;
}

export interface RoutineItem {
  id: string;
  timeSlot: 'morning' | 'midday' | 'evening' | 'night';
  title: string;
  description: string;
  iconName: string;
  completed: boolean;
}

export interface DailyWellnessPlan {
  id: string;
  userId: string;
  date: string;
  focusTheme: string;
  circadianAdvice: string;
  routines: RoutineItem[];
  biomarkerTip?: string;
}

export interface HabitReminder {
  id: string;
  userId: string;
  title: string;
  category: 'water' | 'supplement' | 'movement' | 'sleep' | 'period' | 'report';
  time: string; // "09:00"
  enabled: boolean;
  frequency: 'daily' | 'weekdays' | 'hourly';
}

export interface ChatCitation {
  source: string;
  referenceText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: ChatCitation[];
  isRedFlagWarning?: boolean;
}
