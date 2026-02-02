import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Lock, ShieldAlert, Send, Skull, Cpu, 
  Camera, Scale, Activity, Globe, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Konfigurasi Keamanan dari file .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const SYSTEM_PASSKEY = import.meta.env.VITE_APP_PASSKEY;

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SYSTEM READY. MCS PRO v5.0 ELITE ONLINE. Menunggu instruksi audit siber...' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  /** --- PENAMBAHAN GLITCH --- **/
  const [isGlitching, setIsGlitching] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === SYSTEM_PASSKEY) {
      setIsLocked(false);
      setShowDisclaimer(true);
      setError('');
      setIsGlitching(false); // Matikan glitch jika login berhasil
    } else {
      setError('ACCESS DENIED: Kredensial Tidak Valid.');
      setPasskey('');
      setIsGlitching(true); // Aktifkan glitch saat error
      setTimeout(() => setIsGlitching(false), 2000); // Matikan setelah 2 detik
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg = { role: 'user', content: input, image: selectedImage };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    setIsGlitching(true); // Aktifkan glitch saat loading

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Role: MCS PRO ELITE Hacker. Task: Analyze & Refactor. User Input: ${input}` }] }]
        })
      });
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "CRITICAL_ERROR: Gagal mengambil data dari mainframe.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "CONNECTION_FAILURE: Link satelit terputus." }]);
    } finally {
      setIsLoading(false);
      setIsGlitching(false); // Matikan glitch setelah selesai
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-400 font-mono overflow-hidden relative">
      {/* --- EFEK VISUAL ELITE --- */}
      <div className="cyber-scanline" />
      
      <AnimatePresence>
        {isLocked ? (
          /* --- LOGIN INTERFACE --- */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-6"
          >
            <div className="w-full max-w-md bg-[#0a0a0a] border border-red-900/30 p-8 rounded-sm shadow-[0_0_50px_rgba(139,0,0,0.2)]">
              <div className="text-center mb-8">
                <Skull className="w-16 h-16 text-red-600 mx-auto mb-4 animate-pulse" />
                {/* Judul Glitch */}
                <h1 className={`text-2xl font-black tracking-[0.2em] text-red-600 text-glow-red ${isGlitching ? 'glitch' : ''}`} data-text="MCS PRO ELITE">
                  MCS PRO ELITE
                </h1>
                <p className="text-[10px] text-red-900 mt-2 tracking-[0.3em]">SECURE ACCESS ONLY</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-red-900" />
                  <input 
                    type="password" 
                    placeholder="ENTER PASSKEY"
                    className="w-full bg-black border border-red-900/30 p-3 pl-12 text-red-600 focus:outline-none focus:border-red-600 transition-all"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                  />
                </div>
                <button className="w-full bg-red-700 text-black font-bold py-3 hover:bg-red-500 transition-all duration-300">
                  INITIALIZE SESSION
                </button>
                {error && (
                  <motion.div initial={{ y: 10 }} animate={{ y: 0 }} className="flex items-center gap-2 justify-center text-red-600 text-[10px]">
                    <AlertCircle className={`w-3 h-3 ${isGlitching ? 'glitch' : ''}`} data-text="!" /> 
                    <span className={`${isGlitching ? 'glitch' : ''}`} data-text={error}>{error}</span>
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        ) : (
          /* --- MAIN TERMINAL INTERFACE --- */
          <main className="flex-1 flex flex-col relative">
            {/* Header */}
            <header className="h-16 border-b border-red-900/20 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
              <div className="flex items-center gap-3">
                <Activity className="text-red-600 w-5 h-5 animate-pulse" />
                <span className="text-xs font-black tracking-widest text-red-600">SESSION: ACTIVE_ENCRYPTION</span>
              </div>
              <div className="flex gap-4 text-[10px]">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-red-600" /> AES-256</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-red-600" /> PROXY: ON</span>
              </div>
            </header>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-sm border ${
                    msg.role === 'user' 
                      ? 'bg-zinc-900/50 border-zinc-800' 
                      : 'bg-black/40 border-red-900/20 shadow-[0_0_20px_rgba(139,0,0,0.05)]'
                  }`}>
                    <div className={`text-[9px] font-bold mb-2 ${msg.role === 'user' ? 'text-zinc-500' : 'text-red-600'}`}>
                      {msg.role.toUpperCase()} // TERMINAL_ID: 0x{i}
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className={`text-red-600 text-xs animate-pulse font-bold tracking-widest ${isGlitching ? 'glitch' : ''}`} data-text="> DECIPHERING DATA STREAM...">
                  &gt; DECIPHERING DATA STREAM...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Console */}
            <footer className="p-6 bg-black border-t border-red-900/20">
              <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-3 terminal-glass p-2">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="p-3 text-zinc-600 hover:text-red-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="text"
                  placeholder="Ketik perintah terminal..."
                  className="flex-1 bg-transparent border-none p-3 text-sm focus:ring-0 text-red-500 placeholder:text-red-900/50"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button className="bg-red-700 px-6 hover:bg-red-600 text-black font-bold transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <input type="file" ref={fileInputRef} hidden />
            </footer>
          </main>
        )}
      </AnimatePresence>

      {/* --- MODAL DISCLAIMER --- */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-lg w-full bg-[#0a0a0a] border-2 border-red-900 p-8">
            <div className="flex items-center gap-3 text-red-600 mb-6 border-b border-red-900/30 pb-4">
              <Scale className="w-8 h-8" />
              <h2 className="text-xl font-black italic">LEGAL_WARNING</h2>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed mb-8">
              Penggunaan alat ini harus mematuhi hukum siber internasional. Segala bentuk penyalahgunaan di luar lingkungan pengujian berizin adalah tanggung jawab penuh operator.
            </p>
            <button 
              onClick={() => setShowDisclaimer(false)} 
              className="w-full bg-red-700 text-black font-black py-4 hover:bg-red-500 transition-all"
            >
              I ACCEPT THE TERMS
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
