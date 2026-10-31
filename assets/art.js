import { characterById } from './data.js';

let uid = 0;

const ICONS = {
  heart: '<path d="M12 20.2s-7.2-4.4-9.4-8.5C.8 8.4 2.5 4.8 6.1 4.1c2.2-.4 4.2.7 5.9 2.8 1.7-2.1 3.7-3.2 5.9-2.8 3.6.7 5.3 4.3 3.5 7.6-2.2 4.1-9.4 8.5-9.4 8.5Z"/>',
  coin: '<circle cx="12" cy="12" r="8.7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 6.8v10.4M14.7 8.7c-1.3-1.1-4.8-1.4-4.8 1.1 0 2.6 5 1.3 5 4 0 2.4-3.5 2.2-5 .9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  energy: '<path d="M13.2 2.8 4.8 13h5.5l-.5 8.2L18.7 11h-5.4l-.1-8.2Z" fill="currentColor"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  moon: '<path d="M20.1 14.9A8.6 8.6 0 0 1 9.1 3.9a8.6 8.6 0 1 0 11 11Z"/>',
  home: '<path d="m3 10.7 9-7.2 9 7.2v10.1H3V10.7Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.4 20.8v-6.6h5.2v6.6" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  town: '<path d="M3 21V9.6l5.2-3.4v14.7M8.2 21V4.2l6.2 3.1V21M14.4 21V10.3L21 7.4V21M2 21h20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  ledger: '<path d="M5 3.5h14v17H5z" fill="none" stroke="currentColor" stroke-width="1.6" rx="2"/><path d="M8.4 8h7.2M8.4 12h7.2M8.4 16h4.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  sparkle: '<path d="M12 2.8c.4 5.2 2.3 7.1 7.5 7.5-5.2.4-7.1 2.3-7.5 7.5-.4-5.2-2.3-7.1-7.5-7.5 5.2-.4 7.1-2.3 7.5-7.5Z" fill="currentColor"/><path d="M19 15.6c.2 2.1 1 2.9 3.1 3.1-2.1.2-2.9 1-3.1 3.1-.2-2.1-1-2.9-3.1-3.1 2.1-.2 2.9-1 3.1-3.1Z" fill="currentColor" opacity=".65"/>',
  close: '<path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  arrow: '<path d="M4 12h15M13 5.5 19.5 12 13 18.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  back: '<path d="M20 12H5M11 5.5 4.5 12 11 18.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  gift: '<path d="M4 10h16v10.3H4zM3 7h18v3.4H3zM12 7v13.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 7C9.3 7 6 5.9 6.7 3.6 7.3 1.6 10.8 2.9 12 7Zm0 0c2.7 0 6-1.1 5.3-3.4C16.7 1.6 13.2 2.9 12 7Z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  work: '<path d="M4 8.5h16v11H4z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 8.5V6.7A1.7 1.7 0 0 1 10.7 5h2.6A1.7 1.7 0 0 1 15 6.7v1.8M4 13h16" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  music: '<path d="M9 18.2V6.4l9-2v11.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><ellipse cx="6.7" cy="18.2" rx="2.7" ry="2.2" fill="currentColor"/><ellipse cx="15.7" cy="15.6" rx="2.7" ry="2.2" fill="currentColor"/>',
  sound: '<path d="M4 9.5h3.2L12 5.8v12.4L7.2 14.5H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.2 8.5a5 5 0 0 1 0 7M17.8 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  mute: '<path d="M4 9.5h3.2L12 5.8v12.4L7.2 14.5H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m15.5 9.5 5 5M20.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  ring: '<ellipse cx="12" cy="15.5" rx="6.7" ry="4.7" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m8.2 11.2 2.2-5.4h3.2l2.2 5.4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 5.8v5.4" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  family: '<circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="16.8" cy="9.3" r="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 20v-1.3c0-2.5 2.3-4.4 5-4.4s5 1.9 5 4.4V20M14.2 14.9c2.7-.4 5.1 1.3 5.3 3.8V20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  check: '<path d="m4.5 12.5 4.6 4.6L19.5 6.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="8.7" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5.4l3.4 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  pin: '<path d="M12 21s6.6-6 6.6-11A6.6 6.6 0 0 0 5.4 10c0 5 6.6 11 6.6 11Z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.2" fill="currentColor"/>',
  flower: '<path d="M12 12c-1-4.5 1-7 3.4-6.7 2.8.3 3.2 4.1-.4 6.4 3.9 1.3 4.5 4.6 2.2 5.9-2 1.1-4.4-1.4-4.6-4.9-1.3 3.3-4.3 4.8-5.8 3.2-1.8-1.9.1-4.8 3.9-5.2-2.9-2.3-2.6-5.6-.1-6.3 2.2-.6 3.8 2.1 1.4 5.6Z" fill="currentColor"/><circle cx="12" cy="12" r="2.2" fill="var(--cream, #fff8f1)"/>',
  book: '<path d="M5 4.2h9.2A2.8 2.8 0 0 1 17 7v13H7.8A2.8 2.8 0 0 0 5 22.8V4.2Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M17 7a2.8 2.8 0 0 1 2.8-2.8H21v15.8h-1.2A2.8 2.8 0 0 0 17 22.8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8.5 8.5h5M8.5 11.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>',
  tart: '<path d="M3.5 12.5h17l-2.1 6.2a2 2 0 0 1-1.9 1.3H7.5a2 2 0 0 1-1.9-1.3l-2.1-6.2Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5.2 12.5c.7-2.8 3.3-4.7 6.8-4.7s6.1 1.9 6.8 4.7" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="8.6" r="2.2" fill="currentColor"/><path d="M12 5.1c1.6-1.9 3.3-1.5 3.6-.6.3 1-1.1 2-3.6 2Z" fill="currentColor"/>',
  macaron: '<ellipse cx="12" cy="8.6" rx="8" ry="4.1" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="15.2" rx="8" ry="4.1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4.3 11.7c2.5 1.4 12.9 1.4 15.4 0" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  pen: '<path d="m5 19 2.6-6.8L16.7 3l4.3 4.3-9.2 9.1L5 19Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="m14.8 5 4.2 4.2M7.6 12.2l4.2 4.2M5 19l3.2-.8-2.4-2.4L5 19Z" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  cassette: '<rect x="3" y="6" width="18" height="12.5" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="12.3" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="16" cy="12.3" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 18.5h8M7 6l1.4 3.5h7.2L17 6" fill="none" stroke="currentColor" stroke-width="1.3"/>',
  shell: '<path d="M12 20.5c-5.2-1.8-8.2-7-7.3-11.6C5.3 5.4 8.2 3 12 3s6.7 2.4 7.3 5.9c.9 4.6-2.1 9.8-7.3 11.6Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 20V3M12 20c-2.8-4.1-3.8-9.6-2.4-14.7M12 20c2.8-4.1 3.8-9.6 2.4-14.7M12 20c-4.3-3-6.3-7.4-6-11.2M12 20c4.3-3 6.3-7.4 6-11.2" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".8"/>',
  star: '<path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  scarf: '<path d="M6 5c2 2.3 4 3.2 6 3.2S16 7.3 18 5l1.4 2.4c-1.2 3-4.4 5.2-7.4 5.2S5.8 10.4 4.6 7.4L6 5Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9.4 10.2 8 21l3.1-1.2L12 21l.9-1.2L16 21l-1.4-10.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  cup: '<path d="M5 8h11v6.7a4.3 4.3 0 0 1-4.3 4.3H9.3A4.3 4.3 0 0 1 5 14.7V8Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16 9h1.8a2.8 2.8 0 0 1 0 5.6H16M7.5 2.8c-1 1.2-1 2 0 3.2M11 2.8c-1 1.2-1 2 0 3.2M14.5 2.8c-1 1.2-1 2 0 3.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  scale: '<path d="M12 3v18M6 21h12M4.5 7h15M6.5 7 3 14h7L6.5 7Zm11 0L14 14h7l-3.5-7Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
};

export function icon(name, className = '') {
  const path = ICONS[name] || ICONS.sparkle;
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">${path}</svg>`;
}

function paint(character, key, fallback) {
  const value = character[key];
  if (!value) return fallback;
  return typeof value === 'string' ? value : value.color || fallback;
}

function shade(character, key, fallback) {
  const value = character[key];
  if (!value) return fallback;
  return typeof value === 'string' ? value : value.shade || fallback;
}

function eyeGroup(cx, mirror, id, eyeColor, ink) {
  return `
    <g transform="translate(${cx} 244) scale(${mirror ? -1 : 1} 1)">
      <path d="M-21 -1 C-19 -12 -7 -18 6 -13 C14 -10 18 -2 14 5 C9 14 -5 15 -16 8 C-20 5 -22 3 -21 -1Z" fill="#fffaf7" stroke="${ink}" stroke-opacity=".22" stroke-width="1.3"/>
      <ellipse cx="-1" cy="0" rx="8.6" ry="10.7" fill="url(#${id}-eye)"/>
      <ellipse cx="-0.5" cy="1.3" rx="3.8" ry="5.4" fill="${ink}"/>
      <circle cx="-3.4" cy="-3.2" r="2.5" fill="#fff" opacity=".92"/>
      <circle cx="2.8" cy="3.7" r="1.35" fill="#fff" opacity=".8"/>
      <path d="M-22 -3 C-18 -15 -3 -20 12 -11" fill="none" stroke="${ink}" stroke-width="4.8" stroke-linecap="round"/>
      <path d="M-20 -1.5 C-22 1 -21 4 -17 6" fill="none" stroke="${ink}" stroke-width="2.1" stroke-linecap="round"/>
      <path d="M-15 9 C-8 13 3 12 10 8" fill="none" stroke="${ink}" stroke-opacity=".45" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M-19 -26 C-10 -31 4 -30 14 -23" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" opacity=".48"/>
    </g>`;
}

function hairBack(style, id, hair, hairShade) {
  const fill = `url(#${id}-hair)`;
  const stroke = `stroke="${hairShade}" stroke-opacity=".35" stroke-width="2"`;
  if (style === 'bob') {
    return `<path d="M139 219C128 128 171 80 230 80C292 80 333 129 321 219C327 253 330 286 321 316C312 338 293 347 272 342C288 320 289 294 282 270C263 286 197 286 178 270C171 294 172 320 188 342C165 347 147 338 139 316C130 286 133 253 139 219Z" fill="${fill}" ${stroke}/>
      <path d="M160 128C183 96 215 84 247 87" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (style === 'pony') {
    return `<path d="M139 221C129 126 170 80 230 80C292 80 331 127 321 221C321 253 317 280 307 302C287 286 278 258 283 232C263 249 197 249 177 232C182 258 173 286 153 302C143 280 139 253 139 221Z" fill="${fill}" ${stroke}/>
      <path d="M306 112C346 114 369 139 368 173C367 202 354 218 343 239C349 207 341 184 320 168C331 191 327 219 316 240C312 201 300 165 285 140C293 128 300 118 306 112Z" fill="${fill}" ${stroke}/>
      <path d="M157 123C181 93 211 82 244 84" fill="none" stroke="#fff" stroke-opacity=".19" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (style === 'pixie') {
    return `<path d="M142 217C134 132 172 84 230 84C290 84 328 132 320 217C314 244 304 261 289 269C298 246 294 222 281 203C257 222 205 222 178 203C165 222 162 246 171 269C156 261 148 244 142 217Z" fill="${fill}" ${stroke}/>
      <path d="M165 122C186 95 213 85 243 86" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="7" stroke-linecap="round"/>`;
  }
  if (style === 'hime') {
    return `<path d="M137 222C127 126 169 77 230 77C293 77 334 126 323 222C330 275 336 354 331 436C326 481 313 510 292 530C301 488 298 442 288 413C268 435 192 435 172 413C162 442 159 488 168 530C147 510 134 481 129 436C124 354 130 275 137 222Z" fill="${fill}" ${stroke}/>
      <path d="M158 126C181 96 211 84 245 86" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="8" stroke-linecap="round"/>`;
  }
  if (style === 'braids') {
    return `<path d="M139 219C129 126 169 80 230 80C292 80 332 127 321 219C325 250 326 280 319 306C301 291 289 265 291 239C270 256 190 256 169 239C171 265 159 291 141 306C134 280 135 250 139 219Z" fill="${fill}" ${stroke}/>
      <path d="M157 124C181 95 211 84 244 86" fill="none" stroke="#fff" stroke-opacity=".19" stroke-width="8" stroke-linecap="round"/>`;
  }
  return `<path d="M138 223C126 120 168 75 230 75C293 75 335 121 323 223C332 276 342 355 335 447C329 495 317 522 295 542C304 496 299 451 288 419C268 444 192 444 172 419C161 451 156 496 165 542C143 522 131 495 125 447C118 355 129 276 138 223Z" fill="${fill}" ${stroke}/>
    <path d="M157 122C181 90 213 79 247 82" fill="none" stroke="#fff" stroke-opacity=".19" stroke-width="8" stroke-linecap="round"/>`;
}

function hairFront(style, id, hair, hairShade) {
  const fill = `url(#${id}-hair)`;
  const stroke = `stroke="${hairShade}" stroke-opacity=".28" stroke-width="2" stroke-linejoin="round"`;
  if (style === 'hime') {
    return `<path d="M145 220C142 138 177 94 230 94C284 94 318 138 315 220C309 197 301 181 290 171C271 194 244 205 216 201C188 200 169 190 158 174C151 185 147 201 145 220Z" fill="${fill}" ${stroke}/>
      <path d="M158 181C180 203 214 211 247 201C266 195 281 186 291 174C293 188 292 198 288 206C270 221 244 228 218 223C190 217 169 207 158 188Z" fill="${fill}" opacity=".96"/>
      <path d="M169 131C192 111 220 102 247 105" fill="none" stroke="#fff" stroke-opacity=".24" stroke-width="7" stroke-linecap="round"/>
      <path d="M151 237C145 290 147 342 155 382C162 398 175 398 180 382C177 341 176 292 181 249Z" fill="${fill}" ${stroke}/>
      <path d="M309 237C315 290 313 342 305 382C298 398 285 398 280 382C283 341 284 292 279 249Z" fill="${fill}" ${stroke}/>`;
  }
  if (style === 'bob') {
    return `<path d="M146 217C145 140 180 96 231 96C283 96 316 140 314 217C303 191 293 177 279 168C267 190 249 201 230 202C211 201 192 190 181 169C166 181 155 196 146 217Z" fill="${fill}" ${stroke}/>
      <path d="M166 170C188 195 220 204 251 191C268 183 280 175 288 165C285 185 275 198 259 207C240 219 218 220 200 211C184 202 173 189 166 170Z" fill="${fill}" opacity=".96"/>
      <path d="M170 131C194 113 220 107 247 110" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
      <path d="M153 231C148 268 150 300 158 320C164 330 175 324 175 313C172 285 174 258 181 239Z" fill="${fill}" ${stroke}/>
      <path d="M307 231C312 268 310 300 302 320C296 330 285 324 285 313C288 285 286 258 279 239Z" fill="${fill}" ${stroke}/>`;
  }
  if (style === 'pony') {
    return `<path d="M147 214C147 137 181 94 232 94C283 94 314 137 313 214C302 194 289 181 274 175C259 195 241 205 220 203C201 202 183 191 172 174C159 183 151 196 147 214Z" fill="${fill}" ${stroke}/>
      <path d="M160 177C180 200 209 211 238 204C260 199 277 189 287 175C286 194 277 207 262 216C242 228 218 229 200 219C183 210 169 197 160 177Z" fill="${fill}" opacity=".95"/>
      <path d="M173 128C197 109 224 104 251 108" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
      <path d="M151 231C146 273 148 307 156 326C163 336 174 330 174 318C171 288 173 258 180 239Z" fill="${fill}" ${stroke}/>`;
  }
  if (style === 'pixie') {
    return `<path d="M145 216C145 141 180 96 232 96C284 96 316 141 314 216C305 195 296 182 285 174C273 192 258 200 244 200C229 191 214 184 201 181C187 189 173 199 160 216C156 206 151 210 145 216Z" fill="${fill}" ${stroke}/>
      <path d="M167 161C185 187 216 198 246 190C260 186 272 179 282 169C280 185 271 196 257 204C238 215 218 216 201 207C186 199 174 181 167 161Z" fill="${fill}" opacity=".95"/>
      <path d="M171 128C195 111 222 106 251 111" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
      <path d="M152 229C148 253 151 273 159 285C164 293 172 289 171 280C169 262 173 246 179 235Z" fill="${fill}" ${stroke}/>`;
  }
  if (style === 'braids') {
    return `<path d="M145 219C143 139 179 94 231 94C284 94 317 139 314 219C301 197 290 183 278 175C265 196 247 205 228 205C209 205 192 196 181 175C167 185 154 199 145 219Z" fill="${fill}" ${stroke}/>
      <path d="M161 177C181 200 208 210 236 204C258 199 276 190 286 177C284 195 274 208 259 217C240 228 217 229 200 220C184 211 169 197 161 177Z" fill="${fill}" opacity=".95"/>
      <path d="M171 127C195 108 223 103 251 107" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
      <path d="M150 237C146 269 148 294 155 310C160 320 170 316 169 306C166 286 167 262 174 243Z" fill="${fill}" ${stroke}/>
      <path d="M310 237C314 269 312 294 305 310C300 320 290 316 291 306C294 286 293 262 286 243Z" fill="${fill}" ${stroke}/>`;
  }
  return `<path d="M145 219C143 137 179 92 231 92C284 92 318 137 315 219C300 195 287 180 273 171C258 197 238 210 215 207C194 205 177 194 166 174C157 184 150 199 145 219Z" fill="${fill}" ${stroke}/>
    <path d="M159 178C180 201 211 212 241 204C262 198 279 188 289 174C287 192 276 204 260 213C240 224 216 224 198 215C181 206 167 193 159 178Z" fill="${fill}" opacity=".95"/>
    <path d="M168 126C192 106 221 100 251 105" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="7" stroke-linecap="round"/>
    <path d="M150 232C144 282 147 331 157 366C163 382 175 378 178 365C174 328 175 280 182 242Z" fill="${fill}" ${stroke}/>
    <path d="M310 232C316 282 313 331 303 366C297 382 285 378 282 365C286 328 285 280 278 242Z" fill="${fill}" ${stroke}/>`;
}

function braids(id, hair, hairShade) {
  return `<g stroke="${hairShade}" stroke-opacity=".32" stroke-width="1.6" fill="url(#${id}-hair)">
    <ellipse cx="157" cy="339" rx="16" ry="24" transform="rotate(8 157 339)"/>
    <ellipse cx="160" cy="378" rx="14" ry="21" transform="rotate(-7 160 378)"/>
    <ellipse cx="157" cy="414" rx="12" ry="18" transform="rotate(8 157 414)"/>
    <path d="M149 430h15l4 15-11 6-9-6 3-15Z"/>
    <ellipse cx="303" cy="339" rx="16" ry="24" transform="rotate(-8 303 339)"/>
    <ellipse cx="300" cy="378" rx="14" ry="21" transform="rotate(7 300 378)"/>
    <ellipse cx="303" cy="414" rx="12" ry="18" transform="rotate(-8 303 414)"/>
    <path d="M296 430h15l3 15-11 6-8-6 2-15Z"/>
  </g>`;
}

function bodyGroup(character, id, isPlayer) {
  const skin = paint(character, 'skin', '#f2c6a5');
  const skinShade = shade(character, 'skin', '#dda27e');
  const outfit = paint(character, 'outfit', '#d96f86');
  const outfit2 = paint(character, 'outfit2', '#fff3e8');
  const accent = paint(character, 'accent', '#a8445e');
  const ink = '#4a2b34';
  const body = character.body || 'soft';
  const wide = body === 'curvy' ? 9 : body === 'soft' ? 4 : 0;
  const armLeft = `M169 376 C148 392 137 430 139 477 C140 512 145 541 158 557 C163 564 176 562 178 553 C169 512 173 447 191 398Z`;
  const armRight = `M291 376 C312 392 323 430 321 477 C320 512 315 541 302 557 C297 564 284 562 282 553 C291 512 287 447 269 398Z`;
  const torso = `M${164 - wide} 367 Q190 344 230 344 Q${270 + wide} 344 ${296 + wide} 367 L${298 + wide} 431 Q${294 + wide} 472 ${278 + wide} 501 L${182 - wide} 501 Q${166 - wide} 472 ${162 - wide} 431Z`;
  const skirt = `M${182 - wide} 497 L${150 - wide * 1.4} 610 Q147 634 177 638 L283 638 Q313 634 ${310 + wide * 1.4} 610 L${278 + wide} 497Z`;

  let outfitDetails = '';
  if (character.outfitStyle === 'apron') {
    outfitDetails = `
      <path d="M190 370 Q230 397 270 370" fill="none" stroke="${outfit2}" stroke-width="7" stroke-linecap="round" opacity=".9"/>
      <path d="M186 397 L204 388 L211 468 L189 475Z" fill="${outfit2}" opacity=".95"/>
      <path d="M274 397 L256 388 L249 468 L271 475Z" fill="${outfit2}" opacity=".95"/>
      <path d="M194 468 H266 Q273 527 262 610 H198 Q187 527 194 468Z" fill="${outfit2}" opacity=".96"/>
      <path d="M213 505 H247 V522 H213Z" fill="none" stroke="${accent}" stroke-width="2" opacity=".7"/>
      <circle cx="230" cy="440" r="8" fill="${accent}" opacity=".8"/>
      <path d="M226 440c1.2-3.4 3.5-3.2 4-1.7.5-1.5 2.8-1.7 4 1.7-2.6 2.5-5.3 2.5-8 0Z" fill="${outfit2}"/>`;
  } else if (character.outfitStyle === 'cardigan') {
    outfitDetails = `
      <path d="M230 366 L230 499" stroke="${accent}" stroke-width="2" opacity=".35"/>
      <path d="M190 361 Q230 388 270 361" fill="none" stroke="${outfit2}" stroke-width="9" stroke-linecap="round"/>
      <path d="M196 365 Q230 389 264 365 L275 500 L185 500Z" fill="${outfit2}" opacity=".8"/>
      <path d="M212 368 L207 500 M248 368 L253 500" stroke="${accent}" stroke-width="1.2" opacity=".35"/>
      <circle cx="207" cy="410" r="2.2" fill="${accent}"/><circle cx="253" cy="410" r="2.2" fill="${accent}"/>
      <circle cx="208" cy="446" r="2.2" fill="${accent}"/><circle cx="252" cy="446" r="2.2" fill="${accent}"/>
      <path d="M220 367c0 8 5 13 10 13s10-5 10-13c-2 5-6 7-10 7s-8-2-10-7Z" fill="${accent}" opacity=".85"/>`;
  } else if (character.outfitStyle === 'sundress') {
    outfitDetails = `
      <path d="M191 358 Q178 373 181 394 Q201 405 230 405 Q259 405 279 394 Q282 373 269 358 Q250 374 230 374 Q210 374 191 358Z" fill="${outfit2}" opacity=".95"/>
      <path d="M230 370 L230 500" stroke="${outfit2}" stroke-width="1.4" opacity=".3"/>
      <path d="M183 488 Q230 503 277 488" fill="none" stroke="${accent}" stroke-width="8" opacity=".65"/>
      <path d="M224 488h12l-6 18-6-18Z" fill="${accent}" opacity=".8"/>
      <g fill="${outfit2}" opacity=".55">
        <circle cx="200" cy="540" r="4"/><circle cx="242" cy="562" r="5"/><circle cx="272" cy="585" r="3.5"/>
        <circle cx="180" cy="592" r="3"/><circle cx="218" cy="614" r="3.5"/><circle cx="286" cy="540" r="3"/>
      </g>`;
  } else if (character.outfitStyle === 'jacket') {
    outfitDetails = `
      <path d="M191 359 L208 380 L230 390 L252 380 L269 359 L280 500 L180 500Z" fill="${outfit2}" opacity=".72"/>
      <path d="M164 367 L183 352 L230 378 L170 468Z" fill="${accent}" opacity=".9"/>
      <path d="M296 367 L277 352 L230 378 L290 468Z" fill="${accent}" opacity=".9"/>
      <path d="M230 378 L230 500" stroke="${accent}" stroke-width="3" opacity=".65"/>
      <path d="M196 419 H216 M244 419 H264" stroke="${accent}" stroke-width="2" opacity=".5"/>
      <circle cx="230" cy="382" r="4.5" fill="${outfit2}"/>`;
  } else if (character.outfitStyle === 'baker') {
    outfitDetails = `
      <path d="M188 361 Q230 389 272 361" fill="none" stroke="${outfit2}" stroke-width="10" stroke-linecap="round"/>
      <path d="M195 451 H265 Q272 527 265 615 H195 Q188 527 195 451Z" fill="${outfit2}" opacity=".92"/>
      <path d="M208 470 H252 V487 H208Z" fill="none" stroke="${accent}" stroke-width="2" opacity=".6"/>
      <path d="M230 424c-8-8-18-1-18 6 0 10 12 15 18 21 6-6 18-11 18-21 0-7-10-14-18-6Z" fill="${accent}" opacity=".55"/>
      <path d="M188 371 C198 395 212 408 230 408 C248 408 262 395 272 371" fill="none" stroke="${outfit}" stroke-width="4" opacity=".7"/>`;
  } else if (character.outfitStyle === 'beach') {
    outfitDetails = `
      <path d="M184 364 Q196 390 230 393 Q264 390 276 364 Q265 352 230 352 Q195 352 184 364Z" fill="${outfit2}" opacity=".92"/>
      <path d="M230 392 L230 500" stroke="${accent}" stroke-width="1.3" opacity=".35"/>
      <path d="M183 488 Q230 504 277 488" fill="none" stroke="${accent}" stroke-width="10" opacity=".55"/>
      <path d="M216 372 Q230 390 244 372" fill="none" stroke="${accent}" stroke-width="1.5" opacity=".5"/>
      <g fill="${outfit2}" opacity=".8">
        <circle cx="146" cy="465" r="4"/><circle cx="314" cy="465" r="4"/>
      </g>`;
  } else if (isPlayer) {
    outfitDetails = `
      <path d="M190 357 L230 380 L270 357 L282 500 L178 500Z" fill="${outfit2}" opacity=".92"/>
      <path d="M230 380 L230 500" stroke="${accent}" stroke-width="1.5" opacity=".35"/>
      <path d="M184 363 L204 373 L194 407 L176 394Z" fill="${accent}" opacity=".72"/>
      <path d="M276 363 L256 373 L266 407 L284 394Z" fill="${accent}" opacity=".72"/>
      <path d="M205 368 L230 381 L255 368" fill="none" stroke="${accent}" stroke-width="2"/>`;
  }

  const legs = isPlayer ? '' : `
    <path d="M195 605 C190 636 187 661 184 684 L210 684 C212 657 217 632 222 606Z" fill="${skin}" stroke="${skinShade}" stroke-width="1.5"/>
    <path d="M265 605 C270 636 273 661 276 684 L250 684 C248 657 243 632 238 606Z" fill="${skin}" stroke="${skinShade}" stroke-width="1.5"/>
    <path d="M181 676 Q195 671 212 676 L214 692 Q196 698 179 691Z" fill="${accent}" stroke="${accent}" stroke-width="1.4"/>
    <path d="M279 676 Q265 671 248 676 L246 692 Q264 698 281 691Z" fill="${accent}" stroke="${accent}" stroke-width="1.4"/>`;
  const lower = isPlayer
    ? `<path d="M178 497 L158 692 L216 692 L230 542 L244 692 L302 692 L282 497Z" fill="#46404f" stroke="#332e3b" stroke-width="2"/>
       <path d="M178 506 H282" stroke="#332e3b" stroke-width="3" opacity=".6"/>`
    : `<path d="${skirt}" fill="${outfit}" stroke="${accent}" stroke-opacity=".3" stroke-width="2"/>
       <path d="M${180 - wide} 500 Q230 516 ${280 + wide} 500" fill="none" stroke="${accent}" stroke-width="2.5" opacity=".35"/>
       <path d="M${188 - wide} 512 C190 550 188 595 180 632" fill="none" stroke="#fff" stroke-opacity=".17" stroke-width="6" stroke-linecap="round"/>`;

  return `
    <g>
      ${legs}
      <path d="${armLeft}" fill="${skin}" stroke="${skinShade}" stroke-width="1.6"/>
      <path d="${armRight}" fill="${skin}" stroke="${skinShade}" stroke-width="1.6"/>
      <ellipse cx="168" cy="560" rx="12" ry="15" fill="${skin}" stroke="${skinShade}" stroke-width="1.4" transform="rotate(-9 168 560)"/>
      <ellipse cx="292" cy="560" rx="12" ry="15" fill="${skin}" stroke="${skinShade}" stroke-width="1.4" transform="rotate(9 292 560)"/>
      ${lower}
      <path d="${torso}" fill="${outfit}" stroke="${accent}" stroke-opacity=".28" stroke-width="2"/>
      <path d="M${171 - wide} 392 C190 420 270 420 ${289 + wide} 392" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="8"/>
      ${outfitDetails}
      <path d="M205 323 H255 V358 Q243 372 230 372 Q217 372 205 358Z" fill="${skin}" stroke="${skinShade}" stroke-width="1.4"/>
      <path d="M205 342 Q230 358 255 342" fill="${skinShade}" opacity=".25"/>
    </g>`;
}

function accessoryGroup(character) {
  const accent = paint(character, 'accent', '#a8445e');
  const ink = '#3a2530';
  const accessory = character.accessory;
  if (accessory === 'glasses') {
    return `<g fill="none" stroke="${ink}" stroke-width="2.1" opacity=".8">
      <rect x="173" y="230" width="47" height="31" rx="10"/>
      <rect x="240" y="230" width="47" height="31" rx="10"/>
      <path d="M220 241 Q230 236 240 241M173 239 L157 235M287 239 L303 235"/>
    </g>`;
  }
  if (accessory === 'earrings') {
    return `<g fill="none" stroke="${accent}" stroke-width="2.1"><circle cx="147" cy="272" r="5"/><circle cx="313" cy="272" r="5"/></g>
      <circle cx="147" cy="277" r="2" fill="${accent}"/><circle cx="313" cy="277" r="2" fill="${accent}"/>`;
  }
  if (accessory === 'hairpin') {
    return `<path d="m286 170 3.5 7 7.5 1-5.5 5.2 1.3 7.3-6.8-3.6-6.8 3.6 1.3-7.3-5.5-5.2 7.5-1 3.5-7Z" fill="${accent}" stroke="#fff" stroke-opacity=".4" stroke-width="1"/>`;
  }
  if (accessory === 'scarf') {
    return `<path d="M203 338 Q230 366 257 338 L266 352 Q243 376 230 376 Q217 376 194 352Z" fill="${accent}" opacity=".88"/>
      <path d="M216 358 L202 394 L220 389 L230 372Z" fill="${accent}" opacity=".75"/>`;
  }
  return '';
}

function outfitBack(character, isPlayer) {
  const outfit = paint(character, 'outfit', '#d96f86');
  const accent = paint(character, 'accent', '#a8445e');
  if (!isPlayer) return '';
  return `<path d="M163 365 Q190 343 230 343 Q270 343 297 365 L308 508 L152 508Z" fill="${outfit}" opacity=".45"/>`;
}

export function renderPortrait(character, options = {}) {
  const mode = options.mode || 'full';
  const isPlayer = Boolean(options.isPlayer);
  const id = `p${++uid}`;
  const skin = paint(character, 'skin', '#f2c6a5');
  const skinShade = shade(character, 'skin', '#dda27e');
  const hair = paint(character, 'hair', '#704536');
  const hairShade = shade(character, 'hair', '#4d2d24');
  const eye = paint(character, 'eye', '#725c9b');
  const accent = paint(character, 'accent', '#a8445e');
  const ink = '#3a2530';
  const viewBoxes = {
    full: '44 54 372 646',
    bust: '91 91 278 365',
    face: '106 92 248 256',
    card: '104 78 252 330',
    tiny: '118 108 224 230',
  };
  const viewBox = viewBoxes[mode] || viewBoxes.full;
  const svgClass = options.className || '';
  const label = character.name || 'Portrait';
  const style = character.hairStyle || 'wavy';
  const styleBits = [
    hairBack(style, id, hair, hairShade),
    outfitBack(character, isPlayer),
    bodyGroup(character, id, isPlayer),
    `<path d="M151 221C151 155 178 126 230 126C282 126 309 155 309 221C309 267 289 305 230 322C171 305 151 267 151 221Z" fill="url(#${id}-skin)" stroke="${skinShade}" stroke-width="1.7"/>`,
    `<ellipse cx="150" cy="247" rx="10" ry="16" fill="${skin}" stroke="${skinShade}" stroke-width="1.3" transform="rotate(8 150 247)"/>`,
    `<ellipse cx="310" cy="247" rx="10" ry="16" fill="${skin}" stroke="${skinShade}" stroke-width="1.3" transform="rotate(-8 310 247)"/>`,
    `<path d="M162 166 Q230 180 298 166 L298 196 Q230 212 162 196Z" fill="${skinShade}" opacity=".16"/>`,
    eyeGroup(197, false, id, eye, ink),
    eyeGroup(263, true, id, eye, ink),
    `<path d="M228 270 Q233 274 229 277" fill="none" stroke="${skinShade}" stroke-width="1.8" stroke-linecap="round"/>`,
    `<ellipse cx="181" cy="279" rx="15" ry="7" fill="#e57f8f" opacity=".23"/><ellipse cx="279" cy="279" rx="15" ry="7" fill="#e57f8f" opacity=".23"/>`,
    `<path d="M219 294 Q230 303 241 294" fill="none" stroke="${accent}" stroke-width="2.4" stroke-linecap="round"/><path d="M223 299 Q230 303 237 299" fill="${accent}" opacity=".35"/>`,
    hairFront(style, id, hair, hairShade),
    style === 'braids' ? braids(id, hair, hairShade) : '',
    accessoryGroup(character),
  ];

  return `<svg class="portrait ${svgClass}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
    <defs>
      <linearGradient id="${id}-skin" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="${skin}"/>
        <stop offset="1" stop-color="${skinShade}"/>
      </linearGradient>
      <linearGradient id="${id}-hair" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0" stop-color="${hair}"/>
        <stop offset=".68" stop-color="${hair}"/>
        <stop offset="1" stop-color="${hairShade}"/>
      </linearGradient>
      <radialGradient id="${id}-eye" cx=".4" cy=".25" r=".85">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset=".25" stop-color="${eye}"/>
        <stop offset="1" stop-color="${eye}" stop-opacity=".85"/>
      </radialGradient>
      <filter id="${id}-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="7"/>
      </filter>
    </defs>
    <ellipse cx="230" cy="252" rx="164" ry="166" fill="${accent}" opacity=".075" filter="url(#${id}-soft)"/>
    ${styleBits.join('\n')}
  </svg>`;
}

export function renderPlayerPortrait(player, options = {}) {
  const skin = player.skin || { color: '#f2c6a5', shade: '#dda27e' };
  const hair = player.hairColor || { color: '#704536', shade: '#4d2d24' };
  const outfit = player.outfitColor || { color: '#d96f86', dark: '#ad4d64' };
  const character = {
    id: 'player',
    name: player.name || 'You',
    skin,
    hair,
    hairStyle: player.hairStyle || 'wavy',
    eye: player.eyeColor || '#6f5b7e',
    outfit: outfit.color,
    outfit2: '#fff8ef',
    accent: outfit.dark,
    accessory: player.accessory || 'none',
    body: player.body || 'soft',
    outfitStyle: 'player',
  };
  return renderPortrait(character, { ...options, isPlayer: true });
}

export function renderChildPortrait(child, stage, options = {}) {
  const id = `c${++uid}`;
  const stageIndex = Math.min(3, Math.max(0, stage));
  const skin = child.skin || { color: '#f2c6a5', shade: '#dda27e' };
  const hair = child.hair || { color: '#704536', shade: '#4d2d24' };
  const accent = child.accent || '#d96f86';
  const outfit = child.outfit || '#d9a887';
  if (stageIndex === 3) {
    return renderPortrait({
      name: child.name,
      skin,
      hair,
      hairStyle: child.hairStyle || 'wavy',
      eye: child.eye || '#725c9b',
      outfit,
      outfit2: '#fff8ef',
      accent,
      accessory: 'none',
      body: 'slim',
      outfitStyle: 'player',
    }, { mode: options.mode || 'bust', isPlayer: true });
  }
  const isBaby = stageIndex === 0;
  const bigHead = stageIndex === 1 ? 88 : 73;
  return `<svg class="portrait child-portrait ${options.className || ''}" viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${child.name || 'Child'}">
    <defs>
      <linearGradient id="${id}-skin" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="${skin.color}"/><stop offset="1" stop-color="${skin.shade}"/></linearGradient>
      <linearGradient id="${id}-hair" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="${hair.color}"/><stop offset="1" stop-color="${hair.shade}"/></linearGradient>
      <radialGradient id="${id}-eye" cx=".4" cy=".25" r=".85"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${child.eye || '#7d6b92'}"/><stop offset="1" stop-color="${child.eye || '#7d6b92'}"/></radialGradient>
    </defs>
    <ellipse cx="150" cy="172" rx="112" ry="118" fill="${accent}" opacity=".09"/>
    ${isBaby ? `
      <path d="M86 235 Q150 203 214 235 L222 318 Q150 335 78 318Z" fill="${outfit}" stroke="${accent}" stroke-opacity=".35" stroke-width="2"/>
      <path d="M150 215v100M92 250q58 27 116 0" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3"/>
      <ellipse cx="150" cy="155" rx="66" ry="70" fill="url(#${id}-skin)" stroke="${skin.shade}" stroke-width="1.6"/>
      <path d="M89 154 Q91 89 150 88 Q210 89 211 154 Q196 127 167 120 Q148 139 119 129 Q99 132 89 154Z" fill="url(#${id}-hair)"/>
      <circle cx="127" cy="159" r="6.5" fill="#3a2530"/><circle cx="173" cy="159" r="6.5" fill="#3a2530"/>
      <circle cx="124" cy="156" r="2.2" fill="#fff"/><circle cx="170" cy="156" r="2.2" fill="#fff"/>
      <path d="M142 181q8 7 16 0" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="114" cy="175" rx="10" ry="5" fill="#e57f8f" opacity=".28"/><ellipse cx="186" cy="175" rx="10" ry="5" fill="#e57f8f" opacity=".28"/>
      <path d="M121 111q28-17 58 0" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="6" stroke-linecap="round"/>
    ` : `
      <path d="M102 238 Q150 215 198 238 L216 328 H84Z" fill="${outfit}" stroke="${accent}" stroke-opacity=".3" stroke-width="2"/>
      <path d="M150 236v92" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
      <path d="M118 249 112 320M182 249l6 71" stroke="${skin.color}" stroke-width="13" stroke-linecap="round"/>
      <ellipse cx="150" cy="${isBaby ? 155 : 138}" rx="${bigHead * .77}" ry="${bigHead * .82}" fill="url(#${id}-skin)" stroke="${skin.shade}" stroke-width="1.6"/>
      <path d="M${150 - bigHead * .74} 140 Q${150 - bigHead * .71} 68 150 66 Q${150 + bigHead * .71} 68 ${150 + bigHead * .74} 140 Q${150 + bigHead * .5} 111 150 102 Q${150 - bigHead * .5} 111 ${150 - bigHead * .74} 140Z" fill="url(#${id}-hair)"/>
      <path d="M${150 - bigHead * .68} 152 Q${150 - bigHead * .35} 130 150 136 Q${150 + bigHead * .35} 130 ${150 + bigHead * .68} 152 Q${150 + bigHead * .3} 165 150 160 Q${150 - bigHead * .3} 165 ${150 - bigHead * .68} 152Z" fill="url(#${id}-hair)" opacity=".92"/>
      <ellipse cx="${150 - bigHead * .31}" cy="145" rx="8" ry="10" fill="url(#${id}-eye)"/><ellipse cx="${150 + bigHead * .31}" cy="145" rx="8" ry="10" fill="url(#${id}-eye)"/>
      <circle cx="${150 - bigHead * .34}" cy="142" r="2.8" fill="#fff"/><circle cx="${150 + bigHead * .28}" cy="142" r="2.8" fill="#fff"/>
      <path d="M${150 - bigHead * .4} 131 Q${150 - bigHead * .31} 126 ${150 - bigHead * .22} 131M${150 + bigHead * .22} 131 Q${150 + bigHead * .31} 126 ${150 + bigHead * .4} 131" fill="none" stroke="${hair.shade}" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M${150 - 7} 169 Q150 175 ${150 + 7} 169" fill="none" stroke="${accent}" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="${150 - bigHead * .45}" cy="160" rx="10" ry="5" fill="#e57f8f" opacity=".28"/><ellipse cx="${150 + bigHead * .45}" cy="160" rx="10" ry="5" fill="#e57f8f" opacity=".28"/>
      <path d="M${150 - bigHead * .45} 93q${bigHead * .45} -24 ${bigHead * .9} 0" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="6" stroke-linecap="round"/>
    `}
  </svg>`;
}

export function sceneArt(key) {
  const common = `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  if (key === 'cafe') {
    return `<svg class="scene-svg" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity=".5" ${common}>
        <path d="M35 195V70c0-20 16-36 36-36h58c20 0 36 16 36 36v125" />
        <path d="M51 195V80c0-12 10-22 22-22h54c12 0 22 10 22 22v115" />
        <path d="M95 58v137M51 120h112" opacity=".6"/>
        <path d="M190 195V85h86v110M204 195v-86h58v86" />
        <path d="M278 195v-58h47v58M290 137v-22h23v22" />
        <path d="M295 195v-32h13v32" opacity=".7"/>
        <path d="M234 75v-18M234 57c-8-8-8-16 0-22M234 57c8-8 8-16 0-22" />
        <path d="M234 57c-14 2-20-4-20-12M234 57c14 2 20-4 20-12" />
        <path d="M25 195h318" stroke-width="2.5"/>
        <path d="M270 110h62M270 124h50" opacity=".55"/>
      </g>
      <g opacity=".3" fill="currentColor">
        <circle cx="80" cy="105" r="3"/><circle cx="112" cy="95" r="4"/><circle cx="130" cy="120" r="2.5"/>
        <circle cx="224" cy="120" r="4"/><circle cx="250" cy="108" r="2.5"/><circle cx="300" cy="165" r="3"/>
      </g>
    </svg>`;
  }
  if (key === 'library') {
    return `<svg class="scene-svg" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity=".5" ${common}>
        <path d="M35 200V35h290v165M58 200V55h96v145M206 200V55h96v145"/>
        <path d="M58 82h96M58 110h96M58 138h96M58 166h96M206 82h96M206 110h96M206 138h96M206 166h96" opacity=".7"/>
        <path d="M70 70v14M80 70v14M90 70v14M72 98v14M82 98v14M92 98v14M72 126v14M82 126v14M92 126v14M72 154v14M82 154v14M92 154v14" opacity=".55"/>
        <path d="M218 70v14M228 70v14M238 70v14M218 98v14M228 98v14M238 98v14M218 126v14M228 126v14M238 126v14" opacity=".55"/>
        <path d="M180 35v78M178 55h4M176 75h8M174 95h12" opacity=".55"/>
        <path d="M171 95h18l-9 15-9-15Z" opacity=".55"/>
        <path d="M35 200h290" stroke-width="2.5"/>
      </g>
      <g opacity=".28" fill="currentColor">
        <path d="M158 82l3 6 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1 3-6Z"/>
        <circle cx="150" cy="113" r="3"/><circle cx="169" cy="132" r="2"/><circle cx="151" cy="152" r="2.5"/>
      </g>
    </svg>`;
  }
  if (key === 'garden') {
    return `<svg class="scene-svg" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity=".48" ${common}>
        <path d="M34 190V55L150 18v172M150 190V18l176 38v134M150 18v172"/>
        <path d="M70 190V72l50-16v134M110 190V88l24-8v110M200 190V53l52 18v119M288 190V81l38 12v97" opacity=".7"/>
        <path d="M34 190h292M40 55l110-37M150 18l176 38" opacity=".6"/>
        <path d="M180 190v-44h36v44M190 146v-16c0-8 6-14 14-14s14 6 14 14v16M198 116V96M210 116V96" />
        <path d="M198 96c-9-7-9-16-2-23M210 96c9-7 9-16 2-23" opacity=".7"/>
      </g>
      <g opacity=".4" fill="currentColor">
        <circle cx="86" cy="135" r="5"/><circle cx="99" cy="150" r="3.5"/><circle cx="74" cy="160" r="4"/>
        <circle cx="250" cy="120" r="4"/><circle cx="268" cy="140" r="5.5"/><circle cx="286" cy="125" r="3"/>
        <circle cx="230" cy="158" r="3"/><circle cx="300" cy="168" r="4"/>
      </g>
    </svg>`;
  }
  if (key === 'arcade') {
    return `<svg class="scene-svg" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity=".5" ${common}>
        <path d="M28 194h304M38 194v-38h42v38M49 156v-46h20v46M55 110V92h8v18M90 194v-38h42v38M101 156v-46h20v46M107 110V92h8v18M192 194v-38h42v38M203 156v-46h20v46M209 110V92h8v18M244 194v-38h42v38M255 156v-46h20v46M261 110V92h8v18"/>
        <path d="M45 138h28M97 138h28M199 138h28M251 138h28" opacity=".7"/>
        <path d="M172 92v-26M160 66h24M166 56h12" opacity=".65"/>
        <path d="M12 82h52M12 104h34M302 72h40M308 94h34" opacity=".3"/>
        <path d="M150 194v-30h60v30M162 164v-20h36v20" opacity=".6"/>
      </g>
      <g opacity=".45" fill="currentColor">
        <path d="M104 78l3 7 8 1-6 5 1 8-6-4-6 4 1-8-6-5 8-1 3-7Z"/>
        <circle cx="272" cy="167" r="5"/><circle cx="287" cy="177" r="3"/>
        <path d="M26 136h18M30 146h10" opacity=".6"/>
      </g>
    </svg>`;
  }
  if (key === 'bakery') {
    return `<svg class="scene-svg" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g opacity=".5" ${common}>
        <path d="M35 192V98h92v94M50 98V72h62v26M58 72V55h46v17"/>
        <path d="M43 120h76M43 142h76M43 164h76" opacity=".55"/>
        <path d="M151 192v-66h86v66M164 192v-52h60v52"/>
        <path d="M282 192v-28h46v28M292 164v-18h26v18"/>
        <path d="M25 192h310" stroke-width="2.5"/>
        <path d="M262 58v-22M262 36c-7-6-6-13 0-18M262 36c7-6 6-13 0-18" />
        <path d="M262 36c-11 1-15-4-14-10M262 36c11 1 15-4 14-10" opacity=".65"/>
        <path d="M300 62v-16M300 46c-6-5-5-11 0-15M300 46c6-5 5-11 0-15" />
      </g>
      <g opacity=".35" fill="currentColor">
        <circle cx="190" cy="116" r="4"/><circle cx="208" cy="126" r="3"/><circle cx="175" cy="136" r="3.5"/>
        <path d="M70 174c8-13 20-13 28 0Z"/><path d="M88 174c8-11 18-11 26 0Z"/>
        <circle cx="314" cy="180" r="3"/>
      </g>
    </svg>`;
  }
  return `<svg class="scene-svg" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g opacity=".5" ${common}>
      <path d="M0 154c42-14 71-8 108 3 47 14 90 9 133-5 43-14 79-8 119 5v63H0Z" opacity=".6"/>
      <path d="M0 178c45-9 78-2 114 7 43 11 88 7 126-4 37-11 76-8 120 2v37H0Z" opacity=".5"/>
      <path d="M34 170V102h154v68M62 170v-47h98v47M246 170v-42h80v42M265 128v-24h42v24"/>
      <path d="M34 102l77-44 77 44M62 102l49-28 49 28" opacity=".8"/>
      <path d="M246 170v-70M246 100l42-30M288 70v100M288 100h-42" opacity=".7"/>
      <path d="M0 63c19-20 37-27 58-20 14 5 20 17 12 27-9 12-39 20-70 13M296 52c18-16 40-18 55-8 10 7 7 15-4 18-13 4-33 1-51-10Z" opacity=".5"/>
      <path d="M79 24c0 11-3 17-7 24M310 96c0 9-2 14-6 20" opacity=".4"/>
    </g>
    <g opacity=".4" fill="currentColor">
      <circle cx="290" cy="29" r="11" opacity=".55"/><circle cx="286" cy="25" r="10" opacity=".2"/>
      <circle cx="120" cy="54" r="2"/><circle cx="139" cy="40" r="1.5"/><circle cx="160" cy="67" r="2"/>
      <path d="M310 190c-7-5-12-11-12-18 0-5 4-9 9-9 3 0 5 1 7 4 2-3 4-4 7-4 5 0 9 4 9 9 0 7-5 13-12 18l-4 3-4-3Z" opacity=".4"/>
    </g>
  </svg>`;
}

export function sparkleField(seed = 7) {
  let value = seed;
  const rand = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
  return Array.from({ length: 16 }, () => {
    const x = Math.round(rand() * 100);
    const y = Math.round(rand() * 100);
    const size = 1 + Math.round(rand() * 3);
    const delay = (rand() * 6).toFixed(1);
    return `<i style="left:${x}%;top:${y}%;width:${size}px;height:${size}px;animation-delay:-${delay}s"></i>`;
  }).join('');
}

export function titlePortraits() {
  return ['aiko', 'rin', 'sora'].map((id, index) => {
    const character = characterById(id);
    return `<div class="title-portrait-card title-portrait-${index + 1}" aria-hidden="true">
      <div class="title-portrait-glow"></div>
      ${renderPortrait(character, { mode: 'full' })}
      <span class="title-portrait-name">${character.name}</span>
    </div>`;
  }).join('');
}
