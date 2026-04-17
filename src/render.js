// CGD-5: DOM-based renderer. Draws tiles, enemies, and the player to #game-container.
// CGD-11: reads fog state to apply unexplored/explored/visible shading.
// CGD-13: .tile class for grid, stairs glyph, revised palette.
import { TILE } from "./mapGenerator.js";

const TILE_SIZE = 32;

const TILE_COLORS = {
  [TILE.WALL]:   "#252545",
  [TILE.FLOOR]:  "#0c0c1e",
  [TILE.STAIRS]: "#b8872a",
};

// Darkened versions for explored-but-not-visible tiles.
const TILE_COLORS_DIM = {
  [TILE.WALL]:   "#111126",
  [TILE.FLOOR]:  "#06060f",
  [TILE.STAIRS]: "#6b4e18",
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

      const cell = makeCell(x, y, TILE_COLORS[tile]);
      if (tile === TILE.STAIRS) addStairsGlyph(cell);
      container.appendChild(cell);
    }
  }

  // Build a quick lookup set for hit positions this turn.
  const hitKeys = new Set((state.lastHits ?? []).map(h => `${h.x},${h.y}`));

  for (const e of entities) {
    if (e.type === "enemy") {
      if (fog && !fog.visible[e.y][e.x]) continue;
      const el = makeEntity(e.x, e.y, "#c33", "E");
      if (hitKeys.has(`${e.x},${e.y}`)) el.classList.add("hit");
      container.appendChild(el);
    }
  }

  if (player) {
    const el = makeEntity(player.x, player.y, "#4ae", "@");
    if (hitKeys.has(`${player.x},${player.y}`)) el.classList.add("hit");
    container.appendChild(el);
  }
}

function makeCell(x, y, color) {
  const el = document.createElement("div");
  el.className = "tile";
  el.style.position = "absolute";
  el.style.left = `${x * TILE_SIZE}px`;
  el.style.top = `${y * TILE_SIZE}px`;
  el.style.width = `${TILE_SIZE}px`;
  el.style.height = `${TILE_SIZE}px`;
  el.style.background = color;
  return el;
}

function addStairsGlyph(cell) {
  cell.style.display = "flex";
  cell.style.alignItems = "center";
  cell.style.justifyContent = "center";
  cell.style.color = "#ffe08a";
  cell.style.fontFamily = "monospace";
  cell.style.fontSize = "18px";
  cell.style.fontWeight = "bold";
  cell.textContent = ">";
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
