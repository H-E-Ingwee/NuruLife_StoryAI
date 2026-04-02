import React, { useState, useRef } from 'react';
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
  List,
  Edit,
  Share,
  Star,
  Archive,
  Tag,
  Calendar,
  User,
  HardDrive,
  CloudUpload,
  CheckSquare,
  Square
} from 'lucide-react';

export default function AssetsLibraryPanel() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Helper function to get icon for asset type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={24} className="text-blue-500" />;
      case 'video': return <Video size={24} className="text-red-500" />;
      case 'audio': return <Music size={24} className="text-green-500" />;
      case 'document': return <FileText size={24} className="text-purple-500" />;
      default: return <FileText size={24} className="text-gray-500" />;
    }
  };

  // Mock assets data with more variety
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
      thumbnail: 'https://picsum.photos/200/150?random=30',
      tags: ['market', 'african', 'urban'],
      favorite: false,
      author: 'Brian Ingwee'
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
      thumbnail: 'https://picsum.photos/200/150?random=31',
      tags: ['character', 'anansi', 'spider'],
      favorite: true,
      author: 'Sarah Kim'
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
      thumbnail: '/audio-waveform.svg',
      tags: ['soundtrack', 'urban', 'ambience'],
      favorite: false,
      author: 'Marcus Johnson'
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
      thumbnail: '/document-icon.svg',
      tags: ['script', 'draft', 'film'],
      favorite: false,
      author: 'Brian Ingwee'
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
      thumbnail: 'https://picsum.photos/200/150?random=32',
      tags: ['drone', 'nairobi', 'skyline'],
      favorite: true,
      author: 'David Chen'
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
      thumbnail: 'https://picsum.photos/200/150?random=33',
      tags: ['patterns', 'african', 'texture'],
      favorite: false,
      author: 'Amina Hassan'
    },
    {
      id: 7,
      name: 'Malaika Character Concept',
      type: 'image',
      format: 'JPG',
      size: '3.1 MB',
      dimensions: '1200x1600',
      folder: 'Characters',
      project: 'Beneath the Silence',
      uploaded: '2026-04-03',
      thumbnail: 'https://picsum.photos/200/150?random=34',
      tags: ['malaika', 'character', 'concept'],
      favorite: true,
      author: 'Brian Ingwee'
    },
    {
      id: 8,
      name: 'Jay Character Reference',
      type: 'image',
      format: 'PNG',
      size: '2.8 MB',
      dimensions: '1000x1400',
      folder: 'Characters',
      project: 'Beneath the Silence',
      uploaded: '2026-04-03',
      thumbnail: 'https://picsum.photos/200/150?random=35',
      tags: ['jay', 'character', 'reference'],
      favorite: false,
      author: 'Sarah Kim'
    }
  ];

  const folders = ['all', 'Backgrounds', 'Characters', 'Audio', 'Scripts', 'Footage', 'Textures'];

  const filteredAndSortedAssets = assets
    .filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filter === 'all' || asset.type === filter;
      const matchesFolder = selectedFolder === 'all' || asset.folder === selectedFolder;
      return matchesSearch && matchesFilter && matchesFolder;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          aValue = parseFloat(a.size);
          bValue = parseFloat(b.size);
          break;
        case 'uploaded':
          aValue = new Date(a.uploaded);
          bValue = new Date(b.uploaded);
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          return 0;
      }
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSelectAsset = (assetId) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAndSortedAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAndSortedAssets.map(asset => asset.id));
    }
  };

  const handleBulkDelete = () => {
    // In a real app, this would delete the selected assets
    console.log('Deleting assets:', selectedAssets);
    setSelectedAssets([]);
  };

  const handleBulkDownload = () => {
    // In a real app, this would download the selected assets
    console.log('Downloading assets:', selectedAssets);
  };

  const handleBulkTag = () => {
    // In a real app, this would open a tag modal
    console.log('Tagging assets:', selectedAssets);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
    // In a real app, this would upload the files
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    // In a real app, this would upload the files
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
      {filteredAndSortedAssets.map(asset => (
        <div
          key={asset.id}
          className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group cursor-pointer relative ${
            selectedAssets.includes(asset.id) ? 'ring-2 ring-[#F28C00]' : ''
          }`}
        >
          {/* Selection Checkbox */}
          <div className="absolute top-2 left-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAsset(asset.id);
              }}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedAssets.includes(asset.id)
                  ? 'bg-[#F28C00] border-[#F28C00] text-white'
                  : 'border-gray-300 hover:border-[#F28C00]'
              }`}
            >
              {selectedAssets.includes(asset.id) && <CheckSquare size={12} />}
            </button>
          </div>

          {/* Favorite Star */}
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle favorite
                console.log('Toggle favorite for asset:', asset.id);
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                asset.favorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
              }`}
            >
              <Star size={14} fill={asset.favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

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
            <div className="absolute bottom-2 right-2">
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
            <div className="flex items-center gap-1 mt-1">
              <User size={10} className="text-gray-400" />
              <span className="text-xs text-gray-500">{asset.author}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {filteredAndSortedAssets.map(asset => (
        <div
          key={asset.id}
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative ${
            selectedAssets.includes(asset.id) ? 'ring-2 ring-[#F28C00]' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Selection Checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAsset(asset.id);
              }}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                selectedAssets.includes(asset.id)
                  ? 'bg-[#F28C00] border-[#F28C00] text-white'
                  : 'border-gray-300 hover:border-[#F28C00]'
              }`}
            >
              {selectedAssets.includes(asset.id) && <CheckSquare size={12} />}
            </button>

            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              {getTypeIcon(asset.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">{asset.name}</h4>
                {asset.favorite && <Star size={14} className="text-yellow-500" fill="currentColor" />}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{asset.format}</span>
                <span>{asset.size}</span>
                <span>{asset.uploaded}</span>
                <span>{asset.project}</span>
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{asset.author}</span>
                </div>
              </div>
              {asset.tags.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <Tag size={12} className="text-gray-400" />
                  {asset.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                  {asset.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{asset.tags.length - 3} more</span>
                  )}
                </div>
              )}
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
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Assets Library</h1>
          {selectedAssets.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedAssets.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {selectedAssets.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDownload}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={handleBulkTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <Tag size={16} />
                Tag
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
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
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectAll}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                selectedAssets.length === filteredAndSortedAssets.length && filteredAndSortedAssets.length > 0
                  ? 'bg-[#F28C00] text-white border-[#F28C00]'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {selectedAssets.length === filteredAndSortedAssets.length && filteredAndSortedAssets.length > 0 ? (
                <CheckSquare size={16} />
              ) : (
                <Square size={16} />
              )}
              Select All
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="size">Size</option>
                <option value="uploaded">Date</option>
                <option value="type">Type</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredAndSortedAssets.length} assets
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets, tags, projects..."
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
      <div
        className={`flex-1 p-6 overflow-y-auto relative ${
          isDragOver ? 'bg-blue-50' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-10 rounded-lg border-2 border-dashed border-blue-300">
            <div className="text-center">
              <CloudUpload size={48} className="text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-blue-700">Drop files here to upload</p>
              <p className="text-sm text-blue-600">Images, videos, audio, and documents supported</p>
            </div>
          </div>
        )}
        {filteredAndSortedAssets.length > 0 ? (
          viewMode === 'grid' ? <GridView /> : <ListView />
        ) : (
          <div className="text-center py-12">
            <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filter !== 'all' || selectedFolder !== 'all' ? 'No assets found' : 'No assets yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filter !== 'all' || selectedFolder !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first asset to get started'
              }
            </p>
            {!searchTerm && filter === 'all' && selectedFolder === 'all' && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90"
              >
                Upload Your First Asset
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}