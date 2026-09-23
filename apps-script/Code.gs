/**
 * College Placement Portal — Google Apps Script Backend
 * Handles form submissions, file uploads to Google Drive, and Google Sheets storage.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 📍 CONFIGURATION — PASTE YOUR GOOGLE SHEET & DRIVE FOLDER LINKS HERE
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_ID = "https://docs.google.com/spreadsheets/d/1qjuGmOM6PG6yM6ynMcaYTXc98n06SXGCfRZgFDGqMqc/edit?usp=sharing";
const DRIVE_FOLDER_ID = "https://drive.google.com/drive/folders/1Zlq_qw5ZTajGvut4Dbq9yxYZpxwpQy0P?usp=drive_link";

// Optional separate sub-folders for Logos and JDs (Leave as empty string if not using)
const LOGOS_FOLDER_ID = "";
const JDS_FOLDER_ID = "";

// Required Sheet Headers
const SHEET_HEADERS = [
  'id', 'name', 'logo_url', 'role', 'package',
  'eligibility_branch', 'eligibility_cgpa', 'drive_date',
  'apply_deadline', 'apply_link', 'jd_pdf_url', 'status', 'created_at'
];

// ─────────────────────────────────────────────────────────────────────────────
// 🛠️ HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts raw ID from full Google Spreadsheet or Google Drive URL
 */
function extractIdFromUrl(input) {
  if (!input) return '';
  input = input.toString().trim();

  // Match /d/{ID} in Sheets/Drive URLs
  var dMatch = input.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];

  // Match /folders/{ID} in Drive URLs
  var folderMatch = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) return folderMatch[1];

  // Match ?id={ID}
  var paramMatch = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (paramMatch && paramMatch[1]) return paramMatch[1];

  // Return raw string if already an ID
  return input;
}

/**
 * Opens and validates the Google Spreadsheet
 */
function getSpreadsheet() {
  var id = extractIdFromUrl(SHEET_ID);
  if (!id) {
    throw new Error("Invalid Sheet ID. Please check SHEET_ID constant at the top of the script.");
  }
  try {
    return SpreadsheetApp.openById(id);
  } catch (err) {
    throw new Error("Invalid Sheet ID or Permission Denied: Unable to access spreadsheet (" + err.message + ")");
  }
}

/**
 * Opens and validates a Google Drive folder
 */
function getDriveFolder(targetUrlOrId) {
  var raw = targetUrlOrId || DRIVE_FOLDER_ID;
  var id = extractIdFromUrl(raw);
  if (!id) {
    throw new Error("Invalid Drive Folder ID. Please check DRIVE_FOLDER_ID constant at the top of the script.");
  }
  try {
    return DriveApp.getFolderById(id);
  } catch (err) {
    throw new Error("Folder not found or Permission Denied: Unable to access Drive folder (" + err.message + ")");
  }
}

/**
 * Gets or initializes the 'Companies' sheet with required headers
 */
function getOrCreateSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Companies') || ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#4F46E5')
      .setFontColor('#FFFFFF');
  }
  return sheet;
}

/**
 * Encapsulates JSON responses with CORS headers
 */
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

/**
 * Uploads a base64 encoded file to Google Drive and sets public access
 */
function uploadBase64File(base64Data, fileName, mimeType, folderUrlOrId) {
  if (!base64Data || !fileName) return '';

  var folder = getDriveFolder(folderUrlOrId);
  var decoded = Utilities.base64Decode(base64Data);
  var blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', fileName);

  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var fileId = file.getId();

  if (mimeType && mimeType.indexOf('image') !== -1) {
    return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w400';
  }
  return 'https://drive.google.com/file/d/' + fileId + '/view?usp=sharing';
}

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 GET HANDLER (Public Data Retrieval & Filtering)
// ─────────────────────────────────────────────────────────────────────────────

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return successResponse([], 'No placement drives found.');
    }

    var headers = data[0];
    var statusFilter = (e && e.parameter && e.parameter.status) ? e.parameter.status.toString().toLowerCase().trim() : '';
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';

    if (action === 'ping') {
      return successResponse({ status: 'alive', timestamp: new Date().toISOString() }, 'Pong');
    }

    var result = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var item = {};
      for (var j = 0; j < headers.length; j++) {
        item[headers[j]] = row[j] !== undefined ? row[j] : '';
      }

      // Filter by status if provided (e.g. ?status=open)
      if (statusFilter && statusFilter !== 'all') {
        if (item.status.toString().toLowerCase().trim() !== statusFilter) {
          continue;
        }
      }

      result.push(item);
    }

    // Sort by created_at descending (newest first)
    result.sort(function(a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    return successResponse(result, 'Data retrieved successfully');
  } catch (err) {
    return errorResponse(err.message, 500);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 📩 POST HANDLER (Create Drive, Upload Files, Auth & Admin Actions)
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        return errorResponse('Invalid JSON payload: ' + parseErr.message, 400);
      }
    }

    var action = body.action || (e && e.parameter && e.parameter.action) || '';

    // Handle Login Action
    if (action === 'login') {
      return handleLogin(body);
    }

    // Token Validation for Admin Portal Operations
    if (action === 'editCompany' || action === 'deleteCompany' || action === 'toggleStatus') {
      var token = body.token || '';
      var authResult = validateToken(token);
      if (!authResult.valid) {
        return errorResponse('Unauthorized: ' + authResult.reason, 401);
      }
    }

    // Route specific portal actions
    if (action === 'editCompany') {
      var updated = editCompany(body.id, body.data);
      return successResponse(updated, 'Company updated successfully');
    }
    if (action === 'deleteCompany') {
      var deleted = deleteCompany(body.id);
      return successResponse({ id: body.id }, 'Company deleted successfully');
    }
    if (action === 'toggleStatus') {
      var toggled = toggleCompanyStatus(body.id);
      return successResponse(toggled, 'Status toggled successfully');
    }
    if (action === 'uploadFile') {
      var fileUrl = uploadBase64File(body.fileData, body.fileName, body.mimeType, DRIVE_FOLDER_ID);
      return successResponse({ url: fileUrl }, 'File uploaded successfully');
    }

    // Default POST behavior / 'addCompany' action:
    // Insert new placement drive with optional file uploads
    var companyData = body.data || body;

    // Handle File Uploads if provided in payload
    var logoUrl = companyData.logo_url || '';
    var logoData = companyData.logo_data || companyData.logo_base64 || '';
    if (logoData) {
      var logoName = companyData.logo_name || (companyData.name ? companyData.name + '_logo.png' : 'logo.png');
      var logoMime = companyData.logo_mime || 'image/png';
      logoUrl = uploadBase64File(logoData, logoName, logoMime, LOGOS_FOLDER_ID || DRIVE_FOLDER_ID);
    }

    var jdPdfUrl = companyData.jd_pdf_url || '';
    var jdData = companyData.jd_data || companyData.jd_base64 || '';
    if (jdData) {
      var jdName = companyData.jd_name || (companyData.name ? companyData.name + '_JD.pdf' : 'JD.pdf');
      var jdMime = companyData.jd_mime || 'application/pdf';
      jdPdfUrl = uploadBase64File(jdData, jdName, jdMime, JDS_FOLDER_ID || DRIVE_FOLDER_ID);
    }

    var sheet = getOrCreateSheet();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    var id = Utilities.getUuid();
    var createdAt = new Date().toISOString();

    var row = headers.map(function(header) {
      if (header === 'id') return id;
      if (header === 'created_at') return createdAt;
      if (header === 'logo_url') return logoUrl;
      if (header === 'jd_pdf_url') return jdPdfUrl;
      if (header === 'status') return companyData.status || 'Open';
      return companyData[header] !== undefined ? companyData[header] : '';
    });

    sheet.appendRow(row);

    var createdObject = {};
    for (var k = 0; k < headers.length; k++) {
      createdObject[headers[k]] = row[k];
    }

    return successResponse(createdObject, 'Placement drive created successfully');
  } catch (err) {
    return errorResponse('Server error: ' + err.message, 500);
  }
}
