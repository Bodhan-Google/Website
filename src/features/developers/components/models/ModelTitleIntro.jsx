import { useRef } from 'react';
import { ensureRevealed, gsap, useGsapAnimation } from '../../devMotion';

/**
 * Every model title arrives the same way: one clean left-to-right swipe with a
 * travelling edge. What differs is what accompanies it — a waveform being
 * written down, a word passing between languages, a page being read, a name
 * being spoken.
 *
 * The markup below renders the *finished* title. Every start state is written
 * by GSAP, and `useGsapAnimation` will not set a tween up at all unless the
 * document is actually being painted — so the one thing this component can
 * never do is leave a page heading invisible.
 */

const SWIPE = 'power2.inOut';

const Swipe = ({ text, edge = 'line', lang, dir }) => (
    <span className="mti-swipe">
        <span className="mti-text" lang={lang} dir={dir}>
            {text}
        </span>
        {edge && <span className={`mti-edge mti-edge-${edge}`} aria-hidden="true" />}
    </span>
);

/** The shared swipe, as timeline steps rather than a component of its own. */
const swipeIn = (tl, root, { duration = 1, at = 0 } = {}) => {
    const text = root.querySelector('.mti-text');
    const edge = root.querySelector('.mti-edge');

    tl.fromTo(
        text,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration, ease: SWIPE },
        at,
    );

    if (edge) {
        tl.fromTo(edge, { left: '0%', opacity: 0 }, { left: '100%', opacity: 1, duration, ease: SWIPE }, at)
            .to(edge, { opacity: 0, duration: 0.28 }, at + duration);
    }

    return tl;
};

/* ── Transcribe: audio running, the name written down as it plays ────────── */

const WAVE = [
    0.35, 0.6, 0.95, 0.5, 0.75, 1, 0.55, 0.4, 0.85, 0.5, 0.9, 0.45, 0.7, 0.9, 0.35, 0.8, 1, 0.5,
    0.65, 0.95, 0.4, 0.75, 0.55, 0.85, 0.45, 0.65, 0.35,
];

const WaveStage = ({ text }) => (
    <span className="mti-stage mti-stage-stack">
        <Swipe text={text} edge="caret" />
        <span className="mti-wave" aria-hidden="true">
            {WAVE.map((h, i) => (
                <span key={i} className="mti-wave-bar" style={{ '--h': h }} />
            ))}
        </span>
    </span>
);

const buildWave = (root) => {
    const tl = gsap.timeline();
    const wave = root.querySelector('.mti-wave');
    const bars = root.querySelectorAll('.mti-wave-bar');

    swipeIn(tl, root, { duration: 1.5, at: 0.12 });

    tl.fromTo(wave, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0)
        .fromTo(
            bars,
            { scaleY: 0.12, transformOrigin: '50% 50%' },
            {
                scaleY: (i, el) => 0.25 + Number(el.style.getPropertyValue('--h')) * 0.85,
                duration: 0.4,
                ease: 'sine.inOut',
                stagger: { each: 0.018, yoyo: true, repeat: 3 },
            },
            0.12,
        )
        .to(wave, { opacity: 0, duration: 0.45 }, 1.78);

    return tl;
};

/* ── Translate: the word for "translation", three languages, then the name ─ */

const CYCLE = [
    { text: 'अनुवाद', tag: 'hi' },
    { text: 'மொழிபெயர்ப்பு', tag: 'ta' },
    { text: 'অনুবাদ', tag: 'bn' },
];

const TranslateStage = ({ text }) => (
    <span className="mti-stage">
        <span className="mti-cycle-layer" aria-hidden="true">
            {CYCLE.map((word) => (
                <span key={word.tag} className="mti-cycle-word" lang={word.tag}>
                    {word.text}
                </span>
            ))}
        </span>
        <Swipe text={text} />
    </span>
);

const buildTranslate = (root) => {
    const tl = gsap.timeline();
    const words = root.querySelectorAll('.mti-cycle-word');
    const name = root.querySelector('.mti-swipe');
    const step = 0.5;

    // the name is held back until the cycle has run — restored by the context
    // on teardown, and never set at all if the tween cannot run
    tl.set(name, { opacity: 0 });

    words.forEach((word, i) => {
        tl.fromTo(
            word,
            { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
            { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: step * 0.7, ease: SWIPE },
            i * step,
        ).to(word, { opacity: 0, duration: step * 0.3 }, i * step + step * 0.7);
    });

    const settle = CYCLE.length * step;
    tl.to(name, { opacity: 1, duration: 0.01 }, settle);
    swipeIn(tl, root, { duration: 0.85, at: settle });

    return tl;
};

/* ── OCR: handwriting on the page, read into type as the scan passes ─────── */

const ScanStage = ({ text }) => (
    <span className="mti-stage mti-scan">
        <span className="mti-scan-box" aria-hidden="true" />
        <span className="mti-hand" aria-hidden="true">
            {text}
        </span>
        <Swipe text={text} />
    </span>
);

const buildScan = (root) => {
    const tl = gsap.timeline();
    const box = root.querySelector('.mti-scan-box');
    const hand = root.querySelector('.mti-hand');
    const scan = 1.45;

    tl.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.22 }, 0)
        // the handwritten source is wiped away from the left exactly as the
        // recognised text takes its place
        .fromTo(
            hand,
            { opacity: 1, clipPath: 'inset(0 0 0 0%)' },
            { clipPath: 'inset(0 0 0 100%)', duration: scan, ease: SWIPE },
            0.25,
        )
        .to(box, { opacity: 0, duration: 0.5 }, scan + 0.35);

    swipeIn(tl, root, { duration: scan, at: 0.25 });

    return tl;
};

/* ── Speak: the name arrives, then keeps talking ─────────────────────────── */

const EQ = [0.45, 0.9, 0.6, 1, 0.5];

const SpeakStage = ({ text }) => (
    <span className="mti-stage">
        <Swipe text={text} />
        <span className="mti-eq" aria-hidden="true">
            {EQ.map((h, i) => (
                <span key={i} style={{ '--h': h }} />
            ))}
        </span>
    </span>
);

const buildSpeak = (root) => {
    const tl = gsap.timeline();
    const eq = root.querySelector('.mti-eq');
    const bars = root.querySelectorAll('.mti-eq span');

    swipeIn(tl, root, { duration: 1, at: 0.1 });
    tl.fromTo(eq, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.1);

    // The meter keeps running after the name has landed, so it is its own
    // tween rather than a step in the timeline — a child that repeats forever
    // would give the timeline an infinite duration, and the entrance has to
    // stay finite for `ensureRevealed` to be able to complete it.
    //
    // It starts with the first letter, not once the name is there: the voice
    // is what produces the name, so it cannot arrive late.
    bars.forEach((bar, i) => {
        gsap.fromTo(
            bar,
            { scaleY: 0.18, transformOrigin: '50% 50%' },
            {
                scaleY: 0.25 + Number(bar.style.getPropertyValue('--h')) * 0.85,
                duration: 0.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 0.1 + i * 0.06,
            },
        );
    });

    return tl;
};

const VARIANTS = {
    wave: { Stage: WaveStage, build: buildWave },
    translate: { Stage: TranslateStage, build: buildTranslate },
    scan: { Stage: ScanStage, build: buildScan },
    speak: { Stage: SpeakStage, build: buildSpeak },
};

const ModelTitleIntro = ({ variant, text, className }) => {
    const ref = useRef(null);
    const entry = VARIANTS[variant];

    useGsapAnimation(
        (root) => {
            if (!entry) return undefined;

            // The swipe clips the name to nothing to begin with, so a page
            // heading is riding on this timeline actually advancing.
            const tl = entry.build(root);
            return ensureRevealed(tl, root);
        },
        ref,
        [variant, text],
    );

    if (!entry) {
        return <h1 className={className}>{text}</h1>;
    }

    const { Stage } = entry;

    return (
        <h1 className={className} ref={ref}>
            <Stage text={text} />
        </h1>
    );
};

export default ModelTitleIntro;
