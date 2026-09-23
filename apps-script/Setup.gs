/**
 * Setup.gs — One-time setup scripts
 * Run these functions manually from the Apps Script editor.
 */

/**
 * Creates the Companies and Admins sheets with proper headers.
 * Run this once after creating your Google Sheet.
 */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── Companies Sheet ──────────────────────────────────────────
  var companiesSheet = ss.getSheetByName('Companies');
  if (!companiesSheet) {
    companiesSheet = ss.insertSheet('Companies');
    Logger.log('Created "Companies" sheet.');
  }

  var companyHeaders = [
    'id', 'name', 'logo_url', 'role', 'package',
    'eligibility_branch', 'eligibility_cgpa', 'backlog_allowed',
    'drive_date', 'apply_deadline', 'apply_link',
    'jd_pdf_url', 'status', 'created_at'
  ];

  companiesSheet.getRange(1, 1, 1, companyHeaders.length).setValues([companyHeaders]);
  companiesSheet.getRange(1, 1, 1, companyHeaders.length)
    .setFontWeight('bold')
    .setBackground('#4F46E5')
    .setFontColor('#FFFFFF');

  // Auto-resize columns
  for (var i = 1; i <= companyHeaders.length; i++) {
    companiesSheet.autoResizeColumn(i);
  }

  Logger.log('Companies sheet headers set.');

  // ── Admins Sheet ─────────────────────────────────────────────
  var adminsSheet = ss.getSheetByName('Admins');
  if (!adminsSheet) {
    adminsSheet = ss.insertSheet('Admins');
    Logger.log('Created "Admins" sheet.');
  }

  var adminHeaders = ['id', 'username', 'password_hash'];
  adminsSheet.getRange(1, 1, 1, adminHeaders.length).setValues([adminHeaders]);
  adminsSheet.getRange(1, 1, 1, adminHeaders.length)
    .setFontWeight('bold')
    .setBackground('#4F46E5')
    .setFontColor('#FFFFFF');

  for (var j = 1; j <= adminHeaders.length; j++) {
    adminsSheet.autoResizeColumn(j);
  }

  Logger.log('Admins sheet headers set.');

  // ── Delete default Sheet1 if it exists ───────────────────────
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) {
    ss.deleteSheet(defaultSheet);
    Logger.log('Deleted default "Sheet1".');
  }

  Logger.log('✅ Setup complete! Now run createDefaultAdmin().');
}

/**
 * Creates a default admin account.
 * Default credentials: admin / admin123
 * ⚠️  CHANGE THE PASSWORD after first login!
 */
function createDefaultAdmin() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Admins');

  if (!sheet) {
    Logger.log('❌ Admins sheet not found. Run setupSheets() first.');
    return;
  }

  var id = Utilities.getUuid();
  var username = 'admin';
  var passwordHash = hashPassword('1234');

  sheet.appendRow([id, username, passwordHash]);

  Logger.log('✅ Default admin created!');
  Logger.log('   Username: admin');
  Logger.log('   Password: 1234');
  Logger.log('   ⚠️  Change this password after first login!');
}

/**
 * Creates the Google Drive folder for file uploads.
 */
function setupDriveFolder() {
  var props = PropertiesService.getScriptProperties();
  var existingId = props.getProperty('DRIVE_FOLDER_ID');

  if (existingId) {
    try {
      var existing = DriveApp.getFolderById(existingId);
      Logger.log('Drive folder already exists: ' + existing.getName());
      Logger.log('Folder URL: ' + existing.getUrl());
      return;
    } catch (e) {
      // Folder was deleted, create a new one
    }
  }

  var folder = DriveApp.createFolder('PlacementPortal_Uploads');
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  props.setProperty('DRIVE_FOLDER_ID', folder.getId());

  Logger.log('✅ Drive folder created: PlacementPortal_Uploads');
  Logger.log('   Folder URL: ' + folder.getUrl());
  Logger.log('   Folder ID saved to Script Properties.');
}

/**
 * Run this single function to do the full setup at once.
 */
function fullSetup() {
  setupSheets();
  createDefaultAdmin();
  setupDriveFolder();
  Logger.log('');
  Logger.log('🎉 Full setup complete!');
  Logger.log('Next steps:');
  Logger.log('1. Deploy this script as a Web App (Deploy > New Deployment > Web App)');
  Logger.log('2. Set "Execute as" to "Me"');
  Logger.log('3. Set "Who has access" to "Anyone"');
  Logger.log('4. Copy the Web App URL and paste it in your React .env file');
}
