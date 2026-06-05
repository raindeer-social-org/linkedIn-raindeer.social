import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Zap, Clock, Eye } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Badge, Card } from '@/components/ui'
import { CircularProgress } from '@/components/ui/Progress'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import analyticsData from '@/data/analyticsData.json'
import { formatNumber, platformColors } from '@/lib/utils'
import { cn } from '@/lib/utils'

const TABS = ['Post Analytics', 'Cross-Platform', 'Brand Analytics']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-elevated rounded-xl px-4 py-3 border border-white/10">
        <p className="text-xs text-brand-muted mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-brand-muted">{entry.name}:</span>
            <span className="text-brand-white font-mono font-medium">
              {typeof entry.value === 'number' && entry.value > 1000 ? formatNumber(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function MetricCard({ label, value, trend, trendValue, color = '#1E6BFF' }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="text-xs text-brand-muted mb-2">{label}</div>
      <div className="font-mono text-2xl font-bold text-brand-white mb-1">{formatNumber(value)}</div>
      <div className={cn('flex items-center gap-1 text-xs', trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-brand-muted')}>
        <TrendIcon size={12} />
        {trendValue}
      </div>
    </motion.div>
  )
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState(0)
  const { postAnalytics, crossPlatform, brandAnalytics } = analyticsData
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  return (
    <>
      <Navbar />
      <PageWrapper>
        <AnimatedPage>
          <div className="max-w-7xl mx-auto py-12">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Badge variant="blue" dot className="mb-3">Step 9 of 9</Badge>
              <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>Analytics Dashboard</h1>
              <p className="text-brand-muted text-sm mt-1">Track performance across posts, platforms, and brand health.</p>
            </motion.div>

            {/* Tab bar */}
            <div className="flex bg-white/4 rounded-2xl p-1 border border-white/8 mb-8 w-fit">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === i ? 'bg-brand-blue text-white shadow-glow-sm' : 'text-brand-muted hover:text-brand-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ── TAB 1: Post Analytics ── */}
            {activeTab === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                {/* Metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <MetricCard label="Views" value={postAnalytics.metrics.views} trend="up" trendValue="+42% vs avg" />
                  <MetricCard label="Likes" value={postAnalytics.metrics.likes} trend="up" trendValue="+28%" />
                  <MetricCard label="Comments" value={postAnalytics.metrics.comments} trend="up" trendValue="+15%" />
                  <MetricCard label="Shares" value={postAnalytics.metrics.shares} trend="up" trendValue="+67%" />
                  <MetricCard label="Saves" value={postAnalytics.metrics.saves} trend="up" trendValue="+89%" />
                  <MetricCard label="Reach" value={postAnalytics.metrics.reach} trend="up" trendValue="+34%" />
                </div>

                {/* Engagement over time */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-5">Engagement Over Time (7 Days)</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={postAnalytics.engagementOverTime}>
                      <defs>
                        <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E6BFF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#1E6BFF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#35A7FF" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#35A7FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, color: '#A7B0BE' }} />
                      <Area type="monotone" dataKey="engagement" name="Engagements" stroke="#1E6BFF" strokeWidth={2} fill="url(#engGradient)" animationDuration={1000} />
                      <Area type="monotone" dataKey="reach" name="Reach" stroke="#35A7FF" strokeWidth={2} fill="url(#reachGradient)" animationDuration={1200} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Age breakdown */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-brand-white mb-5">Audience Age Breakdown</h2>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={postAnalytics.audienceBreakdown.ageGroups} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#A7B0BE', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 50]} />
                        <YAxis dataKey="group" type="category" tick={{ fill: '#A7B0BE', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="percentage" name="%" radius={[0, 6, 6, 0]} animationDuration={1000}>
                          {postAnalytics.audienceBreakdown.ageGroups.map((_, i) => (
                            <Cell key={i} fill={`rgba(30,107,255,${0.4 + i * 0.12})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Engagement heatmap */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-brand-white mb-5">Best Posting Hours (by day)</h2>
                    <div className="overflow-x-auto">
                      <div className="flex gap-px" style={{ minWidth: 420 }}>
                        {days.map((day, di) => (
                          <div key={day} className="flex flex-col gap-px flex-1">
                            <div className="text-center text-xs text-brand-muted mb-1">{day}</div>
                            {postAnalytics.hourlyHeatmap[di]?.slice(6, 22).map((val, hi) => (
                              <div
                                key={hi}
                                className="h-3 rounded-sm"
                                style={{
                                  background: `rgba(30,107,255,${val})`,
                                  border: '1px solid rgba(255,255,255,0.03)',
                                }}
                                title={`${day} ${hi + 6}:00 — ${Math.round(val * 100)}%`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-brand-muted">Low</span>
                        <div className="flex gap-0.5">
                          {[0.1, 0.25, 0.5, 0.75, 1].map(v => (
                            <div key={v} className="w-5 h-2.5 rounded-sm" style={{ background: `rgba(30,107,255,${v})` }} />
                          ))}
                        </div>
                        <span className="text-xs text-brand-muted">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── TAB 2: Cross-Platform ── */}
            {activeTab === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                {/* Platform comparison table */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-5">Platform Performance Comparison</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/8">
                          {['Platform', 'Views', 'Likes', 'Comments', 'Shares', 'Eng. Rate', 'Trend'].map(h => (
                            <th key={h} className="text-left text-xs text-brand-muted font-medium pb-3 pr-6 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {crossPlatform.platforms.map((p, i) => (
                          <tr key={p.name} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                            <td className="py-4 pr-6"><PlatformBadge platform={p.name} /></td>
                            <td className="py-4 pr-6 font-mono text-brand-white">{formatNumber(p.views)}</td>
                            <td className="py-4 pr-6 font-mono text-brand-white">{formatNumber(p.likes)}</td>
                            <td className="py-4 pr-6 font-mono text-brand-white">{formatNumber(p.comments)}</td>
                            <td className="py-4 pr-6 font-mono text-brand-white">{formatNumber(p.shares)}</td>
                            <td className="py-4 pr-6">
                              <span className={`font-mono font-bold ${p.engagementRate > 5 ? 'text-green-400' : 'text-brand-blue'}`}>
                                {p.engagementRate}%
                              </span>
                            </td>
                            <td className="py-4">
                              {/* Mini sparkline */}
                              <div className="flex items-end gap-0.5 h-8">
                                {p.sparkline.map((v, j) => (
                                  <div key={j} className="w-2 rounded-sm" style={{ height: `${(v / Math.max(...p.sparkline)) * 100}%`, background: platformColors[p.name]?.dot || '#1E6BFF', opacity: 0.7 }} />
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grouped bar chart */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-brand-white mb-5">Engagement by Platform</h2>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={crossPlatform.platforms}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, color: '#A7B0BE' }} />
                      <Bar dataKey="likes" name="Likes" radius={[4, 4, 0, 0]} animationDuration={1000}>
                        {crossPlatform.platforms.map((p) => (
                          <Cell key={p.name} fill={platformColors[p.name]?.dot || '#1E6BFF'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Insight chips */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {crossPlatform.insights.map(insight => (
                    <div key={insight.text} className={cn(
                      'glass rounded-2xl p-4 border-l-4',
                      insight.type === 'positive' ? 'border-green-500' : insight.type === 'tip' ? 'border-amber-500' : 'border-brand-blue'
                    )}>
                      <p className="text-sm text-brand-white leading-relaxed">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── TAB 3: Brand Analytics ── */}
            {activeTab === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Brand health score */}
                  <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
                    <h2 className="text-sm font-semibold text-brand-white">Brand Health Score</h2>
                    <CircularProgress value={brandAnalytics.brandHealthScore} size={140} />
                    <div className="text-center">
                      <Badge variant="green" dot>Strong</Badge>
                      <p className="text-xs text-brand-muted mt-2">Top 18% of accounts in your niche</p>
                    </div>
                  </div>

                  {/* Follower growth */}
                  <div className="glass rounded-2xl p-6 lg:col-span-2">
                    <h2 className="text-sm font-semibold text-brand-white mb-5">Follower Growth by Platform</h2>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={brandAnalytics.followerGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, color: '#A7B0BE' }} />
                        <Line type="monotone" dataKey="Instagram" stroke={platformColors.Instagram.dot} strokeWidth={2} dot={false} animationDuration={1000} />
                        <Line type="monotone" dataKey="LinkedIn" stroke={platformColors.LinkedIn.dot} strokeWidth={2} dot={false} animationDuration={1200} />
                        <Line type="monotone" dataKey="TikTok" stroke={platformColors.TikTok.dot} strokeWidth={2} dot={false} animationDuration={1400} />
                        <Line type="monotone" dataKey="YouTube" stroke={platformColors.YouTube.dot} strokeWidth={2} dot={false} animationDuration={1600} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content performance radar */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-brand-white mb-5">Content Performance by Type</h2>
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={brandAnalytics.contentPerformanceByType}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="type" tick={{ fill: '#A7B0BE', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#A7B0BE', fontSize: 10 }} />
                        <Radar name="Performance" dataKey="value" stroke="#1E6BFF" fill="#1E6BFF" fillOpacity={0.2} animationDuration={1200} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Monthly reach trend */}
                  <div className="glass rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-brand-white mb-5">Monthly Reach Trend</h2>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={brandAnalytics.monthlyReachTrend}>
                        <defs>
                          <linearGradient id="reachTrendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1E6BFF" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#1E6BFF" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#A7B0BE', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="reach" name="Reach" stroke="#1E6BFF" strokeWidth={2} fill="url(#reachTrendGradient)" animationDuration={1000} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AI Insights */}
                <div>
                  <h2 className="text-sm font-semibold text-brand-white mb-4">AI Recommendations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {brandAnalytics.aiInsights.map((insight, i) => {
                      const icons = { TrendingUp, Clock, Zap }
                      const Icon = icons[insight.icon] || TrendingUp
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass-blue rounded-2xl p-5"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-blue/15 flex items-center justify-center">
                              <Icon size={18} className="text-brand-blue" />
                            </div>
                            <Badge variant={insight.impact === 'High' ? 'blue' : 'gray'} className="text-xs">
                              {insight.impact} Impact
                            </Badge>
                          </div>
                          <h3 className="text-sm font-semibold text-brand-white mb-2">{insight.title}</h3>
                          <p className="text-xs text-brand-muted leading-relaxed">{insight.body}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </AnimatedPage>
      </PageWrapper>
    </>
  )
}
