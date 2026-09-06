import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { canAnimate, gsap } from '../../../../../utils/motion';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ArrowDown } from 'lucide-react';
import { buildFlight, proportionalPairs } from './flight';
import { tokenize } from './translateUtils';

gsap.registerPlugin(DrawSVGPlugin);

/**
 * Two stacked rails and the flight between them. Used by every single-line
 * mode — sentence, romanized and Indic → Indic — because they differ only in
 * what the rails are labelled and what happens before the flight starts.
 *
 * Stacked rather than side by side on purpose: a full-width line leaves room
 * for the arcs to cross, and crossing is the part worth seeing.
 */
const SentenceStage = ({
    source,
    output,
    srcTag,
    outTag,
    srcLang,
    outLang,
    srcRtl,
    outRtl,
    tone = 'saffron',
    playKey,
    pivot = null,
    onPhase,
    footnote,
}) => {
    const stageRef = useRef(null);
    const srcLineRef = useRef(null);
    const outLineRef = useRef(null);
    const flierRef = useRef(null);
    const bridgeRef = useRef(null);
    const pivotRef = useRef(null);
    const tlRef = useRef(null);

    const srcTokens = useMemo(() => tokenize(source), [source]);
    const outTokens = useMemo(() => tokenize(output), [output]);

    const settle = useCallback(() => {
        const outEls = outLineRef.current?.querySelectorAll('.itr-tok');
        if (outEls) gsap.set(outEls, { opacity: 1, y: 0, scale: 1, filter: 'none' });
        const srcEls = srcLineRef.current?.querySelectorAll('.itr-tok');
        if (srcEls) gsap.set(srcEls, { opacity: 1, '--lit': 0 });
        flierRef.current?.replaceChildren();
        onPhase?.('done');
    }, [onPhase]);

    const play = useCallback(() => {
        tlRef.current?.kill();
        const stage = stageRef.current;
        const srcLine = srcLineRef.current;
        const outLine = outLineRef.current;
        const layer = flierRef.current;
        if (!stage || !srcLine || !outLine || !layer) return;

        // No animation possible — reduced motion, or a document the browser is
        // not painting, where a tween would freeze on its start values and leave
        // the translation invisible. Jump to the finished state instead.
        if (!canAnimate()) {
            settle();
            return;
        }

        const srcEls = Array.from(srcLine.querySelectorAll('.itr-tok'));
        const outEls = Array.from(outLine.querySelectorAll('.itr-tok'));
        if (!srcEls.length || !outEls.length) {
            settle();
            return;
        }

        // Output is laid out but invisible: the flight needs its boxes to
        // measure against, so it cannot be display:none.
        gsap.set(outEls, { opacity: 0, y: 9, scale: 0.86, filter: 'blur(6px)' });
        gsap.set(srcEls, { opacity: 1, '--lit': 0 });
        layer.replaceChildren();

        const tl = gsap.timeline({
            onComplete: () => onPhase?.('done'),
        });
        tlRef.current = tl;

        // 1 — the read. A highlight runs the length of the source line at the
        // speed of a fast reader, so the model is seen taking the line in
        // before anything leaves it.
        onPhase?.('reading');
        tl.to(srcEls, {
            '--lit': 1,
            duration: 0.22,
            stagger: { each: Math.min(0.038, 1.1 / srcEls.length) },
            ease: 'power1.out',
        });
        tl.to(srcEls, { '--lit': 0.18, duration: 0.3, stagger: 0.01, ease: 'power1.inOut' }, '>-0.1');

        // 2 — the pivot, for Indic → Indic only: the English waypoint appears,
        // is struck out, and the direct route draws instead.
        if (pivot && pivotRef.current) {
            const node = pivotRef.current;
            const strike = node.querySelector('.itr-pivot-strike');
            tl.call(() => onPhase?.('routing'))
                .fromTo(node, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(2)' })
                .fromTo(strike, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.26, ease: 'power2.in' })
                .to(node, { opacity: 0.28, scale: 0.94, duration: 0.3, ease: 'power2.out' });
        }

        // 3 — the conduit draws, and a carrier runs down it.
        const path = bridgeRef.current?.querySelector('.itr-bridge-path');
        const carrier = bridgeRef.current?.querySelector('.itr-bridge-carrier');
        if (path) {
            tl.call(() => onPhase?.('translating'))
                .fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.42, ease: 'power2.inOut' }, '>-0.05');
        }
        if (carrier) {
            tl.fromTo(
                carrier,
                { opacity: 0, xPercent: -50, scaleX: 0.2 },
                { opacity: 1, xPercent: 50, scaleX: 1, duration: 0.5, ease: 'power1.inOut' },
                '<'
            ).to(carrier, { opacity: 0, duration: 0.2 }, '>-0.1');
        }

        // 4 — the flight itself.
        const pairs = proportionalPairs(srcEls, outEls, outTokens, tone);
        const flight = buildFlight({
            stage,
            layer,
            pairs,
            stagger: Math.min(0.055, 1.5 / Math.max(1, outEls.length)),
            duration: 0.62,
        });
        tl.add(flight, '>-0.16');

        // 5 — the source line steps back once the meaning has moved.
        tl.to(srcEls, { '--lit': 0, opacity: 0.55, duration: 0.4, ease: 'power2.out' }, '<0.3');

        return undefined;
    }, [outTokens, onPhase, pivot, settle, tone]);

    useEffect(() => {
        if (playKey === 0) return undefined;
        const frame = window.requestAnimationFrame(play);
        return () => window.cancelAnimationFrame(frame);
    }, [playKey, play]);

    useEffect(() => () => tlRef.current?.kill(), []);

    return (
        <div className="itr-stage" ref={stageRef}>
            <div className="itr-rail is-src" data-tone={tone}>
                <span className="itr-rail-tag">{srcTag}</span>
                <p className="itr-line" lang={srcLang} dir={srcRtl ? 'rtl' : undefined} ref={srcLineRef}>
                    {srcTokens.map((token, index) => (
                        <Fragment key={`${index}-${token}`}>
                            <span className="itr-tok">{token}</span>{' '}
                        </Fragment>
                    ))}
                </p>
            </div>

            <div className="itr-bridge" ref={bridgeRef} aria-hidden="true">
                <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="itr-bridge-svg">
                    <path className="itr-bridge-path" d="M 8 8 C 240 8 300 32 500 32 C 700 32 760 8 992 8" />
                </svg>
                <span className="itr-bridge-carrier" />
                <span className="itr-bridge-icon">
                    <ArrowDown size={13} aria-hidden="true" />
                </span>

                {pivot ? (
                    <span className="itr-pivot" ref={pivotRef}>
                        <span className="itr-pivot-label">{pivot}</span>
                        <svg className="itr-pivot-svg" viewBox="0 0 60 20" aria-hidden="true">
                            <line className="itr-pivot-strike" x1="4" y1="16" x2="56" y2="4" />
                        </svg>
                    </span>
                ) : null}
            </div>

            <div className="itr-rail is-out" data-tone={tone}>
                <span className="itr-rail-tag">{outTag}</span>
                <p className="itr-line" lang={outLang} dir={outRtl ? 'rtl' : undefined} ref={outLineRef}>
                    {outTokens.map((token, index) => (
                        <Fragment key={`${index}-${token}`}>
                            <span className="itr-tok">{token}</span>{' '}
                        </Fragment>
                    ))}
                </p>
            </div>

            {footnote ? <p className="itr-stage-foot">{footnote}</p> : null}

            <div className="itr-fliers" ref={flierRef} aria-hidden="true" />
        </div>
    );
};

export default SentenceStage;
