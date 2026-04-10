import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, Copy, 
  FolderOpen, Calendar, Users, Eye, Loader2, X, CheckCircle, 
  AlertCircle, Sparkles, ChevronRight, FileText, LayoutGrid, 
  List as ListIcon, Clock, Clapperboard
} from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api.js';

// Helper to generate consistent gradients for projects without thumbnails
const getProjectGradient = (title = '') => {
  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-[#F28C00] to-orange-600', // Brand color variant
    'from-rose-500 to-red-600',
    'from-[#0A233A] to-blue-900',  // Brand color variant
    'from-violet-500 to-purple-600',
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export default function ProjectsPanel({ onSelectProject }) {
  // API & Data State
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // UI Control State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Modal & Interaction State
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scriptText: ''
  });

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Escape key handler for modals and dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setIsDeleteModalOpen(false);
        setOpenMenuId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-menu-trigger]') && !e.target.closest('[data-menu]')) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  // --- Notification System ---
  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  // --- API Handlers ---
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProjects();
      if (response.success) {
        setProjects(response.data || []);
      } else {
        setError(response.error?.message || 'Failed to load projects');
      }
    } catch (err) {
      setError('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateProject = async () => {
    if (!formData.title.trim()) {
      showNotification('Project title is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingProject) {
        const response = await updateProject(editingProject.id, {
          title: formData.title,
          description: formData.description,
          script_text: formData.scriptText,
        });

        if (response.success) {
          setProjects(prev => prev.map(p => p.id === editingProject.id ? response.data : p));
          showNotification('Project updated successfully');
          setShowModal(false);
          handleResetForm();
        } else {
          showNotification(response.error?.message || 'Failed to update project', 'error');
        }
      } else {
        const response = await createProject(formData.title, formData.description, formData.scriptText);
        if (response.success) {
          setProjects(prev => [response.data, ...prev]);
          showNotification('Project created successfully');
          setShowModal(false);
          handleResetForm();
        } else {
          showNotification(response.error?.message || 'Failed to create project', 'error');
        }
      }
    } catch (err) {
      showNotification('Operation failed: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setSubmitting(true);
      const response = await deleteProject(projectToDelete.id);
      if (response.success) {
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
        showNotification('Project deleted successfully');
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
      } else {
        showNotification(response.error?.message || 'Failed to delete project', 'error');
      }
    } catch (err) {
      showNotification('Failed to delete project: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicateProject = async (project) => {
    try {
      setSubmitting(true);
      const response = await createProject(
        `${project.title} (Copy)`,
        project.description,
        project.script_text
      );

      if (response.success) {
        setProjects(prev => [response.data, ...prev]);
        showNotification('Project duplicated successfully');
        setOpenMenuId(null);
      } else {
        showNotification(response.error?.message || 'Failed to duplicate project', 'error');
      }
    } catch (err) {
      showNotification('Failed to duplicate project: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Interaction Handlers ---
  const handleResetForm = () => {
    setFormData({ title: '', description: '', scriptText: '' });
    setEditingProject(null);
  };

  const handleOpenCreateModal = () => {
    handleResetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (project) => {
    setFormData({
      title: project.title,
      description: project.description || '',
      scriptText: project.script_text || ''
    });
    setEditingProject(project);
    setShowModal(true);
    setOpenMenuId(null);
  };

  // --- Processing & Formatting ---
  const processedProjects = useMemo(() => {
    let result = [...projects];

    // Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0);
      const dateB = new Date(b.updated_at || b.created_at || 0);
      
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'oldest':
          return dateA - dateB;
        case 'newest':
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [projects, searchTerm, filterStatus, sortBy]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
  };

  // --- Renderers ---
  const renderSkeletons = () => (
    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse flex ${viewMode === 'list' ? 'flex-row items-center p-4' : 'flex-col overflow-hidden'}`}>
          <div className={`bg-gray-200 ${viewMode === 'list' ? 'w-16 h-16 rounded-lg flex-shrink-0 mr-4' : 'w-full aspect-video'}`} />
          <div className={`flex-1 flex flex-col ${viewMode === 'list' ? '' : 'p-5'}`}>
            <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-3" />
            {viewMode === 'grid' && <div className="h-4 bg-gray-100 rounded-md w-full mb-2" />}
            {viewMode === 'grid' && <div className="h-4 bg-gray-100 rounded-md w-2/3 mb-4" />}
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-8 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-5 lg:px-8 shadow-sm z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Projects</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {processedProjects.length} project{processedProjects.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="group px-5 py-2.5 bg-gradient-to-r from-[#0A233A] to-[#1a3d5c] text-white rounded-xl hover:shadow-lg hover:from-[#0a1f2e] hover:to-[#152f4a] transition-all duration-200 flex items-center justify-center gap-2 font-semibold active:scale-95"
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90" />
          New Project
        </button>
      </div>

      {/* Notifications overlaying the content area slightly */}
      <div className="px-6 lg:px-8 w-full z-20 absolute top-24 left-0 right-0 pointer-events-none">
        {error && (
          <div className="pointer-events-auto w-full max-w-3xl mx-auto mb-3 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 animate-in slide-in-from-top-4 shadow-sm">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span className="flex-1 font-medium text-sm">{error}</span>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-100 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
        {success && (
          <div className="pointer-events-auto w-full max-w-3xl mx-auto mb-3 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 animate-in slide-in-from-top-4 shadow-sm">
            <CheckCircle size={18} className="flex-shrink-0" />
            <span className="flex-1 font-medium text-sm">{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-700 p-1 rounded-md hover:bg-green-100 transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F28C00] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00]/20 focus:border-[#F28C00] transition-all shadow-sm"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Filter size={16} />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00]/20 focus:border-[#F28C00] transition-all shadow-sm font-medium cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
              <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90" size={16} />
            </div>
          </div>

          {/* View & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#F28C00]/10 text-[#F28C00] shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-[#F28C00]/10 text-[#F28C00] shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                title="List View"
              >
                <ListIcon size={18} />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00]/20 focus:border-[#F28C00] transition-all shadow-sm font-medium cursor-pointer"
              >
                <option value="newest">Last Updated</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
              <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 rotate-90" size={16} />
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          renderSkeletons()
        ) : processedProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[400px] text-center bg-white rounded-2xl border border-gray-200 border-dashed shadow-sm p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F28C00]/20 to-[#d67400]/20 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-inner">
              <FolderOpen className="text-[#F28C00] -rotate-3" size={36} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Found</h3>
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
              {searchTerm || filterStatus !== 'all'
                ? "We couldn't find any projects matching your filters. Try adjusting your search criteria." 
                : "Create your first project to get started with StoryAI. Transform your ideas into stunning visual stories!"}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={handleOpenCreateModal}
                className="group flex items-center gap-2 bg-[#F28C00] hover:bg-[#d67400] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Plus size={20} className="transition-transform group-hover:rotate-90" />
                <span>Create First Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12" 
              : "flex flex-col gap-4 pb-12"
          }>
            {processedProjects.map((project) => (
              <div 
                key={project.id}
                className={`group relative bg-white border border-gray-200 hover:border-[#F28C00]/50 rounded-xl transition-all duration-300 shadow-sm hover:shadow-xl overflow-hidden cursor-pointer ${
                  viewMode === 'list' ? 'flex flex-row items-stretch p-4 hover:-translate-y-0.5' : 'flex flex-col hover:-translate-y-1'
                }`}
                onClick={() => onSelectProject && onSelectProject(project)}
              >
                {/* Project Thumbnail */}
                <div 
                  className={`relative overflow-hidden flex items-center justify-center bg-gray-100 ${
                    viewMode === 'list' ? 'w-24 h-24 rounded-lg flex-shrink-0 mr-5' : 'w-full aspect-video border-b border-gray-100'
                  }`}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${getProjectGradient(project.title)} opacity-90 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}>
                    <Sparkles className="text-white/30" size={viewMode === 'list' ? 24 : 48} />
                  </div>
                  
                  {viewMode === 'grid' && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-full border shadow-sm backdrop-blur-md bg-white/90 ${getStatusBadgeColor(project.status)}`}>
                        {project.status || 'Draft'}
                      </span>
                    </div>
                  )}

                  {/* Play Overlay (Grid only) */}
                  {viewMode === 'grid' && (
                    <div className="absolute inset-0 bg-[#0A233A]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 backdrop-blur-[2px]">
                      <div className="bg-white text-[#0A233A] p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300 delay-75">
                        <Eye size={24} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className={`flex-1 flex flex-col ${viewMode === 'list' ? '' : 'p-5'}`}>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#F28C00] transition-colors">
                          {project.title}
                        </h3>
                        {viewMode === 'list' && (
                          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded border ${getStatusBadgeColor(project.status)}`}>
                            {project.status || 'Draft'}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm text-gray-500 line-clamp-2 leading-relaxed ${viewMode === 'grid' ? 'min-h-[2.75rem]' : ''}`}>
                        {project.description || "No description provided."}
                      </p>
                    </div>

                    {/* Context Menu Trigger */}
                    <div className="relative flex-shrink-0 z-20">
                      <button
                        data-menu-trigger
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === project.id ? null : project.id);
                        }}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          openMenuId === project.id ? 'bg-gray-100 text-gray-900 shadow-inner' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === project.id && (
                        <div 
                          data-menu
                          className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-1.5 origin-top-right animate-in fade-in zoom-in-95 duration-150"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#F28C00] flex items-center gap-2.5 transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit Details
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDuplicateProject(project); }}
                            disabled={submitting}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#F28C00] flex items-center gap-2.5 transition-colors disabled:opacity-50"
                          >
                            <Copy size={16} />
                            Duplicate
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setProjectToDelete(project);
                              setIsDeleteModalOpen(true);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                          >
                            <Trash2 size={16} />
                            Delete Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Block */}
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 p-3 bg-gray-50/80 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-[#F28C00]" />
                      <span className="font-semibold text-gray-900">{project.storyboard_count || 0}</span>
                      <span>Storyboard{project.storyboard_count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-[#F28C00]" />
                      <span className="font-semibold text-gray-900">{project.character_count || 0}</span>
                      <span>Character{project.character_count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="flex items-center text-xs font-medium text-gray-400">
                      <Calendar size={14} className="mr-1.5 text-gray-300" />
                      {formatDate(project.updated_at || project.created_at)}
                    </div>
                    {viewMode === 'list' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectProject && onSelectProject(project); }}
                        className="px-3 py-1.5 bg-[#F28C00]/10 text-[#F28C00] hover:bg-[#F28C00] hover:text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all"
                      >
                        Open <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Modals --- */}

      {/* Create / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-[#0A233A] to-[#1a3d5c] px-6 py-5 flex items-center justify-between border-b border-[#0A233A]/20">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-white/70 text-sm mt-0.5 font-medium">
                  {editingProject ? 'Update your project details' : 'Start your creative journey with a new project'}
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowModal(false);
                  handleResetForm();
                }}
                className="text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form id="project-form" onSubmit={(e) => { e.preventDefault(); handleCreateOrUpdateProject(); }} className="space-y-5">
                <div>
                  <label htmlFor="projectTitle" className="block text-sm font-bold text-gray-900 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="projectTitle"
                    type="text"
                    required
                    autoFocus
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Sci-Fi Short Film: The Awakening"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00]/50 focus:border-[#F28C00] focus:bg-white transition-all shadow-sm placeholder-gray-400 font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="projectDesc" className="block text-sm font-bold text-gray-900 mb-2">
                    Description <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                  </label>
                  <textarea
                    id="projectDesc"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Briefly describe the context, tone, or overall story..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00]/50 focus:border-[#F28C00] focus:bg-white transition-all shadow-sm resize-none placeholder-gray-400 text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="projectScript" className="block text-sm font-bold text-gray-900 mb-2">
                    Script or Story Outline
                  </label>
                  <textarea
                    id="projectScript"
                    rows={6}
                    value={formData.scriptText}
                    onChange={(e) => setFormData({...formData, scriptText: e.target.value})}
                    placeholder="Paste your raw script or story outline here. Our AI will help you parse this into storyboards and characters later."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00]/50 focus:border-[#F28C00] focus:bg-white transition-all shadow-sm resize-none placeholder-gray-400 font-mono text-gray-800 leading-relaxed"
                  />
                </div>

                {/* Info Box */}
                {!editingProject && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 mt-2">
                    <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 font-bold mb-1">Getting Started</p>
                      <p className="text-sm text-blue-800/80 leading-relaxed">
                        After creating this project, you can open it to let StoryAI automatically extract characters, break down scenes, and generate storyboards from your text.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex-shrink-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  handleResetForm();
                }}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all focus:ring-2 focus:ring-gray-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                form="project-form"
                type="submit"
                disabled={submitting || !formData.title.trim()}
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#F28C00] to-[#d67400] rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm focus:ring-2 focus:ring-[#F28C00]/50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingProject ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {editingProject ? <Edit2 size={16} /> : <Plus size={16} />}
                    {editingProject ? 'Save Changes' : 'Create Project'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 transform animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h3>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
              Are you sure you want to delete <span className="font-bold text-gray-800">"{projectToDelete?.title}"</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-red-500/50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}