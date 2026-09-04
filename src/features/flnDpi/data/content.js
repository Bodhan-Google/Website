// Copy and options for the /fln-dpi consultation page. Edit here, not in the
// component. ROLES and TOPICS are mirrored server-side in
// scripts/apps-script/fln-dpi-feedback.js — keep the two lists in sync, the
// backend rejects values it does not recognise.

export const PAGE_TITLE = 'FLN & DPI Consultation | Bodhan.AI';

export const CONTACT_EMAIL = 'contact@bodhan.ai';

export const INTRO = [
    'Bodhan AI, the Centre of Excellence for AI in Education at IIT Madras, is examining how AI can support Foundational Literacy and Numeracy (FLN) for every child, and how Digital Public Infrastructure (DPI) for education can be built so that it is open, interoperable, inclusive and safe.',
    'As part of this exercise, we consider it important to learn from the experience and perspectives of everyone who works with young learners or builds the systems that serve them.',
    'Suggestions are therefore invited from students, parents, teachers, teacher educators, school leaders, education departments, technology and DPI builders, researchers, civil society and other interested stakeholders.',
    'The inputs received through this consultation will help shape Bodhan’s work on FLN and education DPI. We look forward to active and constructive participation.',
];

export const PROMPTS = [
    'What works, and what does not, in FLN classrooms today',
    'Where technology helps young learners and teachers, and where it gets in the way',
    'What a public digital infrastructure for education should, and should not, do',
    'Risks and safeguards around data, language, access and inclusion',
];

export const ROLES = [
    'Student',
    'Parent',
    'Teacher',
    'School leader / administrator',
    'Teacher educator',
    'Education department official',
    'EdTech / DPI builder',
    'Researcher / expert',
    'Civil society / NGO',
    'Organisation / institution',
    'Other',
];

export const TOPICS = [
    {
        id: 'fln',
        label: 'Foundational Literacy & Numeracy',
        hint: 'Early reading, writing and arithmetic for children up to Grade 3.',
    },
    {
        id: 'dpi',
        label: 'Digital Public Infrastructure',
        hint: 'Open, shared digital rails for education: identity, data, content, assessment.',
    },
    {
        id: 'both',
        label: 'Both / cross-cutting',
        hint: 'Where the two meet, or something that does not fit either box.',
    },
];

export const FEEDBACK_MIN = 20;
export const FEEDBACK_MAX = 5000;
export const NAME_MAX = 120;
export const EMAIL_MAX = 160;
export const ORG_MAX = 160;
