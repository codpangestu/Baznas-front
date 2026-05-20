import { useRef, useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import Navbar from '../components/Navbar';
import ProvinceCard from '../components/ProvinceCard';
import AuthModal from '../components/AuthModal';
import ProvinceDetailModal from '../components/ProvinceDetailModal';
import api from '../services/api';

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
      
      {/* MAP BACKGROUND (INTERACTIVE) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none transition-all duration-700">
        <img
          src="/id-map.svg"
          alt="Indonesia Map"
          className="w-full max-w-[1200px] h-auto object-contain blur-[1px]"
        />
        {provinces.map((p, idx) => (
           <div 
             key={p.id}
             className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${activeCard === (idx + 1) ? 'bg-baznas-green scale-[3] shadow-[0_0_20px_rgba(0,166,81,0.8)] z-10' : 'bg-baznas-green/30'}`}
             style={{
               top: `${40 + (idx * 7) % 20}%`,
               left: `${30 + (idx * 11) % 40}%`
             }}
           />
        ))}
      </div>

      <div className="relative min-h-screen p-3 lg:p-5">
        {/* CONTAINER */}
        <div className="relative min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-40px)] rounded-[28px] border border-slate-200 bg-white/80 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col">
          
          {/* HEADER */}
          <Navbar 
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleLogout={handleLogout}
            setShowAuthModal={setShowAuthModal}
          />

          {/* HERO & CONTENT */}
          <section className="relative z-10 px-6 lg:px-10 xl:px-14 pt-10 lg:pt-14 pb-10 flex-1 flex items-center">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-center w-full">
              
              {/* LEFT */}
              <div className="max-w-[620px]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-1 bg-baznas-yellow rounded-full" />
                  <p className="text-[10px] font-black tracking-widest text-baznas-green uppercase">Sistem BAZNAS Terintegrasi</p>
                </div>
                <h2 className="text-5xl lg:text-6xl xl:text-[76px] font-black leading-[1.05] tracking-tight text-baznas-ink mb-6 uppercase">
                  Pemantauan <br />
                  <span className="text-baznas-green block mt-1">Nasional</span>
                </h2>
                <p className="text-sm lg:text-base text-slate-500 mb-8 max-w-md leading-relaxed">
                  Pusat kendali data wilayah BAZNAS seluruh Indonesia. Kelola organisasi, awasi perkembangan daerah, dan optimalkan layanan secara terpusat.
                </p>

                <div className="flex items-center gap-4">
                  <button className="px-6 py-3.5 rounded-full bg-baznas-green hover:bg-baznas-dark text-white text-xs font-bold transition-all flex items-center gap-2 group shadow-xl shadow-baznas-green/20 uppercase tracking-wider">
                    Eksplorasi Nasional
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-baznas-ink">{provinces.length}</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Data Aktif</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: PROVINCES SLIDER */}
              <div className="relative w-full min-w-0 flex flex-col justify-center h-full">
                
                <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
                  <div>
                    <p className="text-[11px] tracking-[0.25em] uppercase text-baznas-green font-bold">Eksplorasi Nasional</p>
                    <h3 className="text-xl lg:text-2xl font-black text-baznas-ink uppercase">Provinsi di Indonesia</h3>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={scrollLeft}
                      className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition shadow-sm"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={scrollRight}
                      className="w-10 h-10 rounded-full bg-baznas-green hover:bg-baznas-dark text-white flex items-center justify-center transition shadow-md"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {isLoadingProvinces ? (
                  <div className="h-[280px] w-full flex flex-col items-center justify-center gap-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                    <RefreshCw size={24} className="animate-spin text-baznas-green" />
                    <span className="text-xs uppercase font-bold tracking-widest">Memuat Data...</span>
                  </div>
                ) : (
                  <>
                    {filteredProvinces.length === 0 ? (
                      <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm italic bg-slate-50 rounded-2xl border border-slate-100">
                        Tidak ada Provinsi yang cocok dengan pencarian Anda.
                      </div>
                    ) : (
                      <div 
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {filteredProvinces.map((prov) => (
                          <div key={prov.id} className="snap-start shrink-0">
                            <ProvinceCard 
                              province={prov} 
                              onViewDetails={handleViewProvinceDetails} 
                              isLoadingDetail={isLoadingDetail} 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Minimalist Progress Indicator */}
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-xs font-black text-baznas-ink font-mono">
                        {String(activeCard).padStart(2, '0')}
                      </span>
                      <div className="w-16 h-[2px] bg-baznas-green" />
                      <div className="w-32 h-[2px] bg-slate-200 relative">
                         <div className="absolute top-0 left-0 h-full bg-baznas-green transition-all duration-300" style={{ width: `${(activeCard / filteredProvinces.length) * 100}%` }} />
                      </div>
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