import Reveal from './Reveal';
import BrandMark from './BrandMark';

/**
 * Step 8 of the house flow: where the model is available.
 *
 * A full-bleed band, so it renders outside the article column. The chips are the same
 * `.research-link-chip` primitive the hero uses, in its on-mosaic variant, since they
 * sit on a tinted ground. Three of the four carry the platform's mark; AIKosh has no
 * reachable logo file and stays a wordmark (see BrandMark.jsx for where each came from).
 */
const EcosystemBanner = ({ heading, links }) => (
  <Reveal>
    <aside className="ecosystem-banner">
      <div className="research-article-wide ecosystem-inner">
        <h2 className="research-type-h2 ecosystem-heading">{heading}</h2>
        <nav aria-label="Where this model is available" className="ecosystem-links">
          {links.map(({ label, href, icon, soon }) =>
            // Same rule as the hero: a platform we are not on yet is an inert chip with a
            // badge, not a link to nowhere.
            (soon ? (
              <span
                key={label}
                className="research-link-chip research-link-chip-on-mosaic ecosystem-chip is-soon"
              >
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
                className="research-link-chip research-link-chip-on-mosaic ecosystem-chip"
              >
                {icon && <BrandMark name={icon} />}
                <span className="chip-label">{label}</span>
              </a>
            )))}
        </nav>
      </div>
    </aside>
  </Reveal>
);

export default EcosystemBanner;
