/* global SpreadsheetApp, UrlFetchApp, PropertiesService, ContentService, LockService, MailApp */

/**
 * Bodhan — /fln-dpi feedback backend (Google Apps Script, container-bound).
 *
 * The website is a static SPA on GitHub Pages, so this script is the server:
 * it verifies the Cloudflare Turnstile token, validates the payload and appends
 * one row per submission to the Google Sheet it is bound to.
 *
 * Setup is documented in docs/fln-dpi-feedback.md. In short:
 *   1. Create a Google Sheet, open Extensions > Apps Script, paste this file.
 *   2. Project Settings > Script properties:
 *        TURNSTILE_SECRET     (required)  Turnstile secret key
 *        ALLOWED_HOSTNAMES    (optional)  comma-separated, e.g. "bodhan.ai,www.bodhan.ai"
 *        SHEET_NAME           (optional)  tab name, default "Responses"
 *        NOTIFY_EMAIL         (optional)  send a short email per submission
 *   3. Deploy > New deployment > Web app; Execute as: Me; Who has access: Anyone.
 *   4. Put the /exec URL in the site's VITE_FLN_DPI_SCRIPT_URL.
 *
 * Keep ROLES / TOPICS in sync with src/features/flnDpi/data/content.js.
 */

var ROLES = [
  'Student',
  'Parent',
  'Teacher',
  'School leader / administrator',
  'Teacher educator',
  'Education department official',
  'EdTech / DPI builder',
  'Researcher / expert',
  'Civil society / NGO',
  'Organisation / institution',
  'Other',
];
var TOPICS = ['fln', 'dpi', 'both'];

var FEEDBACK_MIN = 20;
var FEEDBACK_MAX = 5000;
var NAME_MAX = 120;
var EMAIL_MAX = 160;
var ORG_MAX = 160;

var SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
var HEADER = [
  'Submitted at',
  'Role',
  'Topic',
  'Feedback',
  'Name',
  'Email',
  'Organisation',
  'Turnstile hostname',
  'Turnstile action',
  'Source',
];

function doGet() {
  return respond({ ok: true, service: 'fln-dpi-feedback' });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return respond({ success: false, error: 'Malformed request.' });
  }

  // Honeypot: a filled "website" field is a bot. Answer success so it moves on.
  if (clean(body.website, 200)) {
    return respond({ success: true });
  }

  var role = clean(body.role, 80);
  var topic = clean(body.topic, 20);
  var feedback = clean(body.feedback, FEEDBACK_MAX, true);
  var name = clean(body.name, NAME_MAX);
  var email = clean(body.email, EMAIL_MAX);
  var organisation = clean(body.organisation, ORG_MAX);
  var source = clean(body.source, 40) || 'fln-dpi';
  var token = clean(body.turnstileToken, 4096);

  if (ROLES.indexOf(role) === -1) return respond({ success: false, error: 'Please choose what describes you best.' });
  if (TOPICS.indexOf(topic) === -1) return respond({ success: false, error: 'Please choose a topic.' });
  if (feedback.length < FEEDBACK_MIN) return respond({ success: false, error: 'Please write a little more feedback.' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond({ success: false, error: 'That does not look like an email address.' });
  if (!token) return respond({ success: false, error: 'Please complete the human verification.' });

  var verdict;
  try {
    verdict = verifyTurnstile(token);
  } catch (err) {
    console.error('siteverify failed: ' + err);
    return respond({ success: false, error: 'Verification is temporarily unavailable. Please try again in a moment.' });
  }
  if (!verdict.ok) {
    return respond({ success: false, error: 'Human verification failed. Please retry the check and submit again.' });
  }

  var row = [
    new Date(),
    role,
    topic,
    feedback,
    name,
    email,
    organisation,
    verdict.hostname || '',
    verdict.action || '',
    source,
  ].map(sheetSafe);

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    getSheet().appendRow(row);
  } catch (err) {
    console.error('append failed: ' + err);
    return respond({ success: false, error: 'Could not record your feedback. Please try again.' });
  } finally {
    try { lock.releaseLock(); } catch (ignored) { /* lock was never acquired */ }
  }

  notify(role, topic, feedback, name, email, organisation);

  return respond({ success: true });
}

// ─── Turnstile ───────────────────────────────────────────────────────────────

function verifyTurnstile(token) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('TURNSTILE_SECRET');
  if (!secret) throw new Error('TURNSTILE_SECRET script property is not set');

  var res = UrlFetchApp.fetch(SITEVERIFY_URL, {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  });
  var data = JSON.parse(res.getContentText() || '{}');
  if (!data.success) {
    console.warn('turnstile rejected: ' + JSON.stringify(data['error-codes'] || []));
    return { ok: false };
  }

  var allowed = (props.getProperty('ALLOWED_HOSTNAMES') || '')
    .split(',')
    .map(function (h) { return h.trim().toLowerCase(); })
    .filter(Boolean);
  if (allowed.length && allowed.indexOf(String(data.hostname || '').toLowerCase()) === -1) {
    console.warn('turnstile hostname not allowed: ' + data.hostname);
    return { ok: false };
  }

  return { ok: true, hostname: data.hostname, action: data.action };
}

// ─── Sheet ───────────────────────────────────────────────────────────────────

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = PropertiesService.getScriptProperties().getProperty('SHEET_NAME') || 'Responses';
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
  }
  return sheet;
}

// Neutralise spreadsheet formula injection: a cell starting with = + - @ is
// evaluated by Sheets. Prefix with an apostrophe so it stays text.
function sheetSafe(value) {
  if (typeof value !== 'string') return value;
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

// ─── Optional notification ───────────────────────────────────────────────────

function notify(role, topic, feedback, name, email, organisation) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;
  try {
    MailApp.sendEmail({
      to: to,
      subject: '[FLN/DPI feedback] ' + role + ' · ' + topic,
      body:
        'Role: ' + role + '\n' +
        'Topic: ' + topic + '\n' +
        'Name: ' + (name || '-') + '\n' +
        'Email: ' + (email || '-') + '\n' +
        'Organisation: ' + (organisation || '-') + '\n\n' +
        feedback,
    });
  } catch (err) {
    console.warn('notify failed: ' + err);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Coerce to a trimmed string, strip control characters (keeping newlines and
// tabs for multiline fields), and cap the length.
function clean(value, max, multiline) {
  if (value === undefined || value === null) return '';
  var s = String(value);
  // Stripping control characters is the point of these two patterns.
  if (multiline) {
    // eslint-disable-next-line no-control-regex
    s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  } else {
    // eslint-disable-next-line no-control-regex
    s = s.replace(/[\x00-\x1F\x7F]/g, ' ');
  }
  s = s.trim();
  return s.length > max ? s.slice(0, max) : s;
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
