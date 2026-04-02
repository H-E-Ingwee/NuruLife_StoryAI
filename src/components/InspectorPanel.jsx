import React, { useState } from 'react';
import { Settings, Camera, User, Image as ImageIcon, ChevronLeft } from 'lucide-react';

export default function InspectorPanel({ selectedPanel, onUpdatePanel, onClose }) {
  const [activeTab, setActiveTab] = useState('prompt');

  if (!selectedPanel) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Settings size={18} className="text-[#F28C00]" />
            Inspector
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Settings size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm">Select a panel to edit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Settings size={18} className="text-[#F28C00]" />
          Panel Inspector
        </h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'prompt'
              ? 'text-[#0A233A] border-b-2 border-[#F28C00]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Prompt
        </button>
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'camera'
              ? 'text-[#0A233A] border-b-2 border-[#F28C00]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Camera
        </button>
        <button
          onClick={() => setActiveTab('character')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'character'
              ? 'text-[#0A233A] border-b-2 border-[#F28C00]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Character
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'prompt' && (
          <PromptEditor panel={selectedPanel} onUpdate={onUpdatePanel} />
        )}
        {activeTab === 'camera' && (
          <CameraControls panel={selectedPanel} onUpdate={onUpdatePanel} />
        )}
        {activeTab === 'character' && (
          <CharacterControls panel={selectedPanel} onUpdate={onUpdatePanel} />
        )}
      </div>
    </div>
  );
}

function PromptEditor({ panel, onUpdate }) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Prompt
        </label>
        <textarea
          value={panel.prompt || ''}
          onChange={(e) => onUpdate({ ...panel, prompt: e.target.value })}
          className="w-full h-32 resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
          placeholder="Describe what you want to see in this panel..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={panel.notes || ''}
          onChange={(e) => onUpdate({ ...panel, notes: e.target.value })}
          className="w-full h-20 resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
          placeholder="Director notes, continuity reminders..."
        />
      </div>
    </div>
  );
}

function CameraControls({ panel, onUpdate }) {
  const shotSizes = ['ECU', 'CU', 'MCU', 'MS', 'WS', 'EWS'];
  const cameraAngles = ['High', 'Low', 'Eye Level', 'Dutch', 'Birds Eye', 'Worms Eye'];
  const lenses = ['16mm', '24mm', '35mm', '50mm', '85mm', '135mm'];

  return (
    <div className="p-4 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Shot Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {shotSizes.map(size => (
            <button
              key={size}
              onClick={() => onUpdate({ ...panel, shotSize: size })}
              className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                panel.shotSize === size
                  ? 'bg-[#0A233A] text-white border-[#0A233A]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Camera Angle
        </label>
        <div className="grid grid-cols-2 gap-2">
          {cameraAngles.map(angle => (
            <button
              key={angle}
              onClick={() => onUpdate({ ...panel, cameraAngle: angle })}
              className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                panel.cameraAngle === angle
                  ? 'bg-[#0A233A] text-white border-[#0A233A]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {angle}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Lens Focal Length
        </label>
        <div className="grid grid-cols-3 gap-2">
          {lenses.map(lens => (
            <button
              key={lens}
              onClick={() => onUpdate({ ...panel, lens: lens })}
              className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                panel.lens === lens
                  ? 'bg-[#0A233A] text-white border-[#0A233A]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {lens}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CharacterControls({ panel, onUpdate }) {
  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Character Consistency
        </label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={panel.lockSeed || false}
              onChange={(e) => onUpdate({ ...panel, lockSeed: e.target.checked })}
              className="rounded border-gray-300 text-[#0A233A] focus:ring-[#F28C00]"
            />
            <span className="text-sm text-gray-700">Lock Seed</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={panel.lockStyle || false}
              onChange={(e) => onUpdate({ ...panel, lockStyle: e.target.checked })}
              className="rounded border-gray-300 text-[#0A233A] focus:ring-[#F28C00]"
            />
            <span className="text-sm text-gray-700">Lock Style</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <ImageIcon size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">Upload character reference</p>
          <button className="px-3 py-1 text-sm text-[#0A233A] border border-[#0A233A] rounded hover:bg-[#0A233A] hover:text-white">
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
}