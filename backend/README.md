# StoryAI Backend

A comprehensive backend system for AI-powered storyboard creation and management.

## Features

- User authentication and authorization
- Project and character management
- AI-powered image generation
- NLP script processing
- File storage and asset management
- Background task processing
- RESTful API design

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Initialize database:
```bash
flask db init
flask db migrate
flask db upgrade
```

5. Run the application:
```bash
python run.py
```