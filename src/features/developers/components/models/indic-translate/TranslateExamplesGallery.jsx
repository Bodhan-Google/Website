import { useEffect, useMemo, useRef, useState } from 'react';
import { canAnimate, gsap } from '../../../../../utils/motion';
import DocBlocks from './DocBlocks';
import LangPicker from './LangPicker';
import { DOC_TYPES, getLang } from './translateData';
import { prefersReducedMotion } from './translateUtils';

/**
 * The specimen sheet: one language, every capability, all real recorded output.
 *
 * Where the demo above is about watching a translation happen, this is about
 * reading what came out — so nothing here animates on a timeline. The only
 * motion is a flash on the lines whose text actually changed when you switch
 * language, which is the one thing a reader can otherwise miss: switching from
 * Hindi to Marathi leaves several lines identical, and flashing all of them
 * would make the whole sheet strobe.
 */

const ExLine = ({ tag, text, lang, rtl, out, tone }) => {
    const ref = useRef(null);
    const previous = useRef(text);

    useEffect(() => {
        if (previous.current === text) return undefined;
        previous.current = text;
        if (!ref.current || !canAnimate()) return undefined;
        const tween = gsap.fromTo(ref.current, { '--flash': 1 }, { '--flash': 0, duration: 1, ease: 'power2.out' });
        return () => tween.kill();
    }, [text]);

    return (
        <div className={`itr-ex-line${out ? ' is-out' : ''}`} data-tone={tone} ref={ref}>
            <span className="itr-ex-tag">{tag}</span>
            <p lang={lang} dir={rtl ? 'rtl' : undefined}>
                {text}
            </p>
        </div>
    );
};

const Dots = ({ count, active, onPick, label }) => {
    if (count <= 1) return null;
    return (
        <div className="itr-ex-dots" role="group" aria-label={label}>
            {Array.from({ length: count }, (_, i) => (
                <button
                    key={i}
                    type="button"
                    className="itr-ex-dot"
                    aria-current={i === active ? 'true' : undefined}
                    aria-label={`${label}, example ${i + 1} of ${count}`}
                    onClick={() => onPick(i)}
                />
            ))}
        </div>
    );
};

const Card = ({ num, title, note, metric, children, wide }) => (
    <article className={`itr-ex-card${wide ? ' is-wide' : ''}`}>
        <header className="itr-ex-card-head">
            <span className="itr-ex-num">{num}</span>
            <h3>{title}</h3>
            {metric ? (
                <span className="itr-badge is-small">
                    <b>{metric.label}</b> {metric.value}
                </span>
            ) : null}
        </header>
        {children}
        {note ? <p className="itr-ex-note">{note}</p> : null}
    </article>
);

/** Two document panes whose scroll positions mirror each other. */
const DocPair = ({ item, meta, view }) => {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const syncing = useRef(false);

    const mirror = (source, target) => {
        if (syncing.current || !source || !target) return;
        const sourceRange = source.scrollHeight - source.clientHeight;
        const targetRange = target.scrollHeight - target.clientHeight;
        if (sourceRange <= 0 || targetRange <= 0) return;
        syncing.current = true;
        target.scrollTop = (source.scrollTop / sourceRange) * targetRange;
        window.requestAnimationFrame(() => {
            syncing.current = false;
        });
    };

    return (
        <>
            <div className="itr-ex-doc-pair">
                <div className="itr-ex-pane">
                    <p className="itr-ex-pane-tag">Source · EN</p>
                    <div
                        className="itr-ex-pane-scroll"
                        ref={leftRef}
                        onScroll={() => mirror(leftRef.current, rightRef.current)}
                    >
                        <DocBlocks text={item.en} lang="en" view={view} />
                    </div>
                </div>
                <div className="itr-ex-pane is-out">
                    <p className="itr-ex-pane-tag">Output · {meta.abbr}</p>
                    <div
                        className="itr-ex-pane-scroll"
                        ref={rightRef}
                        onScroll={() => mirror(rightRef.current, leftRef.current)}
                    >
                        <DocBlocks
                            text={item.out}
                            lang={meta.code}
                            rtl={item.rtl ?? meta.rtl}
                            view={view}
                        />
                    </div>
                </div>
            </div>
            <p className="itr-ex-hint">Scroll either pane — the other follows.</p>
        </>
    );
};

const TranslateExamplesGallery = () => {
    const [data, setData] = useState(null);
    const [lang, setLang] = useState('Tamil');
    const [docType, setDocType] = useState('markdown');
    const [view, setView] = useState('rendered');
    const [dots, setDots] = useState({ sentence: 0, romanized: 0, translit: 0, indic: 0 });
    const gridRef = useRef(null);

    useEffect(() => {
        let alive = true;
        import('./translateExamples.json').then((module) => {
            if (alive) setData(module.default);
        });
        return () => {
            alive = false;
        };
    }, []);

    // Cards arrive on scroll, once.
    useEffect(() => {
        if (!data || prefersReducedMotion()) return undefined;
        const cards = gridRef.current?.querySelectorAll('.itr-ex-card');
        if (!cards?.length) return undefined;
        const tween = gsap.fromTo(
            cards,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out' }
        );
        // These cards are the whole section. If the ticker is suspended — a
        // background tab, or an article embedding this on a page that is not
        // being painted — the fade would strand every one of them at opacity 0.
        if (!canAnimate()) tween.progress(1);
        return () => tween.kill();
    }, [data]);

    const meta = getLang(lang);
    const entry = data?.[lang] ?? null;

    const pick = (key, i) => setDots((current) => ({ ...current, [key]: i }));
    const clamp = (key, list) => Math.min(dots[key], Math.max(0, (list?.length ?? 1) - 1));

    const chosen = useMemo(() => {
        if (!entry) return null;
        const si = clamp('sentence', entry.sentence);
        const ri = clamp('romanized', entry.romanized);
        const ti = clamp('translit', entry.translit.items);
        const ii = clamp('indic', entry.indic);
        return {
            sentence: entry.sentence[si],
            romanized: entry.romanized[ri],
            translit: entry.translit.items[ti],
            indic: entry.indic[ii],
            codemix: entry.codemix[0] ?? null,
            document: entry.document[docType] ?? null,
            si,
            ri,
            ti,
            ii,
        };
        // dots participate through clamp; entry and docType are the real inputs.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entry, docType, dots]);

    if (!data || !entry || !chosen) {
        return (
            <section className="itr-section itr-examples" id="examples">
                <div className="itr-container">
                    <div className="itr-demo is-loading">
                        <p>Loading recorded model output…</p>
                    </div>
                </div>
            </section>
        );
    }

    const indicFrom = getLang(chosen.indic?.from ?? 'Hindi');

    return (
        <section className="itr-section itr-examples" id="examples">
            <div className="itr-container">
                <header className="itr-head itr-reveal">
                    <p className="itr-eyebrow">Examples</p>
                    <h2 className="itr-h2">
                        Pick a language. Read the <span className="itr-grad">real output</span>.
                    </h2>
                    <p className="itr-lede">
                        Every line below came out of the model and is reproduced unedited, including the places
                        where a digit stays Latin or a string literal stays English. Each is the best-scoring
                        recorded output for that language and capability.
                    </p>
                </header>

                <div className="itr-ex-bar itr-reveal">
                    <div className="itr-ex-bar-lang">
                        <LangPicker value={lang} onChange={setLang} />
                        <span className="itr-ex-script">{entry.script} script</span>
                    </div>
                    <div className="itr-seg" role="group" aria-label="Markup or rendered">
                        {[
                            ['rendered', 'Rendered'],
                            ['markup', 'Markup'],
                        ].map(([id, label]) => (
                            <button
                                key={id}
                                type="button"
                                className={`itr-seg-btn${view === id ? ' is-active' : ''}`}
                                aria-pressed={view === id}
                                onClick={() => setView(id)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="itr-ex-grid" ref={gridRef}>
                    <Card
                        num="01"
                        title="Sentence translation"
                        metric={{ label: 'LLM judge', value: `${chosen.sentence.score}/5` }}
                    >
                        <ExLine tag="EN" text={chosen.sentence.en} lang="en" tone="slate" />
                        <ExLine
                            tag={meta.abbr}
                            text={chosen.sentence.out}
                            lang={meta.code}
                            rtl={meta.rtl}
                            tone="saffron"
                            out
                        />
                        <Dots
                            count={entry.sentence.length}
                            active={chosen.si}
                            onPick={(i) => pick('sentence', i)}
                            label="Sentence translation"
                        />
                    </Card>

                    <Card
                        num="02"
                        title="Romanized translation"
                        note="English straight into Latin-script Indic text, with no native-script step in between."
                        metric={{ label: 'chrF++', value: String(chosen.romanized.score) }}
                    >
                        <ExLine tag="EN" text={chosen.romanized.en} lang="en" tone="slate" />
                        <ExLine tag="RO" text={chosen.romanized.out} tone="violet" out />
                        <Dots
                            count={entry.romanized.length}
                            active={chosen.ri}
                            onPick={(i) => pick('romanized', i)}
                            label="Romanized translation"
                        />
                    </Card>

                    <Card
                        num="03"
                        title="Transliteration"
                        note="Same words, different script — nothing here is translated."
                        metric={{
                            label: 'CER / WER',
                            value: `${chosen.translit.cer.toFixed(2)} / ${chosen.translit.wer.toFixed(2)}`,
                        }}
                    >
                        <ExLine
                            tag={meta.abbr}
                            text={chosen.translit.src}
                            lang={meta.code}
                            rtl={meta.rtl}
                            tone="slate"
                        />
                        <ExLine tag="RO" text={chosen.translit.out} tone="magenta" out />
                        <Dots
                            count={entry.translit.items.length}
                            active={chosen.ti}
                            onPick={(i) => pick('translit', i)}
                            label="Transliteration"
                        />
                    </Card>

                    <Card
                        num="04"
                        title="Code-mixed translation"
                        note={
                            chosen.codemix
                                ? 'Not score-ranked: no automatic metric exists for code-mixed output yet.'
                                : undefined
                        }
                    >
                        {chosen.codemix ? (
                            <>
                                <ExLine tag="EN" text={chosen.codemix.en} lang="en" tone="slate" />
                                <ExLine
                                    tag={meta.abbr}
                                    text={chosen.codemix.native}
                                    lang={meta.code}
                                    rtl={meta.rtl}
                                    tone="slate"
                                />
                                <ExLine
                                    tag="MIX"
                                    text={chosen.codemix.mix}
                                    lang={meta.code}
                                    rtl={meta.rtl}
                                    tone="amber"
                                    out
                                />
                            </>
                        ) : (
                            <p className="itr-ex-empty">
                                The training data includes code-mixed text for {lang} alongside every other
                                language, but a captured example generation is only on hand for Hindi so far.
                            </p>
                        )}
                    </Card>

                    <Card
                        num="05"
                        title={`Indic → Indic (${indicFrom.name} → ${lang})`}
                        note="No pivot through English: the model goes straight from one Indian language to another."
                        metric={chosen.indic ? { label: 'Score', value: String(chosen.indic.score) } : null}
                    >
                        {chosen.indic ? (
                            <>
                                <ExLine
                                    tag={indicFrom.abbr}
                                    text={chosen.indic.src}
                                    lang={indicFrom.code}
                                    rtl={indicFrom.rtl}
                                    tone="slate"
                                />
                                <ExLine
                                    tag={meta.abbr}
                                    text={chosen.indic.out}
                                    lang={meta.code}
                                    rtl={meta.rtl}
                                    tone="teal"
                                    out
                                />
                                <Dots
                                    count={entry.indic.length}
                                    active={chosen.ii}
                                    onPick={(i) => pick('indic', i)}
                                    label="Indic to Indic"
                                />
                            </>
                        ) : (
                            <p className="itr-ex-empty">No recorded Indic → Indic example for {lang} yet.</p>
                        )}
                    </Card>

                    <Card
                        num="06"
                        title="Document translation"
                        wide
                        metric={chosen.document ? { label: 'LLM judge', value: `${chosen.document.score}/100` } : null}
                        note={
                            chosen.document
                                ? `Excerpted for length.${
                                      chosen.document.scriptNote
                                          ? ` Shown in ${chosen.document.scriptNote} script, the default for ${lang}.`
                                          : ''
                                  }`
                                : undefined
                        }
                    >
                        <div className="itr-ex-doc-bar">
                            <div className="itr-seg" role="group" aria-label="Document type">
                                {DOC_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        className={`itr-seg-btn${docType === type.id ? ' is-active' : ''}`}
                                        aria-pressed={docType === type.id}
                                        onClick={() => setDocType(type.id)}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                            {chosen.document ? (
                                <p className="itr-ex-doc-title">{chosen.document.title}</p>
                            ) : null}
                        </div>

                        {chosen.document ? (
                            <DocPair item={chosen.document} meta={meta} view={view} />
                        ) : (
                            <p className="itr-ex-empty">
                                No {DOC_TYPES.find((t) => t.id === docType)?.label} example for {lang} survived
                                selection. Try another document type.
                            </p>
                        )}
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default TranslateExamplesGallery;
