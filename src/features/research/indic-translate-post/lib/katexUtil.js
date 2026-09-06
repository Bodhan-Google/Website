import renderMathInElement from 'katex/contrib/auto-render';

// KaTeX typesets the actual math that mdToHtml leaves untouched: $...$, \(...\),
// \[...\], and the AMS environments mdToHtml wraps in \[ \] on its way past.
//
// The old page loaded KaTeX 0.16.9 from cdnjs and had to guard against the script
// failing; here it is an npm import, so the only guard needed is around KaTeX's own
// parse errors. throwOnError:false already handles malformed math per-expression --
// the try/catch covers anything thrown by the walker itself, and leaves the raw text
// visible rather than breaking the panel.
export function renderMathIn(el) {
  if (!el) return;
  try {
    renderMathInElement(el, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
  } catch {
    /* leave the raw text visible rather than breaking the page */
  }
}
