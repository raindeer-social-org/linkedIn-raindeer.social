import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { useBrandStore } from '@/store'
import { BarChart3, Eye, MousePointerClick, ThumbsUp, TrendingUp } from 'lucide-react'

export default function Analytics() {
  const { brandId } = useBrandStore()
  const [publishedCount, setPublishedCount] = useState(0)

  useEffect(() => {
    if (!brandId) return
    fetch(`${import.meta.env.VITE_API_URL}/api/posts/brand/${brandId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPublishedCount(data.posts.filter(p => p.status === 'PUBLISHED').length)
        }
      })
  }, [brandId])

  // Mocking stats based on published posts since LinkedIn read permissions are restricted
  const impressions = publishedCount * 1240 + Math.floor(Math.random() * 500)
  const clicks = publishedCount * 85 + Math.floor(Math.random() * 20)
  const likes = publishedCount * 142 + Math.floor(Math.random() * 30)

  const stats = [
    { label: 'Total Impressions', value: impressions.toLocaleString(), change: '+12.5%', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Engagements', value: likes.toLocaleString(), change: '+8.2%', icon: ThumbsUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Link Clicks', value: clicks.toLocaleString(), change: '+15.3%', icon: MousePointerClick, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Published Posts', value: publishedCount.toLocaleString(), change: '+1', icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ]

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-white mb-2">Performance Analytics</h1>
          <p className="text-brand-muted text-sm">Track your LinkedIn campaign performance and engagement metrics.</p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className="glass rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-brand-white mb-1 font-mono">{stat.value}</h3>
                <p className="text-brand-muted text-sm font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Area Mock */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="glass-elevated rounded-3xl p-8 border border-white/5 min-h-[400px] flex flex-col relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8 z-10">
            <h2 className="text-lg font-semibold text-brand-white">Impression History (30 Days)</h2>
            <div className="flex gap-2">
              {['7D', '30D', '3M'].map(t => (
                <button key={t} className={`px-3 py-1 rounded-lg text-xs font-medium ${t === '30D' ? 'bg-brand-blue text-white' : 'text-brand-muted hover:bg-white/5'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-2 z-10 opacity-80">
            {/* Simple CSS Bar Chart Mock */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 80}%` }}
                transition={{ duration: 1, delay: 0.5 + (i * 0.02) }}
                className="flex-1 bg-gradient-to-t from-brand-blue to-brand-blue-glow/50 rounded-t-sm"
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg to-transparent opacity-50 pointer-events-none" />
        </motion.div>
      </div>
    </AnimatedPage>
  )
}
