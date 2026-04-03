/**
 * NuruLife StoryAI - Frontend API Service
 * Centralized backend API communication with error handling and token management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get stored authentication token
 */
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Store authentication tokens
 */
const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

/**
 * Clear authentication
 */
const clearAuth = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

/**
 * Make API request with standardized error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    timeout = DEFAULT_TIMEOUT,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers: finalHeaders,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  fetchOptions.signal = controller.signal;

  try {
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 401) {
        clearAuth();
        window.location.href = '/login';
      }

      throw {
        status: response.status,
        code: data.error?.code || 'UNKNOWN_ERROR',
        message: data.error?.message || 'An error occurred',
        details: data.error?.details || null,
      };
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw {
        status: 408,
        code: 'TIMEOUT',
        message: 'Request timeout',
      };
    }

    if (error.status) {
      throw error;
    }

    throw {
      status: 0,
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error',
    };
  }
};

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password (min 8 chars)
 * @param {string} fullName - User full name
 * @returns {Promise<{success, data, error}>}
 */
export const registerUser = async (email, password, fullName) => {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: { email, password, full_name: fullName },
    });

    if (response.success && response.data) {
      storeTokens(response.data.access_token, response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success, data, error}>}
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (response.success && response.data) {
      storeTokens(response.data.access_token, response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  clearAuth();
};

/**
 * Get current authenticated user
 * @returns {Promise<{success, data, error}>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiRequest('/auth/me', { method: 'GET' });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Refresh access token using refresh token
 * @returns {Promise<{success, data, error}>}
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw {
        code: 'NO_REFRESH_TOKEN',
        message: 'No refresh token available',
      };
    }

    const response = await apiRequest('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    });

    if (response.success && response.data) {
      storeTokens(response.data.access_token, response.data.refresh_token);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// ============================================================================
// PROJECTS
// ============================================================================

/**
 * List all user projects
 * @param {number} page - Page number (default 1)
 * @param {number} pageSize - Items per page (default 20)
 * @returns {Promise<{success, data, error}>}
 */
export const getProjects = async (page = 1, pageSize = 20) => {
  try {
    const response = await apiRequest(`/projects?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Get single project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<{success, data, error}>}
 */
export const getProject = async (projectId) => {
  try {
    const response = await apiRequest(`/projects/${projectId}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Create new project
 * @param {string} title - Project title
 * @param {string} description - Project description
 * @param {string} scriptText - Project script text
 * @returns {Promise<{success, data, error}>}
 */
export const createProject = async (title, description = '', scriptText = '') => {
  try {
    const response = await apiRequest('/projects', {
      method: 'POST',
      body: {
        title,
        description,
        script_text: scriptText,
        status: 'draft',
      },
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Update project
 * @param {string} projectId - Project ID
 * @param {Object} updates - Fields to update {title, description, script_text, status}
 * @returns {Promise<{success, data, error}>}
 */
export const updateProject = async (projectId, updates) => {
  try {
    const response = await apiRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: updates,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Delete project
 * @param {string} projectId - Project ID to delete
 * @returns {Promise<{success, data, error}>}
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await apiRequest(`/projects/${projectId}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Search projects by title
 * @param {string} query - Search query
 * @returns {Promise<{success, data, error}>}
 */
export const searchProjects = async (query) => {
  try {
    const response = await apiRequest(`/projects/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

/**
 * Get project statistics
 * @param {string} projectId - Project ID
 * @returns {Promise<{success, data, error}>}
 */
export const getProjectStats = async (projectId) => {
  try {
    const response = await apiRequest(`/projects/${projectId}/stats`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

// ============================================================================
// Storyboards / Shots / Characters / Assets / Exports
// ============================================================================

export const getStoryboards = async () => {
  try {
    const response = await apiRequest('/storyboards', { method: 'GET' });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const getStoryboardShots = async (storyboardId) => {
  try {
    const response = await apiRequest(`/storyboards/${storyboardId}/shots`, { method: 'GET' });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const parseProjectScript = async (projectId, scriptText = null) => {
  try {
    const body = { script_text: scriptText };
    const response = await apiRequest(`/projects/${projectId}/parse-script`, { method: 'POST', body });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const getCharacters = async () => {
  try {
    const response = await apiRequest('/characters', { method: 'GET' });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const getAssets = async () => {
  try {
    const response = await apiRequest('/assets', { method: 'GET' });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const getExports = async (projectId = null) => {
  try {
    const qs = projectId ? `?project_id=${projectId}` : '';
    const response = await apiRequest(`/exports${qs}`, { method: 'GET' });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const createExport = async (projectId, exportType = 'images', settings = {}) => {
  try {
    const response = await apiRequest('/exports', {
      method: 'POST',
      body: { project_id: projectId, export_type: exportType, settings },
    });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const downloadExportFile = async (exportId) => {
  const token = localStorage.getItem('access_token');
  const url = `${API_BASE_URL}/exports/${exportId}/download`;

  const res = await fetch(url, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || 'Export download failed');
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `storyai_export_${exportId}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};

export const generateShotImage = async (shotId, payload) => {
  try {
    const response = await apiRequest(`/shots/${shotId}/generate-image`, { method: 'POST', body: payload });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

export const getShotImageStatus = async (shotId) => {
  try {
    const response = await apiRequest(`/shots/${shotId}/image-status`, { method: 'GET' });
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

// ============================================================================
// ERROR HANDLING UTILITY
// ============================================================================

/**
 * Format error for display
 * @param {Object} error - Error object from API
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) return 'Unknown error';

  if (typeof error === 'string') return error;

  if (error.message) return error.message;

  if (error.code) {
    const messages = {
      'EMAIL_EXISTS': 'This email is already registered',
      'INVALID_CREDENTIALS': 'Email or password is incorrect',
      'USER_NOT_FOUND': 'User account not found',
      'PROJECT_NOT_FOUND': 'Project not found',
      'VALIDATION_ERROR': 'Please check your input',
      'TIMEOUT': 'Request took too long, please try again',
      'NETWORK_ERROR': 'Network error, please check your connection',
      'UNAUTHORIZED': 'You must be logged in',
      'FORBIDDEN': 'You do not have permission to access this',
    };
    return messages[error.code] || error.code;
  }

  return 'An error occurred';
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,

  // Projects
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
  getProjectStats,

  // Storyboards / Shots / Characters / Assets / Exports
  getStoryboards,
  getStoryboardShots,
  parseProjectScript,
  getCharacters,
  getAssets,
  getExports,
  createExport,
  downloadExportFile,
  generateShotImage,
  getShotImageStatus,

  // Utilities
  formatErrorMessage,
};
