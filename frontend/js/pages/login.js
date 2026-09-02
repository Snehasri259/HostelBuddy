/**
 * HostelBuddy Login Page
 * Form handling, validation, animations, and authentication
 */

const LoginPage = {
  init() {
    this.cacheElements();
    this.bindEvents();
    this.initAnimations();
  },

  cacheElements() {
    // Forms
    this.loginCard = document.getElementById('loginCard');
    this.registerCard = document.getElementById('registerCard');
    this.loginForm = document.getElementById('loginForm');
    this.registerForm = document.getElementById('registerForm');
    
    // Login inputs
    this.loginEmail = document.getElementById('loginEmail');
    this.loginPassword = document.getElementById('loginPassword');
    this.rememberMe = document.getElementById('rememberMe');
    
    // Register inputs
    this.regName = document.getElementById('regName');
    this.regEmail = document.getElementById('regEmail');
    this.regPhone = document.getElementById('regPhone');
    this.regPassword = document.getElementById('regPassword');
    this.regConfirmPassword = document.getElementById('regConfirmPassword');
    
    // Buttons
    this.loginBtn = document.getElementById('loginBtn');
    this.registerBtn = document.getElementById('registerBtn');
    this.passwordToggle = document.getElementById('passwordToggle');
    
    // Links
    this.showRegister = document.getElementById('showRegister');
    this.showLogin = document.getElementById('showLogin');
    
    // Theme
    this.themeToggle = document.getElementById('themeToggle');
  },

  bindEvents() {
    // Form submissions
    this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    
    // Form toggle
    this.showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleForm('register');
    });
    this.showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleForm('login');
    });
    
    // Password visibility toggle
    this.passwordToggle.addEventListener('click', () => this.togglePassword('loginPassword'));
    document.querySelectorAll('.password-toggle[data-target]').forEach(btn => {
      btn.addEventListener('click', () => this.togglePassword(btn.dataset.target));
    });
    
    // Password strength
    this.regPassword.addEventListener('input', () => this.checkPasswordStrength());
    
    // Role selection
    document.querySelectorAll('.role-option').forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        option.querySelector('input').checked = true;
      });
    });
    
    // Theme toggle
    this.themeToggle.addEventListener('click', () => {
      if (typeof Theme !== 'undefined') {
        Theme.toggle();
      }
    });
    
    // Real-time validation
    this.loginEmail.addEventListener('blur', () => this.validateLoginEmail());
    this.loginPassword.addEventListener('blur', () => this.validateLoginPassword());
    this.regEmail.addEventListener('blur', () => this.validateRegEmail());
    this.regPassword.addEventListener('blur', () => this.validateRegPassword());
    this.regConfirmPassword.addEventListener('blur', () => this.validateConfirmPassword());
    
    // Clear errors on input
    document.querySelectorAll('.input-group input').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.input-error');
        if (errorEl) errorEl.textContent = '';
      });
    });
  },

  initAnimations() {
    // Initialize magnetic effect on buttons
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      if (typeof Animations !== 'undefined') {
        Animations.magneticEffect(btn);
      }
    });
    
    // Initialize ripple effect on buttons
    document.querySelectorAll('.ripple-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (typeof Animations !== 'undefined') {
          Animations.rippleEffect(btn, e);
        }
      });
    });
    
    // Stagger reveal on page load
    if (typeof Animations !== 'undefined') {
      Animations.staggerReveal('.feature-item');
    }
  },

  // ============================================
  // FORM TOGGLE
  // ============================================

  toggleForm(form) {
    const isLogin = form === 'login';
    
    // Animate out current form
    const currentCard = isLogin ? this.registerCard : this.loginCard;
    const nextCard = isLogin ? this.loginCard : this.registerCard;
    
    currentCard.style.animation = 'fadeOut 0.2s ease-out forwards';
    
    setTimeout(() => {
      currentCard.style.display = 'none';
      nextCard.style.display = 'block';
      nextCard.style.animation = 'slideUp 0.3s ease-out';
      
      // Reset form
      if (isLogin) {
        this.loginForm.reset();
      } else {
        this.registerForm.reset();
        this.resetRoleSelection();
      }
      
      // Clear all errors
      this.clearErrors();
    }, 200);
  },

  resetRoleSelection() {
    document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
    document.querySelector('.role-option[data-role="student"]').classList.add('active');
    document.querySelector('.role-option[data-role="student"] input').checked = true;
  },

  clearErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.input-group input').forEach(el => el.classList.remove('error'));
  },

  // ============================================
  // PASSWORD TOGGLE
  // ============================================

  togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle') || this.passwordToggle;
    const eyeIcon = toggle.querySelector('.eye-icon');
    const eyeOffIcon = toggle.querySelector('.eye-off-icon');
    
    if (input.type === 'password') {
      input.type = 'text';
      eyeIcon.style.display = 'none';
      eyeOffIcon.style.display = 'block';
    } else {
      input.type = 'password';
      eyeIcon.style.display = 'block';
      eyeOffIcon.style.display = 'none';
    }
  },

  // ============================================
  // PASSWORD STRENGTH
  // ============================================

  checkPasswordStrength() {
    const password = this.regPassword.value;
    const strengthEl = document.getElementById('passwordStrength');
    
    if (!password) {
      strengthEl.className = 'password-strength';
      strengthEl.innerHTML = '';
      return;
    }
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    let strengthClass = 'weak';
    let strengthText = 'Weak';
    let strengthColor = 'var(--danger)';
    
    if (strength >= 4) {
      strengthClass = 'strong';
      strengthText = 'Strong';
      strengthColor = 'var(--success)';
    } else if (strength >= 2) {
      strengthClass = 'medium';
      strengthText = 'Medium';
      strengthColor = 'var(--warning)';
    }
    
    strengthEl.className = `password-strength ${strengthClass}`;
    strengthEl.innerHTML = `<div class="strength-bar" style="background: ${strengthColor}"></div>`;
  },

  // ============================================
  // VALIDATION
  // ============================================

  validateLoginEmail() {
    const email = this.loginEmail.value.trim();
    const errorEl = document.getElementById('emailError');
    
    if (!email) {
      this.loginEmail.classList.add('error');
      errorEl.textContent = 'Email is required';
      return false;
    }
    
    if (!Utils.validateEmail(email)) {
      this.loginEmail.classList.add('error');
      errorEl.textContent = 'Please enter a valid email';
      return false;
    }
    
    this.loginEmail.classList.remove('error');
    errorEl.textContent = '';
    return true;
  },

  validateLoginPassword() {
    const password = this.loginPassword.value;
    const errorEl = document.getElementById('passwordError');
    
    if (!password) {
      this.loginPassword.classList.add('error');
      errorEl.textContent = 'Password is required';
      return false;
    }
    
    this.loginPassword.classList.remove('error');
    errorEl.textContent = '';
    return true;
  },

  validateRegEmail() {
    const email = this.regEmail.value.trim();
    const errorEl = document.getElementById('regEmailError');
    
    if (!email) {
      this.regEmail.classList.add('error');
      errorEl.textContent = 'Email is required';
      return false;
    }
    
    if (!Utils.validateEmail(email)) {
      this.regEmail.classList.add('error');
      errorEl.textContent = 'Please enter a valid email';
      return false;
    }
    
    this.regEmail.classList.remove('error');
    errorEl.textContent = '';
    return true;
  },

  validateRegPassword() {
    const password = this.regPassword.value;
    const errorEl = document.getElementById('regPasswordError');
    
    if (!password) {
      this.regPassword.classList.add('error');
      errorEl.textContent = 'Password is required';
      return false;
    }
    
    if (!Utils.validatePassword(password)) {
      this.regPassword.classList.add('error');
      errorEl.textContent = 'Min 6 chars with letters and numbers';
      return false;
    }
    
    this.regPassword.classList.remove('error');
    errorEl.textContent = '';
    return true;
  },

  validateConfirmPassword() {
    const password = this.regPassword.value;
    const confirmPassword = this.regConfirmPassword.value;
    const errorEl = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
      this.regConfirmPassword.classList.add('error');
      errorEl.textContent = 'Please confirm your password';
      return false;
    }
    
    if (password !== confirmPassword) {
      this.regConfirmPassword.classList.add('error');
      errorEl.textContent = 'Passwords do not match';
      return false;
    }
    
    this.regConfirmPassword.classList.remove('error');
    errorEl.textContent = '';
    return true;
  },

  validateName() {
    const name = this.regName.value.trim();
    const errorEl = document.getElementById('nameError');
    
    if (!name) {
      this.regName.classList.add('error');
      errorEl.textContent = 'Name is required';
      return false;
    }
    
    this.regName.classList.remove('error');
    errorEl.textContent = '';
    return true;
  },

  validatePhone() {
    const phone = this.regPhone.value.trim();
    const errorEl = document.getElementById('phoneError');
    
    if (!phone) {
      this.regPhone.classList.add('error');
      errorEl.textContent = 'Phone is required';
      return false;
    }
    
    if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, ''))) {
      this.regPhone.classList.add('error');
      errorEl.textContent = 'Enter a valid 10-digit phone number';
      return false;
    }
    
    this.regPhone.classList.remove('error');
    errorEl.textContent = '';
    return true;
  },

  // ============================================
  // FORM SUBMISSION
  // ============================================

  async handleLogin(e) {
    e.preventDefault();
    
    // Validate
    const isEmailValid = this.validateLoginEmail();
    const isPasswordValid = this.validateLoginPassword();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    // Show loading state
    this.setLoading(this.loginBtn, true);
    
    try {
      const email = this.loginEmail.value.trim();
      const password = this.loginPassword.value;
      const remember = this.rememberMe.checked;
      
      // Mock login (replace with actual API call)
      console.log('[HostelBuddy] Login attempt:', { email, remember });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
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
      
      const user = {
        id: Utils.generateId(),
        email,
        name,
        role,
        token: 'mock_token_' + Date.now(),
      };
      
      // Store user
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('hb_user', JSON.stringify(user));
      
      // Show success message
      this.showToast('Login successful! Redirecting...', 'success');
      
      // Redirect after delay
      setTimeout(() => {
        window.location.hash = `#${role}/dashboard`;
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('[HostelBuddy] Login error:', error);
      this.showToast('Login failed. Please try again.', 'error');
    } finally {
      this.setLoading(this.loginBtn, false);
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    
    // Validate all fields
    const isNameValid = this.validateName();
    const isEmailValid = this.validateRegEmail();
    const isPhoneValid = this.validatePhone();
    const isPasswordValid = this.validateRegPassword();
    const isConfirmValid = this.validateConfirmPassword();
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmValid) {
      return;
    }
    
    // Show loading state
    this.setLoading(this.registerBtn, true);
    
    try {
      const name = this.regName.value.trim();
      const email = this.regEmail.value.trim();
      const phone = this.regPhone.value.trim();
      const password = this.regPassword.value;
      const role = document.querySelector('input[name="role"]:checked').value;
      
      // Mock registration (replace with actual API call)
      console.log('[HostelBuddy] Registration:', { name, email, phone, role });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const user = {
        id: Utils.generateId(),
        name,
        email,
        phone,
        role,
        token: 'mock_token_' + Date.now(),
      };
      
      // Store user
      localStorage.setItem('hb_user', JSON.stringify(user));
      
      // Show success message
      this.showToast('Registration successful! Welcome to HostelBuddy.', 'success');
      
      // Redirect after delay
      setTimeout(() => {
        window.location.hash = `#${role}/dashboard`;
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('[HostelBuddy] Registration error:', error);
      this.showToast('Registration failed. Please try again.', 'error');
    } finally {
      this.setLoading(this.registerBtn, false);
    }
  },

  // ============================================
  // HELPERS
  // ============================================

  setLoading(button, loading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (loading) {
      button.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'flex';
    } else {
      button.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    switch (type) {
      case 'success':
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
        break;
      case 'error':
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        break;
      default:
        icon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }
    
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  const user = JSON.parse(localStorage.getItem('hb_user') || sessionStorage.getItem('hb_user') || 'null');
  if (user && user.token) {
    window.location.hash = `#${user.role}/dashboard`;
    return;
  }
  
  LoginPage.init();
});
