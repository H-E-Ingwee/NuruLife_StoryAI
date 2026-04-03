from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class AIImageService(ABC):
    """
    Minimal synchronous/async interface.

    Services should return a dict with:
    - status: 'completed' | 'processing'
    - job_id: string (always present)
    - image_bytes: bytes (only when status == 'completed')
    """

    @abstractmethod
    def generate_image(self, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def check_job_status(self, job_id: str) -> Dict[str, Any]:
        raise NotImplementedError

