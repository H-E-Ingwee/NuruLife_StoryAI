# StoryAI Frontend Documentation

## 📋 Table of Contents

- [🏗️ Application Architecture](#️-application-architecture)
- [🛣️ User Journey Flow](#️-user-journey-flow)
- [🏠 Landing Page](#-landing-page)
- [🔐 Authentication Pages](#-authentication-pages)
- [📊 Dashboard Overview](#-dashboard-overview)
- [🧭 Navigation System](#-navigation-system)
- [📁 Panel Components](#-panel-components)
- [🎨 UI/UX Design System](#-uiux-design-system)
- [🔧 Technical Implementation](#-technical-implementation)
- [📱 Responsive Design](#-responsive-design)

## 🏗️ Application Architecture

### Core Technologies
- **React 19.1.0**: Modern React with functional components and hooks
- **Vite 6.4.1**: Fast build tool and development server
- **React Router 7.13.2**: Client-side routing for SPA navigation
- **Tailwind CSS 4.0**: Utility-first CSS framework with custom NuruLife branding
- **Lucide React**: Modern icon library for consistent UI elements

### Project Structure
```
src/
├── App.jsx                 # Main application with routing
├── main.jsx               # React application entry point
├── index.css              # Global styles and Tailwind configuration
├── components/
│   ├── Dashboard.jsx      # Main dashboard container and routing
│   ├── Sidebar.jsx        # Navigation sidebar component
│   ├── SettingsPanel.jsx  # User settings and preferences
│   ├── AssetsLibraryPanel.jsx # Media asset management
│   ├── CharactersPanel.jsx    # Character database
│   ├── ProjectsPanel.jsx      # Project management
│   ├── StoryboardsPanel.jsx   # Storyboard timeline view
│   ├── ShotListPanel.jsx      # Shot planning and management
│   └── ExportsPanel.jsx       # Export functionality
```

### State Management
- **Local Component State**: useState hooks for individual component state
- **Props-based Communication**: Parent-child component communication
- **URL-based Navigation**: React Router for page-level state management

## 🛣️ User Journey Flow

### 1. Landing Page Discovery
```
User visits website → Hero section → Feature overview → Pricing → Sign up/Login
```

### 2. Authentication Flow
```
Sign up/Login → Email verification → Dashboard access
```

### 3. Dashboard Exploration
```
Dashboard overview → Panel navigation → Feature discovery → Project creation
```

### 4. Content Creation Workflow
```
Script upload → Character extraction → Scene breakdown → Asset management → Export
```

## 🏠 Landing Page

### Hero Section
- **Background**: Full-screen cinematic image with gradient overlay
- **Headline**: "Transform scripts into professional storyboards"
- **CTA Buttons**: "Start Creating Free" and "View Project Demo"
- **Tagline**: AI-powered storyboarding badge

### Navigation Bar
- **Logo**: Clickable StoryAI logo with NuruLife branding
- **Menu Items**: Features, How It Works, Pricing, For Creators
- **Auth Buttons**: Login and Sign Up
- **Mobile Menu**: Hamburger menu for mobile devices

### Features Section
- **Empowering African Creators**: Mission statement and core benefits
- **Stat Cards**:
  - Save Time & Money
  - Communicate Clearly
  - Maintain Consistency
  - Easy Account Management

### Pricing Section
- **Three Tiers**: Free, Creator ($19/mo), Studio ($49/mo)
- **Features**: Project limits, AI prompts, export formats
- **Popular Badge**: Creator plan highlighted

### Mission Section
- **Brand Colors**: NuruLife navy and orange
- **Call-to-Action**: "Begin Your Creative Workflow"

### Footer
- **Copyright**: 2026 StoryAI by NuruLife Productions
- **Tagline**: "Built around the NuruLife promise"

## 🔐 Authentication Pages

### Login Page (`/login`)
- **Layout**: Centered card design with background gradients
- **Fields**: Email and Password
- **Buttons**: Sign In, Google OAuth, Forgot Password
- **Links**: Sign up link

### Sign Up Page (`/signup`)
- **Additional Fields**: Full Name
- **Validation**: Email format, password strength
- **Terms**: Account creation agreement

### Shared Features
- **Logo Display**: StoryAI branding
- **Background**: Subtle gradient animations
- **Responsive**: Mobile-optimized layout
- **Navigation**: Links between login/signup

## 📊 Dashboard Overview

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│ Header Bar (Future: Project info, export, share) │
├─────────────────┬───────────────────────────────┤
│                 │                               │
│   Sidebar       │     Main Content Area          │
│   Navigation    │     (Dynamic Panel Content)    │
│                 │                               │
│   ┌─────────┐   │                               │
│   │ + New   │   │                               │
│   │ Project │   │                               │
│   ├─────────┤   │                               │
│   │ Dashboard│  │                               │
│   │ Projects │  │                               │
│   │ Storyboards│ │                               │
│   │ Characters│  │                               │
│   │ Assets   │  │                               │
│   │ Shot List│  │                               │
│   │ Exports  │  │                               │
│   │ Settings │  │                               │
│   └─────────┘   │                               │
│                 │                               │
│   User Info     │                               │
│   & Logout      │                               │
└─────────────────┴───────────────────────────────┘
```

### Dashboard Home View
When `activeTab === 'dashboard'`, displays:
- **Welcome Header**: "Welcome to StoryAI"
- **Feature Cards**: Script Processing, Character Database, Assets Library
- **Quick Actions Grid**: New Project, Storyboards, Shot List, Export

## 🧭 Navigation System

### Sidebar Component
- **Width**: 256px (w-64) fixed width
- **Background**: NuruLife navy (#0A233A)
- **Logo Section**: Centered branding with tagline
- **Navigation Items**: 8 main panels + New Project button
- **User Section**: Profile info and logout button

### Navigation Items
1. **+ New Project**: Placeholder for project creation
2. **Dashboard**: Overview and quick actions
3. **Projects**: Project management
4. **Storyboards**: Timeline view of storyboards
5. **Characters**: Character database
6. **Assets Library**: Media asset management
7. **Shot List**: Shot planning
8. **Exports**: Export functionality
9. **Settings**: User preferences

### Active State Indicators
- **Background**: Semi-transparent white overlay
- **Text Color**: White for active, gray for inactive
- **Icon Color**: NuruLife orange (#F28C00) for active

## 📁 Panel Components

### SettingsPanel

#### Structure
```
┌─────────────────────────────────────────────────┐
│ Header: Back Button + Title + Save Changes      │
├─────────────────┬───────────────────────────────┤
│                 │                               │
│   Settings      │     Content Area               │
│   Menu          │                               │
│   ┌─────────┐   │                               │
│   │ Profile  │  │                               │
│   │ Notif.   │  │                               │
│   │ Appear.  │  │                               │
│   │ AI       │  │                               │
│   │ Collab.  │  │                               │
│   │ Projects │  │                               │
│   │ Privacy  │  │                               │
│   └─────────┘   │                               │
└─────────────────┴───────────────────────────────┘
```

#### Settings Sections

**Profile Settings**
- Avatar upload area
- Full Name input
- Email input
- Bio textarea

**Notification Preferences**
- Email notifications toggle
- Push notifications toggle
- Project updates toggle
- Marketing emails toggle

**Appearance Settings**
- Theme selector (Light/Dark)
- Language dropdown
- Timezone selector

**AI Settings**
- Default model selector
- Image quality settings
- Auto-save toggle

**Collaboration Settings**
- Real-time editing toggle
- Comments visibility selector

**Project Settings**
- Current project selector
- Auto-save toggle
- Export format preferences
- Backup frequency

**Privacy Settings**
- Profile visibility controls
- Data sharing preferences
- Analytics tracking toggle

### AssetsLibraryPanel

#### Header Controls
- **Bulk Actions**: Select All, Download, Tag, Delete (when items selected)
- **Upload Button**: File input trigger
- **View Toggle**: Grid/List view switcher

#### Filters and Search
- **Search Bar**: Search by name, project, or tags
- **Folder Filter**: Dropdown for folder selection
- **Type Filter**: All Types, Images, Videos, Audio, Documents
- **Sort Options**: Name, Size, Date, Type with ascending/descending

#### Asset Grid/List Views

**Grid View Cards**
- Thumbnail image or type icon
- Selection checkbox
- Favorite star
- Asset name
- File size and type
- Project association

**List View Rows**
- Checkbox and type icon
- Asset name and details
- Size, upload date, author
- Action menu (Edit, Download, Delete)

#### Drag & Drop
- **Drop Zone**: Visual feedback during drag operations
- **File Types**: Images, videos, audio, documents
- **Upload Feedback**: Progress indicators and success messages

### CharactersPanel

#### Character Cards
- **Avatar**: Profile image or default icon
- **Name & Role**: Character name with role badge
- **Project**: Associated project
- **Traits**: Tag-based trait display
- **Appearances**: Scene count
- **Actions**: Edit, View, Delete

#### Character Types
- **Hero**: Protagonist characters
- **Supporting**: Secondary characters
- **Villain**: Antagonist characters
- **Historical**: Real historical figures

#### Filter Options
- **Search**: By name or traits
- **Role Filter**: All, Hero, Supporting, Villain, Historical
- **Project Filter**: All projects or specific project

## 🎨 UI/UX Design System

### Color Palette
- **Primary Navy**: #0A233A (NuruLife brand)
- **Accent Orange**: #F28C00 (highlights, CTAs)
- **Secondary Red**: #7B1823 (buttons, alerts)
- **Neutral Grays**: #F4F5F7 (backgrounds), #E5E7EB (borders)

### Typography
- **Headlines**: Black weight, tight tracking
- **Body Text**: Medium weight, readable line heights
- **Labels**: Bold uppercase for form labels
- **Buttons**: Black weight, uppercase tracking

### Component Patterns
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Consistent padding, hover states, loading states
- **Inputs**: Border focus states, placeholder styling
- **Icons**: 16-24px sizes, consistent color theming

### Spacing System
- **Small**: 8px (0.5rem)
- **Medium**: 16px (1rem)
- **Large**: 24px (1.5rem)
- **Extra Large**: 32px (2rem)

## 🔧 Technical Implementation

### Component Architecture
- **Functional Components**: Modern React with hooks
- **Props Interface**: Well-defined component APIs
- **State Management**: Local state with useState
- **Event Handling**: Synthetic events and callbacks

### Routing Implementation
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
```

### Dashboard State Management
```jsx
const [activeTab, setActiveTab] = useState('dashboard');
// Panel switching via activeTab state
{activeTab === 'settings' && <SettingsPanel />}
{activeTab === 'assets' && <AssetsLibraryPanel />}
```

### Data Flow
- **Mock Data**: Static data for demonstration
- **Props Down**: Parent passes data to children
- **Callbacks Up**: Children communicate changes via callbacks
- **State Lifting**: Shared state managed at dashboard level

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: > 1024px (lg)

### Mobile Adaptations
- **Sidebar**: Collapsible or overlay navigation
- **Grid Layouts**: Single column on mobile
- **Touch Targets**: Minimum 44px touch areas
- **Typography**: Scaled appropriately for small screens

### Tablet Optimizations
- **Two-Column Layouts**: Balanced content distribution
- **Touch-Friendly**: Larger buttons and spacing
- **Navigation**: Accessible sidebar with touch gestures

### Desktop Experience
- **Multi-Column Layouts**: Full dashboard utilization
- **Hover States**: Enhanced interactivity
- **Keyboard Navigation**: Full accessibility support

## 🚀 Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Production build
npm run lint        # Code quality checks
npm run preview     # Preview production build
```

### Build Process
- **Vite**: Fast HMR and optimized bundles
- **ESLint**: Code quality and consistency
- **Tailwind**: Utility-first CSS compilation
- **Asset Optimization**: Image and font optimization

### Deployment Ready
- **Static Assets**: Optimized and cached
- **Code Splitting**: Route-based chunking
- **PWA Ready**: Service worker support
- **SEO Optimized**: Meta tags and structured data

---

**StoryAI** represents a comprehensive storyboarding solution designed specifically for independent African creators, combining modern web technologies with intuitive design to bridge the gap between creative vision and professional presentation.

## 🚀 Key Features

**Smart Script-to-Scene Parsing:** Paste your screenplay, and the NLP engine breaks it down into scenes, extracting settings, characters, and actions to generate precise AI visual prompts.

**Comprehensive Dashboard:** Professional multi-panel workspace with dedicated sections for Projects, Storyboards, Characters, Assets, Shot Lists, Exports, and Settings.

**Studio-Grade Visual Editor:** A split-screen workspace mirroring professional tools like StudioBinder. Review your script alongside auto-generated frames.

**Detailed Shot Metadata:** Refine your visual direction with built-in dropdowns for Shot Size (e.g., ECU, MCU, WS), Camera Angle (e.g., High, Low, Eye-Level), and Lens Focal Length.

**Character Database:** Maintain detailed character profiles with traits, relationships, and visual references for consistency across scenes.

**Advanced Assets Library:** Upload, organize, and manage media assets with bulk operations, advanced sorting/filtering, drag-drop functionality, and favorites system.

**Timeline View:** Chronological storyboard display for better narrative flow visualization.

**Collaboration Tools:** Team management, real-time editing capabilities, and project sharing features.

**Seamless Workflow:** From raw script → Scene Breakdown → Character Development → Asset Management → PDF Export.

## 🛠️ Tech Stack

### Frontend (Current Implementation)
- **Framework:** React 18 with functional components and hooks
- **Build Tool:** Vite 6.4.1 for fast development and optimized production builds
- **Styling:** Tailwind CSS v4 with custom NuruLife brand colors
- **Icons:** Lucide React for consistent, modern iconography
- **Routing:** React Router for navigation between dashboard panels
- **Architecture:** Single Page Application (SPA) with modular component design

### Future Backend (Planned)
- **Framework:** Python (Flask or FastAPI)
- **NLP Processing:** spaCy / NLTK for advanced script breakdown
- **AI Image Generation:** Stable Diffusion / HuggingFace Inference API
- **Database:** SQLite (development) / Firebase (production)
- **Authentication:** JWT-based user management

## 💻 Installation & Setup Guide

Follow these steps to run the StoryAI frontend locally:

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/H-E-Ingwee/NuruLife_StoryAI.git
cd NuruLife_StoryAI
```

### Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

### Step 3: Start the Development Server

Run the application locally:

```bash
npm run dev
```

The application will be available at `http://localhost:5176/` (or the next available port if 5176 is in use).

### Step 4: Access the Dashboard

- Navigate to the displayed local URL to access the main StoryAI workspace
- The comprehensive dashboard includes all tools and panels for storyboarding workflow

### Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## 🔧 Development Status

**Last Updated**: April 2026

### Recent Updates
- ✅ Fixed critical rendering issues in Settings and Assets panels
- ✅ Implemented advanced script parsing with "Beneath the Silence" case study
- ✅ Added comprehensive character database with trait extraction
- ✅ Enhanced Assets Library with bulk operations and drag-drop functionality
- ✅ Integrated timeline view for storyboard visualization
- ✅ Added collaboration and project settings management

### Known Issues
- Backend integration pending (Python/Flask API)
- AI image generation not yet implemented
- Export functionality in development

### Performance Notes
- Application builds successfully with 1759 modules
- Development server runs on Vite with hot reloading
- All linting errors resolved for clean codebase

## 📂 Project Structure

```
NuruLife_StoryAI/
├── public/                    # Static assets and favicon
├── src/
│   ├── components/            # React components
│   │   ├── Dashboard.jsx      # Main dashboard with panel routing
│   │   ├── Sidebar.jsx        # Navigation sidebar with tool selection
│   │   ├── ScriptEditor.jsx   # Script input and parsing interface
│   │   ├── StoryboardCanvas.jsx # Storyboard visualization canvas
│   │   ├── AssetsLibraryPanel.jsx # Asset management with bulk operations
│   │   ├── SettingsPanel.jsx  # User preferences and collaboration settings
│   │   ├── CharactersPanel.jsx # Character database and profiles
│   │   ├── ProjectsPanel.jsx  # Project management interface
│   │   ├── StoryboardsPanel.jsx # Storyboard timeline and grid views
│   │   ├── ShotListPanel.jsx   # Shot list management
│   │   └── ExportsPanel.jsx   # Export functionality
│   ├── App.jsx                # Main application with routing
│   ├── index.css              # Tailwind v4 styles and NuruLife branding
│   └── main.jsx               # React application entry point
├── package.json               # Project dependencies and scripts
├── vite.config.js             # Vite build configuration
├── tailwind.config.js         # Tailwind CSS custom configuration
├── eslint.config.js           # ESLint code quality rules
└── README.md                  # Project documentation
```

## 🚀 Current Implementation Status

### ✅ Completed Features
- **Comprehensive Dashboard**: Multi-panel workspace with Projects, Storyboards, Characters, Assets, Shot Lists, Exports, and Settings
- **Script Processing**: Advanced NLP-based scene parsing with character, scene, and shot extraction (demonstrated with "Beneath the Silence" case study)
- **Character Database**: Detailed character profiles with traits, relationships, and visual references
- **Advanced Assets Library**: Upload, organize, and manage media assets with bulk operations, sorting/filtering, drag-drop functionality, and favorites system
- **Storyboard Timeline**: Chronological storyboard display for better narrative flow visualization
- **Settings Panel**: User preferences, collaboration tools, team management, and project settings
- **Responsive UI**: Mobile-friendly design with Tailwind CSS and consistent NuruLife branding
- **Component Architecture**: Modular, maintainable React components with proper state management

### 🔄 In Development
- **Backend Integration**: Python/Flask API for advanced NLP processing and AI image generation
- **AI Image Generation**: Stable Diffusion integration for automated storyboard visualization
- **Database**: User accounts, project persistence, and cloud storage
- **Real-time Collaboration**: Multi-user editing capabilities and live updates
- **Export Functionality**: PDF generation and image export features

### 🎯 Next Steps
- Backend API development and deployment
- AI model integration for automated image generation
- User authentication and account management
- Advanced consistency algorithms for character and scene matching
- Performance optimization and testing
- User feedback collection and iterative improvements

## 📖 Usage Guide

### Getting Started
1. **Access the Dashboard**: Navigate to `/dashboard` in your browser after starting the development server
2. **Explore Panels**: Use the sidebar to navigate between different tools (Projects, Storyboards, Characters, Assets, etc.)
3. **Input Your Script**: Use the Script Editor to paste your screenplay for automatic parsing
4. **Generate Content**: The system automatically extracts characters, scenes, and shots from your script
5. **Manage Assets**: Upload and organize media files in the Assets Library
6. **Customize Settings**: Configure user preferences, collaboration settings, and project options

### Key Workflows

#### Script Processing Workflow
1. **Script Input**: Paste your screenplay in the Script Editor
2. **Automatic Parsing**: The system extracts characters, scenes, and action lines
3. **Character Database**: Automatically populates character profiles with traits and relationships
4. **Storyboard Generation**: Creates timeline-based storyboard with scene breakdowns

#### Asset Management Workflow
1. **Upload Assets**: Drag and drop files or use the upload button in Assets Library
2. **Organize Content**: Use folders, tags, and favorites to categorize assets
3. **Bulk Operations**: Select multiple assets for batch actions (download, tag, delete)
4. **Advanced Filtering**: Sort by name, size, date, or type; filter by media type

#### Character Development Workflow
1. **View Extracted Characters**: Browse automatically generated character profiles
2. **Edit Details**: Add traits, relationships, and visual references
3. **Maintain Consistency**: Use character data for consistent storytelling across scenes

#### Project Management Workflow
1. **Create Projects**: Set up new projects with custom settings
2. **Organize Content**: Link scripts, storyboards, characters, and assets to projects
3. **Export Results**: Generate PDFs and export project data

### Dashboard Panels Overview

- **Projects**: Manage multiple projects and switch between them
- **Storyboards**: View timeline-based storyboard with scene breakdowns
- **Characters**: Database of characters with detailed profiles and traits
- **Assets**: Media library with advanced organization and bulk operations
- **Shot List**: Detailed breakdown of individual shots and camera settings
- **Exports**: Generate and download project deliverables
- **Settings**: User preferences, collaboration tools, and system configuration

## 🤝 Contributing

We welcome contributions to StoryAI! This project is part of an academic thesis, but community input is valuable.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and component patterns
- Maintain consistent code style with ESLint
- Test components thoroughly before submitting
- Update documentation for new features

## 📄 License

This project is developed as part of an academic thesis at Murang'a University of Technology. Please contact the author for licensing inquiries.

## 📞 Contact

**Brian Ingwee**
- **Institution**: Murang'a University of Technology
- **Program**: B.Sc. Computer Science
- **Email**: [Your contact information]
- **GitHub**: [@H-E-Ingwee](https://github.com/H-E-Ingwee)

## 🙏 Acknowledgments

- **Supervisor**: Tirus - For invaluable guidance and mentorship
- **Murang'a University of Technology** - For providing the academic framework
- **NuruLife Productions** - For the vision and branding
- **Open Source Community** - For the amazing tools and libraries that make this possible

---

**Built with ❤️ for African creators, by African developers.**

## 🎓 Academic Context

This project is being developed as a B.Sc. Computer Science thesis at Murang'a University of Technology by Brian Ingwee. The ultimate goal of this research is to evaluate the efficacy of NLP-to-Image pipelines in reducing pre-production costs and preserving narrative consistency for independent African filmmakers.

### Research Objectives
1. **Analyze existing systems**: Review current AI art tools and pre-production software for independent creators
2. **Design the system**: Create an intuitive web-based application with comprehensive NLP integration and asset management
3. **Develop the prototype**: Build functional StoryAI with React frontend, advanced script parsing, and multi-panel dashboard
4. **Test and validate**: Conduct mixed-methods study with creative students and independent filmmakers
5. **Evaluate impact**: Measure reduction in pre-production costs and improvement in narrative consistency

### Methodology
- **Quantitative**: Task-based performance tests, System Usability Scale (SUS), and workflow efficiency metrics
- **Qualitative**: Semi-structured interviews, user feedback sessions, and case study analysis
- **Target Users**: Creative students, independent filmmakers, and African content creators
- **Case Study**: "Beneath the Silence" theater script used for demonstrating script parsing and character extraction capabilities

### Current Progress
- ✅ Frontend prototype with comprehensive dashboard and script parsing
- ✅ Advanced NLP-based character and scene extraction
- 🔄 Backend development and AI integration (in progress)
- 📋 User testing and validation (planned)

Built around the NuruLife promise: **Shining Light, Transforming Lives.**
