#!/usr/bin/env python3
"""
Simple Flask backend server for NuruLife StoryAI
Runs on port 8000
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running!"}), 200

@app.route('/api/health', methods=['GET'])
def api_health():
    return jsonify({"status": "ok"}), 200

@app.route('/', methods=['GET'])
def hello():
    return jsonify({"message": "NuruLife StoryAI Backend", "version": "1.0"}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    print(f"🚀 Starting NuruLife StoryAI Backend on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
