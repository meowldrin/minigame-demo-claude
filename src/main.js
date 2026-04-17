// CGD-1..CGD-9: entry point — state, map, fog, combat, enemy turns, HUD, game-over.
import { createGameState, createPlayer, createEnemy, addEntity } from "./gameState.js";
import { generateRoom } from "./mapGenerator.js";
import { bindPlayerInput } from "./player.js";
import { doEnemyTurns } from "./enemy.js";
import { resolveDeaths } from "./combat.js";
import { render } from "./render.js";
import { createFog, updateFog } from "./fogOfWar.js";

const container  = document.getElementById("game-container");
const hudHp      = document.getElementById("hud-hp");
const hudFloor   = document.getElementById("hud-floor");
const hudTurn    = document.getElementById("hud-turn");
const gameOverEl = document.getElementById("game-over");
const gameOverTurns = document.getElementById("game-over-turns");

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

bindPlayerInput(state, (s) => {
  if (gameOver) return;

  // Remove enemies killed by the player.
  resolveDeaths(s);

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
