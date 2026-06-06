import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RaindeerLogo } from './Navbar'
import { CalendarDays, Image as ImageIcon, BarChart3, Settings, LogOut, Bell, FileText, LayoutTemplate } from 'lucide-react'
import { useBrandStore } from '@/store'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const navigate = useNavigate()
  const { brandName, logoUrl } = useBrandStore()

  const handleLogout = () => {
    useBrandStore.getState().reset()
    navigate('/')
  }

  const links = [
    { to: '/dashboard/calendar', icon: CalendarDays, label: 'Calendar' },
    { to: '/dashboard/posts', icon: FileText, label: 'Posts' },
    { to: '/dashboard/carousel', icon: LayoutTemplate, label: 'Carousel Maker' },
    { to: '/dashboard/photos', icon: ImageIcon, label: 'Photo Library' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-white/5 flex flex-col glass"
        style={{ background: 'rgba(7,17,31,0.92)' }}
      >
        <div className="h-16 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2.5">
            <RaindeerLogo size={24} />
            <span className="font-display font-semibold text-brand-white text-sm tracking-wide">
              raindeer<span className="text-brand-blue">.social</span>
            </span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="mb-6 px-2">
            <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">Workspace</p>
            <p className="text-brand-white font-medium text-sm truncate">{brandName || 'My Brand'}</p>
          </div>

          <nav className="space-y-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-brand-blue/10 text-brand-blue-glow border border-brand-blue/20" 
                    : "text-brand-muted hover:text-brand-white hover:bg-white/5 border border-transparent"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-end px-6 shrink-0" style={{ background: 'rgba(7,17,31,0.5)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-white hover:bg-white/6 transition-all">
              <Bell size={16} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-mid flex items-center justify-center text-xs font-semibold text-white overflow-hidden shadow-glow-sm">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                brandName ? brandName.charAt(0).toUpperCase() : 'R'
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
