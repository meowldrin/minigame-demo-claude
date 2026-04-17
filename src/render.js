// CGD-5: DOM-based renderer. Draws tiles, enemies, and the player to #game-container.
// CGD-11: reads fog state to apply unexplored/explored/visible shading.
import { TILE } from "./mapGenerator.js";

const TILE_SIZE = 32;

const TILE_COLORS = {
  [TILE.WALL]:   "#333355",
  [TILE.FLOOR]:  "#1a1a2e",
  [TILE.STAIRS]: "#d4a24a",
};

// Darkened versions for explored-but-not-visible tiles.
const TILE_COLORS_DIM = {
  [TILE.WALL]:   "#1a1a2e",
  [TILE.FLOOR]:  "#0e0e1a",
  [TILE.STAIRS]: "#7a5e2a",
};

export function render(state, container, fog) {
  const { room, player, entities } = state;
  if (!room) return;

  const width = room[0].length;
  const height = room.length;

  container.style.position = "relative";
  container.style.width = `${width * TILE_SIZE}px`;
  container.style.height = `${height * TILE_SIZE}px`;
  container.innerHTML = "";

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = room[y][x];

      if (fog) {
        if (!fog.explored[y][x]) {
          // Never seen — black.
          container.appendChild(makeCell(x, y, "#000"));
          continue;
        }
        if (!fog.visible[y][x]) {
          // Seen before but not currently lit — dimmed.
          container.appendChild(makeCell(x, y, TILE_COLORS_DIM[tile]));
          continue;
        }
      }

      container.appendChild(makeCell(x, y, TILE_COLORS[tile]));
    }
  }

  for (const e of entities) {
    if (e.type === "enemy") {
      // Only draw enemies on visible tiles.
      if (fog && !fog.visible[e.y][e.x]) continue;
      container.appendChild(makeEntity(e.x, e.y, "#c33", "E"));
    }
  }

  if (player) {
    container.appendChild(makeEntity(player.x, player.y, "#4ae", "@"));
  }
}

function makeCell(x, y, color) {
  const el = document.createElement("div");
  el.style.position = "absolute";
  el.style.left = `${x * TILE_SIZE}px`;
  el.style.top = `${y * TILE_SIZE}px`;
  el.style.width = `${TILE_SIZE}px`;
  el.style.height = `${TILE_SIZE}px`;
  el.style.background = color;
  return el;
}

function makeEntity(x, y, color, glyph) {
  const el = makeCell(x, y, "transparent");
  el.style.color = color;
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontFamily = "monospace";
  el.style.fontSize = "24px";
  el.style.fontWeight = "bold";
  el.textContent = glyph;
  return el;
}
