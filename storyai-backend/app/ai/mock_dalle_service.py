import os
import uuid
import base64
from typing import Any, Dict, Optional
from PIL import Image
from io import BytesIO

from app.ai.ai_service import AIImageService


class MockDalleService(AIImageService):
    """Mock DALL-E service for MVP testing without API keys"""
    
    def __init__(self, api_key: Optional[str] = None):
        # Don't require API key for mock
        pass

    def generate_image(self, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a placeholder image"""
        width = options.get('width', 1024)
        height = options.get('height', 1024)
        
        # Create a simple placeholder image
        img = Image.new('RGB', (min(width, 1920), min(height, 1080)), color=(73, 109, 137))
        
        # Save to bytes
        img_bytes = BytesIO()
        img.save(img_bytes, format='PNG')
        image_bytes = img_bytes.getvalue()
        
        job_id = str(uuid.uuid4())
        
        return {
            'status': 'completed',
            'job_id': job_id,
            'image_bytes': image_bytes
        }

    def check_job_status(self, job_id: str) -> Dict[str, Any]:
        """Check status of image generation"""
        return {'status': 'completed', 'job_id': job_id}
