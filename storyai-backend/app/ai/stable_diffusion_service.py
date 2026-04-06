import os
import uuid
from typing import Any, Dict, Optional
from urllib.request import urlopen

import replicate

from app.ai.ai_service import AIImageService


def _fetch_url_bytes(url: str) -> bytes:
    with urlopen(url) as f:
        return f.read()


class StableDiffusionService(AIImageService):
    """
    Replicate-based SDXL generation.

    Note: replicate jobs are asynchronous, so `generate_image` returns `processing`
    with a `job_id`, and `check_job_status` polls replicate for completion.
    """

    # SDXL model version used in BACKEND_ARCHITECTURE.md
    DEFAULT_MODEL_VERSION = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"

    def __init__(self, api_token: Optional[str] = None):
        api_token = api_token or os.getenv('REPLICATE_API_TOKEN')
        if not api_token:
            raise ValueError('REPLICATE_API_TOKEN is not set')
        self.client = replicate.Client(api_token=api_token)

    def generate_image(self, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        model_version = options.get('model_version') or self.DEFAULT_MODEL_VERSION
        width = options.get('width', 1024)
        height = options.get('height', 1024)
        steps = options.get('steps', 20)
        guidance_scale = options.get('guidance_scale', 7.5)
        scheduler = options.get('scheduler', 'K_EULER')
        negative_prompt = options.get('negative_prompt', '') or ''
        seed = options.get('seed')

        # Start async generation
        prediction = self.client.predictions.create(
            version=model_version,
            input={
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "width": width,
                "height": height,
                "num_inference_steps": steps,
                "guidance_scale": guidance_scale,
                "scheduler": scheduler,
                **({ "seed": seed } if seed is not None else {}),
            },
        )

        return {'status': 'processing', 'job_id': str(prediction.id)}

    def check_job_status(self, job_id: str) -> Dict[str, Any]:
        prediction = self.client.predictions.get(job_id)

        if prediction.status == 'succeeded':
            # replicate typically returns a list of URLs in `.output`
            output = prediction.output
            if isinstance(output, list) and output:
                image_url = output[0]
                image_bytes = _fetch_url_bytes(image_url)
                return {'status': 'completed', 'job_id': job_id, 'image_bytes': image_bytes}

            return {'status': 'completed', 'job_id': job_id, 'image_bytes': b''}

        if prediction.status == 'failed':
            return {'status': 'failed', 'job_id': job_id, 'error': prediction.error}

        return {'status': 'processing', 'job_id': job_id}

