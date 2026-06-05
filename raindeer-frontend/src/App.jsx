import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import Landing from '@/pages/Landing'
import BrandSetup from '@/pages/BrandSetup'
import Strategy from '@/pages/Strategy'
import CampaignPlanner from '@/pages/CampaignPlanner'
import Planning from '@/pages/Planning'
import ContentCalendar from '@/pages/ContentCalendar'
import FinalReview from '@/pages/FinalReview'
import GeneratedOutput from '@/pages/GeneratedOutput'
import Analytics from '@/pages/Analytics'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0B1320',
            color: '#F5F7FA',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#1E6BFF', secondary: '#F5F7FA' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/setup"     element={<BrandSetup />} />
          <Route path="/strategy"  element={<Strategy />} />
          <Route path="/campaign"  element={<CampaignPlanner />} />
          <Route path="/planning"  element={<Planning />} />
          <Route path="/calendar"  element={<ContentCalendar />} />
          <Route path="/review"    element={<FinalReview />} />
          <Route path="/output"    element={<GeneratedOutput />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
