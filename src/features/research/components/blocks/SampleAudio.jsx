import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

// Only one sample should ever be audible, no matter how many blocks a post has.
let currentlyPlaying = null;

/**
 * Play button + idle waveform for a single audio sample.
 *
 * `src` is optional on purpose: while a team is still recording clips, the
 * control renders disabled rather than disappearing, so the layout a writer
 * sees in draft matches the published one.
 */
const SampleAudio = ({ src, caption, accent, label = 'Play sample' }) => {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        return () => {
            if (currentlyPlaying === audio) currentlyPlaying = null;
            audio?.pause();
        };
    }, []);

    const toggle = async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
            return;
        }

        if (currentlyPlaying && currentlyPlaying !== audio) {
            currentlyPlaying.pause();
        }
        currentlyPlaying = audio;

        try {
            await audio.play();
        } catch {
            setPlaying(false);
        }
    };

    return (
        <div
            className="bt-audio"
            data-playing={playing}
            style={accent ? { '--bt-accent': accent } : undefined}
        >
            <button
                type="button"
                className="bt-audio-btn"
                onClick={toggle}
                disabled={!src}
                aria-label={playing ? 'Pause sample' : label}
                title={src ? undefined : 'Audio clip not added yet'}
            >
                {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
            </button>

            <span className="bt-wave" aria-hidden="true">
                {Array.from({ length: 14 }, (_, i) => (
                    <i key={i} />
                ))}
            </span>

            {caption && <span className="bt-audio-caption">{caption}</span>}

            {src && (
                <audio
                    ref={audioRef}
                    src={src}
                    preload="none"
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                />
            )}
        </div>
    );
};

export default SampleAudio;
