/**
 * What the Indic-Transcribe model page says about the model.
 *
 * Lifted from the announcement (public/indic-transcribe-post/), which is the
 * written account of this release: same numbers, same three output modes with
 * the same worked sentence, same limitations in the same words. The page used
 * to carry a paragraph of its own, and the two drifted; this file is the one
 * copy, so a correction to the post is a correction here.
 *
 * Nothing below is estimated. Where the post marks a figure unverified it is
 * marked here too.
 */

/** The one-line description, as the blog and the research listing carry it. */
export const DESCRIPTION =
    'Indic-Transcribe is a family of two open 1.2B-parameter speech-to-text models covering all '
    + '22 constitutional Indian languages plus English, two Hindi dialects, and Bhili and Bhojpuri. '
    + 'It handles code-mixed speech and outputs in native script, romanized, or mixed script.';

/** The hero band. 27 is the family's reach: 25 codes on Core, two more on Flex. */
export const STATS = [
    { value: '27', label: 'Languages' },
    { value: '1.2B', label: 'Parameters' },
    { value: '2', label: 'Checkpoints' },
    { value: '3', label: 'Output modes' },
];

/**
 * The three output modes, on one Hindi sentence with English loanwords and
 * spoken numerals. The mode is two tokens in the prompt, so all three cost the
 * same decode — which is why the post shows them together rather than as
 * separate features.
 */
export const MODES = {
    spoken: 'A Hindi sentence with English loanwords and spoken numerals',
    out: [
        {
            id: 'native',
            label: 'Native script',
            text: 'मैंने कल पांच बजे तीन फाइलें अपलोड कीं',
            desc: "Everything in the language's own script, numerals spelled out as words. The "
                + 'default, and the only mode Core produces.',
        },
        {
            id: 'mixed',
            label: 'Mixed script',
            text: 'मैंने कल 5 बजे 3 files upload कीं',
            desc: 'Native words in native script; English loanwords and numerals in Latin. This is '
                + 'inverse text normalisation, and it is how the sentence is actually written down '
                + 'by the person who said it.',
        },
        {
            id: 'romanised',
            label: 'Romanized',
            text: 'maine kal 5 baje 3 files upload kin',
            desc: 'Everything transliterated to Latin. Feeds keyword spotting, search indices, and '
                + 'any consumer that never learned to read Indic script.',
        },
    ],
};

/** Who the 27 are. The post's own tiers, in its own words. */
export const COVERAGE = [
    { count: '22', label: 'Constitutionally recognised languages', note: 'Each in its own script' },
    { count: '1', label: 'Indian-accented English', note: 'Including mid-sentence, inside another language' },
    { count: '2', label: 'Hindi dialects', note: 'Chhattisgarhi and Haryanvi, on Flex' },
    { count: '2', label: 'Beyond the schedule', note: 'Bhili and Bhojpuri' },
];

/** The architecture, from the model card. */
export const SPEC = [
    { k: 'Architecture', v: 'NVIDIA Canary — FastConformer encoder, Transformer decoder' },
    { k: 'Base model', v: 'nvidia/canary-1b-v2' },
    { k: 'Parameters', v: '1.2B — 811M encoder, 419M decoder' },
    { k: 'Vocabulary', v: '7,152 — 1,152 control tokens, 6,000 multilingual BPE' },
    { k: 'Precision', v: 'fp32 on disk, bf16 at inference · 4.6 GB · 2.48 GB as fp16 ONNX' },
    { k: 'Training audio', v: '1.35M hours', note: 'unverified' },
];

/**
 * Where it does not reach. Carried over in full rather than trimmed: a model
 * page that lists only the capabilities is the one people build against and
 * then discover the edges in production.
 */
export const LIMITS = [
    {
        h: 'No streaming',
        p: 'Both checkpoints are offline attention encoder-decoders, so the latency floor is a '
            + 'full encoder pass over the clip.',
    },
    {
        h: 'Long audio degrades',
        p: 'Trained at a 30-second maximum. Past about a minute it falls apart — a 221-second '
            + 'recording produced 149 words against a 450-word reference. Split long audio, or use '
            + 'the serving engine, which chunks on silences.',
    },
    {
        h: 'Language ID is uneven',
        p: 'Do not rely on auto-detection for the Hindi belt: Bhojpuri and Chhattisgarhi are '
            + 'absorbed by Hindi entirely, Urdu more than half the time. Pass the language when you '
            + 'have it.',
    },
    {
        h: 'Low-resource languages are weaker',
        p: 'Kashmiri, Maithili, Sanskrit and Bodo carry the least training data and the highest '
            + 'error rates. Check the per-language number before committing to a language.',
    },
    {
        h: 'Repetition on about 1% of clips',
        p: 'Greedy decoding occasionally repeats a word to the generation cap, concentrated in '
            + 'low-resource languages and very short utterances.',
    },
    {
        h: 'Single speaker',
        p: 'Built for single-speaker recordings. For meetings and calls, pair it with diarization '
            + 'and transcribe each turn separately.',
    },
];
