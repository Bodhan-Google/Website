/* global SpreadsheetApp, UrlFetchApp, PropertiesService, ContentService, LockService, MailApp */

/**
 * Bodhan — /fln-dpi interest form backend (Google Apps Script, container-bound).
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
 * Keep the option lists below in sync with src/features/flnDpi/data/content.js.
 */

var ENGAGEMENT = ['use-models', 'contribute', 'whitepaper'];

var AREAS = [
  'Vision, pedagogy and policy',
  'Standards and specifications',
  'Trust rails',
  'AI and assessment models',
  'Applications',
  'Rollout and operations',
  'Other',
];

var MODES = [
  'Build (engineering / product)',
  'Domain expertise and advisory',
  'Field deployment and rollout',
  'Data or content contribution',
  'Funding / sponsorship',
  'Other',
];

var MODELS = ['ASR', 'OCR', 'TTS'];

// Whitepaper v1.0, Section 21 "Open questions for consultation".
var WP_QUESTIONS = [
  'Consent at population scale',
  'The consent-manager function',
  'The capacity bridge',
  'Offline and low-connectivity operation',
  'Benchmark governance',
  'Language expansion',
  'Learner-record scope',
  'Something else in the whitepaper',
];

var NAME_MAX = 120;
var EMAIL_MAX = 160;
var ORG_MAX = 160;
var OTHER_MAX = 200;
var LONG_MAX = 3000;

var SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
var HEADER = [
  'Submitted at',
  'Name',
  'Organisation',
  'Email',
  'Engagement',
  'Areas',
  'Areas (other)',
  'Contribution modes',
  'Modes (other)',
  'Tell us more',
  'Models',
  'Use case',
  'Whitepaper questions',
  'Whitepaper comments',
  'Turnstile hostname',
  'Source',
];

function doGet() {
  return respond({ ok: true, service: 'fln-dpi-interest' });
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

  var name = clean(body.name, NAME_MAX);
  var organisation = clean(body.organisation, ORG_MAX);
  var email = clean(body.email, EMAIL_MAX);
  var engagement = pickAllowed(body.engagement, ENGAGEMENT);
  var wantsContribute = engagement.indexOf('contribute') !== -1;
  var wantsModels = engagement.indexOf('use-models') !== -1;
  var areas = wantsContribute ? pickAllowed(body.areas, AREAS) : [];
  var areasOther = wantsContribute && areas.indexOf('Other') !== -1 ? clean(body.areasOther, OTHER_MAX) : '';
  var modes = wantsContribute ? pickAllowed(body.modes, MODES) : [];
  var modesOther = wantsContribute && modes.indexOf('Other') !== -1 ? clean(body.modesOther, OTHER_MAX) : '';
  var tellMore = wantsContribute ? clean(body.tellMore, LONG_MAX, true) : '';
  var models = wantsModels ? pickAllowed(body.models, MODELS) : [];
  var useCase = wantsModels ? clean(body.useCase, LONG_MAX, true) : '';
  var wantsWhitepaper = engagement.indexOf('whitepaper') !== -1;
  var wpQuestions = wantsWhitepaper ? pickAllowed(body.wpQuestions, WP_QUESTIONS) : [];
  var wpComments = wantsWhitepaper ? clean(body.wpComments, LONG_MAX, true) : '';
  var source = clean(body.source, 40) || 'fln-dpi';
  var token = clean(body.turnstileToken, 4096);

  if (!name) return respond({ success: false, error: 'Please enter your name.' });
  if (!organisation) return respond({ success: false, error: 'Please enter your organisation.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond({ success: false, error: 'Please enter a valid email address.' });
  if (!engagement.length) return respond({ success: false, error: 'Please choose how you would like to engage.' });
  if (wantsContribute && !areas.length) return respond({ success: false, error: 'Please pick at least one area you can contribute to.' });
  if (wantsContribute && !modes.length) return respond({ success: false, error: 'Please pick how you would contribute.' });
  if (wantsModels && !models.length) return respond({ success: false, error: 'Please pick at least one model.' });
  if (wantsWhitepaper && !wpQuestions.length && !wpComments) return respond({ success: false, error: 'Please pick an open question or leave a comment on the whitepaper.' });
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
    name,
    organisation,
    email,
    engagement.join('; '),
    areas.join('; '),
    areasOther,
    modes.join('; '),
    modesOther,
    tellMore,
    models.join('; '),
    useCase,
    wpQuestions.join('; '),
    wpComments,
    verdict.hostname || '',
    source,
  ].map(sheetSafe);

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    getSheet().appendRow(row);
  } catch (err) {
    console.error('append failed: ' + err);
    return respond({ success: false, error: 'Could not record your response. Please try again.' });
  } finally {
    try { lock.releaseLock(); } catch (ignored) { /* lock was never acquired */ }
  }

  notify(name, organisation, email, engagement, areas, modes, models, tellMore, useCase, wpQuestions, wpComments);

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

function notify(name, organisation, email, engagement, areas, modes, models, tellMore, useCase, wpQuestions, wpComments) {
  var to = PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL');
  if (!to) return;
  try {
    MailApp.sendEmail({
      to: to,
      subject: '[FLN DPI interest] ' + name + ' · ' + organisation,
      body:
        'Name: ' + name + '\n' +
        'Organisation: ' + organisation + '\n' +
        'Email: ' + email + '\n' +
        'Engagement: ' + engagement.join(', ') + '\n' +
        (areas.length ? 'Areas: ' + areas.join(', ') + '\n' : '') +
        (modes.length ? 'Modes: ' + modes.join(', ') + '\n' : '') +
        (models.length ? 'Models: ' + models.join(', ') + '\n' : '') +
        (tellMore ? '\nTell us more:\n' + tellMore + '\n' : '') +
        (useCase ? '\nUse case:\n' + useCase + '\n' : '') +
        (wpQuestions.length ? '\nWhitepaper questions: ' + wpQuestions.join(', ') + '\n' : '') +
        (wpComments ? '\nWhitepaper comments:\n' + wpComments + '\n' : ''),
    });
  } catch (err) {
    console.warn('notify failed: ' + err);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Keep only the entries of `values` that appear in `allowed`, deduplicated and
// in allow-list order. Anything else (unknown labels, non-strings) is dropped.
function pickAllowed(values, allowed) {
  if (!Array.isArray(values)) return [];
  var wanted = values.map(function (v) { return clean(v, 200); });
  return allowed.filter(function (a) { return wanted.indexOf(a) !== -1; });
}

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
