import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, MessageCircle, Check, CheckCheck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useLocale } from '../context/LocaleContext';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  rawPhoneNumber?: string;
  prefilledMessage?: string;
}

interface ChatMessage {
  id: string;
  sender: 'atelier' | 'user';
  text: string;
  time: string;
  status?: 'sent' | 'delivered';
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '+91 98401 82019',
  rawPhoneNumber = '919840182019',
}) => {
  const { locale, t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize welcome bubble based on locale
  useEffect(() => {
    const welcomeText =
      locale === 'ta'
        ? 'வணக்கம்! எங்கள் ELAIYAL KARIGAI கைவினை ஆடைகள் குறித்து உங்களுக்கு எவ்வாறு உதவலாம்?'
        : 'Vanakkam! Welcome to ELAIYAL KARIGAI Atelier Concierge. How can our personal stylists assist you today?';

    setMessages([
      {
        id: 'welcome-1',
        sender: 'atelier',
        text: welcomeText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [locale]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = (textToSend?: string) => {
    const msg = (textToSend || inputText).trim();
    if (!msg) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Open WhatsApp deep link with encoded message
    const dynamicUrl = `https://api.whatsapp.com/send?phone=${rawPhoneNumber}&text=${encodeURIComponent(
      `Hello ELAIYAL KARIGAI (+91 98401 82019),\n\n${msg}`
    )}`;
    window.open(dynamicUrl, '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const promptChips =
    locale === 'ta'
      ? [
          'யாழினி குர்த்தி இருப்பு விவரம்',
          'மணப்பெண் ஆடை சந்திப்பு முன்பதிவு',
          'பிரத்யேக பிளவுஸ் தைக்கும் விவரம்',
        ]
      : [
          'Check stock for Yazhini Kurti',
          'Book a bridal appointment',
          'Custom blouse stitching query',
        ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {/* Pulse indicator & tooltip when closed */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            className="hidden sm:flex items-center gap-2 bg-[#FAF7F2] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-serif font-semibold text-[#800020] cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </span>
            <span>{locale === 'ta' ? 'வாட்ஸ்அப் உதவி' : 'Atelier Concierge'}</span>
          </motion.div>
        )}

        {/* Circular Floating Launcher */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer border-2 border-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
          aria-label={isOpen ? 'Close WhatsApp Concierge' : 'Open WhatsApp Concierge'}
          title="Direct WhatsApp concierge"
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <>
              <WhatsAppIcon size={28} />
              {/* Active green pulse dot */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] border-2 border-white" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Popup Concierge Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-32px)] bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#D4AF37]/30 overflow-hidden z-50 flex flex-col max-h-[540px]"
            role="dialog"
            aria-label="ELAIYAL KARIGAI WhatsApp Concierge Chat"
          >
            {/* Header */}
            <div className="bg-[#800020] text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                {/* Atelier Monogram Logo with Online Badge */}
                <div className="relative w-10 h-10 rounded-full bg-white/10 border border-[#D4AF37]/40 flex items-center justify-center font-serif font-bold text-sm text-[#D4AF37] shadow-inner">
                  <span>EK</span>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] border-2 border-[#800020] rounded-full" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm tracking-wide text-[#FAF7F2]">
                    ELAIYAL KARIGAI
                  </h4>
                  <p className="text-[11px] text-white/80 flex items-center gap-1.5 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                    {locale === 'ta' ? 'உடனடி பதில் கிடைக்கும்' : 'Typically replies instantly'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close concierge chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF7F2]/90 min-h-[220px] max-h-[300px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#800020] text-[#FAF7F2] rounded-br-none'
                        : 'bg-white text-[#26050C] border border-[#D4AF37]/20 rounded-bl-none font-sans'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[#787269] px-1 font-mono">
                    <span>{m.time}</span>
                    {m.sender === 'user' && (
                      <CheckCheck size={12} className="text-[#25D366]" />
                    )}
                  </div>
                </div>
              ))}

              {/* Quick Prompt Chips */}
              <div className="pt-2">
                <p className="text-[10px] font-bold text-[#787269] uppercase tracking-wider mb-2 font-mono">
                  {locale === 'ta' ? 'விரைவு வினவல்கள்:' : 'Suggested Inquiries:'}
                </p>
                <div className="flex flex-col gap-1.5">
                  {promptChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(chip)}
                      className="text-left text-xs bg-white/90 hover:bg-[#800020] hover:text-[#FAF7F2] text-[#26050C] border border-[#D4AF37]/30 rounded-xl px-3 py-2 transition-all shadow-sm font-sans flex items-center justify-between group"
                    >
                      <span>{chip}</span>
                      <Send
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div ref={chatBottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-[#D4AF37]/20 flex items-center gap-2">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={
                  locale === 'ta' ? 'உங்கள் செய்தியைத் தட்டச்சு செய்க...' : 'Type your message...'
                }
                className="flex-1 resize-none bg-[#FAF7F2] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#26050C] focus:outline-none focus:border-[#800020] focus:ring-1 focus:ring-[#800020] transition-all font-sans placeholder:text-[#787269]"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#1faa53] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
                aria-label="Send message to WhatsApp"
                title="Send message to WhatsApp"
              >
                <Send size={15} />
              </button>
            </div>

            {/* Footer Bar */}
            <div className="bg-[#FAF7F2] px-4 py-2 text-[10px] text-center text-[#787269] border-t border-[#D4AF37]/10 flex items-center justify-center gap-1.5 font-mono">
              <WhatsAppIcon size={12} />
              <span>Official Atelier Concierge · +91 98401 82019</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
