// CGD-4: player actions — keyboard input and movement with collision.
// CGD-8: bumping into an enemy attacks it instead of moving.
import { canMoveTo, getEnemyAt } from "./gameState.js";
import { attack } from "./combat.js";

const KEY_DIRS = {
  ArrowUp: [0, -1], w: [0, -1], W: [0, -1],
  ArrowDown: [0, 1], s: [0, 1], S: [0, 1],
  ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
  ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
};

export function tryMovePlayer(state, dx, dy) {
  const { player } = state;
  if (!player) return false;
  const nx = player.x + dx;
  const ny = player.y + dy;

  const enemy = getEnemyAt(state, nx, ny);
  if (enemy) {
    attack(player, enemy);
    state.turn += 1;
    return true;
  }

  if (!canMoveTo(state, nx, ny)) return false;
  player.x = nx;
  player.y = ny;
  state.turn += 1;
  return true;
}

export function bindPlayerInput(state, onTurn) {
  window.addEventListener("keydown", (e) => {
    const dir = KEY_DIRS[e.key];
    if (!dir) return;
    e.preventDefault();
    const acted = tryMovePlayer(state, dir[0], dir[1]);
    if (acted && typeof onTurn === "function") onTurn(state);
  });
}
