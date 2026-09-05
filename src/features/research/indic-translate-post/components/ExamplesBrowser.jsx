import { useEffect, useMemo, useRef, useState } from 'react';
import { LANG_ABBR, LANG_CODE, LANGS, DOC_SUBTYPE_LABELS } from '../data/evals';
import { VERDICTS } from '../data/verdicts';
import { DevNote } from '../lib/devNotes';
import { mdToHtml } from '../lib/mdToHtml';
import { sentencePerm, SENTENCE_FIRST } from '../data/exampleOrder';
import { renderMathIn } from '../lib/katexUtil';

/**
 * The per-language example browser: 22 languages across six capabilities, showing
 * each language's own top-scoring output.
 *
 * Ported from the old page's EX_STATE plus its six update* functions, which wrote
 * directly to the DOM. State here is React's, but two behaviours are kept
 * deliberately: a line flashes only when its text actually changed (see ExLine), and
 * every per-item script and direction override still applies.
 */

const SUBTYPES = Object.keys(DOC_SUBTYPE_LABELS);
const DEFAULT_LANG = 'Hindi';

/**
 * The annotators' verdicts, applied. Three rules, all from the vetting pass:
 *
 *   - Minor fix counts as approved, so 261 of the 274 verdicts are usable.
 *   - A rejected example is never shown. Unsure and unreviewed ones stay browsable --
 *     unreviewed items keep their existing order, which is by judge score, so the
 *     ranking a reader steps through is still meaningful.
 *   - The FIRST thing shown is a vetted one. For lists that means an index; for
 *     documents, which are chosen by a subtype toggle rather than by stepping a list,
 *     it means a subtype, so the default document type varies by language: most open on
 *     Markdown; Tamil opens on LaTeX because its Markdown example is not approved, and
 *     Hindi on Tables by the editorial preference below.
 *
 * Kashmiri is absent from VERDICTS on purpose -- the annotators flagged its sheet as
 * flipped -- so it falls through to the unvetted default, which is what these helpers
 * do for any language or category the workbook does not cover.
 */
const rule = (lang, cat) => VERDICTS[lang]?.[cat];

/**
 * The display permutation for a category. Only `translation` can carry an editorial
 * reorder (see src/data/exampleOrder.js); everything else keeps the generated order.
 * Returned as original indices, so the verdict data -- which is keyed by position in the
 * GENERATED order -- can be carried through it rather than silently desynced.
 */
const permOf = (lang, cat, list) =>
  (cat === 'translation'
    ? sentencePerm(lang, list)
    : Array.from({ length: list?.length ?? 0 }, (_, i) => i));

/** Indices (1-based in the workbook) to hide, as a 0-based Set of ORIGINAL indices. */
const dropped = (lang, cat) => {
  const d = rule(lang, cat)?.drop ?? [];
  return new Set(d.map((x) => (typeof x === 'number' ? x - 1 : x)));
};

/** Items minus the rejected ones, in display order. */
const vetted = (lang, cat, list) => {
  const drop = dropped(lang, cat);
  return permOf(lang, cat, list).filter((orig) => !drop.has(orig)).map((orig) => list[orig]);
};

/** Where a category should open, as an index into the VETTED list. */
const firstIndex = (lang, cat, list) => {
  const first = cat === 'translation' && SENTENCE_FIRST[lang] !== undefined
    ? SENTENCE_FIRST[lang]
    : rule(lang, cat)?.first;
  if (typeof first !== 'number') return 0;
  const drop = dropped(lang, cat);
  // `first` counts the ORIGINAL list; walk the display order and translate it into the
  // filtered, reordered one.
  let idx = 0;
  for (const orig of permOf(lang, cat, list)) {
    if (drop.has(orig)) continue;
    if (orig === first - 1) return idx;
    idx += 1;
  }
  return 0;
};

/**
 * Editorial preference for which document subtype a language opens on, overriding the
 * verdict-derived default. The verdict default is "the first APPROVED subtype in the
 * annotators' sheet order", which is a safety rule, not an editorial one -- among several
 * approved examples it just takes the earliest.
 *
 * Hindi is the language the section opens on, so its document is the first structured
 * translation most readers will ever see, and a table carries the structure-preservation
 * claim far better than a LaTeX derivation does.
 *
 * This can only ever REORDER approved material: the lookup below still requires the
 * subtype to exist and to have survived the drop list, so a preference naming a rejected
 * example falls through to the verdict default rather than surfacing it. Hindi's Tables
 * example is Approved with issue type None in the workbook; its Markdown one is Unsure
 * (omission), which is why the verdict default was LaTeX rather than Markdown.
 */
const DOC_SUBTYPE_PREFERRED = {
  Hindi: 'tables_and_images',
};

/** Which document subtype a language should open on. */
const firstSubtype = (lang, docs) => {
  const want = DOC_SUBTYPE_PREFERRED[lang];
  if (want && docs?.[want] && !dropped(lang, 'document').has(want)) return want;
  const first = rule(lang, 'document')?.first;
  if (typeof first === 'string' && docs?.[first]) return first;
  return SUBTYPES.find((k) => docs?.[k]) ?? SUBTYPES[0];
};

/** Every default for one language, in the shape the component's state wants. */
const defaultsFor = (lang, data) => {
  const d = data?.[lang] ?? {};
  return {
    dots: {
      translation: firstIndex(lang, 'translation', d.translation),
      romanized: firstIndex(lang, 'romanized', d.romanized),
      transliteration: firstIndex(lang, 'transliteration', d.transliteration?.items),
      codemix: firstIndex(lang, 'codemix', d.codemix),
    },
    docSubtype: firstSubtype(lang, d.document),
  };
};

/**
 * One source/output line.
 *
 * The flash fires on change, never on re-render. In the old page this was an
 * explicit text comparison in setText(); it mattered because switching language
 * leaves some lines identical, and flashing those made the whole panel strobe.
 */
const ExLine = ({ tag, text, lang, dir, out }) => {
  const ref = useRef(null);
  const previous = useRef(text);

  useEffect(() => {
    if (previous.current === text) return undefined;
    previous.current = text;
    const el = ref.current;
    if (!el) return undefined;
    el.classList.remove('ex-flash');
    void el.offsetWidth; // force a reflow so the animation restarts
    el.classList.add('ex-flash');
    // Clear it again when the animation ends. The old page left the class on
    // permanently; harmless to look at, but it means the DOM claims a line is
    // flashing long after it stopped, and nothing downstream can tell the two apart.
    const done = () => el.classList.remove('ex-flash');
    el.addEventListener('animationend', done, { once: true });
    return () => el.removeEventListener('animationend', done);
  }, [text]);

  return (
    <div ref={ref} className={`ex-line${out ? ' ex-out' : ''}`}>
      <span className="ex-line-tag">{tag}</span>
      <p lang={lang} dir={dir}>
        {text}
      </p>
    </div>
  );
};

const Dots = ({ count, active, onPick, label }) => {
  if (count <= 1) return null;
  return (
    <div className="ex-dots" role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className="ex-dot"
          aria-current={i === active ? 'true' : undefined}
          aria-label={`${label}, example ${i + 1} of ${count}`}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
};

const Category = ({ num, label, children, aside }) => (
  <div className="ex-cat">
    <p className="ex-cat-label">
      <span className="ex-cat-num">{num}</span>
      {label}
      {aside}
    </p>
    {children}
  </div>
);

/** Rendered Markdown/LaTeX, with KaTeX run over it once it is in the document. */
const RenderedDoc = ({ markdown, lang, className }) => {
  const ref = useRef(null);
  const html = useMemo(() => mdToHtml(markdown), [markdown]);

  useEffect(() => {
    renderMathIn(ref.current);
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      lang={lang}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const LangPicker = ({ lang, onPick }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="langpicker" ref={wrapRef}>
      <button
        type="button"
        className="langpicker-btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="langpicker-abbr">{LANG_ABBR[lang]}</span>
        <span className="langpicker-name">{lang}</span>
        <svg className="langpicker-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>
      <ul className={`langpicker-panel${open ? ' open' : ''}`} role="listbox">
        {LANGS.map((l) => (
          <li key={l} role="none">
            <button
              type="button"
              role="option"
              aria-selected={l === lang}
              className="langpicker-opt"
              onClick={() => {
                onPick(l);
                setOpen(false);
              }}
            >
              <span className="langpicker-opt-abbr">{LANG_ABBR[l]}</span>
              {l}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Two document panes that scroll as one, so a long translation can be read against
 * its source without chasing two scrollbars.
 *
 * Position is mapped as a FRACTION of each pane's own scrollable height, not copied
 * as a pixel offset: the English source and the Indic output are different lengths
 * (and different line heights), so a pixel copy pins the shorter pane to its bottom
 * while the longer one is still a screen behind.
 *
 * Writing `scrollTop` fires its own scroll event, which would drive the panes back
 * into each other, so the write is gated for one frame. The echo lands in the same
 * frame as the write, and the rAF releases the gate afterwards -- a plain boolean
 * with no release would deadlock the moment one pane has nothing to scroll.
 */
const useScrollSync = (deps) => {
  const src = useRef(null);
  const out = useRef(null);
  const locked = useRef(false);

  const follow = (event, from, to) => {
    // React attaches onScroll to the element itself (it does not bubble), but a
    // rendered table or code block inside the pane is its own scroller -- ignore it.
    if (!from || !to || event.target !== from || locked.current) return;
    locked.current = true;
    const fromMax = from.scrollHeight - from.clientHeight;
    const toMax = to.scrollHeight - to.clientHeight;
    to.scrollTop = fromMax > 0 ? (from.scrollTop / fromMax) * toMax : 0;
    requestAnimationFrame(() => {
      locked.current = false;
    });
  };

  // A different document, language or view makes the carried-over offset meaningless.
  useEffect(() => {
    [src.current, out.current].forEach((el) => {
      if (el) el.scrollTop = 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    source: {
      ref: src,
      onScroll: (e) => follow(e, src.current, out.current),
      'data-sync': 'source',
    },
    output: {
      ref: out,
      onScroll: (e) => follow(e, out.current, src.current),
      'data-sync': 'output',
    },
  };
};

const ExamplesBrowser = () => {
  const [data, setData] = useState(null);
  const [lang, setLang] = useState(DEFAULT_LANG);
  const [docSubtype, setDocSubtype] = useState(SUBTYPES[0]);
  const [docView, setDocView] = useState('rendered');
  const [dots, setDots] = useState({
    translation: 0,
    romanized: 0,
    transliteration: 0,
    codemix: 0,
  });

  // One pair of synced panes per view; both views are in the DOM at once, and
  // scrollTop on the hidden one is a no-op, so they cannot share a single pair.
  const markupSync = useScrollSync([lang, docSubtype, docView]);
  const renderedSync = useScrollSync([lang, docSubtype, docView]);

  // 640 KB of real model output across 22 languages. Loaded on its own chunk so it
  // stays off the critical path -- on the old page it blocked first paint.
  useEffect(() => {
    let live = true;
    import('../data/examples.json').then((m) => {
      if (!live) return;
      setData(m.default);
      // Seed the opening view from the default language's vetted defaults too, not just
      // on a later language switch.
      const d = defaultsFor(DEFAULT_LANG, m.default);
      setDocSubtype(d.docSubtype);
      setDots(d.dots);
    });
    return () => {
      live = false;
    };
  }, []);

  // Switching language re-seeds both selections from that language's vetted defaults,
  // rather than resetting to "first item, first subtype" -- which is how an unvetted or
  // rejected example used to end up as the first thing a reader saw.
  const pickLang = (next) => {
    setLang(next);
    const d = defaultsFor(next, data);
    setDocSubtype(d.docSubtype);
    setDots(d.dots);
  };
  const setDot = (key, i) => setDots((d) => ({ ...d, [key]: i }));

  if (!data) {
    return (
      <div className="chart-card" style={{ marginTop: 20 }}>
        <p className="research-type-body-small">Loading examples…</p>
      </div>
    );
  }

  const raw = data[lang];
  // Rejected examples are filtered out before anything indexes into these lists, so a
  // dot strip never has a gap and no index can land on one.
  const d = {
    ...raw,
    translation: vetted(lang, 'translation', raw.translation),
    romanized: vetted(lang, 'romanized', raw.romanized),
    codemix: vetted(lang, 'codemix', raw.codemix),
    transliteration: raw.transliteration && {
      ...raw.transliteration,
      items: vetted(lang, 'transliteration', raw.transliteration.items),
    },
    document: Object.fromEntries(
      Object.entries(raw.document ?? {})
        .filter(([k]) => !dropped(lang, 'document').has(k)),
    ),
  };
  const abbr = LANG_ABBR[lang];
  const code = LANG_CODE[lang];
  const rtlDir = d.rtl ? 'rtl' : undefined;

  const clamp = (key, list) => Math.min(dots[key], Math.max(0, list.length - 1));

  // 1 — Sentence translation
  const tIdx = clamp('translation', d.translation);
  const tItem = d.translation[tIdx];

  // 2 — Document translation
  const docItem = d.document[docSubtype];
  const docRtl = docItem && docItem.rtl !== undefined ? docItem.rtl : d.rtl;
  const docCode = docItem?.scriptNote === 'Perso-Arabic' ? 'ur' : code;

  // 3 — Romanized translation
  const rIdx = clamp('romanized', d.romanized);
  const rItem = d.romanized[rIdx];

  // 4 — Code-mixed translation
  const cList = d.codemix ?? [];
  const cIdx = clamp('codemix', cList);
  const cItem = cList[cIdx];

  // 5 — Transliteration
  const tlItems = d.transliteration.items;
  const tlIdx = clamp('transliteration', tlItems);
  const tlItem = tlItems[tlIdx];
  const tlIsXX = d.transliteration.dir === 'xx2roman';

  return (
    <div className="chart-card" style={{ marginTop: 20 }}>
      <div className="ex-panel-head">
        <div>
          <h3 className="chart-card-title">Examples by language</h3>
          <p className="chart-card-subtitle">{d.script}</p>
        </div>
        <LangPicker lang={lang} onPick={pickLang} />
      </div>

      <div className="chart-panel ex-panel">
      <Category num="1" label="Sentence translation">
        <ExLine tag="EN" text={tItem.en} lang="en" />
        <ExLine tag={abbr} text={tItem.native} lang={code} dir={rtlDir} out />
        <DevNote>
          Top-scoring sentence for {lang}, judge score {tItem.score}/5.
        </DevNote>
        <Dots
          count={d.translation.length}
          active={tIdx}
          onPick={(i) => setDot('translation', i)}
          label="Sentence translation"
        />
      </Category>

      <Category
        num="2"
        label="Document translation (excerpt)"
        aside={
          <span className="ex-view-toggle" role="group" aria-label="Markup or rendered">
            {[
              ['rendered', 'Rendered'],
              ['markup', 'Markup'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`ex-view-btn${docView === id ? ' is-active' : ''}`}
                aria-pressed={docView === id}
                onClick={() => setDocView(id)}
              >
                {label}
              </button>
            ))}
          </span>
        }
      >
        <div className="ex-doc-toggles">
          <span className="ex-view-toggle" role="group" aria-label="Document type">
            {SUBTYPES.map((s) => (
              <button
                key={s}
                type="button"
                className={`ex-view-btn${docSubtype === s ? ' is-active' : ''}`}
                aria-pressed={docSubtype === s}
                onClick={() => setDocSubtype(s)}
              >
                {DOC_SUBTYPE_LABELS[s]}
              </button>
            ))}
          </span>
        </div>

        {!docItem ? (
          <DevNote>
            No {DOC_SUBTYPE_LABELS[docSubtype]} example for {lang} survived selection. Try
            another document type or language.
          </DevNote>
        ) : (
          <>
            <p className="ex-doc-title">{docItem.title}</p>
            <div className="ex-doc-viewport" data-view={docView}>
              <div className="ex-doc-markup">
                <p className="ex-block-label">Source · EN</p>
                <div className="ex-doc-block" {...markupSync.source}>
                  <p lang="en">{docItem.en}</p>
                </div>
                <p className="ex-block-label" style={{ marginTop: 12 }}>
                  Output · {abbr}
                </p>
                <div
                  className="ex-doc-block"
                  dir={docRtl ? 'rtl' : undefined}
                  {...markupSync.output}
                >
                  <p lang={docCode}>{docItem.native}</p>
                </div>
              </div>
              <div className="ex-doc-rendered-wrap">
                <p className="ex-block-label">Source · EN</p>
                <div className="ex-doc-block" {...renderedSync.source}>
                  <RenderedDoc markdown={docItem.en} lang="en" className="ex-doc-rendered" />
                </div>
                <p className="ex-block-label" style={{ marginTop: 12 }}>
                  Output · {abbr}
                </p>
                <div
                  className="ex-doc-block"
                  dir={docRtl ? 'rtl' : undefined}
                  {...renderedSync.output}
                >
                  <RenderedDoc
                    markdown={docItem.native}
                    lang={docCode}
                    className="ex-doc-rendered"
                  />
                </div>
              </div>
            </div>
            <p className="ex-note">
              Excerpted here for length. The two panes scroll together.
              {docItem.scriptNote
                ? ` Shown in ${docItem.scriptNote} script, the default for ${lang}.`
                : ''}
            </p>
            <DevNote>
              Top-scoring {DOC_SUBTYPE_LABELS[docSubtype]} example for {lang}, judge score{' '}
              {docItem.score}/100.
            </DevNote>
          </>
        )}
      </Category>

      <Category num="3" label="Romanized translation (en → Roman)">
        <ExLine tag="EN" text={rItem.en} lang="en" />
        <ExLine tag="RO" text={rItem.roman} out />
        <DevNote>
          Top-scoring romanized output for {lang}, chrF++ {rItem.score}.
        </DevNote>
        <Dots
          count={d.romanized.length}
          active={rIdx}
          onPick={(i) => setDot('romanized', i)}
          label="Romanized translation"
        />
      </Category>

      <Category num="4" label="Code-mixed translation">
        {!cItem ? (
          <p className="ex-note">
            The training data includes code-mixed text for {lang} alongside every other
            language, but a captured example generation is only on hand for Hindi so far.
            Switch the language picker to Hindi to see a real one.
          </p>
        ) : (
          <>
            <ExLine tag="EN" text={cItem.en} lang="en" />
            <ExLine tag={abbr} text={cItem.native} lang={code} dir={rtlDir} />
            <ExLine tag="MIX" text={cItem.mix} lang={code} dir={rtlDir} out />
            <DevNote>
              Not score-ranked: no automatic metric exists yet for code-mixed output.
            </DevNote>
            <Dots
              count={cList.length}
              active={cIdx}
              onPick={(i) => setDot('codemix', i)}
              label="Code-mixed translation"
            />
          </>
        )}
      </Category>

      <Category
        num="5"
        label={`Transliteration (${tlIsXX ? 'native → Roman' : 'Roman → native'})`}
      >
        <ExLine
          tag={tlIsXX ? abbr : 'RO'}
          text={tlItem.src}
          lang={tlIsXX ? code : undefined}
          dir={tlIsXX ? rtlDir : undefined}
        />
        <ExLine
          tag={tlIsXX ? 'RO' : abbr}
          text={tlItem.out}
          lang={tlIsXX ? undefined : code}
          dir={tlIsXX ? undefined : rtlDir}
          out
        />
        {/* The per-example CER/WER line is gone. These are the top-scoring items per
            language, so 63 of the 66 read exactly "0.000, 0.000" -- a number that told the
            reader nothing and, repeated under every example, looked like a metric that had
            not been computed. The aggregate CER and WER still appear as charts in the
            Evaluation section, where they are measured over every scored sentence rather
            than over the one on screen. */}
        <Dots
          count={tlItems.length}
          active={tlIdx}
          onPick={(i) => setDot('transliteration', i)}
          label="Transliteration"
        />
      </Category>

      </div>
    </div>
  );
};

export default ExamplesBrowser;
