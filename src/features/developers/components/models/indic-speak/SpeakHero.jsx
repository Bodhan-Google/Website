import { Pause, Play, Sparkles } from 'lucide-react';
import BodhanLogo from '../../../../../assets/Icon.png';
import Ai4bLogo from '../../../../../assets/ai4b-logo.avif';
import { HERO, HERO_STATS } from './speakData';
import { LANGUAGE_BURST } from './speakScripts';
import { useClipPlayer } from './useSpeakAudio';
import { WordLine } from './Karaoke';
import VoiceOrb from './VoiceOrb';

// The 23 language names sit on an ellipse behind the headline at 14% opacity —
// a texture, not a list. The readable version of the same set is the burst
// further down the page.
const RING = LANGUAGE_BURST.map((entry, index) => {
    const angle = ((index / LANGUAGE_BURST.length) * 360 - 78) * (Math.PI / 180);
    const rx = 44 + (index % 3) * 4;
    const ry = 37 + (index % 2) * 6;
    return {
        ...entry,
        left: `${50 + rx * Math.cos(angle)}%`,
        top: `${50 + ry * Math.sin(angle)}%`,
        size: `${[1.9, 1.1, 1.45, 0.95][index % 4]}rem`,
    };
});

const scrollTo = (id) =>
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const SpeakHero = () => {
    const { audioRef, playing, toggle } = useClipPlayer(HERO.hook.audio);

    return (
        <section className="isp-hero isp-tinted" id="model">
            <div className="isp-lang-ring" aria-hidden="true">
                {RING.map((entry) => (
                    <span
                        key={entry.name}
                        className="isp-ring-word"
                        data-script={entry.script}
                        style={{ left: entry.left, top: entry.top, fontSize: entry.size }}
                    >
                        {entry.name}
                    </span>
                ))}
            </div>

            <div className="isp-container isp-hero-inner">
                <div className="isp-collab isp-reveal">
                    <img src={BodhanLogo} alt="Bodhan.AI" className="isp-collab-bodhan" />
                    <span aria-hidden="true">×</span>
                    <img src={Ai4bLogo} alt="AI4Bharat" />
                </div>

                <p className="isp-eyebrow isp-reveal">{HERO.eyebrow}</p>

                <h1 className="isp-wordmark isp-reveal">
                    <span>{HERO.wordmark}</span>
                    <i className="isp-shine" aria-hidden="true" />
                </h1>

                <p className="isp-hero-tagline isp-reveal">{HERO.tagline}</p>
                <p className="isp-hero-desc isp-reveal">{HERO.description}</p>

                <div className="isp-hero-actions isp-reveal">
                    <button
                        type="button"
                        className="isp-btn isp-btn-primary"
                        onClick={() => scrollTo('#demo')}
                    >
                        <Sparkles size={15} aria-hidden="true" />
                        Try a script
                    </button>
                    <button
                        type="button"
                        className="isp-btn isp-btn-ghost"
                        onClick={() => scrollTo('#examples')}
                    >
                        Hear all six styles
                    </button>
                </div>

                <div className="isp-hook isp-reveal">
                    <VoiceOrb
                        audioRef={audioRef}
                        playing={playing}
                        accent="#E0620D"
                        size={78}
                        label="Voice waveform"
                    />
                    <div className="isp-hook-body">
                        <p className="isp-hook-meta">{HERO.hook.caption}</p>
                        <WordLine
                            text={HERO.hook.script}
                            start={0}
                            end={HERO.hook.duration}
                            audioRef={audioRef}
                            playing={playing}
                            lang={HERO.hook.lang}
                        />
                    </div>
                    <button
                        type="button"
                        className="isp-icon-btn isp-hero-play"
                        onClick={toggle}
                        aria-label={playing ? 'Pause the clip' : 'Play the clip'}
                    >
                        {playing ? (
                            <Pause size={16} aria-hidden="true" />
                        ) : (
                            <Play size={16} aria-hidden="true" />
                        )}
                    </button>
                    <audio ref={audioRef} src={HERO.hook.audio} preload="none" />
                </div>

                <div className="isp-stats isp-reveal">
                    {HERO_STATS.map((stat) => (
                        <div key={stat.label} className="isp-stat">
                            <b data-count={stat.value} data-suffix={stat.suffix ?? ''}>
                                {stat.value}
                                {stat.suffix ?? ''}
                            </b>
                            <em>{stat.label}</em>
                            <i>{stat.hint}</i>
                        </div>
                    ))}
                </div>

                <div className="isp-tricolor isp-reveal" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                </div>
            </div>
        </section>
    );
};

export default SpeakHero;
