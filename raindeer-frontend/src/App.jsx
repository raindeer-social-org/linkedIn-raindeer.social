import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import { Navigate } from 'react-router-dom'
import Landing from '@/pages/Landing'
import BrandSetup from '@/pages/BrandSetup'
import ImageUpload from '@/pages/ImageUpload'
import ContentCalendar from '@/pages/ContentCalendar'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'
import Posts from '@/pages/Posts'
import CarouselMaker from '@/pages/CarouselMaker'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useBrandStore } from '@/store'

function ProtectedRoute({ children }) {
  const isAuthenticated = useBrandStore(state => state.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--snow-card)',
            color: 'var(--ink)',
            border: '1px solid var(--hairline)',
            borderRadius: '10px',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          },
          success: { iconTheme: { primary: 'var(--positive)', secondary: 'var(--snow-card)' } },
          error: { iconTheme: { primary: 'var(--negative)', secondary: 'var(--snow-card)' } },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<ProtectedRoute><BrandSetup /></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard/calendar" replace />} />
            <Route path="calendar" element={<ContentCalendar />} />
            <Route path="posts" element={<Posts />} />
            <Route path="carousel" element={<CarouselMaker />} />
            <Route path="photos" element={<ImageUpload />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
