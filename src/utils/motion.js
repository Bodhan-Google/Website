import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shared GSAP setup for the pages that animate their content into view.
 *
 * The rule these helpers exist to enforce: an entrance animation must never be
 * the only thing making content visible.
 *
 * GSAP drives every tween off requestAnimationFrame, which a browser suspends for
 * a document it does not paint — a background tab, an embedded preview surface, a
 * page restored from the back/forward cache. A `from`/`fromTo` set up in that
 * state writes its start values (opacity: 0) and then never advances, so an
 * entire article can sit there invisible with its markup laid out underneath it.
 * The demo and the specimen sheet in the Indic-Translate post were doing exactly
 * that: 856x896 and six cards of real content, all at opacity 0.
 *
 * So animations are not set up until the document is actually being painted.
 * Until then the page simply renders, which is the state it has to be readable
 * in anyway.
 */

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Whether a tween set up right now would actually run to completion. */
export const canAnimate = () =>
    typeof document !== 'undefined' &&
    document.visibilityState === 'visible' &&
    !prefersReducedMotion();

/**
 * Run a GSAP setup function against a container, deferring it until the document
 * is visible, and scoping everything it creates so cleanup is automatic.
 *
 * `setup` receives the container element and may create tweens, timelines and
 * ScrollTriggers freely; the surrounding `gsap.context` reverts all of them —
 * including every inline style they wrote — when the effect tears down.
 *
 * @param {(root: Element) => void} setup
 * @param {React.RefObject<Element>} ref      container the animation is scoped to
 * @param {unknown[]} deps                    re-runs setup when these change
 */
export const useGsapAnimation = (setup, ref, deps = []) => {
    useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return undefined;

        let context = null;
        const start = () => {
            context = gsap.context(() => setup(root), root);
        };

        if (canAnimate()) {
            start();
            return () => context?.revert();
        }

        // Reduced motion is a preference, not a temporary state: leave the page
        // as it renders and never animate it.
        if (prefersReducedMotion()) return undefined;

        // Hidden for now. Set the animation up when the reader actually arrives,
        // so a tab opened in the background still animates when it is looked at.
        const onVisible = () => {
            if (!canAnimate()) return;
            document.removeEventListener('visibilitychange', onVisible);
            start();
            ScrollTrigger.refresh();
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            document.removeEventListener('visibilitychange', onVisible);
            context?.revert();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};

let refreshHandle = null;

/**
 * Re-measure every ScrollTrigger after content of an unknown height has landed.
 *
 * ScrollTrigger measures start positions once. This post loads ~650 KB of
 * recorded model output after first paint and the widgets it feeds are thousands
 * of pixels tall, so without this every trigger below them is measured against a
 * page height that no longer exists. Batched, because several widgets share that
 * chunk and would otherwise each pay for a full refresh.
 */
export const refreshTriggers = () => {
    if (typeof window === 'undefined' || refreshHandle !== null) return;
    refreshHandle = window.setTimeout(() => {
        refreshHandle = null;
        ScrollTrigger.refresh();
    }, 120);
};

export { gsap, ScrollTrigger };
