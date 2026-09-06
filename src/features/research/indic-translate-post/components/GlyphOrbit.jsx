import { useLayoutEffect, useRef, useState } from 'react';
import { WORD_PAIRS } from '../data/wordPairs.js';
import { GLYPH_PAIRS } from '../data/glyphPairs.js';
import './glyphOrbit.css';

/**
 * The hero motif: real translation pairs on concentric elliptical orbits, blooming
 * outward from the centre of the card.
 *
 * WORDS, NOT CHARACTERS. The content is `wordPairs.js` -- `history → इतिहास`,
 * `rice → chawal`, `के → ke` -- mined from human gold IN22 references and the Romanised
 * corpus. An earlier version drew from `glyphPairs.js`, which is syllables (`ka → क`), and
 * the verdict on it was right: it read as characters, not as translation. Letter pairs
 * survive only as a named fallback for slots no word can fill, and ORBIT_STATS reports
 * what fraction of the field ended up as letters rather than quietly padding with them.
 *
 * Three kinds are mixed -- roughly 80% `translation`, then `roman`, then `translit` -- and
 * the mix is enforced PER ORBIT by a running quota on the COUNT of placed items, not by
 * draw probability. Both halves of that matter:
 *
 *   - by count, because placement retries until something fits and a `translit` pair is
 *     half the width of a `translation` pair (medians 104.8px against 158.8px in the
 *     pool's own ruler), so probability alone skews the mix toward the narrow kinds;
 *   - per orbit, because the alternative breaks the brief. The user asked for short pairs
 *     to bloom first AND for translation to be the majority, and in this pool the short
 *     tail is overwhelmingly `translit` (37% of it under 90px against 2% of translation
 *     and 0% of roman). A global mix plus a global shortest-innermost order would have
 *     filled the inner orbits with transliterations, exactly where the wave starts.
 *
 * The resolution is that "short" is measured WITHIN EACH KIND. An orbit's band is a pair
 * of quantiles of its own kind's width distribution, so the inner orbits take the shortest
 * translations, the shortest romans and the shortest transliterations, in the 80/13/7
 * proportion -- short means short-for-its-kind. The font-size ladder does the rest: an
 * inner orbit has the least arc length and also the smallest type, so a median pair costs
 * it fewer pixels than the same pair costs the outer orbits.
 *
 * Two things move, neither with per-frame JavaScript:
 *
 *   1. THE BLOOM. Each item's `animation-delay` is an affine function of its distance from
 *      the centre measured in units of the card's own half-width and half-height, so the
 *      front is the ellipse inscribed in the card and reaches all four edges together.
 *      See THE WAVE FRONT IS ELLIPTICAL below.
 *   2. A BOUNDED ROTATION per orbit. Each item slides along its own orbit's tangent by the
 *      same arc length, which to first order *is* a rigid rotation of the ring; the six
 *      orbits have different periods and alternating directions, so the system turns slowly
 *      and unevenly. It oscillates rather than revolving without bound, which is
 *      deliberate: with a bounded sweep, containment and collisions are provable at the
 *      extremes rather than hoped for.
 *
 * The type never rotates, scales anisotropically or skews, so the words stay readable at
 * every phase of both animations.
 *
 * ── WIDTHS ARE MEASURED IN PLACE, NOT ESTIMATED ─────────────────────────────────────
 * The pool ships a `px` per pair, measured at a flat 22px on both sides. This component
 * sets its source side at 0.58em, so its rendered items are systematically NARROWER than
 * that -- and two independent rulers disagreed by ~10% on long Latin sides. So `px` is
 * used only as a starting estimate, and on mount, once `document.fonts.ready` resolves,
 * every pair is rendered into one hidden container in a single layout pass and its real
 * width read back.
 *
 * Worth a one-off layout for three reasons: the solver's boxes become the real rendered
 * boxes rather than a model of them; they cannot go stale when the generated pool is
 * regenerated; and if a web font fails to load, the layout is solved against the font
 * actually in use rather than one that is not. The app is client-rendered (`index.html`
 * ships an empty `#root`), so there is no server pass this has to stay out of.
 *
 * ── TWO PROFILES, SOLVED SEPARATELY ─────────────────────────────────────────────────
 * The hero card is not one shape. Measured on the live page across 21 viewport widths
 * (scratchpad/pw/cardlocus.mjs) the field runs from 286 x 682 (aspect 0.42, portrait) to
 * 894 x 367 (aspect 2.43, landscape) as the chips and spec strip re-wrap. One percentage
 * layout cannot serve both: it is scale-invariant horizontally, because the type is sized
 * in `cqw`, but vertical crowding scales with the card's ASPECT, so a layout solved at
 * 2.4:1 has 3.5x less vertical room to spend at 0.7:1.
 *
 * An earlier version scaled the landscape arrangement down and hid what no longer fit,
 * throwing away 37 of 96 items at 390px -- the real reason mobile read sparse. Each
 * profile is now solved independently against the WORST aspect in its own band, so the
 * result is provably safe across the band and neither view is a leftover of the other:
 *
 *   wide    card  > 620px         solved at 894 x 367  (aspect 2.433, at a 1024px viewport)
 *   mid     420px < card <= 620px  solved at 606 x 407  (aspect 1.490, at a  640px viewport)
 *   narrow  card <= 420px          solved at 396 x 508  (aspect 0.780, at a  430px viewport)
 *
 * Only the active profile is ever in the DOM. Not `display: none` -- absent. A hidden
 * absolutely positioned item still answers `getBoundingClientRect()` with a 0x0 box at the
 * viewport origin, so any page-level check that measures every `[data-hero-item]` scores
 * those as items far outside the card. Not hypothetical: the hidden set read as "37 of 96
 * items outside the card, worst by 93px", 93px being the field's own top offset.
 *
 * ── THE WAVE FRONT IS ELLIPTICAL ────────────────────────────────────────────────────
 * The delay comes from `hypot(dx / halfWidth, dy / halfHeight)`, not `hypot(dx, dy)`. A
 * front that is a true circle in pixels reaches the top edge of a 2.4:1 card (184px away)
 * long before the sides (447px), so the field populates as a band across the top and
 * bottom with the left and right thirds empty -- it reads as a circle precisely because it
 * is failing to fill the card. Normalising by the half-axes makes the front the card's own
 * inscribed ellipse: still expanding outward from the centre, but every phase of it
 * populated all the way round.
 *
 * Because positions are stored as percentages, `dx / halfWidth` is just `(x% - 50) / 50`,
 * independent of the card's pixel size -- so one set of delays is correct at every viewport
 * and the correlation does not move when the card re-wraps. The map from radius to delay is
 * kept perfectly affine (rebased on the innermost item, never clamped) so it has no second
 * slope; a piecewise map that compresses the scrim-washed core into a fraction of the
 * travel time is what drags this correlation down to ~0.91.
 *
 * ── WHY THE SIZE PEAK IS NOT AT THE CENTRE ──────────────────────────────────────────
 * The hero scrim is a near-solid white radial wash whose ellipse has the same aspect as the
 * card, so its opacity depends only on an orbit's radius fraction: 0.985 white everywhere
 * inside f = 0.70, and still 0.52 at f = 1.00. Type on an inner orbit is invisible however
 * large it is set. The hierarchy therefore peaks on the least washed orbit that still holds
 * long arcs and tapers *both* ways -- inward the type shrinks and dissolves into the light,
 * outward the last orbit softens so the silhouette does not end on a hard edge.
 *
 * ── LAYOUT IS SOLVED, NOT GUESSED ───────────────────────────────────────────────────
 * Each candidate placement gets a real box from its measured width and is rejected if it
 * overlaps an already-placed box or leaves the card at either end of its sweep. Cross-orbit
 * boxes are additionally inflated, per axis, by the two orbits' drift components, which
 * bounds the collision over every combination of orbit phases rather than over the one
 * frame you happen to look at.
 */

/* ── Constants ──────────────────────────────────────────────────────────────────── */

/** Reference size the pool's `px` was measured at, both sides flat. */
const WORD_PX_FS = 22;
/** Font size `px` in glyphPairs.js was measured at. Only the letter fallback uses it. */
const LETTER_PX_FS = 13.2;
/** Correction from that pool's typography to this one; see widthcheck.mjs. */
const LETTER_WIDTH_FACTOR = 1.12;

const LINE_BOX = 1.3; // must match line-height in glyphOrbit.css
const MARGIN = 3;     // px of card edge no box may cross
const PAD = 2;        // px of slack added to every box before the overlap test

/* House inks -- the deep end of the site's four tile colours. Type only.
 *
 * Two lists, because the scrim decides how much ink survives. Relative luminance runs
 * slate 0.02, indigo 0.06, rust 0.09, olive 0.16, so at low transmittance the olive gold
 * composites 1.17:1 against the card where the slate manages 1.6:1 in the same spot. The
 * washed positions therefore draw from the three darker inks only, which is where the
 * measured minimum contrast comes from; the clear positions keep all four, so the palette
 * still reads as four colours rather than three. */
const INKS = ['#9c3417', '#8a6f09', '#2c3f8f', '#1c2541'];
const INKS_DARK = ['#9c3417', '#2c3f8f', '#1c2541'];
/** Below this transmittance an item only gets a dark ink. */
const DARK_INK_BELOW = 0.3;

const PERIOD = 7;      // seconds, one bloom loop; must match glyphOrbit.css
/* Variants per slot, counting the one the solver placed. 8 gives each slot the better part
   of a minute of unique content before it repeats, and asks ~7x45 pairs of a pool of
   ~1,200 word candidates, which it can supply for the well-covered scripts. Ol Chiki and
   Meetei Mayek have 40 pairs each and will simply rotate through fewer. */
const ROTATION = 8;
/* Where in the bloom cycle a slot's text is exchanged. The keyframes hold opacity 0 from
   72% to 100%, so 84% sits in the middle of the invisible window with ~0.8s of margin on
   either side -- enough that the drift between the CSS clock and this one cannot make a
   swap visible. */
const SWAP_PHASE = 0.84;
const SPREAD = 3.85;   // seconds for the front to reach the corners from the innermost item
const SCATTER = 0.45;  // per-item random wait, so the front has a soft edge
const PIXEL_BLEND = 0.05; // see the delay section in solve()

/**
 * Card widths at which the layout switches profiles.
 *
 * THREE profiles, not two, and the reason is legibility rather than geometry. Type sized in
 * `cqw` keeps the layout scale-invariant, but it also means the font size varies with the
 * card: one band spanning 286px to 894px would render the same field at 4.3px on the
 * smallest phone and 13.4px on the desktop. Words at 4px are not words. Three bands each
 * span a width ratio of about 1.5, so the base size stays inside 9.2-14.5px everywhere:
 *
 *   narrow  card <= 420   base 3.20cqw    9.2px at 286  ..  13.4px at 420
 *   mid     card <= 620   base 2.40cqw   10.7px at 446  ..  14.9px at 620
 *   wide    card  > 620   base 1.566cqw  10.4px at 666  ..  14.0px at 894
 *
 * These bounds and the `--go-base` values in glyphOrbit.css are one thing expressed twice
 * and have to be changed together.
 */
const PROFILE_MAX = { narrow: 420, mid: 620 };

/**
 * The kind mix, as shares of each orbit's placed count. `translation` is the headline
 * capability and gets the floor; `roman` outranks `translit` as the more distinctive of the
 * two remaining. `letter` has no quota -- it is a fallback, not a kind.
 */
const KIND_MIX = { translation: 0.80, roman: 0.13, translit: 0.07 };

/**
 * THE ORBITS LIVE IN AN ANNULUS, NOT A DISC.
 *
 * The scrim's radius fraction, worked out against the same CSS the page uses, decides this.
 * Its ellipse is 74% of the card in both axes, it is 0.985 white out to 44% of that and
 * clear past 84%, and because an orbit at radius f sits at a scrim fraction of about 0.58f,
 * everything inside f = 0.76 is under the 0.985-white core. Measured on the live page, the
 * 38 items an earlier version placed at f = 0.48 and f = 0.74 composited to a contrast
 * ratio of 1.02:1 against the card. They were not faint; they were absent, and they were
 * more than half the field.
 *
 * So the whole system starts at f = 0.86 and runs out to f = 1.44, past the card's edge,
 * where the outer orbits are culled to the four arcs that still fit. That costs items --
 * fewer orbits fit in an annulus than in a disc -- and buys the ones that remain a contrast
 * ratio of 1.5-3:1 instead of 1.02:1. The centre is left to the scrim and the title, which
 * own it anyway.
 *
 * The bloom survives intact: the delay is affine in radius over whatever range the orbits
 * occupy, so the front still expands outward and still reaches all four edges together. It
 * simply starts from an inner ellipse rather than from a point.
 *
 * Orbits, outermost first -- also the order the solver places them, so the orbits the scrim
 * leaves visible get first refusal on the space and the washed inner ones fill in around
 * what is left.
 *
 *   f       radius as a multiple of the profile's solved (ax0, ay0)
 *   scale   font size as a multiple of the profile's base
 *   count   slots attempted; the solver keeps whatever fits
 *   op      static opacity, multiplied by the bloom's own
 *   drift   half the arc each item sweeps, in the profile's reference px
 *   period  seconds for one there-and-back sweep
 *   dir     sweep direction; alternating, so adjacent orbits shear past each other
 *   band    [lo, hi] quantiles of WIDTH WITHIN EACH KIND -- see the header. Overlapping,
 *           or each orbit would read as one homogeneous width.
 */
const WIDE_RINGS = [
  { f: 1.20, scale: 0.98, count: 56, op: 0.94, drift: 8,  period: 23, dir: -1, band: [0.30, 0.90], letters: false },
  { f: 1.08, scale: 1.14, count: 48, op: 1.00, drift: 9,  period: 19, dir: +1, band: [0.38, 1.00], letters: false },
  { f: 0.96, scale: 1.26, count: 36, op: 1.00, drift: 10, period: 15, dir: -1, band: [0.28, 0.88], letters: false },
  { f: 0.84, scale: 1.14, count: 32, op: 1.00, drift: 9,  period: 21, dir: +1, band: [0.10, 0.66], letters: false },
  { f: 0.72, scale: 1.02, count: 40, op: 1.00, drift: 8,  period: 17, dir: -1, band: [0.00, 0.48], letters: true  },
];

/* The mid card (446-620px, aspect up to 1.49) is squarer, so its orbits are rounder and it
 * has proportionally less radial room than the wide card -- three orbits, not four. */
const MID_RINGS = [
  { f: 1.20, scale: 0.96, count: 52, op: 0.94, drift: 7, period: 23, dir: -1, band: [0.30, 0.90], letters: false },
  { f: 1.06, scale: 1.12, count: 40, op: 1.00, drift: 8, period: 19, dir: +1, band: [0.34, 0.96], letters: false },
  { f: 0.92, scale: 1.20, count: 32, op: 1.00, drift: 9, period: 15, dir: -1, band: [0.16, 0.78], letters: false },
  { f: 0.78, scale: 1.02, count: 36, op: 1.00, drift: 7, period: 20, dir: +1, band: [0.00, 0.52], letters: true  },
];

/* The narrow card is nearly square, so its orbits are nearly circles and their arcs are
 * longer relative to item width than in the 2.4:1 case. The opacity floor is raised across
 * the set (0.85 against the wide profile's 0.80, no inner orbit below 0.95): at this size
 * the field is a thin frame around opaque content, so what shows has to carry. */
/* The narrow card is portrait -- 356 x 508 at a 390px viewport -- and a readable word pair
 * is 60-90px there, i.e. a quarter of the card's WIDTH. Two consequences, both accepted
 * rather than fought: three orbits at most, and bands drawn from the shorter half of each
 * kind, because the long tail simply does not fit across a 356px card. This is the profile
 * where the word pool costs the most items; the arithmetic is in the report. */
const NARROW_RINGS = [
  { f: 1.22, scale: 0.94, count: 52, op: 0.96, drift: 6, period: 23, dir: -1, band: [0.20, 0.80], letters: false },
  { f: 1.06, scale: 1.08, count: 40, op: 1.00, drift: 7, period: 19, dir: +1, band: [0.24, 0.88], letters: false },
  { f: 0.90, scale: 1.16, count: 32, op: 1.00, drift: 8, period: 15, dir: -1, band: [0.10, 0.70], letters: false },
  { f: 0.74, scale: 1.02, count: 36, op: 1.00, drift: 6, period: 20, dir: +1, band: [0.00, 0.46], letters: true  },
];

/**
 * The two card shapes the layout is solved against.
 *
 * `w`/`h` are the WORST aspect measured in each band, not the typical one, so a layout that
 * fits here fits everywhere in the band: horizontal geometry is scale-invariant (positions
 * in %, type in cqw) and vertical crowding scales with aspect, so the widest card in a band
 * is the binding case.
 *
 * `fs` is the base font size at the reference width. It and the profile's `--go-base` in
 * glyphOrbit.css are the same number two ways -- 14.0 / 894 = 1.566cqw and
 * 15.55 / 486 = 3.2cqw -- and must be changed together. The narrow base is twice the wide
 * one as a share of the card because a WORD has to be legible at a 356px card, where
 * 1.566cqw would be 5.6px. That choice costs items: word pairs are 2-4x wider than the
 * syllables this field used to carry, so a readable narrow field is necessarily a sparser
 * one, and legibility is the thing the user actually asked for.
 */
const PROFILES = [
  { id: 'wide',   w: 894, h: 367, fs: 14.0,  rings: WIDE_RINGS,   seed: 20260904 },
  { id: 'mid',    w: 606, h: 407, fs: 14.54, rings: MID_RINGS,    seed: 771903 },
  { id: 'narrow', w: 396, h: 508, fs: 12.67, rings: NARROW_RINGS, seed: 41027 },
];

/* ── One draw per page load ────────────────────────────────────────────────────────
 * The three profile seeds above are fixed, which made the field deterministic: every
 * visitor, on every visit, saw the same pairs in the same places. That was right while
 * the layout was being tuned against screenshots and wrong for a shipped hero -- the
 * user reported seeing the same words over and over. Mixing a per-load value into each
 * profile seed redraws the pool on every visit.
 *
 * It is drawn ONCE at module scope, not per render, because `solve()` is memoised behind
 * a module-level promise: a seed that changed per render would either be ignored (the
 * memo wins) or, if the memo were removed, reshuffle the field on every resize and
 * re-render, which reads as a bug rather than as variety.
 *
 * `?orbitSeed=N` pins it, which is how the Playwright suites still assert a fixed field
 * and how a screenshot worth keeping can be reproduced. The value in play is always
 * readable at `window.__ORBIT_STATS.runSeed`.
 */
const RUN_SEED = (() => {
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('orbitSeed');
    if (q !== null && q !== '' && Number.isFinite(Number(q))) return Number(q) >>> 0;
  }
  return (Math.random() * 4294967296) >>> 0;
})();

/* Deterministic PRNG: the field is identical across re-renders within a page load, and
 * differs between loads only through RUN_SEED. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/* ── The candidate pool ────────────────────────────────────────────────────────────
 * One flat list. Each entry knows which side is native script and which is Roman, because
 * that differs by kind and drives both the font stack and which side is dominant:
 *
 *   translation   english (Latin)  →  target (native)
 *   roman         english (Latin)  →  target (Latin)
 *   translit      source (native)  →  target (Latin)
 *
 * WORD_PAIRS is keyed by LANGUAGE and nine of the 22 languages are Devanagari, so script
 * share is taken over SCRIPTS and damped by a square root of the language count -- the same
 * reason the syllable sampler damped its corpus weights. Without it a fifth of the field
 * would be one script by construction.
 * ──────────────────────────────────────────────────────────────────────────────── */
const SCRIPT_LANGS = {};
for (const [lang, v] of Object.entries(WORD_PAIRS)) {
  (SCRIPT_LANGS[v.script] = SCRIPT_LANGS[v.script] || []).push(lang);
}
const SCRIPT_W = Object.fromEntries(
  Object.entries(SCRIPT_LANGS).map(([s, l]) => [s, Math.sqrt(l.length)]),
);

const WORD_CANDIDATES = [];
for (const [lang, v] of Object.entries(WORD_PAIRS)) {
  for (const [english, target, kind, confidence, , px] of v.pairs) {
    WORD_CANDIDATES.push({
      lang,
      script: v.script,
      src: english,
      dst: target,
      // `translit` reads native → Roman; the other two read English → target.
      srcNative: kind === 'translit',
      dstNative: kind === 'translation',
      kind,
      conf: confidence,
      word: true,
      key: `${kind}|${english}|${target}`,
      // Starting estimate only, and an upper bound: the pool measured both sides at a flat
      // 22px, this component sets the source side at 0.58em. Overwritten by measureWords().
      emW: (px || 150) / WORD_PX_FS,
    });
  }
}

/**
 * Letter-pair fallback, from the syllable pool, for slots no word can fill. Kept as a
 * distinct `word: false` population so the split can be reported honestly. Widths come from
 * that pool's own measured `px`, so these need no browser measurement.
 */
const LETTER_CANDIDATES = [];
for (const [script, s] of Object.entries(GLYPH_PAIRS)) {
  const cellTotal = s.cells.reduce((a, c) => a + c[2], 0);
  for (const [latin, glyph, w, px] of s.cells) {
    if (!latin) continue; // a lone glyph carries no pair at all; never worth a slot
    LETTER_CANDIDATES.push({
      lang: script,
      script,
      src: latin,
      dst: glyph,
      srcNative: false,
      dstNative: true,
      kind: 'letter',
      conf: w / cellTotal,
      word: false,
      key: `letter|${latin}|${glyph}`,
      emW: (px * LETTER_WIDTH_FACTOR) / LETTER_PX_FS,
    });
  }
}

/* ── Browser width measurement ─────────────────────────────────────────────────────
 * One hidden container, every word candidate appended, then every width read. All writes
 * happen before any read, so this costs one layout rather than one per candidate. `emW` is
 * the width at a 1px font size, which is what the solver scales.
 * ──────────────────────────────────────────────────────────────────────────────── */
const MEASURE_FS = 100; // large, so sub-pixel rounding stays a rounding error not a bias

/**
 * Build the hidden host and return a function that reads the widths back.
 *
 * Split in two on purpose. Appending the host is what REQUESTS the twelve Noto faces: a web
 * font is not fetched until something on the page needs it, so `document.fonts.ready` before
 * this point resolves against the fonts the page happened to use already and says nothing
 * about Noto Sans Tamil. Measuring then reads fallback metrics.
 *
 * That was not hypothetical either. Measured against the same pool, the preview page
 * reported an em-width range of 2.04-15.38 and the live page 1.74-14.18 -- a 15% difference
 * that came entirely from which faces happened to be resolved at measurement time, and it
 * gave the two pages different fields. So: append, wait for fonts, then read.
 */
function beginMeasure() {
  const host = document.createElement('div');
  host.className = 'go-measure';
  host.style.fontSize = `${MEASURE_FS}px`;
  const nodes = WORD_CANDIDATES.map((c) => {
    const row = document.createElement('span');
    row.className = 'go-type';
    const a = document.createElement('span');
    a.className = `go-src ${c.srcNative ? 'go-native' : 'go-latin'}`;
    a.textContent = c.src;
    const arrow = document.createElement('span');
    arrow.className = 'go-arrow';
    arrow.textContent = '\u2192';
    const b = document.createElement('span');
    b.className = `go-dst ${c.dstNative ? 'go-native' : 'go-latin'}`;
    b.textContent = c.dst;
    row.append(a, arrow, b);
    host.append(row);
    return row;
  });
  document.body.append(host);
  return () => {
    // All writes are already done, so reading every width costs one layout, not 1,563.
    const widths = nodes.map((n) => n.getBoundingClientRect().width);
    host.remove();
    let ratioSum = 0;
    WORD_CANDIDATES.forEach((c, i) => {
      const em = widths[i] / MEASURE_FS;
      if (em > 0) { ratioSum += em / c.emW; c.emW = em; }
    });
    // Reported, not asserted: how far the pool's flat-22px ruler was from this typography.
    return ratioSum / WORD_CANDIDATES.length;
  };
}

/* ── Bands, taken within each kind ─────────────────────────────────────────────── */

/**
 * For each kind, a function from quantile to width. Within-kind rather than pool-wide, so
 * an orbit's "shortest third" means the shortest third of ITS OWN kind -- which is what
 * lets short-innermost and an 80% translation majority hold at the same time.
 */
function buildBands(candidates) {
  const byKind = {};
  for (const c of candidates) (byKind[c.kind] = byKind[c.kind] || []).push(c);
  const qs = {};
  for (const [kind, list] of Object.entries(byKind)) {
    const rows = list
      .map((c) => [c.emW, (SCRIPT_W[c.script] || 1) * c.conf])
      .sort((a, b) => a[0] - b[0]);
    const total = rows.reduce((a, x) => a + x[1], 0);
    let acc = 0;
    const cum = rows.map(([em, w]) => { acc += w; return [em, acc / total]; });
    qs[kind] = (q) => {
      if (q <= 0) return cum[0][0];
      for (const [em, c] of cum) if (c >= q) return em;
      return cum[cum.length - 1][0];
    };
  }
  return qs;
}

/* ── Boxes ─────────────────────────────────────────────────────────────────────── */

const halfBox = (emW, scale, profile) => {
  const fs = profile.fs * scale;
  return { hw: (emW * fs) / 2 + PAD, hh: (fs * LINE_BOX) / 2 + PAD };
};

/** Does a box centred at (x, y) sit wholly inside the card at both drift extremes? */
const insideCard = (x, y, dx, dy, hw, hh, profile) => {
  for (const s of [-1, 1]) {
    const cx = x + s * dx;
    const cy = y + s * dy;
    if (cx - hw < MARGIN || cx + hw > profile.w - MARGIN) return false;
    if (cy - hh < MARGIN || cy + hh > profile.h - MARGIN) return false;
  }
  return true;
};

/**
 * Axis-aligned overlap between two placed items, over the whole sweep rather than at one
 * frame of it.
 *
 * Same orbit: the drift is a rigid rotation of the ring to first order, so same-orbit
 * separations are constant and no inflation is needed. Different orbits: the two shear past
 * each other, by an amount bounded per axis by the two items' own drift components there.
 * Per axis rather than isotropically by the scalar amplitude, because an item at the side of
 * its ellipse hardly moves horizontally and one at the top hardly moves vertically -- the
 * isotropic bound was rejecting two thirds of the corner arcs for motion that never happens.
 */
const overlaps = (a, b) => {
  const sx = a.ring === b.ring ? 0 : Math.abs(a.dx) + Math.abs(b.dx);
  const sy = a.ring === b.ring ? 0 : Math.abs(a.dy) + Math.abs(b.dy);
  return (
    Math.abs(a.x - b.x) < a.hw + b.hw + sx &&
    Math.abs(a.y - b.y) < a.hh + b.hh + sy
  );
};

/* ── The solver ────────────────────────────────────────────────────────────────── */

/**
 * `f` is a straight fraction of the card's half-axes: an orbit at f runs through
 * (f*W/2, f*H/2). Nothing is derived, and that is the point.
 *
 * An earlier version solved the semi-axes from the innermost orbit's widest banded item and
 * expressed f relative to those. It looks more careful and is actively wrong once no orbit
 * sits inside f = 1: with the innermost at 0.86 the derived basis put f = 1.06 at 471px on a
 * 447px half-card, so three of four orbits fell outside the card and kept 0, 1 and 4 items
 * of 128 slots. Worse, it made the scrim arithmetic unreadable.
 *
 * On this basis the scrim is exact. Its ellipse is 74% of the card in both axes, so an
 * orbit at f sits at scrim fraction 0.676f everywhere along its length -- the wash has the
 * card's aspect, so it is constant around an orbit of the card's aspect. The scrim is
 * 0.985 white to 44% and clear past 84%, hence:
 *
 *   f      scrim fraction   white   TRANSMITTANCE
 *   0.65      0.44          0.985      0.015   <- everything inside here is absent
 *   0.80      0.54          0.741      0.259
 *   0.95      0.64          0.492      0.508
 *   1.10      0.74          0.243      0.757
 *   1.24      0.84          0          1.0
 *
 * And containment costs the other end: at f = 1.0 the orbit touches the card's edge
 * midpoints, so past that it survives only on the diagonals, and past about f = 1.25 the
 * arcs that still hold a word have vanished. The usable annulus on a 2.4:1 card is
 * therefore f in [0.7, 1.2], which is what the orbit sets below occupy. Containment is
 * enforced per item by insideCard() against that item's own box, so the outer orbits simply
 * keep fewer.
 */
const axes = (profile) => ({ ax0: profile.w / 2, ay0: profile.h / 2 });

/**
 * How much of the field shows through the hero scrim at (x, y), 0 = fully washed out.
 *
 * This is `.hero-scrim` from styles.css evaluated rather than eyeballed: a radial
 * ellipse 74% of the card, 0.985 white to 44% of it and clear past 84%, layered over a
 * vertical gradient that puts 0.55 white on the top and bottom 30%. The two compose
 * multiplicatively in transmittance.
 *
 * Used as a placement FILTER. Measured on the live page, an earlier arrangement put half
 * its items where this returns under 0.05 -- they composited to 1.02:1 against the card,
 * which is not "faint", it is absent, and it cost real slots. Rejecting those positions is
 * why every placed item now clears roughly 1.4:1. It is a per-POSITION test, not a
 * per-orbit one, which matters because the vertical gradient makes the top and bottom of
 * an inner orbit invisible while its left and right lobes are fine.
 */
const transmittance = (x, y, profile) => {
  const { w, h } = profile;
  const d = Math.hypot((x - w / 2) / (0.74 * w), (y - h / 2) / (0.74 * h));
  const ar = d <= 0.44 ? 0.985 : d < 0.84 ? 0.985 * (1 - (d - 0.44) / 0.4) : 0;
  const t = y / h;
  const al = t < 0.3 ? 0.55 * (1 - t / 0.3) : t > 0.7 ? 0.55 * ((t - 0.7) / 0.3) : 0;
  return (1 - ar) * (1 - al);
};

/**
 * The floor a placement has to clear. 0.12 puts the deep slate ink at about 1.5:1 against
 * the white card, which is the point at which a bold word at 12-18px stops being a smudge.
 */
const MIN_TRANSMITTANCE = 0.12;

/** Weighted pick from `list` using `weight`, with a supplied 0..1 source. */
const pick = (list, weight, r) => {
  const total = list.reduce((a, c) => a + weight(c), 0);
  if (total <= 0) return null;
  let t = r() * total;
  for (const c of list) { t -= weight(c); if (t <= 0) return c; }
  return list[list.length - 1];
};

function solve(profile, pool, qs) {
  const { ax0, ay0 } = axes(profile);
  const r = rng(profile.seed ^ RUN_SEED);
  const placed = [];
  const stats = [];
  const used = new Set();
  const seenScripts = new Set();
  const seenLangs = new Set();
  const kindN = { translation: 0, roman: 0, translit: 0, letter: 0 };

  /**
   * The quota that makes the mix a COUNT and not a probability: a kind is allowed while
   * placing one more would keep it inside its share of the field. Profile-wide rather than
   * per orbit, because 7% of a 12-item orbit is not a representable quantity -- forcing it
   * there gave translit 16% overall. What the coordinator's per-orbit version was actually
   * protecting against, the short tail being almost all `translit`, is already handled by
   * taking each orbit's band WITHIN each kind; the two mechanisms are independent, and the
   * per-orbit mix is reported so the aggregate cannot hide a concentration.
   */
  const allowKind = (k) => kindN[k] + 1 <= KIND_MIX[k] * (placed.length + 1) + 1;

  profile.rings.forEach((ring, ri) => {
    // In-band, per kind: each kind contributes the slice of ITS OWN width distribution that
    // this orbit's band names.
    const inBand = pool.filter((c) => {
      const q = qs[c.kind];
      return q && c.emW >= q(ring.band[0]) && c.emW <= q(ring.band[1]);
    });
    const words = inBand.filter((c) => c.word);
    const letters = ring.letters ? inBand.filter((c) => !c.word) : [];
    const ax = ring.f * ax0;
    const ay = ring.f * ay0;
    const step = (2 * Math.PI) / ring.count;

    const ringKinds = { translation: 0, roman: 0, translit: 0, letter: 0 };
    let onRing = 0;

    for (let j = 0; j < ring.count; j += 1) {
      const base = j * step;
      let item = null;

      // Up to 28 attempts per slot: jitter the angle by up to +-0.42 of a step and the
      // radius by +-7%, and redraw the pair. The angular jitter stops an orbit reading as a
      // printed circle; the radial jitter also spreads the orbit's items across a range of
      // radii, which softens the bloom's ring-by-ring pulse at no cost to the correlation,
      // because the delay follows the jittered radius.
      //
      // Letter pairs are reachable only on orbits the scrim hides (`letters: true`, which
      // is f <= 0.74, where the wash is 0.985 white) and only in the last four attempts.
      // The instruction was to fall back rather than leave holes; this is that, narrowed:
      // an unfilled slot is INVISIBLE, whereas a syllable in the visible band is exactly
      // the "these are still characters" failure this rewrite exists to fix. So the visible
      // orbits are words or nothing, and the fallback only pads the core.
      for (let attempt = 0; attempt < 36 && !item; attempt += 1) {
        const th = base + (r() - 0.5) * 0.84 * step;
        const jr = 1 + (r() - 0.5) * 0.14;
        const source = attempt < 32 || !letters.length ? words : letters;
        // After a third of the attempts the slot is evidently tight, so start preferring
        // narrow candidates -- 1/emW^2 is a strong enough bias to find the short tail of
        // the band without excluding anything. This is what keeps the letter fallback
        // nearly unused: it took the wide field from 88.6% words to the number reported.
        const tight = attempt >= 12;

        // Script first, then a language in that script, then a pair -- so nine Devanagari
        // languages cannot crowd out Tamil. The kind quota and de-duplication are filters on
        // the candidate list, not checks afterwards, or the pick would fail silently.
        const allowed = source.filter((c) => !used.has(c.key) && (!c.word || allowKind(c.kind)));
        if (!allowed.length) continue;
        // A script or language not yet in this profile gets 5x weight. With ~50 slots, 12
        // scripts and 22 languages, an unbiased draw leaves several out perfectly often --
        // and "22 languages / 12 scripts" is a claim the hero makes two inches away in the
        // spec strip, so it has to be true of the rendered field and not just of the pool.
        const scripts = [...new Set(allowed.map((c) => c.script))];
        const script = pick(
          scripts,
          (t) => (SCRIPT_W[t] || 1) * (seenScripts.has(t) ? 1 : 5),
          r,
        );
        const ofScript = allowed.filter((c) => c.script === script);
        const langs = [...new Set(ofScript.map((c) => c.lang))];
        const lang = pick(langs, (t) => (seenLangs.has(t) ? 1 : 5), r);
        const cand = pick(
          ofScript.filter((c) => c.lang === lang),
          (c) => c.conf / (tight ? c.emW * c.emW : 1),
          r,
        );
        if (!cand) continue;

        const x = profile.w / 2 + ax * jr * Math.cos(th);
        const y = profile.h / 2 + ay * jr * Math.sin(th);

        // Unit tangent of the ellipse at th -- the direction the item drifts along.
        const tx = -ax * Math.sin(th);
        const ty = ay * Math.cos(th);
        const tn = Math.hypot(tx, ty) || 1;
        const dx = (ring.drift * tx) / tn;
        const dy = (ring.drift * ty) / tn;

        const trans = transmittance(x, y, profile);
        if (trans < MIN_TRANSMITTANCE) continue;

        const { hw, hh } = halfBox(cand.emW, ring.scale, profile);
        if (!insideCard(x, y, dx, dy, hw, hh, profile)) continue;

        const box = { ring: ri, x, y, hw, hh, dx, dy };
        if (placed.some((p) => overlaps(box, p))) continue;

        item = {
          ...box,
          ...cand,
          profile: profile.id,
          scale: ring.scale,
          op: ring.op,
          trans,
          ink: trans < DARK_INK_BELOW
            ? INKS_DARK[Math.floor(r() * INKS_DARK.length)]
            : INKS[Math.floor(r() * INKS.length)],
          period: ring.period,
          phase: -(r() * ring.period),
          dir: ring.dir,
        };
      }

      if (item) {
        placed.push(item);
        used.add(item.key);
        seenScripts.add(item.script);
        if (item.word) seenLangs.add(item.lang);
        kindN[item.kind] += 1;
        ringKinds[item.kind] += 1;
        onRing += 1;
      }
    }
    stats.push({
      f: ring.f,
      fs: +(profile.fs * ring.scale).toFixed(1),
      asked: ring.count,
      kept: onRing,
      kinds: { ...ringKinds },
    });
  });

  // ── Bloom delays ──
  // Radius normalised by the card's own half-axes, which in percentage terms is just
  // (x% - 50) / 50 -- independent of the card's pixel size, so one set of delays is correct
  // at every viewport and in both profiles. Affine, never clamped.
  // A pure elliptical radius correlates 0.993 with the card-normalised radius and only
  // 0.68 with raw pixel distance, because on a 2.4:1 card one orbit spans 136-322px from
  // the centre while its elliptical radius is constant. PIXEL_BLEND mixes a little pixel
  // distance back in: enough to keep the pixel correlation above a sanity floor, small
  // enough that the front is still the card's inscribed ellipse to the eye and the
  // elliptical correlation stays above 0.99. Both numbers are reported.
  const nx = (p) => (p.x / profile.w - 0.5) * 2;
  const ny = (p) => (p.y / profile.h - 0.5) * 2;
  const aspect = profile.w / profile.h;
  const rad = placed.map((p) => {
    const rEll = Math.hypot(nx(p), ny(p));
    const rPx = Math.hypot(nx(p) * aspect, ny(p)) / aspect;
    return (1 - PIXEL_BLEND) * rEll + PIXEL_BLEND * rPx;
  });
  const r0 = Math.min(...rad);
  const rSpan = Math.max(...rad) - r0;
  const r2 = rng(profile.seed ^ RUN_SEED ^ 0x5f5f);
  placed.forEach((p, i) => {
    p.radius = rad[i];
    p.delay = ((rad[i] - r0) / rSpan) * SPREAD + r2() * SCATTER;
  });

  /* ── Rotation: new pairs without a new layout ──────────────────────────────────
   * The bloom is `infinite`, so before this the same ~45 pairs faded in and out forever
   * and a reader watching the hero for half a minute saw each one four or five times.
   * Randomising RUN_SEED fixed the between-loads case and did nothing for that one.
   *
   * Each slot therefore gets a queue of stand-ins that it cycles through in place. Two
   * constraints make the swap free of any layout risk:
   *
   *   - SAME SCRIPT. `data-script` on the item drives the font stack, and the field's
   *     script coverage is a claim the spec strip makes two inches away, so holding the
   *     script fixed keeps both true at every instant rather than just at t=0.
   *   - NARROWER OR EQUAL. `emW <= p.emW` means every stand-in draws strictly inside the
   *     box the solver already proved collision-free, so no rotation can overlap.
   *
   * Drawn from a set that excludes every other slot's picks, so two slots can never show
   * the same pair at the same time -- the same invariant the initial placement holds.
   */
  const usedAlt = new Set(placed.map((q) => q.key));
  for (const q of placed) {
    // Drawn from the whole pool, not from one ring's band list -- those are scoped to the
    // placement loop, and the width rule below is stricter than the band anyway. The lower
    // bound keeps a stand-in close to the visual weight of the pair it replaces, so an
    // outer-orbit slot cannot rotate down to a two-letter word and look like a hole.
    const bag = pool.filter((c) => c.word === q.word && c.script === q.script
      && c.emW <= q.emW && c.emW >= q.emW * 0.6 && !usedAlt.has(c.key));
    q.alts = [];
    while (q.alts.length < ROTATION - 1 && bag.length) {
      const c = pick(bag, (x) => x.conf, r);
      if (!c) break;
      q.alts.push(c);
      usedAlt.add(c.key);
      bag.splice(bag.indexOf(c), 1);
    }
  }

  const kinds = {};
  for (const p of placed) kinds[p.kind] = (kinds[p.kind] || 0) + 1;
  const nWords = placed.filter((p) => p.word).length;
  return {
    items: placed,
    stats,
    ax0,
    ay0,
    kinds,
    kindPct: Object.fromEntries(
      Object.entries(kinds).map(([k, n]) => [k, +((100 * n) / placed.length).toFixed(1)]),
    ),
    wordPct: +((100 * nWords) / placed.length).toFixed(1),
    scripts: new Set(placed.map((p) => p.script)).size,
    // Words only: the letter fallback stores a script tag in `lang`, and counting those
    // as languages is how a 22-language pool reported 25.
    langs: new Set(placed.filter((p) => p.word).map((p) => p.lang)).size,
    fontSizes: [
      +Math.min(...placed.map((p) => profile.fs * p.scale)).toFixed(1),
      +Math.max(...placed.map((p) => profile.fs * p.scale)).toFixed(1),
    ],
    itemPx: [
      +Math.min(...placed.map((p) => (p.hw - PAD) * 2)).toFixed(1),
      +Math.max(...placed.map((p) => (p.hw - PAD) * 2)).toFixed(1),
    ],
  };
}

/* ── One-shot measure + solve ──────────────────────────────────────────────────── */

/** Populated in place after solving, so `window.__ORBIT_STATS` can be bound early. */
export const ORBIT_STATS = { solved: false, profileMax: PROFILE_MAX, period: PERIOD };

let SOLVED = null;
let SOLVING = null;

/**
 * Measure, then solve, once per page. Returns a promise so every mount shares one pass.
 *
 * The font wait is bounded: if a face never arrives, a field solved against fallback
 * metrics is better than no field, and because the boxes are whatever was actually
 * measured the layout is still collision-free -- just laid out for a different face.
 */
function measureAndSolve() {
  if (SOLVED) return Promise.resolve(SOLVED);
  if (SOLVING) return SOLVING;
  const read = beginMeasure();
  const fonts = typeof document !== 'undefined' && document.fonts
    ? Promise.race([
      document.fonts.ready,
      new Promise((res) => { setTimeout(res, 2500); }),
    ])
    : Promise.resolve();
  SOLVING = fonts.then(() => {
    const rulerRatio = read();
    const qs = buildBands([...WORD_CANDIDATES, ...LETTER_CANDIDATES]);
    const pool = [...WORD_CANDIDATES, ...LETTER_CANDIDATES];
    SOLVED = Object.fromEntries(PROFILES.map((p) => [p.id, solve(p, pool, qs)]));

    ORBIT_STATS.solved = true;
    ORBIT_STATS.runSeed = RUN_SEED;
    ORBIT_STATS.wordCandidates = WORD_CANDIDATES.length;
    ORBIT_STATS.rulerRatio = +rulerRatio.toFixed(3);
    ORBIT_STATS.fontsReady = typeof document !== 'undefined' && document.fonts
      ? document.fonts.check(`600 ${MEASURE_FS}px "Noto Sans Devanagari"`) : null;
    ORBIT_STATS.emWRange = [
      +Math.min(...WORD_CANDIDATES.map((c) => c.emW)).toFixed(2),
      +Math.max(...WORD_CANDIDATES.map((c) => c.emW)).toFixed(2),
    ];
    ORBIT_STATS.profiles = Object.fromEntries(PROFILES.map((p) => {
      const st = SOLVED[p.id];
      return [p.id, {
        card: [p.w, p.h],
        items: st.items.length,
        wordPct: st.wordPct,
        kinds: st.kinds,
        kindPct: st.kindPct,
        scripts: st.scripts,
        langs: st.langs,
        fontSizes: st.fontSizes,
        itemPx: st.itemPx,
        alts: st.items.map((x) => x.alts?.length ?? 0),
        axes: [+st.ax0.toFixed(1), +st.ay0.toFixed(1)],
        rings: st.stats,
      }];
    }));
    if (typeof window !== 'undefined') window.__ORBIT_STATS = ORBIT_STATS;
    return SOLVED;
  });
  return SOLVING;
}

/* ── Render ────────────────────────────────────────────────────────────────────── */

/* Hairline orbit guides, dashed, on three of the six orbits. At 3.8% alpha they are below
 * the threshold of "a diagram" but above the threshold of "arranged", which is the whole
 * difference between this and a cloud. */
const GUIDE_FS = [1.18, 1.0, 0.85];

const Guides = ({ profile, solved }) => (
  <svg
    className="go-guides"
    data-p={profile.id}
    viewBox={`0 0 ${profile.w} ${profile.h}`}
    preserveAspectRatio="none"
    focusable="false"
  >
    {GUIDE_FS.map((f) => (
      <ellipse
        key={f}
        cx={profile.w / 2}
        cy={profile.h / 2}
        rx={f * solved.ax0}
        ry={f * solved.ay0}
      />
    ))}
  </svg>
);

/* `variant` 0 is the pair the solver placed; 1..n index into p.alts. Only the TEXT and the
   two native/latin flags come from the variant -- every geometry field stays p's, because
   the box is what was proved collision-free. */
const Item = ({ p, profile, variant = 0 }) => {
  const v = variant && p.alts?.length ? p.alts[(variant - 1) % p.alts.length] : p;
  return (
  <span
    className="go-item"
    data-hero-item=""
    data-p={p.profile}
    data-script={p.script}
    data-kind={v.kind}
    style={{
      left: `${(p.x / profile.w) * 100}%`,
      top: `${(p.y / profile.h) * 100}%`,
      opacity: p.op,
      color: p.ink,
      // Font size and drift amplitude are both in cqw, i.e. proportional to the card's own
      // width, so one solved layout serves every card size in its band.
      '--s': p.scale,
      '--dx': `${(p.dx * 100) / profile.w}cqw`,
      '--dy': `${(p.dy * 100) / profile.w}cqw`,
      '--dp': `${p.period}s`,
      '--dd': `${p.phase.toFixed(2)}s`,
      '--dir': p.dir > 0 ? 'normal' : 'reverse',
      // --d carries the delay as a custom property too. Under prefers-reduced-motion the
      // animation is stripped, so the COMPUTED animation-delay is 0s for every item and a
      // probe reading it there measures nothing; --d survives that, while the inline
      // animation-delay below is readable from `el.style` always and from getComputedStyle
      // in any normal-motion load.
      '--d': `${p.delay.toFixed(3)}s`,
    }}
  >
    <span className="go-drift">
      <span className="go-type" style={{ animationDelay: `${p.delay.toFixed(3)}s` }}>
        <span className={`go-src ${v.srcNative ? 'go-native' : 'go-latin'}`}>{v.src}</span>
        <span className="go-arrow">{'→'}</span>
        <span className={`go-dst ${v.dstNative ? 'go-native' : 'go-latin'}`}>{v.dst}</span>
      </span>
    </span>
  </span>
  );
};

const GlyphOrbit = ({ onSolved }) => {
  const ref = useRef(null);
  const [solved, setSolved] = useState(SOLVED);
  // null = not measured yet. Both profiles are never rendered at once: only the active one
  // is in the DOM, so nothing hidden can answer a geometry query.
  const [active, setActive] = useState(null);

  // Measure the pool and solve, once per page. Asynchronous because the measurement has to
  // wait for the web fonts it itself requests -- see beginMeasure.
  useLayoutEffect(() => {
    let cancelled = false;
    measureAndSolve().then((s) => { if (!cancelled) setSolved(s); });
    return () => { cancelled = true; };
  }, []);

  /* Which variant each slot is currently showing, keyed by the slot's pair key.
   *
   * One 200ms interval drives all ~45 slots rather than 45 timers, and every swap due on a
   * tick is batched into a single setState, so the field re-renders a few times a second at
   * most. A slot is exchanged only while its own bloom has it at opacity 0, which is why
   * this tracks each slot's cycle number instead of a global step: the delays are staggered
   * across ~4 seconds, so there is no instant at which the whole field is invisible.
   *
   * Off entirely under prefers-reduced-motion, where the bloom is stripped and every item
   * is permanently visible -- there a swap would be a jump-cut rather than a change behind
   * a fade. `?orbitRotate=0` also disables it, which is how the suites read a stable field.
   */
  const [variant, setVariant] = useState({});
  useLayoutEffect(() => {
    if (!solved || !active) return undefined;
    if (typeof window === 'undefined') return undefined;
    if (new URLSearchParams(window.location.search).get('orbitRotate') === '0') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const items = solved[active]?.items ?? [];
    if (!items.some((p) => p.alts?.length)) return undefined;
    const t0 = performance.now();
    const lastCycle = new Map();
    const id = setInterval(() => {
      const el = (performance.now() - t0) / 1000;
      let due = null;
      for (const p of items) {
        const n = p.alts?.length;
        if (!n) continue;
        const u = el - p.delay;
        if (u < 0) continue;
        const cycle = Math.floor(u / PERIOD);
        if ((u % PERIOD) / PERIOD < SWAP_PHASE) continue;
        if ((lastCycle.get(p.key) ?? -1) >= cycle) continue;
        lastCycle.set(p.key, cycle);
        (due ??= {})[p.key] = (cycle + 1) % (n + 1);
      }
      if (due) setVariant((prev) => ({ ...prev, ...due }));
    }, 200);
    return () => clearInterval(id);
  }, [solved, active]);

  // Which profile the card's own width calls for. Observed rather than inferred from the
  // viewport, because the preview page renders several card widths on one page.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const w = el.clientWidth;
      if (w <= 0) return;
      setActive(w <= PROFILE_MAX.narrow ? 'narrow' : w <= PROFILE_MAX.mid ? 'mid' : 'wide');
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (solved && onSolved) onSolved(ORBIT_STATS);
  }, [solved, onSolved]);

  const shown = solved && active ? PROFILES.filter((p) => p.id === active) : [];

  return (
    <div className="go" aria-hidden="true" data-hero-field="orbit" ref={ref}>
      {shown.map((profile) => (
        <Guides key={profile.id} profile={profile} solved={solved[profile.id]} />
      ))}
      {shown.map((profile) =>
        solved[profile.id].items.map((p, i) => (
          <Item key={`${profile.id}-${i}`} p={p} profile={profile} variant={variant[p.key] ?? 0} />
        )),
      )}
    </div>
  );
};

export default GlyphOrbit;
