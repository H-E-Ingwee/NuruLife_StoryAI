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
  Wand2,
  Upload,
  X,
  ArrowRight,
  Mail,
  LogOut,
  Chrome,
  Cpu,
  Layers,
  Globe,
  Camera,
  PlayCircle
} from 'lucide-react';

// --- LOGO COMPONENT ---
function Logo({ light = true }) {
  return (
    <div className="flex flex-col items-start leading-none group cursor-pointer">
      <div className="text-2xl font-black tracking-tighter flex items-center">
        <span className={light ? "text-white" : "text-[#0A233A]"}>STORY</span>
        <span className="text-[#F28C00]">AI</span>
      </div>
      <div className="text-[9px] tracking-[0.1em] font-bold text-gray-400 uppercase">
        by NuruLife Productions
      </div>
    </div>
  );
}

// --- LANDING PAGE COMPONENT ---
function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#F28C00] selection:text-white">
      {/* Navbar */}
      <nav className="h-20 bg-[#0A233A] flex items-center justify-between px-8 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-10">
          <Logo />
          <div className="hidden md:flex gap-8 text-sm font-semibold text-gray-300">
            <a href="#about" className="hover:text-[#F28C00] transition-colors">How it helps</a>
            <a href="#how-it-works" className="hover:text-[#F28C00] transition-colors">The Process</a>
            <a href="#showcase" className="hover:text-[#F28C00] transition-colors">Showcase</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('login')}
            className="text-white font-bold text-sm hover:text-[#F28C00] transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#7B1823] rounded-full hover:bg-opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            Start Creating Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000" 
            alt="Filmmaking background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A233A] via-[#0A233A]/90 to-[#0A233A]/40"></div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F28C00]/20 text-[#F28C00] border border-[#F28C00]/30 text-sm font-bold mb-8">
              <Sparkles size={16} /> 
              <span>Visualizing stories for everyone</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.05] mb-8">
              Turn your words into <span className="text-[#F28C00]">beautiful</span> movie scenes.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 font-medium leading-relaxed">
              StoryAI reads your script and creates high-quality pictures of your characters and settings. You don't need to know how to draw to see your vision come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <button 
                onClick={() => onNavigate('login')}
                className="px-10 py-5 text-xl font-bold text-white bg-[#7B1823] rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 group"
              >
                Create Your First Scene <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 text-xl font-bold text-white bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md flex items-center justify-center gap-2">
                <PlayCircle size={24} /> Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Benefits */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-[#F28C00]">
                <FileText size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0A233A]">Smart Story Reading</h3>
              <p className="text-gray-600 leading-relaxed">
                Just paste your script. Our system automatically picks out the characters, the location, and the action for you.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-[#7B1823]">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0A233A]">Keeping Faces the Same</h3>
              <p className="text-gray-600 leading-relaxed">
                Use our "Lock" feature so your characters look the same in every frame of your story. No more confusing changes.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0A233A]">
                <Camera size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#0A233A]">Stunning Movie Looks</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose a style—from gritty action to bright animation—and get consistent, high-quality pictures every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section id="showcase" className="py-24 bg-[#F4F5F7]">
        <div className="container mx-auto px-8 text-center mb-16">
          <h2 className="text-4xl font-black text-[#0A233A] mb-4">See what creators are making</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">From epic adventure scenes to quiet drama, StoryAI helps you see it all before you even start filming.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
          <ShowcaseImage src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800" label="Cinematic Noir" />
          <ShowcaseImage src="https://images.unsplash.com/photo-1547430635-7115865d21b0?auto=format&fit=crop&q=80&w=800" label="Street Drama" />
          <ShowcaseImage src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" label="Fantasy World" />
          <ShowcaseImage src="https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800" label="Mood Concept" />
        </div>
      </section>

      {/* How it Works - Simplified */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-black text-[#0A233A] mb-12">How it works</h2>
              <div className="space-y-10">
                <SimpleStep number="1" title="Paste Your Script" text="Copy your story into our editor. We handle the formatting for you." />
                <SimpleStep number="2" title="Check the Details" text="We suggest what the scene should look like. You can change anything you want." />
                <SimpleStep number="3" title="Generate Images" text="Click a button and see your scenes appear in high quality." />
                <SimpleStep number="4" title="Share Your Vision" text="Download a beautiful PDF to show your team or investors exactly what you mean." />
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="bg-[#0A233A] p-6 rounded-3xl shadow-2xl overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1555364134-8c01b4c91a0c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Process preview" 
                    className="rounded-2xl border border-white/10 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A233A] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="text-white font-bold text-lg">"The Nairobi Run" - Sc. 12</div>
                    <div className="text-gray-300 text-sm">Generated in 12 seconds</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-[#0A233A] text-white overflow-hidden relative">
        <div className="container mx-auto px-8 text-center max-w-4xl relative z-10">
          <Globe className="mx-auto text-[#F28C00] mb-8" size={64} />
          <h2 className="text-4xl font-black mb-8">Making tools for every storyteller</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-12 font-medium">
            We believe that good stories are everywhere, but not everyone has the budget to draw them. <strong>StoryAI</strong> helps independent creators in Kenya and around the world prove their ideas are worth making.
          </p>
          <button 
            onClick={() => onNavigate('login')}
            className="px-12 py-5 bg-[#F28C00] text-[#0A233A] font-black text-xl rounded-2xl hover:scale-105 transition-transform"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <Logo light={false} />
              <p className="text-gray-500 max-w-xs mt-6 text-sm">
                The ultimate co-pilot for filmmakers and storytellers. Built in Nairobi for the world.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <FooterGroup title="Product" items={['Features', 'Templates', 'Support']} />
              <FooterGroup title="Company" items={['Our Mission', 'Legal', 'Privacy']} />
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between text-xs text-gray-400 font-medium">
            <p>© 2025 StoryAI by NuruLife Productions. Built by Brian Ingwee.</p>
            <div className="flex gap-6">
              <span className="hover:text-[#F28C00] cursor-pointer">Terms of Service</span>
              <span className="hover:text-[#F28C00] cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- LANDING PAGE HELPERS ---

function ShowcaseImage({ src, label }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden aspect-square shadow-lg transition-transform hover:-translate-y-2">
      <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
        <span className="text-white font-bold">{label}</span>
      </div>
    </div>
  );
}

function SimpleStep({ number, title, text }) {
  return (
    <div className="flex gap-8">
      <div className="w-12 h-12 rounded-full bg-[#0A233A] text-white flex-shrink-0 flex items-center justify-center font-black text-xl border-4 border-gray-100 shadow-sm">
        {number}
      </div>
      <div>
        <h4 className="text-2xl font-black text-[#0A233A] mb-2">{title}</h4>
        <p className="text-gray-500 font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function FooterGroup({ title, items }) {
  return (
    <div>
      <h4 className="font-black text-[#0A233A] text-sm uppercase tracking-widest mb-6">{title}</h4>
      <ul className="space-y-4 text-sm text-gray-500 font-bold">
        {items.map(item => (
          <li key={item} className="hover:text-[#F28C00] cursor-pointer transition-colors">{item}</li>
        ))}
      </ul>
    </div>
  );
}

// --- LOGIN PAGE COMPONENT ---
function LoginPage({ onLogin, onNavigate }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F28C00]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7B1823]/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 relative z-10">
        <div className="bg-[#0A233A] p-12 text-center flex flex-col items-center border-b border-white/10">
          <div onClick={() => onNavigate('landing')} className="cursor-pointer">
            <Logo />
          </div>
          <p className="text-gray-300 text-sm mt-4 font-medium">Welcome back, Storyteller</p>
        </div>

        <div className="p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-[#0A233A] uppercase tracking-widest mb-2">Your Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F28C00] transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:bg-white transition-all text-sm font-medium"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black text-[#0A233A] uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] text-[#F28C00] hover:underline font-black uppercase">Lost it?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F28C00] transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:bg-white transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#7B1823] hover:bg-[#0A233A] text-white font-black rounded-2xl transition-all shadow-xl transform hover:-translate-y-1"
            >
              Enter Workspace
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center">
            <div className="border-t border-gray-100 flex-grow"></div>
            <span className="px-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">Or login with</span>
            <div className="border-t border-gray-100 flex-grow"></div>
          </div>

          <div className="mt-6">
            <button className="w-full py-4 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-sm font-black text-[#0A233A]">
              <Chrome size={20} className="text-blue-500" /> Continue with Google
            </button>
          </div>

          <div className="mt-10 text-center space-y-4">
            <p className="text-sm text-gray-600 font-medium">
              First time here? <button className="text-[#F28C00] font-black hover:underline">Join NuruLife</button>
            </p>
            <button 
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#0A233A] transition-colors font-bold"
            >
              <ArrowRight size={14} className="rotate-180" /> Back to website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD COMPONENTS ---

function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col shadow-2xl z-20 bg-[#0A233A]">
      <div className="p-8 flex items-center justify-center border-b border-white/5">
        <Logo />
      </div>

      <nav className="flex-1 py-10 px-4 space-y-3">
        <NavItem icon={<LayoutDashboard size={20} />} label="My Stories" />
        <NavItem 
          icon={<FileText size={20} />} 
          label="Editor" 
          active={activeTab === 'workspace'} 
          onClick={() => setActiveTab('workspace')} 
        />
        <NavItem 
          icon={<ImageIcon size={20} />} 
          label="Storyboard" 
          active={activeTab === 'storyboards'} 
          onClick={() => setActiveTab('storyboards')} 
        />
        <NavItem icon={<Users size={20} />} label="Characters" />
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center gap-4 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F28C00] to-[#7B1823] flex items-center justify-center font-black text-white text-xs shadow-lg">
            BI
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Brian Ingwee</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">NuruLife Pro</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl text-sm font-bold transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
        ${active ? 'bg-white/10 text-white shadow-inner' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
    >
      <div className={`${active ? 'text-[#F28C00]' : 'group-hover:text-[#F28C00] transition-colors'}`}>
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  );
}

// --- MAIN WORKSPACE DASHBOARD ---

const defaultScript = `EXT. NAIROBI STREETS - DAY

The sun blazes over the bustling streets. KAMAU (20s) weaves through the heavy traffic, his backpack slung over one shoulder.

INT. MATATU - CONTINUOUS

Kamau squeezes into a seat at the back. The neon lights of the interior cast a colorful glow on his face. He looks out the window, a determined look in his eyes.`;

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('workspace');
  const [script, setScript] = useState(defaultScript);
  const [isParsing, setIsParsing] = useState(false);
  const [scenes, setScenes] = useState([]);
  const [generatingId, setGeneratingId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState("");

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

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#F4F5F7]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 flex flex-col h-full relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <span>The Nairobi Run</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-[#0A233A]">Storyboard v1</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#0A233A] rounded-xl text-xs font-black transition-colors border border-gray-100">
              <Download size={16} /> EXPORT
            </button>
            <button className="flex items-center gap-2 px-6 py-2 text-white rounded-xl text-xs font-black transition-all shadow-lg bg-[#7B1823] hover:opacity-90 active:scale-95">
              <Sparkles size={16} /> SHARE
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex relative">
          {/* SCRIPT AREA */}
          <div className="w-1/3 min-w-[350px] bg-white border-r border-gray-200 flex flex-col z-10">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xs font-black text-[#0A233A] uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText size={16} className="text-[#F28C00]" /> Script
              </h2>
              <button 
                onClick={handleParseScript}
                disabled={isParsing}
                className="flex items-center gap-2 px-3 py-2 text-[10px] font-black text-white rounded-lg transition-all disabled:opacity-70 bg-[#0A233A] uppercase tracking-wider"
              >
                {isParsing ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
                {isParsing ? 'Reading...' : 'Process Script'}
              </button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-full resize-none outline-none font-mono text-sm leading-relaxed text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* STORYBOARD CANVAS */}
          <div className="flex-1 bg-[#F8F9FA] overflow-y-auto p-10 z-0 relative">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-black text-[#0A233A] tracking-tight">Visual Storyboard</h1>
                  <p className="text-sm font-medium text-gray-400 mt-2">See your script come to life panel by panel.</p>
                </div>
              </div>

              {scenes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 border-4 border-dashed border-gray-200 rounded-3xl bg-white/50">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-gray-200 mb-6">
                    <ImageIcon size={40} />
                  </div>
                  <p className="text-gray-500 font-black text-sm uppercase tracking-widest">No pictures yet</p>
                  <p className="text-gray-400 text-xs mt-2">Click "Process Script" to get started.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {scenes.map((scene, index) => (
                    <div key={scene.id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-2xl">
                      <div className="md:w-5/12 bg-gray-100 border-r border-gray-100 relative min-h-[300px] flex items-center justify-center group">
                        {scene.image ? (
                          <img src={scene.image} alt="Storyboard Panel" className="w-full h-full object-cover" />
                        ) : generatingId === scene.id ? (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 rounded-full border-t-transparent border-[#7B1823] animate-spin mb-4"></div>
                            <span className="text-xs font-black text-[#0A233A] uppercase tracking-widest">Painting...</span>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <ImageIcon size={32} className="text-gray-200 mx-auto mb-3" />
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Empty Panel {index + 1}</span>
                          </div>
                        )}
                        <div className={`absolute inset-0 bg-[#0A233A]/60 flex items-center justify-center transition-opacity ${scene.image ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-transparent'}`}>
                          {generatingId !== scene.id && (
                            <button 
                              onClick={() => handleGenerateImage(scene.id, scene.prompt)}
                              className="px-8 py-3 rounded-2xl text-xs font-black text-white shadow-2xl transform transition-all hover:scale-110 active:scale-95 flex items-center gap-2 bg-[#7B1823] uppercase tracking-widest"
                            >
                              <Sparkles size={16} /> 
                              {scene.image ? 'Redraw' : 'Generate'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-8 flex-1 flex flex-col">
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-gray-100 text-[#0A233A] text-[10px] font-black uppercase tracking-widest rounded-lg">Panel {index + 1}</span>
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{scene.heading}</span>
                          </div>
                          <p className="text-sm text-gray-500 font-medium italic border-l-4 pl-4 border-[#F28C00]/30">{scene.action}</p>
                        </div>

                        <div className="flex-1 mt-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                            Picture Description
                          </label>
                          <textarea 
                            value={scene.prompt}
                            onChange={(e) => {}}
                            className="w-full h-24 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[#F28C00] transition-all font-medium resize-none"
                          />
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-100">
                              <Lock size={14} />
                              Lock: {scene.lockedCharacter}
                            </div>
                            <button 
                              onClick={() => {
                                setActiveCharacter(scene.lockedCharacter);
                                setIsModalOpen(true);
                              }}
                              className="text-[10px] font-black text-[#0A233A] hover:text-[#F28C00] transition-colors uppercase tracking-widest border-b-2 border-transparent hover:border-[#F28C00]"
                            >
                              Set Face +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* UPLOAD MODAL */}
          {isModalOpen && (
            <div className="absolute inset-0 bg-[#0A233A]/60 z-50 flex items-center justify-center backdrop-blur-md">
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 animate-in fade-in zoom-in duration-300 relative">
                <button 
                   onClick={() => setIsModalOpen(false)}
                   className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#F28C00] mx-auto mb-6">
                    <Users size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A233A] mb-3 leading-none">Keep your character's look</h3>
                  <p className="text-gray-500 font-medium">Upload a photo of <strong className="text-[#F28C00] font-black uppercase">{activeCharacter}</strong> so StoryAI knows exactly how they should look in every scene.</p>
                </div>

                <div className="border-4 border-dashed border-gray-100 rounded-[32px] p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-[#F28C00]/30 transition-all cursor-pointer group shadow-inner">
                  <div className="bg-white p-4 rounded-2xl shadow-xl mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-[#7B1823]" />
                  </div>
                  <span className="text-sm font-black text-[#0A233A] uppercase tracking-widest">Select character photo</span>
                  <span className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">Drag & Drop Here</span>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-colors"
                  >
                    Not now
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-xs font-black text-white bg-[#0A233A] hover:shadow-xl rounded-2xl transition-all uppercase tracking-widest shadow-lg"
                  >
                    Save character
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- ROOT APP COMPONENT ---

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  if (currentView === 'landing') {
    return <LandingPage onNavigate={setCurrentView} />;
  }

  if (currentView === 'login') {
    return <LoginPage onLogin={() => setCurrentView('dashboard')} onNavigate={setCurrentView} />;
  }

  return <Dashboard onLogout={() => setCurrentView('landing')} />;
}