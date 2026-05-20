import React from 'react';
import { X } from 'lucide-react';
import DaerahCard from './DaerahCard';

export default function ProvinceDetailModal({ selectedProvince, onClose }) {
  if (!selectedProvince) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-[24px] border border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden animate-zoomIn">

        {/* Header Banner */}
        <div className="relative h-44 shrink-0 bg-baznas-green overflow-hidden flex items-end p-6">
          {selectedProvince.image && (
            <img
              src={selectedProvince.image}
              alt={selectedProvince.name}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition z-10"
          >
            <X size={20} />
          </button>

          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-baznas-yellow">WILAYAH PROVINSI</span>
            <h3 className="text-3xl font-black uppercase text-white mt-1 m-0">{selectedProvince.name}</h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">

          {/* Daerahs (Districts) Section */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-baznas-green font-black mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-baznas-green rounded-full animate-ping" />
              Daerah Administratif ({selectedProvince.daerahs?.length || 0} Daerah)
            </h4>
            {(!selectedProvince.daerahs || selectedProvince.daerahs.length === 0) ? (
              <div className="text-center py-6 text-slate-400 border border-dashed border-slate-300 rounded-xl text-xs bg-white">
                Belum ada daerah yang terdaftar di provinsi ini.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedProvince.daerahs.map((daerah) => (
                  <DaerahCard key={daerah.id} daerah={daerah} />
                ))}
              </div>
            )}
          </div>

          {/* Organizations Section */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-baznas-green font-black mb-4">
              Organisasi Aktif ({selectedProvince.organizations?.length || 0})
            </h4>
            {(!selectedProvince.organizations || selectedProvince.organizations.length === 0) ? (
              <div className="text-center py-6 text-slate-400 border border-dashed border-slate-300 rounded-xl text-xs bg-white">
                Belum ada organisasi aktif di provinsi ini.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedProvince.organizations.map((org) => (
                  <div key={org.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-baznas-ink">{org.name}</h5>
                      <span className="text-[9px] uppercase tracking-wider text-slate-500">{org.region}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${org.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
