import { useEffect, useRef, useState } from 'react';
import { getAudioContext, useAudioTicker } from './useSpeakAudio';

// The clip's real waveform, decoded from the file rather than drawn from
// imagination, with the played part filled in. Click anywhere to seek.
//
// Only used on the short demo clips: decoding a five-minute chapter to draw a
// strip would be a lot of work for a thin graphic, so the long reads get a
// plain progress rail instead.

const PEAK_COUNT = 168;
const FLOOR = 0.06;

const peaksFrom = (buffer) => {
    const data = buffer.getChannelData(0);
    const block = Math.floor(data.length / PEAK_COUNT) || 1;
    const peaks = [];
    let loudest = 0;

    for (let i = 0; i < PEAK_COUNT; i += 1) {
        let sum = 0;
        const from = i * block;
        for (let j = 0; j < block; j += 1) {
            const v = data[from + j] || 0;
            sum += v * v;
        }
        const rms = Math.sqrt(sum / block);
        loudest = Math.max(loudest, rms);
        peaks.push(rms);
    }

    // Normalised, because TTS output sits well below full scale and an
    // un-normalised strip reads as a flat line.
    return peaks.map((p) => Math.max(FLOOR, loudest ? p / loudest : FLOOR));
};

const WaveStrip = ({ src, audioRef, playing, accent = '#E0620D', height = 56, onSeek }) => {
    const canvasRef = useRef(null);
    const peaksRef = useRef(null);
    const progressRef = useRef(0);
    const [ready, setReady] = useState(false);

    const [decoded, setDecoded] = useState(src);
    if (src !== decoded) {
        setDecoded(src);
        setReady(false);
    }

    useEffect(() => {
        if (!src) return undefined;
        let cancelled = false;
        peaksRef.current = null;
        progressRef.current = 0;

        (async () => {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const response = await fetch(src);
                const bytes = await response.arrayBuffer();
                const decoded = await ctx.decodeAudioData(bytes);
                if (cancelled) return;
                peaksRef.current = peaksFrom(decoded);
                setReady(true);
            } catch {
                // Leave `peaks` null — the strip draws its resting rail.
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [src]);

    // One paint routine, called both by the resize effect and by the ticker.
    const paintRef = useRef(() => {});
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const ctx = canvas.getContext('2d');

        const paint = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = canvas.clientWidth || 1;
            if (canvas.width !== Math.floor(width * dpr) || canvas.height !== height * dpr) {
                canvas.width = Math.floor(width * dpr);
                canvas.height = height * dpr;
            }

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, width, height);

            const peaks = peaksRef.current;
            const mid = height / 2;

            if (!peaks) {
                ctx.beginPath();
                ctx.moveTo(0, mid);
                ctx.lineTo(width, mid);
                ctx.strokeStyle = `${accent}26`;
                ctx.lineWidth = 2;
                ctx.stroke();
                return;
            }

            const step = width / peaks.length;
            const barWidth = Math.max(1.5, step * 0.62);
            const played = progressRef.current * peaks.length;

            peaks.forEach((peak, i) => {
                const x = i * step + (step - barWidth) / 2;
                const barHeight = Math.max(2, peak * (height - 6));
                const done = i <= played;

                ctx.fillStyle = done ? accent : `${accent}2e`;
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x, mid - barHeight / 2, barWidth, barHeight, barWidth / 2);
                } else {
                    ctx.rect(x, mid - barHeight / 2, barWidth, barHeight);
                }
                ctx.fill();
            });
        };

        paintRef.current = paint;
        paint();

        const observer = new ResizeObserver(() => paint());
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [accent, height, ready]);

    useAudioTicker(audioRef, playing, (time, duration) => {
        progressRef.current = duration ? Math.min(1, time / duration) : 0;
        paintRef.current();
    });

    const handleClick = (event) => {
        if (!onSeek) return;
        const rect = event.currentTarget.getBoundingClientRect();
        onSeek(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
    };

    return (
        <button
            type="button"
            className="isp-wavestrip"
            style={{ height }}
            onClick={handleClick}
            aria-label="Seek within the clip"
        >
            <canvas ref={canvasRef} style={{ height }} />
        </button>
    );
};

export default WaveStrip;
