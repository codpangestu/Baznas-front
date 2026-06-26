import React, { useEffect, useState, useRef, useMemo } from 'react';

// Maps public/indonesia.svg path IDs to database slugs
export const MAP_ID_TO_SLUG = {
  'ID-AC': 'aceh',
  'ID-BA': 'bali',
  'ID-BB': 'kepulauan-bangka-belitung',
  'ID-BE': 'bengkulu',
  'ID-BT': 'banten',
  'ID-GO': 'gorontalo',
  'ID-JA': 'jambi',
  'ID-JB': 'jawa-barat',
  'ID-JI': 'jawa-timur',
  'ID-JK': 'dki-jakarta',
  'ID-JT': 'jawa-tengah',
  'ID-KB': 'kalimantan-barat',
  'ID-KI': 'kalimantan-timur',
  'ID-KR': 'kepulauan-riau',
  'ID-KS': 'kalimantan-selatan',
  'ID-KT': 'kalimantan-tengah',
  'ID-KU': 'kalimantan-utara',
  'ID-LA': 'lampung',
  'ID-MA': 'maluku',
  'ID-MU': 'maluku-utara',
  'ID-NB': 'nusa-tenggara-barat',
  'ID-NT': 'nusa-tenggara-timur',
  'ID-PA': 'papua',
  'ID-PB': 'papua-barat',
  'ID-RI': 'riau',
  'ID-SA': 'sulawesi-utara',
  'ID-SB': 'sumatera-barat',
  'ID-SG': 'sulawesi-tenggara',
  'ID-SN': 'sulawesi-selatan',
  'ID-SR': 'sulawesi-barat',
  'ID-SS': 'sumatera-selatan',
  'ID-ST': 'sulawesi-tengah',
  'ID-SU': 'sumatera-utara',
  'ID-YO': 'di-yogyakarta'
};

// Reverse lookup for highlighting
export const SLUG_TO_MAP_ID = {
  'aceh': 'ID-AC',
  'bali': 'ID-BA',
  'kepulauan-bangka-belitung': 'ID-BB',
  'bengkulu': 'ID-BE',
  'banten': 'ID-BT',
  'gorontalo': 'ID-GO',
  'jambi': 'ID-JA',
  'jawa-barat': 'ID-JB',
  'jawa-timur': 'ID-JI',
  'dki-jakarta': 'ID-JK',
  'jawa-tengah': 'ID-JT',
  'kalimantan-barat': 'ID-KB',
  'kalimantan-timur': 'ID-KI',
  'kepulauan-riau': 'ID-KR',
  'kalimantan-selatan': 'ID-KS',
  'kalimantan-tengah': 'ID-KT',
  'kalimantan-utara': 'ID-KU',
  'lampung': 'ID-LA',
  'maluku': 'ID-MA',
  'maluku-utara': 'ID-MU',
  'nusa-tenggara-barat': 'ID-NB',
  'nusa-tenggara-timur': 'ID-NT',
  'papua': 'ID-PA',
  'papua-tengah': 'ID-PA',
  'papua-selatan': 'ID-PA',
  'papua-pegunungan': 'ID-PA',
  'papua-barat': 'ID-PB',
  'papua-barat-daya': 'ID-PB',
  'riau': 'ID-RI',
  'sulawesi-utara': 'ID-SA',
  'sumatera-barat': 'ID-SB',
  'sulawesi-tenggara': 'ID-SG',
  'sulawesi-selatan': 'ID-SN',
  'sulawesi-barat': 'ID-SR',
  'sumatera-selatan': 'ID-SS',
  'sulawesi-tengah': 'ID-ST',
  'sumatera-utara': 'ID-SU',
  'di-yogyakarta': 'ID-YO'
};

// Color interpolation: from white to baznas-green (#00A651)
const getChoroplethColor = (value, max) => {
  if (max === 0) return '#f0fdf4';
  const intensity = Math.min(value / max, 1);
  const r = Math.round(240 - (240 - 0) * intensity);
  const g = Math.round(253 - (253 - 166) * intensity);
  const b = Math.round(244 - (244 - 81) * intensity);
  return `rgb(${r}, ${g}, ${b})`;
};

export default function InteractiveMap({ activeSlug, onSelectProvince, provinces = [], isInteractive = true }) {
  const [svgContent, setSvgContent] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, name: '', info: '', stats: '', x: 0, y: 0 });
  const [hoveredPathId, setHoveredPathId] = useState(null);
  const containerRef = useRef(null);

  // Compute max organizations_count for choropleth
  const maxOrgCount = useMemo(() => {
    if (!provinces.length) return 0;
    return Math.max(...provinces.map(p => p.organizations_count || 0), 1);
  }, [provinces]);

  useEffect(() => {
    let active = true;
    fetch('/indonesia.svg')
      .then(res => res.text())
      .then(text => {
        if (!active) return;
        const svgStart = text.indexOf('<svg');
        if (svgStart !== -1) {
          setSvgContent(text.substring(svgStart));
        } else {
          setSvgContent(text);
        }
      })
      .catch(err => console.error('Failed to load map SVG', err));
    return () => {
      active = false;
    };
  }, []);

  // Effect 1: Initial configuration of SVG paths
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    if (!svgElement.getAttribute('viewBox')) {
      const origWidth = svgElement.getAttribute('width') || '792.54596';
      const origHeight = svgElement.getAttribute('height') || '316.66394';
      svgElement.setAttribute('viewBox', `0 0 ${origWidth} ${origHeight}`);
    }
    svgElement.setAttribute('width', '100%');
    svgElement.setAttribute('height', '100%');
    svgElement.setAttribute('class', 'w-full h-full object-contain pointer-events-auto');

    const paths = svgElement.querySelectorAll('path');

    paths.forEach(path => {
      const id = path.getAttribute('id');
      const title = path.getAttribute('title');

      // Style foreign territories
      if (!id || (!id.startsWith('ID-') && id !== 'ID-JK')) {
        path.style.fill = isInteractive ? '#090d16' : '#ffffff';
        path.style.opacity = isInteractive ? '0.3' : '0.05';
        path.style.stroke = isInteractive ? '#1e293b' : 'transparent';
        path.style.pointerEvents = 'none';
        return;
      }

      const slug = MAP_ID_TO_SLUG[id];
      const provinceData = provinces.find(p => p.slug === slug);
      const orgCount = provinceData?.organizations_count || 0;

      // Apply choropleth color based on organizations_count
      path.dataset.orgCount = orgCount;
      path.dataset.slug = slug || '';
      path.style.cursor = isInteractive ? 'pointer' : 'default';
      path.style.pointerEvents = isInteractive ? 'auto' : 'none';
      path.style.transition = 'fill 0.4s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease, opacity 0.3s ease';

      if (isInteractive) {
        path.style.fill = orgCount > 0 ? getChoroplethColor(orgCount, maxOrgCount) : '#f8fafc';
        path.style.stroke = '#e2e8f0';
        path.style.strokeWidth = '0.7px';

        // Click action
        path.onclick = (e) => {
          e.preventDefault();
          if (slug && onSelectProvince) {
            onSelectProvince(slug);
          }
        };

        // Hover actions
        path.onmouseenter = (e) => {
          setHoveredPathId(id);
          const name = provinceData ? provinceData.name : title;
          const count = orgCount;
          const stats = provinceData ? `${count} Organisasi` : '—';

          const containerRect = containerRef.current.getBoundingClientRect();
          setTooltip({
            show: true,
            name,
            info: `${count} Organisasi`,
            stats,
            x: e.clientX - containerRect.left,
            y: e.clientY - containerRect.top - 20
          });
        };

        path.onmousemove = (e) => {
          const containerRect = containerRef.current.getBoundingClientRect();
          setTooltip(prev => ({
            ...prev,
            x: e.clientX - containerRect.left,
            y: e.clientY - containerRect.top - 20
          }));
        };

        path.onmouseleave = () => {
          setHoveredPathId(null);
          setTooltip(prev => ({ ...prev, show: false }));
        };
      } else {
        path.style.fill = '#cbd5e1';
        path.style.stroke = '#94a3b8';
        path.style.strokeWidth = '0.5px';
        path.style.opacity = '0.3';
        path.onclick = null;
        path.onmouseenter = null;
        path.onmousemove = null;
        path.onmouseleave = null;
      }
    });
  }, [svgContent, provinces, isInteractive, maxOrgCount]);

  // Effect 2: Update active province highlights
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Remove active class from any path currently active
    const currentlyActive = svgElement.querySelectorAll('.active-province');
    currentlyActive.forEach(path => {
      path.classList.remove('active-province');
      const orgCount = parseInt(path.dataset.orgCount || '0', 10);
      path.style.fill = orgCount > 0 ? getChoroplethColor(orgCount, maxOrgCount) : '#f8fafc';
      path.style.stroke = '#e2e8f0';
      path.style.strokeWidth = '0.7px';
      path.style.filter = '';
    });

    // Add active class to the new active path
    const activeMapId = activeSlug ? SLUG_TO_MAP_ID[activeSlug] : null;
    if (activeMapId) {
      const newActivePath = svgElement.querySelector(`#${CSS.escape(activeMapId)}`);
      if (newActivePath) {
        newActivePath.classList.add('active-province');
        newActivePath.style.fill = 'var(--color-baznas-green)';
        newActivePath.style.stroke = '#ffffff';
        newActivePath.style.strokeWidth = '2px';
        newActivePath.style.filter = 'drop-shadow(0 0 20px rgba(0, 166, 81, 0.6)) drop-shadow(0 0 40px rgba(0, 166, 81, 0.2))';
      }
    }
  }, [activeSlug, svgContent, isInteractive, maxOrgCount]);

  // Effect 3: Apply hover highlight to the currently hovered path
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Remove hover state from all interactive paths
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
      path.classList.remove('hover-province');
    });

    // Apply hover highlight if not already active
    if (hoveredPathId) {
      const hoveredPath = svgElement.querySelector(`#${CSS.escape(hoveredPathId)}`);
      if (hoveredPath && !hoveredPath.classList.contains('active-province')) {
        hoveredPath.classList.add('hover-province');
      }
    }
  }, [hoveredPathId, svgContent]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full indonesia-map ${isInteractive ? 'flex items-center justify-center' : ''}`}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* Map Legend */}
      {isInteractive && provinces.length > 0 && (
        <div className="absolute bottom-4 left-4 z-40 flex flex-col gap-1.5 px-3 py-2.5 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/80 shadow-lg select-none">
          <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">Organisasi</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(90deg, #f0fdf4, #00A651)' }} />
            </div>
            <span className="text-[8px] font-mono text-slate-500 font-bold">
              0 — {maxOrgCount}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-baznas-green animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-wider text-baznas-green">Terpilih</span>
          </div>
        </div>
      )}

      {/* Enhanced Tooltip */}
      {tooltip.show && (
        <div
          className="absolute z-50 pointer-events-none px-4 py-3 bg-white/95 backdrop-blur-xl text-gray-900 text-xs rounded-2xl border border-slate-200/80 shadow-2xl flex flex-col gap-1.5 transition-all duration-75 select-none min-w-[160px]"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
            animation: 'tooltipFadeIn 0.15s ease-out'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-baznas-green flex-shrink-0" />
            <span className="font-extrabold uppercase tracking-wide text-gray-900 text-[11px]">{tooltip.name}</span>
          </div>
          <div className="flex items-center gap-3 pl-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-baznas-green font-black tracking-wider uppercase font-mono">{tooltip.info}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Klik untuk detail</span>
          </div>
          {/* Mini stat bar */}
          <div className="mt-0.5 pl-4">
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-baznas-green to-baznas-dark rounded-full transition-all duration-500"
                style={{ width: `${maxOrgCount > 0 ? (parseInt(tooltip.info) / maxOrgCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
