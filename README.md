# 🌸 LOVE TOWN ∞ — Early-Aughts Anime Dating Sim

A complete, browser-based dating sim in a single file. **No build step, no dependencies** — just open `index.html` in any modern browser.

## How to Play
1. Open `index.html` (double-click, or serve with `python3 -m http.server`).
2. **Create your character**: name, **MALE or FEMALE (only)**, body type, hair style/color, eye color, skin tone, outfit.
3. You start with **$10,000** after graduation in a town inhabited **only by women**.
4. Use the **side buttons (▲ ▼ ✔ ◀)** — or arrow keys / Enter / Esc — to scroll and select in any list: the **town map**, dating options, gift options, perks, and customization.
5. Romance route per bachelorette: **Chat → Gifts → Dates → Confess (♥50) → Propose (♥100 + Engagement Ring 💍 $1,500)** → wedding ($800 ceremony fee).
6. At the apartment: **Try for Baby** ($600). Offspring are a **random combination of mother + you** (sex is strictly boy/girl, hair, hair color blend, skin, body) and **generate income every day**, funding more dates and more wives.
7. **End Day** at the apartment to collect income, births, etc.
8. Buy **Perks** at the apartment Benefits Office (money + offspring generation boosts).
9. Visit the **Glamour Salon ($250) at ANY time** to completely re-customize your look — even your sex.
10. Win screen at 5 wives + 10 offspring (keep playing allowed). Progress auto-saves to localStorage.

## Content
- **11 locations** on the town map (Apartment, Café, Diner, Sakura Park, Aoi Beach, Gym, Library, Mall, Gift Shoppe, Salon, Wedding Shrine).
- **8 bachelorettes**, each with a hangout, favorite gift, dream date spot, and quotes.
- **8 hair styles, 8 outfits, 3 body types** (plus hair/eye/skin color).
- **6 gifts** + Engagement Ring, with favorite-gift and perk multipliers.
- **6 perks**: Side Hustle, Smooth Talker, Gift Bargainer, Stadium Hearts, Quiver Full (twins!), Lucky Charm.
- Hand-drawn SVG characters in a cel-shaded **early-2000s anime** style (big glossy eyes, thick line art, sparkles, gradients).

## Verification
- `node --check` on the extracted script: passes.
- A headless smoke test (`31 checks`) covering boot, customization, shopping, gifting, dates, confession, marriage, pregnancy, randomized offspring, per-day income math, perks, salon makeovers, shrine prayer, and save/load: **31/31 pass**.
