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
  Check,
  Zap,
  Presentation,
  ShieldCheck,
  MousePointer2
} from 'lucide-react';

// --- LOGO COMPONENT ---
function Logo({ light = true }) {
  return (
    <div className="flex flex-col items-center md:items-start leading-none group cursor-pointer transition-all hover:scale-105">
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
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#F28C00] selection:text-white scroll-smooth overflow-x-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A233A]/95 backdrop-blur-lg py-3 shadow-2xl' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Logo />
          
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex gap-8 text-sm font-bold text-gray-300">
              <a href="#features" className="hover:text-[#F28C00] transition-colors">Features</a>
              <a href="#process" className="hover:text-[#F28C00] transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-[#F28C00] transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-10">
              <button onClick={() => onNavigate('login')} className="text-white font-bold text-sm hover:text-[#F28C00] transition-colors">Login</button>
              <button 
                onClick={() => onNavigate('login')}
                className="px-6 py-2.5 text-sm font-black text-white bg-[#7B1823] rounded-xl hover:bg-opacity-90 hover:shadow-[0_0_30px_rgba(123,24,35,0.5)] transition-all flex items-center gap-2"
              >
                Sign Up
              </button>
            </div>
          </div>

          <button className="lg:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#0A233A] border-t border-white/5 p-8 animate-in slide-in-from-top-5 duration-300 shadow-2xl">
            <div className="flex flex-col gap-6 text-xl font-bold text-gray-300 mb-10">
              <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#process" onClick={() => setIsMenuOpen(false)}>How It Works</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => onNavigate('login')} className="w-full py-4 bg-white/5 rounded-2xl text-white font-bold">Login</button>
              <button onClick={() => onNavigate('login')} className="w-full py-4 bg-[#7B1823] rounded-2xl text-white font-bold">Sign Up Now</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Centered Content */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=2000" 
            alt="Cinema lighting" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A233A]/90 via-[#0A233A]/80 to-white"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-black uppercase tracking-[0.2em] mb-10 animate-in fade-in zoom-in duration-1000">
            <Sparkles size={14} className="text-[#F28C00]" /> 
            <span>For Independent Creators</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
            AI-Powered Storyboarding<br/>
            <span className="text-[#F28C00]">for Visionaries.</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-12 font-medium leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            Transform your script into <span className="text-white font-bold underline decoration-[#7B1823]">professional storyboards</span> in minutes. Bridge the gap between creative vision and visual reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <button 
              onClick={() => onNavigate('login')}
              className="px-12 py-5 text-lg font-black text-white bg-[#7B1823] rounded-2xl hover:scale-105 hover:shadow-[0_20px_60px_rgba(123,24,35,0.5)] transition-all flex items-center justify-center gap-3 group"
            >
              Start Creating Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-12 py-5 text-lg font-black text-white bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-md flex items-center justify-center gap-2">
              <PlayCircle size={20} /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Save Time & Money - Benefit Section */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-sm font-black text-[#F28C00] uppercase tracking-[0.4em] mb-6 animate-in fade-in duration-700">Empowering African Creators</h2>
            <p className="text-4xl md:text-6xl font-black text-[#0A233A] tracking-tighter mb-8">Shining light through story.</p>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              StoryAI is built to support the full visual storytelling journey, from raw script text to scene breakdown, AI prompt refinement, and polished presentation output.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureItem 
              icon={<Zap size={32} />}
              title="Save Time & Money"
              text="Eliminate the high cost and slow process of traditional pre-production art."
              delay="delay-100"
            />
            <FeatureItem 
              icon={<Presentation size={32} />}
              title="Communicate Clearly"
              text="Show investors, collaborators, and audiences exactly what your story looks like."
              delay="delay-200"
            />
            <FeatureItem 
              icon={<ShieldCheck size={32} />}
              title="Maintain Consistency"
              text="Keep characters and settings visually consistent across your entire storyboard."
              delay="delay-300"
            />
          </div>
        </div>
      </section>

      {/* Live Workspace Preview - Dynamic Mockup */}
      <section className="py-32 bg-gray-50 border-y border-gray-100 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#0A233A] tracking-tight">Live Workspace Preview</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest mt-4 text-xs">Project: Beneath the Silence</p>
          </div>

          <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-200 p-4 md:p-8 relative group">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F28C00] rounded-3xl flex items-center justify-center text-[#0A233A] rotate-12 shadow-xl z-20 transition-transform group-hover:rotate-0">
              <Sparkles size={40} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
              <MockPanel img="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800" label="Frame 01 — Opening" sub="Wide Shot • Soft Dawn" />
              <MockPanel img="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&q=80&w=800" label="Frame 02 — Emotional Beat" sub="Character Lock • Style Preset" />
              <MockPanel img="https://images.unsplash.com/photo-1547430635-7115865d21b0?auto=format&fit=crop&q=80&w=800" label="Frame 03 — Prompt Draft" sub="AI Prompt • Regenerate" />
              <MockPanel img="https://images.unsplash.com/photo-1555364134-8c01b4c91a0c?auto=format&fit=crop&q=80&w=800" label="Frame 04 — Export Board" sub="PDF Ready • Contact Sheet" />
            </div>

            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-10 border-t border-gray-100 pt-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F28C00]">
                  <Wand2 size={20} />
                </div>
                <span className="text-sm font-black text-[#0A233A] uppercase tracking-widest">Prompt Builder</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#7B1823]">
                  <Cpu size={20} />
                </div>
                <span className="text-sm font-black text-[#0A233A] uppercase tracking-widest">AI Ready</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Layers size={20} />
                </div>
                <span className="text-sm font-black text-[#0A233A] uppercase tracking-widest">Scene Notes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why StoryAI Exists - Centered Problem/Solution */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-[#0A233A] tracking-tighter mb-10">Why StoryAI exists</h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
              "Because many creators have the vision, but lack the tools to show it clearly."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <ProblemCard 
              title="You have the script, but not the visual board"
              text="StoryAI helps you translate written scenes into clear, structured visual direction that is easier to build on."
            />
            <ProblemCard 
              title="You want to pitch better without needing to draw"
              text="Present story ideas more confidently with frames, prompts, and concept visuals that communicate your vision."
            />
            <ProblemCard 
              title="You need speed without losing creative control"
              text="Build faster while still shaping mood, style, continuity, and storytelling detail in every scene."
            />
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="process" className="py-32 bg-[#0A233A] text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[#F28C00]/5 blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[#7B1823]/5 blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-[#F28C00] uppercase tracking-[0.5em] mb-6">Seamless Workflow</h2>
            <p className="text-4xl md:text-6xl font-black tracking-tighter">From script to board in one guided flow.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <WorkflowStep num="01" title="Bring in your story" text="Start with a script or concept note and move into a working studio flow." />
            <WorkflowStep num="02" title="Break scenes into frames" text="Structure your story into manageable moments that are easier to visualize." />
            <WorkflowStep num="03" title="Generate and refine visuals" text="Use AI-assisted prompts to shape the tone, emotion, and look of each frame." />
            <WorkflowStep num="04" title="Review and present" text="Export a board that helps collaborators immediately understand your vision." />
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-[#F28C00] uppercase tracking-[0.4em] mb-6">Who it is for</h2>
            <p className="text-4xl md:text-5xl font-black text-[#0A233A] tracking-tighter">The new generation of visual storytellers.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AudienceCard 
              title="Student Creators" 
              text="Build stronger projects and presentations without needing a full art team." 
            />
            <AudienceCard 
              title="Independent Filmmakers" 
              text="Develop lookbooks and mood references for production planning." 
            />
            <AudienceCard 
              title="Writers & Storytellers" 
              text="See scenes take shape visually and explore tone before reaching the screen." 
            />
            <AudienceCard 
              title="Concept Developers" 
              text="Experiment with world-building and visual identity using a cleaner workflow." 
            />
          </div>
        </div>
      </section>

      {/* Pricing - Centered Tiers */}
      <section id="pricing" className="py-32 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#0A233A] tracking-tighter mb-6">Simple, transparent pricing</h2>
            <p className="text-gray-500 font-medium italic">"Start free, scale as you grow."</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard 
              tier="Free" 
              price="$0" 
              features={['3 projects', '50 storyboard frames', 'Basic AI prompts', 'PDF export']} 
              cta="Get Started"
            />
            <PricingCard 
              tier="Creator" 
              price="$19" 
              featured={true}
              features={['Unlimited projects', '500 storyboard frames', 'Advanced AI prompts', 'All export formats', 'Style presets']} 
              cta="Upgrade to Creator"
            />
            <PricingCard 
              tier="Studio" 
              price="$49" 
              features={['Everything in Creator', 'Unlimited frames', 'Team collaboration', 'Custom branding', 'API access']} 
              cta="Contact Sales"
            />
          </div>
        </div>
      </section>

      {/* Footer - Professional Finish */}
      <footer className="bg-[#0A233A] text-white pt-32 pb-12 overflow-hidden relative">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-20">
            <Logo />
            <p className="text-xl text-gray-400 mt-10 max-w-2xl mx-auto font-light leading-relaxed">
              Experience the intuitive interface designed for storytellers, with tools that help you visualize and refine your creative vision.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 border-y border-white/5 py-20 mb-12">
            <div className="text-left">
              <h3 className="text-[#F28C00] font-black text-2xl mb-4 uppercase tracking-tighter">Shining Light, Transforming Lives</h3>
              <p className="text-gray-400 font-medium">Join thousands of creators who are bringing their stories to life with AI-powered storyboarding.</p>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-6">
              <button onClick={() => onNavigate('login')} className="px-10 py-4 bg-[#7B1823] text-white font-black rounded-2xl hover:bg-white hover:text-[#7B1823] transition-all">Start Your Workflow</button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest gap-6">
            <p>© 2026 StoryAI by NuruLife Productions — from script to storyboard, beautifully.</p>
            <div className="flex gap-10">
              <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- LANDING PAGE COMPONENTS ---

function FeatureItem({ icon, title, text, delay }) {
  return (
    <div className={`p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-10 ${delay}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#0A233A] text-[#F28C00] flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-[#0A233A] mb-4">{title}</h3>
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  );
}

function MockPanel({ img, label, sub }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative group">
        <img src={img} alt={label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
      </div>
      <div>
        <p className="text-[11px] font-black text-[#0A233A] uppercase tracking-widest">{label}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-wider">{sub}</p>
      </div>
    </div>
  );
}

function ProblemCard({ title, text }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-white border-2 border-gray-100 text-left hover:border-[#7B1823]/30 transition-all flex flex-col gap-6 group">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#7B1823] group-hover:bg-[#7B1823] group-hover:text-white transition-all">
        <ArrowRight size={20} />
      </div>
      <h4 className="text-2xl font-black text-[#0A233A] leading-tight">{title}</h4>
      <p className="text-gray-500 font-medium">{text}</p>
    </div>
  );
}

function WorkflowStep({ num, title, text }) {
  return (
    <div className="group">
      <div className="text-5xl font-black text-white/10 mb-6 group-hover:text-[#F28C00]/20 transition-colors">{num}</div>
      <h4 className="text-xl font-black text-white mb-3 group-hover:text-[#F28C00] transition-colors">{title}</h4>
      <p className="text-sm text-gray-400 font-medium leading-relaxed">{text}</p>
    </div>
  );
}

function AudienceCard({ title, text }) {
  return (
    <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
      <h4 className="text-lg font-black text-[#0A233A] mb-4 uppercase tracking-tighter">{title}</h4>
      <p className="text-sm text-gray-500 font-medium leading-relaxed">{text}</p>
    </div>
  );
}

function PricingCard({ tier, price, features, cta, featured = false }) {
  return (
    <div className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col ${featured ? 'bg-[#0A233A] border-[#0A233A] text-white shadow-2xl scale-105' : 'bg-white border-gray-100 text-[#0A233A]'}`}>
      {featured && <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F28C00] mb-6 block">Most Popular</span>}
      <h4 className="text-2xl font-black mb-2">{tier}</h4>
      <div className="flex items-baseline justify-center gap-1 mb-10">
        <span className="text-5xl font-black tracking-tighter">{price}</span>
        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">/month</span>
      </div>
      <ul className="flex-1 space-y-4 mb-12 text-left">
        {features.map(f => (
          <li key={f} className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight">
            <Check size={16} className={featured ? 'text-[#F28C00]' : 'text-[#7B1823]'} /> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${featured ? 'bg-[#F28C00] text-[#0A233A] hover:bg-white' : 'bg-[#0A233A] text-white hover:bg-[#7B1823]'}`}>
        {cta}
      </button>
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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F28C00]/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7B1823]/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 relative z-10 border border-white">
        <div className="bg-[#0A233A] p-12 text-center flex flex-col items-center">
          <div onClick={() => onNavigate('landing')} className="cursor-pointer">
            <Logo />
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mt-8">Welcome Back</p>
        </div>

        <div className="p-10 md:p-14">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center md:text-left">
              <label className="block text-[10px] font-black text-[#0A233A] uppercase tracking-widest">Email Address</label>
              <div className="relative group mx-auto">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F28C00] transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:bg-white transition-all text-sm font-bold"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-2 text-center md:text-left">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-black text-[#0A233A] uppercase tracking-widest">Password</label>
                <button type="button" className="text-[9px] text-[#F28C00] hover:underline font-black uppercase">Forgot?</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#F28C00] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-14 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F28C00] focus:bg-white transition-all text-sm font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-[#7B1823] hover:bg-[#0A233A] text-white font-black rounded-2xl transition-all shadow-xl transform hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest"
            >
              Enter StoryAI
            </button>
          </form>

          <div className="mt-12 flex items-center justify-center">
            <div className="border-t border-gray-100 flex-grow"></div>
            <span className="px-5 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Social Login</span>
            <div className="border-t border-gray-100 flex-grow"></div>
          </div>

          <div className="mt-10">
            <button className="w-full py-5 border-2 border-gray-100 rounded-2xl flex items-center justify-center gap-4 hover:bg-gray-50 hover:border-gray-200 transition-all text-xs font-black text-[#0A233A] uppercase tracking-widest">
              <Globe size={18} className="text-blue-500" /> Continue with Google
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              New here? <button className="text-[#F28C00] hover:underline">Join NuruLife</button>
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
    <aside className="w-72 flex-shrink-0 flex flex-col shadow-2xl z-20 bg-[#0A233A]">
      <div className="p-10 flex items-center justify-center border-b border-white/5">
        <Logo />
      </div>

      <nav className="flex-1 py-12 px-6 space-y-4">
        <NavItem icon={<LayoutDashboard size={20} />} label="My Projects" />
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

      <div className="p-8 border-t border-white/5 bg-[#081b2e]">
        <div className="flex items-center gap-4 px-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F28C00] to-[#7B1823] flex items-center justify-center font-black text-white text-xs shadow-xl ring-2 ring-white/10">
            BI
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white leading-none truncate uppercase tracking-widest">Brian Ingwee</p>
            <p className="text-[10px] text-[#F28C00] font-bold uppercase mt-2 tracking-widest">Pro Member</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
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
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 group
        ${active ? 'bg-[#F28C00] text-[#0A233A] shadow-xl shadow-[#F28C00]/20' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
    >
      <div className={`${active ? 'text-[#0A233A]' : 'group-hover:text-[#F28C00] transition-colors'}`}>
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
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
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm z-10">
          <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest">
            <span>Project: Beneath the Silence</span>
            <ChevronRight size={14} className="text-gray-200" />
            <span className="text-[#0A233A] border-b-2 border-[#F28C00]">Visual Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-[#0A233A] rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-gray-100">
              <Download size={16} /> Export PDF
            </button>
            <button className="flex items-center gap-3 px-8 py-3 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl bg-[#7B1823] hover:shadow-[0_10px_30px_rgba(123,24,35,0.3)] active:scale-95">
              <Sparkles size={16} /> Share Board
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex relative">
          <div className="w-1/3 min-w-[400px] bg-white border-r border-gray-200 flex flex-col z-10">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <h2 className="text-[11px] font-black text-[#0A233A] uppercase tracking-[0.3em] flex items-center gap-3">
                <FileText size={18} className="text-[#F28C00]" /> Script Flow
              </h2>
              <button 
                onClick={handleParseScript}
                disabled={isParsing}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black text-white rounded-xl transition-all disabled:opacity-70 bg-[#0A233A] uppercase tracking-widest shadow-xl hover:-translate-y-0.5"
              >
                {isParsing ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                {isParsing ? 'Breaking Down...' : 'Process Script'}
              </button>
            </div>
            <div className="flex-1 p-10 overflow-y-auto">
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-full resize-none outline-none font-mono text-sm leading-[2] text-gray-800 placeholder-gray-300"
                placeholder="INT. STUDIO - DAY..."
              />
            </div>
          </div>

          <div className="flex-1 bg-[#F8F9FA] overflow-y-auto p-12 z-0 relative scroll-smooth">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-end mb-14">
                <div>
                  <h1 className="text-4xl font-black text-[#0A233A] tracking-tighter leading-none">Storyboard Board</h1>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mt-5">Translate written scenes into visual direction</p>
                </div>
              </div>

              {scenes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[500px] border-4 border-dashed border-gray-200 rounded-[4rem] bg-white/50 group transition-all hover:bg-white hover:border-[#F28C00]/20">
                  <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-gray-200 mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <ImageIcon size={60} />
                  </div>
                  <p className="text-gray-500 font-black text-base uppercase tracking-[0.4em]">No visuals rendered</p>
                  <p className="text-gray-400 text-xs mt-4 font-bold uppercase tracking-widest">Paste your screenplay and click Process Script</p>
                </div>
              ) : (
                <div className="space-y-16 pb-32">
                  {scenes.map((scene, index) => (
                    <div key={scene.id} className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row transition-all hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-10 duration-700">
                      <div className="lg:w-5/12 bg-gray-100 border-r border-gray-50 relative min-h-[400px] flex items-center justify-center group">
                        {scene.image ? (
                          <img src={scene.image} alt="Panel" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        ) : generatingId === scene.id ? (
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 border-4 rounded-[2.5rem] border-t-transparent border-[#7B1823] animate-spin mb-8"></div>
                            <span className="text-[11px] font-black text-[#0A233A] uppercase tracking-[0.3em] animate-pulse">Building Frame...</span>
                          </div>
                        ) : (
                          <div className="text-center p-6">
                            <ImageIcon size={60} className="text-gray-200 mx-auto mb-6" />
                            <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Scene Frame {index + 1} Ready</span>
                          </div>
                        )}
                        <div className={`absolute inset-0 bg-[#0A233A]/60 flex items-center justify-center transition-all duration-700 ${scene.image ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-transparent'}`}>
                          {generatingId !== scene.id && (
                            <button 
                              onClick={() => handleGenerateImage(scene.id, scene.prompt)}
                              className="px-12 py-5 rounded-[2rem] text-[11px] font-black text-white shadow-2xl transform transition-all hover:scale-110 active:scale-95 flex items-center gap-3 bg-[#7B1823] uppercase tracking-[0.3em]"
                            >
                              <Sparkles size={18} /> 
                              {scene.image ? 'Regenerate' : 'Render Frame'}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-12 lg:p-16 flex-1 flex flex-col">
                        <div className="mb-10">
                          <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-5 py-2 bg-[#0A233A] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-[#0A233A]/20">Frame {index + 1}</span>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{scene.heading}</span>
                          </div>
                          <p className="text-lg text-gray-500 font-bold italic border-l-8 pl-8 border-[#F28C00]/40 py-4 leading-relaxed">{scene.action}</p>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                              AI Visual Prompt
                            </label>
                            <span className="text-[9px] font-black text-[#F28C00] uppercase tracking-widest">Intentional Detail</span>
                          </div>
                          <textarea 
                            value={scene.prompt}
                            onChange={(e) => {}}
                            className="w-full h-40 text-base text-[#0A233A] bg-gray-50 border border-gray-100 rounded-[2rem] p-8 focus:outline-none focus:ring-4 focus:ring-[#F28C00]/10 focus:bg-white transition-all font-bold resize-none leading-relaxed"
                          />
                        </div>

                        <div className="mt-12 pt-10 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-orange-50 text-orange-700 border border-orange-100 shadow-sm">
                              <Lock size={16} />
                              Lock: {scene.lockedCharacter}
                            </div>
                            <button 
                              onClick={() => {
                                setActiveCharacter(scene.lockedCharacter);
                                setIsModalOpen(true);
                              }}
                              className="text-[11px] font-black text-[#0A233A] hover:text-[#F28C00] transition-all uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-[#F28C00] px-2 py-1"
                            >
                              Consistency +
                            </button>
                          </div>
                          <div className="flex gap-4">
                            <button className="p-3 text-gray-300 hover:text-[#0A233A] transition-colors"><Settings size={20} /></button>
                            <button className="p-3 text-gray-300 hover:text-[#7B1823] transition-colors"><LogOut size={20} className="rotate-180" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* CONSISTENCY MODAL */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-auto">
              <div className="absolute inset-0 bg-[#0A233A]/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)}></div>
              <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] w-full max-w-2xl p-16 animate-in zoom-in-90 fade-in duration-500 relative z-10 border-4 border-white/20">
                <button 
                   onClick={() => setIsModalOpen(false)}
                   className="absolute top-10 right-10 p-4 hover:bg-gray-100 rounded-full text-gray-400 transition-all active:scale-90"
                >
                  <X size={32} />
                </button>

                <div className="text-center mb-14">
                  <div className="w-28 h-28 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-[#F28C00] mx-auto mb-10 shadow-2xl shadow-orange-500/10 rotate-3">
                    <Users size={56} />
                  </div>
                  <h3 className="text-4xl font-black text-[#0A233A] mb-5 tracking-tighter leading-none">Keep character identity</h3>
                  <p className="text-gray-500 font-medium leading-relaxed px-10">Upload a face or style reference for <strong className="text-[#F28C00] font-black uppercase tracking-[0.2em]">{activeCharacter}</strong> to keep the visual world coherent across all frames.</p>
                </div>

                <div className="border-4 border-dashed border-gray-100 rounded-[3rem] p-20 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-[#F28C00]/40 transition-all cursor-pointer group shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F28C00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="bg-white p-6 rounded-3xl shadow-2xl mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform relative z-10">
                    <Upload size={40} className="text-[#7B1823]" />
                  </div>
                  <span className="text-sm font-black text-[#0A233A] uppercase tracking-[0.3em] mb-3 relative z-10">Select Reference Photo</span>
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest relative z-10">PNG, JPG or WebP (Max 20MB)</span>
                </div>

                <div className="mt-14 flex gap-6">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] hover:bg-gray-50 rounded-[2rem] transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-6 text-[11px] font-black text-white bg-[#0A233A] hover:bg-[#F28C00] hover:text-[#0A233A] hover:shadow-2xl rounded-[2rem] transition-all uppercase tracking-[0.3em] shadow-xl active:scale-95"
                  >
                    Lock Identity
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

  // Centering layout for the whole app
  return (
    <div className="w-full h-full flex flex-col items-center">
      {currentView === 'landing' && <LandingPage onNavigate={setCurrentView} />}
      {currentView === 'login' && <LoginPage onLogin={() => setCurrentView('dashboard')} onNavigate={setCurrentView} />}
      {currentView === 'dashboard' && <Dashboard onLogout={() => setCurrentView('landing')} />}
    </div>
  );
}