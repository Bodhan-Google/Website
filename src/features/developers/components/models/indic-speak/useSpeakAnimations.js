import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsapSetup';

// Page-level motion. Anything tied to a specific interaction lives with its
// component; this hook owns the entrances — the hero build, the section fades,
// the mosaic, the counters — and it owns them from one gsap.context so they
// all get reverted together when the route changes.

export default function useSpeakAnimations(pageRef) {
    useLayoutEffect(() => {
        const root = pageRef.current;
        if (!root || prefersReducedMotion()) return undefined;

        const ctx = gsap.context(() => {
            /* ------------------------------------------------------ hero */

            const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });

            hero
                .from('.isp-reveal', { opacity: 0, y: 26, duration: 0.8, stagger: 0.1 }, 0.1)
                .from(
                    '.isp-wordmark span',
                    { clipPath: 'inset(0 100% 0 0)', y: 16, duration: 1.05, ease: 'expo.out' },
                    0.24
                )
                .set('.isp-shine', { opacity: 1 }, 0.7)
                .fromTo(
                    '.isp-shine',
                    { xPercent: -130 },
                    { xPercent: 130, duration: 1.15, ease: 'power2.inOut' },
                    0.7
                )
                .to('.isp-shine', { opacity: 0, duration: 0.3 }, 1.6)
                .from(
                    '.isp-tricolor i',
                    { scaleX: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' },
                    0.9
                );

            // The language ring implodes outward from the centre of the hero.
            const ring = root.querySelector('.isp-lang-ring');
            if (ring) {
                const halfWidth = ring.clientWidth / 2;
                const halfHeight = ring.clientHeight / 2;

                hero.from(
                    '.isp-ring-word',
                    {
                        x: (index, el) => halfWidth - el.offsetLeft,
                        y: (index, el) => halfHeight - el.offsetTop,
                        scale: 0.2,
                        opacity: 0,
                        duration: 1.5,
                        ease: 'expo.out',
                        stagger: { each: 0.035, from: 'random' },
                    },
                    0.2
                );

                gsap.to(ring, {
                    rotation: 3,
                    duration: 26,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                });

                gsap.to(ring, {
                    y: -90,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.isp-hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                });
            }

            // Counters. The final value is already in the markup, so a reader
            // who never sees the animation still sees the number.
            gsap.utils.toArray('.isp-stat b').forEach((node) => {
                const target = Number(node.dataset.count);
                if (!Number.isFinite(target)) return;
                const suffix = node.dataset.suffix ?? '';
                const proxy = { value: 0 };

                gsap.to(proxy, {
                    value: target,
                    duration: 1.3,
                    ease: 'power2.out',
                    delay: 0.6,
                    onUpdate: () => {
                        node.textContent = `${Math.round(proxy.value)}${suffix}`;
                    },
                });
            });

            /* -------------------------------------------- section fades */

            ScrollTrigger.batch('.isp-fade', {
                start: 'top 88%',
                once: true,
                onEnter: (batch) =>
                    gsap.from(batch, {
                        opacity: 0,
                        y: 24,
                        duration: 0.72,
                        stagger: 0.08,
                        ease: 'power3.out',
                    }),
            });

            /* -------------------------------------------- tile  mosaic */

            const mosaic = root.querySelector('.isp-mosaic');
            if (mosaic) {
                gsap.from(mosaic.querySelectorAll('.isp-tile'), {
                    scrollTrigger: { trigger: mosaic, start: 'top 84%', once: true },
                    opacity: 0,
                    y: 34,
                    scale: 0.9,
                    rotate: (index) => (index % 2 ? 3.5 : -3.5),
                    duration: 0.72,
                    ease: 'back.out(1.5)',
                    stagger: { each: 0.07, grid: 'auto', from: 'center' },
                });

                // A few degrees of settle as the mosaic comes up the screen —
                // the film spins the tiles in; here scrolling does it.
                gsap.fromTo(
                    mosaic,
                    { rotate: -1.6 },
                    {
                        rotate: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: mosaic,
                            start: 'top bottom',
                            end: 'top 46%',
                            scrub: 0.6,
                        },
                    }
                );
            }

            /* ------------------------------------------ panels & stages */

            gsap.utils.toArray('.isp-panel, .isp-stage').forEach((panel) => {
                gsap.from(panel, {
                    scrollTrigger: { trigger: panel, start: 'top 88%', once: true },
                    opacity: 0,
                    y: 44,
                    rotateX: 5,
                    transformPerspective: 1200,
                    duration: 0.9,
                    ease: 'power3.out',
                });
            });

            /* ---------------------------------------- normaliser  words */

            const words = root.querySelector('.isp-norm-words');
            if (words) {
                gsap.from(words.querySelectorAll('.isp-norm-word'), {
                    scrollTrigger: { trigger: words, start: 'top 86%', once: true },
                    opacity: 0,
                    y: 26,
                    scale: 0.86,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'back.out(2)',
                });
            }

            /* ------------------------------------------------ platforms */

            gsap.utils.toArray('.isp-platform').forEach((platform, index) => {
                gsap.from(platform, {
                    scrollTrigger: { trigger: '.isp-platforms', start: 'top 88%', once: true },
                    opacity: 0,
                    y: 22,
                    duration: 0.55,
                    delay: index * 0.09,
                    ease: 'back.out(1.6)',
                });
            });
        }, root);

        // Fonts and the artwork behind the two reading stages change the page
        // height after the first measure.
        const refresh = () => ScrollTrigger.refresh();
        const raf = window.requestAnimationFrame(refresh);
        window.addEventListener('load', refresh);

        return () => {
            window.cancelAnimationFrame(raf);
            window.removeEventListener('load', refresh);
            ctx.revert();
        };
    }, [pageRef]);
}
