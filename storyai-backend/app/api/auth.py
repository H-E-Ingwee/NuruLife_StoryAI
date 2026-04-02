from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.auth.auth_service import AuthService
from app.models import User

auth_bp = Blueprint('auth', __name__)

class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda x: len(x) >= 8)
    full_name = fields.Str(required=True)

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = RegisterSchema().load(request.json)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user, err = AuthService.register_user(data['email'], data['password'], data['full_name'])
    if err == 'EMAIL_EXISTS':
        return jsonify({'success': False, 'error': {'code': 'EMAIL_EXISTS', 'message': 'Email already registered'}}), 409

    tokens = AuthService.create_tokens(user)
    return jsonify({'success': True, 'data': {'user': user.to_dict(), **tokens}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = LoginSchema().load(request.json)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user = AuthService.authenticate_user(data['email'], data['password'])
    if user is None:
        return jsonify({'success': False, 'error': {'code': 'INVALID_CREDENTIALS', 'message': 'Email or password invalid'}}), 401

    tokens = AuthService.create_tokens(user)
    return jsonify({'success': True, 'data': {'user': user.to_dict(), **tokens}}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'error': {'code': 'USER_NOT_FOUND', 'message': 'User not found'}}), 404
    return jsonify({'success': True, 'data': user.to_dict()}), 200
