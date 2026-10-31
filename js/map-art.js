// Original top-down town illustration for the map screen.
export function mapArtSVG() {
  return `
  <svg class="map-art" viewBox="0 0 1000 667" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="grassMap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d7e5ac"/><stop offset=".55" stop-color="#c5da98"/><stop offset="1" stop-color="#b6d18c"/>
      </linearGradient>
      <linearGradient id="waterMap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8ed4dc"/><stop offset="1" stop-color="#56b1c7"/>
      </linearGradient>
      <linearGradient id="sandMap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f6e1ad"/><stop offset="1" stop-color="#e7c98b"/>
      </linearGradient>
      <pattern id="fieldLines" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(24)">
        <path d="M0 14 H28" stroke="#a8c67e" stroke-width="1.5" opacity=".5"/>
      </pattern>
      <filter id="mapBlur"><feGaussianBlur stdDeviation="7"/></filter>
    </defs>

    <rect width="1000" height="667" fill="url(#grassMap)"/>
    <path d="M0 0h1000v500c-86-37-150-21-224 5-93 33-154 29-238 3-101-31-171-20-261 8-100 31-196 15-277-6Z" fill="#bdd493" opacity=".55"/>
    <path d="M0 122c101-52 184-34 260 7 74 40 136 50 219 29 91-23 158-67 241-54 101 16 191 59 280 27v-131H0Z" fill="url(#fieldLines)" opacity=".7"/>

    <!-- Coastal water -->
    <path d="M1000 419c-93-15-154-1-179 23-38 37-26 80-79 106-49 24-115 19-174 41-69 25-98 64-106 78h538Z" fill="url(#sandMap)"/>
    <path d="M1000 477c-87-12-140 4-157 31-22 34-12 70-57 92-52 25-116 20-162 38-28 11-43 20-52 29h428Z" fill="url(#waterMap)"/>
    <g fill="none" stroke="#d8f7f5" stroke-width="4" stroke-linecap="round" opacity=".65">
      <path d="M807 506c34-12 76-9 108 2"/>
      <path d="M763 548c41-13 89-8 125 6"/>
      <path d="M713 590c42-15 100-10 142 6"/>
      <path d="M835 530c22-3 42 0 58 6"/>
    </g>
    <path d="M1000 469c-92-14-149 0-170 25-31 38-19 74-66 96-52 25-110 20-161 41-30 12-52 26-66 36" fill="none" stroke="#fff4d1" stroke-width="8" opacity=".7"/>

    <!-- River / creek -->
    <path d="M502-20c-21 67-15 108-45 145-32 39-58 48-63 92-7 62 41 90 41 151 0 77-62 143-118 211-25 30-44 58-55 93" fill="none" stroke="#77c8d4" stroke-width="36" stroke-linecap="round" opacity=".85"/>
    <path d="M502-20c-21 67-15 108-45 145-32 39-58 48-63 92-7 62 41 90 41 151 0 77-62 143-118 211-25 30-44 58-55 93" fill="none" stroke="#b5eaf0" stroke-width="12" stroke-linecap="round" opacity=".55"/>
    <g fill="none" stroke="#d8f7f5" stroke-width="3" stroke-linecap="round" opacity=".5">
      <path d="M444 96c-10 17-16 29-17 46"/>
      <path d="M408 260c21 18 33 43 35 68"/>
      <path d="M365 440c-7 21-18 41-33 60"/>
    </g>

    <!-- Roads -->
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M180 442 C 232 450, 272 475, 340 520" stroke="#d9bd8a" stroke-width="46" opacity=".35"/>
      <path d="M186 448 C 300 432, 340 396, 392 289" stroke="#f2dfb4" stroke-width="31"/>
      <path d="M186 448 C 300 432, 340 396, 392 289" stroke="#c4a671" stroke-width="2.5" stroke-dasharray="8 10" opacity=".6"/>
      <path d="M392 289 C 440 222, 527 200, 590 193" stroke="#f2dfb4" stroke-width="28"/>
      <path d="M392 289 C 469 320, 548 342, 630 390" stroke="#f2dfb4" stroke-width="29"/>
      <path d="M590 193 C 671 206, 737 234, 820 267" stroke="#f2dfb4" stroke-width="27"/>
      <path d="M630 390 C 717 388, 774 434, 832 520" stroke="#f2dfb4" stroke-width="27"/>
      <path d="M340 520 C 490 524, 650 502, 832 520" stroke="#f2dfb4" stroke-width="29"/>
      <path d="M392 289 C 439 353, 461 401, 466 463" stroke="#f2dfb4" stroke-width="22" opacity=".85"/>
    </g>
    <g fill="none" stroke="#b69261" stroke-width="2" stroke-dasharray="5 12" opacity=".55">
      <path d="M392 289 C 440 222, 527 200, 590 193"/>
      <path d="M590 193 C 671 206, 737 234, 820 267"/>
      <path d="M630 390 C 717 388, 774 434, 832 520"/>
      <path d="M340 520 C 490 524, 650 502, 832 520"/>
    </g>

    <!-- Home cottage -->
    <g transform="translate(122 401)">
      <ellipse cx="46" cy="42" rx="55" ry="15" fill="#8eaf78" opacity=".4"/>
      <rect x="8" y="18" width="68" height="39" rx="5" fill="#fff1d6" stroke="#6f5349" stroke-width="2.5"/>
      <path d="M0 22 42-8l42 30Z" fill="#ec8e90" stroke="#6f5349" stroke-width="2.5"/>
      <path d="M13 22 42 1l29 21" fill="none" stroke="#ffd2c6" stroke-width="2" opacity=".6"/>
      <rect x="31" y="34" width="17" height="23" rx="2" fill="#ae745b" stroke="#6f5349" stroke-width="2"/>
      <rect x="13" y="28" width="13" height="12" rx="1" fill="#98d7df" stroke="#6f5349" stroke-width="2"/>
      <rect x="60" y="28" width="13" height="12" rx="1" fill="#98d7df" stroke="#6f5349" stroke-width="2"/>
      <path d="M8 16 C 19 13 27 13 34 16 M66 16 C58 13 49 13 43 16" stroke="#b76669" stroke-width="2" opacity=".7"/>
      <g fill="#f495a6"><circle cx="2" cy="42" r="4"/><circle cx="89" cy="43" r="4"/><circle cx="90" cy="36" r="2.6"/></g>
    </g>

    <!-- Café -->
    <g transform="translate(334 225)">
      <ellipse cx="47" cy="55" rx="57" ry="13" fill="#8eaf78" opacity=".4"/>
      <rect x="4" y="16" width="82" height="43" rx="4" fill="#f5c47b" stroke="#6f5349" stroke-width="2.5"/>
      <path d="M-5 19 46-16l51 35Z" fill="#df8b68" stroke="#6f5349" stroke-width="2.5"/>
      <path d="M-1 16 46-14l46 30" fill="none" stroke="#ffe3b5" stroke-width="2" opacity=".65"/>
      <rect x="17" y="30" width="17" height="16" rx="2" fill="#9cd9e0" stroke="#6f5349" stroke-width="2"/>
      <rect x="56" y="30" width="17" height="16" rx="2" fill="#9cd9e0" stroke="#6f5349" stroke-width="2"/>
      <rect x="38" y="36" width="16" height="24" fill="#7d5b4a" stroke="#6f5349" stroke-width="2"/>
      <path d="M17 30v16M56 30v16" stroke="#fff2d6" stroke-width="1.5"/>
      <g transform="translate(14 55)">
        <path d="M0 11 24 0l24 11v10H0Z" fill="#f4e3c4" stroke="#6f5349" stroke-width="2"/>
        <path d="M-4 12h56" stroke="#d76d84" stroke-width="5" stroke-linecap="round"/>
        <rect x="7" y="21" width="4" height="10" fill="#7d5b4a"/><rect x="37" y="21" width="4" height="10" fill="#7d5b4a"/>
      </g>
    </g>

    <!-- Park gazebo + fountain -->
    <g transform="translate(543 132)">
      <ellipse cx="47" cy="78" rx="75" ry="22" fill="#9bbb7c" opacity=".42"/>
      <g fill="#6c9b67" opacity=".9">
        <circle cx="0" cy="64" r="22"/><circle cx="20" cy="48" r="27"/><circle cx="80" cy="55" r="25"/><circle cx="103" cy="70" r="20"/>
      </g>
      <g transform="translate(30 33)">
        <path d="M5 44h30" stroke="#775747" stroke-width="3"/>
        <path d="M7 44 20 19l13 25Z" fill="#fff0d3" stroke="#6f5349" stroke-width="2"/>
        <path d="M1 20h38" stroke="#e26f88" stroke-width="5" stroke-linecap="round"/>
        <path d="M4 19 20 5l16 14Z" fill="#ef9b9a" stroke="#6f5349" stroke-width="2"/>
        <circle cx="20" cy="45" r="3" fill="#f8d36e"/>
      </g>
      <g transform="translate(51 61)">
        <ellipse cx="20" cy="12" rx="22" ry="8" fill="#70bfcc" stroke="#5a8f8e" stroke-width="1.5"/>
        <path d="M7 9c0-8 26-8 26 0" fill="none" stroke="#effcfb" stroke-width="2" opacity=".8"/>
      </g>
    </g>

    <!-- Plaza fountain -->
    <g transform="translate(590 350)">
      <circle cx="44" cy="45" r="50" fill="#f0d6c6" opacity=".5"/>
      <circle cx="44" cy="45" r="31" fill="#79c9d2" stroke="#d4c09b" stroke-width="5"/>
      <circle cx="44" cy="45" r="17" fill="#b5e9eb" opacity=".8"/>
      <path d="M44 22v22M35 30c5-8 13-8 18 0" fill="none" stroke="#f5fcf7" stroke-width="4" stroke-linecap="round"/>
      <g fill="#f2a7b5" stroke="#6f5349" stroke-width="1.2">
        <circle cx="4" cy="80" r="5"/><circle cx="84" cy="11" r="4"/><circle cx="12" cy="9" r="3"/>
      </g>
      <g fill="#e4bd68" opacity=".7"><circle cx="8" cy="43" r="2"/><circle cx="78" cy="55" r="2"/><circle cx="55" cy="85" r="2"/></g>
    </g>

    <!-- Arcade / neon block -->
    <g transform="translate(771 218)">
      <ellipse cx="49" cy="56" rx="59" ry="14" fill="#8eaf78" opacity=".35"/>
      <rect x="10" y="18" width="80" height="43" rx="4" fill="#6975b3" stroke="#554862" stroke-width="2.5"/>
      <path d="M4 19 51-12l49 31Z" fill="#8e7ec3" stroke="#554862" stroke-width="2.5"/>
      <rect x="19" y="28" width="25" height="21" rx="2" fill="#f6c9dc" stroke="#554862" stroke-width="1.8"/>
      <rect x="50" y="28" width="31" height="10" rx="1" fill="#9ee7e0" opacity=".9"/>
      <rect x="50" y="41" width="31" height="8" rx="1" fill="#f4d36f" opacity=".85"/>
      <path d="M23 31l7 0M26 27l0 8" stroke="#9a4d83" stroke-width="1.4"/>
      <path d="M53 32h7M64 32h7M75 32h3" stroke="#3b6c7b" stroke-width="2"/>
      <circle cx="49" cy="18" r="5" fill="#f8dc6a" stroke="#554862" stroke-width="1.5"/>
    </g>

    <!-- Boutique -->
    <g transform="translate(286 480)">
      <ellipse cx="49" cy="52" rx="54" ry="13" fill="#8eaf78" opacity=".4"/>
      <rect x="8" y="15" width="80" height="44" rx="4" fill="#f4c6de" stroke="#6f5349" stroke-width="2.5"/>
      <path d="M1 17 48-13l48 30Z" fill="#c58bc1" stroke="#6f5349" stroke-width="2.5"/>
      <rect x="17" y="26" width="24" height="20" rx="2" fill="#bde6e7" stroke="#6f5349" stroke-width="1.8"/>
      <rect x="53" y="28" width="24" height="31" rx="2" fill="#f5a2bb" stroke="#6f5349" stroke-width="1.8"/>
      <path d="M27 37h4M27 41h4M63 38h4M63 42h4" stroke="#fff" stroke-width="1.4" opacity=".7"/>
      <path d="M47 17c4-5 10 0 6 5-2 2-5 3-6 5-1-2-4-3-6-5-4-5 2-10 6-5Z" fill="#fff0d1" stroke="#6f5349" stroke-width="1.4"/>
    </g>

    <!-- Beach hut -->
    <g transform="translate(803 479)">
      <ellipse cx="46" cy="57" rx="57" ry="12" fill="#c9a46d" opacity=".4"/>
      <rect x="13" y="24" width="58" height="34" rx="3" fill="#e9b67d" stroke="#6f5349" stroke-width="2"/>
      <path d="M5 27 42 7l41 20Z" fill="#f4a05f" stroke="#6f5349" stroke-width="2.2"/>
      <path d="M24 27 42 12l18 15" fill="none" stroke="#f7d67a" stroke-width="2"/>
      <rect x="35" y="38" width="16" height="20" fill="#8ed5d9" stroke="#6f5349" stroke-width="1.8"/>
      <path d="M82 61c0-19 5-31 5-31s6 14 3 31Z" fill="#e97788" stroke="#6f5349" stroke-width="1.5"/>
      <path d="M73 65c0-14-8-21-8-21s-3 12 2 21Z" fill="#7bbfc9" stroke="#6f5349" stroke-width="1.5"/>
      <circle cx="16" cy="65" r="8" fill="#fff1cb" stroke="#c7a76a" stroke-width="1.5"/>
      <circle cx="70" cy="69" r="6" fill="#f7d889" stroke="#c7a76a" stroke-width="1.2"/>
    </g>

    <!-- Tree and flower clusters -->
    <g opacity=".95">
      <g transform="translate(63 228)"><circle cx="0" cy="14" r="21" fill="#7ea875"/><circle cx="16" cy="2" r="18" fill="#90b880"/><circle cx="34" cy="15" r="16" fill="#79a36b"/><path d="M17 32v21" stroke="#775b45" stroke-width="5"/></g>
      <g transform="translate(905 125)"><circle cx="0" cy="16" r="25" fill="#7ea875"/><circle cx="22" cy="2" r="20" fill="#94bc83"/><circle cx="42" cy="19" r="18" fill="#78a46c"/><path d="M21 37v27" stroke="#775b45" stroke-width="5"/></g>
      <g transform="translate(705 90)"><circle cx="0" cy="10" r="17" fill="#8cb37d"/><circle cx="16" cy="0" r="15" fill="#9bc28b"/><path d="M8 25v16" stroke="#775b45" stroke-width="4"/></g>
      <g transform="translate(892 353)"><circle cx="0" cy="13" r="19" fill="#81aa75"/><circle cx="18" cy="3" r="16" fill="#95bb83"/><path d="M9 31v19" stroke="#775b45" stroke-width="4"/></g>
      <g transform="translate(238 585)"><circle cx="0" cy="14" r="20" fill="#84ad77"/><circle cx="18" cy="2" r="16" fill="#9bc28b"/><path d="M8 33v20" stroke="#775b45" stroke-width="4"/></g>
      <g transform="translate(526 566)"><circle cx="0" cy="10" r="16" fill="#8eb47f"/><circle cx="16" cy="0" r="14" fill="#9cc28b"/><path d="M7 24v17" stroke="#775b45" stroke-width="4"/></g>
    </g>
    <g fill="#f7a9b6" opacity=".9">
      <circle cx="268" cy="247" r="3"/><circle cx="276" cy="253" r="2"/><circle cx="255" cy="251" r="2"/><circle cx="747" cy="416" r="3"/><circle cx="757" cy="423" r="2"/><circle cx="741" cy="431" r="2"/>
      <circle cx="471" cy="231" r="2.5"/><circle cx="480" cy="238" r="2"/><circle cx="463" cy="239" r="2"/><circle cx="222" cy="330" r="2.5"/><circle cx="231" cy="335" r="2"/>
    </g>
    <g fill="#ffe385">
      <circle cx="704" cy="310" r="2.2"/><circle cx="714" cy="316" r="1.8"/><circle cx="693" cy="317" r="1.8"/><circle cx="459" cy="529" r="2.2"/><circle cx="468" cy="535" r="1.8"/>
    </g>

    <!-- Map labels -->
    <g font-family="Trebuchet MS, sans-serif" fill="#846b53" opacity=".7">
      <text x="135" y="388" font-size="11" font-weight="800" letter-spacing="3">PETAL LANE</text>
      <text x="408" y="332" font-size="10" font-weight="800" letter-spacing="2.5" transform="rotate(32 408 332)">CLOVER CREEK</text>
      <text x="703" y="189" font-size="10" font-weight="800" letter-spacing="2.5" transform="rotate(12 703 189)">STAR BOULEVARD</text>
      <text x="661" y="584" font-size="10" font-weight="800" letter-spacing="2.5">PEARL SHORE</text>
    </g>
    <g transform="translate(478 382)" opacity=".85">
      <path d="M-18 0h36" stroke="#9e8a69" stroke-width="1.2"/>
      <path d="M0-18v36" stroke="#9e8a69" stroke-width="1.2"/>
      <path d="M0-22 6-8 0 0-6-8Z" fill="#d06b70" stroke="#8f4c50" stroke-width="1"/>
      <text x="8" y="26" font-family="Trebuchet MS, sans-serif" font-size="8" fill="#8f7864" letter-spacing="1.5" font-weight="800">N</text>
    </g>
  </svg>`;
}
