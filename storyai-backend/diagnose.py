#!/usr/bin/env python3
"""
NuruLife StoryAI Backend - System Check & Diagnostics
Run this script to verify your backend setup before starting the server
"""

import sys
import os
import subprocess
from pathlib import Path

def print_header(text):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def print_success(text):
    print(f"✓ {text}")

def print_error(text):
    print(f"✗ {text}")

def print_warning(text):
    print(f"⚠ {text}")

def check_python():
    """Check Python version and availability"""
    print_header("1. PYTHON CHECK")
    try:
        version = sys.version.split()[0]
        major, minor = int(sys.version_info.major), int(sys.version_info.minor)
        print_success(f"Python {version} installed")
        
        if major == 3 and minor >= 8:
            print_success(f"Python version {major}.{minor} is supported")
            return True
        else:
            print_error(f"Python {major}.{minor} may not be compatible (3.8+ required)")
            return False
    except Exception as e:
        print_error(f"Failed to check Python: {e}")
        return False

def check_venv():
    """Check if virtual environment exists and is activated"""
    print_header("2. VIRTUAL ENVIRONMENT CHECK")
    
    backend_path = Path(__file__).parent
    venv_path = backend_path / "venv"
    
    if venv_path.exists():
        print_success(f"Virtual environment found at {venv_path}")
        
        # Check if activated
        if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
            print_success("Virtual environment is ACTIVATED ✓")
            return True
        else:
            print_warning("Virtual environment NOT activated in current session")
            print_warning("Run: .\\venv\\Scripts\\activate (Windows)")
            print_warning("Or:  source venv/bin/activate (macOS/Linux)")
            return False
    else:
        print_error(f"Virtual environment NOT found at {venv_path}")
        print_warning("Create with: python -m venv venv")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    print_header("3. DEPENDENCIES CHECK")
    
    required_packages = {
        'flask': 'Flask',
        'flask_cors': 'Flask-CORS',
        'flask_jwt_extended': 'Flask-JWT-Extended',
        'flask_sqlalchemy': 'Flask-SQLAlchemy',
        'marshmallow': 'Marshmallow',
    }
    
    all_ok = True
    for import_name, display_name in required_packages.items():
        try:
            __import__(import_name)
            print_success(f"{display_name} is installed")
        except ImportError:
            print_error(f"{display_name} NOT installed")
            all_ok = False
    
    return all_ok

def check_app_structure():
    """Check if all required app files exist"""
    print_header("4. APPLICATION STRUCTURE CHECK")
    
    backend_path = Path(__file__).parent
    required_files = {
        'app/__init__.py': 'Flask app factory',
        'app/config.py': 'Configuration classes',
        'app/extensions.py': 'Flask extensions',
        'app/models/__init__.py': 'Models package',
        'app/models/user.py': 'User model',
        'app/models/project.py': 'Project model',
        'app/auth/auth_service.py': 'Auth service',
        'app/auth/decorators.py': 'Auth decorators',
        'app/api/__init__.py': 'API blueprint',
        'app/api/auth.py': 'Auth routes',
        'app/api/projects.py': 'Project routes',
        'run.py': 'Flask server runner',
        'db_create.py': 'Database creator',
    }
    
    all_ok = True
    for file_path, description in required_files.items():
        full_path = backend_path / file_path
        if full_path.exists():
            print_success(f"{description} ({file_path})")
        else:
            print_error(f"{description} MISSING ({file_path})")
            all_ok = False
    
    return all_ok

def check_imports():
    """Try to import the app to check for syntax errors"""
    print_header("5. IMPORT CHECK")
    
    try:
        # Add current directory to path
        sys.path.insert(0, str(Path(__file__).parent))
        
        print("Attempting to import Flask app...")
        from app import create_app
        print_success("Flask app imported successfully")
        
        print("Creating app instance...")
        app = create_app()
        print_success("App instance created successfully")
        
        return True
    except ImportError as e:
        print_error(f"Import error: {e}")
        print_warning("This usually means a dependency is missing")
        return False
    except SyntaxError as e:
        print_error(f"Syntax error in code: {e}")
        print_error(f"File: {e.filename}, Line: {e.lineno}")
        return False
    except Exception as e:
        print_error(f"Error creating app: {e}")
        return False

def check_database():
    """Check database configuration and setup"""
    print_header("6. DATABASE CHECK")
    
    backend_path = Path(__file__).parent
    instance_path = backend_path / "instance"
    db_path = instance_path / "database.db"
    
    if instance_path.exists():
        print_success(f"Instance directory exists: {instance_path}")
    else:
        print_warning(f"Instance directory will be created: {instance_path}")
    
    if db_path.exists():
        size = db_path.stat().st_size
        print_success(f"Database file exists: {db_path} ({size} bytes)")
        return True
    else:
        print_warning(f"Database file not created yet: {db_path}")
        print_warning("Run 'python db_create.py' to initialize")
        return False

def check_ports():
    """Check if port 8000 is available"""
    print_header("7. PORT AVAILABILITY CHECK")
    
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('127.0.0.1', 8000))
        sock.close()
        
        if result == 0:
            print_warning("Port 8000 is already in use")
            print_warning("Another Flask server may be running")
            print_warning("Stop other servers or use a different PORT")
            return False
        else:
            print_success("Port 8000 is available")
            return True
    except Exception as e:
        print_error(f"Could not check port: {e}")
        return False

def print_summary(results):
    """Print final summary"""
    print_header("DIAGNOSTIC SUMMARY")
    
    passed = sum(results.values())
    total = len(results)
    
    print(f"Checks passed: {passed}/{total}\n")
    
    for check_name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {check_name}")
    
    print()
    
    if passed == total:
        print_success("All checks passed!")
        print_success("Your backend is ready to run")
        print("\nNext steps:")
        print("1. Run: python db_create.py")
        print("2. Run: python run.py")
        print("3. Visit: http://localhost:8000/health")
        return True
    else:
        print_error(f"Some checks failed ({total - passed} issue(s))")
        print_error("Please fix the issues above and try again")
        return False

def main():
    print("\n" + "="*60)
    print("  NuruLife StoryAI Backend - Diagnostic Check")
    print("="*60)
    
    results = {
        "Python Version": check_python(),
        "Virtual Environment": check_venv(),
        "Dependencies": check_dependencies(),
        "App Structure": check_app_structure(),
        "Code Imports": check_imports(),
        "Database Setup": check_database(),
        "Port Availability": check_ports(),
    }
    
    success = print_summary(results)
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
