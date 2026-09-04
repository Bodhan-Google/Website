import { EVAL_LANG, OVERALL } from './speakEvals';

/**
 * Chart configs for the Indic-Speak post.
 *
 * Same convention as charts.js in the parent folder: a plain object, referenced by
 * id from the post and rendered through resolveChart() and <BlogChart>. Every
 * number is derived from speakEvals.js rather than typed here.
 *
 * One type in use, and it is new to the library: `ciBar`, a zoomed axis with each
 * bar's 95% interval at its tip. The whole finding in this section is that ten
 * languages land in the same place, which a full-height bar chart cannot show
 * (identical bars) and a zoomed one misrepresents unless the error bars are on it.
 */

/** Wald 95% interval on a proportion, in percentage points. */
const interval = (pct, n) => 1.96 * Math.sqrt(((pct / 100) * (1 - pct / 100)) / n) * 100;

export const topBandByLanguage = {
    type: 'ciBar',
    id: 'speak-top-band',
    title: 'Every language lands in the same place',
    subtitle:
        'Share of readings in the judge’s top fidelity band, on an axis that starts at 85%, with each '
        + 'language’s 95% confidence interval at the tip of its bar. Ten languages, 3,000 readings each, '
        + 'spread across all 45 voices. Ordered alphabetically, because ordering by rate would not mean '
        + 'anything.',
    description:
        'Bar chart of the share of readings in the judge’s top fidelity band for ten Indian languages. '
        + 'All ten fall between 92.0 and 93.6 percent, and nine of the ten confidence intervals contain '
        + 'the all-language mean of 93.0 percent.',
    note:
        'The axis starts at 85%, marked by the break at each bar’s base. All ten fall between 92.0% and '
        + '93.6% — a spread of 1.6 percentage points against a measurement uncertainty of about ±0.9 '
        + 'points on each. Nine of the ten intervals contain the all-language mean, and the gap between '
        + 'the highest and the lowest does not survive correcting for the number of comparisons ten '
        + 'languages allow. There is no strong or weak language here; there is one number, measured ten '
        + 'times.',
    baseline: 85,
    max: 100,
    ticks: [85, 90, 95, 100],
    valueSuffix: '%',
    valueLabel: 'Top band',
    reference: {
        value: OVERALL.pct5,
        label: `all languages ${OVERALL.pct5.toFixed(1)}%`,
    },
    data: EVAL_LANG.map((row) => ({
        category: row.name,
        value: row.pct5,
        ci: interval(row.pct5, row.n),
        n: row.n,
    })),
};

export const indicSpeakChartRegistry = {
    'speak-top-band': topBandByLanguage,
};
