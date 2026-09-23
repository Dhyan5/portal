/**
 * Upload.gs — File upload handler
 * Uploads base64-encoded files to Google Drive and returns public URLs.
 */

function uploadFileToDrive(base64Data, fileName, mimeType) {
  var props = PropertiesService.getScriptProperties();
  var folderId = props.getProperty('DRIVE_FOLDER_ID');

  if (!folderId) {
    // Create folder if it doesn't exist
    folderId = createDriveFolder_();
  }

  var folder = DriveApp.getFolderById(folderId);

  // Decode base64 data
  var decoded = Utilities.base64Decode(base64Data);
  var blob = Utilities.newBlob(decoded, mimeType, fileName);

  // Create file in folder
  var file = folder.createFile(blob);

  // Set sharing to anyone with the link can view
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // Return direct view URL
  var fileId = file.getId();

  // For images, return a direct thumbnail/view URL
  if (mimeType.indexOf('image') !== -1) {
    return 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w400';
  }

  // For PDFs and other files, return the standard view URL
  return 'https://drive.google.com/file/d/' + fileId + '/view?usp=sharing';
}

function createDriveFolder_() {
  var folder = DriveApp.createFolder('PlacementPortal_Uploads');
  var folderId = folder.getId();

  // Store folder ID in script properties
  PropertiesService.getScriptProperties().setProperty('DRIVE_FOLDER_ID', folderId);

  // Set folder sharing to anyone with link can view
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return folderId;
}
