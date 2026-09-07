import { useRef } from 'react';
import { ensureRevealed, gsap, useGsapAnimation } from '../devMotion';

/**
 * Fade-and-lift a block as it scrolls in, GSAP's version of the site's
 * `Reveal`. Used across the developer pages so the whole section is driven by
 * one animation system rather than two.
 *
 * `children` selector — when given, the children matching it are staggered
 * instead of the block moving as one piece.
 */
const DevReveal = ({
    as: Tag = 'div',
    className,
    children,
    y = 26,
    delay = 0,
    duration = 0.7,
    start = 'top 88%',
    stagger,
    ...rest
}) => {
    const ref = useRef(null);

    useGsapAnimation(
        (root) => {
            const targets = stagger ? root.querySelectorAll(stagger) : root;
            if (!targets || (targets.length === 0 && stagger)) return;

            const tween = gsap.fromTo(
                targets,
                { opacity: 0, y },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay,
                    ease: 'power3.out',
                    stagger: stagger ? 0.09 : 0,
                    clearProps: 'opacity,transform',
                    scrollTrigger: { trigger: root, start, once: true },
                },
            );

            return ensureRevealed(tween, root);
        },
        ref,
        [stagger],
    );

    return (
        <Tag ref={ref} className={className} {...rest}>
            {children}
        </Tag>
    );
};

export default DevReveal;
