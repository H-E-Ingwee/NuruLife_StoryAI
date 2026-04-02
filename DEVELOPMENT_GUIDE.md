# StoryAI Development Guide

## 📋 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [🏗️ Project Structure](#️-project-structure)
- [🔧 Development Workflow](#-development-workflow)
- [🎨 Code Style & Standards](#-code-style--standards)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🔧 Troubleshooting](#-troubleshooting)
- [📚 Resources](#-resources)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher (comes with Node.js)
- **Git**: Version control system
- **VS Code**: Recommended editor with React extensions

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/H-E-Ingwee/NuruLife_StoryAI.git
   cd NuruLife_StoryAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5176` to see the application running.

### Available Scripts

```json
{
  "scripts": {
    "dev": "vite",                    // Start development server
    "build": "vite build",           // Build for production
    "lint": "eslint . --ext js,jsx", // Run ESLint
    "preview": "vite preview"        // Preview production build
  }
}
```

## 🏗️ Project Structure

### Directory Layout

```
StoryAI/
├── public/                    # Static assets
│   ├── favicon.ico           # App favicon
│   └── assets/               # Static images and fonts
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.jsx     # Main dashboard container
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── SettingsPanel.jsx # User settings interface
│   │   ├── AssetsLibraryPanel.jsx # Asset management
│   │   ├── CharactersPanel.jsx    # Character database
│   │   ├── ProjectsPanel.jsx      # Project management
│   │   ├── StoryboardsPanel.jsx   # Storyboard timeline
│   │   ├── ShotListPanel.jsx      # Shot planning
│   │   └── ExportsPanel.jsx       # Export functionality
│   ├── App.jsx               # Root component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles and Tailwind
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite build configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # Project documentation
```

### Component Organization

#### Component Categories

**Page Components**
- `App.jsx`: Root component with routing
- `Dashboard.jsx`: Main dashboard layout

**Panel Components**
- `SettingsPanel.jsx`: User preferences and configuration
- `AssetsLibraryPanel.jsx`: Media asset management
- `CharactersPanel.jsx`: Character database interface
- `ProjectsPanel.jsx`: Project management
- `StoryboardsPanel.jsx`: Storyboard timeline view
- `ShotListPanel.jsx`: Shot planning interface
- `ExportsPanel.jsx`: Export functionality

**UI Components**
- `Sidebar.jsx`: Navigation component
- Form components (inputs, buttons, etc.)
- Modal and overlay components

### File Naming Conventions

- **Components**: PascalCase (e.g., `Dashboard.jsx`, `SettingsPanel.jsx`)
- **Utilities**: camelCase (e.g., `apiHelpers.js`, `validationUtils.js`)
- **Styles**: kebab-case (e.g., `global-styles.css`, `component-styles.css`)
- **Tests**: Component name + `.test.js` (e.g., `Dashboard.test.js`)

## 🔧 Development Workflow

### Branching Strategy

```bash
# Create a feature branch
git checkout -b feature/new-component

# Make your changes
# ... development work ...

# Commit your changes
git add .
git commit -m "Add new component with improved functionality"

# Push to remote
git push origin feature/new-component

# Create a pull request
# ... GitHub PR process ...
```

### Commit Message Convention

```bash
# Format: type(scope): description
git commit -m "feat: add character search functionality"
git commit -m "fix: resolve sidebar navigation bug"
git commit -m "docs: update component documentation"
git commit -m "style: format code with Prettier"
git commit -m "refactor: simplify dashboard state management"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

### Code Review Process

1. **Create Pull Request**: Push your branch and create a PR
2. **Self-Review**: Check your code before requesting review
3. **Peer Review**: Get feedback from team members
4. **Address Feedback**: Make requested changes
5. **Merge**: Squash and merge approved PRs

## 🎨 Code Style & Standards

### ESLint Configuration

The project uses ESLint with React-specific rules:

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'warn',
      'no-unused-vars': 'error',
      'prefer-const': 'error'
    }
  }
];
```

### Code Formatting

#### Manual Formatting
Run ESLint to check and fix formatting issues:

```bash
npm run lint
```

#### Pre-commit Hooks (Recommended)
```bash
# Install husky for git hooks
npm install --save-dev husky

# Set up pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
```

### React Best Practices

#### Component Structure
```jsx
// Good: Functional component with hooks
function UserProfile({ user, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      {isEditing ? (
        <EditForm user={user} onSave={handleSave} />
      ) : (
        <ProfileView user={user} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
```

#### Props Validation
```jsx
// Good: Destructure props with defaults
function Button({ children, variant = 'primary', size = 'medium', onClick }) {
  // Component logic
}
```

#### State Management
```jsx
// Good: Use functional updates for state based on previous state
const [count, setCount] = useState(0);

const increment = () => {
  setCount(prevCount => prevCount + 1);
};
```

### CSS and Styling

#### Tailwind CSS Classes
```jsx
// Good: Semantic class names with Tailwind
<div className="bg-nuru-navy text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
  <h2 className="text-xl font-bold mb-4">Dashboard</h2>
  <p className="text-gray-300">Welcome back!</p>
</div>
```

#### Responsive Design
```jsx
// Good: Mobile-first responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid items */}
</div>
```

## 🧪 Testing

### Testing Framework Setup (Future Implementation)

#### Unit Testing with Jest and React Testing Library

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

#### Component Testing Example
```jsx
// Sidebar.test.js
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

#### Mock Data for Testing
```javascript
// __mocks__/mockData.js
export const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/avatar.jpg'
};

export const mockAssets = [
  {
    id: 1,
    name: 'background.jpg',
    type: 'image',
    size: '2.4 MB'
  }
];
```

### End-to-End Testing (Future Implementation)

#### Playwright Setup
```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install
```

#### E2E Test Example
```javascript
// e2e/dashboard.spec.js
import { test, expect } from '@playwright/test';

test('dashboard navigation works', async ({ page }) => {
  await page.goto('/dashboard');

  // Check sidebar navigation
  await expect(page.locator('text=Dashboard')).toBeVisible();

  // Test panel switching
  await page.click('text=Settings');
  await expect(page.locator('text=Profile Settings')).toBeVisible();
});
```

### Testing Best Practices

#### Test Organization
```
src/
├── components/
│   ├── Component.jsx
│   └── Component.test.js
└── __tests__/
    ├── integration/
    └── e2e/
```

#### Test Coverage Goals
- **Unit Tests**: 80%+ coverage for component logic
- **Integration Tests**: Key user workflows
- **E2E Tests**: Critical user journeys

## 🚀 Deployment

### Build Process

#### Production Build
```bash
# Create optimized production build
npm run build

# Preview the build locally
npm run preview
```

#### Build Output
```
dist/
├── index.html          # Main HTML file
├── assets/            # Optimized CSS and JS bundles
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── vendor-[hash].js
└── favicon.ico        # App icon
```

### Deployment Options

#### Static Hosting (Recommended)
- **Vercel**: Automatic deployments from GitHub
- **Netlify**: Drag-and-drop deployment with CDN
- **GitHub Pages**: Free hosting for open source projects

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --dir=dist --prod
```

### Environment Configuration

#### Environment Variables
```javascript
// .env.local (development)
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development

// .env.production (production)
VITE_API_URL=https://api.storyai.com
VITE_APP_ENV=production
```

#### Build-time Configuration
```javascript
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  }
});
```

## 🔧 Troubleshooting

### Common Issues

#### Build Errors

**Issue**: `Module not found` error
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Tailwind CSS not compiling
```bash
# Solution: Check tailwind.config.js and ensure content paths are correct
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // ... rest of config
}
```

#### Development Server Issues

**Issue**: Port 5176 already in use
```bash
# Solution: Use a different port
npm run dev -- --port 3000
```

**Issue**: Hot reload not working
```bash
# Solution: Check file is saved and not ignored by .gitignore
# Clear Vite cache
rm -rf node_modules/.vite
```

#### Component Issues

**Issue**: Component not re-rendering
```jsx
// Solution: Use functional state updates
setState(prevState => ({ ...prevState, newValue }));
```

**Issue**: Props not updating
```jsx
// Solution: Add key prop to force re-mount
<Component key={uniqueKey} {...props} />
```

### Performance Issues

#### Bundle Size Optimization
```bash
# Analyze bundle size
npm install --save-dev rollup-plugin-visualizer
```

#### Code Splitting
```jsx
// Lazy load components
const SettingsPanel = lazy(() => import('./SettingsPanel'));

// In render
<Suspense fallback={<LoadingSpinner />}>
  <SettingsPanel />
</Suspense>
```

### Debugging Tips

#### React DevTools
```bash
# Install React DevTools browser extension
# Use Components and Profiler tabs for debugging
```

#### Console Logging
```jsx
// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

#### Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 📚 Resources

### Documentation

- [React Documentation](https://reactjs.org/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/docs)

### Learning Resources

- [React Patterns](https://reactpatterns.com/)
- [JavaScript Info](https://javascript.info/)
- [Web.dev](https://web.dev/)

### Tools and Extensions

#### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

#### Browser Extensions
- React Developer Tools
- Redux DevTools (future)
- Lighthouse (performance auditing)

### Community

- [React Discord](https://discord.gg/reactiflux)
- [Tailwind CSS Discord](https://tailwindcss.com/discord)
- [Dev.to React Community](https://dev.to/t/react)

### Contributing Guidelines

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write tests** (when applicable)
5. **Run linting**: `npm run lint`
6. **Test your changes**: `npm run dev`
7. **Commit with conventional format**
8. **Create a pull request**
9. **Wait for review and approval**

---

This development guide provides comprehensive information for developers working on the StoryAI project. Follow these guidelines to maintain code quality, ensure consistent development practices, and contribute effectively to the project.