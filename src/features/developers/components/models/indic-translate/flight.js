import gsap from 'gsap';

/**
 * The token flight: source words physically travel to where their output lands.
 *
 * Two things make it worth the trouble. Indic clauses run subject–object–verb
 * and English does not, so the arcs genuinely cross rather than running
 * parallel — the reordering a translation performs becomes something you can
 * watch. And token counts differ between the two lines, so the fan of arcs is
 * itself informative: one English word can arrive as three, or three as one.
 *
 * Positions are measured from the live DOM, so the flight stays correct at
 * every width, in either writing direction, and after a re-wrap.
 */

/** A flier element carrying one token, parked at its origin. */
function makeFlier(layer, text, tone) {
    const el = document.createElement('span');
    el.className = 'itr-flier';
    if (tone) el.dataset.tone = tone;
    el.textContent = text;
    el.setAttribute('aria-hidden', 'true');
    layer.appendChild(el);
    return el;
}

const rectIn = (el, originRect) => {
    const r = el.getBoundingClientRect();
    return {
        x: r.left - originRect.left,
        y: r.top - originRect.top,
        w: r.width,
        h: r.height,
    };
};

/**
 * Builds the flight timeline.
 *
 * `pairs` is [{ from: HTMLElement, to: HTMLElement, text, tone }]. `from` is
 * where the token leaves, `to` is the output token it becomes — `to` must
 * already be laid out (it is hidden with opacity, not display) so its box can
 * be measured.
 */
export function buildFlight({ stage, layer, pairs, stagger = 0.052, duration = 0.66, lift = 1 }) {
    const tl = gsap.timeline();
    if (!stage || !layer || !pairs.length) return tl;

    layer.replaceChildren();
    const origin = stage.getBoundingClientRect();

    pairs.forEach((pair, index) => {
        const { from, to, text, tone } = pair;
        if (!from || !to) return;

        const a = rectIn(from, origin);
        const b = rectIn(to, origin);
        const flier = makeFlier(layer, text, tone);

        // Park the flier over its source word. Width is left to the content so
        // a long word does not get squeezed mid-flight.
        gsap.set(flier, { left: a.x, top: a.y, x: 0, y: 0, opacity: 0, scale: 0.94 });

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        // Arc height grows with the distance travelled and with how far the
        // token has to move sideways, so short hops stay flat and long
        // reorderings bow out of the way of each other.
        const arc = -(34 + Math.min(120, Math.abs(dx) * 0.14 + Math.abs(dy) * 0.3)) * lift;
        const cx = dx * 0.5 + (index % 2 ? 12 : -12);
        const cy = dy * 0.5 + arc;

        const proxy = { t: 0 };
        const leg = gsap
            .timeline()
            .to(flier, { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' })
            .to(
                proxy,
                {
                    t: 1,
                    duration,
                    ease: 'power2.inOut',
                    onUpdate: () => {
                        const t = proxy.t;
                        const m = 1 - t;
                        gsap.set(flier, {
                            x: m * m * 0 + 2 * m * t * cx + t * t * dx,
                            y: m * m * 0 + 2 * m * t * cy + t * t * dy,
                            rotate: Math.sin(t * Math.PI) * (index % 2 ? 5 : -5),
                        });
                    },
                },
                0
            )
            // The flier dissolves into the output word rather than stopping on
            // top of it: it blooms out as the translated token blooms in.
            .to(flier, { opacity: 0, scale: 1.18, filter: 'blur(5px)', duration: 0.2, ease: 'power1.in' }, duration * 0.82)
            .fromTo(
                to,
                { opacity: 0, y: 9, scale: 0.86, filter: 'blur(6px)' },
                { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.34, ease: 'back.out(1.8)' },
                duration * 0.8
            );

        tl.add(leg, index * stagger);
    });

    return tl;
}

/**
 * A monotone alignment between two token lists of different lengths.
 *
 * There are no word-level alignments in the recorded runs, so nothing here
 * claims "this word became that word". What it does claim is only what is
 * safe: reading position. Token j of the output is launched from the source
 * token at the same relative position in the line, which is why differing
 * counts fan the arcs out instead of pretending to a one-to-one mapping.
 */
export function proportionalPairs(srcEls, outEls, outTokens, tone) {
    const n = srcEls.length;
    if (!n) return [];
    return outEls.map((to, j) => {
        const ratio = outEls.length > 1 ? j / (outEls.length - 1) : 0;
        const i = Math.min(n - 1, Math.round(ratio * (n - 1)));
        return { from: srcEls[i], to, text: srcEls[i].textContent, tone, outText: outTokens[j] };
    });
}
