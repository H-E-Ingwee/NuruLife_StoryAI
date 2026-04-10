import React from 'react';
import { Plus, Sparkles, RefreshCw, Eye, Image as ImageIcon, Wand2, CheckCircle } from 'lucide-react';

export default function StoryboardGrid({ panels, generatingIds, onAddPanel, onGenerateScenes, onEditPanel, onRegeneratePanel }) {
  if (panels.length === 0) {
    return (
      <div className="flex-1 bg-slate-50 p-6 overflow-y-auto flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3 shadow-inner border border-orange-100">
            <Sparkles className="text-[#F28C00] -rotate-3" size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Storyboard Panels</h3>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            Switch to the Script view to automatically extract scenes, or add your first panel manually.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={onAddPanel} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <Plus size={18} /> Add Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Storyboard Grid</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Overview of your generated scenes and visual assets.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onAddPanel} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors active:scale-95">
              <Plus size={16} /> Add Panel
            </button>
            <button onClick={onGenerateScenes} className="flex items-center gap-2 px-4 py-2.5 bg-[#0A233A] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#152f4a] transition-all active:scale-95">
              <Sparkles size={16} className="text-[#F28C00]" /> Generate Missing
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
          {panels.map((panel, index) => {
            const isGenerating = generatingIds.has(panel.id) || panel.image_status === 'processing';
            
            return (
              <div 
                key={panel.id} 
                onClick={() => onEditPanel(panel.id)} 
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#F28C00]/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                {/* Image Area */}
                <div className="relative aspect-video bg-slate-100 flex-shrink-0 overflow-hidden border-b border-slate-100">
                  {panel.image ? (
                    <img src={panel.image} alt={panel.action || 'Storyboard panel'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      {isGenerating ? (
                        <>
                          <RefreshCw size={28} className="text-[#F28C00] animate-spin mb-3" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Eye size={32} className="text-slate-300 mb-2" />
                          <span className="text-xs font-medium text-slate-400">Not Generated</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Overlay */}
                  {!isGenerating && (
                    <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] ${panel.image ? 'bg-slate-900/60' : 'bg-slate-900/40'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRegeneratePanel(panel.id); }} 
                        className="bg-[#F28C00] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 hover:bg-[#d67400] transition-colors transform scale-95 group-hover:scale-100 duration-200"
                      >
                        {panel.image ? <RefreshCw size={16} /> : <Wand2 size={16} />}
                        {panel.image ? 'Regenerate' : 'Generate'}
                      </button>
                    </div>
                  )}

                  {/* Shot Number Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-widest border border-white/20">
                    Shot {index + 1}
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 pr-3">
                      <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                        {panel.scene || panel.heading || `Scene ${index + 1}`}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                        {panel.action || panel.description || panel.prompt || "No action described."}
                      </p>
                    </div>
                    {panel.image_status === 'completed' && (
                      <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Metadata Tags */}
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200">
                      {panel.shotSize || 'MS'}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200">
                      {panel.cameraAngle || 'Eye Level'}
                    </span>
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