import { motion as Motion, useReducedMotion } from 'motion/react';

const EASE = [0.25, 0.46, 0.45, 0.94];

// Each entry is either plain text, or { content, wrapperClassName } when a
// word (or short phrase, kept together as one unit) needs its own styling —
// a color, italics, or a forced line break via wrapperClassName: 'block'.
const normalizeWord = (word) =>
    word && typeof word === 'object' && 'content' in word ? word : { content: word, wrapperClassName: '' };

// Word-by-word reveal for a page title: each word slides up out of a mask
// as it fades in, staggered left to right. Falls back to a plain render
// when the viewer has requested reduced motion.
export const AnimatedWords = ({ words, as: Tag = 'h1', className = '', delay = 0, wordDelay = 0.05, duration = 0.55, ...rest }) => {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        return (
            <Tag className={className} {...rest}>
                {words.map((word, i) => {
                    const { content, wrapperClassName } = normalizeWord(word);
                    return (
                        <span key={i} className={wrapperClassName || undefined}>
                            {content}
                            {i < words.length - 1 ? ' ' : ''}
                        </span>
                    );
                })}
            </Tag>
        );
    }

    return (
        <Tag className={className} {...rest}>
            {words.map((word, i) => {
                const { content, wrapperClassName } = normalizeWord(word);
                return (
                    <span
                        key={i}
                        className={wrapperClassName || undefined}
                        style={{ display: wrapperClassName?.includes('block') ? 'block' : 'inline-block', overflow: 'hidden' }}
                    >
                        <Motion.span
                            style={{ display: 'inline-block' }}
                            initial={{ y: '110%', opacity: 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            transition={{ duration, ease: EASE, delay: delay + i * wordDelay }}
                        >
                            {content}
                        </Motion.span>
                        {i < words.length - 1 ? ' ' : ''}
                    </span>
                );
            })}
        </Tag>
    );
};

// Convenience wrapper for the common case: a plain-text title, split on spaces.
const AnimatedTitle = ({ text, ...rest }) => <AnimatedWords words={text.split(' ')} {...rest} />;

export default AnimatedTitle;
