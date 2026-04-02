import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ScriptPanel from './ScriptPanel';
import StoryboardGrid from './StoryboardGrid';
import InspectorPanel from './InspectorPanel';
import SettingsPanel from './SettingsPanel';
import ProjectsPanel from './ProjectsPanel';
import StoryboardsPanel from './StoryboardsPanel';
import CharactersPanel from './CharactersPanel';
import AssetsLibraryPanel from './AssetsLibraryPanel';
import ShotListPanel from './ShotListPanel';
import ExportsPanel from './ExportsPanel';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [script, setScript] = useState('');
  const [panels, setPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProject] = useState({
    name: 'My Storyboard Project',
    id: 1
  });

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    navigate('/');
  };

  const handleNewProject = () => {
    // Open new project modal or navigate to project creation
    console.log('Creating new project...');
  };

  const handleSelectProject = (project) => {
    // Load selected project
    console.log('Loading project:', project);
    setActiveTab('dashboard');
  };

  const handleViewStoryboard = (storyboard) => {
    // View storyboard details
    console.log('Viewing storyboard:', storyboard);
  };

  const handleEditStoryboard = (storyboard) => {
    // Edit storyboard
    console.log('Editing storyboard:', storyboard);
  };

  const handleNewCharacter = () => {
    // Open new character modal
    console.log('Creating new character...');
  };

  const handleEditCharacter = (character) => {
    // Edit character
    console.log('Editing character:', character);
  };

  const handleNewShot = () => {
    // Open new shot modal
    console.log('Creating new shot...');
  };

  const handleEditShot = (shot) => {
    // Edit shot
    console.log('Editing shot:', shot);
  };

  const handleNewExport = () => {
    // Open export configuration modal
    console.log('Creating new export...');
  };

  const handleGenerateScenes = async () => {
    if (!script.trim()) return;

    setIsGenerating(true);

    // Parse script to extract characters, scenes, and shots
    const parsedData = parseScript(script);
    
    // Update panels with parsed data
    setTimeout(() => {
      const newPanels = parsedData.shots.map((shot, index) => ({
        id: Date.now() + index,
        scene: shot.scene,
        action: shot.action,
        prompt: shot.prompt,
        shotSize: shot.shotSize,
        cameraAngle: shot.cameraAngle,
        lens: shot.lens,
        image: null,
        notes: shot.notes
      }));

      setPanels(newPanels);
      setIsGenerating(false);
    }, 2000);
  };

  // Script parsing function
  const parseScript = (scriptText) => {
    const characters = [];
    const scenes = [];
    const shots = [];

    // Extract characters (basic regex for character names in uppercase)
    const characterMatches = scriptText.match(/^[A-Z][A-Z\s]+(?=\s*$)/gm);
    if (characterMatches) {
      characterMatches.forEach(match => {
        const name = match.trim();
        if (name.length > 1 && !characters.find(c => c.name === name)) {
          characters.push({
            id: Date.now() + Math.random(),
            name: name,
            role: 'Supporting', // Default, can be updated
            traits: [],
            description: '',
            project: 'Beneath the Silence'
          });
        }
      });
    }

    // Extract scenes (look for SCENE headings)
    const sceneRegex = /SCENE\s+\d+[\s\S]*?(?=SCENE\s+\d+|$)/gi;
    const sceneMatches = scriptText.match(sceneRegex);
    if (sceneMatches) {
      sceneMatches.forEach((sceneText, index) => {
        const sceneNumber = index + 1;
        const location = sceneText.match(/SETTING:\s*([^\n]+)/i)?.[1] || 'Unknown Location';
        
        scenes.push({
          id: Date.now() + Math.random(),
          number: sceneNumber,
          location: location.trim(),
          description: sceneText.substring(0, 200) + '...',
          project: 'Beneath the Silence'
        });

        // Extract shots from scene
        const actionLines = sceneText.split('\n').filter(line => 
          line.trim() && 
          !line.includes('SETTING:') && 
          !line.includes('LIGHTS:') && 
          !line.includes('SOUND:') &&
          !line.match(/^[A-Z\s]+:$/) // Not character names
        );

        actionLines.forEach((action) => {
          if (action.trim()) {
            shots.push({
              id: Date.now() + Math.random(),
              scene: `Scene ${sceneNumber}`,
              action: action.trim(),
              prompt: `Scene from theater play: ${action.trim().substring(0, 100)}...`,
              shotSize: 'MS',
              cameraAngle: 'Eye Level',
              lens: '50mm',
              notes: `From Scene ${sceneNumber} - ${location.trim()}`,
              project: 'Beneath the Silence'
            });
          }
        });
      });
    }

    return { characters, scenes, shots };
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
        {activeTab === 'settings' && (
          <SettingsPanel onBack={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'projects' && (
          <ProjectsPanel
            onNewProject={handleNewProject}
            onSelectProject={handleSelectProject}
          />
        )}

        {activeTab === 'storyboards' && (
          <StoryboardsPanel
            onViewStoryboard={handleViewStoryboard}
            onEditStoryboard={handleEditStoryboard}
          />
        )}

        {activeTab === 'characters' && (
          <CharactersPanel
            onNewCharacter={handleNewCharacter}
            onEditCharacter={handleEditCharacter}
          />
        )}

        {activeTab === 'assets' && (
          <AssetsLibraryPanel />
        )}

        {activeTab === 'shot-list' && (
          <ShotListPanel
            onNewShot={handleNewShot}
            onEditShot={handleEditShot}
          />
        )}

        {activeTab === 'exports' && (
          <ExportsPanel onNewExport={handleNewExport} />
        )}

        {activeTab === 'dashboard' && (
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