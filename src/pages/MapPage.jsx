import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Search } from "lucide-react";
import api from '../services/api';
import ProvinceCard from '../components/ProvinceCard';
import ProvinceDetailModal from '../components/ProvinceDetailModal';
import InteractiveMap from '../components/InteractiveMap';
// Hover debounce handlers are defined inside the MapPage component below.


export default function MapPage() {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [hoveredProvinceId, setHoveredProvinceId] = useState(null);

  // Hover debounce handlers
  const hoverTimeout = useRef(null);
  const handleHoverEnter = (id) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoveredProvinceId(id), 100);
  };
  const handleHoverLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredProvinceId(null);
  };
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/provinces');
      if (res.data.success) {
        setProvinces(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch provinces", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProvinceDetails = async (slug) => {
    try {
      const res = await api.get(`/provinces/${slug}`);
      if (res.data.success) {
        setSelectedProvince(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load details", err);
    }
  };

  const filteredProvinces = provinces.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-baznas-gray relative overflow-hidden text-baznas-ink font-sans flex flex-col lg:flex-row">

      {/* LEFT: INTERACTIVE MAP */}
      <section className="relative w-full lg:w-3/5 h-[50vh] lg:h-screen flex flex-col bg-slate-50 border-r border-slate-200/60">
        <div className="absolute top-6 left-6 z-20 flex gap-4 items-center p-3 sm:p-3.5 pr-5 sm:pr-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-premium">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all duration-300 border border-slate-200/60 shadow-sm active:scale-95 cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          <div className="text-baznas-ink">
            <h2 className="text-sm font-black uppercase tracking-wider m-0 leading-tight">Peta Nasional</h2>
            <p className="text-[8px] tracking-[0.2em] text-baznas-green uppercase font-black opacity-90 mt-0.5">Eksplorasi Wilayah BAZNAS</p>
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
          <div className="w-full h-full max-w-[1000px] max-h-full flex items-center justify-center">
            <InteractiveMap
              activeSlug={provinces.find(p => p.id === hoveredProvinceId)?.slug}
              onSelectProvince={handleViewProvinceDetails}
              provinces={provinces}
              isInteractive={true}
            />
          </div>
        </div>
      </section>

      {/* RIGHT: PROVINCES LIST */}
      <section className="relative w-full lg:w-2/5 h-[50vh] lg:h-screen bg-slate-50/50 flex flex-col border-t lg:border-t-0 border-slate-200/60">

        {/* Search Header */}
        <div className="p-6 lg:p-8 bg-white border-b border-slate-200/60 shrink-0 z-10 shadow-sm">
          <h3 className="text-lg font-black text-baznas-ink uppercase tracking-wider mb-4">Daftar Provinsi</h3>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari provinsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 rounded-2xl py-3 px-4 pl-12 text-xs text-baznas-ink placeholder-slate-400 focus:outline-none focus:border-baznas-green focus:ring-4 focus:ring-baznas-green/10 transition-all duration-300 shadow-sm focus:shadow-md"
            />
            <Search size={16} className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide">
          {isLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw size={20} className="animate-spin text-baznas-green" />
              <span className="text-[9px] uppercase font-black tracking-widest">Memuat Data...</span>
            </div>
          ) : filteredProvinces.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
              Tidak ada Provinsi yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5"
              onMouseLeave={() => handleHoverLeave()}
            >
              {filteredProvinces.map((prov, index) => (
                <div
                  key={prov.id}
                  onMouseEnter={() => handleHoverEnter(prov.id)}
                  className="w-full transform transition-all duration-300"
                >
                  <ProvinceCard
                    province={prov}
                    id={index + 1}
                    activeCard={null}
                    onClick={() => handleViewProvinceDetails(prov.slug)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <ProvinceDetailModal
        selectedProvince={selectedProvince}
        onClose={() => setSelectedProvince(null)}
      />

    </main>
  );
}
