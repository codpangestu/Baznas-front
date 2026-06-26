import React from 'react';

export default function DaerahCardSkeleton() {
  return (
    <div
      className="relative p-5 rounded-2xl border border-slate-200/60 bg-white flex flex-col justify-between gap-4 animate-fadeIn"
    >
      {/* Top section: name + dot */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2.5">
          {/* Name + dot row */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 rounded-full bg-slate-100 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-100 animate-pulse" />
          </div>
          {/* Slug line */}
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-24 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Social links area */}
      <div className="pt-3.5 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* 3 social icon placeholders */}
          <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />

          {/* Badge auf der rechten Seite */}
          <div className="ml-auto">
            <div className="h-5 w-24 rounded-full bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
