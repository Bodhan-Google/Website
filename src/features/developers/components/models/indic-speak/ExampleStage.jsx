import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { BlockList, WordLine } from './Karaoke';
import useReadHead from './useReadHead';
import VoiceOrb from './VoiceOrb';
import { PlayButton } from './Transport';

// One stage per example. They share the shell (heading, transport, chips) and
// differ in how the text is arranged, because that arrangement is the point:
// a podcast is bubbles, a bulletin is a running order, a chapter is a page.

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// `options` must be a stable object — these components re-render whenever the
// transport state changes, and a fresh object would re-run the entrance.
const useEntrance = (rootRef, selector, options) => {
    useEffect(() => {
        const root = rootRef.current;
        if (!root || prefersReducedMotion()) return undefined;
        const targets = root.querySelectorAll(selector);
        if (!targets.length) return undefined;

        const tween = gsap.from(targets, {
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
            ...options,
        });
        return () => tween.kill();
    }, [rootRef, selector, options]);
};

/* --------------------------------------------------------------- line */

const LineStage = ({ example, audioRef, playing, accent }) => (
    <div className="isp-line-stage">
        <VoiceOrb
            audioRef={audioRef}
            playing={playing}
            accent={accent}
            size={104}
            label="Voice waveform"
        />
        <WordLine
            text={example.script}
            start={0}
            end={example.duration}
            audioRef={audioRef}
            playing={playing}
            lang={example.lang}
        />
    </div>
);

/* --------------------------------------------------------------- chat */

const TURN_ENTRANCE = { y: 22, stagger: 0.1, ease: 'back.out(1.4)' };

const ChatStage = ({ example, audioRef, playing, accent }) => {
    const rootRef = useRef(null);
    useReadHead(rootRef, '.isp-turn', example.turns, audioRef, playing);
    useEntrance(rootRef, '.isp-turn', TURN_ENTRANCE);

    return (
        <div className="isp-chat" ref={rootRef}>
            {example.turns.map((turn, index) => (
                <div
                    key={index}
                    className="isp-turn"
                    data-side={turn.speaker === 1 ? 'right' : 'left'}
                >
                    <VoiceOrb
                        audioRef={audioRef}
                        playing={playing}
                        accent={accent}
                        size={38}
                    />
                    <div className="isp-bubble">
                        <p className="isp-bubble-who">{turn.speakerName}</p>
                        <WordLine
                            text={turn.text}
                            start={turn.start}
                            end={turn.end}
                            audioRef={audioRef}
                            playing={playing}
                            lang={example.lang}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ----------------------------------------------------------- bulletin */

const BulletinStage = ({ example, audioRef, playing, accent }) => {
    const scrollerRef = useRef(null);
    const trackRef = useRef(null);

    // The ticker is a real tween rather than a CSS animation so it can be
    // stopped for readers who asked for less motion.
    useEffect(() => {
        const track = trackRef.current;
        if (!track || prefersReducedMotion()) return undefined;
        const half = track.scrollWidth / 2;
        const tween = gsap.fromTo(
            track,
            { x: 0 },
            { x: -half, duration: half / 46, ease: 'none', repeat: -1 }
        );
        return () => tween.kill();
    }, []);

    return (
        <div className="isp-bulletin">
            <div>
                <span className="isp-onair" data-live={playing || undefined}>
                    <i />
                    On air
                </span>
                <div className="isp-bulletin-scroll" ref={scrollerRef}>
                    <BlockList
                        blocks={example.blocks}
                        audioRef={audioRef}
                        playing={playing}
                        lang={example.lang}
                        scrollerRef={scrollerRef}
                    />
                </div>
                <div className="isp-ticker" aria-hidden="true">
                    <span className="isp-ticker-track" ref={trackRef}>
                        <span>{example.ticker.repeat(4)}</span>
                        <span>{example.ticker.repeat(4)}</span>
                    </span>
                </div>
            </div>

            <aside className="isp-bulletin-side">
                <VoiceOrb
                    audioRef={audioRef}
                    playing={playing}
                    accent={accent}
                    size={96}
                    label="Voice waveform"
                />
                <p>
                    All India Radio register
                    <br />
                    Malayalam · one pass
                </p>
            </aside>
        </div>
    );
};

/* -------------------------------------------------------------- tutor */

const TutorStage = ({ example, audioRef, playing, accent }) => (
    <div className="isp-tutor">
        <figure>
            <img src={example.image} alt="A child following a lesson on a laptop" />
        </figure>
        <div className="isp-tutor-card">
            <div className="isp-out-head">
                <VoiceOrb
                    audioRef={audioRef}
                    playing={playing}
                    accent={accent}
                    size={56}
                    label="Voice waveform"
                />
                <div className="isp-out-voice">
                    <p>Reading</p>
                    <b>Teacher</b>
                </div>
            </div>
            <WordLine
                className="isp-tutor-caption"
                text={example.script}
                start={0}
                end={example.duration}
                focus={example.focus}
                audioRef={audioRef}
                playing={playing}
                lang={example.lang}
            />
        </div>
    </div>
);

/* --------------------------------------------------------------- page */

const PageStage = ({ example, audioRef, playing, accent, toggle }) => {
    const scrollerRef = useRef(null);
    const [eyebrow, title, meta] = example.titles;

    return (
        <div className="isp-page-read">
            <span
                className="isp-page-art"
                style={{ backgroundImage: `url(${example.art})` }}
                aria-hidden="true"
            />
            <header className="isp-page-head">
                <em>{eyebrow}</em>
                <h3 lang={example.lang}>{title}</h3>
                <i>{meta}</i>
            </header>
            <div className="isp-page-scroll" ref={scrollerRef}>
                <BlockList
                    blocks={example.blocks}
                    audioRef={audioRef}
                    playing={playing}
                    lang={example.lang}
                    scrollerRef={scrollerRef}
                />
            </div>
            <footer className="isp-page-foot">
                <VoiceOrb
                    audioRef={audioRef}
                    playing={playing}
                    accent={accent}
                    size={44}
                />
                <PlayButton playing={playing} onToggle={toggle} solid />
                <span className="isp-page-foot-note">
                    {example.chips[0]}
                </span>
            </footer>
        </div>
    );
};

const LAYOUTS = {
    line: LineStage,
    chat: ChatStage,
    bulletin: BulletinStage,
    tutor: TutorStage,
    page: PageStage,
};

const ExampleStage = (props) => {
    const Stage = useMemo(() => LAYOUTS[props.example.layout] ?? LineStage, [props.example.layout]);
    return <Stage {...props} />;
};

export default ExampleStage;
