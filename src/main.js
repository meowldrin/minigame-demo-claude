// CGD-1..CGD-9: entry point — state, map, fog, combat, enemy turns, HUD, game-over.
// CGD-10: stairs advance to next floor.
import { createGameState, createPlayer, createEnemy, addEntity } from "./gameState.js";
import { generateRoom, TILE } from "./mapGenerator.js";
import { bindPlayerInput } from "./player.js";
import { doEnemyTurns } from "./enemy.js";
import { resolveDeaths } from "./combat.js";
import { render } from "./render.js";
import { createFog, updateFog } from "./fogOfWar.js";
import { loadSprites } from "./sprites.js";

const container  = document.getElementById("game-container");
const hudHp      = document.getElementById("hud-hp");
const hudFloor   = document.getElementById("hud-floor");
const hudTurn    = document.getElementById("hud-turn");
const gameOverEl = document.getElementById("game-over");
const gameOverTurns = document.getElementById("game-over-turns");

// Load all SVG sprites before starting the game.
await loadSprites();

let gameOver = false;

const state = createGameState();
state.room = generateRoom(30, 20);
state.player = createPlayer(2, 2);
addEntity(state, createEnemy(15, 10));
addEntity(state, createEnemy(22, 5));
addEntity(state, createEnemy(8, 15));
window.gameState = state;

const fog = createFog(state.room[0].length, state.room.length);
updateFog(fog, state.player.x, state.player.y);

render(state, container, fog);
updateHud(state);

function nextFloor(s, f) {
  s.currentFloor += 1;
  s.room = generateRoom(30, 20);
  s.player.x = 2;
  s.player.y = 2;
  s.entities = [];
  s.chests = {};  // CGD-20: reset chest loot state for the new floor.
  const enemyCount = 2 + Math.floor(s.currentFloor / 2);
  for (let i = 0; i < enemyCount; i++) {
    addEntity(s, createEnemy(
      5 + Math.floor(Math.random() * 20),
      3 + Math.floor(Math.random() * 14)
    ));
  }
  const w = s.room[0].length;
  const h = s.room.length;
  f.explored = Array.from({ length: h }, () => new Array(w).fill(false));
  f.visible  = Array.from({ length: h }, () => new Array(w).fill(false));
  updateFog(f, s.player.x, s.player.y);
  render(s, container, f);
  updateHud(s);
}

bindPlayerInput(state, (s) => {
  if (gameOver) return;

  // Remove enemies killed by the player.
  resolveDeaths(s);

  // Check if the player stepped on stairs.
  if (s.room[s.player.y][s.player.x] === TILE.STAIRS) {
    nextFloor(s, fog);
    return;
  }

  // Enemy turns — may damage the player.
  doEnemyTurns(s);

  // Check player death.
  if (s.player.hp <= 0) {
    gameOver = true;
    updateFog(fog, s.player.x, s.player.y);
    render(s, container, fog);
    updateHud(s);
    gameOverEl.classList.remove("hidden");
    gameOverTurns.textContent = `survived ${s.turn} turn${s.turn !== 1 ? "s" : ""}`;
    return;
  }

  updateFog(fog, s.player.x, s.player.y);
  render(s, container, fog);
  updateHud(s);
});

function updateHud(s) {
  hudHp.textContent    = `HP: ${s.player.hp}`;
  hudFloor.textContent = `Floor: ${s.currentFloor}`;
  hudTurn.textContent  = `Turn: ${s.turn}`;
}
