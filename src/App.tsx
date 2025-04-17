import { useEffect } from "react";
import { Controls } from "./components/Controls";
import { GameBoard } from "./components/GameBoard";
import { GameInfo } from "./components/GameInfo";
import { MessageBox } from "./components/MessageBox";
import { useMineSweeper } from "./hooks/useMineSweeper";
import {
  GameBoardContainer,
  GameContainer,
  GameTitle,
} from "./styles/GameStyles";

function App() {
  const {
    board,
    gameOver,
    isWin,
    remainingMines,
    secondsElapsed,
    difficulty,
    revealCell,
    toggleFlag,
    attemptChordReveal,
    newGame,
    changeDifficulty,
  } = useMineSweeper();

  // Load Google font
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Determine message to display
  const getMessage = () => {
    if (!gameOver) return null;
    return isWin ? "You Win! 🎉" : "Game Over! 💥";
  };

  return (
    <GameContainer>
      <GameTitle>Minesweeper</GameTitle>

      <Controls
        difficulty={difficulty}
        onNewGame={newGame}
        onChangeDifficulty={changeDifficulty}
      />

      <GameInfo
        remainingMines={remainingMines}
        secondsElapsed={secondsElapsed}
      />

      <GameBoardContainer>
        <GameBoard
          board={board}
          gameOver={gameOver}
          onRevealCell={revealCell}
          onToggleFlag={toggleFlag}
          onChordReveal={attemptChordReveal}
        />
      </GameBoardContainer>

      <MessageBox message={getMessage()} />
    </GameContainer>
  );
}

export default App;
