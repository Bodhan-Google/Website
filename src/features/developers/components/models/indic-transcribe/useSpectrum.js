import { useEffect } from 'react';
import gsap from 'gsap';

const BARS = 72;
const IDLE_AMPLITUDE = 0.09;

/**
 * Paints the live spectrum onto a canvas from a real AnalyserNode — this is the
 * visitor's own voice, or the clip that is playing, not a scripted animation.
 *
 * When nothing is playing the bars settle into a slow ripple so the surface
 * reads as awake rather than broken. The render loop rides GSAP's ticker, so it
 * stops with every other animation on the page when the tab is hidden.
 */
export default function useSpectrum(canvasRef, analyserRef, { active, tint }) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;

        const ctx = canvas.getContext('2d');
        const levels = new Float32Array(BARS);
        let bins = null;
        let phase = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.max(1, Math.round(width * dpr));
            canvas.height = Math.max(1, Math.round(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
        observer?.observe(canvas);

        const sample = () => {
            const analyser = analyserRef.current;
            if (!active || !analyser) {
                // Idle ripple: a slow travelling sine, barely there.
                phase += 0.022;
                for (let i = 0; i < BARS; i += 1) {
                    const wave = Math.sin(phase + i * 0.28) * 0.5 + 0.5;
                    levels[i] += (IDLE_AMPLITUDE * (0.35 + wave * 0.65) - levels[i]) * 0.08;
                }
                return;
            }

            if (!bins || bins.length !== analyser.frequencyBinCount) {
                bins = new Uint8Array(analyser.frequencyBinCount);
            }
            analyser.getByteFrequencyData(bins);

            // The top of the spectrum is mostly empty for speech, so only the
            // lower ~60% of bins is spread across the bars.
            const usable = Math.floor(bins.length * 0.6);
            const step = usable / BARS;
            for (let i = 0; i < BARS; i += 1) {
                let sum = 0;
                const from = Math.floor(i * step);
                const to = Math.max(from + 1, Math.floor((i + 1) * step));
                for (let j = from; j < to; j += 1) sum += bins[j];
                const target = Math.min(1, sum / (to - from) / 190);
                // Rise fast, fall slow — the way a level meter should behave.
                const ease = target > levels[i] ? 0.45 : 0.12;
                levels[i] += (Math.max(target, IDLE_AMPLITUDE * 0.6) - levels[i]) * ease;
            }
        };

        const draw = () => {
            const { width, height } = canvas.getBoundingClientRect();
            ctx.clearRect(0, 0, width, height);
            if (width < 2) return;

            const mid = height / 2;
            const gap = 2;
            const barWidth = Math.max(2, (width - gap * (BARS - 1)) / BARS);

            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, tint[0]);
            gradient.addColorStop(0.5, tint[1]);
            gradient.addColorStop(1, tint[2]);
            ctx.fillStyle = gradient;

            const rounded = typeof ctx.roundRect === 'function';
            for (let i = 0; i < BARS; i += 1) {
                const h = Math.max(2, levels[i] * (height * 0.92));
                const x = i * (barWidth + gap);
                if (rounded) {
                    ctx.beginPath();
                    ctx.roundRect(x, mid - h / 2, barWidth, h, Math.min(barWidth / 2, 3));
                    ctx.fill();
                } else {
                    ctx.fillRect(x, mid - h / 2, barWidth, h);
                }
            }
        };

        const tick = () => {
            sample();
            draw();
        };

        gsap.ticker.add(tick);
        return () => {
            gsap.ticker.remove(tick);
            observer?.disconnect();
        };
    }, [canvasRef, analyserRef, active, tint]);
}
