# StoryAI by NuruLife Productions 🎬✨

StoryAI is an AI-powered storyboarding web application designed for independent creators, filmmakers, and students. It bridges the gap between creative vision and visual reality by automatically translating written screenplays into professional storyboard frames.

Designed with a focus on empowering African creators and independent storytellers, StoryAI eliminates the high cost and slow process of traditional pre-production art.

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

### Step 1: Initialize the Project

Open VS Code, open a new Terminal, and navigate to the folder where you want to save your project. Run this command to create the React app:

```bash
npm create vite@latest story-ai -- --template react
```

### Step 2: Install Dependencies

Navigate into your new project folder and install the default React packages, along with Tailwind CSS and our icon library:

```bash
cd story-ai
npm install
npm install -D @tailwindcss/vite
npm install lucide-react
```

### Step 3: Configure Vite and Tailwind v4

Update your `vite.config.js` to use the new Tailwind v4 Vite plugin:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Step 4: Add Global Styles & Branding

Go to the `src` folder and open `index.css`. Replace its contents to import Tailwind and set the NuruLife brand theme:

```css
@import "tailwindcss";

@theme {
  --color-nuru-navy: #0A233A;
  --color-nuru-orange: #F28C00;
  --color-nuru-maroon: #7B1823;
  --color-nuru-light: #F4F5F7;
}

/* Custom scrollbar for a polished Studio feel */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
body {
  background-color: var(--color-nuru-light);
  margin: 0;
  padding: 0;
}
```

### Step 5: Start the Development Server

Run the application locally:

```bash
npm run dev
```

Click the `http://localhost:5173/` link in your terminal to view the application in your browser.

## 📂 Project Structure

```
story-ai/
├── public/              # Static assets
├── src/
│   ├── App.jsx          # Main application containing Router, Landing, Auth, and Dashboard
│   ├── index.css        # Tailwind v4 imports and global styles
│   └── main.jsx         # React DOM rendering entry point
├── package.json         # Project dependencies
└── vite.config.js       # Vite + Tailwind configuration
```

## 🎓 Academic Context

This project is being developed as a B.Sc. Computer Science thesis at Murang'a University of Technology by Brian Ingwee. The ultimate goal of this research is to evaluate the efficacy of NLP-to-Image pipelines in reducing pre-production costs and preserving narrative consistency for independent African filmmakers.

Built around the NuruLife promise: **Shining Light, Transforming Lives.**
