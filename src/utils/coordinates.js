/**
 * Map coordinates (top/left percentages) for Indonesian Provinces
 * based on the aspect-square 1024x1024 viewBox of /id-map.svg.
 */
export const PROVINCE_COORDINATES = {
  // Sumatra
  'aceh': { top: 34, left: 6 },
  'sumatera-utara': { top: 40, left: 12 },
  'sumatera-barat': { top: 47, left: 17 },
  'riau': { top: 44, left: 21 },
  'kepulauan-riau': { top: 40, left: 28 },
  'jambi': { top: 50, left: 25 },
  'bengkulu': { top: 54, left: 21 },
  'sumatera-selatan': { top: 55, left: 26 },
  'kepulauan-bangka-belitung': { top: 52, left: 31 },
  'lampung': { top: 60, left: 28 },

  // Java
  'dki-jakarta': { top: 59, left: 28.5 },
  'banten': { top: 59.5, left: 26.5 },
  'jawa-barat': { top: 60.5, left: 30.5 },
  'jawa-tengah': { top: 61.5, left: 37 },
  'di-yogyakarta': { top: 62.5, left: 38 },
  'jawa-timur': { top: 62, left: 44 },

  // Bali & Nusa Tenggara
  'bali': { top: 63, left: 50.5 },
  'nusa-tenggara-barat': { top: 63.5, left: 55.5 },
  'nusa-tenggara-timur': { top: 65, left: 62.5 },

  // Kalimantan
  'kalimantan-barat': { top: 46, left: 39 },
  'kalimantan-tengah': { top: 49.5, left: 44 },
  'kalimantan-selatan': { top: 52, left: 48.5 },
  'kalimantan-timur': { top: 42, left: 48 },
  'kalimantan-utara': { top: 34, left: 48 },

  // Sulawesi
  'sulawesi-utara': { top: 37, left: 60 },
  'gorontalo': { top: 39, left: 57 },
  'sulawesi-tengah': { top: 44.5, left: 55.5 },
  'sulawesi-barat': { top: 47, left: 52.5 },
  'sulawesi-selatan': { top: 51.5, left: 53.5 },
  'sulawesi-tenggara': { top: 51, left: 58 },

  // Maluku & Papua
  'maluku-utara': { top: 40, left: 65.5 },
  'maluku': { top: 49, left: 67 },
  'papua-barat': { top: 46, left: 73.5 },
  'papua-barat-daya': { top: 44, left: 71 },
  'papua-tengah': { top: 49, left: 80 },
  'papua-selatan': { top: 53, left: 85.5 },
  'papua-pegunungan': { top: 49, left: 84 },
  'papua': { top: 47, left: 86.5 }
};

/**
 * Returns top/left percentage coordinates for a province.
 * Fallback to pseudo-random but stable distribution if not found.
 */
export function getProvinceCoordinates(province, index) {
  if (!province) return { top: 50, left: 50 };
  
  const slug = province.slug ? province.slug.toLowerCase() : '';
  if (PROVINCE_COORDINATES[slug]) {
    return PROVINCE_COORDINATES[slug];
  }
  
  // Clean fallback based on index if slug not found
  const idx = typeof index === 'number' ? index : 0;
  return {
    top: 35 + (idx * 7) % 25,
    left: 25 + (idx * 11) % 50
  };
}
