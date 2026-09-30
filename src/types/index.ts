export type Gender = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
export type LifestyleType = 'student' | 'desk_professional' | 'active_athlete' | 'shift_worker' | 'general';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  lifestyle: LifestyleType;
  targetSleepHours: number;
  targetWaterMl: number;
  targetActivityMins: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  restingHeartRate?: number;
  bloodGroup?: string;
  existingConditions?: string[];
  familyHistory?: string[]; // e.g. ['Diabetes', 'Hypertension', 'Thyroid']
  healthPoints: number; // Earned by maintaining habit streaks
  unlockedFeatures: string[]; // List of redeemed special ArogyaSaathi features
  pinCode?: string;
  anonymousMode?: boolean;
}

export interface SpecialFeature {
  id: string;
  name: string;
  category: string;
  pointCost: number;
  description: string;
  iconName: string;
  sampleOutputTitle: string;
}

export interface HealthBiomarker {
  id: string;
  reportId: string;
  parameterName: string;
  category: 'hematology' | 'vitamins_minerals' | 'endocrine' | 'lipids' | 'metabolic' | 'liver' | 'kidney' | 'urinalysis';
  value: number;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  status: 'optimal' | 'low' | 'high' | 'borderline';
  plainExplanation: string;
  youthRelevance: string;
  associatedConditions?: string[]; // e.g. ['Iron Deficiency Anemia', 'Chronic Fatigue']
  reportDate: string;
  confidenceScore: number;
}

export interface MedicalReport {
  id: string;
  userId: string;
  title: string;
  reportType: 'complete_blood_count' | 'lipid_profile' | 'vitamin_panel' | 'hormone_panel' | 'comprehensive_metabolic' | 'liver_kidney_panel' | 'general';
  reportDate: string;
  fileName: string;
  fileSize: number;
  status: 'processing' | 'completed' | 'flagged_review' | 'failed';
  summary: string;
  parameters: HealthBiomarker[];
  doctorDiscussionPoints: string[];
  preventiveTakeaways: string[];
  extractedText?: string;
  createdAt: string;
}

export interface DiseaseCondition {
  id: string;
  name: string;
  category: 'Nutritional & Blood' | 'Metabolic & Cardiovascular' | 'Endocrine & Hormones' | 'Mental & Neurological' | 'Digestive & Gut' | 'Respiratory & Immunity';
  prevalenceInYouth: string;
  description: string;
  commonSymptoms: string[];
  keyLabTests: { testName: string; keyParameter: string; typicalAbnormality: string }[];
  riskFactors: string[];
  preventionLifestyle: string[];
  warningSignsWhenToSeeDoctor: string[];
}

export interface DailyHealthUpdate {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  // Vitals
  restingHeartRate?: number;
  bloodPressure?: string;
  weightKg?: number;
  energyLevel: number; // 1-5
  stressLevel: number; // 1-5
  mood: 'great' | 'productive' | 'normal' | 'fatigued' | 'stressed' | 'anxious';
  // Habits
  waterGlasses: number; // 250ml each
  sleepHours: number;
  sleepQuality: number; // 1-5
  activityMinutes: number;
  activityType?: string;
  screenTimeHours: number;
  nutritionQuality: 'healthy_balanced' | 'moderate' | 'junk_fast_food' | 'skipped_meals';
  supplementsTaken: string[];
  // Symptoms reported today
  symptomsReported: string[]; // e.g. ['Headache', 'Acid Reflux', 'Brain Fog', 'Eye Strain', 'Muscle Ache']
  notes?: string;
}

export interface HabitGoal {
  id: string;
  userId: string;
  title: string;
  category: 'water' | 'sleep' | 'activity' | 'nutrition' | 'screen_time' | 'medication';
  targetValue: number;
  currentValue: number;
  unit: string;
  currentStreakDays: number;
  bestStreakDays: number;
  completedToday: boolean;
}

export interface HabitReminder {
  id: string;
  userId: string;
  title: string;
  category: 'water' | 'medication' | 'movement' | 'sleep' | 'eye_break' | 'report_followup';
  time: string;
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
