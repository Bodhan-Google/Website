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
import LegacyPostRedirect from '../features/research/components/LegacyPostRedirect'
import IndicTranslatePostPage from '../features/research/indic-translate-post/IndicTranslatePostPage'
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
import FlnDpiPage from '../features/flnDpi/components/FlnDpiPage'
import IndicOpenModelLicensePage from '../features/license/components/IndicOpenModelLicensePage'
import ApiTermsPage from '../features/legal/components/ApiTermsPage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* The research overview page is gone; /research forwards to the blog listing. */}
      <Route path="/research" element={<Navigate to="/research/blogs" replace />} />
      <Route path="/research/blog" element={<Navigate to="/research/blogs" replace />} />
      <Route path="/research/blogs" element={<ResearchPage />} />
      <Route path="/research/publications" element={<ResearchPage />} />
      {/* Indic-Translate has its own page (see indic-translate-post/); the static route wins over :slug. */}
      <Route path="/research/blogs/indic-translate" element={<IndicTranslatePostPage />} />
      <Route path="/research/blogs/:slug" element={<BlogPostPage />} />
      <Route path="/research/publication/:slug" element={<BlogPostPage />} />
      <Route path="/research/publication/fln-dpi/feedback" element={<FlnDpiPage />} />
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
      {/* Pre-2026-09 links used /research/<slug>; send them to the post's new home. */}
      <Route path="/research/:slug" element={<LegacyPostRedirect />} />
      <Route path="/advisory-council" element={<AdvisoryCouncilPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/tenders" element={<TendersPage />} />
      <Route path="/tenders/apply/:tenderId" element={<TenderApplyPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/terms" element={<TermsAndConditionsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/fln-dpi" element={<Navigate to="/research/publication/fln-dpi/feedback" replace />} />
      <Route path="/indic-open-model-license" element={<Navigate to="/indic-open-model-license/v1" replace />} />
      <Route path="/indic-open-model-license/v1" element={<IndicOpenModelLicensePage />} />
      <Route path="/api-terms-and-conditions" element={<ApiTermsPage />} />
      {/* 404.html serves the app for any unmatched URL, so send strays home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
