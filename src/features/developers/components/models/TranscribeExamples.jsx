import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Pause, Play } from 'lucide-react';
import { AUDIO_EXAMPLES, MODE_LABELS } from '../../data/transcribeExamples';
import { assetUrl } from '../../data/assetUrl';
import { CONSOLE_URL } from '../../../../config/links';
import { EASE, canAnimate, ensureRevealed, gsap, useGsapAnimation } from '../../devMotion';
import useAudioAnalyser from './indic-transcribe/useAudioAnalyser';

const BAR_COUNT = 64;

// The meter at rest: a near-flat baseline with just enough jitter to read as a
// waveform waiting for a signal rather than a row of identical ticks. Every
// bar is a full-height element scaled down to this, so the shape is a
// transform and nothing in the row ever relayouts.
const IDLE = Array.from({ length: BAR_COUNT }, (_, i) => 0.11 + ((i * 29) % 7) / 64);

// The transcript follows the audio rather than racing it. Nothing is written
// for the first TRAIL of the clip — the model is listening — and the last words
// land TAIL after the audio has already stopped, so the writing is still
// catching up when the room goes quiet. Both are fractions of the clip's own
// length, so a nine-second sample and a five-minute one read at the same
// relative pace.
//
// Between them they set the pace: the words are spread over WINDOW of the
// clip's length rather than crammed into it. These are the two numbers to turn
// if the transcript wants to be slower or later still.
//
// The head itself moves linearly. There is no per-word timing in the data, and
// anything fancier drifts away from the audio rather than towards it — it used
// to advance as ratio ** 2.2, which meant a fifth of the words had appeared by
// the halfway mark and the rest arrived in a rush at the end.
const TRAIL = 0.18;
const TAIL = 0.3;
const WINDOW = 1 + TAIL - TRAIL;

const STATUS_LABEL = {
    ready: 'Ready',
    listening: 'Listening',
    writing: 'Writing',
    done: 'Transcribed',
    paused: 'Paused',
};

const clamp01 = (n) => Math.min(1, Math.max(0, n));

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

const TranscribeExamples = () => {
    const cardRef = useRef(null);
    const audioRef = useRef(null);
    const captionRef = useRef(null);
    const trackRef = useRef(null);
    const playheadRef = useRef(null);
    const ringRef = useRef(null);
    const idleRef = useRef(null);
    const modesRef = useRef(null);
    const pillRef = useRef(null);
    const listRef = useRef(null);
    const markerRef = useRef(null);

    // One element and one GSAP setter per bar. The setters are built once the
    // row is mounted and then reused every frame — a quickSetter skips the
    // whole tween pipeline, which is what makes writing 64 transforms a frame
    // affordable.
    const barsRef = useRef([]);
    const setBarsRef = useRef([]);
    const levelsRef = useRef(Float32Array.from(IDLE));
    const samplesRef = useRef(null);
    const playheadSetRef = useRef(null);

    // Whether the clip is routed through the analyser. Until it is, the
    // analyser has nothing to read and the meter falls back to a synthetic
    // envelope, so this has to be checked before trusting a level.
    const wiredRef = useRef(false);
    const pillPlacedRef = useRef(false);
    const markerPlacedRef = useRef(false);

    const { analyserRef, ensure, connectElement } = useAudioAnalyser();

    const [activeId, setActiveId] = useState(AUDIO_EXAMPLES[0].id);
    const [mode, setMode] = useState('native');
    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [copied, setCopied] = useState(false);

    // Which bar the meter has reached, and which word the caret sits on. Both
    // are whole numbers, so following the audio only re-renders when one of
    // them actually changes — roughly once per bar rather than once per frame.
    const [bar, setBar] = useState(0);
    const [head, setHead] = useState(0);

    // The audio is over but the transcript is still landing its last words.
    const [tailing, setTailing] = useState(false);

    // The panel starts blank: the transcript is written as the audio runs, so
    // there is nothing to show until someone presses play.
    const [started, setStarted] = useState(false);

    const example = AUDIO_EXAMPLES.find((e) => e.id === activeId) ?? AUDIO_EXAMPLES[0];
    const text = example.modes[mode];
    const words = useMemo(() => example.modes[mode].split(' '), [example, mode]);

    const done = started && head >= words.length;
    const status = !started ? 'ready' : playing ? 'listening' : tailing ? 'writing' : done ? 'done' : 'paused';

    /* ── The meter ──────────────────────────────────────────────────────────
       The bars are not a picture of the file. They are drawn as the clip
       plays, from the level the analyser is reporting at that moment, so what
       is left behind the playhead is the envelope of what has actually been
       heard — and everything ahead of it is still the flat baseline. */

    const setters = useCallback(() => {
        const bars = barsRef.current;
        if (setBarsRef.current.length !== BAR_COUNT && bars.filter(Boolean).length === BAR_COUNT) {
            setBarsRef.current = bars.map((el) => gsap.quickSetter(el, 'scaleY'));
        }
        return setBarsRef.current;
    }, []);

    const level = useCallback(() => {
        const analyser = analyserRef.current;
        if (analyser && wiredRef.current) {
            let samples = samplesRef.current;
            if (!samples || samples.length !== analyser.fftSize) {
                samples = new Uint8Array(analyser.fftSize);
                samplesRef.current = samples;
            }
            analyser.getByteTimeDomainData(samples);
            // Every fourth sample is plenty for a level, and a quarter of the
            // work per frame.
            let sum = 0;
            let n = 0;
            for (let i = 0; i < samples.length; i += 4) {
                const v = (samples[i] - 128) / 128;
                sum += v * v;
                n += 1;
            }
            return Math.min(1, Math.sqrt(sum / Math.max(1, n)) * 3.4);
        }

        // No analyser — an old browser, or an audio context that would not
        // resume. Two slow sines beating against each other read as speech
        // closely enough that the meter still draws itself rather than
        // flatlining, which would look broken.
        const t = performance.now() / 1000;
        const a = Math.sin(t * 9.3) * 0.5 + 0.5;
        const b = Math.sin(t * 3.1 + 1.7) * 0.5 + 0.5;
        return 0.2 + a * b * 0.7;
    }, [analyserRef]);

    const trace = useCallback(
        (played) => {
            const write = setters();
            if (!write.length) return;
            const at = Math.min(BAR_COUNT - 1, Math.floor(played * BAR_COUNT));
            // A bar keeps the loudest moment inside its own slice of the clip,
            // so the trace is the envelope of that slice rather than whatever
            // the signal happened to be doing on the frame the head crossed it.
            const next = Math.max(levelsRef.current[at], IDLE[at], level());
            if (next === levelsRef.current[at]) return;
            levelsRef.current[at] = next;
            write[at](next);
        },
        [level, setters],
    );

    const resetTrace = useCallback(() => {
        levelsRef.current = Float32Array.from(IDLE);
        const bars = barsRef.current.filter(Boolean);
        if (!bars.length) return;
        setBarsRef.current = [];
        playheadSetRef.current?.(0);
        if (!canAnimate()) {
            bars.forEach((el, i) => gsap.set(el, { scaleY: IDLE[i] }));
            return;
        }
        // The old trace is wiped from the middle outwards, so switching sample
        // reads as the meter clearing rather than the row blinking.
        gsap.to(bars, {
            scaleY: (i) => IDLE[i],
            duration: 0.5,
            ease: 'power2.out',
            stagger: { each: 0.005, from: 'center' },
        });
    }, []);

    // The read head is a fraction of a word, written straight to the DOM as a
    // custom property: CSS fades, lifts and unblurs each word as the head
    // crosses it, which is what makes the line arrive smoothly instead of a
    // word at a time on the four-or-so timeupdate events a second the browser
    // sends.
    // `played` runs 0 → 1 while the audio plays and on to 1 + TAIL while the
    // transcript catches up after it has finished.
    const writeHead = useCallback((played, count) => {
        const at = clamp01((played - TRAIL) / WINDOW) * count;
        captionRef.current?.style.setProperty('--read', String(at));
        setHead(Math.min(count, Math.floor(at)));
    }, []);

    const movePlayhead = useCallback((played) => {
        const track = trackRef.current;
        if (!track) return;
        if (!playheadSetRef.current && playheadRef.current) {
            playheadSetRef.current = gsap.quickSetter(playheadRef.current, 'x', 'px');
        }
        playheadSetRef.current?.(played * track.clientWidth);
    }, []);

    // Follow the audio every frame while it plays. This rides GSAP's ticker
    // rather than its own requestAnimationFrame loop, so the transcript, the
    // meter and every other animation on the page are driven by one clock and
    // stop together when the tab goes away.
    useEffect(() => {
        if (!playing) return undefined;
        const live = canAnimate();

        const tick = () => {
            const audio = audioRef.current;
            if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
            const played = clamp01(audio.currentTime / audio.duration);
            setBar(Math.round(played * BAR_COUNT));
            writeHead(played, words.length);
            movePlayhead(played);
            if (live) trace(played);
        };

        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
    }, [playing, words.length, writeHead, movePlayhead, trace]);

    // The audio has stopped but the transcript has not caught up yet: keep the
    // head moving on the wall clock until it reaches the last word.
    useEffect(() => {
        if (!tailing) return undefined;

        const clip = audioRef.current?.duration;
        const spanMs = Number.isFinite(clip) && clip > 0 ? TAIL * clip * 1000 : 0;
        const startedAt = performance.now();

        const tick = () => {
            // with no duration to pace against, land the last words at once
            const through = spanMs > 0 ? Math.min(1, (performance.now() - startedAt) / spanMs) : 1;
            writeHead(1 + through * TAIL, words.length);
            if (through >= 1) setTailing(false);
        };

        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
    }, [tailing, words.length, writeHead]);

    const reset = useCallback(() => {
        setPlaying(false);
        setTailing(false);
        setElapsed(0);
        setBar(0);
        setHead(0);
        setStarted(false);
        captionRef.current?.style.setProperty('--read', '0');
        if (captionRef.current) captionRef.current.scrollTop = 0;
        resetTrace();
    }, [resetTrace]);

    const select = (id) => {
        if (id === activeId) return;
        audioRef.current?.pause();
        // A fresh <audio> element needs its own source node before the meter
        // can read it again.
        wiredRef.current = false;
        setActiveId(id);
        setDuration(0);
        reset();
    };

    const toggle = async () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (!audio.paused) {
            audio.pause();
            return;
        }

        setTailing(false);

        // Route the clip through the analyser the first time it is played, so
        // the meter traces the real signal. Only if the context is actually
        // running: once an element is wrapped in a source node its sound goes
        // out through the graph and nowhere else, so wiring a context that
        // will not resume would leave the sample silent.
        if (!wiredRef.current && canAnimate()) {
            const ctx = ensure();
            if (ctx) {
                if (ctx.state !== 'running') {
                    try {
                        await ctx.resume();
                    } catch {
                        /* left suspended; fall back to the synthetic envelope */
                    }
                }
                if (ctx.state === 'running') {
                    try {
                        connectElement(audio);
                        wiredRef.current = true;
                    } catch {
                        /* not connectable; the fallback covers it */
                    }
                }
            }
        }

        audio.play().catch(() => {});
    };

    // The clock only needs to tick; the meter and the transcript are driven by
    // the frame loop above.
    const onTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) setElapsed(audio.currentTime);
    };

    const seekTo = useCallback(
        (at) => {
            const audio = audioRef.current;
            if (!audio || !Number.isFinite(audio.duration)) return;
            const to = clamp01(at);
            audio.currentTime = to * audio.duration;
            setElapsed(audio.currentTime);
            setBar(Math.round(to * BAR_COUNT));
            setStarted(true);
            setTailing(false);
            writeHead(to, words.length);
            movePlayhead(to);
        },
        [words.length, writeHead, movePlayhead],
    );

    const seek = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        seekTo((event.clientX - rect.left) / rect.width);
    };

    const onTrackKeyDown = (event) => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const at = audio.currentTime / audio.duration;
        const step = 2 / audio.duration;
        const keys = {
            ArrowLeft: at - step,
            ArrowRight: at + step,
            ArrowDown: at - step,
            ArrowUp: at + step,
            Home: 0,
            End: 1,
        };
        if (!(event.key in keys)) return;
        event.preventDefault();
        seekTo(keys[event.key]);
    };

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
        } catch {
            /* clipboard refused — say nothing rather than claim a copy */
        }
    };

    useEffect(() => {
        if (!copied) return undefined;
        const timer = window.setTimeout(() => setCopied(false), 1700);
        return () => window.clearTimeout(timer);
    }, [copied]);

    /* ── Motion ─────────────────────────────────────────────────────────────
       Everything below is GSAP. It all goes through `useGsapAnimation` or a
       `canAnimate()` guard, because an entrance tween must never be the only
       thing making content visible — see the note at the top of
       src/utils/motion.js. */

    // The card assembles itself as it scrolls in: header, player, tabs and
    // transcript in sequence, with the rail's samples dealt out alongside.
    useGsapAnimation(
        (root) => {
            const main = root.querySelectorAll('[data-enter="main"]');
            const rail = root.querySelectorAll('[data-enter="rail"]');
            if (!main.length) return undefined;

            const tl = gsap.timeline({
                defaults: { ease: EASE, clearProps: 'opacity,transform' },
                scrollTrigger: { trigger: root, start: 'top 86%', once: true },
            });

            tl.fromTo(main, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.62, stagger: 0.09 });
            if (rail.length) {
                tl.fromTo(rail, { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05 }, 0.18);
            }
            // The bars grow out of the centre line rather than appearing at
            // their resting height.
            const bars = barsRef.current.filter(Boolean);
            if (bars.length) {
                tl.fromTo(
                    bars,
                    { scaleY: 0 },
                    {
                        scaleY: (i) => IDLE[i],
                        duration: 0.5,
                        stagger: { each: 0.006, from: 'center' },
                        clearProps: 'none',
                    },
                    0.3,
                );
            }

            return ensureRevealed(tl, root);
        },
        cardRef,
        [],
    );

    // The pill under the mode tabs is a single element that slides between
    // them, so switching mode is one continuous movement instead of two
    // backgrounds swapping.
    useLayoutEffect(() => {
        const strip = modesRef.current;
        const pill = pillRef.current;
        if (!strip || !pill) return undefined;

        const place = (animate) => {
            const active = strip.querySelector('button[aria-selected="true"]');
            if (!active) return;
            // Measured as a delta from where the pill already sits, so the
            // strip's own border and padding cannot throw it a pixel out.
            const to = {
                x: active.offsetLeft - pill.offsetLeft,
                width: active.offsetWidth,
                autoAlpha: 1,
            };
            if (animate && pillPlacedRef.current && canAnimate()) {
                gsap.to(pill, { ...to, duration: 0.42, ease: 'power3.out', overwrite: true });
            } else {
                gsap.set(pill, to);
            }
            pillPlacedRef.current = true;
        };

        place(true);
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => place(false)) : null;
        observer?.observe(strip);
        return () => observer?.disconnect();
    }, [mode]);

    // The rail's active marker slides the same way, and the list scrolls to
    // bring the chosen sample into view if it was below the fold.
    useLayoutEffect(() => {
        const list = listRef.current;
        const marker = markerRef.current;
        if (!list || !marker) return undefined;

        const place = (animate) => {
            const active = list.querySelector('button[aria-pressed="true"]');
            if (!active) return;
            const to = {
                y: active.offsetTop - marker.offsetTop,
                height: active.offsetHeight,
                autoAlpha: 1,
            };
            const move = animate && markerPlacedRef.current && canAnimate();
            if (move) {
                gsap.to(marker, { ...to, duration: 0.42, ease: 'power3.out', overwrite: true });
            } else {
                gsap.set(marker, to);
            }
            markerPlacedRef.current = true;

            const top = active.offsetTop;
            const bottom = top + active.offsetHeight;
            if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight) {
                const target = Math.max(0, Math.min(top - 8, list.scrollHeight - list.clientHeight));
                if (move) gsap.to(list, { scrollTop: target, duration: 0.45, ease: 'power2.out', overwrite: true });
                else list.scrollTop = target;
            }
        };

        place(true);
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => place(false)) : null;
        observer?.observe(list);
        return () => observer?.disconnect();
    }, [activeId]);

    // A new sample or a new mode is a new transcript: it arrives from under
    // the panel's edge rather than cutting in.
    //
    // This one starts at opacity 0 on real content, so it gets the same safety
    // net as the entrance: if the tween is set up in a document that reports
    // itself visible but is not being painted, `ensureRevealed` puts the
    // transcript back rather than leaving the panel blank.
    useLayoutEffect(() => {
        const caption = captionRef.current;
        if (!caption || !canAnimate()) return undefined;
        const tween = gsap.fromTo(
            caption,
            { opacity: 0, y: 12, filter: 'blur(7px)' },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.46,
                ease: EASE,
                clearProps: 'opacity,transform,filter',
            },
        );
        return ensureRevealed(tween, caption, 600);
    }, [activeId, mode]);

    // The sample's own title and note change with it.
    useLayoutEffect(() => {
        const copyBlock = cardRef.current?.querySelector('.tx-head-copy');
        if (!copyBlock || !canAnimate()) return undefined;
        const tween = gsap.fromTo(
            copyBlock.children,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, ease: EASE, stagger: 0.06, clearProps: 'opacity,transform' },
        );
        return ensureRevealed(tween, copyBlock, 600);
    }, [activeId]);

    // A ring breathing out of the play button while the clip runs.
    useEffect(() => {
        const ring = ringRef.current;
        if (!ring || !playing || !canAnimate()) return undefined;
        const tween = gsap.fromTo(
            ring,
            { scale: 0.82, opacity: 0.5 },
            { scale: 1.55, opacity: 0, duration: 1.6, ease: 'power2.out', repeat: -1 },
        );
        return () => {
            tween.kill();
            gsap.set(ring, { clearProps: 'all' });
        };
    }, [playing]);

    // Before the first play the panel is empty, so it holds a small meter of
    // its own — the model is waiting to listen, not broken.
    useEffect(() => {
        const box = idleRef.current;
        if (!box || started || !canAnimate()) return undefined;
        const tween = gsap.to(box.querySelectorAll('.tx-idle-bar'), {
            scaleY: 1,
            duration: 0.62,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.09, from: 'center' },
        });
        return () => tween.kill();
    }, [started]);

    // Three bars on the sample that is playing, so the rail says which one is
    // making the sound.
    useEffect(() => {
        const list = listRef.current;
        if (!list || !playing || !canAnimate()) return undefined;
        const bars = list.querySelectorAll('.tx-eq span');
        if (!bars.length) return undefined;
        const tween = gsap.to(bars, {
            scaleY: 1,
            duration: 0.42,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            stagger: 0.12,
        });
        return () => tween.kill();
    }, [playing, activeId]);

    // The writing keeps itself in view. Without this a long sample writes its
    // last lines below the bottom of a fixed-height panel, where nobody sees
    // them arrive.
    useEffect(() => {
        const caption = captionRef.current;
        if (!caption || !started) return;
        const word = caption.querySelector('.tx-word.is-head');
        if (!word) return;
        const target = Math.max(
            0,
            Math.min(
                word.offsetTop - caption.clientHeight * 0.45,
                caption.scrollHeight - caption.clientHeight,
            ),
        );
        if (Math.abs(target - caption.scrollTop) < 8) return;
        if (canAnimate()) {
            gsap.to(caption, { scrollTop: target, duration: 0.5, ease: 'power2.out', overwrite: true });
        } else {
            caption.scrollTop = target;
        }
    }, [head, started]);

    return (
        <div className="pg-breakout tx-stage">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card tx-card" ref={cardRef}>
                    <div className="pg-main tx-main">
                        <header className="tx-head" data-enter="main">
                            <div className="tx-head-copy">
                                <h3 className="tx-title">{example.kind}</h3>
                                <p className="tx-note">{example.note}</p>
                            </div>
                            <div className="tx-head-meta">
                                <span className="tx-detected">
                                    <span className="tx-detected-label">Detected</span>
                                    <b>{example.label}</b>
                                </span>
                                <span className={`tx-status is-${status}`}>
                                    <i className="tx-status-dot" aria-hidden="true" />
                                    {STATUS_LABEL[status]}
                                </span>
                            </div>
                        </header>

                        <div className={`audio-player tx-player${playing ? ' is-playing' : ''}`} data-enter="main">
                            <span className="tx-play-wrap">
                                <span className="tx-play-ring" ref={ringRef} aria-hidden="true" />
                                <button
                                    type="button"
                                    className={`audio-play${playing ? ' is-playing' : ''}`}
                                    onClick={toggle}
                                    aria-label={playing ? `Pause ${example.kind} sample` : `Play ${example.kind} sample`}
                                >
                                    {playing ? (
                                        <Pause size={18} aria-hidden="true" />
                                    ) : (
                                        <Play size={18} aria-hidden="true" />
                                    )}
                                </button>
                            </span>

                            <div
                                className="audio-track tx-track"
                                ref={trackRef}
                                onClick={seek}
                                onKeyDown={onTrackKeyDown}
                                role="slider"
                                tabIndex={0}
                                aria-label={`Seek ${example.kind} sample`}
                                aria-valuemin={0}
                                aria-valuemax={Math.round(duration)}
                                aria-valuenow={Math.round(elapsed)}
                                aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`}
                            >
                                <div className={`audio-wave${playing ? ' is-playing' : ''}`} aria-hidden="true">
                                    {IDLE.map((h, i) => (
                                        <span
                                            key={i}
                                            ref={(el) => {
                                                barsRef.current[i] = el;
                                            }}
                                            className={i <= bar ? 'is-played' : undefined}
                                            style={{ '--l': h }}
                                        />
                                    ))}
                                </div>
                                <span
                                    className={`tx-playhead${started ? ' is-on' : ''}`}
                                    ref={playheadRef}
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="audio-time tx-time">
                                <b>{formatTime(elapsed)}</b>
                                <span aria-hidden="true">/</span>
                                {formatTime(duration)}
                            </p>

                            {/* key forces a fresh element per sample */}
                            <audio
                                key={example.id}
                                src={assetUrl(example.audio)}
                                ref={audioRef}
                                onPlay={() => {
                                    setPlaying(true);
                                    setStarted(true);
                                }}
                                onPause={() => setPlaying(false)}
                                onEnded={() => {
                                    setPlaying(false);
                                    setBar(BAR_COUNT);
                                    // the transcript is still a few words behind — let it
                                    // finish writing rather than snapping it to the end
                                    setTailing(true);
                                }}
                                onTimeUpdate={onTimeUpdate}
                                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                                preload="metadata"
                            />
                        </div>

                        <div className="tx-modes" ref={modesRef} role="tablist" aria-label="Transcription mode" data-enter="main">
                            <span className="tx-modes-pill" ref={pillRef} aria-hidden="true" />
                            {MODE_LABELS.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={mode === m.id}
                                    className={`tx-mode${mode === m.id ? ' is-active' : ''}`}
                                    onClick={() => setMode(m.id)}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        <div className="tx-panel" data-enter="main">
                            {/* The caret marks where the transcript is being written, so it
                                follows the word arriving now rather than sitting in front of
                                it. It is its own element, not a pseudo on the word, because
                                the word is mid-fade — a pseudo would inherit that opacity and
                                the caret would dim and brighten with every word. */}
                            <div
                                ref={captionRef}
                                key={`${example.id}-${mode}`}
                                className={`transcribe-caption audio-transcript tx-caption${done ? '' : ' is-live'}`}
                                lang={mode === 'romanized' ? 'en' : example.lang}
                                aria-live="off"
                            >
                                {words.map((word, i) => (
                                    <Fragment key={i}>
                                        <span
                                            className={`tx-word${started && !done && i === head ? ' is-head' : ''}`}
                                            style={{ '--i': i }}
                                        >
                                            {word}
                                        </span>
                                        {i === head && <span className="tx-caret" aria-hidden="true" />}{' '}
                                    </Fragment>
                                ))}
                            </div>

                            {!started && (
                                <div className="tx-idle" ref={idleRef}>
                                    <span className="tx-idle-meter" aria-hidden="true">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <i key={i} className="tx-idle-bar" />
                                        ))}
                                    </span>
                                    <p className="tx-prompt">
                                        Press play — the transcript is written as it listens.
                                    </p>
                                </div>
                            )}

                            <div className="tx-panel-foot">
                                <span className="tx-count">
                                    {words.length} words · {MODE_LABELS.find((m) => m.id === mode).label}
                                </span>
                                <button type="button" className="tx-copy" onClick={copy}>
                                    {copied ? (
                                        <Check size={13} aria-hidden="true" />
                                    ) : (
                                        <Copy size={13} aria-hidden="true" />
                                    )}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="pg-rail tx-rail">
                        <span className="pg-rail-label" data-enter="rail">
                            Samples
                        </span>

                        <div className="pg-rail-list pg-rail-scroll tx-list" ref={listRef}>
                            <span className="tx-marker" ref={markerRef} aria-hidden="true" />
                            {AUDIO_EXAMPLES.map((e) => (
                                <button
                                    key={e.id}
                                    type="button"
                                    className={`pg-example tx-item${activeId === e.id ? ' is-active' : ''}`}
                                    aria-pressed={activeId === e.id}
                                    onClick={() => select(e.id)}
                                    data-enter="rail"
                                >
                                    <span className="tx-badge" aria-hidden="true">
                                        {e.label.slice(0, 2)}
                                    </span>
                                    <span className="pg-example-copy">
                                        <span className="pg-example-name">{e.kind}</span>
                                        <span className="pg-example-lang">{e.label}</span>
                                    </span>
                                    {activeId === e.id && playing && (
                                        <span className="tx-eq" aria-hidden="true">
                                            <span />
                                            <span />
                                            <span />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="pg-rail-foot" data-enter="rail">
                            <p>Want to run this model?</p>
                            <a
                                href={CONSOLE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="model-cta-primary model-cta-small model-cta-dark"
                            >
                                Go to Dashboard
                                <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TranscribeExamples;
