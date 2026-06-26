import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Globe, Mail, MapPin, Building2, 
  HelpCircle, ArrowRight, ExternalLink, ChevronRight
} from 'lucide-react';
import api from '../services/api';
import ProvinceMap from '../components/ProvinceMap';

// Inline Instagram SVG icon
const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24}
    stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
    className={props.className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function DaerahDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [daerah, setDaerah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDaerahDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/daerahs/${slug}`);
        if (res.data.success) {
          setDaerah(res.data.data);
        } else {
          setError("Gagal memuat data daerah.");
        }
      } catch (err) {
        console.error("Failed to load daerah details", err);
        setError("Gagal menghubungi server. Pastikan server backend Anda berjalan.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDaerahDetails();
  }, [slug]);

  // —— Loading Skeleton ——
  if (loading) {
    return (
      <div className="min-h-screen bg-baznas-gray">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
            <div className="space-y-2">
              <div className="h-2.5 w-28 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-4 w-44 rounded-full bg-slate-100 animate-pulse" />
            </div>
          </div>
          {/* Hero skeleton */}
          <div className="h-48 sm:h-56 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse mb-6" />
          {/* Stats row skeleton */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
          {/* Content grid skeleton */}
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            </div>
            <div className="lg:col-span-3 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-xl bg-white border border-slate-200 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // —— Error State ——
  if (error || !daerah) {
    return (
      <div className="min-h-screen bg-baznas-gray flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={28} className="text-red-500" />
          </div>
          <h3 className="text-lg font-black uppercase text-slate-800 mb-2">Data Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error || "Daerah tidak ditemukan."}</p>
          <button onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-baznas-green to-baznas-dark hover:shadow-lg hover:shadow-baznas-green/20 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer">
            <ChevronLeft size={15} className="inline mr-1.5" /> Kembali
          </button>
        </div>
      </div>
    );
  }

  const province = daerah.province;
  const organizations = daerah.organizations || [];

  // Contact items for the info card
  const contactItems = [
    { key: 'website', url: daerah.website, icon: Globe, label: 'Website', value: daerah.website || '—', color: 'text-blue-600', bg: 'bg-blue-50' },
    { key: 'instagram', url: daerah.instagram ? `https://instagram.com/${daerah.instagram.replace('@', '')}` : null, icon: InstagramIcon, label: 'Instagram', value: daerah.instagram ? `@${daerah.instagram.replace('@', '')}` : '—', color: 'text-pink-600', bg: 'bg-pink-50' },
    { key: 'email', url: daerah.email ? `mailto:${daerah.email}` : null, icon: Mail, label: 'Email', value: daerah.email || '—', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Generate initials for avatar
  const initials = daerah.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-baznas-gray">
      {/* Subtle decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-baznas-green/5 blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-baznas-yellow/5 blur-[100px]" />
      </div>

      {/* ===== TOP NAV ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Back + Breadcrumb */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl bg-white hover:bg-baznas-green/5 text-slate-600 flex items-center justify-center transition-all duration-300 shadow-sm border border-slate-200/60 active:scale-95 cursor-pointer group">
              <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-wider">
              <Link to="/explore" className="hover:text-baznas-green transition-colors">Peta</Link>
              {province && (
                <>
                  <ChevronRight size={10} className="text-slate-300" />
                  <Link to={`/province/${province.slug}`} className="hover:text-baznas-green transition-colors">{province.name}</Link>
                </>
              )}
              <ChevronRight size={10} className="text-slate-300" />
              <span className="text-baznas-green">{daerah.name}</span>
            </div>
          </div>

          {/* Parent province quick link */}
          {province && (
            <Link to={`/province/${province.slug}`}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/60 hover:border-baznas-green/30 text-slate-600 hover:text-baznas-green text-[9px] font-black uppercase tracking-wider transition-all duration-300 shadow-sm group">
              <MapPin size={11} />
              {province.name}
              <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* ===== HERO PROFILE BANNER ===== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-baznas-green via-baznas-dark to-baznas-green shadow-xl shadow-baznas-green/20 mb-6">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white" />
          </div>

          <div className="relative px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg shrink-0">
              {daerah.image ? (
                <img src={daerah.image} alt={daerah.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span className="text-2xl sm:text-3xl font-black text-white">{initials}</span>
              )}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-[8px] font-black uppercase tracking-widest text-white/80 border border-white/10">
                  BAZNAS DAERAH
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-[8px] font-mono uppercase tracking-wider text-white/80 border border-white/10">
                  {daerah.slug}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                {daerah.name}
              </h1>
              {province && (
                <p className="text-white/70 text-xs sm:text-sm mt-1.5 flex items-center gap-1.5">
                  <MapPin size={12} />
                  Bagian dari wilayah <span className="font-bold">{province.name}</span>
                </p>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="text-center px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="block text-xl sm:text-2xl font-black text-white">{organizations.length}</span>
                <span className="text-[7px] uppercase tracking-widest text-white/60 font-black">Org</span>
              </div>
              <div className="text-center px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="block text-xl sm:text-2xl font-black text-white">1</span>
                <span className="text-[7px] uppercase tracking-widest text-white/60 font-black">Wilayah</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT GRID ===== */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* === LEFT (2 cols): ORGANIZATIONS + MAP === */}
          <div className="lg:col-span-2 space-y-5">

            {/* Organizations — compact sidebar style */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-baznas-green" />
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700">Organisasi</h3>
                </div>
                <span className="text-[9px] font-black text-baznas-green tabular-nums">{organizations.length}</span>
              </div>

              {organizations.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="p-3 rounded-xl bg-baznas-green/5 border border-baznas-green/10 mb-3">
                    <Building2 size={22} className="text-baznas-green/30" />
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-[180px] leading-relaxed font-medium">
                    Belum ada organisasi terdaftar.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {organizations.slice(0, 5).map((org, idx) => (
                    <div key={org.id}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-baznas-green/5 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-baznas-green/5 border border-baznas-green/10 flex items-center justify-center shrink-0">
                        <Building2 size={13} className="text-baznas-green" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-wide truncate group-hover:text-baznas-green transition-colors">
                          {org.name}
                        </p>
                        <p className="text-[8px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                          {org.region || "Wilayah"}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider ${
                        org.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                        {org.status === 'active' ? 'Aktif' : '—'}
                      </span>
                    </div>
                  ))}
                  {organizations.length > 5 && (
                    <div className="px-5 py-3 text-center">
                      <span className="text-[8px] text-baznas-green font-black uppercase tracking-widest">
                        +{organizations.length - 5} organisasi lainnya
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mini Map Card */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-baznas-green" />
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700">Lokasi Wilayah</h3>
                </div>
                {province && (
                  <Link to={`/province/${province.slug}`}
                    className="text-[8px] font-black uppercase tracking-widest text-baznas-green hover:text-baznas-dark transition-colors">
                    Lihat Provinsi
                  </Link>
                )}
              </div>
              <div className="p-3">
                {province ? (
                  <div className="h-52 rounded-xl overflow-hidden border border-slate-100">
                    <ProvinceMap slug={province.slug} name={daerah.name} daerahs={[daerah]} />
                  </div>
                ) : (
                  <div className="h-52 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 text-[9px] font-black uppercase tracking-widest">
                    Peta tidak tersedia
                  </div>
                )}
              </div>
            </div>

            {/* Quick Meta */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-baznas-green" />
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-700">Informasi</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-baznas-green/5 border border-baznas-green/10">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Status</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Aktif
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-baznas-green/5 border border-baznas-green/10">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Organisasi</p>
                  <p className="text-xs font-bold text-slate-700 mt-1">{organizations.length} Terdaftar</p>
                </div>
              </div>
            </div>

          </div>

          {/* === RIGHT (3 cols): KONTAK & TAUTAN — HIGHLIGHT === */}
          <div className="lg:col-span-3 space-y-5">

            {/* Hero Contacts Card — expanded & prominent */}
            <div className="bg-gradient-to-br from-white to-baznas-green/5 rounded-2xl border border-slate-200/60 shadow-md overflow-hidden">
              {/* Header with decorative accent */}
              <div className="relative px-6 py-5 bg-gradient-to-r from-baznas-green via-baznas-dark to-baznas-green">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white" />
                  <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-white" />
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/20">
                    <Globe size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase text-white tracking-wide">Kontak & Tautan Resmi</h2>
                    <p className="text-[9px] text-white/70 mt-0.5">
                      Akses langsung ke kanal informasi {daerah.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Grid — spacious, social-first */}
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  {contactItems.map(({ key, url, icon: Icon, label, value, color, bg }) => (
                    <div key={key}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 group ${
                        url
                          ? `${bg} ${color} hover:shadow-lg hover:-translate-y-0.5 border-transparent hover:border-current`
                          : 'bg-slate-50 border-slate-100/60 opacity-60'
                      }`}>
                      
                      {/* Top accent bar */}
                      <div className={`h-1.5 w-full ${url ? 'bg-current' : 'bg-slate-200'}`} />

                      <div className="p-5 flex flex-col items-center text-center gap-3">
                        {/* Icon */}
                        <div className={`p-3.5 rounded-2xl ${url ? 'bg-white shadow-sm' : 'bg-slate-100'} `}>
                          <Icon size={24} className={url ? color : 'text-slate-300'} />
                        </div>

                        {/* Label + Value */}
                        <div className="min-w-0 w-full">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                          {url ? (
                            <a href={url}
                              target={key === 'email' ? undefined : '_blank'}
                              rel={key === 'email' ? undefined : 'noreferrer'}
                              className={`text-xs sm:text-sm font-bold break-all hover:underline ${color} flex items-center justify-center gap-1`}>
                              {key === 'instagram' ? (
                                <span className="truncate">@{value.replace('@', '')}</span>
                              ) : (
                                <span className="truncate">{value}</span>
                              )}
                              <ExternalLink size={11} className="opacity-40 shrink-0" />
                            </a>
                          ) : (
                            <p className="text-xs text-slate-300 italic">Belum tersedia</p>
                          )}
                        </div>

                        {/* Action hint */}
                        {url && (
                          <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            {key === 'email' ? 'Kirim Email' : 'Buka Tautan'} →
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Daerah slug footer */}
                <div className="mt-5 pt-4 border-t border-slate-100/50 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 text-[7px] font-mono uppercase tracking-wider">
                    <MapPin size={8} />
                    {daerah.slug}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer: Province Navigation */}
            {province && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 pt-2">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                  Bagian dari <span className="text-slate-600">{province.name}</span>
                </p>
                <Link to={`/province/${province.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-baznas-green to-baznas-dark hover:shadow-lg hover:shadow-baznas-green/20 text-white text-[9px] font-black uppercase tracking-wider transition-all duration-300 group">
                  Lihat Detail Provinsi
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="mt-10 pt-6 border-t border-slate-200/40 flex items-center justify-between">
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
            BAZNAS · Sistem Informasi Wilayah
          </p>
          <span className="text-[7px] text-slate-300 font-mono">{daerah.slug}</span>
        </div>

      </div>
    </div>
  );
}
