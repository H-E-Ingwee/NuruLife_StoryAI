import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard,
  FileText, 
  Image as ImageIcon, 
  Users,
  Settings,
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
  Check,
  Zap,
  Presentation,
  ShieldCheck,
  Plus,
  MoreVertical,
  Maximize2,
  Eye,
  Share2,
  Video
} from 'lucide-react';

// --- CUSTOM GOOGLE ICON ---
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184L12.048 13.558c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

// --- LOGO COMPONENT ---
function Logo({ light = true }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/')} className="flex flex-col items-center md:items-start leading-none group cursor-pointer transition-all hover:scale-105">
      <div className="text-2xl font-black tracking-tighter flex items-center">
        <span className={light ? "text-white" : "text-[#0A233A]"}>STORY</span>
        <span className="text-[#F28C00]">AI</span>
      </div>
      <div className="text-[9px] tracking-[0.15em] font-bold text-gray-400 uppercase text-center md:text-left">
        by NuruLife Productions
      </div>
    </div>
  );
}

// --- LANDING PAGE ---
function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-scope w-full min-h-screen bg-white flex flex-col font-sans selection:bg-[#F28C00] selection:text-white scroll-smooth overflow-x-hidden">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A233A]/95 backdrop-blur-lg py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Logo />
          
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex gap-8 text-sm font-bold text-gray-300">
              <a href="#features" className="hover:text-[#F28C00] transition-colors">Features</a>
              <a href="#process" className="hover:text-[#F28C00] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#F28C00] transition-colors">Pricing</a>
              <a href="#who-it-is-for" className="hover:text-[#F28C00] transition-colors">For Creators</a>
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-10">
              <button onClick={() => navigate('/login')} className="text-white font-bold text-sm hover:text-[#F28C00] transition-colors">Login</button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 text-sm font-black text-white bg-[#7B1823] rounded-xl hover:bg-opacity-90 hover:shadow-[0_0_30px_rgba(123,24,35,0.5)] transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>

          <button className="lg:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden text-center bg-[#0A233A]">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2000&auto=format&fit=crop" alt="Cinema" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A233A]/80 to-white"></div>
        </div>

        <div className="container max-w-5xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in zoom-in duration-1000">
            <Sparkles size={14} className="text-[#F28C00]" /> 
            <span>AI-Powered Storyboarding for Independent Creators</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Transform scripts into<br/>
            <span className="text-[#F28C00]">professional storyboards.</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-12 font-medium leading-relaxed max-w-3xl mx-auto">
            StoryAI bridges the gap between creative vision and visual reality. Whether you're a filmmaker, writer, student, or creative professional, turn your written ideas into compelling storyboard frames and concept art instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button 
              onClick={() => navigate('/signup')}
              className="px-12 py-5 text-lg font-black text-white bg-[#7B1823] rounded-2xl hover:scale-105 hover:shadow-[0_20px_60px_rgba(123,24,35,0.5)] transition-all flex items-center justify-center gap-3 group"
            >
              Start Creating Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-12 py-5 text-lg font-black text-white bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md flex items-center justify-center gap-2">
              <PlayCircle size={20} /> View Project Demo
            </button>
          </div>
        </div>
      </section>

      {/* Empowering Creators Section */}
      <section id="features" className="py-32 bg-white flex justify-center">
        <div className="container max-w-6xl px-6 text-center">
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-sm font-black text-[#F28C00] uppercase tracking-[0.4em] mb-6">Empowering African Creators</h2>
            <p className="text-4xl md:text-6xl font-black text-[#0A233A] tracking-tighter mb-8 italic">"Shining light through story."</p>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              StoryAI is built to support the full visual storytelling journey, from raw script text to scene breakdown, AI prompt refinement, and polished presentation output.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StatCard icon={<Zap size={24} />} title="Save Time & Money" text="Eliminate the high cost and slow process of traditional pre-production art." />
            <StatCard icon={<Presentation size={24} />} title="Communicate Clearly" text="Show investors, collaborators, and audiences exactly what your story looks like." />
            <StatCard icon={<ShieldCheck size={24} />} title="Maintain Consistency" text="Keep characters and settings visually consistent across your entire storyboard." />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-[#F4F5F7] flex justify-center">
        <div className="container max-w-7xl px-6 text-center">
          <div className="max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A233A] tracking-tighter mb-6">Simple, transparent pricing</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Start free, scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard tier="Free" price="$0" sub="Perfect for getting started" features={['3 projects', '50 storyboard frames', 'Basic AI prompts', 'PDF export']} cta="Get Started Free" onAction={() => navigate('/signup')} />
            <PricingCard tier="Creator" price="$19" sub="For serious storytellers" featured features={['Unlimited projects', '500 storyboard frames', 'Advanced AI prompts', 'All formats', 'Style presets', 'Email support']} cta="Upgrade to Creator" onAction={() => navigate('/signup')} />
            <PricingCard tier="Studio" price="$49" sub="For production teams" features={['Everything in Creator', 'Unlimited frames', 'Team collaboration', 'Custom branding', 'API access']} cta="Contact Sales" onAction={() => navigate('/signup')} />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-[#0A233A] text-white text-center flex flex-col items-center">
        <Logo />
        <h2 className="text-[#F28C00] text-3xl font-black mt-10 mb-6 uppercase tracking-tighter italic">Shining Light, Transforming Lives</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 font-light">Join thousands of creators who are bringing their stories to life with AI-powered storyboarding.</p>
        <button onClick={() => navigate('/signup')} className="px-12 py-5 bg-[#F28C00] text-[#0A233A] font-black text-xl rounded-2xl hover:scale-105 hover:bg-white transition-all shadow-2xl">Begin Your Creative Workflow</button>
      </section>

      <footer className="bg-gray-50 py-20 border-t border-gray-100 flex justify-center">
        <div className="container max-w-7xl px-6 text-center">
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">© 2026 StoryAI by NuruLife Productions — from script to storyboard, beautifully.</p>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Built around the NuruLife promise: Shining Light, Transforming Lives.</p>
        </div>
      </footer>
    </div>
  );
}

// --- AUTH PAGE ---
function AuthPage({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F5F7] flex items-center justify-center p-4 font-sans relative overflow-hidden text-center">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F28C00]/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7B1823]/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500 border-4 border-white">
        <div className="bg-[#0A233A] p-12 text-center flex flex-col items-center">
          <div className="mb-6"><Logo /></div>
          <h2 className="text-white font-black text-xl tracking-tight">{isLogin ? "Welcome back to StoryAI" : "Join the StoryAI Studio"}</h2>
        </div>
        <div className="p-10 md:p-12 text-left">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
               <div className="space-y-1">
                <label className="block text-[10px] font-black text-[#0A233A] uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F28C00] outline-none font-bold text-sm" placeholder="e.g. Brian Ingwee" required />
               </div>
            )}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#0A233A] uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F28C00]" size={18} />
                <input type="email" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F28C00] outline-none font-bold text-sm" placeholder="name@email.com" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#0A233A] uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F28C00]" size={18} />
                <input type="password" className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#F28C00] outline-none font-bold text-sm" placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-[#7B1823] text-white font-black rounded-2xl shadow-xl hover:bg-[#0A233A] transition-all uppercase tracking-[0.2em] text-[10px]">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Social Authentication</span>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <div className="mt-8">
            <button onClick={() => navigate('/dashboard')} className="w-full py-4 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all font-black text-[10px] text-[#0A233A] uppercase flex items-center justify-center gap-4">
               <GoogleIcon /> Continue with Google
            </button>
          </div>

          <p className="mt-10 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
            {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
            <Link to={isLogin ? "/signup" : "/login"} className="text-[#F28C00] hover:underline ml-1">
              {isLogin ? "Join Now" : "Login here"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD (WORKSPACE) ---
function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [isNewProjectModal, setIsNewProjectModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [projects, setProjects] = useState([
    { id: 1, title: "Beneath the Silence", frames: 24, status: "Active", script: "EXT. NAIROBI - DAWN\n\nA lone figure stands against the orange glow of the rising sun. KAMAU (20s) adjust his lens." },
    { id: 2, title: "The Nairobi Run", frames: 42, status: "Review", script: "" },
  ]);
  const [currentProject, setCurrentProject] = useState(projects[0]);
  const [scenes, setScenes] = useState([]);

  const handleCreateProject = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const newProj = {
      id: Date.now(),
      title: data.get('title'),
      script: data.get('script'),
      frames: 0,
      status: "Draft"
    };
    setProjects([newProj, ...projects]);
    setCurrentProject(newProj);
    setIsNewProjectModal(false);
    setActiveTab('editor');
  };

  const handleProcessScript = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setScenes([
        { 
          id: 1, 
          heading: "EXT. NAIROBI - OPENING", 
          action: "A lone figure stands against the orange glow of the rising sun. KAMAU (20s) adjusts his lens.", 
          prompt: "Wide shot, silhouette of a man named Kamau, Nairobi city skyline at dawn, glowing orange horizon, cinematic lighting, 8k.",
          shotSize: "WS", cameraAngle: "Eye Level", lens: "35mm", status: "AI Rendered", image: "https://images.unsplash.com/photo-1547430635-7115865d21b0" 
        },
        { 
          id: 2, 
          heading: "CU. KAMAU - DETERMINATION", 
          action: "Close up on Kamau's eyes as the city awakens. Reflection of lights in his pupils.", 
          prompt: "Close up shot, focused expression, reflection of dawn city lights in eyes, shallow depth of field, high contrast.",
          shotSize: "CU", cameraAngle: "Low Angle", lens: "85mm", status: "Draft", image: null 
        }
      ]);
      setIsProcessing(false);
      setActiveTab('editor');
    }, 1500);
  };

  return (
    <div className="dashboard-scope flex h-screen w-full bg-[#F4F5F7] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-[#0A233A] flex flex-col shadow-2xl z-30">
        <div className="p-10 border-b border-white/5 flex flex-col items-center">
          <Logo />
          <div className="mt-10 w-full bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/5 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-[#F28C00] flex items-center justify-center font-black text-[#0A233A] text-xs shadow-lg">BI</div>
            <div className="overflow-hidden">
              <p className="text-white text-[10px] font-black uppercase truncate tracking-widest text-left">Brian Ingwee</p>
              <p className="text-[#F28C00] text-[8px] font-black uppercase tracking-wider mt-1 text-left">Creator Pro</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Studio Dashboard" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <SidebarItem icon={<FileText size={20} />} label="Visual Editor" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
          <SidebarItem icon={<Users size={20} />} label="Character Library" />
          <SidebarItem icon={<Layers size={20} />} label="Asset Library" />
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4 bg-[#081b2e]">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
            <LogOut size={16} /> Exit Studio
          </button>
        </div>
      </aside>

      {/* Main Studio View */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 z-20 shadow-sm">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Project:</span>
             <span className="text-sm font-black text-[#0A233A] uppercase tracking-widest border-b-2 border-[#F28C00] pb-0.5">{currentProject.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#0A233A] hover:bg-gray-100 transition-colors"><Share2 size={16} /> Share Board</button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#7B1823] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-[0_10px_30px_rgba(123,24,35,0.3)] transition-all">
              <Download size={16} /> Export PDF
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'projects' ? (
             <div className="h-full p-12 overflow-y-auto">
               <div className="max-w-6xl mx-auto">
                  <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-black text-[#0A233A] tracking-tighter uppercase text-left">Studio Workspace</h1>
                    <button onClick={() => setIsNewProjectModal(true)} className="px-8 py-4 bg-[#0A233A] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
                      <Plus size={18} /> New Studio Project
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(p => (
                      <ProjectCard key={p.id} project={p} onOpen={() => { setCurrentProject(p); setActiveTab('editor'); }} />
                    ))}
                  </div>
               </div>
             </div>
          ) : (
             <div className="h-full flex">
                <div className="w-[400px] border-r border-gray-200 bg-white flex flex-col">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-[10px] font-black text-[#0A233A] uppercase tracking-widest flex items-center gap-2"><FileText size={16} className="text-[#F28C00]" /> Script</h3>
                    <button onClick={handleProcessScript} className="p-2.5 bg-[#0A233A] text-white rounded-xl hover:scale-110 shadow-lg transition-all">
                      {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    </button>
                  </div>
                  <textarea className="flex-1 p-8 outline-none font-mono text-sm leading-relaxed text-gray-700 resize-none bg-white" placeholder="Paste screenplay text here..." value={currentProject.script} onChange={(e) => setCurrentProject({...currentProject, script: e.target.value})} />
                </div>

                <div className="flex-1 bg-[#F8F9FA] p-12 overflow-y-auto">
                  <div className="max-w-4xl mx-auto space-y-12 pb-24">
                     {scenes.length === 0 ? (
                        <div className="h-[400px] flex flex-col items-center justify-center border-4 border-dashed border-gray-200 rounded-[3rem] text-center p-12 bg-white/40">
                          <ImageIcon size={64} className="text-gray-200 mb-6" />
                          <h2 className="text-xl font-black text-[#0A233A] uppercase tracking-widest">No shots detected</h2>
                          <p className="text-gray-400 mt-2 font-bold text-[10px] uppercase tracking-[0.2em]">Process script to auto-generate storyboard board</p>
                        </div>
                     ) : (
                       scenes.map((scene, idx) => (
                         <div key={scene.id} className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 flex flex-col animate-in slide-in-from-bottom-5 duration-700">
                            <div className="px-10 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                               <div className="flex gap-10">
                                  <ShotMeta label="Frame" val={idx+1} />
                                  <ShotMeta label="Shot Size" val={scene.shotSize} highlight />
                                  <ShotMeta label="Camera Angle" val={scene.cameraAngle} />
                                  <ShotMeta label="Lens" val={scene.lens} />
                               </div>
                               <MoreVertical size={20} className="text-gray-300 cursor-pointer" />
                            </div>
                            <div className="flex flex-col lg:flex-row min-h-[350px]">
                               <div className="lg:w-1/2 bg-gray-100 flex items-center justify-center relative group overflow-hidden">
                                  {scene.image ? (
                                    <img src={scene.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="panel" />
                                  ) : (
                                    <Sparkles size={48} className="text-gray-200" />
                                  )}
                               </div>
                               <div className="flex-1 p-12 text-left bg-white">
                                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Script Action</h4>
                                  <p className="text-base text-[#0A233A] font-bold italic border-l-4 border-[#F28C00] pl-6 mb-8 leading-relaxed">{scene.action}</p>
                                  <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">AI Prompt Logic</h4>
                                  <textarea className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-[#F28C00]/20 font-bold text-sm text-[#0A233A] resize-none" defaultValue={scene.prompt} />
                               </div>
                            </div>
                         </div>
                       ))
                     )}
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>

      {/* NEW PROJECT MODAL */}
      {isNewProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
           <div className="absolute inset-0 bg-[#0A233A]/80 animate-in fade-in duration-300" onClick={() => setIsNewProjectModal(false)}></div>
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl p-12 relative z-10 border-4 border-white animate-in zoom-in-95 duration-300">
              <button onClick={() => setIsNewProjectModal(false)} className="absolute top-8 right-8 p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-all"><X size={28} /></button>
              <h2 className="text-3xl font-black text-[#0A233A] tracking-tighter uppercase mb-8 text-left">Start Studio Project</h2>
              <form className="space-y-6" onSubmit={handleCreateProject}>
                 <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-[#0A233A] uppercase tracking-widest ml-1">Project Title</label>
                    <input name="title" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#F28C00] text-sm" placeholder="e.g., Beneath the Silence" required />
                 </div>
                 <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-[#0A233A] uppercase tracking-widest ml-1">Script Text</label>
                    <textarea name="script" rows="6" className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-[#F28C00] resize-none text-sm leading-relaxed" placeholder="Paste your screenplay scenes here..." required />
                 </div>
                 <div className="pt-6 grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setIsNewProjectModal(false)} className="py-5 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-100 rounded-2xl transition-colors">Cancel</button>
                    <button type="submit" className="py-5 font-black text-[10px] uppercase tracking-widest bg-[#0A233A] text-white hover:bg-[#7B1823] rounded-2xl shadow-xl transition-all">Launch Workspace</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function SidebarItem({ icon, label, active = false, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? 'bg-[#F28C00] text-[#0A233A] shadow-lg shadow-[#F28C00]/20' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
      <div className={`${active ? 'text-[#0A233A]' : 'group-hover:text-[#F28C00] transition-colors'}`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all group text-left relative overflow-hidden">
      <div className="flex justify-between items-start mb-10 text-[#0A233A]">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-[#0A233A] group-hover:bg-[#0A233A] group-hover:text-white transition-all shadow-inner"><Video size={28} /></div>
        <span className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest border border-green-100">{project.status}</span>
      </div>
      <h3 className="text-lg font-black text-[#0A233A] mb-1 uppercase tracking-tight">{project.title}</h3>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">{project.frames} Frames Generated</p>
      <button onClick={onOpen} className="w-full py-4 bg-gray-50 rounded-2xl text-[9px] font-black text-[#0A233A] uppercase tracking-widest hover:bg-[#F28C00] transition-all shadow-sm">Open Workspace</button>
    </div>
  );
}

function StatCard({ icon, title, text }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 transition-all hover:bg-white hover:shadow-2xl hover:-translate-y-2 group text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-[#0A233A] text-[#F28C00] flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-black text-[#0A233A] mb-4 leading-tight">{title}</h3>
      <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[200px]">{text}</p>
    </div>
  );
}

function ReasonCard({ title, text }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white border-2 border-gray-100 hover:border-[#7B1823]/20 transition-all flex flex-col gap-6 group text-center items-center">
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#7B1823] group-hover:bg-[#7B1823] group-hover:text-white transition-all mx-auto"><ArrowRight size={18} /></div>
      <h4 className="text-xl font-black text-[#0A233A] leading-tight max-w-[240px] uppercase tracking-tighter">{title}</h4>
      <p className="text-gray-500 text-sm font-medium leading-relaxed">{text}</p>
    </div>
  );
}

function StepCard({ num, title, text }) {
  return (
    <div className="group text-center flex flex-col items-center">
      <div className="text-5xl font-black text-white/10 mb-6 group-hover:text-[#F28C00]/20 transition-colors tracking-tighter">{num}</div>
      <h4 className="text-lg font-black text-white mb-3 uppercase tracking-tighter">{title}</h4>
      <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[200px]">{text}</p>
    </div>
  );
}

function PricingCard({ tier, price, sub, features, cta, featured = false, onAction }) {
  return (
    <div className={`p-10 rounded-[3rem] border-2 flex flex-col transition-all duration-500 ${featured ? 'bg-[#0A233A] border-[#0A233A] text-white shadow-2xl scale-105 relative z-10' : 'bg-white border-gray-100 text-[#0A233A] hover:-translate-y-2'}`}>
      {featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#F28C00] text-[#0A233A] rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">Most Popular</div>}
      <h4 className="text-2xl font-black mb-1 italic tracking-tighter">{tier}</h4>
      <p className={`text-[10px] font-black uppercase tracking-widest mb-8 ${featured ? 'text-[#F28C00]' : 'text-gray-400'}`}>{sub}</p>
      <div className="flex items-baseline justify-center gap-1 mb-10">
        <span className="text-5xl font-black tracking-tighter">{price}</span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/mo</span>
      </div>
      <ul className="flex-1 space-y-4 mb-10 text-left mx-auto">
        {features.map(f => (
          <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight">
            <Check size={16} className={featured ? 'text-[#F28C00]' : 'text-[#7B1823]'} /> {f}
          </li>
        ))}
      </ul>
      <button onClick={onAction} className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${featured ? 'bg-[#F28C00] text-[#0A233A] hover:bg-white shadow-xl' : 'bg-[#0A233A] text-white hover:bg-[#7B1823]'}`}>
        {cta}
      </button>
    </div>
  );
}

function AudienceCard({ title, text }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all text-center flex flex-col items-center h-full">
      <h4 className="text-lg font-black text-[#0A233A] mb-4 uppercase tracking-tighter">{title}</h4>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{text}</p>
    </div>
  );
}

function MockFrame({ img, frame, label, sub }) {
  return (
    <div className="flex flex-col gap-4 text-center">
      <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg relative group border-2 border-transparent hover:border-[#F28C00] transition-all mx-auto w-full">
        <img src={img} alt={label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-[#0A233A] text-white text-[9px] font-black uppercase rounded-lg shadow-xl">Frame {frame}</div>
      </div>
      <div className="px-2">
        <p className="text-[11px] font-black text-[#0A233A] uppercase tracking-widest">{label}</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">{sub}</p>
      </div>
    </div>
  );
}

function ShotMeta({ label, val, highlight = false }) {
  return (
    <div className="flex flex-col text-left">
       <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">{label}</span>
       <span className={`text-[11px] font-black uppercase tracking-widest mt-1.5 ${highlight ? 'text-[#7B1823]' : 'text-[#0A233A]'}`}>{val}</span>
    </div>
  );
}

// --- ROOT APP COMPONENT (ROUTING) ---
export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full min-h-screen flex flex-col items-center bg-[#F4F5F7]">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}