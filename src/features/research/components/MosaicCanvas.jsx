import { useEffect, useRef } from 'react';
import { cn } from '../../../utils/tailwindUtils';

const CELL = 10;

const noise = (x, y, time, seed) => {
    const a = Math.sin(x * 0.06 + time + seed);
    const b = Math.cos(y * 0.05 - time * 0.7);
    const c = Math.sin((x + y) * 0.025 + time * 0.4);

    return (a + b + c + 3) / 6;
};

const getColor = (value) => {
    if (value > 0.78) return '#e0492a';
    if (value > 0.64) return '#f5c518';
    if (value > 0.5) return '#3b5bd9';
    if (value > 0.42) return '#1c2541';
    return null;
};

const MosaicCanvas = ({ className = '' }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return undefined;

        const ctx = canvas.getContext('2d');
        if (!ctx) return undefined;

        const seed = Math.random() * 1000;
        let animationFrame = 0;
        let running = true;

        const resize = () => {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const render = (milliseconds) => {
            if (!running) return;

            const time = milliseconds * 0.0005;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            ctx.clearRect(0, 0, width, height);

            for (let y = 0; y < height; y += CELL) {
                for (let x = 0; x < width; x += CELL) {
                    const value = noise(x, y, time, seed);
                    const color = getColor(value);

                    if (!color) continue;

                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, CELL - 1, CELL - 1);
                }
            }

            animationFrame = window.requestAnimationFrame(render);
        };

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        resize();

        if (reduceMotion) {
            render(0);
        } else {
            animationFrame = window.requestAnimationFrame(render);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        return () => {
            running = false;
            window.cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className={cn('research-mosaic', className)} aria-hidden="true">
            <canvas ref={canvasRef} id="mosaic" className="research-mosaic-canvas" />
        </div>
    );
};

export default MosaicCanvas;
