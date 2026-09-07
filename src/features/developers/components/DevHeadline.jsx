import { Fragment, useRef } from 'react';
import { ensureRevealed, gsap, useGsapAnimation } from '../devMotion';

/**
 * A word-by-word headline reveal, the same shape as the site's AnimatedTitle
 * but driven by GSAP through `useGsapAnimation`.
 *
 * The difference that matters is what happens when the animation cannot run:
 * the words are rendered in place, and the mask that slides them up is only
 * ever applied by a tween that has been cleared to start. A page heading is
 * not a thing that can afford to be invisible.
 *
 * `words` takes plain strings, or { content, className } for a word (or short
 * phrase kept together as one unit) that needs its own styling or a forced
 * line break.
 */
const DevHeadline = ({ as: Tag = 'h1', className, words, delay = 0.08 }) => {
    const ref = useRef(null);

    useGsapAnimation((root) => {
        const parts = root.querySelectorAll('.dh-word > span');
        if (!parts.length) return;

        const tween = gsap.fromTo(
            parts,
            // clear of the mask's bottom edge, which now sits a descender's
            // worth below the line box (see .dh-word)
            { yPercent: 126, opacity: 0 },
            {
                yPercent: 0,
                opacity: 1,
                duration: 0.65,
                ease: 'power3.out',
                stagger: 0.06,
                delay,
                clearProps: 'transform,opacity',
            },
        );

        return ensureRevealed(tween, root);
    }, ref, [words.length]);

    return (
        <Tag className={className} ref={ref}>
            {words.map((word, i) => {
                const { content, className: wordClass } =
                    word && typeof word === 'object' ? word : { content: word, className: '' };

                // the space sits between the wrappers, not inside one: a
                // trailing space inside an overflow-hidden inline-block is
                // dropped, which runs the words together
                return (
                    <Fragment key={i}>
                        <span className={`dh-word ${wordClass ?? ''}`}>
                            <span>{content}</span>
                        </span>
                        {i < words.length - 1 ? ' ' : ''}
                    </Fragment>
                );
            })}
        </Tag>
    );
};

export default DevHeadline;
