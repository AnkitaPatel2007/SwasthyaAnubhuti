import React from 'react';
import { Sparkles, Calendar, Zap, Moon, Sun, Heart, Info } from 'lucide-react';
import { UserProfile, DailySymptomLog } from '../types/index.ts';

interface CycleOrEnergyRingProps {
  profile: UserProfile | null;
  todayLog: DailySymptomLog | null;
  onOpenCheckin: () => void;
  onToggleMode: (mode: 'cycle_and_wellness' | 'energy_and_circadian') => void;
}

export const CycleOrEnergyRing: React.FC<CycleOrEnergyRingProps> = ({
  profile,
  todayLog,
  onOpenCheckin,
  onToggleMode,
}) => {
  const isCycleMode = profile?.trackingMode === 'cycle_and_wellness';

  // Compute Cycle Day
  let cycleDay = 14;
  let cycleTotal = profile?.cycleLengthDays || 28;
  let phaseName = 'Follicular / Ovulation Window';
  let phaseTone = 'Peak Estrogen & High Energy';
  let chanceOrFocus = 'High verbal focus & physical stamina';
  let daysUntilPeriod = 14;

  if (profile?.lastPeriodStartDate) {
    const startMs = new Date(profile.lastPeriodStartDate).getTime();
    const nowMs = Date.now();
    const diffDays = Math.floor((nowMs - startMs) / (1000 * 60 * 60 * 24));
    cycleDay = (diffDays % cycleTotal) + 1;
    daysUntilPeriod = cycleTotal - cycleDay;

    if (cycleDay <= (profile.periodLengthDays || 5)) {
      phaseName = 'Menstrual Phase';
      phaseTone = 'Baseline Hormones & Restorative Rest';
      chanceOrFocus = 'Gentle walks, iron replenishment, hydration';
    } else if (cycleDay <= 13) {
      phaseName = 'Follicular Phase';
      phaseTone = 'Rising Estrogen & Brain Plasticity';
      chanceOrFocus = 'Optimal for learning, HIIT workouts, new projects';
    } else if (cycleDay <= 16) {
      phaseName = 'Ovulation Window';
      phaseTone = 'Estrogen Peak & Testosterone Surge';
      chanceOrFocus = 'High endurance, peak social confidence';
    } else {
      phaseName = 'Luteal Phase';
      phaseTone = 'Progesterone Active & Metabolic Rise';
      chanceOrFocus = 'Steady cardio, complex carbs, magnesium wind-down';
    }
  }

  // Circadian Time Calculation
  const currentHour = new Date().getHours();
  let circadianStage = 'Morning Cortisol Awakening';
  let circadianDetail = 'Natural light exposure, 500ml water, delayed caffeine';
  if (currentHour >= 9 && currentHour < 13) {
    circadianStage = 'Peak Cognitive Focus Window';
    circadianDetail = 'Prefrontal cortex focus at maximum. Deep analytical work.';
  } else if (currentHour >= 13 && currentHour < 16) {
    circadianStage = 'Post-Lunch Metabolic Dip';
    circadianDetail = 'Brisk 10-min walk, hydration, posture break.';
  } else if (currentHour >= 16 && currentHour < 20) {
    circadianStage = 'Cardiovascular Stamina Window';
    circadianDetail = 'Body temperature & muscle strength peak. Ideal for workouts.';
  } else {
    circadianStage = 'Melatonin Onset & Wind-Down';
    circadianDetail = 'Amber screen shift, dim lights, wind down for cell repair.';
  }

  // Progress percentage for SVG ring
  const percentage = isCycleMode
    ? Math.min(100, Math.round((cycleDay / cycleTotal) * 100))
    : Math.min(100, Math.round(((currentHour * 60 + new Date().getMinutes()) / 1440) * 100));

  const strokeDashoffset = 440 - (440 * percentage) / 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Mode switcher bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Biological Rhythm
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-medium">
            {isCycleMode ? 'Cycle & Hormonal Sync' : '24-Hour Circadian Curve'}
          </span>
        </div>

        {/* Interactive toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => onToggleMode('cycle_and_wellness')}
            className={`px-3 py-1 rounded-md transition-colors ${
              isCycleMode
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cycle Sync (Flo)
          </button>
          <button
            onClick={() => onToggleMode('energy_and_circadian')}
            className={`px-3 py-1 rounded-md transition-colors ${
              !isCycleMode
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Circadian Energy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Visual Ring Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Background ambient blur */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${
                isCycleMode
                  ? 'bg-gradient-to-tr from-rose-400 to-pink-500'
                  : 'bg-gradient-to-tr from-amber-400 to-indigo-500'
              }`}
            />

            {/* SVG Ring */}
            <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-100"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                className={`transition-all duration-1000 ease-out ${
                  isCycleMode ? 'stroke-rose-500' : 'stroke-indigo-600'
                }`}
                strokeWidth="10"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Central status readout */}
            <div className="absolute flex flex-col items-center text-center px-4">
              {isCycleMode ? (
                <>
                  <span className="text-xs uppercase tracking-wider font-semibold text-rose-600">
                    Cycle Day
                  </span>
                  <span className="text-4xl font-extrabold text-slate-900 tabular-nums">
                    {cycleDay}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">
                    of {cycleTotal} days
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-indigo-600">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Diurnal Stage</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs text-slate-500 mt-0.5">
                    Peak focus
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick status pill text */}
          <div className="mt-3 text-center">
            <span className="text-xs text-slate-500">
              {isCycleMode
                ? `Period expected in ~${daysUntilPeriod} days`
                : 'Circadian phase 3 of 4'}
            </span>
          </div>
        </div>

        {/* Narrative & Insights Column */}
        <div className="md:col-span-7 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isCycleMode ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
              }`}>
                {isCycleMode ? phaseName : circadianStage}
              </span>
              <span className="text-xs text-slate-400">· Today’s Horizon</span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {isCycleMode ? phaseTone : 'Optimum Focus & Productivity Rhythm'}
            </h3>

            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {isCycleMode
                ? `Your body is primed for: ${chanceOrFocus}. Proactive hydration and pairing your midday meal with iron-rich foods will help sustain energy through late lectures or desk work.`
                : circadianDetail}
            </p>

            {/* Today's Logged Symptoms Summary */}
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span className="font-semibold text-slate-800">Today’s Check-in Status</span>
                <span className="text-slate-400">
                  {todayLog ? 'Logged today' : 'Not yet logged'}
                </span>
              </div>

              {todayLog ? (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-700">Mood: <strong className="capitalize">{todayLog.mood}</strong></span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-700">Sleep: <strong>{todayLog.sleepHours} hrs</strong></span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-700">Water: <strong>{todayLog.waterGlasses} glasses</strong></span>
                  {todayLog.supplementsTaken && todayLog.supplementsTaken.length > 0 && (
                    <>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-700">Pills: <strong>{todayLog.supplementsTaken.join(', ')}</strong></span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  You haven’t checked in with your body today. Log your mood, energy, skin, and sleep in 30 seconds.
                </p>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCheckin}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-300" />
              <span>{todayLog ? 'Update Today’s Symptoms & Mood' : 'Log Today’s Feelings & Body'}</span>
            </button>

            <span className="text-xs text-slate-400">
              End-to-end private & encrypted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
