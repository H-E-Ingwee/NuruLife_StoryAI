import { useState, useCallback, useEffect } from 'react';
import * as api from './api';

/**
 * Custom React hooks for backend API interactions
 * Simplifies state management, loading, and error handling
 */

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

/**
 * useAuth - Manages authentication state and operations
 * @returns {Object} { user, isLoading, error, login, register, logout, clearError }
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (email, password, fullName) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.registerUser(email, password, fullName);
      if (result.success) {
        setUser(result.data.user);
        return true;
      } else {
        setError(result.error?.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.loginUser(email, password);
      if (result.success) {
        setUser(result.data.user);
        return true;
      } else {
        setError(result.error?.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { user, isLoading, error, login, register, logout, clearError };
};

// ============================================================================
// PROJECT HOOKS
// ============================================================================

/**
 * useProjects - Manages projects list and operations
 * @returns {Object} { projects, isLoading, error, createProject, deleteProject, refresh }
 */
export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getProjects();
      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.error?.message || 'Failed to load projects');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (title, description = '', scriptText = '') => {
    setError(null);
    try {
      const result = await api.createProject(title, description, scriptText);
      if (result.success) {
        setProjects([...projects, result.data]);
        return result.data;
      } else {
        setError(result.error?.message || 'Failed to create project');
        return null;
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      return null;
    }
  }, [projects]);

  const deleteProject = useCallback(async (projectId) => {
    setError(null);
    try {
      const result = await api.deleteProject(projectId);
      if (result.success) {
        setProjects(projects.filter(p => p.id !== projectId));
        return true;
      } else {
        setError(result.error?.message || 'Failed to delete project');
        return false;
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      return false;
    }
  }, [projects]);

  // Auto-load projects on mount (if user is authenticated)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      refresh();
    }
  }, [refresh]);

  return { projects, isLoading, error, createProject, deleteProject, refresh };
};

/**
 * useProject - Manages single project details
 * @param {string} projectId - Project ID to fetch
 * @returns {Object} { project, isLoading, error, update, refresh }
 */
export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getProject(projectId);  // Need to add this to api.js
      if (result.success) {
        setProject(result.data);
      } else {
        setError(result.error?.message || 'Failed to load project');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const update = useCallback(async (updates) => {
    if (!projectId) return null;
    
    setError(null);
    try {
      const result = await api.updateProject(projectId, updates);
      if (result.success) {
        setProject(result.data);
        return result.data;
      } else {
        setError(result.error?.message || 'Failed to update project');
        return null;
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      return null;
    }
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [projectId, refresh]);

  return { project, isLoading, error, update, refresh };
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * useAsyncCall - Generic async operation handler
 * @param {Function} asyncFn - Async function to call
 * @returns {Object} { isLoading, error, execute }
 */
export const useAsyncCall = (asyncFn) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn]);

  return { isLoading, error, execute };
};

/**
 * useDebounce - Debounce a function call
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export const useDebounce = (fn, delay = 500) => {
  const timeoutRef = useRef(null);

  const debouncedFn = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example: Login Form Component
 */
export function ExampleLoginForm() {
  const { user, isLoading, error, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  if (user) {
    return <div>Already logged in as {user.email}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

/**
 * Example: Projects List Component
 */
export function ExampleProjectsList() {
  const { projects, isLoading, error, createProject, deleteProject } = useProjects();
  const [newTitle, setNewTitle] = useState('');

  const handleCreate = async () => {
    const project = await createProject(newTitle);
    if (project) {
      setNewTitle('');
    }
  };

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>My Projects</h2>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New project title"
      />
      <button onClick={handleCreate}>Create</button>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            {project.title}
            <button onClick={() => deleteProject(project.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example: Project Editor Component
 */
export function ExampleProjectEditor({ projectId }) {
  const { project, isLoading, error, update } = useProject(projectId);
  const [title, setTitle] = useState('');
  const [scriptText, setScriptText] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setScriptText(project.script_text);
    }
  }, [project]);

  const handleSave = async () => {
    await update({ title, script_text: scriptText });
  };

  if (isLoading) return <div>Loading project...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project title"
      />
      <textarea
        value={scriptText}
        onChange={(e) => setScriptText(e.target.value)}
        placeholder="Enter script text..."
      />
      <button onClick={handleSave}>Save Project</button>
    </div>
  );
}

export default {
  useAuth,
  useProjects,
  useProject,
  useAsyncCall,
  useDebounce,
};
