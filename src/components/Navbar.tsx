import React from 'react';
import { Shield, Eye, EyeOff, Lock, Sparkles, User, Bell } from 'lucide-react';
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
    { id: 'dashboard', label: 'Today' },
    { id: 'reports', label: 'Lab Reports' },
    { id: 'trends', label: 'Biomarkers & Trends' },
    { id: 'coach', label: 'Circadian Coach' },
    { id: 'stories', label: 'Health Library' },
    { id: 'chat', label: 'AI Companion' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
              AuraHealth
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap relative py-1 text-sm ${
                  isActive
                    ? 'text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 Primary actions & Confidential shield */}
        <div className="flex items-center gap-2.5">
          {/* Quick Privacy Shield Toggle */}
          <button
            onClick={onTogglePrivacyMask}
            title={privacyMask ? 'Turn off Privacy Mask (Reveal screen)' : 'Confidential Screen Mask (Blur sensitive data if someone is nearby)'}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              privacyMask
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {privacyMask ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {privacyMask ? 'Masked' : 'Privacy'}
            </span>
          </button>

          {/* Quick Check-in Button (Flo style) */}
          <button
            onClick={onOpenCheckin}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-300" />
            <span>Daily Log</span>
          </button>

          {/* User profile / Privacy Settings */}
          <button
            onClick={onOpenPrivacy}
            title="Privacy, Security & Confidentiality Settings"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>
            <span className="hidden xl:inline max-w-[90px] truncate">{profile?.name || 'Account'}</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden border-t border-slate-100 px-3 py-2 flex items-center justify-between overflow-x-auto gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              currentTab === item.id
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
