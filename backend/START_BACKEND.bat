@echo off
REM NuruLife StoryAI Backend Startup Script

echo === NuruLife StoryAI Backend Startup ===
echo.

REM Activate virtual environment
echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment activated

REM Create database tables if not exists
echo.
echo [2/3] Initializing database...
python db_create.py
if errorlevel 1 (
    echo WARNING: Database initialization had issues (may already exist)
)
echo ✓ Database ready

REM Start Flask server
echo.
echo [3/3] Starting Flask development server on http://localhost:8000
echo.
python run.py

if errorlevel 1 (
    echo ERROR: Flask server failed to start
    echo Check the error message above
    pause
)
