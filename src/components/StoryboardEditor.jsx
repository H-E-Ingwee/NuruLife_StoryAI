import React, { useEffect, useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

import { getProjects, parseProjectScript, generateShotImage, getShotImageStatus, updateShot } from '../services/api';
import ScriptPanel from './ScriptPanel';
import StoryboardGrid from './StoryboardGrid';
import InspectorPanel from './InspectorPanel';

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

    // Display fields
    image: shot.image || null,
    image_status: shot.image_status,

    // Inspector fields
    lockSeed: Boolean(cd.lockedSeed),
    lockStyle: Boolean(cd.lockedStyle),
    lockedCharacter: null,

    // Keep for persistence
    consistency_data: cd,
  };
}

export default function StoryboardEditor() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null);

  const [scriptText, setScriptText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);

  const [panels, setPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setError(null);
      const res = await getProjects(1, 1000);
      if (res?.success) {
        const next = res.data || [];
        setProjects(next);
        if (next.length > 0) {
          const latest = [...next].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
          setProjectId(latest.id);
          setScriptText(latest.script_text || '');
        }
      } else {
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);


  const handleParseScenes = async () => {
    if (!projectId) return;
    const script = scriptText || '';
    if (!script.trim()) return;

    setIsParsing(true);
    setError(null);
    try {
      const res = await parseProjectScript(projectId, script);
      if (!res?.success) {
        throw new Error(res?.error?.message || 'Failed to parse script');
      }

      const shots = res?.data?.shots || [];
      const nextPanels = shots.map(shotToPanel);

      setPanels(nextPanels);
      setSelectedPanel(nextPanels[0] || null);
    } catch (e) {
      setError(e?.message || 'Failed to parse script');
    } finally {
      setIsParsing(false);
    }
  };

  const generateForPanel = async (panelId) => {
    const panel = panels.find((p) => p.id === panelId);
    if (!panel) return;

    // Generation options (MVP)
    const consistency = {
      lockSeed: Boolean(panel.lockSeed),
      lockStyle: Boolean(panel.lockStyle),
      referenceImageAssetIds: panel.consistency_data?.referenceImageAssetIds || [],
    };

    const res = await generateShotImage(panelId, {
      service: 'dalle',
      prompt: panel.prompt,
      width: 1024,
      height: 1024,
      consistency,
    });

    if (!res?.success) {
      throw new Error(res?.error?.message || 'Image generation failed');
    }

    const { status, image_url } = res?.data || {};

    if (status === 'completed') {
      setPanels((prev) =>
        prev.map((p) =>
          p.id === panelId
            ? {
                ...p,
                image: image_url || p.image,
                image_status: 'completed',
              }
            : p
        )
      );
      setSelectedPanel((prev) =>
        prev?.id === panelId
          ? { ...prev, image: image_url || prev.image, image_status: 'completed' }
          : prev
      );
      return;
    }

    // If processing, poll until completion.
    let safetyCounter = 0;
    while (safetyCounter < 60) {
      safetyCounter += 1;
      const poll = await getShotImageStatus(panelId);
      if (!poll?.success) break;

      const pollStatus = poll?.data?.image_status;
      if (pollStatus === 'completed' || pollStatus === 'failed') {
        setPanels((prev) =>
          prev.map((p) =>
            p.id === panelId
              ? {
                  ...p,
                  image: poll.data.image_url || p.image,
                  image_status: pollStatus,
                }
              : p
          )
        );
        setSelectedPanel((prev) =>
          prev?.id === panelId
            ? { ...prev, image: poll.data.image_url || prev.image, image_status: pollStatus }
            : prev
        );
        return;
      }

      // Wait a bit before next poll
      await new Promise((r) => setTimeout(r, 1500));
    }
  };

  const handleGenerateAllScenes = async () => {
    // Generate images for any panel that isn't completed yet.
    const pending = panels.filter((p) => p.image_status !== 'completed');
    for (const p of pending) {
      // eslint-disable-next-line no-await-in-loop
      await generateForPanel(p.id);
    }
  };

  const handleUpdatePanel = async (updatedPanel) => {
    const panelId = updatedPanel.id;

    const nextConsistency = {
      ...(updatedPanel.consistency_data || {}),
      lockedSeed: Boolean(updatedPanel.lockSeed),
      lockedStyle: Boolean(updatedPanel.lockStyle),
    };

    // Optimistic local update for responsiveness.
    setPanels((prev) =>
      prev.map((p) => (p.id === panelId ? { ...updatedPanel, consistency_data: nextConsistency } : p))
    );
    setSelectedPanel((prev) => (prev?.id === panelId ? { ...updatedPanel, consistency_data: nextConsistency } : prev));

    const res = await updateShot(panelId, {
      prompt: updatedPanel.prompt,
      notes: updatedPanel.notes,
      shotSize: updatedPanel.shotSize,
      cameraAngle: updatedPanel.cameraAngle,
      lens: updatedPanel.lens,
      consistency_data: nextConsistency,
    });

    if (res?.success) {
      const shot = res?.data;
      const mapped = shotToPanel(shot);
      setPanels((prev) => prev.map((p) => (p.id === panelId ? mapped : p)));
      setSelectedPanel((prev) => (prev?.id === panelId ? mapped : prev));
    }
  };

  return (
    <div className="h-full flex bg-[#F4F5F7]">
      <div className="w-80 shrink-0">
        <ScriptPanel
          script={scriptText}
          onScriptChange={setScriptText}
          onGenerateScenes={handleParseScenes}
          isGenerating={isParsing}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="p-6 border-b border-gray-200 bg-white flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#F28C00]" size={18} />
              <h2 className="text-lg font-bold text-gray-900">Storyboard Editor</h2>
            </div>
            <p className="text-sm text-gray-600">
              Parse a script into panels, then generate images and export.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={projectId || ''}
              onChange={(e) => {
                const nextId = e.target.value || null;
                const proj = projects.find((p) => p.id === nextId);
                setProjectId(nextId);
                setScriptText(proj?.script_text || '');
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateAllScenes}
              disabled={panels.length === 0}
              className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              Auto Generate Scenes
            </button>
          </div>
        </div>

        <StoryboardGrid
          panels={panels}
          onAddPanel={() => {}}
          onGenerateScenes={handleGenerateAllScenes}
          onEditPanel={(panel) => setSelectedPanel(panel)}
          onRegeneratePanel={(panelId) => generateForPanel(panelId)}
        />

        {error && (
          <div className="absolute top-16 right-6 z-50 bg-white border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}
      </div>

      <InspectorPanel
        selectedPanel={selectedPanel}
        onUpdatePanel={handleUpdatePanel}
        onClose={() => setSelectedPanel(null)}
      />
    </div>
  );
}

