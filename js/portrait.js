/* ============================================================
   portrait.js — parametric early-aughts anime SVG portrait renderer
   Draws a chibi-ish bust: back hair -> body/outfit -> face -> hair -> accessories
   ============================================================ */
(function (global) {
  'use strict';
  const T = global.Traits;
  const OUT = '#4a3540';           // warm dark outline (aughts cel look)
  const CX = 80;
  let uidN = 0;

  const pick = (list, id) => T.MAP[list][id] || T.MAP[list][Object.keys(T.MAP[list])[0]];

  function faceParams(shapeId) {
    const f = pick('FACE_SHAPES', shapeId);
    return { tw: f.tw, cw: f.cw, chinY: f.chinY };
  }
  function facePath(p) {
    const midY = 62 + (p.chinY - 62) * 0.55;
    return `M ${CX - p.tw},64 C ${CX - p.tw},32 ${CX + p.tw},32 ${CX + p.tw},64
      C ${CX + p.tw},${midY} ${CX + p.cw + 8},${p.chinY - 6} ${CX + p.cw},${p.chinY}
      C ${CX + p.cw - 5},${p.chinY + 7} ${CX - p.cw + 5},${p.chinY + 7} ${CX - p.cw},${p.chinY}
      C ${CX - p.cw - 8},${p.chinY - 6} ${CX - p.tw},${midY} ${CX - p.tw},64 Z`;
  }

  /* ---------------- hair ---------------- */
  function hairBack(style, c, dark, light) {
    const s = (inner) => `<g stroke="${OUT}" stroke-width="2" stroke-linejoin="round">${inner}</g>`;
    switch (style) {
      case 'longStraight':
        return s(`<path d="M ${CX - 44},66 L ${CX - 44},164 Q ${CX - 44},178 ${CX - 32},178 L ${CX + 32},178 Q ${CX + 44},178 ${CX + 44},164 L ${CX + 44},66 Q ${CX + 44},24 ${CX},24 Q ${CX - 44},24 ${CX - 44},66 Z" fill="${c}"/>
        <path d="M ${CX - 44},90 L ${CX - 44},170 L ${CX - 30},170 L ${CX - 30},90 Z" fill="${dark}" opacity=".55"/>`);
      case 'wavyLong':
        return s(`<path d="M ${CX - 46},66 Q ${CX - 50},100 ${CX - 42},124 Q ${CX - 50},150 ${CX - 38},176 Q ${CX},186 ${CX + 38},176 Q ${CX + 50},150 ${CX + 42},124 Q ${CX + 50},100 ${CX + 46},66 Q ${CX + 44},24 ${CX},24 Q ${CX - 44},24 ${CX - 46},66 Z" fill="${c}"/>
        <path d="M ${CX - 40},110 Q ${CX - 30},120 ${CX - 38},132" fill="none" stroke="${dark}" stroke-width="3" opacity=".5"/>`);
      case 'twinTails':
        return s(`<ellipse cx="32" cy="104" rx="15" ry="52" fill="${c}"/>
        <ellipse cx="128" cy="104" rx="15" ry="52" fill="${c}"/>
        <ellipse cx="32" cy="104" rx="7" ry="46" fill="${dark}" opacity=".45"/>
        <path d="M ${CX - 42},64 Q ${CX - 42},24 ${CX},24 Q ${CX + 42},24 ${CX + 42},64 Z" fill="${c}"/>`);
      case 'spaceBuns':
        return s(`<circle cx="36" cy="38" r="19" fill="${c}"/><circle cx="124" cy="38" r="19" fill="${c}"/>
        <circle cx="36" cy="38" r="8" fill="${dark}" opacity=".45"/><circle cx="124" cy="38" r="8" fill="${dark}" opacity=".45"/>
        <path d="M ${CX - 42},64 Q ${CX - 42},24 ${CX},24 Q ${CX + 42},24 ${CX + 42},64 Z" fill="${c}"/>`);
      case 'ponytail':
      case 'halfUp':
        return s(`<path d="M 112,44 Q 146,66 134,112 Q 128,150 116,168 Q 130,120 116,74 Q 108,52 104,44 Z" fill="${c}"/>
        <path d="M ${CX - 42},64 Q ${CX - 42},24 ${CX},24 Q ${CX + 42},24 ${CX + 42},64 Z" fill="${c}"/>
        ${style === 'halfUp' ? `<path d="M ${CX - 17},28 Q ${CX},6 ${CX + 17},28 Q ${CX},36 ${CX - 17},28 Z" fill="${c}"/><path d="M ${CX - 12},28 Q ${CX},34 ${CX + 12},28" fill="none" stroke="${dark}" stroke-width="4"/>` : ''}`);
      case 'bob':
        return s(`<path d="M ${CX - 42},66 L ${CX - 42},108 Q ${CX - 42},122 ${CX - 26},122 L ${CX + 26},122 Q ${CX + 42},122 ${CX + 42},108 L ${CX + 42},66 Q ${CX + 42},24 ${CX},24 Q ${CX - 42},24 ${CX - 42},66 Z" fill="${c}"/>`);
      case 'braids':
        return s(`<path d="M ${CX - 42},64 Q ${CX - 42},24 ${CX},24 Q ${CX + 42},24 ${CX + 42},64 Z" fill="${c}"/>
        ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${30 + i * 1.5}" cy="${86 + i * 20}" r="11" fill="${c}"/><circle cx="${130 - i * 1.5}" cy="${86 + i * 20}" r="11" fill="${c}"/>`).join('')}
        ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${30 + i * 1.5}" cy="${90 + i * 20}" r="5" fill="${dark}" opacity=".4"/><circle cx="${130 - i * 1.5}" cy="${90 + i * 20}" r="5" fill="${dark}" opacity=".4"/>`).join('')}`);
      case 'curlyPuff':
        return s(`<g fill="${c}"><circle cx="34" cy="56" r="24"/><circle cx="126" cy="56" r="24"/><circle cx="${CX}" cy="26" r="27"/><circle cx="34" cy="104" r="20"/><circle cx="126" cy="104" r="20"/><circle cx="${CX}" cy="40" r="34"/></g>
        <circle cx="46" cy="38" r="9" fill="${light}" opacity=".7"/>`);
      case 'bun':
        return s(`<circle cx="${CX}" cy="22" r="18" fill="${c}"/><circle cx="${CX}" cy="18" r="7" fill="${dark}" opacity=".45"/>
        <path d="M ${CX - 42},66 Q ${CX - 42},24 ${CX},24 Q ${CX + 42},24 ${CX + 42},66 Z" fill="${c}"/>`);
      case 'wolf':
        return s(`<path d="M ${CX - 44},70 L ${CX - 50},96 L ${CX - 38},96 L ${CX - 42},124 L ${CX - 28},112 L ${CX - 24},138 L ${CX},116 L ${CX + 24},138 L ${CX + 28},112 L ${CX + 42},124 L ${CX + 38},96 L ${CX + 50},96 L ${CX + 44},70 Q ${CX + 40},24 ${CX},22 Q ${CX - 40},24 ${CX - 44},70 Z" fill="${c}"/>`);
      case 'drills':
        return s(`<path d="M ${CX - 42},64 Q ${CX - 42},24 ${CX},24 Q ${CX + 42},24 ${CX + 42},64 Z" fill="${c}"/>
        <path d="M 30,72 q -16,18 0,32 q 16,16 0,32 q -14,16 2,30" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>
        <path d="M 130,72 q 16,18 0,32 q -16,16 0,32 q 14,16 -2,30" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/>
        <path d="M 30,72 q -16,18 0,32 q 16,16 0,32 q -14,16 2,30" fill="none" stroke="${dark}" stroke-width="4" opacity=".45"/>`);
      case 'pixie': case 'buzz': case 'shortSpiky': case 'sideSwept': case 'crownBraid': case 'hime': default:
        if (style === 'hime') {
          return s(`<path d="M ${CX - 44},66 L ${CX - 44},150 Q ${CX - 44},164 ${CX - 32},164 L ${CX + 32},164 Q ${CX + 44},164 ${CX + 44},150 L ${CX + 44},66 Q ${CX + 44},24 ${CX},24 Q ${CX - 44},24 ${CX - 44},66 Z" fill="${c}"/>`);
        }
        return s(`<path d="M ${CX - 42},68 L ${CX - 42},84 L ${CX + 42},84 L ${CX + 42},68 Q ${CX + 42},24 ${CX},24 Q ${CX - 42},24 ${CX - 42},68 Z" fill="${c}"/>`);
    }
  }

  function hairFront(style, c, dark, light, face) {
    const g = (inner) => `<g stroke="${OUT}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${inner}</g>`;
    const topY = 30;
    switch (style) {
      case 'sideSwept':
        return g(`<path d="M ${CX - face.tw - 4},${topY + 4} Q ${CX},${topY - 8} ${CX + face.tw + 4},${topY + 6}
          Q ${CX + 14},52 ${CX + 26},96 Q ${CX + 8},70 ${CX - 20},60 Q ${CX - face.tw - 2},56 ${CX - face.tw - 4},${topY + 4} Z" fill="${c}"/>`);
      case 'wolf': case 'shortSpiky':
        return g(`<path d="M ${CX - face.tw - 3},${topY + 8} Q ${CX - 20},${topY - 6} ${CX - 12},52 L ${CX - 4},38 L ${CX + 4},54 L ${CX + 14},38 L ${CX + 20},56 Q ${CX + 26},40 ${CX + face.tw + 3},${topY + 10}
          Q ${CX + 10},44 ${CX},48 Q ${CX - 14},44 ${CX - face.tw - 3},${topY + 8} Z" fill="${c}"/>`);
      case 'buzz':
        return g(`<path d="M ${CX - face.tw - 2},${topY + 10} Q ${CX},${topY - 6} ${CX + face.tw + 2},${topY + 10} Q ${CX},48 ${CX - face.tw - 2},${topY + 10} Z" fill="${c}"/>`);
      case 'pixie':
        return g(`<path d="M ${CX - face.tw - 4},${topY + 6} Q ${CX - 16},${topY - 6} ${CX + 6},44 L ${CX + face.tw + 4},${topY + 6}
          Q ${CX + 16},60 ${CX - 4},58 Q ${CX - face.tw - 2},54 ${CX - face.tw - 4},${topY + 6} Z" fill="${c}"/>
          <path d="M ${CX - 18},44 Q ${CX - 2},50 ${CX + 10},46" fill="none" stroke="${light}" stroke-width="4" opacity=".6"/>`);
      case 'hime':
        return g(`<path d="M ${CX - face.tw - 3},${topY + 6} Q ${CX},${topY - 8} ${CX + face.tw + 3},${topY + 6}
          Q ${CX + 20},62 ${CX},60 Q ${CX - 20},62 ${CX - face.tw - 3},${topY + 6} Z" fill="${c}"/>
          <rect x="${CX - face.tw - 4}" y="52" width="13" height="52" rx="5" fill="${c}"/>
          <rect x="${CX + face.tw - 9}" y="52" width="13" height="52" rx="5" fill="${c}"/>`);
      case 'curlyPuff':
        return g(`<path d="M ${CX - face.tw - 2},${topY + 6} Q ${CX - 18},${topY - 10} ${CX},42 Q ${CX + 18},${topY - 10} ${CX + face.tw + 2},${topY + 6}
          Q ${CX + 12},56 ${CX},54 Q ${CX - 12},56 ${CX - face.tw - 2},${topY + 6} Z" fill="${c}"/>`);
      case 'drills':
        return g(`<path d="M ${CX - face.tw - 2},${topY + 6} Q ${CX},${topY - 8} ${CX + face.tw + 2},${topY + 6} Q ${CX + 14},54 ${CX},52 Q ${CX - 14},54 ${CX - face.tw - 2},${topY + 6} Z" fill="${c}"/>`);
      default: // blunt-ish fringe with a soft split
        return g(`<path d="M ${CX - face.tw - 3},${topY + 6} Q ${CX - 18},${topY - 8} ${CX - 2},44 L ${CX + 8},36 L ${CX + 14},52 L ${CX + face.tw + 3},${topY + 6}
          Q ${CX + 12},58 ${CX},56 Q ${CX - 14},58 ${CX - face.tw - 3},${topY + 6} Z" fill="${c}"/>
          <path d="M ${CX - 22},42 Q ${CX - 6},48 ${CX + 6},44" fill="none" stroke="${light}" stroke-width="4" opacity=".65"/>`);
    }
  }

  /* ---------------- outfit ---------------- */
  function drawOutfit(o, body, skin, shoulderY, uid) {
    const base = o.base, accent = o.accent, trim = o.trim;
    const dark = T.shade(base, -0.22), skinDark = T.shade(skin, -0.14);
    const sw = body.sw;                       // outer half-width (arms included)
    const tw = Math.max(20, sw - 11);         // torso half-width
    const Y = shoulderY, HIP = 170, BOT = 190;
    const cid = 'sil' + uid, tid = 'tor' + uid;
    const scoop = (o.collar === 'turtleneck' || o.collar === 'suit' || o.collar === 'cross') ? 6 : 15;
    let out = '';

    // 1) full silhouette (arms + torso) in skin
    const sil = `M ${CX - sw},${BOT} L ${CX - sw},${Y + 18} Q ${CX - sw},${Y - 4} ${CX - tw - 1},${Y - 10}
      Q ${CX - 16},${Y - 12} ${CX},${Y + scoop} Q ${CX + 16},${Y - 12} ${CX + tw + 1},${Y - 10}
      Q ${CX + sw},${Y - 4} ${CX + sw},${Y + 18} L ${CX + sw},${BOT} Z`;
    out += `<clipPath id="${cid}"><path d="${sil}"/></clipPath>`;
    out += `<path d="${sil}" fill="${skin}" stroke="${OUT}" stroke-width="2.2"/>`;

    // 2) sleeves painted over the arms (clipped to the silhouette)
    if (o.sleeve !== 'none') {
      const h = o.sleeve === 'long' ? 200 : o.sleeve === 'short' ? 78 : 48;
      const w = sw - tw + 8;
      out += `<g clip-path="url(#${cid})">
        <rect x="${CX - sw - 3}" y="${Y - 12}" width="${w}" height="${h}" fill="${base}"/>
        <rect x="${CX + tw - 5}" y="${Y - 12}" width="${w}" height="${h}" fill="${base}"/>
        <rect x="${CX - tw - 3}" y="${Y - 12}" width="5" height="${h}" fill="${dark}" opacity=".5"/>
        <rect x="${CX + tw - 2}" y="${Y - 12}" width="5" height="${h}" fill="${dark}" opacity=".5"/>
      </g>`;
      if (o.sleeve === 'puffy') {
        out += `<ellipse cx="${CX - sw + 3}" cy="${Y + 6}" rx="12" ry="10" fill="${base}" stroke="${OUT}" stroke-width="2"/>
        <ellipse cx="${CX + sw - 3}" cy="${Y + 6}" rx="12" ry="10" fill="${base}" stroke="${OUT}" stroke-width="2"/>`;
      }
      if (o.sleeve === 'long' || o.sleeve === 'short') {
        const cy = o.sleeve === 'long' ? BOT - 18 : Y + 54;
        out += `<g clip-path="url(#${cid})"><rect x="${CX - sw - 3}" y="${cy}" width="${sw - tw + 8}" height="5" fill="${dark}"/>
        <rect x="${CX + tw - 5}" y="${cy}" width="${sw - tw + 8}" height="5" fill="${dark}"/></g>`;
      }
    }
    // arm seams
    out += `<path d="M ${CX - tw - 1},${Y + 8} L ${CX - tw + 2},${BOT}" stroke="${skinDark}" stroke-width="2" fill="none" opacity=".5"/>
    <path d="M ${CX + tw + 1},${Y + 8} L ${CX + tw - 2},${BOT}" stroke="${skinDark}" stroke-width="2" fill="none" opacity=".5"/>`;

    // 3) torso
    const torso = `M ${CX - tw},${BOT + 8} L ${CX - tw},${Y + 6} Q ${CX - tw - 2},${Y - 6} ${CX - 16},${Y - 9}
      Q ${CX},${Y + scoop} ${CX + 16},${Y - 9} Q ${CX + tw + 2},${Y - 6} ${CX + tw},${Y + 6} L ${CX + tw},${BOT + 8} Z`;
    out += `<clipPath id="${tid}"><path d="${torso}"/></clipPath>`;
    out += `<path d="${torso}" fill="${base}" stroke="${OUT}" stroke-width="2.2"/>`;
    out += `<g clip-path="url(#${tid})"><path d="M ${CX + tw - 9},${Y + 6} L ${CX + tw + 2},${BOT + 8} L ${CX + tw - 16},${BOT + 8} L ${CX + tw - 18},${Y + 8} Z" fill="${dark}" opacity=".45"/></g>`;

    // collar / neckline
    const ny = Y - 9;
    const collarArt = {
      sailor: `<path d="M ${CX - 22},${ny} L ${CX},${ny + 26} L ${CX + 22},${ny} L ${CX + 15},${ny - 2} L ${CX},${ny + 14} L ${CX - 15},${ny - 2} Z" fill="${accent}" stroke="${OUT}" stroke-width="2"/>
        <path d="M ${CX - 20},${ny + 1} L ${CX},${ny + 22} L ${CX + 20},${ny + 1}" fill="none" stroke="${trim}" stroke-width="2.5"/>`,
      ribbon: `<path d="M ${CX - 20},${ny + 2} Q ${CX},${ny + 22} ${CX + 20},${ny + 2}" fill="none" stroke="${accent}" stroke-width="4"/>
        <path d="M ${CX - 12},${ny + 16} l 8,-5 l 4,7 l 4,-7 l 8,5 l -6,7 l -8,-2 l -8,2 Z" fill="${trim}" stroke="${OUT}" stroke-width="1.6"/>`,
      vneck: `<path d="M ${CX - 16},${ny} L ${CX},${ny + 24} L ${CX + 16},${ny}" fill="${T.shade(base, -0.3)}" stroke="${OUT}" stroke-width="2"/>`,
      turtleneck: `<path d="M ${CX - 15},${ny - 8} L ${CX - 14},${ny + 4} Q ${CX},${ny + 12} ${CX + 14},${ny + 4} L ${CX + 15},${ny - 8} Z" fill="${dark}" stroke="${OUT}" stroke-width="2"/>`,
      polo: `<path d="M ${CX - 14},${ny} L ${CX - 10},${ny + 20} L ${CX + 10},${ny + 20} L ${CX + 14},${ny} Z" fill="${T.shade(base, -0.18)}" stroke="${OUT}" stroke-width="2"/>
        <circle cx="${CX}" cy="${ny + 12}" r="2" fill="${trim}"/><circle cx="${CX}" cy="${ny + 22}" r="2" fill="${trim}"/>`,
      strap: `<path d="M ${CX - 16},${ny + 4} L ${CX - 12},${ny + 30}" stroke="${trim}" stroke-width="7" stroke-linecap="round"/>
        <path d="M ${CX + 16},${ny + 4} L ${CX + 12},${ny + 30}" stroke="${trim}" stroke-width="7" stroke-linecap="round"/>`,
      suit: `<path d="M ${CX - 18},${ny} L ${CX},${ny + 26} L ${CX - 6},${ny + 4} L ${CX - 20},${ny + 4} Z" fill="${accent}" stroke="${OUT}" stroke-width="2"/>
        <path d="M ${CX + 18},${ny} L ${CX},${ny + 26} L ${CX + 6},${ny + 4} L ${CX + 20},${ny + 4} Z" fill="${accent}" stroke="${OUT}" stroke-width="2"/>
        <path d="M ${CX},${ny + 26} l -4,6 l 4,26 l 4,-26 Z" fill="${trim}" stroke="${OUT}" stroke-width="1.6"/>`,
      cross: `<path d="M ${CX - 18},${ny} L ${CX + 6},${ny + 26} L ${CX - 12},${ny + 4}" fill="none" stroke="${trim}" stroke-width="3"/>
        <path d="M ${CX + 18},${ny} L ${CX - 6},${ny + 26} L ${CX + 12},${ny + 4}" fill="none" stroke="${trim}" stroke-width="3"/>`,
      round: `<path d="M ${CX - 17},${ny + 2} Q ${CX},${ny + 20} ${CX + 17},${ny + 2}" fill="none" stroke="${trim}" stroke-width="3"/>`,
      none: '',
    }[o.collar] || '';
    out += collarArt;

    // pattern overlay (clipped to torso)
    if (o.pattern && o.pattern !== 'none') {
      let pat = '';
      if (o.pattern === 'floral') {
        for (let i = 0; i < 9; i++) {
          const x = 26 + ((i * 37) % 108), y = Y + 16 + ((i * 29) % 62);
          pat += `<g fill="${trim}" opacity=".8"><circle cx="${x}" cy="${y}" r="3"/><circle cx="${x + 5}" cy="${y + 3}" r="3"/><circle cx="${x - 5}" cy="${y + 3}" r="3"/><circle cx="${x}" cy="${y + 7}" r="3"/><circle cx="${x}" cy="${y + 3}" r="2" fill="${accent}"/></g>`;
        }
      } else if (o.pattern === 'dots') {
        for (let i = 0; i < 12; i++) pat += `<circle cx="${24 + ((i * 31) % 112)}" cy="${Y + 12 + ((i * 23) % 68)}" r="2.6" fill="${accent}" opacity=".85"/>`;
      } else if (o.pattern === 'stripes') {
        for (let i = 0; i < 5; i++) pat += `<rect x="6" y="${Y + 14 + i * 16}" width="148" height="6" fill="${accent}" opacity=".55"/>`;
      } else if (o.pattern === 'stars') {
        for (let i = 0; i < 8; i++) pat += `<path d="M ${28 + ((i * 41) % 104)},${Y + 14 + ((i * 27) % 64)} l 3,6 l 7,1 l -5,5 l 1,7 l -6,-3 l -6,3 l 1,-7 l -5,-5 l 7,-1 Z" fill="${trim}" opacity=".8"/>`;
      }
      out += `<g clip-path="url(#${tid})">${pat}</g>`;
    }

    // bust hint
    if (body.bust > 0.3) {
      out += `<path d="M ${CX - 17},${Y + 22} Q ${CX},${Y + 30 + body.bust * 6} ${CX + 17},${Y + 22}" fill="none" stroke="${dark}" stroke-width="2" opacity=".65"/>`;
    }

    // frills at the hem
    if (o.frills) {
      let fr = '';
      for (let i = 0; i < 8; i++) fr += `<circle cx="${CX - tw + 5 + i * ((tw * 2 - 10) / 7)}" cy="${HIP + 16}" r="8" fill="${accent}" stroke="${OUT}" stroke-width="1.4"/>`;
      out += fr;
    }

    // lower body: skirt or pants
    if (o.skirt === 'pants') {
      out += `<path d="M ${CX - tw + 2},${176} L ${CX - tw + 4},${BOT + 4} L ${CX - 4},${BOT + 4} L ${CX - 3},${176} Z" fill="${dark}" stroke="${OUT}" stroke-width="1.6"/>
      <path d="M ${CX + tw - 2},${176} L ${CX + tw - 4},${BOT + 4} L ${CX + 4},${BOT + 4} L ${CX + 3},${176} Z" fill="${dark}" stroke="${OUT}" stroke-width="1.6"/>`;
    } else {
      const flare = o.skirt === 'gown' ? 32 : o.skirt === 'short' ? 13 : 21;
      const drop = o.skirt === 'gown' ? 34 : o.skirt === 'short' ? 20 : 26;
      out += `<path d="M ${CX - tw - 3},${HIP - 4} L ${CX - tw - flare},${HIP + drop} Q ${CX},${HIP + drop + 10} ${CX + tw + flare},${HIP + drop} L ${CX + tw + 3},${HIP - 4} Z" fill="${base}" stroke="${OUT}" stroke-width="2.2"/>`;
      if (o.skirt === 'pleat' || o.skirt === 'gown') {
        for (let i = -2; i <= 2; i++) out += `<path d="M ${CX + i * 8},${HIP - 2} L ${CX + i * (8 + flare / 3)},${HIP + drop + 2}" stroke="${dark}" stroke-width="2" opacity=".5" fill="none"/>`;
      }
      out += `<path d="M ${CX + tw - 4},${HIP - 2} L ${CX + tw + flare - 4},${HIP + drop} L ${CX + tw + flare - 12},${HIP + drop} Z" fill="${dark}" opacity=".35"/>`;
    }
    return out;
  }

  function drawAccessory(acc, hairC, dark, light, skin) {
    switch (acc) {
      case 'ribbon': return `<g stroke="${OUT}" stroke-width="2"><path d="M 122,40 l 14,-8 l 4,12 l 12,-4 l -2,14 l -14,2 l -8,-8 Z" fill="#ff7fae"/><circle cx="133" cy="47" r="4" fill="#ffd0e2"/></g>`;
      case 'flower': return `<g stroke="${OUT}" stroke-width="1.6">${[0, 72, 144, 216, 288].map((a) => { const r = (a * Math.PI) / 180; return `<ellipse cx="${44 + Math.cos(r) * 7}" cy="${44 + Math.sin(r) * 7}" rx="6" ry="5" fill="#ff9ec4"/>`; }).join('')}<circle cx="44" cy="44" r="4" fill="#ffe07a"/></g>`;
      case 'glasses': return `<g fill="none" stroke="#3b3145" stroke-width="2.4"><circle cx="62" cy="86" r="14" fill="#dff2ff" opacity=".55"/><circle cx="98" cy="86" r="14" fill="#dff2ff" opacity=".55"/><path d="M 76,85 q 4,-4 8,0"/><path d="M 48,82 l -8,-4"/><path d="M 112,82 l 8,-4"/></g>`;
      case 'tiara': return `<g stroke="${OUT}" stroke-width="1.8"><path d="M 62,34 l 6,-14 l 12,10 l 12,-16 l 12,16 l 12,-10 l 6,14 Z" fill="#ffe28a"/><circle cx="80" cy="24" r="4" fill="#7fe3ff"/><circle cx="60" cy="30" r="3" fill="#ff8fb8"/><circle cx="100" cy="30" r="3" fill="#ff8fb8"/></g>`;
      case 'catears': return `<g stroke="${OUT}" stroke-width="2"><path d="M 46,40 l -6,-26 l 24,12 Z" fill="${hairC}"/><path d="M 114,40 l 6,-26 l -24,12 Z" fill="${hairC}"/><path d="M 50,36 l -3,-14 l 13,7 Z" fill="#ffb3cd"/><path d="M 110,36 l 3,-14 l -13,7 Z" fill="#ffb3cd"/></g>`;
      case 'phones': return `<g stroke="${OUT}" stroke-width="2" fill="none"><path d="M 40,70 q 40,-46 80,0" stroke="#3b3145" stroke-width="7"/><rect x="30" y="66" width="18" height="26" rx="6" fill="#8fd0e8"/><rect x="112" y="66" width="18" height="26" rx="6" fill="#8fd0e8"/></g>`;
      case 'earrings': return `<g fill="#ffe07a" stroke="${OUT}" stroke-width="1.2">${[44, 116].map((x) => `<path d="M ${x},92 l 3,6 l 7,1 l -5,5 l 1,7 l -6,-3 l -6,3 l 1,-7 l -5,-5 l 7,-1 Z"/>`).join('')}</g>`;
      case 'beret': return `<g stroke="${OUT}" stroke-width="2"><path d="M 38,44 q 6,-30 42,-30 q 34,0 42,26 q -40,12 -84,4 Z" fill="#c8452f"/><circle cx="80" cy="12" r="5" fill="#8d2f2b"/></g>`;
      case 'starclip': return `<g fill="#ffe07a" stroke="${OUT}" stroke-width="1.4"><path d="M 118,50 l 4,8 l 9,1 l -7,6 l 2,9 l -8,-4 l -8,4 l 2,-9 l -7,-6 l 9,-1 Z"/><path d="M 106,68 l 2,5 l 6,1 l -4,4 l 1,6 l -5,-3 l -5,3 l 1,-6 l -4,-4 l 6,-1 Z"/></g>`;
      case 'veil': return `<g stroke="${OUT}" stroke-width="1.6"><path d="M 44,40 Q 80,4 116,40 Q 122,120 96,150 L 64,150 Q 38,120 44,40 Z" fill="#ffffff" opacity=".5"/></g>`;
      case 'bandana': return `<g stroke="${OUT}" stroke-width="2"><path d="M ${CX - 40},54 Q ${CX},40 ${CX + 40},54 L ${CX + 40},64 Q ${CX},52 ${CX - 40},64 Z" fill="#e8593f"/><path d="M 120,58 l 16,-6 l 4,12 l -14,2 Z" fill="#e8593f"/></g>`;
      default: return '';
    }
  }

  /**
   * Render an SVG portrait for a character {look:{...}, gender}
   * opts: {bg: bool}
   */
  function portrait(char, opts) {
    opts = opts || {};
    const look = char.look || char;
    const gender = char.gender || 'female';
    const uid = ++uidN;
    const skin = pick('SKINS', look.skin).hex;
    const hair = pick('HAIR_COLORS', look.hairColor);
    const hairC = hair.hex, hairDark = T.shade(hairC, -0.25), hairLight = T.shade(hairC, 0.35);
    const eye = pick('EYE_COLORS', look.eyeColor).hex;
    const eyeDark = T.shade(eye, -0.35);
    const body = pick('BODY_TYPES', look.bodyType);
    const face = faceParams(look.faceShape);
    const outfit = pick('OUTFITS', look.outfit) || T.OUTFITS[0];
    const isMale = gender === 'male';
    const shoulderY = 128 - body.lift;
    const darkSkin = T.shade(skin, -0.12);

    let s = `<svg class="portrait" viewBox="0 0 160 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="portrait">`;
    if (opts.bg) {
      s += `<defs><radialGradient id="bg${uid}" cx="50%" cy="35%" r="80%">
        <stop offset="0%" stop-color="#fff3fa"/><stop offset="100%" stop-color="#ffd7ec"/></radialGradient></defs>
        <rect width="160" height="210" fill="url(#bg${uid})"/>
        <g fill="#ffffff" opacity=".8"><circle cx="20" cy="26" r="3"/><circle cx="140" cy="40" r="2"/><circle cx="30" cy="150" r="2"/><circle cx="132" cy="170" r="3"/></g>`;
    }

    // back hair
    s += hairBack(look.hairStyle, hairC, hairDark, hairLight);

    // neck + body
    s += `<path d="M ${CX - 9},${face.chinY - 10} L ${CX - 9},${shoulderY} L ${CX + 9},${shoulderY} L ${CX + 9},${face.chinY - 10} Z" fill="${darkSkin}" stroke="${OUT}" stroke-width="2"/>`;
    s += drawOutfit(outfit, body, skin, shoulderY, uid);

    // ears
    s += `<ellipse cx="${CX - face.tw + 1}" cy="88" rx="6" ry="9" fill="${skin}" stroke="${OUT}" stroke-width="2"/>
    <ellipse cx="${CX + face.tw - 1}" cy="88" rx="6" ry="9" fill="${skin}" stroke="${OUT}" stroke-width="2"/>`;

    // face
    s += `<path d="${facePath(face)}" fill="${skin}" stroke="${OUT}" stroke-width="2.4"/>`;
    // cheek cel shade
    s += `<path d="M ${CX + face.tw - 6},70 Q ${CX + 14},104 ${CX + 6},${face.chinY - 4} Q ${CX + face.tw - 8},${face.chinY - 6} ${CX + face.tw - 2},80 Z" fill="${darkSkin}" opacity=".35"/>`;

    // blush / freckles
    if (look.blush) s += `<ellipse cx="${CX - 24}" cy="98" rx="9" ry="4.5" fill="#ff8fae" opacity=".38"/><ellipse cx="${CX + 24}" cy="98" rx="9" ry="4.5" fill="#ff8fae" opacity=".38"/>`;
    if (look.freckles) {
      let f = '';
      for (let i = 0; i < 10; i++) f += `<circle cx="${CX - 30 + ((i * 13) % 60)}" cy="${94 + ((i * 7) % 12)}" r="1.3" fill="${T.shade(skin, -0.35)}" opacity=".8"/>`;
      s += f;
    }

    // eyes
    const eyeY = 86, ey = isMale ? 10.5 : 12.5, ex = isMale ? 10 : 10.8, sp = 17;
    const drawEye = (x, dir) => `
      <g>
        <path d="M ${x - ex},${eyeY + 1} Q ${x},${eyeY - ey - 2} ${x + ex},${eyeY + 1}
          Q ${x + ex - 2},${eyeY + ey} ${x},${eyeY + ey + 1} Q ${x - ex + 2},${eyeY + ey} ${x - ex},${eyeY + 1} Z" fill="#ffffff"/>
        <ellipse cx="${x}" cy="${eyeY + 1}" rx="${ex - 1.4}" ry="${ey - 0.6}" fill="${eye}"/>
        <path d="M ${x - ex + 2},${eyeY + 3} a ${ex - 2} ${ey - 1} 0 0 0 ${2 * (ex - 2)},0 Z" fill="${eyeDark}" opacity=".5"/>
        <ellipse cx="${x}" cy="${eyeY + 1.5}" rx="4" ry="5.4" fill="#241d2b"/>
        <circle cx="${x - 3.4}" cy="${eyeY - 4.5}" r="3.2" fill="#ffffff"/>
        <circle cx="${x + 3}" cy="${eyeY + 4}" r="1.6" fill="#ffffff" opacity=".85"/>
        <path d="M ${x - ex - 2},${eyeY - 5} Q ${x},${eyeY - ey - 5} ${x + ex + 2},${eyeY - 6}" fill="none" stroke="#2a2130" stroke-width="${isMale ? 3.2 : 4}" stroke-linecap="round"/>
        <path d="M ${x + dir * (ex + 2)},${eyeY - 6} l ${dir * 7},-5" stroke="#2a2130" stroke-width="3" stroke-linecap="round"/>
        ${isMale ? '' : `<path d="M ${x - ex + 2},${eyeY + ey - 2} Q ${x},${eyeY + ey + 2} ${x + ex - 2},${eyeY + ey - 4}" fill="none" stroke="#2a2130" stroke-width="1.5" opacity=".6"/>`}
      </g>`;
    s += drawEye(CX - sp, -1) + drawEye(CX + sp, 1);

    // brows
    const browY = eyeY - (isMale ? 17 : 18);
    s += `<path d="M ${CX - sp - 10},${browY + 3} Q ${CX - sp},${browY - 3} ${CX - sp + 10},${browY + 1}" fill="none" stroke="${hairDark}" stroke-width="${isMale ? 4 : 3}" stroke-linecap="round"/>
    <path d="M ${CX + sp - 10},${browY + 1} Q ${CX + sp},${browY - 3} ${CX + sp + 10},${browY + 3}" fill="none" stroke="${hairDark}" stroke-width="${isMale ? 4 : 3}" stroke-linecap="round"/>`;

    // nose + mouth
    s += `<path d="M ${CX - 1},${98} q 4,4 -1,6" fill="none" stroke="${T.shade(skin, -0.35)}" stroke-width="2" stroke-linecap="round"/>`;
    s += `<path d="M ${CX - 8},110 Q ${CX},118 ${CX + 8},110" fill="none" stroke="#b8586c" stroke-width="2.4" stroke-linecap="round"/>`;

    // front hair + accessories on top
    s += hairFront(look.hairStyle, hairC, hairDark, hairLight, face);
    s += drawAccessory(look.accessory, hairC, hairDark, hairLight, skin);

    s += `</svg>`;
    return s;
  }

  global.Portrait = { portrait };
})(window);
