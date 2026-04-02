# StoryAI Technical Architecture

## 📋 Table of Contents

- [🏗️ System Architecture](#️-system-architecture)
- [🔧 Technology Stack](#-technology-stack)
- [📊 Data Flow & State Management](#-data-flow--state-management)
- [🛣️ Routing Architecture](#️-routing-architecture)
- [🎨 Styling Architecture](#-styling-architecture)
- [🔧 Component Architecture](#-component-architecture)
- [📱 Responsive Design Implementation](#-responsive-design-implementation)
- [🚀 Build & Deployment](#-build--deployment)
- [🧪 Testing Strategy](#-testing-strategy)
- [🔒 Security Considerations](#-security-considerations)

## 🏗️ System Architecture

### Application Structure
```
StoryAI/
├── public/                    # Static assets
│   ├── favicon.ico           # App favicon
│   └── assets/               # Static images, fonts
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.jsx     # Main dashboard container
│   │   ├── Sidebar.jsx       # Navigation component
│   │   ├── SettingsPanel.jsx # Settings interface
│   │   ├── AssetsLibraryPanel.jsx # Asset management
│   │   ├── CharactersPanel.jsx    # Character database
│   │   ├── ProjectsPanel.jsx      # Project management
│   │   ├── StoryboardsPanel.jsx   # Storyboard timeline
│   │   ├── ShotListPanel.jsx      # Shot planning
│   │   └── ExportsPanel.jsx       # Export functionality
│   ├── App.jsx               # Root component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── package.json              # Dependencies and scripts
├── vite.config.js            # Build configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── eslint.config.js          # Code quality rules
└── README.md                 # Documentation
```

### Architecture Principles
- **Component-Based**: Modular, reusable React components
- **Single Responsibility**: Each component has a single, well-defined purpose
- **Separation of Concerns**: UI logic separated from business logic
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Accessibility**: WCAG 2.1 AA compliance standards

## 🔧 Technology Stack

### Frontend Framework
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.13.2"
}
```

### Build Tools & Development
```json
{
  "vite": "^6.4.1",
  "eslint": "^9.17.0",
  "postcss": "^8.5.1",
  "autoprefixer": "^10.4.20"
}
```

### Styling & UI
```json
{
  "tailwindcss": "^4.0.0",
  "lucide-react": "^0.468.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^19.0.1",
  "@types/react-dom": "^19.0.2",
  "@vitejs/plugin-react": "^4.3.4"
}
```

## 📊 Data Flow & State Management

### State Management Strategy

#### 1. Local Component State
Each component manages its own local state using React hooks:

```jsx
// Component-level state management
const [activeTab, setActiveTab] = useState('dashboard');
const [searchTerm, setSearchTerm] = useState('');
const [selectedItems, setSelectedItems] = useState([]);
```

#### 2. Props-Based Communication
Parent-child communication through props:

```jsx
// Parent component
<Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

// Child component
function Sidebar({ activeTab, onTabChange }) {
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };
  // ...
}
```

#### 3. State Lifting
Shared state lifted to common parent:

```jsx
// Dashboard component (parent)
const [activeTab, setActiveTab] = useState('dashboard');

// Passed down to children
<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
<MainContent activeTab={activeTab} />
```

### Data Flow Patterns

#### Unidirectional Data Flow
```
User Action → Event Handler → State Update → Re-render → UI Update
```

#### Component Communication
```
Parent Component
├── State: activeTab
├── Child A: Sidebar (receives activeTab, calls setActiveTab)
└── Child B: MainContent (receives activeTab, renders accordingly)
```

### Mock Data Structure

#### User Data
```javascript
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/api/placeholder/40/40",
  role: "Creator",
  joinDate: "2024-01-15"
};
```

#### Assets Data
```javascript
const mockAssets = [
  {
    id: 1,
    name: "hero-background.jpg",
    type: "image",
    size: "2.4 MB",
    uploadDate: "2024-01-20",
    project: "Beneath the Silence",
    tags: ["background", "hero"],
    favorite: true
  }
];
```

#### Characters Data
```javascript
const mockCharacters = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "hero",
    type: "protagonist",
    project: "Beneath the Silence",
    description: "A determined journalist investigating corruption",
    traits: ["brave", "intelligent", "persistent"],
    appearances: 12,
    avatar: "/api/placeholder/100/100"
  }
];
```

## 🛣️ Routing Architecture

### React Router Implementation

#### Route Configuration
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Route Structure
- **`/`**: Public landing page with marketing content
- **`/login`**: Authentication page for existing users
- **`/signup`**: Registration page for new users
- **`/dashboard`**: Protected dashboard interface (requires authentication)

### Navigation Flow

#### Public Routes
```
Landing Page → Auth Pages → Dashboard
```

#### Dashboard Navigation
```
Dashboard → Panel Selection → Panel Content
```

### Future Routing Enhancements
- **Protected Routes**: Authentication guards
- **Nested Routes**: Panel-specific sub-routes
- **Dynamic Routes**: Project-specific URLs
- **Route Guards**: Permission-based access control

## 🎨 Styling Architecture

### Tailwind CSS Configuration

#### Custom Color Palette
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'nuru-navy': '#0A233A',
        'nuru-orange': '#F28C00',
        'nuru-red': '#7B1823',
        'nuru-gray': '#F4F5F7'
      }
    }
  }
}
```

#### Utility Classes Usage
```jsx
// Component styling with Tailwind
<div className="bg-nuru-navy text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
  <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
  <p className="text-gray-300">Welcome to StoryAI</p>
</div>
```

### Design System

#### Spacing Scale
```css
/* Consistent spacing using Tailwind's scale */
.space-y-4  /* 1rem (16px) */
.space-y-6  /* 1.5rem (24px) */
.space-y-8  /* 2rem (32px) */
```

#### Typography Scale
```css
/* Font sizes and weights */
.text-sm    /* 0.875rem */
.text-base  /* 1rem */
.text-lg    /* 1.125rem */
.text-xl    /* 1.25rem */
.text-2xl   /* 1.5rem */
```

#### Component Variants
```jsx
// Button variants using conditional classes
const buttonVariants = {
  primary: "bg-nuru-orange text-white hover:bg-orange-600",
  secondary: "bg-nuru-navy text-white hover:bg-blue-800",
  outline: "border-2 border-nuru-navy text-nuru-navy hover:bg-nuru-navy hover:text-white"
};
```

### Responsive Design

#### Breakpoint System
```css
/* Mobile-first responsive design */
.sm: 640px   /* Small devices */
.md: 768px   /* Medium devices */
.lg: 1024px  /* Large devices */
.xl: 1280px  /* Extra large devices */
```

#### Responsive Layouts
```jsx
// Responsive grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

## 🔧 Component Architecture

### Component Patterns

#### 1. Functional Components with Hooks
```jsx
function DashboardPanel({ activeTab, onTabChange }) {
  const [localState, setLocalState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className="panel-container">
      {/* JSX content */}
    </div>
  );
}
```

#### 2. Props Interface
```jsx
function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  // Component logic
}
```

#### 3. Event Handlers
```jsx
const handleTabChange = (tabId) => {
  setActiveTab(tabId);
};

const handleLogout = () => {
  // Logout logic
  navigate('/');
};
```

### Component Composition

#### Container/Presentational Pattern
```jsx
// Container component (logic)
function AssetsLibraryPanel() {
  const [assets, setAssets] = useState(mockAssets);
  const [filters, setFilters] = useState({});

  return (
    <AssetsContainer>
      <AssetsFilters filters={filters} onFilterChange={setFilters} />
      <AssetsGrid assets={assets} filters={filters} />
    </AssetsContainer>
  );
}

// Presentational component (UI)
function AssetsGrid({ assets, filters }) {
  const filteredAssets = applyFilters(assets, filters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {filteredAssets.map(asset => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
```

### Custom Hooks (Future Enhancement)
```jsx
// Custom hook for API calls
function useAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assets');
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  return { assets, loading, fetchAssets };
}
```

## 📱 Responsive Design Implementation

### Mobile-First Approach

#### CSS Grid & Flexbox
```jsx
// Responsive layout with CSS Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid items */}
</div>

// Flexible sidebar layout
<div className="flex flex-col lg:flex-row">
  <Sidebar className="w-full lg:w-64" />
  <MainContent className="flex-1" />
</div>
```

#### Responsive Navigation
```jsx
function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-8">
        <NavLinks />
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <MenuIcon />
      </button>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
          <NavLinks mobile />
        </div>
      )}
    </nav>
  );
}
```

### Touch-Friendly Interactions

#### Touch Targets
```css
/* Minimum touch target size: 44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

#### Swipe Gestures (Future Enhancement)
```jsx
// Swipe gesture handling for mobile panels
function useSwipeGesture(onSwipeLeft, onSwipeRight) {
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  };

  return { handleTouchStart, handleTouchEnd };
}
```

## 🚀 Build & Deployment

### Vite Build Configuration

#### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
})
```

### Build Process

#### Development
```bash
npm run dev      # Start development server with HMR
```

#### Production Build
```bash
npm run build    # Create optimized production build
npm run preview  # Preview production build locally
```

### Build Optimization

#### Code Splitting
- **Route-based splitting**: Each route loads independently
- **Vendor chunks**: Third-party libraries in separate chunks
- **Dynamic imports**: Components loaded on demand

#### Asset Optimization
- **Image optimization**: WebP format with fallbacks
- **Font loading**: Self-hosted fonts with preloading
- **CSS optimization**: Unused styles removed
- **JavaScript minification**: Terser for smaller bundles

### Deployment Strategy

#### Static Hosting
```javascript
// Netlify, Vercel, or similar static hosting
// Build output in 'dist' directory
// SPA routing handled by _redirects file
```

#### Environment Variables
```javascript
// .env files for different environments
VITE_API_URL=https://api.storyai.com
VITE_APP_ENV=production
```

## 🧪 Testing Strategy

### Testing Framework (Future Implementation)

#### Unit Tests
```javascript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

test('renders navigation items', () => {
  render(<Sidebar activeTab="dashboard" setActiveTab={() => {}} />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});

test('calls setActiveTab when navigation item is clicked', () => {
  const mockSetActiveTab = jest.fn();
  render(<Sidebar activeTab="dashboard" setActiveTab={mockSetActiveTab} />);

  fireEvent.click(screen.getByText('Settings'));
  expect(mockSetActiveTab).toHaveBeenCalledWith('settings');
});
```

#### Integration Tests
```javascript
// Dashboard integration test
test('dashboard navigation works end-to-end', () => {
  render(<App />);

  // Navigate to dashboard
  fireEvent.click(screen.getByText('Login'));
  // ... authentication flow

  // Test panel switching
  fireEvent.click(screen.getByText('Settings'));
  expect(screen.getByText('Profile Settings')).toBeInTheDocument();
});
```

#### E2E Tests
```javascript
// Playwright/Cypress E2E test
test('complete user journey', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Start Creating Free');
  await page.fill('[placeholder="Email Address"]', 'test@example.com');
  await page.fill('[placeholder="Password"]', 'password123');
  await page.click('text=Sign Up');
  await page.waitForURL('/dashboard');
  expect(page.url()).toContain('/dashboard');
});
```

### Testing Tools
```json
{
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.5",
  "@testing-library/user-event": "^14.4.3",
  "jest": "^29.5.0",
  "playwright": "^1.32.3"
}
```

## 🔒 Security Considerations

### Frontend Security

#### Content Security Policy (Future)
```javascript
// CSP headers for production
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
```

#### Input Validation
```jsx
// Client-side input validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password);
}
```

#### XSS Prevention
- **Sanitized inputs**: All user inputs sanitized
- **CSP headers**: Content Security Policy implementation
- **Safe rendering**: React's automatic XSS prevention

### Authentication Security

#### Token Management (Future)
```jsx
// JWT token handling
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      setToken(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### Secure Storage
- **HttpOnly cookies**: For sensitive tokens
- **LocalStorage**: For non-sensitive UI state
- **SessionStorage**: For temporary session data

### API Security

#### Request Headers
```javascript
// Secure API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  return fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
      ...options.headers
    }
  });
};
```

#### CORS Configuration
```javascript
// CORS setup for API communication
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://storyai.com' : 'http://localhost:5176',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

---

This technical architecture document provides a comprehensive overview of the StoryAI application's technical implementation, from high-level system design to low-level implementation details. The architecture is designed to be scalable, maintainable, and secure while providing an excellent user experience for independent creators.