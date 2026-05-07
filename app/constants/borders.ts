export interface BorderStyle {
  id: string;
  name: string;
  category: 'Simple' | 'Decorative' | 'Fun' | 'Artistic';
  css: {
    border?: string;
    outline?: string;
    boxShadow?: string;
    borderRadius?: string;
    padding?: string;
  };
  preview: string;
}

export const BORDER_STYLES: BorderStyle[] = [
  // ── SIMPLE ─────────────────────────────────────────────────────────────────
  { 
    id: 'none', 
    name: 'No Border', 
    category: 'Simple',
    css: {},
    preview: 'transparent'
  },
  { 
    id: 'thin-white', 
    name: 'Thin White', 
    category: 'Simple',
    css: { 
      border: '2px solid #ffffff', 
      padding: '4px' 
    },
    preview: '#ffffff'
  },
  { 
    id: 'thick-black', 
    name: 'Bold Black', 
    category: 'Simple',
    css: { 
      border: '4px solid #000000', 
      padding: '6px' 
    },
    preview: '#000000'
  },
  { 
    id: 'classic-gray', 
    name: 'Classic Gray', 
    category: 'Simple',
    css: { 
      border: '3px solid #888888', 
      padding: '5px' 
    },
    preview: '#888888'
  },
  {
    id: 'soft-cream',
    name: 'Soft Cream',
    category: 'Simple',
    css: {
      border: '6px solid #fff7ed',
      borderRadius: '14px',
      padding: '5px',
      boxShadow: '0 4px 14px rgba(146, 64, 14, 0.12)'
    },
    preview: 'linear-gradient(135deg, #fff7ed, #fed7aa)'
  },
  {
    id: 'clean-gallery',
    name: 'Gallery',
    category: 'Simple',
    css: {
      border: '10px solid #ffffff',
      borderRadius: '2px',
      padding: '0',
      boxShadow: '0 8px 18px rgba(31, 27, 20, 0.14)'
    },
    preview: 'linear-gradient(135deg, #ffffff, #e5e7eb)'
  },
  {
    id: 'mini-postcard',
    name: 'Postcard',
    category: 'Simple',
    css: {
      border: '8px solid #fef3c7',
      outline: '1px solid #d6a65a',
      borderRadius: '6px',
      padding: '3px',
      boxShadow: '0 5px 12px rgba(120, 53, 15, 0.16)'
    },
    preview: 'linear-gradient(135deg, #fef3c7, #fcd34d)'
  },

  // ── DECORATIVE ─────────────────────────────────────────────────────────────
  { 
    id: 'double-gold', 
    name: 'Double Gold', 
    category: 'Decorative',
    css: { 
      border: '4px double #d4af37', 
      padding: '8px' 
    },
    preview: 'linear-gradient(135deg, #d4af37, #f4d03f)'
  },
  { 
    id: 'dashed-rainbow', 
    name: 'Rainbow Dash', 
    category: 'Decorative',
    css: { 
      border: '3px dashed transparent',
      borderRadius: '8px',
      padding: '6px',
      boxShadow: '0 0 0 3px #ff0080, 0 0 0 6px #ff8c00, 0 0 0 9px #40e0d0'
    },
    preview: 'linear-gradient(135deg, #ff0080, #ff8c00, #40e0d0)'
  },
  { 
    id: 'ornate-frame', 
    name: 'Ornate', 
    category: 'Decorative',
    css: { 
      border: '6px solid #8b6241',
      outline: '2px solid #c8a97e',
      padding: '10px'
    },
    preview: 'linear-gradient(135deg, #8b6241, #c8a97e)'
  },
  { 
    id: 'vintage-stamp', 
    name: 'Vintage Stamp', 
    category: 'Decorative',
    css: { 
      border: '8px solid #e8d5b2',
      outline: '2px dashed #c4a882',
      padding: '12px',
      borderRadius: '4px'
    },
    preview: 'linear-gradient(135deg, #e8d5b2, #c4a882)'
  },
  {
    id: 'pearl-ribbon',
    name: 'Pearl Ribbon',
    category: 'Decorative',
    css: {
      border: '5px double #f8c8dc',
      outline: '3px solid #fff7fb',
      borderRadius: '16px',
      padding: '8px',
      boxShadow: '0 0 0 2px #f9a8d4, 0 6px 16px rgba(190, 24, 93, 0.16)'
    },
    preview: 'linear-gradient(135deg, #fff7fb, #f9a8d4)'
  },
  {
    id: 'royal-lace',
    name: 'Royal Lace',
    category: 'Decorative',
    css: {
      border: '6px ridge #c084fc',
      outline: '2px dotted #f5d0fe',
      borderRadius: '10px',
      padding: '8px',
      boxShadow: '0 0 0 4px rgba(250, 245, 255, 0.9), 0 8px 18px rgba(88, 28, 135, 0.18)'
    },
    preview: 'linear-gradient(135deg, #f5d0fe, #a855f7)'
  },
  {
    id: 'garden-party',
    name: 'Garden',
    category: 'Decorative',
    css: {
      border: '5px dashed #86efac',
      outline: '3px solid #dcfce7',
      borderRadius: '18px',
      padding: '8px',
      boxShadow: '0 0 0 2px #22c55e, 0 6px 14px rgba(22, 101, 52, 0.16)'
    },
    preview: 'linear-gradient(135deg, #dcfce7, #22c55e)'
  },
  {
    id: 'starlight',
    name: 'Starlight',
    category: 'Decorative',
    css: {
      border: '4px solid #fde68a',
      outline: '2px dashed #f59e0b',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: '0 0 0 3px rgba(255, 251, 235, 0.9), 0 0 18px rgba(245, 158, 11, 0.36)'
    },
    preview: 'linear-gradient(135deg, #fef3c7, #f59e0b)'
  },
  {
    id: 'blue-china',
    name: 'Blue China',
    category: 'Decorative',
    css: {
      border: '7px double #2563eb',
      outline: '2px solid #bfdbfe',
      borderRadius: '8px',
      padding: '8px',
      boxShadow: '0 6px 14px rgba(30, 64, 175, 0.18)'
    },
    preview: 'linear-gradient(135deg, #dbeafe, #2563eb)'
  },

  // ── FUN ────────────────────────────────────────────────────────────────────
  { 
    id: 'scalloped', 
    name: 'Scalloped', 
    category: 'Fun',
    css: { 
      border: '4px solid #ff69b4',
      borderRadius: '20px',
      padding: '8px'
    },
    preview: 'linear-gradient(135deg, #ff69b4, #ff1493)'
  },
  { 
    id: 'polaroid-thick', 
    name: 'Polaroid', 
    category: 'Fun',
    css: { 
      border: '12px solid #f5f5f0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      padding: '0'
    },
    preview: '#f5f5f0'
  },
  { 
    id: 'sticker-edge', 
    name: 'Sticker', 
    category: 'Fun',
    css: {
      border: '3px solid #fff',
      borderRadius: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(0,0,0,0.1)',
      padding: '6px'
    },
    preview: 'linear-gradient(135deg, #ffffff, #f0f0f0)'
  },
  { 
    id: 'bubblegum', 
    name: 'Bubblegum', 
    category: 'Fun',
    css: {
      border: '5px dashed #ff69b4',
      borderRadius: '20px',
      padding: '8px',
      boxShadow: '0 0 0 2px #ffb3de'
    },
    preview: 'linear-gradient(135deg, #ff69b4, #ffb3de)'
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    category: 'Fun',
    css: {
      border: '6px solid #f9a8d4',
      outline: '4px dashed #93c5fd',
      borderRadius: '24px',
      padding: '9px',
      boxShadow: '0 0 0 3px #fce7f3, 0 8px 18px rgba(236, 72, 153, 0.18)'
    },
    preview: 'linear-gradient(135deg, #f9a8d4, #93c5fd)'
  },
  {
    id: 'cute-hearts',
    name: 'Sweet Heart',
    category: 'Fun',
    css: {
      border: '5px dotted #fb7185',
      outline: '5px solid #ffe4e6',
      borderRadius: '22px',
      padding: '9px',
      boxShadow: '0 0 0 2px #fda4af, 0 8px 18px rgba(225, 29, 72, 0.16)'
    },
    preview: 'linear-gradient(135deg, #ffe4e6, #fb7185)'
  },
  {
    id: 'confetti-pop',
    name: 'Confetti',
    category: 'Fun',
    css: {
      border: '4px dashed #22d3ee',
      outline: '4px dotted #facc15',
      borderRadius: '14px',
      padding: '9px',
      boxShadow: '0 0 0 3px #f472b6, 0 0 0 6px rgba(255,255,255,0.8), 0 8px 18px rgba(8, 145, 178, 0.16)'
    },
    preview: 'linear-gradient(135deg, #22d3ee, #facc15, #f472b6)'
  },
  {
    id: 'kawaii-cloud',
    name: 'Kawaii Cloud',
    category: 'Fun',
    css: {
      border: '7px solid #e0f2fe',
      outline: '3px dashed #7dd3fc',
      borderRadius: '28px',
      padding: '8px',
      boxShadow: '0 0 0 3px #f0f9ff, 0 8px 18px rgba(14, 165, 233, 0.16)'
    },
    preview: 'linear-gradient(135deg, #f0f9ff, #7dd3fc)'
  },
  {
    id: 'banana-milk',
    name: 'Banana Milk',
    category: 'Fun',
    css: {
      border: '7px solid #fde68a',
      outline: '3px dashed #fbbf24',
      borderRadius: '20px',
      padding: '8px',
      boxShadow: '0 0 0 3px #fff7ed, 0 7px 16px rgba(180, 83, 9, 0.14)'
    },
    preview: 'linear-gradient(135deg, #fef3c7, #fbbf24)'
  },
  {
    id: 'mint-jelly',
    name: 'Mint Jelly',
    category: 'Fun',
    css: {
      border: '7px solid #99f6e4',
      outline: '3px dotted #14b8a6',
      borderRadius: '20px',
      padding: '8px',
      boxShadow: '0 0 0 3px #ecfeff, 0 7px 16px rgba(15, 118, 110, 0.16)'
    },
    preview: 'linear-gradient(135deg, #ccfbf1, #14b8a6)'
  },
  {
    id: 'doodle-line',
    name: 'Doodle',
    category: 'Fun',
    css: {
      border: '4px dashed #111827',
      outline: '3px solid #ffffff',
      borderRadius: '18px 10px 22px 12px',
      padding: '8px',
      boxShadow: '0 0 0 2px #fbbf24, 4px 5px 0 rgba(17, 24, 39, 0.18)'
    },
    preview: 'linear-gradient(135deg, #ffffff, #fbbf24)'
  },
  {
    id: 'comic-pop',
    name: 'Comic Pop',
    category: 'Fun',
    css: {
      border: '5px solid #111827',
      outline: '4px solid #facc15',
      borderRadius: '10px',
      padding: '7px',
      boxShadow: '5px 5px 0 #ef4444, 8px 8px 0 #2563eb'
    },
    preview: 'linear-gradient(135deg, #facc15, #ef4444, #2563eb)'
  },

  // ── ARTISTIC ───────────────────────────────────────────────────────────────
  { 
    id: 'neon-glow', 
    name: 'Neon Glow', 
    category: 'Artistic',
    css: {
      border: '2px solid #00ffff',
      boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, inset 0 0 10px rgba(0,255,255,0.2)',
      padding: '4px'
    },
    preview: 'linear-gradient(135deg, #00ffff, #00cccc)'
  },
  { 
    id: 'film-strip', 
    name: 'Film Strip', 
    category: 'Artistic',
    css: {
      border: '8px solid #333',
      padding: '8px',
      boxShadow: 'inset 0 0 0 2px #666'
    },
    preview: 'linear-gradient(135deg, #333333, #666666)'
  },
  { 
    id: 'neon-pink', 
    name: 'Neon Pink', 
    category: 'Artistic',
    css: {
      border: '2px solid #ff00aa',
      boxShadow: '0 0 10px #ff00aa, 0 0 20px #ff00aa, inset 0 0 10px rgba(255,0,170,0.2)',
      padding: '4px'
    },
    preview: 'linear-gradient(135deg, #ff00aa, #cc0088)'
  },
  { 
    id: 'gradient-border', 
    name: 'Gradient', 
    category: 'Artistic',
    css: {
      border: '4px solid transparent',
      borderRadius: '12px',
      padding: '6px',
      boxShadow: '0 0 0 4px #f093fb, 0 0 0 8px #f5576c'
    },
    preview: 'linear-gradient(135deg, #f093fb, #f5576c)'
  },
  {
    id: 'holographic',
    name: 'Holographic',
    category: 'Artistic',
    css: {
      border: '4px solid transparent',
      borderRadius: '14px',
      padding: '8px',
      boxShadow: '0 0 0 3px #a78bfa, 0 0 0 6px #22d3ee, 0 0 0 9px #f472b6, 0 10px 22px rgba(124, 58, 237, 0.2)'
    },
    preview: 'linear-gradient(135deg, #a78bfa, #22d3ee, #f472b6)'
  },
  {
    id: 'sunset-aura',
    name: 'Sunset Aura',
    category: 'Artistic',
    css: {
      border: '4px solid #fb7185',
      outline: '3px solid #fdba74',
      borderRadius: '16px',
      padding: '7px',
      boxShadow: '0 0 18px rgba(251, 113, 133, 0.45), 0 0 30px rgba(251, 191, 36, 0.25)'
    },
    preview: 'linear-gradient(135deg, #fb7185, #fdba74, #facc15)'
  },
  {
    id: 'ocean-glass',
    name: 'Ocean Glass',
    category: 'Artistic',
    css: {
      border: '3px solid rgba(34, 211, 238, 0.9)',
      outline: '4px solid rgba(219, 234, 254, 0.9)',
      borderRadius: '18px',
      padding: '8px',
      boxShadow: 'inset 0 0 14px rgba(14, 165, 233, 0.22), 0 8px 20px rgba(8, 145, 178, 0.2)'
    },
    preview: 'linear-gradient(135deg, #dbeafe, #22d3ee)'
  },
  {
    id: 'lava-lamp',
    name: 'Lava Lamp',
    category: 'Artistic',
    css: {
      border: '5px solid #7c2d12',
      outline: '4px solid #fb923c',
      borderRadius: '22px 10px 22px 10px',
      padding: '8px',
      boxShadow: '0 0 16px rgba(249, 115, 22, 0.45), inset 0 0 12px rgba(124, 45, 18, 0.24)'
    },
    preview: 'linear-gradient(135deg, #7c2d12, #fb923c, #f97316)'
  },
  {
    id: 'midnight-spark',
    name: 'Midnight',
    category: 'Artistic',
    css: {
      border: '3px solid #c4b5fd',
      outline: '4px solid #111827',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: '0 0 0 2px #312e81, 0 0 22px rgba(196, 181, 253, 0.38)'
    },
    preview: 'linear-gradient(135deg, #111827, #312e81, #c4b5fd)'
  },
  {
    id: 'chrome-y2k',
    name: 'Chrome Y2K',
    category: 'Artistic',
    css: {
      border: '5px ridge #cbd5e1',
      outline: '2px solid #64748b',
      borderRadius: '16px',
      padding: '7px',
      boxShadow: '0 0 0 3px #f8fafc, 0 10px 20px rgba(51, 65, 85, 0.22)'
    },
    preview: 'linear-gradient(135deg, #f8fafc, #94a3b8, #e2e8f0)'
  },
];

export const BORDER_CATEGORIES = ['All', 'Simple', 'Decorative', 'Fun', 'Artistic'] as const;
export type BorderCategory = typeof BORDER_CATEGORIES[number];
