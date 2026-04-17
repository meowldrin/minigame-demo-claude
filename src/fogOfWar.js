// CGD-11: fog of war — tracks which tiles are visible and which have been explored.

const SIGHT_RADIUS = 5;

// Creates a fog state for a room of the given dimensions.
// visible: currently lit (within sight radius this turn)
// explored: ever seen by the player
export function createFog(width, height) {
  const visible = Array.from({ length: height }, () => Array(width).fill(false));
  const explored = Array.from({ length: height }, () => Array(width).fill(false));
  return { visible, explored };
}

// Resets visibility and recomputes which tiles are within SIGHT_RADIUS of the player.
// No line-of-sight calculation — pure radius check.
export function updateFog(fog, playerX, playerY) {
  const height = fog.visible.length;
  const width = fog.visible[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - playerX;
      const dy = y - playerY;
      const inSight = Math.sqrt(dx * dx + dy * dy) <= SIGHT_RADIUS;
      fog.visible[y][x] = inSight;
      if (inSight) fog.explored[y][x] = true;
    }
  }
}
