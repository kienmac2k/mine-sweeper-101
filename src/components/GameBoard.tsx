import React from 'react';
import { GameBoard as StyledGameBoard } from '../styles/GameStyles';
import { Cell } from './Cell';
import { CellData } from '../types';

interface GameBoardProps {
  board: CellData[][];
  gameOver: boolean;
  onRevealCell: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
  onChordReveal: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  gameOver, 
  onRevealCell, 
  onToggleFlag, 
  onChordReveal 
}) => {
  // Only render if we have a board
  if (!board.length) return null;
  
  const rows = board.length;
  const cols = board[0].length;
  
  return (
    <StyledGameBoard rows={rows} cols={cols}>
      {board.map((row, rowIndex) => 
        row.map((cellData, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            data={cellData}
            gameOver={gameOver}
            onReveal={onRevealCell}
            onFlag={onToggleFlag}
            onChord={onChordReveal}
          />
        ))
      )}
    </StyledGameBoard>
  );
}; 