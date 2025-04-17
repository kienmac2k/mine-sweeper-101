import styled from 'styled-components';

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f0f0f0;
  font-family: 'Press Start 2P', cursive;
`;

export const GameTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  background-color: #ddd;
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const DifficultyLabel = styled.label`
  font-size: 0.7rem;
`;

export const DifficultySelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px outset #bdbdbd;
  background-color: #e0e0e0;
  cursor: pointer;
  font-size: 0.7rem;
  font-family: 'Press Start 2P', cursive;
  transition: background-color 0.2s ease;
  
  &:active {
    border: 2px inset #bdbdbd;
    background-color: #bdbdbd;
  }
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const NewGameButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px outset #bdbdbd;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  font-size: 0.7rem;
  font-family: 'Press Start 2P', cursive;
  transition: background-color 0.2s ease;
  border-radius: 0.25rem;
  
  &:active {
    border: 2px inset #bdbdbd;
    background-color: #3a80d2;
  }
  
  &:hover {
    background-color: #5aa0f2;
  }
`;

export const GameInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  margin-bottom: 1rem;
  background-color: #ddd;
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
`;

export const MineCounter = styled.div`
  color: #e53935;
`;

export const Timer = styled.div`
  color: #1e88e5;
`;

export const GameBoardContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const GameBoard = styled.div<{ cols: number; rows: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 30px);
  grid-template-rows: repeat(${props => props.rows}, 30px);
  gap: 1px;
  border: 4px solid #757575;
  background-color: #bdbdbd;
  margin: 20px auto;
`;

export const Cell = styled.div<{ 
  isRevealed: boolean; 
  isFlagged: boolean; 
  isMine: boolean; 
  adjacentMines: number;
  gameOver: boolean;
  isIncorrectFlag: boolean;
}>`
  width: 30px;
  height: 30px;
  border: ${props => props.isRevealed 
    ? '1px solid #757575' 
    : '1px outset #bdbdbd'
  };
  background-color: ${props => {
    if (props.isRevealed && props.isMine) return 'red'; // Clicked mine
    if (props.isRevealed) return '#e0e0e0'; // Revealed cell
    if (props.gameOver && props.isMine && !props.isFlagged) return '#e0e0e0'; // Revealed mine at game over
    if (props.gameOver && props.isIncorrectFlag) return '#e0e0e0'; // Incorrect flag at game over
    return '#bdbdbd'; // Default covered cell
  }};
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  cursor: ${props => props.isRevealed || props.gameOver ? 'default' : 'pointer'};
  user-select: none;
  color: ${props => {
    if (!props.isRevealed) return 'black';
    
    switch (props.adjacentMines) {
      case 1: return 'blue';
      case 2: return 'green';
      case 3: return 'red';
      case 4: return 'purple';
      case 5: return 'maroon';
      case 6: return 'turquoise';
      case 7: return 'black';
      case 8: return 'gray';
      default: return 'black';
    }
  }};
`;

export const MessageBox = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 1.2rem;
  z-index: 100;
  text-align: center;
`; 