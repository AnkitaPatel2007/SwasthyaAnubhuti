import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  Sparkles,
  Maximize2,
  Trash2,
  ShieldCheck,
  Coins,
  ChevronRight,
  User,
  HeartPulse,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, UserProfile, SpecialFeature } from '../types/index.ts';

interface ArogyaSaathiPopupProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  profile: UserProfile | null;
  specialFeatures: SpecialFeature[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => Promise<void>;
  onExpandToFullTab: () => void;
  onOpenRewards: () => void;
}

export const ArogyaSaathiPopup: React.FC<ArogyaSaathiPopupProps> = ({
  isOpen,
  onClose,
  messages,
  profile,
  specialFeatures,
  onSendMessage,
  onClearHistory,
  onExpandToFullTab,
  onOpenRewards,
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Explain Iron & Ferritin', prompt: 'Can you analyze my serum ferritin and iron markers from my uploaded report and explain what they mean for my daily energy?' },
    { label: 'Doctor Visit Checklist', prompt: 'Generate 4 high-yield questions I should ask my doctor based on my real logged vitals and lab results.' },
    { label: 'Nutrient Food Pairings', prompt: 'What foods enhance micronutrient absorption, and what common morning beverages block it?' },
    { label: 'Sleep & Recovery Audit', prompt: 'Analyze my logged sleep duration and daily fatigue symptoms and advise on optimizing recovery.' },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    if (!textToSend) {
      setInputText('');
    }
    setLoading(true);

    try {
      await onSendMessage(text);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userPoints = profile?.healthPoints || 0;

  return (
    <div className="fixed top-16 sm:top-20 right-2 sm:right-6 z-50 w-[96vw] sm:w-[420px] max-h-[85vh] h-[580px] bg-white rounded-3xl shadow-2xl border border-teal-200/90 flex flex-col overflow-hidden animate-fade-in medical-card-glow">
      {/* Top Clinical Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-teal-800/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white tracking-tight">
                ArogyaSaathi
              </h3>
              <span className="text-[10px] text-teal-300 font-mono">
                (आरोग्यसाथी)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-teal-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>AI Clinical Assistant · Active</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenRewards}
            title="Arogya Points Balance - Click to Redeem Rewards"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-400/20 hover:bg-teal-400/30 text-teal-200 text-[11px] font-bold transition-colors font-mono"
          >
            <Coins className="w-3 h-3 text-amber-300" />
            <span>{userPoints}</span>
          </button>

          <button
            onClick={onExpandToFullTab}
            title="Expand to Full Page Tab"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClearHistory}
            title="Clear Chat History"
            className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            title="Close ArogyaSaathi Popup"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Clinical Prompts Carousel */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/80 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
        {quickPrompts.map((qp) => (
          <button
            key={qp.label}
            onClick={() => handleSend(qp.prompt)}
            disabled={loading}
            className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:text-teal-900 text-slate-700 text-[11px] font-medium rounded-lg border border-slate-200 hover:border-teal-200 transition-all shrink-0 shadow-2xs whitespace-nowrap active:scale-95"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="text-center py-8 space-y-3 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Namaste! I am ArogyaSaathi.
              </h4>
              <p className="text-xs text-slate-500 max-w-[280px] mx-auto mt-1 leading-relaxed">
                Your intelligent youth health & medical companion. Ask me anything about your lab reports, daily vitals, or disease prevention.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-teal-700 text-white font-medium rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 font-mono ${
                      isUser ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                    {profile?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-teal-800 p-2.5 bg-teal-50/80 rounded-xl border border-teal-100 max-w-[240px]">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
            <span className="font-medium">ArogyaSaathi is analyzing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about symptoms, lab readings, sleep..."
            disabled={loading}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-slate-50 focus:bg-white transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputText.trim()}
            className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl transition-all shadow-xs shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Disclaimer Micro-Footer */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            Non-diagnostic clinical education
          </span>
          <button
            onClick={onExpandToFullTab}
            className="text-teal-700 hover:underline font-semibold flex items-center gap-0.5"
          >
            <span>Full Workspace</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
