import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask
from app.extensions import db
from app.models import User, Project, Character, Asset, Storyboard, Shot, Export
from werkzeug.security import generate_password_hash
import uuid

# Create app
app = Flask(__name__)
backend_dir = os.path.dirname(__file__)
db_path = os.path.join(backend_dir, 'app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize db with app
db.init_app(app)

with app.app_context():
    # Create tables
    print('[1/2] Creating database tables...')
    db.create_all()
    print('[OK] Database tables created.')
    
    # Create superadmin
    print('[2/2] Creating superadmin user...')
    try:
        user = User(
            id=str(uuid.uuid4()),
            email='Ingweplex@gmail.com', 
            full_name='Super Admin'
        )
        user.password_hash = generate_password_hash('Ingweplex')
        db.session.add(user)
        db.session.commit()
        print('[OK] Superadmin created: Ingweplex@gmail.com / Ingweplex')
    except Exception as e:
        if 'UNIQUE constraint failed' in str(e):
            print('[OK] Superadmin already exists')
        else:
            print('[ERROR]', str(e))
