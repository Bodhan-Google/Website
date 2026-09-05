import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, KeyRound, Scale } from 'lucide-react';
import LegalDocumentPage from '../../legal/components/LegalDocumentPage';
import { splitDocument } from '../../legal/utils/legalMarkdown';
import licenseMd from '../data/indic-open-model-license-v1.md?raw';

// The markdown file is the single source of truth for the legal text. To publish
// a new revision, replace the .md, bump VERSION_LABEL and point PDF_DRIVE_ID at
// the new file.
const VERSION_LABEL = 'Version 1.0';
const NOTICES_EMAIL = 'support@bodhan.ai';

// The PDF lives on Google Drive, like the tender documents: one link to
// download it directly, one shareable view link for "Copy link".
const PDF_DRIVE_ID = '1yLL3ZtIMKkBnzNlbk--ujXawRLXBxd-W';
const PDF_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${PDF_DRIVE_ID}`;
const PDF_SHARE_URL = `https://drive.google.com/file/d/${PDF_DRIVE_ID}/view?usp=sharing`;

const { metaLine: COPYRIGHT_LINE, body: BODY_MD } = splitDocument(licenseMd);

// Non-binding orientation for readers, drawn from the Preamble and the sections
// it points to. Every line names the section that actually governs.
const AT_A_GLANCE = [
    {
        icon: ShieldCheck,
        tone: 'ok',
        title: 'You can',
        items: [
            'Use, copy, modify, fine-tune and self-host the models in your own products, commercially or not, at any scale, royalty-free. §1, §7',
            'Keep fine-tunes and other Derivatives private for Internal Use with no obligations. §7',
            'Share Derivatives, as long as they carry this same License. §5',
            'Credit the model: "Built with [Model Name] from Bodhan AI / AI4Bharat" wherever it is made available to others. §2',
        ],
    },
    {
        icon: KeyRound,
        tone: 'warn',
        title: 'Needs written approval',
        items: [
            'Hosting: giving a Third Party direct API or hosted access to run or fine-tune the model. §3',
            'Waived if you publicly release the hosted Derivative under this License within 90 days and keep it current. §4',
            'Not required for Internal Use or for Eligible Public-Interest Entities. §3.3, §13',
            'Your own product above 500M monthly active users or US$250M annual revenue needs a separate license. §14',
        ],
    },
    {
        icon: ShieldAlert,
        tone: 'no',
        title: 'Never',
        items: [
            'Child sexual abuse material, weapons development, mass surveillance or social scoring, disinformation. §10',
            'Non-consensual voice or likeness impersonation, robocalls and vishing, exclusive-relationship AI companions. §10',
            'Remove attribution, claim IP over the models, or circumvent safety and watermarking measures. §2.5, §8',
        ],
    },
];

const TONE = {
    ok: { ring: 'border-emerald-200', bg: 'bg-emerald-50', icon: 'text-emerald-600' },
    warn: { ring: 'border-amber-200', bg: 'bg-amber-50', icon: 'text-amber-600' },
    no: { ring: 'border-red-200', bg: 'bg-red-50', icon: 'text-red-600' },
};

const AtAGlance = () => (
    <motion.section
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.15 }}
        aria-labelledby="glance-title"
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-7"
    >
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h2 id="glance-title" className="text-base md:text-lg font-semibold text-[#1A1A1A]">At a glance</h2>
            <p className="text-xs text-gray-500">A convenience summary. It is not part of the License; the text below governs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
            {AT_A_GLANCE.map(({ icon: Icon, tone, title, items }) => (
                <div key={title} className={`rounded-xl border ${TONE[tone].ring} ${TONE[tone].bg} p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Icon size={16} className={TONE[tone].icon} />
                        <h3 className="text-sm font-semibold text-[#1A1A1A]">{title}</h3>
                    </div>
                    <ul className="space-y-2">
                        {items.map((it) => (
                            <li key={it} className="text-[13px] leading-relaxed text-gray-700">{it}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </motion.section>
);

const IndicOpenModelLicensePage = () => (
    <LegalDocumentPage
        documentTitle={`Indic Open Model License ${VERSION_LABEL} | Bodhan.AI`}
        heading={<>Indic Open Model <span className="text-[var(--text-orange-500)]">License 1.0</span></>}
        lede="The terms under which Bodhan AI releases its open-weight models for Indian languages: speech recognition, OCR, text-to-speech, translation and transliteration. Broad, no-cost use for research, government, nonprofit and commercial work, with one main restriction on hosting the models for others."
        metaLine={COPYRIGHT_LINE}
        articleLabel={`Full text · ${VERSION_LABEL}`}
        bodyMd={BODY_MD}
        download={{ href: PDF_DOWNLOAD_URL, label: 'Download PDF' }}
        copyText={PDF_SHARE_URL}
        footnote={<><Scale size={13} /> Governed by the laws of India · Arbitration seated in Chennai</>}
        noticesEmail={NOTICES_EMAIL}
        panel={<AtAGlance />}
    />
);

export default IndicOpenModelLicensePage;
