!/usr/bin/env python3
"""
Simple Flask backend server for NuruLife StoryAI
Runs on port 8000
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Simple projects API for testing
projects_data = []

@app.route('/api/projects', methods=['GET'])
def list_projects():
    return jsonify({'success': True, 'data': projects_data}), 200

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    if not data or not data.get('title'):
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'message': 'Title is required'}}), 400
    
    project = {
        'id': str(len(projects_data) + 1),
        'user_id': 'test-user-123',
        'title': data['title'],
        'description': data.get('description', ''),
        'script_text': data.get('script_text', ''),
        'status': data.get('status', 'draft'),
        'created_at': '2026-04-03T10:00:00Z',
        'updated_at': '2026-04-03T10:00:00Z'
    }
    projects_data.append(project)
    return jsonify({'success': True, 'data': project}), 201

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    project = next((p for p in projects_data if p['id'] == project_id), None)
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404
    return jsonify({'success': True, 'data': project}), 200

@app.route('/api/projects/<project_id>', methods=['PUT'])
def update_project(project_id):
    project = next((p for p in projects_data if p['id'] == project_id), None)
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404
    
    data = request.json
    project.update(data)
    project['updated_at'] = '2026-04-03T10:00:00Z'
    return jsonify({'success': True, 'data': project}), 200

@app.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    global projects_data
    project = next((p for p in projects_data if p['id'] == project_id), None)
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404
    
    projects_data = [p for p in projects_data if p['id'] != project_id]
    return jsonify({'success': True, 'data': {'message': 'Project deleted'}}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    print(f"🚀 Starting NuruLife StoryAI Backend on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
