import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { Badge } from '@/components/ui'
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

  const fetchLocalPosts = useCallback(async () => {
    if (!brandId) return
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/brand/${brandId}`)
      const data = await res.json()
      if (data.success) {
        setLocalPosts(data.posts)
      }
    } catch (err) {
      console.error(err)
    }
  }, [brandId])

  const fetchLinkedinPosts = useCallback(async () => {
    if (!brandId) return
    setIsLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/linkedin/posts/${brandId}`)
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
  }, [brandId])

  useEffect(() => {
    fetchLocalPosts()
  }, [brandId, fetchLocalPosts])

  useEffect(() => {
    if (activeTab === 'Published') {
      fetchLinkedinPosts()
    }
  }, [activeTab, brandId, fetchLinkedinPosts])

  const drafts = localPosts.filter(p => p.status === 'DRAFT')
  const scheduled = localPosts.filter(p => p.status === 'SCHEDULED')

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
          <h1 className="font-serif text-3xl font-medium text-ink">Post Manager</h1>
          <p className="text-xs text-ink-3 font-semibold uppercase tracking-wider font-mono mt-1">Manage your content pipeline and view live posts.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-snow-3 p-1 rounded-controls border border-hairline w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-1.5 rounded-[6px] text-sm font-semibold transition-all duration-dur-2 border',
                activeTab === tab
                  ? 'bg-cobalt-50 border-cobalt-200 text-cobalt-700 shadow-xs'
                  : 'bg-card border-transparent text-ink-2 hover:text-ink hover:bg-snow-2'
              )}
            >
              {tab}
              {tab === 'Drafts' && drafts.length > 0 && (
                <span className="ml-1.5 text-[10px] font-mono bg-cobalt-600 text-white rounded-full px-1.5 py-0.5">{drafts.length}</span>
              )}
              {tab === 'Scheduled' && scheduled.length > 0 && (
                <span className="ml-1.5 text-[10px] font-mono bg-caution text-white rounded-full px-1.5 py-0.5">{scheduled.length}</span>
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
                  <div className="text-center py-20 text-ink-3 border-2 border-dashed border-hairline rounded-containers bg-snow-2">
                    No drafts available. Generate some from the Calendar!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {drafts.map(post => (
                      <div key={post.id} className="bg-card rounded-containers p-5 border border-hairline hover:border-hairline-bold hover:shadow-md transition-all">
                        <div className="flex gap-4">
                          {post.image ? (
                            <img src={post.image.url} className="w-16 h-16 rounded-controls object-cover flex-shrink-0 border border-hairline" alt="Draft" />
                          ) : (
                            <div className="w-16 h-16 rounded-controls bg-snow-3 border border-hairline flex items-center justify-center text-ink-3 flex-shrink-0"><ImageIcon size={20} /></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-ink text-sm line-clamp-3 mb-2">{post.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-ink-3 font-mono uppercase tracking-wider">Target: {new Date(post.date).toLocaleDateString()}</span>
                              <Badge variant="draft" dot>Draft</Badge>
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
                  <div className="text-center py-20 text-ink-3 border-2 border-dashed border-hairline rounded-containers bg-snow-2">
                    No scheduled posts.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scheduled.map(post => (
                      <div key={post.id} className="bg-card rounded-containers p-5 border border-hairline hover:border-hairline-bold hover:shadow-md transition-all">
                        <div className="flex gap-4">
                          {post.image ? (
                            <img src={post.image.url} className="w-16 h-16 rounded-controls object-cover flex-shrink-0 border border-hairline" alt="Scheduled" />
                          ) : (
                            <div className="w-16 h-16 rounded-controls bg-snow-3 border border-hairline flex items-center justify-center text-ink-3 flex-shrink-0"><ImageIcon size={20} /></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-ink text-sm line-clamp-3 mb-2">{post.content}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-ink-3 font-mono uppercase tracking-wider">{new Date(post.date).toLocaleDateString()}{post.scheduledTime ? ` · ${post.scheduledTime}` : ''}</span>
                              <Badge variant="scheduled" dot>Scheduled</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Published' && (
              <motion.div key="published" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-cobalt-600">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <span className="text-sm font-medium font-sans">Fetching from LinkedIn API...</span>
                  </div>
                ) : linkedinPosts.length === 0 ? (
                  <div className="text-center py-20 text-ink-3 border-2 border-dashed border-hairline rounded-containers bg-snow-2">
                    No published posts found on LinkedIn.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {linkedinPosts.map(post => (
                      <div key={post.id} className="bg-card rounded-containers p-5 border border-hairline flex items-start gap-4 hover:border-positive/30 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] font-bold text-xs flex-shrink-0 border border-[#0A66C2]/20">
                          in
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-ink text-sm whitespace-pre-wrap leading-relaxed">{getLinkedinText(post)}</p>
                          <div className="mt-4 flex items-center gap-3">
                            <Badge variant="published" dot>Published</Badge>
                            <a href={`https://www.linkedin.com/feed/update/${post.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-cobalt-600 hover:text-cobalt-700 font-medium transition-colors">
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
