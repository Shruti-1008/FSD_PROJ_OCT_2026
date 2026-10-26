import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User as UserIcon, RefreshCw, Stethoscope, HeartPulse, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { api } from '../api/client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  source?: string;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  userName?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  userRole,
  userName = 'User',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: userRole === 'doctor'
        ? `Hello Dr. ${userName.replace(/^Dr\.\s*/i, '')}! I am your **AI Clinical Assistant**.\n\nI can assist you with:\n- Antibiotic protocols & dosage guidelines\n- Drug-drug interaction checks\n- Differential diagnosis hints & follow-up intervals\n\nHow can I support your consultation today?`
        : `Hello ${userName}! I am your **AI Health Guide**.\n\nI can assist you with:\n- Understanding how & when to take your medicines\n- What to do if you missed a dose\n- Diet & lifestyle tips for faster recovery\n\nWhat would you like help with?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-2.5-flash'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = userRole === 'doctor'
    ? [
        'Antibiotic protocol for acute viral bronchitis',
        'Pantoprazole dosage and administration for GERD',
        'Check interaction: Paracetamol & Antacids',
        'Suggest 5-day follow-up recovery markers'
      ]
    : [
        'What should I do if I miss an antibiotic dose?',
        'Can I take Pantoprazole with food or empty stomach?',
        'Diet & food tips for acid reflux (GERD)',
        'How often can I take Paracetamol for fever?'
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response = await api.sendChatMessage(query, userRole, history);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered a brief issue connecting to the AI backend. Please verify your server connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'ai',
        text: userRole === 'doctor'
          ? `Conversation cleared. Ready for your next clinical query, Doctor.`
          : `Conversation cleared. How can I help you with your health or medicines today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini-2.5-flash'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl h-[620px] max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between border-b ${
          userRole === 'doctor' 
            ? 'bg-gradient-to-r from-teal-700 to-emerald-800 text-white' 
            : 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
              {userRole === 'doctor' ? (
                <Stethoscope className="w-5 h-5 text-white" />
              ) : (
                <HeartPulse className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base tracking-tight">
                  {userRole === 'doctor' ? 'Clinical Decision AI' : 'Healthcare Assistant AI'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-medium tracking-wide">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-xs text-white/80">
                {userRole === 'doctor' 
                  ? 'Evidence-based guidance for physicians & prescriptions' 
                  : 'Safe medicine guidance & recovery tips for patients'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              title="Clear Chat"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Chat"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-medium ${
                  msg.sender === 'user'
                    ? userRole === 'doctor' ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-white shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? userRole === 'doctor'
                      ? 'bg-teal-600 text-white rounded-tr-xs'
                      : 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 shadow-xs rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap space-y-1">
                  {msg.text}
                </div>
                <div className={`mt-1.5 text-[10px] flex items-center justify-between ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  {msg.source && (
                    <span className="font-mono text-[9px] uppercase tracking-wider">{msg.source}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-500 shadow-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
                <span>Generating clinical guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Medical disclaimer note */}
        <div className="px-4 py-1.5 bg-amber-50/70 border-t border-amber-100 text-[10px] text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
          <span>College Academic Project AI: Clinical decisions should be confirmed by a licensed medical practitioner.</span>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                userRole === 'doctor'
                  ? 'Ask about drug protocols, dosages, or write a query...'
                  : 'Ask about medicine timings, missed doses, diet tips...'
              }
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl font-medium text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                userRole === 'doctor'
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
