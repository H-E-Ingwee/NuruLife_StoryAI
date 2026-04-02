# StoryAI by NuruLife Productions 🎬✨

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4.1-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Academic-red.svg)](#license)

**An AI-Powered Tool for Storyboards and Concept Art** - A Comprehensive Web-Based Co-pilot for Independent Creators

StoryAI is an AI-powered storyboarding web application designed for independent creators, filmmakers, and students. It bridges the gap between creative vision and visual reality by automatically translating written screenplays into professional storyboard frames.

Designed with a focus on empowering African creators and independent storytellers, StoryAI eliminates the high cost and slow process of traditional pre-production art.

## 📋 Table of Contents

- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [💻 Installation & Setup Guide](#-installation--setup-guide)
- [📂 Project Structure](#-project-structure)
- [🚀 Current Implementation Status](#-current-implementation-status)
- [📖 Usage Guide](#-usage-guide)
- [🎓 Academic Context](#-academic-context)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Contact](#-contact)
- [🙏 Acknowledgments](#-acknowledgments)

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
