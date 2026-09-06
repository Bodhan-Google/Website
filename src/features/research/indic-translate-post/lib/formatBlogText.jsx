/**
 * Lightweight inline markup for blog copy.
 *
 * The template's version handled **bold** and *italic* only. This post's prose also
 * carries inline code (`google/gemma-4-E4B-it`) and inline links, so both are added
 * here. Everything else is still plain text -- there is no HTML in the copy.
 */
const PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export const formatBlogText = (text) => {
  if (!text) return null;

  return text
    .split(PATTERN)
    .filter((part) => part.length > 0)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="research-type-emphasis">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index}>{part.slice(1, -1)}</code>;
      }

      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
      if (link) {
        const [, label, href] = link;
        return (
          <a
            key={index}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {label}
          </a>
        );
      }

      // Checked after bold so `**x**` is not mistaken for an italic run.
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="research-type-italic">
            {part.slice(1, -1)}
          </em>
        );
      }

      return part;
    });
};
