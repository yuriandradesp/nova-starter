"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/auth-context';
import { useToast } from '../../../../src/components/ui/toast';
import { Input } from '../../../../src/components/ui/input';
import { api } from '../../../../lib/api';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial user data into form
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updateData: Record<string, string> = { name, email };
      // Only include password if the user actually typed something
      if (password) {
        updateData.password = password;
      }
      
      await api('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been successfully updated.',
        type: 'success',
      });
      
      setPassword(''); // Clear password field after successful update to prevent accidental resubmission
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: 'Update failed',
        description: err.message || 'Could not update your profile. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 lg:p-12 font-sans selection:bg-zinc-800 selection:text-white flex justify-center">
      <div className="w-full max-w-3xl space-y-8 mt-10">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Profile Settings</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Update your personal information and manage your account security.
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 opacity-20"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information Section */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-zinc-200">Personal Information</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="Full name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="pt-8 border-t border-zinc-800/60 space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-200">Security</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Leave the password field blank if you do not want to change it.
                </p>
              </div>
              <div className="max-w-md">
                <Input
                  label="New password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </div>
            
          </form>
        </div>
        
      </div>
    </div>
  );
}
