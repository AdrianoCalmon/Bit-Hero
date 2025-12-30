
export enum GameState {
  MENU = 'MENU',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  RESULTS = 'RESULTS'
}

export interface SceneryConfig {
  background: string;
  elements: string[];
  floorColor: string;
  accentColor: string;
}

export interface Character {
  id: string;
  name: string;
  style: string;
  country: string;
  color: string;
  icon: string;
  spriteIndex: number;
  scenery: SceneryConfig;
  imageUrl: string; // Full body image
  faceUrl: string;   // Face/Portrait icon
}

export interface Note {
  id: string;
  lane: number; // 0, 1, 2, 3
  time: number; // Time in ms when hit occurs
  hit: boolean;
  missed: boolean;
}

export interface SongMetadata {
  title: string;
  genre: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  notes: Note[];
}

export interface GameScore {
  score: number;
  combo: number;
  maxCombo: number;
  perfect: number;
  great: number;
  miss: number;
}
