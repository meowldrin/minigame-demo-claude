// CGD-1..CGD-5: entry point wiring state, map, input, and rendering.
import { createGameState, createPlayer, createEnemy, addEntity } from "./gameState.js";
import { generateRoom } from "./mapGenerator.js";
import { bindPlayerInput } from "./player.js";
import { render } from "./render.js";

const container = document.getElementById("game-container");

const state = createGameState();
state.room = generateRoom(15, 10);
state.player = createPlayer(5, 5);
addEntity(state, createEnemy(8, 3));
window.gameState = state;

render(state, container);
bindPlayerInput(state, (s) => render(s, container));

console.log("CGD-5: use arrow keys or WASD to move.");
