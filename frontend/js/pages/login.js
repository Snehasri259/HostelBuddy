/**
 * HostelBuddy — Login Page
 */
Pages.login = function(container) {
  let selectedRole = "student";

  container.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="login-logo">
          <div class="logo-icon">🏠</div>
          <h1>HostelBuddy</h1>
          <p>Hostel Management System</p>
        </div>

        <div class="login-tabs">
          <div class="login-tab active" data-tab="login">Login</div>
          <div class="login-tab" data-tab="register">Register</div>
        </div>

        <div class="role-selector">
          <div class="role-option active" data-role="student"><div class="role-icon">🎓</div><div class="role-name">Student</div></div>
          <div class="role-option" data-role="admin"><div class="role-icon">👨‍💼</div><div class="role-name">Hostel Admin</div></div>
          <div class="role-option" data-role="superadmin"><div class="role-icon">👑</div><div class="role-name">Super Admin</div></div>
        </div>

        <div class="login-form-container" id="loginFormContainer">
          <form class="login-form" id="loginForm">
            <div class="input-group">
              <label class="form-label">Email</label>
              <input type="email" class="input" id="loginEmail" placeholder="you@example.com" required />
            </div>
            <div class="input-group" style="position:relative;">
              <label class="form-label">Password</label>
              <input type="password" class="input" id="loginPassword" placeholder="Enter password" required />
              <button type="button" class="password-toggle" onclick="toggleLoginPassword()">👁</button>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
        </div>

        <div class="register-form" id="registerFormContainer">
          <form class="login-form" id="registerForm">
            <div class="input-group"><label class="form-label">Full Name</label><input type="text" class="input" placeholder="John Doe" required /></div>
            <div class="input-group"><label class="form-label">Email</label><input type="email" class="input" placeholder="you@example.com" required /></div>
            <div class="input-group"><label class="form-label">Phone</label><input type="tel" class="input" placeholder="+91 98765 43210" /></div>
            <div class="input-group"><label class="form-label">Password</label><input type="password" class="input" placeholder="Min 6 characters" required /></div>
            <div class="input-group"><label class="form-label">Confirm Password</label><input type="password" class="input" placeholder="Re-enter password" required /></div>
            <button type="submit" class="btn btn-primary">Register</button>
          </form>
        </div>

        <div class="login-footer" id="loginFooter">
          Don't have an account? <a href="#" onclick="event.preventDefault(); toggleLoginTab('register');">Register</a>
        </div>
        <div class="login-footer hidden" id="registerFooter">
          Already have an account? <a href="#" onclick="event.preventDefault(); toggleLoginTab('login');">Login</a>
        </div>
      </div>
    </div>`;

  /* Tab switching */
  Utils.qsa(".login-tab").forEach(tab => {
    tab.addEventListener("click", () => toggleLoginTab(tab.dataset.tab));
  });

  /* Role selection */
  Utils.qsa(".role-option").forEach(opt => {
    opt.addEventListener("click", () => {
      Utils.qsa(".role-option").forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      selectedRole = opt.dataset.role;
    });
  });

  /* Login form */
  Utils.qs("#loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = Utils.qs("#loginEmail").value.trim();
    const pw = Utils.qs("#loginPassword").value;
    if (!validateEmail(email)) { Toast.show("Please enter a valid email", "error"); return; }
    if (!validatePassword(pw)) { Toast.show("Password must be at least 6 characters", "error"); return; }

    /* Mock login */
    const user = { name: email.split("@")[0], email, role: selectedRole };
    App.setUser(user);
    App.navigateTo(selectedRole + "/dashboard");
    Toast.show("Welcome back, " + user.name + "!", "success");
  });

  /* Register form */
  Utils.qs("#registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    Toast.show("Registration successful! Please login.", "success");
    toggleLoginTab("login");
  });
};

function toggleLoginTab(tab) {
  Utils.qsa(".login-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  const loginContainer = document.getElementById("loginFormContainer");
  const registerContainer = document.getElementById("registerFormContainer");
  const loginFooter = document.getElementById("loginFooter");
  const registerFooter = document.getElementById("registerFooter");
  if (tab === "login") {
    loginContainer.classList.remove("hidden");
    registerContainer.classList.remove("active");
    loginFooter.classList.remove("hidden");
    registerFooter.classList.add("hidden");
  } else {
    loginContainer.classList.add("hidden");
    registerContainer.classList.add("active");
    loginFooter.classList.add("hidden");
    registerFooter.classList.remove("hidden");
  }
}

function toggleLoginPassword() {
  const inp = document.getElementById("loginPassword");
  inp.type = inp.type === "password" ? "text" : "password";
}
