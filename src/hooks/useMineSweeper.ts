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

      return newBoard;
    },
    [board, mineCount, rows, cols, isValid]
  );

  // Function to reveal cells recursively (for zero cells)
  const revealZeroCells = useCallback((newBoard: CellData[][], row: number, col: number) => {
    if (!isValid(row, col)) return 0;
    
    const cellData = newBoard[row][col];
    if (cellData.isRevealed || cellData.isFlagged) return 0;
    
    // Reveal this cell
    cellData.isRevealed = true;
    let newReveals = 1;
    
    // Only recurse for zero cells
    if (cellData.adjacentMines === 0) {
      for (let drow = -1; drow <= 1; drow++) {
        for (let dcol = -1; dcol <= 1; dcol++) {
          if (drow === 0 && dcol === 0) continue;
          
          const newRow = row + drow;
          const newCol = col + dcol;
          
          if (isValid(newRow, newCol)) {
            newReveals += revealZeroCells(newBoard, newRow, newCol);
          }
        }
      }
    }
    
    return newReveals;
  }, [isValid]);

  // Reveal a cell
  const revealCell = useCallback(
    (row: number, col: number) => {
      if (!isValid(row, col) || gameOver) return;

      // Create a new board copy
      const newBoard = [...board.map(row => [...row])]; 
      const cellData = newBoard[row][col];

      // Skip if already revealed or flagged
      if (cellData.isRevealed || cellData.isFlagged) return;

      // First click handling
      if (firstClick) {
        // Place mines and get the updated board
        const boardWithMines = placeMines(row, col);
        // Set first click to false to start the timer
        setFirstClick(false);
        
        // Reveal the first cell and potentially cascade
        let revealed = 0;
        boardWithMines[row][col].isRevealed = true;
        revealed++;
        
        // If it's a zero cell, reveal neighbors
        if (boardWithMines[row][col].adjacentMines === 0) {
          for (let drow = -1; drow <= 1; drow++) {
            for (let dcol = -1; dcol <= 1; dcol++) {
              if (drow === 0 && dcol === 0) continue;
              
              const newRow = row + drow;
              const newCol = col + dcol;
              
              if (isValid(newRow, newCol)) {
                revealed += revealZeroCells(boardWithMines, newRow, newCol);
              }
            }
          }
        }
        
        setBoard(boardWithMines);
        setRevealedCells(revealed);
        
        // Check if won on first click (unlikely but possible)
        if (revealed === totalNonMineCells) {
          setGameOver(true);
          setIsWin(true);
          
          // Flag all mines
          mineLocations.forEach(({ row, col }) => {
            if (!boardWithMines[row][col].isFlagged) {
              boardWithMines[row][col].isFlagged = true;
            }
          });
          
          setFlagsPlaced(mineCount);
          setBoard(boardWithMines);
        }
        
        return;
      }

      // Reveal logic for subsequent clicks
      if (cellData.isMine) {
        // Mine clicked - game over
        cellData.isRevealed = true;
        setBoard(newBoard);
        setGameOver(true);
        setIsWin(false);
        return;
      }
      
      // Reveal the cell and count newly revealed cells
      let newlyRevealed = 0;
      cellData.isRevealed = true;
      newlyRevealed++;
      
      // If it's a zero cell, reveal neighbors
      if (cellData.adjacentMines === 0) {
        for (let drow = -1; drow <= 1; drow++) {
          for (let dcol = -1; dcol <= 1; dcol++) {
            if (drow === 0 && dcol === 0) continue;
            
            const newRow = row + drow;
            const newCol = col + dcol;
            
            if (isValid(newRow, newCol)) {
              newlyRevealed += revealZeroCells(newBoard, newRow, newCol);
            }
          }
        }
      }
      
      const totalRevealed = revealedCells + newlyRevealed;
      setRevealedCells(totalRevealed);
      setBoard(newBoard);
      
      // Check win condition
      if (totalRevealed >= totalNonMineCells) {
        setGameOver(true);
        setIsWin(true);
        
        // Flag all mines on win
        const updatedBoard = [...newBoard];
        let newFlags = 0;
        
        mineLocations.forEach(({ row, col }) => {
          if (!updatedBoard[row][col].isFlagged) {
            updatedBoard[row][col].isFlagged = true;
            newFlags++;
          }
        });
        
        setFlagsPlaced(flagsPlaced + newFlags);
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
      flagsPlaced,
      mineCount,
      revealZeroCells
    ]
  );

  // Toggle flag on a cell
  const toggleFlag = useCallback(
    (row: number, col: number) => {
      if (!isValid(row, col) || gameOver) return;

      const newBoard = [...board.map(row => [...row])];
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
