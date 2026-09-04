import { ResearchVertical, Pillar, Principle, GrandChallenge } from './types';

export const VISION_STATEMENT = `Our vision is to build a future where every child learns to read, write, count, and thrive with confidence, and every citizen (young or adult) is equipped to participate meaningfully in an AI-driven world.`;

export const PILLARS: Pillar[] = [
  {
    title: "AI for Education",
    description: "Deploy responsible, inclusive, sovereign AI tools to transform how India learns, teaches, assesses, translates, and receives guidance across every language and every district.",
    points: [
      "LearnCopilot, AssessCopilot, TeachCopilot",
      "Powered by Bharat’s EduAI Stack",
      "Offline-first deployment"
    ]
  },
  {
    title: "Education for AI",
    description: "Prepare India’s learners, teachers, youth, professionals, and government workforce for the AI era through world-class curricula, skilling pathways, and foundational AI literacy.",
    points: [
      "AI curriculum for Classes 6–12",
      "Workforce skilling for AI economy",
      "National 'AI for All' programme"
    ]
  }
];

export const PRINCIPLES: Principle[] = [
  {
    id: "01",
    title: '"The Principle of Avoiding Pretraining"',
    description: "We will not pursue large-scale pretraining from scratch. This is computationally expensive, environmentally costly, and increasingly unnecessary given the availability of strong sovereign and open foundation models. We will instead focus on intelligent mid-training and post-training to specialise models for educational, multilingual, and deployment-specific needs."
  },
  {
    id: "02",
    title: '"The Principle of Language Expansion"',
    description: "We will prioritise expanding AI capabilities across Indian languages, dialects, accents, and code-mixed usage. The primary barrier to equitable AI access in India is linguistic coverage, not model capability in high-resource languages. Our research will therefore focus on translation, speech, localisation, and fairness across linguistic communities."
  },
  {
    id: "03",
    title: '"The Principle of Reliable Evaluation"',
    description: "We will develop and rely on robust, transparent, and reproducible evaluation metrics and benchmarks. Educational impact cannot be measured using surface-level accuracy metrics alone. Our evaluations will reflect real-world conditions such as children’s speech, classroom noise, low-end devices, and multilingual usage."
  },
  {
    id: "04",
    title: '"The Principle of Real-World Grounding"',
    description: "We will select research problems that are directly motivated by real challenges faced by learners, teachers, administrators, or policymakers. Research disconnected from deployment realities rarely translates into meaningful impact. Grounding ensures that scientific progress leads to measurable improvements in educational outcomes."
  },
  {
    id: "05",
    title: '"The Principle of Inclusion by Design"',
    description: "We will design systems, datasets, and evaluations to be equitable across language, region, socio-economic context, and ability from the outset. Bias and exclusion often arise when inclusion is treated as a post-hoc concern. Designing for diversity early ensures fairness, robustness, and broader adoption."
  },
  {
    id: "06",
    title: '"The Principle of Deployment Constraints as First-Class Variables"',
    description: "We will account for real deployment constraints such as low-end devices, intermittent connectivity, latency, and energy efficiency. Educational systems in India operate under diverse and often constrained infrastructure conditions. Research that ignores these constraints cannot scale reliably or equitably."
  },
  {
    id: "07",
    title: '"The Principle of Impact Beyond Model Accuracy"',
    description: "We will measure research success beyond model accuracy alone. Educational impact must be defined in terms of learning gains, fairness, robustness, usability, and reductions in teacher or administrative effort. This is necessary because high accuracy does not automatically translate into better learning or meaningful classroom outcomes."
  },
  {
    id: "08",
    title: '"The Principle of Longevity Over Demos"',
    description: "We will build research outputs intended for long-term use rather than short-lived demonstrations. Educational systems must be maintainable, extensible, and operable at national scale over multiple years. This is essential because public education infrastructure values reliability and continuity over novelty."
  },
  {
    id: "09",
    title: '"The Principle of Child Safety, Dignity, and Trust"',
    description: "We will design all learner-facing systems with children as the primary users. Educational AI operates in high-trust, high-stakes environments where emotional safety, age-appropriate behaviour, privacy, and fairness are critical. Protecting child dignity and trust is essential for responsible deployment and long-term adoption in public education systems."
  },
  {
    id: "10",
    title: '"The Principle of Open and Transparent Development"',
    description: "We will build and release our models, datasets, benchmarks, and tools as open-source wherever possible. Openness enables reproducibility, independent scrutiny, and collective improvement across the research and education ecosystem. This is essential for public trust, long-term sustainability, and broad adoption by states, institutions, and partners."
  }
];

export const GRAND_CHALLENGES: GrandChallenge[] = [
  {
    id: "on-device-systems",
    vertical: "Grand Challenge",
    title: "On-Device Systems for AI in Education",
    description: "",
    theme: "purple",
    iconName: "Target"
  }
];

export const RESEARCH_VERTICALS: ResearchVertical[] = [
  {
    id: "asr",
    title: "Automatic Speech Recognition",
    shortTitle: "ASR",
    description: "Research on robust, fair, and efficient speech recognition for Indian educational settings, covering child speech, dialects, STEM usage, and deployment on low-resource devices.",
    iconName: "Mic",
    theme: "orange",
    problemCount: 48,
    tags: ["speech"],
    problems:  [
    {
        "id": "4.1.1",
        "title": "Robust ASR for children",
        "description": "Current ASR systems trained on adult speech perform poorly for children due to acoustic characteristics (pitch, formants) and pronunciation variability. The goal is to build an ASR system that reduces WER gap vs adult ASR and generalizes across ages 5-12, regions and device types. This would have the following research outcomes resulting in large scale children voice datasets, benchmarks for evaluation, state of the art models for children's speech recognition, and automatic assessment of oral reading and fluency",
        "outcomes": [
            {
                "id": "O1",
                "title": "Benchmark for Multilingual Child Speech",
                "description": "A comprehensive benchmark for child speech will be established to evaluate ASR and audio-LLM performance across Indian languages. The benchmark will include read-aloud, conversational, and spontaneous responses from children, allowing systematic measurement of accuracy gaps between adult-trained systems and child speech. It will also enable the study of techniques such as few-shot prompting for audio LLMs and synthetic child-speech augmentation to improve recognition accuracy. This benchmark will serve as the reference dataset for assessing child-speech robustness across all future models in the ecosystem.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O2",
                "title": "Cross-Age and Cross-Language Generalization Study",
                "description": "A structured study will examine how well ASR systems generalize across age groups and languages. The analysis will evaluate whether speech samples from older children can improve recognition accuracy for early readers and whether models trained on a subset of languages can transfer effectively to others. The study will compare conventional ASR models with newer audio LLMs to quantify gains in transferability. Outcomes from this work will directly inform data-collection priorities and model-design strategies for coverage across all 22 languages.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O3",
                "title": "A large scale multilingual child-speech corpus and Verbatim ASR model",
                "description": "A large-scale child-speech corpus will be created, covering all 22 Indian languages with broad demographic, dialectal, and age diversity. The dataset will include both structured reading tasks and free-form speech, with verbatim transcripts that preserve disfluencies essential for downstream reading-fluency evaluation. Distinguishing between a stutter, a correction (reading 'the' then fixing to 'that'), and a sounding-out attempt (d-d-dog). Standard ASR often deletes these disfluencies to 'clean up' the transcript, but for ORF assessment, these are the most important data points. Models trained on this corpus will be benchmarked against the datasets from Outcomes 1 and 2 to demonstrate improvements in robustness, accuracy, and literal transcription quality. The resulting ASR system will serve as the core speech-recognition backbone for ORF assessment and multilingual learning applications.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O4",
                "title": "Fairness and Inclusivity in Child ASR Across Indian English Accents",
                "description": "A regionally representative benchmark for Indian English spoken by children will be created to ensure fair ASR performance across diverse accents. Speech samples collected from children across multiple regions will be publicly released and rated by school teachers, who will identify whether pronunciations are correct at the word level and mark accent-driven variations as acceptable. These annotated samples will form a benchmark for evaluating existing ASR systems on whether they correctly recognize words spoken with different regional accents. The benchmark will also be used to assess oral reading fluency and prosody scoring models, enabling analysis of whether scoring varies systematically across accents, or between urban and rural speakers. This outcome will provide the evidence base and tools needed to ensure that child ASR and ORF scoring remain equitable across India's linguistic regions.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O5",
                "title": "A Large-Scale Indian-English Child Speech Corpus and Verbatim ASR Model",
                "description": "A dedicated child-speech corpus for Indian English will be created to capture accent diversity across regions, socio-economic backgrounds, and schooling environments. The dataset will include structured reading passages, spontaneous responses, and conversational queries, with verbatim transcripts that retain disfluencies such as repetitions, corrections, false starts, and sounding-out attempts that are crucial for reading-fluency and comprehension diagnostics. Educators will annotate word-level correctness and acceptable accent-driven pronunciation variants to ensure inclusive ground-truth labels. The resulting corpus will support the development of a verbatim ASR model for Indian children that remains robust across accents and preserves diagnostic details typically removed by standard ASR systems. This ASR model will form the core speech engine for English ORF assessment, and accent-inclusive learning applications.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O6",
                "title": "Forced Alignment for Diagnostics in Child Speech and ORF Assessment",
                "description": "A robust forced-alignment framework will be developed for Indian languages to support precise diagnostic analysis of children's reading. Using Conformer-CTC models such as NeMo, character-level probability spikes from the CTC greedy decoder will be extracted and aligned to the expected text using dynamic time warping (DTW). This alignment will allow accurate identification of pause locations, timing irregularities, and character-level confusions such as substitutions, deletions, and hesitations, which are critical signals for ORF scoring and reading-difficulty diagnostics. A dedicated benchmark will be created with manually aligned samples across multiple Indian languages to evaluate alignment accuracy and timing precision. The resulting alignment models will enable fine-grained measurement of reading behaviours, improve the reliability of automated fluency scoring, and support early detection of atypical reading patterns in children. As a stretch goal we should also see if such alignment can be obtained from transformer based models as modern ASR models use a transformer based LLM backbone.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O7",
                "title": "Automated Oral Reading Fluency and Prosody Scoring",
                "description": "An automated scoring framework will be developed to estimate a child's reading fluency based on verbatim ASR output and prosodic features such as pauses, hesitations, and intonation patterns. The scoring system will combine accuracy, reading rate, and prosodic indicators to align with NIPUN Bharat and state ORF rubrics. A benchmark of human-rated samples across multiple languages and English accents will be used to validate the reliability, fairness, and noise-robustness of the automated scores. This work will result in a pedagogically consistent fluency-assessment module which generalises across languages and English accents and is ready for deployment in classrooms and learning applications.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O8",
                "title": "Multimodal Audio-Visual Fluency and Prosody Assessment Systems",
                "description": "A multimodal ASR framework will be developed that jointly analyzes speech and visual cues such as lip movements, articulation patterns, and reading posture to strengthen fluency and prosody measurement, especially in noisy or low-resource environments. By integrating audio-only and audio-visual encoders, the system will capture timing, rhythm, pausing behavior, articulation clarity, and expressive prosody with greater robustness than audio-only models. New benchmarks will be collected featuring aligned audio-video recordings, human-rated fluency/prosody scores, and diverse reading conditions (lighting, device types, background noise). These benchmarks will support training audio-visual ASR models tailored for oral-reading tasks and will enable systematic evaluation of whether visual grounding reduces WER, improves prosody estimation, and resolves ambiguities in disfluent or softly-spoken passages. The resulting models are expected to offer more consistent, equitable fluency scoring across languages, accents, and reading contexts, forming the basis for next-generation classroom-ready oral-reading assessment tools.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O9",
                "title": "Large Scale Longitudinal Study and RCT for ORF App Effectiveness",
                "description": "A large-scale longitudinal evaluation and randomized controlled trial will be conducted to measure the impact of the ORF app on early-grade reading outcomes. The study will track children's reading progress over 6-12 months, supported by repeated ORF measurements, usage analytics, and independent human-administered assessments. Treatment and control groups will be established in selected districts to estimate effect sizes and subgroup differences. This work will generate rigorous, policy-relevant evidence on the effectiveness, equity, and real-world reliability of the ORF app, supporting state- and national-level scale-up decisions.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O10",
                "title": "Direct Initialization with Pre-Fine-Tuned Models",
                "description": "A study of the direct leveraging of pre-fine-tuned models as an initialization strategy will be explored to reduce dependence on child speech educational data. The core idea is to investigate whether models that have already been fine-tuned on a large and diverse adult or general speech domain (perhaps even on a related task like speaker identification or speech enhancement), can serve as a superior starting point compared to models initialized from scratch or standard pre-training. The hypothesis is that by starting from a model that has already converged on a vast acoustic space, even one that is stylistically different (off-distribution) from child speech, the model might retain powerful latent representations of phonetic and linguistic structure. This initialization could potentially require zero to minimal labeled child speech data to reach acceptable performance for educational applications like Oral Reading Fluency (ORF) assessment. The research would focus on evaluating the performance of these zero-shot initialized models, which, if the transfer is highly effective, could drastically reduce the data requirement for child speech, allowing immediate deployment or rapid development with only the small, specialized educational datasets typically available. This direction is crucial for assessing the true limits of acoustic domain transfer and maximizing the utility of existing large-scale foundational speech models.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O11",
                "title": "Strategic Data Augmentation for Child ASR Bootstrapping",
                "description": "A critical initial research activity would be to study the repurposing of existing non-child speech datasets for use in training child Automatic Speech Recognition (ASR) models. This involves conducting a structured study to determine the efficacy of style transfer and acoustic perturbation mechanisms on existing large-scale adult speech corpora. The goal is to assess if techniques such as pitch/formant manipulation (to simulate the higher vocal tract resonances and fundamental frequency of a child) can generate sufficiently realistic 'pseudo-child' samples. These augmented samples could then be used to bootstrap the training of initial ASR models, thereby providing a necessary initial training signal and significantly accelerating model development before the complete, large-scale, and costly collection of dedicated child-specific speech corpora. This strategy offers an essential head-start in closing the Word Error Rate (WER) gap between adult and child ASR systems..",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.2",
        "title": "Expanding ASR to Indian dialects and accents",
        "description": "Current ASR systems trained on standardized language norms struggle with the rich dialectal and accent diversity found across India. Regional pronunciation patterns, lexical variants, and prosodic differences lead to significant disparities in recognition accuracy and can undermine fairness in educational applications. The goal is to build ASR and LLM-driven systems that perform equitably across dialects of Hindi and other major Indian languages, as well as across Indian-English accents spanning urban, rural, and region-specific varieties. This effort will produce dialect-balanced benchmarks, large-scale dialectal speech corpora, state-of-the-art dialect-aware ASR models, and evaluation frameworks that measure semantic robustness, task success, and explanation quality under dialect and accent variation.",
        "outcomes": [
            {
                "id": "O12",
                "title": "Benchmarking ASR Performance on Hindi Dialects",
                "description": "A dedicated benchmark will be created to evaluate the performance of existing ASR and audio-LLM models on five major Hindi dialects. The benchmark will include regionally representative speech samples covering diverse acoustic and lexical variations. It will enable systematic comparison of current systems, highlighting dialect-specific error patterns and identifying gaps in accent coverage. Are frontier models already good at handling dialects (inherently or with few shot prompting)? This outcome will provide a reliable reference for assessing fairness, robustness, and inclusivity of speech technologies in the Hindi belt.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O13",
                "title": "Multilingual Dialect Benchmark for Top Indian Languages",
                "description": "A comprehensive benchmarking suite will be developed for 4-5 dialects each of the top five Indian languages. The benchmark will capture major regional variations within each language and provide a unified platform for evaluating standalone ASR systems and audio LLMs. Analyses will focus on how dialect variability affects recognition accuracy and on identifying dialects that are systematically underserved. Are frontier models already good at handling dialects (inherently or with few shot prompting)? The resulting dataset and evaluation protocols will support the design of more equitable and accent-robust ASR models.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O14",
                "title": "Large-Scale Dialectal Data Collection for Underrepresented Hindi Dialects",
                "description": "A large-scale data collection initiative will be undertaken for at least 15 underrepresented Hindi dialects, targeting 250-500 hours of speech per dialect. The resulting corpus will support the development of state-of-the-art dialect-aware ASR models and enable detailed studies on cross-dialect generalization. Experiments will also examine whether dialect-specific data improves recognition performance in the mainstream parent language and explore synthetic augmentation methods using few-sample voice models. This outcome will significantly expand ASR coverage to linguistically diverse communities.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O15",
                "title": "Large-Scale Dialectal Data Collection for Underrepresented Dialects of Top 10 Indian languages",
                "description": "A structured data collection program will be completed for the top ten Indian languages, targeting 250-500 hours for each of four major dialects per language. This effort will support the creation of high-performance ASR models that are robust across dialectal variations, and will include controlled experiments on cross-dialect transferability and performance gains for standardized language variants. Additional studies will evaluate the role of synthetic speech generated from limited real samples. The outcome will deliver scalable, inclusive ASR models suitable for deployment across India's major linguistic regions.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O16",
                "title": "Evaluating LLM Understanding and Task Success for Dialectal Queries",
                "description": "A comprehensive evaluation framework will be developed to assess how reliably LLM-based educational systems interpret and respond to queries expressed in regional dialects and non-standard language forms. Parallel datasets of mainstream and dialectal queries will be created to measure differences in semantic understanding, intent and entity extraction, tone consistency, and downstream task success in applications such as TutorAnna and GuruSaarathi. The analysis will quantify whether dialectal inputs lead to degraded reasoning quality, semantic drift across multi-turn interactions, or reduced task completion compared to mainstream inputs. The study will also test whether LLMs can recover meaning from imperfect transcripts (including think-mode settings) and whether few-shot personalization improves end-to-end stability. This outcome will provide clear evidence on the inclusivity, robustness, and fairness of LLM-driven learning systems across dialectal variations.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O17",
                "title": "Assessing Explanation Quality Under Indian-English Accent Variation",
                "description": "A structured evaluation will be conducted to determine whether LLM-based tutoring systems provide equally accurate, clear, and pedagogically aligned explanations when queries are asked in different Indian-English accents. The study will compare responses for the same question spoken in urban, rural, and region-specific accents, examining semantic consistency, correctness of reasoning, clarity of instructional language, and stability of follow-up scaffolding. Human raters and automated rubrics will be used to determine whether the system avoids semantic drift, oversimplification, or unintended tone changes when accent variation is present. The study will further evaluate whether LLMs can recover meaning from imperfect transcripts (with think-mode) and whether few-shot personalization helps stabilize performance. This outcome will help ensure that TutorAnna delivers equitable and high-quality support to learners across India's diverse English-accent landscape.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O18",
                "title": "Accent-Aware Feedback in the ORF Assistant",
                "description": "A sophisticated Oral Reading Fluency (ORF) application must move beyond generic error correction to provide accent-aware and context-specific pedagogical feedback. The objective is to develop a system that can not only identify an error (e.g., substitution, mispronunciation) but also differentiate between a true reading error and an accent-driven pronunciation variant that is regionally common or acceptable. For instances where a genuine pronunciation error exists, the feedback provided to the student should be slightly customized based on their regional accent or dialectal background. For example, an accent-aware system would, for a student from a specific region, recognize that their typical accent leads to a certain phoneme substitution and offer feedback specifically targeting that pattern of error, making the realization of the mistake more precise and relevant to the student. This customized approach ensures the feedback is pedagogically consistent and accelerates the student's improvement in oral fluency by providing actionable, non-generic guidance, thereby supporting the inclusivity goals set out in the overall project and ensuring the assessment focuses only on core reading difficulties rather than penalizing regional accents.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.3",
        "title": "Robust ASR to STEM use cases",
        "description": "",
        "outcomes": [
            {
                "id": "O19",
                "title": "Spoken STEM Benchmark Across Ages and Code-Mixing",
                "description": "A comprehensive benchmark will be developed to evaluate ASR performance on spoken STEM content, including math expressions, physics equations, chemistry formulae, and biology terminology. The dataset will cover children and adults, multiple Indian languages (including English), accents and common code-mixed patterns used in classrooms. It will include structured reading, problem-solving utterances, and free-form explanations. This benchmark will enable systematic comparison of existing ASR and audio-LLM models, highlighting symbol, number, and terminology error patterns that significantly affect STEM understanding across languages, accents and age groups. This outcome will provide the first standardized evaluation resource for STEM-centric ASR in Indian educational contexts.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O20",
                "title": "Symbol-Aware Metrics for STEM ASR Evaluation",
                "description": "A set of symbol-aware evaluation metrics will be designed to capture the structure and meaning of STEM expressions more accurately than standard WER. Metrics such as symbol error rate, operator error rate, superscript/subscript accuracy, and formula-level structural correctness will be introduced to measure transcription fidelity for equations and technical terminology. These metrics will be validated on the benchmark from OS1 and will quantify the true educational impact of ASR errors, offering a more meaningful assessment framework for STEM-focused speech recognition systems.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O21",
                "title": "Context-Aware and Multimodal STEM ASR",
                "description": "A context-aware ASR framework will be developed that leverages additional information, such as chapter information, textbook photos, handwritten diagrams, problem statements, or retrieved STEM contexts to improve transcription of ambiguous mathematical and scientific expressions. Experiments will evaluate how multimodal cues reduce operator confusions, number substitutions, and formula misrecognitions across languages and code-mixed speech. This outcome will demonstrate the benefits of fusing speech with visual or textual context for accurate STEM understanding in tutoring applications.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O22",
                "title": "Audio-Visual STEM Lecture ASR for NPTEL-Style Content",
                "description": "A large-scale audio-visual STEM lecture corpus will be created from platforms such as NPTEL, with synchronized audio, lecturer, and slide/board captures paired with cleaned transcripts across Indian languages and English. State-of-the-art audio-visual ASR models will be trained and compared against audio-only baselines to quantify gains on technical terminology, equations, and code-mixed explanations, resulting in a dedicated AV STEM benchmark and deployable models for searchable lectures and tutoring assistants.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O23",
                "title": "End-to-End STEM Understanding, Safety, and Task Success Under ASR Noise",
                "description": "A unified evaluation will be conducted to measure whether LLM-based tutoring systems correctly interpret spoken STEM queries and complete downstream tasks, even when ASR transcripts contain symbol, operator, or terminology errors. The analysis will examine reasoning stability, semantic correctness, and safety of explanations in subjects such as chemistry and physics. Differences in performance across ages, accents, and code-mixed inputs will be quantified. This outcome will provide clarity on how ASR noise affects end-to-end STEM learning experiences and identify failure modes requiring mitigation.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O24",
                "title": "Intent and Operator Detection in Spoken STEM Utterances",
                "description": "A specialized model will be designed to detect structural cues in spoken STEM language, such as 'equals,' 'raise to the power,' 'derive,' 'reaction gives,' and 'formula for' and convert them into formal symbolic or conceptual representations. The evaluation will measure accuracy across languages, dialects, and code-mixing patterns. This outcome will support reliable parsing of spoken math and science queries and enhance the robustness of STEM-aware tutoring systems.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O25",
                "title": "Data Mining and Initial Bootstrapping for STEM-Rich ASR",
                "description": "This initiative centers on data mining vast quantities of educational content from publicly available, permissive video sources, such as YouTube, specifically targeting material rich in STEM vocabulary. The immediate goal is to rapidly bootstrap ASR systems to handle the unique linguistic challenges of STEM data, including diverse named entities, symbols, equations, and complex numerical expressions. By applying existing, general-purpose ASR models to the audio of these collected videos, an initial set of raw pseudolabels will be generated. This resulting dataset, along with its associated video information, forms the foundation for targeted model improvement. The subsequent and critical step involves refining these raw transcripts using pseudolabelling, LLM-based correction, and alignment techniques. This refined data then serves as the training set to jumpstart specialized ASR models, allowing them to rapidly acquire the ability to accurately recognize the often-formulaic and technical language used in STEM education, thus overcoming a significant limitation of ASR in educational contexts.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.4",
        "title": "Efficient and Robust ASR for edge devices",
        "description": "",
        "outcomes": [
            {
                "id": "O26",
                "title": "Edge-ASR Benchmark and Evaluation of Compact Model Strategies",
                "description": "A standardized edge-ASR benchmark will be created to evaluate how well current ASR and audio-LLM models perform under extreme compute, memory, and power constraints typical of low-end smartphones and classroom devices. The benchmark will include paired adult-child speech sets across multiple Indian languages to quantify whether accuracy degradation under edge constraints disproportionately affects young learners. Using this benchmark, a systematic evaluation of low-resource ASR strategies will be conducted across representative models such as Whisper, AudioGemma, and compact Conformer variants. The study will compare post-training quantization (4-, 3-, and 2-bit), structured pruning, mixed-precision inference, and lightweight encoder-decoder architectures to identify the most effective approaches for edge deployment. The study will measure trade-offs between WER, verbatim accuracy, memory I/O, latency, and energy usage, and will analyze whether advanced PTQ methods preserve accuracy for linguistically diverse and child-specific speech. This outcome will deliver a reproducible evaluation suite, actionable design insights, and practical guidelines for deploying robust, inclusive ASR models on low-cost edge devices across Indian schools.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O27",
                "title": "Energy-Efficient Edge-ASR Benchmark and Evaluation Suite",
                "description": "A standardized benchmark will be developed to evaluate the energy efficiency of ASR models running on low-cost Indian smartphones and classroom devices. The benchmark will measure battery consumption, real-time factor, CPU load, thermal behavior, and joules-per-minute for representative workloads such as ORF reading, TutorAnna queries, and classroom interaction. Children's speech, adult speech, and dialectal speech will be included to examine whether energy-accuracy tradeoffs differ across demographic groups. This outcome will produce a reproducible evaluation suite and baseline measurements that define minimum efficiency requirements for deploying ASR at scale on government-supported devices.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O28",
                "title": "Model and System Co-Design for Low-Power ASR on Edge Devices",
                "description": "A co-designed ASR pipeline will be developed that jointly optimizes the model architecture and the on-device runtime system to minimize battery drain while maintaining robust accuracy. The study will combine advanced quantization methods, structured pruning, duty-cycling of the ASR engine, adaptive audio sampling, and offloading of noise suppression to low-power DSP cores. End-to-end energy savings will be measured across diverse device profiles, and experiments will quantify accuracy degradation under these low-power configurations. This outcome will provide a deployable, energy-aware ASR stack suitable for continuous or repeated use in classroom and home environments.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O29",
                "title": "State Space Models for Edge-ASR",
                "description": "State Space Model (SSM) architectures will be specifically explored as lightweight alternatives to traditional transformer-based ASR models. SSMs (including Mamba, S4, and related variants) offer linear-time complexity in sequence length compared to the quadratic complexity of self-attention, making them particularly promising for resource-constrained edge deployment. The research will investigate SSM-based encoders and end-to-end architectures, evaluating their inference efficiency (FLOPs, memory footprint, latency), quantization robustness, and streaming capability under various audio chunk sizes. Comparative analysis against transformer and conformer baselines will quantify the accuracy-efficiency trade-offs, with particular attention to long-form audio processing where SSMs' computational advantages are most pronounced.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O30",
                "title": "Domain-Aware Vocabulary Expansion for STEM-ASR and STEM-LLMs",
                "description": "A domain-optimized vocabulary will be designed for math and science speech recognition by consolidating high-frequency STEM terms ('addition,' 'photosynthesis,' 'velocity,' 'chemical reaction,' etc.) into single tokens instead of multi-token fragments. The study will evaluate whether vocabulary expansion in ASR decoders and LLM tokenizers reduces latency, improves recognition accuracy, and lowers inference cost when processing large-scale student interactions. Experiments will compare vocabulary-expanded models against baseline tokenizers across code-mixed English-Indian language speech. This outcome will deliver optimized token sets and measurable efficiency gains for STEM-heavy educational workloads.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O31",
                "title": "STEM-Aware Tokenizer Training and On-Device Decoding Optimization",
                "description": "A STEM-aware tokenizer will be trained from scratch using large corpora of textbook content, teacher manuals, exam questions, and TutorAnna transcripts to create an optimized token set that reduces fragmentation of frequently used concepts. The tokenizer will be integrated into compact ASR and LLM models and benchmarked for reductions in token count, decoding steps, memory usage, and end-to-end latency. The study will quantify how domain-specific tokenization impacts task success in math problem-solving, science explanation retrieval, and code-mixed utterances. This outcome will deliver a practical decoding strategy for STEM-intensive educational applications at scale.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O32",
                "title": "Edge-Aware Data Augmentation for Robust ASR on Low-End Devices",
                "description": "A comprehensive augmentation suite will be developed to simulate the real acoustic and hardware conditions of low-cost Indian devices, including codec distortions, frequency response shaping, microphone distance effects, packet loss, and environment-specific background noise (classrooms, traffic, fans, household audio). This augmented data pipeline will be used to fine-tune ASR models and systematically evaluate whether these edge-aware conditions reduce the performance gap between deployment devices and clean-server benchmarks. The study will quantify improvements in WER, robustness across device classes, and error reduction for both child and adult speech. This outcome will deliver a reproducible augmentation toolkit aligned with the practical realities of field deployment in Indian schools.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O33",
                "title": "Curriculum Learning for Low-Resource and Edge-Constrained ASR",
                "description": "A curriculum-based training strategy will be designed to progressively expose ASR models to increasingly difficult edge-like conditions, starting with clean speech, followed by device distortions, background noise, and hard negative examples such as extreme compression or low SNR. The curriculum will be tested on multiple ASR architectures to measure its impact on stability, generalization, and resilience to low-quality input common in rural classrooms and home environments. Key evaluations will include child-versus-adult robustness, dialectal variation under edge degradation, and consistency across device profiles. This outcome will provide a principled training framework that significantly improves the reliability of ASR on low-power devices used at scale across India.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.5",
        "title": "Streaming ASR",
        "description": "",
        "outcomes": [
            {
                "id": "O34",
                "title": "Robust Endpointing and Utterance Finality in Off-Ideal Educational Environments",
                "description": "An endpointing framework will be developed to ensure reliable streaming ASR in noisy classrooms, rural homes, and child-speech settings where conventional silence-based endpointing performs poorly. The work will combine noise-aware acoustic features, real-time SNR estimation, linguistic cues, and semantic completeness indicators to predict utterance boundaries accurately without requiring clean pauses. A benchmark dataset of classroom and home audio, covering overlapping speakers, fan and traffic noise, and child disfluencies will be created to evaluate Time-to-Finality, premature truncation, and late-finalization errors. This outcome will deliver a robust endpointing module that minimizes response latency while maintaining transcription quality, enabling natural conversational interaction in TutorAnna, GuruSaarthi, and classroom-deployed applications.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O35",
                "title": "Latency-Accuracy Optimization for Streaming ASR in Real-Time Tutoring",
                "description": "This outcome focuses on achieving the optimal balance between transcript accuracy and low latency in streaming ASR, a requirement for responsive educational applications. A unified latency-accuracy prediction framework will be developed using acoustic, prosodic, and language-model signals to determine the ideal moment to finalize a partial transcript. New evaluation metrics such as Time-to-Stable-Transcript (TST) and Semantic Finality Error (SFE) will be introduced to assess usability in real-time tutoring scenarios. Experiments will be conducted across child speech, teacher speech, code-mixed queries, and STEM utterances to quantify the tradeoff curves between stable recognition and minimal delay. This work will result in a principled finalization strategy that significantly improves interactive responsiveness without compromising correctness.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O36",
                "title": "Knowledge Distillation from Offline Models to Improve Streaming Accuracy",
                "description": "A distillation framework will be developed to transfer the superior performance of offline ASR models into compact, low-latency streaming architectures suitable for deployment on low-end devices. The work will explore sequence-level probability matching, feature-level embedding transfer, and alignment-level distillation using high-accuracy offline 'teacher' models. The goal is to reduce the streaming-offline accuracy gap while preserving strict real-time constraints. A multi-domain distillation dataset will be curated, including ORF reading passages, conversational queries, and STEM expressions, to ensure generalization across educational use cases. This outcome will deliver a streaming model that provides high accuracy comparable to offline systems while maintaining the latency required for interactive classroom and tutoring applications.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O37",
                "title": "Contextually-Adaptive Streaming ASR for STEM and Code-Mixed Queries",
                "description": "A context-aware streaming ASR framework will be designed to adapt rapidly when users switch between domains such as general conversation, ORF reading, mathematics, physics, chemistry, or code-mixed vocabulary during tutoring interactions. The system will maintain a real-time context cache that tracks recent linguistic patterns, domain-specific tokens, and semantic cues to bias decoding toward the appropriate vocabulary. Benchmarks will be created for domain-shift scenarios (e.g., moving from Hindi reading to English STEM expressions) to evaluate symbol errors, operator confusion, and language-switch stability. The research will quantify improvements in decoding accuracy for domain-dense utterances and test compatibility with low-latency constraints. This outcome will deliver a streaming ASR model capable of maintaining high reliability across sudden topic shifts, enabling seamless multi-modal learning interactions.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.6",
        "title": "Speaker Adaptation for Better ASR",
        "description": "",
        "outcomes": [
            {
                "id": "O38",
                "title": "Few-Shot Personalization for Quantised ASR Models on Edge Devices",
                "description": "A lightweight personalization framework will be developed to improve the accuracy of quantised ASR models for individual children and teachers using only a few seconds of speech recorded locally on the device. The approach will explore low-rank speaker-adaptive layers, bias vectors, and compact acoustic embeddings that are compatible with highly compressed 4-bit and 3-bit ASR models. Building on recent advances in personalisation for quantised models, the study will examine how combining NormalFloat-style quantisation with LoRA-based speaker adaptation can significantly recover the accuracy lost during model compression while adding less than 1 to 2 percent additional parameters. Experiments will evaluate the effectiveness of personalization across age groups, regional accents, code-mixed speech, and STEM-heavy utterances, with special focus on children's speech where the baseline WER degradation under quantisation is typically higher. The evaluation will quantify relative WER reductions, improvements in verbatim transcription, and latency overhead on low-cost Indian devices. The use of synthetic data generated using TTS models would also be explored. This outcome will deliver a practical, privacy-preserving personalization module that restores high ASR accuracy for diverse users while keeping the model compact and deployable at national scale.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O39",
                "title": "Student-Aware ASR with Speaker Validation",
                "description": "This point outlines the development of a Student-Aware Automatic Speech Recognition (ASR) system designed to ensure the integrity and personalization of educational interactions, particularly within applications like TutorAnna. The core refinement involves integrating speaker validation directly into the ASR pipeline. Specifically, the ASR model will be capable of enrolling a speaker via a small audio utterance. Before transcribing the speech, the system will compare the incoming audio's speaker characteristics against the enrollment. This functionality is extremely useful for preventing gaming of the model, addressing scenarios where a student might attempt to have another person (e.g., an older sibling or adult) impersonate them to complete assignments or pass assessments. By verifying that the voice matches the expected student identity, the system ensures that the intended learner is conducting all the interactions. This feature is critical for maintaining fairness, accuracy, and pedagogical integrity in automated educational tools.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.7",
        "title": "Long-Form Speech Understanding, Diarization, and Classroom Analytics",
        "description": "",
        "outcomes": [
            {
                "id": "O40",
                "title": "Lecture Transcription and Concept-Centric Summarization",
                "description": "A long-form ASR and summarization framework will be developed to convert extended instructional audio, classroom lessons, recorded lectures, and oral explanations into accurate transcripts and concise, revision-oriented summaries. The system will focus on key-concept extraction, topic segmentation, and cross-domain robustness across mathematics, science, and humanities. A benchmark of multi-hour classroom lectures will be created to evaluate summary fidelity, coverage of learning objectives, and resistance to noise and disfluencies. This outcome will support automated generation of high-quality study materials aligned with the curriculum.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O41",
                "title": "Two-Party Diarization and Automated Oral Exam Evaluation",
                "description": "A lightweight diarization and scoring system will be built to separate student and teacher speech during oral assessments or interviews, enabling automated scoring, error detection, and targeted feedback. The research will focus on robust diarization under child speech variability, noisy school environments, and short-turn interactions. A labeled corpus of two-party exam dialogues will be curated to measure diarization purity, turn-taking accuracy, and scoring alignment with trained human graders. This outcome will enable large-scale, low-cost evaluation of oral proficiency and conceptual understanding.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O42",
                "title": "Classroom-Scale Multi-Speaker Diarization and Interaction Analytics",
                "description": "A multi-speaker diarization and analytics module will be designed to quantify classroom interaction patterns such as teacher-student talk ratios, participation distribution, wait time, and student engagement indicators. The system will address overlapping speech, variable acoustics, and crowd noise typical in Indian classrooms. A benchmark covering different classroom formats such as group work, whole-class discussion, activity-based learning will be developed to evaluate segmentation stability and speaker-attribution accuracy. This outcome will provide objective metrics to support pedagogical improvement and teacher training programs.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.8",
        "title": "Evaluation Frameworks",
        "description": "",
        "outcomes": [
            {
                "id": "O43",
                "title": "Semantic Fidelity Benchmark for Educational ASR",
                "description": "A semantic-fidelity evaluation suite will be developed to measure whether ASR systems preserve meaning even when surface-level word errors occur. Metrics such as Semantic Error Rate (SER), Critical Content Error Rate (CCER), and entity extraction accuracy will be introduced to assess the correctness of numerical values, mathematical operators, chemical symbols, named entities, and curriculum-linked concepts. A multi-domain benchmark will be created covering TutorAnna queries, ORF passages, and code-mixed STEM utterances. This outcome will ensure that ASR systems are evaluated on their ability to preserve educational meaning rather than only token-level correctness, reducing the risk of harmful semantic distortions during tutoring and assessment.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O44",
                "title": "Noise, Device, and Environment Robustness Evaluation for Field Deployment",
                "description": "A multi-condition evaluation suite will be created to measure ASR robustness across acoustic environments and device classes typical in Indian schools. Metrics such as Degradation Under Noise (DUN), Acoustic Condition Sensitivity Index (ACSI), and Device Mismatch Penalty (DMP) will quantify model resilience to noise, reverberation, microphone distance, codec artifacts, and low-end phone hardware. A large benchmark will be constructed spanning classroom noise, rural home noise, traffic, fan hum, and varied device profiles. This outcome will enable rigorous testing of ASR systems under real-world deployment conditions and prevent systemic underperformance on low-resource devices.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O45",
                "title": "Long-Form Speech Evaluation Metrics for Classroom and Lecture Analytics",
                "description": "A long-form evaluation suite will be created to assess ASR performance on extended instructional audio, including multi-speaker classrooms and multi-hour lectures. New metrics such as Topic Drift Stability (TDS), Speaker Fragmentation Rate (SFR), and Summary Reconstruction Index (SRI) will be developed to measure segmentation stability, diarization quality, and summary fidelity. A benchmark of real classroom interactions and recorded lectures will be curated across subjects and pedagogical formats. This outcome will provide a principled evaluation framework needed for scalable lecture summarization, classroom analytics, and automated observation tools.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.1.9",
        "title": "Speech Impairments and Speech Disorders",
        "description": "",
        "outcomes": [
            {
                "id": "O46",
                "title": "Differentiating Disorder from Accent, Bilingualism, and Low Literacy",
                "description": "A benchmark will be constructed that explicitly contrasts (a) speakers with confirmed speech disorders, (b) bilingual speakers with strong L1-L2 transfer (e.g., Indian English influenced by Hindi, Tamil, Bangla, etc.), (c) individuals with low literacy or decoding difficulties but intact speech production, and (d) fluent speakers with strong regional accents. Data will span children and adults. Models will be trained and evaluated on their ability to distinguish linguistic/educational factors (accent, second-language phonotactics, low literacy) from genuine speech disorders using only ASR-derived features and minimal metadata. Evaluation will emphasise false-positive rates for disorder risk under accent and bilingual confounds, as well as ablations showing which acoustic/prosodic features are safe and informative. This outcome will directly inform how screening and feedback modules are calibrated so that systems do not stigmatise speakers for being bilingual, non-standard, or low-literate.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O47",
                "title": "Early-Risk Screening of Speech Impairment from Educational and Classroom Speech",
                "description": "A child-focused early-screening framework will be developed that uses audio collected during educational tasks-such as ORF readings, classroom participation, and simple repetition exercises-to estimate risk of speech impairment, without attempting full clinical diagnosis. The system will analyse patterns such as persistent sound substitutions beyond expected age norms, extreme or atypical disfluency profiles, inconsistent articulatory errors, and very low intelligibility relative to peers in the same grade and language. A longitudinal dataset will track children flagged by teachers, parents, or the system over 6-12 months, with independent clinical assessments as ground truth. The research will quantify how well ASR-derived features predict 'high-risk vs. low-risk vs. abstain,' and define conservative thresholds and abstention policies. This outcome will support large-scale school-based screening workflows while keeping clinicians in the loop for final decisions.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O48",
                "title": "Audio-Visual Motor-Speech Analytics for Clinical and Assistive Settings",
                "description": "A multimodal dataset will be curated with synchronised audio and front-facing video of articulation tasks, reading, and functional communication from adults and children with motor-speech disorders (e.g., dysarthria from cerebral palsy, stroke, Parkinson's) as well as typical controls. Visual features (lip closure, jaw movement, symmetry, timing of articulatory gestures) will be fused with acoustic cues to (i) improve ASR robustness for severely impaired speakers, and (ii) derive interpretable motor-speech markers such as articulatory undershoot, slowed or rushed speech, and inconsistent place/manner of articulation. Experiments will examine the minimum viable video quality and device requirements (e.g., low-end phone webcams) for real-world deployments in tele-rehabilitation apps and assistive communication tools. This outcome will show when and how multimodal signals materially improve both recognition and clinical interpretability.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]

  },

  {
    id: "tts",
    title: "Text-to-Speech Synthesis",
    shortTitle: "TTS",
    description: "Creating natural, expressive, empathetic, and pedagogically effective speech synthesis for Indian languages,  optimized for clarity, pronunciation, and prosody in educational and STEM content.",
    iconName: "Volume2",
    theme: 'teal',
    problemCount: 34,
    tags: ["Speech"],
    problems: [
    {
        "id": "4.2.1",
        "title": "Robust TTS for Children",
        "description": "",
        "outcomes": [
            {
                "id": "O49",
                "title": "Paralinguistic, Disfluency-Rich, Empathetic & Natural TTS for Young Learners",
                "description": "Young children learn best from voices that feel warm, encouraging and human rather than flat or mechanical. Next-generation TTS systems will be developed to synthesize age-appropriate paralinguistic cues such as small laughs, gentle giggles, sighs, and simple interjections like 'wah', 'achha', 'oh ho', or 'arre wow', capturing the warmth and encouragement that Class 1-2 learners naturally expect during reading. This work will focus on developing data, models, and evaluations to enable controllable generation of micro-expressions and child-friendly disfluencies that make the voice feel supportive and relatable rather than mechanical. The research will produce a large multilingual paralinguistics dataset, state-of-the-art empathetic TTS models, and a standard benchmark for evaluating emotional naturalness and engagement in educational settings.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O50",
                "title": "Adaptive and Emotionally Intelligent TTS for Enhanced AI Tutoring",
                "description": "The central challenge is to create a Text-to-Speech (TTS) system that moves beyond simple narration to function as an adaptive and emotionally intelligent AI tutor. This requires two key developments - first, building a TTS that can personalize its speaking style, adjusting speed, prosody, clarity, and explanation depth to a child's real-time Oral Reading Fluency (ORF) profile-such as fluency level, hesitation patterns, and decoding difficulties-to provide targeted and effective reading support. Second, the TTS must be context-aware, selecting an appropriate emotional stance (e.g., patient, calm, steady) in response to a child's behavior or emotional state (e.g., anxiety, distraction) to ensure the AI tutor's voice is always pedagogically appropriate and supportive. This research will produce a unified TTS model that uses both ORF signals and multimodal input to infer the correct personalized and emotional delivery, ensuring AI tutors behave like thoughtful, effective teachers rather than single-style narrators.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O51",
                "title": "Expressive Narrative and Child-Like TTS for Storytelling and Language Development",
                "description": "The aim is to build TTS voices that can tell stories with the excitement, curiosity, and warmth that young children naturally respond to during early literacy and language-learning activities. A large multilingual narrative-speech dataset will be created with expressive child-like voices and emotion-rich passages that capture the rhythm and liveliness of story-time. Models will be evaluated on their ability to produce engaging pitch movement, dynamic intonation, and narrative clarity that sustain attention and improve recall among young listeners. The research will generate state-of-the-art expressive TTS models and a benchmark for assessing narrative expressiveness, guiding the development of storytelling voices that children genuinely enjoy and connect with.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O52",
                "title": "Pronunciation Fidelity and Robustness Evaluation Framework for ORF TTS",
                "description": "This work aims to establish a rigorous evaluation framework that verifies whether TTS systems used in ORF applications produce pronunciation that is accurate, stable, and developmentally safe for early-grade learners. A comprehensive multilingual test suite will be created to assess performance on common phoneme confusables, child-generated spellings, hesitation-prone words, and diverse Indian names and terms, along with stress tests for noisy or misspelled text that commonly appears in Class 1-3 reading inputs. Models will be evaluated on fine-grained phonetic correctness, cross-language consistency, and zero-shot robustness to new textbook vocabulary and evolving state reading materials. The research will deliver a standardized pronunciation-safety benchmark, enabling practitioners to certify whether a TTS system is dependable enough for large-scale ORF deployment without introducing systematic learning errors.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O53",
                "title": "Prosody and Acoustic Style for Non-Punitive Correction in Reading Support TTS",
                "description": "Children often experience stress when corrected during oral reading, because conventional TTS voices often deliver corrections with flat or authoritative intonation that signals failure rather than guidance. This project investigates how correction can be transformed into a gentler acoustic style that encourages self-repair, focusing on rising intonation, softer volume and suggestion-like phrasing that resemble a teacher offering a quiet hint. A large preference dataset will be collected where annotators choose which correction styles feel supportive rather than punitive, enabling supervised and reinforcement-learning methods to discover prosodic patterns that reduce anxiety. By learning how to 'hint' instead of 'correct,' the research aims to produce TTS models that help children attempt difficult words without fear. The outcomes are a corpus of correction-style preferences, models fine-tuned for supportive prosody and a new evaluation protocol for measuring comfort and confidence during reading corrections.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O54",
                "title": "Architectural Evaluation of Pronunciation Fidelity for STEM Terminology",
                "description": "STEM learning depends on precise spoken terminology, yet current TTS architectures vary widely in how accurately they handle scientific and mathematical words, especially when those words contain phoneme sequences or syllable patterns not seen during training. The goal is to systematically evaluate how different TTS architectures handle the precise and unforgiving pronunciation demands of STEM terminology, where even small errors can distort key scientific or mathematical concepts for learners. Models will be compared on phoneme-level precision, stability, and zero-shot robustness to new scientific terms, symbols, and emerging curriculum content. The research will deliver strong architectural recommendations for building reliable, high-precision STEM TTS that teachers and students can trust for concept explanations and homework guidance.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O55",
                "title": "Evaluating High-Stakes Mispronunciations in STEM TTS",
                "description": "This work develops a principled evaluation framework for 'high-stakes' errors in STEM TTS, where a small mispronunciation can fundamentally change the underlying concept (e.g., 'chlorine' vs 'chloride', 'CO2' vs 'C O', or missing a minus sign in physics). Instead of treating all pronunciation errors as equal, the project will build a taxonomy of STEM-critical units-operators, constants, units, chemical groups, indices, and key technical terms-and design risk-weighted metrics that reflect their pedagogical impact. Listening tests with teachers and students will be combined with automatic analyses to estimate how different architectures and frontends fail on these critical tokens, and how those failures affect comprehension and problem-solving accuracy. The outcome is a set of evaluation protocols and benchmarks that allow practioners to quantify and compare the safety of STEM TTS systems, beyond generic MOS or word-level accuracy.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O56",
                "title": "Robust Multilingual STEM Text Frontend for TTS",
                "description": "This work aims to build a strong, STEM-aware text frontend that maximizes intelligibility before inputs reach the acoustic model. The project will design a multilingual, code-mixed normalization and parsing pipeline that can reliably handle equations, units, constants, chemical formulae, indices, and informal student spellings across the 22 Indian languages (e.g., 'ye equation simplify karo', 'H2SO4 ka oxidation number'). Ambiguities from OCR noise, missing parentheses, hyphen vs minus, concatenated symbols ('mg' vs 'm g'), and inconsistent spacing will be explicitly modeled and resolved into a canonical 'speakable' form. On top of this, the work will define a standard, machine-readable canon for how to read formulas, symbols, and STEM terms aloud in different Indian languages, which TTS systems and curricula can share. Prosodic cues (grouping, pausing, emphasis) will then be attached to this canonical representation, so that architectures downstream inherit both high intelligibility and teacher-like phrasing 'for free'.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O57",
                "title": "Timing-Aware Pause and Stress Modeling for STEM-Focused TTS",
                "description": "STEM explanations often overwhelm learners when spoken too quickly or without the right emphasis, because understanding a formula or multi-step procedure depends as much on timing and stress as on pronunciation. This project develops a timing-aware frontend that predicts when the system should pause, slow down or emphasise critical terms using cues such as expression complexity, symbol density and a learner's hesitation history. These timing decisions will be encoded as explicit pause and stress markers that instruct the TTS engine when to wait, when to highlight key quantities or operators and how to signal transitions between steps. By replacing rapid-fire responses with deliberate timing and word-level emphasis, the research enables clearer walkthroughs of formulas, procedures and scientific ideas. The outcomes are a large dataset of pause and stress annotations, a robust STEM-aware frontend capable of generating these markers and TTS models that can use them to produce more thoughtful, comprehensible spoken explanations.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O58",
                "title": "Mixture-of-Experts Architectures for Domain-Specialized TTS Across Subject Areas",
                "description": "Different academic subjects place radically different demands on TTS, and dense architectures struggle to model this diversity because STEM terminology, social-science vocabulary, and language-arts discourse lie on opposite ends of the frequency and prosody spectrum. Rare domain-specific words, unseen syllable patterns, symbolic expressions, and overloaded polysemous terms are often mispronounced or prosodically flattened by dense models, creating comprehension barriers in AI Tutors and ORF systems where reliability is essential. This project explores Mixture-of-Experts (MoE) architectures for TTS, where specialized experts handle low-frequency jargon, mathematical and chemical symbols, domain-specific prosody, and context-driven meaning disambiguation, while general experts handle everyday instructional speech. The goal is to build routing schemes, token rarity detectors, and domain-context encoders that dynamically activate the right experts, such as a Math expert, a Physics Expert, a Chemistry Expert for 'molybdenum,' or a Symbolic Expert, ensuring precision without overwriting common-language pronunciations. The outcome will be a robust MoE-TTS foundation that maintains high accuracy across the long tail of subject-specific vocabulary, remains update-efficient for new curriculum terms, and delivers dependable subject-aware voices.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.2",
        "title": "TTS for STEM",
        "description": "",
        "outcomes": [
            {
                "id": "O59",
                "title": "Robust Multilingual Pronunciation Benchmark for Code-Mixed Rich STEM TTS",
                "description": "Classroom STEM discourse in India is heavily code-mixed, and existing TTS systems struggle to pronounce mixed Hindi-English and regional-English terminology with consistent accuracy. This effort seeks to develop a rigorous multilingual benchmark that measures how well TTS systems pronounce STEM words under real classroom conditions, including the code-mixed Hindi-English and regional language-English usage common in Indian schools. A large benchmark dataset will be created that covers scientific terms, mathematical expressions, chemical nomenclature, technical symbols, and common classroom code-mixing patterns such as 'oxidation number kya hota hai' or 'ye equation simplify karo.' Models will be evaluated on accuracy, consistency, and resilience to noisy transcripts, handwritten OCR outputs, and student-typed spellings. The research will produce the first national-level pronunciation safety benchmark for STEM TTS, helping ministries, boards, and ed-tech partners certify TTS systems for high-stakes academic use.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.3",
        "title": "Speaking Intelligence for AI Tutors",
        "description": "",
        "outcomes": [
            {
                "id": "O60",
                "title": "End-to-End Full-Duplex Speech Tutors for Real-Time Interaction",
                "description": "Real tutoring takes place in a shared acoustic space where the teacher listens and speaks simultaneously, offers backchannels while the child reads, and adapts timing to the learner's thought process. Current AI tutors cannot achieve this because they rely on half-duplex, text-mediated pipelines that wait for silence, ignore interruptions, lose prosodic information and generate audio out of sync with on-screen actions. The goal of this research is to develop a fully end-to-end, full-duplex speech-to-speech architecture that perceives and generates audio as a continuous stream, enabling the tutor to listen while speaking, detect hesitation and uncertainty directly from the learner's voice. Technically, this requires audio-native modeling for simultaneous speech generation and recognition, turn-end prediction without silence thresholds, edge-based interruption detection, and paralinguistic conditioning embedded within the generated audio. The outcomes are a large multimodal dataset of overlapping student-tutor interactions, full-duplex S2S models capable of real-time operation and a new benchmark evaluating tutors on timing fidelity, interruption handling and acoustic empathy.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O61",
                "title": "Audio-Visual LLMs for Saliency-Aware, Visually-Synchronized STEM TTS",
                "description": "Spoken explanations in STEM only make sense when the voice aligns with what the learner sees, yet current TTS systems generate speech without understanding the visual scene, the saliency of objects or the timing of animations. The goal of this research is to develop audio-visual LLMs that treat speech generation as a coordinated multimodal process, producing not only audio but also time-aligned signals that control highlights, diagram reveals, object references and animation pacing. Technically, this requires models that jointly encode visual context, predict saliency-driven 'speak-about-this-now' cues, generate duration-aware speech that matches the temporal structure of on-screen actions and synthesize lip-synchronized output for avatars or animated tutors. The outcomes are a large-scale multimodal corpus pairing audio with visual event traces, audio-visual LLMs capable of generating synchronized speech-action streams and a benchmark that evaluates timing fidelity, saliency alignment, lip-sync quality and cross-lingual dubbing consistency for STEM-focused tutoring systems.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.4",
        "title": "Expanding TTS for Accents, Dialects and Tonal Languages",
        "description": "Current TTS systems assume a standardized reference accent and normalize the rich phonetic, and lexical diversity across India, creating a mismatch that is especially harmful in education where children learn best from voices that sound local, carry familiar rhythms, and respect regionally valid pronunciation. Most existing models, whether Indian or global, fail to faithfully synthesize dialectal variants, remain unstable across accents, and cannot reproduce the fine-grained prosody required for tonal or quasi-tonal languages. This leads to higher cognitive load, weaker immersion, reduced trust, and limited adoption in communities where linguistic identity is tied closely to local speech patterns. The central research challenge is to build TTS systems that natively represent, synthesize, and preserve dialectal, accent, and tonal variation instead of normalizing it away, supported by new data, richer representations, and evaluation frameworks that measure familiarity, comfort, local acceptance, and equity in educational delivery so that learners everywhere, from Manipuri classrooms to Bhojpuri-medium schools to rural Tamil Nadu reading centers, hear voices that reflect their own linguistic world rather than a distant standardized norm.",
        "outcomes": [
            {
                "id": "O62",
                "title": "Benchmarking TTS Pronunciation and Accent Fidelity for the Top 400 Indian Dialects",
                "description": "A comprehensive TTS benchmark will be created to evaluate how reliably current TTS and audio-LLM-based synthesis models produce natural, intelligible, and locally acceptable speech across the top 400 dialects spoken in India. The benchmark will include dialect-specific phoneme variants, syllable patterns, prosodic contours, and regionally common code-mixing, enabling fine-grained analysis of where models deviate toward standardized accents or fail on dialect-driven pronunciation. This resource will support systematic comparison of existing systems, revealing dialect-specific degradation, out-of-distribution syllable errors, and inconsistencies that directly affect children's ORF outcomes and the trustworthiness of AI tutoring systems. The outcome will provide a rigorous reference for assessing fairness, robustness, and regional acceptance of TTS technologies nationwide, and will clarify whether frontier models handle dialectal variation natively or require explicit conditioning and adaptation.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O63",
                "title": "Large-Scale Multi-Speaker Dialectal TTS Corpora",
                "description": "A nationwide effort will be undertaken to build a large-scale multi-speaker dialectal TTS corpus spanning India's 121 languages and roughly 400+ dialects, targeting about one hour of clean instructional speech per speaker using low-cost home or portable recording setups. The recordings will emphasize teacher-like explanation, emphasis patterns, natural code-mixing, and clear instructional prosody rather than dramatic or highly expressive styles. This resource will produce a diverse dialectal voice bank that captures regional phonetic variation, accent-specific rhythm, and naturally occurring code-mixed speech. The resulting dataset will form the foundation for equitable, dialect-aware TTS systems that reflect the linguistic reality of India's classrooms and communities.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O64",
                "title": "Modelling Speaker and Dialectal Variation in Large-Scale Multispeaker TTS",
                "description": "Using this corpus, research will advance state-of-the-art large-scale multispeaker TTS architectures that can represent, disentangle, and control speaker identity, dialectal characteristics, and their interactions within a single unified model. The focus will be on principled conditioning schemes, robust speaker embeddings, dialect representations, and prosody modelling techniques that preserve fine-grained regional variation across thousands of voices. The goal is to design a single architecture that can reliably synthesize multiple dialects, accents, and speaking personas without degradation or drift, even under limited per-speaker data. New benchmarks and metrics will be created to evaluate whether this single model can maintain naturalness, accent similarity, and speaker similarity across India's full dialectal spectrum.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.5",
        "title": "Edge and Streaming TTS",
        "description": "",
        "outcomes": [
            {
                "id": "O65",
                "title": "Benchmarking Edge-Ready TTS and Evaluating Lightweight Synthesis Approaches",
                "description": "This work will establish a dedicated evaluation suite for testing how well modern TTS and audio-LLM-based synthesis models operate when pushed onto resource-limited devices such as entry-level smartphones and classroom tablets. The suite will cover a diverse mix of short and long educational utterances drawn from major Indian languages, allowing us to probe how low-latency models behave under realistic text patterns found in schools. Using this setup, a comprehensive assessment of lightweight TTS design choices, including distilled student models, aggressive quantization schemes, structured model thinning, neural-codec driven decoding, and low-overhead streaming architectures. The evaluation will examine the balance between output quality, prosodic stability, real-time responsiveness, memory usage, and energy draw on representative hardware. The final deliverable will be an openly reproducible benchmark along with practical recommendations for deploying clear and reliable TTS on inexpensive edge devices used across Indian classrooms.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O66",
                "title": "Lightweight Domain-Aware Intelligibility Control for Edge-TTS",
                "description": "Since edge-size TTS models have limited capacity, they often fail to cover the vast and specialized vocabulary found in STEM and other subject domains, resulting in frequent mispronunciations of technical terms. This project investigates compact mechanisms for adding domain-specific pronunciation support on-device, such as small curriculum-aware embeddings, lightweight lexicon adapters, and compressed domain hint vectors that can operate within tight compute and memory budgets. The evaluation will measure how well these techniques improve the articulation of math expressions, science terminology, and subject-heavy vocabulary under edge constraints. The outcome will be a practical approach that enables domain-sensitive intelligibility in small TTS models without relying on larger cloud-based architectures.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O67",
                "title": "Neural Codec-Driven Streaming TTS for Real-Time Edge Inference",
                "description": "This work develops efficient streaming TTS architectures that combine lightweight text encoders with neural-codec decoders optimized for real-time inference on constrained hardware. The project will examine shallow autoregressive decoders, depthwise RVQ-based codecs, and Mamba-style state-space acoustic models to minimize computation while maintaining stable prosody. Benchmarking will compare streaming stability, incremental latency, memory I/O, and robustness to long utterances. The outcome will be a practical streaming TTS pipeline designed for real-time explanations and interactive educational agents running directly on-device.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O68",
                "title": "Hierarchical Speculative Decoding for RVQ-Based Edge and Streaming TTS",
                "description": "Most streaming TTS models built on audio LLMs rely on residual vector quantization (RVQ), where each short frame of audio is represented using multiple codebooks ranging from coarse structure to fine acoustic detail. On edge hardware, autoregressively predicting every codebook in sequence dramatically increases generation length and makes on-device synthesis prohibitively slow. This project investigates a hierarchical speculative decoding strategy in which only the coarse codebook stream is generated autoregressively, while a lightweight auxiliary model predicts the remaining fine codebooks in parallel conditioned on the coarse predictions. The study will explore multi-stream decoding designs, draft-and-verify mechanisms, and alignment losses that ensure the fine-level tokens remain consistent with the coarse acoustic backbone. The outcome will be a streaming TTS pipeline that collapses many per-frame prediction steps into a single pass, enabling substantial speedups and making RVQ-based audio LLMs practical for real-time use on low-cost edge devices.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O69",
                "title": "Multi-Scale State-Space Models for Streaming Edge-TTS",
                "description": "Transformer-based TTS models are expensive to run on small devices because they rely on large KV caches and uniform compute across all timesteps, even though speech operates at multiple distinct timescales. Audio generation requires high-resolution modeling of short-term acoustic detail (2-10 ms), mid-range prosodic patterns (40-80 ms), and long-range semantic structure (300-800 ms), yet current architectures treat these layers of information the same. This project investigates a hierarchical state-space architecture in which separate SSM streams handle fine acoustic transitions, slower prosodic contours, and very slow semantic dependencies, with cross-stream interactions that allow accurate synthesis without full-sequence attention. The study will examine designs for nested or coupled SSM modules, stability constraints for long-horizon generation, and efficient parameter sharing for on-device execution. The expected outcome is a multi-scale streaming TTS model that matches transformer-level quality while achieving significantly lower memory usage and 5x-30x faster inference on edge hardware.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.6",
        "title": "Low-Frame-Rate Neural Codecs for Generative Audio Modeling",
        "description": "Standard neural audio codecs (like EnCodec or DAC) typically operate at 50-100Hz, producing sequence lengths that are prohibitively expensive for Large Language Models (LLMs) to model over long contexts. This research proposes a shift from 'coding for reconstruction' to 'coding for generation.' The goal is to learn ultra-low frame rate discrete representations (e.g., 12.5Hz or lower) that compress temporal redundancy while preserving semantic and paralinguistic integrity. By treating the codec as a 'tokenizer for audio,' we aim to create a discrete vocabulary that allows Transformer-based models to generate speech as fluently and consistently as they generate text, enabling long-form synthesis, in-context learning, and zero-shot voice cloning capabilities that are currently impossible with high-frequency representations.",
        "outcomes": [
            {
                "id": "O70",
                "title": "Ultra-Low Frame Rate Tokenization for Long-Context Audio Generation",
                "description": "The primary bottleneck in autoregressive audio generation is sequence length. A 10-second clip at 50Hz results in 500 time-steps, whereas a 12.5Hz representation reduces this to just 125 steps-comparable to a text sentence. This work investigates architectures for Nano-Codecs that aggressively downsample the temporal dimension while maintaining high-fidelity reconstruction through powerful upsampling decoders (e.g., HiFi-GAN or diffusion-based decoding). The objective is to define a codec that minimizes the 'bits-per-semantic-unit' rather than just bits-per-second, enabling LLMs to attend to minute-long or hour-long contexts. Benchmarks will focus on the generative stability of these tokens - measuring whether an LLM can maintain speaker identity, prosodic consistency, and rhythmic structure over long durations when trained on this ultra-compact vocabulary.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O71",
                "title": "Disentangled Latent Spaces for Controllable Generation",
                "description": "In classic speech coding, all information (content, speaker, acoustic environment) is entangled in the codebook indices. For generative tasks, this entanglement makes control difficult (e.g., changing the speaker without changing the content). This project aims to build factorized generative codecs where the latent space is explicitly structured into independent streams - a 'Semantic Stream' (capturing linguistic content), a 'Speaker Stream' (capturing timbre), and a 'Prosody Stream' (capturing rhythm/pitch). We will explore Information Bottleneck principles and vector quantization strategies that force this separation. The outcome will be a codec that allows an LLM to 'swap' a speaker style simply by changing the speaker tokens, or 'edit' the emotion of a sentence by modifying prosody tokens, without requiring retraining of the generation model.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O72",
                "title": "Hierarchical Semantic-Acoustic Tokenization",
                "description": "Audio generation is naturally hierarchical - high-level meaning drives low-level acoustics. This work proposes a multi-scale codec architecture where a 'coarse' codebook captures broad semantic and phonetic shifts (perfect for reasoning and structure), while 'fine' codebooks capture acoustic details (breath, room impulse, texture). Unlike standard Residual Vector Quantization (RVQ) which is purely spectral, this hierarchy will be semantically grounded. This allows for a two-stage generation process - a main LLM generates the coarse 'semantic skeleton' of the speech (ensuring logical coherence and correct pronunciation), and a lightweight conditional model fills in the fine acoustic details. This approach mirrors the 'thought-to-speech' process and is expected to significantly reduce hallucinations and improving the intelligibility of generative TTS.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.7",
        "title": "End-to-End Spoken Dialogue Models for Empathetic Tutoring",
        "description": "Current AI tutors are often cascades of separate models (ASR -> LLM ->TTS), resulting in high latency, robotic turn-taking, and a loss of emotional intelligence. They interrupt children who are thinking, fail to backchannel, and cannot modulate their tone to be reassuring. This section outlines the development of Native Spoken Dialogue Models (SDMs) for education; single, end-to-end transformers that 'think' in audio. By processing and generating speech directly, these models enable full-duplex interaction, allowing the tutor to listen while speaking, handle interruptions gracefully, and use acoustic empathy to build the psychological safety essential for learning.",
        "outcomes": [
            {
                "id": "O73",
                "title": "Latency-Aware Turn-Taking and 'Wait Time' Optimization",
                "description": "In education, silence is a pedagogical tool ('Wait Time'), not just a gap to be filled. Standard voice bots with rigid silence thresholds often interrupt children who are 'thinking out loud' or decoding complex words. This work focuses on training SDMs to predict 'Pedagogical Transition Relevance Places' (P-TRPs); moments where intervention is actually helpful---based on the prosody of hesitation (e.g., stretched vowels, filler sounds) rather than just silence duration. We will create a dataset of 'thinking vs. finished' scenarios and evaluate models on their ability to dynamically extend silence when a child is struggling but engaged, versus prompting gently when a child has given up. The outcome is a 'Zero-Anxiety' turn-taking policy that respects the child's cognitive processing time.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O74",
                "title": "Paralinguistic Instruction Tuning for Scaffolding and Encouragement",
                "description": "Effective teachers use their voice to scaffold learning---whispering a hint to lower stakes, raising pitch to signal excitement, or using a steady, low tone to calm an anxious student. This project extends 'Instruction Tuning' to the acoustic domain, creating a dataset of 'Pedagogical Speech Acts' (e.g., 'warm correction,' 'excited validation,' 'conspiratorial hint'). We will train SDMs to condition their output audio tokens on these emotional instructions, enabling the tutor to dynamically shift its persona. For example, if the input audio detects frustration, the model shifts to a 'Supportive Guide' persona; if the child is bored, it shifts to an 'Energetic Motivator.' The result is a steerable, emotionally intelligent vocal tutor that adapts its delivery to the child's emotional needs.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O75",
                "title": "Audio-Native 'Chain-of-Thought' for Modeling Problem Solving",
                "description": "Teachers often 'think out loud' to model the problem-solving process for students ('Hmm, let's see, if we carry the one...'). This research aims to replicate this behavior using Audio-Native Chain-of-Thought (CoT). We will train SDMs to generate 'thinking audio tokens'---muttered reasoning, pauses, and self-correction markers---before delivering the final answer. This serves a dual purpose - it pedagogically models the process of solving (rather than just the result) for the student, and it allows the model to use the low-frame-rate generation time to perform deeper reasoning ('buying compute time') without awkward silence. The deliverable is a suite of 'Reasoning Tutors' that make the thinking process audible and relatable for STEM learners",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.8",
        "title": "Personalization through memory modeling",
        "description": "Educational relationships are built over time. A human teacher remembers a student's voice, their specific struggles from a month ago, and their personality quirks. Current AI tutors are 'amnesic,' treating every session as a fresh start. This research aims to build a 'Voice Bank' Architecture---analogous to face clustering in photo apps---that unsupervisedly learns and tracks individual learner identities from audio streams. By maintaining a persistent, privacy-preserving 'pedagogical state' linked to these voice identities, the system can track fluency growth, recall past misconceptions, and adapt its teaching style to the specific child, even when multiple students share a single device in a classroom or household.",
        "outcomes": [
            {
                "id": "O76",
                "title": "Unsupervised Speaker Clustering for the 'Classroom Voice Bank'",
                "description": "In many Indian contexts, devices are shared. A tablet might be used by three siblings or ten students in a row. This work develops an unsupervised speaker diarization and clustering system that operates continuously in the background, creating a dynamic 'Voice Bank' of distinct learner profiles without requiring manual logins. We will investigate contrastive learning techniques on short audio segments (3-5 seconds) to robustly distinguish between child speakers with similar acoustic characteristics. The system will automatically attribute reading errors, progress milestones, and interaction history to the correct 'Voice ID,' ensuring that Riya's progress isn't mixed up with Rahul's data, even if they pass the tablet back and forth during a session.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O77",
                "title": "Audio-Native RAG (Retrieval-Augmented Generation) to model response prosody based on memory and history",
                "description": "To measure growth, we must compare 'now' vs. 'then.' Text transcripts lose the nuance of fluency; we need to compare the audio itself. This project focuses on Audio-Native Retrieval, where the system stores compressed semantic tokens of a child's past reading sessions. When a child encounters a difficult word today, the system retrieves relevant audio clips from last month to detect improvement ('You read this much faster than last time!') or persistent regression. We will build a benchmark for 'Fluency Delta Tracking,' evaluating the model's ability to accurately quantify changes in WPM, prosodic confidence, and phoneme accuracy over weeks using these retrieved audio snapshots, providing parents and teachers with audible evidence of growth.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.2.9",
        "title": "Automated Quality Assurance & Reward Modeling for TTS",
        "description": "",
        "outcomes": [
            {
                "id": "O78",
                "title": "Reference-Free Hallucination and Intelligibility Detection",
                "description": "Generative TTS models, especially those based on language modeling, are prone to 'hallucinations'--- skipping words, repeating phrases, or misreading numbers (e.g., reading '1995' as 'one nine nine five' instead of 'nineteen ninety-five'). This work aims to build a Robust Alignment Reward Model that uses an ASR-based 'cycle-consistency' check. The model generates audio, an ASR system transcribes it back, and a text-alignment module checks for insertions, deletions, or substitutions. We will specifically focus on a 'STEM Safety' metric, penalizing errors in numbers, units ('kg' vs 'km'), and scientific terms more heavily than minor filler-word errors, ensuring the tutor never misleads a student on facts.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O79",
                "title": "Prosodic Accuracy and Lexical Stress Evaluation",
                "description": "In language learning and defining complex terms, stress changes meaning (e.g., 'RE-cord' vs 're-CORD'). Current metrics ignore this. This project develops a Stress-Aware Reward Model that extracts pitch contours and energy envelopes from generated audio and compares them against a dictionary of canonical lexical stress patterns (for words) and syntactic emphasis rules (for sentences). The model will output a 'Prosody Score' indicating if the TTS correctly emphasized the focus word (e.g., 'No, the red ball') and correctly stressed multi-syllabic words. This reward signal is crucial for training the Tutor Bot to sound like a competent teacher rather than a flat reader.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O80",
                "title": "Voice Quality and Acoustic Aesthetics Assessment",
                "description": "Subjective Mean Opinion Scores (MOS) are expensive and slow. We need a way to instantly judge if a generated clip sounds 'robotic,' 'noisy,' or 'hoarse.' This work adapts Reference-Free Quality Assessment (like NISQA) specifically for educational voices. We will train a neural quality estimator on a dataset of 'pedagogical speech' rated by teachers, teaching it to predict scores for 'Clarity', 'Warmth', and 'Naturalness.' This model will serve as a Quality Gatekeeper, instantly filtering out low-fidelity generations on the edge device before they are ever played to the student.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O81",
                "title": "Pedagogical Alignment via RLHF (Reinforcement Learning from Human Feedback)",
                "description": "Beyond correctness, we want the tutor to be engaging. A voice can be intelligible but sound 'bored' or 'condescending.' This research focuses on training a Pedagogical Preference Model. We will collect a dataset where teachers rank different TTS renditions of the same explanation based on which one sounds more appropriate for the scenario ('encouraging,' 'patient,' or 'clear'). Using this preference data, we will train a Reward Model which will then be used to fine-tune the TTS and Dialogue models, effectively 'steering' the AI to adopt a persona that optimizes for student motivation and comfort.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O82",
                "title": "Holistic Diagnostic Evaluation Model",
                "description": "Fragmented metrics fail to capture the interplay between intelligibility, prosody, and safety. This work proposes a Holistic Evaluation Model-a specialized Audio-LLM that ingests an audio-text pair and autoregressively generates a structured JSON critique rather than a single scalar score. This report will holistically analyze and score the generation across four distinct axes - hallucination (checking for critical repetitions, word skips), intelligibility (flagging slurred phonemes), prosody (verifying lexical stress), and voice quality (detecting artifacts). This can then be used to train the TTS model (RLHF) with insights from the TTS Arena regarding how overall quality is perceived as a function of the granular axes.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]

  },
  {
    id: "ocr",
    title: "Optical Character Recognition",
    shortTitle: "OCR",
    description: "Developing robust OCR systems that accurately recognize handwritten and printed educational content across Indian scripts, including student worksheets, textbooks, and complex STEM layouts and notation.",
    iconName: "ScanText",
    theme: 'purple',
    problemCount: 30,
    tags: ["Vision"],
    problems: [
    {
        "id": "4.3.1",
        "title": "Text Recognition Systems for Children",
        "description": "",
        "outcomes": [
            {
                "id": "O83",
                "title": "Child-Centric Handwriting Recognition (Developmental, Fragmented, Correction-Heavy Writing)",
                "description": "Children's handwriting is fragmented, inconsistent, and full of corrections - the opposite of the clean, connected strokes assumed by adult-trained OCR models. Letters vary in shape, spacing, and orientation; overwritten and half-erased attempts blur the final intent. Current systems treat these traits as noise, discarding valuable signals about learning and confusion. A child-focused OCR model must explicitly separate active writing from abandoned attempts and interpret overwrites and corrections as meaningful literacy cues, requiring purpose-built datasets and models sensitive to developmental writing patterns.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O84",
                "title": "Multimodal Speech-Handwriting Alignment for Early ORF Recognition",
                "description": "Young children often speak aloud while writing, and their speech reveals what their handwriting alone cannot - hesitations, phonetic attempts, and stress on tricky letters. Current OCR models ignore this rich modality. A multimodal framework aligning time-stamped handwriting with corresponding audio can use speech as a prior to disambiguate uncertain letters, detect corrections, and retain disfluency cues essential for literacy assessment. Building a paired speech-handwriting dataset would enable models that decode intent under ambiguity, providing a fuller picture of early reading and writing behaviour.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O85",
                "title": "Literacy-Aware, Developmentally-Grounded Evaluation Framework for Children's Handwriting",
                "description": "Conventional OCR metrics like character accuracy fail for children's handwriting, which evolves with literacy development. Early-grade writing is fragmented, phonetic, and inconsistent, while older children introduce structured corrections and overwrites. An evaluation framework must therefore measure how well systems recover intended meaning despite developmental variability. This requires grade-wise annotation of stroke intent, plausible interpretations, and correction handling, rewarding models that understand handwriting as a cognitive process, not as flawed adult writing. The focus shifts from perfect transcription to meaningful comprehension of evolving literacy.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O86",
                "title": "Multiscript Early-Handwriting Benchmark for Indian Languages",
                "description": "Indic scripts pose additional challenges- aksharas are complex, multi-component symbols whose small placement errors can alter meaning entirely. Early learners frequently omit or misplace matras, simplify conjuncts, or distort spatial structure. Current OCR systems, trained on Latin or even neat adult Indic handwriting samples, fail on such data. A multiscript benchmark spanning major Indic languages should capture these developmental writing stages, annotate formation and placement errors, and evaluate both recognition and feedback quality. This would drive script-aware models that understand early handwriting and support real educational use in multilingual classrooms.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.3.2",
        "title": "STEM Text Recognition",
        "description": "",
        "outcomes": [
            {
                "id": "O87",
                "title": "Structured Math Recognition in Real Educational Settings",
                "description": "Math in classrooms is messy, multilingual, and two dimensional. Fractions, superscripts, roots and stacked expressions mix with notes, overwrites and symbols that look alike. A structure-first pipeline should reconstruct a 2D expression or derivation graph before labeling symbols so the student's reasoning is preserved in canonical LaTeX or MathML. We will collect classroom handwriting with region-level structure labels and train and evaluate models on expression-tree edit distance and step-level consistency.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O88",
                "title": "Handwritten Chemistry Equation & Structure Understanding (Higher Grades)",
                "description": "Chemistry responses combine reaction equations, molecular sketches and bilingual notes where small visual errors change meaning. Each page should be treated as two linked graphs - a reaction graph that recovers reactants, products, coefficients and arrow types, and a molecular graph that captures atom connectivity from hand-drawn sketches. The system should output canonical reaction representations to check balancing, charge and valency consistency. We will build a dataset annotated for roles, arrow semantics and molecule connectivity, and evaluate role accuracy and reaction-level correctness.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O89",
                "title": "Diagram Understanding for Geometry and Science (Lower Grades)",
                "description": "Students draw geometry figures, ray diagrams, circuits and molecular sketches in varied styles with bilingual labels, and these drawings encode relationships not recoverable by text-first OCR. A diagram pipeline should detect visual primitives such as points, lines, arcs and arrows, then reconstruct relation graphs like perpendicularity, circuit connectivity or molecular bonds. Outputs should be canonical relation graphs that can be checked against expected concepts rather than pixel similarity. We will curate student diagrams with relation annotations and evaluate relation-level accuracy and downstream concept correctness.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O90",
                "title": "Graph, Plot, and Data Extraction from Hand-Drawn Charts",
                "description": "Hand-drawn charts have uneven axes, sloppy ticks and mixed-script labels, yet downstream assessments require recovered numeric data. A graph-reconstruction model should parse axes, infer scale, extract plotted marks and produce a numeric table of (x,y) samples or binned counts for histograms. This enables checks such as linearity tests, which bar is tallest, and value queries at specific points. We will collect annotated student plots with ground-truth scales and evaluate axis detection, scale error and point value fidelity.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O91",
                "title": "Units, Prefixes, Scripts, and Notational Normalization",
                "description": "Units and notation errors are a frequent source of conceptual mistakes, and tiny handwriting differences can change magnitude or meaning. A STEM-aware normalization layer should parse measurements into structured triples like (value, unit, prefix/exponent) and convert them into canonical SI forms, using local context to disambiguate symbols such as m, k or o. The layer should also flag unit inconsistency in the surrounding calculation. We will annotate real student samples with normalized targets and measure normalized-form accuracy and magnitude consistency.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O92",
                "title": "Multiscript STEM Pages with Interleaved Latin Symbols and Indic Text",
                "description": "Real STEM pages interleave Indic scripts with Latin variables, numbers and units even within the same line, and mis-tagging silently breaks downstream reasoning. A joint pipeline should perform script identification and token-role classification together, labeling tokens as language words, variables, units, numbers or formula parts and grouping them into formula and explanation spans. The canonical output must keep formulas, units and narrative separated but linked for downstream checks. We will train on multiscript notebooks annotated with script, role and span boundaries, and evaluate token-level script/role accuracy and formula-span integrity.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O93",
                "title": "Printed-Template + Handwriting Understanding for Early-Grade Worksheets",
                "description": "Early-grade worksheets combine printed templates with highly variable handwriting squeezed into small answer boxes, so models must separate template elements from student ink and align each fragment to the correct slot. A template-aware system custom-built for exam-based usecases should detect printed structure such as blanks, options and grids, segment handwriting, and map each handwritten entry to its target prompt. The system should produce mappings like {prompt_id -> recognized_answer} with task metadata for grading. We will collect real worksheets annotated for slots and alignments and evaluate slot detection, alignment accuracy and end-to-end grading correctness.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.3.3",
        "title": "Assistive Document Intelligence for Students and Teachers",
        "description": "",
        "outcomes": [
            {
                "id": "O94",
                "title": "Document Multilingual Transcreation (Real-Time, Layout-Preserving Translation)",
                "description": "Students want to read the same textbook page in their own language without losing layout, figures, or references. Standard OCR-to-translation pipelines flatten pages and break spatial structure. A layout-preserving transcreation system should parse pages into semantic regions, translate with region-level constraints, and re-render text within original geometry. This keeps formulas, diagrams, and captions in place and preserves study flow. Evaluation should measure translation quality, layout fidelity, and usability in real study tasks.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O95",
                "title": "Student-Centric Page Understanding and Native-Language Transcreation",
                "description": "Students upload pages to a Tutorbot system expecting guided understanding, not raw text output. Textbooks mix explanations, examples, diagrams, tables, and questions across languages. A document model must identify these roles, simplify explanations, and rephrase content in the student's preferred language while preserving structure. For higher grades, this includes math, chemistry notation, and figure labels. The goal is reliable curriculum-aligned page understanding, not generic summarization.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O96",
                "title": "Answer Feasibility, Solution Completion, and Step-Aware Support",
                "description": "Students often ask whether their approach is reasonable, not just whether the final answer matches. Models must represent handwritten work as structured steps and judge feasibility, errors, and partial correctness. This requires comparing student work to multiple valid solution paths and identifying where mistakes occur. Systems should complete solutions only from valid intermediate states and clearly separate student work from model-added steps. Curated datasets with labeled work-solution relations are essential.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O97",
                "title": "Learning from Diagrams, Figures, and Worked Examples",
                "description": "Worked examples and diagrams are central to how concepts are taught and understood. Models should locate these elements on a page, parse their internal structure, and generate step-by-step explanations grounded in that context. This includes answering 'what if' variations and re-labeling diagrams in another language. Explanations must stay faithful to the original example and grade level. Multimodal textbook datasets aligning text, figures, and explanations are required.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O98",
                "title": "Teacher-Facing Analytics, Feedback, and Content Authoring",
                "description": "Teachers work with scanned answer sheets, board work, and worksheets, not polished documents. Useful intelligence includes clustering common mistakes, summarizing misconceptions, and suggesting targeted remedial material. Another need is semi-automatic creation of questions and worksheets aligned to syllabus and difficulty. These tasks require grounding in board-specific textbooks and marking schemes. Generic language models without this grounding are insufficient for academic deployment.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O99",
                "title": "Textbook-Centric, Multilingual Training Data as the Bottleneck",
                "description": "Most current models lack exposure to Indian textbooks, teacher materials, and real student work. Progress in building better academic understanding in models depends on building aligned corpora of textbooks, solved examples, glossaries, and anonymized answer sheets across grades and languages. These resources must be linked at chapter, concept, and exercise levels. Treating data curation as a core research problem is essential in this regard. Better models alone cannot compensate for missing educational data.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O100",
                "title": "Grade- and Curriculum-Aware Assistive Document Intelligence",
                "description": "Educational content varies drastically across grades, yet most current educational and general models treat it as one domain. A curriculum-aware system should be trained and conditioned on grade and subject to interpret and generate appropriately. This enables level-appropriate explanations, safer feedback, and syllabus-aligned question generation. Grade awareness also reduces hallucination by limiting concepts to the curriculum. Understanding progression across grades becomes a structured modeling problem.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O101",
                "title": "Safety, Feedback-Control, and Pedagogical Reliability",
                "description": "Educational systems must avoid hallucinated steps, wrong corrections, or out-of-syllabus content. Feedback should be traceable to the student's work and preserve correct reasoning. Models must separate their own additions from student-written steps and calibrate difficulty to grade level. Pedagogical safety includes faithful translations and diagram explanations without invented facts. This makes control and verification core research challenges.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O102",
                "title": "Accessibility-Aware Assistive Document Intelligence",
                "description": "Many students face low vision, early literacy challenges, or poor capture conditions. Systems should support read-aloud narration, zoomable and high-contrast views, simplified text, and aligned speech-handwriting learning modes. Accessibility must also be multilingual, allowing audio and visual support in the student's language. These capabilities require datasets pairing pages with audio, simplified text, and visual transformations. Accessibility is central, not optional.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O103",
                "title": "Source-Grounded and Citation-Aware Page Assistance",
                "description": "Students and teachers need to know where an explanation comes from on the page. Assistive systems should ground every answer in specific regions like paragraphs, equations, or diagrams. Generated content must be clearly marked as added beyond the page. Region-level grounding improves trust, reduces hallucination, and supports inspection. This requires building a grounded dataset based on document structure and even models and interfaces where grounding is mandatory.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O104",
                "title": "Evaluation and Benchmarks for Assistive Document Intelligence",
                "description": "Assistive document intelligence capabilities cannot be compared without realistic benchmarks. Evaluation must reflect real tasks such as explaining screenshots, checking work, clustering mistakes, or generating aligned diagrams. Each benchmark should include page images, queries, region-level grounding, grade-specific targets, and safety labels. Metrics must capture correctness, usefulness, grounding, and absence of harm. Evaluation itself needs to be a first-class research problem.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.3.4",
        "title": "OCR and Document Intelligence on Edge Devices",
        "description": "",
        "outcomes": [
            {
                "id": "O105",
                "title": "Edge-OCR Benchmark for Indic Educational Documents",
                "description": "There is a need for a standardized benchmark that reflects how documents are actually captured on low-end Indian phones and tablets. The benchmark should include textbooks, worksheets, exams, and notebooks across Indic scripts and English, with printed and handwritten content photographed under blur, low light, skew, glare, and compression. Each sample should have ground truth for text, layout regions, and simple downstream tasks like extracting questions or answers. Models must be evaluated not only for accuracy, but also for latency, memory use, and battery impact on real devices.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O106",
                "title": "Energy-Efficient Page Capture and Recognition Pipelines",
                "description": "On-device OCR performance depends on the full pipeline, not just the recognition model. Camera preview, autofocus, perspective correction, denoising, detection, and recognition all compete for time and energy. A research direction is to jointly optimize capture and recognition as a single decision process under accuracy, latency, and battery constraints. This includes adaptive resolution, selective high-quality crops, and batching across pages. Evaluation should track speed, energy use, thermal behavior, and battery drain in realistic classroom workflows.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O107",
                "title": "Model and Runtime Co-Design for Compact Multiscript OCR",
                "description": "Indic OCR on low-cost devices requires compact models that still handle multiple scripts, handwriting, and STEM notation. The challenge is to co-design lightweight architectures and runtimes rather than only shrinking large models. This includes mobile-friendly backbones, quantization, pruning, distillation, and early-exit designs combined with efficient use of NPUs and mobile GPUs. Evaluation must cover printed text, multiscript handwriting, and noisy capture conditions. The goal is reliable on-device OCR that works within tight memory and power budgets.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O108",
                "title": "Edge-Aware Data Augmentation for Document Capture",
                "description": "Most OCR training data does not reflect real classroom capture conditions. Edge images often contain motion blur, glare, shadows, occlusions, compression artifacts, and camera overlays. An edge-aware augmentation suite should explicitly simulate these effects during training. Models fine-tuned with such augmentations can then be evaluated on edge-focused benchmarks. This helps reduce the performance gap between clean scans and real phone-captured documents.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O109",
                "title": "Progressive and Cascaded Inference for Edge Document Intelligence",
                "description": "Running large document models on every page is inefficient on edge hardware. A more practical approach is progressive inference, where small on-device models handle layout detection and simple tasks first. Heavier recognition or reasoning is triggered only when needed, either locally or via the cloud. Many student tasks can be solved by lightweight OCR and segmentation alone. Evaluation should measure latency, energy, bandwidth usage, and how often early stages are sufficient.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O110",
                "title": "Offline-First OCR for Privacy-Sensitive Student Work",
                "description": "Student notebooks and answer sheets often cannot be sent to the cloud due to privacy concerns. Offline-first OCR enables basic reading, answer extraction, worksheet checking, and read-aloud support entirely on-device. Research questions include what scripts and tasks are feasible offline and how to update models with limited connectivity. On-device redaction and aggregation should ensure that only anonymized signals leave the device. Privacy and offline usability must be core design constraints.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O111",
                "title": "Edge-Friendly Page Understanding for Micro-Tasks",
                "description": "Many everyday student interactions are simple and do not require large models. Tasks like finding a heading, reading a specific box, or separating questions from options can be handled on-device. Compact page-understanding models can provide navigation, skim reading, and selective reading support even without connectivity. These models reduce dependence on cloud inference and improve responsiveness. Evaluation should focus on accuracy and usefulness for these small but frequent tasks.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O112",
                "title": "Edge-Evaluations for End-to-End Educational Workflows",
                "description": "Component benchmarks are not enough to judge real usefulness. End-to-end evaluations should cover complete workflows such as scanning worksheets, summarizing chapters, or capturing board explanations. These evaluations must include capture, OCR, layout, light reasoning, and user interaction on real devices. Metrics should measure task time, user effort, battery drain, heat, and success rates. This ensures that edge document intelligence improvements translate into real classroom gains.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]
  },
  {
    id: "mt",
    title: "Machine Translation",
    shortTitle: "MT",
    description: "Breaking language barriers in education through high quality, format preserving translation of STEM textbooks, learning materials, and digital content into Indian languages.",
    iconName: "Languages",
    theme: 'yellow',
    problemCount: 13,
    tags: ["Text", "Speech"],
    problems: [
    {
        "id": "4.4.1",
        "title": "Utility-First Long-Form Translation for Education",
        "description": "Standard translation systems optimize for linguistic fidelity, but educational content often requires a different objective - maximizing learner utility, not literal equivalence. In STEM and technical subjects, translating all terms into local languages may reduce clarity, while preserving English keywords, symbols, and math expressions often improves comprehension. The goal of this research is to define and build utility-first long-form translation systems that decide what should be translated, what should be retained, and how to preserve technical structure across multi-paragraph lessons, explanations, and worked examples, such that it maximizes the learner's utility.",
        "outcomes": [
            {
                "id": "O113",
                "title": "Benchmark for Utility Judgements in Long-Form Educational Translation",
                "description": "A parallel corpus of long-form educational content (textbook chapters, worked examples, conceptual explanations) will be created across English and major Indian languages. We will annotate segments for utility preferences, i.e., identifying terms that should remain in English, appropriate translation boundaries, acceptable code-mixing, and necessary preservation of equations, variables, and diagrams. The benchmark will allow systematic evaluation of whether translations improve usefulness and conceptual clarity rather than only adequacy/fluency.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O114",
                "title": "Utility-First Evaluation Agent and Metrics",
                "description": "A dedicated evaluation agent will be developed to judge translations based on learner utility, assessing preservation of mathematical and technical structure, appropriateness of English-term retention, conceptual clarity, readability, and alignment with human utility judgements captured in the benchmark. This work will also formally define the metrics suitable for utility-first long-form translation, ultimately establishing a new direction in educational translation where systems are optimized for pedagogical usefulness and practical comprehension rather than strict linguistic equivalence.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O115",
                "title": "Large-Scale Utility-First Translation Data Corpus and SOTA Translation Models",
                "description": "This outcome will build the large-scale data and SOTA models required for utility-first translation. A combined corpus will be constructed using mined educational text, bilingual textbook materials, DIKSHA resources, solved examples, and extensive synthetic data generated using LLMs to explore code-mixing, selective retention of English terminology, preservation of mathematical and scientific structure, and multi-paragraph coherence. Models trained on this corpus will learn to preserve equations and symbolic notation, decide whether to translate or retain technical terms, maintain conceptual consistency across long passages, and produce outputs that reflect actual student and teacher preferences.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.4.2",
        "title": "Conversation-Supported Translation and Interactive Editing",
        "description": "A key challenge in large-scale educational translation workflows is enabling teachers, content teams, and translators to iteratively refine translated material in a natural and intuitive way. Rather than producing a static translation, future systems must support conversational, multi-turn editing where users can request global term replacements, local rephrasings, tone adjustments, or structural corrections simply through natural-language instructions. Conversation-supported translation agents aim to transform translation into an interactive, dialogue-driven process that preserves equations, diagrams, formatting, and pedagogical intent while allowing effortless revision across long-form educational content.",
        "outcomes": [
            {
                "id": "O116",
                "title": "Benchmark for Conversational Translation-Editing Interactions",
                "description": "A benchmark will be created to evaluate models on translation scenarios where users refine or modify translated educational content through natural conversational instructions. The dataset will pair source text, initial translations, and diverse user utterances such as 'replace this word everywhere,' 'use a simpler phrase in this paragraph,' 'keep the English term for this concept,' or 'make the tone more formal,' along with validated gold revisions reflecting teacher and student preferences. This benchmark will capture realistic workflows in textbook creation, worksheet preparation, and lesson-material localisation, enabling systematic evaluation of how well models understand natural-language editing requests.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O117",
                "title": "Interactive Translation Models that Support Multi-Turn Editing and Global Revisions",
                "description": "This outcome will build high-quality translation models capable of performing multi-turn natural-language editing over long-form educational content. The training corpus will combine collecting revision histories from existing translation platforms, synthetic multi-turn translation-editing dialogues generated by LLMs, and curated teacher-driven edits from real textbook workflows. Models will be trained to interpret ambiguous user requests, disambiguate intent using context, and ensure that revisions do not break terminological consistency, grade-appropriate language, or the structural formatting of diagrams, equations, and variable references. Evaluation will assess accuracy of edit execution, preservation of technical structure, stability across multiple rounds of edits, and overall usefulness.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O118",
                "title": "Codex-like ultra-long context translation agent",
                "description": "Just as coding agents like Codex enabled natural-language programming and iterative code refinement, an analogous translation agent can enable natural-language translation and multi-turn revision for educational content. Instead of treating translation as a one-shot task, this agent would support a conversational workflow where teachers and content creators can request translations or edits for ultra-long form content in simple natural-language prompts and the agent would manage all the work. The system would maintain document-level consistency, preserve equations and diagrams, and reason about utility, grade level, and pedagogical intent while applying edits. Such a translation agent would transform ultra-long-form educational translation into an interactive, Codex-like experience, which is  dialogue-driven, controllable, and tightly aligned with the needs of real textbook and lesson-material workflows.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.4.3",
        "title": "Better Machine Translation for Speech & Dubbing",
        "description": "High-quality educational dubbing requires systems that can translate not only text but also spoken instructional audio into multiple languages while staying perfectly aligned with the timing, pacing, and pedagogical structure of the original video. This involves two tightly linked challenges - duration-aware translation that generates output fitting strict temporal budgets, and robust speech translation that handles teacher speech, spontaneous explanations, code-mixed utterances, and subject-specific vocabulary while preserving both meaning and timing. Standard MT and ST models are not sensitive to duration and often produce longer translations that break sync, forcing unnatural post-hoc time compression that degrades intelligibility and instructional clarity. The goal of this research is to build better isochronous speech translation systems that respect time constraints, maintain pedagogical fidelity, and produce natural, well-aligned dubbed audio suitable for large-scale multilingual educational video localization.",
        "outcomes": [
            {
                "id": "O119",
                "title": "Benchmark for Better Edu-Speech Translation Systems",
                "description": "A benchmark will be developed comprising aligned audio-text pairs, speaker timing profiles, and multilingual reference translations for thousands of segments from education videos, STEM content, DIKSHA content, and teacher explanations. Each segment will include precise duration budgets and human-crafted ground truth translations in all 22 target Indian languages. This benchmark will allow systematic evaluation of whether models can produce translations that match timing constraints while retaining instructional meaning, natural cadence, and grade-appropriate terminology.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O120",
                "title": "Duration-Aware MT Models for Controlled-Length Translation",
                "description": "This outcome focuses on building MT models that integrate duration prediction and length control directly into the decoding process. Models will jointly optimize for semantic fidelity and predicted TTS duration, learning to paraphrase, or compress content to fit required time budgets. Large-scale synthetic and mined data will be created to expose the model to a variety of timing-constrained translation data, enabling it to produce better translations. Evaluation will assess how accurately translations meet duration constraints, how naturally they synthesize into speech, and whether compression choices preserve conceptual clarity for students.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O121",
                "title": "Better Speech Translation Models for Dubbing",
                "description": "A new class of speech translation systems will be developed that can directly incorporate timing constraints into the speech-to-text and speech-to-speech translation pipelines. These models will learn from aligned audio-text corpora with a special focus on educational content where the target text/speech must match the duration of the source, either through predictive duration control in the decoder or through joint learning with a TTS acoustic model. Evaluation will measure timing alignment, semantic fidelity, and overall understanding for students, ensuring that the translated audio remains in sync with slide transitions, gestures, and on-screen diagrams.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O122",
                "title": "Robust Translation Systems for Teacher Speech, Code-Mixing, and STEM Vocabulary",
                "description": "This outcome strengthens the speech translation pipeline by focusing on the real acoustic and linguistic challenges of educational settings - accents across 22+ Indian languages, frequent English-local language code-mixing, rapid alternation between everyday language and STEM terminology, and the presence of disfluencies or mid-sentence corrections. Models will be trained using large-scale mined and synthetic corpora of teacher speech, that is augmented with various real-world disfluencies and accents to emulate real-world scenarios.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.4.4",
        "title": "Better Machine Translation for Low Resource Languages and Dialects",
        "description": "Most existing translation systems work well on high-resource languages and standardized dialects, leaving many Indian languages and dialects effectively invisible in practice. For an educational stack that serves all districts and communities, translation must work reliably not only for Hindi, Tamil or Bengali, but also for the various low-resource languages and for the various dialects such as Bhojpuri, Marwari, and others that dominate everyday speech. The goal of this research area is to build benchmarks, datasets, models, and strategies that specifically target these low-resource and dialectal languages, so that educational content, guidance, and interfaces remain inclusive even where data is sparse and orthographic norms are unstable.",
        "outcomes": [
            {
                "id": "O123",
                "title": "Benchmarking Translation Quality for Low Resource Languages and Major Dialects",
                "description": "This outcome will create a dedicated benchmark for translation involving the various low-resource Indian languages and a set of widely spoken dialects such as Bhojpuri, Maithili, Marwari, Chhattisgarhi, and others. The benchmark will consist of parallel test sets for education-relevant domains including foundational literacy content, STEM explanations, exam instructions, and government schemes, with careful coverage of multiple scripts, spelling variants, and code-mixed usage. Human annotation will focus on semantic adequacy, grade-appropriate readability, and dialectal naturalness rather than enforcing standardized forms only. The benchmark will provide a reliable way to measure how MT systems perform on truly low-resource languages and dialects and will serve as the reference evaluation suite for all subsequent data and modeling efforts in this space.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O124",
                "title": "Large-Scale Data Creation Pipelines and better Translation Models for Low-Resource Languages and Dialects",
                "description": "This outcome will design and implement data pipelines that combine mining, weak supervision, and LLM-based synthetic data creation to create substantial training corpora for low resource languages and dialects. Sources will include mined parallel text from regional media, social content with strong dialectal signals, aligned subtitles, bilingual educational material from states, and synthetic parallel data generated by controlled LLM prompts that preserve dialectal features. The resulting corpora will be released with detailed documentation on domains, quality levels, and dialect markers, enabling systematic experimentation on low-resource translation and adaptation. Furthermore, SOTA models will be trained on this data and released in the open source.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O125",
                "title": "Seed-Guided Reward Modeling and Bootstrapped Data Expansion for Low-Resource Translation",
                "description": "This outcome explores a bootstrapped learning strategy for low resource languages and dialects, where only a small set of curated seed translations is available. Starting from a reasonably strong multilingual base model, a reward model is trained on these seed pairs to evaluate translation quality, dialectal naturalness, semantic preservation, and educational usefulness. Once the reward model reliably judges correctness, it is used to supervise the generation of large-scale synthetic parallel data through techniques such as RLAIF, iterative self-training, and rejection sampling. The base translation model is then fine-tuned on the synthetic corpus while being periodically recalibrated using the reward model, creating a closed-loop system that improves coverage and quality despite minimal human-provided data. This approach enables scalable translation for low-resource languages and dialects without requiring large annotated corpora and provides a principled way to align model behavior with community-specific linguistic norms at very low cost.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]
  },
  {
    id: "llm",
    title: "Large Language Models",
    shortTitle: "LLM",
    description: "Building education first multilingual Edu LLMs grounded in learning science, Socratic pedagogy, formative feedback, and conceptual reasoning to support deep understanding across Indian languages.",
    iconName: "Brain",
    theme: 'blue',
    problemCount: 32,
    tags: ["Text"],
    problems: [
    {
        "id": "4.5.1",
        "title": "A Large-Scale Multilingual Multimodal Knowledge Benchmark for Indian Languages",
        "description": "India currently lacks a comprehensive multilingual, multimodal benchmark that evaluates educational knowledge, conceptual reasoning, and understanding across STEM and general-domain subjects in all major Indian languages. Existing benchmarks such as MMLU and MILU are predominantly English-centric, lack curriculum grounding, ignore diagrams and multimodal reasoning essential for STEM learning, and do not ensure cross-lingual equivalence. The goal of this research is to build the next-generation benchmark for assessing educational LLMs in India, covering mathematics, physics, chemistry, biology, engineering fundamentals, and real-world application domains across all major Indian languages. This benchmark will include conceptual questions, reasoning, diagram-based queries, and authentic items derived from Indian textbooks, state-board materials, and undergraduate foundational courses.",
        "outcomes": [
            {
                "id": "O126",
                "title": "Multilingual Curriculum-Aligned STEM Benchmark",
                "description": "A large-scale benchmark will be created across mathematics, physics, chemistry, biology, social sciences, humanities, etc, grounded in NCERT, SCERT, and other curricula. The benchmark will contain concept-based questions, numerical questions, reasoning problems, and real-world application oriented problems, all independently validated to eliminate translation bias. Each problem will be available across all major Indian languages with aligned difficulty, meaning, and pedagogical intent. This outcome will create the first truly curriculum-aligned multilingual STEM benchmark capable of evaluating whether LLMs understand concepts taught in Indian classrooms rather than only generic world knowledge.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O127",
                "title": "Multimodal Reasoning Benchmark for Diagrams, Graphs, Figures, and Structured STEM Inputs",
                "description": "A multimodal extension of the benchmark will evaluate LLMs' ability to interpret diagrams, geometry constructions, circuit diagrams, reaction schemes, data plots, labelled anatomy diagrams, etc used in Indian textbooks. Each multimodal data point will pair an image or structured representation with a language-specific question and ground-truth reasoning & answer. The benchmark will test whether models can extract relevant information, perform visual-to-symbolic reasoning, integrate text and diagrams, and maintain consistency across languages. This outcome will create a large multimodal educational reasoning benchmark and enable systematic assessment of diagram understanding in real-world teaching and learning contexts.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.5.2",
        "title": "Benchmarking and Evaluating Multilingual Pedagogical Dialogue in LLMs",
        "description": "As we look to use LLM-based solutions into learning and tutor applications there is a growing need to evaluate not just whether models provide correct answers, but whether they teach well. Teaching quality involves structured explanations, appropriate scaffolding, sensitivity to learner misconceptions, adaptive hinting, and maintaining a supportive pedagogical tone over multi-turn dialogue. Existing benchmarks largely focus on single-turn factual correctness and fail to capture the interactive and pedagogical nature of real classroom or tutoring interactions. The goal of this research is to build a comprehensive evaluation framework for multilingual pedagogical dialogue that measures how effectively LLMs explain concepts, guide learners through reasoning, recover from misconceptions, adapt to learner proficiency, and maintain consistent teaching quality across Indian languages. This work will establish the foundations for evaluating, training, and aligning LLMs as pedagogical agents rather than answer generators.",
        "outcomes": [
            {
                "id": "O128",
                "title": "Multilingual Pedagogical Dialogue Benchmark",
                "description": "A large-scale, multilingual benchmark of multi-turn pedagogical dialogues will be created across mathematics, science, social science, reading comprehension, and general problem-solving, spanning multiple grade levels. Each dialogue prompt will be systematically parameterised to control factors such as learner proficiency, severity and type of misconceptions, required scaffolding depth, and cognitive load. Each dialogue will be translated and adapted across all Indian languages and English to ensure conceptual equivalence and enable cross-lingual comparison. This benchmark will allow precise evaluation of how models teach under varied teaching conditions, rather than simply whether they arrive at the correct final answer.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O129",
                "title": "Human-Calibrated Rubrics & Metrics for Pedagogical Quality Assessment",
                "description": "Detailed pedagogical rubrics & metrics will be developed in collaboration with teachers, subject experts, and researchers to define what constitutes high-quality explanations, effective scaffolding, appropriate questioning, and grade-aligned instructional behaviour. These rubrics will cover dimensions such as conceptual clarity, reasoning structure, progression of hints, handling of incorrect answers, and sensitivity to learner cues. Human-rated exemplar dialogues will be collected across subjects, grades, and languages, creating a gold-standard reference for pedagogical quality that can be used both for evaluation and for training judge models.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O130",
                "title": "LLM-as-Judge Models for Scalable Pedagogical Evaluation",
                "description": "Building on the human-calibrated rubrics, LLM-as-Judge models will be trained and evaluated to score pedagogical dialogue at scale. The research will study the reliability of LLM judges in assessing teaching quality across languages and domains, their sensitivity to linguistic variation, and systematic biases such as over-rewarding verbosity or penalising non-standard phrasing. Comparisons with expert human ratings will quantify agreement, failure modes, and conditions under which this auto evaluation is reliable. This outcome will enable scalable evaluation pipelines for pedagogical LLMs, significantly reducing dependence on continuous human annotation.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O131",
                "title": "Stability, Drift, and Response Quality in Multi-Turn Dialogue",
                "description": "A dedicated analysis will examine how pedagogical quality evolves over longer interactions in LLMs, focusing on whether models maintain instructional coherence, consistency of explanations, and appropriate scaffolding across many turns. The study will identify failure modes such as concept drift, contradictory explanations, or loss of pedagogical structure. This outcome will test for teaching stability and help define requirements for deploying LLMs in sustained tutoring and classroom-support scenarios.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O132",
                "title": "Cross-Lingual Fairness and Consistency in Pedagogical Quality",
                "description": "Using the parallel multilingual structure of the benchmark, this research will examine whether LLMs provide equally rich explanations, patient scaffolding, and supportive instructional tone across languages, dialects, and other linguistic scenarios. The analysis will quantify differences in explanation depth, hint quality, and scaffolding quality between high-resource and low-resource languages, as well as between standard and colloquial language forms. This outcome will provide concrete evidence of pedagogical inequities in current systems and define fairness metrics specific to educational dialogue, moving beyond generic accuracy-based comparisons.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.5.3",
        "title": "Data Foundations for Multilingual, Pedagogy-Aligned Educational LLMs",
        "description": "Existing web-scale corpora are poorly suited for educational objectives, as they lack curriculum alignment, explicit pedagogical structure, misconception traces, and balanced multilingual coverage. This research area focuses on the systematic curation, creation, and validation of data required to train, align, and evaluate educational LLMs. The goal is to build interoperable, reusable datasets that support pedagogy-centric training, cross-lingual skill transfer, and rigorous evaluation across Indian languages and educational contexts.",
        "outcomes": [
            {
                "id": "O133",
                "title": "Curriculum-Aligned Multilingual Knowledge Corpora for Education",
                "description": "This outcome will curate large-scale multilingual corpora aligned with NCERT and state-board curricula across subjects such as mathematics, science, and social science. Content will be sourced from textbooks, teacher manuals, solved examples, assessments, and trusted educational platforms, with careful preservation of structure such as definitions, examples, worked solutions, and diagrams. The corpora will be annotated with metadata including grade level, subject, concept hierarchy, and language, enabling controlled pretraining and mid-training for educational LLMs that require curriculum grounding rather than generic knowledge exposure.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O134",
                "title": "Large-Scale Didactic Dialogue and Scaffolding Corpora",
                "description": "A dedicated corpus of pedagogical interactions will be created to support training of didactic and tutoring-oriented models. The dataset will consist of multi-turn instructional dialogues that explicitly encode learner misconceptions, partial reasoning states, graded hints, corrective feedback, and motivational scaffolding. Data will be created through a combination of expert-authored examples, mining from classroom interactions and tutoring logs where available, and large-scale synthetic generation guided by pedagogical templates and teacher-provided scaffolding rubrics. This corpus will enable supervised and continued pretraining objectives that teach models how to guide learning rather than simply provide answers.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O135",
                "title": "Large Scale Parallel Educational Data",
                "description": "This outcome will construct parallel and near-parallel educational datasets across Indian languages and English to support research on cross-lingual knowledge and skill transfer. The data will include aligned explanations, worked examples, assessment items, and tutoring interactions, allowing direct measurement of how concepts and pedagogical strategies transfer across languages. Special emphasis will be placed on capturing typological diversity, script variation, and code-mixed usage, enabling controlled studies of asymmetry, interference, and degradation in multilingual educational models.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O136",
                "title": "Large Scale Synthetic Data Generation Frameworks",
                "description": "This research will develop systematic frameworks for generating high-quality synthetic educational data using LLMs, with explicit control over grade level, scaffolding depth, misconception type, language, and pedagogical intent. Rather than unconstrained generation, the framework will use structured prompts, curriculum graphs, and teacher-defined templates to produce diverse yet controlled data at scale. Validation pipelines will be designed to filter artifacts, hallucinations, and pedagogical violations, ensuring that synthetic data improves model behavior rather than amplifying biases or shortcuts.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O137",
                "title": "Multilingual Alignment and Preference Data for Pedagogical Alignment",
                "description": "This outcome will create alignment datasets focused specifically on educational behaviors such as scaffolding quality, explanation clarity, tone safety, grade appropriateness, and misconception handling across languages. Parallel datasets will be constructed using both translated and natively generated examples to study cross-lingual alignment consistency. Human preference annotations from teachers, students, and educational experts will provide supervision for post-training and evaluation of pedagogy-aligned multilingual models.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.5.4",
        "title": "Cross-Lingual Knowledge Transfer and Training Regimes for Multilingual Educational LLMs",
        "description": "Multilingual LLMs are increasingly expected to deliver comparable educational knowledge and reasoning capabilities across languages, yet it remains poorly understood how fundamental concepts transfer across languages with different resources, scripts, and linguistic structures, and how mid and post training choices influence this transfer. This research studies cross-lingual knowledge transfer, with a focus on educational knowledge such as mathematics, science, social science, procedural skills, and reading comprehension.",
        "outcomes": [
            {
                "id": "O138",
                "title": "Benchmarking Cross-Lingual Concept Transfer Across Languages and Domains",
                "description": "A benchmark of parallel and near-parallel educational content will be created to measure how core concepts transfer across languages with varying typological distance, script, and resource availability. The benchmark will cover structured domains such as mathematics and science, as well as less structured domains such as history, civics, and commonsense reasoning. Evaluation will quantify whether concepts transfer symmetrically across language pairs, whether factual knowledge and reasoning accuracy degrade in low-resource languages, and whether domain-specific reasoning transfers more reliably than narrative or descriptive knowledge. This benchmark will provide the foundation for all subsequent analyses of cross-lingual knowledge behavior.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O139",
                "title": "Mechanistic Analysis of Cross-Lingual Knowledge Representation and Interference",
                "description": "This outcome will analyze how concepts are internally represented across languages within multilingual LLMs and how linguistic structure influences these representations using mechanistic interpretability techniques. The study will examine interference effects, language-specific misconceptions, and cases where knowledge present in one language fails to appear or becomes distorted in another.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O140",
                "title": "Impact of Mid-Training Data Mixtures and Curricula on Cross-Lingual Generalization",
                "description": "This research will systematically evaluate how different mid-training data mixtures and curriculum schedules affect multilingual educational performance. Experiments will compare language-balanced, domain-balanced, and skill-focused mixtures, as well as progressive curricula that introduce languages or subjects in stages. Evaluation across educational benchmarks will measure cross-lingual transfer strength, domain robustness, performance stability, and the extent to which training choices reduce or exacerbate gaps between high- and low-resource languages. The outcome will produce concrete guidance on designing mid-training regimes that maximize cross-lingual knowledge sharing without overfitting to dominant languages.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O141",
                "title": "Synthetic versus Translated Data for Multilingual Knowledge Expansion",
                "description": "A controlled study will compare synthetic multilingual data generated directly in target languages with translated data produced by translating English educational corpora, across both pre-training and mid-training settings. Using parallel synthetic and translated variants of the same content, the research will measure differences in knowledge coverage, factual consistency, linguistic diversity, reasoning accuracy, and cross-lingual transfer. The analysis will also examine whether synthetic data introduces stylistic artifacts or model bias, whether translated data limits linguistic naturalness, and how each data source interacts with curriculum design and downstream alignment. This outcome will clarify when and how synthetic or translated data should be used for efficient multilingual expansion.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O142",
                "title": "Scaling Laws and Design Principles for Cross-Lingual Educational LLMs",
                "description": "The final outcome will synthesize findings across benchmarks, mechanistic analyses, and training experiments to derive scaling laws and design principles for cross-lingual knowledge transfer. This includes understanding how transfer quality scales with data volume, language relatedness, domain structure, and curriculum complexity, and identifying diminishing returns or negative transfer regimes. The result will be a principled framework for building multilingual educational LLMs that deliver consistent conceptual understanding, fair access to knowledge, and stable performance across languages, domains, and training regimes.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.5.5",
        "title": "Pedagogy-Centric Post-Training of Educational Large Language Models",
        "description": "Most current LLMs are optimized to answer questions correctly and efficiently, but effective education requires models that guide learners through structured reasoning, provide hints at appropriate times, adapt explanation depth to learner level, and avoid overhelping. This research studies how to design, train, and align LLMs whose primary objective is pedagogical scaffolding rather than answer delivery. By integrating didactic training objectives, grade-aligned reasoning control, pedagogically grounded reinforcement learning, and multilingual post-training alignment strategies, this work aims to define a new class of educational models that are instructionally aligned, developmentally appropriate, and optimized for sustained learning rather than short-term user satisfaction.",
        "outcomes": [
            {
                "id": "O143",
                "title": "Didactic Foundation LLMs Trained for Scaffolding-Centric Reasoning",
                "description": "This outcome will develop Didactic Foundation Models whose core behavior is structured pedagogical guidance rather than direct solution output. Models will be trained on large-scale synthetic and mined instructional dialogues that explicitly encode misconceptions, partial reasoning states, learner profiles, and varying levels of scaffolding depth. Specialized training objectives will jointly predict the final answer and the intermediate pedagogical steps required to reach it, encouraging the model to surface reasoning incrementally rather than shortcutting to solutions. Comparative experiments will study continued pretraining on didactic corpora, fine-tuning-only approaches, and hybrid pipelines to determine which training regimes produce the most stable, controllable, and instructionally useful scaffolding behavior.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O144",
                "title": "Pedagogical RLHF Optimized for Learning Gains Rather Than Immediate Satisfaction",
                "description": "This research will reframe reinforcement learning for educational LLMs by shifting the reward signal from momentary user approval to long-term learning outcomes. Pedagogical reward models will be trained on longitudinal interaction traces that capture how learner performance, misconceptions, and confidence evolve over time, enabling estimation of whether a model's responses lead to durable understanding rather than short-term correctness. Reinforcement learning will optimize policies based on improvement in simulated or proxy student models across extended interactions, and comparative studies will evaluate satisfaction-optimized versus learning-optimized models using both simulated learners and controlled human experiments. The work will establish Pedagogical RLHF as a principled alternative to standard alignment methods for tutoring systems.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O145",
                "title": "Grade-Aligned Reasoning and Explanation Control Through Pedagogically Grounded RL",
                "description": "This outcome will develop models that produce explanations calibrated to a learner's grade level, controlling vocabulary, step complexity, abstraction, and scaffolding depth. Pedagogically grounded grading schemes will specify how concepts should be introduced, what terminology is appropriate, how many reasoning steps are suitable, and which misconceptions are expected at each grade. These schemes will form fine-grained reward signals for reinforcement learning, enabling the model to match explanation complexity to developmental level while adapting dynamically to learner history.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O146",
                "title": "Synthetic Versus Translated Data for Multilingual Pedagogical Alignment",
                "description": "This outcome will study how different post-training alignment data sources affect pedagogical behavior across languages. Two multilingual alignment datasets will be constructed, one using translations of high-quality English instructional interactions and another using natively generated synthetic multilingual examples. The study will evaluate how each approach impacts scaffolding consistency, reasoning clarity, tone safety, and adherence to pedagogical norms across languages, with special attention to cross-lingual fairness and structural alignment. The results will provide guidance on when synthetic, translated, or hybrid alignment strategies best support pedagogy-centric multilingual educational models.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O147",
                "title": "Cross-Lingual Pedagogical Skill Transfer",
                "description": "This outcome will study whether pedagogical skills learned in one language transfer reliably to other languages, especially low-resource Indian languages. The research will evaluate whether a model trained to teach well in English or a high-resource language exhibits the same instructional behavior when operating in another language, or whether pedagogical competence degrades, flattens, or becomes overly literal after translation. Controlled experiments will compare direct multilingual training, cross-lingual distillation, shared latent pedagogy representations, and language-agnostic scaffolding objectives to identify methods that promote consistent teaching behavior across languages. Evaluation will measure not only answer correctness but also scaffolding quality, grade alignment, misconception recovery, and learner preference across languages, establishing design principles for building educational LLMs that teach effectively and equitably in every language rather than only transferring surface-level knowledge.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.5.6",
        "title": "Education-Centric Multilingual-Multimodal Embedding Models",
        "description": "Retrieval-Augmented Generation systems for education in India require embedding models that go far beyond generic semantic similarity. Student queries are multilingual, code-mixed, noisy, and often underspecified, while authoritative content is distributed across languages, modalities, grade levels, and curriculum structures. This research focuses on building education-centric multilingual-multimodal embedding models that align queries and content across Indian languages and modalities while remaining sensitive to subject, grade, and pedagogical intent.",
        "outcomes": [
            {
                "id": "O148",
                "title": "Multilingual and Multimodal Retrieval Benchmarks for Indian Educational RAG",
                "description": "This outcome will create a comprehensive retrieval benchmark designed specifically for Indian educational RAG scenarios. The benchmark will contain curriculum-aligned queries written and spoken in multiple Indian languages, including code-mixed and colloquial forms, paired with gold-standard evidence drawn from NCERT and SCERT textbooks, DIKSHA content, teacher manuals, solved examples, diagrams, handwritten notes, STEM formulas, video transcripts, and ASR outputs. Each query-evidence pair will be annotated for conceptual relevance, grade appropriateness, subject alignment, and modality suitability, enabling systematic evaluation of cross-lingual retrieval, cross-modal grounding, and robustness to noisy inputs. This benchmark will serve as the reference evaluation suite for all embedding models developed under this research.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O149",
                "title": "Large-Scale Multilingual-Multimodal Educational Data Resources for Embedding Training",
                "description": "This outcome will construct large-scale pretraining and fine-tuning corpora tailored to building better embedding models for RAG systems. Data will be assembled by mining aligned and weakly aligned content from textbooks, classroom materials, exam questions, notes, DIKSHA videos, and transcripts, complemented by synthetic pair generation using LLMs to create cross-lingual, cross-modal, and curriculum-aware contrastive examples. Each data instance will be enriched with metadata such as subject, grade, topic hierarchy, modality type, and pedagogical role, enabling models to learn curriculum structure alongside semantic similarity. The resulting datasets will support training better education centric embedding models.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O150",
                "title": "Training Education-Centric Multilingual-Multimodal Embedding Models",
                "description": "Using the datasets from previous outcomes, this outcome will train a family of embedding models explicitly optimized for educational RAG. Training regimes will explore jointly optimizing cross-lingual alignment, multimodal grounding, and curriculum-aware structure using contrastive learning objectives augmented with curriculum tags, subject-aware hard negatives, etc. Comparative studies will examine adaptation from generic open-source embedding models versus training from scratch on education-heavy corpora, with detailed analysis of performance trade-offs for low-resource languages, code-mixed queries, and noisy ASR inputs. The resulting models will be evaluated against the benchmark in previous outcome to establish best practices and reusable training recipes for education-focused retrieval.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O151",
                "title": "Reliability Evaluation of Educational RAG Under Ambiguous and Confusing Retrieval Conditions",
                "description": "This outcome will extend the benchmark to stress-test embedding models and RAG pipelines under ambiguous, overlapping, and adversarial retrieval scenarios common in education, such as near-duplicate definitions, subtly contrasting explanations, overlapping theorems, multilingual paraphrases, and conflicting sources. Queries will be paired with expert-annotated minimal-sufficient evidence sets, enabling evaluation of retrieval precision, false-positive rates, semantic grounding, and stability of downstream generation when distractors are present.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.5.7",
        "title": "Videos-Is-All-You-Need: Video-Centric Pretraining and Alignment for Multimodal Models",
        "description": "Multimodal AI systems are increasingly built by extending pretrained text-only models with separate vision and audio components, yet current approaches rely on fragmented, manually curated datasets to align these modalities. This research explores a unified alternative: whether large-scale video corpora alone can serve as a universal supervisory substrate for learning multimodal representations and aligning vision and audio adapters within multimodal LLMs. Videos naturally encode dense, synchronized alignment across visual frames, spoken language, ambient audio, motion, captions, transcripts, titles, descriptions, and contextual metadata, offering rich cross-modal structure without explicit annotation.",
        "outcomes": [
            {
                "id": "O152",
                "title": "Large-Scale Video-Centric Multimodal Data Curation",
                "description": "This outcome will build a scalable data curation pipeline that collects and creates large video corpora, including educational videos, lectures, documentaries, and other relevant content. Visual frames, audio streams, speech transcripts, captions, on-screen text, motion cues, and metadata will be aligned at multiple temporal granularities, ranging from frame-level and utterance-level segments to scene-level and semantic-event representations. The curated dataset will emphasize naturally occurring correspondences such as spoken references to visual elements, temporal transitions between concepts, and co-occurring audio-visual patterns, creating a unified multimodal training resource grounded in real-world video structure rather than task-specific annotation.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O153",
                "title": "Training Video-Only Multimodal Embedding Models",
                "description": "Using the curated video-centric corpus, this outcome will train multimodal embedding models that jointly encode vision, audio, speech, and text into a shared representation space. Training objectives will figure out ways to leverage alignment signals across modalities, without relying on external image-text or audio-text datasets. The research will analyze using only video data will help us in building competing embedding models that perform on par on downstream tasks such as cross-modal retrieval, and other relevant RAG scenarios.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O154",
                "title": "Video-Driven Alignment of Vision and Audio Adapters in Multimodal LLMs",
                "description": "This outcome will study whether large collections of videos can be used to align vision and audio components added to a text-only LLM. Instead of relying on carefully curated image-text or audio-text datasets, the model will learn alignment directly from videos that contain frames, speech, sounds, captions, and transcripts occurring together over time. The evaluation will test whether this video-only-based training performs on par with multimodal models trained on explicitly curated data.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.5.8",
        "title": "Prosody- and Paralinguistic-Aware Multimodal LLMs for Adaptive Voice Interaction",
        "description": "Voice-based AI systems are increasingly used in education and other support settings, but most current models focus only on the words spoken and ignore how they are spoken. In real conversations, cues such as long pauses, hesitations, flat tone, rising pitch, or rushed speech often signal confusion, disengagement, frustration, or uncertainty. This research aims to build multimodal LLMs that can detect such prosodic and paralinguistic cues from speech and use them to adapt their responses in simple, practical ways, such as slowing down explanations, repeating key points, offering encouragement, or changing explanation style.",
        "outcomes": [
            {
                "id": "O155",
                "title": "Benchmark for Prosody and Paralinguistic Cues in Multilingual Speech Interaction",
                "description": "This outcome will create a benchmark that evaluates not only whether models can detect prosodic and paralinguistic cues in speech, but also whether they respond appropriately to them. The benchmark will consist of short voice-based interactions across multiple Indian languages, where the same spoken content is delivered with different prosodic patterns indicating confusion, hesitation, confidence, boredom, or frustration. For each interaction, the benchmark will include reference expectations for how a system should adapt its response, such as slowing down, simplifying the explanation, repeating key ideas, offering reassurance, changing strategy, or proceeding normally. Evaluation will measure both cue recognition and response quality, assessing whether the model's reply matches the user's inferred state in terms of pacing, depth, tone, and instructional choice. This benchmark will provide a realistic test of whether prosody-aware models can close the loop from speech perception to adaptive, supportive voice interaction in real educational settings.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O156",
                "title": "Large-Scale Multilingual Data for Prosody- and Paralinguistic-Aware Learning",
                "description": "This outcome will build a large training dataset that captures the full interaction loop from speech input to adaptive system response. Real speech data from tutoring-setups will be combined with synthetic data generated using prosody-controlled TTS and scripted dialogue scenarios, where both the speech signal and the desired adaptive response are known. The focus will be on realistic interaction behaviours such as when to slow down, simplify explanations, repeat content, change explanation style, offer encouragement, or move forward. This dataset will enable models to learn not only how prosodic cues map to user states, but how those states should influence response strategy in practical voice-based systems.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O157",
                "title": "Training Multimodal LLMs for Prosody-Guided Adaptive Voice Interaction",
                "description": "Using the benchmark and datasets, this outcome will train multimodal LLMs that take speech with prosodic features and respond according to the user's inferred state. Rather than treating prosody as auxiliary information, the models will be trained to condition their response strategy on these signals, affecting factors such as explanation depth, pacing, tone, repetition, and choice of instructional approach. Evaluation will measure whether the model consistently selects the appropriate style of response and whether these improve user understanding, engagement, and comfort compared to baselines. The resulting models will demonstrate practical, end-to-end prosody-aware voice interaction, where speech cues directly shape how the system responds rather than being detected and ignored.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]
  },
  {
    id: "safety",
    title: "Safety & Guardrails",
    shortTitle: "Safety",
    description: "Ensuring AI systems for education are safe for children, free from bias, aligned with Indian curricula, culturally grounded, age appropriate, and accountable to pedagogical and ethical standards.",
    iconName: "ShieldCheck",
    theme: 'red',
    problemCount: 22,
    tags: ["Ethics", "Text", "Speech", "Vision"],
    problems: [
    {
        "id": "4.6.1",
        "title": "Robust Reasoning and Response Under Noisy Educational Inputs",
        "description": "",
        "outcomes": [
            {
                "id": "O158",
                "title": "Benchmark for Reasoning and Response Robustness Under ASR, OCR, and Student-Generated Noise",
                "description": "This outcome will create a multilingual benchmark that tests LLM responses and reasoning under realistic noisy-input conditions common in education. Each problem will be provided in a clean reference form along with multiple controlled noisy variants that simulate ASR transcription errors, homophone confusions, missing punctuation, OCR character substitutions, broken math expressions, and developmentally common student mistakes. The evaluation will measure whether models can recover the intended meaning of the problem, recognize when the input is too ambiguous to answer confidently, and respond in a pedagogically safe way by asking for clarification or correcting errors gently instead of hallucinating solutions. Additional tests will examine whether models can normalize distorted symbolic expressions and remain numerically and scientifically safe when noise alters critical values or facts. This benchmark will provide a realistic measure of reasoning robustness for educational AI systems operating in voice-first, low-resource, and student-facing environments.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.2",
        "title": "Evaluating Tone Safety and Sycophancy in Child-Facing LLMs",
        "description": "As LLMs are increasingly used in educational tools for children, their tone and interaction style become as important as factual correctness. Child-facing systems must encourage learning without exaggeration, correct mistakes without discouraging the learner, and provide emotional support without misleading reassurance or flattery. However, many existing LLMs show sycophantic behaviour, such as agreeing with incorrect answers, over-praising effort without addressing mistakes, or validating misconceptions to appear supportive. This research focuses on systematically evaluating whether LLMs maintain safe, balanced, and developmentally appropriate tone in child-facing scenarios, especially under confusion, repeated errors, emotional pressure, or attempts to elicit praise.",
        "outcomes": [
            {
                "id": "O159",
                "title": "Benchmark for Tone Safety and Sycophancy in Child-Facing Interactions",
                "description": "This outcome will create a benchmark of child-like interactions across multiple Indian languages that test tone safety and resistance to sycophancy. The benchmark will include scenarios where a child gives wrong or partially wrong answers, expresses confusion or anxiety, insists on an incorrect belief, seeks praise without justification, or pressures the model for validation. Each interaction will include reference expectations for appropriate responses, such as gently correcting mistakes, encouraging effort while clearly indicating errors, avoiding exaggerated praise, and maintaining a calm, respectful tone. Evaluation will measure whether models strike the right balance between support and correctness, remain consistent across languages, and avoid tone drift or emotional over-reinforcement under multi-turn pressure.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O160",
                "title": "Tone-Safety Alignment Methods and Training Data for Child-Facing LLMs",
                "description": "This outcome will focus on developing better alignment methods that reduce sycophancy and unsafe tone in child-facing educational dialogue, supported by targeted training data. Curated and synthetic datasets will be created to cover common failure cases such as praising incorrect answers, over-validating misconceptions, giving misleading reassurance under anxiety, becoming overly flattering under pressure, or turning harsh and dismissive toward low-proficiency learners. Building on this, the research will explore better alignment algorithms that go beyond basic supervised fine-tuning, such as preference learning from teacher-written 'good vs bad' responses. Evaluation will measure whether these methods improve consistent behaviour across Indian languages and multi-turn conversations, and will produce practical alignment recipes for building child-facing systems that are encouraging, honest, and emotionally safe without being manipulative or sycophantic.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O161",
                "title": "Training Multimodal LLMs for Prosody-Guided Adaptive Voice Interaction",
                "description": "Using the benchmark and datasets, this outcome will train multimodal LLMs that take speech with prosodic features and respond according to the user's inferred state. Rather than treating prosody as auxiliary information, the models will be trained to condition their response strategy on these signals, affecting factors such as explanation depth, pacing, tone, repetition, and choice of instructional approach. Evaluation will measure whether the model consistently selects the appropriate style of response and whether these improve user understanding, engagement, and comfort compared to baselines. The resulting models will demonstrate practical, end-to-end prosody-aware voice interaction, where speech cues directly shape how the system responds rather than being detected and ignored.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.4",
        "title": "Child-Specific Safety and Developmental Appropriateness for Multilingual Multimodal LLMs",
        "description": "LLMs are increasingly being used in tools that interact directly with children, including tutors, homework helpers, and conversational assistants. These systems must follow stricter safety and behaviour standards than general-purpose chatbots, as children are more vulnerable to confusion, emotional harm, and misleading guidance. This research focuses on evaluating whether LLMs interacting with minors remain safe, age-appropriate, and educationally responsible across languages and cultural contexts in India. The goal is not only to test refusal on clearly unsafe content, but also to examine tone, boundary-setting, emotional handling, and whether models avoid oversimplifying, normalizing harm, or giving inappropriate guidance in sensitive situations.",
        "outcomes": [
            {
                "id": "O162",
                "title": "Child-Centered Safety Guidelines",
                "description": "This outcome will formalize a child-centered set of safety and behaviour guidelines that define clear boundaries for LLM interactions with minors. These guidelines will specify norms for truthfulness, refusal, tone moderation, emotional support without over-reassurance, neutrality on sensitive topics, and avoidance of adult framing or language. Data, Benchmarking and Training and alignment signals will be derived from these guidelines and applied to curated and synthetic dialogue data representing realistic child-facing interactions.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O163",
                "title": "Multilingual Benchmark for Child-Specific Safety and Developmental Behaviour",
                "description": "This outcome will create a multilingual and multimodal benchmark covering child-relevant safety scenarios across 22 Indian languages. The benchmark will include situations involving accidental exposure to adult or violent themes, mental health and emotional distress, academic dishonesty, harmful self-talk, peer pressure, exam anxiety, culturally sensitive topics, and attempts to elicit inappropriate advice or reassurance. Each scenario will be annotated by educators and child-safety experts to specify what a safe and appropriate response looks like, including when the model should refuse, when it should redirect, how much detail is acceptable, and what tone should be used. Evaluation will measure whether models follow these expectations consistently across languages and remain stable under multi-turn pressure.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O164",
                "title": "Developing Better Safety Alignment Techniques for Multilingual and Multimodal LLMs",
                "description": "Using the benchmark and child-centered safety guidelines, this outcome will focus on developing and testing alignment techniques that improve safe behaviour in multilingual and multimodal LLMs. The research will study how different alignment methods handle safety across languages, scripts, and modalities such as text, speech, and images, and where failures occur when safety rules weaken under translation, code-mixing, or multi-turn interaction. Experiments will compare various existing  approaches and further explore better techniques to achieve more robust safety alignment.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O165",
                "title": "Lightweight Guard Models for Child-Specific Safety Screening",
                "description": "This outcome will explore building small, fast guard models that can quickly flag whether a model response or user query is appropriate for child-facing interaction. These guard models will be trained to detect risks such as unsafe content exposure, inappropriate tone, over-reassurance, adult framing, encouragement of harmful behaviour, or violation of age-appropriate boundaries, across multiple Indian languages. The focus will be on low-latency models that can run before or alongside the main LLM, enabling real-time safety checks without slowing down interaction. Evaluation will measure accuracy, false positives, language coverage, and consistency with the child-safety benchmark, as well as how effectively these guards complement larger LLMs in preventing unsafe or developmentally inappropriate responses in real educational settings.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.5",
        "title": "Robustness and Operational Safety in Multimodal Educational LLMs",
        "description": "",
        "outcomes": [
            {
                "id": "O166",
                "title": "Multimodal Benchmark for Adversarial and Operational Robustness in Educational AI",
                "description": "This outcome will create a large benchmark designed to test robustness and operational safety of educational LLMs and MLLMs across text, speech, images, handwritten notes, screenshots, and document snippets. The benchmark will include adversarial variants of curriculum aligned questions such as nonsensical questions, irrelevant or off-topic inputs, prompt-injection attempts, unsafe requests disguised as learning tasks, mismatched modalities, and noisy or incomplete inputs. Each example will be annotated with the expected system behaviour, such as refusal, clarification request, safe redirection, or normal educational response. Evaluation will measure whether models correctly identify when a question cannot or should not be answered, avoid hallucinating explanations, and maintain pedagogical tone under stress.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O167",
                "title": "Cross-Language and Multimodal Robustness Analysis for Indian Educational Contexts",
                "description": "This outcome will analyze whether robustness and safety failures vary across Indian languages, scripts, accents, and code-mixed inputs, and whether multimodal inputs introduce new vulnerabilities not seen in text-only settings. The study will examine cases where models behave safely in English but fail in regional languages, or where speech, handwriting, or images bypass safety checks. The results will identify systematic gaps in current models and inform language- and modality-specific mitigation strategies, ensuring that robustness and operational safety are not limited to high-resource or text-only scenarios.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O168",
                "title": "Robustness to Ambiguity and Ill-Formed Educational Queries",
                "description": "Beyond adversarial attacks, many real student queries are simply unclear, underspecified, or poorly formed. This outcome will study how models handle ambiguous or incomplete educational questions, such as missing context, unclear goals, or partially incorrect premises. The evaluation will measure whether models appropriately ask clarifying questions, state uncertainty, or guide the student toward a well-formed query, instead of guessing or hallucinating answers. This work will help distinguish healthy uncertainty-handling from failure, and will define best practices for building educational AI systems that are honest about limits while remaining helpful.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O169",
                "title": "Training Strategies for Enhanced Multimodal Robustness and Safety",
                "description": "This outcome will develop and evaluate advanced training techniques to systematically improve the robustness and operational safety of educational MLLMs identified. This includes developing new multimodal adversarial training methods that cover joint text, image, and speech perturbations; specialized curriculum learning for handling ambiguous and ill-formed queries; and reinforcement learning from human feedback (RLHF) specifically tailored for pedagogical safety, refusal-to-answer policies, and graceful uncertainty handling. The goal is to move beyond simple fine-tuning and create a robust training paradigm that ensures MLLMs maintain safety, accuracy, and an appropriate educational tone across diverse, noisy, and potentially adversarial multimodal inputs, particularly focusing on low-resource and code-mixed educational contexts.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.6",
        "title": "Fairness in Instructional Support and Scaffolding by Educational LLMs",
        "description": "",
        "outcomes": [
            {
                "id": "O170",
                "title": "Benchmark for Fairness in Step-by-Step Scaffolding Across Learner Groups",
                "description": "This outcome will create a multilingual benchmark of learning tasks with expert-defined scaffolding annotations that specify how help should be revealed over time. The same task will be paired with variations in language, learner proficiency cues, register, and contextual signals, allowing evaluation of whether models change the depth, clarity, or pacing of scaffolding across groups. The benchmark will test whether models reveal answers too early, provide overly complex hints, or reduce encouragement for certain learners. The results will define fairness metrics specific to instructional scaffolding, moving beyond generic response-quality measures.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O171",
                "title": "Develop and Validate Debiasing and Augmentation Strategies for Educational Multimodal LLMs",
                "description": "This outcome will focus on creating novel training and fine-tuning techniques to mitigate bias and improve fairness in multimodal LLMs specifically for educational applications. This includes developing culturally responsive data augmentation methods that diversify visual and textual examples across different cultural and linguistic contexts. We will explore adversarial debiasing techniques tailored to educational scaffolding, aiming to prevent the model from relying on sensitive attributes (like perceived learner group or accent) when providing support. The work will define and measure the impact of these strategies on fairness metrics derived from instructional support benchmarks, ensuring the LLMs provide equitable and effective assistance to all learner groups.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.7",
        "title": "Fairness and Cultural Appropriateness in Multilingual Educational Explanations",
        "description": "",
        "outcomes": [
            {
                "id": "O172",
                "title": "Evaluating Equitable Fairness and Cultural Appropriateness of Multilingual Explanations Generated by LLMs and MLLMs",
                "description": "This research will examine whether models provide equally accurate, detailed, and culturally grounded explanations across India's major languages, without privileging English or select high-resource languages. A multilingual benchmark will be constructed containing parallel instructional prompts - spanning STEM, social sciences, and everyday reasoning. The evaluation will measure disparities across languages in explanation quality, conceptual completeness, example selection, and contextual grounding (e.g., whether models use culturally appropriate analogies in Marathi or Tamil but produce generic or Westernized examples in Santali or Odia). Additional analyses will assess whether models produce oversimplified or overly formal responses in certain languages, whether follow-up suggestions differ in richness or accuracy across linguistic groups, and whether implicit cultural or linguistic biases affect reasoning quality. The study will also investigate dialect sensitivity, code-mixed robustness, and whether models unintentionally reinforce linguistic hierarchies by producing systematically weaker outputs for low-resource languages.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O173",
                "title": "Developing Novel Training Strategies for Enhanced Multilingual Fairness and Cultural Grounding",
                "description": "Building upon previous outcome, this research focuses on developing and validating innovative training and fine-tuning methodologies to systematically mitigate observed disparities in multilingual and culturally diverse educational explanations. Key strategies include - 1) Culturally-Aware Prompt Engineering and Instruction Tuning - Designing language-specific instruction sets and fine-tuning data emphasizing cultural appropriateness, local context, and analogy selection for low-resource languages. 2) Weighted Sampling and Data Augmentation - Implementing data balancing techniques, prioritizing quality and quantity for underrepresented Indian languages (e.g., through back-translation or synthetic data generation for culturally specific concepts). 3) Multilingual and Multimodal Bias Detection and Correction - Integrating novel loss functions or post-hoc mechanisms to penalize generic or Westernized outputs, favoring culturally grounded alternatives. 4) Human-in-the-Loop Feedback for Cultural Relevance - Establishing a localized human evaluation pipeline where native speakers provide fine-grained feedback on the cultural appropriateness and dialect sensitivity of generated explanations for iterative refinement. The goal is to develop reproducible techniques that demonstrably reduce linguistic hierarchies and ensure equitable, high-quality, and culturally resonant educational content across India's diverse linguistic landscape.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.8",
        "title": "Fairness and Bias in Speech- and Accent-Based Educational Feedback",
        "description": "",
        "outcomes": [
            {
                "id": "O174",
                "title": "Fairness, Accent Robustness, and Bias Evaluation of MLLM-Based Feedback in ORF systems",
                "description": "This study will systematically evaluate whether Multimodal Large Language Models (MLLMs) provide fair, unbiased, and linguistically inclusive feedback when analyzing children's oral reading across India's diverse accent landscape. The research will investigate whether MLLMs correctly distinguish between genuine mispronunciations and legitimate accent-driven variants across Indian English and regional languages, and whether their corrective suggestions disproportionately flag rural, tribal, or non-mainstream speech patterns as 'errors.' A large benchmark of annotated child-speech samples, from different regions, socio-economic backgrounds, genders, and schooling environments, will be constructed, with expert labels marking acceptable accent variation, dialect-typical phoneme shifts, and typical early-grade prosodic styles. The study will evaluate MLLM outputs for accent sensitivity, error inflation, over-correction, tone consistency, and proneness to recommending unnecessary 'standardization.' It will also examine whether gender or sociolect biases emerge in fluency judgments, encouragement tone, or suggested exercises.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O175",
                "title": "Fairness and Bias Evaluation of Educational Audio LLMs in Spoken Question Answering and Tutoring",
                "description": "This study will systematically evaluate whether educational  MLLMs provide fair, consistent, and unbiased responses when answering spoken questions or engaging in tutoring-style dialogue with students from diverse linguistic, regional, and socio-economic backgrounds. The research will examine whether models give systematically better explanations, more patience, or more detailed guidance to certain students based on accent, speech rate, pronunciation clarity, confidence, or language choice, while offering weaker, shorter, or more dismissive responses to others. A large benchmark of spoken educational interactions will be constructed across Indian languages and Indian English accents, including variations in accent strength, fluency, confidence, hesitation, and code-mixing, all holding the underlying question constant. The evaluation will measure disparities in answer quality, explanation richness, clarification behaviour, emotional tone, follow-up suggestions, and willingness to engage across different speaker profiles. Additional analyses will study whether biases correlate with rural versus urban accents, gendered speech patterns, sociolects, or perceived proficiency, and whether such disparities persist under repeated interaction.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.9",
        "title": "Fairness in Aspirational and Career Guidance by Educational LLMs",
        "description": "",
        "outcomes": [
            {
                "id": "O176",
                "title": "Evaluating Socio-Economic Bias and Aspirational Ceilings in Recommendations",
                "description": "Fairness in guidance is not only about avoiding harm, but about avoiding lowered expectations. Career and aspiration recommendations can silently reproduce socio-economic ceilings by steering different groups toward different futures. This research studies whether AI systems provide equitable aspirational guidance that does not reinforce historical disadvantage. This outcome will construct a benchmark of student profiles with controlled variations in language, region, gender, caste proxies, and schooling background. For each profile, expert counselors will define acceptable ranges of aspirational recommendations. The benchmark will enable counterfactual evaluation, where demographic attributes are altered while holding ability constant.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.10",
        "title": "Consistency and Stability of Safety Behaviour in Long-Horizon Educational Interactions",
        "description": "Educational LLMs are often evaluated on single-turn safety behaviour, but real tutoring interactions unfold over many turns, where pressure, confusion, insistence, and emotional cues accumulate. This research focuses on evaluating whether safety, tone, and boundary-setting behaviour remain stable over long interactions, rather than degrading over time. The goal is to understand whether models maintain consistent refusals, appropriate tone, and instructional boundaries when subjected to repeated errors, follow-up questioning, emotional appeals, or gradual attempts to bypass safeguards.",
        "outcomes": [
            {
                "id": "O177",
                "title": "Benchmark for Long-Horizon Safety and Tone Stability",
                "description": "This outcome will develop a benchmark of multi-turn educational interactions where safety-relevant pressure builds gradually across turns, including repeated incorrect answers, escalating frustration, subtle prompt injection, and persistence after refusals. Each interaction will be annotated with expected behaviour at each turn, specifying when models should continue refusing, redirect, restate boundaries, or de-escalate emotionally. Evaluation will measure guardrail erosion, tone drift, contradiction of earlier responses, delayed hallucination, and inconsistency in refusal behaviour, providing a systematic way to assess safety stability over extended interaction lengths.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.11",
        "title": "Robustness to Conflicting or Contradictory Evidence in Educational Reasoning",
        "description": "Educational AI systems often encounter conflicting information, especially in retrieval-based settings where multiple sources may disagree or present partial views. This research evaluates whether LLMs and MLLMs handle such conflicts responsibly, rather than arbitrarily choosing an answer or fabricating reconciliation. The focus is on whether models can acknowledge disagreement, explain uncertainty, and guide learners appropriately when evidence does not align.",
        "outcomes": [
            {
                "id": "O178",
                "title": "Evaluation of Conflict Handling and Evidence-Aware Reasoning",
                "description": "This outcome will introduce an evaluation suite where models are given questions paired with conflicting textbooks, differing explanations, outdated versus current material, or partially overlapping evidence across languages and modalities. Each case will specify acceptable behaviours, such as explicitly noting disagreement, explaining why sources differ, or asking for clarification. Evaluation will measure hallucinated certainty, forced reconciliation, omission of conflict, and inappropriate confidence, establishing standards for responsible handling of contradictory educational evidence.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.6.12",
        "title": "Robustness to Modality Mismatch in Multimodal Educational Systems",
        "description": "Multimodal educational systems frequently receive inputs where modalities are irrelevant, mismatched, or noisy, such as incorrect diagrams, low-quality images, noisy audio, or unrelated documents paired with valid questions. This research evaluates whether MLLMs appropriately question or reject unsupported multimodal inputs instead of hallucinating connections or fabricating explanations.",
        "outcomes": [
            {
                "id": "O179",
                "title": "Benchmark for Modality Mismatch and Noise Robustness",
                "description": "This outcome will create an evaluation benchmark where educational queries are paired with irrelevant, misleading, or degraded multimodal inputs, including mismatched images, incorrect diagrams, partial screenshots, and noisy speech transcripts. Expected behaviour will include asking for clarification, ignoring irrelevant modalities, or explicitly stating that the provided input does not support the question. Evaluation will measure hallucination rates, forced grounding errors, and inappropriate reliance on noisy inputs, enabling systematic assessment of multimodal robustness.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]
  },
   {
    id: "multi",
    title: "Multimodal Generation",
    shortTitle: "Multi",
    description: "Developing multimodal generation systems that create accurate, curriculum-aligned images, diagrams, animations, and videos for educational and STEM learning across Indian languages.",
    iconName: "Brain",
    theme: 'indigo',
    problemCount: 13,
    tags: ["Text", "Vision", "Speech"],
    problems: [
    {
        "id": "4.7.1",
        "title": "Curriculum-Grounded Image Generation for Education",
        "description": "Educational image generation requires very different properties from general visual generation - clarity over realism, correctness over style, and alignment with grade-level pedagogy rather than artistic flair. This research area focuses on training and evaluating image generators that produce diagrams, illustrations, and scenes that are factually correct, age-appropriate, and usable in classrooms across subjects and grades. The emphasis is on curriculum grounding, diagram accuracy, and instructional value rather than open-ended creativity.",
        "outcomes": [
            {
                "id": "O180",
                "title": "Benchmark for Curriculum-Aligned Educational Image Generation",
                "description": "This outcome will create a benchmark that evaluates whether image-generation models can produce visually correct and pedagogically meaningful images for educational concepts across subjects such as mathematics, science, social science, and language learning. Prompts will be aligned with curriculum concepts and grade levels, and paired with expert-validated reference images that specify correct structure, labeling, proportions, and instructional style. Evaluation will measure conceptual correctness, diagram accuracy, label fidelity, age appropriateness, and resistance to misleading or hallucinated visual elements, providing a standardized test for classroom readiness of generated images.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O181",
                "title": "Large-Scale Curriculum-Tagged Image Data for Training Educational Generators",
                "description": "This outcome will build a structured training corpus of educational images including diagrams, concept illustrations, classroom scenes, lab setups, maps, timelines, and visual aids. Each image will be tagged with subject, grade level, topic, and pedagogical role such as introduction, practice, or revision. Different data mixtures will be constructed, including subject-balanced, grade-progressive, diagram-heavy, and region-balanced variants, enabling systematic study of how training curricula affect downstream educational usefulness. The dataset will prioritize clarity, simplicity, and conceptual correctness over stylistic variation.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O182",
                "title": "Training Image Generators Using Educational Curricula and Data Mixtures",
                "description": "Using the curated datasets, this outcome will train and compare image-generation models under different curriculum designs, such as early-grade-first training, subject-wise staging, and diagram-focused pretraining. Experiments will measure how these choices affect performance on diagram generation, concept visualization, and age-appropriate scene creation, as well as whether curriculum-aware training reduces artistic style drift and improves consistency with textbook standards. The result will be practical guidelines for training image generators specifically for educational use.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.7.2",
        "title": "Indic Script-Aware Image Generation for Multilingual Education",
        "description": "A core requirement for educational image generation in India is the ability to correctly render Indic scripts inside images. Current image models struggle with non-Latin text, producing broken characters, incorrect ligatures, or unreadable labels, making outputs unusable for instruction. This research area focuses on enabling reliable generation and evaluation of Indic-language text within images used for learning.",
        "outcomes": [
            {
                "id": "O183",
                "title": "Benchmark for Indic Script Rendering in Educational Images",
                "description": "This outcome will create a benchmark that tests the ability of image-generation models to render Indic scripts correctly within educational visuals. Prompts will require labeled diagrams, flashcards, posters, charts, and classroom visuals containing text in scripts such as Devanagari, Tamil, Telugu, Kannada, Malayalam, Bangla, Gujarati, Odia, Punjabi, and Urdu. Evaluation will measure character correctness, ligature integrity, spacing, readability, layout stability, and consistency across different text lengths and educational contexts.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O184",
                "title": "Multilingual, Script-Rich Training and Generation for Indic Educational Images",
                "description": "This outcome will first focus on building a comprehensive, multilingual image dataset for educational content. The dataset will be sourced from diverse materials like textbooks and worksheets, containing native Indic-script text. Prompts in multiple languages will be paired with images featuring correctly rendered Indic-script labels, legends, and annotations, ensuring Indic scripts are treated as first-class visual elements for model training. Subsequently, using this dataset and a dedicated benchmark, the outcome will explore effective training strategies- such as joint Latin-Indic training, script-specific adapters, and staged fine-tuning-to develop script-aware image generators. The goal is to produce concrete training recipes for multilingual educational image generation, evaluated on script accuracy, label placement, and cross-language consistency, while preserving Latin text capability.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.7.3",
        "title": "Diagram-Centric Image Generation and Evaluation",
        "description": "Diagrams are one of the most critical visual tools in education, yet also one of the hardest to generate correctly. Small visual errors can lead to conceptual misunderstandings. This research area focuses specifically on generating and evaluating diagrams that meet textbook-level standards of correctness and clarity.",
        "outcomes": [
            {
                "id": "O185",
                "title": "Diagram-Focused Benchmark for Pedagogical Correctness",
                "description": "This outcome will build a structured benchmark focused on generating instructionally valid diagrams such as geometric figures, chemical structures, process flows, biological illustrations, and physics setups. Prompts will require precise placement of labels, arrows, angles, axes, symbols, and proportions. Evaluation will combine automated checks for topology, spatial relations, and label integrity with expert review for pedagogical clarity and classroom readiness.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O186",
                "title": "Training Structure-Aware Diagram Generators",
                "description": "The current limitation of treating textbook diagrams as generic images hinders the development of AI models for education that can generate consistently correct and structurally coherent diagrams. This project aims to overcome this by creating a dataset of high-quality textbook diagrams with explicit structural annotations and using it to train structure-aware diagram generators. The goal is to develop models that incorporate structural constraints and layout awareness to improve symbol integrity, reduce common diagram errors, and better adhere to educational formatting standards.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.7.4",
        "title": "Multilingual Image Translation and Localization for Education",
        "description": "A large fraction of educational content already exists in visual form, such as diagrams, charts, maps, posters, and slides, but remains inaccessible to many learners due to language barriers. Translating educational images is not a simple OCR-plus-translation task, as labels, arrows, legends, equations, and spatial layout must be preserved precisely to avoid changing the meaning of the visual. This research area focuses on building reliable systems for translating and localizing educational images into Indian languages while maintaining pedagogical structure, visual clarity, and curriculum alignment. The goal is to enable scalable localization of existing educational visuals without degrading instructional quality.",
        "outcomes": [
            {
                "id": "O187",
                "title": "Benchmark for Multilingual Image Translation in Educational Content",
                "description": "This outcome will create a comprehensive benchmark for evaluating image translation in educational settings. The benchmark will consist of curriculum-aligned diagrams and visuals from subjects such as science, mathematics, geography, and social sciences, containing structured English text elements such as labels, arrows, axis titles, chemical symbols, captions, and annotation blocks. For each source image, professionally translated gold versions will be provided in multiple Indian languages, including Hindi, Tamil, Bengali, Telugu, Marathi, and others. Evaluation will measure translation accuracy, correctness of domain terminology, preservation of layout and spatial alignment, script rendering quality, legibility, and whether the translated image remains pedagogically equivalent to the original.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O188",
                "title": "Data Resources for Training Educational Image Translation Models",
                "description": "This outcome will build large-scale paired datasets of educational images and their localized counterparts across Indian languages. The data will include diagrams with short and long labels, multi-line text blocks, equations, legends, and right-to-left scripts such as Urdu, covering both print-style and classroom-style visuals. Each pair will include structured annotations describing text regions, reading order, and semantic roles of visual elements, enabling models to learn how translation interacts with layout and meaning. This dataset will support both supervised learning and evaluation of multimodal translation systems designed for education.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O189",
                "title": "Training Multimodal Models for Layout-Preserving Image Translation",
                "description": "Using the benchmark and datasets, this outcome will train multimodal models that jointly perform text recognition, translation, and visual in-painting while preserving diagram structure. Training will emphasize maintaining spatial consistency, avoiding overlap or misplacement of labels, and respecting typographic constraints of different scripts. Experiments will compare pipeline-based approaches with end-to-end models and will evaluate robustness to edge cases such as long translated strings, dense diagrams, and mixed symbolic and textual content. The result will be practical training strategies for reliable multilingual localization of educational visuals.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.7.5",
        "title": "Multimodal Video Generation and Dubbing for Educational Content",
        "description": "Educational videos often contain tightly coupled speech, on-screen text, diagrams, and visible speaker motion, making partial localization ineffective. Simply translating audio while leaving slides, board writing, or lip movements unchanged can confuse learners and reduce trust. This research area focuses on building systems that can fully localize educational videos by jointly adapting speech, on-screen text, and visual elements, producing coherent multilingual versions suitable for classroom use.",
        "outcomes": [
            {
                "id": "O190",
                "title": "Benchmark for Fully Localized Educational Video Content",
                "description": "This outcome will create an evaluation benchmark for multilingual educational video localization. The benchmark will include lecture videos, explainer videos, and classroom recordings with aligned source and target language versions. Each example will specify expected speech translations, on-screen text replacements, diagram consistency requirements, and acceptable lip-sync tolerances. Evaluation will measure semantic correctness, visual consistency, timing alignment, lip-sync quality, and learner preference, enabling systematic comparison of partial versus fully integrated dubbing approaches.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O191",
                "title": "Data Resources for Training Educational Image Translation Models",
                "description": "This outcome will build large-scale paired datasets of educational images and their localized counterparts across Indian languages. The data will include diagrams with short and long labels, multi-line text blocks, equations, legends, and right-to-left scripts such as Urdu, covering both print-style and classroom-style visuals. Each pair will include structured annotations describing text regions, reading order, and semantic roles of visual elements, enabling models to learn how translation interacts with layout and meaning. This dataset will support both supervised learning and evaluation of multimodal translation systems designed for education.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O192",
                "title": "Training Multimodal Models for Layout-Preserving Image Translation",
                "description": "Using the benchmark and datasets, this outcome will train multimodal models that jointly perform text recognition, translation, and visual in-painting while preserving diagram structure. Training will emphasize maintaining spatial consistency, avoiding overlap or misplacement of labels, and respecting typographic constraints of different scripts. Experiments will compare pipeline-based approaches with end-to-end models and will evaluate robustness to edge cases such as long translated strings, dense diagrams, and mixed symbolic and textual content. The result will be practical training strategies for reliable multilingual localization of educational visuals.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]
  },
  {
    id: "agent",
    title: "Tools & Agentic Systems",
    shortTitle: "Agents",
    description: "Building agentic AI systems that can plan, reason, and take guided actions to support learning and teaching, while remaining aligned with pedagogy, curriculum goals, and strong safety guardrails.",
    iconName: "Brain",
    theme: 'green',
    problemCount: 14,
    tags: ["Text", "Vision", "Speech"],
    problems: [
    {
        "id": "4.8.1",
        "title": "Structure-Aware Retrieval for STEM Diagrams and Visual Reasoning Artifacts",
        "description": "Many STEM queries are fundamentally about structure rather than text-geometry configurations, circuit topologies, motion graphs, and chemistry structures. Naive image retrieval fails because superficial similarity does not imply conceptual similarity. This area focuses on diagram parsing, structural representations, and retrieval based on semantic structure.",
        "outcomes": [
            {
                "id": "O193",
                "title": "Benchmark for Diagram-Structure Retrieval in STEM",
                "description": "This outcome will build a benchmark across geometry, circuits, graphs, and chemistry diagrams where the retrieval target is defined by structural similarity (e.g., same triangle constraints, same series-parallel circuit, same graph trend). Evaluation will measure whether systems retrieve conceptually equivalent structures rather than visually similar pictures.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O194",
                "title": "Retrieval Models for Diagram Structure Using Graph Representations",
                "description": "Using the dataset and benchmark, this outcome will come up with better strategies to train models that embed diagrams as structured graphs and support search by topology/constraints. Experiments will compare pure vision embeddings vs graph-based embeddings vs hybrid models, emphasizing robustness to noisy labels, occlusions, and handwritten diagrams.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.8.2",
        "title": "Structure- and Curriculum-Aware Retrieval for Pedagogically Aligned STEM Learning",
        "description": "In educational tutoring, relevance alone is insufficient. A retrieved explanation, example, or diagram may be mathematically correct yet pedagogically inappropriate-too advanced for the learner's grade, misaligned with their board syllabus, or dependent on missing prerequisite concepts. Such mismatches can confuse learners, increase cognitive load, and undermine trust in the system. This research area focuses on curriculum-grounded representations, benchmarks, and adaptive retrieval policies that align content discovery with pedagogical intent.",
        "outcomes": [
            {
                "id": "O195",
                "title": "Curriculum Alignment Graph and Metadata Standard for Retrieval",
                "description": "This outcome will construct a curriculum knowledge graph that encodes the hierarchical structure of school STEM curricula across grades, subjects, and boards (NCERT and major SCERT variants). The graph will represent topics, subtopics, learning objectives, and explicit prerequisite relationships, along with grade-level expectations and board-specific sequencing differences. All retrievable educational assets-textbook paragraphs, worked examples, videos, diagrams, worksheets, and teacher notes-will be tagged with standardized curriculum metadata linked to this graph. This enables curriculum-aware filtering, reranking, and constraint-based retrieval. The outcome will define a reusable metadata standard and alignment protocol that can be applied consistently across content types and states.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O196",
                "title": "Benchmark for Pedagogical Appropriateness in Retrieval",
                "description": "This outcome will create a benchmark in which each student query is paired with relevance labels that go beyond topical correctness to include grade appropriateness, board alignment, and prerequisite suitability. For each query, multiple candidate retrievals will be annotated to indicate whether they are (a) usable immediately, (b) usable only after prerequisite remediation, or (c) pedagogically inappropriate. The benchmark will support evaluation of retrieval systems on their ability to surface content that learners can meaningfully engage with at their current level. Metrics will measure not only topical recall but also pedagogical precision, penalizing retrievals that are correct yet unusable due to level mismatch or missing conceptual scaffolding.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O197",
                "title": "Adaptive Retrieval Policies for Remediation and Scaffolding",
                "description": "Building on the curriculum graph and benchmark, this outcome will develop adaptive retrieval policies that dynamically select among different classes of content - (a) direct answer or explanation sources, (b) prerequisite or bridging concept material, and (c) worked examples or guided practice items. The selection will be conditioned on the student's query, inferred skill level, prior error patterns, and curriculum position. Rather than always retrieving the 'best match,' the system will decide what kind of content best supports learning in that moment. Evaluation will emphasize learning-oriented outcomes, including reduction in repeated misconceptions, improved performance on follow-up questions, and smoother progression through prerequisite chains.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.8.3",
        "title": "Factual Reliability, Citation Grounding, and Abstention in Retrieval-Augmented Tutoring",
        "description": "Retrieval-augmented systems are often assumed to be factually reliable by default, yet in practice they frequently exhibit fake grounding - citing irrelevant passages, hallucinating citations, or over-confidently answering based on weak or mismatched evidence. In educational settings, such failures are especially harmful-they can mislead learners, propagate misconceptions, and erode trust in the tutor. Tutor agents must therefore go beyond basic RAG. It must (a) ground its answers in verifiable, curriculum-aligned evidence, (b) accurately cite what supports which part of an answer, and (c) know when not to answer-asking for clarification or abstaining when retrieval confidence is insufficient. This research area focuses on benchmarks, models, and policies that ensure factual reliability, transparent grounding, and calibrated abstention in multimodal educational tutoring.",
        "outcomes": [
            {
                "id": "O198",
                "title": "Benchmark for Citation Correctness in Educational RAG",
                "description": "This outcome will create a benchmark where generated answers are required to cite precise supporting evidence from retrieved sources, such as text spans in textbooks, timestamps in educational videos, or spatial regions in scanned pages and diagrams. Each answer will be annotated with gold citation targets and acceptable citation alternatives. Evaluation will go beyond surface citation presence to measure support faithfulness-whether the cited evidence genuinely justifies the corresponding claim in the answer. Metrics will include citation precision and recall, span/timestamp accuracy, and penalties for hallucinated, mismatched, or overly generic citations. The benchmark will enable systematic comparison of citation-aware generation methods and discourage superficial or symbolic grounding.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O199",
                "title": "Retrieval Confidence Calibration and Abstention Policies",
                "description": "This outcome will develop methods to estimate and calibrate retrieval confidence across modalities, including text passages, videos, diagrams, and scanned content. Confidence signals may include retrieval score distributions, cross-source agreement, modality consistency, and alignment with curriculum metadata. Using these signals, the outcome will define abstention and clarification policies that allow the system to withhold answers, request additional context, or surface uncertainty when evidence is weak or ambiguous. Experiments will evaluate reductions in hallucinated claims and incorrect over-confident answers, while measuring whether abstention is applied judiciously so that overall helpfulness and learning support are preserved.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O200",
                "title": "Source Quality and Curriculum Authority Filters",
                "description": "This outcome will build mechanisms to assess and enforce source authority within educational retrieval. Sources will be ranked and filtered based on curriculum alignment and trust signals, such as NCERT/SCERT provenance, DIKSHA verification, board-approved materials, and teacher-validated notes. The system will also detect and reason about conflicts across sources, such as differing explanations, notation conventions, or sequencing across boards. Instead of arbitrarily choosing one source, the system will either prefer authoritative content or explicitly flag uncertainty and variation when appropriate. Evaluation will measure whether retrieval and generation consistently prioritize authoritative sources and transparently handle conflicting evidence.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.8.4",
        "title": "Parametric Knowledge vs Retrieval Decision Policies",
        "description": "Not every educational query requires external retrieval. Many questions-definitions, well-known identities, or previously mastered concepts-can be answered directly from a model's parametric knowledge. However, under-retrieval in STEM domains risks hallucinated facts, incorrect formulas, or board-specific mismatches, while over-retrieval increases latency, cost, and system complexity without pedagogical benefit. Tutor Agents therefore needs principled decision policies that determine when to rely on parametric knowledge, when to retrieve authoritative curriculum sources, and when to ask a clarifying question before proceeding. This research area focuses on benchmarking these decisions, modeling uncertainty and risk, and learning retrieval-gating policies that balance correctness, efficiency, and trustworthiness.",
        "outcomes": [
            {
                "id": "O201",
                "title": "Benchmark for 'Retrieve or Not' Decisions in Education Queries",
                "description": "This outcome will build a benchmark of student queries annotated with the appropriate system action - (a) answer using parametric knowledge, (b) retrieve from curriculum-aligned sources, or (c) ask a clarifying question before answering. Annotations will be guided by teacher judgments and curriculum experts, and will explicitly include ambiguous and borderline cases, such as unclear grade or board context, incomplete problem statements, or questions whose correctness depends on notation conventions or syllabus sequencing. The benchmark will enable evaluation of decision accuracy and highlight failure modes where premature answering or unnecessary retrieval leads to errors.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O202",
                "title": "Router Models for Retrieval Gating with Risk Awareness",
                "description": "Using the benchmark, this outcome will train better router models that incorporate uncertainty estimation and risk signals, such as numerical sensitivity, STEM safety, assessment stakes, and curriculum specificity. Rather than treating retrieval as a default, the model will explicitly weigh the cost and benefit of retrieval for each query. Evaluation will measure not only action correctness but also downstream outcomes, including citation faithfulness, reduction in hallucinated or high-impact errors, and latency/cost trade-offs. The result will be deployable decision policies that make retrieval a deliberate, justifiable choice rather than an unconditional step.",
                "tags": [],
                "priority": ""
            }
        ]
    },
    {
        "id": "4.8.5",
        "title": "Tool-Calling and Agentic Retrieval for Educational Tutoring",
        "description": "High-quality educational assistance often requires multi-step evidence seeking rather than a single retrieval call. A tutor may need to search curriculum repositories, locate a specific video segment, retrieve a worked example, verify a formula, and then synthesize a scaffolded explanation. For smaller or on-device models, effective tool use can compensate for limited parametric knowledge and enable reliable tutoring under resource constraints. This research area focuses on agentic retrieval systems that plan and execute sequences of tool calls, translate noisy student inputs into effective queries, and optimize tool use through reinforcement learning-ensuring that tool calling improves factual grounding rather than introducing new failure modes.",
        "outcomes": [
            {
                "id": "O203",
                "title": "Tool-Use Benchmark for Educational Retrieval Tasks",
                "description": "This outcome will create a benchmark where models must solve tutoring tasks by invoking a sequence of tools, such as curriculum search, video timestamp retrieval, diagram lookup, and glossary access. Each task will specify one or more acceptable tool-use trajectories, reflecting the fact that there may be multiple valid paths to the correct evidence. Evaluation will measure tool selection accuracy, quality of generated search queries, efficiency of tool usage, and usefulness of the final grounded answer. The benchmark will explicitly penalize unnecessary or irrelevant tool calls, encouraging deliberate and goal-directed tool use.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O204",
                "title": "RL for Tool Calling with Reward on Evidence Quality",
                "description": "This outcome will explore reinforcement learning approaches where the reward is tied not only to the final answer but to the quality of retrieved evidence. Reward signals will value correct tool choice, effective search terms, minimal tool calls, and faithful grounding in authoritative sources, while penalizing hallucinated or weakly supported answers. Experiments will compare supervised tool-calling baselines with RL-trained agents, analyzing improvements in evidence quality, robustness, and efficiency. The result will be principled training strategies for agentic retrieval systems that optimize how evidence is obtained, not just what answer is produced.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O205",
                "title": "Agentic Query Planning Under Multilingual and Code-Mixed Inputs",
                "description": "This outcome will develop agentic planners that translate noisy, multilingual, and code-mixed student inputs-including ASR/OCR errors and romanized text-into effective tool queries. The planners will reason about language choice, terminology normalization, and symbol expansion before issuing tool calls. Evaluation will measure retrieval success rates, robustness to noise, and stability across dialectal and script variations. This outcome ensures that agentic retrieval remains effective in realistic Indian classroom conditions rather than only in clean text settings.",
                "tags": [],
                "priority": ""
            },
            {
                "id": "O206",
                "title": "Tiny-Model Agent Design for On-Device Tutoring",
                "description": "This outcome will design lightweight agentic systems in which a small on-device model performs planning, decision-making, and tool calling, while heavier retrieval or verification runs on edge servers when connectivity permits. The goal is to maximize tutoring capability under strict compute, memory, and bandwidth constraints. Experiments will quantify task success, latency, and energy usage, and will measure how effective tool use can narrow the performance gap between tiny models and larger cloud-based systems. The result will inform deployable architectures for low-connectivity, low-resource educational environments.",
                "tags": [],
                "priority": ""
            }
        ]
    }
]
  }
];
