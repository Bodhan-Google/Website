import { useEffect, useRef } from 'react';

/**
 * Two document panes that scroll as one, so a long translation can be read against
 * its source without chasing two scrollbars.
 *
 * Position is mapped as a FRACTION of each pane's own scrollable height, not copied
 * as a pixel offset: the English source and the Indic output are different lengths
 * (and different line heights), so a pixel copy pins the shorter pane to its bottom
 * while the longer one is still a screen behind.
 *
 * Writing `scrollTop` fires its own scroll event, which would drive the panes back
 * into each other, so the write is gated for one frame. The echo lands in the same
 * frame as the write, and the rAF releases the gate afterwards -- a plain boolean
 * with no release would deadlock the moment one pane has nothing to scroll.
 */
export const useScrollSync = (deps) => {
  const src = useRef(null);
  const out = useRef(null);
  const locked = useRef(false);

  const follow = (event, from, to) => {
    // React attaches onScroll to the element itself (it does not bubble), but a
    // rendered table or code block inside the pane is its own scroller -- ignore it.
    if (!from || !to || event.target !== from || locked.current) return;
    locked.current = true;
    const fromMax = from.scrollHeight - from.clientHeight;
    const toMax = to.scrollHeight - to.clientHeight;
    to.scrollTop = fromMax > 0 ? (from.scrollTop / fromMax) * toMax : 0;
    requestAnimationFrame(() => {
      locked.current = false;
    });
  };

  // A different document, language or view makes the carried-over offset meaningless.
  useEffect(() => {
    [src.current, out.current].forEach((el) => {
      if (el) el.scrollTop = 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    source: {
      ref: src,
      onScroll: (e) => follow(e, src.current, out.current),
      'data-sync': 'source',
    },
    output: {
      ref: out,
      onScroll: (e) => follow(e, out.current, src.current),
      'data-sync': 'output',
    },
  };
};
