/**
 * Publication entry for the whitepaper "Digital Public Infrastructure for
 * Foundational Literacy and Numeracy", v1.0, draft for public consultation.
 *
 * The prose below is a condensed reading of the whitepaper; the PDF is the
 * document of record and is linked from the hero and the closing call to
 * action. Feedback and interest go to the form at
 * /research/publication/fln-dpi/feedback.
 */

// The PDF lives on Google Drive, like the tender documents: a view link for
// reading in the browser, a direct-download link for the closing card.
const PDF_DRIVE_ID = '1POcPoWpDPz6SCBBnzmRNbwSv0w055xsk';
const PDF_URL = `https://drive.google.com/file/d/${PDF_DRIVE_ID}/view?usp=sharing`;
const PDF_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${PDF_DRIVE_ID}`;
const FORM_PATH = '/research/publication/fln-dpi/feedback';

export const flnDpiWhitepaperPost = {
    // ── 1. Hero ──────────────────────────────────────────────────────────
    slug: 'fln-dpi',
    title: 'Digital Public Infrastructure for Foundational Literacy and Numeracy',
    category: 'Publication',
    date: '2026-09-05',
    summary:
        'Whitepaper v1.0, published for public consultation: a shared foundation of AI '
        + 'capability services, open standards and thin trust rails for assessing and '
        + 'remediating early reading and arithmetic at population scale, operated by a '
        + 'non-profit that builds no applications. Feedback and expressions of interest are open.',
    featured: false,
    tagline:
        'A shared foundation of AI capability, open standards, and trust rails for the FLN ecosystem.',
    heroSummary:
        'India has set itself the goal of universal foundational literacy and numeracy. The binding '
        + 'constraint is not intent or content but the absence of reliable, frequent, affordable '
        + 'assessment of early reading and arithmetic at population scale, and of remediation that acts '
        + 'on what assessment finds. This whitepaper proposes a digital public infrastructure for FLN: '
        + 'shared AI capability services any application can call, a common versioned learner record, '
        + 'and thin trust rails for identity, consent, certification and audit. Version 1.0 is a draft '
        + 'for public consultation; nothing in it is final until it has survived that scrutiny.',
    heroLinks: [
        { label: '📄 Read the whitepaper (PDF)', href: PDF_URL, external: true },
        { label: '✎ Submit feedback or interest', href: FORM_PATH },
    ],
    specs: [
        { label: 'Version', value: '1.0' },
        { label: 'Status', value: 'Public consultation' },
        { label: 'Operator', value: 'Bodhan (Section 8)' },
        { label: 'Scope', value: 'FLN assessment & remediation' },
        { label: 'Data custody', value: 'States as fiduciaries' },
        { label: 'Cost in classroom', value: 'Free, permanently' },
    ],

    // Rendered after the article as a call-to-action card.
    cta: {
        title: 'Every element of this design is open to challenge.',
        description:
            'Section 21 lists the questions we are explicitly seeking input on: consent at population '
            + 'scale, the consent-manager function, the capacity bridge, offline operation, benchmark '
            + 'governance, language expansion and the scope of the learner record. Tell us what you think, '
            + 'or how you would like to contribute to building the FLN DPI or use Bodhan open models.',
        label: 'Submit feedback or interest',
        href: FORM_PATH,
        secondaryLabel: 'Download the PDF',
        secondaryHref: PDF_DOWNLOAD_URL,
    },

    sections: [
        // ── Executive summary, opened without a heading ──────────────────
        {
            id: 'summary',
            title: 'Executive summary',
            tocTitle: 'Executive summary',
            hideHeading: true,
            content: [
                'Recent advances in artificial intelligence make it possible to assess a child\'s oral reading and early numeracy automatically, in the child\'s own language, in an ordinary classroom. But this capability is difficult to build, and if every application developer must build it independently, and separately negotiate identity, consent, data handling and reporting with every state, the result will be fragmentation: incompatible assessments, unportable data, repeated bilateral negotiations, and avoidable risk to children\'s data.',
                'The infrastructure proposed here has three parts: **shared AI capability services** that any application can call; **open standards**, above all a common, versioned learner record, that make results comparable and portable; and **thin trust rails** (identity, consent, certification and audit) that let data move safely between participants without ever being owned by the infrastructure operator.',
                'Bodhan, a not-for-profit company registered under Section 8 of the Companies Act, builds and operates the AI capability services and the trust rails, authors the standards, and certifies applications. **Bodhan builds no applications.** The application layer belongs entirely to the ecosystem: any developer who meets the published certification bar may build assessment or practice applications, and every certified application is treated identically.',
                'Three commitments anchor the design. States remain the data fiduciaries: learner data belongs to the state education system and never transfers to Bodhan or to developers as an asset. The infrastructure is data-blind: it routes and audits what it cannot read, and raw child audio is discarded once the derived assessment record is produced. And it is free at the point of use: no school, teacher or child ever pays.',
            ],
        },

        // ── The problem ──────────────────────────────────────────────────
        {
            id: 'the-problem',
            title: 'The problem',
            content: [
                'Foundational learning fails quietly. A child who cannot yet decode text sits in a classroom where instruction has moved on, and the gap compounds year over year. The remedy is well understood, assess early, assess often, remediate at the level of the individual child, but the machinery to do this at population scale has never existed.',
                'Oral assessment of early reading is inherently one-on-one. Done manually it is expensive, slow and inconsistent across assessors, so it is done rarely, on samples rather than every child, and its results arrive too late to shape instruction. Where technology-based tools exist, they exist as islands: each defines its own scores, formats and reporting, and every deployment begins with a fresh bilateral negotiation over identity, data handling, residency and reporting.',
                'Underneath sits a legitimate anxiety: recordings of children\'s voices are the most sensitive kind of children\'s data, and education departments are rightly reluctant to hand them to private vendors. These are not application failures. They are systems failures, and systems failures require infrastructure.',
            ],
        },

        // ── Why infrastructure ───────────────────────────────────────────
        {
            id: 'why-infrastructure',
            title: 'Why infrastructure, not applications',
            content: [
                'A digital public infrastructure is a minimal set of shared building blocks on which an open ecosystem builds. It does as little as possible, but what it does, it does for everyone. The test of good infrastructure is what participants no longer have to think about:',
            ],
            bullets: [
                '**For an application developer:** authentication, consent handling, data-protection posture and the reporting format are defined once. A developer conforms once and is usable by any participating state without a single bilateral negotiation.',
                '**For a state:** replacing one certified application with another changes nothing about identity, residency, consent or reporting. The state changes the application; the contract with the infrastructure stays identical.',
            ],
            subsections: [
                {
                    title: 'The same separation, in digital payments',
                    content:
                        'India\'s Unified Payments Interface illustrates the pattern. A payment application integrates once with a shared switch operated by a non-profit utility and every bank becomes reachable; a bank integrates once and is reachable by every application. The switch routes money it never holds, and the operator sets the standards but does not compete with the applications built on them. This whitepaper applies the same separation, one integration, network-wide reach, a neutral operator, to foundational learning assessment.',
                },
            ],
        },

        // ── Design principles ────────────────────────────────────────────
        {
            id: 'design-principles',
            title: 'Design principles',
            content: [
                'Six principles, each of which resolves a question the rest of the design would otherwise have to answer case by case.',
            ],
            subsectionLayout: 'cards',
            subsections: [
                { title: 'Open by design', content: 'Every specification is published openly, and the AI models are open: weights, evaluation methodology and benchmark test sets, so quality claims are reproducible and no participant is locked in.' },
                { title: 'Neutral rails', content: 'The operator builds no applications and favours none. Every certified application gets identical API access, identical data access under identical consent rules, and identical treatment in the registry.' },
                { title: 'Minimal data', content: 'Custody and accountability are separated. The infrastructure routes what it cannot read; raw child audio is processed to a derived record and then discarded.' },
                { title: 'Conform once', content: 'One authentication scheme, one learner record schema, one consent protocol, one reporting format, verified at certification and never renegotiated per relationship.' },
                { title: 'Federal by design', content: 'National learning targets are enforced uniformly; state operational policy (residency, retention, purposes, reporting) is carried as machine-readable policy and enforced exactly as written; statutory obligations bind everyone.' },
                { title: 'Free at the point of use', content: 'The cost of building and serving the AI models is borne by the operator. State-specific costs, hosting, procurement, field operations, sit with states and partners, never with the classroom.' },
            ],
        },

        // ── Architecture ─────────────────────────────────────────────────
        {
            id: 'architecture',
            title: 'Architecture',
            content: [
                'The infrastructure is organised in four layers, and the division of labour is strict: the operator\'s responsibility ends where the application layer begins.',
            ],
            table: {
                headers: ['Layer', 'What it contains', 'Who builds and operates it'],
                rows: [
                    ['AI capability layer', 'Speech recognition tuned to children\'s oral reading; diagnostic scoring of accuracy, fluency and error patterns; early numeracy screening. Exposed only through versioned, published APIs.', 'Bodhan builds, operates and funds. Weights and benchmarks are open.'],
                    ['Trust rails', 'Identity resolution, consent management, schema and certification registries, audit logging, public-key infrastructure. Data-blind by construction.', 'Bodhan builds and operates.'],
                    ['Application layer', 'Assessment applications that produce learner records; practice applications that consume them and deliver targeted remediation.', 'Ecosystem developers, never Bodhan. Any developer meeting the certification bar.'],
                    ['Rollout layer', 'Programme management, school onboarding, teacher orientation, field support, feedback collection.', 'States and their delivery partners.'],
                ],
            },
            tableProps: {
                caption: 'Two artifacts bind the layers: the learner record (the output of every assessment and the input to every practice application and report) and the consent artifact (the authorisation under which any learner-level data moves).',
            },
            subsections: [
                {
                    title: 'One assessment, end to end',
                    content:
                        'A child reads a short passage aloud into a low-cost device running a certified assessment application. The audio streams to the shared speech-recognition service, which returns a faithful transcript including mispronunciations and omissions; the diagnostic service scores accuracy, fluency and error categories against the reference text. The application assembles a learner record conforming to the published schema, linked to the child\'s pseudonymous identifier and to the consent under which the assessment ran. The raw audio is then discarded. The record, not the recording, is what flows onward: to the teacher, to the state dashboard and, under consent, to a practice application.',
                },
            ],
        },

        // ── The learner record ───────────────────────────────────────────
        {
            id: 'learner-record',
            title: 'The learner record',
            content: [
                'The learner record is the single most important specification in the infrastructure: the versioned, open schema in which every assessment result is expressed. Because every certified assessment application emits it and every practice application and state reporting pipeline consumes it, results are comparable across applications, portable across vendors and aggregable across the state.',
            ],
            bullets: [
                '**Standards-mapped.** Every score maps to the grade-wise learning targets of the national FLN framework, so a proficiency band means the same thing in every district and every application.',
                '**Versioned with graceful degradation.** Optional fields are declared as such and every consumer tolerates their absence; a record produced before a new metric existed stays valid forever.',
                '**Pseudonymous.** The record carries a pseudonymous learner identifier, resolvable only within the state\'s own systems.',
                '**Consent-linked.** Every record references the consent artifact under which it was produced, making every downstream use traceable to an authorisation.',
                '**Longitudinal and portable.** Records accumulate into an assessment history with a defined export format. When a state changes applications, the history travels.',
            ],
        },

        // ── Trust rails ──────────────────────────────────────────────────
        {
            id: 'trust-rails',
            title: 'Identity, consent and custody',
            content: [
                'The trust rails are thin by design. Their job is to let data move safely between participants while the operator holds as little of it as possible.',
            ],
            subsections: [
                {
                    title: 'Identity: reuse before minting',
                    content:
                        'Learners are represented by a pseudonymous identifier derived from, and resolvable only through, the student identifiers the state already maintains, such as state student registers, UDISE+ or APAAR where adopted. The infrastructure never builds a competing child registry. Schools and teachers resolve through existing administrative identifiers; applications receive a cryptographic identity at certification, revocable the moment certification is.',
                },
                {
                    title: 'Consent: structured, signed, revocable',
                    content:
                        'No learner-level data moves without a consent artifact recording whose data, who is asking, for which state-defined purpose, covering which data classes, for how long, and how to revoke. Consent to assess and consent to improve the shared models are separate consents; declining the second changes nothing about the service. Consent is exercised by the guardian, no behavioural profiling is possible, and revocation propagates immediately with every step audit-logged.',
                },
                {
                    title: 'Custody: broker, do not store',
                    content:
                        'The state education department is the data fiduciary; Bodhan is a consent manager and at most a thin processor, never a fiduciary. Learner records at rest live in the state\'s environment, encrypted under keys the state holds, and the infrastructure passes payloads it cannot read. Where a state cannot yet run its own data plane, a managed capacity bridge hosts the records, and only the records, as an explicit, temporary arrangement with a migration path out.',
                },
            ],
        },

        // ── Certification and onboarding ─────────────────────────────────
        {
            id: 'certification',
            title: 'Certification and onboarding',
            content: [
                '"Play by the rules and the network is yours" is only meaningful if the rules are verified. A developer begins in a sandbox that mirrors production on synthetic data, builds to the published contracts, runs the public conformance suite, and then clears a certification review covering security posture, data handling and child safety. Certification is continuous, re-verified on a published cadence, and its status is always publicly checkable, which is what lets a state trust a developer it has never dealt with.',
                'A state joins in four steps, none of which is a negotiation: publish its operational policies as machine-readable artifacts, implement its data plane against the published framework (or elect the capacity bridge), select any certified applications on any procurement terms, and authorise each for defined learner cohorts. At the classroom, the design constraint is the teacher\'s time: assessments run within normal class time on the minimum viable device the framework defines.',
            ],
        },

        // ── Governance and cost ──────────────────────────────────────────
        {
            id: 'governance',
            title: 'Governance and cost',
            content: [
                'Bodhan holds a deliberately concentrated role, building the models, operating the rails and authoring the standards, because the capability to build state-of-the-art speech models for children\'s voices in many languages is far scarcer than the capability to build good applications. Concentration is made safe by structure, not promises: a Section 8 non-profit with no equity holders, building no applications, publishing everything it authors, operating only data-blind services, with every certification decision in a public registry and an appeals process. Standards evolve through a public request-for-comment process overseen by a standards council, and this whitepaper is its first artifact submitted for review.',
                'Public infrastructure must survive its operator: open weights, published specifications, escrowed tooling and a designated succession process make re-implementation possible and orderly. On cost, the allocation is explicit. Bodhan bears the cost of building and serving the models and operating the trust rails; states bear their own data plane and rollout; developers bear their applications. The classroom pays nothing, permanently.',
            ],
        },

        // ── What it does not do ──────────────────────────────────────────
        {
            id: 'what-it-does-not-do',
            title: 'What this infrastructure does not do',
            content: [
                'A DPI earns trust as much by its refusals as by its functions.',
            ],
            bullets: [
                '**It issues no civic credentials.** Learner records are instructional instruments, not credentials, and the infrastructure refuses their use for admission, selection or ranking of children.',
                '**It does not choose vendors.** Certification verifies conformance; it is not endorsement. Procurement judgement stays with states.',
                '**It does not monetize data.** No data on the infrastructure is sold, licensed or used commercially, by the operator or by any processor.',
                '**It does not author pedagogy or policy.** Learning targets belong to the national frameworks, operational policy to states, teaching to teachers.',
                '**It is not a general education DPI.** It is deliberately scoped to foundational literacy and numeracy assessment and remediation.',
            ],
        },

        // ── Open questions ───────────────────────────────────────────────
        {
            id: 'open-questions',
            title: 'Open questions for consultation',
            content: [
                'The following questions are genuinely open, and public input on them will shape Version 2. Responses are invited on any part of the document, and on these in particular:',
            ],
            bullets: [
                '**Consent at population scale.** What consent-capture mechanism best balances verifiable guardian consent with schools where guardians may be hard to reach? Should the state\'s role be broader or narrower?',
                '**The consent-manager function.** Should it be housed within Bodhan, or separated into a distinct regulated entity?',
                '**The capacity bridge.** Is managed hosting the right mechanism for states without immediate data-plane capacity, and what conditions should govern the migration out of it?',
                '**Offline and low-connectivity operation.** How much offline capability should the minimum classroom profile assume, and how should records synchronise without weakening consent and audit guarantees?',
                '**Benchmark governance.** Who, beyond the operator, should hold the pen on the public benchmarks, and should test sets be governed independently from the outset?',
                '**Language expansion.** What is the right process for the ecosystem to propose, prioritise and contribute new assessment languages?',
                '**Learner-record scope.** Is the learner record minimal enough? Are there fields it should refuse to carry even under consent?',
            ],
        },
    ],
};

export default flnDpiWhitepaperPost;
