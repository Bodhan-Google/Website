import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Languages, Play, RotateCcw, Shuffle } from 'lucide-react';
import LangPicker from './LangPicker';
import SentenceStage from './SentenceStage';
import TranslitStage from './TranslitStage';
import CodeMixStage from './CodeMixStage';
import DocumentStage from './DocumentStage';
import { DOC_TYPES, MODES, TRANSLATE_API_URL, getLang } from './translateData';
import { tokenize } from './translateUtils';

const PHASE_LABEL = {
    idle: 'Ready',
    reading: 'Reading the source line',
    routing: 'Choosing a route',
    detecting: 'Detecting structure',
    translating: 'Translating',
    done: 'Done',
    loading: 'Calling the endpoint',
};

const EDITABLE = ['sentence', 'romanized', 'translit'];

/**
 * The try-it surface.
 *
 * Every string that appears here is real recorded model output; nothing is
 * generated in the browser. When TRANSLATE_API_URL is empty — which it is until
 * an endpoint is wired up — the demo replays those recordings and says so on
 * the surface rather than dressing a canned response up as live inference.
 */
const TranslateLiveDemo = ({ mode, onModeChange }) => {
    const [data, setData] = useState(null);
    const [lang, setLang] = useState('Hindi');
    const [index, setIndex] = useState(0);
    const [docType, setDocType] = useState('markdown');
    const [docView, setDocView] = useState('rendered');
    const [phase, setPhase] = useState('idle');
    const [playKey, setPlayKey] = useState(0);
    const [draft, setDraft] = useState(null);
    const [live, setLive] = useState(null);
    const [notice, setNotice] = useState('');
    const sectionRef = useRef(null);
    const seenRef = useRef(false);

    // 402 KB of recorded output across 22 languages, on its own chunk so it
    // stays off the page's critical path.
    useEffect(() => {
        let alive = true;
        import('./translateExamples.json').then((module) => {
            if (alive) setData(module.default);
        });
        return () => {
            alive = false;
        };
    }, []);

    const meta = getLang(lang);
    const entry = data?.[lang] ?? null;
    const modeSpec = MODES.find((m) => m.id === mode) ?? MODES[0];

    // ---- what this mode is showing right now -----------------------------

    const item = useMemo(() => {
        if (!entry) return null;
        if (mode === 'sentence') return entry.sentence[index % Math.max(1, entry.sentence.length)] ?? null;
        if (mode === 'romanized') return entry.romanized[index % Math.max(1, entry.romanized.length)] ?? null;
        if (mode === 'translit') {
            const items = entry.translit.items;
            return items[index % Math.max(1, items.length)] ?? null;
        }
        if (mode === 'codemix') return entry.codemix[0] ?? null;
        if (mode === 'indic') return entry.indic[index % Math.max(1, entry.indic.length)] ?? null;
        if (mode === 'document') return entry.document[docType] ?? null;
        return null;
    }, [entry, mode, index, docType]);

    const count = useMemo(() => {
        if (!entry) return 0;
        if (mode === 'sentence') return entry.sentence.length;
        if (mode === 'romanized') return entry.romanized.length;
        if (mode === 'translit') return entry.translit.items.length;
        if (mode === 'indic') return entry.indic.length;
        return 0;
    }, [entry, mode]);

    const recordedSource = useMemo(() => {
        if (!item) return '';
        if (mode === 'translit') return item.src;
        if (mode === 'indic') return item.src;
        if (mode === 'codemix') return item.en;
        if (mode === 'document') return item.en;
        return item.en;
    }, [item, mode]);

    const recordedOutput = useMemo(() => {
        if (!item) return '';
        if (mode === 'codemix') return item.mix;
        return item.out;
    }, [item, mode]);

    const editable = EDITABLE.includes(mode);
    // `live` holds an endpoint response; `draft` holds whatever is in the box.
    const shownSource = editable && draft !== null ? draft : recordedSource;
    const shownOutput = live?.output ?? recordedOutput;

    // Reset the box whenever the thing being demonstrated changes.
    useEffect(() => {
        setDraft(null);
        setLive(null);
        setNotice('');
        setPhase('idle');
    }, [mode, lang, index, docType]);

    // Transliteration churns word by word only when the two lines agree on how
    // many words there are; otherwise it falls back to churning the whole line
    // at once. Open on an example that gets the per-word treatment when the
    // language has one, so the default view shows the better animation.
    useEffect(() => {
        if (mode === 'translit' && entry) {
            const paired = entry.translit.items.findIndex(
                (item) => tokenize(item.src).length === tokenize(item.out).length
            );
            setIndex(paired > 0 ? paired : 0);
            return;
        }
        setIndex(0);
    }, [mode, lang, entry]);

    // ---- running it ------------------------------------------------------

    const run = useCallback(async () => {
        setNotice('');

        const custom = editable && draft !== null && draft.trim() && draft.trim() !== recordedSource.trim();

        if (custom && TRANSLATE_API_URL) {
            setPhase('loading');
            try {
                const response = await fetch(TRANSLATE_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: draft, source: 'English', target: lang, task: mode }),
                });
                if (!response.ok) throw new Error(String(response.status));
                const payload = await response.json();
                setLive({ output: payload.output ?? '' });
            } catch {
                setLive(null);
                setNotice('The endpoint did not answer. Showing the recorded example instead.');
                setDraft(null);
            }
        } else if (custom) {
            // No endpoint is configured, so there is nothing that could
            // translate this. Say that plainly instead of faking a result.
            setNotice(
                'Free text needs a live inference endpoint, which this page is not wired to yet — showing the recorded example instead.'
            );
            setDraft(null);
            setLive(null);
        }

        setPlayKey((key) => key + 1);
    }, [draft, editable, lang, mode, recordedSource]);

    // The demo plays itself once, the first time it is scrolled to.
    useEffect(() => {
        const node = sectionRef.current;
        if (!node || !data || typeof IntersectionObserver === 'undefined') return undefined;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting) && !seenRef.current) {
                    seenRef.current = true;
                    setPlayKey((key) => key + 1);
                }
            },
            { threshold: 0.35 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [data]);

    // ---- the metric line -------------------------------------------------

    const metric = useMemo(() => {
        if (!item) return null;
        if (mode === 'sentence') return { label: 'LLM judge', value: `${item.score}/5` };
        if (mode === 'document') return { label: 'LLM judge', value: `${item.score}/100` };
        if (mode === 'romanized') return { label: 'chrF++', value: String(item.score) };
        if (mode === 'indic') return { label: 'Score', value: String(item.score) };
        if (mode === 'codemix') return { label: 'Metric', value: 'none yet' };
        return null;
    }, [item, mode]);

    const title = modeSpec.title
        .replace('{lang}', lang)
        .replace('{from}', mode === 'indic' && item ? item.from : 'Indic');

    if (!data) {
        return (
            <section className="itr-section itr-demo-section" id="demo">
                <div className="itr-container">
                    <div className="itr-demo is-loading">
                        <Languages size={18} aria-hidden="true" />
                        <p>Loading recorded model output…</p>
                    </div>
                </div>
            </section>
        );
    }

    const stage = (() => {
        if (!item) {
            return (
                <div className="itr-stage itr-stage-empty">
                    <p>No recorded example of this kind for {lang} yet. Try another language or capability.</p>
                </div>
            );
        }

        if (mode === 'document') {
            return (
                <DocumentStage
                    key={`${lang}-${docType}-${docView}`}
                    en={item.en}
                    out={item.out}
                    lang={meta.code}
                    rtl={item.rtl ?? meta.rtl}
                    view={docView}
                    scriptNote={item.scriptNote}
                    playKey={playKey}
                    onPhase={setPhase}
                />
            );
        }

        if (mode === 'translit') {
            return (
                <TranslitStage
                    key={`${lang}-${index}`}
                    source={shownSource}
                    output={shownOutput}
                    srcLabel={meta.script}
                    outLabel="Latin"
                    srcLang={meta.code}
                    srcRtl={meta.rtl}
                    cer={item.cer ?? 0}
                    wer={item.wer ?? 0}
                    playKey={playKey}
                    onPhase={setPhase}
                />
            );
        }

        if (mode === 'codemix') {
            return (
                <CodeMixStage
                    key={lang}
                    en={item.en}
                    native={item.native}
                    mix={item.mix}
                    langAbbr={meta.abbr}
                    langCode={meta.code}
                    rtl={meta.rtl}
                    playKey={playKey}
                    onPhase={setPhase}
                    unavailable={!entry?.codemix?.length}
                />
            );
        }

        if (mode === 'indic') {
            const from = getLang(item.from);
            return (
                <SentenceStage
                    key={`${lang}-${index}`}
                    source={shownSource}
                    output={shownOutput}
                    srcTag={from.abbr}
                    outTag={meta.abbr}
                    srcLang={from.code}
                    outLang={meta.code}
                    srcRtl={from.rtl}
                    outRtl={meta.rtl}
                    tone="teal"
                    pivot="via EN"
                    playKey={playKey}
                    onPhase={setPhase}
                    footnote={`${item.from} straight into ${lang}. The model was never trained on this pair as a pair.`}
                />
            );
        }

        const roman = mode === 'romanized';
        return (
            <SentenceStage
                key={`${mode}-${lang}-${index}`}
                source={shownSource}
                output={shownOutput}
                srcTag="EN"
                outTag={roman ? `${meta.abbr} · Roman` : meta.abbr}
                srcLang="en"
                outLang={roman ? undefined : meta.code}
                outRtl={roman ? false : meta.rtl}
                tone={roman ? 'violet' : 'saffron'}
                playKey={playKey}
                onPhase={setPhase}
                footnote={
                    roman
                        ? `Latin script throughout — typable on any keyboard, with no ${meta.script} step in between.`
                        : undefined
                }
            />
        );
    })();

    return (
        <section className="itr-section itr-demo-section" id="demo" ref={sectionRef}>
            <div className="itr-container">
                <header className="itr-head itr-reveal">
                    <p className="itr-eyebrow">Try it</p>
                    <h2 className="itr-h2">
                        Watch it <span className="itr-grad">translate</span>.
                    </h2>
                    <p className="itr-lede">
                        Six capabilities, twenty-two languages, and a different piece of motion for each — because
                        reordering a clause, re-spelling a word and holding a table together are not the same
                        operation.
                    </p>
                </header>

                <div className="itr-demo itr-reveal">
                    <nav className="itr-mode-tabs" aria-label="Capability">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                className={`itr-mode-tab${mode === m.id ? ' is-active' : ''}`}
                                aria-pressed={mode === m.id}
                                onClick={() => onModeChange(m.id)}
                            >
                                {m.label}
                            </button>
                        ))}
                    </nav>

                    <div className="itr-demo-head">
                        <div>
                            <h3 className="itr-demo-title">{title}</h3>
                            <p className="itr-demo-hint">{modeSpec.hint}</p>
                        </div>
                        <LangPicker value={lang} onChange={setLang} />
                    </div>

                    <div className="itr-demo-bar">
                        {mode === 'document' ? (
                            <>
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
                                <div className="itr-seg" role="group" aria-label="Markup or rendered">
                                    {[
                                        ['rendered', 'Rendered'],
                                        ['markup', 'Markup'],
                                    ].map(([id, label]) => (
                                        <button
                                            key={id}
                                            type="button"
                                            className={`itr-seg-btn${docView === id ? ' is-active' : ''}`}
                                            aria-pressed={docView === id}
                                            onClick={() => setDocView(id)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : null}

                        {count > 1 ? (
                            <button
                                type="button"
                                className="itr-btn itr-btn-quiet"
                                onClick={() => setIndex((i) => (i + 1) % count)}
                            >
                                <Shuffle size={13} aria-hidden="true" />
                                Another example
                                <span className="itr-btn-count">
                                    {(index % count) + 1}/{count}
                                </span>
                            </button>
                        ) : null}

                        <div className="itr-demo-actions">
                            <span className="itr-phase" data-phase={phase}>
                                <span className="itr-phase-dot" aria-hidden="true" />
                                {PHASE_LABEL[phase] ?? phase}
                            </span>
                            <button type="button" className="itr-btn itr-btn-primary" onClick={run}>
                                {phase === 'done' ? (
                                    <RotateCcw size={14} aria-hidden="true" />
                                ) : (
                                    <Play size={14} aria-hidden="true" />
                                )}
                                {phase === 'done' ? 'Run again' : 'Translate'}
                            </button>
                        </div>
                    </div>

                    {editable && item ? (
                        <label className="itr-input">
                            <span className="itr-input-label">
                                Source · {mode === 'translit' ? meta.script : 'English'}
                            </span>
                            <textarea
                                value={shownSource}
                                spellCheck={false}
                                rows={2}
                                lang={mode === 'translit' ? meta.code : 'en'}
                                onChange={(event) => setDraft(event.target.value)}
                            />
                        </label>
                    ) : null}

                    {notice ? <p className="itr-notice">{notice}</p> : null}

                    <div className="itr-demo-stage">{stage}</div>

                    <div className="itr-demo-foot">
                        {metric ? (
                            <span className="itr-badge">
                                <b>{metric.label}</b> {metric.value}
                            </span>
                        ) : null}
                        <span className="itr-badge is-quiet">Recorded output, replayed</span>
                        <p className="itr-demo-note">
                            Each example is the best-scoring recorded output for that language and capability, so
                            these are the model at its strongest rather than its average.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TranslateLiveDemo;
