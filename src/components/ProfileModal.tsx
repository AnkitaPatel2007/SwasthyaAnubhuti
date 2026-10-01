import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  Key,
  LogOut,
  Mail,
  HeartPulse,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Activity,
  Droplets,
  Moon,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
  onGoogleLogin: (email: string, name?: string) => Promise<void>;
  onLogout: () => void;
  onExportData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onLoadDemo: () => Promise<void>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogin,
  onRegister,
  onGoogleLogin,
  onLogout,
  onExportData,
  onDeleteAccount,
  onLoadDemo,
}) => {
  if (!isOpen) return null;

  // Active view: if profile exists default to 'profile', otherwise 'auth'
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'auth'>(
    profile ? 'profile' : 'auth'
  );

  // Profile Form State
  const [name, setName] = useState(profile?.name || 'Alex Rivera');
  const [email, setEmail] = useState(profile?.email || 'alex.wellness@aurahealth.internal');
  const [age, setAge] = useState<number>(profile?.age || 22);
  const [gender, setGender] = useState<UserProfile['gender']>(profile?.gender || 'female');
  const [heightCm, setHeightCm] = useState<number>(profile?.heightCm || 168);
  const [weightKg, setWeightKg] = useState<number>(profile?.weightKg || 62);
  const [bloodGroup, setBloodGroup] = useState<string>(profile?.bloodGroup || 'O+');
  const [lifestyle, setLifestyle] = useState<UserProfile['lifestyle']>(profile?.lifestyle || 'student');
  const [targetWaterMl, setTargetWaterMl] = useState<number>(profile?.targetWaterMl || 2500);
  const [targetSleepHours, setTargetSleepHours] = useState<number>(profile?.targetSleepHours || 8.0);
  const [systolic, setSystolic] = useState<number>(profile?.bloodPressureSystolic || 118);
  const [diastolic, setDiastolic] = useState<number>(profile?.bloodPressureDiastolic || 76);
  const [restingHr, setRestingHr] = useState<number>(profile?.restingHeartRate || 71);

  // Security & Privacy State
  const [anonymousMode, setAnonymousMode] = useState<boolean>(profile?.anonymousMode || false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Auth State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      await onUpdateProfile({
        name,
        email,
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        bloodGroup,
        lifestyle,
        targetWaterMl: Number(targetWaterMl),
        targetSleepHours: Number(targetSleepHours),
        bloodPressureSystolic: Number(systolic),
        bloodPressureDiastolic: Number(diastolic),
        restingHeartRate: Number(restingHr),
        anonymousMode,
      });
      setStatusMessage('Biometric baselines updated successfully.');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setStatusMessage(`Error: ${err?.message || 'Failed to update profile'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSaving(true);
    try {
      if (authMode === 'signin') {
        await onLogin(authEmail, authPassword);
      } else {
        await onRegister(authEmail, authPassword, authName);
      }
      setStatusMessage('Signed in successfully.');
      setTimeout(() => setStatusMessage(null), 3000);
      setActiveTab('profile');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 sm:pt-18 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full sm:w-[480px] max-h-[88vh] overflow-hidden flex flex-col mt-14 sm:mt-0 mr-0 sm:mr-4">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {profile ? profile.name : 'Account Login'}
                </h3>
                {profile && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-400/20 text-teal-300">
                    {profile.bloodGroup || 'O+'}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[200px]">
                {profile ? profile.email : 'Enter your credentials'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {profile && (
              <button
                onClick={() => {
                  onLogout();
                  setActiveTab('auth');
                }}
                title="Log out of account"
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 rounded-lg transition-colors cursor-pointer mr-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 shrink-0 text-xs font-bold">
          {profile ? (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'profile'
                    ? 'border-teal-700 text-teal-900 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'security'
                    ? 'border-teal-700 text-teal-900 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Privacy & Vault</span>
              </button>

              <button
                onClick={() => setActiveTab('auth')}
                className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'auth'
                    ? 'border-teal-700 text-teal-900 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Switch Account</span>
              </button>
            </>
          ) : (
            <div className="py-2.5 px-2 text-xs font-bold text-teal-800 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" />
              <span>Authentication Gateway</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {statusMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* TAB 1: Biometric Profile Form */}
          {activeTab === 'profile' && profile && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Baseline Clinical Targets */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase font-mono block">
                  Clinical Target Baselines
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-400 block font-mono">Resting BP</span>
                    <span className="text-xs font-bold font-mono text-slate-900 mt-0.5 block">{systolic}/{diastolic}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-400 block font-mono">Water (mL)</span>
                    <input
                      type="number"
                      step="100"
                      value={targetWaterMl}
                      onChange={(e) => setTargetWaterMl(Number(e.target.value))}
                      className="w-full text-xs font-bold font-mono text-center bg-white rounded border border-slate-200 mt-0.5"
                    />
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-[9px] text-slate-400 block font-mono">Sleep (Hrs)</span>
                    <input
                      type="number"
                      step="0.5"
                      value={targetSleepHours}
                      onChange={(e) => setTargetSleepHours(Number(e.target.value))}
                      className="w-full text-xs font-bold font-mono text-center bg-white rounded border border-slate-200 mt-0.5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    setActiveTab('auth');
                  }}
                  className="text-xs text-rose-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Profile</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Updating...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Security & Privacy */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Confidential Privacy Mask
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Mask personal vitals on shared screens.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !anonymousMode;
                    setAnonymousMode(next);
                    onUpdateProfile({ anonymousMode: next });
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    anonymousMode ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {anonymousMode ? 'Mask Active' : 'Off'}
                </button>
              </div>

              {/* Data Export */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Export Medical Vault
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Download full cryptographic JSON ledger.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onExportData}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-teal-700" />
                  <span>Download</span>
                </button>
              </div>

              {/* Danger Zone: Account Deletion */}
              <div className="p-3.5 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>GDPR / HIPAA Data Purge</span>
                </h4>
                <p className="text-[10px] text-rose-700">
                  Permanently deletes your profile, uploaded tests, and daily journals.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to permanently delete your medical vault and account?')) {
                      onDeleteAccount();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete All Data</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Login / Sign Up */}
          {(activeTab === 'auth' || !profile) && (
            <div className="space-y-4">
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'signup' && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Priya Patel"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  {authMode === 'signin' ? 'Sign In to Profile' : 'Register Account'}
                </button>
              </form>

              {/* 1-Click Google Sign-In */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 block text-center mb-1.5 font-mono">
                  FAST 1-CLICK AUTHENTICATION
                </span>
                <button
                  type="button"
                  onClick={() => onGoogleLogin('priyapatelverma888@gmail.com', 'Priya Patel Verma')}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95"
                >
                  <div className="w-4 h-4 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] font-bold">
                    P
                  </div>
                  <span>Continue as Priya Patel Verma</span>
                </button>
              </div>

              {/* Reload Demo Baseline */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={async () => {
                    await onLoadDemo();
                    setStatusMessage('Demo baseline reloaded.');
                    setActiveTab('profile');
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-mono underline cursor-pointer"
                >
                  Reload Student Demo Account (Alex Rivera)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
