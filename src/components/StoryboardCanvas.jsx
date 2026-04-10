import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, Lock, RefreshCw, Loader2, Settings } from 'lucide-react';

export default function StoryboardCanvas({ scenes, generatingIds, handleGenerateImage, onUpdatePanel, onSelectPanel }) {
  // Local state for immediate typing feedback on prompts before Blur
  const [localPrompts, setLocalPrompts] = useState({});

  useEffect(() => {
    const prompts = {};
    scenes.forEach(s => { prompts[s.id] = s.prompt || ''; });
    setLocalPrompts(prompts);
  }, [scenes]);

  const handleBlur = (scene) => {
    if (localPrompts[scene.id] !== scene.prompt) {
      onUpdatePanel({ ...scene, prompt: localPrompts[scene.id] });
    }
  };

  if (scenes.length === 0) {
    return (
      <div className="flex-1 bg-slate-50 p-8 overflow-y-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center h-64 w-full max-w-2xl border-2 border-dashed border-slate-300 rounded-2xl bg-white/50">
          <ImageIcon size={48} className="text-slate-300 mb-4" />
          <p className="text-slate-600 font-bold text-lg mb-1">No scenes to display in Canvas view.</p>
          <p className="text-slate-500 text-sm font-medium">Switch to the Script view to extract scenes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Storyboard Canvas</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Review detailed AI prompts, tweak descriptions, and generate high-res assets.</p>
          </div>
        </div>

        <div className="space-y-8 pb-12">
          {scenes.map((scene, index) => {
            const generating = generatingIds.has(scene.id) || scene.image_status === 'processing';

            return (
              <div key={scene.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md group">
                <div className="md:w-5/12 bg-slate-100 relative min-h-[260px] flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-200">
                  {scene.image ? (
                    <img src={scene.image} alt={scene.action || 'Scene render'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      {generating ? (
                        <>
                          <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                            <Loader2 size={28} className="text-[#F28C00] animate-spin" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Painting Scene...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={48} className="text-slate-300 mb-4" />
                          <span className="text-sm font-medium text-slate-500 mb-5">No Visual Generated</span>
                          <button
                            onClick={() => handleGenerateImage(scene.id, localPrompts[scene.id] || scene.prompt)}
                            className="bg-[#F28C00] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#d67400] transition-transform active:scale-95 flex items-center gap-2"
                          >
                            <Sparkles size={16} /> Generate Visual
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {scene.image && !generating && (
                    <button
                      onClick={() => handleGenerateImage(scene.id, localPrompts[scene.id] || scene.prompt)}
                      className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white p-2.5 rounded-xl hover:bg-slate-900 transition-colors shadow-xl"
                      title="Regenerate Image"
                    >
                      <RefreshCw size={18} />
                    </button>
                  )}

                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm border border-white/10 tracking-wide uppercase">
                    Shot {index + 1}
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5 line-clamp-1">{scene.heading}</h3>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed font-medium">
                        {scene.action || "No action described."}
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectPanel(scene.id)}
                      className="p-2 text-slate-400 hover:text-[#0A233A] hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0 border border-transparent hover:border-slate-200"
                      title="Open Shot Settings"
                    >
                      <Settings size={20} />
                    </button>
                  </div>

                  <div className="mt-auto">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                      AI Generator Prompt
                      <span className="text-[#F28C00] font-semibold lowercase bg-orange-50 px-2 py-0.5 rounded">editable</span>
                    </label>
                    <textarea
                      value={localPrompts[scene.id] !== undefined ? localPrompts[scene.id] : scene.prompt}
                      onChange={(e) => setLocalPrompts({...localPrompts, [scene.id]: e.target.value})}
                      onBlur={() => handleBlur(scene)}
                      className="w-full h-24 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#F28C00]/50 focus:bg-white resize-none font-mono transition-colors shadow-inner"
                      placeholder="Describe the exact visual details, lighting, and mood..."
                    />
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${scene.lockedCharacter === 'Locked' ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        <Lock size={12} className={scene.lockedCharacter === 'Locked' ? "text-[#F28C00]" : "text-slate-400"} />
                        Character: {scene.lockedCharacter}
                      </div>
                    </div>
                    {scene.image && (
                       <button
                         onClick={() => handleGenerateImage(scene.id, localPrompts[scene.id] || scene.prompt)}
                         disabled={generating}
                         className="px-5 py-2.5 bg-[#0A233A] text-white rounded-xl text-sm font-bold hover:bg-[#152f4a] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-sm"
                       >
                         {generating ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16}/>}
                         Update Render
                       </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}