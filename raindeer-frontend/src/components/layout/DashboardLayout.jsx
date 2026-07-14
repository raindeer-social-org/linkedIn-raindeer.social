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
    <div className="min-h-screen bg-canvas text-ink flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-hairline flex flex-col bg-canvas"
      >
        <div className="h-16 flex items-center px-6 border-b border-hairline shrink-0">
          <div className="flex items-center gap-2.5">
            <RaindeerLogo size={24} />
            <span className="font-sans font-bold text-ink text-sm tracking-wide">
              raindeer<span className="text-cobalt-600">.social</span>
            </span>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="mb-6 px-2">
            <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-wider mb-1 font-mono">Workspace</p>
            <p className="text-ink font-semibold text-sm truncate">{brandName || 'My Brand'}</p>
          </div>

          <nav className="space-y-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-all duration-200 border",
                  isActive 
                    ? "bg-cobalt-50 text-cobalt-700 border-cobalt-200/50 shadow-xs" 
                    : "text-ink-2 hover:text-ink hover:bg-snow-2 border-transparent"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-hairline mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium text-ink-2 hover:text-negative hover:bg-negative-wash transition-all duration-200 border border-transparent"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-hairline flex items-center justify-end px-6 shrink-0 bg-canvas/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-3 hover:text-ink hover:bg-snow-2 transition-all">
              <Bell size={16} />
            </button>
            <div className="w-8 h-8 rounded-full bg-cobalt-50 border border-cobalt-200 flex items-center justify-center text-xs font-semibold text-cobalt-700 overflow-hidden shadow-sm">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                brandName ? brandName.charAt(0).toUpperCase() : 'R'
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-canvas">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
