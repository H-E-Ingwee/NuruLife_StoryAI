import React, { useState, useEffect } from 'react';
import {
  Plus, Sparkles, Upload, RefreshCw, Download, Trash2, Edit3, Eye,
  ChevronRight, Zap, Lock, Unlock, Settings, Film, AlertCircle, CheckCircle,
  Clock, Wand2
} from 'lucide-react';
import { getProjects, createProject, parseProjectScript, generateShotImage, getShotImageStatus } from '../services/api';

/**
 * Professional Storyboarding Panel
 * - Script parsing with NLP
 * - Auto-generated storyboards
 * - Professional shot metadata display
 * - Real-time image generation
 * - Consistency controls
 */
export default function StoryboardsPanel() {
  // ==================== State ====================
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [scriptText, setScriptText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState(null);

  const [storyboards, setStoryboards] = useState([]);
  const [selectedStoryboard, setSelectedStoryboard] = useState(null);
  const [shots, setShots] = useState([]);

  const [generatingShots, setGeneratingShots] = useState(new Set());
  const [pollIntervals, setPollIntervals] = useState({});
  const [selectedShot, setSelectedShot] = useState(null);

  // ==================== Effects ====================
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setScriptText(selectedProject.script_text || '');
    }
  }, [selectedProject]);

  // Sync storyboards when selectedStoryboard changes
  useEffect(() => {
    if (selectedStoryboard) {
      // Sync shots state with the selected storyboard's shots
      const storyboardShots = storyboards.find(sb => sb.id === selectedStoryboard.id)?.shots || [];
      setShots(storyboardShots);
    }
  }, [selectedStoryboard, storyboards]);

  // ==================== Fetching ====================
  const fetchProjects = async () => {
    try {
      const res = await getProjects(1, 100);
      
      if (res?.success && res.data) {
        const projectsArray = Array.isArray(res.data) ? res.data : [];
        setProjects(projectsArray);
        
        if (projectsArray.length > 0 && !selectedProject) {
          setSelectedProject(projectsArray[0]);
        }
      } else {
        console.error('Failed to fetch projects:', res?.error);
        setParseError(`Failed to load projects: ${res?.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during project fetch:', error);
      setParseError(`Error: ${error?.message || 'Failed to fetch projects'}`);
    }
  };

  // ==================== State Sync Helpers ====================
  /**
   * Helper function to update a shot in both shots state and storyboards array
   * This ensures data consistency across the component
   */
  const updateShotInAllStates = (shotId, shotUpdates) => {
    // Update shots state
    setShots(prevShots =>
      prevShots.map(s =>
        s.id === shotId ? { ...s, ...shotUpdates } : s
      )
    );

    // Update storyboards array to keep it in sync
    setStoryboards(prevStoryboards =>
      prevStoryboards.map(sb => ({
        ...sb,
        shots: (sb.shots || []).map(s =>
          s.id === shotId ? { ...s, ...shotUpdates } : s
        ),
      }))
    );

    // Update selectedStoryboard if it contains this shot
    if (selectedStoryboard) {
      const updatedShots = (selectedStoryboard.shots || []).map(s =>
        s.id === shotId ? { ...s, ...shotUpdates } : s
      );
      setSelectedStoryboard({
        ...selectedStoryboard,
        shots: updatedShots,
      });
    }
  };

  // ==================== Script Parsing ====================
  const handleParseScript = async () => {
    if (!selectedProject || !scriptText.trim()) {
      setParseError('Please select a project and enter script text');
      return;
    }

    setParsing(true);
    setParseError(null);

    try {
      const res = await parseProjectScript(selectedProject.id, scriptText);
      
      if (!res?.success) {
        const errorMsg = res?.error?.message || res?.error?.code || 'Failed to parse script';
        throw new Error(errorMsg);
      }

      if (!res.data) {
        throw new Error('No data returned from parse operation');
      }

      // Create storyboard from response
      const storyboardData = {
        id: res.data?.storyboard_id || 'sb_' + Date.now(),
        project_id: selectedProject.id,
        title: `${selectedProject.title} - Storyboard`,
        shots: res.data?.shots || [],
        characters: res.data?.characters || [],
        locations: res.data?.locations || [],
        totalShots: res.data?.total_shots || res.data?.shots?.length || 0,
        createdAt: new Date().toISOString(),
      };

      setStoryboards([storyboardData, ...storyboards]);
      setSelectedStoryboard(storyboardData);
      setShots(storyboardData.shots || []);
      setParseError(null);

    } catch (error) {
      const errorMsg = error?.message || error || 'Failed to parse script';
      console.error('Parse error:', error);
      setParseError(errorMsg);
    } finally {
      setParsing(false);
    }
  };

  // ==================== Image Generation ====================
  const handleGenerateShotImage = async (shot) => {
    if (!shot) return;

    const shotKey = shot.id;
    setGeneratingShots(prev => new Set(prev).add(shotKey));

    try {
      const res = await generateShotImage(shot.id, {
        prompt: shot.prompt,
        service: 'dalle',
        width: 1920,
        height: 1080,
        consistency: {
          lockedStyle: true,
          lockedSeed: false,
        },
      });

      if (res?.success) {
        // Update shot with job info using the sync helper
        updateShotInAllStates(shot.id, {
          generation_job_id: res.data?.job_id,
          image_status: 'processing',
        });

        // Start polling for completion
        if (res.data?.job_id) {
          pollImageStatus(shot.id, res.data.job_id);
        }
      } else {
        throw new Error(res?.error?.message || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      // Update shot status to failed using the sync helper
      updateShotInAllStates(shot.id, {
        image_status: 'failed',
      });
    } finally {
      setGeneratingShots(prev => {
        const newSet = new Set(prev);
        newSet.delete(shotKey);
        return newSet;
      });
    }
  };

  const pollImageStatus = (shotId, jobId) => {
    // Clear existing interval if any
    if (pollIntervals[shotId]) {
      clearInterval(pollIntervals[shotId]);
    }

    // Poll every 2 seconds
    const interval = setInterval(async () => {
      try {
        const res = await getShotImageStatus(shotId);
        if (res?.success) {
          const status = res.data?.image_status;
          
          // Update shot in all states using the sync helper
          updateShotInAllStates(shotId, {
            image_status: status,
            image: status === 'completed' ? res.data?.image_url : undefined,
          });

          // Stop polling if complete or failed
          if (status === 'completed' || status === 'failed') {
            clearInterval(interval);
            setPollIntervals(prev => {
              const newPolls = { ...prev };
              delete newPolls[shotId];
              return newPolls;
            });
          }
        }
      } catch (error) {
        console.error('Poll error:', error);
        clearInterval(interval);
      }
    }, 2000);

    setPollIntervals(prev => ({ ...prev, [shotId]: interval }));
  };

  // ==================== Helpers ====================
  const handleCreateProject = async () => {
    const projectTitle = prompt('Enter project title:', 'New Project');
    if (!projectTitle) return;

    try {
      const res = await createProject(projectTitle, 'Auto-created project', '');
      if (res?.success) {
        const newProject = res.data;
        setProjects([newProject, ...projects]);
        setSelectedProject(newProject);
        setParseError(null);
      } else {
        setParseError('Failed to create project');
      }
    } catch (error) {
      setParseError('Error creating project: ' + error.message);
    }
  };

  const getShotStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getShotStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} />;
      case 'processing': return <RefreshCw size={16} className="animate-spin" />;
      case 'failed': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  // ==================== Render ====================
  return (
    <div className="flex flex-col lg:flex-row h-full lg:gap-4 bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Film size={20} md:size={24} className="text-[#F28C00]" />
              Storyboards
            </h2>
            {selectedProject && (
              <div className="text-xs md:text-sm text-gray-600 order-3 md:order-2">
                Project: <strong>{selectedProject.title}</strong>
              </div>
            )}
          </div>

          {/* Project Selector - Responsive Stack */}
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 items-stretch sm:items-center mb-4">
            <select
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const p = projects.find(proj => proj.id === e.target.value);
                setSelectedProject(p);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C00] flex-1 text-sm md:text-base"
            >
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 bg-[#F28C00] text-white rounded-lg font-medium hover:bg-[#E07D00] transition-colors flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={16} />
              New
            </button>
          </div>

          {/* Error Alert */}
          {parseError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2 text-xs md:text-sm">
              <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-600">{parseError}</p>
            </div>
          )}

          {/* Script Input */}
          <div className="space-y-2 md:space-y-3">
            <label className="block text-xs md:text-sm font-medium text-gray-700">
              Script Text
            </label>
            <textarea
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Paste your screenplay here... (supports standard screenplay format: INT./EXT. scene headings)"
              className="w-full h-24 md:h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C00] font-mono text-xs md:text-sm resize-none"
            />
            <button
              onClick={handleParseScript}
              disabled={parsing || !selectedProject || !scriptText.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-gradient-to-r from-[#0A233A] to-[#1a3a52] text-white rounded-lg font-medium hover:from-[#1a3a52] hover:to-[#2a4a62] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
            >
              {parsing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Parsing Script...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Parse Script & Generate Storyboard
                </>
              )}
            </button>
          </div>
        </div>

        {/* Storyboards Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {storyboards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <Film size={40} md:size={48} className="text-gray-300 mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-2">
                No Storyboards Yet
              </h3>
              <p className="text-gray-500 max-w-md text-sm md:text-base">
                {projects.length === 0 
                  ? "Create a new project from the Projects panel to get started"
                  : "Paste a script above and click \"Parse Script\" to generate your first storyboard"}
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {storyboards.map((storyboard) => (
                <div key={storyboard.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Storyboard Header */}
                  <div
                    onClick={() => setSelectedStoryboard(
                      selectedStoryboard?.id === storyboard.id ? null : storyboard
                    )}
                    className="bg-gradient-to-r from-[#0A233A] to-[#1a3a52] p-3 md:p-4 cursor-pointer text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <Film size={18} md:size={20} className="flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base truncate">{storyboard.title}</h3>
                        <p className="text-xs text-gray-300">
                          {storyboard.totalShots} shots • {storyboard.characters?.length || 0} characters
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className={`flex-shrink-0 transition-transform ml-2`}
                      style={{transform: selectedStoryboard?.id === storyboard.id ? 'rotate(90deg)' : 'none'}}
                    />
                  </div>

                  {/* Storyboard Shots Grid */}
                  {selectedStoryboard?.id === storyboard.id && (
                    <div className="p-3 md:p-4 bg-gray-50 border-t border-gray-200">
                      {storyboard.shots?.length === 0 ? (
                        <p className="text-gray-500 text-center py-8 text-sm md:text-base">No shots in this storyboard</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                          {storyboard.shots.map((shot, idx) => (
                            <ShotCard
                              key={shot.id}
                              shot={shot}
                              index={idx + 1}
                              isGenerating={generatingShots.has(shot.id)}
                              onGenerate={() => handleGenerateShotImage(shot)}
                              onSelect={() => setSelectedShot(shot)}
                              isSelected={selectedShot?.id === shot.id}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inspector Panel - Responsive Modal/Sidebar */}
      {selectedShot && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-40"
            onClick={() => setSelectedShot(null)}
          />
          
          {/* Inspector - Fixed Sidebar on Desktop, Fixed Drawer on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 lg:static lg:bottom-auto lg:left-auto lg:right-auto w-full lg:w-96 h-4/5 lg:h-auto bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col overflow-hidden shadow-lg lg:shadow-none z-50 lg:z-auto">
            {/* Close Button */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Shot Inspector</h3>
              <button
                onClick={() => setSelectedShot(null)}
                className="text-gray-500 hover:text-gray-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Shot Details */}
            <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 p-3 md:p-4">
              {/* Scene */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Scene
                </label>
                <p className="text-sm text-gray-900">{selectedShot.scene}</p>
              </div>

              {/* Action */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Action
                </label>
                <p className="text-xs md:text-sm text-gray-700 line-clamp-3">{selectedShot.action}</p>
              </div>

              {/* Film Terminology */}
              <div className="bg-blue-50 rounded-lg p-2 md:p-3 border border-blue-200">
                <h4 className="text-xs font-semibold text-blue-900 mb-2 md:mb-3 uppercase">
                  Shooting Parameters
                </h4>
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Shot Size:</span>
                    <span className="font-medium text-gray-900">{selectedShot.shotSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Camera Angle:</span>
                    <span className="font-medium text-gray-900">{selectedShot.cameraAngle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Lens:</span>
                    <span className="font-medium text-gray-900">{selectedShot.lens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Time of Day:</span>
                    <span className="font-medium text-gray-900">{selectedShot.time_of_day || 'DAY'}</span>
                  </div>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  AI Prompt
                </label>
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                  {selectedShot.prompt}
                </p>
              </div>

              {/* Consistency */}
              {selectedShot.consistency_data?.character_names?.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-2 md:p-3 border border-purple-200">
                  <h4 className="text-xs font-semibold text-purple-900 mb-2 uppercase">
                    Consistency
                  </h4>
                  <p className="text-xs text-purple-700">
                    <strong>Characters:</strong> {selectedShot.consistency_data.character_names.join(', ')}
                  </p>
                </div>
              )}

              {/* Image Status */}
              {selectedShot.image_status && (
                <div className={`rounded-lg p-2 md:p-3 flex items-center gap-2 text-xs md:text-sm ${getShotStatusColor(selectedShot.image_status)}`}>
                  {getShotStatusIcon(selectedShot.image_status)}
                  <span className="font-medium capitalize">
                    {selectedShot.image_status === 'pending' ? 'Ready to generate' : selectedShot.image_status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Shot Card Component - Fully Responsive
 */
function ShotCard({ shot, index, isGenerating, onGenerate, onSelect, isSelected }) {
  return (
    <div
      onClick={onSelect}
      className={`rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-[#F28C00] shadow-lg ring-2 ring-[#F28C00] ring-opacity-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Image Area */}
      <div className="aspect-video bg-gray-100 relative group">
        {shot.image ? (
          <>
            <img
              src={shot.image}
              alt={`Shot ${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          </>
        ) : isGenerating ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <RefreshCw size={24} className="text-[#0A233A] animate-spin" />
            <span className="text-xs font-medium text-gray-600">Generating...</span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Eye size={20} md:size={24} className="text-gray-300" />
            <span className="text-xs text-gray-400">Not generated</span>
          </div>
        )}

        {/* Action Button Overlay */}
        {!shot.image && !isGenerating && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerate();
            }}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="flex items-center gap-2 bg-[#F28C00] text-white px-3 py-2 rounded-lg font-medium text-xs md:text-sm">
              <Wand2 size={14} />
              Generate
            </div>
          </button>
        )}
      </div>

      {/* Info - Responsive Padding */}
      <div className="p-2 md:p-3 bg-white">
        <div className="flex items-start justify-between gap-2 mb-1 md:mb-2">
          <h4 className="text-xs md:text-sm font-semibold text-gray-900">Shot {index}</h4>
          {shot.image_status === 'completed' && (
            <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-600 mb-1 md:mb-2 line-clamp-1">
          {shot.scene}
        </p>
        <p className="text-xs text-gray-500">
          {shot.shotSize} • {shot.cameraAngle}
        </p>
      </div>
    </div>
  );
}