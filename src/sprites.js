// CGD-18: sprite sheet loader and renderer.
// CGD-26: chest sprite sheet (chest.svg).
//
// Sprite sheets live in src/sprites/:
//   player.svg — 64×128 px, 2 columns (frame 0/1) × 4 rows (down/up/right/left)
//   enemy.svg  — 64×96  px, 2 columns (frame 0/1) × 3 rows (front/right/left)
//   chest.svg  — 64×32  px, 2 columns (frame 0=closed / frame 1=open) × 1 row
//
// drawImage(img, sx, sy, 32, 32, dx, dy, 32, 32) clips the right frame.

const S = 32; // tile / frame size in pixels

// Row index within each sprite sheet.
const PLAYER_ROW = { down: 0, up: 1, right: 2, left: 3 };
const ENEMY_ROW  = { front: 0, right: 1, left: 2 };

const IMAGES = {};

function loadImage(key, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload  = () => { IMAGES[key] = img; resolve(); };
    img.onerror = () => reject(new Error(`Failed to load sprite sheet: ${src}`));
  });
}

export function loadSprites() {
  return Promise.all([
    loadImage("player", "src/sprites/player.svg"),
    loadImage("enemy",  "src/sprites/enemy.svg"),
    loadImage("chest",  "src/sprites/chest.svg"),
  ]);
}

export function drawPlayer(ctx, player) {
  const img = IMAGES.player;
  if (!img) return;
  const { x, y, facing = "down", step = 0 } = player;
  const sx = (step % 2) * S;               // column: frame 0 or 1
  const sy = (PLAYER_ROW[facing] ?? 0) * S; // row: direction
  ctx.drawImage(img, sx, sy, S, S, x * S, y * S, S, S);
}

// CGD-26: draw closed (isLooted=false) or open (isLooted=true) chest at tile (x, y).
export function drawChest(ctx, x, y, isLooted) {
  const img = IMAGES.chest;
  if (!img) return;
  const sx = isLooted ? S : 0;  // frame 1 = open, frame 0 = closed
  ctx.drawImage(img, sx, 0, S, S, x * S, y * S, S, S);
}

export function drawEnemy(ctx, enemy) {
  const img = IMAGES.enemy;
  if (!img) return;
  const { x, y, facing = "down", step = 0 } = enemy;
  const facingKey = (facing === "left" || facing === "right") ? facing : "front";
  const sx = (step % 2) * S;
  const sy = (ENEMY_ROW[facingKey] ?? 0) * S;
  ctx.drawImage(img, sx, sy, S, S, x * S, y * S, S, S);
}
