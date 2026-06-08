import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { SavedEventsPage } from '@/pages/SavedEventsPage'
import { VendorHubPage } from '@/pages/VendorHubPage'

// ─── Routing ──────────────────────────────────────────────────────────────────
//
//  /            → LandingPage   (public marketing page)
//  /dashboard   → DashboardPage (operations command centre)
//  /planner     → PlannerPage
//  /saved       → SavedEventsPage
//  /vendors     → VendorHubPage
//
//  Production auth (future):
//    Wrap /dashboard in a RequireAuth component.
//    / stays as LandingPage — no routing changes needed.
//
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/planner"   element={<PlannerPage />} />
        <Route path="/saved"     element={<SavedEventsPage />} />
        <Route path="/vendors"   element={<VendorHubPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
