import React, { useState } from 'react';
import {
  Award,
  Flame,
  Coins,
  Lock,
  Unlock,
  Bot,
  CheckCircle2,
  ArrowRight,
  Info,
  Droplets,
  FileText,
  Stethoscope,
  Activity
} from 'lucide-react';
import { UserProfile, SpecialFeature } from '../types/index.ts';

interface RewardsStoreProps {
  profile: UserProfile | null;
  specialFeatures: SpecialFeature[];
  onRedeemFeature: (featureId: string, pointCost: number) => Promise<void>;
  onAwardBonusPoints: (points: number) => Promise<void>;
  onLaunchFeatureInChat: (prompt: string) => void;
}

export const RewardsStore: React.FC<RewardsStoreProps> = ({
  profile,
  specialFeatures,
  onRedeemFeature,
  onAwardBonusPoints,
  onLaunchFeatureInChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);
  const [redeemErrorMsg, setRedeemErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const userPoints = profile?.healthPoints || 0;
  const unlockedIds = profile?.unlockedFeatures || [];

  const categories = [
    { id: 'all', label: 'All Rewards' },
    { id: 'Clinical Readiness', label: 'Clinical Readiness' },
    { id: 'Biomarker Nutrition', label: 'Biomarker Nutrition' },
    { id: 'Sleep Optimization', label: 'Sleep & Circadian' },
    { id: 'Advanced Diagnostics', label: 'Diagnostics' },
    { id: 'Chronic Risk Shielding', label: 'Chronic Risk' }
  ];

  const filteredFeatures = selectedCategory === 'all'
    ? specialFeatures
    : specialFeatures.filter(f => f.category === selectedCategory);

  const getFeaturePrompt = (featureId: string): string => {
    switch (featureId) {
      case 'doctor_prep_dossier':
        return 'Generate my complete Physician Consultation Dossier: analyze all my recent laboratory blood parameters (Ferritin 18 ng/mL, Vitamin D 24.2 ng/mL, Fasting Glucose 86 mg/dL), longitudinal trend shifts, reported daily symptoms, and format 5 high-yield clinical questions for my doctor visit.';
      case 'precision_micronutrient_protocol':
        return 'Generate my 7-Day Precision Micronutrient & Meal Protocol: create a targeted daily eating schedule specifically formulated to restore my low Ferritin iron stores and indoor Vitamin D insufficiency without gastric irritation.';
      case 'circadian_sleep_audit':
        return 'Perform my Circadian Sleep Architecture Deep Audit: analyze my 5-day sleep logs, calculate my afternoon caffeine clearance cutoff, and design an evidence-based evening wind-down routine for restorative stage-3 slow-wave sleep.';
      case 'differential_lab_analysis':
        return 'Perform a Deep Clinical Second Opinion & Biomarker Cross-Correlation: systematically correlate my CBC, Ferritin 18 ng/mL, and Vitamin D against my reported daily fatigue, study burnout, and hemodynamic vitals to identify metabolic bottlenecks.';
      case 'burnout_adrenal_recovery':
        return 'Generate my Youth Academic & Desk Burnout Recovery Protocol: calculate cortisol regulation timing, non-sleep deep rest (NSDR) intervals, and eye-strain recovery protocols for high-intensity study days.';
      default:
        return 'Generate my Preventive Disease Defense Roadmap: outline an evidence-based clinical action plan for shielding against Iron Deficiency Anemia and Vitamin D insufficiency with 3-month re-testing milestones.';
    }
  };

  const handleRedeem = async (feature: SpecialFeature) => {
    setRedeemErrorMsg(null);
    setRedeemSuccessMsg(null);

    if (userPoints < feature.pointCost) {
      setRedeemErrorMsg(`You need ${feature.pointCost} points for this reward. Maintain your daily habit streaks to earn more points! Current balance: ${userPoints} pts.`);
      return;
    }

    try {
      setIsProcessing(feature.id);
      await onRedeemFeature(feature.id, feature.pointCost);
      setRedeemSuccessMsg(`Successfully unlocked "${feature.name}"! Click "Launch in ArogyaSaathi" to generate your custom clinical dossier.`);
    } catch (err: any) {
      setRedeemErrorMsg(err.message || 'Failed to redeem reward.');
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* 1. Header Banner & Streak Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-teal-300">
              <span className="font-semibold text-teal-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-teal-400" />
                <span>Habit Continuity Rewards</span>
              </span>
              <span>·</span>
              <span>Arogya Clinical Intelligence Hub</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Habit Streaks & Arogya Rewards
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every day you log your hydration, sleep, and medical vitals routines, you earn <strong>Arogya Points</strong>. Redeem your points below to unlock advanced physician consultation dossiers and targeted meal protocols inside <strong>ArogyaSaathi</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onAwardBonusPoints(50)}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              title="Claim +50 points for today's completed streak"
            >
              <Flame className="w-4 h-4 text-teal-300" />
              <span>Claim +50 Streak Points</span>
            </button>
          </div>
        </div>

        {/* Live Streaks Telemetry Bento */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">CURRENT STREAK</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">5</span>
              <span className="text-xs text-slate-400 font-mono">consecutive days</span>
            </div>
            <span className="text-[11px] text-teal-300 mt-1 block">Hydration & Sleep</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">AVAILABLE POINTS</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-teal-300 font-mono tabular-nums">{userPoints}</span>
              <span className="text-xs text-slate-400 font-mono">pts</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Ready to redeem</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">UNLOCKED PERKS</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-white font-mono tabular-nums">{unlockedIds.length}</span>
              <span className="text-xs text-slate-400 font-mono">of {specialFeatures.length}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Active features</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400 block">GUARDIAN TIER</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-white font-mono">Tier II</span>
              <span className="text-xs text-slate-400 font-mono">Silver</span>
            </div>
            <span className="text-[11px] text-teal-300 mt-1 block">Consistency Champion</span>
          </div>
        </div>
      </div>

      {/* 2. Earning Rules Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-teal-700" />
          <span>Point Earning Criteria</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              <Droplets className="w-4 h-4 text-teal-800" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">+50 Points Daily</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Maintain a 3+ day streak across water intake, 8-hour sleep, or screen curfews.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              <FileText className="w-4 h-4 text-teal-800" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">+100 Points / Report</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Upload and digitize any blood report, CBC, or metabolic panel in the Reports Vault.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              <Stethoscope className="w-4 h-4 text-teal-800" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">+30 Points / Check-in</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Log your daily blood pressure, resting pulse, and self-reported symptoms.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              <Activity className="w-4 h-4 text-teal-800" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">+10 Points / Glass</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Log daily water intake increments to pace hydration targets consistently.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {redeemSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {redeemErrorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 animate-fade-in">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{redeemErrorMsg}</span>
        </div>
      )}

      {/* 3. Catalog of Redeemable Special Features */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ArogyaSaathi Clinical Protocol Vault
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Redeem earned consistency points to unlock personalized clinical dossiers and physician review summaries.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFeatures.map((feat) => {
            const isUnlocked = unlockedIds.includes(feat.id);
            const canAfford = userPoints >= feat.pointCost;
            const promptDirective = getFeaturePrompt(feat.id);

            return (
              <div
                key={feat.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-semibold text-slate-600 text-[11px] truncate max-w-[170px]">
                      {feat.category}
                    </span>

                    {isUnlocked ? (
                      <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1 font-mono">
                        <Unlock className="w-3.5 h-3.5" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="text-slate-800 font-semibold font-mono text-xs">
                        {feat.pointCost} Pts
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {feat.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {feat.description}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-0.5">Sample Deliverable:</span>
                    <span>{feat.sampleOutputTitle}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {isUnlocked ? (
                    <button
                      onClick={() => onLaunchFeatureInChat(promptDirective)}
                      className="w-full py-2 px-4 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Launch in ArogyaSaathi</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRedeem(feat)}
                      disabled={!canAfford || isProcessing === feat.id}
                      className={`w-full py-2 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        canAfford
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {isProcessing === feat.id
                          ? 'Redeeming...'
                          : canAfford
                          ? `Redeem Feature (${feat.pointCost} Pts)`
                          : `Need ${feat.pointCost - userPoints} more points`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
