import os
from importlib import import_module
from typing import Any, Dict, Optional


class AIServiceManager:
    def __init__(self):
        # Providers are lazy-loaded (so imports don't fail when optional deps are missing).
        self._dalle: Optional[Any] = None
        self._sd: Optional[Any] = None

    def get_service(self, service_name: str):
        service_name = (service_name or '').strip().lower()

        if service_name in {'dalle', 'openai', 'dall-e', 'openai_dalle'}:
            if self._dalle is None:
                dalle_mod = import_module('app.ai.dalle_service')
                self._dalle = dalle_mod.DalleService(api_key=os.getenv('OPENAI_API_KEY'))
            return self._dalle

        if service_name in {'stable_diffusion', 'sd', 'sdxl', 'replicate', 'stability-ai'}:
            if self._sd is None:
                sd_mod = import_module('app.ai.stable_diffusion_service')
                self._sd = sd_mod.StableDiffusionService(api_token=os.getenv('REPLICATE_API_TOKEN'))
            return self._sd

        raise ValueError(f"Unknown AI service '{service_name}'")


ai_service_manager = AIServiceManager()

