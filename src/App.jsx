import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Lock, ShieldAlert, Send, Skull, Cpu, Database,
  Search, AlertTriangle, User, Zap, Camera, Copy, Check, X,
  FileCode, Bug, Scale, Activity, Radio, Eye
} from 'lucide-react';

const apiKey = "MASUKKAN_API_KEY_KAMU_DISINI"; 

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Koneksi terenkripsi berhasil dibangun. MCS PRO v4.0 Online. Saya siap melakukan audit sistem atau simulasi penetrasi.' }
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
      setError('AUTENTIKASI GAGAL: Akses Ilegal Dicatat.');
      setPasskey('');
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
    // Logika pemanggilan API diletakkan di sini
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: "Analisis selesai. Sistem aman." }]);
      setIsLoading(false);
    }, 2000);
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-mono text-red-600">
        <h1 className="text-3xl font-black mb-8 tracking-[0.3em]">MCS PRO LOGIN</h1>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <input 
            type="password" 
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            className="w-full bg-zinc-900 border border-red-900 p-4 rounded text-center mb-4" 
            placeholder="KUNCI AKSES"
          />
          <button className="w-full bg-red-700 text-black font-bold py-3 rounded">MASUK</button>
          {error && <p className="text-xs text-center mt-4">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black font-mono text-zinc-300">
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b border-red-900/20 flex justify-between">
          <span className="text-red-600 font-bold">MCS PRO ELITE V4</span>
          <span className="text-xs text-zinc-500">SECURE SESSION</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`p-4 rounded-lg ${m.role === 'user' ? 'bg-zinc-900 ml-auto' : 'bg-zinc-950 border border-red-900/20'}`}>
              <p className="text-xs text-red-900 mb-1">{m.role.toUpperCase()}</p>
              <p>{m.content}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="p-4 bg-zinc-950 border-t border-red-900/20">
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-black border border-red-900/30 p-3 rounded"
              placeholder="Masukkan perintah..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="bg-red-700 px-6 rounded text-black font-bold">KIRIM</button>
          </div>
        </form>
      </div>
    </div>
  );
}
