// CGD-8: melee combat — attack resolution and death cleanup.
// CGD-25: defense reduces damage; minimum damage is always 1.

export function attack(attacker, defender) {
  const dmg = Math.max(1, (attacker.attack ?? 1) - (defender.defense ?? 0));
  defender.hp -= dmg;
}

// Removes dead enemies from state.entities. Returns true if the player is dead.
export function resolveDeaths(state) {
  state.entities = state.entities.filter(e => e.type !== "enemy" || e.hp > 0);
  return state.player.hp <= 0;
}
