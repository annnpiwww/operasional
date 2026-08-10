/**
 * OTOMATISASI REKAPAN TOTAL INCOME - GOOGLE APPS SCRIPT & REALTIME WEB APP API
 * PT BAHANA SECURITY SISTEM - KC SULUTGOTENGPA
 * 
 * Penggunaan:
 * 1. Di Google Sheet: Buka Extensions -> Apps Script -> Paste kode ini.
 * 2. Deploy -> New deployment -> Select type: Web App -> Execute as: Me -> Who has access: Anyone.
 * 3. URL Web App yang didapat bisa dipakai untuk Realtime API sync tanpa perlu buka browser!
 */

const CONFIG = {
  SHEET_NAME: "Rekapan Total Income",
  DEFAULT_LOCATION: "MGNW"
};

/**
 * Web App API GET Endpoint: Mengembalikan data income 20 Outlets dalam format JSON Realtime
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return responseJSON({ status: "error", message: "Sheet kosong atau belum ada data" });
    }

    const headers = data[0].map(h => String(h).trim().toLowerCase());
    const dateCol = headers.findIndex(h => h.includes('tanggal') || h.includes('date'));
    const locCol = headers.findIndex(h => h.includes('lokasi') || h.includes('outlet'));
    const incCol = headers.findIndex(h => h.includes('income') || h.includes('total') || h.includes('pendapatan'));

    const rows = [];
    for (let i = 1; i < data.length; i++) {
      rows.push({
        row: i + 1,
        tanggal: data[i][dateCol !== -1 ? dateCol : 0],
        lokasi: data[i][locCol !== -1 ? locCol : 1],
        income: data[i][incCol !== -1 ? incCol : 2]
      });
    }

    return responseJSON({
      status: "success",
      sheet: CONFIG.SHEET_NAME,
      totalRows: rows.length,
      data: rows
    });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

/**
 * Web App API POST Endpoint: Menerima data income baru & update sheet secara Realtime
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { lokasi, tanggal, income } = body;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getActiveSheet();

    sheet.appendRow([tanggal || new Date(), lokasi || CONFIG.DEFAULT_LOCATION, income || 0]);

    return responseJSON({
      status: "success",
      message: `Data income ${lokasi} sebesar Rp ${income} berhasil diinsert!`,
      insertedRow: sheet.getLastRow()
    });
  } catch (err) {
    return responseJSON({ status: "error", message: err.toString() });
  }
}

function responseJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Trigger UI saat spreadsheet dibuka
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 Otomatisasi Ops')
    .addItem('⚡ Sync Income Hari Ini', 'syncIncomeHariIni')
    .addItem('⏰ Pasang Trigger Otomatis Harian', 'setupDailyTrigger')
    .addToUi();
}
