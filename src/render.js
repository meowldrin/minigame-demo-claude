// CGD-5: DOM-based renderer. Draws tiles to #game-container.
// CGD-11: reads fog state to apply unexplored/explored/visible shading.
// CGD-13: .tile class for grid, stairs glyph, revised palette.
// CGD-18: canvas overlay for entity sprites — see sprites.js.
import { TILE } from "./mapGenerator.js";
import { drawPlayer, drawEnemy, drawChest } from "./sprites.js";

const TILE_SIZE = 32;

const TILE_COLORS = {
  [TILE.WALL]:   "#252545",
  [TILE.FLOOR]:  "#0c0c1e",
  [TILE.STAIRS]: "#b8872a",
  [TILE.CHEST]:  "#7a5214",  // closed chest — warm brown
};


const TILE_COLORS_DIM = {
  [TILE.WALL]:   "#111126",
  [TILE.FLOOR]:  "#06060f",
  [TILE.STAIRS]: "#6b4e18",
  [TILE.CHEST]:  "#3d2a0a",
};

export function render(state, container, fog) {
  const { room, player, entities } = state;
  if (!room) return;

  const width  = room[0].length;
  const height = room.length;
  const cw = width  * TILE_SIZE;
  const ch = height * TILE_SIZE;

  container.style.position = "relative";
  container.style.width  = `${cw}px`;
  container.style.height = `${ch}px`;

  // Remove tile divs but preserve the entity canvas so the GPU texture survives.
  let canvas = container.querySelector("#entity-canvas");
  for (const child of [...container.children]) {
    if (child !== canvas) child.remove();
  }

  // ── Tile layer (DOM) ───────────────────────────────────
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tile = room[y][x];

      if (fog) {
        if (!fog.explored[y][x]) {
          container.appendChild(makeCell(x, y, "#000"));
          continue;
        }
        if (!fog.visible[y][x]) {
          container.appendChild(makeCell(x, y, TILE_COLORS_DIM[tile] ?? TILE_COLORS_DIM[TILE.FLOOR]));
          continue;
        }
      }

      const color = TILE_COLORS[tile] ?? TILE_COLORS[TILE.FLOOR];
      const cell = makeCell(x, y, color);
      if (tile === TILE.STAIRS) addStairsGlyph(cell);
      container.appendChild(cell);
    }
  }

  // ── Entity canvas (above tiles) ────────────────────────
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "entity-canvas";
    canvas.style.position     = "absolute";
    canvas.style.top          = "0";
    canvas.style.left         = "0";
    canvas.style.pointerEvents = "none";
  }
  canvas.width  = cw;
  canvas.height = ch;
  container.appendChild(canvas); // always last → on top of tiles

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, cw, ch);

  // Draw chest sprites for visible chest tiles.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (room[y][x] !== TILE.CHEST) continue;
      if (fog && !fog.visible[y][x]) continue;
      const isLooted = !!(state.chests[`${x},${y}`]);
      drawChest(ctx, x, y, isLooted);
    }
  }

  for (const e of entities) {
    if (e.type === "enemy") {
      if (fog && !fog.visible[e.y][e.x]) continue;
      drawEnemy(ctx, e);
    }
  }
  if (player) drawPlayer(ctx, player);

  // ── Hit-flash overlays (DOM, above canvas) ─────────────
  for (const h of state.lastHits ?? []) {
    const flash = document.createElement("div");
    flash.style.position      = "absolute";
    flash.style.left          = `${h.x * TILE_SIZE}px`;
    flash.style.top           = `${h.y * TILE_SIZE}px`;
    flash.style.width         = `${TILE_SIZE}px`;
    flash.style.height        = `${TILE_SIZE}px`;
    flash.style.pointerEvents = "none";
    flash.classList.add("hit");
    container.appendChild(flash);
  }
}

// ── Tile helpers ───────────────────────────────────────────

function makeCell(x, y, color) {
  const el = document.createElement("div");
  el.className = "tile";
  el.style.position   = "absolute";
  el.style.left       = `${x * TILE_SIZE}px`;
  el.style.top        = `${y * TILE_SIZE}px`;
  el.style.width      = `${TILE_SIZE}px`;
  el.style.height     = `${TILE_SIZE}px`;
  el.style.background = color;
  return el;
}

function addStairsGlyph(cell) {
  cell.style.display         = "flex";
  cell.style.alignItems      = "center";
  cell.style.justifyContent  = "center";
  cell.style.color           = "#ffe08a";
  cell.style.fontFamily      = "monospace";
  cell.style.fontSize        = "18px";
  cell.style.fontWeight      = "bold";
  cell.textContent = ">";
}


