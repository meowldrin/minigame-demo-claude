// CGD-5: DOM-based renderer. Draws tiles to #game-container.
// CGD-11: reads fog state to apply unexplored/explored/visible shading.
// CGD-13: .tile class for grid, stairs glyph, revised palette.
// CGD-18: canvas overlay for entity sprites — directional, 2-frame walk animation.
import { TILE } from "./mapGenerator.js";

const TILE_SIZE = 32;

const TILE_COLORS = {
  [TILE.WALL]:   "#252545",
  [TILE.FLOOR]:  "#0c0c1e",
  [TILE.STAIRS]: "#b8872a",
};

const TILE_COLORS_DIM = {
  [TILE.WALL]:   "#111126",
  [TILE.FLOOR]:  "#06060f",
  [TILE.STAIRS]: "#6b4e18",
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
          container.appendChild(makeCell(x, y, TILE_COLORS_DIM[tile]));
          continue;
        }
      }

      const cell = makeCell(x, y, TILE_COLORS[tile]);
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

// ── Canvas sprite helpers ──────────────────────────────────

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// Player — humanoid, 4 directions, 2-frame walk animation.
// Palette: skin #f5d08a · suit #4a9ed8 · dark #2a6ea0
function drawPlayer(ctx, player) {
  const { x: px, y: py, facing = "down", step = 0 } = player;
  const tx = px * TILE_SIZE;
  const ty = py * TILE_SIZE;
  const f  = step % 2;

  const SKIN = "#f5d08a";
  const SUIT = "#4a9ed8";
  const DARK = "#2a6ea0";
  const EYE  = "#222";

  switch (facing) {

    case "down": {
      // Head + eyes
      ctx.fillStyle = SKIN;  circle(ctx, tx+16, ty+8, 5);
      ctx.fillStyle = EYE;   circle(ctx, tx+14, ty+8, 1); circle(ctx, tx+18, ty+8, 1);
      // Body
      ctx.fillStyle = SUIT;  ctx.fillRect(tx+12, ty+13, 8, 9);
      // Arms swing opposite each frame
      ctx.fillRect(tx+8,  f ? ty+11 : ty+13, 3, 6);
      ctx.fillRect(tx+21, f ? ty+15 : ty+13, 3, 6);
      // Legs stride
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+11 : tx+12, ty+22, 3, 8);
      ctx.fillRect(f ? tx+18 : tx+17, ty+22, 3, 8);
      break;
    }

    case "up": {
      // Head back (darker skin)
      ctx.fillStyle = "#c8a060"; circle(ctx, tx+16, ty+8, 5);
      // Body back (darker shirt)
      ctx.fillStyle = DARK;  ctx.fillRect(tx+12, ty+13, 8, 9);
      // Arms
      ctx.fillStyle = SUIT;
      ctx.fillRect(tx+8,  f ? ty+11 : ty+13, 3, 6);
      ctx.fillRect(tx+21, f ? ty+15 : ty+13, 3, 6);
      // Legs
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+11 : tx+12, ty+22, 3, 8);
      ctx.fillRect(f ? tx+18 : tx+17, ty+22, 3, 8);
      break;
    }

    case "right": {
      // Head profile offset right
      ctx.fillStyle = SKIN;  circle(ctx, tx+17, ty+8, 5);
      // Body narrower (side view)
      ctx.fillStyle = SUIT;  ctx.fillRect(tx+13, ty+13, 6, 9);
      // Single rear arm
      ctx.fillRect(tx+9, f ? ty+11 : ty+14, 4, 5);
      // Legs stride
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+12 : tx+13, ty+22, 3, f ? 9 : 8);
      ctx.fillRect(tx+16,               ty+22, 3, f ? 7 : 8);
      break;
    }

    case "left": {
      // Head profile offset left
      ctx.fillStyle = SKIN;  circle(ctx, tx+15, ty+8, 5);
      // Body narrower
      ctx.fillStyle = SUIT;  ctx.fillRect(tx+13, ty+13, 6, 9);
      // Single rear arm (mirrored)
      ctx.fillRect(tx+19, f ? ty+11 : ty+14, 4, 5);
      // Legs stride mirrored
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+17 : tx+16, ty+22, 3, f ? 9 : 8);
      ctx.fillRect(tx+13,             ty+22, 3, f ? 7 : 8);
      break;
    }
  }
}

// Enemy — squat goblin, facing-aware, 2-frame walk.
// Palette: body #c33 · dark #8a1a1a · eye #ffcc00
function drawEnemy(ctx, enemy) {
  const { x: ex, y: ey, facing = "down", step = 0 } = enemy;
  const tx = ex * TILE_SIZE;
  const ty = ey * TILE_SIZE;
  const f  = step % 2;

  const BODY = "#c33";
  const DARK = "#8a1a1a";
  const EYE  = "#ffcc00";

  // Head (large, round)
  ctx.fillStyle = BODY;
  circle(ctx, tx+16, ty+7, 7);

  // Eyes — position shifts with facing
  ctx.fillStyle = EYE;
  if      (facing === "left")  { circle(ctx, tx+11, ty+6, 2); }
  else if (facing === "right") { circle(ctx, tx+21, ty+6, 2); }
  else                         { circle(ctx, tx+13, ty+6, 2); circle(ctx, tx+19, ty+6, 2); }

  // Body (chunky, wider than player)
  ctx.fillStyle = BODY;
  ctx.fillRect(tx+10, ty+14, 12, 8);

  // Arms (raised, menacing) — swing each frame
  ctx.fillStyle = DARK;
  const armY = f ? ty+10 : ty+12;
  if (facing === "right") {
    ctx.fillRect(tx+22, armY,   5, 4);   // lead arm (right)
    ctx.fillRect(tx+7,  armY+2, 4, 4);   // trailing arm
  } else if (facing === "left") {
    ctx.fillRect(tx+5,  armY,   5, 4);   // lead arm (left)
    ctx.fillRect(tx+21, armY+2, 4, 4);
  } else {
    ctx.fillRect(tx+5,  armY, 5, 4);
    ctx.fillRect(tx+22, armY, 5, 4);
  }

  // Legs (short, stocky)
  ctx.fillStyle = DARK;
  ctx.fillRect(f ? tx+9  : tx+10, f ? ty+21 : ty+22, 4, f ? 8 : 7);
  ctx.fillRect(f ? tx+19 : tx+18, ty+22,              4, f ? 6 : 7);
}
