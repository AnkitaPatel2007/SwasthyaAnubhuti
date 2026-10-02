import React, { useState } from 'react';
import {
  AlertTriangle,
  HeartPulse,
  Moon,
  Droplets,
  Activity,
  Flame,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  Bot,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { HealthAnomalyInsight } from '../types/index.ts';

interface HealthInsightNotifierProps {
  insights: HealthAnomalyInsight[];
  onDismissInsight?: (id: string) => void;
  onQuickAction?: (insight: HealthAnomalyInsight) => void;
  onAskAI?: (prompt: string) => void;
}

export const HealthInsightNotifier: React.FC<HealthInsightNotifierProps> = ({
  insights,
  onDismissInsight,
  onQuickAction,
  onAskAI,
}) => {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const activeInsights = insights.filter((i) => !dismissedIds.has(i.id));

  if (activeInsights.length === 0) return null;

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
    if (onDismissInsight) onDismissInsight(id);
  };

  const getIcon = (type: HealthAnomalyInsight['type']) => {
    switch (type) {
      case 'sleep_drop':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      case 'heart_rate_spike':
        return <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'blood_pressure_spike':
        return <Activity className="w-4 h-4 text-amber-500" />;
      case 'hydration_deficit':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'stress_surge':
        return <Flame className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-200/90 shadow-sm overflow-hidden mb-6 animate-fade-in">
      {/* Header bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-rose-950/90 via-slate-900 to-teal-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Health Insight Anomaly Surveillance
              </h4>
              <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-extrabold animate-pulse">
                {activeInsights.length} Anomaly{activeInsights.length > 1 ? 'ies' : ''}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 hidden sm:block">
              Algorithmic trend monitor detected unusual biomarker deviations from your baseline
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs"
        >
          <span>{isExpanded ? 'Collapse' : 'View Alerts'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Insight List */}
      {isExpanded && (
        <div className="divide-y divide-slate-100 p-2 sm:p-3 space-y-2">
          {activeInsights.map((insight) => {
            const isUrgent = insight.severity === 'urgent';

            return (
              <div
                key={insight.id}
                className={`p-3 sm:p-4 rounded-xl transition-all ${
                  isUrgent
                    ? 'bg-rose-50/70 border border-rose-200/80'
                    : 'bg-amber-50/50 border border-amber-200/70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isUrgent ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {getIcon(insight.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                          {insight.title}
                        </h5>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                            isUrgent
                              ? 'bg-rose-200 text-rose-900 font-extrabold'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {insight.severity}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Logged: {insight.detectedAt}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {insight.message}
                      </p>

                      {/* Comparison Pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="text-slate-500 font-medium">Metric:</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-slate-900 font-bold">
                          {insight.metricLabel}: {insight.metricCurrent}
                        </span>
                        <span className="text-slate-400">vs</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-slate-500">
                          Baseline: {insight.metricBaseline}
                        </span>
                      </div>

                      {/* Clinical Action */}
                      <div className="mt-2 p-2 bg-white/90 rounded-lg border border-slate-200/80 text-[11px] text-slate-800 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-teal-950 font-bold">Recommended Recovery: </strong>
                          {insight.clinicalAction}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {onAskAI && (
                          <button
                            onClick={() =>
                              onAskAI(
                                `I received a health insight alert: "${insight.title} - ${insight.message}". What should I do to safely stabilize this today?`
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                          >
                            <Bot className="w-3.5 h-3.5 text-teal-200" />
                            <span>Ask ArogyaSaathi</span>
                          </button>
                        )}

                        {insight.type === 'hydration_deficit' && onQuickAction && (
                          <button
                            onClick={() => onQuickAction(insight)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                          >
                            <Droplets className="w-3.5 h-3.5 text-sky-200" />
                            <span>Drink 1 Glass (+250ml)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={() => handleDismiss(insight.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
