/**
 * College Placement Portal — Google Apps Script Backend
 * Main entry point: doGet (public) and doPost (authenticated writes)
 */

// ─── CORS & Response Helpers ───────────────────────────────────────────────

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function successResponse(data, message) {
  return createJsonResponse({
    success: true,
    message: message || 'OK',
    data: data
  });
}

function errorResponse(message, code) {
  return createJsonResponse({
    success: false,
    error: message || 'Unknown error',
    code: code || 400
  });
}

// ─── GET Handler (Public — Students) ───────────────────────────────────────

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getAll';

    switch (action) {
      case 'getAll':
        var filters = {
          branch: e.parameter.branch || '',
          status: e.parameter.status || '',
          role: e.parameter.role || '',
          search: e.parameter.search || ''
        };
        var companies = getAllCompanies(filters);
        return successResponse(companies, 'Companies fetched');

      case 'getById':
        var id = e.parameter.id;
        if (!id) return errorResponse('Missing id parameter', 400);
        var company = getCompanyById(id);
        if (!company) return errorResponse('Company not found', 404);
        return successResponse(company, 'Company fetched');

      case 'ping':
        return successResponse({ status: 'alive', timestamp: new Date().toISOString() }, 'Pong');

      default:
        return errorResponse('Unknown GET action: ' + action, 400);
    }
  } catch (err) {
    return errorResponse('Server error: ' + err.message, 500);
  }
}

// ─── POST Handler (Authenticated — Admin) ──────────────────────────────────

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    var action = body.action || (e && e.parameter && e.parameter.action) || '';

    // Login does not require token
    if (action === 'login') {
      return handleLogin(body);
    }

    // All other POST actions require a valid admin token
    var token = body.token || '';
    var authResult = validateToken(token);
    if (!authResult.valid) {
      return errorResponse('Unauthorized: ' + authResult.reason, 401);
    }

    switch (action) {
      case 'addCompany':
        var newCompany = addCompany(body.data);
        return successResponse(newCompany, 'Company added successfully');

      case 'editCompany':
        if (!body.id) return errorResponse('Missing company id', 400);
        var updated = editCompany(body.id, body.data);
        if (!updated) return errorResponse('Company not found', 404);
        return successResponse(updated, 'Company updated successfully');

      case 'deleteCompany':
        if (!body.id) return errorResponse('Missing company id', 400);
        var deleted = deleteCompany(body.id);
        if (!deleted) return errorResponse('Company not found', 404);
        return successResponse({ id: body.id }, 'Company deleted successfully');

      case 'toggleStatus':
        if (!body.id) return errorResponse('Missing company id', 400);
        var toggled = toggleCompanyStatus(body.id);
        if (!toggled) return errorResponse('Company not found', 404);
        return successResponse(toggled, 'Status toggled successfully');

      case 'uploadFile':
        if (!body.fileData || !body.fileName || !body.mimeType) {
          return errorResponse('Missing file data, name, or mimeType', 400);
        }
        var fileUrl = uploadFileToDrive(body.fileData, body.fileName, body.mimeType);
        return successResponse({ url: fileUrl }, 'File uploaded successfully');

      default:
        return errorResponse('Unknown POST action: ' + action, 400);
    }
  } catch (err) {
    return errorResponse('Server error: ' + err.message, 500);
  }
}

// ─── Login Handler ─────────────────────────────────────────────────────────

function handleLogin(body) {
  var username = body.username || '';
  var password = body.password || '';

  if (!username || !password) {
    return errorResponse('Username and password are required', 400);
  }

  var result = login(username, password);
  if (!result.success) {
    return errorResponse(result.message, 401);
  }

  return successResponse({
    token: result.token,
    username: result.username
  }, 'Login successful');
}
