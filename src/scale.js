// CGD-40: responsive scaling — shrinks #game-wrapper to fit the viewport on small screens.
// Measures the wrapper's natural size once (after first render), then applies a uniform
// CSS scale so the game always fits without overflow. Scale never exceeds 1 (no upscaling).
//
// Important: transform: scale() does not affect layout flow — the element still occupies
// its natural size in the document. We compensate with a negative margin-bottom so that
// content below (the D-pad) follows the visual bottom, not the layout bottom.

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

  // Subtract D-pad height from available viewport height so the dpad stays on screen.
  const dpad = document.getElementById("dpad");
  const dpadH = dpad ? dpad.offsetHeight + 20 : 0; // 20px for margins

  const scale = Math.min(
    1,
    window.innerWidth  / naturalW,
    (window.innerHeight - dpadH) / naturalH
  );

  if (scale < 1) {
    wrapper.style.transform = `scale(${scale})`;
    // Collapse the excess layout space so the D-pad follows the visual bottom.
    wrapper.style.marginBottom = `-${Math.round(naturalH * (1 - scale))}px`;
  } else {
    wrapper.style.transform = "";
    wrapper.style.marginBottom = "";
  }
}
