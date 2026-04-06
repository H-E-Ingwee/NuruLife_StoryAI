import uuid
from datetime import datetime

from app.extensions import db


class Shot(db.Model):
    __tablename__ = 'shots'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    storyboard_id = db.Column(db.String(36), db.ForeignKey('storyboards.id'), nullable=False)
    storyboard = db.relationship('Storyboard', backref='shots')

    # Script-derived metadata (client expects scene/action)
    scene_number = db.Column(db.Integer)
    shot_number = db.Column(db.Integer)
    scene = db.Column(db.Text)
    action = db.Column(db.Text)
    time_of_day = db.Column(db.String(32), default='DAY')  # DAY, NIGHT, DUSK, etc.

    # Generation prompt controls
    prompt = db.Column(db.Text)
    shot_size = db.Column(db.String(16))  # ECU/CU/MCU/MS/WS/EWS
    camera_angle = db.Column(db.String(64))  # "Eye Level", "High", ...
    lens = db.Column(db.String(32))  # "50mm", etc
    notes = db.Column(db.Text)

    # Image output
    image_url = db.Column(db.String(500))
    image_status = db.Column(db.String(50), default='pending')  # pending|generating|completed|failed
    generation_job_id = db.Column(db.String(64))

    # Consistency controls for the prompt/generation step
    consistency_data = db.Column(db.JSON, default=dict)
    camera_settings = db.Column(db.JSON, default=dict)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'storyboard_id': self.storyboard_id,
            'scene_number': self.scene_number,
            'shot_number': self.shot_number,
            'scene': self.scene,
            'action': self.action,
            'time_of_day': self.time_of_day,
            'prompt': self.prompt,

            # Client-friendly naming
            'shotSize': self.shot_size,
            'cameraAngle': self.camera_angle,
            'lens': self.lens,
            'notes': self.notes,

            'image': self.image_url,
            'image_status': self.image_status,
            'generation_job_id': self.generation_job_id,

            'consistency_data': self.consistency_data or {},
            'camera_settings': self.camera_settings or {},

            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

