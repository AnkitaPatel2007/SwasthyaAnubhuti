import React, { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  Moon,
  Droplets,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Bot,
  Plus,
  X,
  ArrowDownRight
} from 'lucide-react';
import { TrendDeclineAlert, TrendActionTip } from '../types/index.ts';

interface BiomarkerDeclineAlertBannerProps {
  alerts: TrendDeclineAlert[];
  onQuickAddWater?: () => Promise<void>;
  onAddReminder?: (title: string, time: string, category: 'water' | 'sleep') => Promise<void>;
  onOpenChatWithPrompt?: (prompt: string) => void;
  onDismissAlert?: (alertId: string) => void;
}

export const BiomarkerDeclineAlertBanner: React.FC<BiomarkerDeclineAlertBannerProps> = ({
  alerts,
  onQuickAddWater,
  onAddReminder,
  onOpenChatWithPrompt,
  onDismissAlert,
}) => {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(alerts[0]?.id || null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!alerts || alerts.length === 0) return null;

  const handleTipAction = async (tip: TrendActionTip, alert: TrendDeclineAlert) => {
    if (tip.actionType === 'add_water' && onQuickAddWater) {
      await onQuickAddWater();
      setActionFeedback('✓ Added 1 glass (+250ml) to today!');
      setTimeout(() => setActionFeedback(null), 3000);
    } else if (tip.actionType === 'set_reminder' && onAddReminder) {
      await onAddReminder('Bedtime & Phone Off', '22:30', 'sleep');
      setActionFeedback('✓ Added 10:30 PM reminder!');
      setTimeout(() => setActionFeedback(null), 3000);
    } else if (tip.actionType === 'ask_ai' && onOpenChatWithPrompt) {
      onOpenChatWithPrompt(`My ${alert.biomarker} has dropped over the past 7 days. Give me 3 simple steps to get back on track.`);
    }
  };

  const getBiomarkerIcon = (biomarker: string) => {
    switch (biomarker) {
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'energy':
        return <Zap className="w-5 h-5 text-amber-500" />;
      default:
        return <TrendingDown className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-4 border border-rose-900/50 shadow-md text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Health Alert: Sleep & Water are down
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30">
                  {alerts.length} Needs Attention
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Steadily dropping over the last 7 days. Here are simple ways to bounce back.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-amber-300 bg-slate-800/80 px-2.5 py-1 rounded-lg self-start sm:self-auto flex items-center gap-1.5 border border-amber-500/30 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Past 7 days</span>
          </div>
        </div>

        {actionFeedback && (
          <div className="mt-2.5 p-2 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}
      </div>

      {/* Alert Cards */}
      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const isExpanded = expandedAlertId === alert.id;
          const maxVal = Math.max(...alert.dataPoints.map((d) => d.value), 1);

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                alert.severity === 'critical' ? 'border-rose-200' : 'border-amber-200'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      alert.severity === 'critical'
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    {getBiomarkerIcon(alert.biomarker)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {alert.title}
                      </h4>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          alert.severity === 'critical'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {alert.severity === 'critical' ? 'Critical' : 'Notice'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {alert.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block uppercase font-mono">
                      7-Day Drop
                    </span>
                    <span className="text-xs sm:text-sm font-black font-mono text-rose-600 flex items-center justify-end gap-0.5">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      {alert.deltaText}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onDismissAlert && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismissAlert(alert.id);
                        }}
                        title="Dismiss"
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="p-1 rounded-lg bg-slate-100 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Drawer */}
              {isExpanded && (
                <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 bg-slate-50/50 animate-fade-in">
                  {/* Mini Sparkline Chart */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        <span>Last 7 Days</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Started: <strong>{alert.baselineValue} {alert.unit}</strong> → Today: <strong className="text-rose-600">{alert.currentValue} {alert.unit}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 pt-2 items-end h-20">
                      {alert.dataPoints.map((dp, i) => {
                        const heightPercent = Math.max(15, Math.round((dp.value / maxVal) * 100));
                        const isLast = i === alert.dataPoints.length - 1;

                        return (
                          <div key={dp.date} className="flex flex-col items-center h-full justify-end">
                            <span className="text-[9px] font-mono font-bold text-slate-600 mb-0.5">
                              {dp.value}
                            </span>
                            <div className="w-full bg-slate-100 rounded-t h-full flex items-end overflow-hidden">
                              <div
                                style={{ height: `${heightPercent}%` }}
                                className={`w-full rounded-t transition-all ${
                                  isLast
                                    ? 'bg-rose-500'
                                    : i >= 4
                                    ? 'bg-amber-400'
                                    : 'bg-teal-500'
                                }`}
                              />
                            </div>
                            <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                              {dp.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Why it matters */}
                  <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-200/80 text-xs text-rose-900 flex items-start gap-2">
                    <span className="font-bold shrink-0">Why it matters:</span>
                    <span className="text-rose-800 text-[11px] leading-relaxed">
                      {alert.impactExplanation}
                    </span>
                  </div>

                  {/* Tips */}
                  <div>
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Quick Fixes</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {alert.actionableTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {tip.title}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {tip.description}
                            </p>
                          </div>

                          {tip.actionLabel && (
                            <button
                              onClick={() => handleTipAction(tip, alert)}
                              className="mt-2.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                            >
                              <Plus className="w-3 h-3 text-teal-400" />
                              <span>{tip.actionLabel}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat helper button */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Want a personalized daily plan?
                    </span>
                    <button
                      onClick={() => {
                        if (onOpenChatWithPrompt) {
                          onOpenChatWithPrompt(
                            `My ${alert.biomarker} has dropped to ${alert.currentValue} ${alert.unit}. What are 3 simple habits to recover this week?`
                          );
                        }
                      }}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask AI Coach</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
