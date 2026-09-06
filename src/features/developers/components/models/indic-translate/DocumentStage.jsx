import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { canAnimate, gsap } from '../../../../../utils/motion';
import { Check } from 'lucide-react';
import DocBlocks from './DocBlocks';
import { KIND_LABEL, splitBlocks, structureOf } from './translateUtils';

/**
 * Document translation, shown as a wipe under a pinned frame.
 *
 * The claim this section has to earn is that structure survives the trip, and
 * the honest way to show it is to render both documents in full, stack them,
 * and wipe between them: the silhouette of the page — the heading rhythm, the
 * bullets, the table grid, the code fence — visibly stays put while every word
 * inside it changes script.
 *
 * The outline boxes are measured from each document's own layout and tween from
 * one geometry to the other, so where a translated block does run longer or
 * shorter you see exactly that, rather than a box pinned in place by a
 * hard-coded number.
 */

const SCAN_DURATION = 2.6;

const measure = (canvas, layer) => {
    if (!canvas || !layer) return [];
    const base = canvas.getBoundingClientRect();
    return Array.from(layer.querySelectorAll('.itr-block')).map((el) => {
        const r = el.getBoundingClientRect();
        return {
            top: r.top - base.top,
            left: r.left - base.left,
            width: r.width,
            height: r.height,
            kind: el.dataset.kind,
        };
    });
};

const DocumentStage = ({ en, out, lang, rtl, view, playKey, onPhase, scriptNote }) => {
    const canvasRef = useRef(null);
    const srcLayerRef = useRef(null);
    const outLayerRef = useRef(null);
    const frameLayerRef = useRef(null);
    const scanRef = useRef(null);
    const preservedRef = useRef(null);
    const tlRef = useRef(null);
    const [geometry, setGeometry] = useState({ a: [], b: [] });

    const srcBlocks = useMemo(() => splitBlocks(en), [en]);
    const kinds = useMemo(() => structureOf(en), [en]);

    // Geometry is read from the live layout, so it survives a re-wrap, a width
    // change and the markup/rendered switch.
    const remeasure = useCallback(() => {
        setGeometry({
            a: measure(canvasRef.current, srcLayerRef.current),
            b: measure(canvasRef.current, outLayerRef.current),
        });
    }, []);

    useLayoutEffect(() => {
        remeasure();
    }, [remeasure, en, out, view]);

    useEffect(() => {
        if (typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(() => remeasure());
        if (canvasRef.current) observer.observe(canvasRef.current);
        return () => observer.disconnect();
    }, [remeasure]);

    const play = useCallback(() => {
        tlRef.current?.kill();
        const src = srcLayerRef.current;
        const output = outLayerRef.current;
        const frames = Array.from(frameLayerRef.current?.querySelectorAll('.itr-frame') ?? []);
        const ticks = Array.from(preservedRef.current?.querySelectorAll('.itr-preserved-item') ?? []);
        const scan = scanRef.current;
        if (!src || !output) return;

        const { a, b } = geometry;

        // No animation possible — reduced motion, or a document the browser is
        // not painting, where a tween would freeze on its start values and leave
        // the translation invisible. Jump to the finished state instead.
        if (!canAnimate()) {
            gsap.set(src, { clipPath: 'inset(100% 0 0 0)' });
            gsap.set(output, { clipPath: 'inset(0 0 0 0)', opacity: 1 });
            gsap.set(frames, { opacity: 0 });
            gsap.set(ticks, { '--on': 1 });
            onPhase?.('done');
            return;
        }

        gsap.set(src, { clipPath: 'inset(0% 0 0 0)' });
        gsap.set(output, { clipPath: 'inset(0 0 100% 0)', opacity: 1 });
        gsap.set(ticks, { '--on': 0 });
        gsap.set(scan, { opacity: 0, top: 0 });

        const tl = gsap.timeline({ onComplete: () => onPhase?.('done') });
        tlRef.current = tl;

        // 1 — the frame is found. Boxes draw themselves around the blocks they
        // belong to, each labelled with the role it will keep.
        onPhase?.('detecting');
        frames.forEach((frame, index) => {
            const box = a[index];
            if (!box) return;
            gsap.set(frame, { top: box.top, left: box.left, width: box.width, height: box.height, opacity: 1 });
            tl.fromTo(
                frame,
                { scaleX: 0, opacity: 0, transformOrigin: rtl ? 'right center' : 'left center' },
                { scaleX: 1, opacity: 1, duration: 0.34, ease: 'power3.out' },
                index * 0.055
            );
        });

        tl.to({}, { duration: 0.25 });

        // 2 — the wipe. One scan line, and every block flips exactly as it is
        // crossed: the frame morphs to the translated block's own geometry and
        // the structural role it carried ticks off the list.
        const wipe = { p: 0 };
        const total = Math.max(1, a.at(-1) ? a.at(-1).top + a.at(-1).height : 1);
        const crossed = new Set();
        const ticked = new Set();

        tl.call(() => onPhase?.('translating'))
            .to(scan, { opacity: 1, duration: 0.2 }, '<')
            .to(
                wipe,
                {
                    p: 100,
                    duration: SCAN_DURATION,
                    ease: 'none',
                    onUpdate: () => {
                        const p = wipe.p;
                        gsap.set(src, { clipPath: `inset(${p}% 0 0 0)` });
                        gsap.set(output, { clipPath: `inset(0 0 ${100 - p}% 0)` });
                        gsap.set(scan, { top: `${p}%` });

                        const line = (p / 100) * total;
                        a.forEach((box, index) => {
                            if (crossed.has(index) || box.top + box.height * 0.45 > line) return;
                            crossed.add(index);
                            const frame = frames[index];
                            const target = b[index];
                            if (frame && target) {
                                gsap.to(frame, {
                                    top: target.top,
                                    left: target.left,
                                    width: target.width,
                                    height: target.height,
                                    duration: 0.45,
                                    ease: 'power2.out',
                                });
                                gsap.fromTo(
                                    frame,
                                    { '--flash': 1 },
                                    { '--flash': 0, duration: 0.7, ease: 'power2.out' }
                                );
                            } else if (frame) {
                                // The excerpt ends before this block does; the
                                // box retires rather than pointing at nothing.
                                gsap.to(frame, { opacity: 0, duration: 0.3 });
                            }

                            const kindIndex = kinds.indexOf(box.kind);
                            if (kindIndex >= 0 && !ticked.has(kindIndex)) {
                                ticked.add(kindIndex);
                                const tick = ticks[kindIndex];
                                if (tick) gsap.to(tick, { '--on': 1, duration: 0.34, ease: 'back.out(2)' });
                            }
                        });
                    },
                },
                '<'
            )
            .to(scan, { opacity: 0, duration: 0.3 })
            .to(frames, { opacity: 0.35, duration: 0.5, stagger: 0.02 }, '<');
    }, [geometry, kinds, onPhase, rtl]);

    useEffect(() => {
        if (playKey === 0) return undefined;
        const frame = window.requestAnimationFrame(play);
        return () => window.cancelAnimationFrame(frame);
    }, [playKey, play]);

    useEffect(() => () => tlRef.current?.kill(), []);

    return (
        <div className="itr-doc-stage">
            <ul className="itr-preserved" ref={preservedRef} aria-label="Structure carried through the translation">
                {kinds.map((kind) => (
                    <li key={kind} className="itr-preserved-item">
                        <Check size={11} aria-hidden="true" />
                        {KIND_LABEL[kind] ?? kind}
                    </li>
                ))}
            </ul>

            <div className="itr-doc-viewport">
                <div className="itr-doc-canvas" ref={canvasRef}>
                    <div className="itr-doc-layer is-src" ref={srcLayerRef}>
                        <DocBlocks text={en} lang="en" view={view} />
                    </div>

                    <div className="itr-doc-layer is-out" ref={outLayerRef} aria-hidden="true">
                        <DocBlocks text={out} lang={lang} rtl={rtl} view={view} />
                    </div>

                    <div className="itr-frame-layer" ref={frameLayerRef} aria-hidden="true">
                        {srcBlocks.map((block, index) => (
                            <span key={index} className="itr-frame" data-kind={block.kind}>
                                <span className="itr-frame-tag">{KIND_LABEL[block.kind] ?? block.kind}</span>
                            </span>
                        ))}
                    </div>

                    <span className="itr-doc-scan" ref={scanRef} aria-hidden="true" />
                </div>
            </div>

            <p className="itr-stage-foot">
                Excerpted for length.
                {scriptNote ? ` Shown in ${scriptNote} script, the default for this language.` : ''} The boxes are
                measured from each document&rsquo;s own layout — where a translated block runs longer, you see the box
                grow.
            </p>
        </div>
    );
};

export default DocumentStage;
