from app import create_app
try:
    app = create_app()
    print('App created successfully')
    print(f'Debug mode: {app.config.get("DEBUG")}')
    print(f'Routes: {len(app.url_map._rules)}')
except Exception as e:
    print(f'Error: {type(e).__name__}: {e}')
    import traceback
    traceback.print_exc()
