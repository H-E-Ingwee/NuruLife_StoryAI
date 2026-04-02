# StoryAI by NuruLife Productions 🎬✨

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4.1-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Academic-red.svg)](#license)

**An AI-Powered Tool for Storyboards and Concept Art** - A Web-Based Co-pilot for Independent Creators

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

**Studio-Grade Visual Editor:** A split-screen workspace mirroring professional tools like StudioBinder. Review your script alongside auto-generated frames.

**Detailed Shot Metadata:** Refine your visual direction with built-in dropdowns for Shot Size (e.g., ECU, MCU, WS), Camera Angle (e.g., High, Low, Eye-Level), and Lens Focal Length.

**Character Consistency Locking:** Upload a reference photo of your character to keep their face and identity consistent across multiple generated frames using advanced IP-Adapter techniques.

**Seamless Workflow:** From raw script → Scene Breakdown → Prompt Refinement → PDF Export.

## 🛠️ Tech Stack

### Frontend (Current Focus)
- **Framework:** React 18 (via Vite)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Architecture:** Single Page Application (SPA) with state-based isolated scoping (Landing, Auth, Studio Dashboard).

### Backend (In Development)
- **Framework:** Python (Flask or FastAPI)
- **NLP Processing:** spaCy / NLTK for script breakdown
- **AI Image Generation:** Stable Diffusion / HuggingFace Inference API
- **Database:** SQLite (dev) / Firebase (prod)

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

The application will be available at `http://localhost:5174/` (or the next available port).

### Step 4: Access the Dashboard

- Navigate to `http://localhost:5174/dashboard` to access the main StoryAI workspace
- The landing page is available at the root URL for project overview

## 📂 Project Structure

```
NuruLife_StoryAI/
├── public/                    # Static assets
├── src/
│   ├── components/            # React components
│   │   ├── Dashboard.jsx      # Main dashboard layout
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── TopBar.jsx         # Global controls bar
│   │   ├── ScriptPanel.jsx    # Script input panel
│   │   ├── StoryboardGrid.jsx # Main storyboard canvas
│   │   ├── InspectorPanel.jsx # Panel editing controls
│   │   └── StoryboardCanvas.jsx # Legacy component
│   ├── App.jsx                # Main application with routing
│   ├── index.css              # Tailwind v4 styles & branding
│   └── main.jsx               # React entry point
├── package.json               # Project dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── eslint.config.js           # ESLint configuration
└── README.md                  # Project documentation
```

## 🚀 Current Implementation Status

### ✅ Completed Features
- **Dashboard Layout**: Professional split-screen workspace
- **Script Processing**: NLP-based scene parsing (frontend simulation)
- **Storyboard Grid**: Interactive panel management
- **Inspector Panel**: Camera controls, character consistency settings
- **Responsive UI**: Mobile-friendly design with Tailwind CSS
- **Component Architecture**: Modular, maintainable React components

### 🔄 In Development
- **Backend Integration**: Python/Flask API for NLP processing
- **AI Image Generation**: Stable Diffusion integration
- **Database**: User accounts and project persistence
- **Export Functionality**: PDF and image export features
- **Real-time Collaboration**: Multi-user editing capabilities

### 🎯 Next Steps
- Backend API development
- AI model integration
- User authentication
- Advanced consistency algorithms
- Performance optimization

## 📖 Usage Guide

### Getting Started
1. **Access the Dashboard**: Navigate to `/dashboard` in your browser
2. **Input Your Script**: Paste your screenplay in the left script panel
3. **Generate Scenes**: Click "Generate Scenes" to automatically parse and create storyboard panels
4. **Edit Panels**: Click on any panel to open the inspector and refine camera settings, prompts, and character consistency
5. **Export**: Use the export button in the top bar to save your storyboard

### Key Workflows
- **Script to Storyboard**: Raw script → AI scene parsing → visual panels
- **Panel Refinement**: Edit prompts → adjust camera settings → regenerate images
- **Character Consistency**: Upload reference photos → lock character features → maintain identity across scenes

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
1. **Analyze existing systems**: Review current AI art tools and pre-production software
2. **Design the system**: Create an intuitive web-based application with NLP integration
3. **Develop the prototype**: Build functional StoryAI with React frontend
4. **Test and validate**: Conduct mixed-methods study with creative students

### Methodology
- **Quantitative**: Task-based performance tests and System Usability Scale (SUS)
- **Qualitative**: Semi-structured interviews and user feedback
- **Target Users**: Creative students and independent filmmakers

Built around the NuruLife promise: **Shining Light, Transforming Lives.**
