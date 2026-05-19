import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';

export default function ProvinceCard({ province, id, activeCard, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative w-[280px] lg:w-[300px] xl:w-[320px] h-[300px] lg:h-[320px] rounded-2xl overflow-hidden snap-center shrink-0 cursor-pointer transition-all duration-500 border bg-white
        ${id === activeCard ? 'border-baznas-green shadow-[0_10px_40px_rgba(0,166,81,0.15)] scale-[1.02]' : 'border-slate-200 opacity-90 hover:opacity-100 hover:border-baznas-green/50'}
      `}
    >
      {province.image ? (
        <img src={province.image} alt={province.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
      ) : (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
           <Globe size={48} className="text-slate-300" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
        <p className={`text-[9px] uppercase tracking-[0.25em] font-black ${id === activeCard ? 'text-baznas-yellow' : 'text-slate-300'}`}>
          {province.slug}
        </p>
        <h4 className="mt-1 text-2xl font-black uppercase leading-tight tracking-wide">{province.name}</h4>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-[9px] font-bold uppercase">
            {province.organizations_count || 0} Organisasi
          </span>
        </div>
        <button className="mt-4 flex items-center gap-2 text-xs text-white/70 group-hover:text-baznas-yellow transition uppercase tracking-widest font-bold">
          Jelajahi Wilayah <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
