import React from 'react';
import { Image as ImageIcon, Sparkles, Lock } from 'lucide-react';

export default function StoryboardCanvas({ scenes, generatingId, handleGenerateImage, updatePrompt }) {
  return (
    <div className="flex-1 bg-[#F8F9FA] overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Storyboard</h1>
            <p className="text-sm text-gray-500 mt-1">Review AI prompts and generate visual assets.</p>
          </div>
        </div>

        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-white/50">
            <ImageIcon size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-sm">No scenes generated yet.</p>
            <p className="text-gray-400 text-xs mt-1">Click "Auto-Generate Scenes" to parse your script.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {scenes.map((scene, index) => (
              <div key={scene.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
                
                {/* Image Preview Area */}
                <div className="md:w-5/12 bg-gray-100 border-r border-gray-200 relative min-h-[250px] flex items-center justify-center group">
                  {scene.image ? (
                    <img src={scene.image} alt="Storyboard Panel" className="w-full h-full object-cover" />
                  ) : generatingId === scene.id ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 rounded-full border-t-transparent border-[#7B1823] animate-spin mb-3"></div>
                      <span className="text-xs font-bold text-[#0A233A]">Generating...</span>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon size={32} className="text-gray-300 mx-auto mb-2" />
                      <span className="text-xs text-gray-400 font-medium">Panel {index + 1} Preview</span>
                    </div>
                  )}
                  
                  {/* Generate Button Overlay */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${scene.image ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-transparent'}`}>
                    {generatingId !== scene.id && (
                      <button 
                        onClick={() => handleGenerateImage(scene.id, scene.prompt)}
                        className="px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transform transition-transform hover:scale-105 flex items-center gap-2 bg-[#7B1823]"
                      >
                        <Sparkles size={16} /> 
                        {scene.image ? 'Regenerate' : 'Generate Image'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Prompt & Controls Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded">Panel {index + 1}</span>
                    <h3 className="text-sm font-bold text-gray-900 mt-2">{scene.heading}</h3>
                    <p className="text-xs text-gray-500 mt-1 italic border-l-2 pl-2 border-gray-300">{scene.action}</p>
                  </div>
                  <div className="flex-1 mt-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center justify-between">
                      AI Prompt
                      <span className="text-gray-400 font-normal lowercase">editable</span>
                    </label>
                    <textarea 
                      value={scene.prompt}
                      onChange={(e) => updatePrompt(scene.id, e.target.value)}
                      className="w-full h-24 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#F28C00] resize-none"
                    />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-orange-50 text-orange-800 border border-orange-200">
                        <Lock size={12} className="text-[#F28C00]" />
                        Character: {scene.lockedCharacter}
                      </div>
                      <button className="text-[11px] text-gray-500 hover:text-gray-800 underline">Add Reference Image +</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}