/* Yacht Service Ltd — the drawings.
   Every boat in the yard gets a real profile, not a stock photo. */

const Art = (function () {
  let uid = 0;
  const nid = p => p + (++uid);

  /* ---------- color ---------- */
  const hex = h => { h = h.replace('#',''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; };
  const str = c => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,'0')).join('');
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return str([0,1,2].map(i => A[i] + (B[i]-A[i]) * t)); };
  const lum = c => { const C = hex(c); return (0.299*C[0] + 0.587*C[1] + 0.114*C[2]) / 255; };

  const DARK = '#0B1210', GLASS = '#0E1815', WRAP = '#F7F4EE';

  function pal(boat, mono) {
    if (mono) {
      const m = 'currentColor';
      return { hull:m, deck:m, house:m, roof:m, dark:m, glass:'none', stripe:m, trim:m, boot:m, letter:'none', mono:true };
    }
    const t = boat.tint, light = lum(t) > 0.45;
    return {
      hull: t,
      deck: mix(t, DARK, light ? 0.18 : 0.12),
      house: mix(t, light ? '#ffffff' : '#E6DDCC', 0.10),
      roof: mix(t, DARK, light ? 0.30 : 0.22),
      dark: DARK,
      glass: GLASS,
      stripe: boat.stripe || '#C4A46A',
      trim: mix(t, DARK, 0.55),
      boot: mix(t, DARK, light ? 0.62 : 0.40),
      letter: light ? mix(t, DARK, 0.68) : mix(t, '#F7F4EE', 0.72),
      mono: false
    };
  }

  /* ---------- hulls ----------
     Local space: bow at x=0, stern at x=300, waterline y=0, up is negative. */

  const HULLS = {

    walkaround: {
      draft: 20, ridge: -84, bowIn: 12, sternIn: 292,
      above(c, b) { return `
        <path d="M6,-42 C 74,-35 176,-29 292,-27 L 296,-1 L 16,-1 C 9,-15 3,-30 6,-42 Z" fill="${c.hull}"/>
        <path d="M16,-1 L 296,-1 L 296,-7 C 190,-9 84,-11 13,-9 Z" fill="${c.boot}" opacity="${c.mono?0:1}"/>
        <path d="M6,-42 C 74,-35 176,-29 292,-27" fill="none" stroke="${c.trim}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
        <path d="M9,-36 C 76,-30 176,-24 292,-22" fill="none" stroke="${c.stripe}" stroke-width="1.6" opacity=".85" vector-effect="non-scaling-stroke"/>
        <path d="M50,-36 L 64,-58 L 146,-58 L 146,-31 Z" fill="${c.house}"/>
        <path d="M148,-58 L 164,-74 L 224,-74 L 224,-33 L 148,-33 Z" fill="${c.house}"/>
        <path d="M150,-56 L 165,-72 L 200,-72 L 200,-56 Z" fill="${c.glass}"/>
        <path d="M204,-72 L 221,-72 L 221,-56 L 204,-56 Z" fill="${c.glass}"/>
        <path d="M72,-54 L 100,-54 L 100,-44 L 72,-44 Z" fill="${c.glass}"/>
        <path d="M106,-54 L 132,-54 L 132,-44 L 106,-44 Z" fill="${c.glass}"/>
        <rect x="150" y="-84" width="88" height="6" rx="3" fill="${c.roof}"/>
        <rect x="154" y="-78" width="4" height="10" fill="${c.roof}"/>
        <rect x="230" y="-78" width="4" height="45" fill="${c.roof}"/>
        <path d="M236,-84 L 236,-112" stroke="${c.trim}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
        <path d="M10,-48 C 40,-44 60,-42 74,-41" fill="none" stroke="${c.trim}" stroke-width="1.6" opacity=".7" vector-effect="non-scaling-stroke"/>
        <path d="M10,-48 L 10,-42 M40,-45 L 40,-38 M74,-41 L 74,-35" stroke="${c.trim}" stroke-width="1.2" opacity=".6" vector-effect="non-scaling-stroke"/>
        <path d="M296,-24 L 320,-24 L 322,-8 L 314,-8 L 312,4 L 302,4 L 300,-8 L 296,-8 Z" fill="${c.roof}"/>
        <path d="M300,-22 L 316,-22 L 316,-12 L 300,-12 Z" fill="${c.dark}" opacity="${c.mono?0:.5}"/>`;
      },
      below() { return `<path d="M16,-1 L 296,-1 L 290,16 C 200,22 90,20 34,12 Z" fill="var(--underbody)"/>`; }
    },

    express: {
      draft: 24, ridge: -86, bowIn: 12, sternIn: 296,
      above(c, b) { return `
        <path d="M5,-44 C 78,-36 180,-29 296,-26 L 300,-1 L 15,-1 C 8,-16 2,-32 5,-44 Z" fill="${c.hull}"/>
        <path d="M15,-1 L 300,-1 L 300,-7 C 192,-9 86,-11 12,-9 Z" fill="${c.boot}" opacity="${c.mono?0:1}"/>
        <path d="M5,-44 C 78,-36 180,-29 296,-26" fill="none" stroke="${c.trim}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
        <path d="M9,-37 C 80,-30 180,-23 296,-21" fill="none" stroke="${c.stripe}" stroke-width="1.8" opacity=".9" vector-effect="non-scaling-stroke"/>
        <path d="M96,-38 L 120,-64 L 208,-64 L 208,-32 L 96,-32 Z" fill="${c.house}"/>
        <path d="M104,-40 L 123,-62 L 158,-62 L 158,-40 Z" fill="${c.glass}"/>
        <path d="M163,-62 L 205,-62 L 205,-40 L 163,-40 Z" fill="${c.glass}"/>
        <rect x="116" y="-86" width="104" height="6" rx="3" fill="${c.roof}"/>
        <rect x="120" y="-80" width="4" height="17" fill="${c.roof}"/>
        <rect x="212" y="-80" width="4" height="48" fill="${c.roof}"/>
        <path d="M222,-86 L 224,-116" stroke="${c.trim}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
        ${b && b.riggers ? `<path d="M132,-84 L 96,-152 M204,-84 L 236,-152" stroke="${c.trim}" stroke-width="1.6" opacity=".85" vector-effect="non-scaling-stroke"/>` : ''}
        <path d="M8,-50 C 44,-45 74,-42 96,-40" fill="none" stroke="${c.trim}" stroke-width="1.6" opacity=".7" vector-effect="non-scaling-stroke"/>
        <path d="M8,-50 L 8,-43 M48,-45 L 48,-38 M96,-40 L 96,-34" stroke="${c.trim}" stroke-width="1.2" opacity=".6" vector-effect="non-scaling-stroke"/>
        <path d="M300,-12 L 322,-12 L 322,-6 L 300,-6 Z" fill="${c.roof}"/>`;
      },
      below() { return `<path d="M15,-1 L 300,-1 L 292,18 C 200,25 88,22 32,12 Z" fill="var(--underbody)"/>
        <path d="M196,17 L 214,30 L 222,26 L 206,15 Z" fill="var(--underbody)"/>
        <path d="M236,4 L 240,22 L 246,22 L 244,4 Z" fill="var(--underbody)"/>`; }
    },

    flybridge: {
      draft: 26, ridge: -104, bowIn: 12, sternIn: 296,
      above(c, b) {
        const tall = b && b.bulk === 'tall';
        const hy = tall ? -70 : -54, by = tall ? -106 : -86;
        return `
        <path d="M5,-46 C 76,-38 178,-30 296,-27 L 300,-1 L 15,-1 C 8,-17 2,-33 5,-46 Z" fill="${c.hull}"/>
        <path d="M15,-1 L 300,-1 L 300,-7 C 192,-10 86,-12 12,-9 Z" fill="${c.boot}" opacity="${c.mono?0:1}"/>
        <path d="M5,-46 C 76,-38 178,-30 296,-27" fill="none" stroke="${c.trim}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
        <path d="M9,-39 C 78,-32 178,-24 296,-22" fill="none" stroke="${c.stripe}" stroke-width="1.8" opacity=".9" vector-effect="non-scaling-stroke"/>
        <path d="M78,-38 L 96,${hy} L 214,${hy} L 214,-32 L 78,-32 Z" fill="${c.house}"/>
        <path d="M86,-40 L 99,${hy+3} L 130,${hy+3} L 130,-40 Z" fill="${c.glass}"/>
        <path d="M136,${hy+3} L 172,${hy+3} L 172,-42 L 136,-42 Z" fill="${c.glass}"/>
        <path d="M178,${hy+3} L 210,${hy+3} L 210,-42 L 178,-42 Z" fill="${c.glass}"/>
        <path d="M112,${hy} L 128,${by} L 216,${by} L 216,${hy} Z" fill="${c.roof}"/>
        <path d="M120,${hy-4} L 131,${by+4} L 168,${by+4} L 168,${hy-4} Z" fill="${c.glass}" opacity=".9"/>
        <path d="M176,${by+6} L 176,${hy-6} M212,${by+6} L 212,${hy-6}" stroke="${c.roof}" stroke-width="3"/>
        <path d="M176,${by+10} H212 M176,${hy-10} H212" stroke="${c.roof}" stroke-width="2.4" opacity=".8"/>
        <rect x="124" y="${by-24}" width="98" height="5" rx="2.5" fill="${c.roof}"/>
        <rect x="128" y="${by-19}" width="3.6" height="${by-4-(by-19)}" fill="${c.roof}"/>
        <rect x="218" y="${by-19}" width="3.6" height="${-32-(by-19)}" fill="${c.roof}"/>
        <path d="M228,${by-24} L 230,${by-56}" stroke="${c.trim}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
        <ellipse cx="196" cy="${by-30}" rx="17" ry="4" fill="${c.trim}" opacity=".85"/>
        <path d="M196,${by-30} L 196,${by-24}" stroke="${c.trim}" stroke-width="2" vector-effect="non-scaling-stroke"/>
        <path d="M8,-52 C 40,-47 62,-44 78,-42" fill="none" stroke="${c.trim}" stroke-width="1.6" opacity=".7" vector-effect="non-scaling-stroke"/>
        <path d="M8,-52 L 8,-45 M44,-46 L 44,-39 M78,-42 L 78,-36" stroke="${c.trim}" stroke-width="1.2" opacity=".6" vector-effect="non-scaling-stroke"/>
        <path d="M300,-14 L 324,-14 L 324,-6 L 300,-6 Z" fill="${c.roof}"/>`;
      },
      below() { return `<path d="M15,-1 L 300,-1 L 292,20 C 198,28 86,24 30,13 Z" fill="var(--underbody)"/>
        <path d="M190,19 L 210,33 L 218,29 L 200,17 Z" fill="var(--underbody)"/>
        <path d="M234,4 L 238,24 L 245,24 L 242,4 Z" fill="var(--underbody)"/>`; }
    },

    centerconsole: {
      draft: 17, ridge: -76, bowIn: 14, sternIn: 290,
      above(c) { return `
        <path d="M8,-40 C 76,-33 178,-27 288,-24 L 292,-1 L 18,-1 C 11,-14 5,-28 8,-40 Z" fill="${c.hull}"/>
        <path d="M18,-1 L 292,-1 L 292,-7 C 188,-9 84,-11 15,-9 Z" fill="${c.boot}" opacity="${c.mono?0:1}"/>
        <path d="M8,-40 C 76,-33 178,-27 288,-24" fill="none" stroke="${c.trim}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
        <path d="M12,-34 C 78,-28 178,-22 288,-19" fill="none" stroke="${c.stripe}" stroke-width="1.6" opacity=".85" vector-effect="non-scaling-stroke"/>
        <path d="M132,-30 L 140,-56 L 178,-56 L 182,-30 Z" fill="${c.house}"/>
        <path d="M142,-52 L 176,-52 L 176,-42 L 142,-42 Z" fill="${c.glass}"/>
        <path d="M186,-30 L 186,-48 L 214,-48 L 214,-30 Z" fill="${c.roof}"/>
        <rect x="128" y="-76" width="94" height="5" rx="2.5" fill="${c.roof}"/>
        <rect x="132" y="-71" width="3.4" height="16" fill="${c.roof}"/>
        <rect x="216" y="-71" width="3.4" height="24" fill="${c.roof}"/>
        <path d="M226,-76 L 228,-104" stroke="${c.trim}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
        <path d="M12,-46 C 46,-41 76,-38 98,-36" fill="none" stroke="${c.trim}" stroke-width="1.6" opacity=".7" vector-effect="non-scaling-stroke"/>
        <path d="M12,-46 L 12,-40 M50,-41 L 50,-35 M98,-36 L 98,-31" stroke="${c.trim}" stroke-width="1.2" opacity=".6" vector-effect="non-scaling-stroke"/>
        <path d="M292,-22 L 314,-22 L 316,-8 L 308,-8 L 306,4 L 297,4 L 295,-8 L 292,-8 Z" fill="${c.roof}"/>
        <path d="M295,-20 L 311,-20 L 311,-11 L 295,-11 Z" fill="${c.dark}" opacity="${c.mono?0:.5}"/>`;
      },
      below() { return `<path d="M18,-1 L 292,-1 L 286,15 C 198,21 90,19 36,11 Z" fill="var(--underbody)"/>`; }
    },

    whaler: {
      draft: 12, ridge: -62, bowIn: 16, sternIn: 286,
      above(c) { return `
        <path d="M12,-34 C 82,-30 182,-27 284,-26 L 288,-1 L 22,-1 C 15,-12 9,-24 12,-34 Z" fill="${c.hull}"/>
        <path d="M22,-1 L 288,-1 L 288,-8 C 186,-10 84,-11 19,-10 Z" fill="${c.boot}" opacity="${c.mono?0:1}"/>
        <path d="M12,-34 C 82,-30 182,-27 284,-26" fill="none" stroke="${c.trim}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
        <path d="M16,-27 C 84,-24 182,-21 284,-20" fill="none" stroke="${c.stripe}" stroke-width="1.6" opacity=".8" vector-effect="non-scaling-stroke"/>
        <path d="M138,-30 L 144,-54 L 178,-54 L 182,-30 Z" fill="${c.house}"/>
        <path d="M146,-50 L 176,-50 L 176,-41 L 146,-41 Z" fill="${c.glass}"/>
        <path d="M126,-62 L 200,-62" stroke="${c.roof}" stroke-width="5" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        <path d="M128,-60 L 132,-52 M198,-60 L 194,-52" stroke="${c.roof}" stroke-width="3" vector-effect="non-scaling-stroke"/>
        <path d="M18,-40 C 52,-36 84,-33 106,-32" fill="none" stroke="${c.trim}" stroke-width="1.6" opacity=".7" vector-effect="non-scaling-stroke"/>
        <path d="M18,-40 L 18,-33 M56,-36 L 56,-30 M106,-32 L 106,-28" stroke="${c.trim}" stroke-width="1.2" opacity=".6" vector-effect="non-scaling-stroke"/>
        <path d="M288,-24 L 308,-24 L 310,-10 L 303,-10 L 301,2 L 293,2 L 291,-10 L 288,-10 Z" fill="${c.roof}"/>
        <path d="M291,-22 L 305,-22 L 305,-13 L 291,-13 Z" fill="${c.dark}" opacity="${c.mono?0:.5}"/>`;
      },
      below() { return `<path d="M22,-1 L 288,-1 L 284,10 C 198,14 96,13 40,8 Z" fill="var(--underbody)"/>`; }
    },

    pilothouse: {
      draft: 19, ridge: -92, bowIn: 12, sternIn: 290,
      above(c) { return `
        <path d="M7,-42 C 76,-34 178,-28 288,-25 L 292,-1 L 17,-1 C 10,-15 4,-30 7,-42 Z" fill="${c.hull}"/>
        <path d="M17,-1 L 292,-1 L 292,-7 C 188,-9 84,-11 14,-9 Z" fill="${c.boot}" opacity="${c.mono?0:1}"/>
        <path d="M7,-42 C 76,-34 178,-28 288,-25" fill="none" stroke="${c.trim}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
        <path d="M11,-35 C 78,-28 178,-22 288,-20" fill="none" stroke="${c.stripe}" stroke-width="1.6" opacity=".85" vector-effect="non-scaling-stroke"/>
        <path d="M64,-36 L 78,-58 L 108,-58 L 108,-32 L 64,-32 Z" fill="${c.house}"/>
        <path d="M108,-84 L 122,-88 L 196,-88 L 196,-32 L 108,-32 Z" fill="${c.house}"/>
        <path d="M118,-82 L 152,-82 L 152,-56 L 116,-56 Z" fill="${c.glass}"/>
        <path d="M158,-82 L 192,-82 L 192,-56 L 158,-56 Z" fill="${c.glass}"/>
        <path d="M82,-54 L 106,-54 L 106,-42 L 82,-42 Z" fill="${c.glass}"/>
        <rect x="112" y="-93" width="90" height="6" rx="2" fill="${c.roof}"/>
        <path d="M206,-93 L 208,-124" stroke="${c.trim}" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
        <ellipse cx="150" cy="-99" rx="14" ry="4" fill="${c.trim}" opacity=".8"/>
        <path d="M150,-99 L 150,-93" stroke="${c.trim}" stroke-width="2" vector-effect="non-scaling-stroke"/>
        <path d="M10,-48 C 40,-44 58,-42 66,-41" fill="none" stroke="${c.trim}" stroke-width="1.6" opacity=".7" vector-effect="non-scaling-stroke"/>
        <path d="M10,-48 L 10,-42 M40,-44 L 40,-38" stroke="${c.trim}" stroke-width="1.2" opacity=".6" vector-effect="non-scaling-stroke"/>
        <path d="M292,-22 L 316,-22 L 318,-8 L 310,-8 L 308,4 L 299,4 L 297,-8 L 292,-8 Z" fill="${c.roof}"/>
        <path d="M297,-20 L 313,-20 L 313,-11 L 297,-11 Z" fill="${c.dark}" opacity="${c.mono?0:.5}"/>`;
      },
      below() { return `<path d="M17,-1 L 292,-1 L 286,16 C 198,22 90,20 34,11 Z" fill="var(--underbody)"/>`; }
    },

    sloop: {
      draft: 60, ridge: -74, bowIn: 14, sternIn: 286, sail: true,
      above(c, b, o) {
        const rig = (o && o.unstepped) ? `
        <path d="M96,-46 L 236,-52" stroke="${c.trim}" stroke-width="4" stroke-linecap="round" opacity=".9" vector-effect="non-scaling-stroke"/>
        <path d="M104,-42 L 232,-47" stroke="${c.trim}" stroke-width="2.4" stroke-linecap="round" opacity=".7" vector-effect="non-scaling-stroke"/>` : `
        <path d="M148,-40 L 141,-236" stroke="${c.trim}" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        <path d="M150,-46 L 232,-38" stroke="${c.trim}" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
        <path d="M143,-224 L 14,-38" stroke="${c.trim}" stroke-width="1.4" opacity=".8" vector-effect="non-scaling-stroke"/>
        <path d="M142,-228 L 284,-28" stroke="${c.trim}" stroke-width="1.4" opacity=".8" vector-effect="non-scaling-stroke"/>
        <path d="M144,-190 L 96,-40 M144,-190 L 200,-42" stroke="${c.trim}" stroke-width="1.1" opacity=".55" vector-effect="non-scaling-stroke"/>
        <path d="M152,-48 L 228,-42 L 228,-36 L 152,-40 Z" fill="${c.roof}" opacity=".9"/>`;
        return `
        <path d="M10,-38 C 78,-32 180,-27 282,-30 L 286,-1 L 20,-1 C 13,-14 7,-27 10,-38 Z" fill="${c.hull}"/>
        <path d="M20,-1 L 286,-1 L 286,-8 C 186,-10 84,-11 17,-9 Z" fill="${c.boot}" opacity="${c.mono?0:1}"/>
        <path d="M10,-38 C 78,-32 180,-27 282,-30" fill="none" stroke="${c.trim}" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
        <path d="M14,-30 C 80,-25 180,-20 282,-23" fill="none" stroke="${c.stripe}" stroke-width="1.4" opacity=".8" vector-effect="non-scaling-stroke"/>
        <path d="M92,-30 C 100,-50 200,-52 214,-32 Z" fill="${c.house}"/>
        <path d="M108,-38 L 138,-40 L 138,-33 L 108,-32 Z" fill="${c.glass}"/>
        <path d="M148,-40 L 178,-41 L 178,-34 L 148,-33 Z" fill="${c.glass}"/>
        <path d="M240,-30 L 262,-31 L 262,-24 L 240,-24 Z" fill="${c.roof}" opacity=".8"/>
        ${rig}
        <path d="M14,-44 C 60,-38 130,-34 200,-33 C 240,-33 264,-34 280,-36" fill="none" stroke="${c.trim}" stroke-width="1.4" opacity=".65" vector-effect="non-scaling-stroke"/>
        <path d="M14,-44 L 14,-37 M78,-37 L 78,-31 M200,-33 L 200,-28 M280,-36 L 280,-30" stroke="${c.trim}" stroke-width="1.1" opacity=".5" vector-effect="non-scaling-stroke"/>`;
      },
      below() { return `<path d="M20,-1 L 286,-1 L 280,14 C 240,18 220,18 214,20 L 206,58 L 150,60 L 140,20 C 100,17 50,10 30,6 Z" fill="var(--underbody)"/>
        <path d="M226,10 L 232,34 L 240,34 L 234,10 Z" fill="var(--underbody)"/>`; }
    }
  };

  /* ---------- scene ---------- */

  function water(id, tone) {
    return `
      <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#080D0B"/><stop offset=".46" stop-color="#131F1B"/>
        <stop offset=".84" stop-color="#2B3C34"/><stop offset="1" stop-color="#42564A"/>
      </linearGradient>
      <linearGradient id="${id}wtr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3B4F45"/><stop offset=".14" stop-color="#22302A"/>
        <stop offset=".55" stop-color="#131E1A"/><stop offset="1" stop-color="#080E0C"/>
      </linearGradient>
      <radialGradient id="${id}glow" cx=".62" cy=".72" r=".55">
        <stop offset="0" stop-color="${tone}" stop-opacity=".2"/><stop offset="1" stop-color="${tone}" stop-opacity="0"/>
      </radialGradient>`;
  }

  function ground(id, tone) {
    return `
      <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#070C0A"/><stop offset=".5" stop-color="#131E1A"/>
        <stop offset=".88" stop-color="#2A3931"/><stop offset="1" stop-color="#3B4B40"/>
      </linearGradient>
      <linearGradient id="${id}wtr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3A3B2E"/><stop offset=".4" stop-color="#22241B"/><stop offset="1" stop-color="#101208"/>
      </linearGradient>
      <radialGradient id="${id}glow" cx=".58" cy=".62" r=".5">
        <stop offset="0" stop-color="${tone}" stop-opacity=".16"/><stop offset="1" stop-color="${tone}" stop-opacity="0"/>
      </radialGradient>`;
  }

  const RIPPLES = [
    [0,155,118,.30],[152,159,196,.24],[24,166,158,.26],[198,172,146,.20],
    [0,180,124,.17],[130,187,214,.15],[44,196,132,.13],[236,202,110,.11],[0,206,96,.09]
  ];

  function shore() {
    return `<g>
      <path d="M0,140 L 30,140 L 36,133 L 74,133 L 80,140 L 134,140 L 141,130 L 167,130 L 172,140 L 244,140 L 251,135 L 285,135 L 290,140 L 360,140 L 360,151 L 0,151 Z" fill="#060A09" opacity=".85"/>
      <path d="M298,140 L 298,112 M311,140 L 311,120 M324,140 L 324,106 M337,141 L 337,118" stroke="#060A09" stroke-width="3.4" opacity=".9"/>
      <path d="M18,140 L 18,120 M31,140 L 31,127" stroke="#060A09" stroke-width="3.4" opacity=".9"/>
      <circle cx="324" cy="103" r="2.8" fill="#C4A46A"/>
      <circle cx="324" cy="103" r="9" fill="#C4A46A" opacity=".16"/>
      <circle cx="18" cy="117" r="2.2" fill="#C4A46A" opacity=".8"/>
      <path d="M296,151 L 300,196 M322,151 L 328,196" stroke="#C4A46A" stroke-width="1.6" opacity=".14"/>
    </g>`;
  }

  function lotBack() {
    return `<g>
      <path d="M0,150 H360" stroke="#080D0B" stroke-width="2" opacity=".7"/>
      <g opacity=".5" fill="#BEB8A8">
        <path d="M18,150 L 40,124 L 88,124 L 110,150 Z"/>
        <path d="M120,150 L 139,128 L 179,128 L 198,150 Z"/>
        <path d="M262,150 L 279,130 L 315,130 L 332,150 Z"/>
        <path d="M340,150 L 351,133 L 360,133 L 360,150 Z"/>
      </g>
      <g opacity=".55" stroke="#070C0A" stroke-width="2.6" fill="none">
        <path d="M226,150 L 226,88 M244,96 L 208,96"/>
      </g>
      <circle cx="226" cy="91" r="6" fill="#C4A46A" opacity=".55"/>
      <circle cx="226" cy="93" r="40" fill="#C4A46A" opacity=".09"/>
      <g opacity=".35" stroke="#070C0A" stroke-width="1.6">
        <path d="M0,143 H360 M0,136 H360"/>
      </g>
    </g>`;
  }

  function stands(w, groundY, apexY) {
    const p = [];
    [0.22, 0.70].forEach(f => {
      const x = w * f, spread = (groundY - apexY) * 0.42 + 6;
      p.push(`<path d="M${x-spread},${groundY} L ${x},${apexY} L ${x+spread},${groundY} Z" fill="none" stroke="#080D0B" stroke-width="3.4" stroke-linejoin="round"/>`);
      p.push(`<path d="M${x-spread*0.52},${(apexY+groundY)/2} L ${x+spread*0.52},${(apexY+groundY)/2}" stroke="#080D0B" stroke-width="2.6"/>`);
      p.push(`<rect x="${x-7}" y="${apexY-4}" width="14" height="5" rx="1.5" fill="#080D0B"/>`);
    });
    const cx = w * 0.46;
    for (let i = 0; i < 3; i++) {
      p.push(`<rect x="${cx-20}" y="${groundY-7-i*6.5}" width="40" height="6" rx="1" fill="#080D0B" opacity="${(0.95 - i*0.1).toFixed(2)}"/>`);
    }
    return p.join('');
  }

  function wrapTent(hull, c, w) {
    const ridge = hull.ridge, a = hull.bowIn, z = hull.sternIn;
    const ry = ridge - 6;
    const d = `M${a},-30 C ${a+30},${ry+16} ${a+52},${ry} ${w*0.30},${ry} L ${w*0.84},${ry+8} C ${z-14},${ry+16} ${z-4},-34 ${z+2},-26 Z`;
    const seams = [];
    for (let x = a + 26; x < z - 8; x += 30) {
      seams.push(`<path d="M${x},${ry+3} L ${x + 3},-27" stroke="#8A8476" stroke-width="1" opacity=".28" vector-effect="non-scaling-stroke"/>`);
    }
    return `
      <path d="${d}" fill="url(#${c.wid}wrap)"/>
      <path d="${d}" fill="none" stroke="#B9B3A4" stroke-width="1.2" opacity=".5" vector-effect="non-scaling-stroke"/>
      ${seams.join('')}
      <path d="M${a+30},${ry+13} C ${w*0.4},${ry-1} ${w*0.6},${ry+2} ${z-12},${ry+13}" fill="none" stroke="#ffffff" stroke-width="2" opacity=".55" vector-effect="non-scaling-stroke"/>
      <path d="M${a+18},-46 C ${w*0.4},-58 ${w*0.62},-56 ${z-8},-42" fill="none" stroke="#8A8476" stroke-width="1.6" opacity=".35" vector-effect="non-scaling-stroke"/>
      <rect x="${z-72}" y="${ry+22}" width="26" height="34" rx="3" fill="none" stroke="#8A8476" stroke-width="1.2" opacity=".45" vector-effect="non-scaling-stroke"/>
      <path d="M${z-59},${ry+22} L ${z-59},${ry+56}" stroke="#8A8476" stroke-width="1.2" opacity=".45" vector-effect="non-scaling-stroke"/>
      <circle cx="${w*0.55}" cy="${ry+4}" r="5" fill="none" stroke="#8A8476" stroke-width="1.4" opacity=".5" vector-effect="non-scaling-stroke"/>
      <circle cx="${w*0.36}" cy="${ry+3}" r="5" fill="none" stroke="#8A8476" stroke-width="1.4" opacity=".5" vector-effect="non-scaling-stroke"/>`;
  }

  /* variant: afloat | hauled | wrapped */
  const GROUND = 178, WATERLINE = 150;

  function scene(boat, opts) {
    opts = opts || {};
    const variant = opts.variant || 'afloat';
    const onLand = variant !== 'afloat';
    const id = nid('a');
    const hull = HULLS[boat.hull] || HULLS.walkaround;
    const c = pal(boat, false);
    c.wid = id;
    const w = Math.round(108 + boat.len * 6.2);
    const s = w / 300;
    const tx = Math.round((360 - w) / 2);
    const baseY = onLand ? Math.round(GROUND - 17 - (hull.draft || 20) * s) : WATERLINE;
    const letter = boat.name.toUpperCase();

    const hullBody = hull.above(c, boat, opts) + (onLand ? hull.below(c, boat) : '');
    const nameY = boat.hull === 'whaler' ? -14 : -12;
    const nameEl = `<text x="${(hull.sternIn || 290) - 34}" y="${nameY}" text-anchor="end" font-family="'IBM Plex Mono',ui-monospace,monospace" font-size="11" letter-spacing="1.7" fill="${c.letter}" opacity=".9">${letter}</text>`;

    const boatGroup = `<g transform="translate(${tx},${baseY}) scale(${s.toFixed(4)})" style="--underbody:${c.boot}">
        ${hullBody}
        ${variant === 'wrapped' ? wrapTent(hull, c, 300) : nameEl}
      </g>`;

    const reflection = onLand ? '' : `
      <g opacity=".18" transform="translate(${tx},${baseY}) scale(${s.toFixed(4)},${(-s * 0.46).toFixed(4)})" style="--underbody:${c.boot}">
        ${hull.above(c, boat, opts)}
      </g>`;

    const standGroup = onLand
      ? `<g transform="translate(${tx},0)">${stands(w, GROUND, baseY - 8 * s)}</g>`
      : '';

    const gravel = Array.from({ length: 30 }, (_, i) =>
      `<ellipse cx="${(i * 47 + 11) % 360}" cy="${GROUND + 3 + (i * 17) % 28}" rx="${2 + (i % 3)}" ry="1.5"/>`).join('');

    return `<svg class="scene" viewBox="0 0 360 212" role="img" aria-label="${boat.name}, ${boat.make}" preserveAspectRatio="xMidYMid slice">
      <defs>
        ${onLand ? ground(id, boat.tint) : water(id, boat.tint)}
        <linearGradient id="${id}wrap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FCFAF5"/><stop offset="1" stop-color="#CFC9BB"/>
        </linearGradient>
        <linearGradient id="${id}vig" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset=".45" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".32"/>
        </linearGradient>
        <clipPath id="${id}clip"><rect x="0" y="0" width="360" height="212"/></clipPath>
      </defs>
      <g clip-path="url(#${id}clip)">
        <rect width="360" height="${onLand ? GROUND : WATERLINE}" fill="url(#${id}sky)"/>
        <rect y="${onLand ? GROUND : WATERLINE}" width="360" height="${212 - (onLand ? GROUND : WATERLINE)}" fill="url(#${id}wtr)"/>
        <rect width="360" height="212" fill="url(#${id}glow)"/>
        ${onLand ? lotBack() : shore()}
        ${reflection}
        ${standGroup}
        ${boatGroup}
        ${onLand
          ? `<path d="M0,${GROUND} H360" stroke="#080D0B" stroke-width="1.6" opacity=".75"/><g opacity=".45" fill="#080D0B">${gravel}</g>`
          : RIPPLES.map(r => `<path d="M${r[0]},${r[1]} h${r[2]}" stroke="#DCE6E0" stroke-width="1.4" opacity="${r[3]}" stroke-linecap="round"/>`).join('')}
        <rect width="360" height="212" fill="url(#${id}vig)"/>
      </g>
    </svg>`;
  }

  /* small one-tone silhouette for list rows */
  function glyph(boat) {
    const hull = HULLS[boat.hull] || HULLS.walkaround;
    const c = pal(boat, true);
    const w = 108 + boat.len * 6.2;
    const s = hull.sail ? 40 / 268 : 32 / 132;
    const tx = (72 - w * s) / 2;
    return `<svg class="glyph" viewBox="0 0 72 42" aria-hidden="true">
      <g transform="translate(${tx.toFixed(1)},38) scale(${s.toFixed(4)})">${hull.above(c, boat, {})}</g>
    </svg>`;
  }

  /* the cleat hitch that draws itself when a week is held */
  const HITCH = {
    base: 'M2,148 C 44,134 68,120 84,112 C 96,106 108,104 122,106 C 136,108 148,113 158,120',
    over: 'M158,120 C 167,111 175,100 177,88 C 179,77 170,72 159,77 L 65,102 C 55,105 49,99 53,91',
    back: 'M53,91 C 49,83 54,75 64,77 L 161,101 C 171,103 175,95 170,88',
    lock: 'M170,88 C 163,79 150,78 143,85 C 137,91 141,101 150,101 C 157,101 161,97 161,92 C 160,107 151,121 140,132'
  };

  function cleat() {
    const ropeGroup = keys => `
      <g fill="none" stroke="var(--brass)" stroke-width="7.5" stroke-linecap="round">
        ${keys.map(k => `<path class="rope r${Object.keys(HITCH).indexOf(k)+1}" d="${HITCH[k]}"/>`).join('')}
      </g>
      <g fill="none" stroke="#8A6E38" stroke-width="1.6" stroke-linecap="round" opacity=".38" stroke-dasharray="3.5 8">
        ${keys.map(k => `<path class="rope r${Object.keys(HITCH).indexOf(k)+1}" d="${HITCH[k]}"/>`).join('')}
      </g>`;
    return `<svg class="cleat" viewBox="0 0 220 152" role="img" aria-label="A line made fast to a dock cleat">
      <g class="cleat-deck" stroke="currentColor" fill="none">
        <path d="M4,122 H216" stroke-width="1.3" opacity=".14"/>
        <path d="M4,136 H216" stroke-width="1.3" opacity=".09"/>
      </g>
      <ellipse cx="110" cy="108" rx="54" ry="7" fill="currentColor" opacity=".07"/>
      ${ropeGroup(['base'])}
      <g class="cleat-body" fill="none" stroke="currentColor" stroke-linecap="round">
        <path d="M78,94 C 62,92 50,83 41,68" stroke-width="14"/>
        <path d="M142,94 C 158,92 170,83 179,68" stroke-width="14"/>
        <path d="M41,68 C 38,62 40,57 45,56" stroke-width="11" opacity=".95"/>
        <path d="M179,68 C 182,62 180,57 175,56" stroke-width="11" opacity=".95"/>
        <rect x="72" y="87" width="76" height="18" rx="9" fill="currentColor" stroke="none"/>
        <circle cx="88" cy="96" r="3" fill="#E6DDCC" stroke="none" opacity=".26"/>
        <circle cx="132" cy="96" r="3" fill="#E6DDCC" stroke="none" opacity=".26"/>
      </g>
      ${ropeGroup(['over','back','lock'])}
    </svg>`;
  }

  function mark(size) {
    size = size || 26;
    return `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--brass)"/>
      <path d="M7 21h18l-3 5H10z" fill="#0E1512" opacity=".85"/>
      <path d="M16 5 9 19h14z" fill="#0E1512"/>
    </svg>`;
  }

  return { scene, glyph, cleat, mark, pal, mix };
})();
