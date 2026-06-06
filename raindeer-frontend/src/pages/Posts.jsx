import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { useBrandStore } from '@/store'
import { Loader2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function Posts() {
  const { brandId } = useBrandStore()
  const [activeTab, setActiveTab] = useState('Drafts')
  const [localPosts, setLocalPosts] = useState([])
  const [linkedinPosts, setLinkedinPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const tabs = ['Drafts', 'Scheduled', 'Published']

  const fetchLocalPosts = async () => {
    if (!brandId) return
    try {
      const res = await fetch(`http://localhost:3001/api/posts/brand/${brandId}`)
      const data = await res.json()
      if (data.success) {
        setLocalPosts(data.posts)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchLinkedinPosts = async () => {
    if (!brandId) return
    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:3001/api/linkedin/posts/${brandId}`)
      const data = await res.json()
      if (data.success) {
        setLinkedinPosts(data.posts)
      } else {
        toast.error('Failed to fetch LinkedIn posts: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      toast.error('Error fetching LinkedIn posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocalPosts()
  }, [brandId])

  useEffect(() => {
    if (activeTab === 'Published') {
      fetchLinkedinPosts()
    }
  }, [activeTab, brandId])

  const drafts = localPosts.filter(p => p.status === 'DRAFT')
  const scheduled = localPosts.filter(p => p.status === 'SCHEDULED') // If we add scheduling feature later

  // The LinkedIn post content usually lives deep in the object
  const getLinkedinText = (post) => {
    try {
      return post.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary.text || 'No text content'
    } catch (e) {
      return 'Media Post (Unsupported preview)'
    }
  }

  return (
    <AnimatedPage>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>Post Manager</h1>
          <p className="text-brand-muted text-sm mt-1">Manage your content pipeline and view live posts.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
                activeTab === tab ? 'text-brand-white' : 'text-brand-muted hover:text-white hover:bg-white/5'
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="post-tab-indicator" className="absolute bottom -bottom-4 left-0 right-0 h-0.5 bg-brand-blue" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'Drafts' && (
              <motion.div key="drafts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {drafts.length === 0 ? (
                  <div className="text-center py-20 text-brand-muted border border-dashed border-white/10 rounded-2xl">No drafts available. Generate some from the Calendar!</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drafts.map(post => (
                      <div key={post.id} className="glass rounded-xl p-5 border border-white/5 hover:border-brand-blue/30 transition-all">
                        <div className="flex gap-4">
                          {post.image ? (
                            <img src={post.image.url} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" alt="Draft" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-brand-muted flex-shrink-0"><ImageIcon size={20} /></div>
                          )}
                          <div className="flex-1">
                            <p className="text-brand-white text-sm line-clamp-3 mb-2">{post.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-brand-muted">Target: {new Date(post.date).toLocaleDateString()}</span>
                              <span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-semibold text-brand-muted">DRAFT</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Scheduled' && (
              <motion.div key="scheduled" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {scheduled.length === 0 ? (
                  <div className="text-center py-20 text-brand-muted border border-dashed border-white/10 rounded-2xl">No scheduled posts.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {/* Render scheduled posts here */}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Published' && (
              <motion.div key="published" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-brand-blue">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <span className="text-sm font-medium">Fetching from LinkedIn API...</span>
                  </div>
                ) : linkedinPosts.length === 0 ? (
                  <div className="text-center py-20 text-brand-muted border border-dashed border-white/10 rounded-2xl">No published posts found on LinkedIn.</div>
                ) : (
                  <div className="space-y-4">
                    {linkedinPosts.map(post => (
                      <div key={post.id} className="glass rounded-xl p-5 border border-white/5 flex items-start gap-4 hover:border-emerald-500/30 transition-all">
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2] flex-shrink-0">
                          in
                        </div>
                        <div className="flex-1">
                          <p className="text-brand-white text-sm whitespace-pre-wrap leading-relaxed">{getLinkedinText(post)}</p>
                          <div className="mt-4 flex items-center gap-3">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium">Published on LinkedIn</span>
                            <a href={`https://www.linkedin.com/feed/update/${post.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-brand-blue hover:text-brand-blue-glow transition-colors">
                              View on LinkedIn <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  )
}
