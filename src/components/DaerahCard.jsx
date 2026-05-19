import React from 'react';
import { Globe, Mail } from 'lucide-react';

// Standard Inline Instagram SVG component (Lucide design compatible)
const Instagram = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    width={props.size || 24} 
    height={props.size || 24} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function DaerahCard({ daerah }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between gap-4 hover:border-baznas-green/30 transition-all shadow-sm">
      <div>
        <h5 className="text-sm font-bold text-baznas-ink uppercase">{daerah.name}</h5>
        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{daerah.slug}</p>
      </div>
      {/* Embed Social links */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        {daerah.website ? (
          <a href={daerah.website} target="_blank" rel="noreferrer" title="Website" className="p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition">
            <Globe size={14} />
          </a>
        ) : (
          <span className="p-1.5 rounded-full bg-slate-50 text-slate-300" title="No Website"><Globe size={14} /></span>
        )}
        {daerah.instagram ? (
          <a href={`https://instagram.com/${daerah.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" title="Instagram" className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition">
            <Instagram size={14} />
          </a>
        ) : (
          <span className="p-1.5 rounded-full bg-slate-50 text-slate-300" title="No Instagram"><Instagram size={14} /></span>
        )}
        {daerah.email ? (
          <a href={`mailto:${daerah.email}`} title="Email" className="p-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-600 transition">
            <Mail size={14} />
          </a>
        ) : (
          <span className="p-1.5 rounded-full bg-slate-50 text-slate-300" title="No Email"><Mail size={14} /></span>
        )}
      </div>
    </div>
  );
}
