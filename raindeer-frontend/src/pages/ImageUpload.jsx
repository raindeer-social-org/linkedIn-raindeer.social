import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, UploadCloud, X, Image as ImageIcon } from 'lucide-react'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { Button } from '@/components/ui'
import { useBrandStore } from '@/store'
import toast from 'react-hot-toast'

export default function ImageUpload() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { brandId } = useBrandStore()
  
  const [images, setImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [libraryImages, setLibraryImages] = useState([])

  const fetchLibrary = async () => {
    if (!brandId) return
    try {
      const res = await fetch(`http://localhost:3001/api/upload/brand/${brandId}`)
      const data = await res.json()
      if (data.success) {
        setLibraryImages(data.images)
      }
    } catch (err) {
      console.error('Failed to fetch library', err)
    }
  }

  useEffect(() => {
    fetchLibrary()
  }, [brandId])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 20) {
      toast.error('You can only upload up to 20 images.')
      return
    }
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      description: ''
    }))
    setImages(prev => [...prev, ...newImages].slice(0, 20))
  }

  const updateDescription = (index, desc) => {
    setImages(prev => {
      const copy = [...prev]
      copy[index].description = desc
      return copy
    })
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadAndContinue = async () => {
    if (!brandId) {
      toast.error('Missing Brand ID. Please complete the setup first.')
      return
    }

    setIsUploading(true)
    let uploadedCount = 0

    try {
      for (const img of images) {
        const formData = new FormData()
        formData.append('brandId', brandId)
        formData.append('image', img.file)
        formData.append('description', img.description)

        const res = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData
        })

        const data = await res.json()
        if (!data.success) throw new Error(data.error)
        uploadedCount++
      }
      toast.success(`Successfully uploaded ${uploadedCount} images.`)
      navigate('/dashboard/calendar')
    } catch (err) {
      console.error(err)
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const content = (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold text-brand-white mb-2" style={{ letterSpacing: '-0.02em' }}>Photo Library</h1>
        <p className="text-brand-muted text-sm">Upload 10-20 images and describe them. AI will use these to craft posts.</p>
      </motion.div>

            <div className="glass rounded-2xl p-8 border border-white/5 shadow-glow-sm">
              <div 
                className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-brand-blue/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
                <UploadCloud size={40} className="mx-auto text-brand-blue mb-4" />
                <p className="text-brand-white font-medium mb-1">Click to upload images</p>
                <p className="text-brand-muted text-xs">JPEG, PNG, WEBP (Max 20 images)</p>
              </div>

              {images.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-medium text-brand-white">Selected Images ({images.length}/20)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl relative border border-white/5 group">
                        <img src={img.preview} className="w-16 h-16 rounded-lg object-cover" alt="Preview" />
                        <div className="flex-1">
                          <input 
                            type="text"
                            value={img.description}
                            onChange={(e) => updateDescription(i, e.target.value)}
                            placeholder="What is happening in this picture?"
                            className="w-full bg-transparent border-b border-white/10 focus:border-brand-blue text-xs text-brand-white py-1 outline-none transition-colors"
                          />
                        </div>
                        <button 
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleUploadAndContinue} 
                  disabled={images.length === 0 || isUploading}
                  className="group"
                >
                  {isUploading ? 'Uploading...' : 'Upload Images'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {libraryImages.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-brand-white mb-6">Previously Uploaded Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {libraryImages.map(img => (
                    <div key={img.id} className="group text-left relative rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-square hover:border-brand-blue transition-colors">
                      <img src={img.url} alt={img.description} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                        <p className="text-xs text-white line-clamp-2">{img.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
  )

  return (
    <AnimatedPage>
      {content}
    </AnimatedPage>
  )
}
