import { useEffect, useId, useMemo, useState } from 'react';
import { LANGS, LANG_ABBR, LANG_CODE } from '../data/evals';
import { orderSentences } from '../data/exampleOrder';

/**
 * Linguistic coverage: all 22 languages as a constellation of script glyphs, each
 * opening its own real translation example.
 *
 * This is deliberately per-language rather than a map of India. The examples are keyed
 * by language, not by state; no state-boundary asset exists in this repo; and a
 * language-to-state mapping would be a contestable claim -- Hindi, Urdu, Sanskrit,
 * Sindhi and Konkani have no single home state, and Assam and Jammu & Kashmir would
 * each carry two of these languages.
 *
 * The interaction follows the house pattern in the website template's
 * ArchitectureDiagram: a sticky `active` plus a transient `hover` derived into one
 * highlight, a real <button> per item, and one shared detail panel that every button
 * points at with aria-describedby. Keyboard focus selects, so the panel is reachable
 * without a pointer, and an sr-only list carries the same content in prose.
 */

// Each language's name written in its own language and script. The pill used to read
// "Marathi" in English beside a script initial; the point of this section is that the
// model works in these languages, so the name it shows is the one its own speakers use,
// and the English identity moves into the code on the disc.
//
// Authored labelling data, not derived from the corpus. All 22 were checked against
// glibc's own locale definitions (the `lang_name` field in /usr/share/i18n/locales/*),
// an independent source: 18 match it exactly. The four that do not are deliberate, and
// each is settled by what this page itself uses rather than by preference:
//
//   Manipuri  glibc gives মৈতৈলোন্ in BENGALI script. Same name, different script -- the
//             page declares Meetei Mayek and every Manipuri example is in it, so the name
//             is written in Meetei Mayek too.
//   Sindhi    glibc gives سنڌي in Perso-Arabic. Sindhi is official in both scripts; this
//             page declares Devanagari and its Sindhi examples are Devanagari.
//   Bodo      glibc gives बड़ो, which spells the name with ड़ and a Hindi-style -ो ending.
//             Bodo's own orthography is ba + ra plus the apostrophe marking /ɯ/. The
//             corpus settles the choice of apostrophe: this page's Bodo text uses the
//             ASCII U+0027 sixty times (आर', क', ज', न') and ड़ not once.
//   Urdu      glibc gives اردو; this was اُردُو, carrying optional damma vowel marks. The
//             page's own Urdu has zero diacritics across 5,387 Arabic characters, so the
//             marks are dropped.
//
// The Bodo apostrophe is the one character here that is not a letter of its language's
// script, which the script check in the verification pass allows for explicitly.
const ENDONYM = {
  Assamese: 'অসমীয়া',
  Bengali: 'বাংলা',
  Bodo: 'बर\'',
  Dogri: 'डोगरी',
  Gujarati: 'ગુજરાતી',
  Hindi: 'हिन्दी',
  Kannada: 'ಕನ್ನಡ',
  Kashmiri: 'کٲشُر',
  Konkani: 'कोंकणी',
  Maithili: 'मैथिली',
  Malayalam: 'മലയാളം',
  Manipuri: 'ꯃꯤꯇꯩꯂꯣꯟ',
  Marathi: 'मराठी',
  Nepali: 'नेपाली',
  Odia: 'ଓଡ଼ିଆ',
  Punjabi: 'ਪੰਜਾਬੀ',
  Sanskrit: 'संस्कृतम्',
  Santali: 'ᱥᱟᱱᱛᱟᱲᱤ',
  Sindhi: 'सिन्धी',
  Tamil: 'தமிழ்',
  Telugu: 'తెలుగు',
  Urdu: 'اردو',
};

// The two Perso-Arabic names, which have to be marked so the browser lays them out
// right-to-left inside an otherwise left-to-right pill.
const RTL_NAME = new Set(['Kashmiri', 'Urdu']);

// Two concentric ellipses, so 22 markers spread without the hand-written -1..-9 rules
// the template uses for nine. Percentages, because .research-indic-orbit is inset:0.
//
// Each marker carries its language name, not just a glyph -- 22 unfamiliar scripts with
// no labels is a guessing game. Named markers are much wider than the template's 2.15rem
// bubbles, so the rings are set wide and the counts split to keep the labels from
// colliding; a test asserts they do not.
const RINGS = [
  { count: 13, rx: 39, ry: 40 },
  { count: 9, rx: 19, ry: 19 },
];

const layout = () => {
  const spots = [];
  let i = 0;
  for (const [ring, { count, rx, ry }] of RINGS.entries()) {
    // Offset the inner ring by half a step so markers do not line up radially.
    const phase = ring * (Math.PI / count);
    for (let n = 0; n < count && i < LANGS.length; n += 1, i += 1) {
      const t = phase + (n / count) * Math.PI * 2 - Math.PI / 2;
      spots.push({
        lang: LANGS[i],
        left: 50 + Math.cos(t) * rx,
        top: 50 + Math.sin(t) * ry,
        ring,
      });
    }
  }
  return spots;
};

const LanguageConstellation = () => {
  const [data, setData] = useState(null);
  const [active, setActive] = useState('Hindi');
  const [hover, setHover] = useState(null);
  const panelId = useId();
  const spots = useMemo(layout, []);

  useEffect(() => {
    let live = true;
    import('../data/examples.json').then((m) => {
      if (live) setData(m.default);
    });
    return () => {
      live = false;
    };
  }, []);

  const highlight = hover ?? active;
  const d = data?.[active];
  // The same display order the examples browser uses, so the sentence on the map and the
  // one the browser opens on are the same example rather than drifting apart.
  const item = orderSentences(active, d?.translation ?? [])[0];

  return (
    <div className="constellation-wrap">
      {/* The narration used to be an sr-only paragraph here. It duplicated the section
          intro, and select-all copied it into the visible text, so it is now an
          aria-label on the field itself -- same accessible name, nothing to copy. The
          sr-only list at the foot still carries all 22 languages in prose. */}
      <div
        className="research-featured-gradient research-language-constellation constellation-field"
        role="group"
        aria-label="All 22 languages of the Eighth Schedule, across 12 scripts"
      >
        <div className="research-indic-orbit constellation-orbit">
          {spots.map(({ lang, left, top, ring }, i) => (
            <button
              key={lang}
              type="button"
              className={`constellation-glyph${
                lang === active ? ' is-active' : ''
              }${lang === highlight ? ' is-highlight' : ''}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${(i % 7) * 0.42 + ring * 0.2}s`,
              }}
              aria-pressed={lang === active}
              aria-describedby={panelId}
              aria-label={`${lang}, ${LANG_ABBR[lang]}`}
              data-len={LANG_ABBR[lang].length}
              onClick={() => setActive(lang)}
              onFocus={() => setActive(lang)}
              onMouseEnter={() => setHover(lang)}
              onMouseLeave={() => setHover(null)}
            >
              {/* The disc carries the English code and the label the endonym. The
                  aria-label above still leads with the English name, so assistive tech
                  and in-page search keep a handle the reader can type. */}
              <span className="constellation-glyph-mark" aria-hidden="true">
                {LANG_ABBR[lang]}
              </span>
              <span
                className="constellation-glyph-name"
                lang={LANG_CODE[lang]}
                dir={RTL_NAME.has(lang) ? 'rtl' : undefined}
              >
                {ENDONYM[lang]}
              </span>
            </button>
          ))}
        </div>

        <p className="constellation-centre" aria-hidden="true">
          <span className="constellation-count">22</span>
          <span className="constellation-count-label">languages · 12 scripts</span>
        </p>

        {/* Sighted readers had no cue that the pills were clickable once the instruction
            left the intro copy. It sits in the bottom-right corner rather than the middle
            of the field: the centre already carries the count, and a second block there
            crowded the canvas. aria-hidden because the buttons are already reachable and
            self-describing to assistive tech. */}
        <p className="constellation-hint" aria-hidden="true">
          Select a language to read its translation
        </p>
      </div>

      <div id={panelId} className="constellation-detail" tabIndex={-1}>
        <p className="constellation-detail-kicker">Selected language</p>
        <p className="constellation-detail-title">
          {active}
          {d && <span className="constellation-detail-script">{d.script}</span>}
        </p>
        {item ? (
          <>
            <div className="ex-line">
              <span className="ex-line-tag">EN</span>
              <p lang="en">{item.en}</p>
            </div>
            <div className="ex-line ex-out">
              <span className="ex-line-tag">{LANG_ABBR[active]}</span>
              <p lang={LANG_CODE[active]} dir={d.rtl ? 'rtl' : undefined}>
                {item.native}
              </p>
            </div>
          </>
        ) : (
          <p className="research-type-body-small">Loading examples…</p>
        )}
      </div>

      {/* The constellation must not be the only way to read this. */}
      <ul className="sr-only">
        {LANGS.map((lang) => (
          <li key={lang}>
            {lang} ({LANG_ABBR[lang]}), {data?.[lang]?.script ?? 'script loading'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageConstellation;
