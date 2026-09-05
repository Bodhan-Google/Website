// Helpers shared by the legal-document pages. Kept out of the component file so
// Vite's fast refresh keeps working (component files may only export components).

export const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// "3. Third-Party Hosting" → { num: '3', title } · "6.1 Ownership" → { num: '6.1', title }
export const splitHeading = (text) => {
    const m = /^(\d+(?:\.\d+)*)\.?\s+(.*)$/.exec(text);
    return m ? { num: m[1], title: m[2] } : { num: null, title: text };
};
export const numLabel = (num) => (num.includes('.') ? num : `${num}.`);

export const textOf = (node) => {
    if (!node) return '';
    if (node.type === 'text') return node.value;
    return (node.children || []).map(textOf).join('');
};

/** Split `# Title\n\n<one meta line>\n\n<body>`. The meta line (copyright,
 *  "Last updated") is shown in the header; the h1 is replaced by ours. */
export const splitDocument = (md) => {
    const src = md.trim();
    const m = /^# (.+)\n\n([^\n#]+)\n\n([\s\S]*)$/.exec(src);
    if (!m) return { title: '', metaLine: '', body: src.replace(/^# .+\n+/, '') };
    return { title: m[1].trim(), metaLine: m[2].replace(/^\*+|\*+$/g, '').trim(), body: m[3] };
};

export const buildToc = (body) =>
    [...body.matchAll(/^## (.+)$/gm)].map((m) => {
        const text = m[1].trim();
        return { id: slugify(text), text, ...splitHeading(text) };
    });
