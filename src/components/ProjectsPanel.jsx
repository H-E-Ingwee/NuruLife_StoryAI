import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  FolderOpen,
  Calendar,
  Users,
  Eye,
  Download
} from 'lucide-react';

export default function ProjectsPanel({ onNewProject, onSelectProject }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock projects data
  const projects = [
    {
      id: 1,
      name: 'African Folktale Adaptation',
      description: 'Modern retelling of Anansi stories',
      status: 'active',
      lastModified: '2026-04-02',
      collaborators: 3,
      storyboards: 12,
      thumbnail: 'https://picsum.photos/300/200?random=1'
    },
    {
      id: 2,
      name: 'Urban Drama Series',
      description: 'Coming-of-age story in Nairobi',
      status: 'draft',
      lastModified: '2026-03-28',
      collaborators: 1,
      storyboards: 8,
      thumbnail: 'https://picsum.photos/300/200?random=2'
    },
    {
      id: 3,
      name: 'Historical Documentary',
      description: 'The Mau Mau uprising story',
      status: 'completed',
      lastModified: '2026-03-15',
      collaborators: 5,
      storyboards: 24,
      thumbnail: 'https://picsum.photos/300/200?random=3'
    },
    {
      id: 4,
      name: 'Short Film: "The Journey"',
      description: 'Road trip adventure across Kenya',
      status: 'active',
      lastModified: '2026-04-01',
      collaborators: 2,
      storyboards: 15,
      thumbnail: 'https://picsum.photos/300/200?random=4'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={onNewProject}
          className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Filters and Search */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
            >
              <option value="all">All Projects</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
            >
              {/* Project Thumbnail */}
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                {/* Project Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FolderOpen size={14} />
                    <span>{project.storyboards} storyboards</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{project.collaborators} collaborators</span>
                  </div>
                </div>

                {/* Last Modified */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={14} />
                    <span>Modified {project.lastModified}</span>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={onNewProject}
              className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}