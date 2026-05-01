// CGD-21: item catalogue and loot table.
//
// Each item has:
//   id       — unique string key
//   name     — display name
//   category — "consumable" | "weapon" | "armor"
//   rarity   — "common" | "rare" | "epic"
//   effect   — { heal } | { attack } | { defense }

export const ITEMS = {
  health_potion: { id: "health_potion", name: "Health Potion", category: "consumable", rarity: "common", effect: { heal: 3 } },
  big_potion:    { id: "big_potion",    name: "Big Potion",    category: "consumable", rarity: "rare",   effect: { heal: 7 } },
  short_sword:   { id: "short_sword",   name: "Short Sword",   category: "weapon",     rarity: "common", effect: { attack: 1 } },
  long_sword:    { id: "long_sword",    name: "Long Sword",    category: "weapon",     rarity: "rare",   effect: { attack: 2 } },
  leather_armor: { id: "leather_armor", name: "Leather Armor", category: "armor",      rarity: "common", effect: { defense: 1 } },
  chain_mail:    { id: "chain_mail",    name: "Chain Mail",    category: "armor",      rarity: "rare",   effect: { defense: 2 } },
};

// Rarity weights shift toward rare/epic as floorNumber increases.
// Floor 1: common=70, rare=28, epic=2
// Floor 5: common=50, rare=38, epic=12
// Floor 10+: common=20, rare=48, epic=32
function rarityWeights(floor) {
  const f = Math.min(floor, 10);
  return {
    common: Math.max(20, 70 - f * 5),
    rare:   Math.min(48, 28 + f * 2),
    epic:   Math.min(32, 2  + f * 3),
  };
}

function pickRarity(weights) {
  const total = weights.common + weights.rare + weights.epic;
  let roll = Math.random() * total;
  if ((roll -= weights.common) < 0) return "common";
  if ((roll -= weights.rare)   < 0) return "rare";
  return "epic";
}

// Returns an array of 1 or 2 item objects from the catalogue.
export function rollLoot(floorNumber) {
  const weights = rarityWeights(floorNumber);
  const count = Math.random() < 0.5 ? 1 : 2;
  const pool = Object.values(ITEMS);
  const result = [];

  for (let i = 0; i < count; i++) {
    const targetRarity = pickRarity(weights);
    // Items matching the target rarity; fall back to common if none exist.
    const candidates = pool.filter(it => it.rarity === targetRarity);
    const source = candidates.length > 0 ? candidates : pool.filter(it => it.rarity === "common");
    result.push(source[Math.floor(Math.random() * source.length)]);
  }

  return result;
}
