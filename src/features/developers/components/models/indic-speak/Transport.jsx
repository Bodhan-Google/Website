import { useRef } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { formatTime } from './pacing';
import { useAudioTicker } from './useSpeakAudio';

// Transport controls shared by the demo and every example stage. The readout
// and the progress rail are written to from the audio ticker rather than from
// state, so a five-minute chapter does not re-render the page 18,000 times.

export const PlayButton = ({ playing, onToggle, label = 'clip', solid = false, size = 16 }) => (
    <button
        type="button"
        className={solid ? 'isp-btn isp-btn-primary' : 'isp-icon-btn'}
        onClick={onToggle}
        aria-label={playing ? `Pause the ${label}` : `Play the ${label}`}
    >
        {playing ? <Pause size={size} aria-hidden="true" /> : <Play size={size} aria-hidden="true" />}
        {solid && (playing ? 'Pause' : 'Play')}
    </button>
);

export const RestartButton = ({ onRestart }) => (
    <button type="button" className="isp-icon-btn" onClick={onRestart} aria-label="Start over">
        <RotateCcw size={15} aria-hidden="true" />
    </button>
);

export const TimeReadout = ({ audioRef, playing, duration }) => {
    const ref = useRef(null);

    useAudioTicker(audioRef, playing, (time, reported) => {
        const node = ref.current;
        if (!node) return;
        node.textContent = `${formatTime(time)} / ${formatTime(reported || duration)}`;
    });

    return (
        <span className="isp-time" ref={ref}>
            {`0:00 / ${formatTime(duration)}`}
        </span>
    );
};

export const ProgressRail = ({ audioRef, playing, duration, onSeek }) => {
    const fillRef = useRef(null);

    useAudioTicker(audioRef, playing, (time, reported) => {
        const node = fillRef.current;
        if (!node) return;
        const total = reported || duration || 1;
        node.style.transform = `scaleX(${Math.min(1, time / total).toFixed(4)})`;
    });

    const handleClick = (event) => {
        if (!onSeek) return;
        const rect = event.currentTarget.getBoundingClientRect();
        onSeek(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
    };

    return (
        <button
            type="button"
            className="isp-rail-progress"
            onClick={handleClick}
            aria-label="Seek within the clip"
        >
            <i ref={fillRef} />
        </button>
    );
};
