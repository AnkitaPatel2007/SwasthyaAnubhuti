import { UserProfile, DailySymptomLog, MedicalReport, HabitReminder, DailyWellnessPlan } from '../types/index.ts';

export const SEED_PROFILE: UserProfile = {
  id: 'usr_maya_22',
  email: 'maya.student@aurahealth.internal',
  name: 'Maya Chen',
  age: 21,
  gender: 'female',
  heightCm: 165,
  weightKg: 58,
  lifestyle: 'student',
  trackingMode: 'cycle_and_wellness',
  targetSleepHours: 8,
  targetWaterMl: 2500,
  cycleLengthDays: 29,
  periodLengthDays: 5,
  lastPeriodStartDate: '2026-09-16', // Cycle Day 14 today (Ovulation/Follicular transition)
  isTryingToConceive: false,
  anonymousMode: false
};

export const SEED_REPORTS: MedicalReport[] = [
  {
    id: 'rep_spring_2026',
    userId: 'usr_maya_22',
    title: 'Comprehensive Youth Wellness & CBC Panel',
    reportType: 'complete_blood_count',
    reportDate: '2026-09-08',
    fileName: 'Quest_Diagnostics_Student_Wellness_Sept2026.pdf',
    fileSize: 245000,
    status: 'completed',
    summary: 'Mild iron deficiency pattern with borderline low hemoglobin (11.8 g/dL) and low serum ferritin (18 ng/mL). Vitamin D is insufficient at 24 ng/mL, consistent with indoor university study routines.',
    parameters: [
      {
        id: 'p1',
        reportId: 'rep_spring_2026',
        parameterName: 'Hemoglobin',
        category: 'hematology',
        value: 11.8,
        unit: 'g/dL',
        referenceMin: 12.0,
        referenceMax: 15.5,
        status: 'low',
        plainExplanation: 'Your oxygen-carrying protein is slightly below the normal range, explaining why afternoon stairs or lecture focus can feel draining.',
        youthRelevance: 'Common in young adults with regular menstrual cycles or low dietary iron.',
        reportDate: '2026-09-08',
        confidenceScore: 0.98
      },
      {
        id: 'p2',
        reportId: 'rep_spring_2026',
        parameterName: 'Serum Ferritin',
        category: 'vitamins_minerals',
        value: 18,
        unit: 'ng/mL',
        referenceMin: 20,
        referenceMax: 150,
        status: 'low',
        plainExplanation: 'Your deep iron storage reserve is running low, even before full anemia develops.',
        youthRelevance: 'A primary cause of student fatigue, fragile nails, and post-study exhaustion.',
        reportDate: '2026-09-08',
        confidenceScore: 0.96
      },
      {
        id: 'p3',
        reportId: 'rep_spring_2026',
        parameterName: '25-OH Vitamin D',
        category: 'vitamins_minerals',
        value: 24.2,
        unit: 'ng/mL',
        referenceMin: 30.0,
        referenceMax: 100.0,
        status: 'low',
        plainExplanation: 'Below the optimal threshold (30–60 ng/mL). Can contribute to sluggish mornings and lower immunity.',
        youthRelevance: 'Very common during semesters with heavy indoor study.',
        reportDate: '2026-09-08',
        confidenceScore: 0.97
      },
      {
        id: 'p4',
        reportId: 'rep_spring_2026',
        parameterName: 'Fasting Blood Glucose',
        category: 'metabolic',
        value: 86,
        unit: 'mg/dL',
        referenceMin: 70,
        referenceMax: 99,
        status: 'optimal',
        plainExplanation: 'Optimal blood sugar regulation after overnight fast.',
        youthRelevance: 'Healthy insulin sensitivity baseline.',
        reportDate: '2026-09-08',
        confidenceScore: 0.99
      },
      {
        id: 'p5',
        reportId: 'rep_spring_2026',
        parameterName: 'TSH (Thyroid)',
        category: 'endocrine',
        value: 1.85,
        unit: 'uIU/mL',
        referenceMin: 0.45,
        referenceMax: 4.50,
        status: 'optimal',
        plainExplanation: 'Your thyroid metabolic master switch is in the sweet spot for young adults.',
        youthRelevance: 'Rules out primary thyroid slowdown as the cause of tiredness.',
        reportDate: '2026-09-08',
        confidenceScore: 0.98
      }
    ],
    doctorDiscussionPoints: [
      'Ask whether an elemental iron supplement or dietary iron increase is recommended for ferritin (18 ng/mL).',
      'Discuss Vitamin D3 supplementation (e.g. 1000-2000 IU/day) during heavy indoor semester months.',
      'Re-check CBC and Ferritin in 3-4 months to monitor recovery.'
    ],
    createdAt: '2026-09-08T10:14:00Z'
  },
  {
    id: 'rep_prior_2026',
    userId: 'usr_maya_22',
    title: 'Routine Health Checkup & Blood Count',
    reportType: 'complete_blood_count',
    reportDate: '2026-04-12',
    fileName: 'Campus_Health_Lab_April2026.pdf',
    fileSize: 189000,
    status: 'completed',
    summary: 'Previous baseline showing hemoglobin was 12.4 g/dL and Vitamin D was 28 ng/mL.',
    parameters: [
      {
        id: 'p1_prior',
        reportId: 'rep_prior_2026',
        parameterName: 'Hemoglobin',
        category: 'hematology',
        value: 12.4,
        unit: 'g/dL',
        referenceMin: 12.0,
        referenceMax: 15.5,
        status: 'optimal',
        plainExplanation: 'Was within normal limits in April.',
        youthRelevance: 'Shows a slight downward trend over summer semester.',
        reportDate: '2026-04-12',
        confidenceScore: 0.96
      },
      {
        id: 'p2_prior',
        reportId: 'rep_prior_2026',
        parameterName: 'Serum Ferritin',
        category: 'vitamins_minerals',
        value: 26,
        unit: 'ng/mL',
        referenceMin: 20,
        referenceMax: 150,
        status: 'borderline',
        plainExplanation: 'Was borderline in April and has dipped to 18 ng/mL currently.',
        youthRelevance: 'Demonstrates gradual depletion of iron reserves.',
        reportDate: '2026-04-12',
        confidenceScore: 0.94
      },
      {
        id: 'p3_prior',
        reportId: 'rep_prior_2026',
        parameterName: '25-OH Vitamin D',
        category: 'vitamins_minerals',
        value: 28.5,
        unit: 'ng/mL',
        referenceMin: 30.0,
        referenceMax: 100.0,
        status: 'borderline',
        plainExplanation: 'Borderline range.',
        youthRelevance: 'Has remained under 30 ng/mL across both spring and fall.',
        reportDate: '2026-04-12',
        confidenceScore: 0.95
      }
    ],
    doctorDiscussionPoints: [
      'Compare previous iron values against current levels.'
    ],
    createdAt: '2026-04-12T14:30:00Z'
  }
];

export const SEED_SYMPTOM_LOGS: DailySymptomLog[] = [
  {
    id: 'log_today',
    userId: 'usr_maya_22',
    date: '2026-09-29',
    cramps: 'none',
    headache: false,
    bloating: false,
    breastTenderness: false,
    fatigueLevel: 2,
    skinCondition: 'clear',
    digestion: 'normal',
    mood: 'focused',
    stressLevel: 2,
    mentalFocus: 4,
    sleepHours: 7.5,
    sleepQuality: 4,
    waterGlasses: 8,
    exerciseMinutes: 35,
    exerciseType: 'Brisk walk & Pilates',
    caffeineCups: 1,
    supplementsTaken: ['Iron + Vitamin C', 'Vitamin D3 (2000 IU)'],
    periodFlow: 'none',
    notes: 'Energy felt much higher today! Got midday sunshine on the campus lawn.'
  },
  {
    id: 'log_yesterday',
    userId: 'usr_maya_22',
    date: '2026-09-28',
    cramps: 'none',
    headache: false,
    bloating: true,
    breastTenderness: false,
    fatigueLevel: 3,
    skinCondition: 'breakouts',
    digestion: 'bloated',
    mood: 'stressed',
    stressLevel: 4,
    mentalFocus: 3,
    sleepHours: 6.2,
    sleepQuality: 3,
    waterGlasses: 5,
    exerciseMinutes: 20,
    exerciseType: 'Light yoga',
    caffeineCups: 3,
    supplementsTaken: ['Vitamin D3 (2000 IU)'],
    periodFlow: 'none',
    notes: 'Exam prep until midnight, drank too much coffee.'
  },
  {
    id: 'log_2days_ago',
    userId: 'usr_maya_22',
    date: '2026-09-27',
    cramps: 'none',
    headache: true,
    bloating: false,
    breastTenderness: false,
    fatigueLevel: 4,
    skinCondition: 'dry',
    digestion: 'normal',
    mood: 'low',
    stressLevel: 3,
    mentalFocus: 2,
    sleepHours: 5.8,
    sleepQuality: 2,
    waterGlasses: 4,
    exerciseMinutes: 0,
    caffeineCups: 2,
    supplementsTaken: [],
    periodFlow: 'none',
    notes: 'Afternoon headache, screen time was over 9 hours.'
  },
  {
    id: 'log_3days_ago',
    userId: 'usr_maya_22',
    date: '2026-09-26',
    cramps: 'none',
    headache: false,
    bloating: false,
    breastTenderness: false,
    fatigueLevel: 2,
    skinCondition: 'clear',
    digestion: 'normal',
    mood: 'energetic',
    stressLevel: 2,
    mentalFocus: 4,
    sleepHours: 8.1,
    sleepQuality: 5,
    waterGlasses: 9,
    exerciseMinutes: 45,
    exerciseType: 'Cycling',
    caffeineCups: 1,
    supplementsTaken: ['Iron + Vitamin C', 'Vitamin D3 (2000 IU)'],
    periodFlow: 'none'
  }
];

export const SEED_REMINDERS: HabitReminder[] = [
  {
    id: 'rem_1',
    userId: 'usr_maya_22',
    title: 'Hydration Reset (Glass 3 of 8)',
    category: 'water',
    time: '11:00',
    enabled: true,
    frequency: 'daily'
  },
  {
    id: 'rem_2',
    userId: 'usr_maya_22',
    title: 'Iron + Vitamin C with lunch (No tea/coffee)',
    category: 'supplement',
    time: '13:00',
    enabled: true,
    frequency: 'daily'
  },
  {
    id: 'rem_3',
    userId: 'usr_maya_22',
    title: '20-20-20 Eye & Posture Break',
    category: 'movement',
    time: '15:30',
    enabled: true,
    frequency: 'daily'
  },
  {
    id: 'rem_4',
    userId: 'usr_maya_22',
    title: 'Evening Digital Curfew & Warm Tea',
    category: 'sleep',
    time: '22:30',
    enabled: true,
    frequency: 'daily'
  }
];

export const SEED_WELLNESS_PLAN: DailyWellnessPlan = {
  id: 'plan_today',
  userId: 'usr_maya_22',
  date: '2026-09-29',
  focusTheme: 'Ovulation/Estrogen Window Energy & Iron Replenishment',
  circadianAdvice: 'Estrogen is near its peak today (Cycle Day 14). Your brain has high verbal fluency and stamina. Capitalize on focus early, and protect iron absorption at midday.',
  routines: [
    {
      id: 'r_1',
      timeSlot: 'morning',
      title: '500ml Mineral Water & 10 Min Natural Light',
      description: 'Anchor cortisol awakening response. Avoid looking at phone notifications during the first 10 minutes.',
      iconName: 'Sun',
      completed: true
    },
    {
      id: 'r_2',
      timeSlot: 'morning',
      title: 'Deep Focus Block (Study / Creative Work)',
      description: 'Prefrontal cortex focus is highest between 9:00 AM and 11:30 AM.',
      iconName: 'Brain',
      completed: true
    },
    {
      id: 'r_3',
      timeSlot: 'midday',
      title: 'Iron-Rich Lunch + Citrus Bell Peppers',
      description: 'Lentils/quinoa or grilled protein paired with vitamin C. Wait 60 mins before having caffeine.',
      iconName: 'Salad',
      completed: false
    },
    {
      id: 'r_4',
      timeSlot: 'evening',
      title: 'Movement & Posture Realignment (35 Mins)',
      description: 'Brisk walk, yoga, or Pilates to open thoracic spine after sitting at desk.',
      iconName: 'Activity',
      completed: false
    },
    {
      id: 'r_5',
      timeSlot: 'night',
      title: 'Magnesium + Amber Night Screen Shift',
      description: 'Warm shower and 15 mins reading to signal melatonin secretion for restorative deep sleep.',
      iconName: 'Moon',
      completed: false
    }
  ],
  biomarkerTip: 'Remember: Your Ferritin was 18 ng/mL. Consistent iron intake paired with Vitamin C over 6–8 weeks is key to replenishing bone marrow stores.'
};
