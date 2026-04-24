// CGD-7: enemy turn logic — each enemy moves one step toward the player.
// CGD-8: attacks the player if adjacent instead of moving.
import { canMoveTo, getEnemyAt } from "./gameState.js";
import { attack } from "./combat.js";

export function doEnemyTurns(state) {
  const { player, entities } = state;
  for (const e of entities) {
    if (e.type !== "enemy") continue;

    const dx = player.x - e.x;
    const dy = player.y - e.y;

    // Prefer the axis with greater distance; try both in order.
    const moves = Math.abs(dx) >= Math.abs(dy)
      ? [[Math.sign(dx), 0], [0, Math.sign(dy)]]
      : [[0, Math.sign(dy)], [Math.sign(dx), 0]];

    for (const [mx, my] of moves) {
      if (mx === 0 && my === 0) continue;
      const nx = e.x + mx;
      const ny = e.y + my;

      // Attack if the step lands on the player.
      if (nx === player.x && ny === player.y) {
        attack(e, player);
        state.lastHits.push({ x: player.x, y: player.y });
        e.facing = mx > 0 ? "right" : mx < 0 ? "left" : my < 0 ? "up" : "down";
        e.step++;
        break;
      }

      // Move if the tile is walkable and not already occupied by another enemy.
      if (canMoveTo(state, nx, ny) && !getEnemyAt(state, nx, ny)) {
        e.x = nx;
        e.y = ny;
        e.facing = mx > 0 ? "right" : mx < 0 ? "left" : my < 0 ? "up" : "down";
        e.step++;
        break;
      }
    }
  }
}
