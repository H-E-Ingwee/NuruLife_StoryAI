import React, { useState, useEffect } from 'react';
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
  Cpu,
  Layers,
  Globe,
  Camera,
  PlayCircle,
  Menu,
  Check
} from 'lucide-react';

// --- LOGO COMPONENT ---
function Logo({ light = true }) {
  return (
    <div className="flex flex-col items-start leading-none group cursor-pointer transition-transform hover:scale-105">
      <div className="text-2xl font-black tracking-tighter flex items-center">
        <span className={light ? "text-white" : "text-[#0A233A]"}>STORY</span>
        <span className="text-[#F28C00]">AI</span>
      </div>
      <div className="text-[9px] tracking-[0.15em] font-bold text-gray-400 uppercase">
        by NuruLife Productions
      </div>
    </div>
  );
}

// --- LANDING PAGE COMPONENT ---
function LandingPage({ onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#F28C00] selection:text-white scroll-smooth">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A233A]/95 backdrop-blur-md py-3 shadow-xl' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Logo />
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8 text-sm font-bold text-gray-300">
              <a href="#about" className="hover:text-[#F28C00] transition-colors">How it helps</a>
              <a href="#process" className="hover:text-[#F28C00] transition-colors">The Process</a>
              <a href="#mission" className="hover:text-[#F28C00] transition-colors">Mission</a>
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-10">
              <button 
                onClick={() => onNavigate('login')}
                className="text-white font-bold text-sm hover:text-[#F28C00] transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="px-6 py-2.5 text-sm font-black text-white bg-[#7B1823] rounded-xl hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(123,24,35,0.4)] transition-all flex items-center gap-2"
              >
                Join Free
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#0A233A] border-t border-white/5 p-6 animate-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-6 text-lg font-bold text-gray-300 mb-8">
              <a href="#about" onClick={() => setIsMenuOpen(false)}>How it helps</a>
              <a href="#process" onClick={() => setIsMenuOpen(false)}>The Process</a>
              <a href="#mission" onClick={() => setIsMenuOpen(false)}>Mission</a>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => onNavigate('login')} className="w-full py-4 bg-white/5 rounded-2xl text-white font-bold">Sign In</button>
              <button onClick={() => onNavigate('login')} className="w-full py-4 bg-[#7B1823] rounded-2xl text-white font-bold">Get Started Free</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492691523567-6170c3600a9d?auto=format&fit=crop&q=80&w=2000" 
            alt="Cinematic background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A233A] via-[#0A233A]/90 to-[#0A233A]/20"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F28C00]/20 text-[#F28C00] border border-[#F28C00]/30 text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-left-5 duration-700">
              <Sparkles size={14} /> 
              <span>Bridging the gap for African storytellers</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] mb-8 animate-in fade-in slide-in-from-up-10 duration-1000 delay-100">
              Words become <span className="text-[#F28C00]">Worlds.</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-12 font-medium leading-relaxed max-w-2xl animate-in fade-in slide-in-from-up-10 duration-1000 delay-200">
              StoryAI reads your movie script and builds high-quality pictures of your characters and settings instantly. You don't need an artist to see your vision come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-up-10 duration-1000 delay-300">
              <button 
                onClick={() => onNavigate('login')}
                className="px-10 py-5 text-lg font-black text-white bg-[#7B1823] rounded-2xl hover:scale-105 hover:shadow-[0_20px_50px_rgba(123,24,35,0.4)] transition-all flex items-center justify-center gap-3 group"
              >
                Launch Your First Script <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 text-lg font-black text-white bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md flex items-center justify-center gap-2">
                <PlayCircle size={20} /> View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Benefits - Visual Cards */}
      <section id="about" className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-[#F28C00] uppercase tracking-[0.3em] mb-4">Why StoryAI?</h2>
            <p className="text-4xl md:text-5xl font-black text-[#0A233A] tracking-tight">The tool every modern writer needs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={<FileText size={32} />}
              title="Smart Script Reading"
              text="Our system reads your writing and automatically picks out characters and places."
              color="bg-orange-50 text-orange-600"
            />
            <BenefitCard 
              icon={<Users size={32} />}
              title="Face Matching"
              text="Lock your character's look so they stay exactly the same in every single picture."
              color="bg-red-50 text-red-600"
            />
            <BenefitCard 
              icon={<Camera size={32} />}
              title="High Quality Looks"
              text="Get beautiful, high-definition movie visuals regardless of your artistic skill."
              color="bg-blue-50 text-[#0A233A]"
            />
          </div>
        </div>
      </section>

      {/* The Visual Process */}
      <section id="process" className="py-32 bg-[#F4F5F7] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black text-[#0A233A] mb-12 tracking-tight">How simple it is:</h2>
              <div className="space-y-4">
                <SimpleStep number="1" title="Paste Your Script" text="We handle all the formatting. Just bring your story." active />
                <SimpleStep number="2" title="Confirm Details" text="We pick out the scenes. You adjust the descriptions." />
                <SimpleStep number="3" title="Generate Scenes" text="Watch high-quality images appear in seconds." />
                <SimpleStep number="4" title="Share Your Vision" text="Export a PDF that looks like a big-budget production." />
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="bg-[#0A233A] p-2 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(10,35,58,0.3)] overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&q=80&w=1200" 
                    alt="Workplace preview" 
                    className="rounded-[2rem] w-full aspect-square md:aspect-video object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A233A] via-transparent opacity-80"></div>
                  <div className="absolute bottom-8 left-8 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#F28C00] flex items-center justify-center text-[#0A233A]">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p className="text-white font-black uppercase text-sm tracking-widest">StoryAI Pro</p>
                      <p className="text-gray-400 text-xs font-bold">Panel Generated Successfully</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-32 bg-[#0A233A] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#F28C00]/5 blur-[120px]"></div>
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <Globe className="mx-auto text-[#F28C00] mb-10" size={64} />
          <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight">Empowering independent creators globally.</h2>
          <p className="text-lg md:text-2xl text-gray-300 leading-relaxed mb-16 font-medium">
            Storytelling shouldn't be limited by how much money you have. <strong>StoryAI</strong> helps independent artists in Nairobi and around the world build beautiful visual pitches that get funded.
          </p>
          <button 
            onClick={() => onNavigate('login')}
            className="px-12 py-6 bg-[#F28C00] text-[#0A233A] font-black text-xl rounded-2xl hover:scale-105 hover:bg-white transition-all shadow-2xl"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <Logo light={false} />
              <p className="text-gray-500 max-w-sm mt-8 text-sm font-medium leading-relaxed">
                The ultimate co-pilot for filmmakers, writers, and visionaries. Built with love in Nairobi by NuruLife Productions.
              </p>
            </div>
            <div>
              <h4 className="font-black text-[#0A233A] text-xs uppercase tracking-widest mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-bold">
                <li className="hover:text-[#F28C00] cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-[#F28C00] cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-[#F28C00] cursor-pointer transition-colors">Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[#0A233A] text-xs uppercase tracking-widest mb-8">Social</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-bold">
                <li className="hover:text-[#F28C00] cursor-pointer transition-colors">Instagram</li>
                <li className="hover:text-[#F28C00] cursor-pointer transition-colors">LinkedIn</li>
                <li className="hover:text-[#F28C00] cursor-pointer transition-colors">Twitter</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-10 flex flex-col md:row justify-between text-[11px] text-gray-400 font-bold uppercase tracking-[0.15em]">
            <p>© 2025 StoryAI by NuruLife Productions. Developed by Brian Ingwee.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span className="hover:text-[#F28C00] cursor-pointer">Terms</span>
              <span className="hover:text-[#F28C00] cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- LANDING PAGE SUB-COMPONENTS ---

function BenefitCard({ icon, title, text, color }) {
  return (
    <div className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 transition-all duration-500 hover:-translate-y-2">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-[#0A233A] mb-4">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{text}</p>
    </div>
  );
}

function SimpleStep({ number, title, text, active = false }) {
  return (
    <div className={`flex gap-8 p-6 rounded-3xl transition-all duration-300 ${active ? 'bg-white shadow-xl' : 'hover:bg-gray-100'}`}>
      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-lg ${active ? 'bg-[#7B1823] text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>
        {number}
      </div>
      <div>
        <h4 className="text-xl font-black text-[#0A233A] mb-1">{title}</h4>
        <p className="text-gray-500 text-sm font-medium">{text}</p>
      </div>
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
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F28C00]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7B1823]/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 relative z-10 border border-white">
        <div className="bg-[#0A233A] p-12 text-center flex flex-col items-center">
          <div onClick={() => onNavigate('landing')} className="cursor-pointer">
            <Logo />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-6">Welcome Back</p>
        </div>

        <div className="p-10 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#0A233A] uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F28C00] transition-colors">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:bg-white transition-all text-sm font-bold"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-black text-[#0A233A] uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] text-[#F28C00] hover:underline font-black uppercase">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F28C00] transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:bg-white transition-all text-sm font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-[#7B1823] hover:bg-[#0A233A] text-white font-black rounded-2xl transition-all shadow-xl transform hover:-translate-y-1 active:scale-95"
            >
              Sign In to StoryAI
            </button>
          </form>

          <div className="mt-10 flex items-center justify-center">
            <div className="border-t border-gray-100 flex-grow"></div>
            <span className="px-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">Or continue with</span>
            <div className="border-t border-gray-100 flex-grow"></div>
          </div>

          <div className="mt-8">
            <button className="w-full py-4 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-200 transition-all text-sm font-black text-[#0A233A]">
              <Globe size={20} className="text-blue-500" /> Google Login
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Don't have an account? <button className="text-[#F28C00] font-black hover:underline">Join Us</button>
            </p>
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
        <NavItem icon={<LayoutDashboard size={18} />} label="My Projects" />
        <NavItem 
          icon={<FileText size={18} />} 
          label="Editor" 
          active={activeTab === 'workspace'} 
          onClick={() => setActiveTab('workspace')} 
        />
        <NavItem 
          icon={<ImageIcon size={18} />} 
          label="Storyboard" 
          active={activeTab === 'storyboards'} 
          onClick={() => setActiveTab('storyboards')} 
        />
        <NavItem icon={<Users size={18} />} label="Characters" />
      </nav>

      <div className="p-6 border-t border-white/5 bg-[#081b2e]">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F28C00] to-[#7B1823] flex items-center justify-center font-black text-white text-xs shadow-lg">
            BI
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white leading-none truncate uppercase tracking-widest">Brian Ingwee</p>
            <p className="text-[9px] text-[#F28C00] font-bold uppercase mt-1">Pro Member</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
        ${active ? 'bg-[#F28C00] text-[#0A233A] shadow-lg shadow-[#F28C00]/20' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
    >
      <div className={`${active ? 'text-[#0A233A]' : 'group-hover:text-[#F28C00] transition-colors'}`}>
        {icon}
      </div>
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
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
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <span>The Nairobi Run</span>
            <ChevronRight size={14} className="text-gray-200" />
            <span className="text-[#0A233A]">Workspace</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[#0A233A] rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-gray-100">
              <Download size={14} /> Export
            </button>
            <button className="flex items-center gap-2 px-6 py-2 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg bg-[#7B1823] hover:opacity-90 active:scale-95">
              <Sparkles size={14} /> Share
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex relative">
          {/* SCRIPT AREA */}
          <div className="w-1/3 min-w-[350px] bg-white border-r border-gray-200 flex flex-col z-10">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[10px] font-black text-[#0A233A] uppercase tracking-[0.2em] flex items-center gap-2">
                <FileText size={16} className="text-[#F28C00]" /> Script Editor
              </h2>
              <button 
                onClick={handleParseScript}
                disabled={isParsing}
                className="flex items-center gap-2 px-3 py-2 text-[9px] font-black text-white rounded-lg transition-all disabled:opacity-70 bg-[#0A233A] uppercase tracking-wider shadow-md hover:shadow-lg"
              >
                {isParsing ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
                {isParsing ? 'Processing...' : 'Read Story'}
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
          <div className="flex-1 bg-[#F8F9FA] overflow-y-auto p-10 z-0 relative scroll-smooth">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h1 className="text-3xl font-black text-[#0A233A] tracking-tighter">Visual Panels</h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Bring your words into the visual world</p>
                </div>
              </div>

              {scenes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 border-4 border-dashed border-gray-200 rounded-[3rem] bg-white/50 group transition-all hover:bg-white hover:border-[#F28C00]/30">
                  <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center text-gray-200 mb-8 transition-transform group-hover:scale-110">
                    <ImageIcon size={48} />
                  </div>
                  <p className="text-gray-500 font-black text-sm uppercase tracking-[0.3em]">No panels created</p>
                  <p className="text-gray-400 text-xs mt-3 font-bold uppercase tracking-widest">Process your script to start visualizing</p>
                </div>
              ) : (
                <div className="space-y-12 pb-20">
                  {scenes.map((scene, index) => (
                    <div key={scene.id} className="bg-white rounded-[2.5rem] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-5 duration-500">
                      <div className="md:w-5/12 bg-gray-100 border-r border-gray-50 relative min-h-[350px] flex items-center justify-center group">
                        {scene.image ? (
                          <img src={scene.image} alt="Storyboard Panel" className="w-full h-full object-cover" />
                        ) : generatingId === scene.id ? (
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 border-4 rounded-full border-t-transparent border-[#7B1823] animate-spin mb-6"></div>
                            <span className="text-[10px] font-black text-[#0A233A] uppercase tracking-widest animate-pulse">Rendering Scene...</span>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <ImageIcon size={48} className="text-gray-200 mx-auto mb-4" />
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Panel {index + 1} Ready</span>
                          </div>
                        )}
                        <div className={`absolute inset-0 bg-[#0A233A]/60 flex items-center justify-center transition-all duration-500 ${scene.image ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-transparent'}`}>
                          {generatingId !== scene.id && (
                            <button 
                              onClick={() => handleGenerateImage(scene.id, scene.prompt)}
                              className="px-10 py-4 rounded-2xl text-[10px] font-black text-white shadow-2xl transform transition-all hover:scale-110 active:scale-95 flex items-center gap-2 bg-[#7B1823] uppercase tracking-widest"
                            >
                              <Sparkles size={16} /> 
                              {scene.image ? 'Regenerate' : 'Create Picture'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-10 flex-1 flex flex-col">
                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-5">
                            <span className="px-4 py-1.5 bg-[#0A233A] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-[#0A233A]/10">Panel {index + 1}</span>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest truncate max-w-[150px]">{scene.heading}</span>
                          </div>
                          <p className="text-base text-gray-500 font-medium italic border-l-4 pl-6 border-[#F28C00] py-2">{scene.action}</p>
                        </div>

                        <div className="flex-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">
                            Visual Prompt
                          </label>
                          <textarea 
                            value={scene.prompt}
                            onChange={(e) => {}}
                            className="w-full h-32 text-sm text-[#0A233A] bg-gray-50 border border-gray-100 rounded-2xl p-5 focus:outline-none focus:ring-2 focus:ring-[#F28C00] transition-all font-bold resize-none leading-relaxed"
                          />
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-700 border border-orange-100">
                              <Lock size={14} />
                              Lock: {scene.lockedCharacter}
                            </div>
                            <button 
                              onClick={() => {
                                setActiveCharacter(scene.lockedCharacter);
                                setIsModalOpen(true);
                              }}
                              className="text-[10px] font-black text-[#0A233A] hover:text-[#F28C00] transition-all uppercase tracking-widest border-b-2 border-transparent hover:border-[#F28C00] py-1"
                            >
                              Set Character +
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-auto overflow-hidden">
              <div className="absolute inset-0 bg-[#0A233A]/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl p-12 animate-in zoom-in-95 fade-in duration-300 relative z-10 border border-white">
                <button 
                   onClick={() => setIsModalOpen(false)}
                   className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-all active:scale-90"
                >
                  <X size={28} />
                </button>

                <div className="text-center mb-12">
                  <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center text-[#F28C00] mx-auto mb-8 shadow-xl shadow-orange-500/10">
                    <Users size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-[#0A233A] mb-4 tracking-tighter leading-none">Define character look</h3>
                  <p className="text-gray-500 font-medium leading-relaxed">Choose how <strong className="text-[#F28C00] font-black uppercase tracking-widest">{activeCharacter}</strong> looks so StoryAI stays accurate across your entire storyboard.</p>
                </div>

                <div className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-[#F28C00]/30 transition-all cursor-pointer group shadow-inner">
                  <div className="bg-white p-5 rounded-2xl shadow-xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <Upload size={36} className="text-[#7B1823]" />
                  </div>
                  <span className="text-xs font-black text-[#0A233A] uppercase tracking-[0.2em] mb-2">Drop photo here</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Maximum file size: 10MB</span>
                </div>

                <div className="mt-12 flex gap-5">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-100 rounded-2xl transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 text-xs font-black text-white bg-[#0A233A] hover:shadow-[0_15px_30px_rgba(10,35,58,0.3)] rounded-2xl transition-all uppercase tracking-[0.2em] shadow-lg active:scale-95"
                  >
                    Lock Character
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