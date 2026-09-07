import BlogChart from './charts/BlogChart';
import ExamplesBrowser from './ExamplesBrowser';
import LanguageConstellation from './LanguageConstellation';
import Reveal from './Reveal';
import ResultsTiles from './ResultsTiles';
import { formatBlogText } from '../lib/formatBlogText';
import { resolveChart } from '../data/charts';

// Custom widgets are dispatched on an explicit `section.component` key. The template
// does the same job by matching hardcoded content strings -- `section.id ===
// 'model-card'`, `sub.title === 'Three Output Modes'` -- which silently couples the
// layout to the copy, so an editor rewording a heading loses the widget.
//
// `features` states the capabilities as cards and then demonstrates them: the card grid
// is rendered from the section's `subsections`, and the widget supplies the examples
// underneath.
const COMPONENTS = {
  coverage: LanguageConstellation,
  features: ExamplesBrowser,
  results: ResultsTiles,
};

export const renderCharts = (refs) => {
  if (!refs?.length) return null;
  return refs.map((ref) => {
    const chart = resolveChart(ref);
    if (!chart) return null;
    return (
      <Reveal key={chart.id ?? ref}>
        <BlogChart chart={chart} />
      </Reveal>
    );
  });
};

const CapabilityCards = ({ items }) => (
  <div className="research-feature-grid">
    {items.map((sub, i) => (
      <Reveal key={sub.title} delay={i * 80}>
        <article className="research-feature-card">
          <p className="research-feature-index">{sub.tag ?? String(i + 1).padStart(2, '0')}</p>
          <h3 className="research-feature-title">{sub.title}</h3>
          {sub.content && <p className="research-feature-body">{formatBlogText(sub.content)}</p>}
        </article>
      </Reveal>
    ))}
  </div>
);


const Bullets = ({ items }) => (
  <div className="research-bullet-block">
    <ul className="research-bullet-list">
      {items.map((item, i) => (
        <li key={i} className="research-bullet-item">
          <span className="research-bullet-marker" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="research-bullet-text">{formatBlogText(item)}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SectionBlocks = ({ sections }) => {
  // Badges number the headed sections only; the opening section deliberately has no
  // heading, so it takes no number and no table-of-contents entry.
  const headed = sections.filter((s) => s.title);

  return (
    <div className="research-prose">
      {sections.map((section) => {
        const Custom = section.component ? COMPONENTS[section.component] : null;
        const number = section.title
          ? String(headed.indexOf(section) + 1).padStart(2, '0')
          : null;

        return (
          <Reveal key={section.id}>
            <section
              id={section.id}
              className={section.title ? undefined : 'section-opening'}
              style={{ scrollMarginTop: '7rem', marginBottom: '3.5rem' }}
            >
              {section.title && (
                <header className="research-section-header">
                  <div className="research-section-rule" aria-hidden="true" />
                  <h2 className="research-type-h2">
                    <span className="section-num">{number}</span> {section.title}
                  </h2>
                </header>
              )}

              {section.temporary && (
                <p className="temp-copy">
                  <span className="temp-badge">temporary copy</span>
                  Pending a final pass; not the published wording.
                </p>
              )}

              {section.content?.map((paragraph, i) => (
                <p
                  key={i}
                  className={i === 0 ? 'research-type-lead' : 'research-type-body'}
                  style={{ marginBottom: '1rem' }}
                >
                  {formatBlogText(paragraph)}
                </p>
              ))}

              {/* A custom widget owns everything below the intro, including any
                  subsections, so the generic renderers below are skipped for it. */}
              {Custom ? (
                <>
                  {/* Features first, examples second: state the capability, then show it. */}
                  {section.subsections && <CapabilityCards items={section.subsections} />}
                  <Custom section={section} />
                </>
              ) : (
                <>
                  {section.subsections?.map((sub) => (
                    <div key={sub.title} className="research-subsection">
                      <h3 className="research-type-h3" style={{ marginBottom: '0.5rem' }}>
                        {sub.title}
                      </h3>
                      {sub.paragraphs?.map((p, i) => (
                        <p key={i} className="research-type-body" style={{ marginBottom: '1rem' }}>
                          {formatBlogText(p)}
                        </p>
                      ))}
                      {renderCharts(sub.charts)}
                    </div>
                  ))}

                  {renderCharts(section.charts)}
                  {section.bullets && <Bullets items={section.bullets} />}
                </>
              )}

              {section.subnote && (
                <p className="cap-subnote">{formatBlogText(section.subnote)}</p>
              )}
            </section>
          </Reveal>
        );
      })}
    </div>
  );
};

export default SectionBlocks;
