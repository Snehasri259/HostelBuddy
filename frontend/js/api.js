/**
 * HostelBuddy — API Fetch Wrapper
 */
const API_BASE = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("hb_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiGet(endpoint) {
  try {
    const res = await fetch(API_BASE + endpoint, { headers: { "Content-Type": "application/json", ...authHeaders() } });
    if (res.status === 401) { App.clearUser(); App.navigateTo("login"); return null; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) { Toast.show("Network error: " + e.message, "error"); throw e; }
}

async function apiPost(endpoint, data) {
  try {
    const res = await fetch(API_BASE + endpoint, {
      method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data)
    });
    if (res.status === 401) { App.clearUser(); App.navigateTo("login"); return null; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) { Toast.show("Network error: " + e.message, "error"); throw e; }
}

async function apiPut(endpoint, data) {
  try {
    const res = await fetch(API_BASE + endpoint, {
      method: "PUT", headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data)
    });
    if (res.status === 401) { App.clearUser(); App.navigateTo("login"); return null; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) { Toast.show("Network error: " + e.message, "error"); throw e; }
}

async function apiDelete(endpoint) {
  try {
    const res = await fetch(API_BASE + endpoint, {
      method: "DELETE", headers: { "Content-Type": "application/json", ...authHeaders() }
    });
    if (res.status === 401) { App.clearUser(); App.navigateTo("login"); return null; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) { Toast.show("Network error: " + e.message, "error"); throw e; }
}
