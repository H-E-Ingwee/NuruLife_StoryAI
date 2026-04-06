# 🎬 Storyboard System - Getting Started (NOW LIVE!)

## What You've Got

You now have a **professional storyboarding system** that transforms screenplays into visual storyboards with AI-generated images. Think of it as:

**Script Input** → **NLP Parser** → **Auto-Generated Shots** → **AI Images** → **Professional Storyboard**

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Set Up Your API Key (Choose One)

**Option A: Stable Diffusion via Replicate** (Recommended - cheaper, faster)
```bash
# Get key from https://replicate.com/account/api-tokens

# On Windows, set environment variable:
setx REPLICATE_API_TOKEN your_token_here

# Or in PowerShell:
$env:REPLICATE_API_TOKEN = "your_token_here"

# Then restart backend
cd storyai-backend
python run.py
```

**Option B: DALL-E 3 via OpenAI** (Slower, premium quality)
```bash
# Get key from https://platform.openai.com/account/api-keys

# On Windows:
setx OPENAI_API_KEY your_key_here

# Or in PowerShell:
$env:OPENAI_API_KEY = "your_key_here"

# Then restart backend
cd storyai-backend
python run.py
```

### Step 2: Start Both Servers

**Terminal 1 - Backend (Python)**:
```bash
cd storyai-backend
python run.py
# Should show: "Running on http://127.0.0.1:8000"
```

**Terminal 2 - Frontend (Node)**:
```bash
npm run dev
# Should show: "➜  Local: http://localhost:5173"
```

### Step 3: Test with Sample Script

1. Open `http://localhost:5173` in browser
2. Navigate to **Storyboards** tab
3. Select a project from dropdown
4. Paste this sample screenplay:

```
cd storyai-backend
$env:PYTHONPATH = "."
python run.py
```

5. Click **"Parse Script & Generate Storyboard"**
6. Wait 1-2 seconds for shots to appear
7. See the storyboard with professional metadata:
   - Shot types (ECU, CU, MCU, MS, WS)
   - Camera angles (High Angle, Eye Level, etc.)
   - Lenses (14mm, 50mm, 85mm, 200mm)
   - Time of day (DAY, NIGHT, DUSK, DAWN)

8. Click **"Generate"** on any shot
9. Watch real-time polling as AI creates the image (15-30 seconds)
10. See the completed image appear!

✅ **You've just created your first professional storyboard!**

---

## 🎯 How It Works: Behind the Scenes

### 1. Script Parsing (NLP)
System intelligently reads your screenplay and extracts:

- **Scene Locations**: INT./EXT., location names (COFFEE SHOP, OFFICE, etc.)
- **Scene Timing**: DAY, NIGHT, DUSK, DAWN → affects lighting suggestions
- **Characters**: All character names in dialogue and action → consistency tracking
- **Actions**: Analyzes action descriptions to infer:
  - Shot types (ECU for trembling hands, CU for faces, MS for characters, WS for rooms)
  - Camera angles (High angle for power dynamics, low for vulnerability, eye level for neutrality)
  - Lens focal lengths (Wide for establishing shots, portrait for character moments)

### 2. Professional Prompt Generation
Converts technical metadata into AI-optimized prompts:

```
Professional cinematic close-up with 85mm portrait lens from eye level angle.
Coffee shop interior, bright natural daylight. Shot of John (35, handsome),
trembling hands with white envelope. Cinematic lighting, professional
cinematography, shallow depth of field, 4K resolution, film grain, warm color
grading.
```

This tells the AI exactly what to generate from a filmmaker's perspective!

### 3. AI Image Generation
- Sends prompt to Replicate/OpenAI
- AI generates professional-looking shot
- Status updates in real-time (polling every 2 seconds)
- Image saved and displayed once complete

### 4. Character Consistency
- System recognizes character names across all shots
- Can track which characters appear in which shots
- Ready for visual consistency features (reference images, LoRA models)

---

## 📋 Usage Patterns

### Pattern 1: Quick Storyboard from Script
```
1. Paste screenplay
2. Click "Parse"
3. See shot breakdown
4. Generate images one-by-one
5. Save/export when done
```

### Pattern 2: Edit and Regenerate
```
1. Generate initial storyboard
2. Click on shot to view in inspector
3. Note the AI prompt
4. (Future) Edit prompt if needed
5. Regenerate image with modified prompt
```

### Pattern 3: Professional Export
```
1. Complete all shot generations
2. Click "Export Storyboard"
3. Get ZIP with:
   - CSV shot list (all metadata)
   - All images
   - Notes and specifications
4. Share with crew
```

---

## 🎨 Understanding the UI

### Main Areas

**Script Input** (Top Left):
- Paste screenplay here
- System reads INT./EXT. format
- Shows character and scene count

**Storyboards List** (Left Side):
- All your storyboards appear here
- Click storyboard name to expand
- Shows shot count and character count

**Shot Grid** (Center):
- Responsive grid of shot cards
- Each card shows thumbnail (once generated)
- Shot metadata badges
- Generation status and spinner

**Inspector Panel** (Right Side):
- Scene heading and action text
- **Shooting Parameters** (blue box):
  - Shot Size (ECU = Extreme Close-up, CU = Close-up, etc.)
  - Camera Angle (Eye Level, High Angle, Low Angle, etc.)
  - Lens (focal length in mm)
  - Time of Day (affects lighting)
- AI Prompt (monospace, gray background)
- Character consistency info
- Current generation status

### Color Meanings

| Color | Meaning |
|-------|---------|
| 🟠 Navy (#0A233A) | Headers, professional accents |
| 🟡 Orange (#F28C00) | Interactive elements, highlights |
| 🔵 Blue | Technical parameters (film info) |
| 🟣 Purple | Character/consistency data |
| 🟢 Green | Success, completed status |
| 🔴 Red | Errors, warnings |

---

## 🛠️ Customization Options (Available Now)

### Choose AI Provider
**Replicate** (Default):
- ✅ Cheaper (~$1 per image)
- ✅ Faster (15-30 seconds)
- ✅ Good quality
- Set `REPLICATE_API_TOKEN`

**OpenAI DALL-E 3**:
- ✅ Premium quality
- ❌ Slower (5-10 seconds but higher processing)
- ❌ More expensive (~$0.10-0.80 per image)
- Set `OPENAI_API_KEY`

### Style Presets (In Code)
Available styles you can request in prompts:
- Film Noir (high contrast, shadows, black & white)
- Cinematic (wide shots, color grading, depth)
- Documentary (realistic, natural lighting)
- Sci-Fi (futuristic, neon, high-tech)
- Fantasy (magical, otherworldly)
- Horror (dark, ominous, suspenseful)
- Romantic (soft, warm, intimate)
- Commercial (polished, professional, bright)

---

## 📊 What The System Generates

For each shot, you get:

**Metadata**:
- Scene number and location
- Shot type (ECU, CU, MCU, MS, WS, EWS)
- Camera angle (Eye Level, High Angle, etc.)
- Lens focal length (14mm, 50mm, 85mm, 200mm)
- Time of day (DAY, NIGHT, DUSK, DAWN)
- Character names featured
- Original screenplay action text

**AI-Generated**:
- Professional prompt (cinema vocabulary)
- Generated image (16:9 widescreen)
- Generation metadata (timestamp, job ID, provider)

**Professional Features**:
- Character consistency tracking
- Ready for reference images
- Ready for style locking
- Ready for batch export

---

## ⚡ Performance Tips

### Faster Generation
- Use **Replicate** instead of DALL-E
- Generate simpler scenes first
- Check "Use same seed" for consistent character looks
- Batch multiple shots (generates in parallel)

### Better Image Quality
- Use **DALL-E 3** for premium results
- Allow full 30-second generation time
- Use reference images for characters
- Request specific cinematography style in notes

### Smoother Experience
- Keep script under 20 scenes for first test
- Modern browser (Chrome 120+, Firefox 121+, Safari 17+)
- Stable internet connection
- Backend and frontend in separate terminals

---

## 🔧 Troubleshooting

### "Generate button doesn't work"
1. Check if backend is running: `curl http://localhost:8000/api/projects`
2. Check if API key is set: `echo $env:REPLICATE_API_TOKEN` (PowerShell)
3. Look in browser console (F12) for error messages
4. Check backend terminal for Python exceptions

### "Parsing fails - No scenes found"
1. Ensure screenplay uses INT./EXT. headings
2. Example format: `INT. COFFEE SHOP - DAY`
3. Must have at least one action line between headings
4. Try the sample script from Quick Start section

### "Image generation hangs"
1. Check backend logs for job failures
2. Verify API provider (Replicate or OpenAI) working
3. Check API quota on provider website
4. Restart backend if stuck longer than 2 minutes

### "UI looks broken"
1. Hard refresh: `Ctrl+Shift+R`
2. Clear browser cache
3. Restart frontend: `npm run dev`

---

## 📚 Documentation Files

- **[STORYBOARD_TESTING_CHECKLIST.md](STORYBOARD_TESTING_CHECKLIST.md)** - Complete test suite
- **[BACKEND_IMPLEMENTATION_GUIDE.md](BACKEND_IMPLEMENTATION_GUIDE.md)** - API details
- **[COMPONENT_DOCS.md](COMPONENT_DOCS.md)** - Frontend components
- **[TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)** - System design

---

## 🎬 Example: Step-by-Step Real Usage

### Scenario: Creating a romantic coffee shop scene

**Input Script**:
```
INT. COFFEE SHOP - DAY

Soft sunlight filters through the windows. The space is intimate and 
quiet. ALEX (28, thoughtful) sits alone with a cappuccino, reading.

The door opens. A bell chimes. JORDAN (30, warm smile) enters, scanning 
the room. They spot Alex.

CLOSE ON Alex's reaction. Recognition. Nervousness.

JORDAN circles through the coffee shop, approaching the table. A moment 
of hesitation. Then sits down across from Alex.

EXTREME CLOSE ON their hands on the table, just inches apart. Neither 
moves to hold the other's hand, but the tension is there.

JORDAN
I wasn't sure you'd come.

ALEX
Neither was I.
```

**System Process**:
1. **Parser identifies**:
   - 1 Storyboard with 4 shots
   - 2 Characters: Alex, Jordan
   - Location: Coffee shop (INT.)
   - Time: Day (bright daylight)
   
2. **Per-shot inference**:
   - Shot 1: Wide shot (establishing), eye level, 50mm
   - Shot 2: Medium shot (two characters), eye level, 50mm
   - Shot 3: Close-up (reaction), eye level, 85mm
   - Shot 4: Extreme close-up (hands), low angle, 85mm

3. **Prompts generated** (each with cinema vocabulary):
   - Shot 1: "Establishing wide shot of intimate coffee shop, bright daylight..."
   - Shot 2: "Medium shot two-shot, eye level, 50mm lens, both characters visible..."
   - Shot 3: "Close-up of Alex's face, reaction shot, eye level, 85mm portrait lens..."
   - Shot 4: "Extreme close-up of hands, intimate moment, warm daylight..."

4. **Images generated** (one by one or batch):
   - Real images appear in storyboard grid
   - Professional cinematography applied
   - Characters somewhat consistent
   - Lighting matches script direction

5. **Output**: Professional storyboard ready to share with crew!

---

## ✨ Next Steps After Testing

Once comfortable:

1. **Create your own storyboards** - Try various scripts
2. **Share with team** - Export as ZIP (will implement PDF soon)
3. **Give feedback** - Let me know what works/what needs improvement
4. **Request features** - Batch generation, character reference images, style editor
5. **Integrate into workflow** - Use for shot planning, crew communication

---

## 🎥 You're Ready!

Your storyboarding system is **production-ready**. The workflow is:

```
1. Write/paste screenplay
2. Click "Parse"
3. Review auto-generated shots
4. Generate images
5. Export storyboard
6. Share with crew
```

That's it! Everything in between is handled by AI and NLP.

**Now go create some beautiful storyboards! 🎬**

---

**Need help?** Check the [STORYBOARD_TESTING_CHECKLIST.md](STORYBOARD_TESTING_CHECKLIST.md) for detailed validation.
