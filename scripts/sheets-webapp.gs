/**
 * Koh Chang Solar Cell — Sheets web app
 *
 * Receives lead submissions from the homepage inquiry forms (EN + TH),
 * appends one row per lead to a "Leads" tab in the central Google Sheet,
 * and returns JSON so the browser-side AJAX stays non-navigating.
 *
 * Deploy instructions for hendrixclaw@gmail.com (Sheet owner):
 *   1. https://script.google.com  (signed in as hendrixclaw@gmail.com)
 *   2. "+ New project"
 *   3. Replace Code.gs content with this file
 *   4. Run doGet once from the editor → "Review permissions" → Hendrix account → "Allow"
 *   5. Deploy → "New deployment" → type: "Web app"
 *        Description: Koh Chang Solar leads
 *        Execute as:  Me (hendrixclaw@gmail.com)
 *        Who has access: Anyone
 *   6. Copy the /exec URL — paste into both homepage forms'
 *      data-sheets-url attribute, then push the site.
 *
 * Field detection (no separate `lang` field needed):
 *   EN form posts first_name + last_name → row tagged lang=en
 *   TH form posts a single name field    → row tagged lang=th
 */

var SHEET_ID = '1vfzIbkmOMcnjzzUwyrnrsIrodeMpea8eAsXAlHRpNcE';
var TAB_NAME = 'Leads';

var HEADERS = [
  'timestamp',
  'lang',
  'service',
  'name',
  'first_name',
  'last_name',
  'phone',
  'email',
  'message',
  'address',
  'city',
  'province'
];

function doPost(e) {
  try {
    var data = (e && e.parameter) ? e.parameter : {};

    var firstName = String(data.first_name || '').trim();
    var lastName  = String(data.last_name  || '').trim();
    var thName    = String(data.name       || '').trim();
    var lang      = firstName || lastName ? 'en' : 'th';
    var combinedName = (firstName + ' ' + lastName).trim() || thName;

    var row = [
      new Date(),
      lang,
      String(data.service  || '').trim(),
      combinedName,
      firstName,
      lastName,
      String(data.phone    || '').trim(),
      String(data.email    || '').trim(),
      String(data.message  || '').trim(),
      String(data.address  || '').trim(),
      String(data.city     || '').trim(),
      String(data.province || '').trim()
    ];

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(TAB_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(TAB_NAME);
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setFrozen(true);
    } else if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setFrozen(true);
    }

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err && err.message ? err.message : err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      app: 'kohchang-sheets-webapp',
      version: 1,
      sheet_id: SHEET_ID,
      tab: TAB_NAME
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
