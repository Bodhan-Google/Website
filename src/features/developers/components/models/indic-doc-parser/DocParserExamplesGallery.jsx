import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageOff, MoveHorizontal, Search } from 'lucide-react';
import { DOC_EXAMPLES } from '../../../data/docParserExamples';

const LENS_SIZE = 230;
const LENS_ZOOM = 1.45;

/**
 * Each example is a single composite image: the page scan with the model's
 * layout boxes on the left, the rendered output on the right. The frame shows
 * only the scan; the lens looks *through* it at the matching spot in the
 * output, so hovering a block answers "and what did it make of that?".
 */
const ExampleFrame = ({ example, mode }) => {
    const frameRef = useRef(null);
    const lensRef = useRef(null);
    const [failed, setFailed] = useState(false);
    const [split, setSplit] = useState(50);
    const [dragging, setDragging] = useState(false);
    const [lensOn, setLensOn] = useState(false);

    const { image: src, split: s, width: W, height: H } = example;
    const halfAspect = (W * s) / H;

    const leftSize = `${100 / s}% 100%`;
    const rightSize = `${100 / (1 - s)}% 100%`;

    const moveLens = useCallback(
        (event) => {
            const frame = frameRef.current;
            const lens = lensRef.current;
            if (!frame || !lens) return;

            const rect = frame.getBoundingClientRect();
            const px = event.clientX - rect.left;
            const py = event.clientY - rect.top;
            if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
                setLensOn(false);
                return;
            }

            // Scale factor that renders the composite so its right half is
            // LENS_ZOOM times the size it would be in the frame.
            const scale = (rect.width * LENS_ZOOM) / (1 - s) / W;
            const targetX = (s * W + (px / rect.width) * (1 - s) * W) * scale;
            const targetY = (py / rect.height) * H * scale;

            lens.style.left = `${px}px`;
            lens.style.top = `${py}px`;
            lens.style.backgroundSize = `${W * scale}px ${H * scale}px`;
            lens.style.backgroundPosition = `${LENS_SIZE / 2 - targetX}px ${LENS_SIZE / 2 - targetY}px`;
            setLensOn(true);
        },
        [W, H, s]
    );

    const setFromClientX = useCallback((clientX) => {
        const frame = frameRef.current;
        if (!frame) return;
        const rect = frame.getBoundingClientRect();
        setSplit(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    }, []);

    useEffect(() => {
        if (!dragging) return undefined;
        const onMove = (event) => setFromClientX(event.clientX);
        const onUp = () => setDragging(false);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [dragging, setFromClientX]);

    if (failed) {
        return (
            <div className="idp-frame idp-frame-missing" style={{ aspectRatio: halfAspect }}>
                <ImageOff size={22} aria-hidden="true" />
                <p>
                    Add the composite image at <code>public{src}</code>
                </p>
            </div>
        );
    }

    return (
        <div
            className="idp-frame"
            ref={frameRef}
            style={{ aspectRatio: halfAspect }}
            data-mode={mode}
            onMouseMove={mode === 'lens' ? moveLens : undefined}
            onMouseLeave={() => setLensOn(false)}
        >
            <img src={src} alt="" className="idp-frame-probe" onError={() => setFailed(true)} />

            <div
                className="idp-frame-layer"
                style={{ backgroundImage: `url(${src})`, backgroundSize: rightSize, backgroundPosition: 'right top' }}
                role="img"
                aria-label={`${example.label} — the model's output for this page`}
            />

            <div
                className="idp-frame-layer idp-frame-scan"
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: leftSize,
                    backgroundPosition: 'left top',
                    clipPath: mode === 'split' ? `inset(0 ${100 - split}% 0 0)` : 'none',
                }}
                role="img"
                aria-label={`${example.label} page scan with detected layout blocks in reading order`}
            />

            {mode === 'lens' && (
                <div
                    className="idp-lens"
                    ref={lensRef}
                    data-on={lensOn || undefined}
                    style={{ width: LENS_SIZE, height: LENS_SIZE, backgroundImage: `url(${src})` }}
                    aria-hidden="true"
                >
                    <span className="idp-lens-tag">Model output</span>
                </div>
            )}

            {mode === 'split' && (
                <div
                    className="idp-frame-handle"
                    style={{ left: `${split}%` }}
                    role="slider"
                    tabIndex={0}
                    aria-label="Reveal more page scan or more model output"
                    aria-valuenow={Math.round(split)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    onPointerDown={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onKeyDown={(event) => {
                        const step = event.shiftKey ? 10 : 3;
                        if (event.key === 'ArrowLeft') setSplit((p) => Math.max(0, p - step));
                        else if (event.key === 'ArrowRight') setSplit((p) => Math.min(100, p + step));
                        else return;
                        event.preventDefault();
                    }}
                >
                    <span className="idp-frame-grip">
                        <MoveHorizontal size={13} aria-hidden="true" />
                    </span>
                </div>
            )}

            <span className="idp-frame-tag idp-frame-tag-left">Page scan · layout + reading order</span>
            {mode === 'split' && <span className="idp-frame-tag idp-frame-tag-right">Model output</span>}
        </div>
    );
};

const DocParserExamplesGallery = () => {
    const [activeId, setActiveId] = useState(DOC_EXAMPLES[0].id);
    const [mode, setMode] = useState('lens');
    const example = DOC_EXAMPLES.find((e) => e.id === activeId) ?? DOC_EXAMPLES[0];

    return (
        <section className="idp-section idp-examples" id="examples">
            <div className="idp-container">
                <header className="idp-head idp-reveal">
                    <p className="idp-eyebrow">Examples</p>
                    <h2 className="idp-h2">
                        Unedited predictions on <span className="idp-grad">real pages</span>.
                    </h2>
                    <p className="idp-lede">
                        Three pages the model had not seen: a printed page of dense mathematics, a handwritten Telugu
                        manuscript, and a maths worksheet photographed off ruled paper. Nothing below was corrected.
                    </p>
                </header>

                <div className="idp-example-strip idp-reveal" role="tablist" aria-label="Example page">
                    {DOC_EXAMPLES.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={activeId === item.id}
                            className="idp-example-tab"
                            data-active={activeId === item.id ? true : undefined}
                            onClick={() => setActiveId(item.id)}
                        >
                            <span
                                className="idp-example-thumb"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: `${100 / item.split}% 100%`,
                                }}
                                aria-hidden="true"
                            />
                            <span className="idp-example-meta">
                                <strong>{item.label}</strong>
                                <em>{item.tag}</em>
                            </span>
                        </button>
                    ))}
                </div>

                <div className="idp-example-body idp-reveal">
                    <div className="idp-example-figure">
                        <div className="idp-example-modes">
                            <button
                                type="button"
                                data-active={mode === 'lens' ? true : undefined}
                                onClick={() => setMode('lens')}
                            >
                                <Search size={12} aria-hidden="true" />
                                Lens
                            </button>
                            <button
                                type="button"
                                data-active={mode === 'split' ? true : undefined}
                                onClick={() => setMode('split')}
                            >
                                <MoveHorizontal size={12} aria-hidden="true" />
                                Split
                            </button>
                            <span className="idp-example-hint">
                                {mode === 'lens'
                                    ? 'Move across the page to see what the model read there.'
                                    : 'Drag the divider — or use the arrow keys.'}
                            </span>
                        </div>

                        <ExampleFrame key={example.id + mode} example={example} mode={mode} />
                        <p className="idp-example-note">
                            {example.note} · page {example.page}
                        </p>
                    </div>

                    <aside className="idp-example-out">
                        <header className="idp-example-out-head">
                            <span>Model output</span>
                            <span className="idp-example-out-stats">
                                {example.stats.map((stat) => (
                                    <em key={stat.label}>
                                        <b>{stat.value}</b> {stat.label}
                                    </em>
                                ))}
                            </span>
                        </header>
                        <div className="idp-example-out-body">
                            {example.ocr.map((entry, index) => (
                                <p
                                    key={index}
                                    className={entry.type === 'latex' ? 'idp-example-latex' : 'idp-example-text'}
                                    lang={example.id === 'telugu' ? 'te' : example.id === 'hindi' ? 'hi' : 'en'}
                                >
                                    {entry.value}
                                </p>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default DocParserExamplesGallery;
