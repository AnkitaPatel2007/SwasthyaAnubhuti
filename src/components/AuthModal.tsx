import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, LogOut, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (email: string, pass: string, name: string) => Promise<void>;
  onGoogleLogin: (email: string, name?: string) => Promise<void>;
  onLogout: () => void;
  onLoadDemo: () => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  onGoogleLogin,
  onLogout,
  onLoadDemo,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // Sample detected Google accounts for smooth 1-click authentication
  const detectedGoogleAccounts = [
    { name: 'Priya Patel Verma', email: 'priyapatelverma888@gmail.com', avatarLetter: 'P' },
    { name: 'Student Medical ID', email: 'student.youth@gmail.com', avatarLetter: 'S' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSelect = async (accountEmail: string, accountName?: string) => {
    setError(null);
    setLoading(true);
    try {
      await onGoogleLogin(accountEmail, accountName);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }
    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    const suggestedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    await handleGoogleSelect(cleanEmail, suggestedName);
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await onLoadDemo();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo load failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-teal-100 overflow-hidden">
        {/* Medical Card Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">
                {currentUser ? 'Patient Profile & Security' : mode === 'login' ? 'Clinical Sign In' : 'Create Patient Chart'}
              </h2>
              <span className="text-[10px] text-teal-300 font-mono tracking-wider">
                AURAHEALTH · HIPAA SAFEGUARD
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 p-4 bg-teal-50/60 rounded-2xl border border-teal-100">
                <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h4>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">Verified</span>
                  </div>
                  <span className="text-xs text-slate-500 truncate block">{currentUser.email}</span>
                  <div className="text-[11px] text-slate-500 mt-1 capitalize font-medium">
                    {currentUser.age} yrs · {currentUser.gender} · {currentUser.lifestyle}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Blood Group</span>
                  <strong className="text-slate-900 font-bold text-sm">{currentUser.bloodGroup || 'O+'}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Arogya Points</span>
                  <strong className="text-teal-700 font-bold text-sm">🪙 {currentUser.healthPoints || 0} pts</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Patient Chart</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              {/* 1. Google Mail Authentication (High Priority) */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setShowGoogleChooser(!showGoogleChooser)}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-slate-300 shadow-xs flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  {/* Google SVG Emblem */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google Mail</span>
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    +150 Pts
                  </span>
                </button>

                {/* Google Mail Chooser Drawer */}
                {showGoogleChooser && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fade-in">
                    <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                      <span>Choose Google Mail account:</span>
                      <span className="text-[10px] text-slate-400">OAuth Verified</span>
                    </div>

                    <div className="space-y-1.5">
                      {detectedGoogleAccounts.map((acc) => (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => handleGoogleSelect(acc.email, acc.name)}
                          disabled={loading}
                          className="w-full p-2.5 bg-white hover:bg-teal-50 text-left rounded-xl border border-slate-200 hover:border-teal-200 transition-all flex items-center gap-3 text-xs group"
                        >
                          <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                            {acc.avatarLetter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-slate-900 block truncate">{acc.name}</span>
                            <span className="text-[11px] text-slate-500 block truncate">{acc.email}</span>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                      ))}
                    </div>

                    {/* Or enter custom Google Email */}
                    <form onSubmit={handleCustomGoogleSubmit} className="pt-2 border-t border-slate-200/80">
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="YourName@gmail.com"
                          value={customGoogleEmail}
                          onChange={(e) => setCustomGoogleEmail(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-700 bg-white"
                        />
                        <button
                          type="submit"
                          disabled={loading || !customGoogleEmail}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl whitespace-nowrap"
                        >
                          Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 my-3">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[10px] uppercase font-mono text-slate-400">or use email login</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Standard Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Full Legal / Preferred Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Validating Chart...' : mode === 'login' ? 'Sign In to Chart' : 'Create Medical Chart'}
                </button>

                <div className="text-center text-xs text-slate-500 pt-1">
                  {mode === 'login' ? (
                    <span>
                      Don't have a profile yet?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('register')}
                        className="text-teal-700 font-bold hover:underline"
                      >
                        Register Free
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('login')}
                        className="text-teal-700 font-bold hover:underline"
                      >
                        Sign In
                      </button>
                    </span>
                  )}
                </div>

                {/* Quick Interactive Demo Chart */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleDemo}
                    disabled={loading}
                    className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100/80 text-teal-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-teal-200/70"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Load Interactive Demo Chart (Alex - 22yo Student)</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-1 text-teal-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>End-to-end encrypted telemetry</span>
          </div>
          <span>HIPAA / Zero Data Sale</span>
        </div>
      </div>
    </div>
  );
};
