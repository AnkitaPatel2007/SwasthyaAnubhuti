import React, { useState } from 'react';
import { X, Sparkles, Droplets, Moon, Coffee, Heart, Activity, Check } from 'lucide-react';
import { DailySymptomLog } from '../types/index.ts';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingLog: DailySymptomLog | null;
  onSave: (log: Partial<DailySymptomLog>) => void;
  isCycleTracking: boolean;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  isOpen,
  onClose,
  existingLog,
  onSave,
  isCycleTracking,
}) => {
  if (!isOpen) return null;

  const [mood, setMood] = useState<DailySymptomLog['mood']>(existingLog?.mood || 'peaceful');
  const [fatigueLevel, setFatigueLevel] = useState<number>(existingLog?.fatigueLevel ?? 2);
  const [stressLevel, setStressLevel] = useState<number>(existingLog?.stressLevel ?? 2);
  const [mentalFocus, setMentalFocus] = useState<number>(existingLog?.mentalFocus ?? 4);

  const [sleepHours, setSleepHours] = useState<number>(existingLog?.sleepHours ?? 7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(existingLog?.sleepQuality ?? 4);
  const [waterGlasses, setWaterGlasses] = useState<number>(existingLog?.waterGlasses ?? 6);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(existingLog?.exerciseMinutes ?? 30);
  const [caffeineCups, setCaffeineCups] = useState<number>(existingLog?.caffeineCups ?? 1);

  const [cramps, setCramps] = useState<DailySymptomLog['cramps']>(existingLog?.cramps || 'none');
  const [headache, setHeadache] = useState<boolean>(existingLog?.headache || false);
  const [bloating, setBloating] = useState<boolean>(existingLog?.bloating || false);
  const [skinCondition, setSkinCondition] = useState<DailySymptomLog['skinCondition']>(existingLog?.skinCondition || 'clear');
  const [periodFlow, setPeriodFlow] = useState<DailySymptomLog['periodFlow']>(existingLog?.periodFlow || 'none');

  const defaultSupplements = ['Iron + Vitamin C', 'Vitamin D3 (2000 IU)', 'Magnesium', 'Omega-3', 'Multivitamin'];
  const [supplements, setSupplements] = useState<string[]>(existingLog?.supplementsTaken || ['Iron + Vitamin C']);
  const [notes, setNotes] = useState<string>(existingLog?.notes || '');

  const toggleSupplement = (supp: string) => {
    if (supplements.includes(supp)) {
      setSupplements(supplements.filter((s) => s !== supp));
    } else {
      setSupplements([...supplements, supp]);
    }
  };

  const handleSave = () => {
    onSave({
      date: new Date().toISOString().split('T')[0],
      mood,
      fatigueLevel,
      stressLevel,
      mentalFocus,
      sleepHours,
      sleepQuality,
      waterGlasses,
      exerciseMinutes,
      caffeineCups,
      cramps,
      headache,
      bloating,
      skinCondition,
      periodFlow,
      supplementsTaken: supplements,
      notes,
    });
    onClose();
  };

  const moods: { id: DailySymptomLog['mood']; label: string; emoji: string }[] = [
    { id: 'peaceful', label: 'Peaceful', emoji: '😌' },
    { id: 'energetic', label: 'High Energy', emoji: '⚡' },
    { id: 'focused', label: 'Deep Focus', emoji: '🎯' },
    { id: 'anxious', label: 'Anxious', emoji: '😰' },
    { id: 'irritable', label: 'Sensitive', emoji: '😤' },
    { id: 'low', label: 'Low Mood', emoji: '🌧️' },
    { id: 'stressed', label: 'Exam/Work Stress', emoji: '📚' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <h2 className="text-base font-bold text-slate-900">Today’s Body & Mind Check-In</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mood Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. How are you feeling emotionally?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    mood === m.id
                      ? 'border-rose-500 bg-rose-50/60 text-rose-950 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Period Flow (if tracking cycle) */}
          {isCycleTracking && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Menstrual Flow
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(['none', 'spotting', 'light', 'medium', 'heavy'] as const).map((flow) => (
                  <button
                    key={flow}
                    type="button"
                    onClick={() => setPeriodFlow(flow)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs capitalize transition-all ${
                      periodFlow === flow
                        ? 'border-rose-500 bg-rose-500 text-white font-medium'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {flow}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Physical Sensations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              {isCycleTracking ? '3. Physical Sensations' : '2. Physical Sensations'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Cramps */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-700 block mb-1.5">Cramps</span>
                <select
                  value={cramps}
                  onChange={(e) => setCramps(e.target.value as any)}
                  className="w-full text-xs p-1.5 rounded-md border border-slate-200 bg-white text-slate-800"
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              {/* Skin */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-700 block mb-1.5">Skin / Complexion</span>
                <select
                  value={skinCondition}
                  onChange={(e) => setSkinCondition(e.target.value as any)}
                  className="w-full text-xs p-1.5 rounded-md border border-slate-200 bg-white text-slate-800"
                >
                  <option value="clear">Clear & Radiant</option>
                  <option value="oily">Oily T-Zone</option>
                  <option value="breakouts">Breakouts / Acne</option>
                  <option value="dry">Dry / Dehydrated</option>
                </select>
              </div>

              {/* Headache toggle */}
              <button
                type="button"
                onClick={() => setHeadache(!headache)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  headache
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-medium'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xs">Headache</span>
                <span className="text-[11px] text-slate-400 mt-1">{headache ? 'Present' : 'None'}</span>
              </button>

              {/* Bloating toggle */}
              <button
                type="button"
                onClick={() => setBloating(!bloating)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  bloating
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-medium'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xs">Digestive Bloating</span>
                <span className="text-[11px] text-slate-400 mt-1">{bloating ? 'Present' : 'None'}</span>
              </button>
            </div>
          </div>

          {/* Vitals & Habits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sleep */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  Sleep
                </span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>

            {/* Hydration */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  Hydration
                </span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">{waterGlasses} glasses</span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-2">
                <button
                  type="button"
                  onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                  className="px-2.5 py-0.5 rounded bg-white border border-slate-300 text-xs font-bold"
                >
                  -
                </button>
                <span className="text-xs text-slate-500 tabular-nums">~{waterGlasses * 250} ml</span>
                <button
                  type="button"
                  onClick={() => setWaterGlasses(waterGlasses + 1)}
                  className="px-2.5 py-0.5 rounded bg-white border border-slate-300 text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Exercise */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Movement
                </span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">{exerciseMinutes} mins</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(parseInt(e.target.value))}
                className="w-full accent-emerald-600 mt-2"
              />
            </div>
          </div>

          {/* Supplements Taken */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Supplements / Prescribed Meds Taken Today
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultSupplements.map((supp) => {
                const isSelected = supplements.includes(supp);
                return (
                  <button
                    key={supp}
                    type="button"
                    onClick={() => toggleSupplement(supp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-300" />}
                    <span>{supp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Daily Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Diary Note (Encrypted & Confidential)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Felt energetic after morning run, studied 4 hours in library, afternoon coffee gave mild jitters..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            AuraHealth data isolation active
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm"
            >
              Save Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
