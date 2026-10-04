import React, { useState } from 'react';
import {
  UploadCloud,
  Trash2,
  TrendingUp,
  Sparkles,
  Info,
  Download
} from 'lucide-react';
import { MedicalReport, UserProfile } from '../types/index.ts';
import { generateReportPDF } from '../utils/pdfGenerator.ts';
import { APP_IMAGES } from '../assets/images.ts';

interface ReportsVaultProps {
  reports: MedicalReport[];
  userProfile?: UserProfile | null;
  onUploadReport: (payload: { fileName: string; fileData?: string; mimeType?: string; title?: string }) => Promise<void>;
  onDeleteReport: (id: string) => Promise<void>;
  onSelectBiomarkerForTrend: (paramName: string) => void;
}

export const ReportsVault: React.FC<ReportsVaultProps> = ({
  reports,
  userProfile,
  onUploadReport,
  onDeleteReport,
  onSelectBiomarkerForTrend,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit. Please upload a smaller scan or PDF.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(',')[1] || '';
          await onUploadReport({
            fileName: file.name,
            fileData: base64Data,
            mimeType: file.type || 'application/pdf',
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          });
        } catch (err: any) {
          setUploadError(err.message || 'Report processing failed.');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Could not read file.');
      setIsUploading(false);
    }
  };

  const handleSampleUpload = async (sampleType: 'anemia' | 'metabolic') => {
    setIsUploading(true);
    setUploadError(null);
    try {
      if (sampleType === 'anemia') {
        await onUploadReport({
          fileName: 'Sample_Student_CBC_Ferritin_Panel.pdf',
          fileData: '',
          mimeType: 'application/pdf',
          title: 'Student Complete Blood Count & Iron Panel',
        });
      } else {
        await onUploadReport({
          fileName: 'Sample_Metabolic_Vitamin_Panel.pdf',
          fileData: '',
          mimeType: 'application/pdf',
          title: 'Comprehensive Youth Metabolic & Vitamin D Check',
        });
      }
    } catch (err: any) {
      setUploadError(err.message || 'Sample test upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Upload Zone & Clinical Photography Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Clinical Lab Image */}
          <div className="lg:col-span-4 relative h-48 lg:h-auto bg-slate-100 overflow-hidden">
            <img
              src={APP_IMAGES.clinicalLabAnalysis}
              alt="Clinical laboratory diagnostic analysis"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 right-4 text-white lg:hidden">
              <span className="text-[10px] uppercase tracking-wider text-teal-300 font-semibold block">
                OCR Biomarker Extraction
              </span>
              <h2 className="text-sm font-bold text-white">Laboratory Panel Digitalization</h2>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="lg:col-span-8 p-6 lg:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <span className="font-semibold text-teal-800">Diagnostic Records Vault</span>
                <span>·</span>
                <span>Automated Parameter Ingestion</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Upload & Digitize Clinical Lab Reports
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-2xl">
                Upload CBC, Ferritin, Metabolic panels, or Lipid profiles (PDF, PNG, JPG). Parameters are extracted and checked against standard reference intervals.
              </p>

              {uploadError && (
                <div className="mt-3 p-2.5 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-200">
                  {uploadError}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <label className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2">
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? 'Extracting Biomarkers...' : 'Upload PDF or Scan'}</span>
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => handleSampleUpload('anemia')}
                disabled={isUploading}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                + Demo CBC & Ferritin Panel
              </button>
              <button
                onClick={() => handleSampleUpload('metabolic')}
                disabled={isUploading}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                + Demo Metabolic Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Reports Browser: Left Archive, Right Report Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report History List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Archived Reports ({reports.length})
            </span>
            <span>Chronological</span>
          </div>

          {reports.map((r) => {
            const isSelected = r.id === (activeReport?.id || '');
            const flaggedCount = r.parameters.filter(
              (p) => p.status === 'low' || p.status === 'high'
            ).length;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedReportId(r.id)}
                className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono tabular-nums">
                    {r.reportDate}
                  </span>
                  {flaggedCount > 0 ? (
                    <span className="text-amber-800 font-medium font-mono text-[11px]">
                      {flaggedCount} attention
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium font-mono text-[11px]">
                      Nominal
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-900 mt-1 leading-snug">
                  {r.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                  <span className="truncate max-w-[140px]">{r.fileName}</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-mono">{r.parameters.length} markers</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateReportPDF(r, userProfile);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-900 rounded transition-colors cursor-pointer"
                      title="Download as PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Active Report Deep Dive */}
        <div className="lg:col-span-8">
          {activeReport ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">Report Ingestion Record</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{activeReport.reportDate}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {activeReport.title}
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    File: {activeReport.fileName} · ({(activeReport.fileSize / 1024).toFixed(0)} KB)
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => generateReportPDF(activeReport, userProfile)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Download complete clinical summary as PDF for doctor review"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download as PDF</span>
                  </button>

                  <button
                    onClick={() => onDeleteReport(activeReport.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Clinical Language Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-800" />
                  <span>Clinical Synthesis</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeReport.summary}
                </p>
              </div>

              {/* Extracted Parameters Grid */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
                  Extracted Biomarkers ({activeReport.parameters.length})
                </span>

                <div className="space-y-3">
                  {activeReport.parameters.map((param) => {
                    const isOptimal = param.status === 'optimal';
                    const isLow = param.status === 'low';

                    return (
                      <div
                        key={param.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-900">
                                {param.parameterName}
                              </h4>
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono ${
                                  isOptimal
                                    ? 'bg-slate-100 text-slate-800'
                                    : isLow
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-rose-100 text-rose-900'
                                }`}
                              >
                                {param.status}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 capitalize">
                              Category: {param.category.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="text-left sm:text-right">
                            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
                              {param.value} <span className="text-xs font-normal text-slate-500">{param.unit}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Ref: {param.referenceMin ?? 0} – {param.referenceMax ?? 'N/A'} {param.unit}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                          <p><strong>Physiological Context:</strong> {param.plainExplanation}</p>
                          <p className="mt-1 text-slate-500"><strong>Youth Guideline:</strong> {param.youthRelevance}</p>
                        </div>

                        <div className="mt-2.5 flex justify-end">
                          <button
                            onClick={() => onSelectBiomarkerForTrend(param.parameterName)}
                            className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Plot on Longitudinal Timeline →</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Questions to Discuss with Doctor */}
              {activeReport.doctorDiscussionPoints && activeReport.doctorDiscussionPoints.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block mb-2">
                    Questions for Your Healthcare Professional
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeReport.doctorDiscussionPoints.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-slate-400 font-bold">·</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              Select or upload a report to inspect biomarkers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
