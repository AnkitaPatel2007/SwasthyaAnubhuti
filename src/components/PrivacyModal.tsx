import React, { useState } from 'react';
import { X, Shield, Lock, Download, Trash2, EyeOff, Check, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  privacyMask: boolean;
  onTogglePrivacyMask: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onExportData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  profile,
  privacyMask,
  onTogglePrivacyMask,
  onUpdateProfile,
  onExportData,
  onDeleteAccount,
}) => {
  if (!isOpen) return null;

  const [pin, setPin] = useState<string>(profile?.pinCode || '');
  const [anonymousMode, setAnonymousMode] = useState<boolean>(profile?.anonymousMode || false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSavePreferences = async () => {
    try {
      await onUpdateProfile({
        pinCode: pin,
        anonymousMode,
      });
      setSaveStatus('Preferences saved successfully.');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      setSaveStatus(err.message || 'Error saving settings.');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExportData();
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    try {
      await onDeleteAccount();
      onClose();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">
              Confidentiality, Security & Data Sovereignty
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
          {/* Privacy Statement Banner */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950 leading-relaxed">
            <strong className="block mb-1">Our Youth Privacy Commitment:</strong>
            Inspired by reproductive health apps like Flo, AuraHealth holds your health records, cycle information, and daily feelings under strict tenant isolation. We never sell, monetize, or expose personal medical telemetry.
          </div>

          {/* Feature 1: Confidential Screen Mask Toggle */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-slate-700" />
                Confidential Screen Mask (Anti-Shoulder Surfing)
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Instantly blurs cycle days, biomarker readings, and symptom notes when in public or shared study spaces.
              </p>
            </div>
            <button
              onClick={onTogglePrivacyMask}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                privacyMask
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              {privacyMask ? 'Active (Blurred)' : 'Turn On'}
            </button>
          </div>

          {/* Feature 2: Anonymous Mode Toggle */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Anonymous Mode
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Disguises your full name and email across all screens.
              </p>
            </div>
            <button
              onClick={() => setAnonymousMode(!anonymousMode)}
              className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${
                anonymousMode ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  anonymousMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Feature 3: Passcode PIN */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4-Digit Confidential Access PIN (Optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-24 text-center tracking-widest text-sm p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-xs text-slate-500">
                Requires PIN entry to view medical lab reports and cycle records.
              </span>
            </div>
          </div>

          {saveStatus && (
            <div className="p-2.5 bg-slate-100 text-slate-800 text-xs rounded-lg">
              {saveStatus}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Save Security Preferences
            </button>
          </div>

          {/* Feature 4: Data Export & Account Deletion */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Data Sovereignty Rights (GDPR & HIPAA Alignment)
            </span>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Export Data */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export Complete Health File (.JSON)'}</span>
              </button>

              {/* Delete Account */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${
                  confirmDelete
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {confirmDelete
                    ? 'Confirm Permanent Wipe'
                    : 'Permanently Delete Account'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
