import { useEffect, useMemo, useRef, useState } from 'react';
import { LANG_ABBR, LANG_CODE, LANGS, DOC_SUBTYPE_LABELS } from '../data/evals';
import { DevNote } from '../lib/devNotes';
import { mdToHtml } from '../lib/mdToHtml';
import { DEFAULT_LANG, SUBTYPES, defaultsFor, dropped, vetted } from '../lib/exampleSelection';
import { useScrollSync } from '../lib/useScrollSync';
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

/**
 * One source/output line.
 *
 * The flash fires on change, never on re-render. In the old page this was an
 * explicit text comparison in setText(); it mattered because switching language
 * leaves some lines identical, and flashing those made the whole panel strobe.
 */
export const ExLine = ({ tag, text, lang, dir, out }) => {
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

// Previous / counter / next, wrapping at both ends. Replaced a row of 7px dots,
// which were hard to hit and said nothing about how many examples there were.
const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'prev' ? <path d="m15 6-6 6 6 6" /> : <path d="m9 6 6 6-6 6" />}
  </svg>
);

export const Pager = ({ count, active, onPick, label }) => {
  if (count <= 1) return null;
  const go = (delta) => onPick((active + delta + count) % count);
  return (
    <div className="ex-pager" role="group" aria-label={label}>
      <button type="button" className="ex-pager-btn" aria-label={`Previous ${label.toLowerCase()} example`} onClick={() => go(-1)}>
        <Chevron dir="prev" />
      </button>
      <span className="ex-pager-count" aria-live="polite">
        <span className="ex-pager-now">{active + 1}</span>
        <span className="ex-pager-sep">/</span>
        {count}
      </span>
      <button type="button" className="ex-pager-btn" aria-label={`Next ${label.toLowerCase()} example`} onClick={() => go(1)}>
        <Chevron dir="next" />
      </button>
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
export const RenderedDoc = ({ markdown, lang, className }) => {
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

export const LangPicker = ({ lang, onPick }) => {
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
        <Pager
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
        <Pager
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
            <Pager
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
        <Pager
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
