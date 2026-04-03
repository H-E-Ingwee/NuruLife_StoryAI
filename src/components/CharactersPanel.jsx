import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  User,
  Users,
  Crown,
  Star,
  Eye,
  Copy
} from 'lucide-react';

import { getCharacters } from '../services/api';

export default function CharactersPanel({ onNewCharacter = () => {}, onEditCharacter = () => {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getCharacters();
        if (res?.success) {
          const mapped = (res.data || []).map((c) => ({
            id: c.id,
            name: c.name,
            role: c.role || '',
            type: c.type || '',
            project: c.project_id,
            description: c.description || '',
            traits: Array.isArray(c.traits) ? c.traits : [],
            appearances: c.appearance_count || 0,
            avatar: c.avatar_url || null,
          }));
          setCharacters(mapped);
        } else {
          setCharacters([]);
        }
      } catch (e) {
        setError(e?.message || 'Failed to load characters');
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || character.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'protagonist': return <Crown size={16} className="text-yellow-500" />;
      case 'antagonist': return <Star size={16} className="text-red-500" />;
      default: return <User size={16} className="text-blue-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'hero': return 'bg-green-100 text-green-800';
      case 'villain': return 'bg-red-100 text-red-800';
      case 'supporting': return 'bg-blue-100 text-blue-800';
      case 'historical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Characters</h1>
        <button
          onClick={onNewCharacter}
          className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Plus size={16} />
          New Character
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
                placeholder="Search characters..."
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
              <option value="all">All Characters</option>
              <option value="hero">Heroes</option>
              <option value="villain">Villains</option>
              <option value="supporting">Supporting</option>
              <option value="historical">Historical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map(character => (
            <div
              key={character.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              {/* Character Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    {character.avatar ? (
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{character.name}</h3>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(character.role)}
                      <span className="text-sm text-gray-600">{character.role}</span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Character Details */}
              <div className="p-4">
                <div className="mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(character.type)}`}>
                    {character.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{character.description}</p>

                {/* Traits */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Traits:</p>
                  <div className="flex flex-wrap gap-1">
                    {character.traits.slice(0, 3).map(trait => (
                      <span
                        key={trait}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {trait}
                      </span>
                    ))}
                    {character.traits.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{character.traits.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{character.appearances} appearances</span>
                  <span>{character.project}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => onEditCharacter(character)}
                    className="flex-1 px-3 py-2 text-sm bg-[#0A233A] text-white rounded hover:bg-opacity-90"
                  >
                    Edit
                  </button>
                  <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No characters found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={onNewCharacter}
              className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90"
            >
              Create Your First Character
            </button>
          </div>
        )}
      </div>
    </div>
  );
}