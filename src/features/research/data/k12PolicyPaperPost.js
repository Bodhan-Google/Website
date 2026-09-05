/**
 * Publication entry for the CeRAI policy paper "AI and K-12 Education in India
 * and the Global South: Opportunities, Risks, and Policy Directions"
 * (Neethi S & Sriya Sridhar, August 2026).
 *
 * The prose below is a condensed reading of the paper's executive summary and
 * recommendations; the PDF on Google Drive is the document of record.
 */

// The PDF lives on Google Drive, like the tender documents: a view link for
// reading in the browser, a direct-download link for the closing card.
const PDF_DRIVE_ID = '1Qm5WDEx72fYRkGNNeVsNHp9APEwzC0Kg';
const PDF_URL = `https://drive.google.com/file/d/${PDF_DRIVE_ID}/view?usp=sharing`;
const PDF_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${PDF_DRIVE_ID}`;
const CERAI_URL = 'https://cerai.iitm.ac.in';

export const k12PolicyPaperPost = {
    // ── 1. Hero ──────────────────────────────────────────────────────────
    slug: 'ai-k12-education-policy-paper',
    title: 'AI and K-12 Education in India and the Global South: Opportunities, Risks, and Policy Directions',
    category: 'Publication',
    date: '2026-09-01',
    summary:
        'A CeRAI policy paper on making AI a genuine lever for equity in K-12 classrooms: where it '
        + 'demonstrably helps, the cognitive and pedagogical risks no safety audit catches, and '
        + 'recommendations for teachers, school systems, developers and regulators, organised around a '
        + 'systems standard.',
    featured: false,
    tagline:
        'AI in classrooms should scaffold teaching and learning, not substitute for them, and be adopted only where it demonstrably serves the child in front of it.',
    heroSummary:
        'Artificial intelligence can support learning outcomes for K-12 learners, but only when it supports '
        + 'teaching and educators\' judgment rather than replacing it, and only when it is built around the '
        + 'processes learning science already recognises as central to durable learning: diagnosing what a '
        + 'student knows, scaffolding just beyond their level, structuring retrieval practice, identifying '
        + 'specific misconceptions, and supporting progression toward mastery. The question this paper asks '
        + 'is not whether India and the Global South should adopt AI in classrooms, but how to make it a '
        + 'genuine lever for equity while protecting the autonomy of both students and teachers.',
    heroLinks: [
        ...(PDF_URL ? [{ label: '📄 Read the paper (PDF)', href: PDF_URL, external: true }] : []),
        { label: 'Centre for Responsible AI, IIT Madras', href: CERAI_URL },
    ],
    specs: [
        { label: 'Type', value: 'Policy paper' },
        { label: 'Authors', value: 'Neethi S · Sriya Sridhar' },
        { label: 'Publisher', value: 'CeRAI, IIT Madras' },
        { label: 'Published', value: 'August 2026' },
        { label: 'Length', value: '41 pages' },
        { label: 'Focus', value: 'K-12 · FLN · Global South' },
    ],

    ...(PDF_URL
        ? {
            cta: {
                title: 'Read the full paper.',
                description:
                    'The complete policy paper, with the evidence review, the age-tiered access model, and the '
                    + 'recommendations for each audience in full.',
                label: 'Download the PDF',
                href: PDF_DOWNLOAD_URL,
                secondaryLabel: 'About CeRAI',
                secondaryHref: CERAI_URL,
            },
        }
        : {}),

    sections: [
        // ── Executive summary, opened without a heading ──────────────────
        {
            id: 'summary',
            title: 'Executive summary',
            hideHeading: true,
            content: [
                'This paper examines the landscape of AI deployment in primary and secondary (K-12) education across India, informed by evidence from the broader Global South. Grounded in learning science and child-rights frameworks, it assesses how AI can act as an equaliser to narrow educational gaps, specifically in **Foundational Literacy and Numeracy (FLN)**, while establishing essential safeguards for student autonomy, data privacy and pedagogical integrity.',
                'Content personalisation alone does not meet the bar. The paper\'s overarching recommendation is that AI should be introduced only where there is a clearly identified educational need, a sound pedagogical rationale, appropriate teacher mediation, evidence of benefit, and adequate safeguards for equity, child rights and data protection. Solutions should be adopted not because the technology exists, but because they demonstrably serve the child in front of them.',
            ],
        },

        // ── Why equity ───────────────────────────────────────────────────
        {
            id: 'widening-divide',
            title: 'The equity case is urgent because the divide is widening',
            tocTitle: 'A widening divide',
            content: [
                'Global adoption data shows the Global North outpacing the Global South in access to generative AI by a widening margin, itself sitting inside a broader digital divide of electricity, connectivity and digital skills. Increased adoption does not automatically mean responsible adoption.',
                'Within India, around 5% of rural students had any access to online learning during the pandemic, and research on the Global South suggests generative AI tends to empower students who have already crossed a basic literacy threshold while leaving those who have not further behind. That is precisely the population India\'s own foundational learning gap is most concerned with: ASER 2024 shows nearly 45% of Class 5 students reading at a Class 2 level, and only 31% able to solve a basic division problem, a gap present in every state and rooted in the cumulative, hierarchical structure of mathematics itself.',
            ],
            stats: [
                { label: 'Rural students with online access during the pandemic', value: '~5%' },
                { label: 'Class 5 students reading at Class 2 level (ASER 2024)', value: '45%' },
                { label: 'Class 5 students able to do basic division (ASER 2024)', value: '31%' },
            ],
        },

        // ── Opportunities ────────────────────────────────────────────────
        {
            id: 'opportunities',
            title: 'Where AI can help',
            content: [
                '**Scaffolding, not substitution.** AI must supplement and scaffold human teaching, not replace critical thinking or educators. It is best deployed across four stages of the learning pathway: diagnosis of learning needs, selection of an activity matched to level rather than grade, guided practice with adaptive feedback, and reassessment and progression.',
                '**Workflow-based differentiation.** AI should streamline teachers\' administrative burden, progress tracking and lesson planning, while high-stakes assessment stays firmly under human judgment.',
                '**Differentiated evidence profiles.** Different kinds of AI system solve different problems, put the teacher in a different position, and rest on evidence bases of very different maturity:',
            ],
            subsectionLayout: 'cards',
            subsections: [
                { title: 'Adaptive learning systems', content: 'Strong localised evidence for mathematics remediation, with gains equivalent to nearly a full grade level in months.' },
                { title: 'AI-assisted diagnostics', content: 'Strong field evidence for oral reading fluency assessment and screening.' },
                { title: 'Generative and conversational tutors', content: 'High potential, with rapid gains in short pilots in Nigeria, but higher risks around accuracy, automation bias and cognitive over-reliance.' },
            ],
        },

        // ── Risks ────────────────────────────────────────────────────────
        {
            id: 'risks',
            title: 'Risks that no safety audit catches',
            tocTitle: 'Risks and open questions',
            content: [
                'The paper situates India\'s approach within the international children\'s-rights consensus built around the UN Convention on the Rights of the Child, General Comment No. 25 and UNICEF\'s Policy Guidance on AI for Children, and organises practical risk clusters around communication, transparency, continuous monitoring, child-centred design and teacher autonomy. It then identifies a distinct category of risk that only shows up in learning outcomes and behaviour over time, never in a one-off technical check.',
            ],
            bullets: [
                '**Cognitive and pedagogical risks.** Excessive scaffolding that prevents durable skill-building, cognitive offloading, answer dependence, and automation bias can impair learning and critical thinking.',
                '**Model and data risks.** General-purpose models trained predominantly on English-language, Global North data are poorly equipped for Indian curricula, languages and common misconceptions.',
                '**Child rights and safety.** Conversational systems risk creating emotional dependency or exposing minors to age-inappropriate content without proper guardrails; children\'s data protection and privacy must come first.',
            ],
        },

        // ── Systems standard ─────────────────────────────────────────────
        {
            id: 'systems-standard',
            title: 'Policy should be organised around a systems standard',
            tocTitle: 'A systems standard',
            content: [
                'A systems approach integrates technology in ways that align with local realities, fosters institutional collaboration, and treats curriculum, teacher development, assessment and governance as one connected system. Every intervention should be tested against whether it strengthens the system as a whole, starts from real classroom needs, and fits the Indian context rather than being imported wholesale. Rather than viewing the teacher and student in isolation, a systems perspective considers the impact on the community, society and educational values at large.',
                'Whether India and the rest of the Global South realise AI\'s potential in K-12 education will depend less on the sophistication of the technology, and more on policy choices around infrastructure, teacher support, child rights and equity of access.',
            ],
        },

        // ── Recommendations ──────────────────────────────────────────────
        {
            id: 'recommendations',
            title: 'Recommendations by audience',
            content: [
                'The recommendations are addressed to four audiences. Each set follows from the same test: does the measure strengthen the system, start from a real classroom need, and fit the Indian context?',
            ],
            subsections: [
                {
                    title: 'For teachers and school administrators',
                    bullets: [
                        '**Keep humans in the loop.** Retain human judgment for grading, emotional support and instructional selection across three loops: moment-to-moment teaching, planning and reflection, and tool selection.',
                        '**Structured capacity building.** Adopt UNESCO\'s AI Competency Framework for Teachers across its five dimensions (human-centred mindset, ethics, foundations, pedagogy, professional learning) rather than one-off technical workshops, with particular attention to ethics and pedagogy. AI Samarth offers a working framework.',
                    ],
                },
                {
                    title: 'For developers and researchers',
                    bullets: [
                        '**Child-centred, strengths-based design.** Child Rights Impact Assessments, transparent disclosure of non-human identity, and automated escalation to a human adult when distress is detected.',
                        '**Safety testing.** Extensive pre-deployment adversarial testing against child-safety matrices for hallucinations, implicit bias and toxic content tailored to minor age groups.',
                        '**Pedagogical alignment and multilinguality.** Inspectable, explainable models tailored to Indian languages and local learning progressions, moving beyond Global North benchmarks and accommodating code-switching, local idioms and context-specific curricula.',
                        '**Student-facing versus teacher-facing systems.** Student-facing systems are high-risk and must be guarded against answer-giving and over-scaffolding through Socratic questioning, real-time child-safety classification and age-appropriate guardrails. Teacher-facing co-pilots should streamline planning and administration while keeping diagnostic reasoning inspectable and the teacher in full authority over generated content.',
                    ],
                },
                {
                    title: 'For policymakers and regulators',
                    bullets: [
                        '**Enforce existing law.** The Digital Personal Data Protection Act 2023 and DPDP Rules 2025, including verifiable parental consent for children\'s data and a priority on confidentiality and privacy.',
                        '**Evidence standards and needs-based procurement.** Mandate rigorous, independent impact evaluations before scaling edtech platforms nationally, and use collective, needs-first procurement through Digital Public Infrastructure frameworks.',
                        '**Interoperability and digital public good status.** Promote AI tools as Digital Public Goods with open licensing to avoid vendor lock-in and foster sustainable, sovereign educational technology.',
                    ],
                },
            ],
        },

        // ── Age-tiered access model ──────────────────────────────────────
        {
            id: 'age-tiered-model',
            title: 'For school systems: an age-tiered access model',
            tocTitle: 'Age-tiered access model',
            content: [
                'Access to AI in school should widen with age, and each step should pair new permissions with the AI competency needed to use them well.',
            ],
            table: {
                headers: ['Stage', 'Access', 'Focus'],
                rows: [
                    ['Primary (Classes 1–5)', 'Teacher-mediated only', 'FLN diagnostics and adaptive support; AI concepts stay unplugged (computational thinking) per CBSE frameworks'],
                    ['Middle school (Classes 6–8)', 'Supervised', 'Approved no-code tools, gamified learning, foundational AI literacy: bias, data privacy, verifying output'],
                    ['Secondary (Classes 9–12)', 'Independent, regulated', 'Research, coding and project work, with assignments classed as AI-prohibited, permitted-with-disclosure, or AI-integrated'],
                ],
            },
            tableProps: { caption: 'Access permissions and AI-competency progression by school stage.' },
        },

        // ── About ────────────────────────────────────────────────────────
        {
            id: 'about',
            title: 'About the paper',
            content: [
                '**Dr. Neethi S** is Professor of Practice at the Wadhwani School of Data Science & AI, IIT Madras. **Sriya Sridhar** is Senior Policy Analyst at the Centre for Responsible AI (CeRAI), IIT Madras. The paper is published by CeRAI, a multi-disciplinary, non-profit research centre positioned in the Global South that specialises in both technical and policy research to enable the responsible development and deployment of AI systems.',
                'Recommended citation: S, Neethi & Sridhar, S. (2026, August). *AI and K-12 Education in India and the Global South: Opportunities, Risks, and Policy Directions.* Centre for Responsible AI, Indian Institute of Technology Madras.',
            ],
        },
    ],
};

export default k12PolicyPaperPost;
