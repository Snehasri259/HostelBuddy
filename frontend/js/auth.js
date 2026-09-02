/**
 * HostelBuddy — Auth Logic
 */
async function handleLogin(email, password) {
  const data = await apiPost("/auth/login", { email, password });
  if (data && data.token) {
    localStorage.setItem("hb_token", data.token);
    App.setUser(data.user);
    return data.user;
  }
  return null;
}

function handleRegister(data) {
  return apiPost("/auth/register", data);
}

function handleLogout() {
  App.clearUser();
  localStorage.removeItem("hb_token");
  App.navigateTo("login");
  Toast.show("Logged out successfully", "info");
}

function checkAuth() {
  return App.isLoggedIn();
}

function getRole() {
  return App.getRole();
}
