import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SpeakPlayer from './SpeakPlayer';
import { FORGE, LANG_NAME, LONGFORM, VOICES } from '../../data/indic-speak/speakEvals';
import { prefersReducedMotion } from '../charts/chartTheme';

/*
 * Section 01 — the clip first, then the evidence.
 *
 * The figure is the model's own output drawn as it is produced: one column per
 * codec frame, seven tiles high, filling left to right in step with the audio,
 * with the waveform those frames decode to underneath. Every number driving a
 * pixel — loudness, sample extremes, spectral centroid — was measured off the
 * real clip by the speech team's src/voicegen.py and travels in FORGE. Nothing
 * here is hand-drawn, and no two voices would animate the same way.
 *
 * Slowing playback is the point of the rate pill rather than a nicety: at a
 * quarter speed the seven tokens of a single frame land one after another, in
 * the order the model emits them.
 *
 * Two offscreen canvases hold the settled and unsettled renderings, so a painted
 * frame costs two blits, the few tokens still landing, and a playhead.
 */

const D36 = '0123456789abcdefghijklmnopqrstuvwxyz';

/** One base-36 digit per frame, back to 0..1. */
const series = (packed) => {
    const out = new Float32Array(packed.length);
    for (let i = 0; i < packed.length; i += 1) out[i] = D36.indexOf(packed[i]) / 35;
    return out;
};

// Three codebooks, coarse to fine, in the row order the model writes them.
const BOOK = [0, 1, 2, 2, 1, 2, 2];
const FAMILY = [
    ['#EFB187', '#D2691E', '#A8380A'], // coarse: carries the weight
    ['#F3D2A0', '#E3A45C', '#C97A2E'], // middle
    ['#DCC7AE', '#C2A078', '#A8814F'], // fine: the quietest, still visible
];
// The unsettled state is the same weave in one pale tone. It deliberately carries
// no codebook colour: nothing has been generated there yet, and a flat ghost is
// what makes all seven rows read as live once they have been.
const PALE = '#EADFD0';
const WAVE_PALE = '#E4D8C8';
const WAVE_WARM = '#B4400C';
const POP = 0.2; // seconds a token stays lit after it lands

const PAD_X = 6;
const PAD_Y = 9;
const GAP = 12;

const ForgeStage = ({ audio }) => {
    const stageRef = useRef(null);
    const readRef = useRef(null);
    const reduced = prefersReducedMotion();

    const { amp, lo, hi, br } = useMemo(
        () => ({
            amp: series(FORGE.amp),
            lo: series(FORGE.lo),
            hi: series(FORGE.hi),
            br: series(FORGE.b),
        }),
        []
    );

    useEffect(() => {
        const stage = stageRef.current;
        const context = stage?.getContext('2d');
        if (!stage || !context) return undefined;

        const N = FORGE.frames;
        const ROWS = FORGE.tok;
        const pale = document.createElement('canvas');
        const warm = document.createElement('canvas');
        const box = { w: 0, h: 0, colW: 0, latH: 0, waveH: 0, waveMid: 0 };

        // One pass over every frame. Tile shade comes from loudness and tile width
        // from brightness, so a sibilant reads narrow and sharp and a vowel full.
        const render = (g, isWarm) => {
            g.clearRect(0, 0, box.w, box.h);
            const rowH = box.latH / ROWS;

            for (let r = 0; r < ROWS; r += 1) {
                const family = FAMILY[BOOK[r]];
                for (let c = 0; c < N; c += 1) {
                    const a = amp[c];
                    g.fillStyle = isWarm ? family[a > 0.62 ? 2 : a > 0.3 ? 1 : 0] : PALE;
                    const w = box.colW * (0.58 + 0.32 * (1 - br[c]));
                    const h = rowH * (0.34 + 0.56 * a);
                    g.fillRect(
                        PAD_X + c * box.colW + (box.colW - w) / 2,
                        PAD_Y + r * rowH + (rowH - h) / 2,
                        Math.max(0.7, w),
                        Math.max(1, h)
                    );
                }
            }

            g.fillStyle = isWarm ? WAVE_WARM : WAVE_PALE;
            g.beginPath();
            g.moveTo(PAD_X, box.waveMid);
            for (let i = 0; i < N; i += 1) {
                g.lineTo(PAD_X + i * box.colW, box.waveMid - (hi[i] * 2 - 1) * box.waveH / 2);
            }
            for (let i = N - 1; i >= 0; i -= 1) {
                g.lineTo(PAD_X + i * box.colW, box.waveMid - (lo[i] * 2 - 1) * box.waveH / 2);
            }
            g.closePath();
            g.fill();
        };

        const layout = () => {
            const rect = stage.getBoundingClientRect();
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            box.w = Math.max(120, Math.round(rect.width));
            box.h = Math.max(90, Math.round(rect.height));

            [stage, pale, warm].forEach((canvas) => {
                canvas.width = Math.round(box.w * dpr);
                canvas.height = Math.round(box.h * dpr);
                canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
            });

            box.colW = (box.w - PAD_X * 2) / N;
            box.latH = Math.round((box.h - PAD_Y * 2 - GAP) * 0.5);
            box.waveH = box.h - PAD_Y * 2 - GAP - box.latH;
            box.waveMid = PAD_Y + box.latH + GAP + box.waveH / 2;

            render(pale.getContext('2d'), false);
            render(warm.getContext('2d'), true);
        };

        const paint = () => {
            const current = audio?.currentTime ?? 0;
            const f = Math.min(N, current * FORGE.fps);
            const x = PAD_X + f * box.colW;

            context.clearRect(0, 0, box.w, box.h);
            context.drawImage(pale, 0, 0, box.w, box.h);

            if (f > 0) {
                context.save();
                context.beginPath();
                context.rect(0, 0, x, box.h);
                context.clip();
                context.drawImage(warm, 0, 0, box.w, box.h);
                context.restore();
            }

            // The tokens still landing: seven per frame, a seventh of a frame apart.
            // At full speed this is a shimmer; at a quarter speed it is countable.
            if (!reduced && f > 0 && f < N) {
                const rowH = box.latH / ROWS;
                const first = Math.max(0, Math.floor(f - POP * FORGE.fps) - 1);

                for (let c = first; c <= Math.floor(f) && c < N; c += 1) {
                    for (let r = 0; r < ROWS; r += 1) {
                        const age = current - (c + r / ROWS) / FORGE.fps;
                        if (age < 0 || age > POP) continue;
                        const k = 1 - age / POP;
                        const w = box.colW * (0.58 + 0.32 * (1 - br[c])) * (1 + 1.9 * k);
                        const h = rowH * (0.34 + 0.56 * amp[c]) * (1 + 0.5 * k);
                        context.globalAlpha = 0.25 + 0.75 * k;
                        context.fillStyle = FAMILY[BOOK[r]][2];
                        context.fillRect(
                            PAD_X + c * box.colW + (box.colW - w) / 2,
                            PAD_Y + r * rowH + (rowH - h) / 2,
                            Math.max(0.8, w),
                            Math.max(1, h)
                        );
                    }
                }
                context.globalAlpha = 1;
            }

            if (f > 0 && f < N) {
                context.fillStyle = '#7A2708';
                context.fillRect(x - 0.75, PAD_Y * 0.5, 1.5, box.h - PAD_Y);
                context.beginPath();
                context.moveTo(x - 4, 0);
                context.lineTo(x + 4, 0);
                context.lineTo(x, 6);
                context.closePath();
                context.fill();
            }

            const frame = Math.floor(f);
            const read = readRef.current;
            if (read && read.dataset.frame !== String(frame)) {
                read.dataset.frame = String(frame);
                read.querySelector('[data-frames]').textContent = frame.toLocaleString('en-US');
                read.querySelector('[data-tokens]').textContent = (frame * ROWS).toLocaleString('en-US');
            }
        };

        layout();
        paint();

        const observer = new ResizeObserver(() => {
            layout();
            paint();
        });
        observer.observe(stage);

        // The loop only runs while the clip is playing and the figure is on screen;
        // a paused or scrolled-away canvas costs nothing.
        let raf = 0;
        let last = 0;
        let onScreen = true;
        const FRAME_MS = 1000 / 30;

        const loop = (now) => {
            if (!onScreen || !audio || audio.paused) {
                raf = 0;
                return;
            }
            if (now - last >= FRAME_MS) {
                last = now;
                paint();
            }
            raf = requestAnimationFrame(loop);
        };

        const start = () => {
            if (!raf && onScreen && !reduced) {
                last = 0;
                raf = requestAnimationFrame(loop);
            }
        };
        const stop = () => {
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
            paint();
        };

        const visibility = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            if (onScreen && audio && !audio.paused) start();
        });
        visibility.observe(stage);

        audio?.addEventListener('play', start);
        audio?.addEventListener('pause', stop);
        audio?.addEventListener('seeked', paint);
        audio?.addEventListener('ended', stop);

        return () => {
            if (raf) cancelAnimationFrame(raf);
            observer.disconnect();
            visibility.disconnect();
            audio?.removeEventListener('play', start);
            audio?.removeEventListener('pause', stop);
            audio?.removeEventListener('seeked', paint);
            audio?.removeEventListener('ended', stop);
        };
    }, [amp, audio, br, hi, lo, reduced]);

    return (
        <>
            <canvas
                ref={stageRef}
                className="isb-forge-stage"
                role="img"
                aria-label={`${FORGE.frames} codec frames of ${FORGE.voice}’s reading, ${FORGE.tok} tokens each, drawn from the clip’s own loudness and brightness.`}
            />
            <p className="isb-forge-read" ref={readRef} data-frame="-1">
                <b data-frames>0</b>
                <span>/{FORGE.frames} frames</span>
                <span className="isb-forge-sep">·</span>
                <b data-tokens>0</b>
                <span>/{(FORGE.frames * FORGE.tok).toLocaleString('en-US')} tokens</span>
                <span className="isb-forge-sep">·</span>
                <span>{FORGE.fps.toFixed(2)} frames a second</span>
            </p>
        </>
    );
};

const LongForm = () => {
    const [open, setOpen] = useState(false);
    const [first, ...rest] = LONGFORM.paragraphs;
    const voice = VOICES[LONGFORM.voice];
    const minutes = `${Math.floor(LONGFORM.dur / 60)}:${String(Math.round(LONGFORM.dur % 60)).padStart(2, '0')}`;

    return (
        <div className="isb-figure">
            <p className="isb-eyebrow">Long-form narration</p>
            <div className="isb-long-head">
                <span className="isb-long-voice">{LONGFORM.voice}</span>
                <span className="isb-long-tag">
                    {voice.gender} · {LANG_NAME[LONGFORM.lang]} native
                </span>
                <span className="isb-long-tag">
                    {minutes} · {LONGFORM.paragraphs.length} paragraphs
                </span>
                <span className="isb-judge">judge 5 / 5</span>
            </div>

            <SpeakPlayer src={LONGFORM.file} meta={`${LONGFORM.voice} · Ponniyin Selvan`} />

            <p className="isb-long-para" lang={LONGFORM.lang}>
                {first}
            </p>

            <details className="isb-long-rest" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
                <summary>{open ? 'Hide' : 'The remaining six paragraphs'}</summary>
                {rest.map((paragraph, index) => (
                    <p key={index} className="isb-long-para" lang={LONGFORM.lang}>
                        {paragraph}
                    </p>
                ))}
            </details>
        </div>
    );
};

const VoiceForge = () => {
    const [audio, setAudio] = useState(null);
    const onAudio = useCallback((element) => setAudio(element), []);

    return (
        <div className="isb-hear">
            <div className="isb-figure">
                <p className="isb-figure-title">Watch a voice being made</p>
                <p className="isb-figure-sub">
                    Press play. The tiles above the waveform are the audio tokens the model writes,
                    landing seven at a time, {FORGE.fps.toFixed(2)} times a second — the rate it
                    actually generates at. The waveform is what they decode to.
                </p>

                <ForgeStage audio={audio} />

                {/* A quarter speed is the interesting end of this ladder, so it is on it. */}
                <SpeakPlayer
                    src={FORGE.clip}
                    meta={`${FORGE.voice} · ${LANG_NAME[FORGE.lang]}`}
                    rates={[1, 0.5, 0.25, 2]}
                    onAudio={onAudio}
                />

                <p className="isb-figure-note">
                    Drop the speed to a quarter and the seven tokens of a single frame land one after
                    another, in the order the model emits them. Every tile’s shade is {FORGE.voice}’s
                    own loudness at that instant and its width her brightness, so no two voices draw
                    the same picture.
                </p>
            </div>

            <LongForm />
        </div>
    );
};

export default VoiceForge;
