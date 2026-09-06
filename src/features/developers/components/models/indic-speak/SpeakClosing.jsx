import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { CLOSING } from './speakData';

const SpeakClosing = () => (
    <section className="isp-closing isp-tinted" id="availability">
        <div className="isp-container isp-head-center">
            <p className="isp-eyebrow isp-fade">{CLOSING.kicker}</p>
            <h2 className="isp-title isp-fade">{CLOSING.title}</h2>
            <p className="isp-blurb isp-fade">{CLOSING.blurb}</p>

            <div className="isp-platforms">
                {CLOSING.platforms.map((platform) => (
                    <span key={platform} className="isp-platform isp-fade">
                        {platform}
                    </span>
                ))}
            </div>

            <div className="isp-closing-actions isp-fade">
                <a
                    className="isp-btn isp-btn-primary"
                    href="https://huggingface.co/bodhan-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Hugging Face
                    <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <Link className="isp-btn isp-btn-ghost" to="/contact">
                    Talk to us about access
                </Link>
                <Link className="isp-btn isp-btn-ghost" to="/developers">
                    <ArrowLeft size={15} aria-hidden="true" />
                    All models
                </Link>
            </div>

            <p className="isp-note isp-fade">{CLOSING.note}</p>
        </div>
    </section>
);

export default SpeakClosing;
