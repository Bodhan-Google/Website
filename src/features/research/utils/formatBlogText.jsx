/**
 * Lightweight inline markup for blog copy: **bold**, *italic*, `code`, and
 * [links](href).
 *
 * There is no HTML in the copy — posts.js stores plain strings, and this is the
 * only thing that turns any of it into elements.
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
                return (
                    <code key={index} className="research-inline-code">
                        {part.slice(1, -1)}
                    </code>
                );
            }

            const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
            if (link) {
                const [, label, href] = link;
                return (
                    <a
                        key={index}
                        href={href}
                        className="research-prose-link"
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
