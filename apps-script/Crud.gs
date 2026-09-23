/**
 * Crud.gs — CRUD operations for the Companies sheet
 */

// ─── Column Headers ────────────────────────────────────────────────────────

var COMPANY_HEADERS = [
  'id', 'name', 'logo_url', 'role', 'package',
  'eligibility_branch', 'eligibility_cgpa', 'backlog_allowed',
  'drive_date', 'apply_deadline', 'apply_link',
  'jd_pdf_url', 'status', 'created_at'
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function getCompaniesSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Companies');
  if (!sheet) {
    throw new Error('Companies sheet not found. Run setupSheets() first.');
  }
  return sheet;
}

function rowToObject(headers, row) {
  var obj = {};
  for (var i = 0; i < headers.length; i++) {
    obj[headers[i]] = row[i] !== undefined ? row[i] : '';
  }
  return obj;
}

function generateId() {
  return Utilities.getUuid();
}

// ─── GET ALL (with filters) ────────────────────────────────────────────────

function getAllCompanies(filters) {
  var sheet = getCompaniesSheet();
  var data = sheet.getDataRange().getValues();

  if (data.length <= 1) return []; // Only headers, no data

  var headers = data[0];
  var companies = [];

  for (var i = 1; i < data.length; i++) {
    var company = rowToObject(headers, data[i]);

    // Apply filters
    if (filters) {
      if (filters.branch && company.eligibility_branch) {
        var branches = company.eligibility_branch.toString().toLowerCase().split(',').map(function(b) { return b.trim(); });
        if (branches.indexOf(filters.branch.toLowerCase().trim()) === -1 && filters.branch.toLowerCase() !== 'all') {
          continue;
        }
      }

      if (filters.status && filters.status.toLowerCase() !== 'all') {
        if (company.status.toString().toLowerCase() !== filters.status.toLowerCase()) {
          continue;
        }
      }

      if (filters.role && filters.role.toLowerCase() !== 'all') {
        if (company.role.toString().toLowerCase().indexOf(filters.role.toLowerCase()) === -1) {
          continue;
        }
      }

      if (filters.search) {
        var searchTerm = filters.search.toLowerCase();
        var searchable = (company.name + ' ' + company.role + ' ' + company.package).toLowerCase();
        if (searchable.indexOf(searchTerm) === -1) {
          continue;
        }
      }
    }

    companies.push(company);
  }

  // Sort by created_at descending (newest first)
  companies.sort(function(a, b) {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return companies;
}

// ─── GET BY ID ─────────────────────────────────────────────────────────────

function getCompanyById(id) {
  var sheet = getCompaniesSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      return rowToObject(headers, data[i]);
    }
  }
  return null;
}

// ─── ADD COMPANY ───────────────────────────────────────────────────────────

function addCompany(data) {
  var sheet = getCompaniesSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  var id = generateId();
  var now = new Date().toISOString();

  var row = headers.map(function(header) {
    if (header === 'id') return id;
    if (header === 'created_at') return now;
    if (header === 'status') return data.status || 'Open';
    return data[header] !== undefined ? data[header] : '';
  });

  sheet.appendRow(row);

  return rowToObject(headers, row);
}

// ─── EDIT COMPANY ──────────────────────────────────────────────────────────

function editCompany(id, data) {
  var sheet = getCompaniesSheet();
  var allData = sheet.getDataRange().getValues();
  var headers = allData[0];
  var idCol = headers.indexOf('id');

  for (var i = 1; i < allData.length; i++) {
    if (allData[i][idCol] === id) {
      var rowIndex = i + 1; // 1-indexed for sheet

      // Update each field if provided in data
      for (var key in data) {
        if (data.hasOwnProperty(key) && key !== 'id' && key !== 'created_at') {
          var colIndex = headers.indexOf(key);
          if (colIndex !== -1) {
            sheet.getRange(rowIndex, colIndex + 1).setValue(data[key]);
          }
        }
      }

      // Return updated company
      var updatedRow = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
      return rowToObject(headers, updatedRow);
    }
  }
  return null;
}

// ─── DELETE COMPANY ────────────────────────────────────────────────────────

function deleteCompany(id) {
  var sheet = getCompaniesSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1); // 1-indexed
      return true;
    }
  }
  return false;
}

// ─── TOGGLE STATUS ─────────────────────────────────────────────────────────

function toggleCompanyStatus(id) {
  var sheet = getCompaniesSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('id');
  var statusCol = headers.indexOf('status');

  for (var i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      var currentStatus = data[i][statusCol];
      var newStatus = (currentStatus === 'Open') ? 'Closed' : 'Open';
      sheet.getRange(i + 1, statusCol + 1).setValue(newStatus);

      // Return updated company
      var updatedRow = sheet.getRange(i + 1, 1, 1, headers.length).getValues()[0];
      var company = rowToObject(headers, updatedRow);
      company.status = newStatus;
      return company;
    }
  }
  return null;
}
