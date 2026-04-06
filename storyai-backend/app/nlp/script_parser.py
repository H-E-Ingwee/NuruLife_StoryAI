import re
from typing import Any, Dict, List, Tuple, Optional


SCENE_HEADING_RE = re.compile(
    r'^(?P<prefix>INT\.|EXT\.)\s+(?P<location>[^-]+)\s*(?:-\s*(?P<time>.*?))?$',
    re.IGNORECASE,
)
SCENE_RE_ALT = re.compile(
    r'^SCENE\s+(?P<num>\d+)\s*[:\-]?\s*(?P<rest>.*)$',
    re.IGNORECASE,
)

# Example: "JANE:" at the start of a line
DIALOGUE_NAME_RE = re.compile(r'^(?P<name>[A-Z][A-Z0-9\s]{1,40})\s*:\s*(?P<rest>.*)$')

# Broad uppercase token candidates (used when the script lacks clear dialogue formatting)
ALLCAPS_NAME_RE = re.compile(r'^[A-Z][A-Z0-9\s]{2,40}$')

# Common time of day markers
TIME_OF_DAY_MARKERS = {
    'dawn': 'DAWN',
    'morning': 'DAY',
    'afternoon': 'DAY', 
    'dusk': 'DUSK',
    'evening': 'DUSK',
    'night': 'NIGHT',
    'midnight': 'NIGHT',
    'day': 'DAY',
    'night': 'NIGHT'
}

# Shot type keywords to help infer shot size
SHOT_TYPE_KEYWORDS = {
    'shoot wide': 'WS',
    'wide shot': 'WS',
    'wide angle': 'WS',
    'panorama': 'WS',
    'master shot': 'WS',
    'establishing': 'EWS',
    'pull back': 'WS',
    'zoom in': 'CU',
    'close up': 'CU',
    'extreme close': 'ECU',
    'macro': 'ECU',
    'medium shot': 'MS',
    'two shot': 'MS',
    'over shoulder': 'MCU',
    'reaction': 'CU',
    'detail': 'ECU',
    'insert': 'ECU',
}


def _extract_character_names(script_text: str) -> List[str]:
    """Extract unique character names from script."""
    names = set()
    for raw_line in script_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        m = DIALOGUE_NAME_RE.match(line)
        if m:
            name = m.group('name').strip()
            if len(name) > 2:  # Filter out single letters
                names.add(name)
            continue

        # Fallback: all-caps lines (common in theatre scripts)
        if ALLCAPS_NAME_RE.match(line) and ':' not in line and len(line) <= 40:
            # Avoid picking scene headings and action keywords
            upper_line = line.upper()
            if any(upper_line.startswith(p) for p in ['INT.', 'EXT.', 'SCENE', 'FADE', 'CUT', 'DISSOLVE']):
                continue
            names.add(line)

    return sorted(names)


def _extract_time_of_day(location_text: str) -> str:
    """Extract time of day from location string (e.g., 'INT. CAFE - NIGHT' -> 'NIGHT')."""
    location_lower = location_text.lower()
    for keyword, time_val in TIME_OF_DAY_MARKERS.items():
        if keyword in location_lower:
            return time_val
    return 'DAY'  # Default


def _infer_shot_type(action_text: str, location: str = '', char_count: int = 0) -> str:
    """
    Intelligently suggest a shot type based on action and location.
    Returns one of: ECU, CU, MCU, MS, WS, EWS
    """
    action_lower = action_text.lower()
    
    # Check for explicit shot type keywords
    for keyword, shot_type in SHOT_TYPE_KEYWORDS.items():
        if keyword in action_lower:
            return shot_type
    
    # Heuristic: if action mentions multiple people/a group, use wider shot
    if 'group' in action_lower or 'crowd' in action_lower or 'together' in action_lower:
        return 'WS'
    if 'everyone' in action_lower or 'all' in action_lower:
        return 'WS'
    
    # If action mentions facial expressions/emotions, use closer shot
    if any(word in action_lower for word in ['smiles', 'crying', 'laughs', 'frowns', 'expression', 'tears']):
        return 'CU'
    
    # If location suggests establishing, use wide shot initially
    if 'entering' in action_lower or 'arrives at' in action_lower or 'arrives' in action_lower:
        return 'EWS'
    
    # Default pattern based on character count
    if char_count >= 3:
        return 'WS'
    elif char_count == 2:
        return 'MCU'
    else:
        return 'MS'  # Safe default for single character or unknown


def _extract_scenes(script_text: str) -> List[Dict[str, Any]]:
    """
    Extract scenes from script with detailed metadata.
    Returns list of scenes with heading, location, INT/EXT, time of day, and action lines.
    """
    scenes: List[Dict[str, Any]] = []
    current: Optional[Dict[str, Any]] = None

    for raw_line in script_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        m = SCENE_HEADING_RE.match(line)
        if m:
            if current:
                scenes.append(current)
            
            interior_exterior = m.group('prefix').upper().replace('.', '')
            location = m.group('location').strip()
            time_text = m.group('time') or 'DAY'
            time_of_day = _extract_time_of_day(time_text)
            
            current = {
                'heading': line,
                'interior_exterior': interior_exterior,
                'location': location,
                'time_of_day': time_of_day,
                'full_heading': f"{interior_exterior} {location} - {time_of_day}",
                'lines': [],
            }
            continue

        m2 = SCENE_RE_ALT.match(line)
        if m2:
            if current:
                scenes.append(current)
            scene_num = int(m2.group('num'))
            current = {
                'heading': line,
                'interior_exterior': 'INT',
                'location': f"Scene {scene_num} {m2.group('rest').strip()}".strip(),
                'time_of_day': 'DAY',
                'full_heading': line,
                'lines': [],
            }
            continue

        if current is not None:
            current['lines'].append(line)

    if current:
        scenes.append(current)

    return scenes


def _is_dialogue_line(line: str) -> bool:
    """Treat lines like 'JANE: Hello there' as dialogue (not action)."""
    return bool(DIALOGUE_NAME_RE.match(line))


def _extract_characters_from_action(action_text: str, all_characters: List[str]) -> List[str]:
    """Extract which characters are mentioned in this action."""
    mentioned = []
    action_lower = action_text.lower()
    for char in all_characters:
        if char.lower() in action_lower:
            mentioned.append(char)
    return mentioned


def _infer_camera_angle(action_text: str) -> str:
    """Infer camera angle from action description."""
    action_lower = action_text.lower()
    
    angles = {
        'high angle': 'High Angle',
        'low angle': 'Low Angle',
        'down':'Low Angle',
        'up': 'High Angle',
        'overhead': 'Overhead',
        'POV': 'POV',
        'point of view': 'POV',
        'dutch': 'Dutch Angle',
        'tilted': 'Dutch Angle',
        'shoulder': 'Over-Shoulder',
        'over shoulder': 'Over-Shoulder',
    }
    
    for keyword, angle in angles.items():
        if keyword in action_lower:
            return angle
    
    return 'Eye Level'  # Default


def _infer_lens(action_text: str) -> str:
    """Infer lens focal length from action description."""
    action_lower = action_text.lower()
    
    # Look for explicit focal length mentions
    if any(word in action_lower for word in ['wide', 'panorama', 'vast']):
        return '14mm'
    if any(word in action_lower for word in ['telephoto', 'zoom', 'distant', 'far']):
        return '200mm'
    if any(word in action_lower for word in ['close', 'detail', 'intimate', 'macro']):
        return '85mm'
    
    return '50mm'  # Default (standard lens)


def _generate_professional_prompt(
    scene_heading: str,
    location: str,
    action: str,
    characters: List[str],
    shot_size: str,
    camera_angle: str,
    lens: str,
    time_of_day: str,
) -> str:
    """
    Generate a professional film-production-ready prompt for AI image generation.
    Incorporates cinema terminology, lighting suggestions, and character context.
    """
    
    # Build the core visual description
    parts = []
    
    # Shot size descriptors
    shot_desc = {
        'ECU': 'extreme close-up shot',
        'CU': 'close-up shot',
        'MCU': 'medium close-up shot',
        'MS': 'medium shot',
        'WS': 'wide shot',
        'EWS': 'extreme wide shot establishing shot',
    }
    
    # Lighting by time of day
    lighting_desc = {
        'DAY': 'bright natural daylight, clear shadows',
        'DUSK': 'golden hour lighting, warm tones, long shadows',
        'NIGHT': 'low-key lighting, dramatic shadows, moonlight accents',
        'DAWN': 'soft diffused morning light, cool tones',
    }
    
    camera_angle_desc = {
        'Eye Level': 'straight-on camera',
        'High Angle': 'high-angle camera looking down',
        'Low Angle': 'low-angle camera looking up',
        'Overhead': 'overhead bird\'s-eye-view camera',
        'POV': 'first-person point-of-view',
        'Over-Shoulder': 'over-the-shoulder perspective',
        'Dutch Angle': 'tilted/canted camera angle',
    }
    
    # Build prompt
    prompt = f"Professional cinema storyboard panel. "
    prompt += f"{shot_desc.get(shot_size, 'medium shot')} of {location}. "
    prompt += f"Composition: {camera_angle_desc.get(camera_angle, 'standard camera angle')}, {lens} lens. "
    
    if characters:
        prompt += f"Featuring {', '.join(characters[:2])}. "  # Limit to 2 chars
    
    prompt += f"Action: {action[:150]}. "  # Truncate long actions
    
    prompt += f"Lighting: {lighting_desc.get(time_of_day, 'natural lighting')}. "
    prompt += f"Cinematic, professional film production quality, high detail, sharp focus, "
    prompt += f"color graded, film stock aesthetic. "
    
    return prompt.strip()


def parse_script(
    script_text: str,
    *,
    max_shots_per_scene: int = 4,
    default_shot_size: str = 'MS',
    default_lens: str = '50mm',
    default_camera_angle: str = 'Eye Level',
) -> Dict[str, Any]:
    """
    Professional script parser for storyboarding.
    
    Returns:
        Dict with 'characters', 'locations', and 'shots' keys.
        Each shot contains all metadata needed for AI generation and storyboard display.
    """
    script_text = script_text or ''

    characters = _extract_character_names(script_text)
    scenes = _extract_scenes(script_text)

    if not scenes:
        # If no scene headings found, treat entire script as one scene
        scenes = [{
            'heading': 'SCENE - UNKNOWN LOCATION',
            'interior_exterior': 'INT',
            'location': 'Unknown Location',
            'time_of_day': 'DAY',
            'full_heading': 'SCENE - UNKNOWN LOCATION - DAY',
            'lines': script_text.splitlines()[:100]
        }]

    shots: List[Dict[str, Any]] = []
    shot_global_idx = 1
    locations_set = set()

    for scene_idx, scene in enumerate(scenes, start=1):
        location = scene.get('location', 'Unknown Location')
        locations_set.add(location)
        time_of_day = scene.get('time_of_day', 'DAY')
        
        # Extract action lines (non-dialogue)
        action_lines = [ln for ln in scene['lines'] if ln.strip() and not _is_dialogue_line(ln)]
        
        # If all dialogue, use dialogue lines
        if not action_lines:
            action_lines = [ln for ln in scene['lines'] if ln.strip()]
        
        # Limit per scene
        action_lines = action_lines[:max_shots_per_scene]
        
        if not action_lines:
            action_lines = ['Scene action']

        for local_shot_idx, action in enumerate(action_lines, start=1):
            # Infer shot metadata from action
            mentioned_chars = _extract_characters_from_action(action, characters)
            shot_size = _infer_shot_type(action, location, len(mentioned_chars))
            camera_angle = _infer_camera_angle(action)
            lens = _infer_lens(action)
            
            # Generate professional prompt
            prompt = _generate_professional_prompt(
                scene.get('heading', ''),
                location,
                action,
                mentioned_chars,
                shot_size,
                camera_angle,
                lens,
                time_of_day,
            )

            notes = f"Scene {scene_idx}, Shot {local_shot_idx}. {location}. {time_of_day}."

            shots.append({
                'scene_number': scene_idx,
                'shot_number': shot_global_idx,
                'scene': location,
                'time_of_day': time_of_day,
                'action': action,
                'prompt': prompt,
                'shotSize': shot_size,
                'cameraAngle': camera_angle,
                'lens': lens,
                'notes': notes,
                'consistency_data': {
                    'lockedStyle': False,
                    'lockedSeed': False,
                    'character_names': mentioned_chars,
                    'location': location,
                },
                'cameras_settings': {
                    'field_of_view': lens,
                    'angle': camera_angle,
                },
            })
            shot_global_idx += 1

    return {
        'characters': characters,
        'locations': sorted(list(locations_set)),
        'shots': shots,
        'total_shots': len(shots),
    }

