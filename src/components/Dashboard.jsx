import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Image as ImageIcon,
  Plus,
  Video,
  Layers,
  Download
} from 'lucide-react';
import Sidebar from './Sidebar';
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

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    navigate('/');
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
            onNewProject={() => setActiveTab('projects')} 
            onSelectProject={(project) => {
              // TODO: Implement project selection - could open project details or switch to storyboards
              console.log('Selected project:', project);
              setActiveTab('storyboards');
            }} 
          />
        )}

        {activeTab === 'storyboards' && (
          <StoryboardsPanel />
        )}

        {activeTab === 'characters' && (
          <CharactersPanel />
        )}

        {activeTab === 'assets' && (
          <AssetsLibraryPanel />
        )}

        {activeTab === 'shot-list' && (
          <ShotListPanel />
        )}

        {activeTab === 'exports' && (
          <ExportsPanel />
        )}

        {activeTab === 'dashboard' && (
          <div className="flex-1 p-8 bg-[#F4F5F7]">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to StoryAI</h1>
                <p className="text-gray-600">Your AI-powered storyboarding companion for independent creators</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0A233A] rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Script Processing</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Upload your screenplay and let AI extract characters, scenes, and shots automatically.</p>
                  <button
                    onClick={() => setActiveTab('storyboards')}
                    className="px-4 py-2 bg-[#F28C00] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Start Storyboarding
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0A233A] rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Character Database</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Manage your characters with detailed profiles, traits, and visual references.</p>
                  <button
                    onClick={() => setActiveTab('characters')}
                    className="px-4 py-2 bg-[#F28C00] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    View Characters
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#0A233A] rounded-lg flex items-center justify-center">
                      <ImageIcon size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Assets Library</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Organize and manage all your media assets with advanced search and filtering.</p>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className="px-4 py-2 bg-[#F28C00] text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Browse Assets
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Plus size={24} className="text-[#F28C00] mb-2" />
                    <div className="font-medium text-gray-900">New Project</div>
                    <div className="text-sm text-gray-600">Start fresh</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('storyboards')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Video size={24} className="text-[#F28C00] mb-2" />
                    <div className="font-medium text-gray-900">Storyboards</div>
                    <div className="text-sm text-gray-600">Create scenes</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('shot-list')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Layers size={24} className="text-[#F28C00] mb-2" />
                    <div className="font-medium text-gray-900">Shot List</div>
                    <div className="text-sm text-gray-600">Plan shots</div>
                  </button>
                  <button
                    onClick={() => setActiveTab('exports')}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download size={24} className="text-[#F28C00] mb-2" />
                    <div className="font-medium text-gray-900">Export</div>
                    <div className="text-sm text-gray-600">Share work</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}