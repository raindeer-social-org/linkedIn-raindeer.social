import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Sparkles, ChevronRight } from 'lucide-react'
import { AnimatedPage, PageWrapper } from '@/components/layout/AnimatedPage'
import { Navbar } from '@/components/layout/Navbar'
import { Button, Badge, Progress } from '@/components/ui'
import { AgentCard } from '@/components/shared/AgentCard'
import { useCampaignStore, useBrandStore } from '@/store'
import agentsData from '@/data/agents.json'

const sleep = ms => new Promise(r => setTimeout(r, ms))

export default function Planning() {
  const navigate = useNavigate()
  const brandStore = useBrandStore()
  const campaignStore = useCampaignStore()
  const [agentStatuses, setAgentStatuses] = useState({})
  const [agentOutputs, setAgentOutputs] = useState({})
  const [agentProgress, setAgentProgress] = useState({})
  const [allDone, setAllDone] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    runAgents()
  }, [])

  async function runAgents() {
    // Initialize all as queued
    const initial = {}
    agentsData.forEach(a => { initial[a.id] = 'queued' })
    setAgentStatuses(initial)

    let completedCount = 0

    for (const agent of agentsData) {
      // Start this agent
      await sleep(agent.delay)
      setAgentStatuses(prev => ({ ...prev, [agent.id]: 'working' }))

      // Animate progress
      const startTime = Date.now()
      const duration = agent.duration
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const pct = Math.min(95, (elapsed / duration) * 100)
        setAgentProgress(prev => ({ ...prev, [agent.id]: pct }))
      }, 100)

      // Stream dummy text character by character (simulated)
      const text = agent.dummyOutput
      const chunkSize = Math.ceil(text.length / 30)
      for (let i = 0; i < text.length; i += chunkSize) {
        await sleep(duration / 30)
        setAgentOutputs(prev => ({ ...prev, [agent.id]: text.slice(0, i + chunkSize) }))
      }

      clearInterval(progressInterval)
      setAgentProgress(prev => ({ ...prev, [agent.id]: 100 }))
      setAgentStatuses(prev => ({ ...prev, [agent.id]: 'complete' }))
      setAgentOutputs(prev => ({ ...prev, [agent.id]: text }))

      completedCount++
      setOverallProgress((completedCount / agentsData.length) * 100)
    }

    await sleep(500)
    setAllDone(true)
  }

  const completedCount = Object.values(agentStatuses).filter(s => s === 'complete').length
  const workingCount = Object.values(agentStatuses).filter(s => s === 'working').length

  return (
    <>
      <Navbar />
      <PageWrapper>
        <AnimatedPage>
          <div className="max-w-7xl mx-auto py-12">

            {/* Campaign summary bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 mb-8 flex items-center gap-6 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">AI Planning in Progress</span>
              </div>
              <div className="h-4 w-px bg-white/10 hidden sm:block" />
              <div className="flex gap-6 text-xs">
                <span className="text-brand-muted">Brand: <span className="text-brand-white font-medium">{brandStore.brandName || 'Your Brand'}</span></span>
                <span className="text-brand-muted">Goal: <span className="text-brand-white font-medium">{campaignStore.goal}</span></span>
                <span className="text-brand-muted">Platforms: <span className="text-brand-white font-medium">{campaignStore.platforms?.join(', ')}</span></span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-xs text-brand-muted font-mono">{completedCount}/{agentsData.length} agents complete</span>
                <div className="w-28">
                  <Progress value={overallProgress} animated />
                </div>
              </div>
            </motion.div>

            {/* Header */}
            <div className="mb-8">
              <Badge variant="blue" dot className="mb-3">Step 5 of 9</Badge>
              <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>
                Agent Workbench
              </h1>
              <p className="text-brand-muted text-sm mt-1">
                {allDone
                  ? '6 agents complete — your campaign strategy is ready.'
                  : `${workingCount} agent${workingCount !== 1 ? 's' : ''} working · Analyzing brand, trends, and competitors...`}
              </p>
            </div>

            {/* Agent grid 3x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {agentsData.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <AgentCard
                    agent={agent}
                    status={agentStatuses[agent.id] || 'queued'}
                    output={agentOutputs[agent.id] || ''}
                    progress={agentProgress[agent.id] || 0}
                  />
                </motion.div>
              ))}
            </div>

            {/* Orchestration timeline */}
            <div className="glass rounded-2xl p-6 mb-8">
              <h2 className="text-sm font-semibold text-brand-white mb-5">Agent Orchestration Timeline</h2>
              <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {agentsData.map((agent, i) => {
                  const status = agentStatuses[agent.id] || 'queued'
                  const isDone = status === 'complete'
                  const isActive = status === 'working'
                  return (
                    <div key={agent.id} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500"
                          style={{
                            borderColor: isDone ? '#22c55e' : isActive ? agent.color : 'rgba(255,255,255,0.1)',
                            background: isDone ? 'rgba(34,197,94,0.1)' : isActive ? `${agent.color}20` : 'rgba(255,255,255,0.03)',
                            boxShadow: isActive ? `0 0 12px ${agent.color}50` : 'none',
                          }}
                        >
                          {isDone
                            ? <CheckCircle size={16} className="text-green-400" />
                            : isActive
                            ? <motion.div className="w-3 h-3 rounded-full" style={{ background: agent.color }}
                                animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                            : <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
                          }
                        </div>
                        <span className="text-xs text-brand-muted text-center max-w-16 leading-tight">{agent.name.replace(' Agent', '')}</span>
                      </div>
                      {i < agentsData.length - 1 && (
                        <div className="flex items-center mx-2 flex-shrink-0">
                          <div className={`h-px w-12 transition-all duration-500 ${isDone ? 'bg-green-500/40' : 'bg-white/8'}`} />
                          <ChevronRight size={12} className={`flex-shrink-0 ${isDone ? 'text-green-500/40' : 'text-white/20'}`} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Completion banner */}
            <AnimatePresence>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="glass-blue rounded-3xl p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle size={28} className="text-green-400" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-brand-white mb-2">Planning Complete!</h2>
                  <p className="text-brand-muted text-sm mb-6">
                    All 6 agents have completed their analysis. Your campaign strategy includes 28 posts across 30 days, optimized for {campaignStore.platforms?.join(', ')}.
                  </p>
                  <div className="flex justify-center gap-6 mb-6 flex-wrap">
                    {[
                      { label: 'Content Pieces', value: '28' },
                      { label: 'Est. Reach', value: '124K' },
                      { label: 'Platforms', value: campaignStore.platforms?.length || 1 },
                      { label: 'Avg. Eng. Rate', value: '4.6%' },
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <div className="font-mono text-2xl font-bold text-brand-blue">{stat.value}</div>
                        <div className="text-xs text-brand-muted mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => navigate('/calendar')} size="lg" className="group">
                    View Content Calendar
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedPage>
      </PageWrapper>
    </>
  )
}
