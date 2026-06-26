import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Building2 } from 'lucide-react';

export default function ProvinceCard({ province, id, activeCard, onClick, className = "w-full" }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const timerRef = useRef(null);

  // Staggered entry animation using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger delay based on card id/index
          const delay = ((id || 1) - 1) * 80;
          timerRef.current = setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id]);

  const isActive = id === activeCard;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`
        group relative h-[220px] sm:h-[260px] md:h-[280px] rounded-[20px] overflow-hidden cursor-pointer
        transition-all duration-700 ease-out
        border bg-white
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${isActive
          ? 'border-baznas-green shadow-[0_15px_40px_rgba(0,166,81,0.2)] scale-[1.02]'
          : 'border-slate-200/80 shadow-premium hover:shadow-premium-lg hover:border-baznas-green/40 hover:-translate-y-1.5 hover:scale-[1.01]'}
        ${className}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail ${province.name}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      {/* Image or Placeholder */}
      {province.image ? (
        <img
          src={province.image}
          alt={province.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center">
          <Globe size={40} className="text-slate-300 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 group-hover:text-baznas-green/30" />
        </div>
      )}

      {/* Background overlay - gradient base */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

      {/* Glassmorphism bottom panel on hover */}
      {isActive && (
        <div className="absolute inset-0 bg-baznas-green/5 pointer-events-none transition-opacity duration-500" />
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 text-white">
        {/* Slug badge */}
        <div className="flex items-center justify-between">
          <p className={`
            text-[8px] uppercase tracking-[0.25em] font-black
            transition-colors duration-300
            ${isActive ? 'text-baznas-yellow' : 'text-slate-300 group-hover:text-baznas-yellow'}
          `}>
            {province.slug}
          </p>

          {/* Active indicator dot */}
          {isActive && (
            <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider text-baznas-yellow/80">
              <span className="w-1.5 h-1.5 rounded-full bg-baznas-yellow animate-ping" />
              DIPILIH
            </span>
          )}
        </div>

        {/* Province name */}
        <h4 className="mt-1 text-base sm:text-lg lg:text-xl font-black uppercase leading-tight tracking-wide drop-shadow-sm">
          {province.name}
        </h4>

        {/* Stats badges */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[8px] font-black uppercase tracking-wider border border-white/10 transition-all duration-300 group-hover:bg-white/15">
            <Building2 size={10} className="text-baznas-yellow" />
            {province.organizations_count || 0} Organisasi
          </span>
        </div>

        {/* Action link */}
        <Link
          to={`/province/${province.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-flex items-center gap-2 text-[9px] text-white/80 hover:text-baznas-yellow transition-all duration-300 uppercase tracking-widest font-black group/link"
        >
          <span className="relative">
            Jelajahi Wilayah
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-baznas-yellow transition-all duration-300 group-hover/link:w-full" />
          </span>
          <ArrowRight size={10} className="group-hover/link:translate-x-1.5 transition-transform duration-300" />
        </Link>
      </div>

      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-[20px] p-[1px] bg-gradient-to-b from-baznas-green/40 via-transparent to-transparent" />
      </div>
    </div>
  );
}
