# 🚀 NuruLife StoryAI Backend - Quick Start Guide

## Prerequisites
- Python 3.8+ (verify with `python --version`)
- Virtual environment already created at `storyai-backend/venv`
- All dependencies installed in the venv

## ⚡ Starting the Backend (Windows)

### Option 1: Double-click to Start (Easiest)
```
Double-click: storyai-backend/START_BACKEND.bat
```
This will:
1. ✓ Activate your virtual environment
2. ✓ Initialize the database (creates tables if needed)
3. ✓ Start Flask server on port 8000

### Option 2: Manual Terminal Start
```powershell
cd storyai-backend
.\venv\Scripts\activate
python db_create.py      # Initialize database (run once)
python run.py            # Start the server
```

### Option 3: Test Without Database
```powershell
cd storyai-backend
.\venv\Scripts\activate
python run_minimal.py    # Starts server without database initialization
```

## ✅ Verify Backend is Running

### 1. Health Check
```bash
curl http://localhost:8000/health
```
Expected Response:
```json
{"status": "ok"}
```

### 2. Try Registration
```bash
curl -X POST http://localhost:8000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"TestPass123\",\"full_name\":\"Test User\"}"
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "test@example.com",
      "full_name": "Test User",
      "created_at": "2024-01-01T12:00:00",
      "updated_at": "2024-01-01T12:00:00"
    },
    "access_token": "eyJ0eXAi...",
    "refresh_token": "eyJ0eXAi...",
    "token_type": "Bearer"
  }
}
```

## 🔌 Connecting Frontend to Backend

In your `src/services/api.js`, make sure the API base URL points to your backend:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Ensure CORS is enabled in backend (it is by default for localhost:3000 and localhost:5176).

## 📋 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (requires JWT token)

### Projects
- `GET /api/projects` - List all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/<id>` - Get specific project
- `PUT /api/projects/<id>` - Update project
- `DELETE /api/projects/<id>` - Delete project

All project endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {access_token}
```

## 🐛 Troubleshooting

### "Virtual environment not found"
```powershell
# Recreate venv
python -m venv venv
# Reinstall dependencies
.\venv\Scripts\activate
pip install -r requirements.txt
```

### "Port 8000 already in use"
```powershell
# Use a different port
set PORT=8001
python run.py

# Or kill process using port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID {PID_NUMBER} /F
```

### "ModuleNotFoundError"
```powershell
# Make sure venv is activated (look for (venv) in prompt)
.\venv\Scripts\activate
# Verify Flask is installed
pip show flask
```

### "Database Issues"
```powershell
# Reset database (deletes all data!)
del instance\database.db
python db_create.py

# Or check database location in config
# Default: instance/database.db
```

### CORS Errors from Frontend
- Check that backend is running on 8000
- Verify CORS is configured in `app/__init__.py` for your frontend URL
- Current allowed origins: `localhost:3000`, `localhost:5176`

## 📝 Environment Variables

Create `.env` in `storyai-backend/` directory:

```env
# Flask
FLASK_ENV=development
FLASK_DEBUG=1
PORT=8000

# Database
DATABASE_URL=sqlite:///instance/database.db

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production

# Allowed CORS origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:5176
```

## 🔒 Security Notes

- **NEVER** commit `.env` to git (add to `.gitignore`)
- Change `JWT_SECRET_KEY` in production
- Use strong passwords (8+ characters)
- Tokens expire after 15 minutes (customizable in config)

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE user (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

### Projects Table
```sql
CREATE TABLE project (
    id UUID PRIMARY KEY,
    user_id UUID FOREIGN KEY REFERENCES user(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    script_text TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    settings JSON,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)
```

## 🚀 Production Deployment

For production, see `BACKEND_IMPLEMENTATION_GUIDE.md` for:
- PostgreSQL setup
- Gunicorn deployment
- Environment configuration
- SSL/security hardening

## 💡 Next Steps

1. Start backend with `START_BACKEND.bat` or manual commands above
2. Update frontend API client (see `FRONTEND_INTEGRATION_GUIDE.md`)
3. Test endpoints with provided cURL commands
4. Connect React components to API endpoints
5. Verify end-to-end data flow

---

**Backend ready!** → Start with `START_BACKEND.bat` and test with health check endpoint.
