/**
 * GSAP setup for the developers section.
 *
 * Everything here goes through `useGsapAnimation` from the shared motion util,
 * which is what keeps an entrance animation from being the only thing making
 * content visible: it refuses to set a tween up while the document is not
 * being painted, so a card that would otherwise sit at opacity 0 forever just
 * renders instead. Read the note at the top of src/utils/motion.js before
 * adding a `from`/`fromTo` anywhere in here.
 */
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import {
    ScrollTrigger,
    canAnimate,
    prefersReducedMotion,
    refreshTriggers,
    useGsapAnimation,
} from '../../utils/motion';

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

/** The site's house ease — the same curve the motion/react components use. */
export const EASE = 'power3.out';

/**
 * Fade-and-lift a set of elements as they scroll in, one after another.
 *
 * `clearProps` matters: once the reveal is done the element is left with no
 * inline transform at all, so hover transforms and sticky positioning inside
 * it behave normally.
 */
export const revealBatch = (targets, { y = 26, stagger = 0.08, start = 'top 88%', scroller } = {}) => {
    const items = gsap.utils.toArray(targets);
    if (!items.length) return null;

    return gsap.fromTo(
        items,
        { opacity: 0, y },
        {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: EASE,
            stagger,
            clearProps: 'opacity,transform',
            scrollTrigger: { trigger: items[0], start, once: true, scroller },
        },
    );
};

/**
 * Safety net for an entrance tween: if its element is on screen and the tween
 * has still not advanced, jump it to its finished state.
 *
 * `useGsapAnimation` already refuses to set a tween up while the document is
 * not being painted, which covers the ordinary case. This covers the rest — a
 * document that reports itself visible while its frames are suspended, such as
 * one restored from the back/forward cache or an occluded window. GSAP drives
 * every tween off requestAnimationFrame, so in that state a `from` writes
 * opacity: 0 and then never advances, and the block never appears at all.
 *
 * Only worth wiring up where the start state hides real content — a page
 * heading, a hero, a whole section. Decorative loops can be left to fail
 * quietly.
 *
 * Returns a cleanup function; `gsap.context` calls it on teardown.
 */
export const ensureRevealed = (tween, el, delay = 800) => {
    const timer = window.setInterval(() => {
        if (tween.progress() > 0) {
            window.clearInterval(timer);
            return;
        }

        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            tween.progress(1, true);
            window.clearInterval(timer);
        }
    }, delay);

    return () => window.clearInterval(timer);
};

/** Count a number up to its final value while it is on screen. */
export const countUp = (el, to, { duration = 1.4, format = (n) => n } = {}) => {
    const state = { n: 0 };
    return gsap.to(state, {
        n: to,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            el.textContent = format(state.n);
        },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
};

/**
 * Safety net for a tween that writes text: if it stalls part-way, put the real
 * value back.
 *
 * Stricter than `ensureRevealed`, because the failure is worse than a missing
 * animation. A count-up frozen at a third of the way through does not look
 * unanimated — it looks like a different number, and these numbers are a spec
 * sheet with prices on it. So this watches for two ticks with no change while
 * the element is on screen, and treats that as a ticker that is not advancing.
 *
 * Returns a cleanup function; `gsap.context` calls it on teardown.
 */
export const ensureSettled = (tween, el, finalText, delay = 700) => {
    let previous = null;

    const timer = window.setInterval(() => {
        if (tween.progress() === 1) {
            window.clearInterval(timer);
            return;
        }

        const rect = el.getBoundingClientRect();
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
        const current = el.textContent;

        if (onScreen && current === previous) {
            tween.progress(1, true);
            el.textContent = finalText;
            window.clearInterval(timer);
            return;
        }

        previous = current;
    }, delay);

    return () => window.clearInterval(timer);
};

export { gsap, ScrollTrigger, canAnimate, prefersReducedMotion, refreshTriggers, useGsapAnimation };
