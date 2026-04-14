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
                # Try real DALLE service first, fall back to mock if API key not configured
                api_key = os.getenv('OPENAI_API_KEY')
                if api_key:
                    try:
                        dalle_mod = import_module('app.ai.dalle_service')
                        self._dalle = dalle_mod.DalleService(api_key=api_key)
                    except Exception as e:
                        print(f"[WARNING] Failed to initialize real DALLE service: {e}. Using mock.")
                        mock_mod = import_module('app.ai.mock_dalle_service')
                        self._dalle = mock_mod.MockDalleService()
                else:
                    # No API key - use mock for demo
                    print("[INFO] OPENAI_API_KEY not set. Using mock DALLE service for demo.")
                    mock_mod = import_module('app.ai.mock_dalle_service')
                    self._dalle = mock_mod.MockDalleService()
            return self._dalle

        if service_name in {'stable_diffusion', 'sd', 'sdxl', 'replicate', 'stability-ai'}:
            # Try to load Stable Diffusion, but fall back to DALLE if it fails
            try:
                if self._sd is None:
                    sd_mod = import_module('app.ai.stable_diffusion_service')
                    self._sd = sd_mod.StableDiffusionService(api_token=os.getenv('REPLICATE_API_TOKEN'))
                return self._sd
            except (ImportError, ValueError, Exception) as e:
                # If SD fails, fall back to DALLE
                print(f"[WARNING] Stable Diffusion service failed ({e}). Falling back to DALLE.")
                return self.get_service('dalle')

        # Default to DALLE for unknown services
        print(f"[WARNING] Unknown AI service '{service_name}'. Defaulting to DALLE.")
        return self.get_service('dalle')


ai_service_manager = AIServiceManager()

