// Copy and options for the /fln-dpi interest form. Edit here, not in the
// component. The option lists (ENGAGEMENT, AREAS, MODES, MODELS,
// WHITEPAPER_QUESTIONS) are mirrored server-side in
// scripts/apps-script/fln-dpi-feedback.js — keep both in sync, the backend
// rejects labels it does not recognise.
//
// Copy that describes the DPI is taken from the whitepaper "Digital Public
// Infrastructure for Foundational Literacy and Numeracy", v1.0, July 2026.

export const PAGE_TITLE = 'FLN DPI & Bodhan Open Models – Interest Form | Bodhan.AI';

export const CONTACT_EMAIL = 'contact@bodhan.ai';

export const HEADLINE = 'FLN DPI & Bodhan Open Models';

export const LEDE =
    'Thank you for joining us at the FLN Consortium (hosted by MoE) or the Bodhan AI: Ecosystem Consultation on Shared AI Infrastructure for Education (hosted by Gates Foundation). Tell us how you would like to engage — using Bodhan open models (ASR, OCR, TTS), contributing to building the FLN DPI, or responding to the whitepaper.';

export const TIME_NOTE = 'Takes about 3 minutes; you will only see the sections relevant to you.';

export const ABOUT = [
    'Bodhan, a not-for-profit registered under Section 8 of the Companies Act, is proposing a digital public infrastructure (DPI) for foundational literacy and numeracy. It has three parts: shared AI capability services that any application can call; open standards — above all a common, versioned learner record — that make results comparable and portable; and thin trust rails for identity, consent, certification and audit.',
    'Bodhan builds no applications. The application layer belongs entirely to the ecosystem: any developer who meets the published certification bar may build assessment or practice applications, and every certified application is treated identically by the infrastructure.',
    'Three commitments anchor the design. States remain the data fiduciaries. The infrastructure is data-blind, and raw child audio is discarded once the assessment record is produced. And it is free at the point of use: no school, teacher or child ever pays.',
];

/** The document this consultation is about. Set `url` once the PDF is hosted
 *  (e.g. drop it in public/docs/ and point here); until then the page offers
 *  the contact email instead of a dead link. */
export const WHITEPAPER = {
    title: 'Digital Public Infrastructure for Foundational Literacy and Numeracy',
    subtitle: 'A shared foundation of AI capability, open standards, and trust rails for the FLN ecosystem',
    version: 'Whitepaper · Version 1.0 · Draft for public consultation · July 2026',
    url: '',
};

/** How the respondent wants to engage. Multi-select; drives which sections show. */
export const ENGAGEMENT = [
    {
        id: 'use-models',
        label: 'Use Bodhan open models',
        hint: 'ASR, OCR and TTS for Indian languages, in your own product or programme.',
    },
    {
        id: 'contribute',
        label: 'Contribute to building the FLN DPI',
        hint: 'Standards, trust rails, models, applications, rollout, funding.',
    },
    {
        id: 'whitepaper',
        label: 'Give feedback on the whitepaper',
        hint: 'Respond to the open questions in the v1.0 draft, or challenge any part of the design.',
    },
];

// ─── Contributing to the FLN DPI ─────────────────────────────────────────────

export const CONTRIBUTE_INTRO =
    'The FLN DPI spans AI capability services, open standards, trust rails, applications, and rollout. Pick every area where you can help — broad strokes are fine, details go in the last question.';

export const AREAS = [
    { label: 'Vision, pedagogy and policy', hint: 'FLN vision, learning outcomes, NEP/NIPUN alignment, policy frameworks' },
    { label: 'Standards and specifications', hint: 'Learner record schema, API specs, interoperability' },
    { label: 'Trust rails', hint: 'Identity, consent, security, data residency, audit' },
    { label: 'AI and assessment models', hint: 'Model building, benchmarks, training data' },
    { label: 'Applications', hint: 'Assessment apps, practice apps, mobile app development' },
    { label: 'Rollout and operations', hint: 'State/school rollout partnerships, managed services and hosting, data reporting' },
];

export const MODES = [
    { label: 'Build (engineering / product)' },
    { label: 'Domain expertise and advisory' },
    { label: 'Field deployment and rollout' },
    { label: 'Data or content contribution' },
    { label: 'Funding / sponsorship' },
];

export const OTHER_LABEL = 'Other';

// ─── Using Bodhan open models ────────────────────────────────────────────────

export const MODELS_INTRO =
    'Bodhan open models are released for anyone to use. Tell us which ones you are interested in and what you would build with them.';

export const MODELS = [
    { label: 'ASR', hint: 'Speech to text' },
    { label: 'OCR', hint: 'Text from print and handwriting' },
    { label: 'TTS', hint: 'Text to speech' },
];

// ─── Feedback on the whitepaper ─────────────────────────────────────────────

export const WHITEPAPER_INTRO =
    'Version 1.0 is published for public consultation and every element of the design is open to challenge. Section 21 lists the questions we are explicitly seeking input on — pick any you have a view on, then tell us in your own words.';

/** Section 21, "Open questions for consultation", verbatim headings. */
export const WHITEPAPER_QUESTIONS = [
    { label: 'Consent at population scale', hint: 'What consent-capture mechanism balances verifiable guardian consent with schools where guardians are hard to reach? Should the state’s role be broader or narrower?' },
    { label: 'The consent-manager function', hint: 'Should it be housed within Bodhan, or separated into a distinct regulated entity?' },
    { label: 'The capacity bridge', hint: 'Is managed hosting the right mechanism for states without a data plane, and what should govern the migration out of it?' },
    { label: 'Offline and low-connectivity operation', hint: 'How much offline capability should the minimum classroom profile assume, and how should records sync without weakening consent and audit?' },
    { label: 'Benchmark governance', hint: 'Who, beyond the operator, should hold the pen on the public benchmarks and test sets?' },
    { label: 'Language expansion', hint: 'How should the ecosystem propose, prioritise and contribute new assessment languages?' },
    { label: 'Learner-record scope', hint: 'Is the learner record minimal enough? Are there fields it should refuse to carry even under consent?' },
    { label: 'Something else in the whitepaper', hint: 'Any other section, principle or claim.' },
];

// ─── Limits ──────────────────────────────────────────────────────────────────

export const NAME_MAX = 120;
export const EMAIL_MAX = 160;
export const ORG_MAX = 160;
export const OTHER_MAX = 200;
export const LONG_MAX = 3000;
