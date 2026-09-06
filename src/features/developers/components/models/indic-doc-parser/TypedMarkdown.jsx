import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { typeDuration } from './typeTiming';

gsap.registerPlugin(TextPlugin);

// Light tint pass over the Markdown the model emits: maths delimiters, inline
// emphasis and raw HTML tags each get their own colour once a block has
// settled, so the source reads as source rather than as prose.
const TOKEN = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|<\/?[a-zA-Z]+>|\*\*[^*]+\*\*|\*[^*\n]+\*|^#{1,4}\s)/gm;

const classOf = (token) => {
    if (token.startsWith('$')) return 'is-math';
    if (token.startsWith('<')) return 'is-tag';
    if (token.startsWith('#')) return 'is-head';
    return 'is-em';
};

const tint = (text) => {
    const parts = [];
    let last = 0;
    let match;
    TOKEN.lastIndex = 0;
    while ((match = TOKEN.exec(text)) !== null) {
        if (match.index > last) parts.push({ text: text.slice(last, match.index), cls: '' });
        parts.push({ text: match[0], cls: classOf(match[0]) });
        last = match.index + match[0].length;
    }
    if (last < text.length) parts.push({ text: text.slice(last), cls: '' });
    return parts;
};

/**
 * Types a block of Markdown out one character at a time, then re-renders the
 * same string with syntax tinting. The swap is invisible because both states
 * use the same type; the caret rides the end of the typed text for free by
 * simply following it in the flow.
 */
const TypedMarkdown = ({ text, play, scrollHost }) => {
    const spanRef = useRef(null);
    const [settled, setSettled] = useState(!play);

    useLayoutEffect(() => {
        if (!play || !spanRef.current) return undefined;

        const target = spanRef.current;
        const tween = gsap.to(target, {
            duration: typeDuration(text),
            ease: 'none',
            text: { value: text, delimiter: '' },
            // Pin the output pane to the bottom while a block streams, the way
            // a terminal follows its own output.
            onUpdate: () => {
                const host = scrollHost?.current;
                if (host) host.scrollTop = host.scrollHeight;
            },
            onComplete: () => setSettled(true),
        });

        return () => tween.kill();
    }, [play, text, scrollHost]);

    // `play` going false — the run was skipped or finished — settles the block
    // immediately, so it can never be left half-typed.
    if (play && !settled) {
        return (
            <code className="idp-md">
                <span ref={spanRef} />
                <i className="idp-caret" aria-hidden="true" />
            </code>
        );
    }

    return (
        <code className="idp-md">
            {tint(text).map((part, index) => (
                <span key={index} className={part.cls || undefined}>
                    {part.text}
                </span>
            ))}
        </code>
    );
};

export default TypedMarkdown;
