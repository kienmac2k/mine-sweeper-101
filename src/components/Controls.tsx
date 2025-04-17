import React from 'react';
import { 
  ControlsContainer, 
  DifficultyLabel, 
  DifficultySelect, 
  NewGameButton 
} from '../styles/GameStyles';
import { DifficultyLevel } from '../types';

interface ControlsProps {
  difficulty: DifficultyLevel;
  onNewGame: () => void;
  onChangeDifficulty: (difficulty: DifficultyLevel) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  difficulty, 
  onNewGame, 
  onChangeDifficulty 
}) => {
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeDifficulty(e.target.value as DifficultyLevel);
  };
  
  return (
    <ControlsContainer>
      <DifficultyLabel htmlFor="difficulty">Difficulty:</DifficultyLabel>
      <DifficultySelect 
        id="difficulty" 
        value={difficulty} 
        onChange={handleDifficultyChange}
      >
        <option value="beginner">Beginner (9x9, 10 Mines)</option>
        <option value="intermediate">Intermediate (16x16, 40 Mines)</option>
        <option value="expert">Expert (16x30, 99 Mines)</option>
      </DifficultySelect>
      <NewGameButton onClick={onNewGame}>New Game</NewGameButton>
    </ControlsContainer>
  );
}; 