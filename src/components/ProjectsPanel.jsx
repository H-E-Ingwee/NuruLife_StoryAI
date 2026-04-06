import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  FolderOpen,
  Calendar,
  Users,
  Eye,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api';

export default function ProjectsPanel({ onSelectProject }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scriptText: ''
  });

  // Notification handler
  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

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

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

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
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateOrUpdateProject = async () => {
    if (!formData.title.trim()) {
      showNotification('Project title is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingProject) {
        // Update existing project
        const response = await updateProject(editingProject.id, {
          title: formData.title,
          description: formData.description,
          script_text: formData.scriptText,
        });

        if (response.success) {
          setProjects(prev =>
            prev.map(p => p.id === editingProject.id ? response.data : p)
          );
          showNotification('Project updated successfully');
          setShowModal(false);
          handleResetForm();
        } else {
          showNotification(response.error?.message || 'Failed to update project', 'error');
        }
      } else {
        // Create new project
        const response = await createProject(
          formData.title,
          formData.description,
          formData.scriptText
        );

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
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await deleteProject(projectId);
      if (response.success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        showNotification('Project deleted successfully');
        setOpenMenuId(null);
      } else {
        showNotification(response.error?.message || 'Failed to delete project', 'error');
      }
    } catch (err) {
      showNotification('Failed to delete project: ' + err.message, 'error');
      console.error('Error deleting project:', err);
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
      console.error('Error duplicating project:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and search
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
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

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-3 bg-gradient-to-r from-[#0A233A] to-[#1a3d5c] text-white rounded-lg hover:shadow-lg hover:from-[#0a1f2e] hover:to-[#152f4a] transition-all duration-200 flex items-center gap-2 font-semibold"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 animate-in slide-in-from-top">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}
      
      {success && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 animate-in slide-in-from-top">
          <CheckCircle size={18} className="flex-shrink-0" />
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters and Search */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent bg-white transition-all"
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-[#F28C00] animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F28C00] to-[#d67400] rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600 mb-6 max-w-sm">
                {searchTerm || filterStatus !== 'all'
                  ? 'No projects match your filters. Try adjusting your search criteria.'
                  : 'Create your first project to get started with StoryAI. Transform your ideas into stunning visual stories!'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={handleOpenCreateModal}
                  className="px-6 py-3 bg-[#F28C00] text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create First Project
                </button>
              )}
            </div>
          </div>
        ) : (
          // Projects Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#F28C00] hover:border-opacity-50"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden relative">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A233A]/10 to-[#F28C00]/10">
                    <Sparkles className="w-8 h-8 text-[#F28C00] opacity-50" />
                  </div>
                  <div className="absolute inset-0 group-hover:bg-black/20 transition-all" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getStatusBadgeColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="px-4 py-2 bg-white text-[#0A233A] rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
                    >
                      <Eye size={16} />
                      Open
                    </button>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 text-lg">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                    {project.description || 'No description provided'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-[#F28C00]" />
                      <span className="font-semibold">{project.storyboard_count || 0}</span>
                      <span>Storyboard{project.storyboard_count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-[#F28C00]" />
                      <span className="font-semibold">{project.character_count || 0}</span>
                      <span>Character{project.character_count !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Calendar size={14} />
                      <span className="font-medium">{formatDate(project.updated_at)}</span>
                    </div>

                    <div className="relative">
                      <button
                        data-menu-trigger
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                        onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                      >
                        <MoreVertical size={16} className="text-gray-400 group-hover:text-gray-600" />
                      </button>

                      {openMenuId === project.id && (
                        <div
                          data-menu
                          className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-56 overflow-hidden animate-in fade-in slide-in-from-top-2"
                        >
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
                          >
                            <Edit2 size={16} className="text-[#F28C00]" />
                            <span className="font-medium">Edit Project</span>
                          </button>

                          <button
                            onClick={() => {
                              handleDuplicateProject(project);
                            }}
                            disabled={submitting}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 disabled:opacity-50"
                          >
                            <Copy size={16} className="text-[#F28C00]" />
                            <span className="font-medium">Duplicate</span>
                          </button>

                          <button
                            onClick={() => {
                              handleDeleteProject(project.id);
                            }}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                          >
                            <Trash2 size={16} />
                            <span className="font-medium">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="flex-1 px-3 py-2 bg-[#F28C00] text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <ChevronRight size={14} />
                      Open
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#0A233A] to-[#1a3d5c] px-6 py-6 flex items-center justify-between border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-white/70 text-sm mt-1">
                  {editingProject ? 'Update your project details' : 'Start your creative journey with a new project'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleResetForm();
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Project Title *</label>
                <input
                  type="text"
                  placeholder="Enter project title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent transition-all bg-gray-50"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                <textarea
                  placeholder="What is your project about?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent transition-all resize-none bg-gray-50"
                />
              </div>

              {/* Script Text Field */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Script or Story Outline</label>
                <textarea
                  placeholder="Paste your script or outline here. You can edit and manage characters and storyboards after creating the project."
                  value={formData.scriptText}
                  onChange={(e) => setFormData({ ...formData, scriptText: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent transition-all resize-none bg-gray-50 font-mono text-sm"
                />
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-semibold">Pro Tip</p>
                    <p className="text-sm text-blue-800 mt-1">After creating your project, you can add characters, storyboards, and assets to bring your story to life!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleResetForm();
                }}
                className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdateProject}
                disabled={submitting || !formData.title.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#F28C00] to-[#d67400] text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editingProject ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
