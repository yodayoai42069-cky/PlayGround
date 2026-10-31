// Small hand-drawn icon set used throughout the interface.
const PATHS = {
  heart: '<path d="M12 20.3S3.8 15.2 3.8 9.3A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.2 3.1c0 5.9-8.2 11-8.2 11Z"/>',
  heartFill: '<path d="M12 20.3S3.8 15.2 3.8 9.3A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.2 3.1c0 5.9-8.2 11-8.2 11Z" fill="currentColor"/>',
  home: '<path d="M4 11.5 12 4l8 7.5V20h-5v-5H9v5H4Z"/><path d="M8 20v-4.5h8V20"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v14M15 6v14"/>',
  cup: '<path d="M5 8h11v7a5 5 0 0 1-5 5 5 5 0 0 1-5-5V9Z"/><path d="M16 9h2a3 3 0 0 1 0 6h-2M7 4v2M10 3v3M13 4v2"/>',
  leaf: '<path d="M20 4C12 4 5 8 4 15c-1 4 2 5 5 4 7-2 10-8 11-15Z"/><path d="M5 20c2-6 6-9 11-11"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9Z"/>',
  game: '<rect x="3" y="7" width="18" height="12" rx="5"/><path d="M8 11v4M6 13h4M15.5 12h.1M18 14h.1"/>',
  bow: '<path d="M12 12 4 7v10l8-5 8 5V7Z"/><circle cx="12" cy="12" r="2.5"/>',
  shell: '<path d="M12 20c-5 0-8-3-8-7 0-5 4-9 8-9s8 4 8 9c0 4-3 7-8 7Z"/><path d="M12 20V4M8 20l-2-8M16 20l2-8"/>',
  family: '<circle cx="9" cy="7" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 20c0-4 2.4-6.5 5.5-6.5s5.5 2.5 5.5 6.5M14.5 20c0-3 1.5-5 4-5s3.7 1.5 3.7 4"/>',
  sparkle: '<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"/>',
  hanger: '<path d="M12 5a2 2 0 1 1 2 2c-1 .4-1.5 1.2-1.5 2.2"/><path d="m12 10 9 7.5c.7.6.3 1.5-.6 1.5H3.6c-.9 0-1.3-.9-.6-1.5Z"/>',
  coins: '<ellipse cx="9" cy="7" rx="5.5" ry="2.5"/><path d="M3.5 7v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V7"/><path d="M10 12v5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-5"/><ellipse cx="15.5" cy="12" rx="5.5" ry="2.5"/>',
  nest: '<path d="M3 14c3-4 6-2 9-2s6-2 9 2c-1 4-4 6-9 6s-8-2-9-6Z"/><path d="M6 13c-1-3 0-5 2-6M18 13c1-3 0-5-2-6"/><circle cx="10" cy="15" r="1"/><circle cx="14" cy="14" r="1"/>',
  moon: '<path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  sunrise: '<path d="M3 18h18M5 14a7 7 0 0 1 14 0M12 3v4M5 8l2 2M19 8l-2 2"/>',
  sunset: '<path d="M3 18h18M5 14a7 7 0 0 1 14 0M12 5v4M5 10l2 2M19 10l-2 2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 9h18M8 13h2M14 13h2M8 17h2M14 17h2"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M8 8C6 8 4.5 6.5 4.5 5S6 2.5 7.5 3.5C9 4.5 12 8 12 8ZM16 8c2 0 3.5-1.5 3.5-3S18 2.5 16.5 3.5C15 4.5 12 8 12 8Z"/>',
  chat: '<path d="M4 5h16v11H8l-4 4Z"/><path d="M8 9h8M8 12h5"/>',
  ring: '<circle cx="12" cy="15" r="5"/><path d="m9 9 3-5 3 5M9 9h6"/>',
  baby: '<circle cx="12" cy="10" r="6"/><path d="M10 9h.1M14 9h.1M10.5 12c.8.8 2.2.8 3 0M8 20c1-2.5 2-3 4-3s3 .5 4 3"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  crown: '<path d="m3 8 5 3 4-6 4 6 5-3-2 11H5Z"/><path d="M5 19h14"/>',
  flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 3c2 3 2 5 0 7-2-2-2-4 0-7ZM21 12c-3 2-5 2-7 0 2-2 4-2 7 0ZM12 21c-2-3-2-5 0-7 2 2 2 4 0 7ZM3 12c3-2 5-2 7 0-2 2-4 2-7 0Z"/>',
  tape: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/><path d="M10.5 12h3"/>',
  plush: '<circle cx="8" cy="7" r="3"/><circle cx="16" cy="7" r="3"/><circle cx="12" cy="13" r="6"/><path d="M10 13h.1M14 13h.1M10.5 16c.9.7 2.1.7 3 0"/>',
  necklace: '<path d="M5 4c0 6 3 9 7 9s7-3 7-9"/><path d="m12 13 2 3-2 3-2-3Z"/>',
  record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 6a6 6 0 0 1 6 6"/>',
  perfume: '<rect x="7" y="9" width="10" height="12" rx="3"/><path d="M9 9V6h6v3M12 3v3M5 13h2M17 13h2"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
  smoothie: '<path d="M6 4h12l-2 17H8Z"/><path d="M8 9h9M14 2l3-2"/>',
  book: '<path d="M4 4h7a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4ZM20 4h-4a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h4Z"/>',
  snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 3 3-3M9 20l3-3 3 3M4 11l4 1-1-4M20 13l-4-1 1 4M4 13l4-1-1 4M20 11l-4 1 1-4"/>',
  bolt: '<path d="m13 2-8 12h6l-1 8 8-12h-6Z"/>',
  brush: '<path d="m14 4 6 6-9 9-6-6ZM5 13l6 6M4 20l2-6 4 4Z"/>',
  teacup: '<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2M7 5c-1-1 1-2 0-3M11 5c-1-1 1-2 0-3"/>',
  cloud: '<path d="M6 18h12a4 4 0 0 0 .4-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 6 18Z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
  save: '<path d="M5 3h12l4 4v14H3V3Z"/><path d="M7 3v6h10V3M7 21v-7h10v7"/>',
  sound: '<path d="M4 9v6h4l5 4V5L8 9Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
  mute: '<path d="M4 9v6h4l5 4V5L8 9Z"/><path d="m16 9 5 6M21 9l-5 6"/>',
  fullscreen: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  alert: '<path d="M12 3 2.5 20h19Z"/><path d="M12 9v5M12 17h.1"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  pin: '<path d="M12 22s7-7 7-13a7 7 0 0 0-14 0c0 6 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/>',
  paw: '<circle cx="7" cy="8" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="17" cy="8" r="2"/><path d="M7 15c0-3 2-5 5-5s5 2 5 5c0 2.5-2 4-5 4s-5-1.5-5-4Z"/>'
};

export function icon(name, size = 20, className = '') {
  const path = PATHS[name] || PATHS.heart;
  return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

export function heartRow(value, max = 5, cls = '') {
  let out = '<span class="heart-row ' + cls + '">';
  for (let i = 0; i < max; i++) {
    out += `<span class="heart ${i < value ? 'filled' : ''}">${icon('heartFill', 13)}</span>`;
  }
  return out + '</span>';
}
