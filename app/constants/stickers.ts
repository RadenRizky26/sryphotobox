export interface StickerCategory {
  id: string;
  name: string;
  icon: string;
  stickers: string[];
}

export const STICKER_CATEGORIES: StickerCategory[] = [
  {
    id: 'love',
    name: 'Love',
    icon: '❤️',
    stickers: ['💖', '💕', '💗', '💓', '💝', '💘', '❤️', '🩷']
  },
  {
    id: 'magic',
    name: 'Magic',
    icon: '✨',
    stickers: ['✨', '⭐', '🌟', '💫', '🌠', '✴️', '🎇', '🎆']
  },
  {
    id: 'flowers',
    name: 'Flowers',
    icon: '🌸',
    stickers: ['🌸', '🌺', '🌻', '🌷', '🌹', '🏵️', '💐', '🌼']
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: '🦋',
    stickers: ['🦋', '🐝', '🐞', '🦄', '🐰', '🐱', '🐶', '🐻']
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍰',
    stickers: ['🍰', '🎂', '🧁', '🍭', '🍬', '🍩', '🍪', '🍓']
  },
  {
    id: 'party',
    name: 'Party',
    icon: '🎉',
    stickers: ['🎉', '🎊', '🎈', '🎁', '🎀', '🎵', '🎶', '🎸']
  },
  {
    id: 'faces',
    name: 'Faces',
    icon: '😎',
    stickers: ['😎', '🥳', '😍', '🤩', '😘', '🥰', '😇', '🤗']
  },
  {
    id: 'icons',
    name: 'Icons',
    icon: '👑',
    stickers: ['👑', '💎', '🔥', '⚡', '🌈', '☁️', '🌙', '☀️']
  },
  {
    id: 'retro',
    name: 'Retro',
    icon: '📼',
    stickers: ['📼', '💿', '📱', '🎮', '🕹️', '📺']
  },
  {
    id: 'misc',
    name: 'Misc',
    icon: '🎨',
    stickers: ['🎨', '📸', '🎬', '🎭', '🎪', '🎢']
  },
];

export const ALL_STICKERS = STICKER_CATEGORIES.flatMap(c => c.stickers);

export type StickerSize = 'small' | 'medium' | 'large';

export const STICKER_SIZE_MAP: Record<StickerSize, string> = {
  small: '2rem',
  medium: '3rem',
  large: '4rem',
};
