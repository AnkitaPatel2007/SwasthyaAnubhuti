import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Trash2,
  Bot,
  User,
  BookOpen,
  Award,
  Lock,
  Unlock,
  Coins,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Stethoscope
} from 'lucide-react';
import { ChatMessage, UserProfile, SpecialFeature } from '../types/index.ts';

interface AssistantChatProps {
  messages: ChatMessage[];
  profile: UserProfile | null;
  specialFeatures: SpecialFeature[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => Promise<void>;
  onRedeemFeature: (featureId: string, pointCost: number) => Promise<void>;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({
  messages,
  profile,
  specialFeatures,
  onSendMessage,
  onClearHistory,
  onRedeemFeature,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showRedeemDrawer, setShowRedeemDrawer] = useState<boolean>(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userBp = profile ? `${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic}` : '118/76';
  const suggestedPrompts = [
    'Analyze my latest uploaded blood report and flagged biomarkers',
    'Why am I exhausted even when I get adequate sleep?',
    'What evidence-based nutrition shifts boost micronutrient absorption?',
    `How does my ${userBp} blood pressure compare to healthy clinical ranges?`,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setInputText('');
    setIsSending(true);
    try {
      await onSendMessage(text);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleRedeemAndActivate = async (feature: SpecialFeature) => {
    setRedeemError(null);
    setRedeemSuccess(null);

    const isAlreadyUnlocked = profile?.unlockedFeatures?.includes(feature.id);
    if (!isAlreadyUnlocked) {
      const userPoints = profile?.healthPoints || 0;
      if (userPoints < feature.pointCost) {
        setRedeemError(`You need ${feature.pointCost} points for this feature. Maintain your daily habit streaks to earn more! Current balance: ${userPoints} pts.`);
        return;
      }

      try {
        await onRedeemFeature(feature.id, feature.pointCost);
        setRedeemSuccess(`Unlocked "${feature.name}"! Generating your custom clinical report now...`);
      } catch (err: any) {
        setRedeemError(err.message || 'Failed to redeem points.');
        return;
      }
    }

    // Trigger ArogyaSaathi to generate the special feature dossier
    let promptDirective = '';
    if (feature.id === 'doctor_prep_dossier') {
      promptDirective = 'Generate my complete Physician Consultation Dossier: analyze all my recent laboratory blood parameters (Ferritin 18 ng/mL, Vitamin D 24.2 ng/mL, Fasting Glucose 86 mg/dL), longitudinal trend shifts, reported daily symptoms, and format 5 high-yield clinical questions for my doctor visit.';
    } else if (feature.id === 'precision_micronutrient_protocol') {
      promptDirective = 'Generate my 7-Day Precision Micronutrient & Meal Protocol: create a targeted daily eating schedule specifically formulated to restore my low Ferritin iron stores and indoor Vitamin D insufficiency without gastric irritation.';
    } else if (feature.id === 'circadian_sleep_audit') {
      promptDirective = 'Perform my Circadian Sleep Architecture Deep Audit: analyze my 5-day sleep logs, calculate my afternoon caffeine clearance cutoff, and design an evidence-based evening wind-down routine for restorative stage-3 slow-wave sleep.';
    } else if (feature.id === 'differential_lab_analysis') {
      promptDirective = 'Perform a Deep Clinical Second Opinion & Biomarker Cross-Correlation: systematically correlate my CBC, Ferritin 18 ng/mL, and Vitamin D against my reported daily fatigue, study burnout, and hemodynamic vitals to identify metabolic bottlenecks.';
    } else if (feature.id === 'burnout_adrenal_recovery') {
      promptDirective = 'Generate my Youth Academic & Desk Burnout Recovery Protocol: calculate cortisol regulation timing, non-sleep deep rest (NSDR) intervals, and eye-strain recovery protocols for high-intensity study days.';
    } else {
      promptDirective = 'Generate my Preventive Disease Defense Roadmap: outline an evidence-based clinical action plan for shielding against Iron Deficiency Anemia and Vitamin D insufficiency with 3-month re-testing milestones.';
    }

    setShowRedeemDrawer(false);
    await handleSend(promptDirective);
  };

  const userPoints = profile?.healthPoints || 0;

  return (
    <div className="bg-white rounded-2xl border border-teal-100 shadow-sm flex flex-col h-[78vh] animate-fade-in overflow-hidden medical-card-glow">
      {/* Header with ArogyaSaathi Branding & Points Badge */}
      <div className="px-6 py-4 border-b border-teal-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                ArogyaSaathi
              </h3>
              <span className="text-[11px] font-medium text-teal-300 font-mono">
                (आरोग्यसाथी)
              </span>
              <span className="text-[10px] font-bold text-teal-900 bg-teal-300 px-1.5 py-0.2 rounded-md">
                AI CLINICAL COMPANION
              </span>
            </div>
            <span className="text-[11px] text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Grounded in lab reports, vitals & medical guidelines · Non-diagnostic
            </span>
          </div>
        </div>

        {/* Streak Points Balance & Redeem Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRedeemDrawer(!showRedeemDrawer)}
            className="px-3.5 py-1.5 bg-teal-400/20 hover:bg-teal-400/30 border border-teal-300/40 rounded-xl text-teal-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:scale-105"
            title="Redeem habit streak points for special ArogyaSaathi clinical features"
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span className="tabular-nums font-mono text-white">{userPoints}</span>
            <span className="hidden sm:inline">Pts</span>
            {showRedeemDrawer ? (
              <ChevronUp className="w-3.5 h-3.5 ml-1 text-teal-300" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-teal-300" />
            )}
          </button>

          <button
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 p-2 rounded-xl transition-colors flex items-center gap-1"
            title="Clear conversation history for privacy"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Special Feature Points Redemption Drawer */}
      {showRedeemDrawer && (
        <div className="p-4 sm:p-5 bg-gradient-to-b from-teal-950/90 to-slate-900 text-white border-b border-teal-800/60 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Redeem Streak Points for ArogyaSaathi Clinical Features
              </h4>
            </div>
            <span className="text-xs text-slate-300 font-mono">
              Available: <strong className="text-amber-300">{userPoints} Points</strong> (Earned via Habit Streaks)
            </span>
          </div>

          {redeemError && (
            <div className="p-2.5 bg-rose-900/50 border border-rose-500/50 rounded-xl text-xs text-rose-200">
              {redeemError}
            </div>
          )}

          {redeemSuccess && (
            <div className="p-2.5 bg-emerald-900/50 border border-emerald-500/50 rounded-xl text-xs text-emerald-200">
              {redeemSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {specialFeatures.map((feat) => {
              const isUnlocked = profile?.unlockedFeatures?.includes(feat.id);
              const canAfford = userPoints >= feat.pointCost;

              return (
                <div
                  key={feat.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-teal-900/40 border-teal-400/60 shadow-xs'
                      : canAfford
                      ? 'bg-slate-800/60 border-slate-700 hover:border-teal-400/50'
                      : 'bg-slate-900/60 border-slate-800 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-semibold text-teal-300 uppercase tracking-wider">
                        {feat.category}
                      </span>
                      <span className="font-mono font-bold text-amber-300 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {feat.pointCost} Pts
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-white leading-snug">
                      {feat.name}
                    </h5>

                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeemAndActivate(feat)}
                    disabled={!isUnlocked && !canAfford}
                    className={`mt-3 w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isUnlocked
                        ? 'bg-teal-400 text-slate-950 hover:bg-teal-300'
                        : canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Unlock className="w-3 h-3" />
                        <span>Run Dossier</span>
                      </>
                    ) : canAfford ? (
                      <>
                        <Coins className="w-3 h-3" />
                        <span>Redeem ({feat.pointCost} Pts)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Need {feat.pointCost - userPoints} More Pts</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-teal-700 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : msg.isRedFlagWarning
                    ? 'bg-rose-50 text-rose-950 border border-rose-300 rounded-tl-none font-medium'
                    : 'bg-white text-slate-800 border border-teal-100 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line space-y-2">
                  {msg.content}
                </div>

                {/* Grounded Citations if present */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <span className="font-bold text-slate-700 block">
                      Clinical Grounding & Sources:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span><strong>{c.source}</strong>: {c.referenceText}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 text-right font-mono ${
                    isUser ? 'text-slate-400' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none p-4 text-xs text-slate-600 border border-teal-100 flex items-center gap-2.5 shadow-2xs">
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse delay-300" />
              <span>ArogyaSaathi is cross-analyzing your parameters with medical literature...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inquiries Pill Row */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-teal-100/70 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 font-mono">
          Clinical Prompts:
        </span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1 bg-white border border-teal-200/80 hover:border-teal-400 rounded-lg text-slate-700 hover:text-teal-900 text-xs whitespace-nowrap transition-colors shadow-2xs font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-teal-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask ArogyaSaathi about blood reports, symptoms, disease risks, or habit consistency..."
            className="flex-1 text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl transition-all shadow-sm flex items-center gap-1.5 font-bold"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
