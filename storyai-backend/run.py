import os
import logging
from app import create_app

# Configure logging
logging.basicConfig(level=logging.DEBUG)

try:
    app = create_app()
    print("✓ Flask app created successfully")
except Exception as e:
    print(f"✗ Failed to create app: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

if __name__ == '__main__':
    # Get port from environment or default to 8000
    port = int(os.getenv('PORT', 8000))
    try:
        print(f"Starting server on port {port}...")
        # Use 127.0.0.1 to bind to localhost only
        app.run(host='127.0.0.1', port=port, debug=True, use_reloader=False, threaded=True)
    except Exception as e:
        print(f"✗ Server failed: {e}")
        import traceback
        traceback.print_exc()
