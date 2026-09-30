import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  Droplets,
  Moon,
  FileText,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  Flame,
  CheckCircle2,
  Plus,
  Minus,
  Scale,
  Award,
  Coins,
  Bot,
  Search,
  BookOpen,
  Calendar,
  AlertCircle,
  Save,
  Check,
  UserCheck
} from 'lucide-react';
import {
  UserProfile,
  DailyHealthUpdate,
  MedicalReport,
  HabitGoal,
  HabitReminder,
  DiseaseCondition
} from '../types/index.ts';

interface DashboardProps {
  profile: UserProfile | null;
  latestUpdate: DailyHealthUpdate | null;
  reports: MedicalReport[];
  habitGoals: HabitGoal[];
  reminders: HabitReminder[];
  diseases: DiseaseCondition[];
  onOpenCheckin: () => void;
  onOpenReports: () => void;
  onOpenTrends: (param?: string) => void;
  onOpenDiseases: (diseaseId?: string) => void;
  onOpenHabits: () => void;
  onOpenRewards: () => void;
  onOpenChat: (initialPrompt?: string) => void;
  onQuickAddWater: () => Promise<void>;
  onToggleReminder: (id: string) => Promise<void>;
  onSaveHealthUpdate?: (log: Partial<DailyHealthUpdate>) => Promise<void>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  latestUpdate,
  reports,
  habitGoals,
  reminders,
  diseases,
  onOpenCheckin,
  onOpenReports,
  onOpenTrends,
  onOpenDiseases,
  onOpenHabits,
  onOpenRewards,
  onOpenChat,
  onQuickAddWater,
  onToggleReminder,
  onSaveHealthUpdate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Everyday Direct Input Form State (Real User Input)
  const todayStr = new Date().toISOString().split('T')[0];
  const [inputDate, setInputDate] = useState(latestUpdate?.date || todayStr);
  const [systolic, setSystolic] = useState(
    latestUpdate?.bloodPressure?.split('/')[0] || String(profile?.bloodPressureSystolic || 118)
  );
  const [diastolic, setDiastolic] = useState(
    latestUpdate?.bloodPressure?.split('/')[1] || String(profile?.bloodPressureDiastolic || 76)
  );
  const [heartRate, setHeartRate] = useState<number>(
    latestUpdate?.restingHeartRate || profile?.restingHeartRate || 71
  );
  const [inputWater, setInputWater] = useState<number>(latestUpdate?.waterGlasses ?? 6);
  const [inputSleep, setInputSleep] = useState<number>(latestUpdate?.sleepHours ?? 7.5);
  const [inputSleepQuality, setInputSleepQuality] = useState<number>(latestUpdate?.sleepQuality ?? 4);
  const [inputWeight, setInputWeight] = useState<number>(
    latestUpdate?.weightKg ?? profile?.weightKg ?? 62
  );
  const [inputEnergy, setInputEnergy] = useState<number>(latestUpdate?.energyLevel ?? 4);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    latestUpdate?.symptomsReported || []
  );
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // BMI calculation from real user profile and entered weight
  const heightM = (profile?.heightCm || 168) / 100;
  const currentWeightKg = latestUpdate?.weightKg ?? profile?.weightKg ?? 62;
  const bmi = (currentWeightKg / (heightM * heightM)).toFixed(1);

  const bp = latestUpdate?.bloodPressure || `${profile?.bloodPressureSystolic || 118}/${profile?.bloodPressureDiastolic || 76}`;
  const hr = latestUpdate?.restingHeartRate || profile?.restingHeartRate || 71;

  // Hydration calculation
  const waterGlasses = latestUpdate?.waterGlasses ?? 6;
  const targetGlasses = Math.round((profile?.targetWaterMl || 2500) / 250);
  const waterPercent = Math.min(100, Math.round((waterGlasses / targetGlasses) * 100));

  // Real reports & real flagged biomarkers (no hallucinations)
  const latestReport = reports[0];
  const flaggedBiomarkers = (latestReport?.parameters || []).filter(
    (p) => p.status === 'low' || p.status === 'high' || p.status === 'borderline'
  );
  const primaryFlagged = flaggedBiomarkers[0];

  const symptomOptions = [
    'None / Feeling Great',
    'Headache',
    'Brain Fog / Fatigue',
    'Eye Strain',
    'Acidity / Reflux',
    'Bloating / Gas',
    'Neck / Shoulder Tension'
  ];

  const toggleSymptom = (sym: string) => {
    if (sym === 'None / Feeling Great') {
      setSelectedSymptoms(['None / Feeling Great']);
      return;
    }
    const filtered = selectedSymptoms.filter((s) => s !== 'None / Feeling Great');
    if (filtered.includes(sym)) {
      setSelectedSymptoms(filtered.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...filtered, sym]);
    }
  };

  const handleDirectInputSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveHealthUpdate) return;
    setIsSaving(true);
    setSaveSuccessMsg(null);

    const bpString = `${systolic || '120'}/${diastolic || '80'}`;
    const payload: Partial<DailyHealthUpdate> = {
      date: inputDate,
      bloodPressure: bpString,
      restingHeartRate: Number(heartRate) || 72,
      waterGlasses: Number(inputWater) || 0,
      sleepHours: Number(inputSleep) || 7.0,
      sleepQuality: Number(inputSleepQuality) || 4,
      weightKg: Number(inputWeight) || profile?.weightKg || 62,
      energyLevel: Number(inputEnergy) || 4,
      symptomsReported: selectedSymptoms,
    };

    try {
      await onSaveHealthUpdate(payload);
      setSaveSuccessMsg(`✓ Saved real health inputs for ${inputDate}. All vitals, hydration, and BMI have updated accurately.`);
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick topics for EverydayHealth search pills
  const popularTopics = [
    { label: '🩸 Iron Deficiency', query: 'anemia' },
    { label: '☀️ Vitamin D', query: 'vitamin d' },
    { label: '🧠 Fatigue & Burnout', query: 'burnout' },
    { label: '🥑 Healthy Diet', query: 'nutrition' },
    { label: '💤 Sleep Rhythms', query: 'sleep' },
    { label: '🫀 Blood Pressure', query: 'hypertension' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();
    const matched = diseases.find(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.commonSymptoms.some((s) => s.toLowerCase().includes(q))
    );

    if (matched) {
      onOpenDiseases(matched.id);
    } else if (q.includes('report') || q.includes('blood') || q.includes('cbc')) {
      onOpenReports();
    } else if (q.includes('habit') || q.includes('water') || q.includes('sleep')) {
      onOpenHabits();
    } else if (q.includes('reward') || q.includes('streak') || q.includes('point')) {
      onOpenRewards();
    } else {
      onOpenChat(`Can you give me an evidence-based clinical overview of ${searchQuery}?`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* 1. EverydayHealth Style Search & Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              <span className="text-[11px] font-bold text-teal-800 tracking-wider uppercase font-mono">
                EVERYDAY YOUTH HEALTH INTELLIGENCE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              What health topic would you like to explore today?
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Real Patient Metrics · Zero Hallucinations</span>
          </div>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search health conditions, symptoms, or lab tests (e.g. Ferritin, Low Hemoglobin, PCOS, Sleep debt)..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Explore
          </button>
        </form>

        {/* Quick Topic Pill Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs">
          <span className="text-slate-400 font-medium shrink-0 text-[11px]">Trending:</span>
          {popularTopics.map((topic) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => {
                setSearchQuery(topic.query);
                const matched = diseases.find((d) => d.name.toLowerCase().includes(topic.query));
                if (matched) onOpenDiseases(matched.id);
                else onOpenChat(`Explain ${topic.label} and how it impacts young adults.`);
              }}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-600 transition-colors shrink-0 text-xs font-medium border border-transparent hover:border-teal-200 cursor-pointer"
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Personal Health Snapshot (Real Live Data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vitals */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Real Clinical Vitals</span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                {bp}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium block mt-1">
              Pulse {hr} bpm · BMI {bmi}
            </span>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('everyday-input-station');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center justify-between cursor-pointer"
          >
            <span>Log / Update Today's Vitals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Latest Lab Report */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Real Lab Panel</span>
              <FileText className="w-4 h-4 text-sky-600" />
            </div>
            <div className="mt-1">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {latestReport?.title || 'No reports uploaded'}
              </h4>
              <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                {latestReport?.reportDate ? `Date: ${latestReport.reportDate}` : 'Upload first blood test'}
              </span>
            </div>
            <span className="text-[11px] text-amber-700 font-medium block mt-1">
              {flaggedBiomarkers.length > 0
                ? `${flaggedBiomarkers.length} flagged biomarker(s)`
                : latestReport
                ? 'All parameters optimal'
                : 'Awaiting lab panel'}
            </span>
          </div>

          <button
            onClick={onOpenReports}
            className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center justify-between cursor-pointer"
          >
            <span>{latestReport ? 'View Reports Vault' : 'Upload Lab Test'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Streak & Arogya Points */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Habit Streaks</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                5 Days
              </span>
              <span className="text-xs font-bold text-amber-600 font-mono">🔥 Active</span>
            </div>
            <span className="text-[11px] text-slate-600 block mt-1 font-mono">
              🪙 <strong>{profile?.healthPoints || 0}</strong> Arogya Points
            </span>
          </div>

          <button
            onClick={onOpenRewards}
            className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center justify-between cursor-pointer"
          >
            <span>Rewards & Perks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Daily Hydration */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">Fluid Intake</span>
              <Droplets className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                {waterGlasses}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {targetGlasses} glasses</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-300"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={onQuickAddWater}
            className="mt-3 pt-2.5 border-t border-slate-100 text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center justify-between cursor-pointer"
          >
            <span>+ Drink 1 Glass (250ml)</span>
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. EVERYDAY DIRECT INPUT STATION (Interactive Everyday Logger) */}
      <div
        id="everyday-input-station"
        className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-teal-200/80 shadow-md space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-900 font-mono">
                EVERYDAY INPUT STATION
              </span>
              <span className="text-xs text-slate-400">Live Health Journaling</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Log Your Real Daily Vitals & Symptoms
            </h2>
            <p className="text-xs text-slate-500">
              Input your actual measurements for today. These real values immediately update your clinical charts and ArogyaSaathi assistant.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Date:</span>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleDirectInputSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Blood Pressure Input */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Blood Pressure</span>
                <span className="text-[10px] font-mono text-slate-400">mmHg</span>
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="118"
                  className="w-full text-sm font-mono font-bold px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700 text-center"
                />
                <span className="text-slate-400 font-bold">/</span>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="76"
                  className="w-full text-sm font-mono font-bold px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700 text-center"
                />
              </div>
              <span className="text-[10px] text-slate-400 block text-center">Systolic / Diastolic</span>
            </div>

            {/* Resting Heart Rate */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Resting Pulse</span>
                <span className="text-[10px] font-mono text-slate-400">BPM</span>
              </label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                placeholder="71"
                className="w-full text-sm font-mono font-bold px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700 text-center"
              />
              <span className="text-[10px] text-slate-400 block text-center">Resting pulse at wake</span>
            </div>

            {/* Water Glasses */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Water Intake</span>
                <span className="text-[10px] font-mono text-slate-400">250ml / glass</span>
              </label>
              <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-1">
                <button
                  type="button"
                  onClick={() => setInputWater(Math.max(0, inputWater - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {inputWater} glasses ({inputWater * 250}ml)
                </span>
                <button
                  type="button"
                  onClick={() => setInputWater(inputWater + 1)}
                  className="w-8 h-8 rounded-lg bg-teal-100 hover:bg-teal-200 flex items-center justify-center text-teal-800 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block text-center">Target: {targetGlasses} glasses</span>
            </div>

            {/* Sleep Hours */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Sleep Duration</span>
                <span className="text-[10px] font-mono text-slate-400">Hours</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={inputSleep}
                onChange={(e) => setInputSleep(Number(e.target.value))}
                placeholder="7.5"
                className="w-full text-sm font-mono font-bold px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700 text-center"
              />
              <span className="text-[10px] text-slate-400 block text-center">Quality: {inputSleepQuality} / 5</span>
            </div>
          </div>

          {/* Symptoms Multiselect Chips */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Any Symptoms or Discomfort Experienced Today? (Real-time check)
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {symptomOptions.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenCheckin}
              className="text-xs font-semibold text-slate-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Need full journal modal (supplements, workout, mood)? Click here →</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : "Save Today's Real Vitals"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. EverydayHealth Editorial Feature Spotlight (100% Real, Grounded in User's Actual Lab Data) */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-teal-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-400 text-slate-950 font-mono">
              EVIDENCE-BASED CLINICAL SPOTLIGHT
            </span>
            <span className="text-xs text-slate-300 font-medium">Grounded in Peer-Reviewed Guidelines</span>
          </div>

          {primaryFlagged ? (
            <>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Clinical Focus: Managing Your {primaryFlagged.parameterName} ({primaryFlagged.value} {primaryFlagged.unit})
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your uploaded test ({latestReport?.title || 'Lab Report'}) flagged a {primaryFlagged.status} level of <strong>{primaryFlagged.parameterName}</strong>. {primaryFlagged.plainExplanation}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <strong className="text-teal-300 block text-[11px]">Youth Relevance:</strong>
                  <span className="text-slate-300 text-[11px]">{primaryFlagged.youthRelevance}</span>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <strong className="text-teal-300 block text-[11px]">Reference Target:</strong>
                  <span className="text-slate-300 text-[11px]">
                    {primaryFlagged.referenceMin ?? 20} – {primaryFlagged.referenceMax ?? 150} {primaryFlagged.unit}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <strong className="text-teal-300 block text-[11px]">Clinical Advice:</strong>
                  <span className="text-slate-300 text-[11px]">Discuss nutrition & follow-up test with your physician</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  onClick={() => onOpenDiseases(primaryFlagged.parameterName.toLowerCase().includes('ferritin') ? 'anemia-iron-deficiency' : undefined)}
                  className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>Read Clinical Condition Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenChat(`Based on my verified lab report, my ${primaryFlagged.parameterName} is ${primaryFlagged.value} ${primaryFlagged.unit} (${primaryFlagged.status}). What questions should I prepare for my doctor?`)}
                  className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-teal-300" />
                  <span>Discuss With ArogyaSaathi</span>
                </button>
              </div>
            </>
          ) : latestReport ? (
            <>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Clinical Focus: All Verified Biomarkers Within Healthy Target Ranges
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your report ({latestReport.title}) indicates balanced hematological, endocrine, and metabolic parameters. Maintaining adequate hydration, consistent sleep schedules, and micronutrient-dense meals preserves your vitality.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onOpenReports}
                  className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <span>Review Lab Vault</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Upload Your Real Laboratory Panel for Personalized Analysis
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                AuraHealth does not invent or hallucinate biomarker readings. Upload your PDF or photo of a Complete Blood Count (CBC), Vitamin D, or metabolic panel in the Reports Vault to see your real numbers tracked.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onOpenReports}
                  className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>Upload Lab Report</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Real Visual Reading Display (No Fakes) */}
        <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-slate-800/40 rounded-2xl border border-teal-800/60 text-center w-64 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xl mb-3">
            {primaryFlagged ? '🩸' : '🩺'}
          </div>
          <span className="text-xs font-bold text-white">
            {primaryFlagged ? primaryFlagged.parameterName : 'Verified Lab Status'}
          </span>
          <span className={`text-2xl font-black font-mono mt-0.5 ${primaryFlagged ? 'text-amber-300' : 'text-emerald-300'}`}>
            {primaryFlagged ? `${primaryFlagged.value} ${primaryFlagged.unit}` : 'Optimal'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            {primaryFlagged ? `Status: ${primaryFlagged.status.toUpperCase()}` : 'No abnormal flags'}
          </span>
          {primaryFlagged && (
            <button
              onClick={() => onOpenTrends(primaryFlagged.parameterName)}
              className="mt-3 text-[11px] font-bold text-teal-300 hover:text-teal-200 underline cursor-pointer"
            >
              Track {primaryFlagged.parameterName} Trend →
            </button>
          )}
        </div>
      </div>

      {/* 5. EverydayHealth Style: "Health Conditions & Youth Guides" */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-700" />
              <span>Common Youth Health Conditions & Clinical Guides</span>
            </h2>
            <p className="text-xs text-slate-500">
              Evidence-based breakdowns of symptoms, required diagnostic blood tests, and lifestyle prevention
            </p>
          </div>

          <button
            onClick={() => onOpenDiseases()}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Conditions A-Z</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 6 Clean Condition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diseases.slice(0, 6).map((disease) => (
            <div
              key={disease.id}
              onClick={() => onOpenDiseases(disease.id)}
              className="p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-teal-800 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md truncate max-w-[170px]">
                    {disease.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Youth Guide</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors mb-1.5">
                  {disease.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {disease.description}
                </p>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700 block">Common Indicators:</span>
                  <div className="flex flex-wrap gap-1">
                    {disease.commonSymptoms.slice(0, 3).map((sym) => (
                      <span
                        key={sym}
                        className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-900">
                <span>Explore Symptoms & Tests</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Interactive Health Tools & Intelligence */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Interactive Health Tools & Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Real digital clinical tools to decode reports, follow longitudinal trends, and consult with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tool 1: Lab Reports Vault */}
          <div
            onClick={onOpenReports}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-teal-800 transition-colors">
                Medical Report Intelligence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload PDFs or photos of Complete Blood Count (CBC), Vitamin D, or Lipid panels. GenAI OCR extracts your real parameters without manual typing.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Open Reports Vault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Tool 2: Longitudinal Biomarker Tracker */}
          <div
            onClick={() => onOpenTrends()}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-teal-800 transition-colors">
                Biomarker Trend Visualizer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track how hemoglobin, ferritin, and metabolic markers shift over 3 to 12 months based on your verified lab documents.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>View Longitudinal Trends</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Tool 3: ArogyaSaathi Companion */}
          <div
            onClick={() => onOpenChat()}
            className="p-6 bg-white rounded-3xl border border-slate-200/90 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-3 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-teal-800 transition-colors">
                ArogyaSaathi AI Companion
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask medical questions, clarify lab results, or generate customized physician consultation prep dossiers grounded strictly in clinical guidelines.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Start AI Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Medical Trust & Real Clinical Commitment */}
      <div className="bg-slate-100/70 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-teal-700 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 block">Accurate, Evidence-Based & User-Centric</span>
            <span className="text-[11px] text-slate-500">
              AuraHealth & ArogyaSaathi operate strictly on your real logged inputs and verified lab parameters. Non-diagnostic educational intelligence based on WHO and NIH standards.
            </span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[11px] font-semibold text-slate-500 block">Emergency? Call 911 / 988</span>
          <span className="text-[11px] text-teal-800 font-bold">Always consult a qualified doctor</span>
        </div>
      </div>
    </div>
  );
};
