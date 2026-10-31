/* ============================================================
   traits.js — appearance trait pools + helpers (early-aughts anime)
   ============================================================ */
(function (global) {
  'use strict';

  // ---- color helpers -------------------------------------------------
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function rgbToHex(r, g, b) {
    const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    return '#' + c(r) + c(g) + c(b);
  }
  /** darken (amt<0) or lighten (amt>0) a hex color */
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    if (amt < 0) return rgbToHex(r * (1 + amt), g * (1 + amt), b * (1 + amt));
    return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
  }

  const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  // ---- trait pools ---------------------------------------------------
  const SKINS = [
    { id: 'porcelain', name: 'Porcelain', hex: '#ffe7d6' },
    { id: 'fair', name: 'Fair', hex: '#fbdcc2' },
    { id: 'ivory', name: 'Ivory', hex: '#f6d0ae' },
    { id: 'honey', name: 'Honey', hex: '#eab891' },
    { id: 'tan', name: 'Tan', hex: '#d69f72' },
    { id: 'caramel', name: 'Caramel', hex: '#bd8353' },
    { id: 'bronze', name: 'Bronze', hex: '#9c663d' },
    { id: 'espresso', name: 'Espresso', hex: '#734726' },
  ];

  const HAIR_STYLES = [
    { id: 'longStraight', name: 'Long Straight' },
    { id: 'twinTails', name: 'Twin Tails' },
    { id: 'ponytail', name: 'Ponytail' },
    { id: 'bob', name: 'Bob Cut' },
    { id: 'shortSpiky', name: 'Short Spiky' },
    { id: 'pixie', name: 'Pixie Cut' },
    { id: 'curlyPuff', name: 'Curly Puff' },
    { id: 'braids', name: 'Twin Braids' },
    { id: 'bun', name: 'Top Bun' },
    { id: 'hime', name: 'Hime Cut' },
    { id: 'wavyLong', name: 'Wavy Long' },
    { id: 'wolf', name: 'Wolf Cut' },
    { id: 'crownBraid', name: 'Braided Crown' },
    { id: 'sideSwept', name: 'Side Swept' },
    { id: 'spaceBuns', name: 'Space Buns' },
    { id: 'buzz', name: 'Buzz Cut' },
    { id: 'drills', name: 'Drill Curls' },
    { id: 'halfUp', name: 'Half-Up Tie' },
  ];

  const HAIR_COLORS = [
    { id: 'jet', name: 'Jet Black', hex: '#221c2b' },
    { id: 'raven', name: 'Raven Blue', hex: '#2e3a63' },
    { id: 'chestnut', name: 'Chestnut', hex: '#5c3823' },
    { id: 'choco', name: 'Chocolate', hex: '#43291b' },
    { id: 'caramel', name: 'Caramel', hex: '#a4682f' },
    { id: 'honey', name: 'Honey Blonde', hex: '#e0b25a' },
    { id: 'platinum', name: 'Platinum', hex: '#f0e4c2' },
    { id: 'ginger', name: 'Ginger', hex: '#c8552b' },
    { id: 'rose', name: 'Rose Pink', hex: '#f28cb6' },
    { id: 'bubblegum', name: 'Bubblegum', hex: '#f7b3d1' },
    { id: 'crimson', name: 'Crimson', hex: '#a8213c' },
    { id: 'lavender', name: 'Lavender', hex: '#b18fe0' },
    { id: 'sky', name: 'Sky Blue', hex: '#7cc4ee' },
    { id: 'mint', name: 'Mint Green', hex: '#79d6b2' },
    { id: 'peach', name: 'Peach', hex: '#f7b98d' },
    { id: 'silver', name: 'Silver White', hex: '#dcdce6' },
  ];

  const EYE_COLORS = [
    { id: 'brown', name: 'Brown', hex: '#7a4a25' },
    { id: 'amber', name: 'Amber', hex: '#d3903a' },
    { id: 'hazel', name: 'Hazel', hex: '#9a8143' },
    { id: 'forest', name: 'Forest', hex: '#3f7d4c' },
    { id: 'emerald', name: 'Emerald', hex: '#31a87a' },
    { id: 'sky', name: 'Sky Blue', hex: '#4fa9e0' },
    { id: 'sapphire', name: 'Sapphire', hex: '#2f5fb8' },
    { id: 'violet', name: 'Violet', hex: '#8a5fd6' },
    { id: 'ruby', name: 'Ruby', hex: '#c03a4e' },
    { id: 'rose', name: 'Rose', hex: '#e07aa8' },
    { id: 'steel', name: 'Steel Grey', hex: '#7d8798' },
    { id: 'ice', name: 'Ice Blue', hex: '#a8d8ee' },
    { id: 'gold', name: 'Gold', hex: '#e6c04a' },
    { id: 'onyx', name: 'Onyx', hex: '#2c2733' },
  ];

  const FACE_SHAPES = [
    { id: 'round', name: 'Round Face', tw: 38, cw: 17, chinY: 116 },
    { id: 'oval', name: 'Oval Face', tw: 34, cw: 12, chinY: 119 },
    { id: 'heart', name: 'Heart Face', tw: 40, cw: 8, chinY: 121 },
    { id: 'soft', name: 'Soft Square', tw: 37, cw: 19, chinY: 113 },
    { id: 'sharp', name: 'Sharp Face', tw: 35, cw: 10, chinY: 120 },
  ];

  const BODY_TYPES = [
    { id: 'petite', name: 'Petite', sw: 29, lift: 6, bust: 0.0 },
    { id: 'slim', name: 'Slim', sw: 32, lift: 2, bust: 0.15 },
    { id: 'curvy', name: 'Curvy', sw: 33, lift: 0, bust: 0.9 },
    { id: 'athletic', name: 'Athletic', sw: 37, lift: 0, bust: 0.35 },
    { id: 'tall', name: 'Tall & Lean', sw: 35, lift: -4, bust: 0.2 },
    { id: 'soft', name: 'Soft & Plush', sw: 42, lift: 0, bust: 0.7 },
    { id: 'statuesque', name: 'Statuesque', sw: 39, lift: -3, bust: 0.55 },
    { id: 'compact', name: 'Compact', sw: 33, lift: 4, bust: 0.1 },
  ];

  // collar: sailor | ribbon | vneck | turtleneck | polo | strap | suit | round | cross
  // sleeve: long | short | puffy | none ; skirt: normal | gown | pleat | short | pants
  const OUTFITS = [
    { id: 'seifuku', name: 'Sailor Seifuku', price: 120, base: '#f7f4ee', accent: '#2c3f78', trim: '#e14b5a', collar: 'sailor', sleeve: 'long', skirt: 'pleat', pattern: 'none', tag: 'School' },
    { id: 'sundress', name: 'Floral Sundress', price: 180, base: '#ffd0e0', accent: '#ffffff', trim: '#e8749b', collar: 'round', sleeve: 'puffy', skirt: 'normal', pattern: 'floral', tag: 'Casual' },
    { id: 'hoodie', name: 'Cozy Hoodie', price: 140, base: '#8fd0e8', accent: '#e9f7ff', trim: '#5aa6c4', collar: 'round', sleeve: 'long', skirt: 'pants', pattern: 'none', tag: 'Casual' },
    { id: 'kimono', name: 'Silk Kimono', price: 420, base: '#f3b7c9', accent: '#fff2f6', trim: '#c4547c', collar: 'cross', sleeve: 'long', skirt: 'gown', pattern: 'floral', tag: 'Traditional' },
    { id: 'maid', name: 'Maid Outfit', price: 380, base: '#312b3d', accent: '#ffffff', trim: '#ffffff', collar: 'ribbon', sleeve: 'long', skirt: 'pleat', pattern: 'none', frills: 1, tag: 'Cute' },
    { id: 'apron', name: 'Apron Dress', price: 200, base: '#a9d6a0', accent: '#fff8e8', trim: '#6ba363', collar: 'round', sleeve: 'short', skirt: 'normal', pattern: 'dots', tag: 'Home' },
    { id: 'sweater', name: 'Oversize Sweater', price: 160, base: '#f2c98b', accent: '#fff3dd', trim: '#c99a55', collar: 'round', sleeve: 'long', skirt: 'pants', pattern: 'stripes', tag: 'Casual' },
    { id: 'blazer', name: 'Office Blazer', price: 340, base: '#39406b', accent: '#f4f4f8', trim: '#c9cede', collar: 'suit', sleeve: 'long', skirt: 'pleat', pattern: 'none', tag: 'Work' },
    { id: 'tank', name: 'Sunny Tank Top', price: 90, base: '#ffe07a', accent: '#fff6d4', trim: '#e0ac2f', collar: 'round', sleeve: 'none', skirt: 'short', pattern: 'stars', tag: 'Summer' },
    { id: 'gym', name: 'Gym Set', price: 150, base: '#f47ab0', accent: '#ffe3f0', trim: '#c94f86', collar: 'vneck', sleeve: 'none', skirt: 'short', pattern: 'none', tag: 'Sport' },
    { id: 'gown', name: 'Wedding Gown', price: 900, base: '#fffdf8', accent: '#ffffff', trim: '#f2d7e3', collar: 'round', sleeve: 'puffy', skirt: 'gown', pattern: 'none', frills: 1, tag: 'Bridal' },
    { id: 'yukata', name: 'Festival Yukata', price: 240, base: '#9ad2e8', accent: '#eaf7ff', trim: '#3f7fa3', collar: 'cross', sleeve: 'long', skirt: 'gown', pattern: 'dots', tag: 'Traditional' },
    { id: 'gothic', name: 'Gothic Lolita', price: 520, base: '#2a2333', accent: '#b48fd6', trim: '#7a5aa0', collar: 'ribbon', sleeve: 'long', skirt: 'pleat', pattern: 'none', frills: 1, tag: 'Lolita' },
    { id: 'teejeans', name: 'Tee & Jeans', price: 100, base: '#f6f2ea', accent: '#7fa8d8', trim: '#d9d2c4', collar: 'round', sleeve: 'short', skirt: 'pants', pattern: 'none', tag: 'Casual' },
    { id: 'turtleneck', name: 'Turtleneck Knit', price: 210, base: '#c0453f', accent: '#ffe6e2', trim: '#8d2f2b', collar: 'turtleneck', sleeve: 'long', skirt: 'normal', pattern: 'none', tag: 'Winter' },
    { id: 'princess', name: 'Princess Gown', price: 1200, base: '#cfa8ea', accent: '#fff0ff', trim: '#8f5fc0', collar: 'round', sleeve: 'puffy', skirt: 'gown', pattern: 'stars', frills: 1, tag: 'Royal' },
    { id: 'lab', name: 'Lab Coat', price: 300, base: '#fbfbfb', accent: '#e8f1f6', trim: '#b9c6cf', collar: 'vneck', sleeve: 'long', skirt: 'normal', pattern: 'none', tag: 'Work' },
    { id: 'overalls', name: 'Denim Overalls', price: 170, base: '#7fa8d8', accent: '#f6f2ea', trim: '#4d76a8', collar: 'round', sleeve: 'short', skirt: 'pants', pattern: 'none', tag: 'Casual' },
    { id: 'jersey', name: 'Sporty Jersey', price: 130, base: '#7ed6a8', accent: '#eafff3', trim: '#3f9e72', collar: 'polo', sleeve: 'short', skirt: 'short', pattern: 'stripes', tag: 'Sport' },
    { id: 'party', name: 'Party Dress', price: 460, base: '#ff9ec4', accent: '#fff0f7', trim: '#d4548c', collar: 'strap', sleeve: 'none', skirt: 'short', pattern: 'stars', tag: 'Party' },
    { id: 'suitm', name: 'Sharp Suit', price: 640, base: '#2b2f45', accent: '#f2f2f7', trim: '#c0c6dd', collar: 'suit', sleeve: 'long', skirt: 'pants', pattern: 'none', tag: 'Formal' },
    { id: 'varsity', name: 'Varsity Jacket', price: 260, base: '#c8452f', accent: '#f7f2e6', trim: '#f0d67a', collar: 'polo', sleeve: 'long', skirt: 'pants', pattern: 'none', tag: 'Sport' },
  ];

  const ACCESSORIES = [
    { id: 'none', name: 'None' },
    { id: 'ribbon', name: 'Satin Ribbon' },
    { id: 'flower', name: 'Hibiscus Flower' },
    { id: 'glasses', name: 'Round Glasses' },
    { id: 'tiara', name: 'Tiara' },
    { id: 'catears', name: 'Cat Ears' },
    { id: 'phones', name: 'Headphones' },
    { id: 'earrings', name: 'Star Earrings' },
    { id: 'beret', name: 'Beret' },
    { id: 'starclip', name: 'Star Hair Clip' },
    { id: 'veil', name: 'Bridal Veil' },
    { id: 'bandana', name: 'Bandana' },
  ];

  // ---- look helpers ---------------------------------------------------
  const byId = (list) => list.reduce((m, t) => ((m[t.id] = t), m), {});

  const LOOK_DEFAULTS = {
    female: {
      skin: 'fair', hairStyle: 'longStraight', hairColor: 'chestnut', eyeColor: 'brown',
      faceShape: 'heart', bodyType: 'curvy', outfit: 'sundress', accessory: 'none',
      blush: 1, freckles: 0,
    },
    male: {
      skin: 'honey', hairStyle: 'shortSpiky', hairColor: 'jet', eyeColor: 'brown',
      faceShape: 'sharp', bodyType: 'athletic', outfit: 'teejeans', accessory: 'none',
      blush: 0, freckles: 0,
    },
  };

  function defaultLook(gender) {
    return Object.assign({}, LOOK_DEFAULTS[gender === 'female' ? 'female' : 'male']);
  }

  /** Random look, optionally biased toward a "feminine" or "masculine" base */
  function randomLook(baseGender) {
    const g = baseGender || (Math.random() < 0.5 ? 'female' : 'male');
    return {
      skin: rnd(SKINS).id,
      hairStyle: rnd(HAIR_STYLES).id,
      hairColor: rnd(HAIR_COLORS).id,
      eyeColor: rnd(EYE_COLORS).id,
      faceShape: rnd(FACE_SHAPES).id,
      bodyType: g === 'female' ? rnd(['curvy', 'slim', 'petite', 'athletic', 'soft', 'statuesque', 'tall', 'compact']) : rnd(BODY_TYPES).id,
      outfit: rnd(OUTFITS).id,
      accessory: rnd(ACCESSORIES).id,
      blush: Math.random() < 0.6 ? 1 : 0,
      freckles: Math.random() < 0.2 ? 1 : 0,
    };
  }

  /** random combination of two parents — every trait picked from either side */
  function mixLooks(a, b) {
    const pick = () => (Math.random() < 0.5 ? a : b);
    const out = {};
    Object.keys(LOOK_DEFAULTS.female).forEach((k) => { out[k] = pick()[k]; });
    // small chance of a fresh mutation so the family tree stays lively
    if (Math.random() < 0.12) out.hairColor = rnd(HAIR_COLORS).id;
    if (Math.random() < 0.10) out.eyeColor = rnd(EYE_COLORS).id;
    if (Math.random() < 0.12) out.hairStyle = rnd(HAIR_STYLES).id;
    if (Math.random() < 0.08) out.skin = rnd(SKINS).id;
    if (Math.random() < 0.08) out.outfit = rnd(OUTFITS).id;
    if (Math.random() < 0.06) out.accessory = rnd(ACCESSORIES).id;
    out.blush = Math.random() < 0.5 ? 1 : 0;
    out.freckles = a.freckles || b.freckles ? (Math.random() < 0.7 ? 1 : 0) : (Math.random() < 0.15 ? 1 : 0);
    return out;
  }

  const MAP = {
    SKINS: byId(SKINS), HAIR_STYLES: byId(HAIR_STYLES), HAIR_COLORS: byId(HAIR_COLORS),
    EYE_COLORS: byId(EYE_COLORS), FACE_SHAPES: byId(FACE_SHAPES), BODY_TYPES: byId(BODY_TYPES),
    OUTFITS: byId(OUTFITS), ACCESSORIES: byId(ACCESSORIES),
  };

  global.Traits = {
    SKINS, HAIR_STYLES, HAIR_COLORS, EYE_COLORS, FACE_SHAPES, BODY_TYPES, OUTFITS, ACCESSORIES,
    MAP, shade, hexToRgb, rnd, ri, defaultLook, randomLook, mixLooks,
  };
})(window);
