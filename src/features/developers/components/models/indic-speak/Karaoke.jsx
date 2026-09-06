import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { activeIndex, paceWords } from './pacing';
import { useAudioTicker } from './useSpeakAudio';
import useReadHead from './useReadHead';

// Captions that follow the voice.
//
// Two renderers, because the page has two very different scales of text. Short
// lines — a message, a podcast turn, a normalised sentence — get word-level
// highlighting. The two long reads (a 2½-minute story, a 5-minute chapter) get
// paragraph-level highlighting with a progress underline, because two thousand
// animated word spans buy nothing a reader can actually follow.
//
// Both write straight to the DOM from the audio ticker. React renders the spans
// once; after that the clip clock owns them.

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const WordLine = ({
    text,
    start = 0,
    end,
    focus,
    audioRef,
    playing,
    lang,
    className = '',
    tag: Tag = 'p',
}) => {
    const containerRef = useRef(null);
    const parts = useMemo(
        () => paceWords(text, start, end ?? start + 1, focus),
        [text, start, end, focus]
    );
    const spans = useMemo(() => parts.filter((part) => !part.space), [parts]);

    useReadHead(containerRef, '.isp-w', spans, audioRef, playing, (node) => {
        if (prefersReducedMotion()) return;
        gsap.fromTo(
            node,
            { yPercent: 14 },
            { yPercent: 0, duration: 0.34, ease: 'back.out(2.6)', overwrite: true }
        );
    });

    return (
        <Tag ref={containerRef} className={`isp-caption ${className}`} lang={lang}>
            {parts.map((part, index) =>
                part.space ? (
                    <span key={index}> </span>
                ) : (
                    <span key={index} className="isp-w" data-focus={part.focus || undefined}>
                        {part.text}
                    </span>
                )
            )}
        </Tag>
    );
};

export const BlockList = ({
    blocks,
    audioRef,
    playing,
    lang,
    className = '',
    scrollerRef,
}) => {
    const containerRef = useRef(null);

    useReadHead(containerRef, '.isp-block', blocks, audioRef, playing, (node) => {
        const scroller = scrollerRef?.current;
        if (!scroller) return;
        const offset =
            node.offsetTop - scroller.clientHeight / 2 + node.offsetHeight / 2;
        if (prefersReducedMotion()) {
            scroller.scrollTo({ top: Math.max(0, offset) });
            return;
        }
        gsap.to(scroller, {
            scrollTop: Math.max(0, offset),
            duration: 0.8,
            ease: 'power2.out',
            overwrite: true,
        });
    });

    // The underline on the active paragraph tracks progress through it, which
    // is the only read-head a paragraph-level caption can honestly offer.
    useAudioTicker(audioRef, playing, (time) => {
        const container = containerRef.current;
        if (!container) return;
        const index = activeIndex(blocks, time);
        const node = container.querySelectorAll('.isp-block')[index];
        if (!node) return;
        const span = blocks[index];
        const length = Math.max(0.001, span.end - span.start);
        const progress = Math.min(1, Math.max(0, (time - span.start) / length));
        node.style.setProperty('--isp-read', progress.toFixed(3));
    });

    return (
        <div ref={containerRef} className={`isp-blocks ${className}`} lang={lang}>
            {blocks.map((block, index) => (
                <p key={index} className="isp-block" data-kind={block.kind || undefined}>
                    {block.text}
                </p>
            ))}
        </div>
    );
};
