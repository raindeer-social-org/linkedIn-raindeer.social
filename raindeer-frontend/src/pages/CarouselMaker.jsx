import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { useBrandStore } from '@/store'
import { Sparkles, Send, ArrowRight, CheckCircle2, Loader2, Linkedin } from 'lucide-react'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function CarouselMaker() {
  const { brandId, brandName } = useBrandStore()
  
  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AI Carousel Designer. What topic should we build a LinkedIn carousel about today?" }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  
  const chatScrollRef = useRef(null)

  // Slides state
  const [slides, setSlides] = useState([
    { id: '1', type: 'cover', title: 'Your Carousel Preview', subtitle: 'Chat with AI to generate slides', points: [] }
  ])

  const slideRefs = useRef({})

  const handleSendMessage = async (e) => {
    e?.preventDefault()
    if (!inputValue.trim() || !brandId) return

    const userMessage = { role: 'user', content: inputValue }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue('')
    setIsGenerating(true)

    // Scroll to bottom
    setTimeout(() => {
      chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)

    try {
      // Send only user and assistant messages that contain strings (instructions)
      const apiMessages = updatedMessages.filter(m => typeof m.content === 'string')

      const res = await fetch('http://localhost:3001/api/generate/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, messages: apiMessages })
      })
      const data = await res.json()
      
      if (data.success && data.slides) {
        const formattedSlides = data.slides.map((s, i) => ({ ...s, id: `ai-${Date.now()}-${i}` }))
        setSlides(formattedSlides)
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've generated the slides for you! Take a look at the preview on the right. If you want to change anything (e.g., 'Make the 3rd slide punchier' or 'Change the cover subtitle'), just let me know!" 
        }])
      } else {
        toast.error('Failed to generate slides.')
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into an error generating those slides. Could you try again?" }])
      }
    } catch (err) {
      console.error(err)
      toast.error('AI generation error.')
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into an error. Please try again." }])
    } finally {
      setIsGenerating(false)
      setTimeout(() => {
        chatScrollRef.current?.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
  }

  const publishToLinkedIn = async () => {
    if (slides.length <= 1) return toast.error('Generate some slides first!')
    setIsPublishing(true)
    const toastId = toast.loading('Generating PDF and pushing to LinkedIn...')

    try {
      // 1. Generate PDF Blob
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] })

      for (let i = 0; i < slides.length; i++) {
        const slideElement = slideRefs.current[slides[i].id]
        if (!slideElement) continue

        const canvas = await html2canvas(slideElement, {
          scale: 2, useCORS: true, backgroundColor: null,
          width: 1080, height: 1080, windowWidth: 1080, windowHeight: 1080
        })

        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1080)
      }

      const pdfBlob = pdf.output('blob')

      // 2. Upload to Backend API
      const formData = new FormData()
      formData.append('document', pdfBlob, 'carousel.pdf')
      formData.append('title', slides[0].title || 'LinkedIn Carousel')

      const uploadRes = await fetch(`http://localhost:3001/api/posts/carousel-publish/${brandId}`, {
        method: 'POST',
        body: formData
      })

      const uploadData = await uploadRes.json()

      if (uploadData.success) {
        toast.success('Successfully published to LinkedIn!', { id: toastId })
        setMessages(prev => [...prev, { role: 'assistant', content: "🎉 Awesome! Your carousel has been successfully pushed live to your LinkedIn feed." }])
      } else {
        throw new Error(uploadData.error || 'Failed to publish')
      }
    } catch (err) {
      console.error(err)
      toast.error('LinkedIn API blocked direct publishing. Downloading PDF to your computer instead!', { id: toastId, duration: 6000 })
      
      // Fallback: If LinkedIn API fails due to app permissions, just download it to the user's machine
      try {
        const fallbackPdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [1080, 1080] })
        for (let i = 0; i < slides.length; i++) {
          const slideElement = slideRefs.current[slides[i].id]
          if (!slideElement) continue
          const canvas = await html2canvas(slideElement, { scale: 2, useCORS: true, backgroundColor: null, width: 1080, height: 1080 })
          if (i > 0) fallbackPdf.addPage()
          fallbackPdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 1080, 1080)
        }
        fallbackPdf.save('linkedin-carousel-fallback.pdf')
        setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ It looks like your LinkedIn App doesn't have the permissions required to push PDFs directly yet. I've downloaded the pristine PDF to your computer instead! You can upload it manually to LinkedIn." }])
      } catch(e) {
        console.error('Fallback download failed', e)
      }
    } finally {
      setIsPublishing(false)
    }
  }

  // Beautiful render component for a single slide
  const SlidePreview = ({ slide, index }) => (
    <div 
      ref={el => slideRefs.current[slide.id] = el}
      className="w-[1080px] h-[1080px] absolute top-[-9999px] left-[-9999px] flex flex-col justify-center px-32 bg-[#0B1320] text-white relative overflow-hidden"
      style={{
        transform: 'scale(0.35)',
        transformOrigin: 'top left',
        position: 'relative',
        top: 'auto', left: 'auto',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '-680px'
      }}
    >
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-blue/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full">
        {slide.type === 'cover' && (
          <div className="text-left">
            <h1 className="text-[100px] font-bold leading-[1.1] tracking-tight mb-8 bg-gradient-to-br from-white to-white/70 text-transparent bg-clip-text">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-[48px] text-brand-blue-glow font-medium">{slide.subtitle}</p>
            )}
          </div>
        )}

        {slide.type === 'content' && (
          <div className="text-left w-full h-full flex flex-col justify-center">
            <h2 className="text-[72px] font-bold leading-[1.15] mb-16 text-white">{slide.title}</h2>
            <div className="space-y-10">
              {slide.points?.map((p, i) => (
                <div key={i} className="flex items-start gap-8">
                  <div className="w-8 h-8 rounded-full bg-brand-blue mt-4 flex-shrink-0" />
                  <p className="text-[48px] leading-snug text-white/90">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {slide.type === 'cta' && (
          <div className="text-center w-full flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-brand-blue to-emerald-500 mb-12 flex items-center justify-center shadow-[0_0_80px_rgba(30,107,255,0.4)]">
              <span className="text-6xl font-bold text-white">{brandName?.charAt(0) || 'B'}</span>
            </div>
            <h2 className="text-[80px] font-bold mb-6 text-white">{slide.title}</h2>
            <p className="text-[42px] text-white/70">{slide.text || slide.subtitle}</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-20 left-32 right-32 flex justify-between items-center text-[32px] font-medium text-white/40">
        <span>{brandName || 'My Brand'}</span>
        <div className="flex items-center gap-4">
          <span>{index + 1} / {slides.length}</span>
          {index < slides.length - 1 && <ArrowRight size={40} className="text-brand-blue" />}
        </div>
      </div>
    </div>
  )

  return (
    <AnimatedPage>
      <div className="h-[calc(100vh-64px)] flex overflow-hidden">
        
        {/* Left Side: AI Chat Studio */}
        <div className="w-[450px] border-r border-white/10 bg-[#07111F]/80 backdrop-blur-xl flex flex-col h-full relative z-20 shadow-2xl">
          <div className="p-6 border-b border-white/10 bg-[#07111F]">
            <h1 className="text-xl font-bold text-brand-white mb-1 flex items-center gap-2">
              <Sparkles size={20} className="text-brand-blue" />
              AI Carousel Studio
            </h1>
            <p className="text-brand-muted text-sm">Talk to AI to build and edit your slides.</p>
          </div>

          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-[14px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand-blue text-white rounded-br-none' 
                    : 'bg-white/5 border border-white/10 text-brand-white rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/10 text-brand-muted rounded-2xl rounded-bl-none px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-brand-blue" />
                    <span className="text-sm">Designing slides...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t border-white/10 bg-[#07111F]">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                placeholder="Message AI Designer..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-brand-white focus:outline-none focus:border-brand-blue transition-colors"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isGenerating}
                className="absolute right-2 top-2 bottom-2 aspect-square bg-brand-blue hover:bg-brand-blue-mid text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Live Preview Canvas */}
        <div className="flex-1 bg-black/40 overflow-y-auto custom-scrollbar flex flex-col relative">
          
          {/* Sticky Header with Push Button */}
          <div className="sticky top-0 left-0 right-0 p-6 flex justify-end z-30 bg-gradient-to-b from-[#07111F] to-transparent pointer-events-none">
            <button 
              onClick={publishToLinkedIn}
              disabled={isPublishing || slides.length <= 1}
              className="pointer-events-auto bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isPublishing ? <Loader2 size={18} className="animate-spin" /> : <Linkedin size={18} />}
              {isPublishing ? 'Publishing...' : 'Push to LinkedIn'}
            </button>
          </div>

          <div className="flex flex-col items-center pb-32 pt-8 space-y-12">
            {slides.map((slide, i) => (
              <div key={slide.id} className="relative group shadow-2xl">
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-brand-muted font-mono font-bold text-lg opacity-50 group-hover:opacity-100 transition-opacity">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="rounded-2xl overflow-hidden relative" style={{ width: '380px', height: '380px', backgroundColor: '#0B1320' }}>
                   <SlidePreview slide={slide} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AnimatedPage>
  )
}
