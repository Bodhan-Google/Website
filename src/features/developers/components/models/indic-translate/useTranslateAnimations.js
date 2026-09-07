import { gsap, useGsapAnimation } from '../../../../../utils/motion';

/**
 * Page-level motion: entrances, counters and ambience. Every demo owns its own
 * timeline, because those are the ones carrying meaning — nothing here does
 * more than get an element onto the screen, and all of it is skipped outright
 * when the visitor has asked for reduced motion.
 */
export default function useTranslateAnimations(pageRef) {
    // Guarded: everything below is a `from`, so a ticker that never runs would
    // leave the whole page written to its start values and invisible.
    useGsapAnimation(() => {
        // --- hero ------------------------------------------------------
        gsap.from('.itr-hero-reveal', {
            opacity: 0,
            y: 28,
            filter: 'blur(8px)',
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.08,
        });

        gsap.from('.itr-field-glyph', {
            opacity: 0,
            scale: 0.75,
            duration: 1.1,
            stagger: { each: 0.05, from: 'random' },
            ease: 'power2.out',
            delay: 0.2,
        });

        gsap.to('.itr-field-glyph', {
            y: -13,
            duration: 4.2,
            ease: 'sine.inOut',
            stagger: { each: 0.22, from: 'random' },
            repeat: -1,
            yoyo: true,
        });

        // The two arcs behind the hero are the page's own subject matter —
        // a route from one side to the other — used as ornament.
        gsap.fromTo(
            '.itr-field-arc',
            { scaleX: 0.6, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.4, stagger: 0.18, ease: 'power3.out', delay: 0.4 }
        );

        gsap.utils.toArray('.itr-count').forEach((el) => {
            const target = Number(el.dataset.target) || 0;
            const proxy = { value: 0 };
            gsap.to(proxy, {
                value: target,
                duration: 1.3,
                delay: 0.5,
                ease: 'power2.out',
                onUpdate: () => {
                    el.textContent = String(Math.round(proxy.value));
                },
            });
        });

        // --- sections --------------------------------------------------
        gsap.utils.toArray('.itr-reveal').forEach((el) => {
            gsap.from(el, {
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
                opacity: 0,
                y: 32,
                duration: 0.75,
                ease: 'power3.out',
            });
        });

        gsap.utils.toArray('.itr-spec').forEach((el, index) => {
            gsap.from(el, {
                scrollTrigger: { trigger: '.itr-spec-strip', start: 'top 90%', toggleActions: 'play none none reverse' },
                opacity: 0,
                y: 18,
                duration: 0.55,
                delay: index * 0.07,
                ease: 'power3.out',
            });
        });

        // --- capability cards ------------------------------------------
        gsap.utils.toArray('.itr-cap').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: { trigger: '.itr-cap-grid', start: 'top 86%', toggleActions: 'play none none reverse' },
                opacity: 0,
                y: 26,
                duration: 0.6,
                delay: (index % 3) * 0.08 + Math.floor(index / 3) * 0.1,
                ease: 'power3.out',
            });
        });

        // --- coverage --------------------------------------------------
        // Twenty-two chips arriving at once is a wall; arriving in reading
        // order, it is a list being counted out.
        gsap.utils.toArray('.itr-lang-chip').forEach((chip, index) => {
            gsap.from(chip, {
                scrollTrigger: { trigger: '.itr-lang-grid', start: 'top 88%', toggleActions: 'play none none reverse' },
                opacity: 0,
                y: 16,
                scale: 0.94,
                duration: 0.45,
                delay: index * 0.028,
                ease: 'back.out(1.6)',
            });
        });

        gsap.utils.toArray('.itr-mode-tab').forEach((tab, index) => {
            gsap.from(tab, {
                scrollTrigger: { trigger: '.itr-mode-tabs', start: 'top 92%', toggleActions: 'play none none reverse' },
                opacity: 0,
                y: 16,
                duration: 0.45,
                delay: index * 0.06,
                ease: 'power3.out',
            });
        });
    }, pageRef, [pageRef]);
}
