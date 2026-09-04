import { Fragment, useMemo, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { CODE_MIXED_CLIP, SCRIPT_LEGEND, SCRIPT_MODES } from './transcribeData';

// Devanagari through Malayalam covers every Brahmic script the model writes in.
const INDIC = /[ऀ-ൿ]/;
const LATIN = /[A-Za-z]/;

const scriptOf = (word) => {
    const indic = INDIC.test(word);
    const latin = LATIN.test(word);
    if (indic && latin) return 'mixed';
    if (latin) return 'latin';
    if (indic) return 'native';
    return 'neutral';
};

const formatTime = (value) =>
    Number.isFinite(value)
        ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`
        : '0:00';

/**
 * The code-mixed showcase. One sentence of cricket commentary, spoken as people
 * actually speak — and written three ways, with each word tinted by the script
 * it landed in. This is the section where the "mixed" rendering earns itself.
 */
const TranscribeCodeMixed = () => {
    const videoRef = useRef(null);
    const [script, setScript] = useState('mixed');
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [ratio, setRatio] = useState('9 / 16');

    const clip = CODE_MIXED_CLIP;
    const words = useMemo(
        () =>
            (clip.transcripts[script] ?? '')
                .split(/\s+/)
                .filter(Boolean)
                .map((text) => ({ text, script: scriptOf(text) })),
        [clip, script]
    );

    // No word-level timings ship with the clip, so the transcript is spread
    // evenly across the runtime — ends line up, the middle reads as live.
    const spoken = Math.round(progress * words.length);

    const toggle = async () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) await video.play().catch(() => setPlaying(false));
        else video.pause();
    };

    return (
        <section className="itx-section itx-codemix" id="code-mixed">
            <div className="itx-container">
                <header className="itx-head itx-reveal">
                    <p className="itx-eyebrow">Code-mixed speech</p>
                    <h2 className="itx-h2">
                        Native script or Latin? <span className="itx-grad">Both, per word</span>.
                    </h2>
                    <p className="itx-lede">
                        Nobody watching cricket in Gujarat says "ગતિ" when they mean speed. Press play, then switch the
                        rendering — the same sentence in the script it was spoken in, forced entirely into Gujarati, and
                        romanised for a Latin keyboard.
                    </p>
                </header>

                <div className="itx-codemix-body itx-reveal">
                    <div className="itx-video-shell" style={{ aspectRatio: ratio }}>
                        <video
                            ref={videoRef}
                            src={clip.video}
                            playsInline
                            preload="metadata"
                            onClick={toggle}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onEnded={() => {
                                setPlaying(false);
                                setProgress(1);
                            }}
                            onTimeUpdate={(event) => {
                                const el = event.currentTarget;
                                if (el.duration) setProgress(el.currentTime / el.duration);
                            }}
                            onLoadedMetadata={(event) => {
                                const el = event.currentTarget;
                                setDuration(el.duration);
                                if (el.videoWidth && el.videoHeight) setRatio(`${el.videoWidth} / ${el.videoHeight}`);
                            }}
                        />

                        {!playing && (
                            <button
                                type="button"
                                className="itx-video-play"
                                onClick={toggle}
                                aria-label={`Play ${clip.label}`}
                            >
                                <Play size={22} aria-hidden="true" />
                            </button>
                        )}

                        <span className="itx-video-badge">{clip.label}</span>
                    </div>

                    <div className="itx-codemix-panel">
                        <div className="itx-codemix-bar">
                            <button
                                type="button"
                                className="itx-icon-btn"
                                onClick={toggle}
                                aria-label={playing ? 'Pause' : 'Play'}
                            >
                                {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                            </button>

                            <div
                                className="itx-seek"
                                role="presentation"
                                onClick={(event) => {
                                    const video = videoRef.current;
                                    if (!video?.duration) return;
                                    const bounds = event.currentTarget.getBoundingClientRect();
                                    video.currentTime =
                                        ((event.clientX - bounds.left) / bounds.width) * video.duration;
                                }}
                            >
                                <span style={{ transform: `scaleX(${progress})` }} />
                            </div>

                            <span className="itx-clock">
                                {formatTime(progress * duration)} / {formatTime(duration)}
                            </span>

                            <button
                                type="button"
                                className="itx-icon-btn"
                                onClick={() => {
                                    const video = videoRef.current;
                                    if (!video) return;
                                    video.muted = !video.muted;
                                    setMuted(video.muted);
                                }}
                                aria-label={muted ? 'Unmute' : 'Mute'}
                            >
                                {muted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
                            </button>
                        </div>

                        <div className="itx-segmented itx-segmented-wide" role="group" aria-label="Output script">
                            {SCRIPT_MODES.map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    aria-pressed={script === mode.id}
                                    data-active={script === mode.id || undefined}
                                    onClick={() => setScript(mode.id)}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>

                        <p className="itx-codemix-text" lang={clip.lang}>
                            {words.map((word, index) => (
                                <Fragment key={`${index}-${word.text}`}>
                                    <span
                                        className="itx-cm-word"
                                        data-script={word.script}
                                        data-spoken={index < spoken || undefined}
                                    >
                                        {word.text}
                                    </span>{' '}
                                </Fragment>
                            ))}
                        </p>

                        <div className="itx-legend">
                            {SCRIPT_LEGEND.map((item) => (
                                <span key={item.id} className="itx-legend-item" data-script={item.id}>
                                    <i aria-hidden="true" />
                                    {item.label}
                                </span>
                            ))}
                        </div>

                        <p className="itx-codemix-source">{clip.source}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TranscribeCodeMixed;
