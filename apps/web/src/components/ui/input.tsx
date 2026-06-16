import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    const inputId = props.id || label?.replace(/\s+/g, '-').toLowerCase() || Math.random().toString(36).substring(7);
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-3 bg-zinc-900 border ${
            error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-zinc-800 focus:ring-zinc-600'
          } rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
