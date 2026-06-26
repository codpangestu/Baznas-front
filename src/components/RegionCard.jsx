import React from 'react';
import { Globe, Building2 } from 'lucide-react';

export default function RegionCard({ region }) {
  return (
    <div className="group relative w-full h-48 rounded-xl overflow-hidden bg-white border border-slate-200/80 shadow-premium transition-all duration-500 hover:shadow-premium-lg hover:-translate-y-1 hover:border-baznas-green/30 cursor-pointer">
      {region.image ? (
        <img
          src={region.image}
          alt={region.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center">
          <Globe size={36} className="text-slate-300 transition-all duration-500 group-hover:rotate-12 group-hover:text-baznas-green/30" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h4 className="font-black text-base uppercase tracking-wide transition-colors duration-300 group-hover:text-baznas-yellow">
          {region.name}
        </h4>
        {region.organizations_count !== undefined && (
          <span className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[8px] font-black uppercase tracking-wider border border-white/10 transition-all duration-300 group-hover:bg-white/15">
            <Building2 size={9} className="text-baznas-yellow" />
            {region.organizations_count} Organisasi
          </span>
        )}
      </div>

      {/* Top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-baznas-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
