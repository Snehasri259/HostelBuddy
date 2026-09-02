/**
 * HostelBuddy Authentication Module
 * Handles user authentication, session management, and role-based access
 */

const Auth = {
  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    const user = this.getCurrentUser();
    return user && user.email && user.token;
  },

  /**
   * Get current user from storage
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('hb_user') || sessionStorage.getItem('hb_user');
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Login user
   */
  async login(email, password, remember = true) {
    try {
      // Mock login for demo (replace with API call in production)
      // const response = await API.post('/auth/login', { email, password });
      
      // Mock response based on email
      let role = 'student';
      let name = 'Ravi Kumar';
      
      if (email.toLowerCase().includes('admin')) {
        if (email.toLowerCase().includes('super')) {
          role = 'superadmin';
          name = 'Administrator';
        } else {
          role = 'admin';
          name = 'Dr. Sharma';
        }
      }
      
      const mockUser = {
        id: this.generateId(),
        email,
        name,
        role,
        token: 'mock_token_' + Date.now(),
        createdAt: new Date().toISOString(),
      };

      // Store user data
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('hb_user', JSON.stringify(mockUser));

      return mockUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  async register(userData) {
    try {
      // Mock registration (replace with API call in production)
      // const response = await API.post('/auth/register', userData);
      
      const mockUser = {
        id: this.generateId(),
        ...userData,
        token: 'mock_token_' + Date.now(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('hb_user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('hb_user');
    sessionStorage.removeItem('hb_user');
    window.location.hash = '#login';
  },

  /**
   * Require authentication - redirect to login if not authenticated
   */
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = '#login';
      return false;
    }
    return true;
  },

  /**
   * Require specific role
   */
  requireRole(role) {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.hash = '#login';
      return false;
    }
    
    if (user.role !== role) {
      // Redirect to appropriate dashboard
      window.location.hash = `#${user.role}/dashboard`;
      return false;
    }
    
    return true;
  },

  /**
   * Get user's role
   */
  getRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  /**
   * Update user data
   */
  updateUser(data) {
    const user = this.getCurrentUser();
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('hb_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  },
};

// Export for use
window.Auth = Auth;
