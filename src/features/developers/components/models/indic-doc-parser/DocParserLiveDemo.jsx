import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import ReactMarkdown from 'react-markdown';
import {
    Copy,
    Check,
    FileUp,
    Layers,
    ListOrdered,
    Pause,
    Play,
    RotateCcw,
    ScanLine,
    SkipForward,
    Tag,
} from 'lucide-react';
import { DEMO_PAGES, DOC_PARSER_API_URL, LABELS, OUTPUT_TABS, getDemoPage } from './docParserData';
import DocParserStage from './DocParserStage';
import TypedMarkdown from './TypedMarkdown';
import { typeDuration } from './typeTiming';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

const SCAN_DURATION = 3.2;
const ORDER_DURATION = 1.5;
const MAX_UPLOAD_MB = 12;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const emptyRefs = () => ({
    camera: null,
    beam: null,
    scanned: null,
    path: null,
    dot: null,
    rects: {},
    chips: {},
    badges: {},
});

const DocParserLiveDemo = () => {
    const [pageId, setPageId] = useState(DEMO_PAGES[0].id);
    const [phase, setPhase] = useState('idle'); // idle | scanning | ordering | reading | done
    const [detected, setDetected] = useState(0);
    const [emitted, setEmitted] = useState([]);
    const [activeOrder, setActiveOrder] = useState(0);
    const [hoverOrder, setHoverOrder] = useState(0);
    const [tab, setTab] = useState('markdown');
    const [cameraOn, setCameraOn] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [showOrder, setShowOrder] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [paused, setPaused] = useState(false);
    const [copied, setCopied] = useState(false);
    const [upload, setUpload] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [notice, setNotice] = useState('');
    const [boxes, setBoxes] = useState([]);
    const [size, setSize] = useState({ w: 0, h: 0 });

    const stageRefs = useRef(emptyRefs());

    // The stage renders the nodes the timeline animates, but it must not write
    // into a ref it was handed as a prop — so it reports its nodes back here.
    const registerNode = useCallback((key, el) => {
        stageRefs.current[key] = el;
    }, []);

    const registerBlockNode = useCallback((group, order, el) => {
        stageRefs.current[group][order] = el;
    }, []);
    const tlRef = useRef(null);
    const railRef = useRef(null);
    const outPaneRef = useRef(null);
    const fileInputRef = useRef(null);

    const page = getDemoPage(pageId);
    const blocks = page.blocks;
    const byOrder = useMemo(() => new Map(blocks.map((b) => [b.order, b])), [blocks]);
    const running = phase === 'scanning' || phase === 'ordering' || phase === 'reading';

    const onMeasure = useCallback((nextBoxes, nextSize) => {
        setBoxes((current) => {
            const same =
                current.length === nextBoxes.length &&
                current.every(
                    (box, i) =>
                        box.order === nextBoxes[i].order &&
                        Math.abs(box.x - nextBoxes[i].x) < 0.5 &&
                        Math.abs(box.h - nextBoxes[i].h) < 0.5
                );
            return same ? current : nextBoxes;
        });
        setSize((current) => (current.w === nextSize.w && current.h === nextSize.h ? current : nextSize));
    }, []);

    // ---- overlay states -------------------------------------------------

    const overlayTargets = useCallback(() => {
        const refs = stageRefs.current;
        return {
            rects: Object.values(refs.rects).filter(Boolean),
            chips: Object.values(refs.chips).filter(Boolean),
            badges: Object.values(refs.badges).filter(Boolean),
        };
    }, []);

    const resetOverlay = useCallback(() => {
        const refs = stageRefs.current;
        const { rects, chips, badges } = overlayTargets();
        if (rects.length) gsap.set(rects, { drawSVG: '0%' });
        if (chips.length) gsap.set(chips, { autoAlpha: 0, yPercent: -68 });
        if (badges.length) gsap.set(badges, { scale: 0, autoAlpha: 0 });
        if (refs.path) gsap.set(refs.path, { drawSVG: '0%', autoAlpha: 0 });
        if (refs.dot) gsap.set(refs.dot, { autoAlpha: 0 });
        if (refs.beam) gsap.set(refs.beam, { autoAlpha: 0, yPercent: -14 });
        if (refs.scanned) gsap.set(refs.scanned, { scaleY: 0, autoAlpha: 1 });
        if (refs.camera)
            gsap.set(refs.camera, { scale: 1, x: 0, y: 0, filter: 'blur(0px)', transformOrigin: '0px 0px' });
        if (railRef.current) railRef.current.style.width = '0%';
    }, [overlayTargets]);

    const settleOverlay = useCallback(() => {
        const refs = stageRefs.current;
        const { rects, chips, badges } = overlayTargets();
        if (rects.length) gsap.set(rects, { drawSVG: '100%' });
        if (chips.length) gsap.set(chips, { autoAlpha: 1, yPercent: -100 });
        if (badges.length) gsap.set(badges, { scale: 1, autoAlpha: 1 });
        if (refs.path) gsap.set(refs.path, { drawSVG: '100%', autoAlpha: 1 });
        if (refs.dot) gsap.set(refs.dot, { autoAlpha: 0 });
        if (refs.beam) gsap.set(refs.beam, { autoAlpha: 0 });
        if (refs.scanned) gsap.set(refs.scanned, { autoAlpha: 0 });
        if (refs.camera) gsap.set(refs.camera, { scale: 1, x: 0, y: 0, filter: 'blur(0px)' });
        if (railRef.current) railRef.current.style.width = '100%';
    }, [overlayTargets]);

    // Idle: nothing detected yet. Re-applied whenever the page or its
    // measurements change, so a resize never leaves half-drawn boxes behind.
    useEffect(() => {
        if (phase === 'idle') resetOverlay();
        if (phase === 'done') settleOverlay();
    }, [phase, boxes, resetOverlay, settleOverlay]);

    // ---- the run --------------------------------------------------------

    const stop = useCallback(() => {
        tlRef.current?.kill();
        tlRef.current = null;
    }, []);

    const reset = useCallback(() => {
        stop();
        setPhase('idle');
        setEmitted([]);
        setDetected(0);
        setActiveOrder(0);
        setNotice('');
        setTab('markdown');
        resetOverlay();
    }, [stop, resetOverlay]);

    const showResult = useCallback(() => {
        stop();
        setEmitted(blocks.map((b) => b.order));
        setDetected(blocks.length);
        setActiveOrder(0);
        setPhase('done');
        settleOverlay();
    }, [stop, blocks, settleOverlay]);

    const cameraVarsFor = useCallback(
        (box) => {
            if (!size.w || !size.h) return {};
            // Zoom in as far as the block allows without cropping it.
            const k = clamp((size.w * 0.84) / Math.max(box.w, 1), 1.08, 1.6);
            const cx = box.x + box.w / 2;
            const cy = box.y + box.h / 2;
            return {
                scale: k,
                x: clamp(size.w / 2 - k * cx, size.w * (1 - k), 0),
                y: clamp(size.h / 2 - k * cy, size.h * (1 - k), 0),
                transformOrigin: '0px 0px',
                duration: 0.6,
                ease: 'power2.inOut',
            };
        },
        [size]
    );

    const buildTimeline = useCallback(() => {
        const refs = stageRefs.current;
        if (!boxes.length || !refs.camera) return null;

        const byY = boxes.slice().sort((a, b) => a.y - b.y);
        const byReading = boxes.slice().sort((a, b) => a.order - b.order);

        const tl = gsap.timeline({
            paused: true,
            onUpdate: () => {
                if (railRef.current) railRef.current.style.width = `${tl.progress() * 100}%`;
            },
        });

        let t = 0;

        // 0 — the page settles onto the bench.
        tl.fromTo(
            refs.camera,
            { filter: 'blur(7px)', scale: 1.015, transformOrigin: '50% 40%' },
            { filter: 'blur(0px)', scale: 1, duration: 0.55, ease: 'power2.out' },
            0
        );
        t += 0.55;

        // 1 — the sweep. Boxes are drawn as the beam crosses them, which is
        // what makes detection feel like it is happening rather than being
        // replayed from a list.
        const scanAt = t;
        tl.call(() => setPhase('scanning'), null, scanAt);
        tl.to(refs.beam, { autoAlpha: 1, duration: 0.2 }, scanAt);
        tl.fromTo(refs.beam, { yPercent: -14 }, { yPercent: 100, duration: SCAN_DURATION, ease: 'none' }, scanAt);
        tl.fromTo(refs.scanned, { scaleY: 0 }, { scaleY: 1, duration: SCAN_DURATION, ease: 'none' }, scanAt);

        byY.forEach((box, index) => {
            const hit = scanAt + (((box.y + box.h * 0.6) / (size.h || 1)) * SCAN_DURATION);
            const rect = refs.rects[box.order];
            const chip = refs.chips[box.order];
            if (rect) tl.to(rect, { drawSVG: '100%', duration: 0.5, ease: 'power2.out' }, hit);
            if (chip) tl.to(chip, { autoAlpha: 1, yPercent: -100, duration: 0.3, ease: 'power2.out' }, hit + 0.1);
            tl.call(() => setDetected(index + 1), null, hit);
        });

        t = scanAt + SCAN_DURATION;
        tl.to(refs.beam, { autoAlpha: 0, duration: 0.3 }, t);
        tl.to(refs.scanned, { autoAlpha: 0, duration: 0.45 }, t);
        t += 0.35;

        // 2 — reading order. The thread draws itself through the blocks and a
        // marker rides it, then the numbers land in its wake.
        const orderAt = t;
        tl.call(() => setPhase('ordering'), null, orderAt);
        tl.set(refs.path, { autoAlpha: 1 }, orderAt);
        tl.to(refs.path, { drawSVG: '100%', duration: ORDER_DURATION, ease: 'power1.inOut' }, orderAt);
        tl.to(refs.dot, { autoAlpha: 1, duration: 0.2 }, orderAt);
        tl.to(
            refs.dot,
            {
                motionPath: { path: refs.path, align: refs.path, alignOrigin: [0.5, 0.5] },
                duration: ORDER_DURATION,
                ease: 'power1.inOut',
            },
            orderAt
        );
        tl.to(refs.dot, { autoAlpha: 0, duration: 0.25 }, orderAt + ORDER_DURATION);

        const badgeEls = byReading.map((box) => refs.badges[box.order]).filter(Boolean);
        if (badgeEls.length) {
            tl.to(
                badgeEls,
                {
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.38,
                    ease: 'back.out(2.6)',
                    stagger: ORDER_DURATION / badgeEls.length,
                },
                orderAt + 0.1
            );
        }
        t = orderAt + ORDER_DURATION + 0.4;

        // 3 — reading. The camera walks the page in reading order while each
        // block's Markdown types itself into the output pane.
        tl.call(() => setPhase('reading'), null, t);
        byReading.forEach((box) => {
            const block = byOrder.get(box.order);
            if (cameraOn) tl.to(refs.camera, cameraVarsFor(box), t);
            tl.call(
                () => {
                    setActiveOrder(box.order);
                    setEmitted((current) => (current.includes(box.order) ? current : [...current, box.order]));
                },
                null,
                t + 0.3
            );
            const dwell = typeDuration(block?.md ?? '');
            t += 0.3 + dwell + 0.16;
        });

        // 4 — the page pulls back out, everything stays on screen.
        tl.to(refs.camera, { scale: 1, x: 0, y: 0, duration: 0.75, ease: 'power2.inOut' }, t);
        tl.call(
            () => {
                setActiveOrder(0);
                setPhase('done');
            },
            null,
            t + 0.75
        );
        tl.to({}, { duration: 0.1 }, t + 0.8);

        return tl;
    }, [boxes, size, byOrder, cameraOn, cameraVarsFor]);

    const run = useCallback(() => {
        if (upload && !DOC_PARSER_API_URL) {
            setNotice('endpoint');
            setPhase('done');
            return;
        }
        stop();
        setEmitted([]);
        setDetected(0);
        setActiveOrder(0);
        setNotice('');
        setTab('markdown');
        setPaused(false);
        resetOverlay();

        if (prefersReducedMotion()) {
            showResult();
            return;
        }

        const tl = buildTimeline();
        if (!tl) return;
        tlRef.current = tl;
        tl.timeScale(speed);
        tl.play(0);
        setPhase('scanning');
    }, [upload, stop, resetOverlay, buildTimeline, speed, showResult]);

    const togglePlay = useCallback(() => {
        const tl = tlRef.current;
        if (!tl) return;
        if (tl.paused()) {
            tl.play();
            setPaused(false);
        } else {
            tl.pause();
            setPaused(true);
        }
    }, []);

    useEffect(() => {
        tlRef.current?.timeScale(speed);
    }, [speed]);

    useEffect(() => () => tlRef.current?.kill(), []);

    // ---- upload ---------------------------------------------------------

    const acceptFile = useCallback(
        (file) => {
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                setNotice('type');
                return;
            }
            if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
                setNotice('size');
                return;
            }
            reset();
            setUpload((current) => {
                if (current?.url) URL.revokeObjectURL(current.url);
                return { url: URL.createObjectURL(file), name: file.name };
            });
            setBoxes([]);
        },
        [reset]
    );

    useEffect(
        () => () => {
            if (upload?.url) URL.revokeObjectURL(upload.url);
        },
        [upload]
    );

    const clearUpload = useCallback(() => {
        reset();
        setUpload((current) => {
            if (current?.url) URL.revokeObjectURL(current.url);
            return null;
        });
    }, [reset]);

    // ---- output ---------------------------------------------------------

    const emittedBlocks = useMemo(
        () => emitted.map((order) => byOrder.get(order)).filter(Boolean),
        [emitted, byOrder]
    );

    const markdownDoc = useMemo(() => emittedBlocks.map((b) => b.md).join('\n\n'), [emittedBlocks]);

    const jsonDoc = useMemo(
        () =>
            JSON.stringify(
                {
                    page: page.id,
                    blocks: emittedBlocks.map((block) => {
                        const box = boxes.find((b) => b.order === block.order);
                        return {
                            order: block.order,
                            label: block.label,
                            confidence: block.conf,
                            bbox: box && size.w
                                ? [
                                      +(box.x / size.w).toFixed(3),
                                      +(box.y / size.h).toFixed(3),
                                      +(box.w / size.w).toFixed(3),
                                      +(box.h / size.h).toFixed(3),
                                  ]
                                : null,
                            markdown: block.md,
                        };
                    }),
                },
                null,
                2
            ),
        [emittedBlocks, boxes, size, page.id]
    );

    const copyOutput = async () => {
        try {
            await navigator.clipboard.writeText(tab === 'json' ? jsonDoc : markdownDoc);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    };

    const counts = useMemo(() => {
        const equations = emittedBlocks.filter((b) => b.kind === 'latex').length;
        const tables = emittedBlocks.filter((b) => b.kind === 'table').length;
        return { blocks: emittedBlocks.length, equations, tables, chars: markdownDoc.length };
    }, [emittedBlocks, markdownDoc]);

    const statusLabel = {
        idle: 'Ready',
        scanning: `Detecting layout — ${detected} block${detected === 1 ? '' : 's'}`,
        ordering: 'Resolving reading order',
        reading: `Reading block ${activeOrder} of ${blocks.length}`,
        done: `${counts.blocks} blocks · ${counts.equations} equations · ${counts.tables} tables`,
    }[phase];

    return (
        <section className="idp-section idp-demo" id="demo">
            <div className="idp-container">
                <header className="idp-head idp-reveal">
                    <p className="idp-eyebrow">Live demo</p>
                    <h2 className="idp-h2">
                        Watch a page come <span className="idp-grad">apart</span>.
                    </h2>
                    <p className="idp-lede">
                        The sweep is layout detection. The thread is reading order. The text on the right is what the
                        recogniser returns for each block, in the order it decided you would read them.
                    </p>
                </header>

                <div className="idp-bench idp-reveal">
                    <div className="idp-bench-bar">
                        <div className="idp-samples" role="tablist" aria-label="Sample page">
                            {DEMO_PAGES.map((sample) => (
                                <button
                                    key={sample.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={!upload && pageId === sample.id}
                                    className="idp-sample"
                                    data-active={!upload && pageId === sample.id ? true : undefined}
                                    onClick={() => {
                                        clearUpload();
                                        setPageId(sample.id);
                                    }}
                                    title={sample.tag}
                                    disabled={running}
                                >
                                    {sample.label}
                                </button>
                            ))}
                        </div>

                        <div className="idp-bench-tools">
                            <button
                                type="button"
                                className="idp-tool"
                                data-on={showLabels || undefined}
                                onClick={() => setShowLabels((v) => !v)}
                                aria-pressed={showLabels}
                            >
                                <Tag size={13} aria-hidden="true" />
                                Labels
                            </button>
                            <button
                                type="button"
                                className="idp-tool"
                                data-on={showOrder || undefined}
                                onClick={() => setShowOrder((v) => !v)}
                                aria-pressed={showOrder}
                            >
                                <ListOrdered size={13} aria-hidden="true" />
                                Order
                            </button>
                            <button
                                type="button"
                                className="idp-tool"
                                data-on={cameraOn || undefined}
                                onClick={() => setCameraOn((v) => !v)}
                                aria-pressed={cameraOn}
                                disabled={running}
                            >
                                <Layers size={13} aria-hidden="true" />
                                Camera
                            </button>
                            <button
                                type="button"
                                className="idp-tool"
                                onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
                                disabled={phase === 'idle'}
                            >
                                {speed}×
                            </button>
                        </div>
                    </div>

                    <div
                        className="idp-bench-body"
                        data-drag={dragOver || undefined}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(event) => {
                            event.preventDefault();
                            setDragOver(false);
                            acceptFile(event.dataTransfer.files?.[0]);
                        }}
                    >
                        <div className="idp-stage">
                            <div className="idp-stage-meta">
                                <span className="idp-stage-tag">{upload ? upload.name : page.tag}</span>
                                {upload ? (
                                    <button type="button" className="idp-text-btn" onClick={clearUpload}>
                                        Use a sample instead
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="idp-text-btn"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FileUp size={12} aria-hidden="true" />
                                        Drop your own page
                                    </button>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="idp-file"
                                    onChange={(event) => acceptFile(event.target.files?.[0])}
                                />
                            </div>

                            <DocParserStage
                                page={page}
                                upload={upload}
                                registerNode={registerNode}
                                registerBlockNode={registerBlockNode}
                                boxes={boxes}
                                size={size}
                                onMeasure={onMeasure}
                                activeOrder={activeOrder || hoverOrder}
                                hoverOrder={hoverOrder}
                                phase={phase}
                                showLabels={showLabels}
                                showOrder={showOrder}
                                onHoverBlock={setHoverOrder}
                                onSelectBlock={(order) => {
                                    setActiveOrder(order);
                                    const pane = outPaneRef.current;
                                    const el = pane?.querySelector(`[data-order="${order}"]`);
                                    if (pane && el) pane.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
                                }}
                            />
                        </div>

                        <div className="idp-out">
                            <div className="idp-out-bar">
                                <div className="idp-tabs" role="tablist" aria-label="Output format">
                                    {OUTPUT_TABS.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={tab === option.id}
                                            data-active={tab === option.id ? true : undefined}
                                            onClick={() => setTab(option.id)}
                                            disabled={running && option.id !== 'markdown'}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="idp-text-btn"
                                    onClick={copyOutput}
                                    disabled={!emittedBlocks.length}
                                >
                                    {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>

                            <div className="idp-out-pane" ref={outPaneRef}>
                                {notice === 'endpoint' ? (
                                    <div className="idp-note">
                                        <h4>No inference endpoint configured</h4>
                                        <p>
                                            The sample pages above are scripted so the page works offline. To run your
                                            own scan through the model, point <code>DOC_PARSER_API_URL</code> in{' '}
                                            <code>docParserData.js</code> at an endpoint that accepts a multipart POST
                                            and answers with block bounding boxes and Markdown.
                                        </p>
                                    </div>
                                ) : notice === 'type' ? (
                                    <div className="idp-note">
                                        <h4>That file is not an image</h4>
                                        <p>Drop a PNG, JPEG or WebP render of a page.</p>
                                    </div>
                                ) : notice === 'size' ? (
                                    <div className="idp-note">
                                        <h4>That page is a little large</h4>
                                        <p>Keep uploads under {MAX_UPLOAD_MB} MB — a 2000px-wide render is plenty.</p>
                                    </div>
                                ) : !emittedBlocks.length ? (
                                    <div className="idp-out-empty">
                                        <ScanLine size={20} aria-hidden="true" />
                                        <p>Run the parser and the page arrives here, block by block.</p>
                                    </div>
                                ) : tab === 'json' ? (
                                    <pre className="idp-json">{jsonDoc}</pre>
                                ) : (
                                    emittedBlocks.map((block) => (
                                        <article
                                            key={block.order}
                                            className="idp-out-block"
                                            data-order={block.order}
                                            data-active={
                                                activeOrder === block.order || hoverOrder === block.order ? true : undefined
                                            }
                                            data-tone={LABELS[block.label]?.tone ?? 'slate'}
                                            onMouseEnter={() => setHoverOrder(block.order)}
                                            onMouseLeave={() => setHoverOrder(0)}
                                        >
                                            <header className="idp-out-head">
                                                <span className="idp-out-n">{String(block.order).padStart(2, '0')}</span>
                                                <span className="idp-out-label">{block.label}</span>
                                                <span className="idp-out-conf">{block.conf.toFixed(2)}</span>
                                            </header>

                                            {tab === 'rendered' ? (
                                                <div className="idp-rendered">
                                                    {block.kind === 'latex' ? (
                                                        <div className="idp-tex">
                                                            <span className="idp-tex-chip">LaTeX</span>
                                                            {block.display.map((line, i) => (
                                                                <span key={i}>{line}</span>
                                                            ))}
                                                        </div>
                                                    ) : block.kind === 'table' ? (
                                                        <table className="idp-out-table">
                                                            <thead>
                                                                <tr>
                                                                    {block.table.head.map((cell) => (
                                                                        <th key={cell}>{cell}</th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {block.table.rows.map((row) => (
                                                                    <tr key={row[0]}>
                                                                        {row.map((cell, i) => (
                                                                            <td key={`${row[0]}-${i}`}>{cell}</td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <ReactMarkdown>{block.md}</ReactMarkdown>
                                                    )}
                                                </div>
                                            ) : (
                                                <TypedMarkdown
                                                    text={block.md}
                                                    play={phase === 'reading'}
                                                    scrollHost={outPaneRef}
                                                />
                                            )}
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="idp-bench-foot">
                        <div className="idp-transport">
                            {phase === 'idle' ? (
                                <button type="button" className="idp-btn idp-btn-primary" onClick={run}>
                                    <ScanLine size={14} aria-hidden="true" />
                                    Detect &amp; parse
                                </button>
                            ) : running ? (
                                <>
                                    <button type="button" className="idp-btn idp-btn-primary" onClick={togglePlay}>
                                        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                                        {paused ? 'Resume' : 'Pause'}
                                    </button>
                                    <button type="button" className="idp-btn" onClick={showResult}>
                                        <SkipForward size={13} aria-hidden="true" />
                                        Skip to result
                                    </button>
                                </>
                            ) : (
                                <button type="button" className="idp-btn idp-btn-primary" onClick={run}>
                                    <RotateCcw size={13} aria-hidden="true" />
                                    Run again
                                </button>
                            )}
                            {phase !== 'idle' && (
                                <button type="button" className="idp-btn" onClick={reset}>
                                    Reset
                                </button>
                            )}
                        </div>

                        <div className="idp-progress" aria-hidden="true">
                            <span className="idp-progress-fill" ref={railRef} />
                        </div>

                        <p className="idp-status" data-phase={phase}>
                            <span className="idp-status-dot" />
                            {statusLabel}
                        </p>
                    </div>
                </div>

                <p className="idp-caption idp-reveal">
                    Sample pages are typeset in the browser so the overlay can be measured from the live text — the
                    boxes are drawn where the words actually landed, not painted into a screenshot.
                </p>
            </div>
        </section>
    );
};

export default DocParserLiveDemo;
