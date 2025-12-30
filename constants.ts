
import { Character } from "./types";

/**
 * Pixel SVG Creator para 16-bit (48x48)
 * Refined to support more detailed character silhouettes.
 */
const createPixelSVG = (pixels: string[], colors: Record<string, string>, size: number = 48) => {
  let rects = '';
  pixels.forEach((row, y) => {
    [...row].forEach((char, x) => {
      if (char !== ' ' && colors[char]) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[char]}" />`;
      }
    });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${rects}</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const COLORS = {
  LANE_0: '#ff0040', 
  LANE_1: '#ffeb3b', 
  LANE_2: '#4caf50', 
  LANE_3: '#2196f3', 
  BACKGROUND: '#0a0a12',
  PANEL: '#16213e',
  ACCENT: '#e94560',
};

export const GAME_CONFIG = {
  NOTE_SPEED: 0.8,
  HIT_WINDOW_PERFECT: 50,
  HIT_WINDOW_GREAT: 120,
  NOTE_SPAWN_OFFSET: 2000,
  BASE_SCORE_PERFECT: 100,
  BASE_SCORE_GREAT: 50,
  LANE_COUNT: 4,
};

// --- SILHUETAS DISTINTAS (16-BIT STYLE) ---

const KYRA_PIXELS = [
  "      BBBBBBBB      ",
  "    BBBBBBBBBBBB    ",
  "   BBBBssssssssBB   ",
  "   BBssseessseessB  ",
  "   BBssseessseessB  ",
  "   BBssssssssssssB  ",
  "    BssssmmsmmsmsB  ",
  "     PPPPPPPPPPPP   ",
  "    PPPPPPPPPPPPPP  ",
  "   PPPPPPPPPPPPPPPP ",
  "   PPPPPPWWWWWWPPPP ",
  "    PPPPPPPPPPPPPP  ",
  "     KKKKK  KKKKK   ",
  "     KKKKK  KKKKK   "
];

const NINJA_PIXELS = [
  "      nnnnnnnn      ",
  "     nnnnnnnnnn     ",
  "    nnnnppppnnnn    ",
  "    nnnpeeeepnnn    ",
  "    nnnppppppnnn    ",
  "     nnnnnnnnnn     ",
  "    GGGGGGGGGGGG    ",
  "   GGGGGGGGGGGGGG   ",
  "   GGGGppGGppGGGG   ",
  "   GGGGGGGGGGGGGG   ",
  "    GGGGGGGGGGGG    ",
  "     BBBB  BBBB     ",
  "     BBBB  BBBB     "
];

const BEAT_PIXELS = [
  "      YYYYYYYY      ",
  "     YYYYYYYYYY     ",
  "    YYssseesssYY    ",
  "    YYssseesssYY    ",
  "    YYssssssssYY    ",
  "     YssssmmmsY     ",
  "    CCCCCCCCCCCC    ",
  "   CCCCCCCCCCCCCC   ",
  "   CCCCBBBBBBCCCC   ",
  "   CCCCCCCCCCCCCC   ",
  "    CCCCCCCCCCCC    ",
  "     YYYY  YYYY     ",
  "     YYYY  YYYY     "
];

const MAGE_PIXELS = [
  "       HHHHHH       ",
  "      HHHHHHHH      ",
  "     HHssssssHH     ",
  "    HHssseessssH    ",
  "    HHssssssssssH   ",
  "     HssssmmmsH     ",
  "    WWWWWWWWWWWW    ",
  "   WWWWWWWWWWWWWW   ",
  "   WWWWGGGGGGWWWW   ",
  "   WWWWWWWWWWWWWW   ",
  "    WWWWWWWWWWWW    ",
  "     HHHH  HHHH     "
];

const ROBOT_PIXELS = [
  "      KKKKKKKK      ",
  "     KeeeeeeeeeK    ",
  "     KeeeeeeeeeK    ",
  "     KKKKKKKKKKK    ",
  "     KKKKKKKKKKK    ",
  "    WWWWWWWWWWWWW   ",
  "   WWWWWWWWWWWWWWW  ",
  "   WWWWBBBBBBWWWW   ",
  "   WWWWWWWWWWWWWWW  ",
  "    WWWWWWWWWWWWW   ",
  "     KKKK  KKKK     ",
  "     KKKK  KKKK     "
];

// --- ARTE DOS PERSONAGENS COM CORES MELHORADAS ---
const KYRA_IMG = createPixelSVG(KYRA_PIXELS, { 'B': '#000000', 's': '#ffdbac', 'e': '#00ffff', 'm': '#ff6b6b', 'P': '#ff0080', 'W': '#ffffff', 'K': '#1a1a1a' }, 20);
const SHADOW_IMG = createPixelSVG(NINJA_PIXELS, { 'n': '#2d3436', 'p': '#6c5ce7', 'e': '#a29bfe', 'G': '#341f97', 'B': '#000000' }, 20);
const BEAT_IMG = createPixelSVG(BEAT_PIXELS, { 'Y': '#feca57', 's': '#fcd6a4', 'e': '#2d3436', 'C': '#1dd1a1', 'B': '#222f3e' }, 20);
const VIVI_IMG = createPixelSVG(MAGE_PIXELS, { 'H': '#5f27cd', 's': '#fcd6a4', 'e': '#2d3436', 'W': '#341f97', 'G': '#ff9f43' }, 20);
const TURBO_IMG = createPixelSVG(ROBOT_PIXELS, { 'K': '#2d3436', 'e': '#0984e3', 'W': '#dfe6e9', 'B': '#74b9ff' }, 20);
const HEAVY_IMG = createPixelSVG(KYRA_PIXELS, { 'B': '#222f3e', 's': '#fcd6a4', 'e': '#ee5253', 'm': '#2d3436', 'P': '#576574', 'W': '#c8d6e5', 'K': '#000000' }, 20);
const NEON_IMG = createPixelSVG(ROBOT_PIXELS, { 'K': '#2d3436', 'e': '#00d2d3', 'W': '#f368e0', 'B': '#ff9ff3' }, 20);
const JAZZ_IMG = createPixelSVG(BEAT_PIXELS, { 'Y': '#ff9f43', 's': '#b2bec3', 'e': '#2d3436', 'C': '#e67e22', 'B': '#576574' }, 20);
const BLAZE_IMG = createPixelSVG(KYRA_PIXELS, { 'B': '#ff6b6b', 's': '#ffdbac', 'e': '#2d3436', 'm': '#000000', 'P': '#ee5253', 'W': '#ffffff', 'K': '#222f3e' }, 20);
const ZERO_IMG = createPixelSVG(ROBOT_PIXELS, { 'K': '#b2bec3', 'e': '#ee5253', 'W': '#ffffff', 'B': '#0984e3' }, 20);

export const CHARACTERS: Character[] = [
  { 
    id: 'kyra', name: 'KYRA', style: 'Neo-Tokyo Pop', country: 'Japan', color: '#ff0080', icon: '🌸', spriteIndex: 0,
    imageUrl: KYRA_IMG, faceUrl: KYRA_IMG,
    scenery: { background: 'linear-gradient(to bottom, #4d0026, #000)', elements: ['🌸', '✨', '🎀'], floorColor: '#ff0080', accentColor: '#ffffff' }
  },
  { 
    id: 'shadow', name: 'SHADOW', style: 'Stealth Trap', country: 'Cyborg City', color: '#6c5ce7', icon: '👤', spriteIndex: 1,
    imageUrl: SHADOW_IMG, faceUrl: SHADOW_IMG,
    scenery: { background: 'linear-gradient(to bottom, #1a1a2e, #000)', elements: ['🗡️', '💨', '🌑'], floorColor: '#6c5ce7', accentColor: '#a29bfe' }
  },
  { 
    id: 'beat', name: 'BEAT', style: 'Skate Punk', country: 'USA', color: '#00b894', icon: '🛹', spriteIndex: 2,
    imageUrl: BEAT_IMG, faceUrl: BEAT_IMG,
    scenery: { background: 'linear-gradient(to bottom, #002b1b, #000)', elements: ['🛹', '🎧', '🔥'], floorColor: '#00b894', accentColor: '#55efc4' }
  },
  { 
    id: 'vivi', name: 'VIVI', style: 'RPG Lo-Fi', country: 'Fantasia', color: '#fab1a0', icon: '🪄', spriteIndex: 3,
    imageUrl: VIVI_IMG, faceUrl: VIVI_IMG,
    scenery: { background: 'linear-gradient(to bottom, #2d132c, #000)', elements: ['🪄', '💎', '🌙'], floorColor: '#fab1a0', accentColor: '#ff7675' }
  },
  { 
    id: 'turbo', name: 'TURBO', style: 'Fast Eurobeat', country: 'Germany', color: '#0984e3', icon: '🏎️', spriteIndex: 4,
    imageUrl: TURBO_IMG, faceUrl: TURBO_IMG,
    scenery: { background: 'linear-gradient(to bottom, #001a33, #000)', elements: ['🏎️', '⛽', '🏁'], floorColor: '#0984e3', accentColor: '#74b9ff' }
  },
  { 
    id: 'heavy', name: 'HEAVY', style: 'Thrash Metal', country: 'Norway', color: '#d63031', icon: '🎸', spriteIndex: 5,
    imageUrl: HEAVY_IMG, faceUrl: HEAVY_IMG,
    scenery: { background: 'linear-gradient(to bottom, #2d0000, #000)', elements: ['🎸', '💀', '🔥'], floorColor: '#d63031', accentColor: '#ff7675' }
  },
  { 
    id: 'neon', name: 'NEON', style: 'Synthwave', country: 'Retro City', color: '#e84393', icon: '💾', spriteIndex: 6,
    imageUrl: NEON_IMG, faceUrl: NEON_IMG,
    scenery: { background: 'linear-gradient(to bottom, #2d002d, #000)', elements: ['📼', '🌇', '🕶️'], floorColor: '#e84393', accentColor: '#fd79a8' }
  },
  { 
    id: 'jazz', name: 'JAZZ CAT', style: 'Acid Jazz', country: 'France', color: '#e67e22', icon: '🎷', spriteIndex: 7,
    imageUrl: JAZZ_IMG, faceUrl: JAZZ_IMG,
    scenery: { background: 'linear-gradient(to bottom, #3d2305, #000)', elements: ['🎷', '🎹', '☕'], floorColor: '#e67e22', accentColor: '#fab1a0' }
  },
  { 
    id: 'blaze', name: 'BLAZE', style: 'J-Rock', country: 'Japan', color: '#ff7675', icon: '🎤', spriteIndex: 8,
    imageUrl: BLAZE_IMG, faceUrl: BLAZE_IMG,
    scenery: { background: 'linear-gradient(to bottom, #4d0000, #000)', elements: ['🎤', '⚡', '🌹'], floorColor: '#ff7675', accentColor: '#ffffff' }
  },
  { 
    id: 'zero', name: 'ZERO', style: 'Minimal Techno', country: 'Space', color: '#dfe6e9', icon: '🛰️', spriteIndex: 9,
    imageUrl: ZERO_IMG, faceUrl: ZERO_IMG,
    scenery: { background: 'linear-gradient(to bottom, #1e272e, #000)', elements: ['🛰️', '☄️', '🌌'], floorColor: '#dfe6e9', accentColor: '#b2bec3' }
  }
];
