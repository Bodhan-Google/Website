import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase, ChevronDown, ExternalLink } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';

const APPLY_URL = 'https://forms.gle/PZAZ9rVnYcZvUxx97';

const jobPostings = [
    {
        title: 'Research Engineer (Junior, Senior, Principal)',
        experience: 'B.Tech/M.Tech',
        about: "Bodhan AI is looking for exceptional Research Engineers to push the boundaries of sovereign AI for India. You will play a critical role in executing research goals, driving experimentation, building robust infrastructure and efficient model training pipelines. Contribute hands-on to model innovation in ASR, ORF, LLMs, TTS, and OCR—with a focus on multilingual, multi-modal, low-resource, and real-world school deployments.",
        responsibilities: [
            'Own the end-to-end model training cycle in one or more of Speech, Language, Vision, and multimodal training',
            'Support Research Scientists by collaborating with them, driving experimentation, translating research ideas into scalable code and executing large-scale experiments',
            'Build pipelines for synthetic data generation and manage the curation of high-quality training datasets',
            'Lead efforts in inference optimization (quantization, pruning, etc.) and ensure models are ready for large-scale, real-world deployment',
            'Maintain and contribute to internal and external open-source AI frameworks and tools',
        ],
        required: [
            'B.Tech or M.Tech in Computer Engineering, Computer Science, or a related technical field',
            'Expert-level proficiency in Python and deep learning frameworks like PyTorch, TensorFlow, or JAX',
            'Deep understanding of the model training cycle and experience in deploying AI models in production environments',
            'Proven ability to work towards defined research goals and deliver high-quality, performant software',
        ],
        preferred: [
            'A strong portfolio of contributions to major open-source AI projects (provide GitHub/GitLab links)',
            'In-depth understanding or experience in speech, ASR, LLM, or Vision model training and finetuning',
            'Experience with model optimization for low-resource or Indian languages',
            'A track record of publications or research contributions',
            'Background in educational technology, psychometrics, or cognitive science',
        ],
    },
    {
        title: 'Research Scientist (Junior, Senior, Principal)',
        experience: 'PhD/MS + 2–6+ years',
        about: "Bodhan AI is looking for exceptional Research Scientists to push the boundaries of sovereign AI for India. You will be responsible for driving research initiatives in speech, language, and vision AI tailored for education—with a focus on multilingual, multi-modal, low-resource, and real-world school deployments.",
        responsibilities: [
            'Design and train advanced models across multilingual ASR/TTS, instruction-tuned LLMs (pre-training & post-training), or multimodal OCR/Vision systems',
            'Develop AI models customized to the education domain, addressing literacy diagnostics, reading fluency, and real-world educational outcomes',
            'Develop novel evaluation methods to validate the effectiveness of AI models in improving learning and teaching outcomes',
            'Drive research into low-resource language modeling, efficient training (distillation, quantization, PEFT), and robust performance in noisy or low-bandwidth environments',
            'Work closely with Engineering and Product teams to move models from experimental stages to production-ready deployments in Indian schools',
            'Maintain high standards for reproducibility, rigorous benchmarking, and contribute through publications, open-source contributions, and technical insights',
        ],
        required: [
            "PhD or Master's degree in Machine Learning, Speech Processing, NLP, Computer Vision, or related field; exceptional Bachelor's candidates also welcome",
            'Principal: 6+ years | Senior: 4+ years | Entry: Graduating PhDs or 2+ years for Masters/Bachelors post-qualification experience in AI/ML research',
            'Proven expertise in at least one of: Speech (ASR, TTS, or speech diagnostics), LLMs (pre-training, fine-tuning, RL, or RAG), or Vision (OCR, document understanding, or multimodal AI)',
            'Publications in top-tier conferences (ICLR, NeurIPS, ACL, CVPR, INTERSPEECH, etc.)',
            'Proficiency in Python and deep learning frameworks like PyTorch, TensorFlow, or JAX',
        ],
        preferred: [
            'Experience working with low-resource or Indian languages',
            'Familiarity with model optimization for real-world, large-scale deployments',
            'A background in educational technology, psychometrics, or cognitive science',
            'A track record of contributions to open-source AI projects',
        ],
    },
    {
        title: 'System Architect',
        experience: '5–10+ years',
        about: "Design and oversee Bodhan AI's technical architecture for research, infrastructure, and applications. Lead technical decisions for scaling to millions of users.",
        responsibilities: [
            'Design end-to-end system architecture for Bodhan AI platforms',
            'Make technology choices for scalability, reliability, and maintainability',
            'Lead technical planning for major initiatives (Bodhan AI Cloud, Arena, etc.)',
            'Review and guide engineering teams on best practices',
            'Establish coding standards, design patterns, and documentation',
            'Balance research needs with production requirements',
        ],
        required: [
            "Bachelor's or Master's in Computer Science",
            '5–10+ years experience in software engineering/architecture',
            'Strong track record of designing large-scale systems',
            'Deep knowledge of distributed systems, databases, and cloud architecture',
            'Experience leading technical teams and making architectural decisions',
            'Excellent communication and documentation skills',
        ],
        preferred: [
            'Experience with AI/ML systems architecture',
            'Built systems serving millions of users',
            'Knowledge of Indian language computing challenges',
            'Open-source project leadership',
            'Experience in research-driven organizations as well as enterprise grade systems',
            'Published technical blogs or talks',
            'Contributions to RAG-related open-source projects',
        ],
    },
    {
        title: 'MLOps Engineer',
        experience: '2–5 years',
        about: "Build and maintain infrastructure for training, deploying, and serving Bodhan AI's models at scale. Ensure reliability for 100K+ monthly downloads and production deployments.",
        responsibilities: [
            'Design CI/CD pipelines for ML model training and deployment',
            'Set up and manage GPU clusters for training large models',
            'Build model serving infrastructure (HuggingFace Spaces, FastAPI, Docker)',
            'Implement monitoring and observability for model performance',
            'Optimize inference latency and throughput',
            'Create deployment templates for AWS, Azure, GCP',
        ],
        required: [
            "Bachelor's in Computer Science or related field",
            '2–5 years experience in MLOps, DevOps, or infrastructure',
            'Strong experience with Docker, Kubernetes, and containerization',
            'Proficiency in Python and bash scripting',
            'Experience with ML frameworks (PyTorch, TensorFlow, ONNX)',
            'Cloud platform experience (AWS, GCP, or Azure)',
        ],
        preferred: [
            'Experience with ML model serving (TorchServe, TensorFlow Serving, Triton)',
            'Knowledge of GPU optimization and CUDA',
            'Familiarity with HuggingFace ecosystem and model deployment',
            'Experience with monitoring tools (Prometheus, Grafana, DataDog)',
            'Infrastructure-as-Code experience (Terraform, Ansible)',
            'Built MLOps systems for research labs or open-source projects',
        ],
    },
    {
        title: 'AI Infra Engineer',
        experience: '2–5 years',
        about: "Build large-scale training infrastructure and distributed systems for Bodhan AI's research. Work on multi-GPU training, data pipelines, and compute optimization.",
        responsibilities: [
            'Design distributed training systems for large language models',
            'Optimize training pipelines for efficiency (DeepSpeed, FSDP, Megatron)',
            'Build data processing infrastructure for trillion-token datasets',
            'Implement GPU utilization monitoring and cost optimization',
            'Create checkpointing and experiment tracking systems',
            'Support researchers with training infrastructure and debugging',
        ],
        required: [
            "Bachelor's or Master's in Computer Science or related field",
            '2–5 years experience with distributed systems or ML infrastructure',
            'Strong understanding of parallel computing and GPU programming',
            'Proficiency in Python and C++/CUDA (optional but strong plus)',
            'Experience with PyTorch distributed training (DDP, FSDP)',
            'Knowledge of HPC systems and cluster management',
        ],
        preferred: [
            'Experience training large models (7B+ parameters)',
            'Knowledge of DeepSpeed, Megatron-LM, or FSDP',
            'Contributions to PyTorch or other ML frameworks',
            'Understanding of model parallelism and pipeline parallelism',
            'Experience with Slurm, Ray, or distributed computing frameworks',
            'Published papers on ML systems or infrastructure',
        ],
    },
    {
        title: 'API & Integration Engineer',
        experience: '2–5 years',
        about: "Build integrations between Bodhan AI models and popular frameworks/platforms. Create plugins for LiveKit, LangChain, LlamaIndex, and cloud marketplaces.",
        responsibilities: [
            'Develop LiveKit and other plugins for models',
            'Create LangChain/LlamaIndex integrations for Bodhan AI models',
            'Build API templates (FastAPI, Flask) for easy deployment',
            'Develop Docker images and deployment guides',
            'Create integrations for AWS/Azure/GCP marketplaces',
            'Write comprehensive documentation and examples',
        ],
        required: [
            "Bachelor's in Computer Science or related field",
            '2–5 years experience with API development and integrations',
            'Strong Python programming skills',
            'Experience with REST APIs and SDK development',
            'Understanding of ML model serving and inference',
            'Familiarity with Docker and cloud platforms',
        ],
        preferred: [
            'Experience with voice AI platforms (LiveKit, Vapi, Twilio, etc.)',
            'Knowledge of LangChain, LlamaIndex, or Haystack',
            'Built integrations for open-source projects',
            'Familiarity with WebRTC and real-time communication',
            'Experience with API documentation (OpenAPI/Swagger)',
            'Contributions to integration/plugin projects',
        ],
    },
    {
        title: 'Frontend Engineer',
        experience: '1–5 years',
        about: "Build intuitive web interfaces for Bodhan AI's website, demos, tools, and community platforms. Create experiences for Indic LLM Arena, model demos, and developer resources.",
        responsibilities: [
            'Develop responsive web applications using React/Next.js',
            'Build interactive demos for translation, ASR, TTS models',
            'Create developer tools and documentation portals',
            'Implement real-time features (voice chat, streaming text)',
            'Optimize performance for Indian language text rendering',
            'Collaborate with designers and backend teams',
        ],
        required: [
            "Bachelor's in Computer Science or related field",
            '1–5 years experience in frontend development',
            'Strong proficiency in JavaScript/TypeScript and React',
            'Experience with modern CSS frameworks (Tailwind, etc.)',
            'Understanding of responsive design and accessibility',
            'Familiarity with Git and modern development workflows and AI assisted coding platforms',
        ],
        preferred: [
            'Experience with Next.js, Remix, or similar frameworks',
            'Knowledge of Web Audio API for voice applications',
            'Experience building AI/ML demos or tools',
            'Familiarity with Indian language rendering (fonts, Unicode)',
            'Contributions to open-source React projects',
            'Design sensibility and attention to detail',
        ],
    },
    {
        title: 'Backend Engineer',
        experience: '1–5 years',
        about: "Build scalable backend systems for Bodhan AI's APIs, data pipelines, and web applications. Support community of 100K+ developers and production deployments.",
        responsibilities: [
            'Design and implement REST APIs for Bodhan AI models',
            'Build data ingestion and processing pipelines',
            'Create backend services for Indic LLM Arena and other applications',
            'Implement authentication, rate limiting, and API management',
            'Optimize database queries and caching strategies',
            'Write comprehensive tests and documentation',
        ],
        required: [
            "Bachelor's in Computer Science or related field",
            '1–5 years experience in backend development',
            'Strong proficiency in Python (FastAPI/Flask) or Node.js',
            'Experience with SQL (PostgreSQL/MySQL) and NoSQL databases',
            'Understanding of RESTful API design and microservices',
            'Familiarity with Git, Docker, and cloud deployment and use of AI assisted coding platforms',
        ],
        preferred: [
            'Experience building APIs for ML models',
            'Knowledge of async programming and task queues (Celery, Redis)',
            'Familiarity with GraphQL',
            'Experience with high-traffic applications (1M+ requests/day)',
            'Contributions to open-source Python projects',
            'Understanding of Indian language text processing',
        ],
    },
    {
        title: 'Data Engineer',
        experience: '2–5 years',
        about: "Design, build, and maintain scalable data pipelines and infrastructure to power Bodhan AI's multilingual models and research. Work with massive datasets spanning 22 Indian languages.",
        responsibilities: [
            'Design, build, and maintain scalable data pipelines for large corpora of educational and conversational text data',
            'Ingest data from multiple sources (documents, APIs, structured and unstructured data) and prepare it for training, RAG, and evaluation workflows',
            'Integrate AI/ML models within data pipelines for data cleaning, normalization, deduplication, filtering, metadata enrichment, and tagging',
            'Ensure data quality, correctness, and consistency through validation checks and automated tests',
            'Implement data safety and compliance checks, including PII handling and policy-aligned filtering',
            'Manage data formats, storage layouts, and sharding strategies for efficient retrieval and scalability',
            'Curate and maintain training, evaluation, and test datasets for LLM and RAG systems',
            'Collaborate with ML, RAG, and QA teams to continuously improve data coverage and relevance',
        ],
        required: [
            "Bachelor's or Master's in Computer Science, Data Engineering, or related field",
            '2–5 years experience in data engineering or related roles',
            'Strong proficiency in Python and SQL',
            'Experience with data pipeline tools (Apache Airflow, Spark, Kafka, or similar)',
            'Hands-on experience with cloud data services (AWS S3, BigQuery, Redshift, or similar)',
            'Understanding of data modeling, warehousing, and lake architectures',
        ],
        preferred: [
            'Experience processing multilingual or Indian language text/audio data',
            'Knowledge of distributed computing frameworks (Spark, Dask, Ray)',
            'Familiarity with data versioning tools (DVC, LakeFS)',
            'Experience with streaming data systems and real-time pipelines',
            'Understanding of ML data requirements and feature engineering',
            'Contributions to open-source data engineering projects',
        ],
    },
];

const dataOperationsJobs = [
    {
        title: 'Project Lead – Data Operations',
        experience: '3+ years',
        about: "Facilitate and assume end-to-end ownership of data operations for Indic languages to meet the data requirements supporting Bodhan's research objectives across Automatic Speech Recognition (ASR), Optical Character Recognition (OCR), Text-to-Speech (TTS), and Generative AI models. Languages in scope: Hindi, Tamil, Malayalam, Telugu, Kannada, Bengali, Odia, Marathi, Gujarati, Assamese, Punjabi, Urdu, Nepali, Konkani, and Bodo.",
        responsibilities: [
            'Project Management & Execution: define and execute comprehensive project plans to achieve data collection and annotation targets across specified Indic languages, ensuring alignment with Bodhan\'s research goals and end-user use cases for ASR, TTS, and OCR',
            'Talent Acquisition: support and facilitate the recruitment of subject matter experts in Indic languages to meet evolving project requirements',
            'Cross-Functional Collaboration: partner closely with internal technical teams, tooling engineers, and researchers to streamline workflows and accomplish project milestones',
            'Vendor Management: oversee external vendor teams to ensure deliverables consistently meet project scope, high quality standards, and strict timelines',
            'Mentorship & Training: guide, mentor, and enable language experts to execute their responsibilities efficiently and effectively',
        ],
        required: [
            'Minimum 3 years of experience leading teams and projects focused on Indic language data collection, data annotation, and model evaluation',
            'Bachelor\'s degree in Arts, Commerce, or Science',
        ],
        preferred: [
            'A specialization in linguistics or language studies',
        ],
    },
    {
        title: 'Senior Program Manager – Data Operations',
        experience: '12+ years',
        about: 'Lead and scale end-to-end Data Operations for Indic language AI initiatives. Take full strategic and operational ownership of complex data programs across the 22 Scheduled Indic languages, directly powering advanced research in Automatic Speech Recognition (ASR), Text-to-Speech (TTS), Optical Character Recognition (OCR), and Generative AI models. Languages in scope: Hindi, Tamil, Malayalam, Telugu, Kannada, Bengali, Odia, Marathi, Gujarati, Assamese, Punjabi, Urdu, Nepali, Konkani, and Bodo.',
        responsibilities: [
            'End-to-End Program Ownership: architect, execute, and monitor comprehensive data operation roadmaps covering planning, data collection, data annotation, quality assurance, and model needs and evaluation to support AI research and product deployment across ASR, TTS, OCR, and Gen AI streams',
            'Pipeline & Workflow Optimization: design and refine high-throughput workflows for dataset creation, annotation, transcription, and post-processing across diverse linguistic contexts',
            'Risk & Change Management: anticipate operational bottlenecks, mitigate project risks, manage dynamic changes in research requirements, and establish robust version control for data guidelines and quality benchmarks',
            'Engineering & Research Alignment: work closely with AI Research Scientists, ML Engineers, and Tools/Platform teams to define exact data specifications, taxonomy standards, and custom tool requirements',
            'Language Expert Strategy: partner with Talent Acquisition to build, structure, and scale a roster of native Indic language experts, linguists, and quality assurance specialists',
            'Team Mentorship & Capability Building: lead, mentor, and empower Project Leads and Language Specialists, establishing standard operating procedures (SOPs) and career development frameworks',
            'Vendor Ecosystem Management: identify, onboard, and manage external vendor teams; establish clear SLAs, KPIs, and pricing models to ensure strict adherence to scope, budget, timeline, and accuracy standards',
            'Quality Assurance Frameworks: implement automated and human-in-the-loop (HITL) quality audit frameworks to maintain rigorous precision standards across all target dialects and scripts',
        ],
        required: [
            '12+ years of overall experience in program/project management, with at least 3+ years specifically leading large-scale AI/ML Data Operations, NLP, or Speech/Vision data pipeline programs with emphasis on research objectives',
            'Deep hands-on experience managing data acquisition, annotation, and model evaluation projects for Indic languages',
            'Proven track record of managing multi-vendor engagements, negotiating contracts, and optimizing operational budgets',
            'Strong familiarity with the data lifecycle and unique operational nuances required for training ASR, TTS, OCR, and Generative AI (LLM/SLM) models',
            'Bachelor\'s degree: B.Tech / B.E, M.Sc. / MCA',
        ],
        preferred: [
            'Working knowledge of data management tools, annotation platforms, and basic script handling/encoding for Indic language scripts',
        ],
    },
    {
        title: 'Language Expert',
        experience: "Bachelor's / Master's",
        about: 'Channel your passion for language and culture to shape the future of artificial intelligence in Indic languages. Apply linguistic capabilities to core data annotation tasks — high-precision translation, transcription, and quality assurance — and serve as a vital Human in the Loop, evaluating and refining AI models so technology advances responsibly, ethically, and with authentic respect for local linguistic nuances. 120 positions across 12 Indic languages: Hindi, Tamil, Telugu, Malayalam, Kannada, Marathi, Gujarati, Bengali, Odia, Punjabi, Urdu, and Assamese.',
        responsibilities: [
            'Data Annotation & Model Evaluation: execute complex translation, transcription, and quality assurance tasks, consistently meeting benchmark standards and timelines',
            'Proactive Project Communication: maintain transparent, timely communication with project leads regarding daily progress, operational dependencies, and potential risks to quality or schedules',
            'Agile Problem Solving: adapt smoothly to shifting research goals in a fast-paced AI development environment where project scopes evolve alongside technological breakthroughs',
            'Ethical AI Stewardship: critically evaluate model inputs and outputs to safeguard cultural accuracy, contextual fairness, and ethical standards from a language point of view',
        ],
        required: [
            'Full professional fluency (reading, writing, and speaking) in one or more Indic languages: Hindi, Tamil, Malayalam, Kannada, Telugu, Odia, Bengali, Gujarati, Marathi, Punjabi, Urdu, Assamese, Kashmiri, Dogri, Maithili, Bodo, Nepali, Konkani, Sanskrit, Sindhi, Santali, or Manipuri',
            'Reasonable proficiency in English',
            'A nuanced understanding of sentence structure, syntax, formal/informal registers, and paraphrasing',
            'Bachelor\'s or Master\'s degree in Arts, Science, Commerce, Journalism, or a related discipline',
            'Meticulous attention to detail with clear, empathetic communication',
            'Collaborative mindset with strong accountability for deadlines and shared team outcomes',
            'Resilience and flexibility when navigating dynamic, research-driven priorities',
        ],
        preferred: [
            'Background in linguistics or phonetics',
            'Prior experience in data collection, annotation, or natural language processing (NLP) projects supporting Indic language research',
            'Academic projects, coursework, or internships focused on linguistics or Indic languages',
        ],
    },
];

const JobCard = ({ job, index }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
            {/* Card Header — always visible */}
            <div
                className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-2">
                        {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                            <MapPin size={14} />
                            Chennai (Hybrid)
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <Briefcase size={14} />
                            {job.experience}
                        </span>
                    </div>
                    <p className={`text-gray-600 text-sm mt-3 leading-relaxed ${expanded ? '' : 'line-clamp-2 md:line-clamp-1'}`}>
                        {job.about}
                    </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <a
                        href={APPLY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#0a0a0a] text-white text-sm font-medium py-2.5 px-5 rounded-lg hover:bg-black transition-colors"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Apply Now
                        <ExternalLink size={14} />
                    </a>
                    <button
                        className={`p-2 rounded-full hover:bg-gray-100 transition-all ${expanded ? 'rotate-180' : ''}`}
                        aria-label="Toggle details"
                    >
                        <ChevronDown size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Expandable Details */}
            <motion.div
                initial={false}
                animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                <div className="px-6 md:px-8 pb-8 pt-0 border-t border-gray-100">
                    <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Key Responsibilities */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-orange-500)] uppercase tracking-wide mb-3">
                                Key Responsibilities
                            </h4>
                            <ul className="space-y-2">
                                {job.responsibilities.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                                        <span className="text-[var(--text-orange-500)] mt-1 flex-shrink-0">&#8226;</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Required Qualifications */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-orange-500)] uppercase tracking-wide mb-3">
                                Required Qualifications
                            </h4>
                            <ul className="space-y-2">
                                {job.required.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                                        <span className="text-[var(--text-orange-500)] mt-1 flex-shrink-0">&#8226;</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Preferred Qualifications */}
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--text-orange-500)] uppercase tracking-wide mb-3">
                                Preferred Qualifications
                            </h4>
                            <ul className="space-y-2">
                                {job.preferred.map((item, i) => (
                                    <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                                        <span className="text-[var(--text-orange-500)] mt-1 flex-shrink-0">&#8226;</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Apply Button */}
                    <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                        <a
                            href={APPLY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#0a0a0a] text-white text-sm font-medium py-2.5 px-6 rounded-lg hover:bg-black transition-colors"
                        >
                            Apply for {job.title}
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const CategoryGroup = ({ category, jobs: groupJobs }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white/60 rounded-2xl border border-gray-100 overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-3 px-5 md:px-6 py-4 text-left hover:bg-white transition-colors group"
            >
                <ChevronDown
                    size={20}
                    className={`text-[var(--text-orange-500)] flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                />
                <span className="text-base md:text-lg font-semibold text-[#1A1A1A] group-hover:text-[var(--text-orange-500)] transition-colors">
                    {category}
                </span>
                <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-orange-100 text-[var(--text-orange-500)]">
                    {groupJobs.length}
                </span>
                <span className="ml-auto text-xs text-gray-400 hidden sm:block">{isOpen ? 'Collapse' : 'Expand'}</span>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="overflow-hidden"
                inert={!isOpen ? true : undefined}
            >
                <div className="px-3 md:px-4 pb-4 space-y-3">
                    {groupJobs.map((job, index) => (
                        <JobCard key={job.title} job={job} index={index} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

const CareersPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)]">
            <Navbar />

            {/* Header */}
            <div className="pt-12 pb-6 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] mb-4"
                    >
                        Join{' '}
                        <span className="text-[var(--text-orange-500)]">Bodhan AI</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-gray-500 text-lg max-w-2xl mx-auto mb-2"
                    >
                        Help us build AI that transforms how India learns, teaches, and grows.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="inline-flex items-center gap-1.5 text-sm text-gray-400 mt-2"
                    >
                        <MapPin size={14} />
                        All positions are based in Chennai (Hybrid)
                    </motion.div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="max-w-5xl mx-auto px-6 pb-20 space-y-4">
                <CategoryGroup category="Data Operations" jobs={dataOperationsJobs} />
                {jobPostings.map((job, index) => (
                    <JobCard key={job.title} job={job} index={index} />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default CareersPage;
