import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui';

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={onCancel}
    >
      <div 
        className={`bg-card rounded-stage shadow-lg max-w-md w-full p-6 border border-hairline transition-all duration-300 transform ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-ink text-lg font-serif font-medium mb-4">Reschedule Post</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-ink-2">Move this post to:</p>
            <p className="text-ink font-semibold mt-1">
              {formatDate(newDate)} {newTime ? `at ${newTime}` : 'All day'}
            </p>
          </div>
          
          <hr className="border-hairline" />
          
          <div>
            <p className="text-[10px] text-ink-3 uppercase tracking-wider font-semibold font-mono mb-1.5">Post Preview</p>
            <p className="text-sm text-ink-2 italic line-clamp-2 leading-relaxed bg-snow-2 p-3 rounded-controls border border-hairline">
              {post?.content || 'No content preview available'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Confirm Reschedule
          </Button>
        </div>
      </div>
    </div>
  );
}
