import React from 'react';
import { Search, LayoutDashboard, LogOut, User } from 'lucide-react';

export default function Navbar({
  user,
  searchQuery,
  setSearchQuery,
  setShowDashboard,
  handleLogout,
  setShowAuthModal
}) {
  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-6 shrink-0 z-20 border-b border-slate-100 bg-white/60 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <img src="/Baznas.png" alt="BAZNAS Logo" className="h-20 w-auto object-contain shrink-0" />
        <h1 className="text-xl lg:text-2xl font-black tracking-widest uppercase m-0 text-baznas-green">
          PORTAL BAZNAS
        </h1>
      </div>

      <div className="relative max-w-xs w-full hidden md:block">
        <input
          type="text"
          placeholder="Cari Provinsi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 px-4 pl-10 text-xs text-baznas-ink placeholder-slate-400 focus:outline-none focus:border-baznas-green focus:ring-1 focus:ring-baznas-green transition-all"
        />
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-baznas-ink">{user.name}</span>
              <span className="text-[9px] uppercase tracking-wider text-baznas-green">{user.role}</span>
            </div>
            {user.role === 'admin' && (
              <button 
                onClick={() => setShowDashboard(true)}
                className="px-4 py-2 rounded-full bg-baznas-yellow hover:bg-yellow-400 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LayoutDashboard size={14} /> Panel Admin
              </button>
            )}
            <button onClick={handleLogout} className="p-2 rounded-full bg-slate-50 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-5 py-2.5 rounded-full bg-baznas-green hover:bg-baznas-dark text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <User size={14} /> Akses Konsol
          </button>
        )}
      </div>
    </header>
  );
}
