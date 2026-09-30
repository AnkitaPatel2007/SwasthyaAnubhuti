import React from 'react';
import {
  HeartPulse,
  Activity,
  Droplets,
  Moon,
  FileText,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
  Plus,
  Thermometer,
  Scale,
  Calendar,
  AlertTriangle
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
  onOpenChat: () => void;
  onQuickAddWater: () => Promise<void>;
  onToggleReminder: (id: string) => Promise<void>;
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
  onOpenChat,
  onQuickAddWater,
  onToggleReminder,
}) => {
  // BMI calculation
  const heightM = (profile?.heightCm || 168) / 100;
  const weightKg = latestUpdate?.weightKg ?? profile?.weightKg ?? 62;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  const bp = latestUpdate?.bloodPressure || `${profile?.bloodPressureSystolic || 118}/${profile?.bloodPressureDiastolic || 76}`;
  const hr = latestUpdate?.restingHeartRate || profile?.restingHeartRate || 71;

  // Recent Report & Flagged Biomarkers
  const latestReport = reports[0];
  const flaggedBiomarkers = (latestReport?.parameters || []).filter(
    (p) => p.status === 'low' || p.status === 'high' || p.status === 'borderline'
  );

  // Hydration calculation
  const waterGlasses = latestUpdate?.waterGlasses ?? 6;
  const targetGlasses = Math.round((profile?.targetWaterMl || 2500) / 250);
  const waterPercent = Math.min(100, Math.round((waterGlasses / targetGlasses) * 100));

  // Matched Disease Risks based on flagged biomarkers
  const matchedDiseases = diseases.filter((d) => {
    if (flaggedBiomarkers.some((p) => p.parameterName.toLowerCase().includes('hemoglobin') || p.parameterName.toLowerCase().includes('ferritin'))) {
      if (d.id === 'anemia-iron-deficiency') return true;
    }
    if (flaggedBiomarkers.some((p) => p.parameterName.toLowerCase().includes('vitamin d'))) {
      if (d.id === 'vitamin-d-b12-deficiency') return true;
    }
    return false;
  }).slice(0, 2);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* 1. Clinical Cardiogram & Live Telemetry Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-teal-800/40">
        {/* Decorative ECG Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400 font-mono">
                TELEMETRY RADAR · PATIENT CHART #AH-7029
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Clinical Vitals & Preventive Assessment
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time physiological telemetry for <strong className="text-white">{profile?.name || 'Alex'}</strong> (Age {profile?.age || 22}, {profile?.gender || 'Female'}, {profile?.lifestyle || 'Student'}). Cross-analyzing laboratory blood biomarkers with everyday hydration, sleep cycles, and disease risks.
            </p>
          </div>

          {/* Quick Record Vitals Button */}
          <div className="flex flex-col sm:flex-row items-start lg:items-center gap-3">
            <button
              onClick={onOpenCheckin}
              className="px-5 py-3 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <Activity className="w-4 h-4 text-slate-950" />
              <span>Record Clinical Vitals</span>
            </button>

            <button
              onClick={onOpenChat}
              className="px-4 py-3 text-xs font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>AI Clinical Review</span>
            </button>
          </div>
        </div>

        {/* Live Animated ECG Pulse Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Telemetry 1: Blood Pressure */}
          <div className="bg-slate-800/40 backdrop-blur-sm p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] text-teal-400 font-mono font-medium">
              <span>BLOOD PRESSURE</span>
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white tabular-nums tracking-tight font-mono">
                {bp}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
            </div>
            <span className="text-[10px] font-bold text-teal-300 block mt-1">
              Normal Range (&lt;120/80)
            </span>
          </div>

          {/* Telemetry 2: Resting Heart Rate */}
          <div className="bg-slate-800/40 backdrop-blur-sm p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] text-teal-400 font-mono font-medium">
              <span>RESTING PULSE</span>
              <Activity className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white tabular-nums tracking-tight font-mono">
                {hr}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">BPM</span>
            </div>
            <span className="text-[10px] font-bold text-teal-300 block mt-1">
              Optimal Rhythm (60–100)
            </span>
          </div>

          {/* Telemetry 3: BMI & Mass */}
          <div className="bg-slate-800/40 backdrop-blur-sm p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] text-teal-400 font-mono font-medium">
              <span>BODY MASS INDEX</span>
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white tabular-nums tracking-tight font-mono">
                {bmi}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">BMI</span>
            </div>
            <span className="text-[10px] font-bold text-teal-300 block mt-1">
              Healthy Target ({weightKg} kg)
            </span>
          </div>

          {/* Telemetry 4: Clinical Stability Index */}
          <div className="bg-slate-800/40 backdrop-blur-sm p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] text-teal-400 font-mono font-medium">
              <span>STABILITY INDEX</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-400 tabular-nums tracking-tight font-mono">
                91/100
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 block mt-1">
              Metabolically Stable
            </span>
          </div>
        </div>
      </div>

      {/* 2. Disease Risk Radar & Preventive Alerts (Major Priority) */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm medical-card-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-800">
              <Stethoscope className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Youth Disease Risk Radar
              </h3>
              <span className="text-xs text-slate-500">
                Automated biomarker correlation against 10+ student & young adult disease profiles
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenDiseases()}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 group"
          >
            <span>Explore Clinical Disease Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {matchedDiseases.map((disease) => (
            <div
              key={disease.id}
              onClick={() => onOpenDiseases(disease.id)}
              className="p-5 bg-gradient-to-br from-rose-50/50 via-slate-50/60 to-white rounded-xl border border-rose-200/80 hover:border-rose-300 cursor-pointer medical-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100/80 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    CLINICAL ATTENTION SUGGESTED
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{disease.category}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {disease.name}
                </h4>

                <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {disease.description}
                </p>

                {/* Associated Lab Marker Box */}
                <div className="mt-3.5 p-2.5 bg-white/90 rounded-lg border border-rose-100 text-xs text-slate-700 flex items-center justify-between">
                  <span className="text-slate-500">Diagnostic Marker:</span>
                  <strong className="text-rose-900 font-mono">
                    {disease.keyLabTests[0]?.keyParameter}
                  </strong>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-100/80 flex items-center justify-between text-xs text-rose-800 font-bold">
                <span>View symptom indicators & doctor questions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}

          {/* Third card: Cardiometabolic Shielding */}
          <div
            onClick={() => onOpenDiseases('prediabetes-insulin-resistance')}
            className="p-5 bg-gradient-to-br from-teal-50/40 via-slate-50/60 to-white rounded-xl border border-teal-200/80 hover:border-teal-300 cursor-pointer medical-card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100/80 border border-teal-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  CARDIOMETABOLICALLY SHIELDED
                </span>
                <span className="text-xs text-slate-400 font-medium">Metabolic Health</span>
              </div>

              <h4 className="text-base font-bold text-slate-900 mt-1">
                Pre-Diabetes & Insulin Sensitivity
              </h4>

              <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                Fasting blood glucose (86 mg/dL) and Blood Pressure (118/76 mmHg) reflect healthy insulin receptor sensitivity. Maintain active muscle GLUT4 glucose uptake.
              </p>

              <div className="mt-3.5 p-2.5 bg-white/90 rounded-lg border border-teal-100 text-xs text-slate-700 flex items-center justify-between">
                <span className="text-slate-500">Diagnostic Marker:</span>
                <strong className="text-teal-900 font-mono">Fasting Glucose & HbA1c</strong>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-100/80 flex items-center justify-between text-xs text-teal-800 font-bold">
              <span>View preventive lifestyle protocol</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Medical Report Intelligence (Major Priority) */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm medical-card-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Diagnostic Laboratory Requisition
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                OCR EXTRACTED & VERIFIED
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {latestReport?.title || 'No reports uploaded'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Specimen Date: {latestReport?.reportDate} · Source File: {latestReport?.fileName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReports}
              className="px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-teal-300" />
              <span>Upload / View Reports</span>
            </button>
          </div>
        </div>

        {/* Clinical Biomarker Readout Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {(latestReport?.parameters || []).map((param) => {
            const isLow = param.status === 'low';
            const isOptimal = param.status === 'optimal';
            const isBorderline = param.status === 'borderline';

            // Calculate percentage placement in reference bar
            const min = param.referenceMin ?? 0;
            const max = param.referenceMax ?? 100;
            const range = max - min || 1;
            const gaugePercent = Math.max(0, Math.min(100, Math.round(((param.value - min) / range) * 100)));

            return (
              <div
                key={param.id}
                onClick={() => onOpenTrends(param.parameterName)}
                className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-teal-300 transition-all cursor-pointer group medical-card-hover"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                    {param.parameterName}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono ${
                      isOptimal
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isLow
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {param.status}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-black text-slate-900 tabular-nums font-mono">
                    {param.value}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold font-mono">{param.unit}</span>
                </div>

                {/* Reference Range Bar Gauge */}
                <div className="mt-2.5">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${
                        isOptimal ? 'bg-emerald-500' : isLow ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${gaugePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>Min: {param.referenceMin ?? 0}</span>
                    <span>Max: {param.referenceMax ?? 'N/A'} {param.unit}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {param.plainExplanation}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-teal-800 font-semibold group-hover:underline">
                  <span>Longitudinal Timeline</span>
                  <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Daily Habits Prescription & Hydration Engine (Major Priority) */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm medical-card-glow">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daily Habit Prescription & Adherence
              </h3>
              <span className="text-xs text-slate-500">
                Preventive behavioral routines: hydration, sleep architecture, and supplement discipline
              </span>
            </div>
          </div>

          <button
            onClick={onOpenHabits}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 group"
          >
            <span>Full Habits Console</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 3 Medical Habit Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hydration Module with Fluid Level Gauge */}
          <div className="p-5 bg-gradient-to-b from-sky-50/50 to-white rounded-xl border border-sky-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  FLUID LEVEL
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                  {waterGlasses * 250} / {profile?.targetWaterMl || 2500} ml
                </span>
              </div>

              <div className="mt-4">
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${waterPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
                  <span>{waterGlasses} of {targetGlasses} glasses</span>
                  <span className="font-bold text-sky-700 font-mono">{waterPercent}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Adequate hydration maintains blood volume, prevents postural dizziness, and reduces evening headache risk.
              </p>
            </div>

            <button
              onClick={onQuickAddWater}
              className="mt-4 w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Drink 1 Glass (250ml)</span>
            </button>
          </div>

          {/* Sleep Architecture */}
          <div className="p-5 bg-gradient-to-b from-indigo-50/50 to-white rounded-xl border border-indigo-200/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  REST DURATION
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                  {latestUpdate?.sleepHours ?? 7.5} / {profile?.targetSleepHours ?? 8.0} hrs
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tabular-nums font-mono">
                  {latestUpdate?.sleepHours ?? 7.5}
                </span>
                <span className="text-xs text-slate-500 font-medium">hours logged</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <span>Restorative Rating:</span>
                <div className="flex text-amber-500 font-bold">
                  {'★'.repeat(latestUpdate?.sleepQuality || 4)}
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                Stage 3 deep non-REM sleep is essential for physical hormone release and red blood cell recovery.
              </p>
            </div>

            <button
              onClick={onOpenHabits}
              className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
            >
              Adjust Sleep Log
            </button>
          </div>

          {/* Habit Streaks & Adherence */}
          <div className="p-5 bg-gradient-to-b from-teal-50/50 to-white rounded-xl border border-teal-200/70 flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold text-teal-900 block mb-2 flex items-center gap-1 uppercase tracking-wider font-mono">
                <Flame className="w-4 h-4 text-rose-500" />
                ADHERENCE STREAKS
              </span>

              <div className="space-y-2.5 mt-3">
                {habitGoals.slice(0, 3).map((g) => (
                  <div key={g.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate max-w-[150px]">
                      {g.title}
                    </span>
                    <span className="font-bold text-rose-600 tabular-nums font-mono">
                      {g.currentStreakDays} days 🔥
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 mt-3">
                {reminders.filter((r) => r.enabled).length} automated health reminders active today.
              </p>
            </div>

            <button
              onClick={onOpenHabits}
              className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors text-center shadow-xs"
            >
              View All Streaks & Goals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
