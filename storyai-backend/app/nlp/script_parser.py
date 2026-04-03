import re
from typing import Any, Dict, List, Tuple


SCENE_HEADING_RE = re.compile(
    r'^(?P<prefix>INT\.|EXT\.)\s+(?P<rest>.+)$',
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


def _extract_character_names(script_text: str) -> List[str]:
    names = set()
    for raw_line in script_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        m = DIALOGUE_NAME_RE.match(line)
        if m:
            names.add(m.group('name').strip())
            continue

        # Fallback: all-caps lines (common in theatre scripts)
        if ALLCAPS_NAME_RE.match(line) and ':' not in line and len(line) <= 40:
            # Avoid picking scene headings
            if line.upper().startswith('INT.') or line.upper().startswith('EXT.'):
                continue
            if line.upper().startswith('SCENE'):
                continue
            names.add(line)

    return sorted(names)


def _extract_scenes(script_text: str) -> List[Dict[str, Any]]:
    scenes: List[Dict[str, Any]] = []
    current: Dict[str, Any] | None = None

    # Build scenes by scanning lines; every time we see a scene heading,
    # we start a new scene and append subsequent non-empty lines.
    for raw_line in script_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        m = SCENE_HEADING_RE.match(line)
        if m:
            if current:
                scenes.append(current)
            heading = line
            current = {
                'heading': heading,
                'location': m.group('prefix').upper().replace('.', '') + ' ' + m.group('rest').strip(),
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
                'location': f"Scene {scene_num} {m2.group('rest').strip()}".strip(),
                'lines': [],
            }
            continue

        if current is not None:
            current['lines'].append(line)

    if current:
        scenes.append(current)

    return scenes


def _is_dialogue_line(line: str) -> bool:
    """
    Treat lines like 'JANE: Hello there' as dialogue.
    We keep them out of action prompts by default (more storyboard-friendly),
    but they can still be used later if desired.
    """
    return bool(DIALOGUE_NAME_RE.match(line))


def parse_script(
    script_text: str,
    *,
    max_shots_per_scene: int = 3,
    default_shot_size: str = 'MS',
    default_lens: str = '50mm',
    default_camera_angle: str = 'Eye Level',
) -> Dict[str, Any]:
    """
    Lightweight MVP parser:
    - Extract scene headings (INT./EXT. or 'SCENE n')
    - Extract action lines after each heading
    - Extract character names using simple heuristics
    - Generate storyboard-shot prompt text (to be improved later)
    """
    script_text = script_text or ''

    characters = _extract_character_names(script_text)
    scenes = _extract_scenes(script_text)

    if not scenes:
        # If the script doesn't contain scene headings, treat the whole script as one scene.
        scenes = [{'heading': 'UNLABELED_SCENE', 'location': 'Unknown location', 'lines': script_text.splitlines()[:100]}]

    shots: List[Dict[str, Any]] = []
    shot_global_idx = 1

    # Choose a repeating shot-size pattern to create variety.
    size_pattern = ['WS', 'MS', 'CU', 'ECU', 'EWS']

    for scene_idx, scene in enumerate(scenes, start=1):
        # Keep non-dialogue lines as "actions".
        action_lines = [ln for ln in scene['lines'] if ln.strip() and not _is_dialogue_line(ln)]
        if not action_lines:
            # If everything is dialogue, use dialogue lines as action seed.
            action_lines = [ln for ln in scene['lines'] if ln.strip()]

        action_lines = action_lines[:max_shots_per_scene]
        if not action_lines:
            action_lines = ['(Describe actions in this scene)']

        for local_shot_idx, action in enumerate(action_lines, start=1):
            shot_size = size_pattern[(shot_global_idx - 1) % len(size_pattern)]
            prompt = (
                f"{scene.get('heading')}. "
                f"Location: {scene.get('location')}. "
                f"Action: {action}. "
                f"Create a cinematic 2D storyboard panel, consistent character look across the sequence. "
            )
            if characters:
                prompt += f"Characters: {', '.join(characters)}. "

            # Placeholder notes; later we can incorporate camera instructions.
            notes = f"Scene {scene_idx}, shot {local_shot_idx}"

            shots.append(
                {
                    'scene_number': scene_idx,
                    'shot_number': shot_global_idx,
                    'scene': scene.get('location') or f"Scene {scene_idx}",
                    'action': action,
                    'prompt': prompt.strip(),
                    'shotSize': shot_size or default_shot_size,
                    'cameraAngle': default_camera_angle,
                    'lens': default_lens,
                    'notes': notes,
                    # Consistency data is deliberately minimal in this MVP.
                    'consistency_data': {
                        'lockedStyle': False,
                        'lockedSeed': False,
                        'character_names': characters,
                    },
                }
            )
            shot_global_idx += 1

    return {
        'characters': characters,
        'shots': shots,
    }

