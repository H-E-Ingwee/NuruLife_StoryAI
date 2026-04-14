from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

try:
    from flask_migrate import Migrate
except ModuleNotFoundError:  # pragma: no cover
    Migrate = None

try:
    from flask_caching import Cache
except ModuleNotFoundError:  # pragma: no cover
    Cache = None

try:
    from flask_compress import Compress
except ModuleNotFoundError:  # pragma: no cover
    Compress = None

try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
except ModuleNotFoundError:  # pragma: no cover
    Limiter = None
    get_remote_address = None

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate() if Migrate is not None else None
cache = Cache() if Cache is not None else None
compress = Compress() if Compress is not None else None
