import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ImageOff, RotateCcw } from 'lucide-react';
import { useInView, useReducedMotion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { DOC_EXAMPLES, SCAN_CROP } from '../../data/docParserExamples';
import { assetUrl } from '../../data/assetUrl';
import { CONSOLE_URL } from '../../../../config/links';

// The model emits maths as LaTeX, so the demo typesets it rather than showing
// the source. Bad output stays visible in red instead of throwing.
const KATEX_OPTIONS = { throwOnError: false, errorColor: '#B91C1C', strict: false };
const renderMath = (value) => katex.renderToString(value, { ...KATEX_OPTIONS, displayMode: true });

// How fast the page is "read": one block lands every BLOCK_MS.
const BLOCK_MS = 420;

// Colours mirror the ones the model's own layout visualisation burns into the
// scan, so a block's chip on the text side matches its box on the scan side.
const LABEL_ACCENT = {
    Header: '#2E7D6F',
    'Page-number': '#2E7D6F',
    Folio: '#2E7D6F',
    Paragraph: '#2563A8',
    Equation: '#D2691E',
    Question: '#5B4B9E',
    List: '#0F766E',
    Title: '#B4478A',
    Table: '#8A5A2B',
};

// Where the model gave per-block coordinates, the region it is reading is
// outlined on the scan. Its boxes are [top, left, bottom, right] out of 1000.
//
// Only the gallery pages carry coordinates; the composite examples do not — but
// their images already have the model's own layout boxes burned into them, so
// the scan side shows the layout either way. A box derived from reading
// progress was tried here instead and removed: on a page that already has the
// real boxes printed on it, a second approximate one sliding over the top is
// noise that contradicts what is underneath.
const boxFor = (block) => {
    if (!block?.box) return null;
    const [top, left, bottom, right] = block.box;
    return {
        top: top / 10,
        left: left / 10,
        height: (bottom - top) / 10,
        width: (right - left) / 10,
    };
};

// Two shapes reach here: gallery pages carry the model's blocks directly, while
// the composite examples carry a flat `ocr` list that `layout` groups back up.
const toBlocks = ({ ocr, layout, blocks }) => {
    if (blocks) return blocks.map(({ n, label, type, value, box }) => ({ n, label, box, parts: [{ type, value }] }));
    if (!ocr) return [];
    if (!layout) return ocr.map((part, i) => ({ n: i, label: 'Block', parts: [part] }));

    let cursor = 0;
    return layout.map(({ n, label, span = 1 }) => {
        const parts = ocr.slice(cursor, cursor + span);
        cursor += span;
        return { n, label, parts };
    });
};

const BlockBody = ({ parts }) =>
    parts.map((part, index) => {
        if (part.type === 'latex') {
            return (
                <div
                    key={index}
                    className="ocr-block-math"
                    dangerouslySetInnerHTML={{ __html: renderMath(part.value) }}
                />
            );
        }

        // Tables come back from the model as HTML.
        if (part.type === 'html') {
            return <div key={index} className="ocr-block-table" dangerouslySetInnerHTML={{ __html: part.value }} />;
        }

        return (
            <div key={index} className="ocr-block-text">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, KATEX_OPTIONS]]}>
                    {part.value}
                </ReactMarkdown>
            </div>
        );
    });

// The scan on the left, the model's reconstruction building up on the right,
// one block at a time in the order the model reads them. Where the example
// carries bounding boxes, the block being written is also outlined on the scan.
const DocReader = ({ example }) => {
    const [failed, setFailed] = useState(false);
    const [done, setDone] = useState(0);
    const [run, setRun] = useState(0);

    const stageRef = useRef(null);
    const blocksRef = useRef(null);
    const inView = useInView(stageRef, { once: true, amount: 0.25 });
    const reduceMotion = useReducedMotion();

    const blocks = useMemo(() => toBlocks(example), [example]);
    const src = assetUrl(example.image);

    // The composites hold scan and output side by side in one image; only the
    // scan half is shown, cropped to the page card inside it.
    const { split } = example;
    const crop = example.crop ?? SCAN_CROP;
    const pageAspect = (example.width * split * crop.w) / (example.height * crop.h);
    const scanStyle = {
        width: `${100 / (split * crop.w)}%`,
        left: `${(-crop.x / crop.w) * 100}%`,
        top: `${(-crop.y / crop.h) * 100}%`,
    };

    useEffect(() => {
        if (reduceMotion) {
            setDone(blocks.length);
            return undefined;
        }
        if (!inView) return undefined;

        setDone(0);
        const timer = setInterval(() => {
            setDone((n) => {
                if (n >= blocks.length) {
                    clearInterval(timer);
                    return n;
                }
                return n + 1;
            });
        }, BLOCK_MS);

        return () => clearInterval(timer);
    }, [blocks.length, inView, reduceMotion, run]);

    // The column is a fixed box, so a long page runs past the bottom of it.
    // Follow the block that just landed, and go back to the top on a replay.
    useEffect(() => {
        const el = blocksRef.current;
        if (!el) return;
        el.scrollTo({
            top: done ? el.scrollHeight : 0,
            behavior: reduceMotion || !done ? 'auto' : 'smooth',
        });
    }, [done, reduceMotion]);

    const reading = done < blocks.length;
    const current = blocks[done];
    const currentBox = boxFor(current);

    return (
        <div className={`ocr-stage${reading ? ' is-reading' : ''}`} ref={stageRef}>
            <figure className="ocr-scan" style={{ '--page-aspect': pageAspect }}>
                <figcaption className="ocr-side-label">Scan</figcaption>

                {failed ? (
                    <div className="ocr-missing">
                        <ImageOff size={20} aria-hidden="true" />
                        <p>
                            Missing image
                            <code>public{src}</code>
                        </p>
                    </div>
                ) : (
                    <div className="ocr-scan-crop">
                        <img
                            src={src}
                            className="ocr-scan-img"
                            style={scanStyle}
                            alt={`${example.title} — page scan`}
                            onError={() => setFailed(true)}
                        />

                        {/* where the reader is right now */}
                        {reading && currentBox && (
                            <span
                                className="ocr-box"
                                style={{
                                    '--ocr-accent': LABEL_ACCENT[current?.label] ?? '#57534E',
                                    top: `${currentBox.top}%`,
                                    left: `${currentBox.left}%`,
                                    height: `${currentBox.height}%`,
                                    width: `${currentBox.width}%`,
                                }}
                            />
                        )}
                    </div>
                )}
            </figure>

            <div className="ocr-read">
                <p className="ocr-side-label">
                    IndicOCR
                    {reading && <span className="ocr-reading">reading…</span>}
                    {!reading && (
                        <button type="button" className="dp-text-btn ocr-replay" onClick={() => setRun((r) => r + 1)}>
                            <RotateCcw size={12} aria-hidden="true" />
                            Replay
                        </button>
                    )}
                </p>

                <div className="ocr-blocks" ref={blocksRef} dir={example.rtl ? 'rtl' : undefined}>
                    {blocks.slice(0, done).map((block, i) => (
                        <div
                            key={block.n}
                            /* the newest block is the one being written; that marker is on
                               every example, which is what makes the reader read the same
                               way whether or not the model gave us its boxes */
                            className={`ocr-block${reading && i === done - 1 ? ' is-writing' : ''}`}
                            style={{ '--ocr-accent': LABEL_ACCENT[block.label] ?? '#57534E' }}
                        >
                            <span className="ocr-block-tag">
                                <span className="ocr-block-n">{block.n}</span>
                                {block.label}
                            </span>
                            <BlockBody parts={block.parts} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DocParserExamples = () => {
    const [activeId, setActiveId] = useState(DOC_EXAMPLES[0].id);
    const example = DOC_EXAMPLES.find((e) => e.id === activeId) ?? DOC_EXAMPLES[0];

    return (
        <div className="pg-breakout">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card">
                    <div className="pg-main">
                        <DocReader key={example.id} example={example} />
                    </div>

                    <aside className="pg-rail">
                        <div className="pg-rail-list pg-rail-scroll">
                            {DOC_EXAMPLES.map((e) => (
                                <button
                                    key={e.id}
                                    type="button"
                                    className={`pg-example${activeId === e.id ? ' is-active' : ''}`}
                                    aria-pressed={activeId === e.id}
                                    onClick={() => setActiveId(e.id)}
                                >
                                    <span
                                        className="pg-example-thumb"
                                        style={{
                                            backgroundImage: `url(${assetUrl(e.image)})`,
                                            backgroundSize: `${100 / e.split}% auto`,
                                        }}
                                        aria-hidden="true"
                                    />
                                    <span className="pg-example-copy">
                                        <span className="pg-example-name">{e.title}</span>
                                        <span className="pg-example-lang">{e.langLabel}</span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="pg-rail-stats">
                            {example.stats.map((s) => (
                                <span key={s.label}>
                                    <b>{s.value}</b> {s.label}
                                </span>
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
                                Go to Dashboard
                                <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default DocParserExamples;
