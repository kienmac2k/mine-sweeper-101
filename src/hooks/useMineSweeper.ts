import { useCallback, useEffect, useState } from "react";
import { CellData, DIFFICULTY_SETTINGS, DifficultyLevel } from "../types";

interface UseMineSweeperReturn {
  board: CellData[][];
  gameOver: boolean;
  isWin: boolean;
  flagsPlaced: number;
  mineCount: number;
  remainingMines: number;
  secondsElapsed: number;
  difficulty: DifficultyLevel;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  attemptChordReveal: (row: number, col: number) => void;
  newGame: () => void;
  changeDifficulty: (difficulty: DifficultyLevel) => void;
}

export function useMineSweeper(): UseMineSweeperReturn {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("beginner");
  const [board, setBoard] = useState<CellData[][]>([]);
  const [mineLocations, setMineLocations] = useState<
    { row: number; col: number }[]
  >([]);
  const [firstClick, setFirstClick] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [flagsPlaced, setFlagsPlaced] = useState(0);
  const [revealedCells, setRevealedCells] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const settings = DIFFICULTY_SETTINGS[difficulty];
  const { rows, cols, mines: mineCount } = settings;
  const totalNonMineCells = rows * cols - mineCount;
  const remainingMines = mineCount - flagsPlaced;

  // Initialize timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (!gameOver && !firstClick) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameOver, firstClick]);

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard: CellData[][] = [];

    for (let row = 0; row < rows; row++) {
      newBoard[row] = [];
      for (let col = 0; col < cols; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
          row,
          col,
        };
      }
    }

    return newBoard;
  }, [rows, cols]);

  // Check if coordinates are valid
  const isValid = useCallback(
    (row: number, col: number): boolean => {
      return row >= 0 && row < rows && col >= 0 && col < cols;
    },
    [rows, cols]
  );

  // Place mines randomly, avoiding first clicked cell
  const placeMines = useCallback(
    (initialRow: number, initialCol: number) => {
      const safeRadius = 1;
      const newBoard = [...board];
      const newMineLocations: { row: number; col: number }[] = [];
      let minesToPlace = mineCount;

      while (minesToPlace > 0) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        // Check if the cell is within the safe radius of the initial click
        const isSafeZone =
          Math.abs(row - initialRow) <= safeRadius &&
          Math.abs(col - initialCol) <= safeRadius;

        // Don't place a mine in safe zone or if it's already a mine
        if (isSafeZone || newBoard[row][col].isMine) {
          continue;
        }

        newBoard[row][col].isMine = true;
        newMineLocations.push({ row, col });
        minesToPlace--;
      }

      setMineLocations(newMineLocations);

      // Calculate adjacent mines
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (newBoard[row][col].isMine) continue;

          let count = 0;
          // Check 8 neighbors
          for (let drow = -1; drow <= 1; drow++) {
            for (let dcol = -1; dcol <= 1; dcol++) {
              if (drow === 0 && dcol === 0) continue;

              const newRow = row + drow;
              const newCol = col + dcol;

              if (isValid(newRow, newCol) && newBoard[newRow][newCol].isMine) {
                count++;
              }
            }
          }

          newBoard[row][col].adjacentMines = count;
        }
      }

      setBoard(newBoard);
    },
    [board, mineCount, rows, cols, isValid]
  );

  // Reveal a cell
  const revealCell = useCallback(
    (row: number, col: number) => {
      if (!isValid(row, col) || gameOver) return;

      const newBoard = [...board];
      const cellData = newBoard[row][col];

      // Skip if already revealed or flagged
      if (cellData.isRevealed || cellData.isFlagged) return;

      // First click handling
      if (firstClick) {
        placeMines(row, col);
        setFirstClick(false);
      }

      // Reveal the cell
      cellData.isRevealed = true;

      // Mine clicked - game over
      if (cellData.isMine) {
        setGameOver(true);
        setIsWin(false);
      } else {
        // Increment revealed count
        setRevealedCells((prev) => prev + 1);

        // If it's a zero cell, reveal neighbors
        if (cellData.adjacentMines === 0) {
          for (let drow = -1; drow <= 1; drow++) {
            for (let dcol = -1; dcol <= 1; dcol++) {
              if (drow === 0 && dcol === 0) continue;

              const newRow = row + drow;
              const newCol = col + dcol;

              // Use setTimeout to prevent stack overflow on large boards
              setTimeout(() => {
                if (
                  isValid(newRow, newCol) &&
                  !newBoard[newRow][newCol].isRevealed &&
                  !newBoard[newRow][newCol].isFlagged
                ) {
                  revealCell(newRow, newCol);
                }
              }, 10);
            }
          }
        }
      }

      setBoard(newBoard);

      // Check win condition
      if (revealedCells + 1 === totalNonMineCells && !cellData.isMine) {
        setGameOver(true);
        setIsWin(true);

        // Flag all mines on win
        const updatedBoard = [...newBoard];
        mineLocations.forEach(({ row, col }) => {
          if (!updatedBoard[row][col].isFlagged) {
            updatedBoard[row][col].isFlagged = true;
            setFlagsPlaced((prev) => prev + 1);
          }
        });

        setBoard(updatedBoard);
      }
    },
    [
      board,
      firstClick,
      gameOver,
      isValid,
      mineLocations,
      placeMines,
      revealedCells,
      totalNonMineCells,
    ]
  );

  // Toggle flag on a cell
  const toggleFlag = useCallback(
    (row: number, col: number) => {
      if (!isValid(row, col) || gameOver) return;

      const newBoard = [...board];
      const cellData = newBoard[row][col];

      // Can only flag/unflag covered cells
      if (!cellData.isRevealed) {
        if (cellData.isFlagged) {
          // Unflag
          cellData.isFlagged = false;
          setFlagsPlaced((prev) => prev - 1);
        } else {
          // Flag
          cellData.isFlagged = true;
          setFlagsPlaced((prev) => prev + 1);
        }

        setBoard(newBoard);
      }
    },
    [board, gameOver, isValid]
  );

  // Attempt chord reveal - reveal neighbors if correct number of flags are placed
  const attemptChordReveal = useCallback(
    (row: number, col: number) => {
      if (!isValid(row, col) || gameOver) return;

      const cellData = board[row][col];

      // Only works on revealed, numbered cells
      if (!cellData.isRevealed || cellData.adjacentMines === 0) return;

      let adjacentFlags = 0;
      const neighborsToReveal: { row: number; col: number }[] = [];

      // Count adjacent flags and collect unrevealed neighbors
      for (let drow = -1; drow <= 1; drow++) {
        for (let dcol = -1; dcol <= 1; dcol++) {
          if (drow === 0 && dcol === 0) continue;

          const newRow = row + drow;
          const newCol = col + dcol;

          if (isValid(newRow, newCol)) {
            if (board[newRow][newCol].isFlagged) {
              adjacentFlags++;
            } else if (!board[newRow][newCol].isRevealed) {
              neighborsToReveal.push({ row: newRow, col: newCol });
            }
          }
        }
      }

      // If flag count matches the cell's number, reveal the unflagged neighbors
      if (adjacentFlags === cellData.adjacentMines) {
        neighborsToReveal.forEach(({ row, col }) => {
          if (
            isValid(row, col) &&
            !board[row][col].isRevealed &&
            !board[row][col].isFlagged
          ) {
            revealCell(row, col);
          }
        });
      }
    },
    [board, gameOver, isValid, revealCell]
  );

  // Start a new game
  const newGame = useCallback(() => {
    setBoard(initializeBoard());
    setMineLocations([]);
    setFirstClick(true);
    setGameOver(false);
    setIsWin(false);
    setFlagsPlaced(0);
    setRevealedCells(0);
    setSecondsElapsed(0);
  }, [initializeBoard]);

  // Change difficulty level
  const changeDifficulty = useCallback((newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
    // Reset the game with new settings
    setBoard([]);
    setMineLocations([]);
    setFirstClick(true);
    setGameOver(false);
    setIsWin(false);
    setFlagsPlaced(0);
    setRevealedCells(0);
    setSecondsElapsed(0);
  }, []);

  // Initialize board on first render or difficulty change
  useEffect(() => {
    setBoard(initializeBoard());
  }, [difficulty, initializeBoard]);

  return {
    board,
    gameOver,
    isWin,
    flagsPlaced,
    mineCount,
    remainingMines,
    secondsElapsed,
    difficulty,
    revealCell,
    toggleFlag,
    attemptChordReveal,
    newGame,
    changeDifficulty,
  };
}
