import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Download, Filter, X, Clock, Hash, Target, Eye, Edit3 } from 'lucide-react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Badge, Modal } from '@/components/ui'
import { PlatformBadge } from '@/components/shared/PlatformBadge'
import calendarData from '@/data/calendarEvents.json'
import { platformColors } from '@/lib/utils'

export default function ContentCalendar() {
  const navigate = useNavigate()
  const calRef = useRef(null)
  const [view, setView] = useState('dayGridMonth')
  const [filterPlatform, setFilterPlatform] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const platforms = ['All', 'Instagram', 'LinkedIn', 'TikTok', 'YouTube', 'X']

  const fcEvents = calendarData.events
    .filter(ev => filterPlatform === 'All' || ev.platform === filterPlatform)
    .map(ev => ({
      id: ev.id,
      title: `${ev.platform} · ${ev.type}`,
      start: ev.start,
      backgroundColor: platformColors[ev.platform]?.dot || '#1E6BFF',
      borderColor: 'transparent',
      extendedProps: ev,
    }))

  function handleEventClick(info) {
    setSelectedEvent(info.event.extendedProps)
    setDrawerOpen(true)
  }

  function switchView(v) {
    setView(v)
    if (calRef.current) {
      calRef.current.getApi().changeView(v)
    }
  }

  const storyboard = [
    { scene: 1, desc: 'Hook: Bold text card — "Most brands waste 80% of their content budget"', dur: '3s' },
    { scene: 2, desc: 'Problem reveal: Chaotic content creation montage (stock footage)', dur: '5s' },
    { scene: 3, desc: 'Solution drop: raindeer.social interface reveal with glow effect', dur: '7s' },
  ]

  return (
    <>
      <Navbar />
      <PageWrapper noPadding>
        <AnimatedPage>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
              <div>
                <Badge variant="blue" dot className="mb-3">Step 6 of 9</Badge>
                <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>Content Calendar</h1>
                <p className="text-brand-muted text-sm mt-1">{calendarData.events.length} posts scheduled across December 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" icon={<Download size={14} />}>Export</Button>
                <Button onClick={() => navigate('/review')} size="sm">
                  Review & Create <ArrowRight size={14} />
                </Button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              {/* View toggle */}
              <div className="flex bg-white/4 rounded-xl p-1 border border-white/8">
                {[['dayGridMonth', 'Month'], ['timeGridWeek', 'Week']].map(([v, label]) => (
                  <button key={v} onClick={() => switchView(v)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === v ? 'bg-brand-blue text-white shadow-glow-sm' : 'text-brand-muted hover:text-brand-white'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Platform filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter size={14} className="text-brand-muted" />
                {platforms.map(p => (
                  <button key={p} onClick={() => setFilterPlatform(p)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      filterPlatform === p
                        ? 'bg-brand-blue border-brand-blue text-white'
                        : 'border-white/10 text-brand-muted hover:border-white/20'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="glass rounded-3xl p-4 mb-8" style={{ minHeight: 600 }}>
              <FullCalendar
                ref={calRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate="2024-12-01"
                events={fcEvents}
                eventClick={handleEventClick}
                headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
                height="auto"
                eventContent={(arg) => {
                  const ev = arg.event.extendedProps
                  return (
                    <div className="px-2 py-1 rounded-md text-white text-xs truncate cursor-pointer"
                      style={{ background: `${platformColors[ev.platform]?.dot}CC` }}>
                      {ev.type} · {ev.concept?.slice(0, 28)}…
                    </div>
                  )
                }}
              />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 flex-wrap mb-8">
              {Object.entries(platformColors).map(([p, c]) => (
                <div key={p} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.dot }} />
                  <span className="text-xs text-brand-muted">{p}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={() => navigate('/review')} size="lg" className="group">
                Review Before Creating
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </AnimatedPage>

        {/* Event drawer */}
        <AnimatePresence>
          {drawerOpen && selectedEvent && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-brand-surface border-l border-white/8 z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-brand-white">{selectedEvent.title}</h2>
                    <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-white hover:bg-white/8">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <PlatformBadge platform={selectedEvent.platform} size="md" />
                      <Badge variant="gray">{selectedEvent.type}</Badge>
                      <div className="flex items-center gap-1 text-xs text-brand-muted">
                        <Clock size={12} /> {selectedEvent.time}
                      </div>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="text-xs text-brand-muted mb-2 font-medium uppercase tracking-wide">Concept</div>
                      <p className="text-sm text-brand-white leading-relaxed">{selectedEvent.concept}</p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="text-xs text-brand-muted mb-2 font-medium uppercase tracking-wide">Caption Direction</div>
                      <p className="text-sm text-brand-white leading-relaxed">{selectedEvent.caption}</p>
                    </div>

                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-3">
                        <Hash size={12} /> Hashtag Strategy
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.hashtags?.map(tag => (
                          <span key={tag} className="text-xs text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="glass rounded-xl p-3 text-center">
                        <Eye size={14} className="text-brand-blue mx-auto mb-1" />
                        <div className="text-sm font-bold font-mono text-brand-white">{selectedEvent.estimatedReach}</div>
                        <div className="text-xs text-brand-muted">Est. Reach</div>
                      </div>
                      <div className="glass rounded-xl p-3 text-center">
                        <Target size={14} className="text-brand-blue mx-auto mb-1" />
                        <div className="text-sm font-bold text-brand-white">{selectedEvent.ctaType}</div>
                        <div className="text-xs text-brand-muted">CTA Type</div>
                      </div>
                      <div className="glass rounded-xl p-3 text-center">
                        <div className="text-lg mb-1">📅</div>
                        <div className="text-sm font-bold text-brand-white">{selectedEvent.start?.slice(0, 10)}</div>
                        <div className="text-xs text-brand-muted">Scheduled</div>
                      </div>
                    </div>

                    {/* Featured Reel storyboard (first Instagram Reel) */}
                    {selectedEvent.type === 'Reel' && selectedEvent.platform === 'Instagram' && (
                      <div className="glass-blue rounded-2xl p-5">
                        <div className="text-xs font-semibold text-brand-blue mb-4 uppercase tracking-wide">Reel Storyboard</div>
                        <div className="space-y-3">
                          {storyboard.map(s => (
                            <div key={s.scene} className="flex gap-3">
                              <div className="w-16 h-16 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-brand-blue">#{s.scene}</span>
                              </div>
                              <div>
                                <p className="text-xs text-brand-white leading-relaxed">{s.desc}</p>
                                <span className="text-xs text-brand-muted mt-1 block">{s.dur}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button fullWidth variant="blue-outline" icon={<Edit3 size={14} />}>
                      Edit Content Brief
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </PageWrapper>
    </>
  )
}
