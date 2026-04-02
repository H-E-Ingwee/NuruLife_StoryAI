import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ScriptPanel from './ScriptPanel';
import StoryboardGrid from './StoryboardGrid';
import InspectorPanel from './InspectorPanel';
import SettingsPanel from './SettingsPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [script, setScript] = useState('');
  const [panels, setPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    name: 'My Storyboard Project',
    id: 1
  });

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    navigate('/');
  };

  const handleGenerateScenes = async () => {
    if (!script.trim()) return;

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const newPanels = [
        {
          id: 1,
          scene: 'INT. COFFEE SHOP - DAY',
          action: 'JANE sits at a corner table, nursing a cup of coffee. She looks anxious.',
          prompt: 'Interior coffee shop during day, young woman sitting at table looking anxious, warm lighting, realistic style',
          shotSize: 'MS',
          cameraAngle: 'Eye Level',
          lens: '50mm',
          image: null,
          notes: 'Establish character mood'
        },
        {
          id: 2,
          scene: 'INT. COFFEE SHOP - DAY',
          action: 'JOHN enters, spots her, and approaches with a warm smile.',
          prompt: 'Interior coffee shop, man entering and approaching woman at table, warm welcoming expression',
          shotSize: 'WS',
          cameraAngle: 'Low Angle',
          lens: '35mm',
          image: null,
          notes: 'Show character entrance'
        },
        {
          id: 3,
          scene: 'CU. JANE - DAY',
          action: 'Close up on Jane\'s face as she recognizes John.',
          prompt: 'Close up of woman\'s face showing recognition and relief, emotional expression',
          shotSize: 'CU',
          cameraAngle: 'Eye Level',
          lens: '85mm',
          image: null,
          notes: 'Emotional reaction shot'
        }
      ];

      setPanels(newPanels);
      setIsGenerating(false);
    }, 2000);
  };

  const handleAddPanel = () => {
    const newPanel = {
      id: Date.now(),
      scene: 'New Scene',
      action: 'Describe the action here...',
      prompt: '',
      shotSize: 'MS',
      cameraAngle: 'Eye Level',
      lens: '50mm',
      image: null,
      notes: ''
    };
    setPanels([...panels, newPanel]);
  };

  const handleEditPanel = (panel) => {
    setSelectedPanel(panel);
  };

  const handleUpdatePanel = (updatedPanel) => {
    setPanels(panels.map(p => p.id === updatedPanel.id ? updatedPanel : p));
    setSelectedPanel(updatedPanel);
  };

  const handleRegeneratePanel = (panelId) => {
    // Simulate regeneration
    setPanels(panels.map(p =>
      p.id === panelId
        ? { ...p, image: `https://picsum.photos/400/300?random=${Date.now()}` }
        : p
    ));
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting storyboard...');
  };

  const handleShare = () => {
    // Share functionality
    console.log('Sharing storyboard...');
  };

  return (
    <div className="h-screen flex bg-[#F4F5F7]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeTab === 'settings' ? (
          <SettingsPanel onBack={() => setActiveTab('dashboard')} />
        ) : (
          <>
            {/* Top Bar */}
            <TopBar
              projectName={currentProject.name}
              onExport={handleExport}
              onShare={handleShare}
            />

            {/* Workspace */}
            <div className="flex-1 flex min-h-0">
              {/* Script Panel */}
              <ScriptPanel
                script={script}
                onScriptChange={setScript}
                onGenerateScenes={handleGenerateScenes}
                isGenerating={isGenerating}
              />

              {/* Main Storyboard Grid */}
              <StoryboardGrid
                panels={panels}
                onAddPanel={handleAddPanel}
                onGenerateScenes={handleGenerateScenes}
                onEditPanel={handleEditPanel}
                onRegeneratePanel={handleRegeneratePanel}
              />

              {/* Inspector Panel */}
              <InspectorPanel
                selectedPanel={selectedPanel}
                onUpdatePanel={handleUpdatePanel}
                onClose={() => setSelectedPanel(null)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}