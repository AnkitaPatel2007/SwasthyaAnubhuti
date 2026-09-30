import React from 'react';
import { Sun, Sunset, Moon, Brain, Coffee, CheckCircle2, Circle, Sparkles, RefreshCw, Activity } from 'lucide-react';
import { DailyWellnessPlan } from '../types/index.ts';

interface CoachPlannerProps {
  plan: DailyWellnessPlan | null;
  onToggleRoutine: (routineId: string) => void;
  onRegeneratePlan: () => void;
}

export const CoachPlanner: React.FC<CoachPlannerProps> = ({
  plan,
  onToggleRoutine,
  onRegeneratePlan,
}) => {
  if (!plan) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading wellness plan...
      </div>
    );
  }

  const completedCount = plan.routines.filter((r) => r.completed).length;
  const progressPercent = Math.round((completedCount / plan.routines.length) * 100);

  const getSlotIcon = (slot: string) => {
    switch (slot) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'midday':
        return <Brain className="w-4 h-4 text-sky-500" />;
      case 'evening':
        return <Sunset className="w-4 h-4 text-rose-500" />;
      case 'night':
      default:
        return <Moon className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getSlotTitle = (slot: string) => {
    switch (slot) {
      case 'morning':
        return 'Morning Awakening (07:00 – 10:00)';
      case 'midday':
        return 'Midday Focus & Nutrition (11:00 – 14:30)';
      case 'evening':
        return 'Evening Movement & Decompression (16:00 – 19:30)';
      case 'night':
      default:
        return 'Nocturnal Melatonin Wind-Down (21:00 – 23:00)';
    }
  };

  // Group routines by timeSlot
  const morningItems = plan.routines.filter((r) => r.timeSlot === 'morning');
  const middayItems = plan.routines.filter((r) => r.timeSlot === 'midday');
  const eveningItems = plan.routines.filter((r) => r.timeSlot === 'evening');
  const nightItems = plan.routines.filter((r) => r.timeSlot === 'night');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Circadian Focus Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Personalized Circadian Coach
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">24-Hour Rhythm Architecture</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {plan.focusTheme}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
              {plan.circadianAdvice}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Daily Adherence</span>
              <div className="text-lg font-bold text-slate-900 tabular-nums">
                {completedCount} / {plan.routines.length} habits ({progressPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Biomarker Integration Tip */}
        {plan.biomarkerTip && (
          <div className="mt-4 p-3.5 bg-rose-50/70 rounded-xl border border-rose-100 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-950 leading-relaxed font-medium">
              {plan.biomarkerTip}
            </p>
          </div>
        )}
      </div>

      {/* Routine Slots Grid */}
      <div className="space-y-6">
        {[
          { slot: 'morning', items: morningItems },
          { slot: 'midday', items: middayItems },
          { slot: 'evening', items: eveningItems },
          { slot: 'night', items: nightItems },
        ].map((group) => {
          if (group.items.length === 0) return null;

          return (
            <div
              key={group.slot}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                {getSlotIcon(group.slot)}
                <h4 className="text-sm font-bold text-slate-900">
                  {getSlotTitle(group.slot)}
                </h4>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleRoutine(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      item.completed
                        ? 'bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 focus:outline-none"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-bold block ${
                          item.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
