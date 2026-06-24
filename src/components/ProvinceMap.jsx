import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates lookup table for Indonesian provinces
const PROVINCE_COORDINATES = {
  'aceh': { center: [4.6951, 96.7494], zoom: 8 },
  'bali': { center: [-8.4095, 115.1889], zoom: 10 },
  'kepulauan-bangka-belitung': { center: [-2.7410, 106.4406], zoom: 8 },
  'bengkulu': { center: [-3.7928, 102.2608], zoom: 9 },
  'banten': { center: [-6.4058, 106.0600], zoom: 10 },
  'gorontalo': { center: [0.6999, 122.4467], zoom: 9 },
  'jambi': { center: [-1.6186, 102.9469], zoom: 8 },
  'jawa-barat': { center: [-7.0909, 107.6689], zoom: 9 },
  'jawa-timur': { center: [-7.5360, 112.2384], zoom: 8 },
  'dki-jakarta': { center: [-6.2088, 106.8456], zoom: 11 },
  'jawa-tengah': { center: [-7.1510, 110.1403], zoom: 9 },
  'kalimantan-barat': { center: [-0.2788, 111.4753], zoom: 7 },
  'kalimantan-timur': { center: [1.6406, 116.4194], zoom: 7 },
  'kepulauan-riau': { center: [3.9457, 108.1429], zoom: 7 },
  'kalimantan-selatan': { center: [-3.0926, 115.2838], zoom: 8 },
  'kalimantan-tengah': { center: [-1.6815, 113.3824], zoom: 7 },
  'kalimantan-utara': { center: [3.0731, 116.0414], zoom: 7 },
  'lampung': { center: [-4.5586, 105.4000], zoom: 9 },
  'maluku': { center: [-3.2385, 130.1453], zoom: 7 },
  'maluku-utara': { center: [1.5700, 127.8000], zoom: 7 },
  'nusa-tenggara-barat': { center: [-8.6529, 117.3616], zoom: 9 },
  'nusa-tenggara-timur': { center: [-8.6573, 121.0794], zoom: 8 },
  'papua': { center: [-4.2699, 138.0804], zoom: 7 },
  'papua-barat': { center: [-1.3361, 132.9000], zoom: 8 },
  'riau': { center: [0.5071, 101.5408], zoom: 8 },
  'sulawesi-utara': { center: [0.6247, 123.9750], zoom: 8 },
  'sumatera-barat': { center: [-0.7399, 100.8000], zoom: 8 },
  'sulawesi-tenggara': { center: [-4.1449, 122.1746], zoom: 8 },
  'sulawesi-selatan': { center: [-3.6688, 119.7885], zoom: 8 },
  'sulawesi-barat': { center: [-2.8441, 119.2321], zoom: 9 },
  'sumatera-selatan': { center: [-3.3194, 103.9144], zoom: 8 },
  'sulawesi-tengah': { center: [-1.4300, 121.4456], zoom: 8 },
  'sumatera-utara': { center: [2.1121, 99.1986], zoom: 8 },
  'di-yogyakarta': { center: [-7.8754, 110.4263], zoom: 10 }
};

// Helper component to dynamically pan/zoom map when coordinates change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function ProvinceMap({ slug, name, daerahs = [] }) {
  // Get coordinate configuration
  const config = PROVINCE_COORDINATES[slug] || { center: [-2.5489, 118.0149], zoom: 5 };

  // Create custom marker icon to prevent Vite compilation issues and look premium
  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute inline-flex h-6 w-6 animate-ping rounded-full bg-baznas-green opacity-40"></span>
        <span class="relative inline-flex h-3 w-3 rounded-full bg-baznas-green border-2 border-white shadow-md"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-100">
      <MapContainer
        center={config.center}
        zoom={config.zoom}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <ChangeView center={config.center} zoom={config.zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {/* Center Marker with Popup */}
        <Marker position={config.center} icon={customIcon}>
          <Popup>
            <div className="p-1">
              <h5 className="font-extrabold text-baznas-ink uppercase text-sm mb-1">{name}</h5>
              <p className="text-[10px] text-slate-500 m-0 font-medium">Titik Pusat Koordinat Wilayah BAZNAS</p>
            </div>
          </Popup>
        </Marker>

        {/* Generate dynamic mini markers around center for Daerahs if available to make it interactive */}
        {daerahs.map((daerah, index) => {
          // Generate a slight offset around center for visual interest (since no explicit coords stored)
          const angle = (index * 2 * Math.PI) / Math.max(daerahs.length, 1);
          const radius = 0.15 + (index % 3) * 0.05; // degree offset
          const daerahLat = config.center[0] + radius * Math.sin(angle);
          const daerahLng = config.center[1] + radius * Math.cos(angle);

          const daerahIcon = L.divIcon({
            className: 'custom-daerah-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-baznas-yellow border border-white shadow"></span>
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          return (
            <Marker key={daerah.id} position={[daerahLat, daerahLng]} icon={daerahIcon}>
              <Popup>
                <div className="p-1">
                  <h6 className="font-black text-baznas-ink uppercase text-xs m-0">{daerah.name}</h6>
                  <p className="text-[9px] text-baznas-green uppercase font-bold tracking-wider mt-0.5 m-0">BAZNAS Daerah</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Overlay with Province Info */}
      <div className="absolute bottom-6 left-6 z-[10] bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200 shadow-xl max-w-sm">
        <span className="text-[9px] font-black uppercase tracking-widest text-baznas-green">PETA INTERAKTIF</span>
        <h2 className="text-2xl font-black uppercase text-baznas-ink mt-0.5 leading-tight">{name}</h2>
        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
          Gunakan kontrol peta untuk memperbesar, memperkecil, atau menggeser wilayah. Klik penanda untuk informasi lebih lanjut.
        </p>
      </div>
    </div>
  );
}
