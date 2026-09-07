import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

// Types a string out character by character. The whole line takes about the
// same time whatever its length — a long paragraph runs fast, a short sentence
// lands at reading pace — so the panel never sits there filling for seconds.
// Typing waits until the text is actually on screen, so the first example is
// still typing itself out when you scroll down to it rather than having
// finished during page load.
const DURATION_MS = 1100;
const MIN_STEP_MS = 12;

const TypedText = ({ text, className, lang, dir }) => {
    const reduceMotion = useReducedMotion();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.2 });

    const [shown, setShown] = useState(0);
    const [typed, setTyped] = useState(text);

    // New text starts over, adjusted during render rather than in an effect.
    if (typed !== text) {
        setTyped(text);
        setShown(0);
    }

    useEffect(() => {
        if (reduceMotion || !text || !inView) return undefined;

        const step = Math.max(MIN_STEP_MS, Math.round(DURATION_MS / text.length));
        const perTick = Math.max(1, Math.round(text.length / (DURATION_MS / step)));

        const timer = setInterval(() => {
            setShown((n) => {
                if (n >= text.length) {
                    clearInterval(timer);
                    return n;
                }
                return Math.min(text.length, n + perTick);
            });
        }, step);

        return () => clearInterval(timer);
    }, [text, reduceMotion, inView]);

    const count = reduceMotion ? text.length : shown;
    const typing = count < text.length;

    return (
        <p ref={ref} className={`${className ?? ''}${typing ? ' is-typing' : ''}`} lang={lang} dir={dir}>
            {text.slice(0, count)}
        </p>
    );
};

export default TypedText;
