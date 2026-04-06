mport base64
import os
import uuid
from typing import Any, Dict, Optional
from urllib.request import urlopen

from openai import OpenAI

from app.ai.ai_service import AIImageService


class DalleService(AIImageService):
    def __init__(self, api_key: Optional[str] = None):
        api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError('OPENAI_API_KEY is not set')
        self.client = OpenAI(api_key=api_key)

    def generate_image(self, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        # DALL-E 3 currently supports 1024x1024 and 1792x1024 and 1024x1792.
        size = options.get('size')
        width = options.get('width', 1024)
        height = options.get('height', 1024)
        if not size:
            if width == 1792 and height == 1024:
                size = '1792x1024'
            elif width == 1024 and height == 1792:
                size = '1024x1792'
            else:
                size = '1024x1024'

        model = options.get('model', 'dall-e-3')
        quality = options.get('quality', 'standard')

        resp = self.client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            quality=quality,
            n=1,
        )

        item = resp.data[0]
        job_id = str(uuid.uuid4())

        if getattr(item, 'b64_json', None):
            image_bytes = base64.b64decode(item.b64_json)
            return {'status': 'completed', 'job_id': job_id, 'image_bytes': image_bytes}

        if getattr(item, 'url', None):
            with urlopen(item.url) as f:
                image_bytes = f.read()
            return {'status': 'completed', 'job_id': job_id, 'image_bytes': image_bytes}

        raise RuntimeError('OpenAI image response did not include b64_json or url')

    def check_job_status(self, job_id: str) -> Dict[str, Any]:
        # DALL-E 3 is synchronous in this MVP implementation.
        return {'status': 'completed', 'job_id': job_id}

