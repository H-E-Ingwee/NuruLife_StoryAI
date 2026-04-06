mport uuid
from datetime import datetime

from app.extensions import db


class Character(db.Model):
    __tablename__ = 'characters'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=False)

    name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(100))  # hero, villain, supporting, historical
    type = db.Column(db.String(100))
    description = db.Column(db.Text)

    # SQLite-friendly storage for lists/dicts
    traits = db.Column(db.JSON, default=list)  # list[str]
    appearance_count = db.Column(db.Integer, default=0)

    avatar_url = db.Column(db.String(500))
    reference_images = db.Column(db.JSON, default=list)  # list[str] (asset URLs/paths)

    # Arbitrary identity / consistency knobs
    consistency_settings = db.Column(db.JSON, default=dict)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'role': self.role,
            'type': self.type,
            'description': self.description,
            'traits': self.traits or [],
            'appearance_count': self.appearance_count,
            'avatar_url': self.avatar_url,
            'reference_images': self.reference_images or [],
            'consistency_settings': self.consistency_settings or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

