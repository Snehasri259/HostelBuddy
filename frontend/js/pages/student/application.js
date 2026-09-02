/**
 * HostelBuddy Student Application Page
 * Multi-step form wizard for hostel application
 */

const StudentApplication = {
  currentStep: 1,
  totalSteps: 4,
  
  formData: {
    fullName: '',
    email: '',
    phone: '',
    department: '',
    guardianName: '',
    guardianPhone: '',
    hostel: '',
    requirements: '',
    medicalConditions: '',
    floorPreference: 'any',
    roommatePreference: '',
  },

  application: {
    status: 'approved',
    id: 'HB-2025-00142',
    date: '2025-01-15',
    hostel: 'Boys Hostel A',
  },

  steps: [
    { num: 1, label: 'Personal Info', icon: 'users' },
    { num: 2, label: 'Hostel Selection', icon: 'building' },
    { num: 3, label: 'Requirements', icon: 'edit' },
    { num: 4, label: 'Review', icon: 'check' },
  ],

  render() {
    const user = JSON.parse(localStorage.getItem('hb_user') || '{}');
    this.formData.fullName = user.name || 'Ravi Kumar';
    this.formData.email = user.email || 'ravi@university.edu';

    if (this.application.status === 'approved' || this.application.status === 'pending') {
      return this.renderStatus();
    }
    
    return this.renderForm();
  },

  // ============================================
  // MULTI-STEP FORM
  // ============================================

  renderForm() {
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.bed || ''}
          Hostel Application
        </h2>
        <p style="color:var(--text-secondary);margin-top:4px">Apply for hostel accommodation</p>
      </div>
      
      ${this.renderProgressBar()}
      
      <div class="application-form-container">
        <form id="applicationForm" onsubmit="StudentApplication.submit(event)">
          <div class="form-steps-container">
            <div class="form-step active" id="step1">
              ${this.renderStep1()}
            </div>
            <div class="form-step" id="step2">
              ${this.renderStep2()}
            </div>
            <div class="form-step" id="step3">
              ${this.renderStep3()}
            </div>
            <div class="form-step" id="step4">
              ${this.renderStep4()}
            </div>
          </div>
        </form>
      </div>
    `;
  },

  renderProgressBar() {
    return `
      <div class="progress-steps fade-in">
        ${this.steps.map((step, i) => `
          <div class="progress-step ${step.num <= this.currentStep ? 'active' : ''} ${step.num < this.currentStep ? 'completed' : ''}">
            <div class="step-indicator">
              ${step.num < this.currentStep 
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                : step.num
              }
            </div>
            <span class="step-label">${step.label}</span>
          </div>
          ${i < this.steps.length - 1 ? `<div class="step-connector ${step.num < this.currentStep ? 'completed' : ''}"></div>` : ''}
        `).join('')}
      </div>
    `;
  },

  renderStep1() {
    return `
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="form-section-icon">${icons.users || ''}</span>
          Personal Information
        </h3>
        
        <div class="form-row">
          <div class="input-group">
            <input type="text" id="fullName" placeholder=" " value="${Utils.sanitize(this.formData.fullName)}" required>
            <label for="fullName">Full Name</label>
          </div>
          <div class="input-group">
            <input type="email" id="email" placeholder=" " value="${Utils.sanitize(this.formData.email)}" readonly style="background:var(--bg-secondary);cursor:not-allowed">
            <label for="email">Email Address</label>
          </div>
        </div>
        
        <div class="form-row">
          <div class="input-group">
            <input type="tel" id="phone" placeholder=" " value="${Utils.sanitize(this.formData.phone)}" required>
            <label for="phone">Phone Number</label>
          </div>
          <div class="input-group">
            <select id="department" required>
              <option value="">Select Department</option>
              <option value="cs" ${this.formData.department === 'cs' ? 'selected' : ''}>Computer Science</option>
              <option value="it" ${this.formData.department === 'it' ? 'selected' : ''}>Information Technology</option>
              <option value="ece" ${this.formData.department === 'ece' ? 'selected' : ''}>Electronics & Communication</option>
              <option value="me" ${this.formData.department === 'me' ? 'selected' : ''}>Mechanical Engineering</option>
              <option value="ce" ${this.formData.department === 'ce' ? 'selected' : ''}>Civil Engineering</option>
            </select>
            <label for="department">Department / Year</label>
          </div>
        </div>
        
        <div class="form-row">
          <div class="input-group">
            <input type="text" id="guardianName" placeholder=" " value="${Utils.sanitize(this.formData.guardianName)}">
            <label for="guardianName">Guardian Name</label>
          </div>
          <div class="input-group">
            <input type="tel" id="guardianPhone" placeholder=" " value="${Utils.sanitize(this.formData.guardianPhone)}">
            <label for="guardianPhone">Guardian Phone</label>
          </div>
        </div>
        
        <div class="form-actions">
          <div></div>
          <button type="button" class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="StudentApplication.nextStep()">
            Next Step
            ${icons['chevron-right'] || ''}
          </button>
        </div>
      </div>
    `;
  },

  renderStep2() {
    return `
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="form-section-icon">${icons.building || ''}</span>
          Select Your Hostel
        </h3>
        
        <div class="hostel-selection-grid">
          <label class="hostel-radio-card ${this.formData.hostel === 'boys' ? 'selected' : ''}" onclick="StudentApplication.selectHostel('boys')">
            <input type="radio" name="hostel" value="boys" ${this.formData.hostel === 'boys' ? 'checked' : ''}>
            <div class="hostel-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                <path d="M9 22v-4h6v4"></path>
                <line x1="8" y1="6" x2="8" y2="6.01"></line>
                <line x1="12" y1="6" x2="12" y2="6.01"></line>
                <line x1="16" y1="6" x2="16" y2="6.01"></line>
                <line x1="8" y1="10" x2="8" y2="10.01"></line>
                <line x1="12" y1="10" x2="12" y2="10.01"></line>
                <line x1="16" y1="10" x2="16" y2="10.01"></line>
                <line x1="8" y1="14" x2="8" y2="14.01"></line>
                <line x1="12" y1="14" x2="12" y2="14.01"></line>
                <line x1="16" y1="14" x2="16" y2="14.01"></line>
              </svg>
            </div>
            <div class="hostel-card-title">Boys Hostel</div>
            <div class="hostel-card-subtitle">Block A, B, C available</div>
            <div class="hostel-card-check">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </label>
          
          <label class="hostel-radio-card ${this.formData.hostel === 'girls' ? 'selected' : ''}" onclick="StudentApplication.selectHostel('girls')">
            <input type="radio" name="hostel" value="girls" ${this.formData.hostel === 'girls' ? 'checked' : ''}>
            <div class="hostel-card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                <path d="M9 22v-4h6v4"></path>
                <line x1="8" y1="6" x2="8" y2="6.01"></line>
                <line x1="12" y1="6" x2="12" y2="6.01"></line>
                <line x1="16" y1="6" x2="16" y2="6.01"></line>
                <line x1="8" y1="10" x2="8" y2="10.01"></line>
                <line x1="12" y1="10" x2="12" y2="10.01"></line>
                <line x1="16" y1="10" x2="16" y2="10.01"></line>
                <line x1="8" y1="14" x2="8" y2="14.01"></line>
                <line x1="12" y1="14" x2="12" y2="14.01"></line>
                <line x1="16" y1="14" x2="16" y2="14.01"></line>
              </svg>
            </div>
            <div class="hostel-card-title">Girls Hostel</div>
            <div class="hostel-card-subtitle">Block D, E available</div>
            <div class="hostel-card-check">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" class="quick-action-btn quick-action-btn--secondary" onclick="StudentApplication.prevStep()">
            ${icons['chevron-left'] || ''}
            Back
          </button>
          <button type="button" class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="StudentApplication.nextStep()">
            Next Step
            ${icons['chevron-right'] || ''}
          </button>
        </div>
      </div>
    `;
  },

  renderStep3() {
    return `
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="form-section-icon">${icons.edit || ''}</span>
          Requirements & Preferences
        </h3>
        
        <div class="form-group">
          <label class="form-label">Special Requirements</label>
          <div class="textarea-container">
            <textarea id="requirements" class="form-textarea" rows="4" placeholder="Ground floor preferred, near library if possible..." oninput="StudentApplication.updateCharCount(this, 'reqCount', 500)">${Utils.sanitize(this.formData.requirements)}</textarea>
            <span class="char-count" id="reqCount">0/500</span>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Medical Conditions (if any)</label>
          <div class="textarea-container">
            <textarea id="medicalConditions" class="form-textarea" rows="3" placeholder="Any medical conditions we should know about..." oninput="StudentApplication.updateCharCount(this, 'medCount', 300)">${Utils.sanitize(this.formData.medicalConditions)}</textarea>
            <span class="char-count" id="medCount">0/300</span>
          </div>
        </div>
        
        <div class="preferences-section">
          <h4 class="preferences-title">Do you have any preferences?</h4>
          
          <div class="form-group">
            <label class="form-label">Floor Preference</label>
            <div class="radio-group">
              ${['any', 'ground', '1st', '2nd', '3rd'].map(floor => `
                <label class="radio-option ${this.formData.floorPreference === floor ? 'active' : ''}">
                  <input type="radio" name="floorPreference" value="${floor}" ${this.formData.floorPreference === floor ? 'checked' : ''} onchange="StudentApplication.updateFloorPreference('${floor}')">
                  <span>${floor === 'any' ? 'Any' : floor + ' Floor'}</span>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div class="input-group">
            <input type="text" id="roommatePreference" placeholder=" " value="${Utils.sanitize(this.formData.roommatePreference)}">
            <label for="roommatePreference">Any specific roommate request?</label>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="quick-action-btn quick-action-btn--secondary" onclick="StudentApplication.prevStep()">
            ${icons['chevron-left'] || ''}
            Back
          </button>
          <button type="button" class="quick-action-btn quick-action-btn--primary magnetic-btn" onclick="StudentApplication.nextStep()">
            Review Application
            ${icons['chevron-right'] || ''}
          </button>
        </div>
      </div>
    `;
  },

  renderStep4() {
    const deptNames = { cs: 'Computer Science', it: 'Information Technology', ece: 'Electronics & Communication', me: 'Mechanical Engineering', ce: 'Civil Engineering' };
    
    return `
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="form-section-icon">${icons.check || ''}</span>
          Review & Submit
        </h3>
        
        <div class="review-panel glass-panel">
          <div class="review-grid">
            <div class="review-section">
              <h4 class="review-section-title">Personal Details</h4>
              <div class="review-item">
                <span class="review-label">Full Name</span>
                <span class="review-value">${Utils.sanitize(this.formData.fullName)}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Email</span>
                <span class="review-value">${Utils.sanitize(this.formData.email)}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Phone</span>
                <span class="review-value">${Utils.sanitize(this.formData.phone) || 'Not provided'}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Department</span>
                <span class="review-value">${deptNames[this.formData.department] || 'Not selected'}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Guardian</span>
                <span class="review-value">${Utils.sanitize(this.formData.guardianName) || 'Not provided'}</span>
              </div>
              <button class="edit-step-btn" onclick="StudentApplication.goToStep(1)">
                ${icons.edit || ''} Edit
              </button>
            </div>
            
            <div class="review-section">
              <h4 class="review-section-title">Hostel Details</h4>
              <div class="review-item">
                <span class="review-label">Hostel</span>
                <span class="review-value">${this.formData.hostel === 'boys' ? 'Boys Hostel' : this.formData.hostel === 'girls' ? 'Girls Hostel' : 'Not selected'}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Floor Preference</span>
                <span class="review-value">${this.formData.floorPreference === 'any' ? 'Any' : this.formData.floorPreference + ' Floor'}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Roommate Request</span>
                <span class="review-value">${Utils.sanitize(this.formData.roommatePreference) || 'None'}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Requirements</span>
                <span class="review-value">${Utils.sanitize(this.formData.requirements) || 'None'}</span>
              </div>
              <button class="edit-step-btn" onclick="StudentApplication.goToStep(2)">
                ${icons.edit || ''} Edit
              </button>
            </div>
          </div>
        </div>
        
        <div class="declaration-section">
          <label class="checkbox-label">
            <input type="checkbox" id="declaration" required>
            <span class="custom-checkbox"></span>
            <span>I confirm that the information provided is accurate and complete</span>
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" class="quick-action-btn quick-action-btn--secondary" onclick="StudentApplication.prevStep()">
            ${icons['chevron-left'] || ''}
            Back
          </button>
          <button type="submit" class="quick-action-btn quick-action-btn--primary magnetic-btn" id="submitBtn">
            ${icons.check || ''}
            Submit Application
          </button>
        </div>
      </div>
    `;
  },

  // ============================================
  // STATUS VIEWS
  // ============================================

  renderStatus() {
    if (this.application.status === 'pending') {
      return this.renderPendingStatus();
    }
    return this.renderApprovedStatus();
  },

  renderPendingStatus() {
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.bed || ''}
          My Hostel Application
        </h2>
        <span class="badge badge-warning">Pending Review</span>
      </div>
      
      <div class="form-card fade-in stagger-1">
        <div class="pending-message">
          <div class="pending-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3>Your application is under review</h3>
          <p>We'll notify you once a decision is made</p>
        </div>
        
        ${this.renderStatusTimeline()}
        
        <div style="text-align:center;margin-top:24px">
          <button class="quick-action-btn quick-action-btn--danger" onclick="StudentApplication.cancelApplication()">
            ${icons.x || ''}
            Cancel Application
          </button>
        </div>
      </div>
    `;
  },

  renderApprovedStatus() {
    return `
      <div class="section-header" style="margin-bottom:24px">
        <h2 class="section-title" style="font-size:1.5rem;display:flex;align-items:center;gap:8px">
          ${icons.bed || ''}
          My Hostel Application
        </h2>
        <span class="badge badge-success">Approved</span>
      </div>
      
      <div class="approval-card fade-in stagger-1">
        <div class="approval-header">
          <div class="approval-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <h3>Application Approved!</h3>
            <p>Application ID: ${this.application.id}</p>
          </div>
        </div>
        
        <div class="approval-details">
          <div class="approval-detail">
            <span class="detail-label">Hostel</span>
            <span class="detail-value">${Utils.sanitize(this.application.hostel)}</span>
          </div>
          <div class="approval-detail">
            <span class="detail-label">Applied On</span>
            <span class="detail-value">${Utils.formatDate(this.application.date)}</span>
          </div>
        </div>
        
        <div class="approval-actions">
          <a href="#student/myhostel" class="quick-action-btn quick-action-btn--primary">
            ${icons.building || ''}
            View My Hostel
          </a>
        </div>
      </div>
    `;
  },

  renderStatusTimeline() {
    const steps = [
      { label: 'Submitted', completed: true, time: 'Jan 15, 2025' },
      { label: 'Under Review', completed: false, current: true, time: 'In progress' },
      { label: 'Assignment', completed: false, time: 'Pending' },
    ];

    return `
      <div class="status-timeline">
        ${steps.map((step, i) => `
          <div class="status-timeline-item ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}">
            <div class="timeline-dot-wrapper">
              <div class="timeline-dot-inner">
                ${step.completed ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
              </div>
              ${i < steps.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content">
              <div class="timeline-label">${step.label}</div>
              <div class="timeline-time">${step.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ============================================
  // STEP NAVIGATION
  // ============================================

  nextStep() {
    if (!this.validateCurrentStep()) return;
    this.saveCurrentStep();
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateForm();
    }
  },

  prevStep() {
    this.saveCurrentStep();
    
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateForm();
    }
  },

  goToStep(step) {
    this.saveCurrentStep();
    this.currentStep = step;
    this.updateForm();
  },

  updateForm() {
    // Update steps visibility
    document.querySelectorAll('.form-step').forEach((el, i) => {
      el.classList.toggle('active', i + 1 === this.currentStep);
    });

    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((el, i) => {
      const stepNum = i + 1;
      el.classList.toggle('active', stepNum <= this.currentStep);
      el.classList.toggle('completed', stepNum < this.currentStep);
    });

    document.querySelectorAll('.step-connector').forEach((el, i) => {
      el.classList.toggle('completed', i + 1 < this.currentStep);
    });

    // Scroll to top of form
    document.querySelector('.application-form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  saveCurrentStep() {
    switch (this.currentStep) {
      case 1:
        this.formData.fullName = document.getElementById('fullName')?.value || '';
        this.formData.phone = document.getElementById('phone')?.value || '';
        this.formData.department = document.getElementById('department')?.value || '';
        this.formData.guardianName = document.getElementById('guardianName')?.value || '';
        this.formData.guardianPhone = document.getElementById('guardianPhone')?.value || '';
        break;
      case 3:
        this.formData.requirements = document.getElementById('requirements')?.value || '';
        this.formData.medicalConditions = document.getElementById('medicalConditions')?.value || '';
        this.formData.roommatePreference = document.getElementById('roommatePreference')?.value || '';
        break;
    }
  },

  validateCurrentStep() {
    switch (this.currentStep) {
      case 1:
        const phone = document.getElementById('phone')?.value;
        if (!phone || phone.length < 10) {
          showToast('Please enter a valid phone number', 'error');
          return false;
        }
        return true;
      case 2:
        if (!this.formData.hostel) {
          showToast('Please select a hostel', 'error');
          return false;
        }
        return true;
      default:
        return true;
    }
  },

  // ============================================
  // HELPERS
  // ============================================

  selectHostel(type) {
    this.formData.hostel = type;
    document.querySelectorAll('.hostel-radio-card').forEach(card => {
      card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
  },

  updateFloorPreference(floor) {
    this.formData.floorPreference = floor;
    document.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('active'));
    event.currentTarget.closest('.radio-option').classList.add('active');
  },

  updateCharCount(textarea, countId, max) {
    const count = textarea.value.length;
    const el = document.getElementById(countId);
    if (el) {
      el.textContent = `${count}/${max}`;
      el.classList.toggle('over-limit', count > max);
    }
  },

  cancelApplication() {
    if (confirm('Are you sure you want to cancel your application?')) {
      this.application.status = 'none';
      showToast('Application cancelled', 'info');
      this.refresh();
    }
  },

  submit(e) {
    e.preventDefault();
    
    const declaration = document.getElementById('declaration');
    if (!declaration?.checked) {
      showToast('Please confirm the declaration', 'error');
      return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Submitting...';

    setTimeout(() => {
      this.application.status = 'approved';
      this.application.id = 'HB-2025-' + Math.floor(Math.random() * 90000 + 10000);
      this.application.date = new Date().toISOString();
      
      this.refresh();
      showToast('Application submitted successfully!', 'success');
    }, 1500);
  },

  refresh() {
    const content = document.getElementById('pageContent');
    if (content) {
      content.innerHTML = this.render();
      this.init();
    }
  },

  init() {
    this.currentStep = 1;
    
    // Initialize character counts
    setTimeout(() => {
      const reqField = document.getElementById('requirements');
      const medField = document.getElementById('medicalConditions');
      if (reqField) this.updateCharCount(reqField, 'reqCount', 500);
      if (medField) this.updateCharCount(medField, 'medCount', 300);
      
      // Initialize magnetic effects
      document.querySelectorAll('.magnetic-btn').forEach(btn => {
        if (typeof Animations !== 'undefined') Animations.magneticEffect(btn);
      });
    }, 100);

    console.log('[HostelBuddy] Application page initialized');
  },
};

window.StudentApplication = StudentApplication;
