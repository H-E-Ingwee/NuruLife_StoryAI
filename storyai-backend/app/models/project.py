mport uuid
from datetime import datetime
from app.extensions import db

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    script_text = db.Column(db.Text)
    status = db.Column(db.String(64), default='draft')
    settings = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    characters = db.relationship('Character', backref='project', lazy=True, cascade='all, delete-orphan')
    storyboards = db.relationship('Storyboard', backref='project', lazy=True, cascade='all, delete-orphan')
    assets = db.relationship('Asset', backref='project', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'script_text': self.script_text,
            'status': self.status,
            'settings': self.settings,
            'character_count': len(self.characters) if self.characters is not None else 0,
            'storyboard_count': len(self.storyboards) if self.storyboards is not None else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
