// CGD-2: game state manager — single source of truth for floor, room, player, enemies.
// CGD-4: adds collision check + turn counter.
// CGD-8: adds getEnemyAt helper for combat.
// CGD-22: inventory, equipment slots, equipItem, useItem.
import { TILE } from "./mapGenerator.js";

export function createPlayer(x, y, hp = 10) {
  return {
    type: "player", x, y, hp, attack: 1,
    defense: 0,
    inventory: [],
    equipment: { weapon: null, armor: null },
    facing: "down", step: 0,
  };
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
    chests: {},   // CGD-20: looted chest positions, keyed "x,y" → true.
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

// CGD-22: equip a weapon or armor item.
// Removes item from inventory, unequips the previous item in the same slot
// (returning it to inventory and reverting its stat), then applies the new item's stat.
export function equipItem(player, item) {
  const slot = item.category === "weapon" ? "weapon" : "armor";
  const previous = player.equipment[slot];

  // Revert the old item's stat.
  if (previous) {
    if (previous.effect.attack)  player.attack  -= previous.effect.attack;
    if (previous.effect.defense) player.defense -= previous.effect.defense;
    player.inventory.push(previous);
  }

  // Remove new item from inventory and equip it.
  player.inventory = player.inventory.filter(i => i !== item);
  player.equipment[slot] = item;

  if (item.effect.attack)  player.attack  += item.effect.attack;
  if (item.effect.defense) player.defense += item.effect.defense;
}

// CGD-22: use a consumable item (e.g. heal potion).
// Applies the effect and removes the item from inventory.
export function useItem(player, item) {
  if (item.effect.heal) player.hp += item.effect.heal;
  player.inventory = player.inventory.filter(i => i !== item);
}
