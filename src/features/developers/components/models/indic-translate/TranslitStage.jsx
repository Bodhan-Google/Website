import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { canAnimate, gsap } from '../../../../../utils/motion';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { tokenize } from './translateUtils';

gsap.registerPlugin(ScrambleTextPlugin);

/**
 * Transliteration: the same words in a different script.
 *
 * Nothing crosses here, because nothing is reordered — so the flight would be
 * the wrong picture. Instead each word churns in place through its own script's
 * glyphs and resolves into Roman, which is what the model is actually doing:
 * re-spelling, not re-saying. The churn alphabet is taken from the source
 * string itself, so Tamil crumbles into Tamil and Ol Chiki into Ol Chiki.
 */
const TranslitStage = ({ source, output, srcLabel, outLabel, srcLang, srcRtl, cer, wer, playKey, onPhase }) => {
    const lineRef = useRef(null);
    const cerRef = useRef(null);
    const werRef = useRef(null);
    const tlRef = useRef(null);

    const srcTokens = useMemo(() => tokenize(source), [source]);
    const outTokens = useMemo(() => tokenize(output), [output]);
    // Word-for-word only when the two lines agree on how many words there are;
    // punctuation sometimes detaches, and a stale pairing would churn the wrong
    // word into the wrong slot.
    const paired = srcTokens.length === outTokens.length;

    const chars = useMemo(() => {
        const set = new Set(String(source).replace(/[\s\p{P}]/gu, ''));
        const pool = Array.from(set).join('');
        return pool.length > 3 ? pool : 'अआइईकखगघ';
    }, [source]);

    const play = useCallback(() => {
        tlRef.current?.kill();
        const line = lineRef.current;
        if (!line) return;

        const cells = Array.from(line.querySelectorAll('.itr-morph'));
        if (!cells.length) return;

        // No animation possible — reduced motion, or a document the browser is
        // not painting, where a tween would freeze on its start values and leave
        // the translation invisible. Jump to the finished state instead.
        if (!canAnimate()) {
            cells.forEach((cell, index) => {
                cell.textContent = paired ? outTokens[index] : output;
            });
            if (cerRef.current) cerRef.current.textContent = cer.toFixed(2);
            if (werRef.current) werRef.current.textContent = wer.toFixed(2);
            onPhase?.('done');
            return;
        }

        // Reset to the source spelling before every run.
        cells.forEach((cell, index) => {
            cell.textContent = paired ? srcTokens[index] : source;
        });

        const tl = gsap.timeline({ onComplete: () => onPhase?.('done') });
        tlRef.current = tl;
        onPhase?.('translating');

        cells.forEach((cell, index) => {
            tl.to(
                cell,
                {
                    duration: paired ? 0.5 : 1.5,
                    ease: 'none',
                    scrambleText: {
                        text: paired ? outTokens[index] : output,
                        chars,
                        speed: 0.55,
                        revealDelay: 0,
                        tweenLength: false,
                    },
                },
                index * (paired ? 0.075 : 0)
            );
            tl.fromTo(
                cell,
                { '--heat': 1 },
                { '--heat': 0, duration: 0.8, ease: 'power2.out' },
                index * (paired ? 0.075 : 0)
            );
        });

        // The error rates land at the end, counting down to what this example
        // actually scored.
        [
            [cerRef.current, cer],
            [werRef.current, wer],
        ].forEach(([el, target]) => {
            if (!el) return;
            const proxy = { value: Math.max(0.42, target + 0.4) };
            tl.to(
                proxy,
                {
                    value: target,
                    duration: 0.7,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = proxy.value.toFixed(2);
                    },
                },
                '>-0.5'
            );
        });
    }, [cer, chars, onPhase, output, outTokens, paired, source, srcTokens, wer]);

    useEffect(() => {
        if (playKey === 0) return undefined;
        const frame = window.requestAnimationFrame(play);
        return () => window.cancelAnimationFrame(frame);
    }, [playKey, play]);

    useEffect(() => () => tlRef.current?.kill(), []);

    return (
        <div className="itr-stage itr-stage-morph">
            <div className="itr-script-flip">
                <span className="itr-script-chip is-from">{srcLabel}</span>
                <span className="itr-script-arrow" aria-hidden="true" />
                <span className="itr-script-chip is-to">{outLabel}</span>
            </div>

            <div className="itr-rail is-morph">
                <p className="itr-line itr-line-morph" lang={srcLang} dir={srcRtl ? 'rtl' : undefined} ref={lineRef}>
                    {paired ? (
                        srcTokens.map((token, index) => (
                            <Fragment key={`${index}-${token}`}>
                                <span className="itr-morph">{token}</span>{' '}
                            </Fragment>
                        ))
                    ) : (
                        <span className="itr-morph">{source}</span>
                    )}
                </p>
            </div>

            <dl className="itr-metric-row">
                <div className="itr-metric">
                    <dt>CER</dt>
                    <dd ref={cerRef}>{cer.toFixed(2)}</dd>
                </div>
                <div className="itr-metric">
                    <dt>WER</dt>
                    <dd ref={werRef}>{wer.toFixed(2)}</dd>
                </div>
                <p className="itr-metric-note">
                    Character and word error rate against the reference spelling, for this example.
                </p>
            </dl>
        </div>
    );
};

export default TranslitStage;
