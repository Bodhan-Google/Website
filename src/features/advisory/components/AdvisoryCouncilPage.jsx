import { useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';

import sethuramanImg from '../../../assets/Sethuraman_Panchanathan.jpg';
import jeffImg from '../../../assets/Jeff Ullman.jpg';
import svethaImg from '../../../assets/svetha.jpeg';
import ashokImg from '../../../assets/Ashok Goel.png';
import mohanImg from '../../../assets/Mohan_Photo.jpg';
import babakImg from '../../../assets/Babak-Hojjat.png';
import davidImg from '../../../assets/David Poole.jpg';

const advisoryMembers = [
    {
        name: "Prof. Sethuraman Panchanathan",
        role: "Chairman, Bodhan AI International Advisory Council",
        image: sethuramanImg,
        bio: [
            "Dr. Sethuraman \"Panch\" Panchanathan is a distinguished computer scientist, engineer, and academic leader. He is best known for serving as the 15th Director of the U.S. National Science Foundation (NSF), a role he held from June 2020 until April 2025.",
            "Prof. Panchanathan is also serving as Foundation Chair in the School of Computing and Augmented Intelligence, Arizona State University."
        ]
    },
    {
        name: "Prof. Jeff Ullman",
        role: "Professor Emeritus, Stanford University",
        image: jeffImg,
        bio: [
            "Jeff Ullman is the Stanford W. Ascherman Professor of Engineering (Emeritus) in the Department of Computer Science at Stanford and CEO of Gradiance Corp. He received the B.S. degree from Columbia University in 1963 and the PhD from Princeton in 1966. Prior to his appointment at Stanford in 1979, he was a member of the technical staff of Bell Laboratories from 1966-1969, and on the faculty of Princeton University between 1969 and 1979. From 1990-1994, he was chair of the Stanford Computer Science Department.",
            "Ullman was elected to the National Academy of Engineering in 1989, the American Academy of Arts and Sciences in 2012, the National Academy of Science in 2020, and has held Guggenheim and Einstein Fellowships. He has received the Sigmod Contributions Award (1996), the ACM Karl V. Karlstrom Outstanding Educator Award (1998), the Knuth Prize (2000), the Sigmod E. F. Codd Innovations award (2006), the IEEE von Neumann medal (2010), the NEC C&C Foundation Prize (2017), and the ACM A.M. Turing Award (2020).",
            "Prof. Ullman is the author of 16 books, including books on database systems, data mining, compilers, automata theory, and algorithms."
        ]
    },
    {
        name: "Prof. David Poole",
        role: "Professor Emeritus, University of British Columbia",
        image: davidImg,
        bio: [
            "Prof. David Poole is a Professor Emeritus of Computer Science at the University of British Columbia. He is known for his work on combining logic and probability, probabilistic inference, relational probabilistic models, statistical relational AI and semantic science.",
            "Prof. Poole is a co-author of two AI textbooks (Cambridge University Press, 2010, 2nd edition 2017, 3rd edition 2023, and Oxford University Press, 1998), and co-author of \"Statistical Relational Artificial Intelligence: Logic, Probability, and Computation\" (Morgan & Claypool 2016), and co-editor of \"Introduction to Lifted Inference\" (MIT Press 2021).",
            "He is a former chair of the Association for Uncertainty in Artificial Intelligence, the winner of the Canadian AI Association (CAIAC) 2013 Lifetime Achievement Award, and a co-winner of 2026 AAAI/EAAI Patrick Henry Winston Outstanding Educator Award. He is a Fellow of the Association for the Advancement of Artificial Intelligence (AAAI) and CAIAC."
        ]
    },
    {
        name: "Prof. Svetha Venkatesh",
        role: "Distinguished Professor, Deakin University",
        image: svethaImg,
        bio: [
            "Prof. Svetha Venkatesh is a Deakin Distinguished Professor and Co-Director of Deakin Applied Artificial Intelligence Initiative at Deakin University, Australia. She was elected a Fellow of the International Association of Pattern Recognition in 2004 for contributions to formulation and extraction of semantics in multimedia data, a Fellow of the Australian Academy of Technological Sciences and Engineering in 2006, and a Fellow of the Australian Academy of Science in 2021 for ground-breaking research and contributions that have had clear impact. In 2017, Professor Venkatesh was appointed an Australian Laureate Fellow, the highest individual award the Australian Research Council can bestow.",
            "Professor Venkatesh and her team have tackled a wide range of problems of societal significance, including the critical areas of autism, security and aged care. The outcomes have impacted the community and evolved into publications, patents, tools and spin-off companies. This includes 750+ publications, three full patents, one start-up company (icetana) and two significant products (TOBY Playpad, Virtual Observer).",
            "Professor Venkatesh has tackled complex pattern recognition tasks by drawing inspiration and models from widely diverse disciplines, integrating them into rigorous computational models and innovative algorithms. Her main contributions have been in the development of theoretical frameworks and novel applications for analysing large scale, multimedia data. This includes development of several Bayesian parametric and non-parametric models, solving fundamental problems in processing multiple channels, multi-modal temporal and spatial data."
        ]
    },
    {
        name: "Prof. Ashok Goel",
        role: "Professor, Georgia Institute of Technology",
        image: ashokImg,
        bio: [
            "Prof. Ashok Goel is a Professor of Computer Science and Human-Centered Computing in the School of Interactive Computing at Georgia Institute of Technology, and the Chief Scientist with Georgia Tech’s Center for 21st Century Universities.",
            "He is a Fellow of Association for the Advancement of Artificial Intelligence (AAAI) and the Cognitive Science Society, and Editor Emeritus of AAAI’s AI Magazine.",
            "Prof. Goel is a recipient of AAAI’s Robert Engelmore Award, Outstanding AI Educator Award, and Distinguished Service Award, as well as multiple IBM Faculty Awards. Ashok is the PI and Founding Executive Director of US NSF’s National AI Institute for Adult Learning and Online Education (aialoe.org)."
        ]
    },
    {
        name: "Prof. Mohan Kankanhalli",
        role: "Provost's Chair Professor, National University of Singapore",
        image: mohanImg,
        bio: [
            "Prof. Mohan Kankanhalli is Provost's Chair Professor of Computer Science at the National University of Singapore (NUS), where he is the Founding Director of the NUS AI Institute. He is also the Deputy Executive Chairman of AI Singapore, which is Singapore’s National AI R&D Program.",
            "He has held senior leadership roles as the Dean of NUS School of Computing and Vice Provost of Graduate Education for NUS. He obtained his BTech from IIT Kharagpur and MS & PhD from the Rensselaer Polytechnic Institute. Mohan’s research interests are in Multimodal Computing, Computer Vision, and Trustworthy AI.",
            "Mohan was a member of World Economic Forum's 2023-2024 Global Future Council on Artificial Intelligence. He is currently a member of ACM’s Global Technology Policy Council. He is a Fellow of IEEE, IAPR and ACM."
        ]
    },
    {
        name: "Dr. Babak Hodjat",
        role: "Chief AI Officer, Cognizant",
        image: babakImg,
        bio: [
            "Dr. Babak Hodjat (https://en.wikipedia.org/wiki/Babak_Hodjat) is the Chief AI Officer at Cognizant where he leads the Advanced AI Labs, a team of developers and researchers bringing advanced AI solutions to businesses. Babak is the former co-founder and CEO of Sentient, responsible for the core technology behind the world’s largest distributed artificial intelligence system.",
            "Babak was also the founder of the world's first AI-driven hedge-fund, Sentient Investment Management. Babak is a serial entrepreneur, having started several Silicon Valley companies as main inventor and technologist. Prior to co-founding Sentient, Babak was senior director of engineering at Sybase iAnywhere, where he led mobile solutions engineering. Prior to Sybase, Babak was co-founder, CTO and board member of Dejima Inc. Babak is the primary inventor of Dejima’s patented agent-oriented technology applied to intelligent interfaces for mobile and enterprise computing – the technology behind Apple’s Siri.",
            "Dr. Hodjat's has published many papers in the fields of Artificial Life, Agent-Oriented Software Engineering, and Distributed Artificial Intelligence, and has 39 issued US patents to his name. He is an expert in numerous fields of AI, including natural language processing, machine learning, genetic algorithms, distributed AI, and has founded multiple companies in these areas. Babak was named in the 2025 AI 100 UK list (https://awards.digileaders.com/AI100-Vote). Babak holds a PhD in Machine Intelligence from Kyushu University, in Fukuoka, Japan. Babak is also the author of 'The Narrator', an AI science fiction novella, and 'The Konar and the Apple', a collection of short stories based on his youth."
        ]
    }
];

const AdvisoryCouncilPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)]">
            <Navbar />

            {/* Header */}
            <div className="pt-12 pb-8 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-4"
                    >
                        International Advisory{' '}
                        <span className="text-[var(--text-orange-500)]">Council</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-gray-500 text-lg max-w-2xl mx-auto"
                    >
                        Distinguished global leaders guiding Bodhan AI's vision for transforming education through Artificial Intelligence.
                    </motion.p>
                </div>
            </div>

            {/* Member Profiles */}
            <div className="max-w-5xl mx-auto px-6 pb-20">
                {advisoryMembers.map((member, index) => (
                    <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className={`flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 py-12 ${
                            index < advisoryMembers.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                    >
                        {/* Portrait */}
                        <div className="flex-shrink-0">
                            <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-1">
                                {member.name}
                            </h2>
                            <p className="text-[var(--text-orange-500)] font-medium text-base mb-5">
                                {member.role}
                            </p>
                            <div className="space-y-3">
                                {member.bio.map((paragraph, i) => (
                                    <p key={i} className="text-gray-600 leading-relaxed text-[15px] [overflow-wrap:anywhere]">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default AdvisoryCouncilPage;
