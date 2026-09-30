import {
  UserProfile,
  DailyHealthUpdate,
  MedicalReport,
  HabitGoal,
  HabitReminder
} from '../types/index.ts';

export const SEED_PROFILE: UserProfile = {
  id: 'usr_alex_22',
  email: 'alex.wellness@aurahealth.internal',
  name: 'Alex Rivera',
  age: 22,
  gender: 'female',
  heightCm: 168,
  weightKg: 62,
  lifestyle: 'student',
  targetSleepHours: 8.0,
  targetWaterMl: 2500,
  targetActivityMins: 35,
  bloodPressureSystolic: 118,
  bloodPressureDiastolic: 76,
  restingHeartRate: 71,
  bloodGroup: 'O+',
  existingConditions: ['Mild Iron Deficiency', 'Indoor Vitamin D Insufficiency'],
  familyHistory: ['Type 2 Diabetes (Grandparent)', 'Hypertension (Father)'],
  healthPoints: 240, // Points earned from 5-day habit streaks
  unlockedFeatures: [],
  anonymousMode: false
};

export const SEED_REPORTS: MedicalReport[] = [
  {
    id: 'rep_sep_2026',
    userId: 'usr_alex_22',
    title: 'Comprehensive Student Health & Complete Blood Count (CBC)',
    reportType: 'complete_blood_count',
    reportDate: '2026-09-12',
    fileName: 'Quest_Diagnostics_Annual_Screening_Sep2026.pdf',
    fileSize: 245000,
    status: 'completed',
    summary: 'Biomarkers reflect overall stable metabolic and organ function, with early signs of nutritional iron deficiency: borderline low Hemoglobin (11.8 g/dL) and depleted Serum Ferritin reserves (18 ng/mL). Vitamin D is insufficient at 24.2 ng/mL.',
    parameters: [
      {
        id: 'p1',
        reportId: 'rep_sep_2026',
        parameterName: 'Hemoglobin (Hb)',
        category: 'hematology',
        value: 11.8,
        unit: 'g/dL',
        referenceMin: 12.0,
        referenceMax: 15.5,
        status: 'low',
        plainExplanation: 'The primary oxygen-carrying protein in red blood cells. Slightly below normal threshold, explaining afternoon study fatigue and mild exertion breathlessness.',
        youthRelevance: 'Common in young adults and students with irregular meal schedules or high training demands.',
        associatedConditions: ['Iron Deficiency & Anemia'],
        reportDate: '2026-09-12',
        confidenceScore: 0.98
      },
      {
        id: 'p2',
        reportId: 'rep_sep_2026',
        parameterName: 'Serum Ferritin',
        category: 'vitamins_minerals',
        value: 18,
        unit: 'ng/mL',
        referenceMin: 20,
        referenceMax: 150,
        status: 'low',
        plainExplanation: 'Your body’s deep iron storage depot. When low, your cells have trouble sustaining cellular ATP energy production.',
        youthRelevance: 'Key contributor to student brain fog, brittle nails, and post-workout exhaustion.',
        associatedConditions: ['Iron Deficiency & Anemia'],
        reportDate: '2026-09-12',
        confidenceScore: 0.97
      },
      {
        id: 'p3',
        reportId: 'rep_sep_2026',
        parameterName: '25-OH Vitamin D',
        category: 'vitamins_minerals',
        value: 24.2,
        unit: 'ng/mL',
        referenceMin: 30.0,
        referenceMax: 100.0,
        status: 'low',
        plainExplanation: 'Essential hormone precursor made in skin upon sun exposure. Under 30 ng/mL weakens immunity and mood regulation.',
        youthRelevance: 'Very common in students and desk workers who study indoors under artificial lighting.',
        associatedConditions: ['Vitamin D & B12 Deficiencies'],
        reportDate: '2026-09-12',
        confidenceScore: 0.99
      },
      {
        id: 'p4',
        reportId: 'rep_sep_2026',
        parameterName: 'Fasting Blood Glucose',
        category: 'metabolic',
        value: 86,
        unit: 'mg/dL',
        referenceMin: 70,
        referenceMax: 99,
        status: 'optimal',
        plainExplanation: 'Resting morning blood glucose is in the optimal healthy range.',
        youthRelevance: 'Rules out early pre-diabetes or fasting glucose dysregulation.',
        associatedConditions: ['Pre-Diabetes & Insulin Resistance'],
        reportDate: '2026-09-12',
        confidenceScore: 0.99
      },
      {
        id: 'p5',
        reportId: 'rep_sep_2026',
        parameterName: 'TSH (Thyroid Stimulating Hormone)',
        category: 'endocrine',
        value: 1.85,
        unit: 'uIU/mL',
        referenceMin: 0.45,
        referenceMax: 4.50,
        status: 'optimal',
        plainExplanation: 'Pituitary gland thyroid stimulation signal is in the optimal sweet spot (1.0 - 2.5 uIU/mL).',
        youthRelevance: 'Confirms healthy baseline metabolic rate and rules out subclinical hypothyroidism.',
        associatedConditions: ['Thyroid Disorders (Hypothyroidism & Hyperthyroidism)'],
        reportDate: '2026-09-12',
        confidenceScore: 0.98
      },
      {
        id: 'p6',
        reportId: 'rep_sep_2026',
        parameterName: 'LDL-C (Low-Density Lipoprotein)',
        category: 'lipids',
        value: 94,
        unit: 'mg/dL',
        referenceMin: 0,
        referenceMax: 100,
        status: 'optimal',
        plainExplanation: 'Optimal cardiovascular lipid profile reading below the 100 mg/dL target.',
        youthRelevance: 'Reflects healthy arterial protection and cardiovascular baseline.',
        associatedConditions: ['Dyslipidemia (High Cholesterol & Triglycerides)'],
        reportDate: '2026-09-12',
        confidenceScore: 0.96
      }
    ],
    doctorDiscussionPoints: [
      'Discuss gentle elemental oral iron supplementation (e.g. Iron bisglycinate) with Vitamin C for low ferritin (18 ng/mL).',
      'Review daily Vitamin D3 maintenance dose (1,000–2,000 IU/day) during heavy indoor semester months.',
      'Schedule a routine re-check in 3–4 months to monitor iron restoration.'
    ],
    preventiveTakeaways: [
      'Do not consume tea, coffee, or calcium antacids within 60 minutes of iron-rich meals.',
      'Spend 15 minutes in natural midday sunlight during lecture/work breaks.'
    ],
    createdAt: '2026-09-12T09:30:00Z'
  },
  {
    id: 'rep_apr_2026',
    userId: 'usr_alex_22',
    title: 'Routine Health Checkup & Blood Count',
    reportType: 'complete_blood_count',
    reportDate: '2026-04-18',
    fileName: 'Campus_Clinic_Routine_Spring2026.pdf',
    fileSize: 189000,
    status: 'completed',
    summary: 'Spring baseline showing Hemoglobin at 12.4 g/dL and Serum Ferritin at 26 ng/mL. Demonstrates a gradual summer decline in iron reserves.',
    parameters: [
      {
        id: 'p1_prior',
        reportId: 'rep_apr_2026',
        parameterName: 'Hemoglobin (Hb)',
        category: 'hematology',
        value: 12.4,
        unit: 'g/dL',
        referenceMin: 12.0,
        referenceMax: 15.5,
        status: 'optimal',
        plainExplanation: 'Was within the normal range during the spring semester.',
        youthRelevance: 'Tracks a -0.6 g/dL decrease compared to September.',
        reportDate: '2026-04-18',
        confidenceScore: 0.95
      },
      {
        id: 'p2_prior',
        reportId: 'rep_apr_2026',
        parameterName: 'Serum Ferritin',
        category: 'vitamins_minerals',
        value: 26,
        unit: 'ng/mL',
        referenceMin: 20,
        referenceMax: 150,
        status: 'borderline',
        plainExplanation: 'Was borderline (26 ng/mL) in spring and has continued downward to 18 ng/mL currently.',
        youthRelevance: 'Proves a chronic depletion pattern rather than an acute one-day dip.',
        reportDate: '2026-04-18',
        confidenceScore: 0.94
      },
      {
        id: 'p3_prior',
        reportId: 'rep_apr_2026',
        parameterName: '25-OH Vitamin D',
        category: 'vitamins_minerals',
        value: 28.5,
        unit: 'ng/mL',
        referenceMin: 30.0,
        referenceMax: 100.0,
        status: 'borderline',
        plainExplanation: 'Has remained in the sub-optimal 24–28 ng/mL band across multiple seasons.',
        youthRelevance: 'Confirms continuous indoor study exposure.',
        reportDate: '2026-04-18',
        confidenceScore: 0.95
      }
    ],
    doctorDiscussionPoints: [
      'Compare previous spring iron values against autumn readings.'
    ],
    preventiveTakeaways: [
      'Track diet consistency and consider proactive winter supplementation.'
    ],
    createdAt: '2026-04-18T11:00:00Z'
  }
];

export const SEED_DAILY_UPDATES: DailyHealthUpdate[] = [
  {
    id: 'log_today',
    userId: 'usr_alex_22',
    date: '2026-09-29',
    restingHeartRate: 71,
    bloodPressure: '118/76',
    weightKg: 62.1,
    energyLevel: 4,
    stressLevel: 2,
    mood: 'productive',
    waterGlasses: 7,
    sleepHours: 7.8,
    sleepQuality: 4,
    activityMinutes: 35,
    activityType: 'Brisk campus walk & bodyweight workout',
    screenTimeHours: 5.4,
    nutritionQuality: 'healthy_balanced',
    supplementsTaken: ['Iron + Vitamin C', 'Vitamin D3 (2000 IU)'],
    symptomsReported: ['Mild Neck Tension'],
    notes: 'Energy felt much better today after getting 15 mins of midday sun on the campus lawn.'
  },
  {
    id: 'log_yesterday',
    userId: 'usr_alex_22',
    date: '2026-09-28',
    restingHeartRate: 75,
    bloodPressure: '122/80',
    weightKg: 62.3,
    energyLevel: 2,
    stressLevel: 4,
    mood: 'stressed',
    waterGlasses: 4,
    sleepHours: 6.1,
    sleepQuality: 3,
    activityMinutes: 15,
    activityType: 'Stretching',
    screenTimeHours: 8.5,
    nutritionQuality: 'junk_fast_food',
    supplementsTaken: ['Vitamin D3 (2000 IU)'],
    symptomsReported: ['Headache', 'Brain Fog', 'Eye Strain'],
    notes: 'Exam preparation sprint until midnight. Too much coffee and skipped dinner.'
  },
  {
    id: 'log_2days_ago',
    userId: 'usr_alex_22',
    date: '2026-09-27',
    restingHeartRate: 73,
    bloodPressure: '120/78',
    weightKg: 62.0,
    energyLevel: 3,
    stressLevel: 3,
    mood: 'normal',
    waterGlasses: 6,
    sleepHours: 7.0,
    sleepQuality: 3,
    activityMinutes: 30,
    activityType: 'Cycling',
    screenTimeHours: 6.8,
    nutritionQuality: 'moderate',
    supplementsTaken: ['Iron + Vitamin C'],
    symptomsReported: [],
    notes: 'Standard lecture day. Library focus was steady.'
  }
];

export const SEED_HABIT_GOALS: HabitGoal[] = [
  {
    id: 'goal_water',
    userId: 'usr_alex_22',
    title: 'Daily Hydration (2,500 ml)',
    category: 'water',
    targetValue: 10, // 10 glasses = 2500ml
    currentValue: 7,
    unit: 'glasses',
    currentStreakDays: 5,
    bestStreakDays: 14,
    completedToday: false
  },
  {
    id: 'goal_sleep',
    userId: 'usr_alex_22',
    title: 'Sleep Duration (8 Hours)',
    category: 'sleep',
    targetValue: 8.0,
    currentValue: 7.8,
    unit: 'hours',
    currentStreakDays: 4,
    bestStreakDays: 9,
    completedToday: true
  },
  {
    id: 'goal_activity',
    userId: 'usr_alex_22',
    title: 'Physical Activity & Movement',
    category: 'activity',
    targetValue: 35,
    currentValue: 35,
    unit: 'minutes',
    currentStreakDays: 3,
    bestStreakDays: 12,
    completedToday: true
  },
  {
    id: 'goal_screen',
    userId: 'usr_alex_22',
    title: 'Digital Screen Curfew (< 6 Hours)',
    category: 'screen_time',
    targetValue: 6.0,
    currentValue: 5.4,
    unit: 'hours',
    currentStreakDays: 2,
    bestStreakDays: 6,
    completedToday: true
  },
  {
    id: 'goal_supplements',
    userId: 'usr_alex_22',
    title: 'Iron & Vitamin D Routine',
    category: 'medication',
    targetValue: 2,
    currentValue: 2,
    unit: 'doses',
    currentStreakDays: 8,
    bestStreakDays: 21,
    completedToday: true
  }
];

export const SEED_REMINDERS: HabitReminder[] = [
  {
    id: 'rem_1',
    userId: 'usr_alex_22',
    title: 'Mid-Morning Hydration (Glass 3 of 10)',
    category: 'water',
    time: '10:30',
    enabled: true,
    frequency: 'daily'
  },
  {
    id: 'rem_2',
    userId: 'usr_alex_22',
    title: 'Lunch Iron + Vitamin C (No tea/coffee for 1hr)',
    category: 'medication',
    time: '13:00',
    enabled: true,
    frequency: 'daily'
  },
  {
    id: 'rem_3',
    userId: 'usr_alex_22',
    title: '20-20-20 Eye & Posture Break',
    category: 'eye_break',
    time: '15:30',
    enabled: true,
    frequency: 'daily'
  },
  {
    id: 'rem_4',
    userId: 'usr_alex_22',
    title: 'Nocturnal Screen Amber Shift & Wind-down',
    category: 'sleep',
    time: '22:15',
    enabled: true,
    frequency: 'daily'
  }
];
