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
  const [selectedImages, setSelectedImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAutoGenerating, setIsAutoGenerating] = useState(false)
  
  const [isAutoGenerateModalOpen, setIsAutoGenerateModalOpen] = useState(false)
  const [bulkSettings, setBulkSettings] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    postsPerDay: 1,
    generationMode: 'prompt_only'
  })
  
  const [isSingleDateModalOpen, setIsSingleDateModalOpen] = useState(false)
  const [singleDateStrategy, setSingleDateStrategy] = useState('prompt_only')
  const [singleDateCustomPrompt, setSingleDateCustomPrompt] = useState('')
  
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

  const handleGenerateCalendar = () => {
    setIsAutoGenerateModalOpen(true);
  }

  const handleBulkGenerate = async () => {
    setIsAutoGenerateModalOpen(false);
    setIsAutoGenerating(true);
    const toastId = toast.loading('Auto-generating bulk posts...');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          brandId,
          ...bulkSettings
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Generated ${data.count} posts successfully!`, { id: toastId });
        await fetchPosts();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Error generating calendar', { id: toastId });
    } finally {
      setIsAutoGenerating(false);
    }
  }

  const handleEventClick = (info) => {
    setSelectedPost(info.event.extendedProps.fullPost)
    setIsPreviewOpen(true)
  }

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr.split('T')[0])
    setSingleDateCustomPrompt('')
    setIsSingleDateModalOpen(true)
  }

  const handleSingleDateGenerate = async () => {
    if (singleDateStrategy === 'use_photos') {
      if (!availableImages || availableImages.length === 0) {
        toast.error('Please upload photos in the Photo Library tab first.')
        return
      }
      setIsSingleDateModalOpen(false)
      setSelectedImages([])
      setIsPhotoModalOpen(true)
      return
    }

    setIsSingleDateModalOpen(false)
    setIsGenerating(true)
    const toastId = toast.loading('AI is crafting your LinkedIn post...')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          brandId,
          startDate: selectedDate,
          endDate: selectedDate,
          postsPerDay: 1,
          generationMode: singleDateStrategy,
          customPrompt: singleDateCustomPrompt
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Post generated successfully!', { id: toastId })
        fetchPosts()
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

  const handleGenerateFromPhotos = async () => {
    if (selectedImages.length === 0) return
    setIsPhotoModalOpen(false)
    setIsGenerating(true)
    const toastId = toast.loading('AI is crafting your LinkedIn post...')

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId,
          imageIds: selectedImages.map(img => img.id),
          date: selectedDate,
          customPrompt: singleDateCustomPrompt
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Post generated successfully!', { id: toastId })
        // Update posts list in background
        fetchPosts()
        
        // Open preview with the newly generated post
        setSelectedPost(data.post)
        setIsPreviewOpen(true)
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
                    {availableImages?.map(img => {
                      const isSelected = selectedImages.some(i => i.id === img.id);
                      return (
                      <button 
                        key={img.id} 
                        onClick={() => {
                          if (isSelected) {
                            setSelectedImages(selectedImages.filter(i => i.id !== img.id))
                          } else {
                            setSelectedImages([...selectedImages, img])
                          }
                        }}
                        className={`group text-left relative rounded-xl overflow-hidden border ${isSelected ? 'border-brand-blue ring-2 ring-brand-blue' : 'border-white/10 hover:border-brand-blue'} bg-black/50 aspect-square transition-all focus:outline-none`}
                      >
                        <img src={img.url} alt={img.description} className={`w-full h-full object-cover transition-opacity ${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                          <p className="text-xs text-white line-clamp-2">{img.description}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-brand-blue text-white rounded-full p-1 shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          </div>
                        )}
                      </button>
                    )})}
                  </div>
                </div>
                
                <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                  <button onClick={() => setIsPhotoModalOpen(false)} className="px-4 py-2 text-sm text-brand-muted hover:text-white transition-colors">Cancel</button>
                  <button 
                    onClick={handleGenerateFromPhotos}
                    disabled={selectedImages.length === 0}
                    className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Post with {selectedImages.length} {selectedImages.length === 1 ? 'Photo' : 'Photos'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Single Date Modal */}
        <AnimatePresence>
          {isSingleDateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-brand-bg rounded-2xl border border-white/10 w-full max-w-md overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">Generate Post</h3>
                    <p className="text-xs text-brand-muted">For {selectedDate}</p>
                  </div>
                  <button onClick={() => setIsSingleDateModalOpen(false)} className="text-brand-muted hover:text-white p-2">✕</button>
                </div>
                
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-brand-muted">Content Strategy</label>
                    <select 
                      value={singleDateStrategy}
                      onChange={(e) => setSingleDateStrategy(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                    >
                      <option value="prompt_only">Text + AI Image Prompt (Recommended)</option>
                      <option value="text_only">Text Only</option>
                      <option value="use_photos">Use Existing Photos from Library</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-brand-muted">Custom Instructions (Optional)</label>
                    <textarea 
                      value={singleDateCustomPrompt}
                      onChange={(e) => setSingleDateCustomPrompt(e.target.value)}
                      placeholder="e.g. Write about our new product launch..."
                      className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-blue min-h-[80px] resize-none"
                    />
                  </div>
                </div>
                
                <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                  <button onClick={() => setIsSingleDateModalOpen(false)} className="px-4 py-2 text-sm text-brand-muted hover:text-white transition-colors">Cancel</button>
                  <button 
                    onClick={handleSingleDateGenerate}
                    className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Sparkles size={16} /> Generate Now
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Auto Generate Modal */}
        <AnimatePresence>
          {isAutoGenerateModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-brand-bg rounded-2xl border border-white/10 w-full max-w-md overflow-hidden flex flex-col shadow-2xl"
              >
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white">Auto-Generate Calendar</h3>
                    <p className="text-xs text-brand-muted">Fill your calendar with AI generated content</p>
                  </div>
                  <button onClick={() => setIsAutoGenerateModalOpen(false)} className="text-brand-muted hover:text-white p-2">✕</button>
                </div>
                
                <div className="p-5 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-brand-muted">Start Date</label>
                      <input 
                        type="date" 
                        value={bulkSettings.startDate}
                        onChange={(e) => setBulkSettings({ ...bulkSettings, startDate: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-brand-muted">End Date</label>
                      <input 
                        type="date" 
                        value={bulkSettings.endDate}
                        onChange={(e) => setBulkSettings({ ...bulkSettings, endDate: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-brand-muted">Posts per day</label>
                    <select 
                      value={bulkSettings.postsPerDay}
                      onChange={(e) => setBulkSettings({ ...bulkSettings, postsPerDay: parseInt(e.target.value) })}
                      className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                    >
                      <option value={1}>1 Post</option>
                      <option value={2}>2 Posts</option>
                      <option value={3}>3 Posts</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-brand-muted">Content Strategy</label>
                    <select 
                      value={bulkSettings.generationMode}
                      onChange={(e) => setBulkSettings({ ...bulkSettings, generationMode: e.target.value })}
                      className="bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-brand-blue"
                    >
                      <option value="prompt_only">Text + AI Image Prompt (Recommended)</option>
                      <option value="text_only">Text Only</option>
                      <option value="use_photos">Use Existing Photos from Library</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                  <button onClick={() => setIsAutoGenerateModalOpen(false)} className="px-4 py-2 text-sm text-brand-muted hover:text-white transition-colors">Cancel</button>
                  <button 
                    onClick={handleBulkGenerate}
                    className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Sparkles size={16} /> Generate Now
                  </button>
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
