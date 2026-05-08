// CGD-42: virtual D-pad — four directional buttons + inventory toggle.
// Fires on touchstart for zero-delay response on mobile.
import { tryMovePlayer } from "./player.js";

const DIRS = {
  "dpad-up":    [0, -1],
  "dpad-left":  [-1, 0],
  "dpad-right": [1, 0],
  "dpad-down":  [0, 1],
};

export function bindDpad(state, onTurn, openInventory) {
  for (const [id, dir] of Object.entries(DIRS)) {
    const btn = document.getElementById(id);
    if (!btn) continue;
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      state.lastHits = [];
      const acted = tryMovePlayer(state, dir[0], dir[1]);
      if (acted && typeof onTurn === "function") onTurn(state);
    }, { passive: false });
  }

  const invBtn = document.getElementById("dpad-inv");
  if (invBtn) {
    invBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (typeof openInventory === "function") openInventory();
    }, { passive: false });
  }
}
