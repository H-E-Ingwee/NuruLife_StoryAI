#!/usr/bin/env python
"""Test the full parse endpoint flow"""

from app import create_app
from app.extensions import db
from app.models import User, Project, Storyboard, Shot, Character
from app.nlp.script_parser import parse_script
from datetime import datetime

app = create_app()

with app.app_context():
    try:
        # Create test user if not exists
        user = User.query.filter_by(email='test@test.com').first()
        if not user:
            user = User(
                email='test@test.com',
                full_name='Test User',
                password_hash='dummy',
                is_active=True
            )
            db.session.add(user)
            db.session.flush()
        
        # Create test project
        project = Project(
            user_id=user.id,
            title='Test Project',
            description='Test',
            status='draft',
            settings={}
        )
        db.session.add(project)
        db.session.flush()
        
        # Parse script
        script_text = """INT. COFFEE SHOP - DAY

JOHN sits at a table.

CLOSE ON his hands.

SARAH enters.
"""
        
        parsed = parse_script(script_text)
        shots_data = parsed.get('shots') or []
        characters = parsed.get('characters') or []
        
        print(f"Parsed {len(shots_data)} shots")
        print(f"Found {len(characters)} characters")
        
        # Create storyboard
        storyboard = Storyboard(
            project_id=project.id,
            title=f"{project.title} - Storyboard",
            description='',
            layout=[],
        )
        db.session.add(storyboard)
        db.session.flush()
        
        # Create shots
        for sh in shots_data:
            consistency_data = sh.get('consistency_data') or {}
            consistency_data.setdefault('style_prompt', 'cinematic')
            consistency_data.setdefault('style_seed', 12345)
            
            shot = Shot(
                storyboard_id=storyboard.id,
                scene_number=sh.get('scene_number'),
                shot_number=sh.get('shot_number'),
                scene=sh.get('scene'),
                action=sh.get('action'),
                prompt=sh.get('prompt'),
                shot_size=sh.get('shotSize'),
                camera_angle=sh.get('cameraAngle'),
                lens=sh.get('lens'),
                notes=sh.get('notes'),
                consistency_data=consistency_data,
                camera_settings=sh.get('camera_settings') or {},  # THIS IS KEY
                image_status='pending',
            )
            db.session.add(shot)
            print(f"  Created shot {shot.shot_number}: {shot.action[:50]}...")
        
        db.session.commit()
        print("\nSUCCESS: All shots created and committed!")
        
        # Verify by reloading
        created_shots = Shot.query.filter_by(storyboard_id=storyboard.id).all()
        print(f"Verified {len(created_shots)} shots in database")
        
    except Exception as e:
        import traceback
        db.session.rollback()
        print(f"ERROR: {e}")
        print(traceback.format_exc())
