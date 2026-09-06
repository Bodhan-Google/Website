import { useEffect, useRef } from 'react';
import { ACCENTS, NORMALIZER } from './speakData';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsapSetup';
import { useClipPlayer } from './useSpeakAudio';
import { WordLine } from './Karaoke';
import VoiceOrb from './VoiceOrb';
import { PlayButton, TimeReadout } from './Transport';

// How a written sentence becomes a spoken one.
//
// The animation is the explanation: the parts of the input the normaliser
// rewrote physically leave the written card, travel into the harness, and the
// normalised reading lands on the other side with those same spans lit. Both
// texts are real — the input is what was sent, the reading is what the
// normaliser returned.

// Splits the written text so the rewritten substrings can be marked, and
// animated, on their own.
const splitTokens = (text, tokens) => {
    let parts = [{ text, token: false }];

    for (const token of tokens ?? []) {
        parts = parts.flatMap((part) => {
            if (part.token || !part.text.includes(token)) return [part];
            return part.text
                .split(token)
                .flatMap((chunk, index) =>
                    index === 0
                        ? [{ text: chunk, token: false }]
                        : [{ text: token, token: true }, { text: chunk, token: false }]
                )
                .filter((chunk) => chunk.text.length > 0 || chunk.token);
        });
    }

    return parts;
};

const Beat = ({ beat, index }) => {
    const rootRef = useRef(null);
    const { audioRef, playing, toggle } = useClipPlayer(beat.audio);
    const parts = splitTokens(beat.written, beat.tokens);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        if (prefersReducedMotion()) {
            gsap.set(root.querySelectorAll('.isp-beat-card, .isp-beat-pill'), { opacity: 1 });
            return undefined;
        }

        const input = root.querySelector('[data-role="in"]');
        const output = root.querySelector('[data-role="out"]');
        const pill = root.querySelector('.isp-beat-pill');
        const wires = root.querySelectorAll('.isp-beat-link path');

        const timeline = gsap.timeline({
            paused: true,
            onComplete: () => {
                // Nothing should be left mid-flight if the timeline is killed
                // while a clone is still travelling.
                root.querySelectorAll('.isp-token-fly').forEach((clone) => clone.remove());
            },
        });

        timeline
            .from(input, { opacity: 0, x: -34, duration: 0.62, ease: 'power3.out' })
            .from(wires, { drawSVG: '0%', duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
            .from(pill, { opacity: 0, scale: 0.7, duration: 0.42, ease: 'back.out(2.2)' }, '-=0.25')
            .add(() => flyTokens(root), '+=0.05')
            .to(
                pill,
                {
                    scale: 1.14,
                    duration: 0.26,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut',
                },
                '+=0.5'
            )
            .from(output, { opacity: 0, x: 34, duration: 0.6, ease: 'power3.out' }, '-=0.1')
            .from(
                output.querySelectorAll('.isp-w[data-focus]'),
                {
                    opacity: 0,
                    yPercent: 40,
                    scale: 0.9,
                    duration: 0.34,
                    stagger: 0.035,
                    ease: 'back.out(2.4)',
                },
                '-=0.25'
            );

        const trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top 76%',
            once: true,
            onEnter: () => timeline.play(),
        });

        return () => {
            trigger.kill();
            timeline.kill();
            root.querySelectorAll('.isp-token-fly').forEach((clone) => clone.remove());
        };
    }, []);

    return (
        <div
            className="isp-beat"
            ref={rootRef}
            style={{ '--isp-accent': ACCENTS[beat.tone] }}
        >
            <div className="isp-beat-card" data-role="in">
                <p className="isp-beat-tag">{beat.speaker} · input</p>
                <p className="isp-written" lang={beat.lang}>
                    {parts.map((part, i) =>
                        part.token ? (
                            <mark key={i} className="isp-token">
                                {part.text}
                            </mark>
                        ) : (
                            <span key={i}>{part.text}</span>
                        )
                    )}
                </p>
                <p className="isp-beat-lang">{beat.language}</p>
            </div>

            <div className="isp-beat-link" aria-hidden="true">
                <svg viewBox="0 0 128 40" preserveAspectRatio="none">
                    <path d="M0 20 H 30" />
                    <path d="M98 20 H 128" />
                </svg>
                <span className="isp-beat-pill">TTS harness</span>
            </div>

            <div className="isp-beat-card" data-role="out">
                <p className="isp-beat-tag">Normalised</p>
                <WordLine
                    text={beat.spoken}
                    start={0}
                    end={beat.duration}
                    focus={beat.focus}
                    audioRef={audioRef}
                    playing={playing}
                    lang={beat.lang === 'en' ? 'en' : beat.lang}
                    className="isp-spoken"
                />
                <div className="isp-beat-foot">
                    <VoiceOrb
                        audioRef={audioRef}
                        playing={playing}
                        accent={ACCENTS[beat.tone]}
                        size={42}
                    />
                    <PlayButton playing={playing} onToggle={toggle} solid />
                    <TimeReadout
                        audioRef={audioRef}
                        playing={playing}
                        duration={beat.duration}
                    />
                </div>
                <audio ref={audioRef} src={beat.audio} preload="none" />
            </div>
            <span className="isp-beat-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
            </span>
        </div>
    );
};

// Clones each rewritten token and sends it into the harness pill. The clones
// are absolutely positioned inside the beat, not fixed to the viewport, so
// they keep their place if the reader is still scrolling.
const flyTokens = (root) => {
    const pill = root.querySelector('.isp-beat-pill');
    const tokens = root.querySelectorAll('.isp-token');
    if (!pill || !tokens.length) return;

    const rootBox = root.getBoundingClientRect();
    const pillBox = pill.getBoundingClientRect();

    tokens.forEach((token, index) => {
        const box = token.getBoundingClientRect();
        const clone = document.createElement('span');
        clone.className = 'isp-token-fly';
        clone.textContent = token.textContent;
        clone.style.left = `${box.left - rootBox.left}px`;
        clone.style.top = `${box.top - rootBox.top}px`;
        clone.style.maxWidth = `${Math.max(box.width, 40)}px`;
        root.appendChild(clone);

        gsap
            .timeline({ delay: index * 0.14, onComplete: () => clone.remove() })
            .to(clone, {
                x: pillBox.left + pillBox.width / 2 - box.left - box.width / 2,
                y: pillBox.top + pillBox.height / 2 - box.top - box.height / 2,
                rotate: index % 2 ? 7 : -7,
                duration: 0.72,
                ease: 'power2.inOut',
            })
            .to(clone, { scale: 0.55, opacity: 0, duration: 0.26, ease: 'power2.in' }, '-=0.18');
    });
};

const SpeakNormalizer = () => (
    <section className="isp-norm isp-tinted" id="normalizer">
        <div className="isp-container">
            <div className="isp-head-center">
                <p className="isp-eyebrow isp-fade">{NORMALIZER.kicker}</p>
                <div className="isp-norm-words">
                    {NORMALIZER.words.map((word) => (
                        <b key={word} className="isp-norm-word">
                            {word}
                        </b>
                    ))}
                </div>
                <h2 className="isp-title isp-fade">{NORMALIZER.title}</h2>
                <p className="isp-blurb isp-fade">{NORMALIZER.blurb}</p>
            </div>

            {NORMALIZER.beats.map((beat, index) => (
                <Beat key={beat.id} beat={beat} index={index} />
            ))}
        </div>
    </section>
);

export default SpeakNormalizer;
