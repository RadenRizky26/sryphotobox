export interface CameraFilter {
  id: string;
  name: string;
  category: 'All' | 'Film' | 'Retro' | 'Modern';
  css: string;
  preview?: string;
}

export const CAMERA_FILTERS: CameraFilter[] = [
  // ── BASIC ──────────────────────────────────────────────────────────────────
  { 
    id: 'none', 
    name: 'Normal', 
    category: 'All',
    css: 'none',
    preview: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)'
  },

  // ── FILM EMULATION ─────────────────────────────────────────────────────────
  { 
    id: 'portra', 
    name: 'Portra', 
    category: 'Film',
    css: 'saturate(0.9) contrast(0.95) brightness(1.05) hue-rotate(-5deg)',
    preview: 'linear-gradient(135deg, #f5e6d3, #e8d4b8)'
  },
  { 
    id: 'ektar', 
    name: 'Ektar', 
    category: 'Film',
    css: 'saturate(1.4) contrast(1.15) brightness(1.02)',
    preview: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
  },
  { 
    id: 'tri-x', 
    name: 'Tri-X', 
    category: 'Film',
    css: 'grayscale(100%) contrast(1.25) brightness(0.95)',
    preview: 'linear-gradient(135deg, #2c2c2c, #6c6c6c)'
  },
  { 
    id: 'cinestill', 
    name: 'Cinestill', 
    category: 'Film',
    css: 'saturate(1.1) contrast(1.05) hue-rotate(10deg) brightness(1.08)',
    preview: 'linear-gradient(135deg, #ffd89b, #19547b)'
  },
  { 
    id: 'fuji-velvia', 
    name: 'Velvia', 
    category: 'Film',
    css: 'saturate(1.5) contrast(1.2) hue-rotate(-8deg)',
    preview: 'linear-gradient(135deg, #ff0844, #ffb199)'
  },

  // ── RETRO / VINTAGE ────────────────────────────────────────────────────────
  { 
    id: 'bw', 
    name: 'B & W', 
    category: 'Retro',
    css: 'grayscale(100%) contrast(1.1)',
    preview: 'linear-gradient(135deg, #000000, #ffffff)'
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    category: 'Retro',
    css: 'sepia(80%) hue-rotate(-15deg) contrast(1.1)',
    preview: 'linear-gradient(135deg, #8b7355, #d4a574)'
  },
  { 
    id: 'retro-warm', 
    name: 'Retro', 
    category: 'Retro',
    css: 'sepia(40%) saturate(1.2) contrast(1.1) brightness(1.05)',
    preview: 'linear-gradient(135deg, #ff9a56, #ffd39a)'
  },
  { 
    id: 'polaroid', 
    name: 'Polaroid', 
    category: 'Retro',
    css: 'saturate(0.8) contrast(1.15) brightness(1.1) sepia(15%)',
    preview: 'linear-gradient(135deg, #f5f5f0, #e8e8e0)'
  },
  { 
    id: '70s', 
    name: '70s', 
    category: 'Retro',
    css: 'sepia(30%) saturate(1.3) hue-rotate(15deg) contrast(1.05)',
    preview: 'linear-gradient(135deg, #ff6b35, #f7931e)'
  },
  { 
    id: 'faded-film', 
    name: 'Faded', 
    category: 'Retro',
    css: 'saturate(0.6) contrast(0.85) brightness(1.15) sepia(20%)',
    preview: 'linear-gradient(135deg, #e8d5c4, #f5f0e8)'
  },

  // ── MODERN / CREATIVE ──────────────────────────────────────────────────────
  { 
    id: 'cool', 
    name: 'Cool', 
    category: 'Modern',
    css: 'saturate(1.2) hue-rotate(180deg)',
    preview: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  { 
    id: 'vivid', 
    name: 'Vivid', 
    category: 'Modern',
    css: 'saturate(1.6) contrast(1.05)',
    preview: 'linear-gradient(135deg, #f093fb, #f5576c)'
  },
  { 
    id: 'fade', 
    name: 'Fade', 
    category: 'Modern',
    css: 'saturate(0.7) brightness(1.1) contrast(0.9)',
    preview: 'linear-gradient(135deg, #ffecd2, #fcb69f)'
  },
  { 
    id: 'dramatic', 
    name: 'Dramatic', 
    category: 'Modern',
    css: 'contrast(1.3) saturate(1.2) brightness(0.95)',
    preview: 'linear-gradient(135deg, #000000, #434343)'
  },
  { 
    id: 'soft-glow', 
    name: 'Soft Glow', 
    category: 'Modern',
    css: 'brightness(1.15) contrast(0.9) saturate(0.95)',
    preview: 'linear-gradient(135deg, #fff9f0, #ffe8d6)'
  },
  { 
    id: 'high-key', 
    name: 'High Key', 
    category: 'Modern',
    css: 'brightness(1.25) contrast(0.85) saturate(0.9)',
    preview: 'linear-gradient(135deg, #ffffff, #f0f0f0)'
  },
  { 
    id: 'low-key', 
    name: 'Low Key', 
    category: 'Modern',
    css: 'brightness(0.75) contrast(1.4) saturate(1.1)',
    preview: 'linear-gradient(135deg, #1a1a1a, #4a4a4a)'
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    category: 'Modern',
    css: 'saturate(1.5) contrast(1.2) hue-rotate(270deg) brightness(1.1)',
    preview: 'linear-gradient(135deg, #ff00ff, #00ffff)'
  },
  { 
    id: 'dreamy', 
    name: 'Dreamy', 
    category: 'Modern',
    css: 'saturate(0.8) brightness(1.2) contrast(0.85) hue-rotate(10deg)',
    preview: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)'
  },
];

export const FILTER_CATEGORIES = ['All', 'Film', 'Retro', 'Modern'] as const;
export type FilterCategory = typeof FILTER_CATEGORIES[number];
