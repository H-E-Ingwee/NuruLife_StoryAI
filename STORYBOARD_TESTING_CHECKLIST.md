# Storyboard System Testing Checklist

## 📋 Pre-Testing Setup

### 1. Environment Variables
```bash
# Set one of these in your backend environment:
export REPLICATE_API_TOKEN=your_replicate_api_key  # Preferred: Stable Diffusion
export OPENAI_API_KEY=your_openai_api_key          # Fallback: DALL-E 3

# Optional for specific configuration:
export AI_SERVICE_PROVIDER=replicate  # or "openai"
```

### 2. Backend Status
- [ ] Backend running on `http://localhost:8000`
- [ ] Database initialized (check `storyai-backend/app.db` exists)
- [ ] No startup errors in terminal
- [ ] Flask returns 200 on `GET localhost:8000/api/projects`

### 3. Frontend Status
- [ ] Frontend running on `http://localhost:5173` (or shown in terminal)
- [ ] No console errors in browser DevTools
- [ ] Can navigate to Storyboards tab
- [ ] API requests visible in Network tab when operations occur

---

## 🧪 Testing Workflows

### Test 1: Project Selection & Script Input
**Objective**: Verify script input interface works

Steps:
1. [ ] Navigate to **Storyboards** tab
2. [ ] Verify **"Project"** dropdown is populated with projects
3. [ ] Select a project from dropdown
4. [ ] Verify project name displays in header
5. [ ] Click in script textarea and type: `INT. COFFEE SHOP - DAY`
6. [ ] Verify textarea accepts text input
7. [ ] Verify character count updates

**Expected Result**: ✅ Script input area fully functional

---

### Test 2: Script Parsing
**Objective**: Verify NLP parser correctly extracts screenplay elements

**Sample Script** (paste this into textarea):
```
INT. COFFEE SHOP - DAY

JOHN (35, handsome) sits at a corner table, nursing his coffee. The morning 
light streams through the windows. He watches people pass by.

CLOSE ON his hands trembling slightly as he opens an envelope.

SARAH (30, elegant) enters. She spots John and approaches. Their eyes meet.

SARAH
You came.

JOHN
I said I would.

INT. COFFEE SHOP - CONTINUOUS

WIDE SHOT of the diner. A busy Saturday morning. Other customers barely notice
the two at the corner table.

CLOSE ON their hands as they both reach for the coffee cup between them.
```

Steps:
1. [ ] Paste sample script above into script textarea
2. [ ] Click **"Parse Script & Generate Storyboard"** button
3. [ ] Verify button shows loading spinner
4. [ ] Wait for response (typically 1-3 seconds)
5. [ ] Check for error message (if any)

**Expected Results**:
- ✅ No errors displayed
- ✅ Storyboard appears in list below
- ✅ Shows "X shots" count (should be ~4-5)
- ✅ Shows character count (should show "John, Sarah")
- ✅ Storyboard is collapsible

**If Errors Appear**:
1. Check browser console for error details
2. Check backend terminal for exception
3. Verify screenplay uses INT./EXT. format
4. Try simpler script with fewer scenes

---

### Test 3: Storyboard Display
**Objective**: Verify parsed storyboard displays correctly

Steps:
1. [ ] Click on storyboard name to expand shot grid
2. [ ] Verify shot grid appears below with responsive layout
3. [ ] Count shots displayed (should match "X shots" count)
4. [ ] For each shot, verify:
   - [ ] Shot number visible (e.g., "Shot 1")
   - [ ] Scene description visible
   - [ ] Shot type badge visible (ECU, CU, MCU, MS, WS, or EWS)
   - [ ] Camera angle badge visible (e.g., "Eye Level", "High Angle")

**Expected Result**: ✅ All shots display with correct metadata

---

### Test 4: Shot Inspector Panel
**Objective**: Verify shot details display correctly

Steps:
1. [ ] Click on any shot card in the grid
2. [ ] Verify **right panel appears** with width ~384px
3. [ ] Verify panel shows:
   - [ ] Scene heading
   - [ ] Action/description text
   - [ ] "Shooting Parameters" box (blue background) containing:
     - [ ] Shot Size (ECU, CU, MCU, etc.)
     - [ ] Camera Angle (Eye Level, High Angle, etc.)
     - [ ] Lens (14mm, 50mm, 85mm, 200mm)
     - [ ] Time of Day (DAY, NIGHT, DUSK, DAWN)
   - [ ] AI Prompt (monospace text, possibly truncated)
   - [ ] Consistency info (character names)
   - [ ] Current status (e.g., "ready to generate")

**Expected Result**: ✅ All shot details display correctly with film terminology

---

### Test 5: Image Generation (Requires API Keys)
**Objective**: Verify AI image generation works end-to-end

**Prerequisites**:
- [ ] `REPLICATE_API_TOKEN` or `OPENAI_API_KEY` is set
- [ ] Backend can reach the API service
- [ ] No API quota issues (check your Replicate/OpenAI account)

Steps:
1. [ ] Click **"Generate"** button on any shot card
2. [ ] Verify button becomes disabled (or shows text "Generating...")
3. [ ] Look for **spinner/loading icon** on the shot card
4. [ ] Monitor shot status in inspector panel (should say "processing")
5. [ ] Wait for generation (typically 10-30 seconds for Replicate, 3-5 for DALL-E)
6. [ ] Verify no error appears in red box
7. [ ] When complete:
   - [ ] Spinner disappears
   - [ ] Shot thumbnail shows generated image
   - [ ] Status changes to "completed"
   - [ ] Green checkmark appears on card
   - [ ] Inspector shows generated image URL

**Expected Results**:
- ✅ Generation starts successfully
- ✅ Real-time status updates visible
- ✅ Image appears once generated
- ✅ No console errors

**If Generation Fails**:

| Error | Solution |
|-------|----------|
| "No API key provided" | Set REPLICATE_API_TOKEN or OPENAI_API_KEY |
| "Quota exceeded" | Check API provider account for usage limits |
| "Invalid prompt" | Check backend logs; NLP might be generating bad prompt |
| "Connection timeout" | Check internet, verify API endpoint reachable |
| Polling stops, image never appears | Check backend logs for job completion issues |

---

### Test 6: Character Consistency Detection
**Objective**: Verify system identifies characters across shots

Steps:
1. [ ] Look at inspector panel for any shot
2. [ ] Verify "Consistency" section shows character names
3. [ ] For shots with JOHN, verify "John" appears in consistency
4. [ ] For shots with JOHN + SARAH, verify both appear

**Expected Result**: ✅ Character names correctly identified and displayed

---

### Test 7: Multiple Storyboards
**Objective**: Verify system handles multiple storyboards

Steps:
1. [ ] Keep first storyboard in list
2. [ ] Create new storyboard by parsing a different script:
   ```
   INT. OFFICE - DAY
   CLOSE ON a computer screen with urgent email.
   PULL BACK to show MAIN CHARACTER panicking.
   ```
3. [ ] Verify both storyboards appear in list
4. [ ] Verify each has independent shot lists
5. [ ] Generate images on different storyboards
6. [ ] Verify generation doesn't interfere between them

**Expected Result**: ✅ Multiple storyboards work independently

---

### Test 8: UI Responsiveness & Styling
**Objective**: Verify professional styling and responsiveness

Desktop View (1920px+):
- [ ] Script input takes ~60% of width
- [ ] Inspector panel occupies right ~30%
- [ ] Shot grid is 3 columns
- [ ] All text readable
- [ ] Colors are correct: Navy (#0A233A) headers, Orange (#F28C00) accents

Tablet View (768-1024px):
- [ ] Inspector panel collapses on scroll
- [ ] Shot grid is 2 columns
- [ ] UI remains functional

Mobile View (< 768px):
- [ ] Script input stacks vertically
- [ ] Inspector panel below shots (full width)
- [ ] Shot grid is 1 column
- [ ] All controls accessible

**Expected Result**: ✅ Responsive and professional styling throughout

---

### Test 9: Error Handling
**Objective**: Verify graceful error handling

Test Cases:

**9A: Empty Script**
- [ ] Leave script textarea empty
- [ ] Click "Parse Script & Generate Storyboard"
- [ ] Verify error message appears (red background)
- [ ] Error should read something like "Script is empty" or "No scenes found"

**9B: Invalid Screenplay Format**
- [ ] Paste non-screenplay text:
  ```
  Hello world this is not a screenplay
  It has no proper format
  ```
- [ ] Click parse
- [ ] Verify error message appears
- [ ] Should indicate script format issue

**9C: Generation with No API Key**
- [ ] Unset API key (or verify it's not set)
- [ ] Try to generate an image
- [ ] Verify error message appears in UI
- [ ] Should say "API key not configured" or similar

**9D: Network Error Recovery**
- [ ] (Advanced) Stop backend, try to parse script
- [ ] Verify connection error appears
- [ ] Restart backend
- [ ] Verify parsing works again

**Expected Result**: ✅ All errors handled gracefully with user-friendly messages

---

### Test 10: Professional Prompt Quality
**Objective**: Verify generated prompts use cinema terminology

Steps:
1. [ ] Click on any shot to open inspector
2. [ ] Scroll to "AI Prompt" section
3. [ ] Read the prompt text

**Should Contain**:
- [ ] ✅ Shot type (e.g., "close-up", "wide shot")
- [ ] ✅ Camera angle (e.g., "high angle shot", "over-the-shoulder")
- [ ] ✅ Lens information (e.g., "85mm portrait lens")
- [ ] ✅ Scene location (e.g., "coffee shop interior")
- [ ] ✅ Lighting description (e.g., "bright daylight", "warm tungsten lighting")
- [ ] ✅ Character descriptions (character names and appearance)
- [ ] ✅ Style/mood (e.g., "cinematic", "dramatic", "professional")
- [ ] ✅ Technical quality (e.g., "4K resolution", "professional cinematography")

**Example Good Prompt**:
```
Professional cinematic close-up with 85mm portrait lens from eye level angle. 
Coffee shop interior, bright natural daylight. Shot of John (35, handsome), 
trembling hands with envelope. Cinematic lighting, professional photography, 
4K resolution, shallow depth of field.
```

**Expected Result**: ✅ Prompts contain professional cinema vocabulary

---

## 🎯 Quick Validation Checklist

After all tests, verify:

- [ ] Parse script → Generates storyboard ✅
- [ ] Storyboard → Shows shots with metadata ✅
- [ ] Shot click → Inspector panel displays ✅
- [ ] Inspector → Shows film terminology ✅
- [ ] Generate button → Starts image generation ✅
- [ ] Polling → Real-time status updates ✅
- [ ] Completion → Image displays correctly ✅
- [ ] Errors → Handled gracefully ✅
- [ ] UI → Responsive and professional ✅
- [ ] Multiple → Storyboards independent ✅

✅ **All systems operational** = Production Ready

---

## 🚀 Performance Expectations

| Operation | Expected Duration |
|-----------|-------------------|
| Parse script (5-10 scenes) | 0.5-2 seconds |
| Generate image (Replicate) | 15-30 seconds |
| Generate image (DALL-E) | 3-8 seconds |
| UI response time | <500ms |
| Polling update interval | 2 seconds |

---

## 📊 Troubleshooting Guide

### Issue: "No scenes found" error

**Causes**:
1. Script doesn't use INT./EXT. headings
2. Script format not recognized by NLP parser

**Solutions**:
- Use proper screenplay format: `INT. LOCATION - TIME` or `EXT. LOCATION - TIME`
- Check [screenwriting_format.md](screenwriting_format.md) for examples
- Try sample script provided in Test 2

---

### Issue: Generate button does nothing

**Check**:
1. [ ] Backend running? (`localhost:8000`)
2. [ ] Browser console for errors
3. [ ] Backend logs for exceptions
4. [ ] API key set in environment?

**Solutions**:
```bash
# Terminal 1: Check backend running
curl http://localhost:8000/api/projects

# Terminal 2: Set API key and restart
export REPLICATE_API_TOKEN=your_token
cd storyai-backend && python run.py
```

---

### Issue: Images never appear (polling stops)

**Check**:
1. [ ] Backend logs for job completion errors
2. [ ] Image file in `storyai-backend/app/storage/generated_shots/`
3. [ ] Browser network tab for 404 on image URL

**Solutions**:
- Check AI provider (Replicate/DALL-E) for job failures
- Verify image storage directory exists and is writable
- Review backend logs for detailed error

---

### Issue: UI looks wrong (colors off, layout broken)

**Solutions**:
1. [ ] Hard refresh browser: `Ctrl+Shift+R`
2. [ ] Clear browser cache and reload
3. [ ] Check TailwindCSS compilation:
   ```bash
   npm run build
   npm run dev
   ```

---

## 📞 Support Resources

If you need help:

1. **Check backend logs**: `storyai-backend/app/logs/` directory
2. **Check browser console**: Press `F12` in browser
3. **Check API responses**: Open Network tab in DevTools
4. **Review documentation**: 
   - `BACKEND_IMPLEMENTATION_GUIDE.md` - API details
   - `COMPONENT_DOCS.md` - Frontend components
   - `TECHNICAL_ARCHITECTURE.md` - System overview

---

## ✅ Sign-Off

Once you've completed all tests, the storyboarding system is **production-ready** for:
- ✅ Screenplay parsing
- ✅ Automatic shot generation
- ✅ Professional metadata extraction
- ✅ AI image generation
- ✅ Real-time status tracking
- ✅ Character consistency
- ✅ Export capabilities

**🎬 Ready to create storyboards from scripts!**
