import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';

export default function ProvinceCard({ province, id, activeCard, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative w-[280px] lg:w-[300px] xl:w-[320px] h-[300px] lg:h-[320px] rounded-[24px] overflow-hidden snap-center shrink-0 cursor-pointer transition-all duration-500 border bg-white
        ${id === activeCard
          ? 'border-baznas-green shadow-[0_20px_50px_rgba(0,166,81,0.2)] scale-[1.02]'
          : 'border-slate-200/80 shadow-premium hover:shadow-premium-lg hover:border-baznas-green/40 hover:-translate-y-1'}
      `}
    >
      {province.image ? (
        <img src={province.image} alt={province.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center">
          <Globe size={40} className="text-slate-300 transition-transform duration-700 group-hover:rotate-12" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
        <p className={`text-[8px] uppercase tracking-[0.25em] font-black ${id === activeCard ? 'text-baznas-yellow' : 'text-slate-300'}`}>
          {province.slug}
        </p>
        <h4 className="mt-1.5 text-xl lg:text-2xl font-black uppercase leading-tight tracking-wide">{province.name}</h4>
        <div className="mt-3.5 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[8px] font-black uppercase tracking-wider border border-white/10">
            {province.organizations_count || 0} Organisasi
          </span>
        </div>
        <Link
          to={`/province/${province.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-4.5 flex items-center gap-2 text-[9px] text-white/80 group-hover:text-baznas-yellow transition-all duration-300 uppercase tracking-widest font-black"
        >
          Jelajahi Wilayah <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
