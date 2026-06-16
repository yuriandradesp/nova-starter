"use client";

import { useAuth } from '../../../contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, LayoutDashboard, Settings, Users, FolderKanban, Search, Bell, Trash2, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import { api } from '../../../lib/api';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const activeWorkspace = user?.memberships?.[0]?.organization?.name || 'No Workspace';
  const activeWorkspaceId = user?.memberships?.[0]?.organizationId;
  const firstInitial = user ? (user.name || user.email).charAt(0).toUpperCase() : '';

  useEffect(() => {
    if (activeWorkspaceId) {
      Cookies.set('nova_org_id', activeWorkspaceId);
      fetchProjects();
    }
  }, [activeWorkspaceId]);

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const data = await api('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setIsCreating(true);
      await api('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: newProjectName }),
      });
      setNewProjectName('');
      await fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await api(`/projects/${projectId}`, {
        method: 'DELETE',
      });
      await fetchProjects();
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-zinc-800 border-t-zinc-400 rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 text-sm">Preparing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* Sidebar - Fixed left */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800/60 bg-zinc-950">
        {/* Brand Area */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-zinc-950 font-bold text-sm">N</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Nova.</h1>
          </div>
        </div>
        
        {/* Workspace Selector */}
        <div className="p-4">
          <div className="flex items-center px-3 py-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer transition-colors">
            <div className="h-6 w-6 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-300 text-xs font-semibold mr-3">
              {activeWorkspace.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <span className="block text-sm font-medium text-zinc-200 truncate">
                {activeWorkspace}
              </span>
              <span className="block text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">
                Pro Plan
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <a href="#" className="flex items-center px-3 py-2.5 bg-zinc-900 text-zinc-100 rounded-lg text-sm font-medium">
            <LayoutDashboard size={18} className="mr-3 text-zinc-400" />
            Overview
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 rounded-lg text-sm font-medium transition-colors">
            <FolderKanban size={18} className="mr-3 opacity-70" />
            Projects
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 rounded-lg text-sm font-medium transition-colors">
            <Users size={18} className="mr-3 opacity-70" />
            Team
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 rounded-lg text-sm font-medium transition-colors">
            <Settings size={18} className="mr-3 opacity-70" />
            Settings
          </a>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-zinc-800/60">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 rounded-lg transition-colors group"
          >
            <LogOut size={18} className="mr-3 opacity-70 group-hover:text-red-400 transition-colors" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-zinc-100">Nova.</span>
          </div>

          <div className="hidden md:flex items-center flex-1">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 placeholder-zinc-600 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-zinc-200 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="h-6 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-300 hidden sm:block">
                {user.name || user.email}
              </span>
              <button className="h-8 w-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-200 text-sm font-medium transition-colors ring-2 ring-zinc-900">
                {firstInitial}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100 tracking-tight">Overview</h2>
              <p className="mt-1 text-zinc-400 text-sm">Welcome back, {user.name?.split(' ')[0] || 'User'}. {"Here's"} what{"'s"} happening.</p>
            </div>

            {/* Hero Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden shadow-sm">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Active Workspace</h3>
                </div>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">{activeWorkspace}</h1>
                
                <div className="mt-6 pt-6 border-t border-zinc-800/50 max-w-2xl">
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    Your environment is fully configured. Start managing your projects, inviting your team, and monitoring your application metrics right from this dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Projects CRUD Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-zinc-100">Projects</h3>
              </div>

              {/* Create Project Form */}
              <form onSubmit={handleCreateProject} className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="New project name..." 
                  className="flex-1 max-w-sm px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-4 py-2.5 bg-zinc-100 hover:bg-white active:bg-zinc-200 text-zinc-950 font-medium rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  {isCreating ? 'Creating...' : 'Create Project'}
                </button>
              </form>

              {/* Projects List */}
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden">
                {isLoadingProjects ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">Loading projects...</div>
                ) : projects.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500 text-sm">No projects found. Create one above!</div>
                ) : (
                  <ul className="divide-y divide-zinc-800/60">
                    {projects.map((project) => (
                      <li key={project.id} className="p-4 hover:bg-zinc-900/50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                            <FolderKanban size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{project.name}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Created {new Date(project.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete project"
                        >
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
