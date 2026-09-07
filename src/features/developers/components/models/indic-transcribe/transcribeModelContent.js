/**
 * What the Indic-Transcribe model page says about the model.
 *
 * Lifted from the announcement (public/indic-transcribe-post/), which is the
 * written account of this release. The page used to carry a paragraph of its
 * own and the two drifted; this file is the one copy, so a correction to the
 * post is a correction here. The demo below the hero reads from the post's own
 * feature data (data/transcribeFeatures.json) for the same reason.
 */

/** The one-line description, as the blog and the research listing carry it. */
export const DESCRIPTION =
    'Indic-Transcribe is an open 1.2B-parameter ASR model covering all 22 constitutional Indian '
    + 'languages plus English, two Hindi dialects, and Bhili and Bhojpuri. It handles code-mixed '
    + 'speech and outputs in native script, romanized, or mixed script.';

/** The hero band. 27 is the family's reach: 25 codes on Core, two more on Flex. */
export const STATS = [
    { value: '27', label: 'Languages' },
    { value: '1.2B', label: 'Parameters' },
    { value: '2', label: 'Checkpoints' },
    { value: '3', label: 'Output modes' },
];
