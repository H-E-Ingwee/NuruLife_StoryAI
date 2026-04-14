from flask import Flask, jsonify
try:
    from flask_cors import CORS
except ModuleNotFoundError:  # pragma: no cover
    CORS = None
from datetime import datetime
from dotenv import load_dotenv

# Import extensions from the dedicated extensions module
from app.extensions import db, jwt, migrate, cache, compress

# Load environment variables
load_dotenv()

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
                'origins': ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5176', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
                'supports_credentials': True,
                'methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                'allow_headers': ['Content-Type', 'Authorization']
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
