import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import DaerahCard from './DaerahCard';

export default function ProvinceDetailModal({ selectedProvince, onClose }) {
  const [showAllDaerah, setShowAllDaerah] = useState(false);

  useEffect(() => {
    if (selectedProvince) {
      setShowAllDaerah(false);
    }
  }, [selectedProvince]);

  if (!selectedProvince) return null;

  const daerahs = selectedProvince.daerahs || [];
  const displayDaerahs = showAllDaerah ? daerahs : daerahs.slice(0, 4);
  const hasMoreDaerah = daerahs.length > 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-[28px] border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-premium-lg flex flex-col overflow-hidden animate-zoomIn">

        {/* Header Banner */}
        <div className="relative h-44 shrink-0 bg-baznas-green overflow-hidden flex items-end p-6">
          {selectedProvince.image && (
            <img
              src={selectedProvince.image}
              alt={selectedProvince.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-[2000ms] hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 z-10 hover:rotate-90 active:scale-95 border border-white/10 backdrop-blur-sm cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-baznas-yellow">WILAYAH PROVINSI</span>
            <h3 className="text-3xl font-black uppercase text-white mt-1 m-0 leading-tight">{selectedProvince.name}</h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">

          {/* Daerahs (Districts) Section */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-baznas-green font-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-baznas-green rounded-full animate-ping" />
              Daerah Administratif ({daerahs.length} Daerah)
            </h4>
            {daerahs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-2xl text-xs bg-white font-bold uppercase tracking-wider">
                Belum ada daerah yang terdaftar di provinsi ini.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {displayDaerahs.map((daerah) => (
                    <DaerahCard key={daerah.id} daerah={daerah} />
                  ))}
                </div>

                {hasMoreDaerah && !showAllDaerah && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setShowAllDaerah(true)}
                      className="px-6 py-2.5 rounded-full bg-white border border-baznas-green text-baznas-green hover:bg-baznas-green hover:text-white text-[10px] font-extrabold transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-lg hover:shadow-baznas-green/15 uppercase tracking-widest cursor-pointer"
                    >
                      Lihat Semua Daerah
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                )}

                {hasMoreDaerah && showAllDaerah && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setShowAllDaerah(false)}
                      className="px-6 py-2.5 rounded-full bg-white border border-slate-300 text-slate-500 hover:bg-slate-100 text-[10px] font-extrabold transition-all duration-300 flex items-center gap-2 group shadow-sm uppercase tracking-widest cursor-pointer"
                    >
                      Sembunyikan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Organizations Section */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-baznas-green font-black mb-4">
              Organisasi Aktif ({selectedProvince.organizations?.length || 0})
            </h4>
            {(!selectedProvince.organizations || selectedProvince.organizations.length === 0) ? (
              <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-2xl text-xs bg-white font-bold uppercase tracking-wider">
                Belum ada organisasi aktif di provinsi ini.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedProvince.organizations.map((org) => (
                  <div key={org.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-baznas-green/30 hover:shadow-premium transition-all duration-300 flex items-center justify-between shadow-sm">
                    <div>
                      <h5 className="text-xs font-black text-baznas-ink uppercase tracking-wide">{org.name}</h5>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono mt-0.5 block">{org.region}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-wider uppercase ${org.status === 'active'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
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
  );
}
