# Storyboard Feature Implementation Guide

## Professional Storyboarding System Architecture

This guide outlines the complete implementation of StoryAI's professional storyboarding system, designed for independent filmmakers, game developers, and creative studios.

### Core Features for Professional Film Production

1. **Script-to-Storyboard Automation**
   - NLP-based scene parsing from script text
   - Automatic shot extraction with metadata (scene number, type, location)
   - Smart prompt generation incorporating cinema terminology

2. **Visual Consistency System**
   - Character identity preservation across scenes
   - Style/mood locking for consistent aesthetic
   - Reference image upload for character/location anchoring
   - LoRA support for custom character models

3. **Professional Metadata**
   - Shot types: ECU (Extreme Close-Up), CU (Close-Up), MCU (Medium Close-Up), MS (Medium Shot), WS (Wide Shot), EWS (Extreme Wide Shot)
   - Camera angles: Eye Level, High, Low, Dutch, etc.
   - Lens specifications: 14mm, 50mm, 85mm, 200mm, etc.
   - Lighting notes: Key, fill, backlight descriptions
   - Duration/timing
   - Actor/character assignments

4. **AI Image Generation**
   - Multiple provider support (Stable Diffusion via Replicate, DALL-E, custom models)
   - Async generation with status polling
   - Seed control for reproducibility
   - Consistency parameters (identity block, style reference)
   - Quality/detail settings

5. **Export & Sharing**
   - PDF storyboard (traditional format with grid layout)
   - Image pack (all shots as individual files)
   - Shot list (CSV with metadata for production planning)
   - Lookbook (professional presentation format)

6. **Collaboration & Iteration**
   - Shot reordering and regrouping
   - Annotation and director notes per shot
   - Version history and rollback
   - Batch regeneration with consistency preservation

---

## Implementation Sequence

### Phase 1: Core Backend Infrastructure
1. Complete NLP script parsing service
2. Implement character extraction and management
3. Build AI generation wrapper with async status

### Phase 2: API & Database
1. Complete remaining API endpoints
2. Implement image storage (local dev, S3 for production)
3. Add character consistency persistence

### Phase 3: Frontend Integration
1. Real authentication flow
2. Storyboard editor UI with all controls
3. Live generation with progress feedback

### Phase 4: Polish & Professional Features
1. Export generation
2. Advanced consistency controls
3. Performance optimization

---

## Key Files to Modify/Create

### Backend

**Priority 1 - Critical Path:**
- `storyai-backend/app/nlp/script_parser.py` - Extend parsing engine
- `storyai-backend/app/services/prompt_generator.py` - **NEW** - Generate AI prompts from shots
- `storyai-backend/app/api/shots.py` - Complete generation/status endpoints

**Priority 2 - Integration:**
- `storyai-backend/app/ai/stable_diffusion_service.py` - Implement Replicate integration
- `storyai-backend/app/services/consistency_service.py` - **NEW** - Character consistency logic
- `storyai-backend/app/api/exports.py` - Implement export generation

**Priority 3 - Production Ready:**
- `storyai-backend/app/services/storage_service.py` - **NEW** - Handle image persistence
- `storyai-backend/app/models/` - Extend models with consistency metadata

### Frontend

**Priority 1 - Editor:**
- `src/components/StoryboardEditor.jsx` - **NEW** - Main editor container
- `src/components/ScriptPanel.jsx` - Wire to script parsing API
- `src/components/StoryboardCanvas.jsx` - Wire to generation API

**Priority 2 - Controls:**
- `src/components/InspectorPanel.jsx` - Film terminology controls (shot, angle, lens)
- `src/components/ShotListPanel.jsx` - Display parsed shots with metadata

**Priority 3 - Features:**
- `src/components/CharactersPanel.jsx` - Character reference management
- Export and sharing UI

---

## Technical Specifications

### Script Parsing Output
```python
{
    "scenes": [
        {
            "scene_number": 1,
            "heading": "INT. COFFEE SHOP - DAY",
            "location": "COFFEE SHOP",
            "interior_exterior": "INT",
            "time_of_day": "DAY",
            "actions": [
                {"text": "JANE sits nervously...", "character_names": ["JANE"]},
                {"text": "A man approaches...", "character_names": []},
            ],
            "shots": [  # Auto-extracted or user-created
                {
                    "shot_number": 1,
                    "type": "WS",  # Wide Shot
                    "description": "Establishing shot of the coffee shop, showing Jane seated",
                    "characters": ["JANE"],
                    "extracted_prompt": "...detailed prompt for image generation..."
                }
            ]
        }
    ],
    "characters": ["JANE", "MAN"],
    "locations": ["COFFEE SHOP"]
}
```

### Character Consistency Data
```python
{
    "character_id": "jane",
    "name": "JANE",
    "identity_block": "woman with auburn hair, wearing a navy blazer, brown eyes, calm demeanor",
    "style_reference": "photo-realistic, film noir aesthetic",
    "reference_images": ["url1", "url2"],  # For ControlNet
    "costume_description": "Navy blazer, white shirt, dark jeans",
    "age_range": "25-35",
    "key_features": ["auburn hair", "brown eyes", "professional style"]
}
```

### AI Generation Request
```python
{
    "shot_id": "shot_123",
    "prompt": "Wide shot of a coffee shop interior. A woman with auburn hair wearing a navy blazer sits nervously at a table, looking at the door. Warm lighting, afternoon sunlight through windows. Film noir lighting aesthetic. Professional cinematography, high quality",
    "negative_prompt": "blurry, distorted, amateur, cartoon style",
    "consistency": {
        "character_identity": {...character block...},
        "style_lock": "film noir aesthetic",
        "seed": 42,
        "use_reference_image": True
    },
    "technical": {
        "width": 1920,
        "height": 1080,
        "num_inference_steps": 50,
        "guidance_scale": 7.5
    }
}
```

### Export Formats

**PDF Storyboard**: Professional grid layout with shot numbers, descriptions, and metadata

**Image Pack**: All generated images plus shot metadata JSON

**Shot List CSV**: Production-planning format
```
Scene#, Shot#, Location, Char, ShotType, Camera, StoryAttr, Image
1,      1,     Coffee,   Jane, WS,       50mm,   Nervous,   shot_1.jpg
```

---

## Implementation Priority

**Week 1: Core Generation Pipeline**
- ✅ Complete NLP parsing
- ✅ Implement prompt generation
- ✅ Wire AI generation endpoints
- ✅ Image storage and retrieval

**Week 2: Frontend Editor**
- Wire script input to parsing
- Build shot list display
- Implement generation UI with progress
- Add shot editing controls

**Week 3: Consistency & Quality**
- Character reference system
- Style locking
- Batch regeneration
- Consistency controls UI

**Week 4: Export & Polish**
- PDF export
- Image pack export
- Advanced features (templates, presets)
- Performance optimization

---

## Success Criteria (Professional Producer's Perspective)

✅ **Can parse a full script** and extract scenes/shots automatically
✅ **Can generate shots quickly** with high-quality consistent imagery
✅ **Can keep characters looking the same** across multiple shots
✅ **Can export professional storyboard** ready for production planning
✅ **Understands cinema terminology** (shot types, camera angles, lenses)
✅ **Can iterate and refine** shots without losing context
✅ **Handles errors gracefully** with meaningful feedback
✅ **Produces film-quality imagery** suitable for pitch decks and pre-visualization
