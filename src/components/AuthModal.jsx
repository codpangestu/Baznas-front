import React, { useState } from 'react';
import { Lock, X, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function AuthModal({ onClose, onSuccess }) {
  const [authEmail, setAuthEmail] = useState("admin@test.com");
  const [authPassword, setAuthPassword] = useState("password");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError("");
    try {
      const res = await api.post('/login', { email: authEmail, password: authPassword });

      if (res.data && res.data.success) {
        const loggedUser = res.data.data.user;
        const loggedToken = res.data.data.token;

        localStorage.setItem('user', JSON.stringify(loggedUser));
        localStorage.setItem('token', loggedToken);

        onSuccess(loggedUser, loggedToken);
      } else {
        setAuthError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      setAuthError("Failed to connect to backend server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-baznas-green/10 text-baznas-green flex items-center justify-center mb-3">
            <Lock size={20} />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-wider text-baznas-ink">Login Keamanan Pusat</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-[280px]">Akses manajemen dasbor Admin dan direktori data provinsi.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {authError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {authError}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 font-bold">Alamat Email</label>
            <input
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
              placeholder="admin@test.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-baznas-ink focus:outline-none focus:border-baznas-green focus:ring-1 focus:ring-baznas-green transition"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1.5 font-bold">Kata Sandi</label>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm text-baznas-ink focus:outline-none focus:border-baznas-green focus:ring-1 focus:ring-baznas-green transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 rounded-lg bg-baznas-green hover:bg-baznas-dark text-white font-bold uppercase text-xs tracking-wider transition mt-2 flex items-center justify-center gap-2"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Memverifikasi Identitas...
              </>
            ) : (
              "Autentikasi Akses Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
