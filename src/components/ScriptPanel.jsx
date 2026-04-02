import React, { useState } from 'react';
import { FileText, Wand2, RefreshCw, ChevronRight } from 'lucide-react';

export default function ScriptPanel({ script, onScriptChange, onGenerateScenes, isGenerating }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-400 hover:text-gray-600 rounded"
        >
          <ChevronRight size={16} />
        </button>
        <div className="mt-4">
          <FileText size={20} className="text-[#F28C00]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <FileText size={18} className="text-[#F28C00]" />
          Script Editor
        </h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Script Input */}
      <div className="flex-1 p-4">
        <textarea
          value={script}
          onChange={(e) => onScriptChange(e.target.value)}
          placeholder="Paste your screenplay here...

Example:
INT. COFFEE SHOP - DAY

JANE sits at a corner table, nursing a cup of coffee. She looks anxious, checking her watch repeatedly.

JOHN enters, spots her, and approaches with a warm smile."
          className="w-full h-full resize-none border border-gray-200 rounded-lg p-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
        />
      </div>

      {/* Generate Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onGenerateScenes}
          disabled={isGenerating || !script.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A233A] text-white rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Analyzing Script...
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Generate Scenes
            </>
          )}
        </button>
      </div>
    </div>
  );
}