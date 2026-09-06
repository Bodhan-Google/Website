import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';
import SectionHeading from './SectionHeading';
import Card from './Card';

import team1 from '../../../assets/team1.png';
import team2 from '../../../assets/team2.png';
import team3 from '../../../assets/team3.png';
import team4 from '../../../assets/team4.png';

const pillars = [
    {
        title: "System Capabilities",
        description: (
            <>
                <strong>Learning, Tutoring, Practice, and Assessment as a Unified System</strong>
                <br /><br />
                Bodhan will provide a set of interoperable system capabilities that support learning, practice, tutoring, and assessment across the classroom lifecycle. These capabilities will be designed to work together, rather than as standalone applications, enabling coherent learner journeys and consistent teacher workflows.
            </>
        ),
        bullets: [
            "Foundational literacy and numeracy diagnostics and remediation",
            "Just-in-time conversational academic support",
            "Curriculum-aligned instructional content with embedded interaction",
            "Adaptive practice and remediation driven by learner data",
            "Automated assessment and structured teacher feedback",
        ],
        image: team1
    },
    {
        title: "Foundational AI Assets",
        description: (
            <>
                <strong>Foundational AI Models for Education</strong>
                <br /><br />
                At the core of the system would be foundational AI models purpose-built for educational settings. These models will be developed and owned in-house, trained on classroom-grounded data, and optimized for pedagogy rather than general consumer use.
            </>
        ),
        bullets: [
            "Child speech diagnostics for fluency, pronunciation, and prosody",
            "Education- and STEM-aware speech recognition across Indian languages",
            "Handwritten and printed educational OCR, including mathematics and diagrams",
            "Pedagogy-aligned language models for explanation, tutoring, and question generation",
            "Empathetic text-to-speech designed for children",
        ],
        image: team2
    },
    {
        title: "Infrastructure",
        description: (
            <>
                <strong>Infrastructure That Turns AI into a Public Utility</strong>
                <br /><br />
                Bodhan will also build the scalable infrastructure required to operate AI systems reliably in real classrooms at scale. This layer abstracts complexity away from states and partners, allowing easy deployments across states.
            </>
        ),
        bullets: [
            "Training and fine-tuning pipelines for multilingual AI models",
            "Low-latency, voice-first inference and batch processing",
            "Unified data fabric with versioning, lineage, and access controls",
            "Compute abstraction across cloud, on-premise, and edge environments",
            "Orchestration of multi-step AI workflows",
        ],
        image: team3
    },
    {
        title: "Data & Deployment",
        description: (
            <>
                <strong>Data, Evidence, and Public Deployment</strong>
                <br /><br />
                All AI capabilities are grounded in large-scale, purpose-built educational data and deployed through formal public partnerships. Schools are treated as long-running system testbeds, not short-term pilots.
            </>
        ),
        bullets: [
            "Classroom-grounded speech, handwriting, and interaction data",
            "Multilingual and multi-dialect coverage",
            "Continuous feedback loops from live deployments",
            "Rigorous impact evaluation and evidence generation",
            "Capacity building for teachers and administrators",
        ],
        image: team4
    }
];

const WhatWeBuild = () => {
    return (
        <Container className="py-20 text-center">
            <SectionHeading
                title="What We Are Building"
                highlightWord="Building"
                subtitle="Bodhan is a foundational AI infrastructure for education designed to be adopted, extended, and governed within public systems."
                className="mb-8"
                parallax={true}
            />

            {/* Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {pillars.map((item, index) => (
                    <Card
                        key={index}
                        title={item.title}
                        description={item.description}
                        bullets={item.bullets}
                        image={item.image}
                        className="aspect-[3/5] md:aspect-[3/5] max-w-sm mx-auto w-full md:max-w-none"
                        panelClassName="p-4"
                        descriptionClassName="mt-2 text-xs leading-5 text-gray-600 space-y-2"
                    />
                ))}
            </div>

            {/* Entirely New Problems Section */}
            <div id="new-problems" className="mt-16 md:mt-40 max-w-4xl mx-auto scroll-mt-40">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4 leading-tight">
                    Entirely New Problems in<br />
                    <span className="text-[var(--text-orange-500)]">AI for Education</span>
                </h2>

                <p className="text-gray-600 text-base md:text-lg font-inter max-w-2xl mx-auto mb-8 leading-relaxed">
                    A comprehensive agenda of 200+ research problems across Speech, Language, Vision, and Learning technologies — designed to transform how Bharat learns, teaches, and thrives.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-y border-gray-200 py-6">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-inter font-bold text-[#FF6B35] mb-1">200+</span>
                        <span className="text-gray-500 font-inter font-medium uppercase tracking-wide text-xs">Research Problems</span>
                    </div>
                    <div className="flex flex-col items-center md:border-l md:border-r border-gray-200">
                        <span className="text-4xl font-inter font-bold text-[#FF6B35] mb-1">22+</span>
                        <span className="text-gray-500 font-inter font-medium uppercase tracking-wide text-xs">Indian Languages</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-inter font-bold text-[#FF6B35] mb-1">8</span>
                        <span className="text-gray-500 font-inter font-medium uppercase tracking-wide text-xs">Research Verticals</span>
                    </div>
                </div>

                <Link
                    to="/research/problems"
                    className="inline-block bg-[#1A1A1A] hover:bg-black text-white text-sm md:text-base font-medium py-2.5 px-6 md:py-3 md:px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    Explore Research Agenda
                </Link>
            </div>
        </Container>
    );
};

export default WhatWeBuild;
