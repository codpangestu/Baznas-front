import React from 'react';

export default function ProvinceCardSkeleton({ className = "w-full" }) {
  return (
    <div
      className={`
        relative h-[220px] sm:h-[260px] md:h-[280px] rounded-[20px] overflow-hidden
        border border-slate-200/60 bg-white shadow-premium
        ${className}
      `}
    >
      {/* Image area skeleton */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-slate-50">
        <div className="w-full h-full animate-shimmer" />
      </div>

      {/* Gradient overlay placeholder */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/30 to-transparent" />

      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
        {/* Slug line */}
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-20 rounded-full bg-white/20 animate-pulse" />
        </div>

        {/* Province name */}
        <div className="mt-3 space-y-2">
          <div className="h-4 w-32 rounded-full bg-white/20 animate-pulse" />
          <div className="h-4 w-24 rounded-full bg-white/15 animate-pulse" />
        </div>

        {/* Badge */}
        <div className="mt-3">
          <div className="h-5 w-28 rounded-full bg-white/15 animate-pulse" />
        </div>

        {/* Action link */}
        <div className="mt-4">
          <div className="h-2.5 w-36 rounded-full bg-white/15 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
