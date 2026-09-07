import { useRef } from 'react';
import { gsap, useGsapAnimation } from '../devMotion';

/**
 * A slow gradient wash behind a hero, tinted with the model's own colour.
 *
 * Three blurred blobs drifting on different periods — never a `from`, so if
 * the tweens never run the page just shows a still gradient rather than
 * nothing at all.
 */
const AccentAurora = ({ from, to, className = '' }) => {
    const ref = useRef(null);

    useGsapAnimation((root) => {
        root.querySelectorAll('.aur-blob').forEach((blob, i) => {
            gsap.to(blob, {
                xPercent: i % 2 ? -12 : 14,
                yPercent: i === 1 ? 10 : -8,
                scale: 1.14,
                duration: 11 + i * 3.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.8,
            });
        });
    }, ref, []);

    return (
        <div
            ref={ref}
            className={`aur ${className}`}
            aria-hidden="true"
            style={{ '--aur-from': from, '--aur-to': to }}
        >
            <span className="aur-blob aur-blob-1" />
            <span className="aur-blob aur-blob-2" />
            <span className="aur-blob aur-blob-3" />
            <span className="aur-mesh" />
        </div>
    );
};

export default AccentAurora;
