import { useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from '../features/home/components/HomePage'
import AI4BPage from '../features/ai4b/components/AI4BPage'
import AdvisoryCouncilPage from '../features/advisory/components/AdvisoryCouncilPage'
import CareersPage from '../features/careers/components/CareersPage'
import ContactPage from '../features/contact/components/ContactPage'
import TendersPage from '../features/tenders/components/TendersPage'
import TenderApplyPage from '../features/tenders/components/TenderApplyPage'
import PartnersPage from '../features/partners/components/PartnersPage'
import PrivacyPolicyPage from '../features/legal/components/PrivacyPolicyPage'
import TermsAndConditionsPage from '../features/legal/components/TermsAndConditionsPage'
import ApiTermsPage from '../features/legal/components/ApiTermsPage'
import IndicOpenModelLicensePage from '../features/license/components/IndicOpenModelLicensePage'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/advisory-council" element={<AdvisoryCouncilPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/tenders" element={<TendersPage />} />
      <Route path="/tenders/apply/:tenderId" element={<TenderApplyPage />} />
      <Route path="/partners" element={<PartnersPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
      <Route path="/api-terms-and-conditions" element={<ApiTermsPage />} />
      <Route path="/indic-open-model-license" element={<Navigate to="/indic-open-model-license/v1" replace />} />
      <Route path="/indic-open-model-license/v1" element={<IndicOpenModelLicensePage />} />
      {/* 404.html serves the app for any unmatched URL, so send strays home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
