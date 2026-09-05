import { useId } from 'react';

/**
 * Section 8 — where the model can actually be used.
 *
 * Entries: { name, href?, note?, logo?, accent? }. Without an `href` the
 * platform still renders, greyed of its link affordance, so a team can list a
 * pending deployment without inventing a URL.
 */
const EcosystemBanner = ({
    title = "Available across India's AI ecosystem",
    description,
    platforms = [],
}) => {
    const patternId = useId();

    if (!platforms.length) return null;

    return (
        <div className="bt-eco">
            <svg className="bt-eco-pattern" width="100%" height="100%" aria-hidden="true">
                <defs>
                    <pattern id={patternId} width="28" height="28" patternUnits="userSpaceOnUse">
                        <circle cx="3" cy="3" r="1.3" fill="currentColor" />
                        <path
                            d="M3 14 Q14 3 25 14 Q14 25 3 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.9"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>

            <div className="bt-eco-inner">
                <h3 className="bt-eco-title">{title}</h3>
                {description && <p className="bt-eco-sub">{description}</p>}

                <div className="bt-eco-grid">
                    {platforms.map((platform) => {
                        const style = platform.accent ? { '--bt-accent': platform.accent } : undefined;

                        const body = (
                            <>
                                <span className="bt-eco-mark" aria-hidden="true">
                                    {platform.logo ? (
                                        <img src={platform.logo} alt="" />
                                    ) : (
                                        platform.name.charAt(0)
                                    )}
                                </span>
                                <span>
                                    <span className="bt-eco-name">{platform.name}</span>
                                    {platform.note && (
                                        <>
                                            <br />
                                            <span className="bt-eco-note">{platform.note}</span>
                                        </>
                                    )}
                                </span>
                            </>
                        );

                        return platform.href ? (
                            <a
                                key={platform.name}
                                href={platform.href}
                                target={platform.href.startsWith('http') ? '_blank' : undefined}
                                rel={platform.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="bt-eco-card no-ext-arrow"
                                style={style}
                            >
                                {body}
                            </a>
                        ) : (
                            <span key={platform.name} className="bt-eco-card" style={style}>
                                {body}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EcosystemBanner;
