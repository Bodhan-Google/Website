import { DOC_SUBTYPE_LABELS } from '../data/evals';
import { VERDICTS } from '../data/verdicts';
import { sentencePerm, SENTENCE_FIRST } from '../data/exampleOrder';

// Which examples the browser shows, and which it opens on. Moved out of
// ExamplesBrowser.jsx unchanged so the developers' model page can apply the same
// verdicts; see that component for how they are used.

export const SUBTYPES = Object.keys(DOC_SUBTYPE_LABELS);
export const DEFAULT_LANG = 'Hindi';

/**
 * The annotators' verdicts, applied. Three rules, all from the vetting pass:
 *
 *   - Minor fix counts as approved, so 261 of the 274 verdicts are usable.
 *   - A rejected example is never shown. Unsure and unreviewed ones stay browsable --
 *     unreviewed items keep their existing order, which is by judge score, so the
 *     ranking a reader steps through is still meaningful.
 *   - The FIRST thing shown is a vetted one. For lists that means an index; for
 *     documents, which are chosen by a subtype toggle rather than by stepping a list,
 *     it means a subtype, so the default document type varies by language: most open on
 *     Markdown; Tamil opens on LaTeX because its Markdown example is not approved, and
 *     Hindi on Tables by the editorial preference below.
 *
 * Kashmiri is absent from VERDICTS on purpose -- the annotators flagged its sheet as
 * flipped -- so it falls through to the unvetted default, which is what these helpers
 * do for any language or category the workbook does not cover.
 */
const rule = (lang, cat) => VERDICTS[lang]?.[cat];

/**
 * The display permutation for a category. Only `translation` can carry an editorial
 * reorder (see src/data/exampleOrder.js); everything else keeps the generated order.
 * Returned as original indices, so the verdict data -- which is keyed by position in the
 * GENERATED order -- can be carried through it rather than silently desynced.
 */
const permOf = (lang, cat, list) =>
  (cat === 'translation'
    ? sentencePerm(lang, list)
    : Array.from({ length: list?.length ?? 0 }, (_, i) => i));

/** Indices (1-based in the workbook) to hide, as a 0-based Set of ORIGINAL indices. */
export const dropped = (lang, cat) => {
  const d = rule(lang, cat)?.drop ?? [];
  return new Set(d.map((x) => (typeof x === 'number' ? x - 1 : x)));
};

/** Items minus the rejected ones, in display order. */
export const vetted = (lang, cat, list) => {
  const drop = dropped(lang, cat);
  return permOf(lang, cat, list).filter((orig) => !drop.has(orig)).map((orig) => list[orig]);
};

/** Where a category should open, as an index into the VETTED list. */
const firstIndex = (lang, cat, list) => {
  const first = cat === 'translation' && SENTENCE_FIRST[lang] !== undefined
    ? SENTENCE_FIRST[lang]
    : rule(lang, cat)?.first;
  if (typeof first !== 'number') return 0;
  const drop = dropped(lang, cat);
  // `first` counts the ORIGINAL list; walk the display order and translate it into the
  // filtered, reordered one.
  let idx = 0;
  for (const orig of permOf(lang, cat, list)) {
    if (drop.has(orig)) continue;
    if (orig === first - 1) return idx;
    idx += 1;
  }
  return 0;
};

/**
 * Editorial preference for which document subtype a language opens on, overriding the
 * verdict-derived default. The verdict default is "the first APPROVED subtype in the
 * annotators' sheet order", which is a safety rule, not an editorial one -- among several
 * approved examples it just takes the earliest.
 *
 * Hindi is the language the section opens on, so its document is the first structured
 * translation most readers will ever see, and a table carries the structure-preservation
 * claim far better than a LaTeX derivation does.
 *
 * This can only ever REORDER approved material: the lookup below still requires the
 * subtype to exist and to have survived the drop list, so a preference naming a rejected
 * example falls through to the verdict default rather than surfacing it. Hindi's Tables
 * example is Approved with issue type None in the workbook; its Markdown one is Unsure
 * (omission), which is why the verdict default was LaTeX rather than Markdown.
 */
const DOC_SUBTYPE_PREFERRED = {
  Hindi: 'tables_and_images',
};

/** Which document subtype a language should open on. */
const firstSubtype = (lang, docs) => {
  const want = DOC_SUBTYPE_PREFERRED[lang];
  if (want && docs?.[want] && !dropped(lang, 'document').has(want)) return want;
  const first = rule(lang, 'document')?.first;
  if (typeof first === 'string' && docs?.[first]) return first;
  return SUBTYPES.find((k) => docs?.[k]) ?? SUBTYPES[0];
};

/** Every default for one language, in the shape the component's state wants. */
export const defaultsFor = (lang, data) => {
  const d = data?.[lang] ?? {};
  return {
    dots: {
      translation: firstIndex(lang, 'translation', d.translation),
      romanized: firstIndex(lang, 'romanized', d.romanized),
      transliteration: firstIndex(lang, 'transliteration', d.transliteration?.items),
      codemix: firstIndex(lang, 'codemix', d.codemix),
    },
    docSubtype: firstSubtype(lang, d.document),
  };
};
