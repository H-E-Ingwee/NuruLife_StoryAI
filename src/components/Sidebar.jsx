import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  UserCircle 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col shadow-2xl z-20 bg-[#0A233A]">
      {/* Logo Section */}
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

      {/* Navigation */}
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

      {/* User Settings */}
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