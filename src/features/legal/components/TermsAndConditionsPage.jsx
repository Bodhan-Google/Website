import LegalDocumentPage from './LegalDocumentPage';
import { splitDocument } from '../utils/legalMarkdown';
import termsMd from '../data/terms-and-conditions.md?raw';

// The markdown file is the single source of truth for the text. Edit it, not
// this component, to change the Terms.
const { body } = splitDocument(termsMd);

const TermsAndConditionsPage = () => (
    <LegalDocumentPage
        documentTitle="Terms of Use | Bodhan.AI"
        heading={<>Terms of <span className="text-[var(--text-orange-500)]">Use</span></>}
        lede="The terms that govern your use of Bodhak, Bodhan AI's AI tutoring platform, on the web and in the mobile app, whether you are a student, parent or guardian, teacher, or institution."
        articleLabel="Full text"
        bodyMd={body}
        showCopyLink={false}
        noticesEmail="support@bodhan.ai"
    />
);

export default TermsAndConditionsPage;
