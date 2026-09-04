import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { LABELS, PAGE_H, PAGE_W } from './docParserData';

// Boxes are drawn a little outside the glyphs, the way an annotator would.
const PAD_RATIO = 0.012;

const pctX = (value) => `${(value / PAGE_W) * 100}%`;
const pctY = (value) => `${(value / PAGE_H) * 100}%`;

// Deterministic per-block jitter, so a "handwritten" page looks written by a
// hand rather than by a random number generator that changes on every render.
const jitter = (order, spread) => (((order * 37) % 11) / 10 - 0.5) * 2 * spread;

/**
 * The left half of the workbench: a typeset facsimile page, the detection
 * overlay drawn over it, and the scanner beam.
 *
 * The page text is real DOM, so every detection box is *measured* from the
 * rendered block instead of being hard-coded. That keeps the overlay aligned
 * at any width, in any script, whatever the font does to line wrapping.
 */
const DocParserStage = ({
    page,
    upload,
    registerNode,
    registerBlockNode,
    boxes,
    size,
    onMeasure,
    activeOrder,
    hoverOrder,
    phase,
    showLabels,
    showOrder,
    onHoverBlock,
    onSelectBlock,
}) => {
    const paperRef = useRef(null);
    const sheetRef = useRef(null);
    const blockEls = useRef({});

    const measure = useCallback(() => {
        const sheet = sheetRef.current;
        if (!sheet || upload) return;

        const width = sheet.offsetWidth;
        const height = sheet.offsetHeight;
        if (!width || !height) return;

        const pad = width * PAD_RATIO;
        const next = page.blocks
            .map((block) => {
                const el = blockEls.current[block.order];
                if (!el) return null;
                return {
                    order: block.order,
                    label: block.label,
                    x: el.offsetLeft - pad,
                    y: el.offsetTop - pad * 0.7,
                    w: el.offsetWidth + pad * 2,
                    h: el.offsetHeight + pad * 1.4,
                };
            })
            .filter(Boolean);

        onMeasure(next, { w: width, h: height });
    }, [page, upload, onMeasure]);

    useLayoutEffect(() => {
        measure();
    }, [measure]);

    useEffect(() => {
        const paper = paperRef.current;
        if (!paper || typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(() => measure());
        observer.observe(paper);
        // Web fonts land after first paint and change every line break.
        if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
        return () => observer.disconnect();
    }, [measure]);

    // The reading-order thread: centre to centre, in the sequence the model
    // says a human would read them.
    const orderPath = boxes.length
        ? boxes
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((box, index) => `${index === 0 ? 'M' : 'L'}${(box.x + box.w / 2).toFixed(1)},${(box.y + box.h / 2).toFixed(1)}`)
              .join(' ')
        : '';

    return (
        <div className="idp-paper" ref={paperRef} data-paper={upload ? 'upload' : page.paper}>
            <div
                className="idp-camera"
                ref={(el) => registerNode('camera', el)}
            >
                <div className="idp-sheet" ref={sheetRef} data-script={upload ? 'upload' : page.script}>
                    {upload ? (
                        <img className="idp-upload-img" src={upload.url} alt={upload.name} />
                    ) : (
                        page.blocks.map((block) => (
                            <div
                                key={block.order}
                                ref={(el) => {
                                    blockEls.current[block.order] = el;
                                }}
                                className="idp-blk"
                                data-kind={block.kind}
                                data-label={block.label}
                                style={{
                                    left: pctX(block.box.x),
                                    top: pctY(block.box.y),
                                    width: pctX(block.box.w),
                                    '--tilt': `${page.paper === 'print' ? 0 : jitter(block.order, 0.32)}deg`,
                                }}
                            >
                                {block.kind === 'table' ? (
                                    <table className="idp-blk-table">
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
                                    block.display.map((line, i) => (
                                        <span key={i} className="idp-blk-line">
                                            {line}
                                        </span>
                                    ))
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Everything the scanner leaves behind, in paper coordinates. */}
                <div
                    className="idp-scanned"
                    ref={(el) => registerNode('scanned', el)}
                    aria-hidden="true"
                />

                <svg
                    className="idp-overlay"
                    viewBox={`0 0 ${size.w || PAGE_W} ${size.h || PAGE_H}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    {/* The reading-order thread and its travelling marker share a
                        group, so the toggle can hide both without fighting the
                        inline opacity GSAP writes while animating them. */}
                    <g className="idp-thread-g" data-visible={showOrder || undefined}>
                        <path
                            className="idp-thread"
                            d={orderPath}
                            ref={(el) => registerNode('path', el)}
                        />
                        <circle
                            className="idp-thread-dot"
                            r="7"
                            cx="0"
                            cy="0"
                            ref={(el) => registerNode('dot', el)}
                        />
                    </g>
                    {boxes.map((box) => (
                        <rect
                            key={box.order}
                            className="idp-rect"
                            data-tone={LABELS[box.label]?.tone ?? 'slate'}
                            data-active={activeOrder === box.order || undefined}
                            data-hover={hoverOrder === box.order || undefined}
                            x={box.x}
                            y={box.y}
                            width={Math.max(box.w, 1)}
                            height={Math.max(box.h, 1)}
                            rx="4"
                            vectorEffect="non-scaling-stroke"
                            ref={(el) => registerBlockNode('rects', box.order, el)}
                        />
                    ))}
                </svg>

                {/* Label chips ride above each box: the class name lands during
                    the sweep, the reading-order number pops in afterwards. */}
                <div className="idp-chips" data-hidden={!showLabels || undefined}>
                    {boxes.map((box) => (
                        <button
                            type="button"
                            key={box.order}
                            className="idp-chip"
                            data-tone={LABELS[box.label]?.tone ?? 'slate'}
                            data-active={activeOrder === box.order || undefined}
                            style={{
                                left: `${(box.x / (size.w || PAGE_W)) * 100}%`,
                                top: `${(box.y / (size.h || PAGE_H)) * 100}%`,
                            }}
                            ref={(el) => registerBlockNode('chips', box.order, el)}
                            onMouseEnter={() => onHoverBlock(box.order)}
                            onMouseLeave={() => onHoverBlock(0)}
                            onFocus={() => onHoverBlock(box.order)}
                            onBlur={() => onHoverBlock(0)}
                            onClick={() => onSelectBlock(box.order)}
                            tabIndex={phase === 'done' ? 0 : -1}
                        >
                            <i
                                className="idp-chip-n"
                                ref={(el) => registerBlockNode('badges', box.order, el)}
                            >
                                {box.order}
                            </i>
                            <span className="idp-chip-label">{LABELS[box.label]?.short ?? box.label}</span>
                        </button>
                    ))}
                </div>

                <div
                    className="idp-beam"
                    ref={(el) => registerNode('beam', el)}
                    aria-hidden="true"
                >
                    <span className="idp-beam-line" />
                    <span className="idp-beam-glow" />
                </div>
            </div>
        </div>
    );
};

export default DocParserStage;
