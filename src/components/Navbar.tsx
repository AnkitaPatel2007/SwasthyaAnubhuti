import React from 'react';
import {
  Activity,
  FileText,
  Stethoscope,
  TrendingUp,
  CheckSquare,
  Bot,
  Eye,
  EyeOff,
  Lock,
  HeartPulse,
  Shield,
  PhoneCall
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile | null;
  privacyMask: boolean;
  onTogglePrivacyMask: () => void;
  onOpenCheckin: () => void;
  onOpenPrivacy: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  privacyMask,
  onTogglePrivacyMask,
  onOpenCheckin,
  onOpenPrivacy,
  onOpenAuth,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Clinical Vitals', icon: Activity },
    { id: 'reports', label: 'Lab Reports', icon: FileText },
    { id: 'diseases', label: 'Diseases & Symptoms', icon: Stethoscope },
    { id: 'trends', label: 'Biomarker Trends', icon: TrendingUp },
    { id: 'habits', label: 'Daily Habits', icon: CheckSquare },
    { id: 'chat', label: 'AI Health Companion', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-[0_2px_15px_-3px_rgba(15,118,110,0.06)]">
      {/* Top Clinical Utility Micro-Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-teal-400 font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>CLINICAL MONITOR LIVE</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Patient: {profile?.name || 'Alex Rivera'} (DOB 2004 · Age {profile?.age || 22} · Blood: {profile?.bloodGroup || 'O+'})
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="hidden md:inline">HIPAA / GDPR Data Isolation Active</span>
          <div className="flex items-center gap-1 text-rose-400 font-medium hover:text-rose-300 transition-colors">
            <PhoneCall className="w-3 h-3" />
            <span>Emergency: 911 / 988</span>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand with Medical Emblem */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-sm shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  AuraHealth
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200/80 px-1.5 py-0.2 rounded-md">
                  CLINICAL
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5 tracking-wider font-medium">
                PREVENTIVE MEDICAL INTELLIGENCE
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links with Medical Icons */}
        <nav className="hidden xl:flex items-center gap-2 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-50 text-teal-900 border border-teal-200/90 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Clinical Actions & Privacy Mask */}
        <div className="flex items-center gap-2.5">
          {/* Quick Privacy Shield */}
          <button
            onClick={onTogglePrivacyMask}
            title={privacyMask ? 'Turn off Privacy Mask (Reveal screen)' : 'Confidential Screen Mask (Blur sensitive readings in public)'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              privacyMask
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {privacyMask ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden sm:inline">
              {privacyMask ? 'Masked' : 'Confidential'}
            </span>
          </button>

          {/* Quick Clinical Log Button */}
          <button
            onClick={onOpenCheckin}
            className="px-3.5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all shadow-sm shadow-teal-700/20 flex items-center gap-1.5 active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-teal-200" />
            <span>Record Vitals</span>
          </button>

          {/* Security & Account */}
          <button
            onClick={onOpenPrivacy}
            title="Data Security & Sovereignty"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 pl-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-xs font-semibold border border-slate-200"
          >
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[11px]">
              {profile?.name ? profile.name.charAt(0) : 'A'}
            </div>
            <span className="hidden md:inline max-w-[85px] truncate">{profile?.name || 'Account'}</span>
          </button>
        </div>
      </div>

      {/* Responsive Horizontal Tab Bar for Medium/Small Viewports */}
      <div className="xl:hidden border-t border-slate-100 px-3 py-2 flex items-center overflow-x-auto gap-1 bg-slate-50/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-teal-700 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/70 font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
