import { useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';

const sections = [
    {
        heading: '1. Introduction',
        paragraphs: [
            'IITM BODHAN-AI FOUNDATION, a company registered under Section 8 of the Companies Act, 2013, having its registered office at IIT Madras Research park, E1-14, 1st Floor, Kanagam Rd, Taramani, Chennai-600113, Tamil Nadu (“Bodhan AI”, “we”, “us”, or “our”), operates the AI tutoring chatbot application Bodhak, including its associated website(s) and mobile application(s) (collectively, the “Service” or “Platform”).',
            'This Privacy Policy explains how we collect, use, disclose, store, and protect personal data of users of the Service (“you” or “User”), and the choices available to you regarding that data. It applies to students (including children), parents/guardians, teachers and other educators, institutional users (schools/coaching centres), and any other individual who accesses or uses the Service, whether via our website or our mobile application.',
            'This Policy is framed with reference to the Information Technology Act, 2000 and rules made thereunder (including the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011), and the Digital Personal Data Protection Act, 2023, together with such rules as may be notified from time to time. By accessing or using the Service, you consent to the practices described in this Policy.',
        ],
    },
    {
        heading: '2. Definitions',
        list: [
            '“Personal Data” means any data about an individual who is identifiable by or in relation to such data.',
            '“Sensitive Personal Data” includes academic performance data, health information (where disclosed), financial information, and Government ID Data (defined below).',
            '“Child” / “Minor” means an individual below the age of 18 years, as defined under the DPDP Act.',
            '“Teacher User” means an educator, tutor, or school staff member who registers on or is provisioned access to the Service to deliver instruction, use AI-literacy training content, or view student progress.',
            '“Institutional User” means a school, coaching centre, or other educational institution that onboards students and/or Teacher Users onto the Service, whether directly or under a separate institutional agreement with Bodhan AI.',
            '“Digital Public Infrastructure” or “DPI” means government-operated or government-endorsed digital education infrastructure, including (without limitation) the National Digital Education Architecture (NDEAR), the Automated Permanent Academic Account Registry (APAAR), the Academic Bank of Credits (ABC), and DigiLocker/National Academic Depository.',
            '“Government ID Data” means an APAAR ID, Aadhaar number or Aadhaar-linked authentication token, or any other government-issued identifier processed through the Service.',
            '“Data Fiduciary” means Bodhan AI, which determines the purpose and means of processing Personal Data.',
            '“Data Principal” means the individual to whom the Personal Data relates (i.e., the User, or, for a child, the child whose parent/guardian provides consent).',
            '“Processing” means any operation performed on Personal Data, including collection, storage, use, disclosure, and deletion.',
        ],
    },
    {
        heading: '3. Information We Collect',
        subsections: [
            {
                subheading: '3.1 Information You Provide to Us',
                list: [
                    'Account and profile information: name, email address, phone number, date of birth, grade/class, school/institution name, and password/authentication credentials.',
                    'Parent/guardian information (for accounts belonging to minors): name, email, phone number, and consent records.',
                    'Teacher User information: name, email, phone number, subject(s) taught, school affiliation, and professional role.',
                    'Content you submit: questions, answers, chat inputs, essays, voice notes, or other material submitted to or generated through interactions with the tutor bot (“Practice Session Content”).',
                    'Simulations created by Teacher Users, and peer review/voting data associated with such Simulations (see our Terms of Use for ownership terms).',
                    'Payment information (if applicable): billing name, address, and transaction details processed via our third-party payment gateway. We do not directly store full card or bank account details.',
                    'Communications: information you provide when you contact support, respond to surveys, or provide feedback.',
                ],
            },
            {
                subheading: '3.2 Information Collected Automatically',
                list: [
                    'Usage data: pages/screens visited, features used, session duration, learning progress, quiz/test scores, and Practice Session interaction patterns with the tutor bot.',
                    'Device and technical data: IP address, device identifiers, browser type, operating system, and mobile network information.',
                    'Mobile-specific data (where the Service is accessed via our mobile application): device permissions you grant (e.g., microphone, camera, storage), push-notification tokens, app version, and crash/diagnostic logs. See Section 11 for details.',
                    'Cookies and similar technologies: as described in Section 13 below.',
                ],
            },
            {
                subheading: '3.3 Information from Third Parties',
                list: [
                    'Where the Service is accessed through or integrated with a school/institution, we may receive enrolment, class, or Teacher User information from that institution.',
                    'Where you sign in using a third-party account (e.g., Google Sign-In), we may receive basic profile information as permitted by your settings on that third-party platform.',
                ],
            },
            {
                subheading: '3.4 Information Received via Government Digital Public Infrastructure (DPI)',
                paragraphs: [
                    'Where Bodhan AI integrates with government DPI (see Section 10), we may receive Government ID Data and associated academic records directly from such infrastructure, subject to the consent and authentication mechanisms mandated by the relevant government system.',
                ],
            },
        ],
    },
    {
        heading: '4. How We Use Your Information',
        paragraphs: [
            'We process Personal Data for the following purposes, each grounded in your consent, a legitimate use recognised under applicable law, or performance of our service to you:',
        ],
        list: [
            'To create and manage your account and authenticate access to the Service.',
            'To provide, personalise, and improve the AI tutoring experience, including adapting content and difficulty to a learner’s progress.',
            'To generate performance analytics, progress reports, and recommendations for students, parents, Teacher Users, and (where applicable) Institutional Users.',
            'To deliver AI-literacy training content and resources to Teacher Users.',
            'To operate, maintain, and troubleshoot the Service, including detecting and preventing fraud, abuse, or security incidents.',
            'To communicate with you, including service updates, support responses, and (where consented to) promotional communications, including via mobile push notifications.',
            'To comply with applicable law, regulatory requirements, or lawful requests from public authorities, including verification requirements under government DPI.',
            'To conduct internal research and analytics aimed at improving educational outcomes, in aggregated or de-identified form wherever feasible.',
        ],
    },
    {
        heading: '5. Use of Artificial Intelligence',
        paragraphs: [
            'The Service uses AI/machine-learning models (including large language models, which may be provided by us or by third-party AI providers) to power tutoring interactions, generate responses, and assess learner input. You should be aware that:',
        ],
        list: [
            'AI-generated responses may occasionally be inaccurate or incomplete and should not be treated as a substitute for a qualified teacher’s judgment.',
            'Inputs you submit to the tutor bot may be processed by third-party AI model providers under contractual confidentiality and data-processing terms; we do not permit such providers to use your data to train their general-purpose models, except as disclosed in Section 6.',
            'We may use anonymised or aggregated interaction data to improve the accuracy and safety of our own AI systems.',
        ],
        trailingParagraphs: [
            'Use of Voice, Text, Image, and File Data to Develop Our Own Models: We do not use a User’s voice recordings, text prompts, images, or uploaded files to develop, train, or improve Bodhan AI’s own AI/ML models (“Model Training”) unless that User (or, for a child, their parent/guardian) has given specific, informed, affirmative consent to Model Training, separate from general consent to this Policy. This consent can be withdrawn at any time by writing to us at the details in Section 18; withdrawal stops future use of that User’s data for Model Training but does not require deletion of a model already trained using data submitted before withdrawal, except as separately required by law or requested under Section 14. Where feasible, we use such data in de-identified or aggregated form for Model Training and do not use it to build an individual profile of a child.',
        ],
    },
    {
        heading: '6. Sharing and Disclosure of Information',
        paragraphs: [
            'We do not sell Personal Data. We may share Personal Data only in the following circumstances:',
        ],
        list: [
            'With service providers and processors who support our operations (e.g., cloud hosting, AI model providers, analytics, customer support, payment processing), under contractual obligations of confidentiality and security.',
            'With educational institutions, Teacher Users, or parents/guardians linked to a student’s account, to the extent necessary to provide progress reports and enable oversight of a minor’s learning, as described in Section 8.',
            'With government DPI systems, where the Service is integrated with such infrastructure and subject to the safeguards in Section 10.',
            'Where required by law, regulation, court order, or governmental/regulatory authority.',
            'In connection with a merger, acquisition, restructuring, or sale of assets, subject to equivalent privacy protections.',
            'With your explicit consent, for any purpose not covered above.',
        ],
    },
    {
        heading: '7. Children’s Data and Parental Consent',
        paragraphs: [
            'Given the nature of the Service, a significant portion of Users may be children. In accordance with the DPDP Act:',
        ],
        list: [
            'Where a User is identified as a child, we will obtain verifiable consent from the parent or lawful guardian before processing the child’s Personal Data.',
            'We will not undertake tracking or behavioural monitoring of children, or targeted advertising directed at children, except as may be permitted under applicable law.',
            'Parents/guardians may review, correct, or request deletion of their child’s Personal Data by contacting us using the details in Section 18.',
            'Institutional Users providing student data to enable classroom use of the Service are responsible for obtaining any consents required under their own policies, in addition to consents obtained by us where we interact directly with parents/guardians.',
        ],
    },
    {
        heading: '8. Access to a Child’s Practice Sessions',
        paragraphs: [
            'The Service allows a child’s Practice Session Content (chat transcripts, answers, progress, and performance data) to be viewed by certain adults connected to that child’s account, as follows:',
        ],
        list: [
            'Parent/Guardian access: a linked parent or guardian account may view a summary of, or the underlying transcript for, a child’s Practice Sessions and progress reports.',
            'Teacher User access: where a child is enrolled through an Institutional User, the child’s assigned Teacher User(s) may view Practice Session summaries and performance analytics relevant to their subject/class, but not necessarily full chat transcripts unless enabled by the Institutional User’s configuration.',
            'Institutional/administrator access: designated school administrators may access aggregated or individual student performance data as authorised by the Institutional User.',
            'Notice to children: Where a child’s Practice Sessions are visible to a parent, Teacher User, or Institutional User, we will make this visible/disclosed within the Service interface itself, so that the child is aware their sessions may be reviewed by an adult, rather than relying on an assumption of privacy.',
        ],
        trailingParagraphs: [
            'We maintain access controls and, where feasible, audit logs identifying which adult account viewed a given child’s Practice Session data and when.',
            'A parent/guardian or Institutional User may request that access privileges for a specific Teacher User be modified or revoked by contacting us or their institution’s administrator.',
        ],
    },
    {
        heading: '9. Teacher and Educator Users',
        paragraphs: [
            'Where the Service offers AI-literacy training, resources, or dashboards specifically for teachers and educators (“Teacher Modules”), the following additional terms apply to Teacher Users:',
        ],
        list: [
            'We process Teacher User account and professional information to provision access to Teacher Modules, generate class-level analytics, and (where applicable) issue training completion records or certificates.',
            'Teacher User activity within Teacher Modules (e.g., course progress, assessment scores) may be shared with the Institutional User that provisioned the Teacher User’s access, for professional-development record-keeping.',
            'Teacher Users are independently responsible for complying with their employer institution’s own data-handling and confidentiality policies when using the Service to view student data.',
        ],
    },
    {
        heading: '10. Interoperability with Government Digital Public Infrastructure (DPI)',
        paragraphs: [
            'Where the Service is integrated with government education DPI — including APAAR, NDEAR, the Academic Bank of Credits, or DigiLocker — the following additional safeguards apply:',
        ],
        list: [
            'Government ID Data (such as an APAAR ID or Aadhaar-linked identifier) will be collected, used, or shared with a DPI system only with explicit, separate consent, over and above general consent to this Policy, and only to the extent permitted under the governing framework for that DPI system.',
            'Where Aadhaar-based authentication is involved, such processing is additionally governed by the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016 and rules/regulations issued by the Unique Identification Authority of India (UIDAI); we will process Aadhaar data strictly within the bounds permitted by that framework.',
            'We will disclose, prior to any DPI-linked data exchange, what data is being transmitted, to which government system, and for what stated purpose (e.g., academic-record verification, credit transfer under the Academic Bank of Credits).',
            'Data received from or transmitted to DPI systems is subject to the same security, retention, and access-control principles described elsewhere in this Policy, in addition to any technical standards mandated by the relevant DPI framework.',
            'You (or, for a child, the parent/guardian) may decline DPI-linked features; where declined, the Service will continue to function using Bodhan AI’s own account and identity system, unless a specific feature is inherently dependent on DPI integration.',
        ],
    },
    {
        heading: '11. Mobile Application-Specific Data',
        paragraphs: [
            'Where you access the Service through our mobile application, the following apply in addition to Sections 3–10 above:',
        ],
        list: [
            'We request device permissions (e.g., microphone for voice-based tutoring, camera for scanning worksheets, storage) only where needed for a specific feature, and only after your (or a parent/guardian’s) explicit in-app consent; permissions can be withdrawn at any time via device settings.',
            'We may send push notifications relating to learning reminders, progress updates, or service announcements; these can be disabled in the app or device settings.',
            'Our mobile application is distributed via the Google Play Store and/or Apple App Store, and your download and use is additionally subject to the respective platform’s terms and privacy practices, which are separate from and in addition to this Policy.',
        ],
    },
    {
        heading: '12. Data Storage, Security, and Retention',
        paragraphs: [
            'We implement reasonable technical and organisational security practices and procedures, including encryption in transit, access controls, and periodic security reviews, commensurate with the sensitivity of the data involved and in line with applicable Indian data-security standards.',
            'We retain Personal Data only for as long as necessary to fulfil the purposes described in this Policy, to comply with legal, accounting, or reporting obligations, or as otherwise permitted/required by law. Learning records of students may be retained for the duration of enrolment with the Platform and for a reasonable period thereafter for academic continuity, unless deletion is requested earlier and no legal ground requires retention.',
        ],
    },
    {
        heading: '13. Cookies and Tracking Technologies',
        paragraphs: [
            'We use cookies, local storage, and similar technologies to enable core functionality, remember preferences, and understand usage patterns. You can control cookies through your browser or device settings; disabling certain cookies may affect functionality of the Service.',
        ],
    },
    {
        heading: '14. Your Rights',
        paragraphs: [
            'Subject to applicable law, you (or, for a child, the parent/guardian) may:',
        ],
        list: [
            'Request access to, and a summary of, the Personal Data we hold about you.',
            'Request correction or updating of inaccurate or incomplete Personal Data.',
            'Request erasure of Personal Data, subject to our legal or legitimate retention needs.',
            'Withdraw consent at any time, without affecting the lawfulness of processing carried out before withdrawal (withdrawal may limit or end your ability to use the Service, including DPI-linked features).',
            'Nominate another individual to exercise these rights on your behalf in the event of death or incapacity, as permitted under the DPDP Act.',
            'Register a complaint with us, and if unresolved, with the Data Protection Board of India or other competent authority.',
        ],
        trailingParagraphs: [
            'Requests can be made through the contact details in Section 18 and will be addressed within the timelines prescribed under applicable law.',
        ],
    },
    {
        heading: '15. Data Transfers',
        paragraphs: [
            'Personal Data is primarily stored and processed on servers located in India. Where any processing involves a cross-border transfer (for example, via a third-party AI or cloud provider with servers outside India), such transfer will be carried out in accordance with the DPDP Act and any restrictions notified by the Central Government.',
        ],
    },
    {
        heading: '16. Third-Party Links and Services',
        paragraphs: [
            'The Service may contain links to third-party websites or integrate third-party tools (e.g., payment gateways, video-conferencing tools). This Policy does not apply to such third parties, and we encourage you to review their respective privacy policies.',
        ],
    },
    {
        heading: '17. Grievance Officer',
        paragraphs: [
            'In accordance with the Information Technology Act, 2000 and rules made thereunder, and applicable data protection law, the Grievance Officer / Data Protection Officer for the Service is:',
        ],
        list: [
            'Name: Grievance Officer',
            'Email: grievance@bodhan.ai',
            'Address: IIT Madras Research Park, E1-14, 1st Floor, Kanagam Rd, Taramani, Chennai–600113',
        ],
        trailingParagraphs: [
            'Complaints and grievances will be acknowledged and addressed within the timelines prescribed under applicable law.',
        ],
    },
    {
        heading: '18. Contact Us',
        paragraphs: [
            'For any questions about this Privacy Policy or our data practices, please contact us at:',
            'support@bodhan.ai',
        ],
    },
    {
        heading: '19. Changes to This Policy',
        paragraphs: [
            'We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. We will notify Users of material changes through the Service or via email. Continued use of the Service after such changes constitutes acceptance of the revised Policy.',
        ],
    },
    {
        heading: '20. Governing Law',
        paragraphs: [
            'This Policy is governed by the laws of India. Any disputes arising in connection with this Policy shall be subject to the exclusive jurisdiction of the courts at Chennai, India.',
        ],
    },
];

const EMAIL_REGEX = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

const linkifyEmails = (text) =>
    typeof text === 'string'
        ? text.split(EMAIL_REGEX).map((part, i) =>
              i % 2 === 1 ? (
                  <a
                      key={i}
                      href={`mailto:${part}`}
                      className="text-[var(--text-orange-500)] hover:underline"
                  >
                      {part}
                  </a>
              ) : (
                  part
              )
          )
        : text;

const Paragraphs = ({ items }) =>
    items.map((text, i) => (
        <p key={i} className="text-gray-600 text-base leading-relaxed mb-4 last:mb-0">
            {linkifyEmails(text)}
        </p>
    ));

const List = ({ items }) => (
    <ul className="space-y-3 my-4">
        {items.map((text, i) => (
            <li key={i} className="flex gap-3 text-gray-600 text-base leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-orange-500)] flex-shrink-0 mt-2.5" />
                <span>{linkifyEmails(text)}</span>
            </li>
        ))}
    </ul>
);

const PrivacyPolicyPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-cream-50)]">
            <Navbar />

            <div className="pt-10 md:pt-16 pb-16 md:pb-24 px-4 md:px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10 md:mb-14"
                    >
                        <h1 className="text-3xl md:text-5xl font-semibold text-[#1A1A1A] mb-3 md:mb-4">
                            Privacy <span className="text-[var(--text-orange-500)]">Policy</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-12"
                    >
                        {sections.map((section, idx) => (
                            <div key={section.heading} className={idx > 0 ? 'mt-10' : ''}>
                                <h2 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-4">
                                    {section.heading}
                                </h2>

                                {section.paragraphs && <Paragraphs items={section.paragraphs} />}
                                {section.list && <List items={section.list} />}
                                {section.trailingParagraphs && (
                                    <Paragraphs items={section.trailingParagraphs} />
                                )}

                                {section.subsections?.map((sub) => (
                                    <div key={sub.subheading} className="mt-6">
                                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                                            {sub.subheading}
                                        </h3>
                                        {sub.paragraphs && <Paragraphs items={sub.paragraphs} />}
                                        {sub.list && <List items={sub.list} />}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
