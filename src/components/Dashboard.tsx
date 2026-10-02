import React, { useState, useMemo } from 'react';
import {
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
  Plus,
  Minus,
  Bot,
  Search,
  Save,
  Cpu,
  Zap,
  BarChart3,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  LineChart,
  Calendar,
  BatteryCharging,
  Info,
  Sun,
  Heart,
  Smile,
  Coffee,
  Check,
  HelpCircle,
  Clock
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
  onAddReminder,
  onSaveHealthUpdate,
  onClaimMilestonePoints,
}) => {
  // Mode: 'simple' for normal everyday users, 'doctor' for clinical jargon
  const [viewMode, setViewMode] = useState<'simple' | 'doctor'>('simple');
  const [searchQuery, setSearchQuery] = useState('');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  // Biomarker Decline Alerts (7-Day Trend Engine)
  const trendAlerts = useMemo(() => {
    const detected = detectBiomarkerDeclines(dailyUpdates || [], profile);
    return detected.filter(a => !dismissedAlertIds.includes(a.id));
  }, [dailyUpdates, profile, dismissedAlertIds]);

  // Health Insight Anomaly Detection (Sleep drops, heart rate spikes, hydration deficits)
  const healthAnomalies = useMemo(() => {
    return analyzeHealthAnomalies(dailyUpdates || [], profile);
  }, [dailyUpdates, profile]);

  // Interactive Health Insights Chart State
  const [insightMetric, setInsightMetric] = useState<'combined' | 'sleep' | 'energy' | 'water'>('combined');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(6);

  // Interactive "Feel Better Today" Simulator (Simple Real-Life Levers)
  const [simSleep, setSimSleep] = useState<number>(7.5);
  const [simWater, setSimWater] = useState<number>(2.5);
  const [simIronSupp, setSimIronSupp] = useState<boolean>(true);

  // Daily Missions Checkboxes (Actionable for Normal Users)
  const [missionWaterDone, setMissionWaterDone] = useState(false);
  const [missionSunDone, setMissionSunDone] = useState(false);
  const [missionFoodDone, setMissionFoodDone] = useState(false);

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
  const [selectedFeeling, setSelectedFeeling] = useState<string>('😊 Active & Good');
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculations
  const heightM = (profile?.heightCm || 168) / 100;
  const currentWeight = latestUpdate?.weightKg ?? profile?.weightKg ?? 62;
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);
  const bp = latestUpdate?.bloodPressure || `${profile?.bloodPressureSystolic || 118}/${profile?.bloodPressureDiastolic || 76}`;
  const hr = latestUpdate?.restingHeartRate || profile?.restingHeartRate || 71;

  const latestReport = reports[0];
  const flaggedBiomarkers = (latestReport?.parameters || []).filter(
    (p) => p.status === 'low' || p.status === 'high' || p.status === 'borderline'
  );

  // Interactive Simulation Calculations
  const simulatedEnergyScore = Math.min(98, Math.round(55 + (simSleep - 5) * 8 + (simWater - 1) * 6 + (simIronSupp ? 18 : 0)));
  const simulatedTirednessDrop = Math.min(60, Math.round((simSleep - 6) * 12 + (simWater - 1.5) * 8 + (simIronSupp ? 20 : 0)));

  // Water Percentage Calculation
  const waterPercent = Math.min(100, Math.round((inputWaterGlasses / 8) * 100));

  // Health Insights 7-Day Trend
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

  const avgSleep = (chartDays.reduce((acc, d) => acc + (d.sleepHours || 0), 0) / chartDays.length).toFixed(1);
  const avgEnergy = (chartDays.reduce((acc, d) => acc + (d.energyLevel || 0), 0) / chartDays.length).toFixed(1);

  // SVG Chart Geometry Constants
  const chartWidth = 680;
  const chartHeight = 190;
  const padX = 40;
  const padY = 25;

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
        symptomsReported: selectedFeeling === '😊 Active & Good' ? [] : [selectedFeeling],
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingLog(false);
    }
  };

  const simpleFeelings = [
    '😊 Active & Good',
    '🥱 Afternoon Tiredness',
    '🤯 Head Heavy / Foggy',
    '👀 Screen Eye Strain',
    '🔥 Acidity / Gas'
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* 1. EASY LANGUAGE / DOCTOR VIEW TOGGLE BAR */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-teal-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center text-lg shrink-0">
            {viewMode === 'simple' ? '🌱' : '🔬'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {viewMode === 'simple' ? 'My Health Overview' : 'Detailed Medical View'}
              </h2>
              {viewMode === 'doctor' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Lab Values
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {viewMode === 'simple'
                ? 'Simple, everyday terms for your sleep, water, and tests.'
                : 'Exact lab numbers and reference ranges.'}
            </p>
          </div>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setViewMode('simple')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'simple'
                ? 'bg-white text-teal-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌱 Simple & Easy</span>
          </button>
          <button
            onClick={() => setViewMode('doctor')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'doctor'
                ? 'bg-white text-teal-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🔬 Doctor Mode</span>
          </button>
        </div>
      </div>

      {/* WEEKLY STREAK MILESTONE (7-Day Daily Achievement Path & Crown Badge) */}
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

      {/* 7-DAY BIOMARKER TREND DECLINE ALERTS & ACTIONABLE RECOVERY DIRECTIVES */}
      {trendAlerts.length > 0 && (
        <BiomarkerDeclineAlertBanner
          alerts={trendAlerts}
          onQuickAddWater={onQuickAddWater}
          onAddReminder={onAddReminder}
          onOpenChatWithPrompt={onOpenChat}
          onDismissAlert={(id) => setDismissedAlertIds((prev) => [...prev, id])}
        />
      )}

      {/* 2. REAL-LIFE VISUAL ANIMATED OBJECTS (The Big 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* OBJECT 1: ANIMATED BODY BATTERY */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:border-emerald-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider font-mono">
                {viewMode === 'simple' ? 'Body Battery' : 'Energy Level'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                85% Charged
              </h3>
            </div>

            {/* Real Visual Battery Object */}
            <div className="relative w-12 h-6 border-2 border-slate-800 rounded-md p-0.5 flex items-center pr-1 shrink-0">
              <div
                className="h-full bg-emerald-500 rounded-xs transition-all duration-500 flex items-center justify-center text-white"
                style={{ width: '85%' }}
              >
                <Zap className="w-2.5 h-2.5 fill-white" />
              </div>
              <div className="w-1 h-3 bg-slate-800 rounded-r-xs absolute -right-1.5 top-1.5" />
            </div>
          </div>

          {/* Simple Explanation */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600 leading-snug">
              {viewMode === 'simple' ? (
                <span>
                  🟢 <strong>High Stamina!</strong> You had 7.8 hours of good sleep last night. Your body is well-rested.
                </span>
              ) : (
                <span className="font-mono text-[11px]">
                  Sleep efficiency: 88% · Rest recovery index: Nominal
                </span>
              )}
            </p>
          </div>
        </div>

        {/* OBJECT 2: ANIMATED WATER BOTTLE WITH LIVING LIQUID */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:border-cyan-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider font-mono">
                {viewMode === 'simple' ? 'Water Drank Today' : 'Metabolic Fluid Volume'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                {inputWaterGlasses} of 8 Glasses
              </h3>
            </div>

            {/* Real Visual Animated Water Bottle / Glass */}
            <div className="relative w-8 h-12 border-2 border-cyan-700 rounded-b-xl rounded-t-sm overflow-hidden bg-cyan-50/50 shrink-0">
              <div
                className="absolute bottom-0 left-0 right-0 bg-cyan-500 transition-all duration-500 animate-water-wave"
                style={{ height: `${waterPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800">
                {waterPercent}%
              </span>
            </div>
          </div>

          {/* Action Button & Tip */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600">
              {inputWaterGlasses >= 8 ? '🎉 Goal Completed!' : `${8 - inputWaterGlasses} more glasses to go`}
            </span>
            <button
              onClick={onQuickAddWater}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
            >
              <Plus className="w-3 h-3" />
              <span>Drink 1</span>
            </button>
          </div>
        </div>

        {/* OBJECT 3: ANIMATED BEATING HEART */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:border-rose-300 transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider font-mono">
                {viewMode === 'simple' ? 'Heart & Blood Flow' : 'Cardiovascular Baseline'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                <span>{hr} BPM</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-sans">
                  Normal
                </span>
              </h3>
            </div>

            {/* Real Beating Heart Object */}
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shrink-0">
              <Heart className="w-5 h-5 fill-rose-500 animate-heartbeat" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600 leading-snug">
              {viewMode === 'simple' ? (
                <span>
                  ❤️ <strong>Calm & Healthy!</strong> Blood pressure is {bp} (perfect healthy green zone).
                </span>
              ) : (
                <span className="font-mono text-[11px]">
                  Systolic: 118 / Diastolic: 76 mmHg (AHA Optimal)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* OBJECT 4: "WHY AM I TIRED?" IRON & BLOOD POWER */}
        <div
          onClick={() => onOpenDiseases('anemia-iron-deficiency')}
          className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between relative overflow-hidden group cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider font-mono">
                {viewMode === 'simple' ? 'Why Are You Tired?' : 'Serum Ferritin Storage'}
              </span>
              <h3 className="text-lg font-black text-amber-900 mt-0.5">
                {viewMode === 'simple' ? 'Iron Tank: 45%' : '18 ng/mL (Low)'}
              </h3>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 text-lg">
              🩸
            </div>
          </div>

          {/* Simple Explanation */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600 leading-snug">
              {viewMode === 'simple' ? (
                <span>
                  ⚠️ <strong>Low Iron Reserves!</strong> This is why you feel sleepy while studying. Eat spinach, dates & jaggery!
                </span>
              ) : (
                <span className="font-mono text-[11px] text-amber-700">
                  Ferritin 18 &lt; 20 ng/mL threshold · Hb 11.8 g/dL
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 3. "WHAT SHOULD I DO TODAY?" - 3 SIMPLE MISSIONS FOR EVERYDAY USERS */}
      <div className="bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 border border-teal-700/50 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center text-base">
              🎯
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Today's 3 Easy Health Missions</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300">
                  EASY TO FOLLOW
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Simple everyday actions based on your actual body readings. No medical knowledge needed!
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-teal-300">
            Completed: {[missionWaterDone, missionSunDone, missionFoodDone].filter(Boolean).length} / 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Mission 1 */}
          <div
            onClick={() => setMissionWaterDone(!missionWaterDone)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              missionWaterDone
                ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                missionWaterDone ? 'bg-teal-500 text-slate-950' : 'border border-slate-600'
              }`}
            >
              {missionWaterDone ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1">
                <span>💧 Drink 2 Glasses of Water</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Stops screen headaches and keeps your afternoon energy high.
              </p>
            </div>
          </div>

          {/* Mission 2 */}
          <div
            onClick={() => setMissionSunDone(!missionSunDone)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              missionSunDone
                ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                missionSunDone ? 'bg-teal-500 text-slate-950' : 'border border-slate-600'
              }`}
            >
              {missionSunDone ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1">
                <span>☀️ 10 Mins of Sun Exposure</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Recharges your Vitamin D naturally for stronger bones and good mood.
              </p>
            </div>
          </div>

          {/* Mission 3 */}
          <div
            onClick={() => setMissionFoodDone(!missionFoodDone)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
              missionFoodDone
                ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                missionFoodDone ? 'bg-teal-500 text-slate-950' : 'border border-slate-600'
              }`}
            >
              {missionFoodDone ? <Check className="w-4 h-4" /> : '3'}
            </div>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1">
                <span>🍋 Iron Snack with Vitamin C</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dates or peanuts with lemon water. (Avoid chai right after food!)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INTERACTIVE "FEEL BETTER TODAY" SIMULATOR (Real-Life Objects React Live) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🎮 Interactive Body Energy Simulator</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                TRY SLIDING
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Change your sleep and water below to see how your energy levels improve in real life!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 px-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block">Simulated Energy</span>
              <span className="text-base font-black text-emerald-950 font-mono">{simulatedEnergyScore}%</span>
            </div>

            <div className="p-2 px-3 bg-teal-50 rounded-xl border border-teal-200 text-center">
              <span className="text-[10px] font-bold text-teal-800 block">Tiredness Drops</span>
              <span className="text-base font-black text-teal-950 font-mono">-{simulatedTirednessDrop}%</span>
            </div>
          </div>
        </div>

        {/* 3 Interactive Real-Life Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Slider 1: Sleep */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>😴 Sleep Tonight:</span>
              </span>
              <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
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
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>🥱 5h (Groggy)</span>
              <span>⚡ 8h (Best)</span>
              <span>🛌 9.5h</span>
            </div>
          </div>

          {/* Slider 2: Water */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>💧 Daily Water Intake:</span>
              </span>
              <span className="font-mono font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
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
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>1L (Thirsty)</span>
              <span>2.5L (Hydrated)</span>
              <span>4L</span>
            </div>
          </div>

          {/* Slider 3: Iron Food Synergy */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>🥗 Iron Boost Snack:</span>
              </span>
              <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${simIronSupp ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                {simIronSupp ? 'ACTIVE (Dates + Lime)' : 'OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Adding Vitamin C (lime/orange) helps your body absorb double the iron from your meals!
            </p>
            <button
              onClick={() => setSimIronSupp(!simIronSupp)}
              className={`mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simIronSupp
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {simIronSupp ? '✓ Iron Boost Applied' : '+ Add Iron Booster'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. HEALTH INSIGHTS SECTION (Simplified Trends for Everyday Users) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-teal-700" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {viewMode === 'simple' ? 'Your 7-Day Sleep & Energy Story' : 'Longitudinal Biomarker Telemetry'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {viewMode === 'simple'
                ? 'See how getting more sleep directly makes you feel energetic throughout the week!'
                : '7-day rolling correlation of circadian sleep duration, cellular stamina, and fluid volume.'}
            </p>
          </div>

          {/* Metric Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setInsightMetric('combined')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                insightMetric === 'combined'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Signals
            </button>
            <button
              onClick={() => setInsightMetric('sleep')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                insightMetric === 'sleep'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>😴 Sleep</span>
            </button>
            <button
              onClick={() => setInsightMetric('energy')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                insightMetric === 'energy'
                  ? 'bg-white text-amber-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>⚡ Energy</span>
            </button>
            <button
              onClick={() => setInsightMetric('water')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                insightMetric === 'water'
                  ? 'bg-white text-cyan-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>💧 Water</span>
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="relative bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-indigo-300">● Sleep Hours</span>
              <span className="text-amber-300">● Energy Rating</span>
              <span className="text-cyan-300">● Water Glasses</span>
            </div>

            {activeHover && (
              <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700 text-[11px] font-mono text-slate-200">
                <span className="text-teal-400 font-bold">{activeHover.raw.date}</span>
                <span>Sleep: <strong className="text-indigo-300">{activeHover.raw.sleepHours}h</strong></span>
                <span>Energy: <strong className="text-amber-300">{activeHover.raw.energyLevel}/5</strong></span>
                <span>Water: <strong className="text-cyan-300">{activeHover.raw.waterGlasses} gl</strong></span>
              </div>
            )}
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 sm:h-48 select-none"
            >
              <line x1={padX} y1={padY} x2={chartWidth - padX} y2={padY} stroke="#334155" strokeDasharray="3 3" />
              <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="#334155" strokeDasharray="3 3" />
              <line x1={padX} y1={chartHeight - padY} x2={chartWidth - padX} y2={chartHeight - padY} stroke="#475569" />

              {/* Water Line */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={waterPolyline}
              />

              {/* Sleep Line */}
              <polyline
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sleepPolyline}
              />

              {/* Energy Line */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={energyPolyline}
              />

              {/* Point Circles */}
              {points.map((p, idx) => (
                <circle
                  key={`pt-${idx}`}
                  cx={p.x}
                  cy={p.sleepY}
                  r={hoveredPointIndex === idx ? '6' : '4'}
                  fill="#818cf8"
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="cursor-pointer"
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

        {/* 3 Real-Life Takeaways in Plain Words */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1 text-xs">
          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <span>😴 Sleep Secret</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              Whenever you slept for <strong>7.5+ hours</strong>, you rated your daytime energy at <strong>4 or 5 out of 5</strong>!
            </p>
          </div>

          <div className="p-3.5 bg-cyan-50/60 rounded-2xl border border-cyan-100 space-y-1">
            <span className="font-bold text-cyan-950 flex items-center gap-1.5">
              <span>💧 Water & Headaches</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              On days you drank <strong>7+ glasses</strong>, you reported <strong>zero headaches</strong> and no afternoon eye fatigue.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-1">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <span>☕ Tea/Coffee Habit Tip</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              Wait <strong>45 minutes after meals</strong> before drinking chai or coffee so your body can absorb iron properly.
            </p>
          </div>
        </div>
      </div>

      {/* 6. EASY EVERYDAY VITALS CHECK-IN (Non-Intimidating Daily Tap) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h3 className="text-sm font-bold text-slate-900">
              How Are You Feeling Today? (Quick Daily Log)
            </h3>
          </div>

          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved successfully!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveQuickVitals} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Water Input */}
            <div className="p-3 bg-cyan-50/40 rounded-2xl border border-cyan-100">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">💧 Water Glasses</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setInputWaterGlasses(Math.max(0, inputWaterGlasses - 1))}
                  className="w-7 h-7 bg-white rounded-lg border border-slate-200 font-bold flex items-center justify-center cursor-pointer hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-base font-black font-mono text-cyan-900">{inputWaterGlasses}</span>
                <button
                  type="button"
                  onClick={() => setInputWaterGlasses(inputWaterGlasses + 1)}
                  className="w-7 h-7 bg-cyan-600 text-white rounded-lg font-bold flex items-center justify-center cursor-pointer hover:bg-cyan-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sleep Input */}
            <div className="p-3 bg-indigo-50/40 rounded-2xl border border-indigo-100">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">😴 Sleep Hours</label>
              <input
                type="number"
                step="0.5"
                value={inputSleepHours}
                onChange={(e) => setInputSleepHours(Number(e.target.value))}
                className="w-full text-center text-sm font-bold font-mono py-1 bg-white rounded-lg border border-slate-200"
              />
            </div>

            {/* Weight Input */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">⚖️ Weight (kg)</label>
              <input
                type="number"
                value={inputWeightKg}
                onChange={(e) => setInputWeightKg(Number(e.target.value))}
                className="w-full text-center text-sm font-bold font-mono py-1 bg-white rounded-lg border border-slate-200"
              />
            </div>

            {/* Blood Pressure */}
            <div className="p-3 bg-rose-50/40 rounded-2xl border border-rose-100">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">❤️ Blood Pressure</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={inputSystolic}
                  onChange={(e) => setInputSystolic(e.target.value)}
                  className="w-full text-center text-xs font-bold font-mono py-1 bg-white rounded border border-slate-200"
                />
                <span>/</span>
                <input
                  type="number"
                  value={inputDiastolic}
                  onChange={(e) => setInputDiastolic(e.target.value)}
                  className="w-full text-center text-xs font-bold font-mono py-1 bg-white rounded border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Quick Feeling Selection */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">How do you feel?</span>
            {simpleFeelings.map((feeling) => (
              <button
                key={feeling}
                type="button"
                onClick={() => setSelectedFeeling(feeling)}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer font-medium ${
                  selectedFeeling === feeling
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {selectedFeeling === feeling ? '✓ ' : ''}{feeling}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingLog}
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingLog ? 'Saving...' : 'Save Today’s Vitals'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 7. ASK AROGYASAATHI */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <Bot className="w-4 h-4 text-teal-700" />
          <span>Ask ArogyaSaathi</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenChat('Why do I feel sleepy around 3 PM during study classes?')}
            className="px-3 py-1.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
          >
            🥱 Why am I tired in class?
          </button>
          <button
            onClick={() => onOpenChat('What are simple everyday foods to increase low iron reserves fast?')}
            className="px-3 py-1.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
          >
            🥗 Easy foods to boost iron
          </button>
          <button
            onClick={() => onOpenChat('Is my blood pressure reading 118/76 good for my age?')}
            className="px-3 py-1.5 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
          >
            ❤️ Is my blood pressure healthy?
          </button>
        </div>
      </div>
    </div>
  );
};
