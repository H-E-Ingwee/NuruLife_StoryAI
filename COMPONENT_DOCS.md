# StoryAI Component Documentation

## 📋 Table of Contents

- [🏗️ Component Architecture](#️-component-architecture)
- [🏠 Landing Page Components](#-landing-page-components)
- [🔐 Authentication Components](#-authentication-components)
- [📊 Dashboard Components](#-dashboard-components)
- [🧭 Navigation Components](#-navigation-components)
- [📁 Panel Components](#-panel-components)
- [🔧 Utility Components](#-utility-components)
- [🎨 Design System Components](#-design-system-components)

## 🏗️ Component Architecture

### Component Hierarchy
```
App.jsx (Root)
├── LandingPage (/)
│   ├── Navigation
│   ├── HeroSection
│   ├── FeaturesSection
│   ├── PricingSection
│   ├── MissionSection
│   └── Footer
├── AuthPage (/login, /signup)
│   ├── AuthContainer
│   ├── AuthForm
│   ├── SocialAuth
│   └── AuthLinks
└── Dashboard (/dashboard)
    ├── Sidebar
    └── MainContent
        ├── DashboardOverview
        ├── SettingsPanel
        ├── AssetsLibraryPanel
        ├── CharactersPanel
        ├── ProjectsPanel
        ├── StoryboardsPanel
        ├── ShotListPanel
        └── ExportsPanel
```

### Component Patterns
- **Functional Components**: Modern React with hooks
- **Props Interface**: Well-defined component APIs
- **State Management**: Local state with useState
- **Event Handling**: Synthetic events and callbacks
- **Styling**: Tailwind CSS utility classes

## 🏠 Landing Page Components

### Navigation Component
```jsx
function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Logo />
        <DesktopMenu />
        <MobileMenuToggle isOpen={isMenuOpen} onToggle={setIsMenuOpen} />
        <AuthButtons />
        {isMenuOpen && <MobileMenu />}
      </div>
    </nav>
  );
}
```

**Features:**
- Transparent to solid background transition on scroll
- Mobile hamburger menu
- Smooth scroll navigation to page sections
- Authentication flow integration

### HeroSection Component
```jsx
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <BackgroundImage />
      <div className="text-center z-10">
        <Badge />
        <Headline />
        <Subheadline />
        <CallToActionButtons />
      </div>
    </section>
  );
}
```

**Features:**
- Full-screen cinematic background
- Gradient overlay for text readability
- Animated elements on scroll
- Dual CTA buttons with distinct actions

### FeaturesSection Component
```jsx
function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader />
        <FeatureGrid />
        <StatCards />
      </div>
    </section>
  );
}
```

**Features:**
- Grid layout for feature cards
- Hover animations and transitions
- Statistical highlights
- Icon-based visual hierarchy

### PricingSection Component
```jsx
function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-[#F4F5F7]">
      <div className="max-w-7xl mx-auto px-6">
        <PricingHeader />
        <PricingGrid />
      </div>
    </section>
  );
}
```

**Features:**
- Three-tier pricing structure
- Popular plan highlighting
- Feature comparison lists
- Call-to-action buttons

## 🔐 Authentication Components

### AuthPage Component
```jsx
function AuthPage({ mode }) {
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A233A] to-[#F28C00]">
      <AuthContainer>
        <AuthForm mode={mode} />
        <SocialAuth />
        <AuthLinks />
      </AuthContainer>
    </div>
  );
}
```

**Features:**
- Unified design for login/signup
- Form validation and error handling
- Social authentication options
- Responsive card layout

### AuthForm Component
```jsx
function AuthForm({ mode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === 'signup' && (
        <InputField
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(value) => setFormData({...formData, name: value})}
        />
      )}
      <InputField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({...formData, email: value})}
      />
      <InputField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(value) => setFormData({...formData, password: value})}
      />
      <SubmitButton mode={mode} />
    </form>
  );
}
```

**Features:**
- Dynamic form fields based on mode
- Real-time validation feedback
- Secure password handling
- Loading states during submission

## 📊 Dashboard Components

### Dashboard Component (Main Container)
```jsx
function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(mockUser);

  const handleLogout = () => {
    // Logout logic
    navigate('/');
  };

  return (
    <div className="h-screen flex bg-[#F4F5F7]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />
      <MainContent activeTab={activeTab} />
    </div>
  );
}
```

**Features:**
- State management for active panel
- User session handling
- Responsive layout structure
- Panel routing logic

### MainContent Component
```jsx
function MainContent({ activeTab }) {
  return (
    <div className="flex-1 overflow-hidden">
      {activeTab === 'dashboard' && <DashboardOverview />}
      {activeTab === 'settings' && <SettingsPanel />}
      {activeTab === 'assets' && <AssetsLibraryPanel />}
      {activeTab === 'characters' && <CharactersPanel />}
      {activeTab === 'projects' && <ProjectsPanel />}
      {activeTab === 'storyboards' && <StoryboardsPanel />}
      {activeTab === 'shot-list' && <ShotListPanel />}
      {activeTab === 'exports' && <ExportsPanel />}
    </div>
  );
}
```

**Features:**
- Conditional rendering based on activeTab
- Panel-specific content areas
- Consistent layout structure

## 🧭 Navigation Components

### Sidebar Component
```jsx
function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'storyboards', label: 'Storyboards', icon: Video },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'assets', label: 'Assets Library', icon: Layers },
    { id: 'shot-list', label: 'Shot List', icon: Video },
    { id: 'exports', label: 'Exports', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col shadow-2xl z-20 bg-[#0A233A]">
      <LogoSection />
      <NavigationMenu
        items={navigationItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <UserSection user={user} onLogout={onLogout} />
    </aside>
  );
}
```

**Features:**
- Fixed width navigation
- Active state highlighting
- User profile section
- Logout functionality

### NavigationMenu Component
```jsx
function NavigationMenu({ items, activeTab, onTabChange }) {
  return (
    <nav className="flex-1 px-4 py-6">
      <ul className="space-y-2">
        {items.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </ul>
    </nav>
  );
}
```

**Features:**
- Icon and text navigation items
- Active state styling
- Click handlers for panel switching

### NavItem Component
```jsx
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? 'bg-white/10 text-white'
            : 'text-gray-300 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon className={`w-5 h-5 mr-3 ${active ? 'text-[#F28C00]' : ''}`} />
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
}
```

**Features:**
- Icon and label display
- Active/inactive state styling
- Hover effects and transitions

## 📁 Panel Components

### DashboardOverview Component
```jsx
function DashboardOverview() {
  return (
    <div className="flex-1 p-8 bg-[#F4F5F7]">
      <div className="max-w-7xl mx-auto">
        <WelcomeHeader />
        <FeatureCards />
        <QuickActions />
      </div>
    </div>
  );
}
```

**Features:**
- Welcome message and branding
- Feature highlight cards
- Quick action buttons for common tasks

### SettingsPanel Component
```jsx
function SettingsPanel() {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState(mockSettings);

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'ai', label: 'AI Settings', icon: Cpu },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      <SettingsHeader onBack={() => setActiveTab('dashboard')} />
      <div className="flex-1 flex">
        <SettingsSidebar
          sections={sections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SettingsContent
          activeSection={activeSection}
          settings={settings}
          onSettingsChange={setSettings}
        />
      </div>
    </div>
  );
}
```

**Features:**
- Tabbed interface for different settings categories
- Sidebar navigation between sections
- Form-based settings management
- Save functionality (UI-only currently)

### AssetsLibraryPanel Component
```jsx
function AssetsLibraryPanel() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [assets, setAssets] = useState(mockAssets);

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      <AssetsHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedAssets.length}
        onBulkAction={handleBulkAction}
      />
      <FiltersAndSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={handleFilterChange}
      />
      <AssetsContent
        viewMode={viewMode}
        assets={filteredAssets}
        selectedAssets={selectedAssets}
        onAssetSelect={handleAssetSelect}
        onAssetAction={handleAssetAction}
      />
    </div>
  );
}
```

**Features:**
- Grid and list view modes
- Advanced filtering and search
- Bulk selection and operations
- Drag & drop upload functionality
- Asset metadata display

### CharactersPanel Component
```jsx
function CharactersPanel() {
  const [characters, setCharacters] = useState(mockCharacters);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || character.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="h-screen flex flex-col bg-[#F4F5F7]">
      <CharactersHeader />
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />
      <CharactersGrid
        characters={filteredCharacters}
        onCharacterEdit={handleCharacterEdit}
        onCharacterDelete={handleCharacterDelete}
      />
    </div>
  );
}
```

**Features:**
- Character card grid display
- Search and filter functionality
- Role-based categorization
- Character management actions

## 🔧 Utility Components

### InputField Component
```jsx
function InputField({ label, type, value, onChange, placeholder, required, error }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#F28C00] transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
```

**Features:**
- Consistent input styling
- Error state handling
- Accessibility labels
- Focus states with brand colors

### Button Component
```jsx
function Button({ children, onClick, variant = 'primary', size = 'medium', disabled, loading }) {
  const baseClasses = "font-bold uppercase tracking-wide rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-[#F28C00] text-white hover:bg-[#E67E00] focus:ring-[#F28C00]",
    secondary: "bg-[#0A233A] text-white hover:bg-[#0B2A42] focus:ring-[#0A233A]",
    outline: "border-2 border-[#0A233A] text-[#0A233A] hover:bg-[#0A233A] hover:text-white focus:ring-[#0A233A]"
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
}
```

**Features:**
- Multiple variants and sizes
- Loading states
- Disabled state handling
- Focus accessibility

## 🎨 Design System Components

### Card Component
```jsx
function Card({ children, className = '', hover = true, padding = 'medium' }) {
  const paddings = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${paddings[padding]} ${
      hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-200' : ''
    } ${className}`}>
      {children}
    </div>
  );
}
```

**Features:**
- Consistent card styling
- Optional hover effects
- Flexible padding options
- Shadow and border radius

### Badge Component
```jsx
function Badge({ children, variant = 'default', size = 'medium' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-[#F28C00] text-white',
    secondary: 'bg-[#0A233A] text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
```

**Features:**
- Multiple color variants
- Size options
- Consistent typography
- Rounded pill design

### Modal Component
```jsx
function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <ModalHeader title={title} onClose={onClose} />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```

**Features:**
- Overlay backdrop
- Click outside to close
- Scrollable content
- Size variants
- Header with close button

---

This component documentation provides a comprehensive breakdown of the StoryAI application's component architecture, from high-level containers to low-level utility components. Each component includes its structure, features, and implementation details to facilitate understanding and maintenance of the codebase.