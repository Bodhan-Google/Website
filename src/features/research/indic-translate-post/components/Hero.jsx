// Variant B of the hero motif: translation pairs as type on concentric elliptical
// orbits. Chosen over the chip scatter because the link chips and the spec strip are
// already tinted pills, so a field of pills put three layers of the same shape in one
// hero; bare type frames the title instead of competing with it.
//
// GlyphScatter.jsx (variant A) and GlyphField.jsx (the 18x10 grid before it) are both
// left in the tree unused, so either earlier field stays reproducible for comparison.
import GlyphOrbit from './GlyphOrbit';
import BrandMark from './BrandMark';

// "Indic-Translate" is one word to the line-breaker but two halves to the eye, and the
// model-name half takes the house orange. Splitting on the accent substring rather than
// on the hyphen leaves the hyphen and the colon in the body ink, where they belong.
const accented = (word, accent) => {
  if (!accent) return word;
  const at = word.indexOf(accent);
  if (at === -1) return word;
  return (
    <>
      {word.slice(0, at)}
      <span className="title-accent">{accent}</span>
      {word.slice(at + accent.length)}
    </>
  );
};

// The article hero. Structure follows the template's BlogPostPage -- eyebrow, then
// a card carrying the title and the link chips -- with the glyph field and scrim
// behind the type. The spec strip is ours: the template's post schema defines
// `specs` but its article page never renders them.
const Hero = ({ post }) => (
  <header className="hero">
    <div className="research-article-column hero-inner">
      <p className="research-type-eyebrow hero-eyebrow">
        <span>{post.category}</span>
        <span className="sep" aria-hidden="true">·</span>
        <span className="date">{post.dateLabel}</span>
      </p>

      <div className="hero-card">
        <GlyphOrbit />
        <div className="hero-scrim" aria-hidden="true" />

        {post.partners?.length > 0 && (
          <div className="hero-partners">
            {post.partners.map(({ name, icon }, i) => (
              <span key={name} className="hero-partner-group">
                {i > 0 && <span className="hero-x" aria-hidden="true">×</span>}
                <span className="hero-partner">
                  <BrandMark name={icon} />
                  {name}
                </span>
              </span>
            ))}
          </div>
        )}

        <h1 className="research-type-title">
          <span className="title-name">
            {post.title.split(' ').map((word, i) => (
              <span
                key={i}
                className="w reveal in-view"
                style={{ transitionDelay: `${180 + i * 30}ms` }}
              >
                {accented(word, post.titleAccent)}
                {i < post.title.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>

          {post.titleTagline && (
            <span className="title-tagline">
              {post.titleTagline.split(' ').map((word, i, all) => (
                <span
                  key={i}
                  className="w reveal in-view"
                  // The stagger continues from the name rather than restarting, so the
                  // two lines read as one sweep instead of two.
                  style={{ transitionDelay: `${180 + (i + 2) * 30}ms` }}
                >
                  {word}
                  {i < all.length - 1 ? ' ' : ''}
                </span>
              ))}
            </span>
          )}
        </h1>

        {post.heroLinks?.length > 0 && (
          <nav aria-label="Publication links" className="hero-links">
            {post.heroLinks.map(({ label, href, icon, soon }) =>
              // A `soon` chip is not a link: its destination is private, so an anchor would
              // send the reader to a 404. Rendered as a span it keeps the chip's shape while
              // being honestly inert, and screen readers are told the same thing the badge says.
              (soon ? (
                <span key={label} className="research-link-chip is-soon">
                  {icon && <BrandMark name={icon} />}
                  <span className="chip-label">{label}</span>
                  <span className="chip-soon">coming soon</span>
                </span>
              ) : (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  // "Try it out" is the row's one call to action; `chip-try` is what
                  // lights its bolt with the label on hover.
                  className={`research-link-chip${icon === 'bolt' ? ' chip-try' : ''}`}
                >
                  {icon && <BrandMark name={icon} />}
                  {/* The underline sits on the label, not the anchor: an inline-flex
                      anchor draws its underline straight through the mark. */}
                  <span className="chip-label">{label}</span>
                </a>
              )))}
          </nav>
        )}

        {post.specs?.length > 0 && (
          <div className="spec-strip">
            {post.specs.map(({ label, value }) => (
              <div key={label} className="spec-chip">
                <span className="v">{value}</span>
                <span className="k">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </header>
);

export default Hero;
