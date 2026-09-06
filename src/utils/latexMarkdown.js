// The translate documents carry real LaTeX — `\begin{equation}` blocks, `\[…\]`
// display math, `\label`/`\ref` cross-references. remark-math only understands
// `$` delimiters, so this rewrites the rest into `$$…$$` and turns the
// cross-references into the equation numbers they resolve to. Fenced code is
// left strictly alone.

const EQUATION = /\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g;
const BRACKET = /\\\[([\s\S]*?)\\\]/g;
const LABEL = /\\label\{([^}]*)\}/g;
const REF = /\\(?:eq)?ref\{([^}]*)\}/g;

const convert = (chunk, numbers) => {
    let out = chunk.replace(EQUATION, (_, body) => {
        let inner = body;
        const label = LABEL.exec(inner);
        LABEL.lastIndex = 0;

        inner = inner.replace(LABEL, '').trim();

        const n = numbers.size + 1;
        if (label) numbers.set(label[1], n);

        return `\n\n$$\n${inner}\n\\tag{${n}}\n$$\n\n`;
    });

    out = out.replace(BRACKET, (_, body) => `\n\n$$\n${body.trim()}\n$$\n\n`);
    return out;
};

export const latexToMarkdown = (text) => {
    if (!text || (!text.includes('\\begin{equation') && !text.includes('\\[') && !text.includes('\\ref'))) {
        return text;
    }

    const numbers = new Map();

    // Split on fences so nothing inside a code block is touched.
    const parts = text.split(/(```[\s\S]*?```)/g);
    const converted = parts
        .map((part) => (part.startsWith('```') ? part : convert(part, numbers)))
        .join('');

    // Resolve references once every label has a number.
    return converted
        .split(/(```[\s\S]*?```)/g)
        .map((part) =>
            part.startsWith('```')
                ? part
                : part.replace(REF, (whole, key) => (numbers.has(key) ? String(numbers.get(key)) : whole))
        )
        .join('');
};

export default latexToMarkdown;
