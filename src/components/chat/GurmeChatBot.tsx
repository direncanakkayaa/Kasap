"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Beef, 
  Sparkles, 
  ChefHat,
  Loader2,
  Minimize2,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatWithAI } from "@/app/actions/chat-actions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function GurmeChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Selam! Ben Erdoğan Kasap'ın Yapay Zeka Gurme Kasabı. Et seçiminden dünya mutfağına, pişirme sırlarından marinasyon tariflerine kadar her konuda size yardımcı olabilirim. Bugün ne pişiriyoruz?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    startTransition(async () => {
      try {
        const response = await chatWithAI(userMessage.content, messages.slice(-5));
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Üzgünüm, şu anda etlerimi dinlendiriyorum. Lütfen biraz sonra tekrar deneyin veya bizimle doğrudan iletişime geçin.",
          timestamp: new Date(),
        }]);
      }
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-antique-gold text-deep-espresso rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
          >
            <Sparkles className="absolute -top-2 -right-2 text-gold animate-pulse" size={24} />
            <ChefHat size={32} className="group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 100 }}
            className="w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh] bg-[#1A1110] border border-antique-gold/20 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-deep-espresso to-[#2A1B1A] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-antique-gold/10 rounded-xl flex items-center justify-center text-antique-gold border border-antique-gold/20">
                  <ChefHat size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Gurme Kasap AI</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-ivory/50 uppercase tracking-widest font-bold">Uzman Danışman Çevrimiçi</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-ivory/20 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-antique-gold text-deep-espresso font-medium rounded-tr-none shadow-lg shadow-gold/10" 
                      : "bg-white/5 text-ivory/90 rounded-tl-none border border-white/5"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[9px] mt-2 block ${msg.role === "user" ? "text-deep-espresso/40" : "text-ivory/20"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isPending && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                    <Loader2 className="animate-spin text-antique-gold" size={16} />
                    <span className="text-xs text-ivory/40 italic">Etleri dinlendiriyorum...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-black/20 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Antrikot en iyi nasıl pişirilir?..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder-ivory/20 focus:outline-none focus:border-antique-gold/50 transition-all text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isPending}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-antique-gold text-deep-espresso rounded-xl flex items-center justify-center hover:bg-gold-light transition-all disabled:opacity-30 disabled:hover:scale-100 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-center mt-4 text-ivory/10 font-medium tracking-tight">
                Uzman kasaplarımız tarafından eğitilmiş yapay zeka deneyimi.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
