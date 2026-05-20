import React, { useEffect, useState, useRef } from 'react';

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

export default function InteractiveMap({ activeSlug, onSelectProvince, provinces = [], isInteractive = true }) {
  const [svgContent, setSvgContent] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, name: '', info: '', x: 0, y: 0 });
  const containerRef = useRef(null);

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

  // Effect 1: Initial configuration of SVG paths (only run when SVG content/provinces load or interaction mode changes)
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Reset default attributes to make it responsive
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

      // Mouse interactive properties
      path.style.cursor = isInteractive ? 'pointer' : 'default';
      path.style.pointerEvents = isInteractive ? 'auto' : 'none';
      path.style.transition = 'fill 0.3s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease';

      // Default styling for inactive
      if (isInteractive) {
        path.style.fill = '#ffffff';
        path.style.stroke = '#e5e7eb';
        path.style.strokeWidth = '0.5px';
        path.style.opacity = '1';
      } else {
        path.style.fill = '#cbd5e1';
        path.style.stroke = '#94a3b8';
        path.style.strokeWidth = '0.5px';
        path.style.opacity = '0.3';
      }

      if (isInteractive) {
        // Click action
        path.onclick = (e) => {
          e.preventDefault();
          if (slug && onSelectProvince) {
            onSelectProvince(slug);
          }
        };

        // Hover action
        path.onmouseenter = (e) => {
          const name = provinceData ? provinceData.name : title;
          const count = provinceData?.organizations_count || 0;
          const info = `${count} Organisasi`;
          const containerRect = containerRef.current.getBoundingClientRect();

          setTooltip({
            show: true,
            name,
            info,
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
          setTooltip(prev => ({ ...prev, show: false }));
        };
      } else {
        path.onclick = null;
        path.onmouseenter = null;
        path.onmousemove = null;
        path.onmouseleave = null;
      }
    });
  }, [svgContent, provinces, isInteractive]);

  // Effect 2: Update active province highlights dynamically (extremely fast, no reflow/listener rebinding)
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;

    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    // Remove active class from any path currently active
    const currentlyActive = svgElement.querySelectorAll('.active-province');
    currentlyActive.forEach(path => {
      path.classList.remove('active-province');
      if (!isInteractive) {
        path.style.fill = '#cbd5e1';
        path.style.opacity = '0.3';
      }
    });

    // Add active class to the new active path
    const activeMapId = activeSlug ? SLUG_TO_MAP_ID[activeSlug] : null;
    if (activeMapId) {
      const newActivePath = svgElement.querySelector(`#${CSS.escape(activeMapId)}`);
      if (newActivePath) {
        newActivePath.classList.add('active-province');
        if (!isInteractive) {
          newActivePath.style.fill = 'var(--color-baznas-green)';
          newActivePath.style.opacity = '1';
        }
      }
    }
  }, [activeSlug, svgContent, isInteractive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full indonesia-map ${isInteractive ? 'flex items-center justify-center' : ''}`}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      {tooltip.show && (
        <div
          className="absolute z-50 pointer-events-none px-3 py-2 bg-white/95 backdrop-blur-md text-gray-900 text-xs rounded-xl border border-gray-200 shadow-2xl flex flex-col gap-0.5 transition-all duration-75 select-none"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: 'translate(-50%, -100%)' }}
        >
          <span className="font-extrabold uppercase tracking-wide text-gray-900">{tooltip.name}</span>
          <span className="text-[10px] text-baznas-green font-bold tracking-wider uppercase font-mono">{tooltip.info}</span>
        </div>
      )}
    </div>
  );
}
