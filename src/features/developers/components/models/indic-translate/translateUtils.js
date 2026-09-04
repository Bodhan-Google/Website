// Text primitives the demo animations are built on: word tokens, script
// detection, and a structure-aware block split.

const SCRIPT_RANGES = [
    ['devanagari', 0x0900, 0x097f],
    ['bengali', 0x0980, 0x09ff],
    ['gurmukhi', 0x0a00, 0x0a7f],
    ['gujarati', 0x0a80, 0x0aff],
    ['odia', 0x0b00, 0x0b7f],
    ['tamil', 0x0b80, 0x0bff],
    ['telugu', 0x0c00, 0x0c7f],
    ['kannada', 0x0c80, 0x0cff],
    ['malayalam', 0x0d00, 0x0d7f],
    ['olchiki', 0x1c50, 0x1c7f],
    ['arabic', 0x0600, 0x06ff],
    ['arabic', 0x0750, 0x077f],
    ['arabic', 0xfb50, 0xfdff],
    ['arabic', 0xfe70, 0xfeff],
    ['meetei', 0xabc0, 0xabff],
    ['meetei', 0xaae0, 0xaaff],
];

/** Which Indic script a string is written in, or null for Latin/neutral text. */
export function scriptOf(text) {
    for (const char of String(text)) {
        const cp = char.codePointAt(0);
        for (const [name, lo, hi] of SCRIPT_RANGES) {
            if (cp >= lo && cp <= hi) return name;
        }
    }
    return null;
}

/** True when the string carries any Indic (non-Latin) letter. */
export const isIndic = (text) => scriptOf(text) !== null;

/**
 * Word tokens, whitespace discarded. Punctuation stays attached to its word so
 * a flying token looks like something a reader would recognise as a word.
 */
export function tokenize(text) {
    return String(text ?? '')
        .split(/\s+/)
        .filter(Boolean);
}

/** The first grapheme of a token — what a flying particle carries. */
export function leadGlyph(token) {
    return String(token ?? '').slice(0, 1);
}

/**
 * Which structural role a block plays. Used for the gutter chips in the
 * document demo, and it is the whole point of that section: the label a block
 * gets on the way in is the label it still has on the way out.
 */
const BULLET = /^\s*(?:[-*+]\s|\d+[.)]\s|\\item\b)/;
const HEADING = /^\s*(?:#{1,6}\s|\\(?:sub)*section\*?\{|\\(?:chapter|part|paragraph)\*?\{)/;

export function blockKind(text) {
    const lines = text.split('\n');
    const first = lines[0].trim();
    if (/^(```|~~~)/.test(first)) return 'code';
    if (/^\|/.test(first)) return 'table';
    if (/^#{1,6}\s/.test(first)) return 'heading';
    if (/^\\(sub)*section\*?\{/.test(first) || /^\\(chapter|part|paragraph)\*?\{/.test(first)) return 'heading';
    if (/^\\begin\{(equation|align|gather|multline|displaymath)/.test(first)) return 'math';
    if (/^\\begin\{(theorem|lemma|proof|definition|corollary)/.test(first)) return 'theorem';
    if (/^\\begin\{(table|tabular|figure)/.test(first)) return 'table';
    if (/^\\begin\{(itemize|enumerate)/.test(first)) return 'list';
    if (/^>\s?/.test(first)) return 'quote';
    if (/^(!\[|<img)/.test(first)) return 'figure';
    if (/^\$\$/.test(first)) return 'math';
    // A lead-in line followed by bullets is still a list — checking only the
    // first line labelled these blocks 'para' and rendered the bullets as
    // run-on prose.
    if (lines.some((line) => BULLET.test(line))) return 'list';
    return 'para';
}

export const KIND_LABEL = {
    heading: 'Heading',
    para: 'Paragraph',
    list: 'List',
    table: 'Table',
    code: 'Code',
    math: 'Math',
    theorem: 'Theorem',
    quote: 'Quote',
    figure: 'Figure',
};

/**
 * Split a document into blocks. Fenced code, LaTeX environments and pipe-table
 * runs are atomic — they contain blank lines of their own, so a plain
 * blank-line split would tear them apart, which is exactly the failure the
 * document section is about.
 */
export function splitBlocks(text) {
    const lines = String(text ?? '').replace(/\r/g, '').split('\n');
    const blocks = [];
    let buffer = [];

    const flush = () => {
        const joined = buffer.join('\n').trim();
        if (joined) blocks.push(joined);
        buffer = [];
    };

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        const fence = line.match(/^\s*(```+|~~~+)/);
        if (fence) {
            flush();
            const mark = fence[1].slice(0, 3);
            const chunk = [line];
            i += 1;
            while (i < lines.length) {
                chunk.push(lines[i]);
                const closed = lines[i].trim().startsWith(mark);
                i += 1;
                if (closed) break;
            }
            blocks.push(chunk.join('\n'));
            continue;
        }

        const env = line.match(/^\s*\\begin\{([a-zA-Z]+\*?)\}/);
        if (env) {
            flush();
            const closer = `\\end{${env[1]}}`;
            const chunk = [line];
            i += 1;
            while (i < lines.length) {
                chunk.push(lines[i]);
                const closed = lines[i].includes(closer);
                i += 1;
                if (closed) break;
            }
            blocks.push(chunk.join('\n'));
            continue;
        }

        if (/^\s*\|/.test(line)) {
            flush();
            const chunk = [];
            while (i < lines.length && /^\s*\|/.test(lines[i])) {
                chunk.push(lines[i]);
                i += 1;
            }
            blocks.push(chunk.join('\n'));
            continue;
        }

        if (!line.trim()) {
            flush();
            i += 1;
            continue;
        }

        // A heading is its own block even when prose or a list follows it
        // without a blank line between. Left joined, the heading markers
        // survive into the rendered text and the body below is mislabelled.
        if (HEADING.test(line)) {
            flush();
            blocks.push(line.trim());
            i += 1;
            continue;
        }

        buffer.push(line);
        i += 1;
    }

    flush();
    return blocks.map((body) => ({ body, kind: blockKind(body) }));
}

/** Distinct structural roles present in a document, in first-seen order. */
export function structureOf(text) {
    const seen = [];
    for (const { kind } of splitBlocks(text)) {
        if (!seen.includes(kind)) seen.push(kind);
    }
    return seen;
}

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
