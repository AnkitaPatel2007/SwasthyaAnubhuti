import React, { useState, useEffect } from 'react';
import {
  Flame,
  Award,
  Crown,
  Trophy,
  Sparkles,
  CheckCircle2,
  Lock,
  Star,
  Zap,
  Gift,
  Check,
  ChevronRight,
  Droplets,
  Moon,
  Heart,
  Activity,
  X,
  Share2
} from 'lucide-react';
import { UserProfile, DailyHealthUpdate } from '../types/index.ts';

export interface MilestoneBadge {
  id: string;
  name: string;
  tier: 'Gold' | 'Diamond' | 'Legendary';
  icon: string;
  tagline: string;
  perks: string;
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
  profile,
  dailyUpdates = [],
  onOpenCheckin,
  onOpenRewards,
  onClaimRewardPoints,
}) => {
  // Current streak calculation (default 7 days if history exists or user simulates)
  const defaultStreakDays = dailyUpdates.length >= 7 ? 7 : Math.max(6, dailyUpdates.length || 6);
  const [streakDays, setStreakDays] = useState<number>(defaultStreakDays);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(6);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [hasClaimedPoints, setHasClaimedPoints] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [confettiActive, setConfettiActive] = useState<boolean>(false);

  const isFullSevenDays = streakDays >= 7;

  // 7-Day Achievement Milestone Path Definition
  const milestoneNodes = [
    {
      dayNumber: 1,
      dayLabel: 'Day 1',
      dateStr: 'Wed, Sep 23',
      title: 'Hydration Foundation',
      icon: '💧',
      metric: '6 Glasses Logged',
      detail: 'Jumpstarted daily cellular fluid balance and flushed metabolic toxins.',
      points: 20,
    },
    {
      dayNumber: 2,
      dayLabel: 'Day 2',
      dateStr: 'Thu, Sep 24',
      title: 'Circadian Sleep Rhythm',
      icon: '😴',
      metric: '7.8h Deep Rest',
      detail: 'Maintained nocturnal melatonin alignment with no late-night screen lag.',
      points: 20,
    },
    {
      dayNumber: 3,
      dayLabel: 'Day 3',
      dateStr: 'Fri, Sep 25',
      title: 'Clean Energy & Fuel',
      icon: '🥗',
      metric: 'Nutritious & Balanced',
      detail: 'Avoided ultra-processed fast food; sustained 4/5 daytime energy score.',
      points: 20,
    },
    {
      dayNumber: 4,
      dayLabel: 'Day 4',
      dateStr: 'Sat, Sep 26',
      title: 'Cardio Calmness',
      icon: '❤️',
      metric: 'Pulse 70 BPM',
      detail: 'Resting cardiac frequency in optimal athletic zone; normal tension.',
      points: 20,
    },
    {
      dayNumber: 5,
      dayLabel: 'Day 5',
      dateStr: 'Sun, Sep 27',
      title: 'Cellular Restoration',
      icon: '⚡',
      metric: '7.4h Sleep & Walk',
      detail: 'Completed outdoor movement break and proactive study recovery.',
      points: 20,
    },
    {
      dayNumber: 6,
      dayLabel: 'Day 6',
      dateStr: 'Mon, Sep 28',
      title: 'Vitals Consistency',
      icon: '📝',
      metric: 'Daily Journal Logged',
      detail: 'Captured blood pressure & stress signs even during high-pressure exam prep.',
      points: 25,
    },
    {
      dayNumber: 7,
      dayLabel: 'Day 7',
      dateStr: 'Tue, Sep 29',
      title: '7-Day Master Homeostasis',
      icon: '👑',
      metric: 'Crown Milestone Complete',
      detail: 'Flawless 7 consecutive days of holistic health monitoring achieved!',
      points: 150,
    },
  ];

  const earnedBadge: MilestoneBadge = {
    id: 'badge_saptaha_champion',
    name: 'Saptaha Arogya Champion',
    tier: 'Gold',
    icon: '👑',
    tagline: '7 Consecutive Days of Preventive Clinical Mastery',
    perks: '+150 ArogyaSaathi Points · VIP Health Shield Tag · 1-Month Milestone Certificate',
    points: 150,
  };

  const handleClaimReward = async () => {
    if (hasClaimedPoints) return;
    setIsClaiming(true);
    setConfettiActive(true);

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
    setConfettiActive(true);
  };

  const activeNode = selectedDayIndex !== null ? milestoneNodes[selectedDayIndex] : milestoneNodes[streakDays - 1];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-3xl p-5 sm:p-6 border border-teal-800/60 shadow-xl relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 animate-bounce">
            <Flame className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Weekly Streak Milestone
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                {streakDays} / 7 DAYS COMPLETED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Track your daily vitals for 7 consecutive days to earn the exclusive <strong>Saptaha Arogya Crown Badge</strong>.
            </p>
          </div>
        </div>

        {/* Milestone Action State */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isFullSevenDays ? (
            <button
              onClick={() => {
                setShowRewardModal(true);
                setConfettiActive(true);
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer active:scale-95 animate-pulse"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>{hasClaimedPoints ? 'View Crown Badge' : 'Claim 7-Day Reward!'}</span>
            </button>
          ) : (
            <button
              onClick={triggerCelebrateSevenDays}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              title="Test the 7-day completion award animation"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Day 7 Completion</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Roadmap Path Container */}
      <div className="py-6 relative z-10">
        <div className="relative">
          {/* Glowing Trail Connection Line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1.5 bg-slate-800 rounded-full z-0 hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(20,184,166,0.6)]"
              style={{ width: `${Math.min(100, ((streakDays - 0.5) / 6.5) * 100)}%` }}
            />
          </div>

          {/* 7 Daily Achievement Milestone Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 sm:gap-2 relative z-10">
            {milestoneNodes.map((node, index) => {
              const dayNum = node.dayNumber;
              const isCompleted = dayNum <= streakDays;
              const isCurrentDay = dayNum === streakDays && !isFullSevenDays;
              const isMilestoneTarget = dayNum === 7;
              const isSelected = selectedDayIndex === index;

              return (
                <div
                  key={node.dayNumber}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`flex flex-col items-center text-center p-2.5 sm:p-2 rounded-2xl cursor-pointer transition-all duration-300 group ${
                    isSelected
                      ? 'bg-slate-800/90 ring-2 ring-teal-400/60 shadow-lg'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {/* Visual Node Badge Circle */}
                  <div className="relative mb-2">
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 shadow-md ${
                        isMilestoneTarget && isCompleted
                          ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 ring-4 ring-amber-400/50 scale-110 shadow-amber-500/40 animate-pulse'
                          : isMilestoneTarget
                          ? 'bg-slate-800 text-slate-400 border-2 border-dashed border-amber-400/50'
                          : isCompleted
                          ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-teal-500/25 ring-2 ring-teal-300/40'
                          : isCurrentDay
                          ? 'bg-teal-900 text-teal-200 ring-2 ring-teal-400 animate-pulse'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isMilestoneTarget ? (
                        <Crown className={`w-6 h-6 ${isCompleted ? 'fill-slate-950' : 'text-amber-400'}`} />
                      ) : (
                        <span>{node.icon}</span>
                      )}
                    </div>

                    {/* Checkmark or Lock Floating Pin */}
                    <div className="absolute -bottom-1 -right-1">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Day Label & Short Metric */}
                  <span className={`text-[11px] font-bold font-mono tracking-tight ${
                    isMilestoneTarget && isCompleted
                      ? 'text-amber-300'
                      : isCompleted
                      ? 'text-teal-300'
                      : 'text-slate-400'
                  }`}>
                    {node.dayLabel}
                  </span>

                  <span className="text-[10px] text-slate-400 truncate max-w-[85px] block mt-0.5">
                    {node.metric}
                  </span>

                  {/* Points Tag */}
                  <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1 bg-slate-800/80 px-1.5 py-0.2 rounded-md">
                    +{node.points} Pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Milestone Detail Inspection Bar */}
      {activeNode && (
        <div className="mt-2 p-4 bg-slate-800/70 rounded-2xl border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shrink-0">
              {activeNode.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">
                  {activeNode.dayLabel}: {activeNode.title}
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 border border-teal-800 px-1.5 py-0.2 rounded">
                  {activeNode.dateStr}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                {activeNode.detail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 block">Milestone Reward</span>
              <span className="text-xs font-bold text-emerald-400">+{activeNode.points} Health Points</span>
            </div>

            {activeNode.dayNumber <= streakDays ? (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 font-mono">
                <Check className="w-3 h-3" />
                <span>UNLOCKED</span>
              </span>
            ) : (
              <button
                onClick={onOpenCheckin}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <span>Log Today</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* CELEBRATORY 7-DAY REWARD MODAL & DIGITAL BADGE */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          {/* Confetti Sparkles Container */}
          {confettiActive && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-3 rounded-xs animate-ping"
                  style={{
                    backgroundColor: ['#f59e0b', '#10b981', '#06b6d4', '#ec4899', '#8b5cf6'][i % 5],
                    top: `${15 + (i * 3.2)}%`,
                    left: `${5 + ((i * 7.7) % 90)}%`,
                    animationDuration: `${1.2 + (i % 3) * 0.4}s`,
                    animationDelay: `${(i % 5) * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative z-20 shadow-2xl shadow-amber-500/20 space-y-5 animate-scale-up">
            <button
              onClick={() => setShowRewardModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Golden Trophy Header */}
            <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/40 relative">
              <Crown className="w-10 h-10 fill-slate-950 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                7
              </div>
            </div>

            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400 block mb-1">
                7-DAY STREAK MILESTONE UNLOCKED!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Saptaha Arogya Champion
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Congratulations! You tracked your sleep, hydration, and vitals for <strong>7 consecutive days</strong>. Your metabolic consistency is outstanding.
              </p>
            </div>

            {/* Digital Badge Card */}
            <div className="p-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-amber-400/40 space-y-2 text-left shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                  GOLD MEDAL TIER · VERIFIED
                </span>
                <span className="text-xs font-mono font-black text-emerald-400">
                  +150 AROGYA PTS
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="text-3xl">🏅</div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {earnedBadge.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {earnedBadge.tagline}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Unlocks premium rewards & doctor report exports in store</span>
              </div>
            </div>

            {/* Claim Action */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleClaimReward}
                disabled={hasClaimedPoints || isClaiming}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  hasClaimedPoints
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/30'
                }`}
              >
                {hasClaimedPoints ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reward Claimed (+150 Pts Credited)</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 fill-slate-950" />
                    <span>{isClaiming ? 'Claiming...' : 'Claim 150 Points & Add to Wallet'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setShowRewardModal(false);
                  if (onOpenRewards) onOpenRewards();
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Visit Rewards Store →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
