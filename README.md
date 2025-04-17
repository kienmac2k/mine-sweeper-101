# Minesweeper

A classic Minesweeper game built with React, TypeScript, and Vite.

## Live Demo

You can play the game online at: [https://username.github.io/mine-sweeper-101](https://username.github.io/mine-sweeper-101)

## Features

- Three difficulty levels: Beginner, Intermediate, and Expert
- Classic Minesweeper gameplay with:
  - Left-click to reveal cells
  - Right-click to place/remove flags
  - Chording (clicking both mouse buttons) to reveal neighbors
- Timer and mine counter
- First-click safety (never hit a mine on first click)
- Win/lose detection with game-over screen

## Technologies Used

- React 18
- TypeScript
- Vite
- Styled Components
- GitHub Pages for deployment

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/username/mine-sweeper-101.git
cd mine-sweeper-101
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```
npm run build
```

## How to Play

- **Left-click** on a cell to reveal it
- **Right-click** on a cell to place or remove a flag
- **Left + Right click** (or middle click) on a revealed number to reveal all adjacent cells if the correct number of flags are placed
- The numbers indicate how many mines are adjacent to that cell
- Flag all mines to win the game

## License

MIT
