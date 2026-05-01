// CGD-3: tile-based map generator.
// Tile types: "wall" (blocks movement), "floor" (walkable), "stairs" (exit to next floor).
// CGD-20: "chest" — lootable container, placed 1–3 per floor.

export const TILE = {
  WALL: "wall",
  FLOOR: "floor",
  STAIRS: "stairs",
  CHEST: "chest",
};

// Player always spawns at (2, 2) — chests and stairs must avoid this position.
const PLAYER_START_X = 2;
const PLAYER_START_Y = 2;

export function generateRoom(width, height) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const isBoundary = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      row.push(isBoundary ? TILE.WALL : TILE.FLOOR);
    }
    grid.push(row);
  }

  // Place stairs on a random interior tile (not the player start).
  let sx, sy;
  do {
    sx = 1 + Math.floor(Math.random() * (width - 2));
    sy = 1 + Math.floor(Math.random() * (height - 2));
  } while (sx === PLAYER_START_X && sy === PLAYER_START_Y);
  grid[sy][sx] = TILE.STAIRS;

  // Place 1–3 chests on random interior floor tiles.
  const chestCount = 1 + Math.floor(Math.random() * 3); // 1, 2, or 3
  let placed = 0;
  let attempts = 0;
  while (placed < chestCount && attempts < 200) {
    attempts++;
    const cx = 1 + Math.floor(Math.random() * (width - 2));
    const cy = 1 + Math.floor(Math.random() * (height - 2));
    if (grid[cy][cx] === TILE.FLOOR) {
      grid[cy][cx] = TILE.CHEST;
      placed++;
    }
  }

  return grid;
}
