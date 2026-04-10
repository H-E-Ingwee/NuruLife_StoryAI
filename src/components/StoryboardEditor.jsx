import React, { useEffect, useState, useRef } from 'react';
import { 
  Sparkles, AlertCircle, Loader2, FileText, LayoutGrid, Maximize, 
  Layers, ChevronLeft, CheckCircle, X, Wand2, AlignLeft, Settings, Image as ImageIcon, SlidersHorizontal
} from 'lucide-react';

import { getProjects, parseProjectScript, generateShotImage, getShotImageStatus, updateShot } from '../services/api';
import StoryboardGrid from './StoryboardGrid';
import StoryboardCanvas from './StoryboardCanvas';

// Standardize shot metadata
function shotToPanel(shot) {
  const cd = shot.consistency_data || {};
  return {
    id: shot.id,
    scene: shot.scene,
    action: shot.action,
    prompt: shot.prompt || '',
    shotSize: shot.shotSize || 'MS',
    cameraAngle: shot.cameraAngle || 'Eye Level',
    lens: shot.lens || '50mm',
    notes: shot.notes || '',
    image: shot.image || null,
    image_status: shot.image_status,
    lockSeed: Boolean(cd.lockedSeed),
    lockStyle: Boolean(cd.lockedStyle),
    lockedCharacter: null,
    consistency_data: cd,
  };
}

export default function StoryboardEditor({ projectId = null, onBack }) {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  
  const [scriptText, setScriptText] = useState('');
  const [panels, setPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [generatingIds, setGeneratingIds] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [savingShotId, setSavingShotId] = useState(null);

  const pollIntervals = useRef({});

  useEffect(() => {
    loadProjects();
    return () => {
      Object.values(pollIntervals.current).forEach(clearInterval);
    };
  }, []);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const proj = projects.find(p => p.id === projectId);
      if (proj) {
        setActiveProject(proj);
        setScriptText(proj.script_text || '');
        if (proj.shots && proj.shots.length > 0) {
          setPanels(proj.shots.map(shotToPanel));
          setViewMode('grid');
        } else {
          setViewMode('script');
        }
      }
    }
  }, [projectId, projects]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const res = await getProjects(1, 100);
      
      // Handle different response formats
      if (res?.success) {
        const projectsData = Array.isArray(res.data) ? res.data : res.data?.items || [];
        setProjects(projectsData);
        
        if (projectsData.length > 0 && !activeProject) {
          setActiveProject(projectsData[0]);
          setScriptText(projectsData[0].script_text || '');
        }
      } else {
        console.warn('Failed to load projects:', res?.error);
        showNotification("Failed to load projects: " + (res?.error?.message || 'Unknown error'), "error");
      }
    } catch (e) {
      console.error('Error loading projects:', e);
      showNotification("Failed to load projects.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleParseScript = async () => {
    if (!scriptText.trim() || !projectId) return;
    try {
      setIsParsing(true);
      const res = await parseProjectScript(projectId, scriptText);
      if (res.success && res.data?.shots) {
        setPanels(res.data.shots.map(shotToPanel));
        showNotification('Script parsed successfully! Storyboards generated.');
        setViewMode('grid');
      } else {
        showNotification(res.error?.message || 'Parsing failed.', 'error');
      }
    } catch (e) {
      showNotification('Error parsing script.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const clearPolling = (shotId) => {
    if (pollIntervals.current[shotId]) {
      clearInterval(pollIntervals.current[shotId]);
      delete pollIntervals.current[shotId];
    }
  };

  const generateForPanel = async (sceneId, promptOverride = null) => {
    const targetPanel = panels.find(p => p.id === sceneId);
    if (!targetPanel || !projectId) return;

    const finalPrompt = promptOverride || targetPanel.prompt || targetPanel.action;
    if (!finalPrompt) {
      showNotification('Shot needs a prompt to generate an image.', 'error');
      return;
    }
    
    try {
      setGeneratingIds(prev => new Set(prev).add(sceneId));
      setPanels(prev => prev.map(p => p.id === sceneId ? { ...p, image_status: 'processing' } : p));
      
      const res = await generateShotImage(sceneId, projectId, finalPrompt);
      
      if (res.success) {
        startPolling(sceneId);
      } else {
        setGeneratingIds(prev => { const n = new Set(prev); n.delete(sceneId); return n; });
        showNotification(res.error?.message || 'Failed to start generation', 'error');
      }
    } catch (e) {
      setGeneratingIds(prev => { const n = new Set(prev); n.delete(sceneId); return n; });
      showNotification('Error starting generation.', 'error');
    }
  };

  const startPolling = (shotId) => {
    clearPolling(shotId);
    pollIntervals.current[shotId] = setInterval(async () => {
      try {
        const res = await getShotImageStatus(shotId, projectId);
        if (res.success) {
          const status = res.data.status;
          if (status === 'completed' || status === 'failed') {
            clearPolling(shotId);
            setGeneratingIds(prev => { const n = new Set(prev); n.delete(shotId); return n; });
            
            setPanels(prev => prev.map(p => 
              p.id === shotId ? { ...p, image: res.data.image_url, image_status: status } : p
            ));
            
            if (status === 'completed' && selectedPanel?.id === shotId) {
              setSelectedPanel(prev => ({ ...prev, image: res.data.image_url, image_status: status }));
            }
            if(status === 'failed') showNotification('Generation failed for a shot.', 'error');
          }
        }
      } catch (e) {
        clearPolling(shotId);
        setGeneratingIds(prev => { const n = new Set(prev); n.delete(shotId); return n; });
      }
    }, 4000);
  };

  const handleUpdatePanel = async (updatedPanel) => {
    try {
      setSavingShotId(updatedPanel.id);
      const res = await updateShot(updatedPanel.id, updatedPanel);
      if (res.success) {
        setPanels(prev => prev.map(p => p.id === updatedPanel.id ? updatedPanel : p));
        if (selectedPanel?.id === updatedPanel.id) setSelectedPanel(updatedPanel);
        showNotification('Shot details saved.');
      } else {
        showNotification('Failed to save panel.', 'error');
      }
    } catch (e) {
      showNotification('Failed to save panel updates.', 'error');
    } finally {
      setSavingShotId(null);
    }
  };

  // Inlined Premium Script View
  const renderScriptView = () => (
    <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[600px] overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F28C00]/10 rounded-lg"><AlignLeft size={18} className="text-[#F28C00]" /></div>
            <div>
              <h3 className="font-bold text-slate-900">Project Script</h3>
              <p className="text-xs text-slate-500 font-medium">Paste your screenplay below to auto-generate scenes.</p>
            </div>
          </div>
          <button 
            onClick={handleParseScript} 
            disabled={isParsing || !scriptText.trim()} 
            className="bg-[#0A233A] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#152f4a] transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            {isParsing ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />} 
            {isParsing ? 'Analyzing Story...' : 'Extract Scenes'}
          </button>
        </div>
        <div className="flex-1 relative">
          <textarea 
            value={scriptText} 
            onChange={(e) => setScriptText(e.target.value)} 
            disabled={isParsing}
            className="absolute inset-0 w-full h-full p-8 resize-none focus:outline-none focus:ring-4 focus:ring-inset focus:ring-[#F28C00]/10 font-mono text-sm leading-relaxed text-slate-700 bg-white"
            placeholder="INT. COFFEE SHOP - DAY&#10;&#10;JOHN (30s) sits nervously..."
          />
          {isParsing && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-xl flex items-center justify-center mb-4">
                <Loader2 size={32} className="text-[#F28C00] animate-spin" />
              </div>
              <p className="text-slate-800 font-bold text-lg">AI is processing your script...</p>
              <p className="text-slate-500 text-sm mt-1">Extracting characters, settings, and generating image prompts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Inlined Premium Inspector
  const renderInspector = () => {
    if (!selectedPanel) return null;
    const isGenerating = generatingIds.has(selectedPanel.id);
    const isSaving = savingShotId === selectedPanel.id;

    return (
      <div className="w-96 flex-shrink-0 bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col transform animate-in slide-in-from-right-8 duration-300">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-slate-700" />
            <h3 className="font-bold text-slate-900">Shot Inspector</h3>
          </div>
          <button onClick={() => setSelectedPanel(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="space-y-3">
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
               {selectedPanel.image ? (
                 <img src={selectedPanel.image} alt="preview" className="w-full h-full object-cover" />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center"><ImageIcon size={32} className="text-slate-300" /></div>
               )}
            </div>
            <button
              onClick={() => generateForPanel(selectedPanel.id, selectedPanel.prompt)}
              disabled={isGenerating}
              className="w-full py-2.5 bg-[#0A233A] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#152f4a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {isGenerating ? 'Generating Image...' : 'Generate AI Image'}
            </button>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Scene Heading</label>
              <input type="text" value={selectedPanel.scene || ''} onChange={(e) => setSelectedPanel({...selectedPanel, scene: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F28C00]/50 outline-none text-slate-800 font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Action / Description</label>
              <textarea value={selectedPanel.action || ''} onChange={(e) => setSelectedPanel({...selectedPanel, action: e.target.value})} rows={3} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F28C00]/50 outline-none text-slate-800 font-medium resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Shot Size</label>
                <select value={selectedPanel.shotSize || 'MS'} onChange={(e) => setSelectedPanel({...selectedPanel, shotSize: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F28C00]/50 outline-none text-slate-700 font-medium">
                  <option value="ECU">Extreme Close Up</option>
                  <option value="CU">Close Up</option>
                  <option value="MS">Medium Shot</option>
                  <option value="WS">Wide Shot</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Camera Angle</label>
                <select value={selectedPanel.cameraAngle || 'Eye Level'} onChange={(e) => setSelectedPanel({...selectedPanel, cameraAngle: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#F28C00]/50 outline-none text-slate-700 font-medium">
                  <option value="Eye Level">Eye Level</option>
                  <option value="High Angle">High Angle</option>
                  <option value="Low Angle">Low Angle</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">AI Generation Prompt</label>
              <textarea value={selectedPanel.prompt || ''} onChange={(e) => setSelectedPanel({...selectedPanel, prompt: e.target.value})} rows={4} className="w-full px-3 py-2 bg-indigo-50/30 border border-indigo-100 rounded-lg text-sm focus:ring-2 focus:ring-[#F28C00]/50 outline-none text-slate-800 font-mono resize-none leading-relaxed" />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button onClick={() => handleUpdatePanel(selectedPanel)} disabled={isSaving} className="w-full py-2.5 bg-[#F28C00] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#d67400] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  };

  if (!activeProject && !isLoading) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden relative">
      {notification && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className={`px-5 py-3 rounded-full shadow-xl flex items-center gap-3 font-bold text-sm ${notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} className="text-emerald-400" />}
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"><X size={14} /></button>
          </div>
        </div>
      )}

      {/* Editor Top Bar */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-900">{activeProject?.title || 'Loading...'}</h1>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-0.5">
              <span className="flex items-center gap-1"><Layers size={12}/> {panels.length} Panels</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[#F28C00]">Editor Mode</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
          <button onClick={() => setViewMode('script')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'script' ? 'bg-white text-[#0A233A] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
            <FileText size={16} /> Script
          </button>
          <button onClick={() => setViewMode('grid')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'grid' ? 'bg-white text-[#0A233A] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
            <LayoutGrid size={16} /> Grid
          </button>
          <button onClick={() => setViewMode('canvas')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'canvas' ? 'bg-white text-[#0A233A] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
            <Maximize size={16} /> Canvas
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden flex flex-col relative bg-slate-50">
          {isLoading && panels.length === 0 && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <Loader2 className="w-10 h-10 text-[#F28C00] animate-spin mb-3" />
              <p className="font-bold text-slate-600">Loading Project...</p>
            </div>
          )}

          {viewMode === 'script' && renderScriptView()}
          {viewMode === 'grid' && (
            <StoryboardGrid
              panels={panels}
              generatingIds={generatingIds}
              onAddPanel={() => showNotification('Manual panel adding coming soon!')}
              onGenerateScenes={() => {
                const missing = panels.filter(p => !p.image && !generatingIds.has(p.id));
                missing.forEach(p => generateForPanel(p.id));
              }}
              onEditPanel={(id) => setSelectedPanel(panels.find(p => p.id === id))}
              onRegeneratePanel={(id) => generateForPanel(id)}
            />
          )}
          {viewMode === 'canvas' && (
            <StoryboardCanvas
              scenes={panels.map((p, idx) => ({ ...p, heading: p.scene || `Scene ${idx + 1}`, lockedCharacter: p.lockStyle ? 'Locked' : 'Unlocked' }))}
              generatingIds={generatingIds}
              handleGenerateImage={(id, prompt) => generateForPanel(id, prompt)}
              onUpdatePanel={handleUpdatePanel}
              onSelectPanel={(id) => setSelectedPanel(panels.find(p => p.id === id))}
            />
          )}
        </div>
        {renderInspector()}
      </div>
    </div>
  );
}