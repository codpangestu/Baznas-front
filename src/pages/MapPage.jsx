import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, Layers, Building2, MapPin, 
  X, AlertCircle, RefreshCw
} from "lucide-react";
import api from '../services/api';
import ProvinceCard from '../components/ProvinceCard';
import ProvinceCardSkeleton from '../components/ProvinceCardSkeleton';
import ProvinceDetailModal from '../components/ProvinceDetailModal';
import InteractiveMap from '../components/InteractiveMap';

// Region groupings for filter chips
const REGION_GROUPS = [
  { id: 'all', label: 'Semua Wilayah', color: 'bg-baznas-green' },
  { id: 'sumatra', label: 'Sumatra', color: 'bg-blue-500' },
  { id: 'jawa', label: 'Jawa', color: 'bg-amber-500' },
  { id: 'kalimantan', label: 'Kalimantan', color: 'bg-emerald-500' },
  { id: 'sulawesi', label: 'Sulawesi', color: 'bg-purple-500' },
  { id: 'bali_nt', label: 'Bali & Nusa Tenggara', color: 'bg-rose-500' },
  { id: 'maluku_papua', label: 'Maluku & Papua', color: 'bg-orange-500' },
];

// Map province slugs to region groups
const PROVINCE_REGION_MAP = {
  'aceh': 'sumatra',
  'sumatera-utara': 'sumatra',
  'sumatera-barat': 'sumatra',
  'riau': 'sumatra',
  'kepulauan-riau': 'sumatra',
  'jambi': 'sumatra',
  'bengkulu': 'sumatra',
  'sumatera-selatan': 'sumatra',
  'kepulauan-bangka-belitung': 'sumatra',
  'lampung': 'sumatra',
  'dki-jakarta': 'jawa',
  'banten': 'jawa',
  'jawa-barat': 'jawa',
  'jawa-tengah': 'jawa',
  'di-yogyakarta': 'jawa',
  'jawa-timur': 'jawa',
  'bali': 'bali_nt',
  'nusa-tenggara-barat': 'bali_nt',
  'nusa-tenggara-timur': 'bali_nt',
  'kalimantan-barat': 'kalimantan',
  'kalimantan-tengah': 'kalimantan',
  'kalimantan-selatan': 'kalimantan',
  'kalimantan-timur': 'kalimantan',
  'kalimantan-utara': 'kalimantan',
  'sulawesi-utara': 'sulawesi',
  'gorontalo': 'sulawesi',
  'sulawesi-tengah': 'sulawesi',
  'sulawesi-barat': 'sulawesi',
  'sulawesi-selatan': 'sulawesi',
  'sulawesi-tenggara': 'sulawesi',
  'maluku-utara': 'maluku_papua',
  'maluku': 'maluku_papua',
  'papua-barat': 'maluku_papua',
  'papua-barat-daya': 'maluku_papua',
  'papua-tengah': 'maluku_papua',
  'papua-selatan': 'maluku_papua',
  'papua-pegunungan': 'maluku_papua',
  'papua': 'maluku_papua',
};

export default function MapPage() {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState('all');


  const [selectedProvince, setSelectedProvince] = useState(null);
  const [hoveredProvinceId, setHoveredProvinceId] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Hover debounce handlers
  const hoverTimeout = useRef(null);
  const handleHoverEnter = useCallback((id) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoveredProvinceId(id), 80);
  }, []);
  const handleHoverLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHoveredProvinceId(null);
  }, []);

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

  // Compute aggregate stats
  const totalOrganizations = useMemo(() => 
    provinces.reduce((sum, p) => sum + (p.organizations_count || 0), 0), [provinces]
  );

  const totalDaerahs = useMemo(() => 
    provinces.reduce((sum, p) => sum + (p.daerahs_count || 0), 0), [provinces]
  );

  // Filter provinces by search + region
  const filteredProvinces = useMemo(() => {
    return provinces.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || PROVINCE_REGION_MAP[p.slug] === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [provinces, searchQuery, selectedRegion]);

  // Active region label
  const activeRegionLabel = REGION_GROUPS.find(r => r.id === selectedRegion)?.label || 'Semua Wilayah';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white text-baznas-ink font-sans flex flex-col lg:flex-row relative">

      {/* Ambient decorative backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-baznas-green/[0.03] blur-[150px]" />
        <div className="absolute -bottom-48 -left-48 w-[400px] h-[400px] rounded-full bg-baznas-yellow/[0.03] blur-[120px]" />
      </div>

      {/* ============ LEFT: MAP SECTION ============ */}
      <section className="relative w-full lg:w-3/5 h-[45vh] sm:h-[50vh] lg:h-screen flex flex-col bg-gradient-to-br from-white via-slate-50/30 to-white border-r border-slate-200/60 z-10">

        {/* Map Header */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 z-20 flex items-start justify-between gap-3">
          <div className="flex gap-3 items-center p-2.5 sm:p-3 pr-4 sm:pr-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-premium">
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all duration-300 border border-slate-200/60 shadow-sm active:scale-95 cursor-pointer group"
              title="Kembali ke Beranda"
            >
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="text-baznas-ink">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight">Peta Nasional</h2>
              <p className="text-[7px] sm:text-[8px] tracking-[0.2em] text-baznas-green uppercase font-black opacity-90 mt-0.5">
                Eksplorasi Wilayah BAZNAS
              </p>
            </div>
          </div>

          {/* Stats badge - mobile friendly */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-premium">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-baznas-green/5">
              <MapPin size={10} className="text-baznas-green" />
              <span className="text-[9px] font-black text-baznas-green tabular-nums">{provinces.length}</span>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Provinsi</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="w-full h-full max-w-[1000px] max-h-full flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3 text-slate-300">
                <RefreshCw size={28} className="animate-spin text-baznas-green/40" />
                <span className="text-[9px] uppercase tracking-widest font-black">Memuat Peta...</span>
              </div>
            ) : (
              <InteractiveMap
                activeSlug={provinces.find(p => p.id === hoveredProvinceId)?.slug}
                onSelectProvince={handleViewProvinceDetails}
                provinces={provinces}
                isInteractive={true}
              />
            )}
          </div>
        </div>

        {/* Stats Summary Bar - Bottom of Map */}
        <div className="shrink-0 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-xl border-t border-slate-200/60">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-baznas-green/5">
                  <MapPin size={12} className="text-baznas-green" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-black text-baznas-ink tabular-nums">{provinces.length}</span>
                  <span className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-wider ml-1">Provinsi</span>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200/60" />
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50">
                  <Layers size={12} className="text-amber-500" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-black text-baznas-ink tabular-nums">{totalDaerahs || '—'}</span>
                  <span className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-wider ml-1">Daerah</span>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200/60" />
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50">
                  <Building2 size={12} className="text-blue-500" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-black text-baznas-ink tabular-nums">{totalOrganizations || '—'}</span>
                  <span className="text-[7px] sm:text-[8px] text-slate-400 font-black uppercase tracking-wider ml-1">Organisasi</span>
                </div>
              </div>
            </div>
            
            {/* Legend hint */}
            <div className="hidden sm:flex items-center gap-1.5 text-[7px] text-slate-400 font-black uppercase tracking-wider">
              <span className="w-3 h-1.5 rounded-sm" style={{ background: 'linear-gradient(90deg, #f0fdf4, #00A651)' }} />
              <span>Tingkat Aktivitas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RIGHT: PROVINCES LIST ============ */}
      <section className="relative w-full lg:w-2/5 h-[55vh] lg:h-screen bg-white flex flex-col border-t lg:border-t-0 border-slate-200/60 z-10">

        {/* Search & Filter Header */}
        <div className="shrink-0 bg-gradient-to-b from-white to-slate-50/30 border-b border-slate-200/60 shadow-sm z-10">
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
            {/* Title row */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base font-black text-baznas-ink uppercase tracking-wider">
                Daftar Provinsi
                {filteredProvinces.length < provinces.length && (
                  <span className="ml-1.5 text-[10px] font-mono text-baznas-green font-bold">
                    ({filteredProvinces.length})
                  </span>
                )}
              </h3>
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari provinsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white hover:bg-slate-50/50 border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-9 text-xs text-baznas-ink placeholder-slate-400 focus:outline-none focus:border-baznas-green focus:ring-4 focus:ring-baznas-green/10 transition-all duration-300 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Region Filter Chips */}
          <div className="px-4 sm:px-6 pb-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 sm:gap-2 min-w-max">
              {REGION_GROUPS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    selectedRegion === region.id
                      ? 'bg-baznas-green text-white shadow-md shadow-baznas-green/20'
                      : 'bg-slate-100/80 text-slate-500 hover:bg-slate-200/60 hover:text-slate-700 border border-slate-200/50'
                  }`}
                >
                  {selectedRegion === region.id && <span className="w-1.5 h-1.5 rounded-full bg-white/80" />}
                  {region.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 sm:p-6">
            {isLoading ? (
              // Skeleton Loading
              <div              className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={{ animationDelay: `${i * 80}ms` }}>
                    <ProvinceCardSkeleton />
                  </div>
                ))}
              </div>
            ) : filteredProvinces.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 mb-4">
                  {searchQuery ? (
                    <Search size={28} className="text-slate-300" />
                  ) : (
                    <AlertCircle size={28} className="text-slate-300" />
                  )}
                </div>
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">
                  {searchQuery ? 'Tidak Ditemukan' : 'Belum Ada Data'}
                </h4>
                <p className="text-[10px] text-slate-400 max-w-[220px] leading-relaxed">
                  {searchQuery
                    ? `Tidak ada provinsi yang cocok dengan "${searchQuery}"`
                    : `Belum ada data provinsi untuk wilayah ${activeRegionLabel.toLowerCase()}.`
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedRegion('all'); }}
                    className="mt-4 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            ) : (
              // Province Cards
              <>
                {/* Results info */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] text-slate-400 font-mono font-bold">
                    {filteredProvinces.length} dari {provinces.length} provinsi
                  </p>
                  <button
                    onClick={fetchProvinces}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-baznas-green hover:bg-baznas-green/5 transition-all cursor-pointer"
                    title="Muat ulang data"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  onMouseLeave={handleHoverLeave}
                >
                  {filteredProvinces.map((prov, index) => (
                    <div
                      key={prov.id}
                      onMouseEnter={() => handleHoverEnter(prov.id)}
                      className="transform transition-all duration-300"
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* Province Detail Modal */}
      <ProvinceDetailModal
        selectedProvince={selectedProvince}
        onClose={() => setSelectedProvince(null)}
      />

      {/* Loading overlay for detail fetch */}
      {isLoadingDetail && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm">
          <div className="p-6 rounded-2xl bg-white shadow-xl border border-slate-200/60 flex items-center gap-3">
            <RefreshCw size={18} className="animate-spin text-baznas-green" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">Memuat Detail...</span>
          </div>
        </div>
      )}

    </main>
  );
}
