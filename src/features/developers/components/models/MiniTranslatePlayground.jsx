import { useEffect, useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import TypedText from '../../../../components/TypedText';
import { CONSOLE_URL } from '../../../../config/links';
import { latexToMarkdown } from '../../../../utils/latexMarkdown';

// Documents are markdown with tables and maths in them, so they are shown the
// way they would land in a reader, not as source.
const MD_REMARK = [remarkGfm, remarkMath];
const MD_REHYPE = [[rehypeKatex, { throwOnError: false, errorColor: '#B91C1C', strict: false }]];

// One rail of choices on the right, one source/output pair on the left.
// Used twice on the translate page — once to pick a language, once to pick a
// form — rather than one playground trying to cover every combination.
// `onSelect` lets the parent load whatever the current choice needs.
const MiniTranslatePlayground = ({ items, renderPane, onSelect }) => {
    const [activeId, setActiveId] = useState(items[0]?.id);
    const [tabId, setTabId] = useState(items[0]?.tabs?.[0]?.id);

    const active = items.find((item) => item.id === activeId) ?? items[0];
    const activeTab = active.tabs?.some((t) => t.id === tabId) ? tabId : active.tabs?.[0]?.id;
    const pane = renderPane(active, activeTab);

    useEffect(() => {
        onSelect?.(activeId);
    }, [activeId, onSelect]);

    const select = (id) => {
        setActiveId(id);
        setTabId(items.find((item) => item.id === id)?.tabs?.[0]?.id);
    };

    const body = (side) => {
        if (pane.loading) {
            return (
                <p className="tp-loading">
                    <Loader2 size={15} className="tp-spin" aria-hidden="true" />
                    Loading…
                </p>
            );
        }

        const text = side === 'source' ? pane.sourceText : pane.outputText;
        const lang = side === 'source' ? pane.sourceLang : pane.outputLang;
        const dir = side === 'source' ? pane.sourceDir : pane.outputDir;

        if (pane.markdown) {
            return (
                <div
                    className={`tp-scroll tp-scroll-compact dp-markdown${side === 'output' ? ' tp-wipe' : ''}`}
                    key={side === 'output' ? `${activeId}-${activeTab ?? ''}-out` : undefined}
                    lang={lang}
                    dir={dir}
                >
                    <ReactMarkdown remarkPlugins={MD_REMARK} rehypePlugins={MD_REHYPE}>
                        {latexToMarkdown(text)}
                    </ReactMarkdown>
                </div>
            );
        }

        // The output side types itself out; the source is just there.
        if (side === 'output') {
            return <TypedText key={`${activeId}-${activeTab ?? ''}`} text={text} className="tp-text" lang={lang} dir={dir} />;
        }

        return (
            <p className="tp-text" lang={lang} dir={dir}>
                {text}
            </p>
        );
    };

    return (
        <div className="pg-breakout pg-breakout-compact">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card">
                    <div className="pg-main">
                        {/* The row is always present, empty for the examples that
                            carry no sub-tabs — only Document does. Rendering it
                            conditionally made the card 48px taller whenever
                            Document was picked and shorter again on the way out. */}
                        <div className="tl-tabrow">
                            {active.tabs && (
                                <div className="dp-view-tabs tl-tabs" role="tablist" aria-label="Document structure">
                                    {active.tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeTab === tab.id}
                                            className={activeTab === tab.id ? 'is-active' : undefined}
                                            onClick={() => setTabId(tab.id)}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="tp-pair">
                            <section className="tp-pane">
                                <p className="tp-pane-label">{pane.sourceLabel}</p>
                                {body('source')}
                            </section>

                            <section className="tp-pane is-output">
                                <p className="tp-pane-label">{pane.outputLabel}</p>
                                {body('output')}

                                {pane.alt && (
                                    <p className="tp-alt">
                                        <span className="tp-alt-label">{pane.alt.label}</span>
                                        <span lang={pane.alt.lang} dir={pane.alt.dir}>
                                            {pane.alt.text}
                                        </span>
                                    </p>
                                )}
                            </section>
                        </div>
                    </div>

                    <aside className="pg-rail">
                        <div className="pg-rail-list pg-rail-scroll">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`pg-example${activeId === item.id ? ' is-active' : ''}`}
                                    aria-pressed={activeId === item.id}
                                    onClick={() => select(item.id)}
                                >
                                    <span className="tl-badge" aria-hidden="true" lang={item.badgeLang}>
                                        {item.badge}
                                    </span>
                                    <span className="pg-example-copy">
                                        <span className="pg-example-name">{item.name}</span>
                                        <span className="pg-example-lang">{item.sublabel}</span>
                                    </span>
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

export default MiniTranslatePlayground;
