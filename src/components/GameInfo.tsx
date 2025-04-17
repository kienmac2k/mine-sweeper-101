import React from 'react';
import { GameInfoContainer, MineCounter, Timer } from '../styles/GameStyles';

interface GameInfoProps {
  remainingMines: number;
  secondsElapsed: number;
}

export const GameInfo: React.FC<GameInfoProps> = ({ 
  remainingMines, 
  secondsElapsed 
}) => {
  return (
    <GameInfoContainer>
      <MineCounter>Mines: {remainingMines}</MineCounter>
      <Timer>Time: {secondsElapsed}</Timer>
    </GameInfoContainer>
  );
}; 