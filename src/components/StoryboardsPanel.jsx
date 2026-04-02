import React, { useState } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  Share2,
  Calendar,
  User,
  Image as ImageIcon,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function StoryboardsPanel({ onViewStoryboard, onEditStoryboard }) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock storyboards data
  const storyboards = [
    {
      id: 1,
      title: 'Opening Scene - Market',
      project: 'African Folktale Adaptation',
      panels: 8,
      status: 'completed',
      lastModified: '2026-04-02',
      thumbnail: 'https://picsum.photos/300/200?random=10',
      creator: 'Brian Ingwee'
    },
    {
      id: 2,
      title: 'Character Introduction',
      project: 'Urban Drama Series',
      panels: 12,
      status: 'in-progress',
      lastModified: '2026-04-01',
      thumbnail: 'https://picsum.photos/300/200?random=11',
      creator: 'Brian Ingwee'
    },
    {
      id: 3,
      title: 'Climax Sequence',
      project: 'Historical Documentary',
      panels: 15,
      status: 'completed',
      lastModified: '2026-03-30',
      thumbnail: 'https://picsum.photos/300/200?random=12',
      creator: 'Sarah Johnson'
    },
    {
      id: 4,
      title: 'Ending Montage',
      project: 'Short Film: "The Journey"',
      panels: 6,
      status: 'draft',
      lastModified: '2026-03-28',
      thumbnail: 'https://picsum.photos/300/200?random=13',
      creator: 'Brian Ingwee'
    },
    {
      id: 5,
      title: 'Flashback Scene',
      project: 'African Folktale Adaptation',
      panels: 5,
      status: 'completed',
      lastModified: '2026-03-25',
      thumbnail: 'https://picsum.photos/300/200?random=14',
      creator: 'Brian Ingwee'
    },
    {
      id: 6,
      title: 'Dialogue Scene - Cafe',
      project: 'Urban Drama Series',
      panels: 9,
      status: 'in-progress',
      lastModified: '2026-03-29',
      thumbnail: 'https://picsum.photos/300/200?random=15',
      creator: 'Maria Rodriguez'
    }
  ];

  const filteredStoryboards = storyboards.filter(storyboard => {
    const matchesSearch = storyboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         storyboard.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || storyboard.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredStoryboards.map(storyboard => (
        <div
          key={storyboard.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer"
        >
          {/* Thumbnail */}
          <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
            <img
              src={storyboard.thumbnail}
              alt={storyboard.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(storyboard.status)}`}>
                {storyboard.status}
              </span>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
              <button
                onClick={() => onViewStoryboard(storyboard)}
                className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium transition-opacity"
              >
                View
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{storyboard.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{storyboard.project}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{storyboard.panels} panels</span>
              <span>{storyboard.lastModified}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TimelineView = () => (
    <div className="space-y-8">
      {filteredStoryboards
        .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
        .map((storyboard, index) => (
          <div key={storyboard.id} className="flex gap-6">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-[#F28C00] rounded-full"></div>
              {index < filteredStoryboards.length - 1 && (
                <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={storyboard.thumbnail}
                    alt={storyboard.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{storyboard.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(storyboard.status)}`}>
                      {storyboard.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{storyboard.project}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <ImageIcon size={12} />
                      <span>{storyboard.panels} panels</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{storyboard.lastModified}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{storyboard.creator}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewStoryboard(storyboard)}
                      className="px-3 py-1.5 text-sm bg-[#0A233A] text-white rounded hover:bg-opacity-90"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditStoryboard(storyboard)}
                      className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Storyboards</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 ${viewMode === 'timeline' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
              <Clock size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search storyboards..."
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
              <option value="all">All Storyboards</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Storyboards Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {filteredStoryboards.length > 0 ? (
          viewMode === 'grid' ? <GridView /> : viewMode === 'list' ? <ListView /> : <TimelineView />
        ) : (
          <div className="text-center py-12">
            <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No storyboards found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}