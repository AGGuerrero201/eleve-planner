import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { LandingPage } from '@/pages/LandingPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { SavedEventsPage } from '@/pages/SavedEventsPage'
import { VendorHubPage } from '@/pages/VendorHubPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/saved"   element={<SavedEventsPage />} />
        <Route path="/vendors" element={<VendorHubPage />} />
        <Route path="*"        element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
