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
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<ProtectedRoute><BrandSetup /></ProtectedRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard/calendar" replace />} />
            <Route path="calendar" element={<ContentCalendar />} />
            <Route path="posts" element={<Posts />} />
            <Route path="photos" element={<ImageUpload />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
