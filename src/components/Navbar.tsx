import React from 'react';
import {
  Activity,
  FileText,
  TrendingUp,
  Stethoscope,
  Heart,
  Coins,
  Bot,
  User,
  Eye,
  EyeOff,
  PhoneCall,
  Server
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
  onOpenCallModal: () => void;
  onOpenAndroidModal?: () => void;
  onOpenScaleModal?: () => void;
  activeAlertsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  privacyMask,
  onTogglePrivacyMask,
  onOpenProfile,
  onToggleArogyaPopup,
  isArogyaPopupOpen,
  onOpenCallModal,
  onOpenScaleModal,
  activeAlertsCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Vitals', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'diseases', label: 'Conditions', icon: Stethoscope },
    { id: 'habits', label: 'Habits', icon: Heart },
    { id: 'rewards', label: 'Rewards', icon: Coins },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-800 flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-xs">
              A
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 hover:text-teal-900 transition-colors">
              AuraHealth
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary action controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Clinical Alert indicator (quiet, unboxed) */}
          {activeAlertsCount > 0 && (
            <button
              onClick={() => onSelectTab('dashboard')}
              className="hidden lg:flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 px-2 py-1 rounded-md transition-colors cursor-pointer"
              title="View active biomarker anomaly insights"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-medium tabular-nums">{activeAlertsCount} Attention Required</span>
            </button>
          )}

          {/* Scale Architecture Telemetry Button */}
          {onOpenScaleModal && (
            <button
              onClick={onOpenScaleModal}
              className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="View 1M User Scalability Architecture"
            >
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span>1M Scale</span>
            </button>
          )}

          {/* Privacy Mask Toggle */}
          <button
            onClick={onTogglePrivacyMask}
            title={privacyMask ? 'Disable Screen Privacy Mask' : 'Enable Screen Privacy Mask'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {privacyMask ? <EyeOff className="w-4 h-4 text-slate-900" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Emergency Hotline Button */}
          <button
            onClick={onOpenCallModal}
            title="Emergency Medical Contact Hotline"
            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
          </button>

          {/* ArogyaSaathi Assistant Toggle */}
          <button
            onClick={onToggleArogyaPopup}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              isArogyaPopupOpen
                ? 'bg-teal-900 text-white'
                : 'bg-teal-800 hover:bg-teal-900 text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ArogyaSaathi</span>
          </button>

          {/* User Account / Profile */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs font-medium cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-semibold text-xs">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="hidden sm:inline max-w-[100px] truncate">{profile?.name || 'Account'}</span>
          </button>
        </div>
      </div>

      {/* Sub-bar for Mobile navigation */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center overflow-x-auto gap-2 bg-slate-50">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`text-xs px-3 py-1.5 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
