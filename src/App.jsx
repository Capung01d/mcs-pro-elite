import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Lock, ShieldAlert, Send, Skull, Cpu, 
  Camera, Scale, Activity, Globe, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// API Key sekarang aman di .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const SYSTEM_PASSKEY = import.meta.env.VITE_APP_PASSKEY;

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'SYSTEM READY. MCS PRO v5.0 ELITE ONLINE. Menunggu instruksi audit...' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
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
    } else {
      setError('ACCESS DENIED: Brute force detected.');
      setPasskey('');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const currentInput = input;
    const currentImg = selectedImage;
    
    setMessages(prev => [...prev, { role: 'user', content: currentInput, image: currentImg }]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Role: MCS PRO ELITE Hacker. Task: Analyze & Refactor. User Input: ${currentInput}` }] }]
        })
      });
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error accessing mainframe.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "CONNECTION CRITICAL: Server unreachable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center font-mono p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-cyber-dark border border-cyber-blood/30 p-8 rounded-sm shadow-[0_0_50px_rgba(139,0,0,0.2)]"
        >
          <div className="text-center mb-8">
            <Skull className="w-16 h-16 text-cyber-red mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-black tracking-widest text-cyber-red">MCS PRO ELITE</h1>
            <div className="h-1 w-full bg-cyber-blood/20 mt-2 overflow-hidden">
              <motion.div animate={{ x: [-100, 400] }} transition={{ repeat: Infinity, duration: 2 }} className="h-full w-20 bg-cyber-red shadow-[0_0_10px_red]" />
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-cyber-blood" />
              <input 
                type="password" 
                placeholder="ENTER ENCRYPTION KEY"
                className="w-full bg-black border border-cyber-blood/30 p-3 pl-12 text-cyber-red focus:outline-none focus:border-cyber-red transition-all"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
              />
            </div>
            <button className="w-full bg-cyber-red text-black font-bold py-3 hover:bg-white transition-colors duration-300">
              AUTHENTICATE
            </button>
            {error && <p className="text-[10px] text-center text-cyber-red animate-bounce">{error}</p>}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-cyber-black text-zinc-400 font-mono flex flex-col overflow-hidden">
      {/* Sidebar/Top Nav */}
      <header className="border-b border-cyber-blood/20 p-4 flex justify-between items-center bg-cyber-dark">
        <div className="flex items-center gap-4">
          <Activity className="text-cyber-red w-5 h-5" />
          <span className="text-xs font-bold tracking-tighter">MCS_CORE_V5: <span className="text-cyber-red underline">STABLE</span></span>
        </div>
        <div className="flex gap-6 text-[10px] uppercase hidden md:flex">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Proxy: Active</span>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-lg border ${msg.role === 'user' ? 'bg-zinc-900 border-zinc-700' : 'bg-cyber-dark border-cyber-blood/20 shadow-[0_0_15px_rgba(139,0,0,0.1)]'}`}>
              <p className={`text-[9px] mb-2 font-bold ${msg.role === 'user' ? 'text-zinc-500' : 'text-cyber-red'}`}>
                {msg.role === 'user' ? 'OPERATOR' : 'MCS_ELITE'}
              </p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
            </div>
          </motion.div>
        ))}
        {isLoading && <div className="text-cyber-red text-xs animate-pulse font-bold tracking-widest">ANALYZING BYTES...</div>}
        <div ref={chatEndRef} />
      </main>

      {/* Input Console */}
      <footer className="p-4 bg-cyber-dark border-t border-cyber-blood/20">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-4">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 hover:text-cyber-red border border-zinc-800 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <input 
            type="text"
            placeholder="Ketik perintah terminal..."
            className="flex-1 bg-black border border-zinc-800 p-3 text-sm focus:outline-none focus:border-cyber-red text-cyber-red"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-cyber-blood px-6 hover:bg-cyber-red transition-all text-white">
            <Send className="w-5 h-5" />
          </button>
        </form>
        <input type="file" ref={fileInputRef} hidden />
      </footer>
    </div>
  );
}
