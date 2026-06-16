"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {title && <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">{title}</h2>}
              {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
            </div>
            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="mt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
