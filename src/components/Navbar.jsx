import React, { useState, useRef, useEffect } from 'react';
import { Search, LayoutDashboard, LogOut, User, Map, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({
  user,
  searchQuery,
  setSearchQuery,
  handleLogout,
  setShowAuthModal
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shrink-0 z-20 border-b border-slate-100 bg-white/70 backdrop-blur-xl">
      {/* Brand logo & title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <img src="/Baznas.png" alt="BAZNAS Logo" className="h-10 sm:h-12 md:h-14 w-auto object-contain shrink-0 transition-transform duration-500 hover:scale-105" />
        <h1 className="text-md lg:text-xl font-black tracking-[0.15em] uppercase m-0 text-baznas-green hidden sm:block">
          PORTAL BAZNAS
        </h1>
      </div>

      {/* Center Search Input */}
      <div className="relative flex-1 max-w-[140px] sm:max-w-xs w-full mx-2 sm:mx-4">
        <input
          type="text"
          placeholder="Cari Provinsi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 rounded-full py-2 px-3 sm:px-4 pl-9 sm:pl-11 text-[10px] sm:text-xs text-baznas-ink placeholder-slate-400 focus:outline-none focus:border-baznas-green focus:ring-4 focus:ring-baznas-green/10 shadow-sm focus:shadow-md transition-all duration-300"
        />
        <Search size={13} className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Navigation Section */}
        <Link
          to="/explore"
          className="px-3.5 py-2 rounded-full border border-slate-200/80 hover:border-baznas-green/30 bg-white hover:bg-slate-50/50 text-slate-700 hover:text-baznas-green text-xs font-extrabold flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 shrink-0"
          title="Peta Wilayah"
        >
          <Map size={13} className="text-baznas-green shrink-0" />
          <span className="hidden sm:inline uppercase tracking-wider text-[10px]">Peta Wilayah</span>
        </Link>

        {/* Divider Line */}
        <div className="hidden sm:block w-[1px] h-6 bg-slate-200 shrink-0"></div>

        {/* User / Authentication Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Capsule Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-slate-50/50 hover:bg-slate-100/80 border border-slate-200/60 rounded-full pl-2 pr-2.5 py-1 sm:pl-3 sm:pr-2.5 shadow-sm hover:shadow transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-baznas-green/10 text-left shrink-0 cursor-pointer"
              >
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-[10px] font-black text-baznas-ink leading-tight">{user.name}</span>
                  <span className="text-[8px] uppercase tracking-[0.1em] font-black text-baznas-green leading-none mt-0.5">{user.role}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-baznas-green to-baznas-dark text-white flex items-center justify-center font-black text-xs shadow-md shadow-baznas-green/15 uppercase shrink-0">
                  {user.name.charAt(0)}
                </div>
                <ChevronDown size={11} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} shrink-0`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 rounded-2xl bg-white border border-slate-100 shadow-xl py-1.5 z-30 animate-fadeIn shrink-0">
                  {/* Name and role shown only on mobile dropdown list */}
                  <div className="px-4 py-2 border-b border-slate-100 flex flex-col sm:hidden">
                    <span className="text-xs font-black text-baznas-ink">{user.name}</span>
                    <span className="text-[9px] uppercase tracking-wider text-baznas-green font-bold">{user.role}</span>
                  </div>

                  {/* Admin Panel option */}
                  {user.role === 'admin' && (
                    <Link
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50 hover:text-baznas-green transition-all"
                    >
                      <LayoutDashboard size={13} className="text-slate-400 shrink-0" />
                      <span className="uppercase tracking-wider text-[10px]">Panel Admin</span>
                    </Link>
                  )}

                  {/* Logout option */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer"
                  >
                    <LogOut size={13} className="text-red-400 shrink-0" />
                    <span className="uppercase tracking-wider text-[10px]">Keluar Konsol</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-baznas-green to-baznas-dark hover:shadow-lg hover:shadow-baznas-green/20 text-white text-xs font-extrabold flex items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:-translate-y-0.5 shrink-0 cursor-pointer"
            >
              <User size={13} className="shrink-0" />
              <span className="hidden sm:inline uppercase tracking-wider text-[10px]">Akses Konsol</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}



