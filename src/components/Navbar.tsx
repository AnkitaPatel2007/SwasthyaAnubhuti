import React from 'react';
import {
  HeartPulse,
  Activity,
  FileText,
  TrendingUp,
  Stethoscope,
  Heart,
  PhoneCall,
  Coins,
  Bot,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserProfile } from '../types/index.ts';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile | null;
  privacyMask: boolean;
  onTogglePrivacyMask: () => void;
  onOpenCheckin: () => void;
  onOpenProfile: () => void;
  onToggleArogyaPopup: () => void;
  isArogyaPopupOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  privacyMask,
  onTogglePrivacyMask,
  onOpenCheckin,
  onOpenProfile,
  onToggleArogyaPopup,
  isArogyaPopupOpen,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Clinical Vitals', icon: Activity },
    { id: 'reports', label: 'Reports Vault', icon: FileText },
    { id: 'trends', label: 'Biomarker Trends', icon: TrendingUp },
    { id: 'diseases', label: 'Diseases & Symptoms', icon: Stethoscope },
    { id: 'habits', label: 'Daily Habits', icon: Heart },
    { id: 'rewards', label: 'Rewards Store', icon: Coins },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-[0_2px_15px_-3px_rgba(15,118,110,0.06)]">
      {/* Top Clinical Utility Micro-Bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-[11px] py-1 px-3 sm:px-6 lg:px-8 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-teal-400 font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>SWASTHYAANUBHUTI LIVE</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            Patient: {profile?.name || 'Alex Rivera'} ({profile?.bloodGroup || 'O+'})
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="hidden md:inline">HIPAA / GDPR Isolation Active</span>
          <div className="flex items-center gap-1 text-rose-400 font-medium">
            <PhoneCall className="w-3 h-3" />
            <span>Emergency: 911 / 988</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand with Medical Emblem */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-sm shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  AuraHealth
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200/80 px-1.5 py-0.2 rounded-md">
                  CLINICAL
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 block -mt-0.5 tracking-wider font-medium hidden sm:block">
                PREVENTIVE MEDICAL INTELLIGENCE
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                    : 'text-slate-600 hover:text-teal-800 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ArogyaSaathi Points Balance */}
          <button
            onClick={() => onSelectTab('rewards')}
            title="ArogyaSaathi Points Balance - Click to Open Rewards Store"
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100/80 transition-colors cursor-pointer"
          >
            <span>🪙</span>
            <span className="tabular-nums font-mono">{profile?.healthPoints || 0}</span>
            <span className="text-[10px] text-teal-700 hidden lg:inline">Pts</span>
          </button>

          {/* Quick Privacy Shield */}
          <button
            onClick={onTogglePrivacyMask}
            title={privacyMask ? 'Turn off Privacy Mask (Reveal screen)' : 'Confidential Screen Mask (Blur sensitive readings in public)'}
            className={`px-2 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
              privacyMask
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {privacyMask ? <EyeOff className="w-3.5 h-3.5 text-rose-600" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden md:inline">
              {privacyMask ? 'Masked' : 'Confidential'}
            </span>
          </button>

          {/* ArogyaSaathi Top-Right Popup Button */}
          <button
            onClick={onToggleArogyaPopup}
            title={isArogyaPopupOpen ? 'Close ArogyaSaathi' : 'Ask ArogyaSaathi AI Companion (Quick Popup)'}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 relative ${
              isArogyaPopupOpen
                ? 'bg-teal-900 text-white border border-teal-600 ring-2 ring-teal-500/30'
                : 'bg-gradient-to-r from-teal-700 to-cyan-800 text-white hover:from-teal-800 hover:to-cyan-900 shadow-teal-700/20'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-teal-200" />
            <span className="hidden sm:inline">ArogyaSaathi</span>
            <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
          </button>

          {/* User Profile / Login-SignUp Button (Top Right) */}
          {profile ? (
            <button
              onClick={onOpenProfile}
              title="User Profile, Biometric Baselines, Settings & Logout"
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pl-2 sm:pr-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-all text-xs font-semibold border border-slate-200 cursor-pointer shadow-2xs hover:border-teal-300"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-700 to-cyan-800 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden sm:inline max-w-[80px] md:max-w-[100px] truncate">{profile.name}</span>
              <span className="hidden lg:inline text-[10px] text-teal-800 font-mono bg-teal-50 px-1 rounded">
                {profile.bloodGroup || 'O+'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              title="Sign In or Register New Account"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Horizontal Tab Bar for Medium/Small Viewports (Phones, Tablets & Laptops <1280px) */}
      <div className="xl:hidden border-t border-slate-100 px-2 sm:px-3 py-2 flex items-center overflow-x-auto gap-1 bg-slate-50/50 scrollbar-none touch-pan-x">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-teal-700 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/70 font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
