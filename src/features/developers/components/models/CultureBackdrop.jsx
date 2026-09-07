import { useId } from 'react';

// Abstract geometric motifs, drawn as repeating SVG patterns. Each is stroked in
// `currentColor` so the theme's accent drives it, at low opacity — background
// texture, not illustration.
const MOTIFS = {
    // Tamil kolam: dot grid with looping curves
    kolam: (
        <>
            <circle cx="4" cy="4" r="1.4" fill="currentColor" />
            <circle cx="28" cy="28" r="1.4" fill="currentColor" />
            <path d="M4 16 Q16 4 28 16 Q16 28 4 16" fill="none" stroke="currentColor" strokeWidth="1" />
        </>
    ),
    // Lotus rosette
    lotus: (
        <>
            <path d="M16 6 Q20 14 16 22 Q12 14 16 6" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M6 16 Q14 20 22 16 Q14 12 6 16" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="16" cy="16" r="2" fill="none" stroke="currentColor" strokeWidth="1" />
        </>
    ),
    // Paisley / buta
    paisley: (
        <path
            d="M10 26 Q4 18 10 10 Q16 3 22 9 Q26 14 20 17 Q15 19 16 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
        />
    ),
    // Hoysala stellate star
    star: (
        <path
            d="M16 4 L19 12 L27 12 L21 17 L24 25 L16 20 L8 25 L11 17 L5 12 L13 12 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
        />
    ),
    // Kalamkari vine
    vine: (
        <>
            <path d="M2 30 Q10 20 8 10 Q6 2 16 2" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M8 14 Q14 12 15 6" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="16" cy="2" r="1.6" fill="currentColor" />
        </>
    ),
    // Madhubani fish-and-leaf line art
    madhubani: (
        <>
            <path d="M4 16 Q12 8 22 16 Q12 24 4 16 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M22 16 L28 11 L28 21 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="10" cy="14" r="1" fill="currentColor" />
        </>
    ),
    // Sohrai wall-art chevrons
    sohrai: (
        <>
            <path d="M0 10 L8 2 L16 10 L24 2 L32 10" fill="none" stroke="currentColor" strokeWidth="1.1" />
            <path d="M0 24 L8 16 L16 24 L24 16 L32 24" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </>
    ),
    // Warli stick figures
    warli: (
        <>
            <circle cx="8" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="0.9" />
            <path d="M8 9 L4 17 M8 9 L12 17 M4 11.5 L12 11.5" fill="none" stroke="currentColor" strokeWidth="0.9" />
            <path d="M20 24 L24 15 L28 24 Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
        </>
    ),
    // Alpona scallop and dots
    alpona: (
        <>
            <path d="M0 16 Q8 8 16 16 Q24 24 32 16" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="8" cy="5" r="1.2" fill="currentColor" />
            <circle cx="24" cy="27" r="1.2" fill="currentColor" />
        </>
    ),
    // Jaali lattice
    jaali: (
        <>
            <path d="M16 2 L26 12 L16 22 L6 12 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M0 28 L6 22 M26 22 L32 28" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </>
    ),
    // Phulkari darning-stitch diamonds
    phulkari: (
        <>
            <path d="M16 4 L24 16 L16 28 L8 16 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <path d="M16 11 L20 16 L16 21 L12 16 Z" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </>
    ),
    // Neutral grid
    grid: (
        <>
            <path d="M0 16 H32 M16 0 V32" fill="none" stroke="currentColor" strokeWidth="0.7" />
        </>
    ),
};

const CultureBackdrop = ({ theme }) => {
    const patternId = useId();
    const motif = MOTIFS[theme.motif] ?? MOTIFS.grid;

    return (
        <div
            className="culture-backdrop"
            key={theme.id}
            style={{
                '--culture-accent': theme.accent,
                '--culture-from': theme.tintFrom,
                '--culture-to': theme.tintTo,
            }}
            aria-hidden="true"
        >
            <div className="culture-tint" />

            <svg className="culture-pattern" width="100%" height="100%">
                <defs>
                    <pattern id={patternId} width="32" height="32" patternUnits="userSpaceOnUse">
                        {motif}
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>

            <div className="culture-glyphs">
                {theme.glyphs.map((glyph, index) => (
                    <span key={`${glyph}-${index}`} className={`culture-glyph culture-glyph-${index + 1}`}>
                        {glyph}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default CultureBackdrop;

// The scene, shown at full strength as a banner with content below — so the
// image can carry real detail without ever sitting under body text.
// `scene` takes any URL: the bundled SVG, or a photograph dropped into
// public/examples/culture/. `credit` is required for licensed photography
// (CC-BY and most stock licences oblige attribution) and renders as a caption.
export const CultureBanner = ({ theme }) => {
    if (!theme.scene) return null;

    return (
        <figure className="culture-banner" key={theme.id}>
            <img src={theme.scene} alt={theme.sceneAlt ?? ''} loading="lazy" />
            <span className="culture-banner-label" style={{ '--culture-accent': theme.accent }}>
                {theme.region}
            </span>
            {theme.credit && <figcaption className="culture-banner-credit">{theme.credit}</figcaption>}
        </figure>
    );
};
