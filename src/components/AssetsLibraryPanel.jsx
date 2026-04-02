import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Upload,
  MoreVertical,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Download,
  Eye,
  Trash2,
  Folder,
  Grid,
  List
} from 'lucide-react';

export default function AssetsLibraryPanel({ onUploadAsset }) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');

  // Mock assets data
  const assets = [
    {
      id: 1,
      name: 'Market Scene Background',
      type: 'image',
      format: 'JPG',
      size: '2.4 MB',
      dimensions: '1920x1080',
      folder: 'Backgrounds',
      project: 'African Folktale Adaptation',
      uploaded: '2026-04-01',
      thumbnail: 'https://picsum.photos/200/150?random=30'
    },
    {
      id: 2,
      name: 'Character Reference - Anansi',
      type: 'image',
      format: 'PNG',
      size: '1.8 MB',
      dimensions: '800x600',
      folder: 'Characters',
      project: 'African Folktale Adaptation',
      uploaded: '2026-03-28',
      thumbnail: 'https://picsum.photos/200/150?random=31'
    },
    {
      id: 3,
      name: 'Urban Ambience Soundtrack',
      type: 'audio',
      format: 'MP3',
      size: '15.2 MB',
      duration: '3:24',
      folder: 'Audio',
      project: 'Urban Drama Series',
      uploaded: '2026-03-30',
      thumbnail: '/audio-waveform.svg'
    },
    {
      id: 4,
      name: 'Script Draft v2',
      type: 'document',
      format: 'PDF',
      size: '892 KB',
      pages: 24,
      folder: 'Scripts',
      project: 'Short Film: "The Journey"',
      uploaded: '2026-03-25',
      thumbnail: '/document-icon.svg'
    },
    {
      id: 5,
      name: 'Drone Footage - Nairobi Skyline',
      type: 'video',
      format: 'MP4',
      size: '45.6 MB',
      duration: '1:30',
      dimensions: '4K',
      folder: 'Footage',
      project: 'Urban Drama Series',
      uploaded: '2026-04-02',
      thumbnail: 'https://picsum.photos/200/150?random=32'
    },
    {
      id: 6,
      name: 'Traditional African Patterns',
      type: 'image',
      format: 'PSD',
      size: '12.3 MB',
      dimensions: '2000x2000',
      folder: 'Textures',
      project: 'African Folktale Adaptation',
      uploaded: '2026-03-20',
      thumbnail: 'https://picsum.photos/200/150?random=33'
    }
  ];

  const folders = ['all', 'Backgrounds', 'Characters', 'Audio', 'Scripts', 'Footage', 'Textures'];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || asset.type === filter;
    const matchesFolder = selectedFolder === 'all' || asset.folder === selectedFolder;
    return matchesSearch && matchesFilter && matchesFolder;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} className="text-blue-500" />;
      case 'video': return <Video size={20} className="text-red-500" />;
      case 'audio': return <Music size={20} className="text-green-500" />;
      case 'document': return <FileText size={20} className="text-purple-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {filteredAssets.map(asset => (
        <div
          key={asset.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer"
        >
          {/* Asset Thumbnail */}
          <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden relative">
            {asset.type === 'image' ? (
              <img
                src={asset.thumbnail}
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getTypeIcon(asset.type)}
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(asset.type)}`}>
                {asset.format}
              </span>
            </div>
          </div>

          {/* Asset Info */}
          <div className="p-3">
            <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{asset.name}</h4>
            <p className="text-xs text-gray-500">{asset.size}</p>
            <p className="text-xs text-gray-500">{asset.project}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {filteredAssets.map(asset => (
        <div
          key={asset.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              {getTypeIcon(asset.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{asset.name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                <span>{asset.format}</span>
                <span>{asset.size}</span>
                <span>{asset.uploaded}</span>
                <span>{asset.project}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <Eye size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <Download size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                <MoreVertical size={16} />
              </button>
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
        <h1 className="text-xl font-bold text-gray-900">Assets Library</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={onUploadAsset}
            className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
          >
            <Upload size={16} />
            Upload
          </button>
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
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Folder size={16} className="text-gray-400" />
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
              >
                {folders.map(folder => (
                  <option key={folder} value={folder}>
                    {folder === 'all' ? 'All Folders' : folder}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {filteredAssets.length > 0 ? (
          viewMode === 'grid' ? <GridView /> : <ListView />
        ) : (
          <div className="text-center py-12">
            <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={onUploadAsset}
              className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90"
            >
              Upload Your First Asset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}