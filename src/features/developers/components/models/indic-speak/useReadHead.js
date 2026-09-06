import { useEffect, useRef } from 'react';
import { activeIndex } from './pacing';
import { useAudioTicker } from './useSpeakAudio';

// Marks which caption unit is being spoken, by writing data attributes onto
// the nodes rather than by re-rendering.
//
// Only the nodes whose state actually changed get touched, so a five-minute
// chapter costs the same per frame as a one-line message. Used by both caption
// renderers and by the podcast stage, which marks up its own turns.
export default function useReadHead(containerRef, selector, spans, audioRef, playing, onEnter) {
    const lastRef = useRef(-2);

    useEffect(() => {
        lastRef.current = -2;
    }, [spans]);

    useAudioTicker(audioRef, playing, (time) => {
        const container = containerRef.current;
        if (!container) return;

        const next = activeIndex(spans, time);
        const previous = lastRef.current;
        if (next === previous) return;
        lastRef.current = next;

        const nodes = container.querySelectorAll(selector);
        const from = Math.max(0, Math.min(previous, next) - 1);
        const to = Math.min(nodes.length - 1, Math.max(previous, next) + 1);

        for (let i = from; i <= to; i += 1) {
            const node = nodes[i];
            if (!node) continue;
            if (i <= next) node.dataset.said = 'true';
            else delete node.dataset.said;
            if (i === next) node.dataset.now = 'true';
            else delete node.dataset.now;
        }

        if (next >= 0 && nodes[next]) onEnter?.(nodes[next], next);
    });
}
