import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, X, ThumbsUp, MessageSquare, Repeat2, Send, Sparkles, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';

export default function LinkedInPreview({ post, brandName, avatar, onClose, onUpdate }) {
  if (!post) return null;

  const [content, setContent] = useState(post.content);
  const [instruction, setInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        body: JSON.stringify({ content, status })
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg w-full max-w-4xl text-black overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* LEFT COLUMN: Editor Controls */}
        <div className="flex-1 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <h2 className="font-semibold text-gray-800">Edit Post</h2>
            <button onClick={onClose} className="md:hidden p-1 hover:bg-gray-100 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Post Content</label>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-48 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Write your post here..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                <Sparkles size={16} />
                Edit with AI
              </div>
              <input 
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="e.g. 'Make it funnier' or 'Shorten it'"
                className="w-full p-2 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleEditAI()}
              />
              <button 
                onClick={handleEditAI}
                disabled={isGenerating || !instruction}
                className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : 'Apply AI Magic'}
              </button>
            </div>
            
            <div className="mt-auto flex flex-col gap-2 pt-4">
               <Button onClick={() => handleSave('DRAFT')} variant="outline" className="w-full text-gray-700 border-gray-300">
                 Save to Drafts
               </Button>
               <div className="flex gap-2">
                 <Button onClick={() => handleSave('SCHEDULED')} variant="outline" className="flex-1 text-gray-700 border-gray-300 flex items-center justify-center gap-2">
                   <Calendar size={16} /> Update Schedule
                 </Button>
                 <Button onClick={() => handleSave('PUBLISHED')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                   <Send size={16} /> Publish Now
                 </Button>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LinkedIn Live Preview */}
        <div className="w-full md:w-[480px] bg-[#f3f2ef] flex flex-col relative">
          <div className="hidden md:flex items-center justify-between p-3 border-b border-gray-200 bg-white">
            <h2 className="text-sm font-semibold text-gray-700">Live LinkedIn Preview</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex gap-3 mb-3">
                  <img src={avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(brandName)} className="w-12 h-12 rounded-full" alt="avatar" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-sm leading-tight hover:text-blue-600 cursor-pointer">{brandName}</h3>
                        <p className="text-xs text-gray-500 leading-tight">Brand / Company</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          Just now • 🌐
                        </p>
                      </div>
                      <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"><MoreHorizontal size={20} /></button>
                    </div>
                  </div>
                </div>

                <div className="text-[14px] leading-relaxed text-gray-900 whitespace-pre-wrap break-words mb-3">
                  {content || "Your post content will appear here..."}
                </div>
              </div>

              {post.image && (
                <div className="w-full">
                  <img src={post.image.url} alt="Post content" className="w-full object-cover max-h-[400px]" />
                </div>
              )}

              <div className="px-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="bg-blue-600 rounded-full p-0.5 text-white"><ThumbsUp size={10} fill="white" /></span>
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
                    <button key={Action.label} className="flex items-center gap-2 text-gray-500 font-semibold text-[14px] hover:bg-gray-100 px-3 py-3 rounded-md transition-colors">
                      <Action.icon size={20} />
                      <span className="hidden sm:inline">{Action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
