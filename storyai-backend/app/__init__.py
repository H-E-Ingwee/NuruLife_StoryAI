from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_compress import Compress
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cache = Cache()
compress = Compress()

def create_app(config_class=None):
    app = Flask(__name__)

    # Config
    if config_class:
        app.config.from_object(config_class)
    else:
        app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cache.init_app(app)
    compress.init_app(app)

    CORS(app, resources={
        r'/api/*': {
            'origins': ['http://localhost:5176', 'http://localhost:3000'],
            'supports_credentials': True
        }
    })

    limiter = Limiter(app, key_func=get_remote_address, default_limits=['200/day', '50/hour'])

    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'timestamp': datetime.utcnow().isoformat(), 'version': '1.0.0'}

    return app
