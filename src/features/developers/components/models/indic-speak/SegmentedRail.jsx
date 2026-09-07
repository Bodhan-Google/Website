import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// A pill rail whose highlight slides to whatever is selected. Measured from
// the real button boxes rather than assumed to be even widths, because the
// labels here range from "News" to "Any Indic language + English".

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SegmentedRail = ({ items, active, onSelect, label, role = 'tablist' }) => {
    const railRef = useRef(null);
    const indicatorRef = useRef(null);

    useEffect(() => {
        const rail = railRef.current;
        const indicator = indicatorRef.current;
        if (!rail || !indicator) return undefined;

        const place = (animate) => {
            const node = rail.querySelector(`[data-rail-id="${active}"]`);
            if (!node) return;
            const railBox = rail.getBoundingClientRect();
            const box = node.getBoundingClientRect();
            gsap.to(indicator, {
                x: box.left - railBox.left,
                y: box.top - railBox.top - 5,
                width: box.width,
                opacity: 1,
                duration: animate && !prefersReducedMotion() ? 0.42 : 0,
                ease: 'power3.out',
                overwrite: true,
            });
        };

        place(true);

        const observer = new ResizeObserver(() => place(false));
        observer.observe(rail);
        return () => observer.disconnect();
    }, [active, items]);

    const isTabs = role === 'tablist';

    return (
        <div className="isp-rail" role={role} aria-label={label} ref={railRef}>
            <span className="isp-rail-indicator" ref={indicatorRef} aria-hidden="true" />
            {items.map((item) => (
                <button
                    key={item.id}
                    type="button"
                    data-rail-id={item.id}
                    role={isTabs ? 'tab' : undefined}
                    aria-selected={isTabs ? item.id === active : undefined}
                    aria-pressed={isTabs ? undefined : item.id === active}
                    onClick={() => onSelect(item.id)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default SegmentedRail;
