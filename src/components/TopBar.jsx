import React from 'react';
import { Undo, Redo, Download, Share2, Check } from 'lucide-react';

export default function TopBar({ projectName, onExport, onShare }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Check size={16} className="text-green-500" />
          <span className="text-sm font-medium text-gray-600">Auto-saved</span>
        </div>
        <div className="text-sm font-semibold text-gray-900">
          {projectName || 'Untitled Project'}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Undo size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Redo size={18} />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        <button
          onClick={onShare}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
        >
          <Share2 size={16} />
          Share
        </button>
        <button
          onClick={onExport}
          className="px-4 py-2 text-sm font-medium text-white bg-[#0A233A] rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </header>
  );
}