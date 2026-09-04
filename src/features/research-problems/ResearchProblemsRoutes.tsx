import React, { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams, Navigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Layers,
  Clock,
  Mic, Volume2, Brain, ScanText, Languages, ShieldCheck, Target
} from 'lucide-react';
import { RESEARCH_VERTICALS, PILLARS, VISION_STATEMENT, PRINCIPLES, GRAND_CHALLENGES } from './data';
import { Breadcrumbs } from './components/Breadcrumbs';
import { VerticalTheme, ResearchProblem } from './types';

export const RESEARCH_PROBLEMS_BASE = '/research/problems';
const RESEARCH_AGENDA_ID = 'research-agenda';

const scrollToResearchAgenda = (event?: React.MouseEvent) => {
  event?.preventDefault();
  document.getElementById(RESEARCH_AGENDA_ID)?.scrollIntoView({ behavior: 'smooth' });
};

// --- Theme Helper ---
const THEME_COLORS: Record<VerticalTheme, string> = {
  orange: 'text-bodhan-orange',
  teal: 'text-bodhan-teal',
  purple: 'text-bodhan-purple',
  yellow: 'text-bodhan-yellow',
  blue: 'text-bodhan-blue',
  red: 'text-bodhan-red',
  indigo: 'text-bodhan-indigo',
  green: 'text-bodhan-green',
  aqua: 'text-bodhan-aqua',
  cyan: 'text-bodhan-cyan',
  magenta: 'text-bodhan-magenta',
  amber: 'text-bodhan-amber',
  rose: 'text-bodhan-rose',
};

const THEME_BG_HOVER: Record<VerticalTheme, string> = {
  orange: 'hover:border-bodhan-orange/50',
  teal: 'hover:border-bodhan-teal/50',
  purple: 'hover:border-bodhan-purple/50',
  yellow: 'hover:border-bodhan-yellow/50',
  blue: 'hover:border-bodhan-blue/50',
  red: 'hover:border-bodhan-red/50',
  indigo: 'hover:border-bodhan-indigo/50',
  green: 'hover:border-bodhan-green/50',
  aqua: 'hover:border-bodhan-aqua/50',
  cyan: 'hover:border-bodhan-cyan/50',
  magenta: 'hover:border-bodhan-magenta/50',
  amber: 'hover:border-bodhan-amber/50',
  rose: 'hover:border-bodhan-rose/50',
};

const THEME_SOFT_BG: Record<VerticalTheme, string> = {
  orange: 'bg-bodhan-orange/10 text-bodhan-orange',
  teal: 'bg-bodhan-teal/10 text-bodhan-teal',
  purple: 'bg-bodhan-purple/10 text-bodhan-purple',
  yellow: 'bg-bodhan-yellow/15 text-bodhan-yellow',
  blue: 'bg-bodhan-blue/10 text-bodhan-blue',
  red: 'bg-bodhan-red/10 text-bodhan-red',
  indigo: 'bg-bodhan-indigo/10 text-bodhan-indigo',
  green: 'bg-bodhan-green/10 text-bodhan-green',
  aqua: 'bg-bodhan-aqua/10 text-bodhan-aqua',
  cyan: 'bg-bodhan-cyan/10 text-bodhan-cyan',
  magenta: 'bg-bodhan-magenta/10 text-bodhan-magenta',
  amber: 'bg-bodhan-amber/10 text-bodhan-amber',
  rose: 'bg-bodhan-rose/10 text-bodhan-rose',
};

const THEME_BORDER: Record<VerticalTheme, string> = {
  orange: 'border-bodhan-orange/30',
  teal: 'border-bodhan-teal/30',
  purple: 'border-bodhan-purple/30',
  yellow: 'border-bodhan-yellow/30',
  blue: 'border-bodhan-blue/30',
  red: 'border-bodhan-red/30',
  indigo: 'border-bodhan-indigo/30',
  green: 'border-bodhan-green/30',
  aqua: 'border-bodhan-aqua/30',
  cyan: 'border-bodhan-cyan/30',
  magenta: 'border-bodhan-magenta/30',
  amber: 'border-bodhan-amber/30',
  rose: 'border-bodhan-rose/30',
};

const CHALLENGE_ICONS: Record<string, React.ElementType> = {
  Mic,
  Volume2,
  ScanText,
  Brain,
  Target
};

const GRAND_CHALLENGE_BLOG: Record<string, { markdown: string; }> = {
  "on-device-systems": {
  markdown: [
    "## **The Grand Challenge – Making AI for Education work for the “real” India**",
    "",
    "There is a certain kind of AI demo that works beautifully on stage.",
    "And then there is the reality.",
    "",
    "Here, learning often happens under strict technical constraints: intermittent connectivity, low bandwidth, shared devices, and entry-level smartphones with limited compute, memory, and battery capacity. If we are serious about **AI for education in India**, then we must confront a difficult truth:",
    "",
    "> *“The hardest and most important AI problems are not the flashiest ones.",
    "> They are the ones that must work reliably, and most importantly locally.”*",
    "",
    "This opinion piece is about one such problem. Not a solution. Not a roadmap.",
    "But a **grand challenge worth naming and pursuing**.",
    "",
    "---",
    "",
    "### **On-Device AI and Low-Bandwidth Learning: A Grand Challenge for Education in India**",
    "",
    "Much of the current excitement around AI is shaped by demonstrations that assume ideal conditions: stable internet, powerful servers, and seamless cloud access. These assumptions are so common that they often go unquestioned. Yet when we shift our attention to the on-ground realities, especially to how and where learning actually happens, these assumptions begin to collapse. For a large share of learners, connectivity is inconsistent, devices are modest, and the cost of data is a real constraint. In this context, the central problem is not how sophisticated and powerful educational AI can become, but whether it can function at all when removed from the cloud.",
    "",
    "---",
    "",
    "### **When the Cloud Assumption Breaks**",
    "",
    "This is why on-device AI operating under low-bandwidth conditions should be seen as a grand challenge for AI in education in India. It is not a peripheral deployment issue or an engineering detail to be addressed later. It is the core problem that determines whether AI systems can meaningfully participate in the educational ecosystem at scale.",
    "",
    "Learning in India frequently takes place on low-end smartphones with limited memory, constrained compute, and finite battery life. Internet access may exist, but it is often intermittent, slow, or shared across multiple users. In such settings, an educational AI system that relies on constant server communication becomes fragile. Each dropped connection interrupts the learning flow. Each delay reduces trust. Over time, systems that fail under these conditions simply stop being used.",
    "",
    "---",
    "",
    "### **The Systems Problem We Underestimate**",
    "",
    "An on-device approach fundamentally changes this equation. It requires key capabilities — ASR, TTS, Translation, and basic understanding — to run locally, without depending on continuous network access. This shift is deceptively difficult. Running even a single speech model on-device is challenging; running multiple components together, in real time, on constrained hardware is a much harder systems problem. Memory contention, thermal limits, latency, and energy consumption all become first-order concerns rather than background optimizations.",
    "",
    "Low-bandwidth environments further complicate matters. These settings are not the same as fully offline scenarios. Connectivity may appear briefly and disappear again. Certain operations may work while others fail. Educational systems must therefore be designed to operate fully without the network, while also being able to take advantage of it opportunistically when it becomes available. This requires careful architectural thinking around caching, synchronization, and graceful degradation, none of which are solved automatically by scaling models down.",
    "",
    "---",
    "",
    "### **Why Education Raises the Bar**",
    "",
    "Education amplifies these challenges. Errors that might be acceptable in other applications become costly when learning is involved, especially with children. A delayed response can break concentration. A transcription error can change meaning. A poorly chosen next step can confuse rather than support. Educational AI systems must therefore meet a higher bar for reliability and consistency, even when operating under severe constraints. Achieving this on-device is substantially harder than achieving high benchmark performance in controlled environments.",
    "",
    "Crucially, this is not a problem that can be solved after the fact. Models and systems designed with cloud assumptions tend to encode those assumptions deeply, in their architectures, interfaces, and evaluation methods. Retrofitting them for edge deployment often leads to brittle compromises. Treating on-device, low-bandwidth operation as a primary constraint from the outset forces different research questions: how to trade off accuracy against latency, how to measure usefulness rather than raw performance, and how to design systems that fail safely rather than abruptly.",
    "",
    "---",
    "",
    "### **More Than a Technical Constraint**",
    "",
    "If this challenge is addressed seriously, the benefits extend well beyond technical elegance. Educational AI that works reliably on-device can reach learners regardless of connectivity, reduce dependence on costly infrastructure, and offer stronger privacy guarantees by keeping data local. Most importantly, it aligns technology with the realities of learners rather than asking learners to adapt to technology.",
    "",
    "For these reasons, on-device AI under low-bandwidth conditions deserves to be recognized as a grand challenge for AI in education in India. It is difficult, slow to solve, and resistant to shortcuts. Yet it directly determines whether AI will remain a technology optimized for ideal conditions, or become one that supports learning where conditions are far from ideal. Naming and centering this challenge is an essential first step toward building educational systems that are genuinely inclusive and robust."
  ].join("\n")
}

};

// --- Components ---

// const Button: React.FC<{
//   variant?: 'primary' | 'secondary' | 'outline';
//   children: React.ReactNode;
//   onClick?: () => void;
//   href?: string;
//   className?: string;
// }> = ({ variant = 'primary', children, onClick, href, className = '' }) => {
//   const baseStyles = "relative inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream-100 overflow-hidden whitespace-nowrap";
//   const variants = {
//     primary: "text-white bg-gradient-to-b from-charcoal-700 to-charcoal-900 focus:ring-charcoal-800",
//     secondary: "text-white bg-gradient-to-b from-charcoal-700 to-charcoal-900 focus:ring-charcoal-800",
//     outline: "text-gray-900 bg-gradient-to-b from-charcoal-300 to-charcoal-500 focus:ring-gray-400"
//   };
//   const innerBg = {
//     primary: "bg-charcoal-800",
//     secondary: "bg-charcoal-800",
//     outline: "bg-cream-100"
//   };

//   if (href) {
//     return (
//       <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
//         <span className={`absolute inset-[1px] rounded-[7px] ${innerBg[variant]}`} />
//         <span className="relative z-10">{children}</span>
//       </a>
//     );
//   }

//   return (
//     <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
//       <span className={`absolute inset-[1px] rounded-[7px] ${innerBg[variant]}`} />
//       <span className="relative z-10">{children}</span>
//     </button>
//   );
// };

const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}> = ({ variant = 'primary', children, onClick, href, className = '' }) => {
  // Added 'whitespace-nowrap' and 'flex-shrink-0'
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden whitespace-nowrap flex-shrink-0";
  
  const variants = {
    primary: "text-white bg-charcoal-900 focus:ring-charcoal-800",
    secondary: "text-white bg-charcoal-900 focus:ring-charcoal-800",
    outline: "text-gray-900 bg-charcoal-300 focus:ring-gray-400"
  };

  const innerBg = {
    primary: "bg-charcoal-800",
    secondary: "bg-charcoal-800",
    outline: "bg-cream-100"
  };

  const content = (
    <>
      <span className={`absolute inset-[1px] rounded-[7px] ${innerBg[variant]}`} />
      {/* Added flex and items-center here to force horizontal alignment */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {content}
    </button>
  );
};

// --- Home Page Components ---

const HeroSection = () => {
    return (
        <div className="relative min-h-[90vh] flex items-center bg-cream-100 overflow-hidden py-10 sm:py-14 lg:py-16">
            <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-cream-100 to-[#F3E6D6] opacity-70"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Content */}
                    <div className="animate-fade-in pb-8 sm:pb-10 lg:pb-4">
                         <div className="inline-flex flex-wrap items-center justify-center sm:justify-start max-w-full px-3 sm:px-4 py-2 rounded-full border border-black/10 bg-black/5 text-gray-600 text-sm sm:text-base font-medium leading-snug mb-8 text-center sm:text-left">
                            Building India's Future, One Learner at a Time
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-[1.1] mb-8">
                            Open Research <br />
                            <span className="text-bodhan-orange italic">Problems in</span> <br />
                            AI for Education
                        </h1>
                        
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed mb-10 font-light">
                            A comprehensive agenda of 200+ research problems across Speech, Language, Vision, and Learning technologies — designed to transform how Bharat learns, teaches, and thrives.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 mb-12 max-w-xl sm:mx-0">
                            <div className="text-center">
                                <div className="text-5xl text-bodhan-orange font-serif font-bold mb-1">200+</div>
                                <div className="text-[13px] text-gray-500 tracking-wider uppercase font-medium sm:whitespace-nowrap">Research Problems</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl text-bodhan-orange font-serif font-bold mb-1">22+</div>
                                <div className="text-[13px] text-gray-500 tracking-wider uppercase font-medium sm:whitespace-nowrap">Indian Languages</div>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl text-bodhan-orange font-serif font-bold mb-1">8</div>
                                <div className="text-[13px] text-gray-500 tracking-wider uppercase font-medium sm:whitespace-nowrap">Research Verticals</div>
                            </div>
                        </div>

                         <Button onClick={scrollToResearchAgenda} className="group w-full sm:w-auto">
                            Explore Problems <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {/* Abstract Graphic */}
                    <div className="hidden lg:block relative h-[500px] w-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <img
                                src="https://raw.githubusercontent.com/safikhanSoofiyani/safikhanSoofiyani.github.io/refs/heads/master/assets/Icon.png"
                                alt="Bodhan Leaf"
                                className="w-[580px] h-[580px] object-contain drop-shadow-[0_20px_60px_rgba(255,98,7,0.25)]"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

const VisionSection = () => {
    return (
        <div id="vision" className="py-24 text-white">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-bodhan-orange text-xl font-bold tracking-[0.2em] uppercase mb-4 block">Our Vision</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-white max-w-4xl mx-auto leading-tight">
                        An AI Copilot for Every Learner, Teacher, and Policymaker
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {PILLARS.map((pillar, idx) => (
                        <div key={idx} className="bg-charcoal-800/80 rounded-3xl p-10 border border-white/10 hover:border-bodhan-orange/40 transition-all duration-300">
                             <div className="w-12 h-12 rounded-xl bg-charcoal-700 flex items-center justify-center mb-8 border border-white/10">
                                {idx === 0 ? <Layers className="text-bodhan-orange w-8 h-8" /> : <Clock className="text-bodhan-orange w-8 h-8" />}
                             </div>
                             <h3 className="text-2xl font-serif text-white mb-6">{pillar.title}</h3>
                             <p className="text-gray-200 leading-relaxed mb-6">
                                {pillar.description}
                             </p>
                        </div>
                    ))}
                </div>

                {/* <div className="bg-charcoal-800 rounded-3xl p-10 md:p-16 border-l-4 border-bodhan-orange relative overflow-hidden">
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <p className="text-xl md:text-2xl font-serif italic text-white leading-relaxed mb-6">
                            "This is not merely a technology initiative. It is a systemic transformation of how Bharat learns, teaches, evaluates, and builds digital capacity."
                        </p>
                        <p className="text-sm text-gray-400 tracking-wider uppercase">
                            — Aligned with NEP 2020 and Viksit Bharat @2047
                        </p>
                    </div>
                </div> */}
             </div>
        </div>
    )
}

const PrinciplesSection = () => {
    const [openIndex, setOpenIndex] = useState<number>(-1);

    return (
        <div id="principles" className="py-24 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                     <span className="text-bodhan-orange text-xl font-bold tracking-[0.2em] uppercase mb-4 block">Research Principles</span>
                     <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">The Sutras</h2>
                     <p className="text-gray-200 text-lg">The non-negotiable principles that guide every decision we make.</p>
                </div>

                <div className="space-y-2">
                    {PRINCIPLES.map((principle, idx) => (
                        <div 
                            key={principle.id} 
                            className={`rounded-2xl transition-all duration-300 overflow-hidden ${openIndex === idx ? 'bg-charcoal-800 border border-white/10' : 'bg-transparent border-b border-white/10'}`}
                        >
                            <button 
                                onClick={() => setOpenIndex(idx === openIndex ? -1 : idx)}
                                className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="w-12 h-12 rounded-lg bg-bodhan-orange text-white text-xl font-bold flex items-center justify-center shrink-0">
                                        {principle.id}
                                    </span>
                                    <h3 className={`text-lg md:text-xl font-serif italic ${openIndex === idx ? 'text-bodhan-orange' : 'text-white'}`}>
                                        {principle.title}
                                    </h3>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === idx ? 'bg-bodhan-orange text-gray-900' : 'bg-charcoal-700 text-white'}`}>
                                    {openIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </button>
                            
                            <div className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-6 pb-8 md:px-8 md:pb-8 pl-16 md:pl-20 border-l-2 border-bodhan-teal/50 ml-8 md:ml-10 mb-6">
                                    <p className="text-white leading-relaxed">
                                        {principle.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const GrandChallengesSection = () => {
    return (
        <section id="grand-challenges" className="py-24 bg-cream-100 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 right-0 w-80 h-80 bg-bodhan-orange/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 left-0 w-80 h-80 bg-bodhan-teal/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">The Grand Challenge</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
                    {GRAND_CHALLENGES.map((challenge) => {
                        const Icon = CHALLENGE_ICONS[challenge.iconName] ?? Target;

                        return (
                            <Link
                                key={challenge.id}
                                to={`${RESEARCH_PROBLEMS_BASE}/grand-challenge/${challenge.id}`}
                                className={`group bg-white/90 backdrop-blur rounded-3xl p-8 border ${THEME_BORDER[challenge.theme]} shadow-sm hover:shadow-lg transition-all duration-300`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${THEME_SOFT_BG[challenge.theme]}`}>
                                        <Icon size={36} />
                                    </div>
                                    <span className={`text-xl font-bold uppercase tracking-[0.2em] ${THEME_COLORS[challenge.theme]}`}>
                                        {challenge.vertical}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-serif text-gray-900 mb-3">{challenge.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {challenge.description}
                                </p>

                                {/* <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-gray-400">
                                    <span>Grand Challenge</span>
                                    <span className={`font-bold ${THEME_COLORS[challenge.theme]}`}>Moonshot</span>
                                </div> */}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const CallToActionSection = () => {
  return (
    <section className="py-20 md:py-28 bg-charcoal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#24150F] via-charcoal-900 to-[#0C1B1A]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-bodhan-orange/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-0 w-[520px] h-[520px] bg-bodhan-teal/20 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
          Ready to Shape the Future of Education?
        </h2>
        <p className="text-gray-100 max-w-3xl mx-auto text-base md:text-lg leading-relaxed mb-10">
          We’re looking for researchers, PhD students, startups, and institutions to collaborate on these open problems.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:research@bodhan.ai"
            className="inline-flex items-center text-lg justify-center gap-2 px-8 py-3 rounded-full bg-bodhan-orange text-charcoal-900 font-semibold shadow-lg shadow-bodhan-orange/20 hover:brightness-110 transition-all w-full sm:w-auto"
          >
            Get in Touch <ArrowRight size={16} />
          </a>
          <button
            type="button"
            onClick={scrollToResearchAgenda}
            className="inline-flex items-center text-lg justify-center px-8 py-3 rounded-full border border-white/20 text-white/90 hover:text-white hover:border-white/40 transition-all w-full sm:w-auto"
          >
            Browse Problems
          </button>
        </div>
      </div>
    </section>
  );
};

export const ResearchProblemsHomePage: React.FC = () => {
  return (
    <div className="animate-fade-in pt-4 md:pt-6">
      <HeroSection />
      <div className="relative">
        {/* <div className="pointer-events-none absolute -top-20 left-0 right-0 h-40 bg-gradient-to-b from-cream-100 via-[#F2E1C7] to-charcoal-900 transition-opacity duration-700" /> */}
        <div className="relative bg-charcoal-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#24150F] via-charcoal-900 to-[#0C1B1A]" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-bodhan-orange/20 rounded-full blur-[140px]" />
            <div className="absolute -bottom-40 right-0 w-[520px] h-[520px] bg-bodhan-teal/20 rounded-full blur-[160px]" />
          </div>
          <div className="relative z-10">
            <VisionSection />
            {/* <PrinciplesSection /> */}
          </div>
        </div>
        <GrandChallengesSection />
        {/* <div className="pointer-events-none absolute -bottom-20 left-0 right-0 h-40 bg-gradient-to-b from-charcoal-900 via-[#2A1A10] to-cream-100 transition-opacity duration-700" /> */}
        {/* <div className="pointer-events-none absolute -top-20 left-0 right-0 h-40 bg-gradient-to-b from-cream-100 via-[#F2E1C7] to-charcoal-900 transition-opacity duration-700" /> */}
      </div>
      
      {/* Research Agenda Grid */}
      <div id={RESEARCH_AGENDA_ID} className="py-24 bg-cream-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif font-medium text-gray-900 mb-6">Explore Our Research Agenda</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
              Select a research vertical to explore detailed problem statements and collaboration opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {RESEARCH_VERTICALS.map((vertical) => (
              <Link 
                key={vertical.id} 
                to={`${RESEARCH_PROBLEMS_BASE}/vertical/${vertical.id}`}
                className={`group bg-white rounded-2xl p-8 border border-black/10 transition-all duration-300 ${THEME_BG_HOVER[vertical.theme]} hover:-translate-y-1`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-2xl font-serif font-bold ${THEME_COLORS[vertical.theme]}`}>
                    {vertical.shortTitle}
                  </span>
                  <div className="text-right">
                    <span className="block text-2xl font-bold text-gray-900">{vertical.problemCount}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Problems</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {vertical.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[124px] line-clamp-3">
                  {vertical.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {vertical.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-cream-100 rounded-full text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CallToActionSection />
    </div>
  );
};

// --- Vertical Page Components ---

const AreaAccordion: React.FC<{
    problem: ResearchProblem;
    verticalTheme: VerticalTheme;
    isOpen: boolean;
    onToggle: () => void;
    filteredOutcomes: any[];
}> = ({ problem, verticalTheme, isOpen, onToggle, filteredOutcomes }) => {
    
    // Derived area number from ID (e.g. 4.1.1 -> 01)
    const areaNum = problem.id.split('.').pop()?.padStart(2, '0');

    if (filteredOutcomes.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-black/10 overflow-hidden mb-4">
             <button 
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-black/5 transition-colors"
             >
                <div className="flex-1 pr-4">
                    <span className={`text-xs font-bold uppercase tracking-widest ${THEME_COLORS[verticalTheme]} mb-1 block`}>
                        Area {areaNum}
                    </span>
                    <h3 className="text-xl font-serif font-medium text-gray-900">{problem.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-1">{problem.description}</p>
                </div>
                <div className="flex items-center gap-4">
                     <span className="text-sm font-bold text-gray-900 bg-black/10 px-3 py-1 rounded-full">
                         {filteredOutcomes.length} <span className="text-[10px] text-gray-600 font-normal ml-1">PROBLEMS</span>
                     </span>
                     <div className={`w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-gray-600`}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                     </div>
                </div>
             </button>

             {isOpen && (
                 <div className="p-6 pt-0 border-t border-black/10 bg-white/70">
                     <p className="text-gray-600 text-sm leading-relaxed mb-6 mt-4">
                         {problem.description}
                     </p>
                     
                     <div className="space-y-4">
                         {filteredOutcomes.map((outcome) => (
                             <div key={outcome.id} className="bg-cream-100 rounded-lg p-5 border border-black/10 flex flex-col md:flex-row gap-4 relative overflow-hidden group hover:border-black/10 transition-colors">
                                 
                                 {/* ID Badge */}
                                 <div className="flex-shrink-0">
                                     <span className={`flex items-center justify-center w-12 h-12 rounded text-base font-bold bg-${verticalTheme === 'orange' ? 'orange' : verticalTheme}-500 text-white`}>
                                         {outcome.id}
                                     </span>
                                 </div>

                                 <div className="flex-grow">
                                     <div className="flex justify-between items-start">
                                         <h4 className="text-lg font-bold text-gray-900 mb-2">{outcome.title}</h4>
                                     </div>
                                     <p className="text-gray-600 text-sm mb-4 leading-relaxed">{outcome.description}</p>
                                     <div className="flex justify-between items-center">
                                         <div className="flex flex-wrap gap-2">
                                             {outcome.tags.map((tag: string) => (
                                                 <span key={tag} className="px-2 py-1 bg-white rounded text-[10px] text-gray-500 border border-black/10">
                                                     {tag}
                                                 </span>
                                             ))}
                                         </div>
                                         <Button variant="outline" href={`mailto:research@bodhan.ai?subject=${outcome.id}`} className="!py-1.5 !px-4 !text-xs !rounded-full border border-black group-hover:bg-white group-hover:text-gray-900 group-hover:border-black">
                                             Reach Out <ArrowRight size={10} className="ml-1" />
                                         </Button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             )}
        </div>
    )
}

export const ResearchProblemsVerticalPage: React.FC = () => {
  const { verticalId } = useParams();
  const vertical = RESEARCH_VERTICALS.find(v => v.id === verticalId);
  
  // State for Filters
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [openAreas, setOpenAreas] = useState<Set<string>>(new Set());

  // Initialize with only the first area open
  useEffect(() => {
      if (vertical) {
          const firstProblemId = vertical.problems[0]?.id;
          setOpenAreas(new Set(firstProblemId ? [firstProblemId] : []));
      }
  }, [vertical]);

  if (!vertical) return <Navigate to={RESEARCH_PROBLEMS_BASE} replace />;

  // Extract all outcomes to get unique tags for this vertical
  const allOutcomes = vertical.problems.flatMap(p => p.outcomes);
  const availableTags = Array.from(new Set(allOutcomes.flatMap(o => o.tags))).sort();

  const toggleTag = (tag: string) => {
      const next = new Set(selectedTags);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      setSelectedTags(next);
  }

  const toggleArea = (id: string) => {
      const next = new Set(openAreas);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setOpenAreas(next);
  }

  // Filter Logic
  const getFilteredOutcomes = (problem: ResearchProblem) => {
      return problem.outcomes.filter(outcome => {
          const matchesTag = selectedTags.size === 0 || outcome.tags.some(t => selectedTags.has(t));
          return matchesTag;
      });
  };

  const scrollToArea = (id: string) => {
      const element = document.getElementById(`area-${id}`);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setOpenAreas(prev => new Set(prev).add(id));
      }
  }

  return (
    <div className="min-h-screen bg-cream-100 pt-28 pb-20 animate-fade-in">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
          
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
               <span className={`text-5xl md:text-6xl font-serif font-bold ${THEME_COLORS[vertical.theme]}`}>
                 {vertical.problemCount}
               </span>
               <div className="h-12 w-px bg-black/10"></div>
               <span className="text-xs md:text-sm tracking-widest uppercase text-gray-500">
                 Problems <br/> Found
               </span>
               <div className="h-12 w-px bg-black/10 ml-4"></div>
               <div className="flex gap-2">
                 {vertical.tags.map(t => (
                     <span key={t} className="px-3 py-1 rounded bg-black/5 text-gray-600 text-xs border border-black/10 uppercase tracking-wide">
                         {t}
                     </span>
                 ))}
               </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
               {vertical.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Sidebar Filters */}
              <div className="lg:col-span-1 space-y-8">
                  
                  {/* Focus Areas Navigation */}
                  <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Focus Areas</h4>
                      <ul className="space-y-2">
                          {vertical.problems.map(p => (
                              <li key={p.id}>
                                  <button 
                                    onClick={() => scrollToArea(p.id)}
                                    className="text-sm text-gray-600 hover:text-bodhan-orange text-left leading-tight"
                                  >
                                      {p.title} <span className="text-xs text-gray-600 ml-1">({p.outcomes.length})</span>
                                  </button>
                              </li>
                          ))}
                      </ul>
                  </div>

                  {/* Tag Filter */}
                   <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Filter by Tags</h4>
                      <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => (
                               <button
                               key={tag}
                               onClick={() => toggleTag(tag)}
                               className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${selectedTags.has(tag) 
                                   ? 'bg-white text-gray-900 border-gray-200' 
                                   : 'bg-white text-gray-600 border-black/10 hover:border-black/20'}`}
                             >
                                 {tag}
                             </button>
                          ))}
                      </div>
                   </div>

              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                  {vertical.problems.map(problem => {
                      const filteredOutcomes = getFilteredOutcomes(problem);
                      return (
                        <div key={problem.id} id={`area-${problem.id}`}>
                             <AreaAccordion 
                                problem={problem}
                                verticalTheme={vertical.theme}
                                isOpen={openAreas.has(problem.id)}
                                onToggle={() => toggleArea(problem.id)}
                                filteredOutcomes={filteredOutcomes}
                             />
                        </div>
                      );
                  })}
              </div>

          </div>
       </div>
    </div>
  );
};

export const ResearchProblemsGrandChallengePage: React.FC = () => {
  const { challengeId } = useParams();
  const challenge = GRAND_CHALLENGES.find(c => c.id === challengeId);

  if (!challenge) return <Navigate to={RESEARCH_PROBLEMS_BASE} replace />;

  const blog = GRAND_CHALLENGE_BLOG[challenge.id];

  return (
    <div className="min-h-screen bg-cream-100 pt-28 pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />

        <div className="mb-10">
          <span className={`text-xs uppercase tracking-[0.3em] ${THEME_COLORS[challenge.theme]}`}>
            {challenge.vertical}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mt-3">
            {challenge.title}
          </h1>
          <p className="text-gray-600 text-lg mt-4">
            {challenge.description}
          </p>
        </div>

        <article className="text-gray-700 leading-relaxed">
          <ReactMarkdown
            className="space-y-8"
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 mt-10" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-serif text-gray-900 mt-10 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-serif text-gray-900 mt-8 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="my-1" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-500" {...props} />
              )
            }}
          >
            {blog?.markdown ?? ''}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};
