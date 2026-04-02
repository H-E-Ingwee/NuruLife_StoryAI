import React, { useState } from 'react';
import {
  Download,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Share2,
  RefreshCw
} from 'lucide-react';

export default function ExportsPanel({ onNewExport }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock exports data
  const exports = [
    {
      id: 1,
      name: 'African Folktale - Full Storyboard',
      project: 'African Folktale Adaptation',
      type: 'PDF',
      format: 'A4 Portrait',
      pages: 24,
      size: '8.4 MB',
      status: 'completed',
      created: '2026-04-02 14:30',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Character Reference Sheets',
      project: 'Urban Drama Series',
      type: 'PNG',
      format: 'High Resolution',
      pages: 12,
      size: '45.2 MB',
      status: 'completed',
      created: '2026-04-01 09:15',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Shot List - Scene 1-3',
      project: 'Short Film: "The Journey"',
      type: 'CSV',
      format: 'Standard',
      pages: 1,
      size: '12 KB',
      status: 'completed',
      created: '2026-03-30 16:45',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'Storyboard Animatic',
      project: 'Historical Documentary',
      type: 'MP4',
      format: '1080p',
      duration: '4:32',
      size: '156 MB',
      status: 'processing',
      created: '2026-04-02 11:20',
      downloadUrl: null
    },
    {
      id: 5,
      name: 'Production Notes',
      project: 'African Folktale Adaptation',
      type: 'DOCX',
      format: 'Detailed',
      pages: 8,
      size: '2.1 MB',
      status: 'failed',
      created: '2026-03-28 13:10',
      downloadUrl: null
    },
    {
      id: 6,
      name: 'Mood Board Collection',
      project: 'Urban Drama Series',
      type: 'ZIP',
      format: 'High Quality',
      files: 45,
      size: '234 MB',
      status: 'completed',
      created: '2026-03-25 10:30',
      downloadUrl: '#'
    }
  ];

  const filteredExports = exports.filter(exportItem => {
    const matchesSearch = exportItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exportItem.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || exportItem.type.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText size={20} className="text-red-500" />;
      case 'png': case 'jpg': return <ImageIcon size={20} className="text-blue-500" />;
      case 'mp4': case 'mov': return <Video size={20} className="text-purple-500" />;
      case 'csv': return <FileText size={20} className="text-green-500" />;
      case 'docx': return <FileText size={20} className="text-blue-600" />;
      case 'zip': return <FileText size={20} className="text-yellow-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'processing': return <RefreshCw size={16} className="text-blue-500 animate-spin" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Exports</h1>
        <button
          onClick={onNewExport}
          className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Download size={16} />
          New Export
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
                placeholder="Search exports..."
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
              <option value="all">All Formats</option>
              <option value="pdf">PDF</option>
              <option value="png">PNG</option>
              <option value="mp4">MP4</option>
              <option value="csv">CSV</option>
              <option value="docx">DOCX</option>
              <option value="zip">ZIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exports List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {filteredExports.map(exportItem => (
            <div
              key={exportItem.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(exportItem.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{exportItem.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{exportItem.project}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {exportItem.created}
                      </span>
                      <span>{exportItem.size}</span>
                      <span>{exportItem.format}</span>
                      {exportItem.pages && <span>{exportItem.pages} pages</span>}
                      {exportItem.duration && <span>{exportItem.duration}</span>}
                      {exportItem.files && <span>{exportItem.files} files</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(exportItem.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(exportItem.status)}`}>
                      {exportItem.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {exportItem.status === 'completed' && exportItem.downloadUrl && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          <Download size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          <Share2 size={16} />
                        </button>
                      </>
                    )}
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExports.length === 0 && (
          <div className="text-center py-12">
            <Download size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exports found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={onNewExport}
              className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90"
            >
              Create Your First Export
            </button>
          </div>
        )}

        {/* Export Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{exports.filter(e => e.status === 'completed').length}</div>
            <div className="text-sm text-gray-600">Completed Exports</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{exports.filter(e => e.status === 'processing').length}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{exports.filter(e => e.status === 'failed').length}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {(exports.reduce((sum, e) => {
                const size = parseFloat(e.size.replace(/[^0-9.]/g, ''));
                return sum + size;
              }, 0) / 1024).toFixed(1)} GB
            </div>
            <div className="text-sm text-gray-600">Total Size</div>
          </div>
        </div>
      </div>
    </div>
  );
}