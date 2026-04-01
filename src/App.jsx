import React, { useState } from 'react';
import { 
  LayoutDashboard,
  FileText, 
  Image as ImageIcon, 
  Users,
  Settings,
  UserCircle,
  Sparkles, 
  Download, 
  Lock, 
  RefreshCw, 
  ChevronRight,
  Wand2
} from 'lucide-react';

// --- COMPONENTS ---

function NavItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group
        ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
    >
      <div className={`${active ? 'text-[#F28C00]' : 'group-hover:text-[#F28C00] transition-colors'}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col shadow-2xl z-20 bg-[#0A233A]">
      <div className="p-6 flex items-center justify-center border-b border-gray-700/50">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-black tracking-tighter flex items-center">
            <span className="text-[#F28C00]">NURU</span>
            <span className="text-white">LIFE</span>
          </div>
          <div className="text-[10px] tracking-[0.2em] font-bold mt-1 text-[#7B1823]">
            PRODUCTIONS
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem 
          icon={<FileText size={20} />} 
          label="Workspace" 
          active={activeTab === 'workspace'} 
          onClick={() => setActiveTab('workspace')} 
        />
        <NavItem 
          icon={<ImageIcon size={20} />} 
          label="Storyboards" 
          active={activeTab === 'storyboards'} 
          onClick={() => setActiveTab('storyboards')} 
        />
        <NavItem icon={<Users size={20} />} label="Characters" />
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <NavItem icon={<Settings size={20} />} label="Settings" />
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <UserCircle size={32} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-white">Brian Ingwee</p>
            <p className="text-xs text-gray-400">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ScriptEditor({ script, setScript, isParsing, handleParseScript }) {
  return (
    <div className="w-1/3 min-w-[350px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <FileText size={18} className="text-[#F28C00]" /> Script Editor
        </h2>
        <button 
          onClick={handleParseScript}
          disabled={isParsing}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white rounded-md transition-all disabled:opacity-70 bg-[#0A233A] hover:bg-opacity-90"
        >
          {isParsing ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
          {isParsing ? 'Analyzing...' : 'Auto-Generate Scenes'}
        </button>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full h-full resize-none outline-none font-mono text-sm leading-relaxed text-gray-800 placeholder-gray-400"
        />
      </div>
    </div>
  );
}

function StoryboardCanvas({ scenes, generatingId, handleGenerateImage, updatePrompt }) {
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

// --- MAIN APP ---

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