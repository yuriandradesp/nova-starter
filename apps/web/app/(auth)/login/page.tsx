"use client";

import { useState } from 'react';
import { useAuth } from '../../../contexts/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800/80">
        <div className="mb-8 text-center">
          <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="text-zinc-950 font-bold text-xl">N</span>
          </div>
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Sign in to Nova</h1>
          <p className="text-zinc-400 mt-2 text-sm">Enter your details to access your workspace</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 text-sm text-red-400 bg-red-950/30 rounded-xl border border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-4 py-3 px-4 bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 text-sm text-center text-zinc-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-zinc-300 hover:text-zinc-100 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
