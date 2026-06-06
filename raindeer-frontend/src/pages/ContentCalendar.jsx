import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Sparkles, ArrowRight } from 'lucide-react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useBrandStore } from '@/store'
import LinkedInPreview from '@/components/LinkedInPreview'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { AnimatedPage } from '@/components/layout/AnimatedPage'

export default function ContentCalendar() {
  const calRef = useRef(null)
  const navigate = useNavigate()
  const { brandId, brandName } = useBrandStore()
  
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAutoGenerating, setIsAutoGenerating] = useState(false)
  
  const [availableImages, setAvailableImages] = useState([])

  const fetchImages = async () => {
    if (!brandId) return;
    try {
      const res = await fetch(`http://localhost:3001/api/upload/brand/${brandId}`)
      const data = await res.json()
      if (data.success) {
        setAvailableImages(data.images)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPosts = async () => {
    if (!brandId) return;
    try {
      const res = await fetch(`http://localhost:3001/api/posts/brand/${brandId}`)
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchImages()
  }, [brandId])

  const fcEvents = posts.map(post => ({
    id: post.id,
    title: `LinkedIn Post`,
    start: post.date,
    backgroundColor: post.status === 'PUBLISHED' ? '#10B981' : '#1E6BFF',
    borderColor: 'transparent',
    extendedProps: post,
  }))

  const handleGenerateCalendar = async () => {
    if (!availableImages || availableImages.length === 0) {
      toast.error('No images found. Please upload images first.')
      return
    }

    setIsAutoGenerating(true)
    const toastId = toast.loading('Auto-generating posts...')
    
    try {
      let currentDate = new Date()
      for (const img of availableImages) {
        currentDate.setDate(currentDate.getDate() + 1)
        
        await fetch('http://localhost:3001/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandId,
            imageId: img.id,
            date: currentDate.toISOString()
          })
        })
      }
      
      toast.success('Calendar auto-generated successfully!', { id: toastId })
      await fetchPosts()
    } catch (error) {
      console.error(error)
      toast.error('Error generating calendar', { id: toastId })
    } finally {
      setIsAutoGenerating(false)
    }
  }

  function handleEventClick(info) {
    setSelectedPost(info.event.extendedProps)
    setIsPreviewOpen(true)
  }

  function handleDateClick(info) {
    if (!availableImages || availableImages.length === 0) {
      toast.error('Please upload photos in the Photo Library tab first.')
      return
    }
    setSelectedDate(info.dateStr)
    setIsPhotoModalOpen(true)
  }

  async function handleGenerateFromPhoto(image) {
    setIsPhotoModalOpen(false)
    setIsGenerating(true)
    const toastId = toast.loading('AI is crafting your LinkedIn post...')

    try {
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId,
          imageId: image.id,
          date: selectedDate
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Post scheduled successfully!', { id: toastId })
        await fetchPosts()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error(error)
      toast.error('Error generating post', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  async function handlePush(post) {
    try {
      const res = await fetch(`http://localhost:3001/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' })
      })
      if (res.ok) {
        toast.success('Post pushed to LinkedIn!')
        setIsPreviewOpen(false)
        fetchPosts()
      }
    } catch (err) {
      toast.error('Failed to push post')
    }
  }

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>Content Calendar</h1>
              <p className="text-brand-muted text-sm mt-1">{posts.length} posts scheduled</p>
            </div>
            
            {isGenerating && (
              <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
                <Loader2 className="w-12 h-12 text-brand-blue animate-spin mb-4" />
                <h3 className="text-white font-semibold">Generating Post...</h3>
                <p className="text-brand-muted text-sm mt-1">Analyzing image and brand context</p>
              </div>
            )}

            {/* Header controls */}
            <div className="flex justify-end mb-4">
              <button 
                onClick={handleGenerateCalendar} 
                disabled={isAutoGenerating} 
                className="flex items-center px-4 py-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/20 rounded-lg text-sm font-medium transition-colors"
              >
                {isAutoGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {isAutoGenerating ? 'Generating AI Posts...' : 'Auto-Generate Calendar'}
              </button>
            </div>

      {/* Calendar */}
      <div className="glass rounded-3xl p-4" style={{ minHeight: 600 }}>
        <p className="text-brand-muted text-sm mb-4 px-2">Click on any empty date to select a photo and generate a post.</p>
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={fcEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
          height="auto"
          eventContent={(arg) => {
            const p = arg.event.extendedProps
            return (
              <div className={`px-2 py-1 rounded-md text-white text-xs truncate cursor-pointer ${p.status === 'PUBLISHED' ? 'bg-emerald-500/80' : 'bg-brand-blue/80'}`}>
                LinkedIn · {p.status}
              </div>
            )
          }}
        />
      </div>



      {/* Photo Selection Modal */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-brand-bg rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white">Select a Photo for {selectedDate}</h3>
                  <p className="text-xs text-brand-muted">The AI will use this photo and its description to craft the post.</p>
                </div>
                <button onClick={() => setIsPhotoModalOpen(false)} className="text-brand-muted hover:text-white p-2">✕</button>
              </div>
              
              <div className="p-5 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {availableImages?.map(img => (
                    <button 
                      key={img.id} 
                      onClick={() => handleGenerateFromPhoto(img)}
                      className="group text-left relative rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-square hover:border-brand-blue transition-colors focus:outline-none"
                    >
                      <img src={img.url} alt={img.description} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                        <p className="text-xs text-white line-clamp-2">{img.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LinkedIn Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && selectedPost && (
          <LinkedInPreview 
            post={selectedPost} 
            brandName={brandName || 'Brand Name'} 
            avatar={null}
            onClose={() => setIsPreviewOpen(false)}
            onUpdate={() => {
              setIsPreviewOpen(false)
              fetchPosts()
            }}
          />
        )}
      </AnimatePresence>
      </div>
    </AnimatedPage>
  )
}
