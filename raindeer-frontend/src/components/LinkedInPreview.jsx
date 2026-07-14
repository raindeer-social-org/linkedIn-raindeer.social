import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, X, ThumbsUp, MessageSquare, Repeat2, Send, Sparkles, Loader2, Calendar, Clock, ChevronRight, Trash2, BarChart2, CheckCircle, AlertCircle, Bold, Italic, Eraser, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui';
import { Modal } from '@/components/ui/Modal';
import { useBrandStore } from '@/store';
import toast from 'react-hot-toast';

export default function LinkedInPreview({ post, brandName, avatar, onClose, onUpdate }) {
  const { token } = useBrandStore();
  const [content, setContent] = useState(post?.content || '');
  const [instruction, setInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState(post?.customImageUrl || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Scheduling state
  const [showScheduler, setShowScheduler] = useState(false);
  const existingDate = post?.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const existingTime = post?.scheduledTime || '';
  const [scheduleDate, setScheduleDate] = useState(existingDate);
  const [scheduleTime, setScheduleTime] = useState(existingTime);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const editorRef = useRef(null);

  // Organizations / Destination state
  const [organizations, setOrganizations] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);

  if (!post) return null;

  useEffect(() => {
    if (post && post.brandId) {
      const fetchOrgs = async () => {
        setIsLoadingOrgs(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/linkedin/organizations/${post.brandId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setOrganizations(data.organizations || []);
          }
        } catch (error) {
          console.error("Failed to fetch organizations", error);
        } finally {
          setIsLoadingOrgs(false);
        }
      };
      fetchOrgs();
    }
  }, [post, token]);

  const formatSelection = (type) => {
    if (!editorRef.current) return;
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    
    if (start === end) {
      toast.error('Please select some text to format');
      return;
    }

    const selectedText = content.substring(start, end);
    const chars = [...selectedText];
    
    const newText = chars.map(c => {
      if (type === 'clear') {
        const code = c.codePointAt(0);
        if (code >= 0x1D5D4 && code <= 0x1D5ED) return String.fromCharCode(code - 0x1D5D4 + 65);
        if (code >= 0x1D5EE && code <= 0x1D607) return String.fromCharCode(code - 0x1D5EE + 97);
        if (code >= 0x1D7EC && code <= 0x1D7F5) return String.fromCharCode(code - 0x1D7EC + 48);
        if (code >= 0x1D608 && code <= 0x1D621) return String.fromCharCode(code - 0x1D608 + 65);
        if (code >= 0x1D622 && code <= 0x1D63B) return String.fromCharCode(code - 0x1D622 + 97);
        if (code >= 0x1D63C && code <= 0x1D655) return String.fromCharCode(code - 0x1D63C + 65);
        if (code >= 0x1D656 && code <= 0x1D66F) return String.fromCharCode(code - 0x1D656 + 97);
        return c;
      }

      if (c.length === 1) {
        const code = c.charCodeAt(0);
        if (type === 'bold') {
          if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D5D4);
          if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D5EE);
          if (code >= 48 && code <= 57) return String.fromCodePoint(code - 48 + 0x1D7EC);
        } else if (type === 'italic') {
          if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D608);
          if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D622);
        } else if (type === 'boldItalic') {
          if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D63C);
          if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D656);
        }
      }
      return c;
    }).join('');

    const updatedContent = content.substring(0, start) + newText + content.substring(end);
    setContent(updatedContent);

    // Keep focus and selection after update
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(start, start + newText.length);
      }
    }, 0);
  };

  const handleEditAI = async () => {
    if (!instruction) {
      toast.error('Please enter an instruction for the AI');
      return;
    }
    setIsGenerating(true);
    const toastId = toast.loading('AI is rewriting your post...');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, instruction })
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.content);
        setInstruction('');
        toast.success('Post rewritten!', { id: toastId });
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error('Failed to rewrite post', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (status) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, status, authorUrn: selectedTarget || undefined, customImageUrl })
      });
      if (res.ok) {
        toast.success(status === 'PUBLISHED' ? 'Post pushed to LinkedIn!' : 'Post saved successfully');
        onUpdate();
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Post deleted successfully');
        setShowDeleteConfirm(false);
        onUpdate();
        onClose();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSchedule = async () => {
    if (!scheduleDate) {
      toast.error('Please select a date');
      return;
    }
    setIsRescheduling(true);
    const toastId = toast.loading('Updating schedule...');
    try {
      // Save content changes first
      await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, status: 'SCHEDULED', authorUrn: selectedTarget || undefined, customImageUrl })
      });

      // Update date/time via reschedule endpoint
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: scheduleDate,
          scheduledTime: scheduleTime || null
        })
      });

      if (!res.ok) throw new Error('Failed to reschedule');

      toast.success(
        scheduleTime
          ? `Scheduled for ${scheduleDate} at ${scheduleTime}`
          : `Scheduled for ${scheduleDate}`,
        { id: toastId }
      );
      setShowScheduler(false);
      onUpdate();
    } catch (err) {
      toast.error('Failed to update schedule', { id: toastId });
    } finally {
      setIsRescheduling(false);
    }
  };

  // Format existing schedule for display in the button
  const formattedSchedule = (() => {
    try {
      const d = new Date(post.date);
      const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return post.scheduledTime ? `${dateStr} at ${post.scheduledTime}` : dateStr;
    } catch { return null; }
  })();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('brandId', post.brandId);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/custom-image`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setCustomImageUrl(data.url);
        toast.success('Image uploaded');
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const previewImageUrl = customImageUrl || (post.image && post.image.url);

  return (
    <>
      <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-hairline rounded-stage w-full max-w-4xl text-ink overflow-hidden shadow-lg flex flex-col md:flex-row max-h-[90vh]">
        {/* LEFT COLUMN: Editor Controls */}
        <div className="flex-1 border-r border-hairline bg-snow-2 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-hairline flex justify-between items-center bg-card">
            <h2 className="font-serif font-medium text-ink text-subtitle">Edit Post</h2>
            <button onClick={onClose} className="md:hidden p-1 hover:bg-snow-2 rounded-full text-ink-3">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider font-mono">Post Content</label>
                <div className="flex bg-card border border-hairline rounded-controls shadow-xs overflow-hidden">
                  <button onClick={() => formatSelection('bold')} className="p-1.5 hover:bg-snow-2 text-ink-2 border-r border-hairline" title="Bold"><Bold size={14} /></button>
                  <button onClick={() => formatSelection('italic')} className="p-1.5 hover:bg-snow-2 text-ink-2 border-r border-hairline" title="Italic"><Italic size={14} /></button>
                  <button onClick={() => formatSelection('boldItalic')} className="p-1.5 hover:bg-snow-2 text-ink-2 border-r border-hairline font-serif italic font-semibold text-xs w-7 h-7 flex items-center justify-center" title="Bold Italic">BI</button>
                  <button onClick={() => formatSelection('clear')} className="p-1.5 hover:bg-snow-2 text-ink-2" title="Clear Formatting"><Eraser size={14} /></button>
                </div>
              </div>
              <textarea
                ref={editorRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-48 p-3 text-small border border-hairline-bold rounded-controls focus:ring-4 focus:ring-cobalt-100 focus:border-cobalt-500 outline-none bg-card resize-none"
                placeholder="Write your post here..."
              />
            </div>

            <div className="bg-cobalt-50 p-4 rounded-containers border border-cobalt-100/50 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cobalt-700 font-semibold text-small">
                <Sparkles size={16} />
                Edit with AI
              </div>
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. 'Make it punchier' or 'Tighten style'"
                className="w-full p-2 text-small border border-hairline-bold rounded-controls bg-card focus:outline-none focus:border-cobalt-500"
                onKeyDown={(e) => e.key === 'Enter' && handleEditAI()}
              />
              <button
                onClick={handleEditAI}
                disabled={isGenerating || !instruction}
                className="flex items-center justify-center gap-2 w-full py-2 bg-cobalt-600 hover:bg-cobalt-700 text-white text-sm font-medium rounded-controls transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Apply AI Magic'}
              </button>
            </div>

            {/* AI Image Prompt Section */}
            {post.imagePrompt && (
              <div className="bg-snow-3 p-4 rounded-containers border border-hairline flex flex-col gap-3">
                <div className="flex items-center gap-2 text-ink-2 font-semibold text-small">
                  <ImageIcon size={16} />
                  AI Image Prompt Idea
                </div>
                <div className="text-xs text-ink bg-card p-3 rounded-controls border border-hairline">
                  {post.imagePrompt}
                </div>
              </div>
            )}

            {/* Custom Image Upload Section */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-ink-2 uppercase tracking-wider font-mono">Attach Custom Image</label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer flex flex-col items-center justify-center px-4 py-4 bg-card border-2 border-dashed border-hairline-bold rounded-controls hover:border-cobalt-500 hover:bg-cobalt-50/20 transition-colors">
                  <UploadCloud size={24} className="text-ink-3 mb-1" />
                  <span className="text-xs font-medium text-ink-2">
                    {isUploadingImage ? 'Uploading...' : 'Click to upload image'}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                </label>
                {customImageUrl && (
                  <button
                    onClick={() => setCustomImageUrl('')}
                    className="p-2 text-negative hover:bg-negative-wash rounded-controls transition-colors border border-negative/20"
                    title="Remove custom image"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>

            {post.analysis && (
              <div className="bg-card border border-hairline rounded-containers overflow-hidden shadow-xs">
                <div className="bg-snow-2 px-4 py-3 border-b border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <BarChart2 size={16} className="text-cobalt-600" />
                    AI Content Analysis
                  </div>
                  <div className="text-xs font-medium text-ink-3 bg-card px-2 py-1 rounded-controls border border-hairline">
                    {post.analysis.target_persona} • {post.analysis.content_type}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-caution-wash/50 p-3 rounded-containers border border-caution/15 flex flex-col items-center justify-center">
                      <div className="text-[10px] text-caution font-semibold mb-0.5 uppercase tracking-wide font-mono">Virality</div>
                      <div className="text-lg font-bold text-caution font-mono">{post.analysis.virality_score}%</div>
                    </div>
                    <div className="bg-cobalt-50 p-3 rounded-containers border border-cobalt-200/40 flex flex-col items-center justify-center">
                      <div className="text-[10px] text-cobalt-700 font-semibold mb-0.5 uppercase tracking-wide font-mono">Authority</div>
                      <div className="text-lg font-bold text-cobalt-700 font-mono">{post.analysis.authority_score}%</div>
                    </div>
                    <div className="bg-positive-wash/50 p-3 rounded-containers border border-positive/15 flex flex-col items-center justify-center">
                      <div className="text-[10px] text-positive font-semibold mb-0.5 uppercase tracking-wide font-mono">Lead Gen</div>
                      <div className="text-lg font-bold text-positive font-mono">{post.analysis.lead_generation_score}%</div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-positive flex items-center gap-1.5 mb-2">
                        <CheckCircle size={14} /> Strengths
                      </div>
                      <ul className="text-[11px] text-ink-2 space-y-1.5 list-disc pl-3">
                        {post.analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-caution flex items-center gap-1.5 mb-2">
                        <AlertCircle size={14} /> Weaknesses
                      </div>
                      <ul className="text-[11px] text-ink-2 space-y-1.5 list-disc pl-3">
                        {post.analysis.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2 pt-4">
              <div className="flex gap-2">
                <Button onClick={() => handleSave('DRAFT')} variant="secondary" disabled={isSaving || isDeleting} className="flex-1">
                  Save to Drafts
                </Button>
                <Button onClick={handleDelete} variant="secondary" disabled={isSaving || isDeleting} className="text-negative hover:bg-negative-wash border-negative/20 px-3">
                  <Trash2 size={18} />
                </Button>
              </div>

              {/* ── Update Schedule (expandable) ── */}
              <div className="border border-hairline rounded-containers overflow-hidden bg-card shadow-xs">
                <button
                  onClick={() => setShowScheduler(!showScheduler)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-snow-2 transition-colors text-sm font-semibold text-ink"
                >
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-cobalt-600" />
                    <span>Update Schedule</span>
                    {formattedSchedule && (
                      <span className="text-xs text-ink-3 font-normal font-mono">({formattedSchedule})</span>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-ink-3 transition-transform duration-200 ${showScheduler ? 'rotate-90' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {showScheduler && (
                    <div className="overflow-hidden border-t border-hairline bg-snow-2 p-4 flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-ink-2 uppercase tracking-wider font-mono flex items-center gap-1">
                          <Calendar size={12} /> Date
                        </label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-2 text-small border border-hairline-bold rounded-controls bg-card focus:outline-none focus:border-cobalt-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-ink-2 uppercase tracking-wider font-mono flex items-center gap-1">
                          <Clock size={12} /> Time
                          <span className="text-ink-3 font-normal font-sans ml-1">(optional)</span>
                        </label>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full p-2 text-small border border-hairline-bold rounded-controls bg-card focus:outline-none focus:border-cobalt-500"
                        />
                      </div>

                      <Button
                        onClick={handleUpdateSchedule}
                        disabled={isRescheduling || !scheduleDate}
                        fullWidth
                      >
                        {isRescheduling ? (
                          <><Loader2 size={15} className="animate-spin mr-1" /> Saving...</>
                        ) : (
                          <><Calendar size={15} className="mr-1" /> Confirm Schedule</>
                        )}
                      </Button>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Destination Selection ── */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[10px] font-semibold text-ink-2 uppercase tracking-wider font-mono">Post Destination</label>
                <div className="relative">
                  <select
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    disabled={isLoadingOrgs}
                    className="w-full appearance-none bg-card border border-hairline-bold text-ink py-2 px-3 pr-8 rounded-controls shadow-xs focus:outline-none focus:border-cobalt-500 text-xs font-semibold disabled:opacity-60 cursor-pointer"
                  >
                    <option value="">👤 Personal Profile</option>
                    {organizations.map(org => (
                      <option key={org.urn} value={org.urn}>🏢 {org.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink-3">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSave('PUBLISHED')}
                disabled={isSaving}
                className="w-full mt-2"
                size="lg"
              >
                <Send size={16} className="mr-1" /> Publish Now
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LinkedIn Live Preview */}
        <div className="w-full md:w-[480px] bg-[#f3f2ef] flex flex-col relative overflow-hidden">
          <div className="hidden md:flex items-center justify-between p-3 border-b border-gray-200 bg-white">
            <h2 className="text-xs font-semibold text-gray-700">Live LinkedIn Preview</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200/50">
              <div className="p-4">
                <div className="flex gap-3 mb-3">
                  <img
                    src={avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(brandName)}
                    className="w-12 h-12 rounded-full border border-gray-200"
                    alt="avatar"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 leading-tight hover:text-blue-600 cursor-pointer">{brandName}</h3>
                        <p className="text-xs text-gray-500 leading-tight">Brand / Company</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">Just now • 🌐</p>
                      </div>
                      <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[14px] leading-relaxed text-gray-900 whitespace-pre-wrap break-words mb-3">
                  {content || 'Your post content will appear here...'}
                </div>
              </div>

              {previewImageUrl && (
                <div className="w-full border-t border-gray-100">
                  <img src={previewImageUrl} alt="Post content" className="w-full object-cover max-h-[400px]" />
                </div>
              )}

              <div className="px-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-600 rounded-full p-0.5 text-white">
                      <ThumbsUp size={10} fill="white" />
                    </span>
                    <span>0</span>
                  </div>
                </div>

                <div className="flex justify-between mt-1 pb-1">
                  {[
                    { icon: ThumbsUp, label: 'Like' },
                    { icon: MessageSquare, label: 'Comment' },
                    { icon: Repeat2, label: 'Repost' },
                    { icon: Send, label: 'Send' }
                  ].map(Action => (
                    <button
                      key={Action.label}
                      className="flex items-center gap-2 text-gray-500 font-semibold text-[13px] hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                    >
                      <Action.icon size={18} />
                      <span className="hidden sm:inline">{Action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <Modal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="text-ink-2 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>
            Delete Post
          </Button>
        </div>
      </Modal>
    </>
  );
}
