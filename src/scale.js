// CGD-40: responsive scaling — shrinks #game-wrapper to fit the viewport on small screens.
// Measures the wrapper's natural size once (after first render), then applies a uniform
// CSS scale so the game always fits without overflow. Scale never exceeds 1 (no upscaling).

let naturalW = 0;
let naturalH = 0;
let wrapper = null;

export function initScale() {
  wrapper = document.getElementById("game-wrapper");
  if (!wrapper) return;

  // Measure natural size before any scaling.
  naturalW = wrapper.offsetWidth;
  naturalH = wrapper.offsetHeight;

  fit();
  window.addEventListener("resize", fit);
}

function fit() {
  if (!wrapper || naturalW === 0 || naturalH === 0) return;

  const scale = Math.min(
    1,
    window.innerWidth  / naturalW,
    window.innerHeight / naturalH
  );

  wrapper.style.transform = scale < 1 ? `scale(${scale})` : "";
}
