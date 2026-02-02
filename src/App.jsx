import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Lock, ShieldAlert, Send, Skull, Cpu, Database,
  Search, AlertTriangle, User, Zap, Camera, Copy, Check, X,
  FileCode, Bug, Scale, Activity, Radio, Eye
} from 'lucide-react';

// Ganti tanda kutip kosong di bawah dengan API Key dari Google AI Studio jika ingin AI-nya aktif
const apiKey = ""; 

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Koneksi terenkripsi berhasil dibangun. MCS PRO v4.0 Online. Saya siap melakukan audit sistem, refactoring kode, atau simulasi penetrasi. Gunakan fitur upload jika Anda memiliki target visual untuk dianalisis.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [copyStatus, setCopyStatus] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passkey === 'M4ZK1PL4Y') {
      setIsLocked(false);
      setShowDisclaimer(true);
      setError('');
    } else {
      setError('AUTENTIKASI GAGAL: Akses Ilegal Dicatat oleh Firewall.');
      setPasskey('');
    }
  };

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text, id) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const callGemini = async (userMessage, imageBase64) => {
    if (!apiKey) return "⚠️ API Key belum dikonfigurasi. Silakan masukkan API Key di kode sumber.";
    
    setIsLoading(true);
    const systemPrompt = `Anda adalah MCS PRO ELITE, AI tercanggih untuk Red Team, Ethical Hacking, dan Software Engineering. 
    Tugas: Menganalisis bug, memperbaiki kode (refactoring), dan memberikan rekomendasi keamanan.`;
    
    try {
      let payload;
      if (imageBase64) {
        const base64Data = imageBase64.split(',')[1];
        payload = {
          contents: [{
            parts: [
              { text: userMessage || "Analisis gambar ini." },
              { inlineData: { mimeType: "image/png", data: base64Data } }
            ]
          }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        };
      } else {
        payload = {
          contents: [{ parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        };
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal mendapatkan respons.";
    } catch (err) {
      return "⚠️ Galat koneksi ke server AI.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const currentImage = selectedImage;
    const userMsg = { role: 'user', content: input, image: currentImage };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);

    const aiResponse = await callGemini(input, currentImage);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-mono text-red-600 relative overflow-hidden">
        <div className="z-10 w-full max-w-lg bg-zinc-950/80 border border-red-900/50 p-10 rounded-2xl shadow-[0_0_100px_rgba(153,0,0,0.4)] backdrop-blur-xl relative">
          <div className="flex flex-col items-center mb-10">
            <Skull className="w-24 h-24 text-red-600 mb-4" />
            <h1 className="text-3xl font-black tracking-[0.3em] text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-900">MCS PRO</h1>
            <p className="text-[10px] text-red-800 mt-3 uppercase tracking-[0.5em] font-bold">Encrypted Authorization Required</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input 
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full bg-black/60 border-b-2 border-red-900/30 focus:border-red-600 rounded p-4 outline-none text-red-500 text-center"
              placeholder="PASSKEY: M4ZK1PL4Y"
            />
            <button type="submit" className="w-full bg-red-700 hover:bg-red-500 text-black font-black py-4 rounded-lg flex items-center justify-center gap-3">
              <ShieldAlert className="w-6 h-6" /> INILISIASI SISTEM
            </button>
          </form>
          {error && <div className="mt-8 p-4 border border-red-600/30 bg-red-950/20 rounded-lg text-xs text-center">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black font-mono text-zinc-300 overflow-hidden relative">
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="max-w-2xl w-full bg-zinc-950 border-2 border-red-900/50 rounded-2xl p-8 shadow-[0_0_100px_rgba(153,0,0,0.4)]">
            <div className="flex items-center gap-3 text-red-600 mb-6 border-b border-red-900/30 pb-4">
              <Scale className="w-8 h-8" />
              <h2 className="text-2xl font-black">LEGAL DISCLAIMER</h2>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Sistem ini hanya untuk edukasi. Pengguna bertanggung jawab penuh atas segala tindakan ilegal yang melanggar hukum siber.
            </p>
            <button onClick={handleAcceptDisclaimer} className="w-full bg-red-700 text-black font-black py-4 rounded-xl">SAYA SETUJU</button>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col relative">
        <header className="h-20 bg-zinc-950 border-b border-red-900/10 flex items-center justify-between px-8">
          <h1 className="text-sm font-black tracking-[0.2em] text-red-600">MCS_PRO_ELITE_SESSION</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-6 rounded-3xl border ${msg.role === 'user' ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-950 border-red-900/20'}`}>
                <div className="text-[10px] font-black text-red-600 mb-2">{msg.role.toUpperCase()}</div>
                {msg.image && <img src={msg.image} alt="Forensic" className="mb-4 rounded-lg max-h-96" />}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-red-900 animate-pulse">MEMPROSES DATA...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="p-8">
          <form onSubmit={handleSendMessage} className="flex gap-4 bg-zinc-950 border border-red-900/20 p-4 rounded-2xl">
            <button type="button" onClick={() => fileInputRef.current.click()} className="text-zinc-500 hover:text-red-600"><Camera /></button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
            <input 
              className="flex-1 bg-transparent border-none text-red-500 focus:ring-0" 
              placeholder="Ketik perintah..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-red-700 p-3 rounded-xl text-black"><Send /></button>
          </form>
        </div>
      </main>
    </div>
  );
}
