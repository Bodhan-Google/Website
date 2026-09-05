import LegalDocumentPage from './LegalDocumentPage';
import { splitDocument } from '../utils/legalMarkdown';
import policyMd from '../data/privacy-policy.md?raw';

// The markdown file is the single source of truth for the text. Edit it, not
// this component, to change the Policy.
const { body } = splitDocument(policyMd);

const PrivacyPolicyPage = () => (
    <LegalDocumentPage
        documentTitle="Privacy Policy | Bodhan.AI"
        heading={<>Privacy <span className="text-[var(--text-orange-500)]">Policy</span></>}
        lede="How Bodhan AI collects, uses, stores and protects personal data across Bodhak, its website and mobile apps, including children's data and parental consent, and the choices available to you."
        articleLabel="Full text"
        bodyMd={body}
        showCopyLink={false}
        noticesLabel="Grievance Officer"
        noticesEmail="grievance@bodhan.ai"
    />
);

export default PrivacyPolicyPage;
