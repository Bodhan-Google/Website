import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import FEATURES from '../../data/transcribeFeatures.json';
import { assetUrl } from '../../data/assetUrl';

/**
 * The announcement's key-features explorer, on the model page.
 *
 * Same five claims, same clips, same transcripts as
 * /research/blogs/indic-transcribe: a rail of what the model handles, and for
 * each one the real recordings behind the claim — chosen by the speaker's first
 * language, or by the language being spoken — with what the model actually
 * wrote down.
 *
 * The clips are the ones the post ships (public/indic-transcribe-post/audio/),
 * referenced rather than copied, and the data is generated from the same
 * source: src/features/developers/data/transcribeFeatures.json.
 *
 * Nothing here is a sample of a sample. `hyp` is the model's own output, so a
 * transcript that disagrees with the reference is left disagreeing.
 */

/** The bars under the play button: the clip's own loudness envelope. */
const Waveform = ({ env, progress }) => {
    const bars = useMemo(() => String(env || '').split('').map(Number), [env]);
    if (!bars.length) return null;
    return (
        <span className="mx-wave" aria-hidden="true">
            {bars.map((level, i) => (
                <span
                    key={i}
                    className={`mx-wave-bar${i / bars.length <= progress ? ' is-played' : ''}`}
                    style={{ '--level': Math.max(0.12, level / 9) }}
                />
            ))}
        </span>
    );
};

const time = (seconds) => {
    const s = Math.max(0, Math.round(seconds || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const TranscribeFeatures = () => {
    const [featureKey, setFeatureKey] = useState(FEATURES.features[0].key);
    // Which option and which of its clips, per feature, so moving away and back
    // does not lose the reader's place.
    const [chosen, setChosen] = useState({});
    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const audioRef = useRef(null);

    const feature = FEATURES.features.find((f) => f.key === featureKey);
    const block = FEATURES.data[featureKey];
    const pick = chosen[featureKey] ?? { option: 0, clip: 0 };
    const option = block.options[Math.min(pick.option, block.options.length - 1)];
    const clip = option.items[Math.min(pick.clip, option.items.length - 1)];

    const set = (next) => {
        setChosen((current) => ({ ...current, [featureKey]: { ...pick, ...next } }));
        setPlaying(false);
        setElapsed(0);
        audioRef.current?.pause();
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
            audio.pause();
            setPlaying(false);
        }
    };

    const progress = clip.duration ? elapsed / clip.duration : 0;
    const meta = [clip.meta?.district, clip.meta?.state, clip.meta?.gender].filter(Boolean).join(' · ');

    return (
        <div className="mx">
            <nav className="mx-rail" aria-label="What it handles">
                {FEATURES.features.map((f) => (
                    <button
                        key={f.key}
                        type="button"
                        className={`mx-rail-item${f.key === featureKey ? ' is-on' : ''}`}
                        aria-current={f.key === featureKey}
                        onClick={() => {
                            setFeatureKey(f.key);
                            setPlaying(false);
                            setElapsed(0);
                            audioRef.current?.pause();
                        }}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d={f.icon} />
                        </svg>
                        <span>
                            <strong>{f.title}</strong>
                            <em>{f.blurb}</em>
                        </span>
                    </button>
                ))}
            </nav>

            <div className="mx-panel">
                <h3 className="mx-panel-title">{feature.title}</h3>
                <p className="mx-panel-claim">{feature.claim}</p>

                <div className="mx-filter">
                    <span className="mx-filter-label">{block.filter}</span>
                    {block.options.map((o, i) => (
                        <button
                            key={o.key}
                            type="button"
                            className={`mx-chip${i === pick.option ? ' is-on' : ''}`}
                            onClick={() => set({ option: i, clip: 0 })}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>

                <article className="mx-clip">
                    <h4 className="mx-clip-title">{clip.langName}{option.sub ? ` · ${option.sub}` : ''}</h4>
                    {meta && <p className="mx-clip-meta">{meta}</p>}

                    <div className="mx-player">
                        <button type="button" className="mx-play" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                            {playing ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                        <Waveform env={clip.env} progress={progress} />
                        <span className="mx-time">{time(elapsed)} / {time(clip.duration)}</span>
                        <span className="mx-badge">{(clip.lang || '').toUpperCase()} · CORE</span>
                        <audio
                            ref={audioRef}
                            src={assetUrl(clip.file)}
                            preload="none"
                            onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
                            onEnded={() => { setPlaying(false); setElapsed(0); }}
                        />
                    </div>

                    <div className="mx-transcript">
                        <span className="mx-transcript-label">Model</span>
                        <p>{clip.hyp}</p>
                    </div>

                    {option.items.length > 1 && (
                        <div className="mx-pager">
                            <button
                                type="button"
                                aria-label="Previous clip"
                                disabled={pick.clip === 0}
                                onClick={() => set({ clip: pick.clip - 1 })}
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <span>{pick.clip + 1} / {option.items.length}</span>
                            <button
                                type="button"
                                aria-label="Next clip"
                                disabled={pick.clip >= option.items.length - 1}
                                onClick={() => set({ clip: pick.clip + 1 })}
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
};

export default TranscribeFeatures;
