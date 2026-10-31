# Hanami Hearts

A cozy, non-explicit romance and family legacy sim that runs entirely in the browser. Create a character, meet six adult women in the small town of Hanami Hollow, build affection through conversations, gifts, and dates, then marry, raise a family, and grow a household business.

## Play

Open `index.html` directly, or serve the folder locally:

```bash
PORT=3002 ./start.sh
```

Then visit `http://localhost:3002`.

No build step or npm dependencies are required. Fonts and artwork are bundled locally.

## How it plays

- **Meet & court:** visit the café, library, garden, arcade, bakery, and pier. Chat, flirt, give thoughtful gifts, and go on dates.
- **Marry & build a home:** reach 80% affection while dating to propose. Each partner adds to the household's daily income.
- **Raise a family:** welcome offspring (200 coins) and raise them as they grow. Offspring are dependents and never work.
- **Grown offspring choose:** once grown, each offspring decides whether to join the family business. Their contribution funds more gifts and new beginnings.
- **Keep a legacy:** fill the ledger, unlock keepsakes, and complete the dream board by marrying all six women, raising grown offspring, and earning a family fortune.

Progress autosaves to `localStorage` under `hanami-hearts-save-v1`. All six romanceable characters are explicitly adults (ages 24–31); the offspring's exact ages are left unspecified. The story is consensual and non-explicit.

## Project layout

- `index.html` — app shell, title screen, and game layout
- `app.js` — game state, rendering, actions, saves, and audio
- `assets/data.js` — characters, gifts, locations, dialogue, and date scenes
- `assets/art.js` — original inline SVG portraits and scenes
- `assets/styles.css` — visual system and responsive layouts
- `assets/fonts/` — locally bundled Fraunces and Nunito Sans

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Remixed using [OMGithub.com](https://omgithub.com).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://omgithub.com/yodayoai42069-cky/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/yodayoai42069-cky/PlayGround)

- 🎮 [Open the project](https://omgithub.com/yodayoai42069-cky/PlayGround).
- ✨ [Remix this project](https://omgithub.com/?remix=yodayoai42069-cky%2FPlayGround).
- 💻 [Explore the source](https://github.com/yodayoai42069-cky/PlayGround).
- 🛠️ [Check build runs](https://github.com/yodayoai42069-cky/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/yodayoai42069-cky/PlayGround/issues).
- 👤 [Explore the creator's projects](https://omgithub.com/yodayoai42069-cky).
- 🌍 [Create with OMGithub](https://omgithub.com).
- 🧬 [Explore the remix source](https://github.com/yodayoai42069-cky/PlayGround/tree/2fc9f1202baecc32719073c8dda1e887021a7754).
<!-- omgithub:readme:end -->
