from flask import Flask, jsonify
try:
    from flask_cors import CORS
except ModuleNotFoundError:  # pragma: no cover
    CORS = None
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
try:
    # Optional dependency: migrations are not required for MVP/test execution.
    from flask_migrate import Migrate
except ModuleNotFoundError:  # pragma: no cover
    Migrate = None
try:
    from flask_caching import Cache
except ModuleNotFoundError:  # pragma: no cover
    Cache = None

try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
except ModuleNotFoundError:  # pragma: no cover
    Limiter = None
    get_remote_address = None

try:
    from flask_compress import Compress
except ModuleNotFoundError:  # pragma: no cover
    Compress = None
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate() if Migrate is not None else None
cache = Cache() if Cache is not None else None
compress = Compress() if Compress is not None else None

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
    if migrate is not None:
        migrate.init_app(app, db)
    if cache is not None:
        try:
            cache.init_app(app)
        except Exception:  # pragma: no cover
            # Cache is not required for unit tests / MVP flows.
            pass
    if compress is not None:
        try:
            compress.init_app(app)
        except Exception:  # pragma: no cover
            pass

    if CORS is not None:
        CORS(app, resources={
            r'/api/*': {
                'origins': ['http://localhost:5176', 'http://localhost:3000'],
                    'supports_credentials': True
                }
            })

    # if Limiter is not None and get_remote_address is not None:
    #     Limiter(app=app, key_func=get_remote_address, default_limits=['200/day', '50/hour'])

    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'timestamp': datetime.utcnow().isoformat(), 'version': '1.0.0'}

    return app
