export enum Suit {
  Man = 'm', // Characters
  Pin = 'p', // Circles/Dots
  Sou = 's', // Bamboo
  Honor = 'z' // Winds/Dragons
}

export interface TileData {
  id: string; // Unique ID for React keys
  suit: Suit;
  value: number; // 1-9 for suits, 1-7 for honors (ESWNPFC)
  symbol: string; // The specific string identifier e.g. "1m"
}

export interface AnalysisResult {
  waiting: string[]; // List of tile symbols e.g. ["1m", "4m"]
  isWin: boolean;
}

export type GeminiStatus = 'idle' | 'loading' | 'success' | 'error';
