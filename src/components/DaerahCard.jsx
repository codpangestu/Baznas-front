import React, { useState } from 'react';
import { Globe, Mail, MapPin } from 'lucide-react';

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

export default function DaerahCard({ daerah, onClick }) {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const socialLinks = [
    {
      key: 'website',
      url: daerah.website,
      icon: Globe,
      label: 'Website',
      activeClass: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200',
      disabledClass: 'bg-slate-50/50 text-slate-300 border-slate-100'
    },
    {
      key: 'instagram',
      url: daerah.instagram ? `https://instagram.com/${daerah.instagram.replace('@', '')}` : null,
      icon: Instagram,
      label: 'Instagram',
      activeClass: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200',
      disabledClass: 'bg-slate-50/50 text-slate-300 border-slate-100'
    },
    {
      key: 'email',
      url: daerah.email ? `mailto:${daerah.email}` : null,
      icon: Mail,
      label: 'Email',
      activeClass: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200',
      disabledClass: 'bg-slate-50/50 text-slate-300 border-slate-100'
    }
  ];

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); } : undefined}
      className={`group relative p-5 rounded-2xl border border-slate-200/80 bg-white flex flex-col justify-between gap-4
        transition-all duration-300
        ${onClick
          ? 'hover:border-baznas-green/40 hover:shadow-premium-lg hover:-translate-y-1 cursor-pointer'
          : 'cursor-default hover:border-baznas-green/40 hover:shadow-premium-lg hover:-translate-y-1'
        }`}
    >
      {/* Status indicator bar */}
      <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full opacity-0 group-hover:opacity-100 group-hover:via-baznas-green/40 transition-all duration-500" />

      {/* Top section: name + status dot */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="text-sm font-black text-baznas-ink uppercase tracking-wide truncate">{daerah.name}</h5>
            <span className="w-1.5 h-1.5 rounded-full bg-baznas-green flex-shrink-0" title="Aktif" />
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono uppercase tracking-wider">
            <MapPin size={10} className="flex-shrink-0" />
            <span>{daerah.slug}</span>
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="flex items-center gap-2 pt-3.5 border-t border-slate-100">
        {socialLinks.map(({ key, url, icon: Icon, label, activeClass, disabledClass }) => (
          url ? (
            <a
              key={key}
              href={url}
              target={key === 'email' ? undefined : '_blank'}
              rel={key === 'email' ? undefined : 'noreferrer'}
              title={label}
              className={`relative p-2 rounded-full bg-slate-50 border border-slate-100/60 text-slate-500
                ${activeClass}
                hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm
                ${hoveredSocial === key ? 'scale-110' : ''}`}
              onMouseEnter={() => setHoveredSocial(key)}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <Icon size={13} />
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[8px] font-bold uppercase tracking-wider whitespace-nowrap transition-opacity duration-200 pointer-events-none"
                style={{ opacity: hoveredSocial === key ? 1 : 0 }}>
                {label}
              </span>
            </a>
          ) : (
            <span
              key={key}
              className={`p-2 rounded-full ${disabledClass} border cursor-not-allowed`}
              title={`Tidak ada ${label}`}
            >
              <Icon size={13} />
            </span>
          )
        ))}

        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-[7px] font-black uppercase tracking-wider text-slate-400
            group-hover:bg-baznas-green/5 group-hover:text-baznas-green group-hover:border-baznas-green/20 transition-all duration-300">
            <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-baznas-green transition-colors duration-300" />
            BAZNAS Daerah
          </span>
        </div>
      </div>

      {/* Hover gradient accent */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-baznas-green/[0.02] to-transparent" />
      </div>
    </div>
  );
}
