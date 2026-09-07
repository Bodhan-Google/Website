import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import EXAMPLES from '../../data/translateExamples.json';
import { assetUrl } from '../../data/assetUrl';
import { CONSOLE_URL } from '../../../../config/links';

const MODES = [
    { id: 'document', label: 'Document' },
    { id: 'sentence', label: 'Sentence' },
    { id: 'romanized', label: 'Romanized' },
    { id: 'transliteration', label: 'Transliteration' },
];

const { languages } = EXAMPLES;
const DEFAULT_LANG = languages.find((l) => l.id === 'hindi') ?? languages[0];

const TranslatePlayground = () => {
    const [langId, setLangId] = useState(DEFAULT_LANG.id);
    const [mode, setMode] = useState('document');
    const [docIndex, setDocIndex] = useState(0);
    const [rowIndex, setRowIndex] = useState(0);
    // langId -> documents; undefined means "not fetched yet", [] means none/failed
    const [docsByLang, setDocsByLang] = useState({});

    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const syncing = useRef(false);

    const language = useMemo(() => languages.find((l) => l.id === langId) ?? DEFAULT_LANG, [langId]);

    const docs = docsByLang[langId];
    // derived rather than stored, so the effect never sets state synchronously
    const loading = mode === 'document' && docs === undefined;

    // Documents are ~24 KB each, so they live in /public and are fetched per
    // language rather than bundled. Each language is fetched at most once.
    useEffect(() => {
        if (mode !== 'document' || docsByLang[langId] !== undefined) return undefined;

        let cancelled = false;
        const record = (data) => {
            if (!cancelled) setDocsByLang((prev) => ({ ...prev, [langId]: data }));
        };

        fetch(assetUrl(`examples/translate/${langId}.json`))
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
            .then(record)
            .catch(() => record([]));

        return () => {
            cancelled = true;
        };
    }, [langId, mode, docsByLang]);

    const selectLanguage = (id) => {
        setLangId(id);
        setDocIndex(0);
        setRowIndex(0);
    };

    // Stable handlers that read the refs when the event fires, never during render.
    const mirror = useCallback((source, target) => {
        if (syncing.current || !source || !target) return;

        const sourceRange = source.scrollHeight - source.clientHeight;
        const targetRange = target.scrollHeight - target.clientHeight;
        if (sourceRange <= 0 || targetRange <= 0) return;

        syncing.current = true;
        target.scrollTop = (source.scrollTop / sourceRange) * targetRange;
        window.requestAnimationFrame(() => {
            syncing.current = false;
        });
    }, []);

    const onLeftScroll = useCallback(() => mirror(leftRef.current, rightRef.current), [mirror]);
    const onRightScroll = useCallback(() => mirror(rightRef.current, leftRef.current), [mirror]);

    const rows = mode === 'document' ? [] : EXAMPLES[mode]?.[langId] ?? [];
    const row = rows[Math.min(rowIndex, Math.max(rows.length - 1, 0))];
    const doc = docs?.[Math.min(docIndex, Math.max((docs?.length ?? 1) - 1, 0))];
    const outDir = language.rtl ? 'rtl' : undefined;

    return (
        <div className="pg-breakout">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card">
                    <div className="pg-main">
                        <div className="tp-bar">
                            <div className="dp-view-tabs" role="tablist" aria-label="Example type">
                                {MODES.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={mode === m.id}
                                        className={mode === m.id ? 'is-active' : undefined}
                                        onClick={() => setMode(m.id)}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>

                            <p className="tp-direction">
                                English <span aria-hidden="true">→</span>{' '}
                                <b lang={language.tag}>{language.native}</b>
                            </p>
                        </div>

                        {mode === 'document' ? (
                            <>
                                {docs && docs.length > 0 && (
                                    <div className="tp-doc-picker">
                                        {docs.map((d, i) => (
                                            <button
                                                key={d.title}
                                                type="button"
                                                className={i === docIndex ? 'is-active' : undefined}
                                                onClick={() => setDocIndex(i)}
                                                title={d.title}
                                            >
                                                {d.subtype}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {loading && (
                                    <div className="tp-loading">
                                        <Loader2 size={16} className="tp-spin" aria-hidden="true" />
                                        Loading {language.name} documents…
                                    </div>
                                )}

                                {doc && (
                                    <>
                                        <p className="tp-doc-title">
                                            {doc.title}
                                            {doc.score != null && <span className="tp-score">{doc.score}/100</span>}
                                        </p>

                                        <div className="tp-panes">
                                            <section className="tp-pane">
                                                <p className="tp-pane-label">English source</p>
                                                <div
                                                    className="tp-scroll dp-markdown"
                                                    ref={leftRef}
                                                    onScroll={onLeftScroll}
                                                >
                                                    <ReactMarkdown>{doc.source}</ReactMarkdown>
                                                </div>
                                            </section>

                                            <section className="tp-pane">
                                                <p className="tp-pane-label">{language.name} output</p>
                                                <div
                                                    className="tp-scroll dp-markdown"
                                                    lang={language.tag}
                                                    dir={outDir}
                                                    ref={rightRef}
                                                    onScroll={onRightScroll}
                                                >
                                                    <ReactMarkdown>{doc.output}</ReactMarkdown>
                                                </div>
                                            </section>
                                        </div>
                                        <p className="tp-hint">Scroll either pane — the other follows.</p>
                                    </>
                                )}

                                {docs && docs.length === 0 && !loading && (
                                    <p className="tp-loading">No documents for {language.name} yet.</p>
                                )}
                            </>
                        ) : (
                            <>
                                {rows.length > 1 && (
                                    <div className="tp-doc-picker">
                                        {rows.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                className={i === rowIndex ? 'is-active' : undefined}
                                                onClick={() => setRowIndex(i)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {row ? (
                                    <div className="tp-pair">
                                        <section className="tp-pane">
                                            <p className="tp-pane-label">
                                                {mode === 'transliteration' ? row.direction ?? 'Source' : 'English source'}
                                            </p>
                                            <p className="tp-text">{row.source}</p>
                                        </section>

                                        <section className="tp-pane is-output">
                                            <p className="tp-pane-label">
                                                {mode === 'romanized'
                                                    ? 'Romanized output'
                                                    : mode === 'transliteration'
                                                      ? 'Output'
                                                      : `${language.name} output`}
                                                {row.score != null && <span className="tp-score">{row.score}</span>}
                                                {row.cer != null && <span className="tp-score">CER {row.cer}</span>}
                                            </p>
                                            <p
                                                className="tp-text"
                                                lang={mode === 'romanized' ? 'en' : language.tag}
                                                dir={mode === 'romanized' ? undefined : outDir}
                                            >
                                                {row.output}
                                            </p>
                                        </section>
                                    </div>
                                ) : (
                                    <p className="tp-loading">No {mode} examples for {language.name} yet.</p>
                                )}
                            </>
                        )}
                    </div>

                    <aside className="pg-rail">

                        <div className="pg-rail-list tp-lang-list">
                            {languages.map((l) => (
                                <button
                                    key={l.id}
                                    type="button"
                                    className={`tp-lang${langId === l.id ? ' is-active' : ''}`}
                                    aria-pressed={langId === l.id}
                                    onClick={() => selectLanguage(l.id)}
                                >
                                    <span className="tp-lang-native" lang={l.tag}>
                                        {l.native}
                                    </span>
                                    <span className="tp-lang-name">{l.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="pg-rail-foot">
                            <p>Want to run this model?</p>
                            <a
                                href={CONSOLE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="model-cta-primary model-cta-small model-cta-dark"
                            >
                                Go to API Console
                                <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TranslatePlayground;
