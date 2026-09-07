import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Page-level motion. The demo owns its own audio-driven visuals; everything
 * here is entrance and ambience, and all of it is skipped when the visitor has
 * asked for reduced motion.
 */
export default function useTranscribeAnimations(pageRef) {
    useLayoutEffect(() => {
        const root = pageRef.current;
        if (!root || prefersReducedMotion()) return undefined;

        const ctx = gsap.context(() => {
            // --- hero -----------------------------------------------------
            gsap.from('.itx-hero-reveal', {
                opacity: 0,
                y: 30,
                filter: 'blur(8px)',
                duration: 0.9,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.1,
            });

            gsap.from('.itx-field-word', {
                opacity: 0,
                scale: 0.82,
                duration: 1.1,
                stagger: { each: 0.05, from: 'random' },
                ease: 'power2.out',
                delay: 0.25,
            });

            gsap.to('.itx-field-word', {
                y: -14,
                duration: 4.2,
                ease: 'sine.inOut',
                stagger: { each: 0.22, from: 'random' },
                repeat: -1,
                yoyo: true,
            });

            // The hero waveform grows from the centre outwards, then keeps a
            // slow breath running underneath the headline.
            const bars = gsap.utils.toArray('.itx-hero-bar');
            if (bars.length) {
                gsap.from(bars, {
                    scaleY: 0,
                    opacity: 0,
                    duration: 0.75,
                    ease: 'power3.out',
                    stagger: { each: 0.012, from: 'center' },
                    delay: 0.35,
                });

                gsap.to(bars, {
                    scaleY: (index) => 0.55 + ((index * 37) % 13) / 13,
                    duration: 1.6,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    stagger: { each: 0.035, from: 'center' },
                    delay: 1.1,
                });
            }

            // Hero counters. Decimals are honoured so 1.2B does not tick to 1B.
            gsap.utils.toArray('.itx-count').forEach((el) => {
                const target = Number(el.dataset.target) || 0;
                const decimals = Number(el.dataset.decimals) || 0;
                const proxy = { value: 0 };
                gsap.to(proxy, {
                    value: target,
                    duration: 1.4,
                    delay: 0.55,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = proxy.value.toFixed(decimals);
                    },
                });
            });

            // --- sections -------------------------------------------------
            gsap.utils.toArray('.itx-reveal').forEach((el) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 34,
                    duration: 0.8,
                    ease: 'power3.out',
                });
            });

            // --- pipeline -------------------------------------------------
            const line = root.querySelector('.itx-pipeline-line line');
            if (line) {
                gsap.fromTo(
                    line,
                    { attr: { x2: 0 } },
                    {
                        attr: { x2: 1000 },
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.itx-pipeline',
                            start: 'top 78%',
                            end: 'bottom 62%',
                            scrub: 0.6,
                        },
                    }
                );
            }

            gsap.utils.toArray('.itx-stage-card').forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: '.itx-pipeline', start: 'top 82%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 30,
                    duration: 0.7,
                    delay: index * 0.11,
                    ease: 'power3.out',
                });
            });

            // --- capability cards -----------------------------------------
            gsap.utils.toArray('.itx-cap').forEach((card, index) => {
                gsap.from(card, {
                    scrollTrigger: { trigger: '.itx-cap-grid', start: 'top 86%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 28,
                    duration: 0.65,
                    delay: (index % 3) * 0.08 + Math.floor(index / 3) * 0.12,
                    ease: 'power3.out',
                });
            });

            // --- song tiles -------------------------------------------------
            gsap.utils.toArray('.itx-song-tile').forEach((tile, index) => {
                gsap.from(tile, {
                    scrollTrigger: { trigger: '.itx-song-rail', start: 'top 90%', toggleActions: 'play none none reverse' },
                    opacity: 0,
                    y: 24,
                    scale: 0.92,
                    duration: 0.55,
                    delay: index * 0.06,
                    ease: 'back.out(1.6)',
                });
            });
        }, root);

        return () => ctx.revert();
    }, [pageRef]);
}
