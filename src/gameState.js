// CGD-2: game state manager — single source of truth for floor, room, player, enemies.
// CGD-4: adds collision check + turn counter.
import { TILE } from "./mapGenerator.js";

export function createPlayer(x, y, hp = 10) {
  return { type: "player", x, y, hp };
}

export function createEnemy(x, y, hp = 3) {
  return { type: "enemy", x, y, hp };
}

export function createGameState() {
  return {
    currentFloor: 1,
    room: null,
    player: null,
    entities: [],
    turn: 0,
  };
}

export function addEntity(state, entity) {
  state.entities.push(entity);
}

export function canMoveTo(state, x, y) {
  const room = state.room;
  if (!room) return false;
  if (y < 0 || y >= room.length) return false;
  if (x < 0 || x >= room[0].length) return false;
  return room[y][x] !== TILE.WALL;
}
