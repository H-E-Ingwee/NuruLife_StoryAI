mport os
import sys
sys.path.append(os.path.dirname(__file__))

from app.minimal_app import create_app

app = create_app()

if __name__ == '__main__':
    # Get port from environment or default to 8000
    port = int(os.getenv('PORT', 8000))
    print(f"Starting StoryAI Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)