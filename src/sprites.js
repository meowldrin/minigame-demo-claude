// CGD-18: canvas sprite drawing for player and enemies.
// Imported by render.js — no game logic here, pure drawing.

const TILE_SIZE = 32;

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// Player — humanoid, 4 directions, 2-frame walk animation.
// Palette: skin #f5d08a · suit #4a9ed8 · dark #2a6ea0
export function drawPlayer(ctx, player) {
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
      ctx.fillStyle = SKIN;  circle(ctx, tx+16, ty+8, 5);
      ctx.fillStyle = EYE;   circle(ctx, tx+14, ty+8, 1); circle(ctx, tx+18, ty+8, 1);
      ctx.fillStyle = SUIT;  ctx.fillRect(tx+12, ty+13, 8, 9);
      ctx.fillRect(tx+8,  f ? ty+11 : ty+13, 3, 6);
      ctx.fillRect(tx+21, f ? ty+15 : ty+13, 3, 6);
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+11 : tx+12, ty+22, 3, 8);
      ctx.fillRect(f ? tx+18 : tx+17, ty+22, 3, 8);
      break;
    }

    case "up": {
      ctx.fillStyle = "#c8a060"; circle(ctx, tx+16, ty+8, 5);
      ctx.fillStyle = DARK;  ctx.fillRect(tx+12, ty+13, 8, 9);
      ctx.fillStyle = SUIT;
      ctx.fillRect(tx+8,  f ? ty+11 : ty+13, 3, 6);
      ctx.fillRect(tx+21, f ? ty+15 : ty+13, 3, 6);
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+11 : tx+12, ty+22, 3, 8);
      ctx.fillRect(f ? tx+18 : tx+17, ty+22, 3, 8);
      break;
    }

    case "right": {
      ctx.fillStyle = SKIN;  circle(ctx, tx+17, ty+8, 5);
      ctx.fillStyle = SUIT;  ctx.fillRect(tx+13, ty+13, 6, 9);
      ctx.fillRect(tx+9, f ? ty+11 : ty+14, 4, 5);
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+12 : tx+13, ty+22, 3, f ? 9 : 8);
      ctx.fillRect(tx+16,               ty+22, 3, f ? 7 : 8);
      break;
    }

    case "left": {
      ctx.fillStyle = SKIN;  circle(ctx, tx+15, ty+8, 5);
      ctx.fillStyle = SUIT;  ctx.fillRect(tx+13, ty+13, 6, 9);
      ctx.fillRect(tx+19, f ? ty+11 : ty+14, 4, 5);
      ctx.fillStyle = DARK;
      ctx.fillRect(f ? tx+17 : tx+16, ty+22, 3, f ? 9 : 8);
      ctx.fillRect(tx+13,             ty+22, 3, f ? 7 : 8);
      break;
    }
  }
}

// Enemy — squat goblin, facing-aware, 2-frame walk.
// Palette: body #c33 · dark #8a1a1a · eye #ffcc00
export function drawEnemy(ctx, enemy) {
  const { x: ex, y: ey, facing = "down", step = 0 } = enemy;
  const tx = ex * TILE_SIZE;
  const ty = ey * TILE_SIZE;
  const f  = step % 2;

  const BODY = "#c33";
  const DARK = "#8a1a1a";
  const EYE  = "#ffcc00";

  ctx.fillStyle = BODY;
  circle(ctx, tx+16, ty+7, 7);

  ctx.fillStyle = EYE;
  if      (facing === "left")  { circle(ctx, tx+11, ty+6, 2); }
  else if (facing === "right") { circle(ctx, tx+21, ty+6, 2); }
  else                         { circle(ctx, tx+13, ty+6, 2); circle(ctx, tx+19, ty+6, 2); }

  ctx.fillStyle = BODY;
  ctx.fillRect(tx+10, ty+14, 12, 8);

  ctx.fillStyle = DARK;
  const armY = f ? ty+10 : ty+12;
  if (facing === "right") {
    ctx.fillRect(tx+22, armY,   5, 4);
    ctx.fillRect(tx+7,  armY+2, 4, 4);
  } else if (facing === "left") {
    ctx.fillRect(tx+5,  armY,   5, 4);
    ctx.fillRect(tx+21, armY+2, 4, 4);
  } else {
    ctx.fillRect(tx+5,  armY, 5, 4);
    ctx.fillRect(tx+22, armY, 5, 4);
  }

  ctx.fillStyle = DARK;
  ctx.fillRect(f ? tx+9  : tx+10, f ? ty+21 : ty+22, 4, f ? 8 : 7);
  ctx.fillRect(f ? tx+19 : tx+18, ty+22,              4, f ? 6 : 7);
}
