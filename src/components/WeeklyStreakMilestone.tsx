import React, { useState } from 'react';
import {
  Flame,
  Award,
  Crown,
  Sparkles,
  CheckCircle2,
  Lock,
  Check,
  ChevronRight,
  Droplets,
  Moon,
  Heart,
  Activity,
  FileText,
  Utensils,
  X,
  LucideIcon
} from 'lucide-react';
import { UserProfile, DailyHealthUpdate } from '../types/index.ts';

export interface MilestoneBadge {
  id: string;
  name: string;
  tier: 'Gold' | 'Diamond' | 'Legendary';
  tagline: string;
  perks: string;
  points: number;
}

interface MilestoneNode {
  dayNumber: number;
  dayLabel: string;
  dateStr: string;
  title: string;
  icon: LucideIcon;
  metric: string;
  detail: string;
  points: number;
}

interface WeeklyStreakMilestoneProps {
  profile: UserProfile | null;
  dailyUpdates?: DailyHealthUpdate[];
  onOpenCheckin?: () => void;
  onOpenRewards?: () => void;
  onClaimRewardPoints?: (points: number) => Promise<void>;
}

export const WeeklyStreakMilestone: React.FC<WeeklyStreakMilestoneProps> = ({
  dailyUpdates = [],
  onOpenCheckin,
  onOpenRewards,
  onClaimRewardPoints,
}) => {
  const defaultStreakDays = dailyUpdates.length >= 7 ? 7 : Math.max(6, dailyUpdates.length || 6);
  const [streakDays, setStreakDays] = useState<number>(defaultStreakDays);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(6);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [hasClaimedPoints, setHasClaimedPoints] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const isFullSevenDays = streakDays >= 7;

  // 7-Day Achievement Milestone Path Definition with Clean Lucide Icons
  const milestoneNodes: MilestoneNode[] = [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      dateStr: 'Wed, Sep 23',
      title: 'Hydration Baseline',
      icon: Droplets,
      metric: '6 Glasses Logged',
      detail: 'Established daily fluid volume to support cellular waste elimination.',
      points: 20,
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      dateStr: 'Thu, Sep 24',
      title: 'Circadian Sleep Architecture',
      icon: Moon,
      metric: '7.8h Deep Sleep',
      detail: 'Reinforced slow-wave restorative sleep without late-night blue light.',
      points: 20,
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      dateStr: 'Fri, Sep 25',
      title: 'Balanced Nutrition',
      icon: Utensils,
      metric: 'Micronutrient Fuel',
      detail: 'Paired bioavailable plant iron with Vitamin C; sustained daytime energy.',
      points: 20,
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      dateStr: 'Sat, Sep 26',
      title: 'Cardiovascular Stability',
      icon: Heart,
      metric: 'Pulse 70 BPM',
      detail: 'Resting pulse and blood pressure monitored within optimal AHA parameters.',
      points: 20,
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      dateStr: 'Sun, Sep 27',
      title: 'Active Cellular Movement',
      icon: Activity,
      metric: 'Movement Break',
      detail: 'Aerobic walking interval to enhance arterial compliance and HDL.',
      points: 20,
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      dateStr: 'Mon, Sep 28',
      title: 'Vitals Record Consistency',
      icon: FileText,
      metric: 'Daily Vitals Logged',
      detail: 'Recorded subjective stress indicators and hemodynamics systematically.',
      points: 25,
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      dateStr: 'Tue, Sep 29',
      title: 'Complete 7-Day Homeostasis',
      icon: Award,
      metric: '7-Day Milestone',
      detail: 'Full 7 consecutive days of proactive health data collection completed.',
      points: 150,
    },
  ];

  const earnedBadge: MilestoneBadge = {
    id: 'badge_saptaha_champion',
    name: 'Clinical Consistency Milestone',
    tier: 'Gold',
    tagline: '7 Consecutive Days of Preventive Biomarker Tracking',
    perks: '+150 Arogya Points · Clinical Milestone Badge',
    points: 150,
  };

  const handleClaimReward = async () => {
    if (hasClaimedPoints) return;
    setIsClaiming(true);

    try {
      if (onClaimRewardPoints) {
        await onClaimRewardPoints(150);
      }
      setHasClaimedPoints(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  const triggerCelebrateSevenDays = () => {
    setStreakDays(7);
    setShowRewardModal(true);
  };

  const activeNode = selectedDayIndex !== null ? milestoneNodes[selectedDayIndex] : milestoneNodes[streakDays - 1];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center text-teal-200">
            <Flame className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-teal-300">Habit Continuity Milestone</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-slate-400 tabular-nums">{streakDays} Consecutive Days</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              7-Day Physiological Monitoring Track
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFullSevenDays ? (
            <button
              onClick={() => setShowRewardModal(true)}
              className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              <span>{hasClaimedPoints ? 'View Milestone Badge' : 'Claim 7-Day Reward'}</span>
            </button>
          ) : (
            <button
              onClick={triggerCelebrateSevenDays}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Simulate Day 7</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Roadmap Path Container */}
      <div className="py-5 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 relative z-10">
          {milestoneNodes.map((node, index) => {
            const dayNum = node.dayNumber;
            const isCompleted = dayNum <= streakDays;
            const isMilestoneTarget = dayNum === 7;
            const isSelected = selectedDayIndex === index;
            const NodeIcon = node.icon;

            return (
              <div
                key={node.dayNumber}
                onClick={() => setSelectedDayIndex(index)}
                className={`flex flex-col items-center text-center p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-slate-800 border border-teal-500/50'
                    : 'hover:bg-slate-800/60'
                }`}
              >
                {/* Visual Node Badge */}
                <div className="relative mb-2">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isMilestoneTarget && isCompleted
                        ? 'bg-teal-700 text-white shadow-xs'
                        : isMilestoneTarget
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : isCompleted
                        ? 'bg-slate-800 text-teal-300 border border-teal-600/40'
                        : 'bg-slate-800/60 text-slate-500 border border-slate-800'
                    }`}
                  >
                    <NodeIcon className="w-5 h-5" />
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute -bottom-1 -right-1">
                    {isCompleted ? (
                      <div className="w-4 h-4 rounded-full bg-teal-600 text-slate-950 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                </div>

                <span className={`text-[11px] font-semibold font-mono ${
                  isCompleted ? 'text-teal-300' : 'text-slate-400'
                }`}>
                  {node.dayLabel}
                </span>

                <span className="text-[10px] text-slate-400 truncate max-w-[85px] block mt-0.5">
                  {node.metric}
                </span>

                <span className="text-[10px] font-mono text-emerald-400 font-medium mt-1">
                  +{node.points} Pts
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspection Bar */}
      {activeNode && (
        <div className="mt-2 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-teal-300 shrink-0">
              <activeNode.icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {activeNode.dayLabel}: {activeNode.title}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {activeNode.dateStr}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {activeNode.detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <span className="text-xs font-mono text-emerald-400">
              +{activeNode.points} Points
            </span>

            {activeNode.dayNumber <= streakDays ? (
              <span className="text-teal-300 text-xs font-medium flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Recorded</span>
              </span>
            ) : (
              <button
                onClick={onOpenCheckin}
                className="px-2.5 py-1 bg-teal-700 hover:bg-teal-600 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Record Vitals</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 7-DAY REWARD MODAL */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full relative z-20 shadow-xl space-y-5">
            <button
              onClick={() => setShowRewardModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-800 flex items-center justify-center text-teal-200">
              <Award className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-mono font-medium text-teal-300 block">
                7-DAY MILESTONE COMPLETED
              </span>
              <h3 className="text-lg font-bold text-white">
                {earnedBadge.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                You logged physiological data for 7 consecutive days. Consistent longitudinal tracking significantly improves diagnostic precision.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-teal-300 font-semibold">
                  CLINICAL MILESTONE · VERIFIED
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  +150 POINTS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {earnedBadge.tagline}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleClaimReward}
                disabled={hasClaimedPoints || isClaiming}
                className={`w-full py-2.5 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  hasClaimedPoints
                    ? 'bg-emerald-700 text-white cursor-default'
                    : 'bg-teal-700 hover:bg-teal-600 text-white'
                }`}
              >
                {hasClaimedPoints ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reward Credited (+150 Points)</span>
                  </>
                ) : (
                  <span>{isClaiming ? 'Claiming...' : 'Claim 150 Points'}</span>
                )}
              </button>

              <button
                onClick={() => {
                  setShowRewardModal(false);
                  if (onOpenRewards) onOpenRewards();
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Open Rewards Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
