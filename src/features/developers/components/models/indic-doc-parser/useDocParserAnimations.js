import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Page-level motion. The demo owns its own timeline; everything here is
 * entrance and ambience, and all of it is skipped outright when the visitor
 * has asked for reduced motion.
 */
export default function useDocParserAnimations(pageRef) {
    useLayoutEffect(() => {
        const root = pageRef.current;
        if (!root || prefersReducedMotion()) return undefined;

        const ctx = gsap.context(() => {
            // --- hero -----------------------------------------------------
            gsap.from('.idp-hero-reveal', {
                opacity: 0,
                y: 30,
                filter: 'blur(8px)',
                duration: 0.9,
                stagger: 0.11,
                ease: 'power3.out',
                delay: 0.1,
            });

            gsap.from('.idp-glyph', {
                opacity: 0,
                scale: 0.8,
                duration: 1.2,
                stagger: { each: 0.05, from: 'random' },
                ease: 'power2.out',
                delay: 0.25,
            });

            gsap.to('.idp-glyph', {
                y: -12,
                duration: 4,
                ease: 'sine.inOut',
                stagger: { each: 0.2, from: 'random' },
                repeat: -1,
                yoyo: true,
            });

            // The ornamental boxes draw themselves in, the way the real ones do.
            gsap.from('.idp-ghost-box', {
                scaleX: 0,
                transformOrigin: 'left center',
                opacity: 0,
                duration: 0.9,
                stagger: 0.14,
                ease: 'power3.out',
                delay: 0.5,
            });

            // Hero counters. The suffix stays put; only the number climbs.
            gsap.utils.toArray('.idp-count').forEach((el) => {
                const target = Number(el.dataset.target) || 0;
                const proxy = { value: 0 };
                gsap.to(proxy, {
                    value: target,
                    duration: 1.4,
                    delay: 0.55,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = String(Math.round(proxy.value));
                    },
                });
            });

            // --- sections -------------------------------------------------
            gsap.utils.toArray('.idp-reveal').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 34,
                    duration: 0.8,
                    ease: 'power3.out',
                });
            });

            // --- pipeline -------------------------------------------------
            // The connector grows as you scroll through the stages, and each
            // card lights when the line reaches it.
            const line = root.querySelector('.idp-pipeline-line line');
            if (line) {
                gsap.fromTo(
                    line,
                    { attr: { x2: 0 } },
                    {
                        attr: { x2: 1000 },
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.idp-pipeline',
                            start: 'top 78%',
                            end: 'bottom 62%',
                            scrub: 0.6,
                        },
                    }
                );
            }

            gsap.utils.toArray('.idp-stage-card').forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: '.idp-pipeline', start: 'top 82%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 30,
                    duration: 0.7,
                    delay: index * 0.11,
                    ease: 'power3.out',
                });
            });

            // --- capability cards ------------------------------------------
            gsap.utils.toArray('.idp-cap').forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: '.idp-cap-grid', start: 'top 86%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 28,
                    duration: 0.65,
                    delay: (index % 3) * 0.08 + Math.floor(index / 3) * 0.12,
                    ease: 'power3.out',
                });
            });

            // --- examples --------------------------------------------------
            gsap.utils.toArray('.idp-example-tab').forEach((tab, index) => {
                gsap.from(tab, {
                    scrollTrigger: { trigger: '.idp-example-strip', start: 'top 90%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                    duration: 0.55,
                    delay: index * 0.08,
                    ease: 'back.out(1.5)',
                });
            });
        }, root);

        return () => ctx.revert();
    }, [pageRef]);
}
