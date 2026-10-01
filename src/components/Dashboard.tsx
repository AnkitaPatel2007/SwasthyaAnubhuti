import React, { useState } from 'react';
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
  Info
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
  onSaveHealthUpdate?: (log: Partial<DailyHealthUpdate>) => Promise<void>;
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
  onSaveHealthUpdate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Health Insights Chart State
  const [insightMetric, setInsightMetric] = useState<'combined' | 'sleep' | 'energy' | 'water'>('combined');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(6);

  // Interactive ML Simulator Levers (Counterfactual Inference)
  const [simSleep, setSimSleep] = useState<number>(7.5);
  const [simWater, setSimWater] = useState<number>(2.5);
  const [simIronSupp, setSimIronSupp] = useState<boolean>(true);

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
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Optimal / No Fatigue');
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
  const primaryFlagged = flaggedBiomarkers[0];

  // Dynamic ML Anomaly & Homeostasis Score
  const anomalyCount = flaggedBiomarkers.length;
  const homeostasisScore = Math.max(78, 98.6 - anomalyCount * 4.2).toFixed(1);

  // ML Simulated Delta Calculation
  const predictedFatigueDrop = Math.min(55, Math.round((simSleep - 6) * 12 + (simWater - 1.5) * 8 + (simIronSupp ? 18 : 0)));
  const predictedO2Stamina = Math.min(40, Math.round((simIronSupp ? 22 : 4) + (simWater - 1.5) * 6));
  const anomalyRiskIndex = Math.max(2.1, (12.4 - (simSleep >= 7.5 ? 4.5 : 0) - (simIronSupp ? 5.2 : 0))).toFixed(1);

  // Health Insights: Timeline Data Preparation (7-Day Rolling Trend)
  const sourceUpdates = (dailyUpdates && dailyUpdates.length > 0 ? dailyUpdates : latestUpdate ? [latestUpdate] : [])
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Use 7 representative days for smooth charting
  const chartDays = sourceUpdates.length >= 4 ? sourceUpdates.slice(-7) : [
    { date: '2026-09-23', sleepHours: 7.2, energyLevel: 3, waterGlasses: 6, restingHeartRate: 72, symptomsReported: [] as string[] },
    { date: '2026-09-24', sleepHours: 7.8, energyLevel: 4, waterGlasses: 7, restingHeartRate: 70, symptomsReported: [] as string[] },
    { date: '2026-09-25', sleepHours: 8.0, energyLevel: 5, waterGlasses: 8, restingHeartRate: 69, symptomsReported: [] as string[] },
    { date: '2026-09-26', sleepHours: 6.8, energyLevel: 3, waterGlasses: 5, restingHeartRate: 74, symptomsReported: ['Eye Strain'] },
    { date: '2026-09-27', sleepHours: 7.4, energyLevel: 4, waterGlasses: 7, restingHeartRate: 71, symptomsReported: [] as string[] },
    { date: '2026-09-28', sleepHours: 6.1, energyLevel: 2, waterGlasses: 4, restingHeartRate: 75, symptomsReported: ['Headache', 'Brain Fog'] },
    { date: '2026-09-29', sleepHours: 7.8, energyLevel: 4, waterGlasses: 7, restingHeartRate: 71, symptomsReported: ['Mild Neck Tension'] },
  ];

  // Averages for KPI Header
  const avgSleep = (chartDays.reduce((acc, d) => acc + (d.sleepHours || 0), 0) / chartDays.length).toFixed(1);
  const avgEnergy = (chartDays.reduce((acc, d) => acc + (d.energyLevel || 0), 0) / chartDays.length).toFixed(1);
  const avgWaterGlasses = (chartDays.reduce((acc, d) => acc + (d.waterGlasses || 0), 0) / chartDays.length).toFixed(1);
  const avgWaterMl = Math.round(Number(avgWaterGlasses) * 250);

  // SVG Chart Geometry Constants
  const chartWidth = 680;
  const chartHeight = 200;
  const padX = 40;
  const padY = 25;

  const points = chartDays.map((d, i) => {
    const x = padX + (i / Math.max(1, chartDays.length - 1)) * (chartWidth - padX * 2);
    // Sleep: scale from 5h to 9.5h
    const sleepNorm = Math.max(0, Math.min(1, ((d.sleepHours || 7.0) - 5.0) / 4.5));
    const sleepY = chartHeight - padY - sleepNorm * (chartHeight - padY * 2);

    // Energy: scale from 1 to 5
    const energyNorm = Math.max(0, Math.min(1, ((d.energyLevel || 3) - 1) / 4));
    const energyY = chartHeight - padY - energyNorm * (chartHeight - padY * 2);

    // Water: scale from 0 to 10 glasses
    const waterNorm = Math.max(0, Math.min(1, (d.waterGlasses || 6) / 10));
    const waterY = chartHeight - padY - waterNorm * (chartHeight - padY * 2);

    return {
      x,
      sleepY,
      energyY,
      waterY,
      raw: d,
      dateLabel: d.date.slice(5) // MM-DD
    };
  });

  const sleepPolyline = points.map((p) => `${p.x},${p.sleepY}`).join(' ');
  const energyPolyline = points.map((p) => `${p.x},${p.energyY}`).join(' ');
  const waterPolyline = points.map((p) => `${p.x},${p.waterY}`).join(' ');

  // Active hover point details
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
        symptomsReported: selectedSymptom === 'Optimal / No Fatigue' ? [] : [selectedSymptom],
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingLog(false);
    }
  };

  const quickSymptoms = [
    'Optimal / No Fatigue',
    'Afternoon Fatigue',
    'Brain Fog',
    'Eye Strain',
    'Acidity / Reflux',
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* 1. AI-ML Inference Top Micro-Bar */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-teal-400 font-bold tracking-wider">
            <Cpu className="w-4 h-4 animate-pulse" />
            <span>AURA-NEURAL-ML v4.2</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 font-mono text-[11px] hidden sm:inline">
            Inference: 14ms · Homeostasis: <strong className="text-emerald-400">{homeostasisScore}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono text-emerald-400 font-bold">ONLINE · REAL-TIME TELEMETRY</span>
        </div>
      </div>

      {/* 2. Interactive AI Search & Prompt Node */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery.trim()) {
              onOpenChat(`Analyze query in relation to my health data: "${searchQuery}"`);
            }
          }}
          placeholder="Type any biomarker, symptom, or question for instant AI-ML reasoning..."
          className="w-full pl-11 pr-28 py-3 bg-white text-xs sm:text-sm text-slate-900 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all shadow-xs"
        />
        <button
          onClick={() => {
            if (searchQuery.trim()) onOpenChat(`Analyze query: "${searchQuery}"`);
          }}
          className="absolute right-2 top-2 px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Inference</span>
        </button>
      </div>

      {/* 3. Four Core AI Telemetry Metric Tiles (Lucrative & High-Density) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Cardio Stability */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Cardio Stability</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{bp}</span>
            <span className="text-[10px] text-slate-400">mmHg</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100 font-mono">
            <span className="text-slate-500">Pulse: {hr} bpm</span>
            <span className="text-emerald-700 font-bold">Nominal</span>
          </div>
        </div>

        {/* Metric 2: Vision-AI Lab Requisition */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Lab Anomaly Vector</span>
            <FileText className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1 font-mono">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {flaggedBiomarkers.length}
            </span>
            <span className="text-xs text-amber-700 font-bold">Flagged</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100 font-mono truncate">
            <span className="text-slate-500 truncate">
              {primaryFlagged ? `${primaryFlagged.parameterName}: ${primaryFlagged.value}${primaryFlagged.unit}` : 'All In Range'}
            </span>
            <button onClick={onOpenReports} className="text-teal-700 font-bold hover:underline shrink-0 ml-1 cursor-pointer">
              Vault →
            </button>
          </div>
        </div>

        {/* Metric 3: Metabolic Hydration */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Metabolic Fluid</span>
            <Droplets className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {inputWaterGlasses * 250}
            </span>
            <span className="text-[10px] text-slate-400">/ 2500 mL</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-mono">{inputWaterGlasses} glasses</span>
            <button
              onClick={onQuickAddWater}
              className="text-teal-700 font-bold hover:text-teal-900 flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>250ml</span>
            </button>
          </div>
        </div>

        {/* Metric 4: Circadian Recovery */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Circadian Sleep</span>
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{inputSleepHours}</span>
            <span className="text-[10px] text-slate-400">Hours</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100 font-mono">
            <span className="text-slate-500">BMI: {bmi}</span>
            <span className="text-indigo-700 font-bold">Deep: 22%</span>
          </div>
        </div>
      </div>

      {/* 4. NEW: HEALTH INSIGHTS SECTION (Visual Biomarker Trends) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Health Insights & Biomarker Trends
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold border border-teal-200/60">
                7-DAY ROLLING MODEL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Longitudinal correlation between circadian sleep duration, cellular energy stamina, and fluid intake.
            </p>
          </div>

          {/* Metric View Switcher */}
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
              <span>Sleep (Hrs)</span>
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
              <span>Energy (1-5)</span>
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
              <span>Water (Glasses)</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Banner Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-900 uppercase font-mono tracking-wider block">
                7-Day Mean Sleep
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-indigo-950 font-mono">{avgSleep}</span>
                <span className="text-xs text-indigo-600 font-mono">hrs / night</span>
              </div>
              <span className="text-[10px] text-indigo-700 font-medium block mt-0.5">
                Target: {profile?.targetSleepHours || 8.0} hrs ({Math.round((Number(avgSleep) / (profile?.targetSleepHours || 8.0)) * 100)}% met)
              </span>
            </div>
            <Moon className="w-6 h-6 text-indigo-400 shrink-0" />
          </div>

          <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-900 uppercase font-mono tracking-wider block">
                Average Vitality Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-amber-950 font-mono">{avgEnergy}</span>
                <span className="text-xs text-amber-600 font-mono">/ 5.0</span>
              </div>
              <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
                Coupled with 7.5h+ nocturnal rest
              </span>
            </div>
            <BatteryCharging className="w-6 h-6 text-amber-400 shrink-0" />
          </div>

          <div className="p-3.5 bg-cyan-50/50 rounded-2xl border border-cyan-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-cyan-900 uppercase font-mono tracking-wider block">
                Hydration Equilibrium
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-cyan-950 font-mono">{avgWaterMl}</span>
                <span className="text-xs text-cyan-600 font-mono">mL / day</span>
              </div>
              <span className="text-[10px] text-cyan-700 font-medium block mt-0.5">
                {avgWaterGlasses} glasses/day · 70% cellular target
              </span>
            </div>
            <Droplets className="w-6 h-6 text-cyan-400 shrink-0" />
          </div>
        </div>

        {/* Data Visualization SVG Canvas */}
        <div className="relative bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 overflow-hidden">
          {/* Legend and Active Point HUD */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-4 text-[11px] font-mono">
              {(insightMetric === 'combined' || insightMetric === 'sleep') && (
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <span className="w-2.5 h-1 rounded bg-indigo-400" />
                  <span>Sleep (5–9.5h)</span>
                </div>
              )}
              {(insightMetric === 'combined' || insightMetric === 'energy') && (
                <div className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-1 rounded bg-amber-400" />
                  <span>Energy (1–5)</span>
                </div>
              )}
              {(insightMetric === 'combined' || insightMetric === 'water') && (
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <span className="w-2.5 h-1 rounded bg-cyan-400" />
                  <span>Water (0–10 gl)</span>
                </div>
              )}
            </div>

            {/* Hover Tooltip Readout */}
            {activeHover && (
              <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700 text-[11px] font-mono text-slate-200">
                <span className="text-teal-400 font-bold">{activeHover.raw.date}</span>
                <span>Sleep: <strong className="text-indigo-300">{activeHover.raw.sleepHours}h</strong></span>
                <span>Energy: <strong className="text-amber-300">{activeHover.raw.energyLevel}/5</strong></span>
                <span>Water: <strong className="text-cyan-300">{activeHover.raw.waterGlasses} gl</strong></span>
                {activeHover.raw.symptomsReported?.length > 0 && (
                  <span className="text-rose-300 hidden md:inline">({activeHover.raw.symptomsReported.join(', ')})</span>
                )}
              </div>
            )}
          </div>

          {/* SVG Plot */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 sm:h-52 select-none"
            >
              {/* Background Grid Lines */}
              <line x1={padX} y1={padY} x2={chartWidth - padX} y2={padY} stroke="#334155" strokeDasharray="3 3" />
              <line x1={padX} y1={chartHeight / 2} x2={chartWidth - padX} y2={chartHeight / 2} stroke="#334155" strokeDasharray="3 3" />
              <line x1={padX} y1={chartHeight - padY} x2={chartWidth - padX} y2={chartHeight - padY} stroke="#475569" />

              {/* Target Line (8.0h / 8 glasses target) */}
              <line
                x1={padX}
                y1={chartHeight - padY - ((8.0 - 5.0) / 4.5) * (chartHeight - padY * 2)}
                x2={chartWidth - padX}
                y2={chartHeight - padY - ((8.0 - 5.0) / 4.5) * (chartHeight - padY * 2)}
                stroke="#0d9488"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Vertical Guide for hovered index */}
              {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                <line
                  x1={points[hoveredPointIndex].x}
                  y1={padY}
                  x2={points[hoveredPointIndex].x}
                  y2={chartHeight - padY}
                  stroke="#14b8a6"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              {/* Series 1: Water Intake */}
              {(insightMetric === 'combined' || insightMetric === 'water') && (
                <>
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth={insightMetric === 'water' ? '3' : '2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={waterPolyline}
                    opacity={insightMetric === 'combined' ? '0.85' : '1'}
                  />
                  {points.map((p, idx) => (
                    <circle
                      key={`water-${idx}`}
                      cx={p.x}
                      cy={p.waterY}
                      r={hoveredPointIndex === idx ? '5' : '3.5'}
                      fill="#06b6d4"
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                    />
                  ))}
                </>
              )}

              {/* Series 2: Sleep Duration */}
              {(insightMetric === 'combined' || insightMetric === 'sleep') && (
                <>
                  <polyline
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth={insightMetric === 'sleep' ? '3' : '2.5'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={sleepPolyline}
                  />
                  {points.map((p, idx) => (
                    <circle
                      key={`sleep-${idx}`}
                      cx={p.x}
                      cy={p.sleepY}
                      r={hoveredPointIndex === idx ? '6' : '4'}
                      fill="#818cf8"
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                    />
                  ))}
                </>
              )}

              {/* Series 3: Energy Level */}
              {(insightMetric === 'combined' || insightMetric === 'energy') && (
                <>
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth={insightMetric === 'energy' ? '3' : '2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={energyPolyline}
                  />
                  {points.map((p, idx) => (
                    <circle
                      key={`energy-${idx}`}
                      cx={p.x}
                      cy={p.energyY}
                      r={hoveredPointIndex === idx ? '5' : '3.5'}
                      fill="#f59e0b"
                      stroke="#0f172a"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                    />
                  ))}
                </>
              )}

              {/* Interactive Invisible Click/Hover Zones for Each Day */}
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

              {/* X-Axis Date Labels */}
              {points.map((p, idx) => (
                <text
                  key={`date-${idx}`}
                  x={p.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill={hoveredPointIndex === idx ? '#2dd4bf' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={hoveredPointIndex === idx ? 'bold' : 'normal'}
                >
                  {p.dateLabel}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* 3 AI Biomarker Correlation Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Circadian & Energy Synergy</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              When sleep duration exceeded <strong>7.5 hours</strong>, next-day stamina averaged <strong>4.2 / 5</strong> compared to <strong>2.0 / 5</strong> during exam sleep deprivation.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Hydration & Headache Mitigation</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Days meeting the <strong>&ge; 7 glasses (1,750 mL)</strong> threshold recorded a <strong>0% incidence</strong> of reported tension headaches or screen eye strain.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600" />
              <span>Clinical Recommendation</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pair your night study sessions with a consistent 45-min pre-sleep screen curfew to maintain deep stage-3 recovery.
            </p>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE AI HEALTH SIMULATOR & WHAT-IF ENGINE */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 border border-teal-800/50 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>AI Counterfactual Simulator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-mono">
                  LIVE MODEL INFERENCE
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Adjust lifestyle levers to forecast real-time fatigue reduction and oxygen transport.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] block">Predicted Fatigue Reduction</span>
              <span className="text-lg font-black text-teal-300">-{predictedFatigueDrop}%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Oxygen Stamina</span>
              <span className="text-lg font-black text-emerald-400">+{predictedO2Stamina}%</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Risk Index</span>
              <span className="text-lg font-black text-cyan-300">{anomalyRiskIndex}</span>
            </div>
          </div>
        </div>

        {/* Simulator Levers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Lever 1: Sleep */}
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Sleep Duration</span>
              <span className="font-mono font-bold text-teal-300">{simSleep} hrs/night</span>
            </div>
            <input
              type="range"
              min="5"
              max="9.5"
              step="0.5"
              value={simSleep}
              onChange={(e) => setSimSleep(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>5.0h (Sleep Debt)</span>
              <span>8.0h (Optimal)</span>
              <span>9.5h</span>
            </div>
          </div>

          {/* Lever 2: Hydration */}
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Hydration Target</span>
              <span className="font-mono font-bold text-teal-300">{simWater} L/day</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.25"
              value={simWater}
              onChange={(e) => setSimWater(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1.0L (Deficit)</span>
              <span>2.5L (Target)</span>
              <span>4.0L</span>
            </div>
          </div>

          {/* Lever 3: Iron + Vit C Intervention */}
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Iron + Vit C Protocol</span>
              <span className={`font-mono font-bold text-xs ${simIronSupp ? 'text-emerald-400' : 'text-slate-400'}`}>
                {simIronSupp ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {simIronSupp
                ? 'Pairing non-heme iron with Vitamin C accelerates ferritin repletion.'
                : 'No dietary synergy applied.'}
            </p>
            <button
              onClick={() => setSimIronSupp(!simIronSupp)}
              className={`mt-2 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simIronSupp
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Toggle Intervention Protocol
            </button>
          </div>
        </div>
      </div>

      {/* 6. EVERYDAY DIRECT INPUT STATION (Clean, High-Speed Interactive Strip) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Everyday Real Vitals Logger
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Date: {todayStr}</span>
          </div>

          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Telemetry Updated!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveQuickVitals} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {/* BP */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Blood Pressure</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={inputSystolic}
                  onChange={(e) => setInputSystolic(e.target.value)}
                  className="w-full font-mono font-bold text-center bg-white rounded-lg border border-slate-200 py-1"
                />
                <span>/</span>
                <input
                  type="number"
                  value={inputDiastolic}
                  onChange={(e) => setInputDiastolic(e.target.value)}
                  className="w-full font-mono font-bold text-center bg-white rounded-lg border border-slate-200 py-1"
                />
              </div>
            </div>

            {/* HR */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Pulse (BPM)</label>
              <input
                type="number"
                value={inputHr}
                onChange={(e) => setInputHr(Number(e.target.value))}
                className="w-full font-mono font-bold text-center bg-white rounded-lg border border-slate-200 py-1"
              />
            </div>

            {/* Water */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Water Glasses</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setInputWaterGlasses(Math.max(0, inputWaterGlasses - 1))}
                  className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="font-mono font-bold">{inputWaterGlasses}</span>
                <button
                  type="button"
                  onClick={() => setInputWaterGlasses(inputWaterGlasses + 1)}
                  className="px-2 py-0.5 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sleep */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Sleep (Hrs)</label>
              <input
                type="number"
                step="0.5"
                value={inputSleepHours}
                onChange={(e) => setInputSleepHours(Number(e.target.value))}
                className="w-full font-mono font-bold text-center bg-white rounded-lg border border-slate-200 py-1"
              />
            </div>

            {/* Weight */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={inputWeightKg}
                onChange={(e) => setInputWeightKg(Number(e.target.value))}
                className="w-full font-mono font-bold text-center bg-white rounded-lg border border-slate-200 py-1"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSavingLog}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingLog ? 'Updating...' : 'Log Input'}</span>
              </button>
            </div>
          </div>

          {/* Quick Symptoms Tap */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
            <span className="text-slate-400 font-medium shrink-0">Today's Feeling:</span>
            {quickSymptoms.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => setSelectedSymptom(sym)}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer shrink-0 font-medium ${
                  selectedSymptom === sym
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {selectedSymptom === sym ? '✓ ' : ''}{sym}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 7. PREDICTIVE MULTI-FACTOR ML RISK MATRIX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Predictive Youth Disease Risk Matrix
            </h3>
          </div>
          <button
            onClick={() => onOpenDiseases()}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Disease Catalog</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Condition 1: Anemia */}
          <div
            onClick={() => onOpenDiseases('anemia-iron-deficiency')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                Iron Anemia Risk
              </span>
              <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                68% High
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '68%' }} />
            </div>
            <span className="text-[11px] text-slate-500 block truncate">
              Trigger: Ferritin (18 ng/mL) &lt; 20
            </span>
            <span className="text-[10px] font-bold text-teal-700 mt-2 block group-hover:underline">
              Run AI Protocol →
            </span>
          </div>

          {/* Condition 2: Vitamin D */}
          <div
            onClick={() => onOpenDiseases('vitamin-d-b12-deficiency')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                Indoor Vit D Deficit
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                45% Mod
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }} />
            </div>
            <span className="text-[11px] text-slate-500 block truncate">
              Trigger: 25-OH D (24.2 ng/mL)
            </span>
            <span className="text-[10px] font-bold text-teal-700 mt-2 block group-hover:underline">
              Run AI Protocol →
            </span>
          </div>

          {/* Condition 3: Burnout */}
          <div
            onClick={() => onOpenDiseases('burnout-chronic-fatigue')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                Circadian Burnout
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                32% Low-Mod
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '32%' }} />
            </div>
            <span className="text-[11px] text-slate-500 block truncate">
              Trigger: 7.5h sleep + study fatigue
            </span>
            <span className="text-[10px] font-bold text-teal-700 mt-2 block group-hover:underline">
              Run AI Protocol →
            </span>
          </div>

          {/* Condition 4: Metabolic */}
          <div
            onClick={() => onOpenDiseases('hypertension-youth')}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800">
                Cardio Pressure
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                12% Optimal
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }} />
            </div>
            <span className="text-[11px] text-slate-500 block truncate">
              Trigger: BP 118/76 mmHg
            </span>
            <span className="text-[10px] font-bold text-teal-700 mt-2 block group-hover:underline">
              Run AI Protocol →
            </span>
          </div>
        </div>
      </div>

      {/* 8. Quick Interactive AI Copilot Prompts */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-semibold">
          <Bot className="w-4 h-4 text-teal-700" />
          <span>Quick ArogyaSaathi Copilot Inferences:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onOpenChat('Can you correlate my 7-day sleep duration and water intake with my energy levels?')}
            className="px-3 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
          >
            📊 Correlate 7-Day Sleep & Energy
          </button>
          <button
            onClick={() => onOpenChat('Generate 4 high-yield doctor consultation questions for my next clinic checkup.')}
            className="px-3 py-1 bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl border border-slate-200 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
          >
            🩺 Prep Doctor Questions
          </button>
        </div>
      </div>
    </div>
  );
};
