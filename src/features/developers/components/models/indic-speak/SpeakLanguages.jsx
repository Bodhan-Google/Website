import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsapSetup';
import { LANGUAGE_BURST } from './speakScripts';

// The film's closing beat: one model, and then the whole list arriving at
// once. Each name bursts out from the centre of the field to the place it is
// going to sit, so the group reads as one thing coming apart rather than
// twenty-three cards fading in.

const SpeakLanguages = () => {
    const fieldRef = useRef(null);

    useEffect(() => {
        const field = fieldRef.current;
        if (!field || prefersReducedMotion()) return undefined;

        const chips = gsap.utils.toArray(field.querySelectorAll('span'));
        const fieldBox = field.getBoundingClientRect();
        const centreX = fieldBox.width / 2;
        const centreY = fieldBox.height / 2;

        const timeline = gsap.timeline({ paused: true });

        chips.forEach((chip) => {
            const x = centreX - (chip.offsetLeft + chip.offsetWidth / 2);
            const y = centreY - (chip.offsetTop + chip.offsetHeight / 2);
            timeline.from(
                chip,
                {
                    x,
                    y,
                    scale: 0.24,
                    opacity: 0,
                    rotate: gsap.utils.random(-24, 24),
                    duration: 0.9,
                    ease: 'expo.out',
                },
                gsap.utils.random(0, 0.35)
            );
        });

        // A slow, uneven drift afterwards, so the field never looks frozen.
        const drift = gsap.to(chips, {
            y: () => gsap.utils.random(-5, 5),
            duration: () => gsap.utils.random(3.4, 5.2),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.08, from: 'random' },
            paused: true,
        });

        const trigger = ScrollTrigger.create({
            trigger: field,
            start: 'top 82%',
            once: true,
            onEnter: () => {
                timeline.play();
                drift.delay(1.3).play();
            },
        });

        return () => {
            trigger.kill();
            timeline.kill();
            drift.kill();
        };
    }, []);

    return (
        <section className="isp-langs isp-tinted" id="languages">
            <div className="isp-container">
                <div className="isp-head-center">
                    <p className="isp-eyebrow isp-fade">Coverage</p>
                    <h2 className="isp-title isp-fade">
                        One model, <span className="isp-hl">23 languages</span>.
                    </h2>
                    <p className="isp-blurb isp-fade">
                        All 22 languages of the Eighth Schedule, plus English — each in its own
                        script, from one checkpoint, with no per-language model to pick between.
                    </p>
                </div>

                <div className="isp-burst" ref={fieldRef}>
                    {LANGUAGE_BURST.map((entry) => (
                        <span key={entry.name} data-script={entry.script}>
                            {entry.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpeakLanguages;
