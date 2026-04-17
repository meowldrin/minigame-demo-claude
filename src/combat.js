// CGD-8: melee combat — attack resolution and death cleanup.

// Reduces defender.hp by attacker.attack (floored at 0).
export function attack(attacker, defender) {
  defender.hp = Math.max(0, defender.hp - (attacker.attack ?? 1));
}

// Removes dead enemies from state.entities. Returns true if the player is dead.
export function resolveDeaths(state) {
  state.entities = state.entities.filter(e => e.type !== "enemy" || e.hp > 0);
  return state.player.hp <= 0;
}
