// CGD-41: swipe gesture input — touchstart/touchend mapped to directional movement.
// Works in viewport coordinates; direction detection is unaffected by CSS scale.
import { tryMovePlayer } from "./player.js";

export function bindTouchInput(state, onTurn) {
  const el = document.getElementById("game-container");
  let startX = 0;
  let startY = 0;

  el.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    e.preventDefault();
  }, { passive: false });

  el.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    const dir = swipeToDir(dx, dy, 20);
    if (dir) {
      state.lastHits = [];
      const acted = tryMovePlayer(state, dir[0], dir[1]);
      if (acted && typeof onTurn === "function") onTurn(state);
    }
    e.preventDefault();
  }, { passive: false });
}

// Returns [dx, dy] for the dominant axis, or null if the swipe is below threshold.
function swipeToDir(dx, dy, threshold) {
  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return null;
  return Math.abs(dx) >= Math.abs(dy)
    ? (dx > 0 ? [1, 0] : [-1, 0])
    : (dy > 0 ? [0, 1] : [0, -1]);
}
