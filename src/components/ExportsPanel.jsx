import React, { useEffect, useState } from 'react';
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

import { downloadExportFile, getExports } from '../services/api';

export default function ExportsPanel({ onNewExport = () => {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExports = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getExports();
        if (!res?.success) {
          setExports([]);
          return;
        }

        const mapped = (res.data || []).map((e) => ({
          id: e.id,
          name: `${(e.export_type || 'export').toUpperCase()} Export`,
          project: e.project_id,
          type: (e.export_type || 'images').toLowerCase(),
          format: 'ZIP',
          size: '—',
          pages: null,
          duration: null,
          files: null,
          status: e.status,
          created: e.created_at ? new Date(e.created_at).toLocaleString() : '',
          downloadUrl: e.file_url || null,
        }));

        setExports(mapped);
      } catch (e) {
        setError(e?.message || 'Failed to load exports');
        setExports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExports();
  }, []);

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
              <option value="images">Images</option>
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