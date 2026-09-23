/**
 * API Client — communicates with the Google Apps Script Web App
 *
 * Set VITE_APPS_SCRIPT_URL in your .env file to the deployed Web App URL.
 */

const SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

// ─── Helper ────────────────────────────────────────────────────────────────

async function request(method, params = {}, body = null) {
  try {
    let url = SCRIPT_URL;

    if (!url || !url.trim()) {
      return {
        success: false,
        error: 'VITE_APPS_SCRIPT_URL is missing. Please add your Google Apps Script Web App URL to your .env file.'
      };
    }

    let response;

    if (method === 'GET') {
      const queryString = new URLSearchParams(params).toString();
      if (queryString) url += (url.includes('?') ? '&' : '?') + queryString;

      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
      });
    } else if (method === 'POST') {
      response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(body),
      });
    }

    if (!response) {
      return { success: false, error: 'No response received from backend.' };
    }

    const text = await response.text();

    if (!text || !text.trim()) {
      return {
        success: false,
        error: 'Empty response received from backend. Check Apps Script deployment.'
      };
    }

    try {
      return JSON.parse(text);
    } catch (parseErr) {
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        return {
          success: false,
          error: 'Backend returned HTML instead of JSON. Ensure your Apps Script Web App is deployed with Access set to "Anyone".'
        };
      }
      return {
        success: false,
        error: 'Invalid JSON response from server: ' + text.slice(0, 100)
      };
    }
  } catch (error) {
    console.error('API request failed:', error);
    return { success: false, error: error.message || 'Network request failed. Check internet connection.' };
  }
}

// ─── Public API (Students) ─────────────────────────────────────────────────

export async function fetchDrives(filters = {}) {
  const params = { action: 'getAll' };
  if (filters.branch) params.branch = filters.branch;
  if (filters.status) params.status = filters.status;
  if (filters.role) params.role = filters.role;
  if (filters.search) params.search = filters.search;

  return request('GET', params);
}

export async function fetchDriveById(id) {
  return request('GET', { action: 'getById', id });
}

// ─── Auth API ──────────────────────────────────────────────────────────────

export async function loginAdmin(username, password) {
  return request('POST', {}, {
    action: 'login',
    username,
    password,
  });
}

// ─── Admin API (Authenticated) ─────────────────────────────────────────────

export async function addDrive(token, data) {
  return request('POST', {}, {
    action: 'addCompany',
    token,
    data,
  });
}

export async function editDrive(token, id, data) {
  return request('POST', {}, {
    action: 'editCompany',
    token,
    id,
    data,
  });
}

export async function deleteDrive(token, id) {
  return request('POST', {}, {
    action: 'deleteCompany',
    token,
    id,
  });
}

export async function toggleDriveStatus(token, id) {
  return request('POST', {}, {
    action: 'toggleStatus',
    token,
    id,
  });
}

export async function uploadFile(token, base64Data, fileName, mimeType) {
  return request('POST', {}, {
    action: 'uploadFile',
    token,
    fileData: base64Data,
    fileName,
    mimeType,
  });
}
