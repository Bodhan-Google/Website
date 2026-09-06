// Copy and options for the FLN DPI interest form
// (/research/publication/fln-dpi/feedback; /fln-dpi redirects there).
// Edit here, not in the component. AREAS is mirrored server-side in
// scripts/apps-script/fln-dpi-feedback.js — keep both in sync, the backend
// rejects labels it does not recognise.
//
// Copy that describes the DPI is taken from the whitepaper "Digital Public
// Infrastructure for Foundational Literacy and Numeracy", v1.0.

export const PAGE_TITLE = 'FLN DPI & Bodhan Open Models – Interest Form | Bodhan.AI';

export const CONTACT_EMAIL = 'contact@bodhan.ai';

export const HEADLINE = 'FLN DPI: Interest & Feedback';

export const LEDE =
    'Thank you for joining us at the FLN Consortium (hosted by MoE) or the Bodhan AI: Ecosystem Consultation on Shared AI Infrastructure for Education (hosted by Gates Foundation). Tell us how you would like to contribute to building the FLN DPI, and share your feedback on the whitepaper.';

/** Rendered as a link at the end of the lede. */
export const LEDE_LINK_LABEL = 'Read the whitepaper';

export const TIME_NOTE = 'Takes about 3 minutes.';

export const ABOUT = [
    'Bodhan, a not-for-profit registered under Section 8 of the Companies Act, is proposing a digital public infrastructure (DPI) for foundational literacy and numeracy. It has three parts: shared AI capability services that any application can call; open standards — above all a common, versioned learner record — that make results comparable and portable; and thin trust rails for identity, consent, certification and audit.',
    'Bodhan builds no applications. The application layer belongs entirely to the ecosystem: any developer who meets the published certification bar may build assessment or practice applications, and every certified application is treated identically by the infrastructure.',
    'Three commitments anchor the design. States remain the data fiduciaries. The infrastructure is data-blind, and raw child audio is discarded once the assessment record is produced. And it is free at the point of use: no school, teacher or child ever pays.',
];

/** The document this consultation is about. The PDF lives on Google Drive,
 *  like the tender documents. Set `url` to '' to hide the link (the card then
 *  offers the contact email instead). */
export const WHITEPAPER = {
    title: 'Digital Public Infrastructure for Foundational Literacy and Numeracy',
    subtitle: 'A shared foundation of AI capability, open standards, and trust rails for the FLN ecosystem',
    version: 'Whitepaper · Version 1.0 · Public consultation · September 2026',
    url: 'https://drive.google.com/file/d/1POcPoWpDPz6SCBBnzmRNbwSv0w055xsk/view?usp=sharing',
    /** In-site summary page (the Publications entry). */
    summaryPath: '/research/publication/fln-dpi',
};

// ─── Contributing to the FLN DPI ─────────────────────────────────────────────

export const CONTRIBUTE_INTRO =
    'The FLN DPI spans AI capability services, open standards, trust rails, applications, and rollout. Pick every way you can help — broad strokes are fine, details and any feedback on the whitepaper go in the last question.';

/** One list covering both what you would work on and how (build, advise,
 *  deploy, contribute data, fund). Mirrored as AREAS in the Apps Script. */
export const AREAS = [
    { label: 'Vision, pedagogy and policy', hint: 'Domain expertise and advisory: FLN vision, learning outcomes, NEP/NIPUN alignment, policy frameworks' },
    { label: 'Standards and specifications', hint: 'Learner record schema, API specs, interoperability' },
    { label: 'Trust rails', hint: 'Identity, consent, security, data residency, audit' },
    { label: 'AI and assessment models', hint: 'Model building, benchmarks, evaluation' },
    { label: 'Applications and product', hint: 'Building assessment apps, practice apps, mobile apps' },
    { label: 'Rollout and field deployment', hint: 'State/school partnerships, teacher orientation, managed services and hosting, data reporting' },
    { label: 'Data or content contribution', hint: 'Speech and text corpora, reading passages, annotations' },
    { label: 'Funding / sponsorship', hint: 'Grants, sponsorship, in-kind support' },
];

export const OTHER_LABEL = 'Other';

// ─── Feedback on the whitepaper ─────────────────────────────────────────────

/** Section 21, "Open questions for consultation", verbatim headings. Shown in
 *  the side panel; responses go in "Tell us more". */
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
