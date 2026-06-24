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
    <div className="p-5 rounded-2xl border border-slate-200/80 bg-white flex flex-col justify-between gap-4 hover:border-baznas-green/40 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
      <div>
        <h5 className="text-sm font-black text-baznas-ink uppercase tracking-wide">{daerah.name}</h5>
        <p className="text-[9px] text-slate-400 font-mono mt-1 uppercase tracking-wider">{daerah.slug}</p>
      </div>
      {/* Embed Social links */}
      <div className="flex items-center gap-3.5 pt-3 border-t border-slate-100">
        {daerah.website ? (
          <a href={daerah.website} target="_blank" rel="noreferrer" title="Website" className="p-2 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm">
            <Globe size={13} />
          </a>
        ) : (
          <span className="p-2 rounded-full bg-slate-50/50 text-slate-300" title="No Website"><Globe size={13} /></span>
        )}
        {daerah.instagram ? (
          <a href={`https://instagram.com/${daerah.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" title="Instagram" className="p-2 rounded-full bg-slate-50 hover:bg-pink-50 text-slate-600 hover:text-pink-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm">
            <Instagram size={13} />
          </a>
        ) : (
          <span className="p-2 rounded-full bg-slate-50/50 text-slate-300" title="No Instagram"><Instagram size={13} /></span>
        )}
        {daerah.email ? (
          <a href={`mailto:${daerah.email}`} title="Email" className="p-2 rounded-full bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm">
            <Mail size={13} />
          </a>
        ) : (
          <span className="p-2 rounded-full bg-slate-50/50 text-slate-300" title="No Email"><Mail size={13} /></span>
        )}
      </div>
    </div>
  );
}
