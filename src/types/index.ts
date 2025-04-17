export interface CellData {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  row: number;
  col: number;
}

export interface GameSettings {
  rows: number;
  cols: number;
  mines: number;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'expert';

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, GameSettings> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
}; 