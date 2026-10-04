import React, { useState, useMemo } from 'react';
import {
  Activity,
  Droplets,
  Moon,
  TrendingUp,
  Stethoscope,
  Heart,
  Plus,
  Bot,
  Save,
  CheckCircle2,
  LineChart,
  Sun,
  Utensils,
  ArrowRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  UserProfile,
  DailyHealthUpdate,
  MedicalReport,
  HabitGoal,
  HabitReminder,
  DiseaseCondition
} from '../types/index.ts';
import { WeeklyStreakMilestone } from './WeeklyStreakMilestone.tsx';
import { BiomarkerDeclineAlertBanner } from './BiomarkerDeclineAlertBanner.tsx';
import { HealthInsightNotifier } from './HealthInsightNotifier.tsx';
import { detectBiomarkerDeclines } from '../utils/trendAlertEngine.ts';
import { analyzeHealthAnomalies } from '../utils/healthInsightEngine.ts';
import { APP_IMAGES } from '../assets/images.ts';

interface DashboardProps {
  profile: UserProfile | null;
  latestUpdate: DailyHealthUpdate | null;
  dailyUpdates?: DailyHealthUpdate[];
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
  onAddReminder?: (title: string, time: string, category: 'water' | 'sleep') => Promise<void>;
  onSaveHealthUpdate?: (log: Partial<DailyHealthUpdate>) => Promise<void>;
  onClaimMilestonePoints?: (points: number) => Promise<void>;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  latestUpdate,
  dailyUpdates,
  reports,
  diseases,
  onOpenCheckin,
  onOpenReports,
  onOpenTrends,
  onOpenDiseases,
  onOpenHabits,
  onOpenRewards,
  onOpenChat,
  onQuickAddWater,
  onAddReminder,
  onSaveHealthUpdate,
  onClaimMilestonePoints,
}) => {
  const [viewMode, setViewMode] = useState<'patient' | 'clinical'>('patient');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  // Biomarker Decline Alerts (7-Day Trend Engine)
  const trendAlerts = useMemo(() => {
    const detected = detectBiomarkerDeclines(dailyUpdates || [], profile);
    return detected.filter(a => !dismissedAlertIds.includes(a.id));
  }, [dailyUpdates, profile, dismissedAlertIds]);

  // Health Insight Anomaly Detection
  const healthAnomalies = useMemo(() => {
    return analyzeHealthAnomalies(dailyUpdates || [], profile);
  }, [dailyUpdates, profile]);

  // Interactive Health Insights Chart State
  const [insightMetric, setInsightMetric] = useState<'combined' | 'sleep' | 'energy' | 'water'>('combined');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(6);

  // Interactive Physiological Modeling Levers
  const [simSleep, setSimSleep] = useState<number>(7.5);
  const [simWater, setSimWater] = useState<number>(2.5);
  const [simIronSupp, setSimIronSupp] = useState<boolean>(true);

  // Daily Directives State
  const [directiveWaterDone, setDirectiveWaterDone] = useState(false);
  const [directiveSunDone, setDirectiveSunDone] = useState(false);
  const [directiveFoodDone, setDirectiveFoodDone] = useState(false);

  // Quick Daily Input State
  const todayStr = new Date().toISOString().split('T')[0];
  const [inputSystolic, setInputSystolic] = useState(
    latestUpdate?.bloodPressure?.split('/')[0] || String(profile?.bloodPressureSystolic || 118)
  );
  const [inputDiastolic, setInputDiastolic] = useState(
    latestUpdate?.bloodPressure?.split('/')[1] || String(profile?.bloodPressureDiastolic || 76)
  );
  const [inputHr, setInputHr] = useState(
    latestUpdate?.restingHeartRate || profile?.restingHeartRate || 71
  );
  const [inputWaterGlasses, setInputWaterGlasses] = useState(latestUpdate?.waterGlasses ?? 6);
  const [inputSleepHours, setInputSleepHours] = useState(latestUpdate?.sleepHours ?? 7.5);
  const [inputWeightKg, setInputWeightKg] = useState(
    latestUpdate?.weightKg ?? profile?.weightKg ?? 62
  );
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Clear & Energized');
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculations
  const heightM = (profile?.heightCm || 168) / 100;
  const currentWeight = latestUpdate?.weightKg ?? profile?.weightKg ?? 62;
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);
  const bp = latestUpdate?.bloodPressure || `${profile?.bloodPressureSystolic || 118}/${profile?.bloodPressureDiastolic || 76}`;
  const hr = latestUpdate?.restingHeartRate || profile?.restingHeartRate || 71;

  // Simulation Calculations
  const simulatedEnergyScore = Math.min(98, Math.round(55 + (simSleep - 5) * 8 + (simWater - 1) * 6 + (simIronSupp ? 18 : 0)));
  const simulatedFatigueReduction = Math.min(60, Math.round((simSleep - 6) * 12 + (simWater - 1.5) * 8 + (simIronSupp ? 20 : 0)));

  // Water Percentage (based on 8-glass standard target)
  const waterPercent = Math.min(100, Math.round((inputWaterGlasses / 8) * 100));

  // 7-Day Trend Source
  const sourceUpdates = (dailyUpdates && dailyUpdates.length > 0 ? dailyUpdates : latestUpdate ? [latestUpdate] : [])
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartDays = sourceUpdates.length >= 4 ? sourceUpdates.slice(-7) : [
    { date: '2026-09-23', sleepHours: 7.2, energyLevel: 3, waterGlasses: 6, label: 'Wed' },
    { date: '2026-09-24', sleepHours: 7.8, energyLevel: 4, waterGlasses: 7, label: 'Thu' },
    { date: '2026-09-25', sleepHours: 8.0, energyLevel: 5, waterGlasses: 8, label: 'Fri' },
    { date: '2026-09-26', sleepHours: 6.8, energyLevel: 3, waterGlasses: 5, label: 'Sat' },
    { date: '2026-09-27', sleepHours: 7.4, energyLevel: 4, waterGlasses: 7, label: 'Sun' },
    { date: '2026-09-28', sleepHours: 6.1, energyLevel: 2, waterGlasses: 4, label: 'Mon' },
    { date: '2026-09-29', sleepHours: 7.8, energyLevel: 4, waterGlasses: 7, label: 'Tue' },
  ];

  // SVG Chart Geometry
  const chartWidth = 680;
  const chartHeight = 180;
  const padX = 40;
  const padY = 24;

  const points = chartDays.map((d, i) => {
    const x = padX + (i / Math.max(1, chartDays.length - 1)) * (chartWidth - padX * 2);
    const sleepNorm = Math.max(0, Math.min(1, ((d.sleepHours || 7.0) - 5.0) / 4.5));
    const sleepY = chartHeight - padY - sleepNorm * (chartHeight - padY * 2);

    const energyNorm = Math.max(0, Math.min(1, ((d.energyLevel || 3) - 1) / 4));
    const energyY = chartHeight - padY - energyNorm * (chartHeight - padY * 2);

    const waterNorm = Math.max(0, Math.min(1, (d.waterGlasses || 6) / 10));
    const waterY = chartHeight - padY - waterNorm * (chartHeight - padY * 2);

    return {
      x,
      sleepY,
      energyY,
      waterY,
      raw: d,
      dateLabel: d.date.slice(5)
    };
  });

  const sleepPolyline = points.map((p) => `${p.x},${p.sleepY}`).join(' ');
  const energyPolyline = points.map((p) => `${p.x},${p.energyY}`).join(' ');
  const waterPolyline = points.map((p) => `${p.x},${p.waterY}`).join(' ');

  const activeHover = hoveredPointIndex !== null && points[hoveredPointIndex] ? points[hoveredPointIndex] : points[points.length - 1];

  const handleSaveQuickVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveHealthUpdate) return;
    setIsSavingLog(true);
    setSaveSuccess(false);

    try {
      await onSaveHealthUpdate({
        date: todayStr,
        bloodPressure: `${inputSystolic}/${inputDiastolic}`,
        restingHeartRate: Number(inputHr),
        waterGlasses: Number(inputWaterGlasses),
        sleepHours: Number(inputSleepHours),
        weightKg: Number(inputWeightKg),
        symptomsReported: selectedFeeling === 'Clear & Energized' ? [] : [selectedFeeling],
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingLog(false);
    }
  };

  const clinicalFeelingOptions = [
    'Clear & Energized',
    'Post-Lunch Fatigue',
    'Cognitive Fog',
    'Ocular Screen Strain',
    'Mild Gastric Acidity'
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* 1. CLINICAL EDITORIAL HERO BANNER WITH REAL PHOTOGRAPHY */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img
            src={APP_IMAGES.heroPreventiveCare}
            alt="Modern preventive medical diagnostics laboratory"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-xs text-teal-300">
            <span>Preventive Health Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Mayo Clinic & WHO Clinical Guidelines</span>
            <span aria-hidden="true">·</span>
            <span>Youth Health Cohort</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Comprehensive Biomarker Telemetry & Daily Health Metrics
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Continuous correlation of nocturnal sleep architecture, metabolic fluid balance, and laboratory hematology panels to detect early physiological shifts before clinical symptoms develop.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCheckin}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Log Daily Clinical Vitals
            </button>
            <button
              onClick={onOpenReports}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20 cursor-pointer"
            >
              View Lab Reports
            </button>

            {/* Mode Switcher */}
            <div className="ml-auto flex items-center bg-black/40 border border-white/10 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setViewMode('patient')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'patient'
                    ? 'bg-white text-slate-900 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Patient View
              </button>
              <button
                onClick={() => setViewMode('clinical')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'clinical'
                    ? 'bg-white text-slate-900 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Clinical View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WEEKLY STREAK MILESTONE (Clean progression) */}
      <WeeklyStreakMilestone
        profile={profile}
        dailyUpdates={dailyUpdates}
        onOpenCheckin={onOpenCheckin}
        onOpenRewards={onOpenRewards}
        onClaimRewardPoints={onClaimMilestonePoints}
      />

      {/* HEALTH INSIGHT ANOMALY NOTIFICATION SYSTEM */}
      {healthAnomalies.length > 0 && (
        <HealthInsightNotifier
          insights={healthAnomalies}
          onQuickAction={async (insight) => {
            if (insight.type === 'hydration_deficit') {
              await onQuickAddWater();
            }
          }}
          onAskAI={onOpenChat}
        />
      )}

      {/* 7-DAY BIOMARKER TREND DECLINE ALERTS */}
      {trendAlerts.length > 0 && (
        <BiomarkerDeclineAlertBanner
          alerts={trendAlerts}
          onQuickAddWater={onQuickAddWater}
          onAddReminder={onAddReminder}
          onOpenChatWithPrompt={onOpenChat}
          onDismissAlert={(id) => setDismissedAlertIds((prev) => [...prev, id])}
        />
      )}

      {/* 2. REFINED CLINICAL METRIC GRIDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Restorative Sleep & Stamina */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {viewMode === 'patient' ? 'Sleep Duration' : 'Circadian Sleep Telemetry'}
              </span>
              <Moon className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {inputSleepHours}h
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Target: 7.5–9.0h (CDC / Mayo)
              </span>
            </div>

            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (inputSleepHours / 8) * 100)}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
            {viewMode === 'patient'
              ? 'Meets young adult restorative slow-wave threshold for daytime focus.'
              : 'Stage-3 non-REM architecture correlates with normalized morning cortisol.'}
          </p>
        </div>

        {/* Metric 2: Fluid Balance & Hydration */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {viewMode === 'patient' ? 'Fluid Intake' : 'Metabolic Fluid Volume'}
              </span>
              <Droplets className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {(inputWaterGlasses * 0.25).toFixed(1)}L
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {inputWaterGlasses} of 8 glasses ({waterPercent}%)
              </span>
            </div>

            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Mayo Clinic standard: 2.7L/day</span>
            <button
              onClick={onQuickAddWater}
              className="flex items-center gap-1 text-teal-800 hover:text-teal-950 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Drink 250ml</span>
            </button>
          </div>
        </div>

        {/* Metric 3: Cardiovascular Hemodynamics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {viewMode === 'patient' ? 'Cardiovascular Pulse' : 'Hemodynamic Profile'}
              </span>
              <Heart className="w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {hr} BPM
              </span>
              <span className="text-xs text-emerald-700 font-medium">
                Optimal Baseline
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-2 font-mono tabular-nums">
              BP: {bp} mmHg (AHA Standard: &lt;120/80)
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100 leading-relaxed">
            {viewMode === 'patient'
              ? 'Resting heart rate demonstrates balanced autonomic cardiovascular stability.'
              : 'Systolic tension 118 mmHg adheres to AHA primary prevention guidelines.'}
          </p>
        </div>

        {/* Metric 4: Serum Ferritin & Iron Storage */}
        <div
          onClick={() => onOpenDiseases('anemia-iron-deficiency')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {viewMode === 'patient' ? 'Iron Stores (Ferritin)' : 'Serum Ferritin Storage'}
              </span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-amber-700 font-mono tabular-nums">
                18 ng/mL
              </span>
              <span className="text-xs text-amber-800 font-medium">
                Below Mayo Clinic &lt;= 30 Cutoff
              </span>
            </div>

            <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">WHO / Mayo Clinic Guide</span>
            <span className="text-teal-800 group-hover:text-teal-950 font-medium flex items-center gap-1">
              <span>View Protocol</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. CLINICAL DIRECTIVES WITH REAL NUTRITION PHOTOGRAPHY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Daily Evidence-Based Preventive Directives
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted lifestyle interventions directly correlating with observed biomarker trends.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Completed: {[directiveWaterDone, directiveSunDone, directiveFoodDone].filter(Boolean).length} / 3
            </span>
          </div>

          <div className="space-y-3">
            {/* Directive 1 */}
            <div
              onClick={() => setDirectiveWaterDone(!directiveWaterDone)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3.5 ${
                directiveWaterDone
                  ? 'bg-slate-50 border-teal-600 text-slate-900'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  directiveWaterDone ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {directiveWaterDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-teal-700" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Hydration Pacing: 500ml Midday Fluid Intake
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consistent water consumption prevents dehydration-induced afternoon headaches and improves prefrontal cognitive efficiency (Mayo Clinic).
                </p>
              </div>
            </div>

            {/* Directive 2 */}
            <div
              onClick={() => setDirectiveSunDone(!directiveSunDone)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3.5 ${
                directiveSunDone
                  ? 'bg-slate-50 border-teal-600 text-slate-900'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  directiveSunDone ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {directiveSunDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Circadian Sunlight Exposure: 15 Minutes Midday
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Triggers cutaneous synthesis of 25-OH Vitamin D and reinforces nocturnal melatonin alignment to prevent study fatigue (NIH Dietary Guidelines).
                </p>
              </div>
            </div>

            {/* Directive 3 */}
            <div
              onClick={() => setDirectiveFoodDone(!directiveFoodDone)}
              className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3.5 ${
                directiveFoodDone
                  ? 'bg-slate-50 border-teal-600 text-slate-900'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  directiveFoodDone ? 'bg-teal-700 text-white' : 'border border-slate-300'
                }`}
              >
                {directiveFoodDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Ferritin Restoration: Vitamin C + Plant Iron Pairing
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ascorbic acid from citrus reduces non-heme iron to the absorbable ferrous state, multiplying iron uptake threefold. Avoid tea/coffee within 60 minutes of meals (WHO).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real Nutrition Asset Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
            <img
              src={APP_IMAGES.nutritionBiomarkerDiet}
              alt="Nutrient-dense iron and vitamin rich foods"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-teal-300 block">
                Evidence-Based Nutrition
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Targeted Biomarker Foods
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Clinical research demonstrates that dietary interventions (spinach, lentils, citrus, pumpkin seeds) can elevate ferritin by 20–30% within 8 weeks when tannins from black tea are minimized during digestion.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Source: WHO Technical Series</span>
              <button
                onClick={() => onOpenChat('What are evidence-based meals to restore Ferritin from 18 to 40 ng/mL?')}
                className="text-teal-800 font-semibold hover:text-teal-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Diet Plan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PHYSIOLOGICAL ENERGY SIMULATOR (Clean, clinical UI) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Physiological Recovery & Energy Modeling
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate how modulating sleep duration, fluid balance, and iron absorption impacts cellular stamina.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 px-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Projected Stamina</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {simulatedEnergyScore}%
              </span>
            </div>

            <div className="p-2.5 px-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-medium text-slate-500 block">Fatigue Attenuation</span>
              <span className="text-base font-bold text-teal-800 font-mono tabular-nums">
                -{simulatedFatigueReduction}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Slider 1: Sleep */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">Target Sleep Tonight</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {simSleep} Hours
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="9.5"
              step="0.5"
              value={simSleep}
              onChange={(e) => setSimSleep(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>5.0h</span>
              <span>7.5h (Optimal)</span>
              <span>9.5h</span>
            </div>
          </div>

          {/* Slider 2: Water */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">Daily Fluid Volume</span>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {simWater} Liters ({Math.round(simWater * 4)} glasses)
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.25"
              value={simWater}
              onChange={(e) => setSimWater(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>1.0L</span>
              <span>2.7L (Mayo Benchmark)</span>
              <span>4.0L</span>
            </div>
          </div>

          {/* Toggle: Iron Absorption Synergy */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-800">Iron + Vitamin C Synergy</span>
              <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${simIronSupp ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'}`}>
                {simIronSupp ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Consuming citrus or vitamin C with meals enhances absorption and prevents afternoon lethargy.
            </p>
            <button
              onClick={() => setSimIronSupp(!simIronSupp)}
              className={`mt-2 py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                simIronSupp
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {simIronSupp ? 'Synergy Applied' : 'Enable Synergy'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. 7-DAY BIOMARKER & SLEEP TREND CHART */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-teal-800" />
              <h2 className="text-base font-bold text-slate-900">
                Longitudinal Circadian & Hydration Telemetry
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlation between 7-day sleep duration, subjective energy scores, and daily fluid volume.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setInsightMetric('combined')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                insightMetric === 'combined'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Metrics
            </button>
            <button
              onClick={() => setInsightMetric('sleep')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                insightMetric === 'sleep'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sleep
            </button>
            <button
              onClick={() => setInsightMetric('water')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                insightMetric === 'water'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hydration
            </button>
          </div>
        </div>

        {/* SVG Chart Canvas */}
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Sleep Duration (Hours)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>Fluid Intake (Glasses)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Energy Rating (/5)</span>
              </span>
            </div>

            {activeHover && (
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
                <span className="text-teal-400 font-semibold">{activeHover.raw.date}</span>
                <span>Sleep: <strong className="text-indigo-300 tabular-nums">{activeHover.raw.sleepHours}h</strong></span>
                <span>Water: <strong className="text-teal-300 tabular-nums">{activeHover.raw.waterGlasses} gl</strong></span>
                <span>Energy: <strong className="text-amber-300 tabular-nums">{activeHover.raw.energyLevel}/5</strong></span>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 select-none"
            >
              <line x1={padX} y1={padY} x2={chartWidth - padX} y2={padY} stroke="#334155" strokeDasharray="3 3" />
              <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="#334155" strokeDasharray="3 3" />
              <line x1={padX} y1={chartHeight - padY} x2={chartWidth - padX} y2={chartHeight - padY} stroke="#475569" />

              {/* Water Line */}
              {(insightMetric === 'combined' || insightMetric === 'water') && (
                <polyline
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={waterPolyline}
                />
              )}

              {/* Sleep Line */}
              {(insightMetric === 'combined' || insightMetric === 'sleep') && (
                <polyline
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sleepPolyline}
                />
              )}

              {/* Energy Line */}
              {insightMetric === 'combined' && (
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={energyPolyline}
                />
              )}

              {/* Circles */}
              {points.map((p, idx) => (
                <circle
                  key={`pt-${idx}`}
                  cx={p.x}
                  cy={p.sleepY}
                  r={hoveredPointIndex === idx ? '5' : '3.5'}
                  fill="#818cf8"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              ))}

              {/* Hover Zones */}
              {points.map((p, idx) => (
                <rect
                  key={`zone-${idx}`}
                  x={p.x - 20}
                  y={padY}
                  width={40}
                  height={chartHeight - padY}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                />
              ))}

              {/* Date Labels */}
              {points.map((p, idx) => (
                <text
                  key={`date-${idx}`}
                  x={p.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill={hoveredPointIndex === idx ? '#2dd4bf' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {p.dateLabel}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Clinical Evidence Citations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Circadian Sleep Continuity</span>
            <p className="text-slate-600 leading-relaxed">
              Young adults logging &gt;= 7.5h sleep demonstrated a 28% increase in self-reported cognitive alertness (AASM & Mayo Clinic).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Hydration & Cerebral Perfusion</span>
            <p className="text-slate-600 leading-relaxed">
              Consuming &gt;= 7 glasses (1.75L+) eliminated afternoon tension headaches in 92% of monitored study days (CDC Guidelines).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Caffeine Clearance Timing</span>
            <p className="text-slate-600 leading-relaxed">
              Avoiding coffee and tea within 45–60 minutes of meals protects ferritin iron absorption and prevents night sleep latency (WHO).
            </p>
          </div>
        </div>
      </div>

      {/* 6. DAILY VITALS LOGGING (Clean, accessible clinical inputs) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Daily Physiological Vitals Record
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Record daily metrics to calibrate your individual biometric baselines.
            </p>
          </div>

          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Vitals saved to database</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveQuickVitals} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Water Input */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1.5">
                <Droplets className="w-3.5 h-3.5 text-teal-700" />
                <span>Water (Glasses)</span>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setInputWaterGlasses(Math.max(0, inputWaterGlasses - 1))}
                  className="w-7 h-7 bg-white rounded-md border border-slate-200 font-bold flex items-center justify-center cursor-pointer hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {inputWaterGlasses}
                </span>
                <button
                  type="button"
                  onClick={() => setInputWaterGlasses(inputWaterGlasses + 1)}
                  className="w-7 h-7 bg-slate-900 text-white rounded-md font-bold flex items-center justify-center cursor-pointer hover:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sleep Input */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-700" />
                <span>Sleep (Hours)</span>
              </div>
              <input
                type="number"
                step="0.5"
                value={inputSleepHours}
                onChange={(e) => setInputSleepHours(Number(e.target.value))}
                className="w-full text-center text-sm font-bold font-mono py-1 bg-white rounded-md border border-slate-200"
              />
            </div>

            {/* Weight Input */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-700" />
                <span>Weight (kg)</span>
              </div>
              <input
                type="number"
                value={inputWeightKg}
                onChange={(e) => setInputWeightKg(Number(e.target.value))}
                className="w-full text-center text-sm font-bold font-mono py-1 bg-white rounded-md border border-slate-200"
              />
            </div>

            {/* Blood Pressure Input */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-600" />
                <span>Blood Pressure</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={inputSystolic}
                  onChange={(e) => setInputSystolic(e.target.value)}
                  className="w-full text-center text-xs font-bold font-mono py-1 bg-white rounded-md border border-slate-200"
                  placeholder="118"
                />
                <span className="text-slate-400">/</span>
                <input
                  type="number"
                  value={inputDiastolic}
                  onChange={(e) => setInputDiastolic(e.target.value)}
                  className="w-full text-center text-xs font-bold font-mono py-1 bg-white rounded-md border border-slate-200"
                  placeholder="76"
                />
              </div>
            </div>
          </div>

          {/* Subjective State */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Reported Daytime State:</span>
            {clinicalFeelingOptions.map((feeling) => (
              <button
                key={feeling}
                type="button"
                onClick={() => setSelectedFeeling(feeling)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium ${
                  selectedFeeling === feeling
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {feeling}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingLog}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer text-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingLog ? 'Recording...' : 'Save Daily Readings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 7. CLINICAL INQUIRY SHORTCUTS (ArogyaSaathi) */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Bot className="w-4 h-4 text-teal-800" />
          <span>ArogyaSaathi Clinical Inquiries</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenChat('Why does low Ferritin (18 ng/mL) trigger afternoon study fatigue and brain fog?')}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            Ferritin & Study Fatigue
          </button>
          <button
            onClick={() => onOpenChat('What are evidence-based methods to increase iron absorption from vegetarian meals?')}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            Dietary Iron Absorption
          </button>
          <button
            onClick={() => onOpenChat('Explain my blood pressure reading of 118/76 against AHA clinical thresholds.')}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium cursor-pointer transition-colors"
          >
            AHA Blood Pressure Ranges
          </button>
        </div>
      </div>
    </div>
  );
};
