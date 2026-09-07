import { Fragment, useId, useRef } from 'react';
import { ScrollTrigger, gsap, useGsapAnimation } from '../devMotion';

/**
 * The little animated diagram at the top of each model card.
 *
 * Each one shows what the model actually does to its input rather than being
 * decoration: speech resolving into written lines, written lines collapsing
 * into a voice, a page being read block by block, a sentence crossing between
 * two scripts. All four are the same size and share one gradient so the four
 * cards read as one set.
 */

const W = 320;
const H = 96;

/* ── Indic-Transcribe: a waveform being written down ─────────────────────── */

const WAVE_BARS = Array.from({ length: 26 }, (_, i) => {
    // a shape rather than noise, so the same run reads as one utterance
    const envelope = Math.sin((i / 25) * Math.PI) ** 0.7;
    const detail = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.7));
    return Math.max(0.14, envelope * detail);
});

// What the audio becomes. Real words rather than placeholder rules: the same
// utterance in native script and romanized, which is what the model's output
// modes actually are, so the right half of the card says what it does instead
// of leaving a blank space beside the waveform.
const ASR_LINES = [
    { y: 40, words: ['सात', 'रंग', 'दिखेंगे'] },
    { y: 62, words: ['saat', 'rang', 'dikhenge'] },
];

/** One line of output, word by word, so the words can land one at a time. */
const GlyphLine = ({ className, x, y, words }) => (
    <text className={className} x={x} y={y} xmlSpace="preserve">
        {words.map((word, i) => (
            <Fragment key={i}>
                {i > 0 && ' '}
                <tspan className="mg-word">{word}</tspan>
            </Fragment>
        ))}
    </text>
);

const WaveGlyph = () => (
    <>
        <g className="mg-wave">
            {WAVE_BARS.map((h, i) => (
                <rect
                    key={i}
                    className="mg-wave-bar"
                    x={14 + i * 5.2}
                    y={H / 2 - (h * 52) / 2}
                    width="2.6"
                    height={h * 52}
                    rx="1.3"
                    style={{ '--h': h }}
                />
            ))}
        </g>

        {/* the seam between what went in and what came out */}
        <line className="mg-seam" x1="155" y1="22" x2="155" y2={H - 22} strokeWidth="1" />

        <g className="mg-out">
            <GlyphLine className="mg-glyph-line mg-line-native" x="168" y={ASR_LINES[0].y} words={ASR_LINES[0].words} />
            <GlyphLine className="mg-glyph-line mg-line-roman" x="168" y={ASR_LINES[1].y} words={ASR_LINES[1].words} />
        </g>

        <line className="mg-head" x1="0" y1="8" x2="0" y2={H - 8} strokeWidth="1.5" />
    </>
);

/* ── Indic-Speak: written lines gathered into a voice ────────────────────── */

const EQ_BARS = [0.42, 0.72, 1, 0.6, 0.86, 0.5];

const ORB_X = 192;
const ORB_Y = H / 2;

// The text going in, code-mixed — the case the model is built for — read out
// by the voice in the middle. The orb carries a letter so the circle reads as
// "this is being spoken" rather than as an unexplained dot.
const TTS_LINES = [
    { y: 40, words: ['नमस्ते,', 'मैं'] },
    { y: 62, words: ['Bodhan', 'हूँ'] },
];

/**
 * A wavefront leaving the orb.
 *
 * Arcs rather than whole circles: sound in this card travels the one direction
 * the card is read — out of the sentence on the left, through the voice, into
 * the waveform on the right — and a full ring expanding out of the orb runs
 * backwards over the text it is supposed to be reading.
 */
const FRONT_R = 24;
const FRONT_SPREAD = 54; // degrees either side of straight ahead

const frontPath = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    const x = (ORB_X + r * Math.cos(a)).toFixed(2);
    const dy = (r * Math.sin(a)).toFixed(2);
    // top → bottom the long way round the front of the orb, so the arc bulges
    // towards the waveform
    return `M ${x} ${ORB_Y - dy} A ${r} ${r} 0 0 1 ${x} ${Number(ORB_Y) + Number(dy)}`;
};

const VoiceGlyph = () => (
    <>
        <g className="mg-in">
            <GlyphLine className="mg-glyph-line mg-line-native" x="16" y={TTS_LINES[0].y} words={TTS_LINES[0].words} />
            <GlyphLine className="mg-glyph-line mg-line-native" x="16" y={TTS_LINES[1].y} words={TTS_LINES[1].words} />
        </g>

        {/* the speaker: a breath around the orb, then wavefronts heading out */}
        <g className="mg-orb-group">
            <circle className="mg-halo" cx={ORB_X} cy={ORB_Y} r="21" strokeWidth="1.2" />

            {[0, 1, 2].map((i) => (
                <path key={i} className="mg-front" d={frontPath(FRONT_R, FRONT_SPREAD)} strokeWidth="1.5" />
            ))}

            {/* the disc and the letter on it scale as one group: GSAP resolves
                an SVG transform origin against a <g> reliably, where a <text>
                with its own transform-box drifts out of the disc */}
            <g className="mg-orb-core">
                <circle className="mg-orb" cx={ORB_X} cy={ORB_Y} r="17" />
                <text className="mg-orb-letter" x={ORB_X} y={ORB_Y} textAnchor="middle" dominantBaseline="central">
                    अ
                </text>
            </g>
        </g>

        <g className="mg-eq">
            {EQ_BARS.map((h, i) => (
                <rect
                    key={i}
                    className="mg-eq-bar"
                    x={236 + i * 13}
                    y={H / 2 - (h * 46) / 2}
                    width="5"
                    height={h * 46}
                    rx="2.5"
                    style={{ '--h': h }}
                />
            ))}
        </g>
    </>
);

/* ── Indic-OCR: a page read block by block, in reading order ─────────────── */

// x, y, w, h in the 320×96 box — a page's worth of layout, roughly to scale
const BLOCKS = [
    { x: 30, y: 18, w: 62, h: 7 },
    { x: 30, y: 33, w: 82, h: 7 },
    { x: 30, y: 48, w: 82, h: 7 },
    { x: 30, y: 63, w: 48, h: 7 },
    { x: 148, y: 18, w: 74, h: 7 },
    { x: 148, y: 33, w: 74, h: 22, fig: true },
    { x: 148, y: 63, w: 56, h: 7 },
    { x: 238, y: 18, w: 60, h: 22, fig: true },
    { x: 238, y: 48, w: 60, h: 7 },
    { x: 238, y: 63, w: 42, h: 7 },
];

const PageGlyph = () => (
    <>
        <rect className="mg-page" x="14" y="8" width={W - 28} height={H - 16} rx="8" strokeWidth="1.5" />

        <g className="mg-blocks">
            {BLOCKS.map((b, i) => (
                <rect
                    key={i}
                    className={`mg-block${b.fig ? ' mg-block-fig' : ''}`}
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx="3.5"
                />
            ))}
        </g>

        {/* the box the layout model is holding right now */}
        <rect className="mg-focus" x="0" y="0" width="10" height="10" rx="4" strokeWidth="2" />

        <line className="mg-head" x1="0" y1="10" x2="0" y2={H - 10} strokeWidth="1.5" />
    </>
);

/* ── Indic-Translate: a sentence crossing between two scripts ────────────── */

const ARCS = [
    'M 64 30 C 130 17, 194 17, 258 30',
    'M 64 48 C 130 45, 194 45, 258 48',
    'M 64 66 C 130 79, 194 79, 258 66',
];

const BridgeGlyph = () => (
    <>
        <g className="mg-script">
            <text className="mg-glyph-text" x="26" y="36">अ</text>
            <text className="mg-glyph-text" x="26" y="60">ব</text>
            <text className="mg-glyph-text" x="26" y="84">க</text>
        </g>

        <g className="mg-arcs">
            {ARCS.map((d, i) => (
                <path key={i} className="mg-arc" d={d} strokeWidth="1.6" fill="none" />
            ))}
        </g>

        {ARCS.map((d, i) => (
            <path key={`p${i}`} id={`mg-arc-${i}`} d={d} className="mg-arc-hidden" fill="none" />
        ))}

        <g className="mg-dots">
            {ARCS.map((_, i) => (
                <circle key={i} className="mg-dot" r="3.4" cx="0" cy="0" />
            ))}
        </g>

        <g className="mg-script mg-script-right">
            <text className="mg-glyph-text" x="272" y="36">Aa</text>
            <text className="mg-glyph-text" x="272" y="60">Bb</text>
            <text className="mg-glyph-text" x="272" y="84">Cc</text>
        </g>
    </>
);

/* ── timelines ───────────────────────────────────────────────────────────── */

const buildWave = (root) => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
    const bars = root.querySelectorAll('.mg-wave-bar');
    const words = root.querySelectorAll('.mg-word');
    const seam = root.querySelector('.mg-seam');
    const head = root.querySelector('.mg-head');

    tl.fromTo(
        bars,
        { scaleY: 0.12 },
        { scaleY: (i, el) => 0.55 + Number(el.style.getPropertyValue('--h')) * 0.9, duration: 0.5, stagger: { each: 0.035, from: 'start' } },
        0,
    )
        .to(bars, { scaleY: 0.18, duration: 0.5, stagger: { each: 0.035, from: 'start' } }, 0.85)
        .fromTo(head, { x: 8, opacity: 0 }, { x: 300, opacity: 1, duration: 1.5, ease: 'none' }, 0)
        .to(head, { opacity: 0, duration: 0.25 }, 1.5)
        .fromTo(seam, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.35)
        // The transcript lands a word at a time, behind the head crossing the
        // waveform — the same order the live demo writes in. Opacity only: a
        // <tspan> does not honour a CSS transform in every browser.
        .fromTo(
            words,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, stagger: 0.13, ease: 'power2.out' },
            0.5,
        )
        .to(words, { opacity: 0.16, duration: 0.28, stagger: 0.03 }, 2.66)
        .set({}, {}, 3);

    return tl;
};

const buildVoice = (root) => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
    const words = root.querySelectorAll('.mg-word');
    const halo = root.querySelector('.mg-halo');
    const fronts = root.querySelectorAll('.mg-front');
    const orb = root.querySelector('.mg-orb-core');
    const bars = root.querySelectorAll('.mg-eq-bar');

    // Everything the orb throws off is scaled about the orb's own centre in
    // user units. `svgOrigin` is the reliable way to say that for a <path>
    // whose bounding box is nowhere near the point it turns around.
    const fromOrb = { svgOrigin: `${ORB_X} ${ORB_Y}` };

    // 1. the sentence is read, a word at a time
    tl.fromTo(words, { opacity: 0.18 }, { opacity: 1, duration: 0.26, stagger: 0.14, ease: 'power2.out' }, 0)

        // 2. the voice draws breath on the last word, then settles — the small
        //    overshoot is what makes the orb read as speaking rather than
        //    throbbing on a timer
        .fromTo(orb, { scale: 0.84, transformOrigin: '50% 50%' }, { scale: 1.1, duration: 0.32, ease: 'back.out(2.4)' }, 0.48)
        .to(orb, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.62)' }, 0.8)
        .fromTo(halo, { ...fromOrb, scale: 0.86, opacity: 0 }, { scale: 1.22, opacity: 0.45, duration: 0.32 }, 0.48)
        .to(halo, { scale: 0.95, opacity: 0, duration: 0.7, ease: 'power2.out' }, 0.8)

        // 3. three wavefronts leave the orb towards the waveform. Forward only:
        //    the arcs never travel back across the sentence on the left.
        .fromTo(
            fronts,
            { ...fromOrb, scale: 0.6, opacity: 0 },
            { scale: 1.75, duration: 1.35, ease: 'power2.out', stagger: 0.26 },
            0.62,
        )
        .to(fronts, { opacity: 0.55, duration: 0.2, ease: 'none', stagger: 0.26 }, 0.62)
        .to(fronts, { opacity: 0, duration: 0.95, ease: 'power1.in', stagger: 0.26 }, 0.86)

        // 4. the waveform picks up just as the first front reaches it, and the
        //    bars carry on for as long as the voice does
        .fromTo(
            bars,
            { scaleY: 0.16 },
            {
                scaleY: (i, el) => 0.5 + Number(el.style.getPropertyValue('--h')) * 0.95,
                duration: 0.32,
                ease: 'power2.out',
                stagger: { each: 0.065, yoyo: true, repeat: 3 },
            },
            1,
        )
        // the yoyo lands the last bar back down at 2.61; settling before that
        // would put two tweens on the same scaleY at once
        .to(bars, { scaleY: 0.16, duration: 0.42, stagger: 0.05 }, 2.61)

        // 5. the sentence dims back to where the loop starts, so the repeat is
        //    a breath rather than a cut
        .to(words, { opacity: 0.18, duration: 0.4, stagger: 0.05 }, 2.5)
        .set({}, {}, 3.3);

    return tl;
};

const buildPage = (root) => {
    const tl = gsap.timeline({ repeat: -1 });
    const blocks = root.querySelectorAll('.mg-block');
    const focus = root.querySelector('.mg-focus');
    const head = root.querySelector('.mg-head');

    tl.fromTo(head, { x: 12, opacity: 0 }, { x: 306, opacity: 1, duration: 1.1, ease: 'none' }, 0)
        .to(head, { opacity: 0, duration: 0.3 }, 1.1)
        .fromTo(blocks, { opacity: 0.18, scaleX: 0.4, transformOrigin: '0% 50%' }, { opacity: 1, scaleX: 1, duration: 0.3, stagger: 0.12, ease: 'power2.out' }, 0.15);

    // the focus box walks the blocks in reading order
    BLOCKS.forEach((b, i) => {
        tl.to(
            focus,
            {
                attr: { x: b.x - 4, y: b.y - 4, width: b.w + 8, height: b.h + 8 },
                opacity: 1,
                duration: 0.16,
                ease: 'power2.inOut',
            },
            0.15 + i * 0.12,
        );
    });

    tl.to(focus, { opacity: 0, duration: 0.3 }, 1.7)
        .to(blocks, { opacity: 0.3, duration: 0.4, stagger: 0.03 }, 2.5)
        .set({}, {}, 3.2);

    return tl;
};

const buildBridge = (root) => {
    const tl = gsap.timeline({ repeat: -1 });
    const arcs = root.querySelectorAll('.mg-arc');
    const dots = root.querySelectorAll('.mg-dot');
    const paths = root.querySelectorAll('.mg-arc-hidden');
    const left = root.querySelectorAll('.mg-script:not(.mg-script-right) text');
    const right = root.querySelectorAll('.mg-script-right text');

    tl.fromTo(left, { opacity: 0.25, y: 4 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: 'power2.out' }, 0)
        .fromTo(arcs, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.14, ease: 'power2.inOut' }, 0.25);

    dots.forEach((dot, i) => {
        const at = 0.35 + i * 0.14;
        tl.fromTo(
            dot,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.7,
                ease: 'none',
                motionPath: { path: paths[i], align: paths[i], alignOrigin: [0.5, 0.5] },
            },
            at,
        );
    });

    tl.to(dots, { opacity: 0, duration: 0.2, stagger: 0.1 }, 1.15)
        .fromTo(right, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: 'power2.out' }, 1.05)
        .to([...left, ...right], { opacity: 0.3, duration: 0.4 }, 2.4)
        .to(arcs, { drawSVG: '100% 100%', duration: 0.4, stagger: 0.08 }, 2.4)
        .set({}, {}, 3);

    return tl;
};

const GLYPHS = {
    wave: { Shape: WaveGlyph, build: buildWave },
    voice: { Shape: VoiceGlyph, build: buildVoice },
    page: { Shape: PageGlyph, build: buildPage },
    bridge: { Shape: BridgeGlyph, build: buildBridge },
};

const ModelGlyph = ({ kind, from, to, className = '' }) => {
    const ref = useRef(null);
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const entry = GLYPHS[kind] ?? GLYPHS.wave;
    const { Shape, build } = entry;

    // Four looping timelines on one page is exactly the kind of thing that
    // keeps a laptop fan going, so each one only runs while it is on screen.
    useGsapAnimation(
        (root) => {
            const tl = build(root);
            tl.pause(0);
            ScrollTrigger.create({
                trigger: root,
                start: 'top bottom',
                end: 'bottom top',
                onToggle: ({ isActive }) => (isActive ? tl.play() : tl.pause()),
            });
        },
        ref,
        [kind],
    );

    return (
        <svg
            ref={ref}
            className={`mg ${className}`}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            role="presentation"
            aria-hidden="true"
            style={{ '--mg-from': from, '--mg-to': to }}
        >
            <defs>
                <linearGradient id={`mg-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={from} />
                    <stop offset="100%" stopColor={to} />
                </linearGradient>
            </defs>

            <g style={{ '--mg-grad': `url(#mg-grad-${uid})` }} className={`mg-body mg-${kind}`}>
                <Shape gradientId={`mg-grad-${uid}`} />
            </g>
        </svg>
    );
};

export default ModelGlyph;
