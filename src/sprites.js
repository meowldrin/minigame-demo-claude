// CGD-18: sprite loader and renderer.
// SVG files live in src/sprites/. Call loadSprites() once before rendering.

const TILE_SIZE = 32;

// Preloaded Image objects keyed by sprite name.
const IMAGES = {};

const PLAYER_KEYS = [
  "player-down-0",  "player-down-1",
  "player-up-0",    "player-up-1",
  "player-right-0", "player-right-1",
  "player-left-0",  "player-left-1",
];

const ENEMY_KEYS = [
  "enemy-front-0", "enemy-front-1",
  "enemy-right-0", "enemy-right-1",
  "enemy-left-0",  "enemy-left-1",
];

function loadImage(key) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `src/sprites/${key}.svg`;
    img.onload  = () => { IMAGES[key] = img; resolve(); };
    img.onerror = () => reject(new Error(`Failed to load sprite: ${key}`));
  });
}

export function loadSprites() {
  return Promise.all([...PLAYER_KEYS, ...ENEMY_KEYS].map(loadImage));
}

export function drawPlayer(ctx, player) {
  const { x: px, y: py, facing = "down", step = 0 } = player;
  const key = `player-${facing}-${step % 2}`;
  const img = IMAGES[key];
  if (img) ctx.drawImage(img, px * TILE_SIZE, py * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

export function drawEnemy(ctx, enemy) {
  const { x: ex, y: ey, facing = "down", step = 0 } = enemy;
  // Enemies only have left/right/front — up and down both use front.
  const facingKey = (facing === "left" || facing === "right") ? facing : "front";
  const key = `enemy-${facingKey}-${step % 2}`;
  const img = IMAGES[key];
  if (img) ctx.drawImage(img, ex * TILE_SIZE, ey * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}
