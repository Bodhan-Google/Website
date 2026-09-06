import { Fragment, forwardRef, useMemo } from 'react';
import { splitBlocks } from './translateUtils';

/**
 * A small renderer for exactly the markup these documents contain — Markdown
 * headings, lists, quotes, pipe tables and fences, plus LaTeX sections,
 * environments and inline maths.
 *
 * It exists rather than a Markdown library because the document demo has to
 * *measure* blocks: every block needs its own DOM node carrying its structural
 * role, so the gutter chips and the geometry morph can be driven from the real
 * rendered layout. A generic renderer would give neither. Maths is set as
 * monospace source rather than typeset — there is no KaTeX on this site, and
 * showing the LaTeX honestly is better than showing it wrongly.
 */

const ESCAPES = [
    [/\\%/g, '%'],
    [/\\&/g, '&'],
    [/\\_/g, '_'],
    [/\\#/g, '#'],
    [/\\\$/g, '$'],
];

const stripTex = (text) => {
    let out = text
        .replace(/\\(?:text|mathrm|mathbf|emph|textbf|textit)\{([^{}]*)\}/g, '$1')
        .replace(/\\(?:label|ref|eqref|cite)\{[^{}]*\}/g, '')
        .replace(/\\\\/g, ' ');
    for (const [pattern, replacement] of ESCAPES) out = out.replace(pattern, replacement);
    return out;
};

/** Inline spans: code, bold, links, images and inline maths. */
const Inline = ({ text }) => {
    const parts = useMemo(() => {
        const pattern =
            /(`[^`]+`)|(\*\*[^*]+\*\*)|(!\[[^\]]*\]\([^)]*\))|(\[[^\]]+\]\([^)]*\))|(<img[^>]*>)|(\$[^$\n]+\$)/g;
        const chunks = [];
        let last = 0;
        let match = pattern.exec(text);
        while (match) {
            if (match.index > last) chunks.push({ kind: 'text', value: text.slice(last, match.index) });
            const token = match[0];
            if (token.startsWith('`')) chunks.push({ kind: 'code', value: token.slice(1, -1) });
            else if (token.startsWith('**')) chunks.push({ kind: 'strong', value: token.slice(2, -2) });
            else if (token.startsWith('![')) {
                chunks.push({ kind: 'image', value: token.slice(2, token.indexOf(']')) });
            } else if (token.startsWith('<img')) {
                const alt = token.match(/alt=['"]([^'"]*)['"]/);
                chunks.push({ kind: 'image', value: alt ? alt[1] : 'image' });
            } else if (token.startsWith('[')) {
                chunks.push({
                    kind: 'link',
                    value: token.slice(1, token.indexOf(']')),
                    href: token.slice(token.indexOf('](') + 2, -1),
                });
            } else chunks.push({ kind: 'math', value: token.slice(1, -1) });
            last = match.index + token.length;
            match = pattern.exec(text);
        }
        if (last < text.length) chunks.push({ kind: 'text', value: text.slice(last) });
        return chunks;
    }, [text]);

    return parts.map((part, index) => {
        const key = `${part.kind}-${index}`;
        if (part.kind === 'code') return <code key={key} className="itr-doc-code">{part.value}</code>;
        if (part.kind === 'strong') return <strong key={key}>{stripTex(part.value)}</strong>;
        if (part.kind === 'math') return <span key={key} className="itr-doc-math">{part.value}</span>;
        if (part.kind === 'image') {
            return (
                <span key={key} className="itr-doc-figure">
                    <span className="itr-doc-figure-mark" aria-hidden="true" />
                    {part.value || 'figure'}
                </span>
            );
        }
        if (part.kind === 'link') {
            return (
                <span key={key} className="itr-doc-link" title={part.href}>
                    {part.value}
                </span>
            );
        }
        return <Fragment key={key}>{stripTex(part.value)}</Fragment>;
    });
};

const Table = ({ body }) => {
    const rows = body
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !/^\|[\s:|-]+\|?$/.test(line))
        .map((line) => line.replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()));

    if (!rows.length) return null;
    const [head, ...rest] = rows;

    return (
        <div className="itr-doc-table-wrap">
            <table className="itr-doc-table">
                <thead>
                    <tr>
                        {head.map((cell, i) => (
                            <th key={i}>
                                <Inline text={cell} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rest.map((row, r) => (
                        <tr key={r}>
                            {row.map((cell, c) => (
                                <td key={c}>
                                    <Inline text={cell} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Block = ({ block }) => {
    const { body, kind } = block;

    if (kind === 'code') {
        const lines = body.split('\n');
        const inner = lines.slice(1, lines.length - (/^\s*(```|~~~)/.test(lines.at(-1) ?? '') ? 1 : 0));
        const langTag = (lines[0].match(/^\s*(?:```+|~~~+)\s*([a-zA-Z0-9+#-]*)/) ?? [])[1];
        return (
            <pre className="itr-doc-fence" data-lang={langTag || undefined}>
                <code>{inner.join('\n')}</code>
            </pre>
        );
    }

    if (kind === 'table' && /^\s*\|/.test(body)) return <Table body={body} />;

    if (kind === 'math' || kind === 'theorem' || (kind === 'table' && /^\s*\\begin/.test(body))) {
        const name = (body.match(/^\s*\\begin\{([a-zA-Z]+\*?)\}(?:\[([^\]]*)\])?/) ?? [])[1];
        const caption = (body.match(/^\s*\\begin\{[a-zA-Z]+\*?\}\[([^\]]*)\]/) ?? [])[1];
        const inner = body
            .replace(/^\s*\\begin\{[a-zA-Z]+\*?\}(\[[^\]]*\])?/, '')
            .replace(/\\end\{[a-zA-Z]+\*?\}\s*$/, '')
            .trim();
        return (
            <div className="itr-doc-env" data-env={name}>
                <span className="itr-doc-env-tag">{caption || name}</span>
                <span className="itr-doc-env-body">{stripTex(inner)}</span>
            </div>
        );
    }

    if (kind === 'heading') {
        const firstLine = body.split('\n', 1)[0].trim();
        const md = firstLine.match(/^(#{1,6})\s+(.*)$/);
        if (md) {
            const Tag = `h${Math.min(4, md[1].length + 1)}`;
            return (
                <Tag className="itr-doc-h" data-level={md[1].length}>
                    <Inline text={md[2]} />
                </Tag>
            );
        }
        const tex = firstLine.match(/^\\((?:sub)*section|chapter|part|paragraph)\*?\{([^}]*)\}/);
        const depth = tex ? (tex[1].match(/sub/g) ?? []).length + 1 : 1;
        return (
            <h3 className="itr-doc-h" data-level={depth}>
                <Inline text={tex ? tex[2] : firstLine} />
            </h3>
        );
    }

    if (kind === 'list') {
        const lines = body.split('\n');
        // A list block often opens with a lead-in line before the bullets.
        const leadIn = [];
        while (lines.length && !/^\s*([-*+]\s|\d+[.)]\s|\\item)/.test(lines[0])) leadIn.push(lines.shift());
        const items = [];
        for (const line of lines) {
            const bullet = line.match(/^\s*(?:[-*+]|\d+[.)]|\\item)\s*(.*)$/);
            if (bullet) items.push(bullet[1]);
            else if (items.length) items[items.length - 1] += ` ${line.trim()}`;
        }
        const ordered = /^\s*\d+[.)]/.test(body.split('\n').find((l) => /^\s*(\d+[.)]|[-*+])\s/.test(l)) ?? '');
        const List = ordered ? 'ol' : 'ul';
        return (
            <>
                {leadIn.length ? (
                    <p className="itr-doc-p">
                        <Inline text={leadIn.join(' ')} />
                    </p>
                ) : null}
                <List className="itr-doc-list">
                    {items.map((item, i) => (
                        <li key={i}>
                            <Inline text={stripTex(item)} />
                        </li>
                    ))}
                </List>
            </>
        );
    }

    if (kind === 'quote') {
        return (
            <blockquote className="itr-doc-quote">
                <Inline text={body.replace(/^>\s?/gm, '')} />
            </blockquote>
        );
    }

    if (kind === 'figure') {
        return (
            <p className="itr-doc-p">
                <Inline text={body} />
            </p>
        );
    }

    return (
        <p className="itr-doc-p">
            <Inline text={body} />
        </p>
    );
};

/**
 * The rendered document. `blockClass` and the data attributes are what the
 * animation measures, so every block is one addressable node.
 */
const DocBlocks = forwardRef(({ text, lang, rtl, view = 'rendered', blockClass = 'itr-block' }, ref) => {
    const blocks = useMemo(() => splitBlocks(text), [text]);

    return (
        <div
            className={`itr-doc${view === 'markup' ? ' is-markup' : ''}`}
            lang={lang}
            dir={rtl ? 'rtl' : undefined}
            ref={ref}
        >
            {blocks.map((block, index) => (
                <div
                    key={index}
                    className={blockClass}
                    data-kind={block.kind}
                    data-index={index}
                >
                    {view === 'markup' ? (
                        <pre className="itr-doc-raw">{block.body}</pre>
                    ) : (
                        <Block block={block} />
                    )}
                </div>
            ))}
        </div>
    );
});

DocBlocks.displayName = 'DocBlocks';

export default DocBlocks;
