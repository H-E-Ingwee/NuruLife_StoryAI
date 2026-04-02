import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Cpu,
  Download,
  Globe,
  Moon,
  Sun,
  Save,
  Key,
  Mail,
  Smartphone
} from 'lucide-react';

export default function SettingsPanel({ onBack }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'Brian Ingwee',
      email: 'brian@nurulife.com',
      bio: 'Storytelling through technology',
      avatar: null
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      projectUpdates: true,
      marketingEmails: false
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC+3'
    },
    ai: {
      defaultModel: 'claude-3-haiku',
      imageQuality: 'high',
      autoSave: true
    },
    collaboration: {
      realTime: true,
      comments: 'all'
    },
    projects: {
      current: 'beneath-silence',
      autoSave: true,
      exportFormat: 'pdf',
      backup: 'daily'
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true
    }
  });

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'ai', label: 'AI Settings', icon: <Cpu size={18} /> },
    { id: 'collaboration', label: 'Collaboration', icon: <Users size={18} /> },
    { id: 'projects', label: 'Project Settings', icon: <FileText size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        <button className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <nav className="p-4 space-y-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#0A233A] text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className={activeSection === section.id ? 'text-[#F28C00]' : ''}>
                  {section.icon}
                </div>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {activeSection === 'profile' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90">
                      Change Avatar
                    </button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F28C00]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C00]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">Get notified in your browser</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F28C00]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C00]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Project Updates</p>
                      <p className="text-sm text-gray-500">Notifications about your projects</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.projectUpdates}
                      onChange={(e) => updateSetting('notifications', 'projectUpdates', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F28C00]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C00]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => updateSetting('appearance', 'theme', 'light')}
                      className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-colors ${
                        settings.appearance.theme === 'light'
                          ? 'border-[#F28C00] bg-[#F28C00]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Sun size={20} />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => updateSetting('appearance', 'theme', 'dark')}
                      className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-colors ${
                        settings.appearance.theme === 'dark'
                          ? 'border-[#F28C00] bg-[#F28C00]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Moon size={20} />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.appearance.timezone}
                    onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                  >
                    <option value="UTC+3">East Africa Time (UTC+3)</option>
                    <option value="UTC+0">GMT (UTC+0)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'collaboration' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Collaboration Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Sarah Kim</p>
                          <p className="text-sm text-gray-500">Character Designer</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Marcus Johnson</p>
                          <p className="text-sm text-gray-500">Sound Designer</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Pending</span>
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-[#0A233A] text-white rounded-lg hover:bg-opacity-90">
                    Invite Team Member
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Real-time Collaboration</p>
                    <p className="text-sm text-gray-500">Allow team members to edit simultaneously</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.collaboration?.realTime || false}
                      onChange={(e) => updateSetting('collaboration', 'realTime', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F28C00]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C00]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment Permissions</label>
                  <select
                    value={settings.collaboration?.comments || 'all'}
                    onChange={(e) => updateSetting('collaboration', 'comments', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                  >
                    <option value="all">All team members can comment</option>
                    <option value="editors">Only editors can comment</option>
                    <option value="admins">Only admins can comment</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Project</label>
                  <select
                    value={settings.projects?.current || 'beneath-silence'}
                    onChange={(e) => updateSetting('projects', 'current', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                  >
                    <option value="beneath-silence">Beneath the Silence</option>
                    <option value="african-folktale">African Folktale Adaptation</option>
                    <option value="urban-drama">Urban Drama Series</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Auto-save Versions</p>
                    <p className="text-sm text-gray-500">Automatically save version history</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.projects?.autoSave || true}
                      onChange={(e) => updateSetting('projects', 'autoSave', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F28C00]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C00]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                  <select
                    value={settings.projects?.exportFormat || 'pdf'}
                    onChange={(e) => updateSetting('projects', 'exportFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="docx">Word Document</option>
                    <option value="txt">Plain Text</option>
                    <option value="json">JSON Data</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    value={settings.projects?.backup || 'daily'}
                    onChange={(e) => updateSetting('projects', 'backup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C00] focus:border-transparent"
                  >
                    <option value="public">Public - Anyone can see my profile</option>
                    <option value="private">Private - Only I can see my profile</option>
                    <option value="friends">Friends - Only approved connections</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Data Sharing</p>
                    <p className="text-sm text-gray-500">Share anonymized usage data to improve our service</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => updateSetting('privacy', 'dataSharing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F28C00]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C00]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Analytics</p>
                    <p className="text-sm text-gray-500">Help us improve by collecting usage analytics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.analytics}
                      onChange={(e) => updateSetting('privacy', 'analytics', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#F28C00]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F28C00]"></div>
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Key size={20} className="text-gray-400" />
                        <span className="font-medium text-gray-900">Change Password</span>
                      </div>
                      <ArrowLeft size={16} className="text-gray-400 rotate-180" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50">
                      <div className="flex items-center gap-3">
                        <Shield size={20} className="text-red-400" />
                        <span className="font-medium text-red-900">Delete Account</span>
                      </div>
                      <ArrowLeft size={16} className="text-red-400 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}