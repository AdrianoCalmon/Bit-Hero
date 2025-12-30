
import { SongMetadata, Note } from './types';

/**
 * Gerador Determinístico de Padrões
 * Cria notas baseadas em uma seed fixa para cada música.
 */
const generatePattern = (id: number, seed: number, lengthMs: number, density: number): Note[] => {
  const notes: Note[] = [];
  // densidade: 1 (fácil) a 6 (difícil)
  const baseSpacing = 650 - (density * 75); 
  
  for (let time = 2000; time < lengthMs; ) {
    // Verificação determinística para acordes (duas notas simultâneas)
    const chordFactor = Math.abs(Math.sin(time * seed * 0.77 + id));
    const isChord = chordFactor > (0.94 - (density * 0.04));
    
    // Escolha da pista baseada no tempo e seed
    const lane1 = Math.floor(Math.abs(Math.sin(time * seed + id)) * 4);
    
    notes.push({
      id: `s${id}-n${time}-1`,
      lane: lane1,
      time: Math.floor(time),
      hit: false,
      missed: false
    });

    // Se for um acorde e a densidade permitir, adiciona uma segunda nota
    if (isChord && density >= 2) {
      const lane2 = (lane1 + 1 + Math.floor(chordFactor * 2)) % 4;
      notes.push({
        id: `s${id}-n${time}-2`,
        lane: lane2,
        time: Math.floor(time),
        hit: false,
        missed: false
      });
    }

    // Avança o tempo com variação rítmica (síncope) para não ser monótono
    const variation = Math.sin(time * 0.005 + seed) * (baseSpacing * 0.45);
    const nextStep = baseSpacing + variation;
    time += Math.max(130, nextStep);
  }
  return notes;
};

export const EXCLUSIVE_SONGS: SongMetadata[] = [
  // --- ANOS 80: NEON & SYNTH (1-10) ---
  { title: "NEON OVERDRIVE", genre: "Synthwave", difficulty: "EASY", notes: generatePattern(1, 1.5, 125000, 1.2) },
  { title: "VHS DREAMS", genre: "Retrowave", difficulty: "EASY", notes: generatePattern(2, 0.4, 130000, 1.0) },
  { title: "ARCADE NIGHTS", genre: "Chiptune", difficulty: "MEDIUM", notes: generatePattern(3, 2.1, 140000, 2.5) },
  { title: "DIGITAL LOVE", genre: "New Wave", difficulty: "MEDIUM", notes: generatePattern(4, 0.9, 135000, 2.2) },
  { title: "ELECTRIC BLUE", genre: "80s Pop", difficulty: "EASY", notes: generatePattern(5, 3.3, 145000, 1.5) },
  { title: "CASSETTE TAPE", genre: "Lo-Fi 80s", difficulty: "EASY", notes: generatePattern(6, 1.1, 120000, 1.1) },
  { title: "RADICAL RIDE", genre: "Synth Rock", difficulty: "HARD", notes: generatePattern(7, 4.5, 150000, 3.8) },
  { title: "MIDNIGHT CITY", genre: "Outrun", difficulty: "MEDIUM", notes: generatePattern(8, 0.7, 160000, 2.4) },
  { title: "LASER TAG", genre: "Electro Pop", difficulty: "MEDIUM", notes: generatePattern(9, 2.5, 128000, 2.8) },
  { title: "MIAMI HEAT", genre: "Vaporwave", difficulty: "EASY", notes: generatePattern(10, 0.2, 142000, 1.3) },
  
  // --- ANOS 80: ROCK & METAL (11-20) ---
  { title: "THRASH ATTACK", genre: "Thrash Metal", difficulty: "HARD", notes: generatePattern(11, 6.6, 175000, 5.2) },
  { title: "GLAM GLORY", genre: "Hair Metal", difficulty: "MEDIUM", notes: generatePattern(12, 1.8, 155000, 2.9) },
  { title: "SPEED DEMON", genre: "Speed Metal", difficulty: "HARD", notes: generatePattern(13, 7.2, 180000, 5.5) },
  { title: "IRON FIST", genre: "Heavy Metal", difficulty: "HARD", notes: generatePattern(14, 5.1, 165000, 4.2) },
  { title: "ARENA ROCK", genre: "Hard Rock", difficulty: "MEDIUM", notes: generatePattern(15, 2.9, 170000, 3.1) },
  { title: "PUNK SPIRIT", genre: "80s Punk", difficulty: "MEDIUM", notes: generatePattern(16, 4.4, 130000, 3.5) },
  { title: "DARK WAVE", genre: "Gothic Rock", difficulty: "EASY", notes: generatePattern(17, 0.6, 148000, 1.8) },
  { title: "REBEL YELL", genre: "Classic Rock", difficulty: "MEDIUM", notes: generatePattern(18, 3.7, 152000, 2.7) },
  { title: "SHREDDER", genre: "Guitar Shred", difficulty: "HARD", notes: generatePattern(19, 8.8, 162000, 5.8) },
  { title: "VINTAGE VINYL", genre: "Classic Pop", difficulty: "EASY", notes: generatePattern(20, 1.4, 138000, 1.6) },

  // --- ANOS 90: GRUNGE & ALTERNATIVO (21-30) ---
  { title: "SEATTLE RAIN", genre: "Grunge", difficulty: "MEDIUM", notes: generatePattern(21, 2.3, 168000, 2.6) },
  { title: "FUZZY FEELING", genre: "Shoegaze", difficulty: "EASY", notes: generatePattern(22, 0.5, 172000, 1.9) },
  { title: "BRITPOP BEAT", genre: "Britpop", difficulty: "MEDIUM", notes: generatePattern(23, 1.9, 158000, 2.4) },
  { title: "TEEN SPIRIT", genre: "Grunge", difficulty: "MEDIUM", notes: generatePattern(24, 3.1, 164000, 3.2) },
  { title: "INDIE ANTHEM", genre: "Alt Rock", difficulty: "MEDIUM", notes: generatePattern(25, 2.8, 154000, 2.8) },
  { title: "SKATER BOY", genre: "Pop Punk", difficulty: "HARD", notes: generatePattern(26, 5.5, 146000, 4.0) },
  { title: "GARAGE BAND", genre: "Lo-Fi Rock", difficulty: "MEDIUM", notes: generatePattern(27, 4.2, 132000, 3.3) },
  { title: "POST PUNKED", genre: "Post-Punk", difficulty: "MEDIUM", notes: generatePattern(28, 3.9, 144000, 2.9) },
  { title: "METAL CORE", genre: "Nu-Metal", difficulty: "HARD", notes: generatePattern(29, 6.1, 178000, 4.8) },
  { title: "INDUSTRIAL AGE", genre: "Industrial", difficulty: "HARD", notes: generatePattern(30, 7.7, 180000, 5.1) },

  // --- ANOS 90: DANCE & RAVE (31-40) ---
  { title: "EURO BEATDOWN", genre: "Eurodance", difficulty: "HARD", notes: generatePattern(31, 8.2, 160000, 4.5) },
  { title: "ACID TRIP", genre: "Acid House", difficulty: "MEDIUM", notes: generatePattern(32, 4.8, 150000, 3.0) },
  { title: "RAVE ON", genre: "Techno", difficulty: "HARD", notes: generatePattern(33, 9.1, 170000, 5.4) },
  { title: "CLUB CLASSIC", genre: "House", difficulty: "MEDIUM", notes: generatePattern(34, 3.5, 142000, 2.6) },
  { title: "DREAM TRANCE", genre: "Trance", difficulty: "EASY", notes: generatePattern(35, 1.2, 180000, 1.5) },
  { title: "HYPER ACTIVE", genre: "Hardcore", difficulty: "HARD", notes: generatePattern(36, 10.0, 155000, 6.2) },
  { title: "CYBER SOUL", genre: "IDM", difficulty: "HARD", notes: generatePattern(37, 6.8, 165000, 4.7) },
  { title: "URBAN BEATS", genre: "Trip Hop", difficulty: "EASY", notes: generatePattern(38, 0.3, 152000, 1.4) },
  { title: "LIQUID GOLD", genre: "Liquid DnB", difficulty: "MEDIUM", notes: generatePattern(39, 4.1, 148000, 3.4) },
  { title: "JUNGLE FEVER", genre: "Jungle", difficulty: "HARD", notes: generatePattern(40, 7.4, 158000, 5.2) },

  // --- ANOS 90: GROOVE & MISC (41-50) ---
  { title: "OLD SCHOOL", genre: "Boom Bap", difficulty: "EASY", notes: generatePattern(41, 0.8, 140000, 1.6) },
  { title: "FUNK ROCKER", genre: "Funk Rock", difficulty: "MEDIUM", notes: generatePattern(42, 3.4, 150000, 3.1) },
  { title: "G-FUNK ERA", genre: "G-Funk", difficulty: "EASY", notes: generatePattern(43, 0.5, 162000, 1.3) },
  { title: "JAZZY VIBES", genre: "Acid Jazz", difficulty: "MEDIUM", notes: generatePattern(44, 2.6, 156000, 2.2) },
  { title: "LATIN HEAT", genre: "Latin Pop", difficulty: "MEDIUM", notes: generatePattern(45, 4.9, 144000, 2.7) },
  { title: "R&B GROOVE", genre: "90s R&B", difficulty: "EASY", notes: generatePattern(46, 1.3, 168000, 1.5) },
  { title: "SKA ATTACK", genre: "Ska Punk", difficulty: "HARD", notes: generatePattern(47, 6.2, 138000, 4.1) },
  { title: "POP WORLD", genre: "Teen Pop", difficulty: "EASY", notes: generatePattern(48, 1.7, 132000, 1.8) },
  { title: "PIXEL PALACE", genre: "Chiptune Pop", difficulty: "MEDIUM", notes: generatePattern(49, 2.3, 150000, 2.5) },
  { title: "FINAL BOSS", genre: "8-Bit Epic", difficulty: "HARD", notes: generatePattern(50, 9.9, 180000, 6.5) },
];
