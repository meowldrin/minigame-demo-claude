// CGD-2: game state manager — single source of truth for floor, room, player, enemies.
// CGD-4: adds collision check + turn counter.
// CGD-8: adds getEnemyAt helper for combat.
import { TILE } from "./mapGenerator.js";

export function createPlayer(x, y, hp = 10) {
  return { type: "player", x, y, hp, attack: 1, facing: "down", step: 0 };
}

export function createEnemy(x, y, hp = 3) {
  return { type: "enemy", x, y, hp, attack: 1, facing: "down", step: 0 };
}

export function createGameState() {
  return {
    currentFloor: 1,
    room: null,
    player: null,
    entities: [],
    turn: 0,
    lastHits: [], // CGD-12: positions hit this turn, used for flash animation.
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

export function getEnemyAt(state, x, y) {
  return state.entities.find(e => e.type === "enemy" && e.x === x && e.y === y) ?? null;
}
