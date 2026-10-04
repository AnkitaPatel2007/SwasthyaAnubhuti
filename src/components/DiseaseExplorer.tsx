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
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:border-slate-300"
          >
            <div>
              {/* Real Clinical & Medical Photography Header */}
              {disease.imageUrl && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={disease.imageUrl}
                    alt={disease.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider block">
                      {disease.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 leading-snug drop-shadow-xs">
                      {disease.name}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-3">
                {!disease.imageUrl && (
                  <div>
                    <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                      {disease.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                      {disease.name}
                    </h3>
                  </div>
                )}

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {disease.description}
                </p>

                {/* Common Symptoms */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Recognized Early Symptoms:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
                    {disease.commonSymptoms.slice(0, 3).map((sym, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md"
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
            </div>

            {/* Diagnostic Marker preview & Source */}
            <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-[200px]">
                Key Test: <strong className="text-slate-800">{disease.keyLabTests[0]?.keyParameter}</strong>
              </span>
              <span className="font-semibold text-teal-800 group-hover:text-teal-950 flex items-center gap-1 shrink-0">
                <span>Clinical Guide</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Disease Detail Modal */}
      {activeDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            {/* Modal Hero Banner with Real Clinical Image */}
            {activeDisease.imageUrl ? (
              <div className="relative h-56 w-full shrink-0 bg-slate-900 overflow-hidden">
                <img
                  src={activeDisease.imageUrl}
                  alt={activeDisease.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <button
                  onClick={() => setActiveDisease(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                    {activeDisease.category} · Clinical Preventive Dossier
                  </span>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {activeDisease.name}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                    <span>Prevalence: {activeDisease.prevalenceInYouth}</span>
                    {activeDisease.clinicalSource && (
                      <>
                        <span>·</span>
                        <span className="text-teal-200">{activeDisease.clinicalSource}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    {activeDisease.category} · Preventive Guide
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    {activeDisease.name}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveDisease(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
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
                  Recognized Symptoms in Students & Young Adults
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
                  {activeDisease.commonSymptoms.map((symp, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{symp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagnostic Lab Tests */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Diagnostic Biomarkers & Clinical Lab Parameters
                  </h4>
                </div>
                <div className="space-y-2">
                  {activeDisease.keyLabTests.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                    >
                      <div>
                        <strong className="text-slate-900">{t.testName}</strong>
                        <span className="text-slate-500"> — {t.keyParameter}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-rose-700 font-semibold text-[11px]">
                          Abnormal: {t.typicalAbnormality}
                        </span>
                        <button
                          onClick={() => {
                            setActiveDisease(null);
                            onSelectBiomarkerForTrend(t.keyParameter.split(' ')[0]);
                          }}
                          className="text-[11px] text-teal-700 hover:text-teal-900 font-bold underline cursor-pointer"
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
      </div>
    )}
  </div>
);
};
