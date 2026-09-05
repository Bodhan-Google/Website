import LegalDocumentPage from './LegalDocumentPage';
import { splitDocument } from '../utils/legalMarkdown';
import termsMd from '../data/api-terms-of-use.md?raw';

// The markdown file is the single source of truth for the legal text. To publish
// a revision, replace the .md; the "Last updated" line is read from it.
const { metaLine, body } = splitDocument(termsMd);
const NOTICES_EMAIL = 'support@bodhan.ai';

const ApiTermsPage = () => (
    <LegalDocumentPage
        documentTitle="API Terms of Use | Bodhan.AI"
        heading={<>Terms of Use <span className="text-[var(--text-orange-500)]">API Services</span></>}
        lede="The agreement between IITM Bodhan-AI Foundation and anyone who registers for or uses the Bodhan API, SDKs, documentation, playground or related services. It covers the licence you receive, prepaid quota billing, acceptable use, what happens to your inputs and outputs, and how disputes are resolved."
        metaLine={metaLine}
        articleLabel={`Full text · ${metaLine || 'Current version'}`}
        bodyMd={body}
        showCopyLink={false}
        noticesEmail={NOTICES_EMAIL}
    />
);

export default ApiTermsPage;
