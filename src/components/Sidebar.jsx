import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  Plus,
  Layers,
  Video,
  Download,
  UserCircle,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col shadow-2xl z-20 bg-[#0A233A]">
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-center border-b border-gray-700/50">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-black tracking-tighter flex items-center">
            <span className="text-[#F28C00]">STORY</span>
            <span className="text-white">AI</span>
          </div>
          <div className="text-[10px] tracking-[0.2em] font-bold mt-1 text-[#7B1823]">
            BY NURULIFE PRODUCTIONS
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        <NavItem icon={<Plus size={20} />} label="+ New Project" />
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <NavItem 
          icon={<FileText size={20} />} 
          label="Projects" 
          active={activeTab === 'projects'} 
          onClick={() => setActiveTab('projects')} 
        />
        <NavItem 
          icon={<Video size={20} />} 
          label="Storyboards" 
          active={activeTab === 'storyboards'} 
          onClick={() => setActiveTab('storyboards')} 
        />
        <NavItem icon={<Users size={20} />} label="Characters" active={activeTab === 'characters'} onClick={() => setActiveTab('characters')} />
        <NavItem icon={<Layers size={20} />} label="Assets Library" active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} />
        <NavItem icon={<Video size={20} />} label="Shot List" active={activeTab === 'shot-list'} onClick={() => setActiveTab('shot-list')} />
        <NavItem icon={<Download size={20} />} label="Exports" active={activeTab === 'exports'} onClick={() => setActiveTab('exports')} />
        <NavItem 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')} 
        />
      </nav>

      {/* User Settings */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <UserCircle size={32} className="text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Brian Ingwee</p>
            <p className="text-xs text-gray-400">Pro Plan</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:text-[#F28C00] transition-colors" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

// Helper Component for Sidebar Items (Moved here!)
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