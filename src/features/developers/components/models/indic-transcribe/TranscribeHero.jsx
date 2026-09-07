import { AudioLines, Mic } from 'lucide-react';
import BodhanLogo from '../../../../../assets/Icon.png';
import Ai4bLogo from '../../../../../assets/ai4b-logo.avif';
import { HERO_STATS, LANGUAGE_FIELD } from './transcribeData';

// The hero's waveform silhouette. Heights are fixed so the shape is composed
// rather than random; GSAP gives it its breath.
const BAR_COUNT = 56;
const BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
    const t = i / (BAR_COUNT - 1);
    const envelope = Math.sin(t * Math.PI) ** 0.7;
    const detail = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.9) * Math.cos(i * 0.7));
    return Math.max(0.08, envelope * detail);
});

const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const TranscribeHero = () => (
    <section className="itx-hero" id="model">
        <div className="itx-field" aria-hidden="true">
            {LANGUAGE_FIELD.map((word) => (
                <span
                    key={word.text}
                    className="itx-field-word"
                    data-tone={word.tone}
                    style={{ left: word.left, right: word.right, top: word.top, fontSize: word.size }}
                >
                    {word.text}
                </span>
            ))}
        </div>

        <div className="itx-container itx-hero-inner">
            <div className="itx-collab itx-hero-reveal">
                <img src={BodhanLogo} alt="Bodhan.AI" className="itx-collab-logo" />
                <span aria-hidden="true">×</span>
                <img src={Ai4bLogo} alt="AI4Bharat" className="itx-collab-logo itx-collab-logo-wide" />
            </div>

            <p className="itx-eyebrow itx-hero-reveal">Developers · Speech recognition</p>

            <h1 className="itx-hero-title itx-hero-reveal">
                Indic-<span className="itx-grad">Transcribe</span>
            </h1>

            <p className="itx-hero-tagline itx-hero-reveal">Speech, written the way it was spoken.</p>

            <p className="itx-hero-copy itx-hero-reveal">
                Multilingual speech recognition for 27 Indian languages and English — code-mixed conversation, noisy
                rooms, recited verse and song. Every utterance comes back in native script, mixed script and
                romanised form.
            </p>

            <div className="itx-hero-actions itx-hero-reveal">
                <button type="button" className="itx-btn itx-btn-primary" onClick={() => scrollTo('#demo')}>
                    <Mic size={15} aria-hidden="true" />
                    Try the microphone
                </button>
                <button type="button" className="itx-btn itx-btn-ghost" onClick={() => scrollTo('#code-mixed')}>
                    <AudioLines size={15} aria-hidden="true" />
                    Hear code-mixing
                </button>
            </div>

            <dl className="itx-stats itx-hero-reveal">
                {HERO_STATS.map((stat) => (
                    <div key={stat.label} className="itx-stat">
                        <dt>
                            <span
                                className="itx-count"
                                data-target={stat.value}
                                data-decimals={stat.decimals ?? 0}
                            >
                                {stat.value}
                            </span>
                            <span className="itx-count-suffix">{stat.suffix}</span>
                        </dt>
                        <dd>{stat.label}</dd>
                    </div>
                ))}
            </dl>
        </div>

        {/* The waveform sits under the content and runs the full width — the
            page's subject matter used as its own ornament. */}
        <div className="itx-hero-wave" aria-hidden="true">
            {BARS.map((height, index) => (
                <span key={index} className="itx-hero-bar" style={{ '--h': height }} />
            ))}
        </div>
    </section>
);

export default TranscribeHero;
