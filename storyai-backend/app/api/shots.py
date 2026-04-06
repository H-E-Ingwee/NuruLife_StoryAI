mport os
from urllib.parse import urlparse

from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError

from app.extensions import db
from app.models import Shot, Storyboard, Project, Asset
from app.ai.ai_service_manager import ai_service_manager


shots_bp = Blueprint('shots', __name__)


class ShotUpdateSchema(Schema):
    scene = fields.Str(required=False, allow_none=True)
    action = fields.Str(required=False, allow_none=True)
    prompt = fields.Str(required=False, allow_none=True)
    shotSize = fields.Str(required=False, allow_none=True)
    cameraAngle = fields.Str(required=False, allow_none=True)
    lens = fields.Str(required=False, allow_none=True)
    notes = fields.Str(required=False, allow_none=True)

    consistency_data = fields.Dict(required=False)
    camera_settings = fields.Dict(required=False)


class GenerateImageSchema(Schema):
    service = fields.Str(required=False, allow_none=True)
    prompt = fields.Str(required=False, allow_none=True)
    width = fields.Int(required=False, allow_none=True)
    height = fields.Int(required=False, allow_none=True)
    consistency = fields.Dict(required=False)


def _ensure_generated_shots_folder() -> str:
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        upload_folder = os.path.join(os.getcwd(), 'uploads')

    generated_folder = os.path.join(upload_folder, 'generated_shots')
    os.makedirs(generated_folder, exist_ok=True)
    return generated_folder


def _detect_image_type(image_bytes: bytes) -> tuple[str, str]:
    """
    Returns (extension, mimetype) for basic image types.
    """
    if not image_bytes:
        return 'png', 'image/png'

    # PNG signature
    if image_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'png', 'image/png'
    # JPEG signature
    if image_bytes.startswith(b'\xff\xd8\xff'):
        return 'jpg', 'image/jpeg'
    # GIF signature
    if image_bytes.startswith(b'GIF87a') or image_bytes.startswith(b'GIF89a'):
        return 'gif', 'image/gif'

    return 'png', 'image/png'


def _save_image_bytes_for_shot(shot_id: str, image_bytes: bytes) -> str:
    generated_folder = _ensure_generated_shots_folder()
    ext, _mimetype = _detect_image_type(image_bytes)
    filename = f"{shot_id}.{ext}"
    abs_path = os.path.join(generated_folder, filename)
    with open(abs_path, 'wb') as f:
        f.write(image_bytes)

    # Frontend should use this URL for the <img>.
    return f"/api/shots/{shot_id}/image"


def _get_user_shot(user_id: str, shot_id: str):
    return (
        Shot.query.join(Storyboard, Shot.storyboard_id == Storyboard.id)
        .join(Project, Storyboard.project_id == Project.id)
        .filter(Project.user_id == user_id, Shot.id == shot_id)
        .first()
    )


@shots_bp.route('/<shot_id>', methods=['GET'])
@jwt_required()
def get_shot(shot_id):
    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404
    return jsonify({'success': True, 'data': shot.to_dict()}), 200


@shots_bp.route('/<shot_id>', methods=['PUT'])
@jwt_required()
def update_shot(shot_id):
    try:
        data = ShotUpdateSchema().load(request.json or {}, partial=True)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    # Map client-friendly keys to model columns
    if 'shotSize' in data:
        shot.shot_size = data.get('shotSize')
    if 'cameraAngle' in data:
        shot.camera_angle = data.get('cameraAngle')
    if 'consistency_data' in data:
        shot.consistency_data = data.get('consistency_data') or {}
    if 'camera_settings' in data:
        shot.camera_settings = data.get('camera_settings') or {}

    for key, value in data.items():
        if key in {'shotSize', 'cameraAngle', 'consistency_data', 'camera_settings'}:
            continue
        setattr(shot, key, value)

    db.session.commit()
    return jsonify({'success': True, 'data': shot.to_dict()}), 200


@shots_bp.route('/<shot_id>', methods=['DELETE'])
@jwt_required()
def delete_shot(shot_id):
    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    db.session.delete(shot)
    db.session.commit()
    return jsonify({'success': True, 'data': {'message': 'Shot deleted'}}), 200


@shots_bp.route('/<shot_id>/generate-image', methods=['POST'])
@jwt_required()
def generate_image_for_shot(shot_id):
    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    try:
        data = GenerateImageSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    service_name = (data.get('service') or shot.consistency_data.get('service') or 'dalle').lower()
    prompt = data.get('prompt') or shot.prompt
    if not prompt or not prompt.strip():
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'message': 'prompt is empty'}}), 400

    width = data.get('width') or 1024
    height = data.get('height') or 1024
    consistency = data.get('consistency') or {}

    # Consistency locks:
    # - When the frontend requests lockSeed/lockStyle, persist them into the shot's consistency_data
    # - Include identity + style blocks in the generation prompt
    shot.consistency_data = shot.consistency_data or {}
    locked_seed = consistency.get('lockSeed', shot.consistency_data.get('lockedSeed', False))
    locked_style = consistency.get('lockStyle', shot.consistency_data.get('lockedStyle', False))

    shot.consistency_data['lockedSeed'] = bool(locked_seed)
    shot.consistency_data['lockedStyle'] = bool(locked_style)

    style_prompt = ''
    global_seed = None
    try:
        storyboard = Storyboard.query.filter_by(id=shot.storyboard_id).first()
        if storyboard:
            project = Project.query.filter_by(id=storyboard.project_id, user_id=user_id).first()
            if project and project.settings:
                style_prompt = project.settings.get('global_style_prompt') or ''
                global_seed = project.settings.get('global_seed')
    except Exception:
        # If settings can't be loaded, keep generation prompt best-effort.
        pass

    character_names = shot.consistency_data.get('character_names') or []
    if isinstance(character_names, list) and character_names:
        prompt = (
            f"Identity continuity (consistent character design): {', '.join(character_names)}. "
            f"{prompt}"
        )

    if locked_style and style_prompt:
        prompt = f"{style_prompt}. {prompt}"

    # MVP "reference images" wiring:
    # - resolve asset IDs to known filenames
    # - append them to the prompt so a later model-specific provider can use them
    #   (OpenAI DALL-E doesn't support reference images; SD providers can).
    reference_asset_ids = consistency.get('referenceImageAssetIds') or consistency.get('reference_asset_ids') or []
    if isinstance(reference_asset_ids, list) and reference_asset_ids:
        assets = (
            Asset.query.filter(Asset.user_id == user_id, Asset.id.in_(reference_asset_ids))
            .order_by(Asset.uploaded_at.desc())
            .all()
        )
        filenames = [a.original_filename or a.filename for a in assets if a]
        if filenames:
            prompt = f"{prompt} Reference images: {', '.join(filenames)}."
            consistency['resolvedReferenceFilenames'] = filenames

    try:
        service = ai_service_manager.get_service(service_name)
        result = service.generate_image(prompt, {
            'width': width,
            'height': height,
            'consistency': consistency,
            **({'seed': global_seed} if locked_seed and global_seed is not None else {}),
        })
    except ValueError as e:
        # If the preferred provider isn't configured, fall back to DALL-E (often available with OPENAI_API_KEY).
        if service_name != 'dalle':
            try:
                fallback_service = ai_service_manager.get_service('dalle')
                result = fallback_service.generate_image(prompt, {
                    'width': width,
                    'height': height,
                    'consistency': consistency,
                })
            except Exception:
                return jsonify({'success': False, 'error': {'code': 'SERVICE_NOT_AVAILABLE', 'message': str(e)}}), 503
        else:
            return jsonify({'success': False, 'error': {'code': 'SERVICE_NOT_AVAILABLE', 'message': str(e)}}), 503
    except Exception as e:
        shot.image_status = 'failed'
        db.session.commit()
        return jsonify({'success': False, 'error': {'code': 'GENERATION_FAILED', 'message': str(e)}}), 500

    # Persist metadata for polling / continuity.
    shot.consistency_data = shot.consistency_data or {}
    shot.consistency_data['service'] = service_name
    shot.consistency_data['last_generation'] = {
        'width': width,
        'height': height,
    }
    shot.prompt = prompt
    shot.generation_job_id = result.get('job_id')

    if result.get('status') == 'completed':
        image_bytes = result.get('image_bytes') or b''
        image_url = _save_image_bytes_for_shot(shot.id, image_bytes)
        shot.image_url = image_url
        shot.image_status = 'completed'
    elif result.get('status') == 'processing':
        shot.image_status = 'processing'
    else:
        shot.image_status = 'failed'

    db.session.commit()

    return jsonify({
        'success': True,
        'data': {
            'job_id': shot.generation_job_id,
            'status': shot.image_status,
            'image_url': shot.image_url,
        }
    }), 200


@shots_bp.route('/<shot_id>/image-status', methods=['GET'])
@jwt_required()
def get_image_status(shot_id):
    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    # Poll async providers on demand.
    if shot.image_status == 'processing' and shot.generation_job_id:
        service_name = (shot.consistency_data or {}).get('service') or 'dalle'
        try:
            service = ai_service_manager.get_service(service_name)
            result = service.check_job_status(shot.generation_job_id)

            if result.get('status') == 'completed':
                image_bytes = result.get('image_bytes') or b''
                shot.image_url = _save_image_bytes_for_shot(shot.id, image_bytes)
                shot.image_status = 'completed'
                shot.generation_job_id = result.get('job_id') or shot.generation_job_id
                db.session.commit()
            elif result.get('status') == 'failed':
                shot.image_status = 'failed'
                db.session.commit()
        except Exception:
            # Keep current status; frontend can retry.
            pass

    return jsonify({
        'success': True,
        'data': {
            'job_id': shot.generation_job_id,
            'image_status': shot.image_status,
            'image_url': shot.image_url,
        }
    }), 200


@shots_bp.route('/<shot_id>/image', methods=['GET'])
def serve_shot_image(shot_id):
    # MVP note: images are served without JWT so <img src="..."> can render in the browser.
    # Later we can replace this with signed URLs / authenticated fetch+Blob URLs.
    shot = Shot.query.get(shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    generated_folder = _ensure_generated_shots_folder()
    candidates = [
        os.path.join(generated_folder, f"{shot_id}.png"),
        os.path.join(generated_folder, f"{shot_id}.jpg"),
        os.path.join(generated_folder, f"{shot_id}.jpeg"),
        os.path.join(generated_folder, f"{shot_id}.gif"),
    ]

    abs_path = next((p for p in candidates if os.path.exists(p)), None)
    if not abs_path:
        return jsonify({'success': False, 'error': {'code': 'IMAGE_NOT_READY', 'message': 'Image not ready'}}), 404

    # Rough mimetype detection by extension.
    if abs_path.endswith('.png'):
        mimetype = 'image/png'
    elif abs_path.endswith('.gif'):
        mimetype = 'image/gif'
    else:
        mimetype = 'image/jpeg'

    return send_file(abs_path, mimetype=mimetype)

