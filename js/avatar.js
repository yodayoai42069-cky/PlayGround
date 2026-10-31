// Original procedural anime portraits. Every character in Maple Hollow is drawn
// from layers so outfits, bodies, features, and family traits can mix freely.

import {
  SKIN_TONES, HAIR_COLORS, EYE_COLORS, HAIR_STYLES, BODY_TYPES,
  EYE_SHAPES, MOUTHS, OUTFITS, ACCESSORIES, uid
} from './data.js';

const byId = (list, id, fallback = 0) => list.find(x => x.id === id) || list[fallback];

const BODY_DIMS = {
  petite: { shoulder: 39, waist: 30, hip: 43, arm: 15 },
  slim: { shoulder: 45, waist: 34, hip: 47, arm: 16 },
  curvy: { shoulder: 48, waist: 32, hip: 56, arm: 17 },
  athletic: { shoulder: 56, waist: 41, hip: 50, arm: 20 },
  broad: { shoulder: 62, waist: 49, hip: 54, arm: 22 },
  soft: { shoulder: 53, waist: 45, hip: 58, arm: 20 }
};

const hairHighlight = (c, p) => `<path d="M${105 + (p.hairX || 0)} ${102 + (p.hairY || 0)} C 123 78, 157 72, 185 91" fill="none" stroke="${c.light}" stroke-width="5" stroke-linecap="round" opacity=".45"/>`;

function torsoPath(sw, waist, hip, top = 258, bottom = 405) {
  return `M${150 - sw} ${top}
    C${150 - sw - 10} ${top + 37}, ${150 - waist - 13} ${top + 92}, ${150 - hip} ${bottom}
    L${150 + hip} ${bottom}
    C${150 + waist + 13} ${top + 92}, ${150 + sw + 10} ${top + 37}, ${150 + sw} ${top}
    C${150 + sw * .55} ${top - 14}, ${150 - sw * .55} ${top - 14}, ${150 - sw} ${top}Z`;
}

function armPaths(sw, arm, skin) {
  return `
    <path d="M${150 - sw + 2} 265 C${150 - sw - 17} 295, ${150 - sw - 20} 345, ${150 - sw - 8} 408 L${150 - sw + 20} 406 C${150 - sw + 11} 350, ${150 - sw + 12} 302, ${150 - sw + 19} 278Z" fill="${skin.base}" stroke="${skin.line}" stroke-width="3"/>
    <path d="M${150 + sw - 2} 265 C${150 + sw + 17} 295, ${150 + sw + 20} 345, ${150 + sw + 8} 408 L${150 + sw - 20} 406 C${150 + sw - 11} 350, ${150 + sw - 12} 302, ${150 + sw - 19} 278Z" fill="${skin.base}" stroke="${skin.line}" stroke-width="3"/>
    <path d="M${150 - sw - 5} 293 C${150 - sw - 8} 320, ${150 - sw - 8} 352, ${150 - sw + 4} 390" fill="none" stroke="${skin.shade}" stroke-width="5" opacity=".3" stroke-linecap="round"/>
    <path d="M${150 + sw + 5} 293 C${150 + sw + 8} 320, ${150 + sw + 8} 352, ${150 + sw - 4} 390" fill="none" stroke="${skin.shade}" stroke-width="5" opacity=".3" stroke-linecap="round"/>
  `;
}

function outfitLayer(p, c, dims, defs) {
  const [main, light, dark] = c.palette;
  const sw = dims.shoulder * (p.bodyScale || 1);
  const waist = dims.waist * (p.bodyScale || 1);
  const hip = dims.hip * (p.bodyScale || 1);
  const torso = torsoPath(sw, waist, hip);
  const outline = '#46364b';
  const stitch = `stroke="${dark}" stroke-width="2.5" stroke-linecap="round"`;

  switch (c.id) {
    case 'hoodie':
      return `
        <path d="${torso}" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - sw + 9} 258 C${150 - sw + 9} 230, ${150 + sw - 9} 230, ${150 + sw - 9} 258 C${150 + sw - 24} 277, ${150 + sw - 35} 300, ${150 + sw - 30} 335 L${150 - sw + 30} 335 C${150 - sw + 35} 300, ${150 - sw + 24} 277, ${150 - sw + 9} 258Z" fill="${light}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - sw + 8} 270 C${150 - sw + 16} 300, ${150 - sw + 12} 352, ${150 - sw + 3} 402" fill="none" stroke="${dark}" stroke-width="4" opacity=".7"/>
        <path d="M${150 + sw - 8} 270 C${150 + sw - 16} 300, ${150 + sw - 12} 352, ${150 + sw - 3} 402" fill="none" stroke="${dark}" stroke-width="4" opacity=".7"/>
        <path d="M${150 - 43} 342 L${150 + 43} 342 L${150 + 46} 385 L${150 - 46} 385Z" fill="${dark}" opacity=".2"/>
        <path d="M139 278 L139 311 M161 278 L161 311" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="139" cy="314" r="3.5" fill="${dark}"/><circle cx="161" cy="314" r="3.5" fill="${dark}"/>
        <path d="M${150 - sw + 8} 269 C${150 - sw - 4} 292, ${150 - sw - 2} 335, ${150 - sw + 14} 357" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 + sw - 8} 269 C${150 + sw + 4} 292, ${150 + sw + 2} 335, ${150 + sw - 14} 357" fill="${main}" stroke="${outline}" stroke-width="3"/>
      `;
    case 'sailor':
      return `
        <path d="${torso}" fill="${light}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - sw + 3} 264 C${150 - sw - 1} 293, ${150 - sw + 1} 337, ${150 - sw + 13} 357 L${150 - sw + 34} 349 C${150 - sw + 12} 327, ${150 - sw + 17} 292, ${150 - sw + 19} 268Z" fill="${light}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 + sw - 3} 264 C${150 + sw + 1} 293, ${150 + sw - 1} 337, ${150 + sw - 13} 357 L${150 + sw - 34} 349 C${150 + sw - 12} 327, ${150 + sw - 17} 292, ${150 + sw - 19} 268Z" fill="${light}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - 50} 262 L150 310 L${150 + 50} 262 L${150 + 34} 242 L150 270 L${150 - 34} 242Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M150 274 L136 318 L150 306 L164 318Z" fill="${dark}" stroke="${outline}" stroke-width="2.5"/>
        <path d="M${150 - 29} 261 L150 288 L${150 + 29} 261" fill="none" stroke="#fff" stroke-width="2" opacity=".75"/>
        <path d="M${150 - hip * .8} 402 L${150 + hip * .8} 402" stroke="${main}" stroke-width="8" opacity=".7"/>
      `;
    case 'sundress':
      return `
        <path d="M${150 - sw * .72} 263 C${150 - 43} 284, ${150 - 36} 306, ${150 - 40} 330 L${150 - 82} 405 L${150 + 82} 405 L${150 + 40} 330 C${150 + 36} 306, ${150 + 43} 284, ${150 + sw * .72} 263Z" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 55} 266 C${150 - 43} 296, ${150 - 49} 315, ${150 - 54} 333 L${150 + 54} 333 C${150 + 49} 315, ${150 + 43} 296, ${150 + 55} 266Z" fill="${light}" opacity=".8"/>
        <path d="M${150 - 42} 264 C${150 - 30} 287, ${150 + 30} 287, ${150 + 42} 264" fill="none" stroke="${dark}" stroke-width="4"/>
        <path d="M${150 - 34} 270 L${150 - 38} 251 M${150 + 34} 270 L${150 + 38} 251" stroke="${main}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${150 - 64} 350 C${150 - 25} 338, ${150 + 35} 349, ${150 + 69} 360" fill="none" stroke="${light}" stroke-width="2" opacity=".7" stroke-dasharray="3 6"/>
        <circle cx="${150 - 21}" cy="366" r="6" fill="${light}" opacity=".75"/><circle cx="${150 + 37}" cy="382" r="5" fill="${light}" opacity=".75"/><circle cx="${150 + 12}" cy="345" r="4" fill="${light}" opacity=".6"/>
      `;
    case 'blazer':
      return `
        <path d="${torso}" fill="${light}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - sw + 4} 263 C${150 - sw - 2} 299, ${150 - sw + 1} 347, ${150 - sw + 16} 373 L${150 - 15} 405 L${150 - 31} 297Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 + sw - 4} 263 C${150 + sw + 2} 299, ${150 + sw - 1} 347, ${150 + sw - 16} 373 L${150 + 15} 405 L${150 + 31} 297Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - 31} 293 L150 341 L${150 + 31} 293" fill="none" stroke="${dark}" stroke-width="3"/>
        <path d="M${150 - 15} 294 L${150 - 8} 361 L150 342 L${150 + 8} 361 L${150 + 15} 294" fill="${light}" opacity=".75"/>
        <path d="M${150 - 10} 258 L150 301 L${150 + 10} 258" fill="none" stroke="${dark}" stroke-width="2.5"/>
        <path d="M${150 - 66} 389 C${150 - 28} 377, ${150 + 34} 379, ${150 + 70} 392" fill="none" stroke="${dark}" stroke-width="3" opacity=".6"/>
        <circle cx="${150 - 72}" cy="348" r="3" fill="${dark}"/><circle cx="${150 + 72}" cy="348" r="3" fill="${dark}"/>
      `;
    case 'y2k':
      return `
        <path d="M${150 - 55} 260 C${150 - 49} 288, ${150 - 47} 309, ${150 - 49} 330 L${150 + 49} 330 C${150 + 47} 309, ${150 + 49} 288, ${150 + 55} 260Z" fill="${main}" stroke="${outline}" stroke-width="3.2"/>
        <path d="M${150 - 33} 265 C${150 - 22} 280, ${150 + 22} 280, ${150 + 33} 265" fill="${light}" stroke="${outline}" stroke-width="2"/>
        <path d="M${150 - 58} 330 C${150 - 24} 316, ${150 + 26} 318, ${150 + 58} 330 L${150 + 73} 405 L${150 - 73} 405Z" fill="${dark}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - 54} 347 C${150 - 20} 337, ${150 + 22} 338, ${150 + 54} 347" fill="none" stroke="${main}" stroke-width="3" opacity=".8"/>
        <path d="M${150 - 45} 374 L${150 + 45} 374" stroke="${light}" stroke-width="2" opacity=".35"/>
        <path d="M${150 - 43} 263 C${150 - 31} 281, ${150 - 33} 299, ${150 - 38} 314 M${150 + 43} 263 C${150 + 31} 281, ${150 + 33} 299, ${150 + 38} 314" fill="none" stroke="${dark}" stroke-width="2.5" opacity=".5"/>
        <path d="M${150 - 45} 265 C${150 - 59} 286, ${150 - 61} 321, ${150 - 53} 344" fill="none" stroke="${light}" stroke-width="11" stroke-linecap="round" opacity=".6"/>
        <path d="M${150 + 45} 265 C${150 + 59} 286, ${150 + 61} 321, ${150 + 53} 344" fill="none" stroke="${light}" stroke-width="11" stroke-linecap="round" opacity=".6"/>
      `;
    case 'goth':
      return `
        <path d="${torso}" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 53} 263 C${150 - 40} 300, ${150 - 41} 345, ${150 - 26} 402 L${150 + 26} 402 C${150 + 41} 345, ${150 + 40} 300, ${150 + 53} 263Z" fill="${light}" opacity=".35"/>
        <path d="M${150 - 36} 318 L${150 + 36} 318 M${150 - 38} 343 L${150 + 38} 343 M${150 - 34} 369 L${150 + 34} 369" stroke="${dark}" stroke-width="3"/>
        <path d="M150 316 L${150 - 7} 326 L150 336 L${150 + 7} 326Z" fill="${dark}"/>
        <path d="M${150 - 65} 267 C${150 - 31} 255, ${150 + 31} 255, ${150 + 65} 267" fill="none" stroke="${dark}" stroke-width="4"/>
        <path d="M150 248 L150 268" stroke="${dark}" stroke-width="4"/>
        <circle cx="150" cy="272" r="7" fill="${dark}" stroke="${outline}" stroke-width="2"/>
        <path d="M${150 - 48} 402 L${150 - 74} 405 M${150 + 48} 402 L${150 + 74} 405" stroke="${light}" stroke-width="3" opacity=".45"/>
      `;
    case 'beach':
      return `
        <path d="M${150 - 49} 260 C${150 - 44} 286, ${150 - 44} 307, ${150 - 48} 334 L${150 + 48} 334 C${150 + 44} 307, ${150 + 44} 286, ${150 + 49} 260Z" fill="${main}" stroke="${outline}" stroke-width="3.2"/>
        <path d="M${150 - 42} 263 C${150 - 31} 280, ${150 + 31} 280, ${150 + 42} 263" fill="${light}" stroke="${outline}" stroke-width="2"/>
        <path d="M${150 - 48} 334 C${150 - 15} 323, ${150 + 16} 324, ${150 + 48} 334 L${150 + 77} 405 L${150 - 77} 405Z" fill="${light}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - 40} 349 C${150 - 11} 340, ${150 + 15} 341, ${150 + 39} 349" fill="none" stroke="${dark}" stroke-width="3" opacity=".7"/>
        <path d="M${150 - 48} 265 C${150 - 62} 286, ${150 - 62} 317, ${150 - 55} 346" fill="none" stroke="${main}" stroke-width="9" stroke-linecap="round" opacity=".8"/>
        <path d="M${150 + 48} 265 C${150 + 62} 286, ${150 + 62} 317, ${150 + 55} 346" fill="none" stroke="${main}" stroke-width="9" stroke-linecap="round" opacity=".8"/>
        <path d="M${150 - 19} 332 C${150 - 15} 346, ${150 + 15} 346, ${150 + 19} 332" fill="none" stroke="${dark}" stroke-width="3"/>
        <path d="M${150 - 10} 343 L${150 + 10} 343 L${150} 355Z" fill="${main}" stroke="${outline}" stroke-width="1.5"/>
      `;
    case 'elf':
      return `
        <path d="${torso}" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 56} 264 C${150 - 33} 277, ${150 - 32} 305, ${150 - 34} 341 L${150 + 34} 341 C${150 + 32} 305, ${150 + 33} 277, ${150 + 56} 264Z" fill="${light}" opacity=".2"/>
        <path d="M${150 - 45} 276 C${150 - 30} 294, ${150 + 30} 294, ${150 + 45} 276" fill="none" stroke="${light}" stroke-width="3"/>
        <path d="M${150 - 66} 337 L${150 + 66} 337 L${150 + 70} 350 L${150 - 70} 350Z" fill="${dark}" stroke="${outline}" stroke-width="2"/>
        <circle cx="150" cy="343" r="8" fill="${light}" stroke="${outline}" stroke-width="2"/>
        <path d="M${150 - 58} 266 C${150 - 72} 286, ${150 - 70} 318, ${150 - 58} 343" fill="none" stroke="${light}" stroke-width="2" opacity=".7"/>
        <path d="M${150 + 58} 266 C${150 + 72} 286, ${150 + 70} 318, ${150 + 58} 343" fill="none" stroke="${light}" stroke-width="2" opacity=".7"/>
        <path d="M${150 - 31} 264 Q150 288 ${150 + 31} 264" fill="none" stroke="${light}" stroke-width="2"/>
      `;
    case 'cat':
      return `
        <path d="${torso}" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 49} 261 C${150 - 42} 294, ${150 - 42} 344, ${150 - 30} 403 L${150 + 30} 403 C${150 + 42} 344, ${150 + 42} 294, ${150 + 49} 261Z" fill="${light}" opacity=".13"/>
        <path d="M${150 - 45} 266 C${150 - 34} 284, ${150 - 30} 303, ${150 - 32} 328 M${150 + 45} 266 C${150 + 34} 284, ${150 + 30} 303, ${150 + 32} 328" fill="none" stroke="${light}" stroke-width="3"/>
        <path d="M${150 - 59} 336 L${150 + 59} 336" stroke="${light}" stroke-width="4" opacity=".5"/>
        <path d="M${150 - 24} 348 C${150 - 16} 341, ${150 - 8} 348, ${150 - 16} 355 C${150 - 24} 348, ${150 - 16} 341, ${150 - 8} 348" fill="none" stroke="${light}" stroke-width="2.5"/>
        <circle cx="150" cy="340" r="3" fill="${light}"/>
        <path d="M${150 - 68} 256 C${150 - 49} 246, ${150 + 49} 246, ${150 + 68} 256" fill="none" stroke="${dark}" stroke-width="3"/>
      `;
    case 'spring':
      return `
        <path d="M${150 - 48} 259 C${150 - 43} 286, ${150 - 41} 308, ${150 - 44} 330 L${150 - 82} 405 L${150 + 82} 405 L${150 + 44} 330 C${150 + 41} 308, ${150 + 43} 286, ${150 + 48} 259Z" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 48} 263 C${150 - 36} 280, ${150 + 36} 280, ${150 + 48} 263" fill="${light}" stroke="${outline}" stroke-width="2"/>
        <path d="M${150 - 51} 264 C${150 - 66} 292, ${150 - 58} 319, ${150 - 46} 336 M${150 + 51} 264 C${150 + 66} 292, ${150 + 58} 319, ${150 + 46} 336" fill="none" stroke="${light}" stroke-width="10" stroke-linecap="round" opacity=".8"/>
        <path d="M${150 - 34} 350 C${150 - 12} 341, ${150 + 21} 344, ${150 + 39} 358" fill="none" stroke="${light}" stroke-width="2" opacity=".8"/>
        <g fill="${light}" opacity=".9">
          <circle cx="${150 - 61}" cy="373" r="5"/><circle cx="${150 - 53}" cy="367" r="3.5"/><circle cx="${150 + 39}" cy="359" r="4"/><circle cx="${150 + 53}" cy="380" r="5"/><circle cx="${150 + 19}" cy="383" r="3"/>
        </g>
        <path d="M${150 - 34} 264 C${150 - 24} 278, ${150 + 24} 278, ${150 + 34} 264" fill="none" stroke="${dark}" stroke-width="1.5"/>
      `;
    case 'festival':
      return `
        <path d="${torso}" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 66} 268 L150 312 L${150 + 72} 254 L${150 + 54} 235 L150 290 L${150 - 48} 257Z" fill="${light}" opacity=".92" stroke="${outline}" stroke-width="2.5"/>
        <path d="M${150 - 72} 256 L${150 + 70} 251" stroke="${dark}" stroke-width="8"/>
        <path d="M${150 - 66} 340 C${150 - 32} 328, ${150 + 34} 331, ${150 + 69} 345 L${150 + 74} 368 C${150 + 30} 353, ${150 - 32} 351, ${150 - 71} 365Z" fill="${dark}" opacity=".6"/>
        <path d="M${150 - 72} 256 C${150 - 50} 239, ${150 - 29} 239, ${150 - 17} 250 M${150 + 70} 251 C${150 + 48} 234, ${150 + 26} 236, ${150 + 15} 247" fill="none" stroke="${light}" stroke-width="3" opacity=".6"/>
      `;
    case 'cozy':
      return `
        <path d="${torso}" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 53} 261 C${150 - 39} 278, ${150 - 33} 287, ${150 - 31} 301 L${150 + 31} 301 C${150 + 33} 287, ${150 + 39} 278, ${150 + 53} 261 C${150 + 30} 249, ${150 - 30} 249, ${150 - 53} 261Z" fill="${light}" stroke="${outline}" stroke-width="2.5"/>
        <path d="M${150 - 51} 268 C${150 - 61} 298, ${150 - 57} 344, ${150 - 45} 381 M${150 + 51} 268 C${150 + 61} 298, ${150 + 57} 344, ${150 + 45} 381" fill="none" stroke="${dark}" stroke-width="3" opacity=".55"/>
        <g stroke="${dark}" stroke-width="1.8" opacity=".35">
          <path d="M${150 - 39} 320 L${150 - 26} 336 M${150 - 18} 320 L${150 - 5} 336 M${150 + 6} 320 L${150 + 19} 336 M${150 + 27} 320 L${150 + 40} 336"/>
          <path d="M${150 - 39} 350 L${150 - 26} 366 M${150 - 18} 350 L${150 - 5} 366 M${150 + 6} 350 L${150 + 19} 366 M${150 + 27} 350 L${150 + 40} 366"/>
        </g>
        <path d="M${150 - 41} 330 L${150 + 41} 330" stroke="${light}" stroke-width="2" opacity=".35"/>
      `;
    case 'overalls':
      return `
        <path d="${torso}" fill="${light}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 45} 270 C${150 - 35} 290, ${150 + 35} 290, ${150 + 45} 270 L${150 + 48} 345 L${150 + 70} 405 L${150 - 70} 405 L${150 - 48} 345Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - 34} 268 L${150 - 28} 248 M${150 + 34} 268 L${150 + 28} 248" stroke="${main}" stroke-width="7" stroke-linecap="round"/>
        <path d="M${150 - 40} 318 L${150 + 40} 318 L${150 + 42} 343 L${150 - 42} 343Z" fill="${dark}" opacity=".25"/>
        <circle cx="${150 - 30}" cy="327" r="3.5" fill="${dark}"/><circle cx="${150 + 30}" cy="327" r="3.5" fill="${dark}"/>
        <path d="M${150 + 44} 332 L${150 + 54} 345 M${150 + 54} 345 L${150 + 62} 330" fill="none" stroke="${dark}" stroke-width="3"/>
        <path d="M${150 - 35} 358 L${150 - 30} 372 L${150 - 18} 383" fill="none" stroke="${light}" stroke-width="2" opacity=".45"/>
      `;
    case 'formal':
      return `
        <path d="M${150 - 59} 263 C${150 - 47} 291, ${150 - 43} 320, ${150 - 48} 341 L${150 - 88} 405 L${150 + 88} 405 L${150 + 48} 341 C${150 + 43} 320, ${150 + 47} 291, ${150 + 59} 263Z" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - 52} 264 C${150 - 33} 300, ${150 + 33} 300, ${150 + 52} 264" fill="${light}" stroke="${outline}" stroke-width="2"/>
        <path d="M${150 - 70} 260 C${150 - 44} 246, ${150 + 44} 246, ${150 + 70} 260" fill="none" stroke="${light}" stroke-width="5" opacity=".75"/>
        <path d="M${150 - 63} 335 C${150 - 32} 323, ${150 + 34} 325, ${150 + 66} 338" fill="none" stroke="${light}" stroke-width="3" opacity=".9"/>
        <path d="M${150 - 49} 350 C${150 - 19} 339, ${150 + 23} 341, ${150 + 50} 354 L${150 + 61} 381 C${150 + 23} 368, ${150 - 24} 366, ${150 - 60} 379Z" fill="${light}" opacity=".15"/>
        <circle cx="150" cy="362" r="4" fill="${light}"/>
      `;
    case 'cardigan':
      return `
        <path d="${torso}" fill="${light}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - sw + 2} 263 C${150 - sw - 2} 302, ${150 - sw + 2} 353, ${150 - sw + 18} 386 L${150 - 11} 405 L${150 - 29} 296Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 + sw - 2} 263 C${150 + sw + 2} 302, ${150 + sw - 2} 353, ${150 + sw - 18} 386 L${150 + 11} 405 L${150 + 29} 296Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - 29} 296 L150 326 L${150 + 29} 296" fill="none" stroke="${dark}" stroke-width="2.5" opacity=".6"/>
        <g fill="${dark}" opacity=".7"><circle cx="${150 - 14}" cy="340" r="3.6"/><circle cx="${150 + 14}" cy="340" r="3.6"/><circle cx="${150 - 14}" cy="369" r="3.6"/><circle cx="${150 + 14}" cy="369" r="3.6"/></g>
        <path d="M${150 - 7} 286 L150 314 L${150 + 7} 286" fill="${dark}" opacity=".3"/>
      `;
    default: // tee
      return `
        <path d="${torso}" fill="${main}" stroke="${outline}" stroke-width="3.5"/>
        <path d="M${150 - sw + 5} 265 C${150 - sw - 3} 292, ${150 - sw + 1} 326, ${150 - sw + 14} 349 L${150 - sw + 35} 341 C${150 - sw + 11} 316, ${150 - sw + 15} 290, ${150 - sw + 20} 270Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 + sw - 5} 265 C${150 + sw + 3} 292, ${150 + sw - 1} 326, ${150 + sw - 14} 349 L${150 + sw - 35} 341 C${150 + sw - 11} 316, ${150 + sw - 15} 290, ${150 + sw - 20} 270Z" fill="${main}" stroke="${outline}" stroke-width="3"/>
        <path d="M${150 - 34} 260 C${150 - 22} 279, ${150 + 22} 279, ${150 + 34} 260" fill="none" stroke="${dark}" stroke-width="4"/>
        <path d="M${150 - 32} 292 C${150 - 15} 302, ${150 + 16} 302, ${150 + 34} 291" fill="none" stroke="${light}" stroke-width="2" opacity=".45"/>
        <circle cx="${150 + 2}" cy="327" r="12" fill="${light}" opacity=".22"/>
        <path d="M${150 - 6} 326 L${150 + 10} 326 L${150 + 6} 333 L${150 - 2} 333Z" fill="${light}" opacity=".7"/>
      `;
  }
}

function speciesBack(p, skin) {
  const s = p.species || 'Human';
  if (s === 'Cat demi-human') {
    return `
      <path d="M88 94 L91 45 L128 78Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3.2"/>
      <path d="M212 94 L209 45 L172 78Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3.2"/>
      <path d="M95 83 L98 60 L117 78Z" fill="#f2a8ba" opacity=".9"/>
      <path d="M205 83 L202 60 L183 78Z" fill="#f2a8ba" opacity=".9"/>
    `;
  }
  if (s === 'Bunny demi-human') {
    return `
      <path d="M109 67 C88 8, 91 -13, 112 -10 C133 -7, 131 35, 128 72Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3.2"/>
      <path d="M191 67 C212 8, 209 -13, 188 -10 C167 -7, 169 35, 172 72Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3.2"/>
      <path d="M112 57 C102 18, 104 2, 114 4 C124 6, 123 31, 121 60Z" fill="#f4b7c4" opacity=".9"/>
      <path d="M188 57 C198 18, 196 2, 186 4 C176 6, 177 31, 179 60Z" fill="#f4b7c4" opacity=".9"/>
    `;
  }
  if (s === 'Elf') {
    return `
      <path d="M86 149 C58 147, 50 130, 44 117 C64 118, 80 127, 91 139Z" fill="${skin.base}" stroke="${skin.line}" stroke-width="2.8"/>
      <path d="M214 149 C242 147, 250 130, 256 117 C236 118, 220 127, 209 139Z" fill="${skin.base}" stroke="${skin.line}" stroke-width="2.8"/>
      <path d="M58 128 C69 130, 78 136, 85 143" fill="none" stroke="${skin.shade}" stroke-width="2.4" opacity=".6"/>
      <path d="M242 128 C231 130, 222 136, 215 143" fill="none" stroke="${skin.shade}" stroke-width="2.4" opacity=".6"/>
    `;
  }
  if (s === 'Fox demi-human') {
    return `
      <path d="M86 98 L80 35 L129 77Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3.2"/>
      <path d="M214 98 L220 35 L171 77Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3.2"/>
      <path d="M92 79 L91 55 L111 77Z" fill="#f5d7c4" opacity=".95"/>
      <path d="M208 79 L209 55 L189 77Z" fill="#f5d7c4" opacity=".95"/>
      <path d="M78 110 L59 100 L80 88Z" fill="${p.hairColorData.light}" opacity=".8"/>
      <path d="M222 110 L241 100 L220 88Z" fill="${p.hairColorData.light}" opacity=".8"/>
    `;
  }
  if (s === 'Pearlfin') {
    return `
      <path d="M88 145 C66 134, 55 118, 54 100 C73 107, 85 122, 94 137Z" fill="#79d4d5" stroke="#357f8c" stroke-width="2.5"/>
      <path d="M212 145 C234 134, 245 118, 246 100 C227 107, 215 122, 206 137Z" fill="#79d4d5" stroke="#357f8c" stroke-width="2.5"/>
      <path d="M62 110 C73 115, 82 126, 88 135 M238 110 C227 115, 218 126, 212 135" fill="none" stroke="#d8ffff" stroke-width="2" opacity=".8"/>
    `;
  }
  if (s === 'Deer demi-human') {
    return `
      <path d="M98 78 C91 52, 77 38, 67 28 M91 52 C75 49, 64 54, 58 62 M202 78 C209 52, 223 38, 233 28 M209 52 C225 49, 236 54, 242 62" fill="none" stroke="#9b7047" stroke-width="5" stroke-linecap="round"/>
      <path d="M92 106 L61 88 L72 120Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3"/>
      <path d="M208 106 L239 88 L228 120Z" fill="${p.hairColorData.base}" stroke="#3d2f3f" stroke-width="3"/>
      <path d="M72 95 L69 103 L82 112Z" fill="#f2c6ad" opacity=".9"/>
      <path d="M228 95 L231 103 L218 112Z" fill="#f2c6ad" opacity=".9"/>
    `;
  }
  if (s === 'Cupid') {
    return `
      <path d="M104 264 C73 235, 52 249, 64 282 C75 310, 99 297, 111 278Z" fill="#fff9f2" stroke="#c99baf" stroke-width="2.8"/>
      <path d="M196 264 C227 235, 248 249, 236 282 C225 310, 201 297, 189 278Z" fill="#fff9f2" stroke="#c99baf" stroke-width="2.8"/>
      <path d="M83 262 C71 260, 65 269, 72 278 M217 262 C229 260, 235 269, 228 278" fill="none" stroke="#e4b8ca" stroke-width="2"/>
    `;
  }
  return '';
}

function speciesFront(p, skin) {
  if (p.species === 'Pearlfin') {
    return `<g fill="#f8d7b8" opacity=".9"><circle cx="112" cy="181" r="2"/><circle cx="119" cy="186" r="1.6"/><circle cx="188" cy="181" r="2"/><circle cx="181" cy="186" r="1.6"/></g>`;
  }
  if (p.species === 'Cat demi-human') {
    return `<g stroke="${skin.line}" stroke-width="2" stroke-linecap="round" opacity=".65"><path d="M104 177 L94 172 M104 181 L92 180 M196 177 L206 172 M196 181 L208 180"/></g>`;
  }
  if (p.species === 'Fox demi-human') {
    return `<g fill="${skin.line}" opacity=".55"><circle cx="111" cy="181" r="1.8"/><circle cx="119" cy="185" r="1.6"/><circle cx="189" cy="181" r="1.8"/><circle cx="181" cy="185" r="1.6"/></g>`;
  }
  return '';
}

function hairBack(p) {
  const c = p.hairColorData;
  const hx = p.hairX || 0;
  const hy = p.hairY || 0;
  const hs = p.hairScale || 1;
  const common = `fill="url(#${p.hairGrad})" stroke="#3a2d3c" stroke-width="3.6" stroke-linejoin="round"`;
  const inner = `fill="${c.shade}" opacity=".22"`;
  const style = p.hair;
  const t = `translate(${hx} ${hy}) translate(150 150) scale(${hs}) translate(-150 -150)`;
  let shapes = '';
  if (style === 'long') {
    shapes = `
      <path d="M150 42 C91 42, 69 86, 74 151 C78 208, 54 292, 52 350 C73 334, 86 345, 91 372 C104 336, 108 295, 104 247 L196 247 C192 295, 198 342, 211 372 C218 343, 230 332, 248 350 C244 288, 222 210, 226 151 C231 86, 209 42, 150 42Z" ${common}/>
      <path d="M85 200 C76 265, 72 310, 66 335 C82 328, 92 343, 96 355 C102 316, 101 260, 99 215Z" ${inner}/>
      <path d="M215 200 C224 265, 228 310, 234 335 C218 328, 208 343, 204 355 C198 316, 199 260, 201 215Z" ${inner}/>
    `;
  } else if (style === 'bob') {
    shapes = `
      <path d="M150 43 C95 43, 74 84, 79 150 C80 191, 94 220, 105 238 C119 234, 130 243, 134 254 L166 254 C170 243, 181 234, 195 238 C206 220, 220 191, 221 150 C226 84, 205 43, 150 43Z" ${common}/>
      <path d="M91 167 C94 196, 102 218, 111 228 C122 225, 131 236, 135 247 L120 252 C104 224, 94 198, 91 167Z" ${inner}/>
    `;
  } else if (style === 'twin') {
    shapes = `
      <path d="M150 43 C98 43, 76 82, 80 148 C82 185, 93 213, 106 234 L194 234 C207 213, 218 185, 220 148 C224 82, 202 43, 150 43Z" ${common}/>
      <path d="M78 152 C54 172, 44 220, 52 274 C58 314, 73 336, 86 343 C101 308, 95 245, 102 216Z" ${common}/>
      <path d="M222 152 C246 172, 256 220, 248 274 C242 314, 227 336, 214 343 C199 308, 205 245, 198 216Z" ${common}/>
      <path d="M67 200 C60 240, 64 297, 77 325 C82 291, 80 245, 84 218Z" ${inner}/>
      <path d="M233 200 C240 240, 236 297, 223 325 C218 291, 220 245, 216 218Z" ${inner}/>
      <circle cx="76" cy="154" r="11" fill="#f6d36b" stroke="#a8742d" stroke-width="2.5"/>
      <circle cx="224" cy="154" r="11" fill="#f6d36b" stroke="#a8742d" stroke-width="2.5"/>
    `;
  } else if (style === 'pony') {
    shapes = `
      <path d="M150 43 C98 43, 76 82, 80 149 C82 189, 96 221, 109 238 L191 238 C204 221, 218 189, 220 149 C224 82, 202 43, 150 43Z" ${common}/>
      <path d="M201 82 C243 65, 270 92, 262 134 C254 178, 226 204, 233 253 C247 226, 268 198, 273 155 C279 99, 249 62, 201 82Z" ${common}/>
      <path d="M224 107 C246 102, 259 119, 255 143 C252 165, 241 182, 238 203 C238 174, 250 149, 246 131 C243 117, 233 112, 224 116Z" ${inner}/>
      <circle cx="202" cy="84" r="9" fill="#f6d36b" stroke="#a8742d" stroke-width="2"/>
    `;
  } else if (style === 'pixie') {
    shapes = `
      <path d="M150 45 C104 45, 78 76, 80 132 C82 157, 88 175, 96 191 C104 169, 117 160, 130 158 C122 143, 128 126, 136 120 C144 143, 162 151, 178 148 C174 163, 177 178, 186 190 C193 170, 197 149, 199 131 C204 77, 193 45, 150 45Z" ${common}/>
      <path d="M93 126 C104 105, 124 93, 145 93 C133 105, 121 123, 113 144 C103 141, 97 134, 93 126Z" ${inner}/>
    `;
  } else if (style === 'hime') {
    shapes = `
      <path d="M150 42 C94 42, 72 83, 77 150 C79 205, 74 275, 70 333 C88 323, 102 328, 110 342 L190 342 C198 328, 212 323, 230 333 C226 275, 221 205, 223 150 C228 83, 206 42, 150 42Z" ${common}/>
      <path d="M82 196 C82 252, 80 300, 78 321 C89 316, 99 323, 105 335 L103 207Z" ${inner}/>
      <path d="M218 196 C218 252, 220 300, 222 321 C211 316, 201 323, 195 335 L197 207Z" ${inner}/>
    `;
  } else if (style === 'wavy') {
    shapes = `
      <path d="M150 42 C90 42, 69 86, 75 151 C78 200, 60 250, 57 307 C69 294, 84 303, 88 327 C103 293, 107 252, 103 220 C119 238, 181 238, 197 220 C193 252, 197 293, 212 327 C216 303, 231 294, 243 307 C240 250, 222 200, 225 151 C231 86, 210 42, 150 42Z" ${common}/>
      <path d="M82 190 C76 240, 70 283, 69 303 C80 295, 91 305, 95 316 C100 278, 98 230, 95 205Z" ${inner}/>
      <path d="M218 190 C224 240, 230 283, 231 303 C220 295, 209 305, 205 316 C200 278, 202 230, 205 205Z" ${inner}/>
    `;
  } else if (style === 'spiky') {
    shapes = `
      <path d="M150 44 L115 54 L122 32 L95 70 L76 58 L82 103 L58 101 L80 132 C81 159, 92 190, 108 211 L192 211 C208 190, 219 159, 220 132 L242 101 L218 103 L224 58 L205 70 L178 32 L185 54Z" ${common}/>
      <path d="M87 112 C99 91, 120 81, 143 82 C123 95, 109 114, 100 136Z" ${inner}/>
    `;
  } else if (style === 'curly') {
    shapes = `
      <path d="M150 43 C92 43, 69 87, 76 150 C80 190, 94 221, 109 238 L191 238 C206 221, 220 190, 224 150 C231 87, 208 43, 150 43Z" ${common}/>
      <g ${common}>
        <circle cx="91" cy="92" r="27"/><circle cx="124" cy="62" r="29"/><circle cx="164" cy="58" r="30"/><circle cx="202" cy="76" r="28"/><circle cx="222" cy="112" r="26"/><circle cx="78" cy="131" r="25"/><circle cx="226" cy="154" r="23"/><circle cx="77" cy="174" r="22"/>
      </g>
      <g fill="none" stroke="${c.light}" stroke-width="2.2" opacity=".55">
        <path d="M73 88 C66 99, 66 112, 72 120"/><path d="M109 48 C99 55, 94 65, 94 76"/><path d="M171 38 C185 42, 194 53, 197 66"/><path d="M217 91 C227 99, 231 110, 228 121"/>
      </g>
    `;
  } else if (style === 'braids') {
    shapes = `
      <path d="M150 43 C97 43, 75 83, 80 150 C82 184, 93 213, 106 232 L194 232 C207 213, 218 184, 220 150 C225 83, 203 43, 150 43Z" ${common}/>
      <path d="M88 186 C73 218, 69 271, 76 322 C83 350, 92 360, 100 362 C106 340, 102 309, 104 281 C106 244, 102 214, 108 196Z" ${common}/>
      <path d="M212 186 C227 218, 231 271, 224 322 C217 350, 208 360, 200 362 C194 340, 198 309, 196 281 C194 244, 198 214, 192 196Z" ${common}/>
      <g fill="none" stroke="${c.shade}" stroke-width="2.2" opacity=".7">
        <path d="M77 236 L97 244 M74 253 L98 260 M72 272 L98 277 M72 291 L99 294 M74 309 L102 312 M78 328 L104 329"/>
        <path d="M223 236 L203 244 M226 253 L202 260 M228 272 L202 277 M228 291 L201 294 M226 309 L198 312 M222 328 L196 329"/>
      </g>
      <path d="M74 220 L104 232 M226 220 L196 232" stroke="#f7d47b" stroke-width="5" stroke-linecap="round"/>
      <path d="M75 355 L97 355 M225 355 L203 355" stroke="#f7d47b" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (style === 'buns') {
    shapes = `
      <path d="M150 43 C97 43, 75 82, 79 149 C81 187, 94 217, 108 235 L192 235 C206 217, 219 187, 221 149 C225 82, 203 43, 150 43Z" ${common}/>
      <circle cx="87" cy="61" r="28" ${common}/>
      <circle cx="213" cy="61" r="28" ${common}/>
      <circle cx="80" cy="58" r="13" fill="${c.light}" opacity=".28"/>
      <circle cx="206" cy="58" r="13" fill="${c.light}" opacity=".28"/>
      <path d="M94 89 C111 100, 122 113, 127 132 M206 89 C189 100, 178 113, 173 132" fill="none" stroke="${c.light}" stroke-width="3" opacity=".55"/>
    `;
  } else if (style === 'wolf') {
    shapes = `
      <path d="M150 42 C95 42, 71 82, 77 147 C81 183, 87 211, 97 236 C105 211, 118 198, 128 193 C118 176, 119 156, 130 145 C133 166, 150 176, 171 173 C163 193, 164 215, 176 235 C188 205, 199 174, 204 143 C212 84, 203 42, 150 42Z" ${common}/>
      <path d="M85 153 C87 188, 92 214, 99 230 C106 207, 116 198, 124 193 C115 181, 111 165, 115 151Z" ${inner}/>
      <path d="M215 153 C213 188, 208 214, 201 230 C194 207, 184 198, 176 193 C185 181, 189 165, 185 151Z" ${inner}/>
      <path d="M72 174 C58 199, 57 226, 64 246 C73 232, 81 226, 92 225 C86 201, 82 184, 83 163Z" ${common}/>
      <path d="M228 174 C242 199, 243 226, 236 246 C227 232, 219 226, 208 225 C214 201, 218 184, 217 163Z" ${common}/>
    `;
  } else if (style === 'undercut') {
    shapes = `
      <path d="M150 44 C101 44, 78 80, 81 141 C83 177, 94 207, 107 226 C116 203, 130 189, 146 184 C133 164, 135 140, 148 126 C153 154, 176 170, 199 166 C195 186, 201 204, 216 223 C221 191, 224 160, 222 132 C219 79, 199 44, 150 44Z" ${common}/>
      <path d="M91 152 C94 182, 102 204, 112 219 C119 200, 130 190, 141 184 C127 171, 120 154, 122 136Z" ${inner}/>
      <path d="M205 190 C211 204, 214 213, 216 223 C220 199, 222 176, 222 154 C217 169, 211 181, 205 190Z" fill="${c.shade}" opacity=".7"/>
    `;
  } else { // buzz
    shapes = `
      <path d="M150 48 C107 48, 83 77, 84 130 C85 159, 92 184, 103 204 C113 190, 130 181, 150 179 C170 181, 187 190, 197 204 C208 184, 215 159, 216 130 C217 77, 193 48, 150 48Z" ${common}/>
      <path d="M99 130 C106 106, 125 91, 149 89 C132 99, 119 115, 112 135Z" ${inner}/>
      <path d="M89 121 C96 143, 104 160, 114 173" fill="none" stroke="${c.light}" stroke-width="2" opacity=".3"/>
    `;
  }
  return `<g transform="${t}">${shapes}</g>`;
}

function hairFront(p) {
  const c = p.hairColorData;
  const hx = p.hairX || 0;
  const hy = p.hairY || 0;
  const hs = p.hairScale || 1;
  const common = `fill="url(#${p.hairGrad})" stroke="#3a2d3c" stroke-width="3.2" stroke-linejoin="round"`;
  const t = `translate(${hx} ${hy}) translate(150 150) scale(${hs}) translate(-150 -150)`;
  let shapes = '';
  switch (p.hair) {
    case 'long':
      shapes = `
        <path d="M92 130 C89 88, 106 54, 150 45 C186 48, 209 72, 212 116 C197 94, 183 82, 167 76 C175 94, 174 111, 163 128 C157 109, 150 95, 140 84 C132 105, 114 120, 92 130Z" ${common}/>
        <path d="M105 65 C122 50, 145 44, 165 47 C145 51, 125 62, 111 80Z" fill="${c.light}" opacity=".5"/>
        <path d="M103 105 C115 82, 132 67, 151 59" fill="none" stroke="${c.light}" stroke-width="2.2" opacity=".55"/>
      `;
      break;
    case 'bob':
      shapes = `
        <path d="M87 140 C83 92, 103 51, 150 45 C197 51, 217 92, 213 140 C203 126, 200 105, 192 91 C176 99, 146 102, 112 92 C105 106, 99 123, 87 140Z" ${common}/>
        <path d="M105 73 C122 55, 145 48, 167 51 C149 57, 131 69, 117 86Z" fill="${c.light}" opacity=".45"/>
      `;
      break;
    case 'twin':
      shapes = `
        <path d="M87 139 C83 91, 105 51, 150 45 C195 51, 217 91, 213 139 C194 126, 174 122, 152 122 C135 122, 115 128, 87 139Z" ${common}/>
        <path d="M102 78 C118 58, 139 49, 160 49 C141 58, 125 71, 114 88Z" fill="${c.light}" opacity=".5"/>
      `;
      break;
    case 'pony':
      shapes = `
        <path d="M88 138 C85 89, 107 51, 151 45 C194 51, 216 88, 211 137 C197 116, 187 98, 177 84 C159 96, 129 104, 103 95 C99 110, 94 123, 88 138Z" ${common}/>
        <path d="M110 70 C129 53, 151 47, 171 51 C151 58, 135 72, 121 91Z" fill="${c.light}" opacity=".45"/>
      `;
      break;
    case 'pixie':
      shapes = `
        <path d="M92 132 C88 88, 108 54, 150 46 C178 51, 200 72, 208 100 C192 88, 177 81, 161 80 C168 94, 164 106, 155 117 C149 92, 132 79, 112 85 C108 100, 100 116, 92 132Z" ${common}/>
        <path d="M103 73 C121 56, 143 49, 164 52 C143 57, 126 69, 113 86Z" fill="${c.light}" opacity=".45"/>
      `;
      break;
    case 'hime':
      shapes = `
        <path d="M88 140 C86 89, 107 51, 150 45 C193 51, 214 89, 212 140 C204 111, 200 88, 192 78 C178 86, 123 86, 108 78 C101 89, 96 112, 88 140Z" ${common}/>
        <path d="M112 72 L188 72 C188 84, 186 91, 181 97 C159 92, 140 92, 119 97 C114 91, 112 84, 112 72Z" fill="${c.base}" stroke="#3a2d3c" stroke-width="2.5"/>
        <path d="M106 73 C127 62, 148 59, 170 61 C150 64, 130 69, 116 80Z" fill="${c.light}" opacity=".45"/>
      `;
      break;
    case 'wavy':
      shapes = `
        <path d="M91 136 C87 88, 108 51, 150 45 C192 51, 213 88, 209 136 C192 119, 185 96, 177 82 C159 96, 137 103, 116 98 C108 111, 101 125, 91 136Z" ${common}/>
        <path d="M107 69 C126 52, 148 47, 169 50 C148 56, 130 70, 116 90Z" fill="${c.light}" opacity=".5"/>
      `;
      break;
    case 'spiky':
      shapes = `
        <path d="M88 136 L107 80 L119 95 L131 63 L145 83 L158 54 L173 82 L192 66 L201 104 L214 95 L207 139 C184 121, 170 119, 150 119 C130 119, 111 124, 88 136Z" ${common}/>
        <path d="M107 86 L119 102 L131 72 L144 92 L158 66 L172 94 L191 78 L197 103" fill="none" stroke="${c.light}" stroke-width="2.2" opacity=".45"/>
      `;
      break;
    case 'curly':
      shapes = `
        <path d="M91 143 C85 105, 94 70, 119 54 C139 37, 172 39, 192 57 C214 75, 219 109, 209 144 C195 119, 177 107, 151 106 C125 106, 106 118, 91 143Z" ${common}/>
        <g ${common}>
          <circle cx="112" cy="77" r="16"/><circle cx="139" cy="60" r="18"/><circle cx="169" cy="59" r="18"/><circle cx="194" cy="82" r="16"/><circle cx="101" cy="104" r="14"/><circle cx="199" cy="108" r="14"/>
        </g>
        <path d="M117 53 C136 42, 158 41, 176 47" fill="none" stroke="${c.light}" stroke-width="2.5" opacity=".5"/>
      `;
      break;
    case 'braids':
      shapes = `
        <path d="M89 140 C85 91, 108 51, 150 45 C192 51, 215 91, 211 140 C196 124, 183 119, 165 116 C160 103, 151 95, 143 91 C131 105, 111 124, 89 140Z" ${common}/>
        <path d="M104 76 C123 57, 145 49, 167 51 C145 58, 126 72, 112 91Z" fill="${c.light}" opacity=".45"/>
      `;
      break;
    case 'buns':
      shapes = `
        <path d="M90 137 C87 92, 107 54, 150 46 C193 54, 213 92, 210 137 C193 119, 177 112, 153 113 C132 114, 109 122, 90 137Z" ${common}/>
        <path d="M104 77 C122 57, 143 49, 163 50 C143 57, 124 71, 111 89Z" fill="${c.light}" opacity=".45"/>
      `;
      break;
    case 'wolf':
      shapes = `
        <path d="M89 135 C86 91, 105 53, 150 45 C190 51, 211 82, 211 126 C200 108, 188 98, 175 91 C165 105, 151 114, 134 118 C124 105, 111 101, 99 104 C97 115, 93 125, 89 135Z" ${common}/>
        <path d="M105 71 C124 54, 145 47, 165 50 C145 57, 128 70, 116 88Z" fill="${c.light}" opacity=".45"/>
      `;
      break;
    case 'undercut':
      shapes = `
        <path d="M91 127 C88 86, 108 52, 150 45 C185 50, 207 72, 211 109 C189 95, 171 86, 150 84 C132 92, 111 105, 91 127Z" ${common}/>
        <path d="M107 64 C126 50, 147 45, 168 48 C148 53, 130 64, 117 80Z" fill="${c.light}" opacity=".5"/>
        <path d="M92 132 C98 119, 106 109, 116 102" fill="none" stroke="${c.light}" stroke-width="2" opacity=".4"/>
      `;
      break;
    default: // buzz
      shapes = `
        <path d="M93 123 C91 87, 110 54, 150 47 C188 54, 208 86, 207 123 C198 105, 184 94, 167 90 C153 100, 133 104, 113 97 C105 103, 99 112, 93 123Z" ${common}/>
        <path d="M108 72 C127 55, 148 49, 168 52 C148 57, 129 69, 115 87Z" fill="${c.light}" opacity=".4"/>
      `;
  }
  return `<g transform="${t}">${shapes}${hairHighlight(c, p)}</g>`;
}

function eyeShape(id, x, y, scale = 1, side = 1) {
  // Path-based sclera. side = -1 for left, 1 for right (outer corner direction)
  if (id === 'sharp') {
    return `<path d="M${x - 19} ${y - 4} C${x - 8} ${y - 24}, ${x + 13} ${y - 25}, ${x + 21} ${y - 4} C${x + 12} ${y + 18}, ${x - 9} ${y + 20}, ${x - 19} ${y - 4}Z" fill="#fffaf8" stroke="#4d3442" stroke-width="2.7"/>`;
  }
  if (id === 'dreamy') {
    return `<path d="M${x - 20} ${y + 2} C${x - 10} ${y - 20}, ${x + 12} ${y - 22}, ${x + 20} ${y - 1} C${x + 8} ${y + 17}, ${x - 11} ${y + 19}, ${x - 20} ${y + 2}Z" fill="#fffaf8" stroke="#4d3442" stroke-width="2.7"/>`;
  }
  if (id === 'wide') {
    return `<ellipse cx="${x}" cy="${y}" rx="21" ry="25" fill="#fffaf8" stroke="#4d3442" stroke-width="2.7"/>`;
  }
  if (id === 'almond') {
    return `<path d="M${x - 20} ${y} C${x - 12} ${y - 21}, ${x + 10} ${y - 23}, ${x + 20} ${y - 2} C${x + 12} ${y + 18}, ${x - 12} ${y + 19}, ${x - 20} ${y}Z" fill="#fffaf8" stroke="#4d3442" stroke-width="2.7"/>`;
  }
  return `<ellipse cx="${x}" cy="${y}" rx="19" ry="23" fill="#fffaf8" stroke="#4d3442" stroke-width="2.7"/>`;
}

function eyeLayer(p, eyeColor, skin) {
  const ex = p.eyeX || 0;
  const ey = p.eyeY || 0;
  const es = p.eyeScale || 1;
  const eyes = [
    { x: 118, y: 157, side: -1 },
    { x: 182, y: 157, side: 1 }
  ];
  const groups = eyes.map(({ x, y, side }) => {
    const exx = x;
    return `
      <g>
        ${eyeShape(p.eye, exx, y, es, side)}
        <ellipse cx="${exx}" cy="${y + 1}" rx="11" ry="14.5" fill="url(#${p.eyeGrad})" opacity=".95"/>
        <ellipse cx="${exx}" cy="${y + 3}" rx="6" ry="9" fill="#221b29"/>
        <circle cx="${exx - 4}" cy="${y - 5}" r="3.6" fill="#fff"/>
        <circle cx="${exx + 5}" cy="${y + 6}" r="1.8" fill="#fff" opacity=".8"/>
        <path d="M${exx - 17} ${y - 11} C${exx - 8} ${y - 22}, ${exx + 9} ${y - 22}, ${exx + 18} ${y - 11}" fill="none" stroke="#3d2b39" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M${exx - (side < 0 ? 17 : 18)} ${y - 11} L${exx - (side < 0 ? 23 : 24)} ${y - 15}" stroke="#3d2b39" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M${exx - 9} ${y + 18} C${exx - 2} ${y + 21}, ${exx + 7} ${y + 20}, ${exx + 13} ${y + 16}" fill="none" stroke="${skin.shade}" stroke-width="1.6" opacity=".7" stroke-linecap="round"/>
      </g>
    `;
  }).join('');
  const brow = `
    <g fill="none" stroke="${p.hairColorData.shade}" stroke-width="3.3" stroke-linecap="round" opacity=".82">
      <path d="M101 123 C111 116, 127 116, 137 121"/>
      <path d="M163 121 C173 116, 189 116, 199 123"/>
    </g>
  `;
  return `<g transform="translate(${ex} ${ey}) translate(150 155) scale(${es}) translate(-150 -155)">${groups}</g>${brow}`;
}

function mouthLayer(p) {
  const mx = p.mouthX || 0;
  const my = p.mouthY || 0;
  const ms = p.mouthScale || 1;
  let mouth = '';
  switch (p.mouth) {
    case 'grin':
      mouth = `<path d="M134 192 Q150 214 166 192 Q150 201 134 192Z" fill="#7e3348" stroke="#6d2a3d" stroke-width="2.5"/><path d="M139 196 Q150 204 161 196" fill="#fff8f2" opacity=".92"/>`;
      break;
    case 'pout':
      mouth = `<path d="M140 195 Q150 188 160 195 Q150 205 140 195Z" fill="#d2667d" stroke="#8b3b50" stroke-width="2.4"/>`;
      break;
    case 'smirk':
      mouth = `<path d="M137 194 Q151 203 166 190" fill="none" stroke="#7d3148" stroke-width="3.3" stroke-linecap="round"/><path d="M160 190 L166 190" stroke="#7d3148" stroke-width="2.5" stroke-linecap="round"/>`;
      break;
    case 'open':
      mouth = `<ellipse cx="150" cy="197" rx="9" ry="7" fill="#7d2d43" stroke="#6e283c" stroke-width="2.4"/><path d="M145 200 Q150 194 155 200" fill="#f28f9f"/>`;
      break;
    case 'cat':
      mouth = `<path d="M136 192 Q143 200 150 192 Q157 200 164 192" fill="none" stroke="#7d3148" stroke-width="3" stroke-linecap="round"/>`;
      break;
    default:
      mouth = `<path d="M138 193 Q150 202 162 193" fill="none" stroke="#7d3148" stroke-width="3.2" stroke-linecap="round"/><path d="M143 195 Q150 198 157 195" fill="none" stroke="#c86d7e" stroke-width="1.3" opacity=".7"/>`;
  }
  return `<g transform="translate(${mx} ${my}) translate(150 196) scale(${ms}) translate(-150 -196)">${mouth}</g>`;
}

function accessoryLayer(p, skin) {
  switch (p.accessory) {
    case 'glasses':
      return `
        <g fill="none" stroke="#5e4758" stroke-width="3">
          <rect x="92" y="139" width="50" height="39" rx="15" fill="#e8f5f5" fill-opacity=".14"/>
          <rect x="158" y="139" width="50" height="39" rx="15" fill="#e8f5f5" fill-opacity=".14"/>
          <path d="M142 151 C147 146, 153 146, 158 151 M92 151 L80 148 M208 151 L219 148"/>
        </g>
        <path d="M97 145 C106 139, 120 139, 129 143" fill="none" stroke="#fff" stroke-width="2" opacity=".65"/>
      `;
    case 'freckles':
      return `<g fill="${skin.line}" opacity=".55"><circle cx="111" cy="180" r="1.6"/><circle cx="119" cy="184" r="1.4"/><circle cx="126" cy="179" r="1.2"/><circle cx="174" cy="179" r="1.3"/><circle cx="181" cy="184" r="1.5"/><circle cx="189" cy="180" r="1.5"/></g>`;
    case 'earrings':
      return `<path d="M86 171 L86 181 M214 171 L214 181" stroke="#e2b74d" stroke-width="2.3"/><circle cx="86" cy="185" r="5" fill="none" stroke="#e2b74d" stroke-width="2.3"/><circle cx="214" cy="185" r="5" fill="none" stroke="#e2b74d" stroke-width="2.3"/>`;
    case 'beauty':
      return `<circle cx="191" cy="184" r="2.6" fill="#6a3b3f" opacity=".8"/>`;
    case 'headband':
      return `<path d="M92 118 C109 73, 191 73, 208 118" fill="none" stroke="#f1a3bb" stroke-width="9" opacity=".9"/><path d="M92 118 C109 73, 191 73, 208 118" fill="none" stroke="#fff1f6" stroke-width="2" opacity=".65"/><path d="M201 86 L217 68 L221 88Z" fill="#f1a3bb" stroke="#b65a7c" stroke-width="1.5"/>`;
    case 'blush':
      return `<g fill="#f28d91" opacity=".38"><ellipse cx="105" cy="184" rx="14" ry="8"/><ellipse cx="195" cy="184" rx="14" ry="8"/></g>`;
    default:
      return '';
  }
}

export function renderAvatar(profile, options = {}) {
  const p = {
    ...profile,
    body: profile.body || 'slim',
    hair: profile.hair || 'long',
    outfit: profile.outfit || 'tee',
    eye: profile.eye || 'round',
    mouth: profile.mouth || 'smile',
    accessory: profile.accessory || 'none',
    species: profile.species || 'Human'
  };
  const skin = byId(SKIN_TONES, p.skin, 0);
  const hairColor = byId(HAIR_COLORS, p.hairColor, 0);
  const eyeColor = byId(EYE_COLORS, p.eyeColor, 0);
  const outfit = byId(OUTFITS, p.outfit, 0);
  const dims = BODY_DIMS[p.body] || BODY_DIMS.slim;
  const id = uid();
  p.hairColorData = hairColor;
  p.hairGrad = `hairGrad${id}`;
  p.eyeGrad = `eyeGrad${id}`;
  const sw = dims.shoulder * (p.bodyScale || 1);
  const waist = dims.waist * (p.bodyScale || 1);
  const hip = dims.hip * (p.bodyScale || 1);
  const mouthTired = options.mood === 'tired';
  if (mouthTired) p.mouth = 'pout';

  return `
  <svg class="avatar-svg ${options.className || ''}" viewBox="0 0 300 400" role="img" aria-label="${escapeHTML(options.alt || 'Anime character portrait')}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skinGrad${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${skin.base}"/><stop offset=".72" stop-color="${skin.base}"/><stop offset="1" stop-color="${skin.shade}"/>
      </linearGradient>
      <linearGradient id="hairGrad${id}" x1=".2" y1="0" x2=".8" y2="1">
        <stop offset="0" stop-color="${hairColor.light}"/><stop offset=".32" stop-color="${hairColor.base}"/><stop offset="1" stop-color="${hairColor.shade}"/>
      </linearGradient>
      <linearGradient id="eyeGrad${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${eyeColor.light}"/><stop offset=".52" stop-color="${eyeColor.base}"/><stop offset="1" stop-color="${eyeColor.base}"/>
      </linearGradient>
      <linearGradient id="clothGrad${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${lighten(outfit.palette[0], 18)}"/><stop offset="1" stop-color="${outfit.palette[0]}"/>
      </linearGradient>
    </defs>
    <g class="avatar-character">
      ${speciesBack(p, skin)}
      <path d="M104 267 C101 304, 91 349, 72 399 L228 399 C209 349, 199 304, 196 267Z" fill="${skin.shade}" opacity=".35"/>
      ${armPaths(sw, dims.arm, skin)}
      <path d="M128 206 L128 268 C136 279, 164 279, 172 268 L172 206Z" fill="url(#skinGrad${id})" stroke="${skin.line}" stroke-width="3"/>
      <path d="M135 209 C139 224, 161 224, 165 209" fill="none" stroke="${skin.shade}" stroke-width="2.5" opacity=".55"/>
      ${hairBack(p)}
      ${outfitLayer(p, outfit, dims, {})}
      <path d="M88 144 C86 94, 108 55, 150 53 C191 55, 214 94, 212 144 C211 192, 191 232, 150 233 C109 232, 89 192, 88 144Z" fill="url(#skinGrad${id})" stroke="${skin.line}" stroke-width="3.6"/>
      <path d="M101 154 C102 191, 112 216, 131 229" fill="none" stroke="${skin.shade}" stroke-width="3" opacity=".3"/>
      <ellipse cx="150" cy="183" rx="53" ry="42" fill="${skin.base}" opacity=".28"/>
      <path d="M143 176 C147 180, 153 180, 157 176" fill="none" stroke="${skin.line}" stroke-width="1.8" opacity=".45" stroke-linecap="round"/>
      ${eyeLayer(p, eyeColor, skin)}
      <g fill="#f28d91" opacity=".3"><ellipse cx="105" cy="184" rx="13" ry="7"/><ellipse cx="195" cy="184" rx="13" ry="7"/></g>
      ${mouthLayer(p)}
      ${speciesFront(p, skin)}
      ${hairFront(p)}
      ${accessoryLayer(p, skin)}
      <g class="face-sparkle" fill="#fff" opacity=".7">
        <path d="M96 104 L98 110 L104 112 L98 114 L96 120 L94 114 L88 112 L94 110Z" transform="scale(.7) translate(38 46)"/>
      </g>
    </g>
  </svg>`;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function lighten(hex, amt) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (n >> 16) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function avatarBust(profile, options = {}) {
  return `<div class="avatar-bust">${renderAvatar(profile, options)}</div>`;
}
