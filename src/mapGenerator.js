// CGD-3: tile-based map generator.
// Tile types: "wall" (blocks movement), "floor" (walkable), "stairs" (exit to next floor).

export const TILE = {
  WALL: "wall",
  FLOOR: "floor",
  STAIRS: "stairs",
};

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

  // Place stairs on a random interior tile.
  const sx = 1 + Math.floor(Math.random() * (width - 2));
  const sy = 1 + Math.floor(Math.random() * (height - 2));
  grid[sy][sx] = TILE.STAIRS;

  return grid;
}
