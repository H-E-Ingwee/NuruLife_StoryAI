import os
from typing import Any, Dict, Optional

from app.ai.dalle_service import DalleService
from app.ai.stable_diffusion_service import StableDiffusionService


class AIServiceManager:
    def __init__(self):
        self._dalle: Optional[DalleService] = None
        self._sd: Optional[StableDiffusionService] = None

    def get_service(self, service_name: str):
        service_name = (service_name or '').strip().lower()

        if service_name in {'dalle', 'openai', 'dall-e', 'openai_dalle'}:
            if self._dalle is None:
                self._dalle = DalleService(api_key=os.getenv('OPENAI_API_KEY'))
            return self._dalle

        if service_name in {'stable_diffusion', 'sd', 'sdxl', 'replicate', 'stability-ai'}:
            if self._sd is None:
                self._sd = StableDiffusionService(api_token=os.getenv('REPLICATE_API_TOKEN'))
            return self._sd

        raise ValueError(f"Unknown AI service '{service_name}'")


ai_service_manager = AIServiceManager()

