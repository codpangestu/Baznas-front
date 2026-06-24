import React from 'react';
import { Globe } from 'lucide-react';

export default function RegionCard({ region }) {
  return (
    <div className="group relative w-full h-48 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-md transition-transform hover:scale-[1.02]">
      {region.image ? (
        <img
          src={region.image}
          alt={region.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <Globe size={36} className="text-slate-300" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h4 className="font-semibold text-lg">{region.name}</h4>
        {region.organizations_count !== undefined && (
          <span className="mt-1 inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm text-xs rounded">
            {region.organizations_count} Organisasi
          </span>
        )}
      </div>
    </div>
  );
}
