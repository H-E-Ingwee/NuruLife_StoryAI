from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_caching import Cache
from flask_compress import Compress

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cache = Cache()
compress = Compress()