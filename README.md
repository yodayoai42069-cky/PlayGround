# Hanami Hearts

An early-2000s anime-style, non-explicit romance and family legacy sim that runs entirely in the browser. Create a fully customizable protagonist fresh out of college with $10,000, meet six adult women in the small town of Hanami Hollow, build affection through conversations, gifts, and dates, then marry, raise offspring, and grow a household business.

## Play

Open `index.html` directly, or serve the folder locally:

```bash
PORT=3002 ./start.sh
```

Then visit `http://localhost:3002`.

No build step or npm dependencies are required. Fonts and artwork are bundled locally.

## How it plays

- **Customize everything:** choose Female or Male, skin tone, body type, one of ten hairstyles, eye and hair colours, one of eight outfit styles, a signature colour, accessories, and two starting perks. A full salon makeover can change any of it later for $500.
- **Explore the map:** the town map pins all six locations — café, library, garden, arcade, bakery, and pier. Tap a pin or a location card to visit.
- **Meet & court:** chat, flirt, give gifts ($120–$320), and take women on dates ($250). Silver Tongue boosts affection, and Bargain Heart cuts gift and date prices.
- **Marry & build a home:** reach 80% affection while dating to propose ($1,500 ring), then hold the wedding ($2,500). Each partner adds $120 per day to the household and earns a perk point.
- **Raise a family:** welcome offspring for $1,500 and raise them through their stages. Offspring are dependents and never work.
- **Grown offspring choose:** once grown, each offspring decides whether to join the family business, adding $220 per day (or more with Family Fortune). Their contribution funds more gifts and new beginnings.
- **Build your income:** work a shift for $280–$440, collect a base $80 household income each morning (+$70 with Trust Fund), and stack partner and grown-offspring income.
- **Scroll with ease:** dedicated up/down buttons on the side of the screen scroll the active creator panel, modal, or page.
- **Keep a legacy:** fill the ledger, unlock keepsakes, and complete the dream board by marrying all six women, raising grown offspring, and earning $25,000.

Perks are permanent for a story: Trust Fund, Silver Tongue, Bargain Heart, Family Fortune, Fruitful Home, and Star Power. Progress autosaves to `localStorage` under `hanami-hearts-save-v1`. All six romanceable characters are explicitly adults (ages 24–31); the offspring's exact ages are left unspecified. The story is consensual and non-explicit.

## Project layout

- `index.html` — app shell, title screen, and game layout
- `app.js` — game state, rendering, actions, saves, and audio
- `assets/data.js` — characters, gifts, locations, perks, customization options, dialogue, and date scenes
- `assets/art.js` — original inline SVG portraits and scenes
- `assets/styles.css` — visual system and responsive layouts
- `assets/fonts/` — locally bundled Fraunces and Nunito Sans

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://omgithub.com).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://omgithub.com/yodayoai42069-cky/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/yodayoai42069-cky/PlayGround)

- 🎮 [Open the project](https://omgithub.com/yodayoai42069-cky/PlayGround).
- ✨ [Remix this project](https://omgithub.com/?remix=yodayoai42069-cky%2FPlayGround).
- 💻 [Explore the source](https://github.com/yodayoai42069-cky/PlayGround).
- 🛠️ [Check build runs](https://github.com/yodayoai42069-cky/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/yodayoai42069-cky/PlayGround/issues).
- 👤 [Explore the creator's projects](https://omgithub.com/yodayoai42069-cky).
- 🌍 [Create with OMGithub](https://omgithub.com).
<!-- omgithub:readme:end -->
