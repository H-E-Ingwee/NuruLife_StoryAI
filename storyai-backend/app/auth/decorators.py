rom functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User

# Generic auth guard
def login_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_active:
            return jsonify({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': 'Invalid credentials'}}), 401
        return fn(*args, **kwargs)
    return wrapper
