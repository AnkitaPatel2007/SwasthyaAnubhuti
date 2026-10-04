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
  Coins,
  Bot,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  HabitGoal,
  HabitReminder,
  DailyHealthUpdate,
  UserProfile
} from '../types/index.ts';
import { WeeklyStreakMilestone } from './WeeklyStreakMilestone.tsx';
import { APP_IMAGES } from '../assets/images.ts';

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
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* 7-Day Weekly Streak Milestone Journey */}
      <WeeklyStreakMilestone
        profile={profile}
        dailyUpdates={dailyUpdates}
        onOpenRewards={onOpenRewards}
        onClaimRewardPoints={onClaimRewardPoints}
      />

      {/* Header & Streak Scorecard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-teal-800">Preventive Routine Engine</span>
              <span>·</span>
              <span>Mayo Clinic & WHO Lifestyle Benchmarks</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Physiological Habit Routines
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Consistent daily hydration, sleep architecture, and movement breaks directly shield against early cardiovascular strain and insulin resistance.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">
                Routine Adherence
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {consistencyScore}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Streaks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center"
            >
              <div className="flex items-center justify-center gap-1 text-teal-800 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-xs font-bold font-mono tabular-nums">{g.currentStreakDays} days</span>
              </div>
              <span className="text-xs font-semibold text-slate-800 truncate block">
                {g.title.split(' ')[0]} {g.title.split(' ')[1] || ''}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {g.completedToday ? 'Logged today' : 'Pending entry'}
              </span>
            </div>
          ))}
        </div>

        {/* Streak Rewards Banner */}
        <div className="mt-5 p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-800 text-teal-200 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white">
                  Arogya Points Balance: {profile?.healthPoints || 0} Points
                </h4>
                <span className="text-[10px] text-teal-300 font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Earn points for every verified clinical routine completed. Redeem for clinical consultation dossiers and targeted nutrition protocols.
              </p>
            </div>
          </div>

          {onOpenArogyaSaathi && (
            <button
              onClick={onOpenArogyaSaathi}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Redeem Rewards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Habit Trackers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Habit 1: Hydration Tank with Real Photography */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="relative h-36 w-full bg-slate-100 overflow-hidden">
            <img
              src={APP_IMAGES.lifestyleHydration}
              alt="Pure mineral water carafe for hydration routine"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-5 right-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-teal-300 uppercase tracking-wider block">
                  Mayo Clinic Hydration Standard (2.7L)
                </span>
                <h3 className="text-base font-bold text-white">
                  Hydration Volume
                </h3>
              </div>
              <span className="text-sm font-mono font-bold text-white tabular-nums">
                {waterGlasses * 250} ml ({waterPercent}%)
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-700 rounded-full transition-all duration-300"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-mono">
                <span>{waterGlasses} of {targetGlasses} glasses</span>
                <span>{targetGlasses - waterGlasses > 0 ? `${targetGlasses - waterGlasses} remaining` : 'Target achieved'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Maintains blood plasma volume and cellular electrolyte concentration, preventing dehydration-induced vascular tension.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => onUpdateHealth({ waterGlasses: Math.max(0, waterGlasses - 1) })}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                - 1 Glass
              </button>
              <button
                onClick={() => onUpdateHealth({ waterGlasses: waterGlasses + 1 })}
                className="flex-1 py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>+ Drink 1 Glass (250ml)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Habit 2: Sleep & Circadian Architecture */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sleep Duration & Vitals</h3>
                  <span className="text-xs text-slate-500">CDC & Mayo Recommendation: {targetSleep} hours</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {sleepHours} hrs
              </span>
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-500 block mb-1">
                Recorded sleep duration last night:
              </label>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => onUpdateHealth({ sleepHours: parseFloat(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 mt-4">
              <span>Sleep Restorativeness Rating:</span>
              <div className="flex gap-1.5 font-mono">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => onUpdateHealth({ sleepQuality: level })}
                    className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors cursor-pointer ${
                      level <= (latestUpdate?.sleepQuality || 4)
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Consistently achieving 7.5–8.5 hours of sleep optimizes daytime cellular stamina and stabilizes morning insulin sensitivity.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Recommended bedtime: <strong>23:00</strong></span>
            <span>Wake target: <strong>07:00</strong></span>
          </div>
        </div>

        {/* Habit 3: Physical Movement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Cardiovascular Movement</h3>
                  <span className="text-xs text-slate-500">WHO Guideline: {targetActivity} mins / day</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {activityMins} mins
              </span>
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-500 block mb-1">
                Duration of aerobic activity:
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={activityMins}
                onChange={(e) => onUpdateHealth({ activityMinutes: parseInt(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {['Brisk Walking', 'Running', 'Strength Training', 'Cycling', 'Yoga', 'Swimming'].map((act) => (
                <button
                  key={act}
                  onClick={() => onUpdateHealth({ activityType: act })}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors cursor-pointer ${
                    latestUpdate?.activityType === act
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            Assists in maintaining protective HDL and regulates vascular tone.
          </div>
        </div>

        {/* Habit 4: Screen Time & Digital Curfew */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Screen Time & Curfew</h3>
                  <span className="text-xs text-slate-500">Target: &lt; 6.0 hours</span>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                {screenHours} hrs
              </span>
            </div>

            <div className="mt-4">
              <label className="text-xs text-slate-500 block mb-1">
                Estimated daily screen exposure:
              </label>
              <input
                type="range"
                min="2"
                max="14"
                step="0.5"
                value={screenHours}
                onChange={(e) => onUpdateHealth({ screenTimeHours: parseFloat(e.target.value) })}
                className="w-full accent-slate-900 cursor-pointer"
              />
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Follow the 20-20-20 rule during study blocks to prevent ocular strain and cervical spine tension.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Night mode trigger: <strong>21:30</strong></span>
            <span>Digital curfew: <strong>22:30</strong></span>
          </div>
        </div>
      </div>

      {/* Medication & Supplement Tracking */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Daily Supplements & Micronutrients
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {supplementsTaken.length} of {defaultSupplements.length} taken today
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {defaultSupplements.map((supp) => {
            const isTaken = supplementsTaken.includes(supp);
            return (
              <button
                key={supp}
                onClick={() => toggleSupplement(supp)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                  isTaken
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isTaken ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-400" />
                )}
                <span>{supp}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Automated Reminders Management */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Automated Habit Notifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured notification triggers for hydration, ocular breaks, and evening wind-down.
            </p>
          </div>

          <button
            onClick={() => setShowAddReminder(!showAddReminder)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
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
                  placeholder="E.g. Afternoon hydration interval"
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
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
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
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 font-mono tabular-nums bg-white px-2 py-1 rounded border border-slate-200">
                  {rem.time}
                </span>
                <div>
                  <span className="text-xs font-semibold text-slate-900 block truncate max-w-[200px]">
                    {rem.title}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {rem.category.replace('_', ' ')} · {rem.frequency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center cursor-pointer ${
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
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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
