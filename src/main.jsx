import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

/** * IMPORT GLOBAL STYLING
 * Pastikan file index.css mengandung:
 * @tailwind base; @tailwind components; @tailwind utilities;
 */
import './index.css'; 

/**
 * MCS PRO ELITE - ARCHITECTURE V5
 * Entry point utama untuk inisialisasi sistem.
 */

const mountNode = document.getElementById('root');

// Validasi keberadaan mount node untuk mencegah white screen tanpa pesan
if (!mountNode) {
  console.error("CRITICAL_ERROR: Root element tidak ditemukan dalam DOM.");
} else {
  const root = ReactDOM.createRoot(mountNode);

  root.render(
    <React.StrictMode>
      {/* Wrapper div untuk memastikan custom cursor atau selection style berlaku global */}
      <div className="min-h-screen bg-black antialiased selection:bg-red-900 selection:text-red-100">
        <App />
      </div>
    </React.StrictMode>
  );
}
