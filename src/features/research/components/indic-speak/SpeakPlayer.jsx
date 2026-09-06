import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { WAVES, WAVE_BARS } from '../../data/indic-speak/speakEvals';

/*
 * One transport for every clip in the post.
 *
 * Two things separate it from a bare <audio controls>. The scrubber draws the
 * clip's own measured loudness envelope, so a player shows the shape and the
 * length of what it is holding before a byte of audio is fetched — which matters
 * on a page carrying 86 clips, none of them preloaded. And the rate control is a
 * cycling pill rather than a slider, because people audition a voice fast and
 * check its diction slow, and neither needs five widths of chrome.
 */

// A post with 86 players should never have two of them audible at once.
let audible = null;

const FLAT = '5'.repeat(WAVE_BARS);

const clock = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

const Bars = ({ envelope }) => (
    <div className="isb-ap-bars" aria-hidden="true">
        {envelope.split('').map((digit, index) => (
            <i key={index} style={{ height: `${14 + Number(digit) * 9.5}%` }} />
        ))}
    </div>
);

const SpeakPlayer = ({ src, meta, rates = [1, 1.25, 1.5, 0.75], onAudio }) => {
    const audioRef = useRef(null);
    const trackRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [rateIndex, setRateIndex] = useState(0);

    const wave = WAVES[src];
    // The measured duration is known up front; the element's own duration only
    // arrives once metadata loads, and is preferred after that.
    const [duration, setDuration] = useState(wave?.d ?? 0);
    const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;

    // The voice card keeps one player mounted and swaps its clip underneath, so the
    // readout is reset during render rather than from an effect.
    const [loaded, setLoaded] = useState(src);
    if (loaded !== src) {
        setLoaded(src);
        setElapsed(0);
        setDuration(wave?.d ?? 0);
    }

    useEffect(() => {
        const audio = audioRef.current;
        onAudio?.(audio);
        return () => {
            if (audible === audio) audible = null;
            audio?.pause();
        };
    }, [onAudio]);

    const toggle = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!audio.paused) {
            audio.pause();
            return;
        }

        if (audible && audible !== audio) audible.pause();
        audible = audio;
        audio.playbackRate = rates[rateIndex];

        try {
            await audio.play();
        } catch {
            setPlaying(false);
        }
    }, [rateIndex, rates]);

    const seekTo = useCallback(
        (clientX) => {
            const audio = audioRef.current;
            const track = trackRef.current;
            if (!audio || !track || !duration) return;

            const { left, width } = track.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
            audio.currentTime = ratio * duration;
            setElapsed(audio.currentTime);
        },
        [duration]
    );

    const cycleRate = () => {
        const next = (rateIndex + 1) % rates.length;
        setRateIndex(next);
        if (audioRef.current) audioRef.current.playbackRate = rates[next];
    };

    const nudge = (event) => {
        const audio = audioRef.current;
        if (!audio || !duration) return;
        const step = event.key === 'ArrowRight' ? 2 : event.key === 'ArrowLeft' ? -2 : 0;
        if (!step) return;
        event.preventDefault();
        audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + step));
        setElapsed(audio.currentTime);
    };

    return (
        <div className="isb-ap">
            <button
                type="button"
                className="isb-ap-play"
                onClick={toggle}
                aria-label={playing ? 'Pause' : `Play${meta ? ` ${meta}` : ''}`}
            >
                {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" />}
            </button>

            <div
                ref={trackRef}
                className="isb-ap-track"
                role="slider"
                tabIndex={0}
                aria-label="Seek"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress * 100)}
                onKeyDown={nudge}
                onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId);
                    seekTo(event.clientX);
                }}
                onPointerMove={(event) => {
                    if (event.buttons === 1) seekTo(event.clientX);
                }}
            >
                <Bars envelope={wave?.e ?? FLAT} />
                <div className="isb-ap-played" style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}>
                    <Bars envelope={wave?.e ?? FLAT} />
                </div>
            </div>

            <span className="isb-ap-time">
                <b>{clock(elapsed)}</b> / {clock(duration)}
            </span>

            <button type="button" className="isb-ap-rate" onClick={cycleRate} aria-label="Playback speed">
                {rates[rateIndex]}×
            </button>

            {meta && <span className="isb-ap-meta">{meta}</span>}

            <audio
                ref={audioRef}
                src={src}
                preload="none"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => {
                    setPlaying(false);
                    setElapsed(0);
                }}
                onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
                onLoadedMetadata={(event) => {
                    const real = event.currentTarget.duration;
                    if (Number.isFinite(real)) setDuration(real);
                }}
            />
        </div>
    );
};

export default SpeakPlayer;
