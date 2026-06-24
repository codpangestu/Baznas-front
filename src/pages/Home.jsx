import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import Navbar from '../components/Navbar';
import ProvinceCard from '../components/ProvinceCard';
import AuthModal from '../components/AuthModal';
import ProvinceDetailModal from '../components/ProvinceDetailModal';
import api from '../services/api';
import InteractiveMap from '../components/InteractiveMap';

export default function Home() {
  const scrollRef = useRef(null);
  const [activeCard, setActiveCard] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data State
  const [provinces, setProvinces] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  
  // Auth State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || "");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initial Provinces Fetch
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
      const res = await api.get('/provinces');
      if (res.data.success) {
        setProvinces(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch provinces", err);
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = 320 + 16; // card width + gap
      const index = Math.round(scrollPosition / cardWidth) + 1;
      if (index >= 1 && index <= filteredProvinces.length) {
        setActiveCard(index);
      }
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -336, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 336, behavior: 'smooth' });
    }
  };

  const handleViewProvinceDetails = async (slug) => {
    setIsLoadingDetail(true);
    try {
      const res = await api.get(`/provinces/${slug}`);
      if (res.data.success) {
        setSelectedProvince(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load details", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken("");
    }
  };

  const handleAuthSuccess = (loggedUser, loggedToken) => {
    setUser(loggedUser);
    setToken(loggedToken);
    setShowAuthModal(false);
  };

  const filteredProvinces = provinces.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-baznas-gray relative overflow-hidden text-baznas-ink font-sans">
      
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute -bottom-48 -right-48 w-[400px] h-[400px] rounded-full bg-baznas-green/5 blur-[120px] pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-[400px] h-[400px] rounded-full bg-baznas-yellow/5 blur-[120px] pointer-events-none" />

      {/* MAP BACKGROUND (INTERACTIVE) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-auto transition-all duration-700 p-6">
        <div className="w-full h-full max-w-[1200px] max-h-full flex items-center justify-center">
          <InteractiveMap
            activeSlug={filteredProvinces[activeCard - 1]?.slug}
            provinces={provinces}
            isInteractive={true}
            onSelectProvince={handleViewProvinceDetails}
          />
        </div>
      </div>

      <div className="relative min-h-screen p-3 lg:p-5">
        {/* CONTAINER */}
        <div className="relative min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-40px)] rounded-[32px] border border-slate-200/80 bg-white/85 backdrop-blur-2xl overflow-hidden shadow-premium flex flex-col">
          
          {/* HEADER */}
          <Navbar 
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleLogout={handleLogout}
            setShowAuthModal={setShowAuthModal}
          />

          {/* HERO & CONTENT */}
          <section className="relative z-10 px-6 lg:px-10 xl:px-14 pt-8 lg:pt-12 pb-10 flex-1 flex items-center">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 xl:gap-20 items-center w-full">
              
              {/* LEFT */}
              <div className="max-w-[580px] animate-fadeIn">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <span className="w-6 h-1 bg-gradient-to-r from-baznas-yellow to-amber-500 rounded-full" />
                  <p className="text-[9px] font-black tracking-[0.2em] text-baznas-green uppercase">Sistem BAZNAS Terintegrasi</p>
                </div>
                <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight text-baznas-ink mb-5 sm:mb-6 uppercase">
                  Pemantauan <br />
                  <span className="bg-gradient-to-r from-baznas-green to-baznas-dark bg-clip-text text-transparent block mt-1">Nasional</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 max-w-md leading-relaxed">
                  Pusat kendali data wilayah BAZNAS seluruh Indonesia. Kelola organisasi, awasi perkembangan daerah, dan optimalkan layanan secara terpusat.
                </p>

                <div className="flex items-center gap-5">
                  <Link to="/explore" className="px-6 py-4 rounded-full bg-gradient-to-r from-baznas-green to-baznas-dark hover:shadow-lg hover:shadow-baznas-green/20 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group hover:-translate-y-0.5 cursor-pointer">
                    Eksplorasi Nasional
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <div className="flex flex-col border-l border-slate-200 pl-5">
                    <span className="text-lg sm:text-xl font-black text-baznas-ink leading-none">{provinces.length}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black mt-1">Data Aktif</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: PROVINCES SLIDER */}
              <div className="relative w-full min-w-0 flex flex-col justify-center h-full animate-fadeIn">
                
                <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6 flex-wrap">
                  <div>
                    <p className="text-[9px] tracking-[0.25em] uppercase text-baznas-green font-black">Eksplorasi Nasional</p>
                    <h3 className="text-lg lg:text-xl font-black text-baznas-ink uppercase tracking-wide mt-1">Provinsi di Indonesia</h3>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={scrollLeft}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      onClick={scrollRight}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-baznas-green to-baznas-dark text-white flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-baznas-green/20 active:scale-95 cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {isLoadingProvinces ? (
                  <div className="h-[280px] w-full flex flex-col items-center justify-center gap-3 bg-slate-50/40 rounded-3xl border border-dashed border-slate-200 text-slate-400 backdrop-blur-sm">
                    <RefreshCw size={22} className="animate-spin text-baznas-green" />
                    <span className="text-[9px] uppercase font-black tracking-widest">Memuat Data...</span>
                  </div>
                ) : (
                  <>
                    {filteredProvinces.length === 0 ? (
                      <div className="h-[280px] flex items-center justify-center text-slate-400 text-xs italic bg-slate-50/40 rounded-3xl border border-slate-200/50">
                        Tidak ada Provinsi yang cocok dengan pencarian Anda.
                      </div>
                    ) : (
                      <div 
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {filteredProvinces.map((prov, index) => (
                          <div key={prov.id} className="snap-start shrink-0">
                            <ProvinceCard 
                              province={prov} 
                              id={index + 1}
                              activeCard={activeCard}
                              onClick={() => handleViewProvinceDetails(prov.slug)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Minimalist Progress Indicator */}
                    <div className="mt-6 flex items-center gap-4">
                      <span className="text-[10px] font-black text-baznas-ink font-mono tracking-wider">
                        {String(activeCard).padStart(2, '0')}
                      </span>
                      <div className="w-12 h-[2px] bg-baznas-green/30" />
                      <div className="w-40 h-[3px] bg-slate-100 rounded-full overflow-hidden relative">
                         <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-baznas-green to-baznas-dark rounded-full transition-all duration-500" style={{ width: `${(activeCard / filteredProvinces.length) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 font-mono tracking-wider">
                        {String(filteredProvinces.length).padStart(2, '0')}
                      </span>
                    </div>
                  </>
                )}

              </div>
            </div>
          </section>
        </div>
      </div>

      <ProvinceDetailModal 
        selectedProvince={selectedProvince} 
        onClose={() => setSelectedProvince(null)} 
      />

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

    </main>
  );
}