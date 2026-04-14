// CGD-5: DOM-based renderer. Draws tiles, enemies, and the player to #game-container.
import { TILE } from "./mapGenerator.js";

const TILE_SIZE = 32;

const TILE_COLORS = {
  [TILE.WALL]: "#333355",
  [TILE.FLOOR]: "#1a1a2e",
  [TILE.STAIRS]: "#d4a24a",
};

export function render(state, container) {
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
      container.appendChild(makeCell(x, y, TILE_COLORS[room[y][x]]));
    }
  }

  for (const e of entities) {
    if (e.type === "enemy") {
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
