import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx'; 
import ScriptEditor from './components/ScriptEditor.jsx';
import StoryboardCanvas from './components/StoryboardCanvas.jsx';
import { 
  Sparkles, 
  Download, 
  ChevronRight
} from 'lucide-react';

const defaultScript = `EXT. NAIROBI STREETS - DAY

The sun blazes over the bustling streets. KAMAU (20s) weaves through the heavy traffic, his backpack slung over one shoulder.

INT. MATATU - CONTINUOUS

Kamau squeezes into a seat at the back. The neon lights of the interior cast a colorful glow on his face. He looks out the window, a determined look in his eyes.`;

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [script, setScript] = useState(defaultScript);
  const [isParsing, setIsParsing] = useState(false);
  const [scenes, setScenes] = useState([]);
  const [generatingId, setGeneratingId] = useState(null);

  const handleParseScript = () => {
    setIsParsing(true);
    setTimeout(() => {
      setScenes([
        {
          id: 1,
          heading: "EXT. NAIROBI STREETS - DAY",
          action: "The sun blazes over the bustling streets. KAMAU (20s) weaves through the heavy traffic.",
          prompt: "Wide shot, bustling Nairobi street during the day, bright sunlight, a 20-year-old African man named Kamau walking through traffic, cinematic lighting, 8k resolution.",
          image: null,
          lockedCharacter: 'Kamau'
        },
        {
          id: 2,
          heading: "INT. MATATU - CONTINUOUS",
          action: "Kamau squeezes into a seat at the back. The neon lights of the interior cast a colorful glow on his face.",
          prompt: "Interior shot, inside a vibrant Kenyan Matatu minibus, neon lights casting colorful glow, Kamau sitting in the back looking determined, moody atmosphere.",
          image: null,
          lockedCharacter: 'Kamau'
        }
      ]);
      setIsParsing(false);
    }, 1500);
  };

  const handleGenerateImage = (id, prompt) => {
    setGeneratingId(id);
    setTimeout(() => {
      setScenes(scenes.map(scene => {
        if (scene.id === id) {
          const imgUrl = id === 1 
            ? "https://images.unsplash.com/photo-1547430635-7115865d21b0?auto=format&fit=crop&q=80&w=800" 
            : "https://images.unsplash.com/photo-1555364134-8c01b4c91a0c?auto=format&fit=crop&q=80&w=800";
          return { ...scene, image: imgUrl };
        }
        return scene;
      }));
      setGeneratingId(null);
    }, 2500);
  };

  const updatePrompt = (id, newPrompt) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, prompt: newPrompt } : s));
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#F4F5F7]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <span>Projects</span>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-bold">The Nairobi Run (Short Film)</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors">
              <Download size={16} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-2 text-white rounded-md text-sm font-medium transition-colors shadow-md bg-[#7B1823] hover:opacity-90">
              <Sparkles size={16} /> Share Pitch
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          <ScriptEditor 
            script={script} 
            setScript={setScript} 
            isParsing={isParsing} 
            handleParseScript={handleParseScript} 
          />

          <StoryboardCanvas 
            scenes={scenes} 
            generatingId={generatingId} 
            handleGenerateImage={handleGenerateImage} 
            updatePrompt={updatePrompt} 
          />
        </div>
      </main>
    </div>
  );
}