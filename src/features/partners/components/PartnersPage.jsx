import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Mail } from 'lucide-react';
import iconIndia from '../../../assets/india-wordmark-black.png';
import iconHandshake from '../../../assets/handshake.png';
import iconAccessible from '../../../assets/accessible.png';
import iconCollective from '../../../assets/collective.png';
import iconServer from '../../../assets/server.png';
import iconTeacher from '../../../assets/teacher.png';
import iconCertificate from '../../../assets/certificate.png';
import iconMicrochip from '../../../assets/microchip.png';
import iconMobileApp from '../../../assets/mobile-app.png';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';

const principles = [
    {
        icon: <img src={iconAccessible} alt="Accessibility" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(52%) sepia(95%) saturate(600%) hue-rotate(351deg) brightness(108%)' }} />,
        title: 'Accessibility & Equity',
        description:
            'We build AI for learning that is accessible to all, fair to every learner, and personalized to their specific needs.',
    },
    {
        icon: <img src={iconIndia} alt="India" className="w-7 h-7 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(52%) sepia(95%) saturate(600%) hue-rotate(351deg) brightness(108%)' }} />,
        title: 'Rooted in India',
        description:
            'Our solutions are shaped by the unique linguistic and cultural context of India.',
    },
    {
        icon: <img src={iconHandshake} alt="Collaboration" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(52%) sepia(95%) saturate(600%) hue-rotate(351deg) brightness(108%)' }} />,
        title: 'Collaboration over Competition',
        description:
            'We choose to partner and collaborate rather than compete, acting as a force multiplier for the EdTech ecosystem.',
    },
    {
        icon: <img src={iconCollective} alt="Collective Impact" className="w-6 h-6 object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(52%) sepia(95%) saturate(600%) hue-rotate(351deg) brightness(108%)' }} />,
        title: 'Collective Impact',
        description:
            'We aim to amplify our impact through the collective effort of our partner network.',
    },
];

// Two standalone layers + one grouped block for shared DPI Partners
const layerGroups = [
    {
        type: 'single',
        layer: {
            number: '04',
            title: 'Implementation & Delivery',
            icon: iconTeacher,
            focusTags: ['Training', 'Rollout', 'Last-mile support'],
            partnerLabel: 'Govt | NGOs | EdTechs',
            partnerType: 'Roll-out Partners',
            bullets: [
                'Drive real world adoption through policy, training, roll-out and last-mile support',
                "Collect feedback based on Bodhan's framework.",
            ],
            accent: '#FF6B35',
            rowBg: '#FFF8F5',
        },
    },
    {
        type: 'single',
        layer: {
            number: '03',
            title: 'Application & Solution Layer',
            icon: iconMobileApp,
            focusTags: ['SEP / LSP Partners (Use-case & vertical)', 'Primary', 'Secondary', 'Higher', 'Skilling'],
            partnerLabel: 'Bodhan.AI | EdTechs',
            partnerType: 'Product Partners',
            bullets: [
                'Build EdTech solutions using the underlying AI IP developed by the CoE.',
                'Provide non-PII data of users along with technical and qualitative feedback to contribute to the core model.',
            ],
            accent: '#F97316',
            rowBg: '#FFFAF5',
        },
    },
    {
        type: 'group',
        groupLabel: 'DPI Partners',
        groupPartnerLabel: 'Bodhan.AI | Data Providers | Feedback Partners',
        groupAccent: '#314685',
        groupBullets: [
            'Quality ASR, OCR and TTS data for building foundational AI models.',
            'Systemic Feedback Loop: NGOs, Pedagogists who can guide us on system design based on the end-users.',
        ],
        layers: [
            {
                number: '02',
                title: 'AI Infrastructure Layer',
                icon: iconServer,
                focusTags: ['Model serving', 'Data Pipelines', 'Security', 'Edge / Cloud'],
                partnerSubLabel: null,
                bullets: [
                    'Ensure high-concurrency at low latency, optimizing 8B–30B parameter models for national scale',
                ],
                accent: '#314685',
                rowBg: '#F5F7FF',
            },
            {
                number: '01',
                title: 'Core AI Assets & Research IP',
                icon: iconCertificate,
                focusTags: ['ASR', 'TTS', 'OCR', 'Reasoning', 'Diagnostics', 'Public Good Aligned, Select Partners'],
                partnerSubLabel: 'Public Good Aligned / Select Partners',
                bullets: [
                    'Quality ASR, OCR and TTS data for building foundational AI models',
                    'Systemic Feedback Loop: NGOs, Pedagogists who can guide us on system design based on end-users',
                ],
                accent: '#1D4ED8',
                rowBg: '#F5F8FF',
            },
            {
                number: '00',
                title: 'Foundational Research Layer',
                icon: iconMicrochip,
                focusTags: ['Learning Sciences', 'Linguistics', 'AI SOTA', 'India Scale', 'Equity First', 'Multilingual'],
                partnerSubLabel: 'Research Institutions & Subject Matter Experts',
                bullets: [
                    'Ensure AI is grounded in the science of how children learn',
                    'Support multi-constituent languages and foundational literacy at India scale',
                ],
                accent: '#0F172A',
                rowBg: '#F8F9FA',
            },
        ],
    },
];

// Scalable curly brace — stretches to full height of its flex container
const CurlyBrace = ({ color = '#94A3B8' }) => (
    <div className="self-stretch flex flex-col items-end w-10 mx-2 py-1">
        <div className="flex-1 rounded-tr-2xl" style={{ width: 22, borderTop: `2.5px solid ${color}`, borderRight: `2.5px solid ${color}` }} />
        <svg width="20" height="16" viewBox="0 0 20 16" style={{ marginRight: -1 }}>
            <path d="M0 8 L12 1 L12 15 Z" fill={color} />
        </svg>
        <div className="flex-1 rounded-br-2xl" style={{ width: 22, borderBottom: `2.5px solid ${color}`, borderRight: `2.5px solid ${color}` }} />
    </div>
);

// Solid filled upward arrow matching the reference infographic style
const SolidArrow = ({ color = '#4A6CB8' }) => (
    <svg width="42" height="54" viewBox="0 0 42 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 0L42 26H29V54H13V26H0L21 0Z" fill={color} />
    </svg>
);

// In-flow arrow connector — sits between row cards, centered within left column
const ArrowConnector = ({ animIndex }) => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: animIndex * 0.07 + 0.2 }}
        className="flex h-16"
    >
        <div className="w-5/12 flex items-center justify-center">
            <SolidArrow />
        </div>
        <div className="flex-1" />
    </motion.div>
);

// Left identity panel — centered number | divider | title + pills | icon
const LayerLeftPanel = ({ layer }) => (
    <div className="flex items-center gap-4 px-5 py-5 min-h-[120px] h-full flex-1">
        <span
            className="text-4xl font-bold font-syne w-14 text-center flex-shrink-0 leading-none"
            style={{ color: layer.accent }}
        >
            {layer.number}
        </span>
        <div className="w-px self-stretch bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-800 leading-snug mb-2">{layer.title}</p>
            <p className="text-sm text-gray-500 leading-relaxed">
                {layer.focusTags.join(' | ')}
            </p>
        </div>
        <img src={layer.icon} alt="" className="flex-shrink-0 w-16 h-16 object-contain" />
    </div>
);

// Single-layer row — left card + right card side by side
const SingleRow = ({ group, animIndex }) => {
    const { layer } = group;
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: animIndex * 0.07 }}
            className="flex gap-4 items-stretch"
        >
            {/* Left card */}
            <div
                className="w-5/12 shrink-0 rounded-2xl overflow-hidden flex flex-col"
                style={{
                    background: `linear-gradient(160deg, #ffffff 0%, ${layer.accent}18 100%)`,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
                    border: `1px solid ${layer.accent}25`,
                    borderLeft: `4px solid ${layer.accent}`,
                }}
            >
                <LayerLeftPanel layer={layer} />
            </div>
            <CurlyBrace color={layer.accent} />
            {/* Right content — plain text, no box */}
            <div className="flex-1 px-4 py-2 flex flex-col justify-center">
                {layer.partnerType && (
                    <p className="text-xl font-bold text-gray-900 mb-1">{layer.partnerType}</p>
                )}
                <p className="text-sm text-gray-500 mb-3">{layer.partnerLabel}</p>
                <ul className="space-y-1.5">
                    {layer.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                            <span className="flex-shrink-0 text-gray-500 mt-0.5">•</span>
                            {b}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

// Grouped row — each of layers 02/01/00 is its own card on the left,
// while the right is a single card stretching to match the full height
const GroupedRows = ({ group, startAnimIndex }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: startAnimIndex * 0.07 }}
        className="flex gap-4 items-stretch"
    >
        {/* Left: individual layer cards with arrows between them */}
        <div className="w-5/12 shrink-0 flex flex-col">
            {group.layers.map((layer, i) => (
                <React.Fragment key={layer.number}>
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: `linear-gradient(160deg, #ffffff 0%, ${layer.accent}18 100%)`,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
                            border: `1px solid ${layer.accent}25`,
                            borderLeft: `4px solid ${layer.accent}`,
                        }}
                    >
                        <LayerLeftPanel layer={layer} />
                    </div>
                    {i < group.layers.length - 1 && (
                        <div className="h-16 flex items-center justify-center flex-shrink-0">
                            <SolidArrow />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>

        <CurlyBrace color={group.groupAccent} />
        {/* Right: plain text, no box */}
        <div className="flex-1 px-4 py-2 flex flex-col justify-center">
            <p className="text-xl font-bold text-gray-900 mb-1">{group.groupLabel}</p>
            <p className="text-sm text-gray-500 mb-3">{group.groupPartnerLabel}</p>
            <ul className="space-y-2">
                {group.groupBullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700 leading-relaxed">
                        <span className="flex-shrink-0 text-gray-500 mt-0.5">•</span>
                        {b}
                    </li>
                ))}
            </ul>
        </div>
    </motion.div>
);

const PartnersPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-[var(--bg-black-900)]">
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20"
                        style={{
                            background: 'radial-gradient(ellipse at center, #FF6B35 0%, transparent 70%)',
                            filter: 'blur(60px)',
                        }}
                    />
                </div>
                <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/70 text-xs font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase"
                    >
                        <Layers size={13} />
                        Bharat EduAI Stack
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight"
                    >
                        Building Together for{' '}
                        <span className="text-[var(--text-orange-500)]">Every Learner</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/70 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto text-justify"
                    >
                        At Bodhan, we believe that delivering equal learning opportunities to every child in India
                        is a mission too vast for any single entity to achieve in isolation. Our strategy is anchored
                        in the Bharat EduAI Stack, a next generation Digital Public Infrastructure that enables an
                        open and collaborative ecosystem.
                    </motion.p>
                </div>
            </div>

            {/* Vision & Principles Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-orange-500)] mb-3 block">
                        Our Vision & Principles
                    </span>
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-4">
                        The Goal
                    </h2>
                    <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                        Our primary objective is to collaborate with a diverse network of partners to reach every
                        school in India, ensuring no learner is left behind.
                    </p>
                </motion.div>

                {/* Principles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {principles.map((p, i) => (
                        <motion.div
                            key={p.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--text-orange-500)] mb-4">
                                {p.icon}
                            </div>
                            <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">{p.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bharat EduAI Stack Section */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-orange-500)] mb-3 block">
                            Partnership Framework
                        </span>
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A] mb-4">
                            The 5-Layer Bharat EduAI Stack
                        </h2>
                        <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                            We will be engaging with partners across five distinct layers of the Bharat EduAI Stack,
                            ranging from foundational research to last-mile delivery.
                        </p>
                    </motion.div>

                    {/* Stack — individual cards with in-flow arrow connectors */}
                    <div className="flex flex-col">
                        {layerGroups.map((group, gi) => {
                            const animIndex = layerGroups.slice(0, gi).reduce(
                                (acc, g) => acc + (g.type === 'group' ? g.layers.length : 1), 0
                            );
                            const isLastGroup = gi === layerGroups.length - 1;

                            return (
                                <React.Fragment key={gi}>
                                    {group.type === 'single' ? (
                                        <SingleRow group={group} animIndex={animIndex} />
                                    ) : (
                                        <GroupedRows group={group} startAnimIndex={animIndex} />
                                    )}
                                    {!isLastGroup && <ArrowConnector animIndex={animIndex} />}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Foundation label */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-4 flex items-center justify-center gap-3"
                    >
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Foundation
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </motion.div>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="relative overflow-hidden bg-[var(--bg-black-900)]">
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-15"
                        style={{
                            background: 'radial-gradient(ellipse at center, #FF6B35 0%, transparent 70%)',
                            filter: 'blur(50px)',
                        }}
                    />
                </div>
                <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-10 text-left"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center text-[var(--text-orange-500)]">
                                <Mail size={22} />
                            </div>
                            <p className="text-white/80 text-xl font-medium">Reach us at</p>
                        </div>

                        <a
                            href="mailto:contact@bodhan.ai"
                            className="text-xl md:text-2xl font-semibold text-[var(--text-orange-500)] hover:underline break-all"
                        >
                            contact@bodhan.ai
                        </a>

                        <p className="text-white/50 text-sm mt-5 mb-4">with the following information:</p>

                        <ul className="space-y-2.5">
                            {['Name', 'Organization', 'Contact details', 'Message'].map((field) => (
                                <li key={field} className="flex items-center gap-3 text-white/70 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-orange-500)] flex-shrink-0" />
                                    {field}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PartnersPage;
