import { ACCENTS, CAPABILITIES, OVERVIEW, VOICE_ROLES } from './speakData';

// The "what it is" section: three paragraphs, the spec sheet, and the film's
// tile mosaic standing in for a feature list.

const SpeakOverview = () => (
    <section className="isp-overview" id="overview">
        <div className="isp-container">
            <div className="isp-overview-grid">
                <div>
                    <p className="isp-eyebrow isp-fade">{OVERVIEW.kicker}</p>
                    <h2 className="isp-title isp-fade">{OVERVIEW.title}</h2>
                    <div className="isp-prose">
                        {OVERVIEW.body.map((paragraph) => (
                            <p key={paragraph.slice(0, 24)} className="isp-fade">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className="isp-roles isp-fade">
                        {VOICE_ROLES.map((role) => (
                            <span key={role} className="isp-role">
                                {role}
                            </span>
                        ))}
                    </div>
                </div>

                <dl className="isp-specs isp-fade">
                    {OVERVIEW.specs.map((spec) => (
                        <div key={spec.label} className="isp-spec">
                            <dt>{spec.label}</dt>
                            <dd>{spec.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className="isp-mosaic">
                {CAPABILITIES.map((tile) => (
                    <article
                        key={tile.id}
                        className="isp-tile"
                        data-span={tile.span}
                        style={{ '--isp-accent': ACCENTS[tile.tone] }}
                    >
                        <span className="isp-tile-glyph" aria-hidden="true">
                            {tile.glyph}
                        </span>
                        <h3>{tile.title}</h3>
                        <p>{tile.detail}</p>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

export default SpeakOverview;
