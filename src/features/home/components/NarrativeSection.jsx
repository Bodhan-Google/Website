import React from 'react';
// import { Users, Heart, Cpu, ShieldCheck } from 'lucide-react';
// import PillarCard from './PillarCard';

const NarrativeSection = () => {
    return (
        <div id="narrative" className="w-full bg-[var(--bg-black-900)] text-white pt-24 px-6 relative overflow-hidden ">
            <div className=" absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-gradient-to-b from-[var(--text-orange-500)]/20 to-transparent blur-3xl opacity-50 pointer-events-none"></div>

            <div className="max-w-5xl mx-auto flex flex-col items-center text-center z-10 relative px-2 py-6 md:p-10">
                {/* Headline */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight mb-6 md:mb-8">
                    Awakening how India
                    <br className="hidden md:block" />
                    <span className="text-[var(--text-orange-500)]"> learns</span>, <span className="text-[var(--text-orange-500)]">teaches</span>, and <span className="text-[var(--text-orange-500)]">grows</span>
                </h2>

                <p className="text-[var(--color-14)] font-inter text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 max-w-4xl">
                    <span className="font-semibold text-white">Bodhan AI - The Centre of Excellence in AI for Education</span> is an IIT Madras-incubated initiative supported by the Ministry of Education, building the <span className="font-semibold text-white">Bharat EduAI Stack as a sovereign Digital Public Infrastructure</span> . We are building sovereign, context-aware AI tools for learning and teaching, ensuring no demographic is left behind in India's digital transformation.
                </p>


                {/* Tagline */}
                {/* <p className="text-[var(--color-14)] font-inter text-xl leading-relaxed mb-12 max-w-4xl">
                    Bodhan.AI is not a product. It is a national capability.
                </p> */}
            </div>

            {/* Values Grid */}
            {/* <div className="max-w-[90%] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                <PillarCard
                    title="Built for India's Scale"
                    description="Education systems must work for millions at once, without breaking under complexity. Bodhan designs AI that can operate reliably across large populations and diverse learning environments."
                    icon={<Users className="text-[var(--text-orange-500)]" size={24} />}
                />
                <PillarCard
                    title="Rooted in Equity and Inclusion"
                    description="Language, location, and access should never be barriers to learning. Bodhan prioritises multilingual, context-aware systems that serve every learner and educator."
                    icon={<Heart className="text-[#FF6B35]" size={24} />}
                />
                <PillarCard
                    title="AI as Public Infrastructure"
                    description="Bodhan treats AI as shared national infrastructure, not proprietary tooling. The focus is on openness, interoperability, and long-term public value."
                    icon={<Cpu className="text-[#FF6B35]" size={24} />}
                />
                <PillarCard
                    title="Responsible by Design"
                    description="Trust matters in education. Bodhan builds explainable, auditable, and policy-aligned AI systems that institutions can adopt with confidence."
                    icon={<ShieldCheck className="text-[#FF6B35]" size={24} />}
                />
            </div> */}
        </div>
    );
};

export default NarrativeSection;
