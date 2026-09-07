import { AlignLeft, ArrowLeftRight, Blend, FileCode2, FileText, Sigma, Table2, Type } from 'lucide-react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import ExamplesBrowser from '../../../research/indic-translate-post/components/ExamplesBrowser';
import DevReveal from '../DevReveal';
import SHOWCASE from '../../data/translateShowcase.json';
import { LICENSE, getModelById } from '../../data/models';
import 'katex/dist/katex.min.css';
import '../../../research/indic-translate-post/post.css';
import '../../developers.css';

const model = getModelById('indic-translate');

const STATS = [
    { value: '22', label: 'Languages + English' },
    { value: '44', label: 'Directions' },
    { value: '32K', label: 'Token context' },
    { value: '7.94B', label: 'Parameters' },
];

const FORM_ICONS = {
    sentence: AlignLeft,
    document: FileText,
    romanized: Type,
    codemix: Blend,
    transliteration: ArrowLeftRight,
};

const SUB_ICONS = {
    markdown: FileText,
    latex: Sigma,
    code: FileCode2,
    tables: Table2,
    selective: Blend,
};

const { forms } = SHOWCASE;

// Rail order. Document goes last: it is the one entry that brings its own row
// of sub-tabs and the longest panes, so opening the playground on it led with
// the heaviest example. Ranked rather than listed, so a form the showcase gains
// later still appears — it just lands before Document rather than dropping out.
const FORM_RANK = { sentence: 0, romanized: 1, codemix: 2, transliteration: 3, document: 9 };
const ordered = [...forms].sort((a, b) => (FORM_RANK[a.id] ?? 5) - (FORM_RANK[b.id] ?? 5));

// Five capabilities, as the blog groups them. Document carries the five
// structures as tabs rather than five separate rail entries.
const items = ordered.map((f) => {
    const Icon = FORM_ICONS[f.id] ?? FileText;
    return {
        id: f.id,
        badge: <Icon size={16} aria-hidden="true" />,
        name: f.form,
        sublabel: f.subs ? 'Markdown, LaTeX, code, tables' : f.lang.name,
        tabs: f.subs?.map((s) => {
            const SubIcon = SUB_ICONS[s.id] ?? FileText;
            return { id: s.id, label: s.form, icon: <SubIcon size={13} aria-hidden="true" /> };
        }),
    };
});

const paneFor = (f) => {
    const nativeDir = f.lang.rtl ? 'rtl' : undefined;
    return {
        sourceLabel: f.sourceLabel,
        sourceText: f.source,
        sourceLang: f.sourceIsNative ? f.lang.tag : 'en',
        sourceDir: f.sourceIsNative ? nativeDir : undefined,
        outputLabel: f.outputLabel,
        outputText: f.output,
        outputLang: f.outputIsLatin ? 'en' : f.lang.tag,
        outputDir: f.outputIsLatin ? undefined : nativeDir,
        markdown: f.markdown,
        alt: f.alt ? { ...f.alt, lang: f.lang.tag, dir: nativeDir } : null,
    };
};

const renderPane = (item, tabId) => {
    const f = forms.find((x) => x.id === item.id);
    if (!f.subs) return paneFor(f);
    return paneFor(f.subs.find((s) => s.id === tabId) ?? f.subs[0]);
};

const IndicTranslatePage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main
            className="model-page-main"
            style={{ '--model-accent': model.accent, '--model-gradient': model.gradient }}
        >
            <ModelHero
                title={model.name}
                intro="translate"
                tagline="English and all 22 Eighth Schedule languages, in both directions — with Markdown, LaTeX, code and tables coming out the way they went in."
                accent={model.accent}
                viz={model.viz}
                stats={STATS}
                primaryCta={model.docs}
                blogCta={model.blog}
                thirdCta={{ label: 'Hugging Face', href: model.hf }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
                license={LICENSE}
            />

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Examples by language</h2>
                <p className="model-section-dek">
                    The announcement's own browser: 22 languages across six capabilities, each
                    showing that language's own top-scoring output.
                </p>
                {/* The component's styles are scoped to `.mt-post` in the post's
                    stylesheet, so it needs that class to look like itself. */}
                <div className="mt-post">
                    <ExamplesBrowser />
                </div>
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicTranslatePage;
