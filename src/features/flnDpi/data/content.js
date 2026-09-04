// Copy and options for the /fln-dpi interest form. Edit here, not in the
// component. The option lists (ENGAGEMENT, AREAS, MODES, MODELS) are mirrored
// server-side in scripts/apps-script/fln-dpi-feedback.js — keep both in sync,
// the backend rejects labels it does not recognise.

export const PAGE_TITLE = 'FLN DPI & Bodhan Open Models – Interest Form | Bodhan.AI';

export const CONTACT_EMAIL = 'contact@bodhan.ai';

export const HEADLINE = 'FLN DPI & Bodhan Open Models';

export const LEDE =
    'Thank you for joining us at the FLN Consortium (hosted by MoE) or the Bodhan AI: Ecosystem Consultation on Shared AI Infrastructure for Education (hosted by Gates Foundation). Tell us how you would like to engage — using Bodhan open models (ASR, OCR, TTS), contributing to building the FLN DPI, or both.';

export const TIME_NOTE = 'Takes about 3 minutes; you will only see the sections relevant to you.';

export const ABOUT = [
    'Bodhan AI, the Centre of Excellence for AI in Education at IIT Madras, is building open AI models for Indian languages and, with partners, a Digital Public Infrastructure (DPI) for Foundational Literacy and Numeracy (FLN).',
    'The FLN DPI spans AI capability services, open standards, trust rails, applications, and rollout. It will only work as a shared effort, which is why we are asking who wants to build, advise, deploy, contribute data or fund it.',
];

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

// ─── Limits ──────────────────────────────────────────────────────────────────

export const NAME_MAX = 120;
export const EMAIL_MAX = 160;
export const ORG_MAX = 160;
export const OTHER_MAX = 200;
export const LONG_MAX = 3000;
