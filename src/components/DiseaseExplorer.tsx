import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Search,
  CheckCircle2,
  FileText,
  TrendingUp,
  Stethoscope,
  Info,
  ShieldAlert,
  ChevronRight,
  X
} from 'lucide-react';
import { DiseaseCondition } from '../types/index.ts';

interface DiseaseExplorerProps {
  diseases: DiseaseCondition[];
  onSelectBiomarkerForTrend: (paramName: string) => void;
  onOpenReportUpload: () => void;
}

export const DiseaseExplorer: React.FC<DiseaseExplorerProps> = ({
  diseases,
  onSelectBiomarkerForTrend,
  onOpenReportUpload,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDisease, setActiveDisease] = useState<DiseaseCondition | null>(null);

  const categories = [
    'All',
    'Nutritional & Blood',
    'Metabolic & Cardiovascular',
    'Endocrine & Hormones',
    'Mental & Neurological',
    'Digestive & Gut'
  ];

  const filteredDiseases = diseases.filter((d) => {
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      searchQuery === '' ||
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.commonSymptoms.some((s) => s.toLowerCase().includes(q)) ||
      d.keyLabTests.some((t) => t.keyParameter.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Educational Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Youth Disease & Preventive Health Radar</span>
          </div>
          <h2 className="text-lg font-bold">
            Understand Symptoms, Chronic Risks & Lab Markers
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Many conditions in students and young adults (anemia, vitamin deficiencies, pre-diabetes, early hypertension, thyroid slowdown) develop silently. Learn what your symptoms mean, which lab tests monitor them, and when to seek medical evaluation.
          </p>
        </div>

        <button
          onClick={onOpenReportUpload}
          className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search diseases, symptoms (e.g. fatigue, headache, acid reflux)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredDiseases.length} condition guides
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <div
            key={disease.id}
            onClick={() => setActiveDisease(disease)}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-slate-300"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-rose-600">
                  {disease.category}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                {disease.name}
              </h3>

              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                {disease.description}
              </p>

              {/* Symptoms Preview */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Common Symptoms in Youth:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {disease.commonSymptoms.slice(0, 3).map((sym, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {sym}
                    </span>
                  ))}
                  {disease.commonSymptoms.length > 3 && (
                    <span className="text-[11px] text-slate-400 self-center">
                      +{disease.commonSymptoms.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnostic Marker preview */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Lab Tests: <strong>{disease.keyLabTests[0]?.keyParameter}</strong>
              </span>
              <span className="font-semibold text-slate-900 group-hover:underline">
                View Full Guide →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Disease Detail Modal */}
      {activeDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  {activeDisease.category} · Preventive Disease Guide
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  {activeDisease.name}
                </h2>
                <span className="text-xs text-slate-500 mt-1 block">
                  Youth Prevalence: {activeDisease.prevalenceInYouth}
                </span>
              </div>
              <button
                onClick={() => setActiveDisease(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Overview & Physiological Mechanism
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeDisease.description}
              </p>
            </div>

            {/* Symptoms & Signs */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Common Symptoms in Students & Young Adults
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
                {activeDisease.commonSymptoms.map((symp, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagnostic Lab Tests */}
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-700" />
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Diagnostic Lab Tests & Biomarkers to Monitor
                </h4>
              </div>
              <div className="space-y-2">
                {activeDisease.keyLabTests.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-lg border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                  >
                    <div>
                      <strong className="text-slate-900">{t.testName}</strong>
                      <span className="text-slate-400"> — {t.keyParameter}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-rose-700 font-semibold text-[11px]">
                        Alert: {t.typicalAbnormality}
                      </span>
                      <button
                        onClick={() => {
                          setActiveDisease(null);
                          onSelectBiomarkerForTrend(t.keyParameter.split(' ')[0]);
                        }}
                        className="text-[11px] text-indigo-600 hover:text-indigo-900 font-medium underline"
                      >
                        Plot Trend
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifestyle & Prevention */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Evidence-Based Lifestyle & Preventive Habits
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeDisease.preventionLifestyle.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{prev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flag Warning Signs */}
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Warning Signs: When to See a Doctor Immediately
                </h4>
              </div>
              <ul className="space-y-1 text-xs text-rose-900">
                {activeDisease.warningSignsWhenToSeeDoctor.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>AuraHealth Clinical Preventive Catalog</span>
              <button
                onClick={() => setActiveDisease(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
