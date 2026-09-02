/**
 * HostelBuddy — Login Page Logic
 *
 * • Email format validation
 * • Password minimum-length check (6 chars)
 * • Show / hide password toggle
 * • "Remember me" persistence via localStorage
 * • Mock login (console log) with loading state
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     DOM references
     ------------------------------------------------------------------ */
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("togglePassword");
  const rememberMe = document.getElementById("rememberMe");
  const submitBtn = document.getElementById("submitBtn");
  const errorSummary = document.getElementById("errorSummary");
  const errorText = document.getElementById("errorText");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  /* Eye icons inside the toggle button */
  const iconOpen = toggleBtn.querySelector(".icon-eye-open");
  const iconClosed = toggleBtn.querySelector(".icon-eye-closed");

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */

  /** Simple email regex check */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** Show a field-level error */
  function setFieldError(input, errorEl, message) {
    input.classList.add("is-error");
    errorEl.textContent = message;
  }

  /** Clear a field-level error */
  function clearFieldError(input, errorEl) {
    input.classList.remove("is-error");
    errorEl.textContent = "";
  }

  /** Show the top-level error summary */
  function showErrorSummary(message) {
    errorText.textContent = message;
    errorSummary.hidden = false;
  }

  /** Hide the top-level error summary */
  function hideErrorSummary() {
    errorSummary.hidden = true;
    errorText.textContent = "";
  }

  /** Toggle loading state on the submit button */
  function setLoading(loading) {
    const textEl = submitBtn.querySelector(".btn__text");
    const spinnerEl = submitBtn.querySelector(".btn__spinner");

    if (loading) {
      submitBtn.classList.add("btn--loading");
      textEl.textContent = "Signing in…";
      spinnerEl.hidden = false;
    } else {
      submitBtn.classList.remove("btn--loading");
      textEl.textContent = "Login";
      spinnerEl.hidden = true;
    }
  }

  /* ------------------------------------------------------------------
     Password visibility toggle
     ------------------------------------------------------------------ */
  toggleBtn.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    iconOpen.hidden = !isPassword;
    iconClosed.hidden = isPassword;

    toggleBtn.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password"
    );
  });

  /* ------------------------------------------------------------------
     Clear errors on input
     ------------------------------------------------------------------ */
  emailInput.addEventListener("input", function () {
    clearFieldError(emailInput, emailError);
    hideErrorSummary();
  });

  passwordInput.addEventListener("input", function () {
    clearFieldError(passwordInput, passwordError);
    hideErrorSummary();
  });

  /* ------------------------------------------------------------------
     "Remember me" — restore saved email on load
     ------------------------------------------------------------------ */
  const rememberedEmail = localStorage.getItem("hb_remember_email");
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberMe.checked = true;
  }

  /* ------------------------------------------------------------------
     Form submission
     ------------------------------------------------------------------ */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    hideErrorSummary();
    clearFieldError(emailInput, emailError);
    clearFieldError(passwordInput, passwordError);

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let hasErrors = false;

    /* --- Validate email --- */
    if (!email) {
      setFieldError(emailInput, emailError, "Email address is required.");
      hasErrors = true;
    } else if (!isValidEmail(email)) {
      setFieldError(
        emailInput,
        emailError,
        "Please enter a valid email address."
      );
      hasErrors = true;
    }

    /* --- Validate password --- */
    if (!password) {
      setFieldError(passwordInput, passwordError, "Password is required.");
      hasErrors = true;
    } else if (password.length < 6) {
      setFieldError(
        passwordInput,
        passwordError,
        "Password must be at least 6 characters."
      );
      hasErrors = true;
    }

    if (hasErrors) {
      showErrorSummary("Please fix the errors above and try again.");
      return;
    }

    /* --- Remember me --- */
    if (rememberMe.checked) {
      localStorage.setItem("hb_remember_email", email);
    } else {
      localStorage.removeItem("hb_remember_email");
    }

    /* --- Mock login --- */
    mockLogin(email, password);
  });

  /**
   * Mock login — simulates an API call.
   * Replace this with a real fetch() to your auth endpoint.
   */
  function mockLogin(email, password) {
    setLoading(true);

    console.group("🔐 HostelBuddy — Mock Login");
    console.log("Email   :", email);
    console.log("Password:", "•".repeat(password.length));
    console.log("Time    :", new Date().toLocaleString());
    console.groupEnd();

    /* Simulate network delay */
    setTimeout(function () {
      setLoading(false);
      alert(
        "Login successful! (Mock)\n\nEmail: " + email
      );
    }, 1500);
  }
})();
