/**
 * The Indic-Translate post.
 *
 * Same shape as the website template's posts.js -- slug, title, category, date,
 * heroLinks, specs, sections -- so this file can be dropped into the real site's
 * posts array later without being rewritten. All prose lives here; components hold
 * no copy of their own beyond UI labels.
 */

// The one figure in this file that is not hand-written prose. The 5/5/5 share is
// generated from the judge run, and it is the headline of the sentence tile, so it is
// interpolated rather than retyped -- a retyped percentage drifts the moment the eval
// is re-run.
import { SENT_JUDGE_PERFECT } from './sentenceJudge.js';

export const post = {
  slug: 'indic-translate',
  // The headline is two lines: the name, then the tagline under it. Keeping them as
  // separate fields means `title` stays the plain product name -- what a card, a list
  // view or a citation wants -- and the colon that joined them is gone, since a colon
  // dangling at the end of a centred line reads as a mistake.
  title: 'Indic-Translate',
  titleTagline: 'Her languages, her scripts.',
  // The half of the model name that takes the house orange in the headline. Kept as
  // data rather than hardcoded in Hero, so the accent moves with the name.
  titleAccent: 'Translate',
  // The partner lockup above the headline, matching the sibling IndicOCR post's hero
  // (`.hero-partners`: mark + name, joined by a multiplication sign).
  partners: [
    { name: 'AI4Bharat', icon: 'ai4bharat' },
    { name: 'Bodhan.AI', icon: 'bodhan' },
  ],
  // The hero eyebrow is the date and nothing else. `category` and `readingTime` are kept
  // in the data -- the template's post schema defines them and a card or list view may
  // want them -- but Hero no longer renders either.
  category: 'Announcement',
  date: '2026-09-05',
  dateLabel: '5 September 2026',
  // Third segment of the hero eyebrow. Measured, not estimated: run
  // `node scripts/reading_time.mjs`, which counts the prose a reader reads top to
  // bottom (headings, body, card bodies, bullets, all four eval tiles' prose),
  // excludes what is looked at rather than read (chart labels and notes, the example
  // browser's own output, spec chips, BibTeX), divides by 220 wpm and adds 8s per
  // chart open in the default view. 1,093 words + 3 charts = 5.37 min.
  readingTime: '5 min read',
  summary:
    'A translation model for English and 22 Indian languages, built to translate whole '
    + 'documents in a single request.',
  heroSummary:
    'A translation model for English and 22 Indian languages, built to translate whole '
    + 'documents, not just sentences, in a single request, preserving the structure around '
    + 'the words.',
  heroLinks: [
    {
      label: 'Hugging Face',
      href: 'https://huggingface.co/bodhan-ai/indic-translate',
      icon: 'huggingface',
    },
    // The repo is private -- an unauthenticated request to either URL gets a 404 -- and
    // needs work before it goes public, so these two are marked coming soon and render as
    // non-interactive chips rather than links a reader would land a 404 on. The URLs are
    // kept here so they are one edit away from going live.
    {
      label: 'GitHub',
      icon: 'github',
      soon: true,
      href: 'https://github.com/AshwinSankar17/bodhan_gen_ai_tools',
    },
    { label: 'Try Out', href: 'https://console.bodhan.ai/ui/login', icon: 'bodhan' },
    {
      label: 'Documentation',
      icon: 'book',
      soon: true,
      href: 'https://github.com/AshwinSankar17/bodhan_gen_ai_tools/blob/master/'
        + 'src/bodhan_genai/mt/README.md',
    },
  ],
  specs: [
    { label: 'base model', value: 'Gemma 4 E4B' },
    { label: 'parameters, effective', value: '4B' },
    { label: 'training tokens', value: '~28.7B' },
    { label: 'languages / scripts', value: '22 / 12' },
    { label: 'token context', value: '32k' },
  ],

  sections: [
    // Step 2 of the house flow: the opening carries no heading, so it reads as the
    // start of the story rather than a numbered section. It is therefore also absent
    // from the table of contents, which is built from headed sections only.
    {
      id: 'motivation',
      title: null,
      content: [
        'Building translation systems for India means going beyond language coverage. It '
        + 'means supporting the many ways people communicate across languages, scripts, and '
        + 'formats, while preserving the structure and context of the original content.',
        'India does not have a single language. Twenty-two languages are included in the '
        + 'Eighth Schedule of the Indian Constitution, written across twelve different '
        + 'scripts, and multilingual communication is woven into everyday life. A government '
        + 'form may be in Hindi, a message may blend English with another language, a textbook '
        + 'may be in Kannada, while a person\u2019s name may exist primarily in the Latin '
        + 'script. Indian languages are also frequently written in Roman script, reflecting '
        + 'how many people actually type.',
        'Translation systems, however, are still largely built around a single sentence. Give '
        + 'them a real document with headings, a table, a code block, or a footnote, and the '
        + 'structure often does not survive the trip. Ask for an Indian language in Latin '
        + 'script, or for text that mixes scripts and languages, and support becomes even '
        + 'more limited.',
        'Indic-Translate was built to address these gaps. One model covers English and all '
        + 'twenty-two languages in both directions, handling a sentence or a 32K-token '
        + 'document in a single request, in native script or Roman script, as well as '
        + 'mixed-script text. At 4B effective parameters, it is small enough to actually '
        + 'serve, and designed for people putting translation into something real: a document '
        + 'pipeline, a support desk, a classroom.',
        'The single model can translate source text, whether a sentence or a full document, '
        + 'across five different capabilities, using a consistent prompt structure.',
      ],
    },

    // Step 3. The constellation is the content here; the coverage claim closes it.
    {
      id: 'coverage',
      title: 'Linguistic coverage',
      component: 'coverage',
      content: [
        'Every language in the Eighth Schedule, in its own script.',
      ],
    },

    // Step 4. The five capabilities, each stated and then demonstrated in place. The
    // `feature` key on each subsection names the example category it pairs with.
    {
      id: 'features',
      title: 'Key Features',
      component: 'features',
      content: [
        // No count here on purpose: Indic to Indic is demonstrated below but no longer
        // carded, so any fixed number would be wrong for one of the two.
        'One model, one prompt shape. The cards below say what each capability does; under '
        + 'them, pick any language and see it on real output.',
      ],
      subsections: [
        {
          tag: '44 directions',
          title: 'Sentence translation',
          feature: 'sentence',
          content: 'English ↔ 22 Indian languages, both directions, evaluated on IN22-Gen.',
        },
        {
          tag: 'up to 32k tokens',
          title: 'Document translation',
          feature: 'document',
          content:
            'A whole document in one request, with headings, lists, tables, LaTeX and code '
            + 'fences keeping their structure across the translation.',
        },
        {
          tag: 'en ↔ Roman',
          title: 'Romanized translation',
          feature: 'romanized',
          content:
            'Translates English straight into Latin-script Indic text, for users who don’t '
            + 'type in their own script.',
        },
        {
          tag: 'native ↔ Roman',
          title: 'Transliteration',
          feature: 'transliteration',
          content:
            'Converts between a language’s native script and its Roman rendering, both '
            + 'directions, without changing the words.',
        },
        {
          tag: 'code-mix ↔ en',
          title: 'Code-mixed translation',
          feature: 'codemix',
          content:
            'Handles text that mixes English and an Indic language in the same sentence, the '
            + 'way people actually type.',
        },
      ],
    },

    // Step 5. Architecture and training data as one section.
    {
      id: 'under-the-hood',
      title: 'Under the Hood',
      content: [
        'Indic-Translate is a translation-specialised fine-tune of the Gemma 4 E4B IT model, '
        + 'focused on a simple task: given an instruction and a piece of source text, produce '
        + 'the translation.',
        'The same model is trained to handle sentence translation, document translation, '
        + 'Romanized text, transliteration, and code-mixed input.',
      ],
      subsections: [
        {
          // One subsection, not two. The material that briefly sat under a "Training
          // process" heading was all about how the MIX was built -- filtering and
          // sampling -- so it belongs here and the heading is gone.
          title: 'Training data',
          paragraphs: [
            'Roughly **28.7 billion tokens** from several sources. The largest share is '
            + 'parallel translation data: mined and cleaned bitext, along with a broad '
            + 'sentence-translation corpus covering news, conversational, idiomatic, and '
            + 'encyclopedic text. Sentence pairs and long documents make up the large majority '
            + 'of the mix; romanization, transliteration, and code-mixed data were added to '
            + 'support the newer capabilities without changing the core translation share.',
            'We used temperature-based sampling for the sentence-translation data to keep the '
            + 'training mix balanced, so that high-resource language pairs do not dominate the '
            + 'training process.',
            'For longer inputs, we built a dedicated document corpus focused on preserving the '
            + 'structure of the original document. It includes LaTeX, Markdown, tables, and '
            + 'code across scientific, technical, and encyclopedic documents. Translation data '
            + 'makes up the majority of the training mix by design.',
            'We also built a dedicated Romanization and transliteration corpus from scratch. It '
            + 'was created from a stratified sample of the translation data and then filtered '
            + 'extensively for quality.',
            'Finally, a smaller code-mixed corpus was created in a similar way. It contains '
            + 'examples where English and an Indic language are mixed within the same sentence, '
            + 'reflecting how people commonly type when they switch between languages or do not '
            + 'use an Indic keyboard.',
            'Quality control was an important part of building this mix, not just the amount '
            + 'of data. We filter the data to maintain high quality across datasets.',
          ],
        },
      ],
    },

    // Step 6.
    {
      id: 'evaluation',
      title: 'Evaluation',
      component: 'results',
      content: ['Full evaluation detail behind the examples above, one category at a time.'],
      tiles: [
        {
          id: 'document',
          label: 'Document Evals',
          sub: 'dBLEU · WER · LLM Judge',
          heading: 'Document translation',
          content: [
            'The model is trained with a 32K context window, allowing it to translate a wide '
            + 'variety of documents between English and all 22 Indian languages. It can handle '
            + 'complex documents such as LaTeX files, code files, and web pages in a single turn.',
            'We evaluate the model on an in-house test dataset spanning a diverse range of '
            + 'document types and writing styles. On this evaluation, the model outperforms '
            + 'Sarvam Translate and IndicTrans2 on both metrics across all 22 languages, rather '
            + 'than leading only on the average score.',
          ],
          charts: ['doc-dbleu', 'doc-wer', 'doc-judge-mean'],
          // The per-dimension breakdown is detail behind the mean, so it sits in a
          // closed disclosure -- the summary carries its title and the chart inside
          // is only rendered once opened, so its SVG measures a laid-out container.
          collapsedCharts: ['doc-judge-dims'],
          // Charts removed: the only human-eval data on hand is from an earlier
          // (pre-romanization) checkpoint, so the section states the standing of the
          // current run instead of plotting a superseded one. The configs are still
          // in charts.js ('doc-human-*') if the numbers are ever to be shown again.
          humanEval: {
            heading: 'Human evaluation',
            note: 'Human evaluation for the current release is currently in progress; the '
              + 'trend is the same.',
          },
        },
        {
          id: 'sentence',
          label: 'Sentence Evals',
          sub: 'IN22-Gen · chrF++ · LLM Judge',
          heading: 'Sentence translation',
          content: [
            'Leading on documents did not come at the cost of sentence translation. We '
            + 'evaluate on IN22-Gen across all 22 languages using chrF++ with no sampling, '
            + 'reporting both the macro average and per-language scores.',
            // The 5/5/5 share is the headline, so it stays in the running prose. The
            // per-dimension averages behind it are detail, and sit in the closed
            // 'sent-judge-dims' disclosure below.
            'We also used frontier LLM Judges to rate each English → Indic sentence out '
            + 'of 5 for '
            + `adequacy, fluency and overall quality. **${SENT_JUDGE_PERFECT.pct}% of `
            + 'sentences scored a perfect 5 out of 5 on all three dimensions at once**, and '
            + 'the averages on each dimension sit close enough to the ceiling that the '
            + 'remaining headroom at sentence level is small.',
          ],
          charts: ['sent-rank-en2xx', 'sent-rank-xx2en'],
          collapsedCharts: ['sent-judge-dims', 'sent-heat-en2xx', 'sent-heat-xx2en'],
          // As above -- 'sent-human-*' remain in charts.js, unreferenced.
          humanEval: {
            heading: 'Human evaluation',
            note: 'Human evaluation for the current release is currently in progress; the '
              + 'trend is the same.',
          },
        },
        {
          id: 'roman',
          label: 'Romanized Translation',
          sub: 'chrF++ by direction',
          heading: 'Romanized translation',
          content: [
            'The model supports translation not only into native Indic scripts, but also into '
            + 'their Romanized forms. It can translate both to and from Romanized Indic text, '
            + 'in addition to the native scripts.',
            'This is a distinct capability of the model, allowing users to work with Indic '
            + 'languages even when they prefer to read or write them using the Latin script.',
          ],
          subViews: [
            {
              id: 'sentence',
              label: 'Sentence',
              charts: ['roman-sentence'],
              note:
                'LLM Judge evaluation of romanized and code-mixed output is currently '
                + 'running. Results will be added when it completes.',
            },
            { id: 'document', label: 'Document', charts: ['roman-document'] },
          ],
        },
        {
          id: 'translit',
          label: 'Transliteration',
          sub: 'CER · WER',
          heading: 'Transliteration',
          content: [
            'The model can also transliterate between an Indic language’s native script and '
            + 'its Roman representation, preserving the words themselves rather than '
            + 'translating their meaning.',
            'This is useful when someone wants to type an Indic language using a Latin '
            + 'keyboard or read Indic text in Roman script.',
          ],
          charts: ['translit-cer', 'translit-wer', 'translit-chrf'],
        },
      ],
    },

    // Step 7.
    {
      id: 'future-work',
      // The id stays 'future-work' -- it is the anchor and the TOC key, and renaming it
      // would break any link already pointing at #future-work.
      title: 'What\u2019s Next',
      bullets: [
        '**Direct Indic → Indic translation.** Indic-Translate currently supports English '
        + 'and all twenty-two languages in both directions. Translation between two Indian '
        + 'languages still goes through English. A Tamil sentence translated to Bengali, for '
        + 'example, is effectively handled as Tamil → English → Bengali.',
        '**Better sentence-level English → Indic translation.** At the sentence level, the '
        + 'model is currently stronger when translating into English than from English into '
        + 'an Indian language. We are continuing to improve English → Indic translation at '
        + 'the sentence level, with a focus on making the output more fluent and natural '
        + 'while preserving the meaning of the original.',
        '**Multiturn conversational translation (ConvMT).** Translation does not always end '
        + 'with the first output. We are building a conversational interface where users can '
        + 'interact with the translation across multiple turns, ask for changes, and '
        + 'post-edit the output.',
      ],
    },

    // Step 9, added after the house flow's eight: the ask. It closes the article column,
    // so it sits above the full-bleed ecosystem banner rather than inside it.
    {
      id: 'invitation',
      title: 'An Invitation',
      content: [
        'We built Indic-Translate to be used in real applications, workflows, and research. '
        + 'We invite you to try the models on your own data, build with them, and explore '
        + 'what they can do across different languages, scripts, and formats.',
        'We also want to hear where they fall short. Bug reports, difficult examples, and '
        + 'feedback from real use cases help us understand what to improve and where new '
        + 'capabilities are needed.',
        // Written as a link so it is clickable; the visible text is the full URL, exactly
        // as given. bodhan.ai/contact answers 404 to a direct fetch but serves the app
        // shell, so the site's own client routing renders it in a browser.
        'There is still a lot to build, and we would love to build it with the community. '
        + 'Try the models, build something with them, and get in touch with us at '
        + '[https://bodhan.ai/contact](https://bodhan.ai/contact).',
      ],
    },
  ],
};

// Year comes from the model card at huggingface.co/bodhan-ai/indic-translate (its
// "License and citation" section); the URL points at this post's own home on the site
// rather than the model card. Two further fields deliberately diverge from that card:
// the author is the organisation rather than the card's named list, and the title/key
// drop the "V4" the card still carries -- the public name of this release is
// "Indic-Translate", which is what every other string in this post already says.
export const citation = {
  heading: 'Cite this work',
  bibtex: `@misc{indic-translate-2026,
  title  = {Indic-Translate: Document-Level Machine Translation for 22 Indian Languages},
  author = {Bodhan.ai},
  year   = {2026},
  url    = {https://bodhan.ai/research/blogs/indic-translate}
}`,
};

// Step 8. Dummy links for now -- no logo assets exist for these platforms, so they are
// wordmark chips rather than image bubbles.
export const ecosystem = {
  heading: 'Available across India\u2019s AI ecosystem',
  links: [
    // Bhashini is not live yet, so it renders inert with a "coming soon" badge rather
    // than as a link to nowhere.
    //
    // AIKosh is live and now carries a mark. Its own CDN could not supply one -- every
    // asset path on aikosh.indiaai.gov.in answers 200 with the SPA's index.html and
    // `x-cache: Error from cloudfront` -- so the file came from the user; see BrandMark.jsx
    // for what it is and why it is worth replacing.
    { label: 'Bhashini', soon: true, icon: 'bhashini' },
    {
      label: 'AIKosh',
      href: 'https://aikosh.indiaai.gov.in/web/models/details/indic_translate.html',
      icon: 'aikosh',
    },
    { label: 'Bodhan', href: 'https://console.bodhan.ai/ui/login', icon: 'bodhan' },
    {
      label: 'Hugging Face',
      href: 'https://huggingface.co/bodhan-ai/indic-translate',
      icon: 'huggingface',
    },
  ],
};

export const footer = {
  line: 'Indic-Translate · Bodhan AI',
  copyright: '© 2026 Bodhan AI. All rights reserved.',
};
