import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase, ChevronDown, ExternalLink } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';

const APPLY_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfTqBrU9bQVcrkCdpeRdkl1Z5s55ZEzpkl261TszvbFqo9q6g/viewform';

const jobPostings = [
    {
        title: 'VP of Research',
        experience: 'PhD + 8+ years',
        about: "Lead Bodhan's sovereign AI research strategy across speech, language, multimodal AI, and literacy diagnostics. Bridge cutting-edge AI research with real-world classroom deployment—making solutions accessible, affordable, and impactful for underserved populations.",
        responsibilities: [
            'Define and execute the sovereign AI research roadmap for education, spanning ASR, TTS, LLMs, OCR, and ORF',
            'Oversee development of education-optimized models: child-safe TTS, instruction-tuned LLMs, multilingual ASR, and ORF speech diagnostics',
            'Establish evaluation frameworks linking model performance directly to educational outcome metrics (e.g., reading fluency, comprehension gains)',
            'Design randomized pilots and field trials to validate measurable learning impact in real school environments',
            'Recruit and mentor a multidisciplinary research team (AI researchers, speech scientists, linguists, cognitive scientists)',
            'Represent Bodhan in national and international AI-for-Education initiatives and partner with ministries, NGOs, and academia',
        ],
        required: [
            'PhD or equivalent in Machine Learning, Speech Processing, NLP, Education Technology, or related field',
            '8+ years post-PhD AI/ML research experience, with 5+ years leading research teams',
            'Proven expertise in at least one of: speech recognition, speech diagnostics, NLP/LLMs, or multimodal AI',
            'Experience building or deploying AI systems in real-world, large-scale environments',
            'Strong grasp of model evaluation beyond benchmark scores, especially in applied educational or social impact domains',
        ],
        preferred: [
            "Experience with children's speech data or literacy research",
            'Background in educational measurement or psychometrics',
            'Experience in low-resource language modeling',
            'Exposure to government or public-sector education systems',
            'Experience designing AI for low-bandwidth or offline-first environments',
        ],
    },
    {
        title: 'Principal Scientist',
        experience: 'PhD/MS + 4+ years',
        about: "Lead advanced research initiatives across speech, language, and multimodal AI tailored for education. Drive hands-on model innovation in ASR, ORF, LLMs, TTS, and OCR—with a focus on multilingual, low-resource, and real-world school deployments.",
        responsibilities: [
            "Lead research in education-optimized ASR (children's speech, dialects), ORF fluency models, instruction-tuned LLMs, child-safe TTS, and OCR for educational materials",
            'Drive innovation in low-resource language modeling, efficient training (distillation, quantization, PEFT), and robust speech models for noisy classroom environments',
            'Design and run experiments for model benchmarking; develop evaluation metrics connecting model outputs to literacy outcomes',
            'Mentor research scientists, ML engineers, and applied researchers; enforce reproducibility and rigorous evaluation standards',
            'Collaborate with Engineering and Product to productionize models and support school pilot deployments',
        ],
        required: [
            "PhD or Master's with significant research experience in Machine Learning, Speech Processing, NLP, Computer Vision, or related field",
            '4+ years post-PhD experience in AI/ML or applied research roles',
            'Strong expertise in at least one of: speech recognition/processing, NLP/LLMs, or multimodal AI',
            'Hands-on experience training and fine-tuning large-scale models',
            'Strong coding proficiency in Python, PyTorch/TensorFlow, and distributed training frameworks',
        ],
        preferred: [
            "Experience with children's speech data or literacy-related AI",
            'Background in low-resource or multilingual modeling',
            'Exposure to education technology or public-sector deployments',
            'Experience designing evaluation metrics beyond standard benchmark datasets',
        ],
    },
    {
        title: 'AI Researcher',
        experience: 'MS/M.Tech or PhD + 1–5 years',
        about: "Bodhan AI is seeking exceptional AI researchers to push the boundaries of Indian language AI. You'll work on cutting-edge research in NLP, Speech, and Vision for 22 Indian languages.",
        responsibilities: [
            'Develop and improve state-of-the-art models for Indian languages',
            'Conduct research in multilingual NLP, low-resource languages, speech recognition, or text-to-speech',
            'Publish research papers at top-tier conferences',
            'Collaborate with academic partners',
            'Optimize models for production deployment while maintaining research quality',
            'Contribute to open-source datasets and benchmarks',
        ],
        required: [
            "MS/MTech or PhD in Computer Science, AI/ML, NLP, or related field",
            'Strong publication record in NLP, Speech, or Vision',
            'Deep understanding of transformer architectures, LLMs, or speech models',
            'Proficiency in PyTorch or TensorFlow',
            'Strong Python programming skills',
            'Experience with large-scale model training and distributed systems',
        ],
        preferred: [
            'Experience with Indian languages or low-resource languages',
            'Contributions to open-source AI projects (HuggingFace, GitHub stars)',
            'Experience with speech processing (ASR/TTS) or multimodal AI',
            'Knowledge of model optimization techniques (quantization, pruning, distillation)',
            "Familiarity with Bodhan AI's models",
            'Strong mathematical foundation in ML theory',
        ],
    },
    {
        title: 'RAG Engineer',
        experience: '1–3 years',
        about: "Build production-ready RAG systems that leverage Bodhan AI's models for Indian language applications. Work on LangChain, LlamaIndex, and custom orchestration frameworks.",
        responsibilities: [
            "Design and implement RAG pipelines using Bodhan AI's speech and LLM models",
            'Optimize retrieval systems for multilingual document search (22 Indian languages)',
            'Build vector databases and embedding systems for Indian languages',
            'Develop prompt engineering strategies for Indian language LLMs',
            'Create production-ready APIs and integration examples',
        ],
        required: [
            '1–3 years experience with LLMs and RAG systems',
            'Hands-on experience with LangChain, LlamaIndex, or similar frameworks',
            'Proficiency in Python and modern ML frameworks',
            'Experience with vector databases (Pinecone, Weaviate, ChromaDB, FAISS, Milvus)',
            'Understanding of embedding models and semantic search',
        ],
        preferred: [
            'Experience with multilingual RAG systems',
            'Knowledge of Indian languages',
            'Built production RAG systems serving real users',
            'Familiarity with Bodhan AI models',
            'Experience with prompt optimization and chain-of-thought reasoning',
            'Contributions to RAG-related open-source projects',
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
        title: 'UI/UX Designer',
        experience: '2–5 years',
        about: "Design intuitive experiences for Bodhan AI's tools, demos, and community platforms.",
        responsibilities: [
            'Design user interfaces for Indic LLM Arena, model demos, multimodal conversational agents, and tools',
            'Create design systems and component libraries',
            'Conduct user research and usability testing',
            'Design for multilingual experiences (22 Indian languages)',
            'Collaborate with engineers on implementation',
            'Create prototypes and wireframes',
        ],
        required: [
            "Bachelor's in Design, HCI, or related field",
            '2–5 years experience in UI/UX design',
            'Strong portfolio demonstrating design process',
            'Proficiency in Figma or similar design tools',
            'Understanding of responsive and accessible design',
            'Experience with design systems and component-based design',
        ],
        preferred: [
            'Experience designing for AI/ML products',
            'Knowledge of Indian language typography and layout',
            'Familiarity with voice interface design',
            'Experience with design thinking and user research',
            'Contributions to open-source design systems',
            'Understanding of developer tools and technical audiences',
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
                {jobPostings.map((job, index) => (
                    <JobCard key={job.title} job={job} index={index} />
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default CareersPage;
