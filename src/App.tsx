import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { PropertyProvider } from '@/context/PropertyContext'
import { LandingPage } from '@/pages/LandingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { SavedEventsPage } from '@/pages/SavedEventsPage'
import { VendorHubPage } from '@/pages/VendorHubPage'
import { PropertySettingsPage } from '@/pages/PropertySettingsPage'
import { SampleEventPage } from '@/pages/SampleEventPage'

function App() {
  return (
    <PropertyProvider>
      <Layout>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/planner"   element={<PlannerPage />} />
          <Route path="/saved"     element={<SavedEventsPage />} />
          <Route path="/vendors"   element={<VendorHubPage />} />
          <Route path="/property"  element={<PropertySettingsPage />} />
          <Route path="/sample"    element={<SampleEventPage />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </PropertyProvider>
  )
}

export default App
