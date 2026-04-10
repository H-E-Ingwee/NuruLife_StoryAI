#!/usr/bin/env python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({'status': 'ok'})

@app.route('/test')
def test():
    return jsonify({'message': 'hello'})

if __name__ == '__main__':
    print("Starting minimal Flask app on http://127.0.0.1:8001")
    app.run(host='127.0.0.1', port=8001, debug=False, use_reloader=False)
