import { useEffect, useState } from 'react';

// Ported from the Bodhan website's research blog. Behaviour is unchanged -- the same
// IntersectionObserver margins and the same two presentations, a hover-expanding rail
// on wide screens and a pill row below -- but the Tailwind utility classes are replaced
// by named classes in styles.css, since this app does not run Tailwind.
const TableOfContents = ({ sections }) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const observers = [];

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [sections]);

  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <>
      {/* Wide hover target so the rail opens before the cursor reaches the ticks. */}
      <div
        className="toc-hover-zone"
        onMouseEnter={() => setExpanded(true)}
        aria-hidden="true"
      />

      <nav
        aria-label="Table of contents"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`toc-rail${expanded ? ' is-expanded' : ''}`}
      >
        <ul>
          {sections.map(({ id, title }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleClick(id)}
                className={`toc-tick${activeId === id ? ' is-active' : ''}`}
                aria-current={activeId === id ? 'true' : undefined}
              >
                <span className="toc-tick-mark" aria-hidden="true" />
                <span className="toc-tick-label">{title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-label="Table of contents" className="toc-pills">
        <p className="type-eyebrow toc-pills-title">On this page</p>
        <ul>
          {sections.map(({ id, title }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleClick(id)}
                className={`toc-pill${activeId === id ? ' is-active' : ''}`}
                aria-current={activeId === id ? 'true' : undefined}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default TableOfContents;
