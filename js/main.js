/* Boot the game. */

import { Game } from "./game.js";
import { SAVE_KEY } from "./data/characters.js";
import { UI } from "./ui.js";

function loadMeta() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const game = new Game(loadMeta());
const ui = new UI(game);
game.onChange = () => ui.render();
ui.mount();

if (new URLSearchParams(location.search).has("debug")) {
  window.__game = game;
  window.__ui = ui;
}
