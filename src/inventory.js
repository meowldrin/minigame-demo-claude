// CGD-24: inventory overlay — toggle with I/Escape, use/equip/unequip items.
import { equipItem, useItem, unequipItem } from "./gameState.js";

const overlay = document.getElementById("inventory");

export function isInventoryOpen() {
  return !overlay.classList.contains("hidden");
}

// Call once from main.js after state and HUD update function are available.
export function initInventory(state, onUpdate) {
  window.addEventListener("keydown", (e) => {
    if (e.key === "i" || e.key === "I") {
      e.preventDefault();
      if (isInventoryOpen()) {
        closeInventory();
      } else {
        openInventory(state, onUpdate);
      }
    }
    if (e.key === "Escape" && isInventoryOpen()) {
      closeInventory();
    }
  });
}

function openInventory(state, onUpdate) {
  renderPanel(state, onUpdate);
  overlay.classList.remove("hidden");
}

function closeInventory() {
  overlay.classList.add("hidden");
}

function renderPanel(state, onUpdate) {
  const p = state.player;
  overlay.innerHTML = "";

  const panel = document.createElement("div");
  panel.className = "inv-panel";

  // ── Title ──────────────────────────────────────────────
  const title = document.createElement("h2");
  title.textContent = "Inventory";
  panel.appendChild(title);

  // ── Equipment section ───────────────────────────────────
  const eqSection = document.createElement("div");
  eqSection.className = "inv-section";

  const eqLabel = document.createElement("div");
  eqLabel.className = "inv-label";
  eqLabel.textContent = "Equipment";
  eqSection.appendChild(eqLabel);

  for (const slot of ["weapon", "armor"]) {
    const item = p.equipment[slot];
    const row = document.createElement("div");
    row.className = "inv-eq-row";

    const slotName = document.createElement("span");
    slotName.className = "inv-slot-name";
    slotName.textContent = slot.charAt(0).toUpperCase() + slot.slice(1) + ":";

    const slotValue = document.createElement("span");
    slotValue.className = "inv-slot-value";
    slotValue.textContent = item ? item.name : "—";

    row.appendChild(slotName);
    row.appendChild(slotValue);

    if (item) {
      const unequipBtn = document.createElement("button");
      unequipBtn.className = "inv-slot-btn";
      unequipBtn.textContent = "Unequip";
      unequipBtn.onclick = () => {
        unequipItem(p, slot);
        onUpdate();
        renderPanel(state, onUpdate);
      };
      row.appendChild(unequipBtn);
    }

    eqSection.appendChild(row);
  }
  panel.appendChild(eqSection);

  // ── Carried items section ───────────────────────────────
  const itemsSection = document.createElement("div");
  itemsSection.className = "inv-section";

  const itemsLabel = document.createElement("div");
  itemsLabel.className = "inv-label";
  itemsLabel.textContent = "Carried items";
  itemsSection.appendChild(itemsLabel);

  if (p.inventory.length === 0) {
    const empty = document.createElement("div");
    empty.className = "inv-empty";
    empty.textContent = "Your pack is empty.";
    itemsSection.appendChild(empty);
  } else {
    for (const item of [...p.inventory]) {
      const row = document.createElement("div");
      row.className = "inv-item-row";

      const nameSpan = document.createElement("span");
      nameSpan.className = `inv-item-name rarity-${item.rarity}`;
      nameSpan.textContent = item.name;

      const rarityBadge = document.createElement("span");
      rarityBadge.className = `inv-rarity rarity-${item.rarity}`;
      rarityBadge.textContent = item.rarity;

      const btn = document.createElement("button");
      btn.className = "inv-action-btn";

      if (item.category === "consumable") {
        btn.textContent = "Use";
        btn.onclick = () => {
          useItem(p, item);
          onUpdate();
          renderPanel(state, onUpdate);
        };
      } else {
        btn.textContent = "Equip";
        btn.onclick = () => {
          equipItem(p, item);
          onUpdate();
          renderPanel(state, onUpdate);
        };
      }

      row.appendChild(nameSpan);
      row.appendChild(rarityBadge);
      row.appendChild(btn);
      itemsSection.appendChild(row);
    }
  }

  panel.appendChild(itemsSection);
  overlay.appendChild(panel);
}
