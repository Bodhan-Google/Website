import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ACCENTS, EXAMPLES } from './speakData';
import { useClipPlayer } from './useSpeakAudio';
import SegmentedRail from './SegmentedRail';
import ExampleStage from './ExampleStage';
import { PlayButton, ProgressRail, RestartButton, TimeReadout } from './Transport';

// Six clips, six ways of arranging the same thing: text on the left of the
// generation, audio on the right. Switching tabs swaps the stage and the clip
// together; the shell around them stays put so the eye does not have to
// re-find the transport.

const RAIL_ITEMS = EXAMPLES.map((example) => ({ id: example.id, label: example.tab }));

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SpeakExamples = () => {
    const [activeId, setActiveId] = useState(EXAMPLES[0].id);
    const example = EXAMPLES.find((item) => item.id === activeId) ?? EXAMPLES[0];
    const accent = ACCENTS[example.tone];

    const { audioRef, playing, toggle, restart, seek } = useClipPlayer(example.audio);
    const bodyRef = useRef(null);

    useEffect(() => {
        const body = bodyRef.current;
        if (!body || prefersReducedMotion()) return undefined;
        const tween = gsap.fromTo(
            body,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
        );
        return () => tween.kill();
    }, [activeId]);

    return (
        <section
            className="isp-examples isp-tinted"
            id="examples"
            style={{ '--isp-accent': accent }}
        >
            <div className="isp-container">
                <div className="isp-head-center">
                    <p className="isp-eyebrow isp-fade">Examples</p>
                    <h2 className="isp-title isp-fade">Six things it was asked to read.</h2>
                    <p className="isp-blurb isp-fade">
                        A code-mixed message, a two-speaker podcast, a radio bulletin, a lesson, a
                        children&apos;s story and a chapter of a Tamil novel. Every clip is the
                        model reading the text printed beside it.
                    </p>
                </div>

                <div className="isp-tabs isp-fade">
                    <SegmentedRail
                        items={RAIL_ITEMS}
                        active={activeId}
                        onSelect={setActiveId}
                        label="Example"
                    />
                </div>

                <div className="isp-stage isp-fade">
                    <div className="isp-stage-head">
                        <div>
                            <p className="isp-eyebrow">{example.kicker}</p>
                            <h3 className="isp-title">{example.title}</h3>
                            <p className="isp-blurb">{example.blurb}</p>
                        </div>
                        <span className="isp-stage-meta">{example.meta}</span>
                    </div>

                    <div className="isp-stage-body" ref={bodyRef}>
                        <ExampleStage
                            key={example.id}
                            example={example}
                            audioRef={audioRef}
                            playing={playing}
                            accent={accent}
                            toggle={toggle}
                        />
                        <div className="isp-chips">
                            {example.chips.map((chip) => (
                                <span key={chip} className="isp-chip">
                                    {chip}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="isp-stage-foot">
                        <PlayButton playing={playing} onToggle={toggle} solid />
                        <RestartButton onRestart={restart} />
                        <ProgressRail
                            audioRef={audioRef}
                            playing={playing}
                            duration={example.duration}
                            onSeek={(fraction) => seek(fraction * example.duration)}
                        />
                        <TimeReadout
                            audioRef={audioRef}
                            playing={playing}
                            duration={example.duration}
                        />
                    </div>

                    <audio ref={audioRef} src={example.audio} preload="none" />
                </div>
            </div>
        </section>
    );
};

export default SpeakExamples;
