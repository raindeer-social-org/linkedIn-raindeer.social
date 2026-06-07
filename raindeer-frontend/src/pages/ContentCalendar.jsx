import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import { useBrandStore } from '@/store'
import LinkedInPreview from '@/components/LinkedInPreview'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import RescheduleDialog from '@/components/RescheduleDialog'

export default function ContentCalendar() {
  const calendarRef = useRef(null)
  const navigate = useNavigate()
  const { brandId, brandName, token } = useBrandStore()
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState('dayGridMonth')
  const [title, setTitle] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAutoGenerating, setIsAutoGenerating] = useState(false)
  
  const [availableImages, setAvailableImages] = useState([])
  
  const [rescheduleDialog, setRescheduleDialog] = useState({
    isOpen: false,
    post: null,
    newDate: null,
    newTime: null,
    revertFn: null
  })

  const fetchImages = async () => {
    if (!brandId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/brand/${brandId}`)
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setPosts(data)
      } else {
        setPosts(data.posts || [])
      }
    } catch (err) {
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchImages()
  }, [brandId])

  const events = posts.map(post => {
    const dateStr = post.date.split('T')[0]
    const start = post.scheduledTime 
      ? `${dateStr}T${post.scheduledTime}` 
      : dateStr
    
    let end = null
    if (post.scheduledTime) {
      const startDate = new Date(`${dateStr}T${post.scheduledTime}`)
      startDate.setMinutes(startDate.getMinutes() + (post.duration || 30))
      end = startDate.toISOString()
    }

    return {
      id: post.id,
      title: post.type || 'LinkedIn Post',
      start,
      end,
      backgroundColor: post.status === 'PUBLISHED' 
        ? '#22c55e' 
        : post.status === 'PENDING' 
          ? '#f59e0b' 
          : '#3b82f6',
      borderColor: 'transparent',
      extendedProps: {
        content: post.content,
        status: post.status,
        imageUrl: post.image?.url,
        scheduledTime: post.scheduledTime,
        fullPost: post
      }
    }
  })

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
        
        await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brandId,
            imageId: img.id,
            date: currentDate.toISOString().split('T')[0]
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

  const handleEventClick = (info) => {
    setSelectedPost(info.event.extendedProps.fullPost)
    setIsPreviewOpen(true)
  }

  const handleDateClick = (info) => {
    if (!availableImages || availableImages.length === 0) {
      toast.error('Please upload photos in the Photo Library tab first.')
      return
    }
    setSelectedDate(info.dateStr.split('T')[0])
    setIsPhotoModalOpen(true)
  }

  const handleGenerateFromPhoto = async (image) => {
    setIsPhotoModalOpen(false)
    setIsGenerating(true)
    const toastId = toast.loading('AI is crafting your LinkedIn post...')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
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

  const handleEventDrop = ({ event, revert }) => {
    const post = posts.find(p => p.id === event.id)
    const newDate = event.startStr.split('T')[0]
    const newTime = event.startStr.includes('T') 
      ? event.startStr.split('T')[1].substring(0, 5)
      : null

    setRescheduleDialog({
      isOpen: true,
      post: post,
      newDate: newDate,
      newTime: newTime,
      revertFn: revert
    })
  }

  const handleRescheduleConfirm = async () => {
    const { post, newDate, newTime } = rescheduleDialog
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: newDate, scheduledTime: newTime })
      })
      if (!res.ok) throw new Error('Failed to reschedule')
      
      setRescheduleDialog({ 
        isOpen: false, post: null, 
        newDate: null, newTime: null, revertFn: null 
      })
      fetchPosts()
      toast.success('Post rescheduled successfully!')
    } catch (err) {
      console.error('Reschedule failed:', err)
      toast.error('Reschedule failed!')
      rescheduleDialog.revertFn()
    }
  }

  const handleRescheduleCancel = () => {
    rescheduleDialog.revertFn()
    setRescheduleDialog({ 
      isOpen: false, post: null, 
      newDate: null, newTime: null, revertFn: null 
    })
  }

  const handleDatesSet = (dateInfo) => {
    setTitle(dateInfo.view.title)
  }

  const renderEventContent = (eventInfo) => {
    return (
      <div className="px-1 py-0.5 overflow-hidden">
        <div className="text-xs font-medium text-white truncate">
          {eventInfo.event.title}
        </div>
        {eventInfo.event.extendedProps.scheduledTime && (
          <div className="text-xs text-white/70">
            {eventInfo.event.extendedProps.scheduledTime}
          </div>
        )}
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <style>{`
          .fc {
            --fc-border-color: #334155;
            --fc-page-bg-color: #0f172a;
            --fc-neutral-bg-color: #1e293b;
            --fc-list-event-hover-bg-color: #334155;
            --fc-today-bg-color: rgba(59, 130, 246, 0.15);
            --fc-event-border-color: transparent;
            --fc-now-indicator-color: #ef4444;
          }
          .fc-theme-standard td, 
          .fc-theme-standard th,
          .fc-theme-standard .fc-scrollgrid {
            border-color: #334155;
          }
          .fc-col-header-cell-cushion,
          .fc-daygrid-day-number,
          .fc-list-day-text,
          .fc-list-day-side-text {
            color: #94a3b8;
            text-decoration: none;
          }
          .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .fc-button {
            display: none;  /* hide all FullCalendar default buttons */
          }
          .fc-list-empty {
            background: #1e293b;
            color: #94a3b8;
          }
        `}</style>

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

        {/* Top Controls: Nav + Switcher + Auto-Generate */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Calendar Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => {
                  calendarRef.current.getApi().prev();
                  setTitle(calendarRef.current.getApi().view.title);
                }}
                className="px-2.5 py-1 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md text-sm font-medium"
              >
                &lt;
              </button>
              <button 
                onClick={() => {
                  calendarRef.current.getApi().today();
                  setTitle(calendarRef.current.getApi().view.title);
                }}
                className="px-3 py-1 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md text-sm font-medium"
              >
                Today
              </button>
              <button 
                onClick={() => {
                  calendarRef.current.getApi().next();
                  setTitle(calendarRef.current.getApi().view.title);
                }}
                className="px-2.5 py-1 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md text-sm font-medium"
              >
                &gt;
              </button>
            </div>
            <span className="text-white font-semibold text-lg">{title}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* View Switcher */}
            <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
              {[
                { id: 'dayGridMonth', label: 'Month' },
                { id: 'timeGridWeek', label: 'Week' },
                { id: 'timeGridDay', label: 'Day' },
                { id: 'listMonth', label: 'Agenda' }
              ].map(view => (
                <button
                  key={view.id}
                  onClick={() => {
                    calendarRef.current.getApi().changeView(view.id)
                    setCurrentView(view.id)
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    currentView === view.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {/* Auto-Generate */}
            <button 
              onClick={handleGenerateCalendar} 
              disabled={isAutoGenerating} 
              className="flex items-center px-4 py-2 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 hover:bg-brand-blue/20 rounded-lg text-sm font-medium transition-colors"
            >
              {isAutoGenerating ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isAutoGenerating ? 'Generating AI Posts...' : 'Auto-Generate Calendar'}
            </button>
          </div>
        </div>

        {/* Calendar Box */}
        <div className="glass rounded-3xl p-4" style={{ minHeight: 600 }}>
          <p className="text-brand-muted text-sm mb-4 px-2">Drag and drop posts to reschedule, or click an empty date/time slot to generate a post.</p>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            events={events}
            editable={true}
            droppable={true}
            eventDrop={handleEventDrop}
            height="auto"
            nowIndicator={true}
            scrollTime="08:00:00"
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            datesSet={handleDatesSet}
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

        {/* Reschedule Dialog Modal */}
        <RescheduleDialog
          isOpen={rescheduleDialog.isOpen}
          post={rescheduleDialog.post}
          newDate={rescheduleDialog.newDate}
          newTime={rescheduleDialog.newTime}
          onConfirm={handleRescheduleConfirm}
          onCancel={handleRescheduleCancel}
        />
      </div>
    </AnimatedPage>
  )
}
