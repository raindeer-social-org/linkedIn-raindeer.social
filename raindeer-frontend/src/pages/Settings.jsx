import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { Button, Badge } from '@/components/ui'
import { useBrandStore } from '@/store'
import { Upload, Loader2, Linkedin, CheckCircle2, Link as LinkIcon } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Settings() {
  const store = useBrandStore()
  const fileInputRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { setBrand } = store
  const hasHandledParams = useRef(false)

  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [formData, setFormData] = useState({
    brandName: store.brandName || '',
    website: store.website || '',
    product: store.product || '',
    usp: store.usp || '',
    audience: store.audience || '',
    audiencePainPoints: store.audiencePainPoints || '',
  })

  useEffect(() => {
    if (hasHandledParams.current) return
    const error = searchParams.get('error')
    const success = searchParams.get('linkedin')
    
    if (error) {
      toast.error(`LinkedIn connection failed: ${error}`)
      setSearchParams({})
      hasHandledParams.current = true
    } else if (success) {
      toast.success('Successfully connected to LinkedIn!')
      if (success === 'personal') {
        setBrand({ linkedinPersonalConnected: true })
      } else if (success === 'company') {
        setBrand({ linkedinCompanyConnected: true })
      } else {
        setBrand({ linkedinCompanyConnected: true, linkedinPersonalConnected: true })
      }
      setSearchParams({})
      hasHandledParams.current = true
    }
  }, [searchParams, setSearchParams, setBrand])

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!store.brandId) {
      toast.error('Brand ID missing. Please log in again.')
      return
    }

    setIsUploadingLogo(true)
    const toastId = toast.loading('Uploading logo...')
    
    try {
      const uploadData = new FormData()
      uploadData.append('brandId', store.brandId)
      uploadData.append('image', file)

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/logo`, {
        method: 'POST',
        body: uploadData
      })
      
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      const updateRes = await fetch(`${import.meta.env.VITE_API_URL}/api/brand/${store.brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: data.url })
      })

      const updateData = await updateRes.json()
      if (!updateData.success) throw new Error(updateData.error)

      store.setBrand({ logoUrl: data.url })
      toast.success('Logo updated successfully!', { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload logo', { id: toastId })
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleSaveIdentity = async () => {
    if (!store.brandId) return
    setIsSaving(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/brand/${store.brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      
      store.setBrand(formData)
      toast.success('Brand Identity updated successfully!')
    } catch (err) {
      toast.error(err.message || 'Failed to update settings')
    } finally {
      setIsSaving(false)
    }
  }

  const inputCls = 'w-full bg-card border border-hairline-bold rounded-controls px-4 py-2.5 text-ink placeholder-ink-3 text-small focus:outline-none focus:border-cobalt-500 focus:ring-4 focus:ring-cobalt-100 transition-all duration-dur-1'

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="font-serif text-3xl font-medium text-ink">Brand Settings</h1>
          <p className="text-xs text-ink-3 font-semibold uppercase tracking-wider font-mono mt-1">Manage your brand identity, logos, and connected applications.</p>
        </div>

        {/* Logo Section */}
        <div className="bg-card rounded-stage p-8 border border-hairline shadow-sm">
          <h2 className="text-lg font-serif font-medium text-ink mb-4">Brand Logo</h2>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-snow-3 border border-hairline flex items-center justify-center overflow-hidden shrink-0">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-cobalt-600">{store.brandName ? store.brandName.charAt(0) : 'R'}</span>
              )}
            </div>
            
            <div>
              <p className="text-sm text-ink-2 mb-4 max-w-md">
                This logo will be used across your workspace and when generating preview content. Recommended size is 256×256px.
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingLogo} variant="secondary">
                {isUploadingLogo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload New Logo
              </Button>
            </div>
          </div>
        </div>

        {/* Brand Identity Form */}
        <div className="bg-card rounded-stage p-8 border border-hairline shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-serif font-medium text-ink">Brand Identity</h2>
            <Button onClick={handleSaveIdentity} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Brand Name</label>
              <input type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Website URL</label>
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Product/Service</label>
              <input type="text" name="product" value={formData.product} onChange={handleInputChange} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Unique Selling Proposition (USP)</label>
              <textarea name="usp" value={formData.usp} onChange={handleInputChange} className={`${inputCls} h-24 resize-none`} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Target Audience</label>
              <textarea name="audience" value={formData.audience} onChange={handleInputChange} className={`${inputCls} h-24 resize-none`} />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-ink-2 mb-1.5 uppercase tracking-wider font-mono">Audience Pain Points</label>
              <textarea name="audiencePainPoints" value={formData.audiencePainPoints} onChange={handleInputChange} className={`${inputCls} h-24 resize-none`} />
            </div>
          </div>
        </div>

        {/* Connected Applications */}
        <div className="bg-card rounded-stage p-8 border border-hairline shadow-sm">
          <h2 className="text-lg font-serif font-medium text-ink mb-6">Connected Applications</h2>
          
          <div className="space-y-4">
            {/* Personal LinkedIn */}
            <div className="flex items-center justify-between p-5 bg-snow-2 border border-hairline rounded-containers hover:border-hairline-bold transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0A66C2] rounded-controls flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">Personal LinkedIn</h3>
                  <p className="text-xs text-ink-3">Post directly to your personal profile.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {store.linkedinPersonalConnected ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-positive" />
                      <span className="text-xs font-medium text-positive">Connected</span>
                    </div>
                    <Button 
                      onClick={() => {
                        store.setBrand({ linkedinPersonalConnected: false });
                        toast.success('Disconnected from Personal LinkedIn.');
                      }} 
                      variant="secondary"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/linkedin/auth/personal?brandId=${store.brandId}`} 
                    className="bg-[#0A66C2] hover:bg-[#004182] text-white gap-2"
                  >
                    <LinkIcon size={16} /> Connect Personal
                  </Button>
                )}
              </div>
            </div>

            {/* Company Pages */}
            <div className="flex items-center justify-between p-5 bg-snow-2 border border-hairline rounded-containers hover:border-hairline-bold transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0A66C2] rounded-controls flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink text-sm">LinkedIn Company Pages</h3>
                  <p className="text-xs text-ink-3">Post directly to company pages you administer.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {store.linkedinCompanyConnected ? (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-positive" />
                      <span className="text-xs font-medium text-positive">Connected</span>
                    </div>
                    <Button 
                      onClick={() => {
                        store.setBrand({ linkedinCompanyConnected: false });
                        toast.success('Disconnected from LinkedIn Company Pages.');
                      }} 
                      variant="secondary"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/linkedin/auth/company?brandId=${store.brandId}`} 
                    className="bg-[#0A66C2] hover:bg-[#004182] text-white gap-2"
                  >
                    <LinkIcon size={16} /> Connect Company Pages
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AnimatedPage>
  )
}
