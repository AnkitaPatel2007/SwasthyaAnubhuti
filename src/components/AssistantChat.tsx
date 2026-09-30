import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertTriangle, ShieldCheck, Trash2, Bot, User, BookOpen } from 'lucide-react';
import { ChatMessage } from '../types/index.ts';

interface AssistantChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => Promise<void>;
}

export const AssistantChat: React.FC<AssistantChatProps> = ({
  messages,
  onSendMessage,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Explain my Ferritin 18 ng/mL result in plain terms',
    'Why am I exhausted even when I sleep 8 hours?',
    'How does my cycle phase affect workout recovery?',
    'What simple diet shifts help clear stress breakouts?',
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[75vh] animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              AuraHealth AI Companion
            </h3>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Grounded in your reports & clinical guidelines · Non-diagnostic
            </span>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs text-slate-400 hover:text-rose-600 hover:bg-slate-100 p-2 rounded-lg transition-colors flex items-center gap-1"
          title="Clear conversation history for privacy"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : msg.isRedFlagWarning
                    ? 'bg-rose-50 text-rose-950 border border-rose-200 rounded-tl-none font-medium'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line space-y-2">
                  {msg.content}
                </div>

                {/* Grounded Citations if present */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                    <span className="font-semibold text-slate-700 block">
                      Sources & Data Grounding:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <BookOpen className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                        <span><strong>{c.source}</strong>: {c.referenceText}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[10px] mt-2 text-right ${
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
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 border border-slate-200 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse delay-150" />
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse delay-300" />
              <span>Analyzing context with clinical reference corpus...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Row */}
      <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Try Asking:
        </span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-100 bg-white">
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
            placeholder="Ask about your lab tests, cycle rhythms, sleep habits, or fatigue..."
            className="flex-1 text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
