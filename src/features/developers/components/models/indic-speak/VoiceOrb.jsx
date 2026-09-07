import { useEffect, useRef } from 'react';
import { getAnalyser } from './useSpeakAudio';

// The orb: the film's signature frame, and the one piece of this page that is
// not a stylisation. While a clip plays the curve is the clip's own waveform,
// read off an AnalyserNode; when nothing is playing it breathes on a slow
// synthetic sine so the frame never looks broken.
//
// Drawn on canvas rather than as animated SVG because it repaints every frame:
// 96 points, two strokes, sixty times a second, on however many orbs are on
// screen.

const POINTS = 96;
const IDLE_AMPLITUDE = 0.1;
const LIVE_AMPLITUDE = 0.72;

// Tapers the wave to nothing at the rim, so it reads as a wave inside a circle
// rather than a line cut off by one.
const envelope = (t) => Math.sin(Math.PI * t) ** 1.35;

const drawCurve = (ctx, points, width, stroke, lineWidth) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    void width;
};

const VoiceOrb = ({
    audioRef,
    playing = false,
    accent = '#E0620D',
    size = 96,
    className = '',
    label,
}) => {
    const canvasRef = useRef(null);
    const playingRef = useRef(playing);
    useEffect(() => {
        playingRef.current = playing;
    }, [playing]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const radius = size / 2;
        const buffer = new Uint8Array(1024);
        let frame = 0;
        let phase = Math.random() * Math.PI * 2;
        let level = 0;

        const render = () => {
            const analyser = playingRef.current ? getAnalyser(audioRef?.current) : null;
            let samples = null;

            if (analyser) {
                analyser.getByteTimeDomainData(buffer);
                samples = buffer;
            }

            phase += playingRef.current ? 0.045 : 0.016;

            // Level drives the rim, so the ring swells with the voice.
            let target = IDLE_AMPLITUDE;
            if (samples) {
                let sum = 0;
                for (let i = 0; i < samples.length; i += 8) {
                    const v = (samples[i] - 128) / 128;
                    sum += v * v;
                }
                target = Math.min(1, Math.sqrt(sum / (samples.length / 8)) * 3.2);
            }
            level += (target - level) * 0.14;

            ctx.clearRect(0, 0, size, size);

            // Body.
            const wash = ctx.createRadialGradient(radius, radius * 0.7, 2, radius, radius, radius);
            wash.addColorStop(0, `${accent}22`);
            wash.addColorStop(1, `${accent}0d`);
            ctx.beginPath();
            ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
            ctx.fillStyle = wash;
            ctx.fill();

            // Rim, breathing with the level.
            ctx.beginPath();
            ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
            ctx.strokeStyle = `${accent}${Math.round(38 + level * 90)
                .toString(16)
                .padStart(2, '0')}`;
            ctx.lineWidth = 1 + level * 1.4;
            ctx.stroke();

            ctx.save();
            ctx.beginPath();
            ctx.arc(radius, radius, radius - 2, 0, Math.PI * 2);
            ctx.clip();

            const amplitude = radius * (samples ? LIVE_AMPLITUDE : IDLE_AMPLITUDE);
            const main = [];
            const echo = [];

            for (let i = 0; i < POINTS; i += 1) {
                const t = i / (POINTS - 1);
                const x = t * size;
                const shape = envelope(t);

                const raw = samples
                    ? (samples[Math.floor(t * (samples.length - 1))] - 128) / 128
                    : Math.sin(t * 5.4 + phase) * (0.55 + 0.45 * Math.sin(phase * 0.6));

                main.push({ x, y: radius - raw * amplitude * shape });
                echo.push({
                    x,
                    y: radius - Math.sin(t * 4.1 + phase * 1.3) * amplitude * shape * 0.42,
                });
            }

            drawCurve(ctx, echo, size, `${accent}3d`, Math.max(1, size / 68));
            drawCurve(ctx, main, size, accent, Math.max(1.4, size / 44));
            ctx.restore();

            frame = window.requestAnimationFrame(render);
        };

        render();
        return () => window.cancelAnimationFrame(frame);
    }, [accent, audioRef, size]);

    return (
        <span className={`isp-orb ${className}`} data-playing={playing || undefined}>
            <canvas
                ref={canvasRef}
                width={size}
                height={size}
                style={{ width: size, height: size }}
                role={label ? 'img' : 'presentation'}
                aria-label={label}
            />
        </span>
    );
};

export default VoiceOrb;
