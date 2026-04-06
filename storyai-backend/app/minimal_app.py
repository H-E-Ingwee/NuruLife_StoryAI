rom flask import Flask, jsonify
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app(config_class=None):
    """Application factory pattern"""
    app = Flask(__name__)

    # Basic configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        }

    # Basic API endpoint
    @app.route('/api/test')
    def test_api():
        return jsonify({
            'success': True,
            'message': 'StoryAI Backend API is running!',
            'timestamp': datetime.utcnow().isoformat()
        })

    return app