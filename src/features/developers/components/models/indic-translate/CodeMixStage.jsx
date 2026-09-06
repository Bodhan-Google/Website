import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { canAnimate, gsap } from '../../../../../utils/motion';
import { buildFlight } from './flight';
import { isIndic, tokenize } from './translateUtils';

const normalise = (text) => String(text).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/**
 * Which rail a mixed-line token came from. Exact match first, then a shared
 * prefix of at least three characters — enough to catch "groceries" against
 * "groceries." and Devanagari inflections of the same stem, and short enough
 * that unrelated words do not match. When nothing matches, the token launches
 * from the same relative position in its rail, so it still comes from the
 * right side of the sentence.
 */
function findOrigin(token, railEls, ratio) {
    const target = normalise(token);
    let best = null;
    let bestScore = 0;

    railEls.forEach((el) => {
        const candidate = normalise(el.textContent);
        if (!candidate) return;
        let score = 0;
        if (candidate === target) score = 999;
        else {
            let shared = 0;
            const limit = Math.min(candidate.length, target.length);
            while (shared < limit && candidate[shared] === target[shared]) shared += 1;
            if (shared >= 3) score = shared;
        }
        if (score > bestScore) {
            bestScore = score;
            best = el;
        }
    });

    if (best) return best;
    if (!railEls.length) return null;
    return railEls[Math.min(railEls.length - 1, Math.round(ratio * (railEls.length - 1)))];
}

/**
 * Code-mixed translation, shown as an assembly.
 *
 * The mixed line is the only output on the page that has two parents, and the
 * animation is built around that: English tokens fly up from the English rail,
 * Indic tokens from the native rail, and each keeps its rail's colour when it
 * lands. What you end up looking at is a single sentence, colour-coded by where
 * each of its words came from.
 */
const CodeMixStage = ({ en, native, mix, langAbbr, langCode, rtl, playKey, onPhase, unavailable }) => {
    const stageRef = useRef(null);
    const enRef = useRef(null);
    const nativeRef = useRef(null);
    const mixRef = useRef(null);
    const flierRef = useRef(null);
    const tlRef = useRef(null);

    const enTokens = useMemo(() => tokenize(en), [en]);
    const nativeTokens = useMemo(() => tokenize(native), [native]);
    const mixTokens = useMemo(() => tokenize(mix), [mix]);

    const play = useCallback(() => {
        tlRef.current?.kill();
        const stage = stageRef.current;
        const layer = flierRef.current;
        const mixLine = mixRef.current;
        if (!stage || !layer || !mixLine) return;

        const mixEls = Array.from(mixLine.querySelectorAll('.itr-tok'));
        const enEls = Array.from(enRef.current?.querySelectorAll('.itr-tok') ?? []);
        const nativeEls = Array.from(nativeRef.current?.querySelectorAll('.itr-tok') ?? []);
        if (!mixEls.length) return;

        // No animation possible — reduced motion, or a document the browser is
        // not painting, where a tween would freeze on its start values and leave
        // the translation invisible. Jump to the finished state instead.
        if (!canAnimate()) {
            gsap.set(mixEls, { opacity: 1, y: 0, scale: 1, filter: 'none' });
            onPhase?.('done');
            return;
        }

        gsap.set(mixEls, { opacity: 0, y: 9, scale: 0.86, filter: 'blur(6px)' });
        gsap.set([...enEls, ...nativeEls], { '--lit': 0, opacity: 1 });
        layer.replaceChildren();

        const tl = gsap.timeline({ onComplete: () => onPhase?.('done') });
        tlRef.current = tl;
        onPhase?.('reading');

        // Both rails are read before either is drawn from.
        tl.to(enEls, { '--lit': 1, duration: 0.2, stagger: 0.03, ease: 'power1.out' })
            .to(enEls, { '--lit': 0.2, duration: 0.24, stagger: 0.008 }, '>-0.08')
            .to(nativeEls, { '--lit': 1, duration: 0.2, stagger: 0.03, ease: 'power1.out' }, '>-0.2')
            .to(nativeEls, { '--lit': 0.2, duration: 0.24, stagger: 0.008 }, '>-0.08');

        const pairs = mixEls.map((to, index) => {
            const token = mixTokens[index] ?? '';
            const fromIndic = isIndic(token);
            const rail = fromIndic ? nativeEls : enEls;
            const ratio = mixEls.length > 1 ? index / (mixEls.length - 1) : 0;
            const from = findOrigin(token, rail, ratio);
            const tone = fromIndic ? 'saffron' : 'sky';
            to.dataset.tone = tone;
            return { from, to, text: from?.textContent ?? token, tone };
        });

        tl.call(() => onPhase?.('translating'));
        tl.add(buildFlight({ stage, layer, pairs, stagger: 0.08, duration: 0.7, lift: 0.8 }), '>-0.1');
        tl.to([...enEls, ...nativeEls], { '--lit': 0, opacity: 0.5, duration: 0.4 }, '<0.35');
    }, [mixTokens, onPhase]);

    useEffect(() => {
        if (playKey === 0 || unavailable) return undefined;
        const frame = window.requestAnimationFrame(play);
        return () => window.cancelAnimationFrame(frame);
    }, [playKey, play, unavailable]);

    useEffect(() => () => tlRef.current?.kill(), []);

    if (unavailable) {
        return (
            <div className="itr-stage itr-stage-empty">
                <p>
                    The training mix includes code-mixed text for every language, but a captured example
                    generation is only on hand for Hindi so far. Switch the language to Hindi to watch a real one
                    assemble.
                </p>
            </div>
        );
    }

    return (
        <div className="itr-stage itr-stage-mix" ref={stageRef}>
            <div className="itr-rail is-src" data-tone="sky">
                <span className="itr-rail-tag">EN</span>
                <p className="itr-line" lang="en" ref={enRef}>
                    {enTokens.map((token, index) => (
                        <Fragment key={`en-${index}-${token}`}>
                            <span className="itr-tok">{token}</span>{' '}
                        </Fragment>
                    ))}
                </p>
            </div>

            <div className="itr-rail is-src" data-tone="saffron">
                <span className="itr-rail-tag">{langAbbr}</span>
                <p className="itr-line" lang={langCode} dir={rtl ? 'rtl' : undefined} ref={nativeRef}>
                    {nativeTokens.map((token, index) => (
                        <Fragment key={`na-${index}-${token}`}>
                            <span className="itr-tok">{token}</span>{' '}
                        </Fragment>
                    ))}
                </p>
            </div>

            <div className="itr-mix-join" aria-hidden="true">
                <svg viewBox="0 0 240 44" preserveAspectRatio="none">
                    <path d="M 30 2 C 30 30 120 14 120 42" />
                    <path d="M 210 2 C 210 30 120 14 120 42" />
                </svg>
            </div>

            <div className="itr-rail is-out is-mix" data-tone="violet">
                <span className="itr-rail-tag">MIX</span>
                <p className="itr-line" lang={langCode} dir={rtl ? 'rtl' : undefined} ref={mixRef}>
                    {mixTokens.map((token, index) => (
                        <Fragment key={`mix-${index}-${token}`}>
                            <span className="itr-tok">{token}</span>{' '}
                        </Fragment>
                    ))}
                </p>
            </div>

            <p className="itr-stage-foot">
                Each landed word keeps the colour of the rail it flew from. No automatic metric exists for
                code-mixed output yet, so this one is not score-ranked.
            </p>

            <div className="itr-fliers" ref={flierRef} aria-hidden="true" />
        </div>
    );
};

export default CodeMixStage;
