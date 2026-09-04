/**
 * Chart configs for the Indic-Translate post.
 *
 * Same convention as the website template's charts.js: each chart is a plain object
 * referenced by id from post.js, resolved through resolveChart() and rendered by
 * <BlogChart>. Every number comes from evals.js, which is generated straight out of
 * the page these figures were first published on -- nothing is retyped here.
 *
 * Types in use:
 *   bar           two series as real grouped bars       (added by this post)
 *   rankedBar     one ranked leaderboard, single series
 *   composition   part-to-whole (training mix, verdict splits)
 *   heatmap       a full value matrix, sortable         (added by this post)
 *   divergingBar  signed values about a zero line       (added by this post)
 *
 * The template's dotPlot and dumbbell are still registered but unused: every comparison
 * on this page is a bar chart.
 */
import {
  DOC,
  DOC_LABELS,
  DOC_HUMAN_BY_CATEGORY,
  DOC_HUMAN_BY_LANG,
  DOC_HUMAN_DIMS,
  DOC_HUMAN_MEAN,
  DOC_HUMAN_VERDICT,
  DOC_HUMAN_VERDICT_TOTAL,
  DOC_JUDGE_DIMS,
  DOC_JUDGE_MEAN,
  EN2XX,
  EN2XX_MACRO16,
  EN2XX_MACRO22,
  HUMAN_NET_WINS,
  LANGS,
  ROMAN_DOCUMENT,
  ROMAN_SENTENCE,
  SENT_HUMAN_VERDICT,
  SENT_HUMAN_VERDICT_TOTAL,
  SYSTEMS,
  TRANSLIT_CER,
  TRANSLIT_CHRF,
  XX2EN,
  XX2EN_MACRO16,
  XX2EN_MACRO22,
} from './evals';
import { TRANSLIT_CER_WER } from './translitMetrics';

const OURS = 'Indic-Translate';
const SARVAM = 'Sarvam Translate';


/**
 * Rank the systems by macro chrF++. Six systems have no 22-language score because
 * their chat template does not cover all of IN22; those fall back to the
 * 16-language macro and are flagged, exactly as on the original page.
 */
const rankedSystems = (macro22, macro16) =>
  SYSTEMS.map((s, i) => ({
    name: s.label + (macro22[i] === null ? ' †' : ''),
    key: s.key,
    score: macro22[i] === null ? macro16[i] : macro22[i],
    highlight: !!s.isOurs,
  })).sort((a, b) => b.score - a.score);

const heatColumns = SYSTEMS.map((s) => ({
  label: s.label,
  isOurs: !!s.isOurs,
  dagger: !!s.dagger,
}));

/** Two-series rows of `{key, label, values: [ours, sarvam]}` into dot-plot shape. */
const pairedRows = (rows) =>
  rows.map((r) => ({ category: r.label, ours: r.values[0], sarvam: r.values[1] }));

/** Six-dimension `[name, ours, sarvam]` tuples into dumbbell shape. */
const dimRows = (dims) =>
  dims.map(([name, ours, sarvam]) => ({ category: name, sarvam, ours }));

const OURS_VS_SARVAM = [
  { key: 'sarvam', label: SARVAM, role: 'secondary' },
  { key: 'ours', label: OURS, role: 'primary' },
];

// Bars are read as a ranking, so our model leads. The dumbbell keeps the order above,
// where the two series are the two ends of a line rather than a list.
const OURS_FIRST = [
  { key: 'ours', label: OURS, role: 'primary' },
  { key: 'sarvam', label: SARVAM, role: 'secondary' },
];

const verdictSegments = (rows, total) =>
  rows.map((r) => ({
    label: r.label,
    value: Number(((r.value / total) * 100).toFixed(2)),
    display: r.value.toLocaleString('en-US'),
  }));

// ── Document evaluation ─────────────────────────────────────────────────────
const docSystemBar = (metric, title, subtitle) => ({
  type: 'rankedBar',
  id: `doc-${metric}`,
  title,
  subtitle,
  description: `${title}. Indic-Translate leads both metrics across all 22 languages.`,
  valueHeader: title,
  digits: 2,
  highlightKey: 'ours',
  data: ['ours', 'sarvam', 'it2'].map((k) => ({
    name: DOC_LABELS[k],
    key: k,
    score: DOC[metric][k],
    highlight: k === 'ours',
  })),
});

export const docDchrf = docSystemBar('dchrf', 'dchrF++', 'Document-level chrF++. Higher is better.');
export const docDbleu = docSystemBar('dbleu', 'dBLEU', 'Document-level BLEU. Higher is better.');

export const docJudgeMean = {
  type: 'rankedBar',
  id: 'doc-judge-mean',
  title: 'Document quality, mean overall score',
  subtitle: 'LLM-judge rubric, 0–100. Higher is better.',
  description: 'Mean judge score of 82.49 for Indic-Translate against 63.99 for Sarvam Translate.',
  valueHeader: 'Mean score (0–100)',
  highlightKey: 'ours',
  data: [
    { name: OURS, key: 'ours', score: DOC_JUDGE_MEAN[0], highlight: true },
    { name: SARVAM, key: 'sarvam', score: DOC_JUDGE_MEAN[1] },
  ],
};

export const docJudgeDims = {
  type: 'bar',
  id: 'doc-judge-dims',
  maxValue: 5,
  title: 'Document quality by dimension',
  subtitle: 'LLM-judge rubric, 0–5 per dimension, against Sarvam Translate. Higher is better.',
  description:
    'Grouped bars over six rubric dimensions. Indic-Translate scores higher on every one.',
  note:
    'Scored by gemini-3-flash-preview and cross-checked with a second judge, '
    + 'gpt-5.6-terra; both rank this checkpoint ahead of Sarvam Translate on every '
    + 'dimension.',
  categoryHeader: 'Dimension',
  yLabel: 'Score (0–5)',
  digits: 2,
  series: OURS_FIRST,
  data: dimRows(DOC_JUDGE_DIMS),
};

export const docHumanMean = {
  type: 'rankedBar',
  id: 'doc-human-mean',
  title: 'Human evaluation, mean overall score',
  subtitle: '1,275 documents rated by human annotators, all 22 languages, 0–100.',
  description: 'Mean human score of 79.94 against 74.71 for Sarvam Translate.',
  valueHeader: 'Mean score (0–100)',
  highlightKey: 'ours',
  data: [
    { name: `${OURS} (previous)`, key: 'ours', score: DOC_HUMAN_MEAN[0], highlight: true },
    { name: SARVAM, key: 'sarvam', score: DOC_HUMAN_MEAN[1] },
  ],
};

export const docHumanDims = {
  type: 'bar',
  id: 'doc-human-dims',
  maxValue: 5,
  title: 'Human evaluation by dimension',
  subtitle: 'Same six-dimension rubric, scored by human annotators rather than a judge.',
  description: 'Grouped bars over six rubric dimensions, human-scored, 0–5.',
  categoryHeader: 'Dimension',
  yLabel: 'Score (0–5)',
  digits: 2,
  series: [
    { key: 'sarvam', label: SARVAM, role: 'secondary' },
    { key: 'ours', label: `${OURS} (previous)`, role: 'primary' },
  ],
  data: dimRows(DOC_HUMAN_DIMS),
};

export const docHumanVerdict = {
  type: 'composition',
  id: 'doc-human-verdict',
  title: 'Human evaluation, verdict per document',
  subtitle: `${DOC_HUMAN_VERDICT_TOTAL.toLocaleString('en-US')} documents, blind head-to-head.`,
  description:
    'Composition bar of annotator verdicts over 1,275 documents: Indic-Translate preferred '
    + 'on 604, Sarvam Translate on 257, both good on 374, both poor on 40.',
  totalLabel: 'Documents rated',
  totalValue: DOC_HUMAN_VERDICT_TOTAL.toLocaleString('en-US'),
  tableHeaders: ['Verdict', 'Documents', 'Share'],
  segments: verdictSegments(DOC_HUMAN_VERDICT, DOC_HUMAN_VERDICT_TOTAL),
};

export const docHumanByLang = {
  type: 'bar',
  id: 'doc-human-by-lang',
  maxValue: 100,
  title: 'Human evaluation by language',
  subtitle: 'Mean overall score, 0–100, all 22 languages. Higher is better.',
  description: 'Grouped bars of mean human score per language against Sarvam Translate.',
  categoryHeader: 'Language',
  yLabel: 'Mean score (0–100)',
  xLabel: 'Language',
  digits: 1,
  series: OURS_FIRST,
  data: DOC_HUMAN_BY_LANG.map(([name, ours, sarvam]) => ({ category: name, ours, sarvam })),
};

export const docHumanByCategory = {
  type: 'bar',
  id: 'doc-human-by-cat',
  maxValue: 100,
  title: 'Human evaluation by document type',
  subtitle: 'Mean overall score, 0–100, across the five document types.',
  description: 'Grouped bars of mean human score per document type against Sarvam Translate.',
  categoryHeader: 'Document type',
  yLabel: 'Mean score (0–100)',
  digits: 1,
  series: OURS_FIRST,
  data: DOC_HUMAN_BY_CATEGORY.map(([name, ours, sarvam]) => ({ category: name, ours, sarvam })),
};

// ── Sentence evaluation ─────────────────────────────────────────────────────
const DAGGER_NOTE =
  '† TranslateGemma’s chat template only supports 16 of IN22’s 22 languages (no Bodo, '
  + 'Dogri, Konkani, Maithili, Manipuri or Santali), so its bar is a 16-language macro and is '
  + 'not directly comparable with the 22-language rows.';

export const sentRankEn2xx = {
  type: 'rankedBar',
  id: 'sent-rank-en2xx',
  title: 'English → Indic, all systems',
  subtitle: 'chrF++, macro over 22 languages. Higher is better.',
  description: 'Ranked bars of macro chrF++ for fourteen systems translating English into Indic.',
  note: DAGGER_NOTE,
  valueHeader: 'chrF++',
  digits: 2,
  highlightKey: 'ours',
  data: rankedSystems(EN2XX_MACRO22, EN2XX_MACRO16),
};

export const sentRankXx2en = {
  type: 'rankedBar',
  id: 'sent-rank-xx2en',
  title: 'Indic → English, all systems',
  subtitle: 'chrF++, macro over 22 languages. Higher is better.',
  description: 'Ranked bars of macro chrF++ for fourteen systems translating Indic into English.',
  note:
    `${DAGGER_NOTE} Indic-Translate beats every open-weight and base-model system in both `
    + 'directions by a wide margin, and trails the commercial systems, Sarvam Translate and '
    + 'IndicTrans2, only slightly on macro chrF++.',
  valueHeader: 'chrF++',
  digits: 2,
  highlightKey: 'ours',
  data: rankedSystems(XX2EN_MACRO22, XX2EN_MACRO16),
};

export const sentHeatEn2xx = {
  type: 'heatmap',
  id: 'sent-heat-en2xx',
  title: 'English → Indic by language',
  subtitle: 'chrF++, all 22 languages × 14 systems. Click a column to sort by it.',
  description: 'Matrix of chrF++ scores per language and system, translating English into Indic.',
  domainMax: 70,
  rowLabels: LANGS,
  colLabels: heatColumns,
  matrix: LANGS.map((l) => EN2XX[l]),
};

export const sentHeatXx2en = {
  type: 'heatmap',
  id: 'sent-heat-xx2en',
  title: 'Indic → English by language',
  subtitle: 'chrF++, all 22 languages × 14 systems. Click a column to sort by it.',
  description: 'Matrix of chrF++ scores per language and system, translating Indic into English.',
  domainMax: 75,
  rowLabels: LANGS,
  colLabels: heatColumns,
  matrix: LANGS.map((l) => XX2EN[l]),
};

export const sentHumanVerdict = {
  type: 'composition',
  id: 'sent-human-verdict',
  title: 'Human evaluation, verdict per sentence',
  subtitle:
    `${SENT_HUMAN_VERDICT_TOTAL.toLocaleString('en-US')} rated sentences, blind head-to-head `
    + 'against Sarvam Translate, all 22 languages.',
  description:
    'Composition bar of annotator verdicts over 2,184 sentences: Indic-Translate preferred on '
    + '541, Sarvam Translate on 595, both good on 758, both poor on 290.',
  totalLabel: 'Sentences rated',
  totalValue: SENT_HUMAN_VERDICT_TOTAL.toLocaleString('en-US'),
  tableHeaders: ['Verdict', 'Sentences', 'Share'],
  segments: verdictSegments(SENT_HUMAN_VERDICT, SENT_HUMAN_VERDICT_TOTAL),
};

export const sentHumanNetWins = {
  type: 'divergingBar',
  id: 'sent-human-netwins',
  title: 'Net preference by language',
  subtitle: 'Wins minus losses per language, from the same blind head-to-head.',
  description:
    'Diverging bars of net annotator preference per language. Positive bars favour '
    + 'Indic-Translate, negative bars favour Sarvam Translate.',
  positiveLabel: 'Indic-Translate ahead',
  negativeLabel: 'Sarvam Translate ahead',
  valueHeader: 'Net wins',
  data: HUMAN_NET_WINS.map(([label, value]) => ({ label, value })),
};

// ── Romanized translation ───────────────────────────────────────────────────
export const romanSentence = {
  type: 'bar',
  id: 'roman-sentence',
  maxValue: 100,
  title: 'chrF++ by direction',
  subtitle: 'Sentence level, against Sarvam Translate. Higher is better.',
  description:
    'Grouped bars of chrF++ in both romanization directions. Indic-Translate scores 41.12 '
    + 'into Roman and 64.93 out of it, against 2.20 and 33.78.',
  categoryHeader: 'Direction',
  yLabel: 'chrF++',
  xLabel: 'Direction',
  digits: 2,
  series: OURS_FIRST,
  data: pairedRows(ROMAN_SENTENCE),
};

export const romanDocument = {
  type: 'rankedBar',
  id: 'roman-document',
  title: 'chrF++ by direction, document level',
  subtitle: 'Higher is better · 21 of 22 languages.',
  description: 'Document-level romanization chrF++: 49.45 into Roman, 81.58 out of it.',
  valueHeader: 'chrF++',
  digits: 2,
  highlightKey: 'roman2en',
  data: ROMAN_DOCUMENT.map((r) => ({ name: r.label, key: r.key, score: r.values[0] })),
};

// ── Transliteration ─────────────────────────────────────────────────────────
// Bars rather than dots: two categories whose values are far apart read as two lone
// dots on a wide axis, with no sense of magnitude.
const translitRows = (metric) =>
  TRANSLIT_CER_WER.map((r) => ({ category: r.label, ours: r[metric][0], sarvam: r[metric][1] }));

export const translitCer = {
  type: 'bar',
  id: 'translit-cer',
  title: 'Character error rate',
  subtitle: 'Lower is better. Pooled over every scored sentence, both directions.',
  description:
    'Grouped bars of transliteration character error rate in both directions, against '
    + 'Sarvam Translate.',
  categoryHeader: 'Direction',
  yLabel: 'CER',
  lowerIsBetter: true,
  digits: 4,
  maxValue: 1.2,
  series: OURS_FIRST,
  data: translitRows('cer'),
};

export const translitWer = {
  type: 'bar',
  id: 'translit-wer',
  title: 'Word error rate',
  subtitle: 'Lower is better. Same sentences as the character error rate above.',
  description:
    'Grouped bars of transliteration word error rate in both directions, against Sarvam '
    + 'Translate.',
  // An error rate can exceed 1: an edit distance can be longer than the reference.
  note: 'A word error rate above 1 means more word edits than there are reference words.',
  categoryHeader: 'Direction',
  yLabel: 'WER',
  lowerIsBetter: true,
  digits: 4,
  maxValue: 1.2,
  series: OURS_FIRST,
  data: translitRows('wer'),
};

export const translitChrf = {
  type: 'bar',
  id: 'translit-chrf',
  title: 'chrF++ by direction',
  subtitle: 'Higher is better.',
  description: 'Grouped bars of transliteration chrF++ in both directions.',
  categoryHeader: 'Direction',
  yLabel: 'chrF++',
  digits: 2,
  maxValue: 100,
  series: OURS_FIRST,
  data: pairedRows(TRANSLIT_CHRF),
};

export const indicTranslateChartRegistry = Object.fromEntries(
  [
    docDchrf,
    docDbleu,
    docJudgeMean,
    docJudgeDims,
    docHumanMean,
    docHumanDims,
    docHumanVerdict,
    docHumanByLang,
    docHumanByCategory,
    sentRankEn2xx,
    sentRankXx2en,
    sentHeatEn2xx,
    sentHeatXx2en,
    sentHumanVerdict,
    sentHumanNetWins,
    romanSentence,
    romanDocument,
    translitCer,
    translitWer,
    translitChrf,
  ].map((c) => [c.id, c])
);
