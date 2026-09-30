import React, { useState } from 'react';
import { TrendingUp, ArrowDownRight, ArrowUpRight, Minus, Calendar, Info, Sparkles } from 'lucide-react';
import { MedicalReport } from '../types/index.ts';

interface TrendsVisualizerProps {
  reports: MedicalReport[];
  initialParam?: string;
  onOpenReport: (reportId: string) => void;
}

export const TrendsVisualizer: React.FC<TrendsVisualizerProps> = ({
  reports,
  initialParam,
  onOpenReport,
}) => {
  // Aggregate all unique parameters across all reports
  const allParamsMap = new Map<string, { date: string; value: number; unit: string; status: string; refMin?: number; refMax?: number; reportId: string; reportTitle: string }[]>();

  for (const report of reports) {
    for (const p of report.parameters) {
      const key = p.parameterName.trim();
      if (!allParamsMap.has(key)) {
        allParamsMap.set(key, []);
      }
      allParamsMap.get(key)!.push({
        date: p.reportDate || report.reportDate,
        value: p.value,
        unit: p.unit,
        status: p.status,
        refMin: p.referenceMin,
        refMax: p.referenceMax,
        reportId: report.id,
        reportTitle: report.title,
      });
    }
  }

  // Sort each parameter's history chronologically
  for (const list of allParamsMap.values()) {
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const availableParams = Array.from(allParamsMap.keys());
  const [selectedParam, setSelectedParam] = useState<string>(
    initialParam && allParamsMap.has(initialParam)
      ? initialParam
      : availableParams[0] || 'Hemoglobin'
  );

  const activeHistory = allParamsMap.get(selectedParam) || [];
  const latestRecord = activeHistory[activeHistory.length - 1];
  const priorRecord = activeHistory.length > 1 ? activeHistory[activeHistory.length - 2] : null;

  let deltaPercent = 0;
  if (latestRecord && priorRecord && priorRecord.value !== 0) {
    deltaPercent = Math.round(((latestRecord.value - priorRecord.value) / priorRecord.value) * 100);
  }

  // Chart coordinates calculation
  const width = 640;
  const height = 240;
  const padding = 45;

  const values = activeHistory.map((h) => h.value);
  const minVal = Math.min(...values, latestRecord?.refMin ?? values[0] ?? 0) * 0.9;
  const maxVal = Math.max(...values, latestRecord?.refMax ?? values[0] ?? 100) * 1.1;
  const valRange = maxVal - minVal || 1;

  const points = activeHistory.map((h, i) => {
    const x =
      activeHistory.length === 1
        ? width / 2
        : padding + (i / (activeHistory.length - 1)) * (width - padding * 2);
    const y = height - padding - ((h.value - minVal) / valRange) * (height - padding * 2);
    return { x, y, ...h };
  });

  const svgPolyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Normal range band coordinates
  const refMinY =
    latestRecord?.refMin !== undefined
      ? height - padding - ((latestRecord.refMin - minVal) / valRange) * (height - padding * 2)
      : null;
  const refMaxY =
    latestRecord?.refMax !== undefined
      ? height - padding - ((latestRecord.refMax - minVal) / valRange) * (height - padding * 2)
      : null;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Longitudinal Biomarker Intelligence
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Historical Comparison Engine</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Biomarker Timeline & Reference Intervals
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Track how your nutrition, sleep, and lifestyle habits shift your blood parameters over semesters and seasons.
            </p>
          </div>

          {/* Biomarker selector pill dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Select Biomarker:
            </span>
            <select
              value={selectedParam}
              onChange={(e) => setSelectedParam(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {availableParams.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        {activeHistory.length > 0 ? (
          <div>
            {/* Stat Row */}
            <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Latest Value ({latestRecord.date})
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {latestRecord.value}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    {latestRecord.unit}
                  </span>
                  <span
                    className={`ml-2 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                      latestRecord.status === 'optimal'
                        ? 'bg-emerald-50 text-emerald-700'
                        : latestRecord.status === 'low'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {latestRecord.status}
                  </span>
                </div>
              </div>

              {priorRecord && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Shift vs previous test ({priorRecord.date}):
                  </span>
                  <div
                    className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
                      deltaPercent > 0
                        ? 'bg-slate-100 text-slate-800'
                        : deltaPercent < 0
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {deltaPercent > 0 ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : deltaPercent < 0 ? (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    ) : (
                      <Minus className="w-3.5 h-3.5" />
                    )}
                    <span className="tabular-nums">{Math.abs(deltaPercent)}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* SVG Visualizer */}
            <div className="mt-6 w-full overflow-x-auto">
              <div className="min-w-[600px] h-[260px] relative">
                <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
                  {/* Shaded Reference Interval Band (Normal Zone) */}
                  {refMinY !== null && refMaxY !== null && (
                    <rect
                      x={padding}
                      y={Math.min(refMinY, refMaxY)}
                      width={width - padding * 2}
                      height={Math.abs(refMinY - refMaxY)}
                      fill="#10b981"
                      fillOpacity="0.08"
                    />
                  )}

                  {/* Reference line labels */}
                  {refMinY !== null && (
                    <line
                      x1={padding}
                      y1={refMinY}
                      x2={width - padding}
                      y2={refMinY}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  )}
                  {refMaxY !== null && (
                    <line
                      x1={padding}
                      y1={refMaxY}
                      x2={width - padding}
                      y2={refMaxY}
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Timeline Polyline */}
                  {points.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#0f172a"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={svgPolyline}
                    />
                  )}

                  {/* Data Points */}
                  {points.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="6"
                        className={`${
                          pt.status === 'optimal'
                            ? 'fill-emerald-500'
                            : pt.status === 'low'
                            ? 'fill-rose-500'
                            : 'fill-amber-500'
                        } stroke-white stroke-2 shadow-sm`}
                      />
                      {/* Value label above point */}
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-800 tabular-nums"
                      >
                        {pt.value} {pt.unit}
                      </text>
                      {/* Date label under X-axis */}
                      <text
                        x={pt.x}
                        y={height - 15}
                        textAnchor="middle"
                        className="text-[10px] font-semibold fill-slate-400 tabular-nums"
                      >
                        {pt.date}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Shaded legend note */}
                <div className="absolute top-2 right-2 text-[11px] text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded border border-emerald-200">
                  Green shaded band: Standard reference interval
                </div>
              </div>
            </div>

            {/* Historical Data Table */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Historical Records for {selectedParam}
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400">
                      <th className="pb-2 font-semibold">Test Date</th>
                      <th className="pb-2 font-semibold">Value</th>
                      <th className="pb-2 font-semibold">Standard Range</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 font-semibold">Source Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 font-medium text-slate-800 tabular-nums">{item.date}</td>
                        <td className="py-2.5 font-bold text-slate-900 tabular-nums">
                          {item.value} {item.unit}
                        </td>
                        <td className="py-2.5 text-slate-500 tabular-nums">
                          {item.refMin ?? 0} – {item.refMax ?? 'N/A'} {item.unit}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                              item.status === 'optimal'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <button
                            onClick={() => onOpenReport(item.reportId)}
                            className="text-slate-600 hover:text-slate-900 hover:underline"
                          >
                            {item.reportTitle}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No history recorded for this parameter yet.
          </div>
        )}
      </div>

      {/* AI Longitudinal Pattern Insight */}
      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 block mb-1">Preventive Health Trend Analysis:</strong>
          Historical tracking helps separate temporary acute dips (e.g., from severe dehydration or temporary illness) from gradual baseline drifts (such as chronic iron depletion or winter Vitamin D decline). Discuss persistent multi-month trends with your clinician during your annual health checkup.
        </div>
      </div>
    </div>
  );
};
