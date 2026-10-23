import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AlignLeft, ArrowLeftRight, ArrowUpRight, Blend, Check, Copy, FileText, Type } from 'lucide-react';
import { DOC_SUBTYPE_LABELS, LANG_ABBR, LANG_CODE } from '../../../research/indic-translate-post/data/evals';
import { post } from '../../../research/indic-translate-post/data/post';
import { ExLine, LangPicker, Pager, RenderedDoc } from '../../../research/indic-translate-post/components/ExamplesBrowser';
import {
    DEFAULT_LANG,
    SUBTYPES,
    defaultsFor,
    dropped,
    vetted,
} from '../../../research/indic-translate-post/lib/exampleSelection';
import { useScrollSync } from '../../../research/indic-translate-post/lib/useScrollSync';
import { CONSOLE_URL } from '../../../../config/links';
import { canAnimate, ensureRevealed, gsap, refreshTriggers, useGsapAnimation } from '../../devMotion';

/**
 * The Indic-Translate post's "Examples by language" browser, laid out the way
 * the other model pages show their examples: a rail of what the model does on
 * the left, and the selected capability's real output on the right.
 *
 * The examples, the annotators' verdicts and the pieces that render them (the
 * language picker, the flashing lines, the pager, the synced document panes)
 * are the post's own, so the two pages show the same vetted output. Only the
 * layout is this page's. The rail's titles and descriptions are the post's Key
 * Features cards, read from its data.
 */

const FEATURES = Object.fromEntries(
    post.sections
        .find((section) => section.id === 'features')
        .subsections.map((card) => [card.feature, card]),
);

// The browser's own order: the numbering the post's categories carry.
const CAPABILITIES = [
    { id: 'sentence', Icon: AlignLeft },
    { id: 'document', Icon: FileText },
    { id: 'romanized', Icon: Type },
    { id: 'codemix', Icon: Blend },
    { id: 'transliteration', Icon: ArrowLeftRight },
];

const CODEMIX_LANG = 'Hindi';

// One soft curve for everything that moves in the card, so nothing in it
// arrives at a different pace from the rest.
const SMOOTH = 'power3.out';

// The highlight behind the selected capability is one element that slides
// between them. Placed without a tween on first paint and on resize (the rail
// turns into a horizontal strip on narrow screens).
const placeMarker = (rail, marker, animate) => {
    const tab = rail?.querySelector('[aria-selected="true"]');
    if (!tab || !marker) return;
    const to = {
        x: tab.offsetLeft,
        y: tab.offsetTop,
        width: tab.offsetWidth,
        height: tab.offsetHeight,
    };
    if (animate && canAnimate()) {
        gsap.to(marker, { ...to, duration: 0.65, ease: 'expo.out', overwrite: true });
    } else {
        gsap.set(marker, to);
    }
    // On a narrow screen the rail is a horizontal strip; keep the selected one in view.
    if (animate && rail.scrollWidth > rail.clientWidth) {
        rail.scrollTo({
            left: tab.offsetLeft - (rail.clientWidth - tab.offsetWidth) / 2,
            behavior: canAnimate() ? 'smooth' : 'auto',
        });
    }
};

/** Copies a translation, and says so for a moment. */
const CopyButton = ({ text, label = 'Copy' }) => {
    const [copied, setCopied] = useState(false);
    const timer = useRef(null);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 1600);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            className={`xb-copy${copied ? ' is-done' : ''}`}
            onClick={copy}
            aria-label={copied ? 'Copied' : `${label} output`}
        >
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            <span>{copied ? 'Copied' : label}</span>
        </button>
    );
};

const TranslateExamples = () => {
    const [data, setData] = useState(null);
    const [cap, setCap] = useState(CAPABILITIES[0].id);
    const [lang, setLang] = useState(DEFAULT_LANG);
    const [docSubtype, setDocSubtype] = useState(SUBTYPES[0]);
    const [docView, setDocView] = useState('rendered');
    const [dots, setDots] = useState({ translation: 0, romanized: 0, transliteration: 0, codemix: 0 });

    const rootRef = useRef(null);
    const railRef = useRef(null);
    const markerRef = useRef(null);
    const markerPlaced = useRef(false);
    const panelRef = useRef(null);
    const bodyRef = useRef(null);
    const bodyHeight = useRef(0);
    const shown = useRef({ cap, lang });

    const docSync = useScrollSync([lang, docSubtype, docView, cap]);

    // The same chunk the post loads: 640 KB of model output, kept off first paint.
    useEffect(() => {
        let live = true;
        import('../../../research/indic-translate-post/data/examples.json').then((m) => {
            if (!live) return;
            setData(m.default);
            const d = defaultsFor(DEFAULT_LANG, m.default);
            setDocSubtype(d.docSubtype);
            setDots(d.dots);
            refreshTriggers();
        });
        return () => {
            live = false;
        };
    }, []);

    const pickLang = (next) => {
        setLang(next);
        const d = defaultsFor(next, data);
        setDocSubtype(d.docSubtype);
        setDots(d.dots);
    };
    const setDot = (key, i) => setDots((d) => ({ ...d, [key]: i }));

    // Arrow keys move along the rail, as in any tab list; Home and End jump to
    // its ends. Focus follows the selection.
    const onRailKey = (event) => {
        const index = CAPABILITIES.findIndex((c) => c.id === cap);
        const last = CAPABILITIES.length - 1;
        const next = {
            ArrowDown: index + 1,
            ArrowRight: index + 1,
            ArrowUp: index - 1,
            ArrowLeft: index - 1,
            Home: 0,
            End: last,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        const target = CAPABILITIES[(next + CAPABILITIES.length) % CAPABILITIES.length].id;
        setCap(target);
        railRef.current?.querySelector(`#xb-tab-${target}`)?.focus();
    };

    useLayoutEffect(() => {
        placeMarker(railRef.current, markerRef.current, markerPlaced.current);
        markerPlaced.current = true;
    }, [cap]);

    useEffect(() => {
        const rail = railRef.current;
        if (!rail || typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(() => placeMarker(rail, markerRef.current, false));
        observer.observe(rail);
        return () => observer.disconnect();
    }, []);

    // Content of a different height eases to its new size instead of jumping,
    // so the page under the card glides rather than lurches.
    useLayoutEffect(() => {
        const body = bodyRef.current;
        if (!body) return;
        const midway = body.style.height !== '';
        const from = midway ? body.offsetHeight : bodyHeight.current;
        gsap.killTweensOf(body, 'height');
        gsap.set(body, { clearProps: 'height,overflow' });
        const to = body.offsetHeight;
        bodyHeight.current = to;
        if (!from || Math.abs(to - from) < 3 || !canAnimate()) return;
        gsap.fromTo(
            body,
            { height: from, overflow: 'hidden' },
            {
                height: to,
                duration: 0.55,
                ease: 'power2.inOut',
                clearProps: 'height,overflow',
                onComplete: refreshTriggers,
            },
        );
    }, [cap, lang, docSubtype, docView, dots, data]);

    // Keep the remembered height true when the card is resized rather than changed.
    useEffect(() => {
        const body = bodyRef.current;
        if (!body || typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(() => {
            if (body.style.height === '') bodyHeight.current = body.offsetHeight;
        });
        observer.observe(body);
        return () => observer.disconnect();
    }, []);

    // A new capability brings its heading and parts in one after another; a
    // new language only settles the panel, since the lines that changed
    // already flash.
    useLayoutEffect(() => {
        const previous = shown.current;
        shown.current = { cap, lang };
        const panel = panelRef.current;
        if (!panel || !canAnimate()) return undefined;
        if (previous.cap === cap && previous.lang === lang) return undefined;

        const ctx = gsap.context(() => {
            if (previous.cap !== cap) {
                gsap.fromTo(
                    panel.querySelectorAll('[data-xb-step]'),
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.6, ease: SMOOTH, stagger: 0.055, clearProps: 'opacity,transform' },
                );
            } else {
                gsap.fromTo(
                    bodyRef.current,
                    { opacity: 0.4, y: 4 },
                    { opacity: 1, y: 0, duration: 0.5, ease: SMOOTH, clearProps: 'opacity,transform' },
                );
            }
        }, panel);
        return () => ctx.revert();
    }, [cap, lang]);

    // Entrance and the slow turn of the gradient edge. The edge only turns
    // while the card is on screen; with reduced motion none of this runs and
    // the edge holds still.
    useGsapAnimation(
        (root) => {
            const entrance = gsap.fromTo(
                root.querySelectorAll('.xb-cap'),
                { opacity: 0, x: -12 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    ease: SMOOTH,
                    stagger: 0.08,
                    clearProps: 'opacity,transform',
                    scrollTrigger: { trigger: root, start: 'top 85%', once: true },
                },
            );

            gsap.to(root, {
                '--xb-angle': '360deg',
                duration: 18,
                ease: 'none',
                repeat: -1,
                scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause play pause' },
            });

            return ensureRevealed(entrance, root);
        },
        rootRef,
        [],
    );

    const feature = FEATURES[cap];
    const number = CAPABILITIES.findIndex((c) => c.id === cap) + 1;

    let body = null;
    let script = '';

    if (data) {
        const raw = data[lang];
        // Rejected examples are dropped before anything indexes into these lists.
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
                Object.entries(raw.document ?? {}).filter(([k]) => !dropped(lang, 'document').has(k)),
            ),
        };
        script = d.script;
        const abbr = LANG_ABBR[lang];
        const code = LANG_CODE[lang];
        const rtlDir = d.rtl ? 'rtl' : undefined;
        const clamp = (key, list) => Math.min(dots[key], Math.max(0, list.length - 1));

        // One example card: its lines, a copy action for the model's output,
        // and the pager under it.
        const example = (lines, output, pager) => (
            <>
                <div className="xb-example" data-xb-step>
                    <CopyButton text={output} />
                    {lines}
                </div>
                {pager && <div className="xb-foot" data-xb-step>{pager}</div>}
            </>
        );

        if (cap === 'sentence') {
            const i = clamp('translation', d.translation);
            const item = d.translation[i];
            body = example(
                <>
                    <ExLine tag="EN" text={item.en} lang="en" />
                    <ExLine tag={abbr} text={item.native} lang={code} dir={rtlDir} out />
                </>,
                item.native,
                <Pager count={d.translation.length} active={i} onPick={(n) => setDot('translation', n)} label="Sentence translation" />,
            );
        } else if (cap === 'document') {
            const doc = d.document[docSubtype];
            const docRtl = doc && doc.rtl !== undefined ? doc.rtl : d.rtl;
            const docCode = doc?.scriptNote === 'Perso-Arabic' ? 'ur' : code;
            body = (
                <>
                    <div className="xb-toolbar" data-xb-step>
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
                    </div>

                    {!doc ? (
                        <p className="ex-note" data-xb-step>
                            No {DOC_SUBTYPE_LABELS[docSubtype]} example for {lang} survived selection. Try
                            another document type or language.
                        </p>
                    ) : (
                        <>
                            <p className="ex-doc-title" data-xb-step>{doc.title}</p>
                            <div className="xb-doc" data-xb-step>
                                <div className="xb-doc-pane">
                                    <div className="xb-doc-label">
                                        <p className="ex-block-label">Source · EN</p>
                                    </div>
                                    <div className="ex-doc-block" {...docSync.source}>
                                        {docView === 'rendered' ? (
                                            <RenderedDoc markdown={doc.en} lang="en" className="ex-doc-rendered" />
                                        ) : (
                                            <p lang="en">{doc.en}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="xb-doc-pane is-output">
                                    <div className="xb-doc-label">
                                        <p className="ex-block-label">Output · {abbr}</p>
                                        <CopyButton text={doc.native} label="Copy markup" />
                                    </div>
                                    <div className="ex-doc-block" dir={docRtl ? 'rtl' : undefined} {...docSync.output}>
                                        {docView === 'rendered' ? (
                                            <RenderedDoc markdown={doc.native} lang={docCode} className="ex-doc-rendered" />
                                        ) : (
                                            <p lang={docCode}>{doc.native}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="ex-note" data-xb-step>
                                Excerpted here for length. The two panes scroll together.
                                {doc.scriptNote ? ` Shown in ${doc.scriptNote} script, the default for ${lang}.` : ''}
                            </p>
                        </>
                    )}
                </>
            );
        } else if (cap === 'romanized') {
            const i = clamp('romanized', d.romanized);
            const item = d.romanized[i];
            body = (
                <>
                    <p className="xb-direction" data-xb-step>en → Roman</p>
                    {example(
                        <>
                            <ExLine tag="EN" text={item.en} lang="en" />
                            <ExLine tag="RO" text={item.roman} out />
                        </>,
                        item.roman,
                        <Pager count={d.romanized.length} active={i} onPick={(n) => setDot('romanized', n)} label="Romanized translation" />,
                    )}
                </>
            );
        } else if (cap === 'codemix') {
            const list = d.codemix ?? [];
            const i = clamp('codemix', list);
            const item = list[i];
            body = !item ? (
                <div className="xb-example xb-empty" data-xb-step>
                    <p className="ex-note">
                        The training data includes code-mixed text for {lang} alongside every other
                        language, but a captured example generation is only on hand for {CODEMIX_LANG} so far.
                    </p>
                    <button type="button" className="xb-empty-btn" onClick={() => pickLang(CODEMIX_LANG)}>
                        Show the {CODEMIX_LANG} example
                    </button>
                </div>
            ) : (
                example(
                    <>
                        <ExLine tag="EN" text={item.en} lang="en" />
                        <ExLine tag={abbr} text={item.native} lang={code} dir={rtlDir} />
                        <ExLine tag="MIX" text={item.mix} lang={code} dir={rtlDir} out />
                    </>,
                    item.mix,
                    <Pager count={list.length} active={i} onPick={(n) => setDot('codemix', n)} label="Code-mixed translation" />,
                )
            );
        } else {
            const items = d.transliteration.items;
            const i = clamp('transliteration', items);
            const item = items[i];
            const native = d.transliteration.dir === 'xx2roman';
            body = (
                <>
                    <p className="xb-direction" data-xb-step>{native ? 'native → Roman' : 'Roman → native'}</p>
                    {example(
                        <>
                            <ExLine
                                tag={native ? abbr : 'RO'}
                                text={item.src}
                                lang={native ? code : undefined}
                                dir={native ? rtlDir : undefined}
                            />
                            <ExLine
                                tag={native ? 'RO' : abbr}
                                text={item.out}
                                lang={native ? undefined : code}
                                dir={native ? undefined : rtlDir}
                                out
                            />
                        </>,
                        item.out,
                        <Pager count={items.length} active={i} onPick={(n) => setDot('transliteration', n)} label="Transliteration" />,
                    )}
                </>
            );
        }
    }

    return (
        // The reused pieces are styled by the post's stylesheet, scoped to `.mt-post`.
        <div className="mt-post xb-breakout">
            <div className="xb-glow" aria-hidden="true" />

            <div className="xb" ref={rootRef}>
                <aside className="xb-rail">
                    <p className="xb-rail-label" id="xb-caps-label">Capabilities</p>
                    <div
                        className="xb-caps"
                        ref={railRef}
                        role="tablist"
                        aria-labelledby="xb-caps-label"
                        aria-orientation="vertical"
                        onKeyDown={onRailKey}
                    >
                        <span className="xb-marker" ref={markerRef} aria-hidden="true" />
                        {CAPABILITIES.map(({ id, Icon }) => (
                            <button
                                key={id}
                                id={`xb-tab-${id}`}
                                type="button"
                                role="tab"
                                className={`xb-cap${cap === id ? ' is-on' : ''}`}
                                aria-selected={cap === id}
                                aria-controls="xb-panel"
                                tabIndex={cap === id ? 0 : -1}
                                onClick={() => setCap(id)}
                            >
                                <span className="xb-cap-icon">
                                    <Icon size={17} aria-hidden="true" />
                                </span>
                                <span className="xb-cap-copy">
                                    <strong>{FEATURES[id].title}</strong>
                                    <em>{FEATURES[id].tag}</em>
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="xb-rail-foot">
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

                <section
                    className="xb-panel"
                    id="xb-panel"
                    role="tabpanel"
                    aria-labelledby={`xb-tab-${cap}`}
                    ref={panelRef}
                >
                    <header className="xb-head">
                        <div className="xb-head-copy">
                            <p className="xb-eyebrow" data-xb-step>
                                <span>0{number}</span> {feature.tag}
                            </p>
                            <h3 className="xb-title" data-xb-step>{feature.title}</h3>
                            <p className="xb-claim" data-xb-step>{feature.content}</p>
                        </div>
                        <div className="xb-lang">
                            <LangPicker lang={lang} onPick={pickLang} />
                            {script && <span className="xb-script">{script}</span>}
                        </div>
                    </header>

                    <div className="xb-body" ref={bodyRef}>
                        {body ?? (
                            <div className="xb-skeleton" aria-label="Loading examples" role="status">
                                <span />
                                <span />
                                <span />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TranslateExamples;
