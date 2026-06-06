import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { AnimatedPage } from '@/components/layout/AnimatedPage'
import { Button } from '@/components/ui'
import { useBrandStore } from '@/store'
import { Upload, Loader2, Linkedin, CheckCircle2, Link as LinkIcon } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Settings() {
  const store = useBrandStore()
  const fileInputRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()

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
    const error = searchParams.get('error')
    const success = searchParams.get('linkedin')
    
    if (error) {
      toast.error(`LinkedIn connection failed: ${error}`)
      setSearchParams({})
    } else if (success === 'success') {
      toast.success('Successfully connected to LinkedIn!')
      store.setBrand({ linkedInConnected: true })
      setSearchParams({})
    }
  }, [searchParams, setSearchParams, store])

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

      const res = await fetch('http://localhost:3001/api/upload/logo', {
        method: 'POST',
        body: uploadData
      })
      
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      // Now save the logoUrl to the Brand
      const updateRes = await fetch(`http://localhost:3001/api/brand/${store.brandId}`, {
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
      const res = await fetch(`http://localhost:3001/api/brand/${store.brandId}`, {
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

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-white" style={{ letterSpacing: '-0.02em' }}>Brand Settings</h1>
          <p className="text-brand-muted text-sm mt-1">Manage your brand identity, logos, and connected applications.</p>
        </div>

        {/* Logo Section */}
        <div className="glass rounded-2xl p-8 border border-white/5 shadow-glow-sm">
          <h2 className="text-lg font-semibold text-white mb-4">Brand Logo</h2>
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-brand-blue">{store.brandName ? store.brandName.charAt(0) : 'R'}</span>
              )}
            </div>
            
            <div>
              <p className="text-sm text-brand-muted mb-4 max-w-md">
                This logo will be used across your workspace and when generating preview content. Recommended size is 256x256px.
              </p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingLogo} variant="outline">
                {isUploadingLogo ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload New Logo
              </Button>
            </div>
          </div>
        </div>

        {/* Brand Identity Form */}
        <div className="glass rounded-2xl p-8 border border-white/5 shadow-glow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Brand Identity</h2>
            <Button onClick={handleSaveIdentity} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">Brand Name</label>
              <input type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-blue outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">Website URL</label>
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-muted mb-1">Product/Service</label>
              <input type="text" name="product" value={formData.product} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-brand-muted mb-1">Unique Selling Proposition (USP)</label>
              <textarea name="usp" value={formData.usp} onChange={handleInputChange} className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-blue outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">Target Audience</label>
              <textarea name="audience" value={formData.audience} onChange={handleInputChange} className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-blue outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-muted mb-1">Audience Pain Points</label>
              <textarea name="audiencePainPoints" value={formData.audiencePainPoints} onChange={handleInputChange} className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-brand-blue outline-none resize-none" />
            </div>
          </div>
        </div>

        {/* Connected Applications */}
        <div className="glass rounded-2xl p-8 border border-white/5 shadow-glow-sm">
          <h2 className="text-lg font-semibold text-white mb-6">Connected Applications</h2>
          
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0A66C2] rounded-lg flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">LinkedIn</h3>
                <p className="text-xs text-brand-muted">Post directly to your company page.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {store.linkedInConnected ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-500">Connected</span>
                  </div>
                  <Button 
                    onClick={() => {
                      store.setBrand({ linkedInConnected: false });
                      toast.success('Disconnected from LinkedIn. You can now test the real OAuth flow.');
                    }} 
                    variant="outline"
                    className="text-xs py-1 h-8"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => window.location.href = `http://localhost:3001/api/linkedin/auth?brandId=${store.brandId}`} 
                  className="bg-[#0A66C2] hover:bg-[#004182] text-white gap-2"
                >
                  <LinkIcon size={16} /> Connect Account
                </Button>
              )}
            </div>
          </div>
        </div>

      </div>
    </AnimatedPage>
  )
}
