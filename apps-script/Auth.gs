/**
 * Auth.gs — Authentication module
 * Handles password hashing, HMAC token generation, and token validation.
 */

// ─── Constants ─────────────────────────────────────────────────────────────

var TOKEN_EXPIRY_HOURS = 24;

// ─── Password Hashing ──────────────────────────────────────────────────────

function hashPassword(password) {
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return digest.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

// ─── HMAC Signing ──────────────────────────────────────────────────────────

function getSecretKey() {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('HMAC_SECRET');
  if (!secret) {
    // Generate a random secret on first use
    secret = Utilities.getUuid() + '-' + Utilities.getUuid();
    props.setProperty('HMAC_SECRET', secret);
  }
  return secret;
}

function hmacSign(message) {
  var secret = getSecretKey();
  var signature = Utilities.computeHmacSignature(
    Utilities.MacAlgorithm.HMAC_SHA_256,
    message,
    secret
  );
  return Utilities.base64Encode(signature);
}

// ─── Token Generation ──────────────────────────────────────────────────────

function generateToken(username) {
  var timestamp = new Date().getTime().toString();
  var payload = username + ':' + timestamp;
  var signature = hmacSign(payload);
  // Token format: base64(username:timestamp:signature)
  return Utilities.base64Encode(payload + ':' + signature);
}

// ─── Token Validation ──────────────────────────────────────────────────────

function validateToken(token) {
  try {
    if (!token) {
      return { valid: false, reason: 'No token provided' };
    }

    // Decode the token
    var decoded = Utilities.newBlob(Utilities.base64Decode(token)).getDataAsString();
    var parts = decoded.split(':');

    if (parts.length < 3) {
      return { valid: false, reason: 'Invalid token format' };
    }

    var username = parts[0];
    var timestamp = parts[1];
    var providedSignature = parts.slice(2).join(':');

    // Recompute HMAC
    var payload = username + ':' + timestamp;
    var expectedSignature = hmacSign(payload);

    if (providedSignature !== expectedSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }

    // Check expiry
    var tokenTime = parseInt(timestamp, 10);
    var now = new Date().getTime();
    var expiryMs = TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;

    if (now - tokenTime > expiryMs) {
      return { valid: false, reason: 'Token expired' };
    }

    return { valid: true, username: username };
  } catch (err) {
    return { valid: false, reason: 'Token validation error: ' + err.message };
  }
}

// ─── Login ─────────────────────────────────────────────────────────────────

function login(username, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Admins');

  // Auto-create Admins sheet if missing
  if (!sheet) {
    sheet = ss.insertSheet('Admins');
    var adminHeaders = ['id', 'username', 'password_hash'];
    sheet.getRange(1, 1, 1, adminHeaders.length).setValues([adminHeaders]);
  }

  var data = sheet.getDataRange().getValues();

  // If table has only headers or is empty, auto-create default admin (admin / 1234)
  if (data.length <= 1) {
    var defaultId = Utilities.getUuid();
    var defaultHash = hashPassword('1234');
    sheet.appendRow([defaultId, 'admin', defaultHash]);
    data = sheet.getDataRange().getValues();
  }

  var headers = data[0];
  var usernameCol = headers.indexOf('username');
  var passwordCol = headers.indexOf('password_hash');

  if (usernameCol === -1 || passwordCol === -1) {
    return { success: false, message: 'Admins sheet schema error. Ensure headers are: id, username, password_hash' };
  }

  var inputHash = hashPassword(String(password).trim());
  var targetUsername = String(username).trim();

  for (var i = 1; i < data.length; i++) {
    var storedUsername = String(data[i][usernameCol]).trim();
    var storedHash = String(data[i][passwordCol]).trim();

    if (storedUsername === targetUsername && storedHash === inputHash) {
      var token = generateToken(targetUsername);
      return {
        success: true,
        token: token,
        username: targetUsername
      };
    }
  }

  return { success: false, message: 'Invalid username or password' };
}
