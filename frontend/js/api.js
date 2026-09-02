/**
 * HostelBuddy API Client
 * Fetch wrapper with authentication, error handling, and toast notifications
 */

const API_BASE = '/api';

/**
 * Get authorization headers
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const user = JSON.parse(localStorage.getItem('hb_user') || '{}');
  if (user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }
  
  return headers;
}

/**
 * Handle API errors
 */
function handleApiError(error, response) {
  // Handle 401 - Unauthorized
  if (response && response.status === 401) {
    localStorage.removeItem('hb_user');
    window.location.hash = '#login';
    if (typeof showToast === 'function') {
      showToast('Session expired. Please login again.', 'error');
    }
    return;
  }
  
  // Handle network errors
  if (!response || !response.ok) {
    const message = error?.message || 'Network error. Please try again.';
    if (typeof showToast === 'function') {
      showToast(message, 'error');
    }
    throw new Error(message);
  }
}

/**
 * GET request
 */
async function apiGet(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });
    
    if (!response.ok) {
      handleApiError(new Error(`HTTP ${response.status}`), response);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, null);
    throw error;
  }
}

/**
 * POST request
 */
async function apiPost(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      handleApiError(new Error(`HTTP ${response.status}`), response);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, null);
    throw error;
  }
}

/**
 * PUT request
 */
async function apiPut(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      handleApiError(new Error(`HTTP ${response.status}`), response);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, null);
    throw error;
  }
}

/**
 * DELETE request
 */
async function apiDelete(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });
    
    if (!response.ok) {
      handleApiError(new Error(`HTTP ${response.status}`), response);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, null);
    throw error;
  }
}

// Export for use
window.API = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
