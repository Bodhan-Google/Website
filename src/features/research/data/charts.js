import { indicSpeakChartRegistry } from './indic-speak/charts';
import { indicTranslateChartRegistry } from './indic-translate/charts';
import { indicOcrChartRegistry } from './indic-ocr/charts';

/**
 * Chart configs for blog posts.
 *
 * Each chart is a JSON object referenced from posts.js via `charts: [...]`.
 * BlogContent renders them through <BlogChart chart={...} />.
 *
 * Supported types:
 *   - groupedBar / dotPlot  → multilingual comparisons with close or many series
 *   - dumbbell              → paired close values (speaker consistency)
 *   - rankedBar             → single ranked leaderboard (overall performance)
 *   - donut / composition   → part-to-whole training mix
 */

export const vistaarCerChart = {
    type: 'dotPlot',
    id: 'vistaar-cer',
    title: 'Vistaar character error rate by language',
    subtitle:
        'Bodhan Scribe compared with Competitor A and Google STT on the Vistaar set. Lower is better.',
    description:
        'Dot plot of character error rate in percent for ten Indian languages. Bodhan Scribe is the lowest value in every language.',
    yLabel: 'CER (%)',
    xLabel: 'Language',
    lowerIsBetter: true,
    valueSuffix: '%',
    series: [
        { key: 'bodhan', label: 'Bodhan Scribe', role: 'primary' },
        { key: 'competitorA', label: 'Competitor A', role: 'secondary' },
        { key: 'competitorB', label: 'Google STT', role: 'tertiary' },
    ],
    data: [
        { category: 'Bengali', bodhan: 4.8, competitorA: 6.2, competitorB: 9.4 },
        { category: 'Gujarati', bodhan: 5.1, competitorA: 7.0, competitorB: 10.2 },
        { category: 'Hindi', bodhan: 3.9, competitorA: 5.5, competitorB: 8.1 },
        { category: 'Kannada', bodhan: 5.4, competitorA: 7.3, competitorB: 11.0 },
        { category: 'Malayalam', bodhan: 5.8, competitorA: 7.8, competitorB: 11.5 },
        { category: 'Marathi', bodhan: 4.5, competitorA: 6.1, competitorB: 9.0 },
        { category: 'Odia', bodhan: 5.6, competitorA: 7.5, competitorB: 10.8 },
        { category: 'Punjabi', bodhan: 4.2, competitorA: 5.9, competitorB: 8.7 },
        { category: 'Tamil', bodhan: 5.3, competitorA: 7.1, competitorB: 10.5 },
        { category: 'Telugu', bodhan: 5.0, competitorA: 6.8, competitorB: 9.8 },
    ],
};

export const speakerConsistencyChart = {
    type: 'dumbbell',
    id: 'speaker-consistency',
    title: 'Speaker consistency: cross-language vs same-language',
    subtitle:
        'Similarity scores sit in a narrow band, so this chart uses a zoomed axis instead of full-height bars. Higher is better.',
    description:
        'Dumbbell plot comparing cross-language and same-language speaker similarity for eight speakers. Same-language scores are slightly higher in every case.',
    note: 'Axis is zoomed around the observed range (about 0.87–0.92) to make small differences readable.',
    yLabel: 'Speaker Similarity',
    xLabel: 'Speaker',
    valueSuffix: '',
    series: [
        { key: 'crossLang', label: 'Cross-language', role: 'secondary' },
        { key: 'sameLang', label: 'Same-language', role: 'primary' },
    ],
    data: [
        { category: 'Anushka', crossLang: 0.885, sameLang: 0.914 },
        { category: 'Arya', crossLang: 0.891, sameLang: 0.908 },
        { category: 'Manisha', crossLang: 0.878, sameLang: 0.902 },
        { category: 'Vidya', crossLang: 0.893, sameLang: 0.919 },
        { category: 'Abhilash', crossLang: 0.882, sameLang: 0.905 },
        { category: 'Hitesh', crossLang: 0.876, sameLang: 0.898 },
        { category: 'Karun', crossLang: 0.889, sameLang: 0.911 },
        { category: 'Raghav', crossLang: 0.884, sameLang: 0.907 },
    ],
};

export const overallPerformanceChart = {
    type: 'rankedBar',
    id: 'overall-wer',
    title: 'Overall benchmark performance',
    subtitle: 'Average word error rate on the Voice of India test set. Lower is better.',
    description:
        'Horizontal bar chart ranking six systems by average word error rate. Bodhan Scribe is lowest at 4.2 percent.',
    yLabel: 'WER (%)',
    seriesName: 'WER',
    valueSuffix: '%',
    highlightKey: 'bodhan',
    data: [
        { name: 'Bodhan Scribe', key: 'bodhan', score: 4.2, highlight: true },
        { name: 'Model B', score: 5.8 },
        { name: 'Model C', score: 6.1 },
        { name: 'Model D', score: 6.5 },
        { name: 'Model E', score: 7.2 },
        { name: 'Model F', score: 8.0 },
    ],
};

export const trainingDataDonut = {
    type: 'composition',
    id: 'training-breakdown',
    title: 'Training data mix',
    subtitle: '1.35 million hours across three sources. Weak and synthetic speech dominate the corpus.',
    description:
        'Composition bar showing 1.30 million weak or synthetic hours, 40 thousand zero-shot TTS hours, and 11 thousand human-labeled hours.',
    totalLabel: 'Total hours',
    totalValue: '1.35M',
    tableHeaders: ['Source', 'Hours', 'Share'],
    segments: [
        {
            label: 'Weak / synthetic',
            value: 96.3,
            hours: 1300,
            display: '1.30M',
        },
        {
            label: 'Zero-shot TTS',
            value: 2.96,
            hours: 40,
            display: '40K',
        },
        {
            label: 'Human labeled',
            value: 0.74,
            hours: 11,
            display: '11K',
        },
    ],
};

export const chartRegistry = {
    'vistaar-cer': vistaarCerChart,
    'speaker-consistency': speakerConsistencyChart,
    'overall-wer': overallPerformanceChart,
    'training-breakdown': trainingDataDonut,
    // The Indic-Translate post keeps its twenty configs in their own module so the
    // evaluation numbers stay next to the tables they were generated from.
    ...indicTranslateChartRegistry,
    // Likewise for IndicOCR: the benchmark tables it charts live beside it in
    // indic-ocr/evals.js.
    ...indicOcrChartRegistry,
    // And for Indic-Speak, whose one config is derived from indic-speak/speakEvals.js
    // rather than typed out.
    ...indicSpeakChartRegistry,
};

export function resolveChart(chartRef) {
    if (typeof chartRef === 'string') return chartRegistry[chartRef];
    return chartRef;
}
