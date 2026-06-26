import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import api from '../services/api';
import ProvinceMap from '../components/ProvinceMap';
import DaerahCard from '../components/DaerahCard';
import DaerahCardSkeleton from '../components/DaerahCardSkeleton';

export default function ProvinceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [province, setProvince] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvinceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/provinces/${slug}`);
        if (res.data.success) {
          setProvince(res.data.data);
        } else {
          setError("Gagal memuat data provinsi.");
        }
      } catch (err) {
        console.error("Failed to load details", err);
        setError("Gagal menghubungi server. Pastikan server backend Anda berjalan.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProvinceDetails();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-baznas-gray relative overflow-hidden text-baznas-ink font-sans">
        <div className="relative p-3 lg:p-5">
          <div className="relative min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-40px)] rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-2xl overflow-hidden shadow-premium flex flex-col p-6 lg:p-8 space-y-8 animate-fadeIn">

            {/* Header Skeleton */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-2.5 w-32 rounded-full bg-slate-100 animate-pulse" />
                  <div className="h-4 w-48 rounded-full bg-slate-100 animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-32 rounded-full bg-slate-100 animate-pulse hidden sm:block" />
            </div>

            {/* Map Skeleton */}
            <div className="w-full h-[40vh] md:h-[50vh] rounded-3xl bg-slate-100 animate-pulse" />

            {/* Stats Bar Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-12 rounded bg-slate-100 animate-pulse" />
                  <div className="h-2.5 w-28 rounded-full bg-slate-100 animate-pulse" />
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-12 rounded bg-slate-100 animate-pulse" />
                  <div className="h-2.5 w-28 rounded-full bg-slate-100 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Daerahs */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-100 animate-pulse" />
                  <div className="h-3 w-36 rounded-full bg-slate-100 animate-pulse" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <DaerahCardSkeleton key={i} />
                  ))}
                </div>
              </div>

              {/* Organizations */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-100 animate-pulse" />
                  <div className="h-3 w-36 rounded-full bg-slate-100 animate-pulse" />
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
                        <div className="h-2.5 w-20 rounded-full bg-slate-100 animate-pulse" />
                      </div>
                      <div className="h-5 w-14 rounded-full bg-slate-100 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    );
  }

  if (error || !province) {
    return (
      <main className="min-h-screen bg-baznas-gray flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md">
          <HelpCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-black uppercase text-baznas-ink mb-2">Error Terjadi</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error || "Provinsi tidak ditemukan."}</p>
          <button
            onClick={() => navigate('/explore')}
            className="w-full py-3 rounded-full bg-baznas-green hover:bg-baznas-dark text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={16} /> Kembali ke Peta
          </button>
        </div>
      </main>
    );
  }

  const daerahs = province.daerahs || [];
  const organizations = province.organizations || [];

  return (
    <main className="min-h-screen bg-baznas-gray relative overflow-hidden text-baznas-ink font-sans">

      {/* Ambient decorative glowing spots */}
      <div className="absolute -bottom-48 -right-48 w-[400px] h-[400px] rounded-full bg-baznas-green/5 blur-[120px] pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-[400px] h-[400px] rounded-full bg-baznas-yellow/5 blur-[120px] pointer-events-none" />

      <div className="relative p-3 lg:p-5">

        {/* Main Glassmorphic Wrapper */}
        <div className="relative min-h-[calc(100vh-24px)] lg:min-h-[calc(100vh-40px)] rounded-[32px] border border-slate-200/80 bg-white/90 backdrop-blur-2xl overflow-hidden shadow-premium flex flex-col p-6 lg:p-8 space-y-8 animate-fadeIn">

          {/* Header Action Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/explore')}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200/60 active:scale-95 cursor-pointer"
                title="Kembali ke Peta Eksplorasi"
              >
                <ChevronLeft size={16} />
              </button>
              <div>
                <span className="text-[9px] tracking-[0.25em] text-baznas-green uppercase font-black">DETAIL WILAYAH PROVINSI</span>
                <h1 className="text-xl lg:text-2xl font-black uppercase text-baznas-ink leading-tight mt-1">{province.name}</h1>
              </div>
            </div>

            {/* Micro badge indicator */}
            <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-baznas-green/10 text-baznas-green text-[9px] font-black uppercase tracking-wider items-center gap-1.5 border border-baznas-green/20">
              <span className="w-1.5 h-1.5 rounded-full bg-baznas-green animate-pulse"></span>
              SINKRONISASI AKTIF
            </span>
          </div>

          {/* Interactive Map Header */}
          <section className="w-full">
            <ProvinceMap slug={province.slug} name={province.name} daerahs={daerahs} />
          </section>

          {/* Stats Bar */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-4 shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
              <div className="p-3 rounded-xl bg-baznas-green/10 text-baznas-green">
                <Layers size={20} />
              </div>
              <div>
                <h4 className="text-xl font-black text-baznas-ink leading-tight">{daerahs.length}</h4>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Daerah Administratif</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-4 shadow-sm hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
              <div className="p-3 rounded-xl bg-baznas-yellow/10 text-baznas-yellow">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xl font-black text-baznas-ink leading-tight">{organizations.length}</h4>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mt-0.5">Organisasi Aktif</p>
              </div>
            </div>
          </section>

          {/* Grid Content */}
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Daerahs Grid (2 Cols span) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-baznas-green" />
                <h3 className="text-sm font-black uppercase text-baznas-ink tracking-wider">Daftar Daerah ({daerahs.length})</h3>
              </div>

              {daerahs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  Belum ada BAZNAS Daerah yang terdaftar untuk provinsi ini.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {daerahs.map((daerah) => (
                    <div key={daerah.id} className="transform transition-transform duration-200">
                      <DaerahCard
                        daerah={daerah}
                        onClick={() => navigate(`/daerah/${daerah.slug}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Active Organizations */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-baznas-yellow" />
                <h3 className="text-sm font-black uppercase text-baznas-ink tracking-wider">Organisasi Aktif ({organizations.length})</h3>
              </div>

              {organizations.length === 0 ? (
                <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  Belum ada organisasi yang aktif untuk provinsi ini.
                </div>
              ) : (
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <div
                      key={org.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-baznas-green/30 hover:shadow-premium transition-all duration-300 shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <h5 className="text-xs font-black text-baznas-ink uppercase tracking-wide">{org.name}</h5>
                        <p className="text-[9px] text-slate-400 mt-1 font-mono uppercase tracking-wider">{org.region || "Wilayah"}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${org.status === 'active'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                        {org.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
