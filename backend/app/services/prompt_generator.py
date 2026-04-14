"""
Prompt Generation Service for StoryAI

Converts shot metadata and consistency data into detailed, optimized prompts
for AI image generation models (particularly for storyboarding).
"""

from typing import Any, Dict, List, Optional


class PromptGenerator:
    """Professional storyboard prompt generation for consistency and quality."""
    
    # Negative prompts to avoid common AI generation issues
    DEFAULT_NEGATIVE_PROMPT = (
        "blurry, distorted, low quality, amateur, cartoon, anime, pixelated, "
        "deformed, incorrect hands, incorrect fingers, weird artifacts, "
        "text, watermark, low resolution, bad lighting"
    )
    
    # Shot type to visual descriptors
    SHOT_SIZE_DESC = {
        'ECU': 'extreme close-up shot, fills frame',
        'CU': 'close-up shot, shows head/face clearly',
        'MCU': 'medium close-up shot, from chest up',
        'MS': 'medium shot, full body in frame',
        'WS': 'wide shot, shows environment',
        'EWS': 'establishing shot, very wide angle, shows entire location',
    }
    
    # Camera angle descriptors for cinematic language
    CAMERA_ANGLE_DESC = {
        'Eye Level': 'straight-on camera angle, neutral perspective',
        'High Angle': 'high-angle camera shot, looking down at subject, creates vulnerability',
        'Low Angle': 'low-angle camera shot, looking up at subject, creates power or dominance',
        'Overhead': 'overhead bird\'s-eye-view camera angle, looking straight down',
        'POV': 'first-person point-of-view perspective',
        'Over-Shoulder': 'over-the-shoulder camera angle, shows background, second character',
        'Dutch Angle': 'tilted camera angle, creates tension or unease, horizon line not level',
        'Crane': 'high-altitude wide angle, cinematic crane shot',
    }
    
    # Lighting descriptions by time of day
    LIGHTING_DESC = {
        'DAY': 'bright natural daylight, crisp shadows, clear visibility',
        'DUSK': 'golden hour lighting, warm orange/amber tones, long dramatic shadows',
        'NIGHT': 'low-key dramatic lighting, deep shadows, moonlight or artificial sources, moody',
        'DAWN': 'soft diffused morning light, cool blue tones, misty atmospheric',
        'INTERIOR': 'controlled indoor lighting, artificial lights, soft key and fill lights',
        'EXTERIOR': 'natural outdoor lighting, environmental light sources',
    }
    
    # Cinematography styles that can be applied
    STYLE_PRESETS = {
        'film noir': 'black and white, high contrast, dramatic shadows, 1940s film aesthetic',
        'cinematic': 'cinematic color grading, film stock look, professional color science',
        'documentary': 'naturalistic lighting, handheld feel, authentic, uncontaminated',
        'sci-fi': 'futuristic aesthetic, neon accents, high-tech environment',
        'fantasy': 'magical atmosphere, ethereal lighting, fantastical elements',
        'horror': 'unsettling atmosphere, deep shadows, unnatural lighting, ominous',
        'romantic': 'soft focus, warm highlights, dreamy quality, romantic color grading',
        'commercial': 'bright colorful, contemporary, product-focused, clean aesthetic',
    }
    
    def __init__(self):
        pass
    
    def generate_shot_prompt(
        self,
        shot_data: Dict[str, Any],
        project_settings: Optional[Dict[str, Any]] = None,
        character_data: Optional[Dict[str, Any]] = None,
        global_style: Optional[str] = None,
    ) -> str:
        """
        Generate a detailed prompt from shot metadata.
        
        Args:
            shot_data: Dict with scene, action, shotSize, cameraAngle, lens, characteristics
            project_settings: Project-level consistency preferences
            character_data: Character identity blocks for consistency
            global_style: Global style to apply (film noir, cinematic, etc.)
        
        Returns:
            Optimized prompt string for AI image generation
        """
        
        parts = []
        
        # 1. Opening: Establish it's a storyboard
        parts.append("Professional cinema storyboard panel.")
        
        # 2. Shot type and composition
        shot_size = shot_data.get('shotSize', 'MS')
        shot_desc = self.SHOT_SIZE_DESC.get(shot_size, 'medium shot')
        parts.append(f"{shot_desc.capitalize()}.")
        
        # 3. Scene and location
        scene_location = shot_data.get('scene', 'Unknown location')
        parts.append(f"Location: {scene_location}.")
        
        # 4. Camera angle and lens
        camera_angle = shot_data.get('cameraAngle', 'Eye Level')
        angle_desc = self.CAMERA_ANGLE_DESC.get(camera_angle, camera_angle)
        lens = shot_data.get('lens', '50mm')
        parts.append(f"Camera: {angle_desc}, {lens} lens.")
        
        # 5. Action/what's happening
        action = shot_data.get('action', '')
        if action:
            # Truncate excessive action description
            action_summary = action[:200] if len(action) > 200 else action
            parts.append(f"Action: {action_summary}")
        
        # 6. Characters
        characters = shot_data.get('consistency_data', {}).get('character_names', [])
        if characters:
            char_str = ', '.join(characters)
            if character_data and characters[0] in character_data:
                char_info = character_data[characters[0]]
                identity_block = char_info.get('identity_block', '')
                if identity_block:
                    parts.append(f"Character: {char_str}. Identity: {identity_block}.")
                else:
                    parts.append(f"Character: {char_str}.")
            else:
                parts.append(f"Character: {char_str}.")
        
        # 7. Lighting/mood
        time_of_day = shot_data.get('time_of_day', 'DAY')
        lighting = self.LIGHTING_DESC.get(time_of_day, self.LIGHTING_DESC['DAY'])
        parts.append(f"Lighting: {lighting}")
        
        # 8. Style/color grading
        style = global_style or shot_data.get('style_preset') or 'cinematic'
        if style in self.STYLE_PRESETS:
            style_desc = self.STYLE_PRESETS[style]
            parts.append(f"Style: {style_desc}.")
        
        # 9. Technical quality requirements
        parts.append(
            "Technical: professional cinematography, high detail, sharp focus, "
            "film production quality, color-graded, high resolution."
        )
        
        # 10. Consistency hints
        consistency = shot_data.get('consistency_data', {})
        if consistency.get('lockedStyle'):
            parts.append("Maintain consistent visual style across the sequence.")
        if consistency.get('lockedSeed'):
            parts.append("Consistent composition and perspective.")
        
        prompt = ' '.join(parts).strip()
        return prompt
    
    def generate_negative_prompt(
        self,
        shot_data: Optional[Dict[str, Any]] = None,
        custom_negatives: Optional[List[str]] = None,
    ) -> str:
        """Generate negative prompt to avoid undesired elements."""
        parts = [self.DEFAULT_NEGATIVE_PROMPT]
        
        # Add shot-specific negatives
        if shot_data:
            shot_size = shot_data.get('shotSize', '')
            # For extreme close-ups, avoid full body
            if shot_size == 'ECU':
                parts.append("full body, wide angle, landscape")
            # For wide shots, avoid close-up face details
            elif shot_size == 'WS':
                parts.append("close-up face, extreme detail, macro")
        
        # Add custom negatives
        if custom_negatives:
            parts.extend(custom_negatives)
        
        return ', '.join(parts)
    
    def build_generation_options(
        self,
        shot_data: Dict[str, Any],
        consistency: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Build AI generation options (width, height, steps, seed, etc.) from shot data.
        """
        consistency = consistency or {}
        
        # Standard storyboard resolution (16:9 aspect ratio)
        options = {
            'width': 1920,
            'height': 1080,
            'steps': 50,  # More steps = higher quality but slower
            'guidance_scale': 7.5,  # How strongly to follow the prompt
            'scheduler': 'K_EULER',  # Euler scheduler is stable
        }
        
        # Override with shot-specific or project settings
        if shot_data.get('generation_settings'):
            options.update(shot_data['generation_settings'])
        
        # Seed for reproducibility/consistency
        if consistency.get('lockedSeed') and 'seed' in consistency:
            options['seed'] = consistency['seed']
        
        # Model version (default to SDXL)
        options['model_version'] = shot_data.get('ai_model') or 'default'
        
        return options
    
    def generate_character_identity_block(
        self,
        character_data: Dict[str, Any],
    ) -> str:
        """
        Generate a focused identity block for a character to ensure consistency.
        Used in prompts and as LoRA/ControlNet reference.
        """
        parts = []
        
        # Core identity
        name = character_data.get('name', 'Character')
        parts.append(f"{name}:")
        
        # Physical description (critical for consistency)
        if 'key_features' in character_data:
            features = character_data['key_features']
            parts.append(f"Appearance: {', '.join(features)}")
        
        # Age and body type
        if 'age_range' in character_data:
            parts.append(f"Age: {character_data['age_range']}")
        
        if 'body_type' in character_data:
            parts.append(f"Build: {character_data['body_type']}")
        
        # Distinctive clothing/costume
        if 'costume_description' in character_data:
            parts.append(f"Costume: {character_data['costume_description']}")
        
        # Emotional state/expression
        if 'default_mood' in character_data:
            parts.append(f"Expression: typically {character_data['default_mood']}")
        
        # Special attributes
        if 'special_attributes' in character_data:
            attrs = character_data['special_attributes']
            if attrs:
                parts.append(f"Notable: {', '.join(attrs)}")
        
        return ' '.join(parts)
    
    def apply_consistency_settings(
        self,
        prompt: str,
        consistency_settings: Dict[str, Any],
        character_blocks: Optional[Dict[str, str]] = None,
    ) -> tuple[str, Dict[str, Any]]:
        """
        Apply consistency settings to prompt and return adjusted prompt + options.
        
        Returns:
            (modified_prompt, generation_options)
        """
        modified_prompt = prompt
        options = {}
        
        # Style locking
        if consistency_settings.get('lockedStyle') and character_blocks:
            if 'style_character' in consistency_settings:
                char_name = consistency_settings['style_character']
                if char_name in character_blocks:
                    identity = character_blocks[char_name]
                    # Prepend identity to ensure strong styling
                    modified_prompt = f"Maintain character: {identity}. {modified_prompt}"
        
        # Seed locking for consistency
        if consistency_settings.get('lockedSeed'):
            options['seed'] = consistency_settings.get('seed', 42)
        
        # Reference image guidance
        if consistency_settings.get('use_reference_image'):
            options['reference_image_url'] = consistency_settings.get('reference_image_url')
            options['guidance_scale'] = 8.0  # Stronger guidance when using reference
        
        # LoRA or model adjustments
        if consistency_settings.get('lora_model'):
            options['lora_model'] = consistency_settings['lora_model']
            # Increase inference steps for LoRA accuracy
            options['steps'] = 60
        
        return modified_prompt, options

