export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface GameStats {
  score: number;
  maxCombo: number;
  hits: number;
  misses: number;
  accuracy: number;
}

export interface NumberItem {
  value: number;
  id: number;
  isTarget: boolean; // True if 6 or 7
}

export interface AICommentary {
  title: string;
  message: string;
}