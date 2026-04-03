import React, { useState } from 'react';
import { Plus, Sparkles, Edit3, RefreshCw, Star, Eye } from 'lucide-react';

export default function StoryboardGrid({ panels, onAddPanel, onGenerateScenes, onEditPanel, onRegeneratePanel }) {
  const [generatingIds, setGeneratingIds] = useState(new Set());

  const handleRegenerate = async (panelId) => {
    setGeneratingIds((prev) => new Set(prev).add(panelId));
    try {
      await onRegeneratePanel(panelId);
    } finally {
      setGeneratingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(panelId);
        return newSet;
      });
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onAddPanel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus size={16} />
              Add Panel
            </button>
            <button
              onClick={onGenerateScenes}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A233A] text-white rounded-lg text-sm font-medium hover:bg-opacity-90"
            >
              <Sparkles size={16} />
              Auto Generate Scenes
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        {panels.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-xl bg-white">
            <Sparkles size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No storyboard panels yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              Start by adding panels manually or use "Auto Generate Scenes" to parse your script and create panels automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {panels.map((panel, index) => (
              <StoryboardPanel
                key={panel.id}
                panel={panel}
                index={index}
                isGenerating={generatingIds.has(panel.id)}
                onEdit={() => onEditPanel(panel)}
                onRegenerate={() => handleRegenerate(panel.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StoryboardPanel({ panel, index, isGenerating, onEdit, onRegenerate }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Frame */}
      <div className="aspect-video bg-gray-100 relative group">
        {panel.image ? (
          <img
            src={panel.image}
            alt={`Panel ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <RefreshCw size={24} className="text-[#0A233A] animate-spin mb-2" />
              <span className="text-sm font-medium text-gray-600">Generating...</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Eye size={32} className="text-gray-300 mx-auto mb-2" />
              <span className="text-xs text-gray-400">Panel {index + 1}</span>
            </div>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 bg-white/90 rounded-full text-gray-700 hover:bg-white"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="p-2 bg-[#0A233A]/90 rounded-full text-white hover:bg-[#0A233A] disabled:opacity-50"
            >
              <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Panel Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {panel.scene || `Scene ${index + 1}`}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2">
              {panel.action || panel.description}
            </p>
          </div>
          <button className="text-gray-400 hover:text-yellow-500">
            <Star size={16} />
          </button>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-100 rounded">
            {panel.shotSize || 'WS'}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded">
            {panel.cameraAngle || 'Eye Level'}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded">
            {panel.lens || '35mm'}
          </span>
        </div>
      </div>
    </div>
  );
}