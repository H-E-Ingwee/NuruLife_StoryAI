import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Camera,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

import { getStoryboards, getStoryboardShots } from '../services/api';

export default function ShotListPanel({ onNewShot = () => {}, onEditShot = () => {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShots = async () => {
      try {
        setLoading(true);
        setError(null);

        const sbRes = await getStoryboards();
        if (!sbRes?.success || !Array.isArray(sbRes.data) || sbRes.data.length === 0) {
          setShots([]);
          return;
        }

        // Pick the most recently updated storyboard for MVP shot listing.
        const latestStoryboard = [...sbRes.data].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
        const shotsRes = await getStoryboardShots(latestStoryboard.id);
        if (!shotsRes?.success) {
          setShots([]);
          return;
        }

        const uiShots = (shotsRes.data || []).map((sh) => {
          const imageStatus = sh.image_status;
          let status = 'draft';
          if (imageStatus === 'completed') status = 'completed';
          else if (imageStatus === 'processing') status = 'in-progress';
          else if (imageStatus === 'pending') status = 'pending';
          else if (imageStatus === 'failed') status = 'draft';

          return {
            id: sh.id,
            number: `S${sh.scene_number}-${sh.shot_number}`,
            scene: sh.scene,
            description: sh.action || sh.prompt || '',
            shotSize: sh.shotSize,
            cameraAngle: sh.cameraAngle,
            lens: sh.lens,
            duration: '—',
            status,
            notes: sh.notes || '',
          };
        });

        setShots(uiShots);
      } catch (e) {
        setError(e?.message || 'Failed to load shots');
        setShots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShots();
  }, []);

  const filteredShots = shots.filter(shot => {
    const matchesSearch = shot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shot.scene.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || shot.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress': return <Play size={16} className="text-blue-500" />;
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'draft': return <AlertCircle size={16} className="text-gray-500" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShotSizeColor = (size) => {
    switch (size) {
      case 'WS': return 'bg-blue-100 text-blue-800';
      case 'MS': return 'bg-green-100 text-green-800';
      case 'CU': return 'bg-red-100 text-red-800';
      case 'ECU': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Shot List</h1>
        <button
          onClick={onNewShot}
          className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Plus size={16} />
          New Shot
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
                placeholder="Search shots..."
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
              <option value="all">All Shots</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shot List Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 text-sm">
              <div className="col-span-1">Shot</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1">Angle</div>
              <div className="col-span-1">Lens</div>
              <div className="col-span-1">Duration</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredShots.map(shot => (
                <div key={shot.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(shot.status)}
                      <span className="font-medium text-gray-900">{shot.number}</span>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 line-clamp-1">{shot.scene}</p>
                      <p className="text-gray-600 line-clamp-2">{shot.description}</p>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getShotSizeColor(shot.shotSize)}`}>
                      {shot.shotSize}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <span className="text-sm text-gray-600">{shot.cameraAngle}</span>
                  </div>

                  <div className="col-span-1">
                    <span className="text-sm text-gray-600">{shot.lens}</span>
                  </div>

                  <div className="col-span-1">
                    <span className="text-sm text-gray-600">{shot.duration}</span>
                  </div>

                  <div className="col-span-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(shot.status)}`}>
                      {shot.status}
                    </span>
                  </div>

                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditShot(shot)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                        <Eye size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!loading && filteredShots.length === 0 && (
            <div className="text-center py-12">
              <Camera size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shots found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <button
                onClick={onNewShot}
                className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90"
              >
                Create Your First Shot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}