import React, { useEffect, useState } from 'react';

export default function RescheduleDialog({ isOpen, post, newDate, newTime, onConfirm, onCancel }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={onCancel}
    >
      <div 
        className={`bg-[#1e293b] rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-700 transition-all duration-300 transform ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white text-lg font-semibold mb-4">Reschedule Post</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Move this post to:</p>
            <p className="text-white font-medium mt-1">
              {formatDate(newDate)} {newTime ? `at ${newTime}` : 'All day'}
            </p>
          </div>
          
          <hr className="border-slate-700" />
          
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Post Preview</p>
            <p className="text-sm text-slate-300 italic line-clamp-2 leading-relaxed bg-[#0f172a] p-3 rounded-lg border border-slate-800">
              {post?.content || 'No content preview available'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-slate-600 hover:border-slate-500 rounded-lg text-sm font-medium text-white transition-colors bg-transparent"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}
