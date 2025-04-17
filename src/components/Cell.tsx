import React from 'react';
import { Cell as StyledCell } from '../styles/GameStyles';
import { CellData } from '../types';

interface CellProps {
  data: CellData;
  gameOver: boolean;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
}

export const Cell: React.FC<CellProps> = ({ 
  data, 
  gameOver, 
  onReveal, 
  onFlag, 
  onChord 
}) => {
  const { row, col, isMine, isRevealed, isFlagged, adjacentMines } = data;
  
  // Determine if this is an incorrect flag (for game over state)
  const isIncorrectFlag = isFlagged && !isMine;
  
  // Handle left click
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gameOver && !isFlagged) {
      onReveal(row, col);
    }
  };
  
  // Handle right click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gameOver) {
      onFlag(row, col);
    }
  };
  
  // Handle multiple button click for chord action
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.buttons === 3 && !gameOver) { // Left + right button pressed
      onChord(row, col);
    }
  };
  
  // Determine cell content based on state
  const getCellContent = () => {
    if (isFlagged) {
      return '🚩';
    }
    
    if (isRevealed) {
      if (isMine) {
        return '💣';
      }
      
      return adjacentMines > 0 ? adjacentMines : '';
    }
    
    if (gameOver) {
      if (isMine && !isFlagged) {
        return '💣';
      }
      
      if (isIncorrectFlag) {
        return '❌';
      }
    }
    
    return '';
  };
  
  return (
    <StyledCell
      isRevealed={isRevealed}
      isFlagged={isFlagged}
      isMine={isMine}
      adjacentMines={adjacentMines}
      gameOver={gameOver}
      isIncorrectFlag={isIncorrectFlag}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
    >
      {getCellContent()}
    </StyledCell>
  );
}; 