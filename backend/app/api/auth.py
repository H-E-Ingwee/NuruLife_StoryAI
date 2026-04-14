from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from app.auth.auth_service import AuthService
from app.models import User
import logging

logger = logging.getLogger(__name__)
auth_bp = Blueprint('auth', __name__)

class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 8)
    full_name = fields.Str(required=True)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class RefreshSchema(Schema):
    refresh_token = fields.Str(required=True)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        logger.info("Register request received")
        data = RegisterSchema().load(request.json)
    except ValidationError as e:
        logger.error(f"Validation error: {e.messages}")
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user, err = AuthService.register_user(data['email'], data['password'], data['full_name'])
    if err == 'EMAIL_EXISTS':
        return jsonify({'success': False, 'error': {'code': 'EMAIL_EXISTS', 'message': 'Email already registered'}}), 409

    tokens = AuthService.create_tokens(user)
    return jsonify({'success': True, 'data': {'user': user.to_dict(), **tokens}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        logger.info(f"Login request received: {request.data}")
        data = LoginSchema().load(request.json)
        logger.info(f"Login data validated for: {data.get('email')}")
    except ValidationError as e:
        logger.error(f"Validation error: {e.messages}")
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400
    except Exception as e:
        logger.error(f"Request parsing error: {e}")
        return jsonify({'success': False, 'error': {'code': 'REQUEST_ERROR', 'message': str(e)}}), 400

    try:
        user = AuthService.authenticate_user(data['email'], data['password'])
        if user is None:
            logger.warning(f"Failed login attempt for: {data['email']}")
            return jsonify({'success': False, 'error': {'code': 'INVALID_CREDENTIALS', 'message': 'Email or password invalid'}}), 401

        tokens = AuthService.create_tokens(user)
        logger.info(f"User logged in: {user.email}")
        return jsonify({'success': True, 'data': {'user': user.to_dict(), **tokens}}), 200
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return jsonify({'success': False, 'error': {'code': 'SERVER_ERROR', 'message': 'Internal server error'}}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'error': {'code': 'USER_NOT_FOUND', 'message': 'User not found'}}), 404
    return jsonify({'success': True, 'data': user.to_dict()}), 200

@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """
    Refresh access token.

    Note: the frontend sends `refresh_token` in the JSON body (not in Authorization header),
    so we validate it manually using `decode_token` instead of `@jwt_required(refresh=True)`.
    """
    try:
        data = RefreshSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    refresh_token = data['refresh_token']
    try:
        decoded = decode_token(refresh_token)
        token_type = decoded.get('type')
        user_id = decoded.get('sub') or decoded.get('identity')
    except Exception:
        return jsonify({'success': False, 'error': {'code': 'INVALID_TOKEN', 'message': 'Invalid or expired token'}}), 401

    if token_type != 'refresh' or not user_id:
        return jsonify({'success': False, 'error': {'code': 'INVALID_TOKEN', 'message': 'Invalid or expired token'}}), 401

    user = User.query.get(user_id)
    if not user or not getattr(user, 'is_active', True):
        return jsonify({'success': False, 'error': {'code': 'INVALID_TOKEN', 'message': 'Invalid or expired token'}}), 401

    tokens = AuthService.create_tokens(user)
    return jsonify({'success': True, 'data': tokens}), 200
