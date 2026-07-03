export type TileData = {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerging?: boolean;
};

export type BoardState = (TileData | null)[];

let tileIdCounter = 0;
export const generateId = () => `tile-${tileIdCounter++}`;

export const getEmptyCells = (board: BoardState) => {
  const empty: number[] = [];
  board.forEach((tile, index) => {
    if (tile === null) empty.push(index);
  });
  return empty;
};

export const addRandomTile = (board: BoardState): BoardState => {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return board;

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const newBoard = [...board];
  newBoard[randomCell] = {
    id: generateId(),
    value,
    row: Math.floor(randomCell / 4),
    col: randomCell % 4,
    isNew: true,
  };
  return newBoard;
};

export const getInitialBoard = (): BoardState => {
  let board: BoardState = Array(16).fill(null);
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

export const slideLeft = (board: BoardState): { newBoard: BoardState; score: number; moved: boolean } => {
  let score = 0;
  let moved = false;
  const newBoard: BoardState = Array(16).fill(null);

  for (let r = 0; r < 4; r++) {
    const rowTiles = [];
    for (let c = 0; c < 4; c++) {
      const tile = board[r * 4 + c];
      if (tile) rowTiles.push({ ...tile, isNew: false, isMerging: false });
    }

    const mergedTiles = [];
    for (let i = 0; i < rowTiles.length; i++) {
      if (i < rowTiles.length - 1 && rowTiles[i].value === rowTiles[i + 1].value) {
        mergedTiles.push({ ...rowTiles[i], value: rowTiles[i].value * 2, isMerging: true, id: generateId() });
        score += rowTiles[i].value * 2;
        i++;
      } else {
        mergedTiles.push(rowTiles[i]);
      }
    }

    for (let c = 0; c < 4; c++) {
      if (c < mergedTiles.length) {
        newBoard[r * 4 + c] = { ...mergedTiles[c], row: r, col: c };
        if (mergedTiles[c].col !== c || mergedTiles[c].row !== r || mergedTiles[c].isMerging) {
          moved = true;
        }
      }
    }
  }

  return { newBoard, score, moved };
};

const rotateRight = (board: BoardState): BoardState => {
  const newBoard: BoardState = Array(16).fill(null);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const tile = board[r * 4 + c];
      if (tile) {
        const newR = c, newC = 3 - r;
        newBoard[newR * 4 + newC] = { ...tile, row: newR, col: newC };
      }
    }
  return newBoard;
};

const rotateLeft = (board: BoardState): BoardState => {
  const newBoard: BoardState = Array(16).fill(null);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const tile = board[r * 4 + c];
      if (tile) {
        const newR = 3 - c, newC = r;
        newBoard[newR * 4 + newC] = { ...tile, row: newR, col: newC };
      }
    }
  return newBoard;
};

export const slideRight = (board: BoardState) => {
  let rotated = rotateRight(rotateRight(board));
  const result = slideLeft(rotated);
  result.newBoard = rotateLeft(rotateLeft(result.newBoard));
  return result;
};

export const slideUp = (board: BoardState) => {
  let rotated = rotateLeft(board);
  const result = slideLeft(rotated);
  result.newBoard = rotateRight(result.newBoard);
  return result;
};

export const slideDown = (board: BoardState) => {
  let rotated = rotateRight(board);
  const result = slideLeft(rotated);
  result.newBoard = rotateLeft(result.newBoard);
  return result;
};

export const checkWin = (board: BoardState) => board.some((tile) => tile && tile.value === 2048);

export const checkLoss = (board: BoardState) => {
  if (getEmptyCells(board).length > 0) return false;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const tile = board[r * 4 + c]!;
      if (c < 3 && board[r * 4 + c + 1]?.value === tile.value) return false;
      if (r < 3 && board[(r + 1) * 4 + c]?.value === tile.value) return false;
    }
  return true;
};