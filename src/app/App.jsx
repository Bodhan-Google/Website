import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from '../features/home/components/HomePage'
import AI4BPage from '../features/ai4b/components/AI4BPage'
import AdvisoryCouncilPage from '../features/advisory/components/AdvisoryCouncilPage'
import CareersPage from '../features/careers/components/CareersPage'
import ContactPage from '../features/contact/components/ContactPage'
import TendersPage from '../features/tenders/components/TendersPage'
import TenderApplyPage from '../features/tenders/components/TenderApplyPage'
import PartnersPage from '../features/partners/components/PartnersPage'
import TermsAndConditionsPage from '../features/legal/components/TermsAndConditionsPage'
import PrivacyPolicyPage from '../features/legal/components/PrivacyPolicyPage'
import ResearchPage from '../features/research/components/ResearchPage'
import BlogPostPage from '../features/research/components/BlogPostPage'
import DevelopersPage from '../features/developers/components/DevelopersPage'
import IndicOcrPage from '../features/developers/components/models/IndicOcrPage'
import IndicSpeakPage from '../features/developers/components/models/IndicSpeakPage'
import IndicTranscribePage from '../features/developers/components/models/IndicTranscribePage'
import IndicTranslatePage from '../features/developers/components/models/IndicTranslatePage'
import ResearchProblemsLayout from '../features/research-problems/ResearchProblemsLayout'
import {
  ResearchProblemsHomePage,
  ResearchProblemsVerticalPage,
  ResearchProblemsGrandChallengePage,
} from '../features/research-problems/ResearchProblemsRoutes'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* The research overview page is gone; /research forwards to the blog listing. */}
      <Route path="/research" element={<Navigate to="/research/blog" replace />} />
      <Route path="/research/blog" element={<ResearchPage />} />
      <Route path="/research/publications" element={<ResearchPage />} />
      <Route path="/developers" element={<DevelopersPage />} />
      <Route path="/developers/indic-ocr" element={<IndicOcrPage />} />
      <Route path="/developers/indic-speak" element={<IndicSpeakPage />} />
      <Route path="/developers/indic-transcribe" element={<IndicTranscribePage />} />
      <Route path="/developers/indic-translate" element={<IndicTranslatePage />} />
      <Route path="/research/problems" element={<ResearchProblemsLayout />}>
        <Route index element={<ResearchProblemsHomePage />} />
        <Route path="vertical/:verticalId" element={<ResearchProblemsVerticalPage />} />
        <Route path="grand-challenge/:challengeId" element={<ResearchProblemsGrandChallengePage />} />
      </Route>
      <Route path="/research/:slug" element={<BlogPostPage />} />
      <Route path="/advisory-council" element={<AdvisoryCouncilPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/tenders" element={<TendersPage />} />
      <Route path="/tenders/apply/:tenderId" element={<TenderApplyPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/terms" element={<TermsAndConditionsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
    </Routes>
  )
}

export default App
