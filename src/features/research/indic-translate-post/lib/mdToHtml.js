/* Ported verbatim from the old single-file blog. A small, deliberately
 * non-exhaustive Markdown/code/LaTeX renderer for the document examples'
 * "Rendered" view: fenced code, headings, bullet lists, pipe tables, bold,
 * italic, inline code and links. LaTeX structural macros are rewritten to their
 * Markdown equivalents so the same line-based logic handles both; actual math is
 * left untouched here and typeset afterwards by KaTeX (see renderMathIn).
 *
 * Output is an HTML string, so callers use dangerouslySetInnerHTML. That is safe
 * here because every value on the way in passes through escapeHtml below, and the
 * only inputs are our own model outputs shipped with the page.
 */

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mdToHtml(raw) {
  if (!raw) return "";
  var blocks = [];
  var text = raw.replace(/```[a-zA-Z0-9_+-]*\n([\s\S]*?)```/g, function (m, code) {
    blocks.push("<pre><code>" + escapeHtml(code.replace(/\n$/, "")) + "</code></pre>");
    return " BLOCK" + (blocks.length - 1) + " ";
  });
  text = text.replace(/\\section\*?\{([^}]*)\}/g, function (m, t) { return "# " + t; });
  text = text.replace(/\\subsection\*?\{([^}]*)\}/g, function (m, t) { return "## " + t; });
  text = text.replace(/\\textbf\{([^}]*)\}/g, function (m, t) { return "**" + t + "**"; });
  text = text.replace(/\\(?:emph|textit)\{([^}]*)\}/g, function (m, t) { return "*" + t + "*"; });
  text = text.replace(/\\label\{[^}]*\}/g, "");
  // KaTeX's auto-render only triggers inside its configured delimiters
  // ($...$, \[...\]); it doesn't independently look for bare \begin{...}
  // blocks, so wrap AMS environments in \[ \] to get them picked up
  // (KaTeX itself understands equation/align/gather as math content).
  text = text.replace(/\\begin\{(equation\*?|align\*?|gather\*?|multline\*?)\}[\s\S]*?\\end\{\1\}/g,
    function (m) { return "\\[" + m + "\\]"; });

  function inline(s) {
    s = escapeHtml(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    // A link in an EXAMPLE document is a specimen, not a destination. These render markdown
    // that came out of the corpus, whose targets are relative paths and in-document anchors
    // -- `images/calibration_jig.png` in the Tables example, `#export-guide` in Markdown --
    // so a real <a> either 404s against the blog's own origin or jumps the reader out of the
    // section they were reading. It is rendered as a span that LOOKS like a link, because
    // showing the model preserved the link markup is the whole point of the specimen; the
    // target is kept on data-href so it is still inspectable.
    //
    // mdToHtml is used only by the example browser, so this cannot affect the post's own
    // prose links, which take a different path through SectionBlocks.
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="ex-doc-link" data-href="$2">$1</span>');
    return s;
  }
  function cells(row) {
    var trimmed = row.trim().replace(/^\|/, "").replace(/\|$/, "");
    return trimmed.split("|").map(function (c) { return c.trim(); });
  }

  var lines = text.split("\n");
  var html = [], listBuf = null, para = [];
  function flushList() { if (listBuf) { html.push("<ul>" + listBuf.join("") + "</ul>"); listBuf = null; } }
  function flushPara() { if (para.length) { html.push("<p>" + para.join(" ") + "</p>"); para = []; } }

  var rowRe = /^\s*\|.*\|\s*$/, sepRe = /^\s*\|[\s:|-]+\|\s*$/;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var blockMatch = line.match(/^ BLOCK(\d+) $/);
    if (blockMatch) { flushList(); flushPara(); html.push(blocks[+blockMatch[1]]); continue; }
    var h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flushList(); flushPara(); html.push("<h" + h[1].length + ">" + inline(h[2]) + "</h" + h[1].length + ">"); continue; }
    if (rowRe.test(line) && lines[i + 1] && sepRe.test(lines[i + 1])) {
      flushList(); flushPara();
      var headCells = cells(line);
      var out = ["<table><thead><tr>"];
      headCells.forEach(function (c) { out.push("<th>" + inline(c) + "</th>"); });
      out.push("</tr></thead><tbody>");
      i += 2;
      while (i < lines.length && rowRe.test(lines[i])) {
        var rowCells = cells(lines[i]);
        out.push("<tr>");
        rowCells.forEach(function (c) { out.push("<td>" + inline(c) + "</td>"); });
        out.push("</tr>");
        i++;
      }
      i--;
      out.push("</tbody></table>");
      html.push(out.join(""));
      continue;
    }
    var li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) { flushPara(); if (!listBuf) listBuf = []; listBuf.push("<li>" + inline(li[1]) + "</li>"); continue; }
    if (line.trim() === "") { flushList(); flushPara(); continue; }
    flushList();
    para.push(inline(line));
  }
  flushList(); flushPara();
  return html.join("\n") || "<p></p>";
}

export { mdToHtml, escapeHtml };
