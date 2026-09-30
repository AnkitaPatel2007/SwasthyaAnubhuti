import React from 'react';
import {
  Droplets,
  Moon,
  Sparkles,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  AlertCircle
} from 'lucide-react';
import {
  UserProfile,
  DailySymptomLog,
  MedicalReport,
  HabitReminder,
  HealthStory,
  DailyWellnessPlan
} from '../types/index.ts';
import { CycleOrEnergyRing } from './CycleOrEnergyRing.tsx';

interface DashboardProps {
  profile: UserProfile | null;
  todayLog: DailySymptomLog | null;
  reports: MedicalReport[];
  reminders: HabitReminder[];
  wellnessPlan: DailyWellnessPlan | null;
  stories: HealthStory[];
  onOpenCheckin: () => void;
  onOpenReports: () => void;
  onOpenTrends: (param?: string) => void;
  onOpenStories: (storyId?: string) => void;
  onToggleReminder: (id: string) => void;
  onQuickAddWater: () => void;
  onToggleRoutineItem: (id: string) => void;
  onToggleTrackingMode: (mode: 'cycle_and_wellness' | 'energy_and_circadian') => void;
  onOpenChat: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  todayLog,
  reports,
  reminders,
  wellnessPlan,
  stories,
  onOpenCheckin,
  onOpenReports,
  onOpenTrends,
  onOpenStories,
  onToggleReminder,
  onQuickAddWater,
  onToggleRoutineItem,
  onToggleTrackingMode,
  onOpenChat,
}) => {
  // Recent flagged parameters from latest report
  const latestReport = reports[0];
  const flaggedBiomarkers = (latestReport?.parameters || []).filter(
    (p) => p.status === 'low' || p.status === 'high' || p.status === 'borderline'
  );

  const waterGlasses = todayLog?.waterGlasses ?? 5;
  const targetGlasses = Math.round((profile?.targetWaterMl || 2500) / 250);
  const waterPercent = Math.min(100, Math.round((waterGlasses / targetGlasses) * 100));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Flo-Inspired Cycle & Biological Rhythm Card */}
      <CycleOrEnergyRing
        profile={profile}
        todayLog={todayLog}
        onOpenCheckin={onOpenCheckin}
        onToggleMode={onToggleTrackingMode}
      />

      {/* 2. Today's Health Vitals & Daily Habit Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card A: Hydration Tank */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-500" />
                Hydration Meter
              </span>
              <span className="text-xs font-semibold text-slate-700 tabular-nums">
                {waterGlasses * 250} / {profile?.targetWaterMl || 2500} ml
              </span>
            </div>

            <div className="mt-4">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-500"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{waterGlasses} of {targetGlasses} glasses</span>
                <span className="font-semibold text-slate-700">{waterPercent}%</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Drinking 500ml every 2–3 hours prevents late-afternoon brain fog and eases menstrual muscle cramps.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onQuickAddWater}
              className="w-full py-2 px-3 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>+ Drink 1 Glass (250ml)</span>
            </button>
          </div>
        </div>

        {/* Card B: Sleep & Restorative Battery */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-500" />
                Sleep & Recovery
              </span>
              <span className="text-xs font-semibold text-slate-700 tabular-nums">
                {todayLog?.sleepHours ?? 7.5}h / {profile?.targetSleepHours ?? 8}h
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {todayLog?.sleepHours ?? 7.5}
              </span>
              <span className="text-xs text-slate-500 font-medium">hours logged</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <span className="font-medium">Sleep Quality:</span>
              <div className="flex items-center text-amber-500">
                {'★'.repeat(todayLog?.sleepQuality || 4)}
                {'☆'.repeat(5 - (todayLog?.sleepQuality || 4))}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Consistent sleep timing regulates cortisol awakening and stabilizes daytime dopamine.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onOpenCheckin}
              className="w-full py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-center"
            >
              Adjust Sleep Log
            </button>
          </div>
        </div>

        {/* Card C: Proactive Smart Reminders */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-500" />
                Automated Reminders
              </span>
              <span className="text-xs text-slate-400">
                {reminders.filter((r) => r.enabled).length} active
              </span>
            </div>

            <div className="space-y-2.5 mt-2">
              {reminders.slice(0, 3).map((rem) => (
                <div
                  key={rem.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="text-xs font-semibold text-slate-500 tabular-nums">
                      {rem.time}
                    </span>
                    <span className="text-xs text-slate-800 truncate font-medium">
                      {rem.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className={`w-8 h-4 rounded-full transition-colors relative flex items-center ${
                      rem.enabled ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        rem.enabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block text-center">
              Context-triggered based on your energy trends
            </span>
          </div>
        </div>
      </div>

      {/* 3. AI Health Insights & Predictive Pattern Alert */}
      <div className="bg-gradient-to-r from-rose-50/70 via-indigo-50/50 to-white rounded-2xl border border-rose-200/70 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Aura AI Cross-Correlated Health Insights
              </h3>
              <span className="text-xs text-slate-500">
                Synthesizing your recent lab reports + daily logs + cycle rhythm
              </span>
            </div>
          </div>

          <button
            onClick={onOpenChat}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Ask AI Companion</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insight 1: Iron & Fatigue */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-rose-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                Biomarker Correlation
              </span>
              <span className="text-xs text-slate-400">· Ferritin (18 ng/mL)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Your logged afternoon fatigue on high-study days aligns with borderline low iron stores. Consistently taking your Iron + Vitamin C alongside your lunch (avoiding tea/coffee for 1 hour) can restore vitality over 6–8 weeks.
            </p>
          </div>

          {/* Insight 2: Sleep & Stress Loop */}
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                Habit Pattern Detected
              </span>
              <span className="text-xs text-slate-400">· 2-Day Lag Correlation</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              When sleep dropped below 6.5 hours two nights ago, reported headaches and caffeine intake doubled the following day. An evening digital curfew at 22:30 is recommended tonight to anchor sleep architecture.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Latest Lab Report Highlights & Biomarkers */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Medical Report Intelligence
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified OCR Parsed
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              {latestReport?.title || 'No reports uploaded yet'}
            </h3>
            <span className="text-xs text-slate-500">
              Report Date: {latestReport?.reportDate} · {latestReport?.fileName}
            </span>
          </div>

          <button
            onClick={onOpenReports}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Upload or View All Reports</span>
          </button>
        </div>

        {/* Flagged or key biomarkers */}
        {flaggedBiomarkers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flaggedBiomarkers.map((param) => {
              const isLow = param.status === 'low';
              const isBorderline = param.status === 'borderline';

              return (
                <div
                  key={param.id}
                  onClick={() => onOpenTrends(param.parameterName)}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer bg-slate-50/50 hover:bg-slate-50 group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {param.parameterName}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isLow
                          ? 'bg-rose-100 text-rose-800'
                          : isBorderline
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {param.status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-2xl font-bold text-slate-900 tabular-nums">
                      {param.value}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {param.unit}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 mt-1">
                    Standard Range: {param.referenceMin ?? 0} – {param.referenceMax ?? 'N/A'} {param.unit}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {param.plainExplanation}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-slate-800">
                    <span>View historical trend</span>
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">
              No laboratory reports uploaded yet. Upload a blood test, CBC, or metabolic panel to extract your parameters.
            </p>
            <button
              onClick={onOpenReports}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800"
            >
              Upload Medical Report
            </button>
          </div>
        )}
      </div>

      {/* 5. Flo-Style Daily Health Stories & Curated Guides */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Daily Health Stories & Scientific Guides
            </h3>
            <span className="text-xs text-slate-500">
              Curated evidence-based insights for youth & student wellness
            </span>
          </div>

          <button
            onClick={() => onOpenStories()}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <span>Explore Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => onOpenStories(story.id)}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group hover:border-slate-300"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-rose-600">{story.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{story.readTime}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                  {story.title}
                </h4>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {story.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[130px]">{story.evidenceSource}</span>
                <span className="font-medium text-slate-700 group-hover:underline">Read →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
