import React, { useState } from 'react';
import {
  Award,
  Flame,
  Coins,
  Lock,
  Unlock,
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileText,
  Activity,
  Droplets,
  Moon,
  Info
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
    { id: 'Clinical Readiness', label: 'Doctor & Clinical' },
    { id: 'Biomarker Nutrition', label: 'Biomarker Nutrition' },
    { id: 'Sleep Optimization', label: 'Sleep & Circadian' },
    { id: 'Advanced Diagnostics', label: 'Second Opinions' },
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
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* 1. Header Banner & Streak Status */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 font-mono">
                <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                STREAK REWARDS HUB
              </span>
              <span className="text-xs text-teal-300 font-mono">ArogyaSaathi Points Store</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Habit Streaks & Arogya Rewards
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every day you maintain your hydration, sleep, and medical vitals routines, you earn <strong>Arogya Points</strong>. Redeem your points below to unlock advanced clinical intelligence, physician dossiers, and targeted meal protocols inside <strong>ArogyaSaathi</strong>.
            </p>
          </div>

          {/* Quick Bonus Points Testing Action */}
          <div className="flex flex-col sm:flex-row items-start md:items-center gap-3">
            <button
              onClick={() => onAwardBonusPoints(50)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95"
              title="Claim +50 points for today's completed streak"
            >
              <Flame className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span>Claim +50 Streak Points</span>
            </button>
          </div>
        </div>

        {/* Live Streaks Telemetry Bento */}
        <div className="mt-8 pt-6 border-t border-teal-800/70 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-teal-800/50">
            <span className="text-[11px] font-mono uppercase text-teal-300 block">CURRENT STREAK</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">5</span>
              <span className="text-xs text-slate-400 font-mono">days active 🔥</span>
            </div>
            <span className="text-[11px] text-teal-300 mt-1 block">Hydration & Sleep</span>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-teal-800/50">
            <span className="text-[11px] font-mono uppercase text-amber-300 block">AVAILABLE POINTS</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-amber-300 font-mono">{userPoints}</span>
              <span className="text-xs text-slate-400 font-mono">pts</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Ready to redeem</span>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-teal-800/50">
            <span className="text-[11px] font-mono uppercase text-emerald-300 block">UNLOCKED PERKS</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-emerald-400 font-mono">{unlockedIds.length}</span>
              <span className="text-xs text-slate-400 font-mono">of {specialFeatures.length}</span>
            </div>
            <span className="text-[11px] text-emerald-300 mt-1 block">ArogyaSaathi features</span>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-teal-800/50">
            <span className="text-[11px] font-mono uppercase text-sky-300 block">GUARDIAN TIER</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-white font-mono">Tier II</span>
              <span className="text-xs text-slate-400 font-mono">Silver</span>
            </div>
            <span className="text-[11px] text-sky-300 mt-1 block">Consistency Champion</span>
          </div>
        </div>
      </div>

      {/* 2. Earning Rules Guide */}
      <div className="bg-white rounded-2xl border border-teal-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-teal-600" />
          <span>How to Earn Arogya Points Every Day</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              💧
            </div>
            <h4 className="text-xs font-bold text-slate-900">+50 Points Daily</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Maintain your 3+ day streak across water intake, 8-hour sleep, or screen time curfews.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              📄
            </div>
            <h4 className="text-xs font-bold text-slate-900">+100 Points / Report</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Upload and OCR-digitize any blood report, CBC, or metabolic panel in the Reports Vault.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              🩺
            </div>
            <h4 className="text-xs font-bold text-slate-900">+30 Points / Check-in</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Log your daily blood pressure, resting pulse, and self-reported symptoms in the Clinical Vitals logger.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              ⚡
            </div>
            <h4 className="text-xs font-bold text-slate-900">+10 Points / Glass</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Click "+ Drink 1 Glass (250ml)" on your dashboard to stay ahead of hydration targets.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {redeemSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{redeemSuccessMsg}</span>
        </div>
      )}

      {redeemErrorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2 animate-fade-in">
          <Info className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{redeemErrorMsg}</span>
        </div>
      )}

      {/* 3. Catalog of Redeemable Special Features */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              ArogyaSaathi Special AI Feature Vault
            </h2>
            <span className="text-xs text-slate-500">
              Redeem your hard-earned streak points to unlock advanced, personalized AI health capabilities
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
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
                className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-teal-50/70 to-white border-teal-200/90 shadow-sm'
                    : 'bg-white border-slate-200/90 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-teal-800 uppercase tracking-wider font-semibold bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md truncate max-w-[170px]">
                      {feat.category}
                    </span>

                    {isUnlocked ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-mono">
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1 font-mono">
                        <Coins className="w-3 h-3 text-amber-600" />
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

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 mb-4 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 block mb-0.5">Sample Deliverable:</span>
                    <span>{feat.sampleOutputTitle}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  {isUnlocked ? (
                    <button
                      onClick={() => onLaunchFeatureInChat(promptDirective)}
                      className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group active:scale-95"
                    >
                      <Bot className="w-4 h-4 text-teal-200" />
                      <span>Launch in ArogyaSaathi</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-200 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRedeem(feat)}
                      disabled={!canAfford || isProcessing === feat.id}
                      className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm active:scale-95'
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
