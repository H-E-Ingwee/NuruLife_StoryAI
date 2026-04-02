# StoryAI Backend Architecture & Implementation

## 📋 Table of Contents

- [🏗️ System Architecture Overview](#️-system-architecture-overview)
- [🔧 Technology Stack](#-technology-stack)
- [📊 Database Design](#-database-design)
- [🔐 Authentication & Authorization](#-authentication--authorization)
- [🛣️ API Architecture](#️-api-architecture)
- [📝 NLP Processing Engine](#-nlp-processing-engine)
- [🎨 AI Image Generation Service](#-ai-image-generation-service)
- [💾 File Storage & Management](#-file-storage--management)
- [⚡ Background Processing](#-background-processing)
- [🔒 Security Implementation](#-security-implementation)
- [📈 Performance Optimization](#-performance-optimization)
- [🧪 Testing Strategy](#-testing-strategy)
- [🚀 Deployment Architecture](#-deployment-architecture)
- [📚 API Documentation](#-api-documentation)

## 🏗️ System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (React)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Dashboard • Sidebar • Settings • Assets • Characters   │    │
│  │  Projects • Storyboards • Shot List • Exports           │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTP/HTTPS
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (Flask)                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Authentication • Rate Limiting • Request Routing       │    │
│  │  Error Handling • Logging • CORS                         │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
┌─────────────────────────────────┐ ┌────────────┐ ┌─────────────┐
│     BUSINESS LOGIC LAYER       │ │   NLP      │ │   AI IMAGE  │
│  ┌─────────────────────────┐    │ │  SERVICE  │ │  GENERATION │
│  │ • User Management      │    │ │            │ │             │
│  │ • Project Management   │    │ │ • Script   │ │ • Stable    │
│  │ • Character Database   │    │ │   Parsing  │ │   Diffusion │
│  │ • Asset Management     │    │ │ • Scene    │ │ • DALL-E    │
│  │ • Export Processing    │    │ │   Analysis │ │ • Midjourney│
│  └─────────────────────────┘    │ └────────────┘ └─────────────┘
└─────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  PostgreSQL / Firebase Firestore                       │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │ • Users • Projects • Characters • Assets        │    │    │
│  │  │ • Scripts • Storyboards • Shots • Exports       │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
┌─────────────────────────────────┐ ┌────────────┐ ┌─────────────┐
│     FILE STORAGE                │ │   CACHE    │ │   QUEUE     │
│  ┌─────────────────────────┐    │ │  LAYER    │ │  SYSTEM     │
│  │ • AWS S3 / Google Cloud │    │ │ • Redis   │ │ • Redis     │
│  │ • Firebase Storage      │    │ │ • Memcached│ │   Queue    │
│  │ • Local (Development)   │    │ └────────────┘ └─────────────┘
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

### Architecture Principles

1. **Microservices Design**: Modular, independently deployable services
2. **RESTful API**: Clean, resource-based API endpoints
3. **Separation of Concerns**: Clear boundaries between layers
4. **Scalability**: Horizontal scaling capabilities
5. **Security First**: Authentication, authorization, and data protection
6. **Performance**: Caching, background processing, and optimization
7. **Reliability**: Error handling, logging, and monitoring

## 🔧 Technology Stack

### Backend Framework
```json
{
  "python": "^3.11",
  "flask": "^3.0.0",
  "flask-cors": "^4.0.0",
  "flask-jwt-extended": "^4.6.0",
  "flask-sqlalchemy": "^3.1.1",
  "flask-migrate": "^4.0.5",
  "werkzeug": "^3.0.1"
}
```

### Database & Storage
```json
{
  "psycopg2-binary": "^2.9.7",     // PostgreSQL driver
  "firebase-admin": "^6.2.0",     // Firebase integration
  "boto3": "^1.34.0",             // AWS S3
  "google-cloud-storage": "^2.10.0" // Google Cloud Storage
}
```

### NLP & AI Processing
```json
{
  "spacy": "^3.7.2",
  "nltk": "^3.8.1",
  "transformers": "^4.35.0",
  "torch": "^2.1.0",
  "diffusers": "^0.24.0",         // Stable Diffusion
  "openai": "^1.3.0",             // OpenAI API
  "replicate": "^0.22.0"          // Replicate API
}
```

### Background Processing & Caching
```json
{
  "celery": "^5.3.4",             // Task queue
  "redis": "^5.0.1",              // Cache & queue backend
  "flower": "^2.0.1"              // Celery monitoring
}
```

### Development & Testing
```json
{
  "pytest": "^7.4.3",
  "pytest-cov": "^4.1.0",
  "black": "^23.12.0",
  "flake8": "^6.1.0",
  "mypy": "^1.7.1"
}
```

## 📊 Database Design

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}'
);
```

#### Projects Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    script_text TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);
```

#### Characters Table
```sql
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100), -- hero, villain, supporting, historical
    type VARCHAR(100),
    description TEXT,
    traits TEXT[], -- Array of character traits
    appearance_count INTEGER DEFAULT 0,
    avatar_url VARCHAR(500),
    reference_images TEXT[], -- Array of image URLs
    consistency_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Assets Table
```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_type VARCHAR(50), -- image, video, audio, document
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_favorite BOOLEAN DEFAULT FALSE
);
```

#### Storyboards Table
```sql
CREATE TABLE storyboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    layout JSONB DEFAULT '[]', -- Array of panel configurations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Shots Table
```sql
CREATE TABLE shots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storyboard_id UUID NOT NULL REFERENCES storyboards(id) ON DELETE CASCADE,
    scene_number INTEGER,
    shot_number INTEGER,
    script_text TEXT,
    generated_prompt TEXT,
    image_url VARCHAR(500),
    image_status VARCHAR(50) DEFAULT 'pending', -- pending, generating, completed, failed
    camera_settings JSONB DEFAULT '{}', -- angle, lens, movement
    consistency_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Exports Table
```sql
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    export_type VARCHAR(50), -- pdf, images, video
    status VARCHAR(50) DEFAULT 'processing',
    file_url VARCHAR(500),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_characters_project_id ON characters(project_id);
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_project_id ON assets(project_id);
CREATE INDEX idx_shots_storyboard_id ON shots(storyboard_id);
CREATE INDEX idx_exports_user_id ON exports(user_id);

-- Full-text search indexes
CREATE INDEX idx_projects_title_gin ON projects USING gin(to_tsvector('english', title));
CREATE INDEX idx_characters_name_gin ON characters USING gin(to_tsvector('english', name));
CREATE INDEX idx_assets_filename_gin ON assets USING gin(to_tsvector('english', filename));
```

## 🔐 Authentication & Authorization

### JWT-Based Authentication

#### Token Structure
```python
# JWT payload structure
{
    "user_id": "uuid-string",
    "email": "user@example.com",
    "exp": 1640995200,  # Expiration timestamp
    "iat": 1640908800,  # Issued at timestamp
    "type": "access"    # or "refresh"
}
```

#### Authentication Service
```python
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token
from werkzeug.security import generate_password_hash, check_password_hash

class AuthService:
    def __init__(self, jwt_manager: JWTManager):
        self.jwt_manager = jwt_manager

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            return user
        return None

    def create_tokens(self, user: User) -> dict:
        """Create access and refresh tokens"""
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer"
        }

    def hash_password(self, password: str) -> str:
        """Hash password for storage"""
        return generate_password_hash(password, method='pbkdf2:sha256')

    def verify_password(self, hashed: str, password: str) -> bool:
        """Verify password against hash"""
        return check_password_hash(hashed, password)
```

### Authorization Middleware

#### Role-Based Access Control
```python
from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required

def require_auth(f):
    """Require authentication decorator"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated_function

def require_ownership(resource_type: str, resource_id_param: str):
    """Require resource ownership decorator"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            resource_id = kwargs.get(resource_id_param)

            # Check ownership based on resource type
            if resource_type == 'project':
                resource = Project.query.get_or_404(resource_id)
                if str(resource.user_id) != user_id:
                    abort(403, "Access denied")
            elif resource_type == 'character':
                resource = Character.query.get_or_404(resource_id)
                project = Project.query.get_or_404(resource.project_id)
                if str(project.user_id) != user_id:
                    abort(403, "Access denied")

            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

### Password Security

#### Password Requirements
```python
import re

class PasswordValidator:
    @staticmethod
    def validate(password: str) -> tuple[bool, str]:
        """Validate password strength"""
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"

        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"

        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"

        if not re.search(r'\d', password):
            return False, "Password must contain at least one digit"

        return True, "Password is valid"
```

## 🛣️ API Architecture

### RESTful API Design

#### API Endpoints Structure

```
POST   /api/auth/login                    # User login
POST   /api/auth/register                 # User registration
POST   /api/auth/refresh                  # Refresh access token
GET    /api/auth/me                       # Get current user info

GET    /api/projects                      # List user projects
POST   /api/projects                      # Create new project
GET    /api/projects/{id}                 # Get project details
PUT    /api/projects/{id}                 # Update project
DELETE /api/projects/{id}                 # Delete project

GET    /api/projects/{id}/characters      # List project characters
POST   /api/projects/{id}/characters      # Create character
GET    /api/characters/{id}               # Get character details
PUT    /api/characters/{id}               # Update character
DELETE /api/characters/{id}               # Delete character

GET    /api/assets                        # List user assets
POST   /api/assets/upload                 # Upload asset
GET    /api/assets/{id}                   # Get asset details
DELETE /api/assets/{id}                   # Delete asset

GET    /api/storyboards                    # List storyboards
POST   /api/storyboards                    # Create storyboard
GET    /api/storyboards/{id}               # Get storyboard
PUT    /api/storyboards/{id}               # Update storyboard
DELETE /api/storyboards/{id}               # Delete storyboard

GET    /api/storyboards/{id}/shots         # List storyboard shots
POST   /api/storyboards/{id}/shots         # Create shot
GET    /api/shots/{id}                     # Get shot details
PUT    /api/shots/{id}                     # Update shot
DELETE /api/shots/{id}                     # Delete shot

POST   /api/shots/{id}/generate-image      # Generate AI image for shot
GET    /api/shots/{id}/image-status        # Check image generation status

POST   /api/exports                        # Create export
GET    /api/exports/{id}                   # Get export status
GET    /api/exports/{id}/download          # Download export file
```

### API Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "Project Name",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Project created successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Email format is invalid"
    }
  }
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### Rate Limiting

#### Rate Limit Configuration
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Specific endpoint limits
@app.route("/api/auth/login")
@limiter.limit("5 per minute")
def login():
    pass

@app.route("/api/shots/generate-image")
@limiter.limit("10 per hour")
def generate_image():
    pass
```

## 📝 NLP Processing Engine

### Script Parsing Service

#### Script Structure Analysis
```python
import spacy
from typing import List, Dict, Any

class ScriptParser:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")

    def parse_script(self, script_text: str) -> Dict[str, Any]:
        """Parse screenplay text and extract structured data"""
        doc = self.nlp(script_text)

        scenes = self.extract_scenes(script_text)
        characters = self.extract_characters(doc)
        actions = self.extract_actions(doc)

        return {
            "scenes": scenes,
            "characters": characters,
            "actions": actions,
            "metadata": {
                "total_scenes": len(scenes),
                "total_characters": len(characters),
                "word_count": len(doc)
            }
        }

    def extract_scenes(self, script_text: str) -> List[Dict[str, Any]]:
        """Extract scene headings from script"""
        import re

        scene_pattern = r'^(INT\.|EXT\.)\s+(.+)$'
        scenes = []

        lines = script_text.split('\n')
        current_scene = None

        for line in lines:
            line = line.strip()
            match = re.match(scene_pattern, line, re.IGNORECASE)

            if match:
                if current_scene:
                    scenes.append(current_scene)

                current_scene = {
                    "heading": line,
                    "location": match.group(1).upper(),
                    "description": match.group(2),
                    "content": []
                }
            elif current_scene and line:
                current_scene["content"].append(line)

        if current_scene:
            scenes.append(current_scene)

        return scenes

    def extract_characters(self, doc) -> List[str]:
        """Extract character names using NER"""
        characters = set()

        for ent in doc.ents:
            if ent.label_ == "PERSON":
                characters.add(ent.text.upper())

        return list(characters)

    def extract_actions(self, doc) -> List[Dict[str, Any]]:
        """Extract action lines and descriptions"""
        actions = []

        for sent in doc.sents:
            # Simple heuristic: sentences with action verbs
            action_verbs = ['walks', 'runs', 'looks', 'enters', 'exits', 'opens', 'closes']
            if any(verb in sent.text.lower() for verb in action_verbs):
                actions.append({
                    "text": sent.text.strip(),
                    "start": sent.start_char,
                    "end": sent.end_char
                })

        return actions
```

### Prompt Generation Service

#### AI Prompt Engineering
```python
class PromptGenerator:
    def __init__(self):
        self.base_templates = {
            "character": "A {description} person, {age} years old, {ethnicity}, {build}, {hair_color} hair, {eye_color} eyes, wearing {clothing}",
            "scene": "{location} {time_of_day}, {lighting}, {mood}, {characters} in scene",
            "action": "{character} {action}, {expression}, {camera_angle}, {shot_size}"
        }

    def generate_character_prompt(self, character_data: Dict[str, Any]) -> str:
        """Generate detailed character description prompt"""
        template = self.base_templates["character"]

        return template.format(
            description=character_data.get("description", "person"),
            age=character_data.get("age", "adult"),
            ethnicity=character_data.get("ethnicity", "diverse"),
            build=character_data.get("build", "average"),
            hair_color=character_data.get("hair_color", "dark"),
            eye_color=character_data.get("eye_color", "brown"),
            clothing=character_data.get("clothing", "casual clothes")
        )

    def generate_scene_prompt(self, scene_data: Dict[str, Any], characters: List[str]) -> str:
        """Generate scene description prompt"""
        template = self.base_templates["scene"]

        return template.format(
            location=scene_data.get("location", "indoor location"),
            time_of_day=scene_data.get("time_of_day", "daytime"),
            lighting=scene_data.get("lighting", "natural lighting"),
            mood=scene_data.get("mood", "neutral atmosphere"),
            characters=", ".join(characters) if characters else "people"
        )

    def generate_action_prompt(self, action_data: Dict[str, Any], character_prompt: str) -> str:
        """Generate action-specific prompt"""
        template = self.base_templates["action"]

        return template.format(
            character=character_prompt,
            action=action_data.get("action", "standing"),
            expression=action_data.get("expression", "neutral expression"),
            camera_angle=action_data.get("camera_angle", "eye level"),
            shot_size=action_data.get("shot_size", "medium shot")
        )

    def enhance_prompt_for_consistency(self, base_prompt: str, consistency_data: Dict[str, Any]) -> str:
        """Add consistency elements to prompt"""
        enhanced_prompt = base_prompt

        # Add reference to previous images
        if consistency_data.get("reference_images"):
            enhanced_prompt += f", consistent with reference style"

        # Add character-specific details
        if consistency_data.get("character_traits"):
            traits = ", ".join(consistency_data["character_traits"])
            enhanced_prompt += f", maintaining {traits}"

        # Add style consistency
        if consistency_data.get("style_reference"):
            enhanced_prompt += f", in the style of {consistency_data['style_reference']}"

        return enhanced_prompt
```

## 🎨 AI Image Generation Service

### Multi-Provider AI Service

#### AI Service Interface
```python
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class AIService(ABC):
    @abstractmethod
    async def generate_image(self, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Generate image from prompt"""
        pass

    @abstractmethod
    async def check_generation_status(self, job_id: str) -> Dict[str, Any]:
        """Check generation status"""
        pass
```

#### Stable Diffusion Service
```python
import replicate
from .ai_service import AIService

class StableDiffusionService(AIService):
    def __init__(self, api_token: str):
        self.client = replicate.Client(api_token=api_token)
        self.model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"

    async def generate_image(self, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Generate image using Stable Diffusion"""
        try:
            # Enhance prompt for better results
            enhanced_prompt = self._enhance_prompt(prompt, options)

            # Set up generation parameters
            params = {
                "prompt": enhanced_prompt,
                "negative_prompt": options.get("negative_prompt", ""),
                "width": options.get("width", 1024),
                "height": options.get("height", 1024),
                "num_inference_steps": options.get("steps", 20),
                "guidance_scale": options.get("guidance_scale", 7.5),
                "scheduler": "K_EULER"
            }

            # Add consistency parameters
            if options.get("reference_image"):
                params["image"] = options["reference_image"]
                params["strength"] = options.get("strength", 0.8)

            # Start generation
            prediction = self.client.predictions.create(
                version=self.model,
                input=params
            )

            return {
                "job_id": prediction.id,
                "status": "processing",
                "estimated_time": 30  # seconds
            }

        except Exception as e:
            raise Exception(f"Stable Diffusion generation failed: {str(e)}")

    async def check_generation_status(self, job_id: str) -> Dict[str, Any]:
        """Check generation status"""
        try:
            prediction = self.client.predictions.get(job_id)

            if prediction.status == "succeeded":
                return {
                    "status": "completed",
                    "image_url": prediction.output[0] if prediction.output else None,
                    "job_id": job_id
                }
            elif prediction.status == "failed":
                return {
                    "status": "failed",
                    "error": prediction.error,
                    "job_id": job_id
                }
            else:
                return {
                    "status": "processing",
                    "job_id": job_id
                }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "job_id": job_id
            }

    def _enhance_prompt(self, prompt: str, options: Dict[str, Any]) -> str:
        """Enhance prompt for better image quality"""
        enhanced = prompt

        # Add quality boosters
        quality_terms = [
            "highly detailed",
            "professional",
            "cinematic lighting",
            "sharp focus",
            "intricate details"
        ]

        enhanced += ", " + ", ".join(quality_terms)

        # Add style preferences
        if options.get("style"):
            enhanced += f", {options['style']} style"

        # Add aspect ratio guidance
        if options.get("aspect_ratio") == "portrait":
            enhanced += ", portrait composition"
        elif options.get("aspect_ratio") == "landscape":
            enhanced += ", landscape composition"

        return enhanced
```

#### OpenAI DALL-E Service
```python
import openai
from .ai_service import AIService

class DalleService(AIService):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    async def generate_image(self, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Generate image using DALL-E"""
        try:
            # Prepare request
            request_params = {
                "model": options.get("model", "dall-e-3"),
                "prompt": prompt,
                "size": options.get("size", "1024x1024"),
                "quality": options.get("quality", "standard"),
                "n": 1
            }

            # Generate image
            response = self.client.images.generate(**request_params)

            return {
                "status": "completed",
                "image_url": response.data[0].url,
                "revised_prompt": response.data[0].revised_prompt if hasattr(response.data[0], 'revised_prompt') else None
            }

        except Exception as e:
            raise Exception(f"DALL-E generation failed: {str(e)}")

    async def check_generation_status(self, job_id: str) -> Dict[str, Any]:
        """DALL-E generates synchronously, so this is not needed"""
        return {"status": "not_supported"}
```

#### AI Service Manager
```python
from typing import Dict, Any, Optional
from .ai_service import AIService
from .stable_diffusion_service import StableDiffusionService
from .dalle_service import DalleService

class AIServiceManager:
    def __init__(self):
        self.services: Dict[str, AIService] = {}

    def register_service(self, name: str, service: AIService):
        """Register an AI service"""
        self.services[name] = service

    def get_service(self, name: str) -> AIService:
        """Get AI service by name"""
        if name not in self.services:
            raise ValueError(f"AI service '{name}' not found")
        return self.services[name]

    async def generate_image(self, service_name: str, prompt: str, options: Dict[str, Any]) -> Dict[str, Any]:
        """Generate image using specified service"""
        service = self.get_service(service_name)
        return await service.generate_image(prompt, options)

    async def check_status(self, service_name: str, job_id: str) -> Dict[str, Any]:
        """Check generation status"""
        service = self.get_service(service_name)
        return await service.check_generation_status(job_id)

    def get_available_services(self) -> list[str]:
        """Get list of available services"""
        return list(self.services.keys())
```

## 💾 File Storage & Management

### Multi-Provider Storage Service

#### Storage Interface
```python
from abc import ABC, abstractmethod
from typing import BinaryIO, Dict, Any

class StorageService(ABC):
    @abstractmethod
    async def upload_file(self, file: BinaryIO, filename: str, content_type: str) -> Dict[str, Any]:
        """Upload file and return metadata"""
        pass

    @abstractmethod
    async def download_file(self, file_path: str) -> bytes:
        """Download file content"""
        pass

    @abstractmethod
    async def delete_file(self, file_path: str) -> bool:
        """Delete file"""
        pass

    @abstractmethod
    async def get_file_url(self, file_path: str, expires_in: int = 3600) -> str:
        """Get signed URL for file access"""
        pass
```

#### AWS S3 Storage Service
```python
import boto3
import uuid
from botocore.exceptions import ClientError
from .storage_service import StorageService

class S3StorageService(StorageService):
    def __init__(self, bucket_name: str, region: str, access_key: str, secret_key: str):
        self.bucket_name = bucket_name
        self.s3_client = boto3.client(
            's3',
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )

    async def upload_file(self, file: BinaryIO, filename: str, content_type: str) -> Dict[str, Any]:
        """Upload file to S3"""
        try:
            # Generate unique filename
            file_extension = filename.split('.')[-1] if '.' in filename else ''
            unique_filename = f"{uuid.uuid4()}.{file_extension}"

            # Upload file
            self.s3_client.upload_fileobj(
                file,
                self.bucket_name,
                unique_filename,
                ExtraArgs={
                    'ContentType': content_type,
                    'ACL': 'private'
                }
            )

            return {
                "file_path": unique_filename,
                "bucket": self.bucket_name,
                "url": f"https://{self.bucket_name}.s3.amazonaws.com/{unique_filename}",
                "size": file.tell() if hasattr(file, 'tell') else 0
            }

        except ClientError as e:
            raise Exception(f"S3 upload failed: {str(e)}")

    async def download_file(self, file_path: str) -> bytes:
        """Download file from S3"""
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=file_path)
            return response['Body'].read()
        except ClientError as e:
            raise Exception(f"S3 download failed: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from S3"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_path)
            return True
        except ClientError:
            return False

    async def get_file_url(self, file_path: str, expires_in: int = 3600) -> str:
        """Generate signed URL for private file access"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_path},
                ExpiresIn=expires_in
            )
            return url
        except ClientError as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")
```

#### Firebase Storage Service
```python
import firebase_admin
from firebase_admin import credentials, storage
from .storage_service import StorageService

class FirebaseStorageService(StorageService):
    def __init__(self, credentials_path: str, bucket_name: str):
        cred = credentials.Certificate(credentials_path)
        firebase_admin.initialize_app(cred, {
            'storageBucket': bucket_name
        })
        self.bucket = storage.bucket()

    async def upload_file(self, file: BinaryIO, filename: str, content_type: str) -> Dict[str, Any]:
        """Upload file to Firebase Storage"""
        try:
            # Generate unique filename
            file_extension = filename.split('.')[-1] if '.' in filename else ''
            unique_filename = f"{uuid.uuid4()}.{file_extension}"

            # Create blob
            blob = self.bucket.blob(unique_filename)
            blob.content_type = content_type

            # Upload file
            blob.upload_from_file(file, content_type=content_type)

            return {
                "file_path": unique_filename,
                "bucket": self.bucket.name,
                "url": blob.public_url if blob.public_url else blob.generate_signed_url(datetime.timedelta(hours=1)),
                "size": blob.size
            }

        except Exception as e:
            raise Exception(f"Firebase upload failed: {str(e)}")

    async def download_file(self, file_path: str) -> bytes:
        """Download file from Firebase Storage"""
        try:
            blob = self.bucket.blob(file_path)
            return blob.download_as_bytes()
        except Exception as e:
            raise Exception(f"Firebase download failed: {str(e)}")

    async def delete_file(self, file_path: str) -> bool:
        """Delete file from Firebase Storage"""
        try:
            blob = self.bucket.blob(file_path)
            blob.delete()
            return True
        except Exception:
            return False

    async def get_file_url(self, file_path: str, expires_in: int = 3600) -> str:
        """Generate signed URL for Firebase Storage"""
        try:
            blob = self.bucket.blob(file_path)
            return blob.generate_signed_url(expiration=datetime.timedelta(seconds=expires_in))
        except Exception as e:
            raise Exception(f"Failed to generate signed URL: {str(e)}")
```

## ⚡ Background Processing

### Celery Task Queue

#### Task Configuration
```python
from celery import Celery
from flask import current_app

def make_celery(app):
    """Create Celery instance"""
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    celery.conf.update(app.config)

    class ContextTask(celery.Task):
        """Make celery tasks work with Flask app context"""
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery

# Initialize Celery
celery = make_celery(current_app)
```

#### Image Generation Tasks
```python
from .ai_service_manager import ai_service_manager
from .storage_service import storage_service

@celery.task(bind=True)
def generate_storyboard_image(self, shot_id: str, prompt: str, options: Dict[str, Any]):
    """Background task for generating storyboard images"""
    try:
        # Update shot status to processing
        shot = Shot.query.get(shot_id)
        shot.image_status = 'generating'
        db.session.commit()

        # Select AI service (could be based on user preference or load balancing)
        service_name = options.get('service', 'stable_diffusion')

        # Generate image
        result = await ai_service_manager.generate_image(service_name, prompt, options)

        if result['status'] == 'completed':
            # Store image
            image_url = result['image_url']

            # Update shot with image URL
            shot.image_url = image_url
            shot.image_status = 'completed'
            db.session.commit()

            return {'status': 'success', 'image_url': image_url}

        elif result['status'] == 'processing':
            # For async services, store job ID for status checking
            shot.generation_job_id = result['job_id']
            db.session.commit()

            return {'status': 'processing', 'job_id': result['job_id']}

    except Exception as e:
        # Update shot status to failed
        shot.image_status = 'failed'
        shot.error_message = str(e)
        db.session.commit()

        raise self.retry(countdown=60, exc=e)

@celery.task
def process_script_parsing(project_id: str, script_text: str):
    """Background task for parsing scripts and extracting data"""
    try:
        from .nlp_service import script_parser

        # Parse script
        parsed_data = script_parser.parse_script(script_text)

        # Update project with parsed data
        project = Project.query.get(project_id)
        project.parsed_data = parsed_data
        project.status = 'parsed'
        db.session.commit()

        # Create character records
        for char_name in parsed_data['characters']:
            character = Character(
                project_id=project_id,
                name=char_name,
                role='detected'  # Will be refined by user
            )
            db.session.add(character)

        db.session.commit()

        return {'status': 'success', 'characters_found': len(parsed_data['characters'])}

    except Exception as e:
        project.status = 'parsing_failed'
        project.error_message = str(e)
        db.session.commit()
        raise e

@celery.task
def generate_export(export_id: str):
    """Background task for generating project exports"""
    try:
        from .export_service import export_generator

        export = Export.query.get(export_id)
        export.status = 'processing'
        db.session.commit()

        # Generate export based on type
        if export.export_type == 'pdf':
            result = export_generator.generate_pdf_export(export)
        elif export.export_type == 'images':
            result = export_generator.generate_image_export(export)
        else:
            raise ValueError(f"Unsupported export type: {export.export_type}")

        # Update export with result
        export.status = 'completed'
        export.file_url = result['file_url']
        export.completed_at = datetime.utcnow()
        db.session.commit()

        return {'status': 'success', 'file_url': result['file_url']}

    except Exception as e:
        export.status = 'failed'
        export.error_message = str(e)
        db.session.commit()
        raise e
```

### Task Scheduling

#### Periodic Tasks
```python
from celery.schedules import crontab

celery.conf.beat_schedule = {
    'cleanup-temp-files': {
        'task': 'app.tasks.cleanup_temp_files',
        'schedule': crontab(hour=2, minute=0),  # Daily at 2 AM
    },
    'update-ai-service-status': {
        'task': 'app.tasks.update_ai_service_status',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
}

@celery.task
def cleanup_temp_files():
    """Clean up temporary files older than 24 hours"""
    # Implementation for cleanup
    pass

@celery.task
def update_ai_service_status():
    """Check and update AI service availability"""
    # Implementation for status checking
    pass
```

## 🔒 Security Implementation

### Input Validation & Sanitization

#### Request Validation
```python
from marshmallow import Schema, fields, ValidationError, validates
from werkzeug.utils import secure_filename

class ProjectCreateSchema(Schema):
    title = fields.Str(required=True, validate=lambda x: 1 <= len(x) <= 255)
    description = fields.Str(validate=lambda x: len(x) <= 1000)
    script_text = fields.Str(validate=lambda x: len(x) <= 100000)

    @validates('title')
    def validate_title(self, value):
        if not value.strip():
            raise ValidationError("Title cannot be empty or whitespace only")

class AssetUploadSchema(Schema):
    file = fields.Raw(required=True)

    @validates('file')
    def validate_file(self, value):
        if not hasattr(value, 'filename'):
            raise ValidationError("Invalid file")

        filename = secure_filename(value.filename)

        # Check file extension
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'mp4', 'wav'}
        if not any(filename.endswith(ext) for ext in allowed_extensions):
            raise ValidationError("File type not allowed")

        # Check file size (10MB limit)
        value.seek(0, 2)  # Seek to end
        size = value.tell()
        value.seek(0)  # Reset to beginning

        if size > 10 * 1024 * 1024:  # 10MB
            raise ValidationError("File too large (max 10MB)")

def validate_request_data(schema_class, data):
    """Validate request data against schema"""
    schema = schema_class()
    try:
        return schema.load(data), None
    except ValidationError as err:
        return None, err.messages
```

### SQL Injection Prevention

#### Parameterized Queries
```python
# Safe query with SQLAlchemy
def get_user_projects(user_id: str, limit: int = 20, offset: int = 0):
    """Get user projects with pagination"""
    return Project.query.filter_by(user_id=user_id)\
                       .order_by(Project.updated_at.desc())\
                       .limit(limit)\
                       .offset(offset)\
                       .all()

# Safe dynamic filtering
def search_projects(user_id: str, search_term: str = None, status: str = None):
    """Search user projects"""
    query = Project.query.filter_by(user_id=user_id)

    if search_term:
        # Use SQLAlchemy text() for safe LIKE queries
        query = query.filter(Project.title.ilike(f'%{search_term}%'))

    if status:
        query = query.filter_by(status=status)

    return query.all()
```

### XSS Protection

#### Content Sanitization
```python
from bleach import clean

def sanitize_html(content: str) -> str:
    """Sanitize HTML content to prevent XSS"""
    allowed_tags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3']
    allowed_attributes = {}

    return clean(content, tags=allowed_tags, attributes=allowed_attributes, strip=True)

def sanitize_script_input(script_text: str) -> str:
    """Sanitize script input"""
    # Remove potentially dangerous content
    sanitized = script_text.replace('<script', '').replace('</script', '')
    sanitized = sanitize_html(sanitized)

    return sanitized
```

### CORS Configuration

#### CORS Setup
```python
from flask_cors import CORS

def configure_cors(app):
    """Configure CORS for the Flask app"""
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5176",  # Development
                "https://storyai.com",    # Production
                "https://app.storyai.com"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["X-Total-Count"],
            "supports_credentials": True,
            "max_age": 86400  # 24 hours
        }
    })
```

### API Key Management

#### Secure Key Storage
```python
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRE = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRE', 900))  # 15 minutes
    JWT_REFRESH_TOKEN_EXPIRE = int(os.getenv('JWT_REFRESH_TOKEN_EXPIRE', 604800))  # 7 days

    # AI Services
    STABLE_DIFFUSION_API_KEY = os.getenv('STABLE_DIFFUSION_API_KEY')
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

    # Storage
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')

    # Redis/Celery
    CELERY_BROKER_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

    # Security
    SECRET_KEY = os.getenv('SECRET_KEY')

    # Rate Limiting
    RATELIMIT_STORAGE_URL = os.getenv('REDIS_URL')

# Validate required environment variables
required_vars = [
    'DATABASE_URL', 'JWT_SECRET_KEY', 'SECRET_KEY'
]

for var in required_vars:
    if not os.getenv(var):
        raise ValueError(f"Required environment variable {var} is not set")
```

## 📈 Performance Optimization

### Database Optimization

#### Connection Pooling
```python
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.pool import QueuePool

class Config:
    SQLALCHEMY_ENGINE_OPTIONS = {
        'poolclass': QueuePool,
        'pool_size': 10,
        'max_overflow': 20,
        'pool_recycle': 3600,  # Recycle connections after 1 hour
        'pool_pre_ping': True   # Check connection health before use
    }
```

#### Query Optimization
```python
# Use selectinload for eager loading related data
from sqlalchemy.orm import selectinload

def get_project_with_characters(project_id: str):
    """Get project with eagerly loaded characters"""
    return Project.query.options(
        selectinload(Project.characters)
    ).filter_by(id=project_id).first()

# Use pagination for large result sets
def get_user_assets_paginated(user_id: str, page: int = 1, per_page: int = 20):
    """Get paginated user assets"""
    return Asset.query.filter_by(user_id=user_id)\
                     .order_by(Asset.uploaded_at.desc())\
                     .paginate(page=page, per_page=per_page, error_out=False)
```

### Caching Strategy

#### Redis Caching
```python
import redis
from flask_caching import Cache

cache = Cache(config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_URL': os.getenv('REDIS_URL')
})

# Cache expensive operations
@cache.memoize(timeout=300)  # Cache for 5 minutes
def get_ai_service_status(service_name: str):
    """Cache AI service status checks"""
    return ai_service_manager.check_service_status(service_name)

# Cache user data
@cache.memoize(timeout=600)  # Cache for 10 minutes
def get_user_projects_cached(user_id: str):
    """Cache user projects list"""
    return get_user_projects(user_id)
```

#### Response Caching
```python
@app.after_request
def add_cache_headers(response):
    """Add cache headers to responses"""
    if request.method == 'GET' and response.status_code == 200:
        # Cache static assets for 1 hour
        if request.path.startswith('/api/assets/'):
            response.cache_control.max_age = 3600
        # Cache user data for 5 minutes
        elif request.path.startswith('/api/projects/'):
            response.cache_control.max_age = 300

    return response
```

### API Optimization

#### Response Compression
```python
from flask_compress import Compress

compress = Compress()
compress.init_app(app)
```

#### Request Batching
```python
@app.route('/api/batch', methods=['POST'])
@require_auth
def batch_requests():
    """Handle multiple API requests in a single call"""
    requests = request.json.get('requests', [])

    results = []
    for req in requests:
        try:
            # Process each request
            result = process_single_request(req)
            results.append({
                'id': req.get('id'),
                'result': result,
                'error': None
            })
        except Exception as e:
            results.append({
                'id': req.get('id'),
                'result': None,
                'error': str(e)
            })

    return jsonify({'results': results})
```

## 🧪 Testing Strategy

### Unit Testing

#### Model Testing
```python
import pytest
from app.models import User, Project

class TestUserModel:
    def test_password_hashing(self):
        user = User(email='test@example.com')
        user.set_password('password123')

        assert user.check_password('password123')
        assert not user.check_password('wrongpassword')

    def test_user_creation(self):
        user = User(email='test@example.com', full_name='Test User')
        assert user.email == 'test@example.com'
        assert user.full_name == 'Test User'
        assert user.is_active == True
```

#### Service Testing
```python
from app.services.nlp_service import ScriptParser

class TestScriptParser:
    def test_parse_simple_script(self):
        parser = ScriptParser()
        script = """
        INT. COFFEE SHOP - DAY

        JOHN, 30s, sits at a table.

        John sips his coffee.
        """

        result = parser.parse_script(script)

        assert len(result['scenes']) == 1
        assert 'JOHN' in result['characters']
        assert result['scenes'][0]['heading'] == 'INT. COFFEE SHOP - DAY'
```

### Integration Testing

#### API Testing
```python
import pytest
from app import create_app

class TestProjectAPI:
    def test_create_project(self, client, auth_headers):
        data = {
            'title': 'Test Project',
            'description': 'A test project'
        }

        response = client.post('/api/projects', json=data, headers=auth_headers)

        assert response.status_code == 201
        data = response.get_json()
        assert data['success'] == True
        assert data['data']['title'] == 'Test Project'

    def test_get_projects_unauthorized(self, client):
        response = client.get('/api/projects')
        assert response.status_code == 401
```

#### Database Testing
```python
def test_project_creation_db(db_session):
    user = User(email='test@example.com', full_name='Test User')
    db_session.add(user)
    db_session.commit()

    project = Project(
        user_id=user.id,
        title='Test Project',
        description='Test description'
    )
    db_session.add(project)
    db_session.commit()

    # Verify project was created
    saved_project = db_session.query(Project).filter_by(id=project.id).first()
    assert saved_project.title == 'Test Project'
    assert saved_project.user_id == user.id
```

### End-to-End Testing

#### User Journey Testing
```python
def test_complete_user_journey(client):
    # Register user
    register_data = {
        'email': 'test@example.com',
        'password': 'password123',
        'full_name': 'Test User'
    }
    response = client.post('/api/auth/register', json=register_data)
    assert response.status_code == 201

    # Login
    login_data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    response = client.post('/api/auth/login', json=login_data)
    assert response.status_code == 200

    auth_token = response.get_json()['data']['access_token']
    headers = {'Authorization': f'Bearer {auth_token}'}

    # Create project
    project_data = {
        'title': 'My First Project',
        'description': 'Testing the complete workflow'
    }
    response = client.post('/api/projects', json=project_data, headers=headers)
    assert response.status_code == 201

    project_id = response.get_json()['data']['id']

    # Upload script
    script_data = {
        'script_text': 'INT. ROOM - DAY\n\nJOHN enters.\n\nJohn: Hello world!'
    }
    response = client.put(f'/api/projects/{project_id}', json=script_data, headers=headers)
    assert response.status_code == 200
```

## 🚀 Deployment Architecture

### Docker Configuration

#### Dockerfile
```dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["python", "run.py"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/storyai
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=storyai
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  worker:
    build: .
    command: celery -A app.celery worker --loglevel=info
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/storyai
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

volumes:
  postgres_data:
```

### Production Deployment

#### Environment Setup
```bash
# Production environment variables
export FLASK_ENV=production
export DATABASE_URL=postgresql://user:password@prod-db:5432/storyai
export REDIS_URL=redis://prod-redis:6379/0
export JWT_SECRET_KEY=your-super-secret-jwt-key
export SECRET_KEY=your-super-secret-key
export STABLE_DIFFUSION_API_KEY=your-sd-api-key
export OPENAI_API_KEY=your-openai-api-key
export AWS_ACCESS_KEY_ID=your-aws-key
export AWS_SECRET_ACCESS_KEY=your-aws-secret
export AWS_S3_BUCKET_NAME=your-bucket-name
```

#### Nginx Configuration
```nginx
upstream storyai_app {
    server app:8000;
}

server {
    listen 80;
    server_name storyai.com www.storyai.com;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # API routes
    location /api/ {
        proxy_pass http://storyai_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /app/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (served by frontend container)
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Monitoring & Logging

#### Application Monitoring
```python
from flask import g, request
import time
import logging

@app.before_request
def start_timer():
    g.start = time.time()

@app.after_request
def log_request(response):
    if request.path.startswith('/api/'):
        duration = time.time() - g.start
        logging.info(f"{request.method} {request.path} - {response.status_code} - {duration:.2f}s")
    return response

# Health check endpoint
@app.route('/health')
def health_check():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }
```

#### Error Tracking
```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0,
    environment=os.getenv('FLASK_ENV', 'development')
)

@app.errorhandler(Exception)
def handle_error(error):
    # Log error
    logging.error(f"Unhandled error: {str(error)}", exc_info=True)

    # Return appropriate error response
    if isinstance(error, ValidationError):
        return jsonify({
            'success': False,
            'error': {
                'code': 'VALIDATION_ERROR',
                'message': 'Invalid input data',
                'details': error.messages
            }
        }), 400

    # For production, don't expose internal errors
    if os.getenv('FLASK_ENV') == 'production':
        return jsonify({
            'success': False,
            'error': {
                'code': 'INTERNAL_ERROR',
                'message': 'An internal error occurred'
            }
        }), 500

    # For development, show full error
    return jsonify({
        'success': False,
        'error': {
            'code': 'INTERNAL_ERROR',
            'message': str(error)
        }
    }), 500
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "access_token": "jwt-token",
    "refresh_token": "refresh-jwt-token"
  },
  "message": "User registered successfully"
}
```

#### POST /api/auth/login
Authenticate user and return tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

### Project Management Endpoints

#### GET /api/projects
Get user's projects list.

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20)
- `search` (string): Search term for project titles

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "My Storyboard Project",
        "description": "A film storyboard",
        "status": "active",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-16T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "total_pages": 1,
      "has_next": false,
      "has_prev": false
    }
  }
}
```

#### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "script_text": "INT. ROOM - DAY\n\nAction here..."
}
```

### AI Image Generation Endpoints

#### POST /api/shots/{shot_id}/generate-image
Generate AI image for a storyboard shot.

**Request Body:**
```json
{
  "service": "stable_diffusion",
  "enhance_prompt": true,
  "style": "cinematic",
  "width": 1024,
  "height": 1024
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "generation-job-uuid",
    "status": "processing",
    "estimated_time": 30
  },
  "message": "Image generation started"
}
```

#### GET /api/shots/{shot_id}/image-status
Check image generation status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "image_url": "https://storage.example.com/generated-image.jpg",
    "job_id": "generation-job-uuid"
  }
}
```

### Asset Management Endpoints

#### POST /api/assets/upload
Upload a file asset.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: The file to upload
- `project_id` (optional): Associate with a project

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "filename": "scene-background.jpg",
    "file_path": "assets/uuid.jpg",
    "file_size": 2457600,
    "mime_type": "image/jpeg",
    "file_type": "image",
    "url": "https://storage.example.com/assets/uuid.jpg"
  },
  "message": "File uploaded successfully"
}
```

---

This comprehensive backend architecture provides a robust, scalable foundation for the StoryAI application. The modular design ensures maintainability, while the security-first approach protects user data and API endpoints. The integration with your existing React frontend will provide a seamless full-stack experience for independent creators.