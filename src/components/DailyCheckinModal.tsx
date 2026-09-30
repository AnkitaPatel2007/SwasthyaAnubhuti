import React, { useState } from 'react';
import { X, Activity, Droplets, Moon, Heart, Sparkles, Check, AlertCircle } from 'lucide-react';
import { DailyHealthUpdate } from '../types/index.ts';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingLog: DailyHealthUpdate | null;
  onSave: (log: Partial<DailyHealthUpdate>) => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  isOpen,
  onClose,
  existingLog,
  onSave,
}) => {
  if (!isOpen) return null;

  const [restingHeartRate, setRestingHeartRate] = useState<number>(existingLog?.restingHeartRate ?? 72);
  const [bloodPressure, setBloodPressure] = useState<string>(existingLog?.bloodPressure || '118/76');
  const [weightKg, setWeightKg] = useState<number>(existingLog?.weightKg ?? 62.0);

  const [energyLevel, setEnergyLevel] = useState<number>(existingLog?.energyLevel ?? 4);
  const [stressLevel, setStressLevel] = useState<number>(existingLog?.stressLevel ?? 2);
  const [mood, setMood] = useState<DailyHealthUpdate['mood']>(existingLog?.mood || 'productive');

  const [waterGlasses, setWaterGlasses] = useState<number>(existingLog?.waterGlasses ?? 6);
  const [sleepHours, setSleepHours] = useState<number>(existingLog?.sleepHours ?? 7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(existingLog?.sleepQuality ?? 4);
  const [activityMinutes, setActivityMinutes] = useState<number>(existingLog?.activityMinutes ?? 30);
  const [activityType, setActivityType] = useState<string>(existingLog?.activityType || 'Brisk walking');
  const [screenTimeHours, setScreenTimeHours] = useState<number>(existingLog?.screenTimeHours ?? 5.5);
  const [nutritionQuality, setNutritionQuality] = useState<DailyHealthUpdate['nutritionQuality']>(
    existingLog?.nutritionQuality || 'healthy_balanced'
  );

  const defaultSupplements = ['Iron + Vitamin C', 'Vitamin D3 (2000 IU)', 'Magnesium Glycinate', 'Omega-3', 'Multivitamin'];
  const [supplements, setSupplements] = useState<string[]>(existingLog?.supplementsTaken || ['Iron + Vitamin C']);

  const commonSymptoms = [
    'Headache',
    'Acid Reflux / Heartburn',
    'Brain Fog / Fatigue',
    'Eye Strain',
    'Neck / Shoulder Tension',
    'Bloating / Gas',
    'Dizziness',
    'Muscle Aches'
  ];
  const [symptoms, setSymptoms] = useState<string[]>(existingLog?.symptomsReported || []);
  const [notes, setNotes] = useState<string>(existingLog?.notes || '');

  const toggleSupplement = (supp: string) => {
    if (supplements.includes(supp)) {
      setSupplements(supplements.filter((s) => s !== supp));
    } else {
      setSupplements([...supplements, supp]);
    }
  };

  const toggleSymptom = (symp: string) => {
    if (symptoms.includes(symp)) {
      setSymptoms(symptoms.filter((s) => s !== symp));
    } else {
      setSymptoms([...symptoms, symp]);
    }
  };

  const handleSave = () => {
    onSave({
      date: new Date().toISOString().split('T')[0],
      restingHeartRate,
      bloodPressure,
      weightKg,
      energyLevel,
      stressLevel,
      mood,
      waterGlasses,
      sleepHours,
      sleepQuality,
      activityMinutes,
      activityType,
      screenTimeHours,
      nutritionQuality,
      supplementsTaken: supplements,
      symptomsReported: symptoms,
      notes,
    });
    onClose();
  };

  const moods: { id: DailyHealthUpdate['mood']; label: string }[] = [
    { id: 'great', label: 'Great & Energetic' },
    { id: 'productive', label: 'Productive & Focused' },
    { id: 'normal', label: 'Normal' },
    { id: 'fatigued', label: 'Fatigued / Low Stamina' },
    { id: 'stressed', label: 'Stressed / Overwhelmed' },
    { id: 'anxious', label: 'Anxious / Restless' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">
              Log Today’s Health Vitals & Daily Habits
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Clinical Vitals */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. Clinical Vitals (Optional / Estimated)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Blood Pressure (mmHg)
                </span>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="118/76"
                  className="w-full text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Resting Heart Rate (bpm)
                </span>
                <input
                  type="number"
                  value={restingHeartRate}
                  onChange={(e) => setRestingHeartRate(parseInt(e.target.value))}
                  placeholder="72"
                  className="w-full text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Current Weight (kg)
                </span>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  placeholder="62.0"
                  className="w-full text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Mood & Energy */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              2. Energy & Mental State
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {moods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    mood === m.id
                      ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Energy Level:</span>
                  <span className="font-bold text-slate-900">{energyLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700">Stress Level:</span>
                  <span className="font-bold text-slate-900">{stressLevel} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Daily Habits (Water, Sleep, Activity, Screen) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              3. Daily Habit Tracking
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Hydration */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    Hydration
                  </span>
                  <span className="text-[11px] text-slate-400">~{waterGlasses * 250} ml logged</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold tabular-nums">{waterGlasses}</span>
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(waterGlasses + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Sleep */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    Sleep Hours
                  </span>
                  <span className="text-[11px] text-slate-400">Total duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="4"
                    max="14"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-16 text-center text-xs font-bold p-1 rounded-lg border border-slate-300 bg-white"
                  />
                  <span className="text-xs text-slate-500">hrs</span>
                </div>
              </div>

              {/* Activity */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    Physical Activity
                  </span>
                  <span className="text-[11px] text-slate-400">{activityType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="180"
                    value={activityMinutes}
                    onChange={(e) => setActivityMinutes(parseInt(e.target.value))}
                    className="w-16 text-center text-xs font-bold p-1 rounded-lg border border-slate-300 bg-white"
                  />
                  <span className="text-xs text-slate-500">mins</span>
                </div>
              </div>

              {/* Screen Time */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800">Screen Time</span>
                  <span className="text-[11px] text-slate-400 block">Laptops + Phones</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="16"
                    value={screenTimeHours}
                    onChange={(e) => setScreenTimeHours(parseFloat(e.target.value))}
                    className="w-16 text-center text-xs font-bold p-1 rounded-lg border border-slate-300 bg-white"
                  />
                  <span className="text-xs text-slate-500">hrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Symptoms Reported Today */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              4. Symptoms Experienced Today (For Disease Pattern Tracking)
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map((symp) => {
                const isSelected = symptoms.includes(symp);
                return (
                  <button
                    key={symp}
                    type="button"
                    onClick={() => toggleSymptom(symp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {symp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Supplements */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              5. Supplements & Meds Taken
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultSupplements.map((supp) => {
                const isTaken = supplements.includes(supp);
                return (
                  <button
                    key={supp}
                    type="button"
                    onClick={() => toggleSupplement(supp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isTaken
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isTaken && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{supp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Personal Health Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Felt alert during midday study, afternoon stairs caused mild shortness of breath..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            AuraHealth Medical Encrypted Store
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
              Save Health Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
