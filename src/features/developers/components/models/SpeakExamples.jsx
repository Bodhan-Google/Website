import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import SHOWCASE from '../../data/speakShowcase.json';
import { assetUrl } from '../../data/assetUrl';
import { CONSOLE_URL } from '../../../../config/links';

const BARS = Array.from({ length: 48 }, (_, i) => 18 + ((i * 37) % 64));

const { items } = SHOWCASE;

// Group heading printed once per run, worked out here rather than while rendering.
const RAIL = items.map((item, i) => ({
    id: item.id,
    name: item.name,
    detail: item.detail,
    heading: item.group !== items[i - 1]?.group ? item.group : null,
}));

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

// Three capabilities, a couple of variations each, all backed by real audio
// pulled from the blog — the rest of its numbers/styles material is reference
// text rather than something to press play on, so it stays on the blog post
// rather than being force-fit in here. Nothing autoplays.
const SpeakExamples = () => {
    const [activeId, setActiveId] = useState(items[0].id);
    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    // Which bar the meter has reached. A whole number, followed every frame:
    // the browser's timeupdate events land about four times a second, which
    // moves a 48-bar meter in visible jumps.
    const [bar, setBar] = useState(0);

    const audioRef = useRef(null);
    const frameRef = useRef(0);

    const example = items.find((e) => e.id === activeId) ?? items[0];

    useEffect(() => {
        if (!playing) return undefined;

        const step = () => {
            const audio = audioRef.current;
            if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
                setBar(Math.round((audio.currentTime / audio.duration) * BARS.length));
            }
            frameRef.current = requestAnimationFrame(step);
        };

        frameRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameRef.current);
    }, [playing]);

    const select = useCallback((id) => {
        audioRef.current?.pause();
        setActiveId(id);
        setPlaying(false);
        setElapsed(0);
        setDuration(0);
        setBar(0);
    }, []);

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
    };

    const seek = (event) => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration)) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
        setElapsed(audio.currentTime);
        setBar(Math.round(ratio * BARS.length));
    };

    return (
        <div className="pg-breakout">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card">
                    <div className="pg-main">
                        <div className="tp-bar">
                            <p className="tx-now">
                                <b>{example.name}</b>
                            </p>
                            <div className="sx-chips">
                                {example.voice && <span className="sx-chip">{example.voice}</span>}
                                {example.langLabel && <span className="sx-chip">{example.langLabel}</span>}
                            </div>
                        </div>

                        <div className="audio-player">
                            <button
                                type="button"
                                className={`audio-play${playing ? ' is-playing' : ''}`}
                                onClick={toggle}
                                aria-label={playing ? `Pause ${example.name}` : `Play ${example.name}`}
                            >
                                {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                            </button>

                            <div className="audio-track" onClick={seek} role="presentation">
                                <div className={`audio-wave${playing ? ' is-playing' : ''}`} aria-hidden="true">
                                    {BARS.map((h, i) => (
                                        <span
                                            key={i}
                                            className={i <= bar ? 'is-played' : undefined}
                                            style={{ height: `${h}%`, animationDelay: `${(i % 9) * 60}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="audio-time">
                                {formatTime(elapsed)} / {formatTime(duration || example.dur)}
                            </p>

                            {/* key forces a fresh element per example */}
                            <audio
                                key={example.id}
                                src={assetUrl(example.audio)}
                                ref={audioRef}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                onEnded={() => {
                                    setPlaying(false);
                                    setBar(BARS.length);
                                }}
                                onTimeUpdate={() => setElapsed(audioRef.current?.currentTime ?? 0)}
                                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                                preload="none"
                            />
                        </div>

                        <p className={`sx-text${example.long ? ' is-long' : ''}`} lang={example.lang}>
                            {example.text}
                        </p>
                    </div>

                    <aside className="pg-rail">

                        <div className="pg-rail-list pg-rail-scroll">
                            {RAIL.map((e) => (
                                <div key={e.id}>
                                    {e.heading && <p className="sx-group">{e.heading}</p>}
                                    <button
                                        type="button"
                                        className={`pg-example sx-example${activeId === e.id ? ' is-active' : ''}`}
                                        aria-pressed={activeId === e.id}
                                        onClick={() => select(e.id)}
                                    >
                                        <span className="pg-example-copy">
                                            <span className="pg-example-name">{e.name}</span>
                                            <span className="pg-example-lang">{e.detail}</span>
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="pg-rail-foot">
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

export default SpeakExamples;
