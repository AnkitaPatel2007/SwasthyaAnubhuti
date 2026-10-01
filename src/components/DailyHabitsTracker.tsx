import React, { useState } from 'react';
import {
  Droplets,
  Moon,
  Activity,
  Monitor,
  Pill,
  Flame,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Sparkles,
  Award,
  Coins,
  Bot,
  ArrowRight
} from 'lucide-react';
import {
  HabitGoal,
  HabitReminder,
  DailyHealthUpdate,
  UserProfile
} from '../types/index.ts';
import { WeeklyStreakMilestone } from './WeeklyStreakMilestone.tsx';

interface DailyHabitsTrackerProps {
  goals: HabitGoal[];
  reminders: HabitReminder[];
  latestUpdate: DailyHealthUpdate | null;
  dailyUpdates?: DailyHealthUpdate[];
  profile: UserProfile | null;
  onUpdateHealth: (data: Partial<DailyHealthUpdate>) => Promise<void>;
  onToggleReminder: (id: string) => Promise<void>;
  onAddReminder: (rem: Omit<HabitReminder, 'id' | 'userId'>) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
  onOpenArogyaSaathi?: () => void;
  onOpenRewards?: () => void;
  onClaimRewardPoints?: (points: number) => Promise<void>;
}

export const DailyHabitsTracker: React.FC<DailyHabitsTrackerProps> = ({
  goals,
  reminders,
  latestUpdate,
  dailyUpdates = [],
  profile,
  onUpdateHealth,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  onOpenArogyaSaathi,
  onOpenRewards,
  onClaimRewardPoints,
}) => {
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemTime, setNewRemTime] = useState('14:00');
  const [newRemCategory, setNewRemCategory] = useState<HabitReminder['category']>('water');
  const [showAddReminder, setShowAddReminder] = useState(false);

  const waterGlasses = latestUpdate?.waterGlasses ?? 6;
  const targetGlasses = Math.round((profile?.targetWaterMl || 2500) / 250);
  const waterPercent = Math.min(100, Math.round((waterGlasses / targetGlasses) * 100));

  const sleepHours = latestUpdate?.sleepHours ?? 7.5;
  const targetSleep = profile?.targetSleepHours ?? 8.0;

  const activityMins = latestUpdate?.activityMinutes ?? 30;
  const targetActivity = profile?.targetActivityMins ?? 30;

  const screenHours = latestUpdate?.screenTimeHours ?? 5.5;

  const supplementsTaken = latestUpdate?.supplementsTaken ?? [];
  const defaultSupplements = ['Iron + Vitamin C', 'Vitamin D3 (2000 IU)', 'Magnesium Glycinate', 'Omega-3', 'Multivitamin'];

  // Calculate overall consistency score
  const completedGoals = goals.filter((g) => g.completedToday).length;
  const consistencyScore = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 80;

  const handleAddReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim()) return;

    await onAddReminder({
      title: newRemTitle.trim(),
      time: newRemTime,
      category: newRemCategory,
      enabled: true,
      frequency: 'daily',
    });

    setNewRemTitle('');
    setShowAddReminder(false);
  };

  const toggleSupplement = async (supp: string) => {
    let next: string[];
    if (supplementsTaken.includes(supp)) {
      next = supplementsTaken.filter((s) => s !== supp);
    } else {
      next = [...supplementsTaken, supp];
    }
    await onUpdateHealth({ supplementsTaken: next });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 7-Day Weekly Streak Milestone Journey */}
      <WeeklyStreakMilestone
        profile={profile}
        dailyUpdates={dailyUpdates}
        onOpenRewards={onOpenRewards}
        onClaimRewardPoints={onClaimRewardPoints}
      />

      {/* Header & Streak Scorecard */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Daily Habit System
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Preventive Consistency Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Build Habits That Shield Your Long-Term Health
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Preventive biomarkers directly correlate with everyday routines: hydration, deep sleep architecture, and movement breaks.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Today’s Habit Score
              </span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {consistencyScore}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Streaks Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center"
            >
              <div className="flex items-center justify-center gap-1 text-rose-600 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-xs font-bold tabular-nums">{g.currentStreakDays} days</span>
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate block">
                {g.title.split(' ')[0]} {g.title.split(' ')[1] || ''}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {g.completedToday ? 'Completed today' : 'In progress'}
              </span>
            </div>
          ))}
        </div>

        {/* Streak Rewards & Arogya Points Banner */}
        <div className="mt-5 p-4 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white rounded-xl border border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  Streak Rewards: {profile?.healthPoints || 0} Arogya Points Balance
                </h4>
                <span className="text-[10px] font-bold text-teal-300 bg-teal-900/60 border border-teal-700 px-1.5 py-0.2 rounded">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Earn +20 points for every daily habit completed. Redeem points inside <strong>ArogyaSaathi</strong> for custom physician consultation dossiers and targeted nutrition protocols!
              </p>
            </div>
          </div>

          {onOpenArogyaSaathi && (
            <button
              onClick={onOpenArogyaSaathi}
              className="px-4 py-2 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Redeem in ArogyaSaathi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Habit Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit 1: Hydration Tank */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Hydration Tank</h4>
                  <span className="text-xs text-slate-500">Target: {profile?.targetWaterMl || 2500} ml / day</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {waterGlasses * 250} ml ({waterPercent}%)
              </span>
            </div>

            <div className="mt-4">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                <span>{waterGlasses} of {targetGlasses} glasses</span>
                <span>{targetGlasses - waterGlasses > 0 ? `${targetGlasses - waterGlasses} glasses remaining` : 'Target reached!'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Cellular hydration improves prefrontal lecture focus and prevents tension headaches during screen sprints.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onUpdateHealth({ waterGlasses: Math.max(0, waterGlasses - 1) })}
              className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              - 1 Glass
            </button>
            <button
              onClick={() => onUpdateHealth({ waterGlasses: waterGlasses + 1 })}
              className="flex-1 py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>+ Drink 1 Glass (250ml)</span>
            </button>
          </div>
        </div>

        {/* Habit 2: Sleep & Recovery */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sleep Duration & Vitals</h4>
                  <span className="text-xs text-slate-500">Target: {targetSleep} hours</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {sleepHours} hrs
              </span>
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-500 block mb-1">
                Log last night's total sleep duration:
              </label>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => onUpdateHealth({ sleepHours: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 mt-3">
              <span>Sleep Quality:</span>
              <div className="flex gap-1 text-amber-500 font-bold">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onUpdateHealth({ sleepQuality: star })}
                    className="hover:scale-110 transition-transform"
                  >
                    {star <= (latestUpdate?.sleepQuality || 4) ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Consistently getting 7.5–8.5 hours of sleep stabilizes morning cortisol and protects against insulin resistance.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Recommended bedtime: <strong>23:00</strong></span>
            <span>Wake target: <strong>07:00</strong></span>
          </div>
        </div>

        {/* Habit 3: Physical Movement */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Physical Activity</h4>
                  <span className="text-xs text-slate-500">Target: {targetActivity} mins / day</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {activityMins} mins
              </span>
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-500 block mb-1">
                Movement duration:
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={activityMins}
                onChange={(e) => onUpdateHealth({ activityMinutes: parseInt(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Activity Type Selector */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['Brisk Walking', 'Running', 'Gym/Weights', 'Cycling', 'Yoga/Pilates', 'Sports'].map((act) => (
                <button
                  key={act}
                  onClick={() => onUpdateHealth({ activityType: act })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                    latestUpdate?.activityType === act
                      ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Helps reduce LDL cholesterol and elevates cardioprotective HDL.
          </div>
        </div>

        {/* Habit 4: Screen Time & Digital Wellness */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Screen Time & Curfew</h4>
                  <span className="text-xs text-slate-500">Target: &lt; 6.0 hours</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {screenHours} hrs
              </span>
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-500 block mb-1">
                Estimated screen time today:
              </label>
              <input
                type="range"
                min="2"
                max="14"
                step="0.5"
                value={screenHours}
                onChange={(e) => onUpdateHealth({ screenTimeHours: parseFloat(e.target.value) })}
                className="w-full accent-amber-600"
              />
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Every 20 minutes of study, look at an object 20 feet away for 20 seconds to prevent digital myopia and neck muscle strain.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Night mode trigger: <strong>21:30</strong></span>
            <span>Digital curfew: <strong>22:30</strong></span>
          </div>
        </div>
      </div>

      {/* Medication & Supplement Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-rose-500" />
            <h4 className="text-sm font-bold text-slate-900">
              Daily Supplements & Prescribed Medications
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            {supplementsTaken.length} taken today
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {defaultSupplements.map((supp) => {
            const isTaken = supplementsTaken.includes(supp);
            return (
              <button
                key={supp}
                onClick={() => toggleSupplement(supp)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                  isTaken
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isTaken ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300" />
                )}
                <span>{supp}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Automated Reminders Management */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Automated Habit Notifications & Reminders
            </h4>
            <span className="text-xs text-slate-500">
              Set proactive cues for water, eye breaks, supplements, and wind-down.
            </span>
          </div>

          <button
            onClick={() => setShowAddReminder(!showAddReminder)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reminder</span>
          </button>
        </div>

        {showAddReminder && (
          <form
            onSubmit={handleAddReminderSubmit}
            className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Afternoon water break"
                  value={newRemTitle}
                  onChange={(e) => setNewRemTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={newRemTime}
                  onChange={(e) => setNewRemTime(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={newRemCategory}
                  onChange={(e) => setNewRemCategory(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="water">Hydration</option>
                  <option value="medication">Medication/Supplement</option>
                  <option value="movement">Movement/Posture</option>
                  <option value="sleep">Sleep & Rest</option>
                  <option value="eye_break">20-20-20 Eye Break</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddReminder(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Save Reminder
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 tabular-nums bg-white px-2 py-1 rounded border border-slate-200">
                  {rem.time}
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px]">
                    {rem.title}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {rem.category.replace('_', ' ')} · {rem.frequency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center ${
                    rem.enabled ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      rem.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <button
                  onClick={() => onDeleteReminder(rem.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
