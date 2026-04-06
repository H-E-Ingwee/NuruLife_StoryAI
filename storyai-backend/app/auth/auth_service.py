rom datetime import datetime
from flask_jwt_extended import create_access_token, create_refresh_token
from app.models import User
from app.extensions import db

class AuthService:
    @staticmethod
    def register_user(email: str, password: str, full_name: str):
        existing = User.query.filter_by(email=email).first()
        if existing:
            return None, 'EMAIL_EXISTS'

        user = User(email=email, full_name=full_name)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user, None

    @staticmethod
    def authenticate_user(email: str, password: str):
        user = User.query.filter_by(email=email).first()
        if user is None or not user.check_password(password):
            return None
        user.last_login = datetime.utcnow() if hasattr(user, 'last_login') else None
        db.session.commit()
        return user

    @staticmethod
    def create_tokens(user):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        }
