import React from 'react';
import { FileText, RefreshCw, Wand2 } from 'lucide-react';

export default function ScriptEditor({ script, setScript, isParsing, handleParseScript }) {
  return (
    <div className="w-1/3 min-w-[350px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <FileText size={18} className="text-[#F28C00]" /> Script Editor
        </h2>
        <button 
          onClick={handleParseScript}
          disabled={isParsing}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white rounded-md transition-all disabled:opacity-70 bg-[#0A233A] hover:bg-opacity-90"
        >
          {isParsing ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
          {isParsing ? 'Analyzing...' : 'Auto-Generate Scenes'}
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full h-full resize-none outline-none font-mono text-sm leading-relaxed text-gray-800 placeholder-gray-400"
        />
      </div>
    </div>
  );
}