/**
 * Dasbor Stock Opname – Google Apps Script Web App
 * Tinggal copy-paste. Tidak perlu mengisi ID: script mencari Google Sheet
 * berdasarkan nama file di Google Drive Anda.
 */

// Nama FILE Google Sheet di Drive (bukan nama tab)
const SPREADSHEET_NAME = 'Data_Stock_Opname_Gudang_Farmasi';

// Opsional: isi ID spreadsheet (dalam tanda kutip) jika pencarian berdasarkan nama gagal
const SPREADSHEET_ID = '';

// Nama tab/sheet sumber data
const SHEET_NAME = 'Stock_Opname';

// Kolom yang dikirim ke dashboard
const KEEP = [
  'ID Opname', 'Tanggal Opname', 'Kode Barang', 'Nama Barang', 'Jenis Barang', 'Satuan',
  'No. Batch', 'Gudang', 'Lokasi Rak', 'Kondisi Penyimpanan', 'Supplier',
  'Tanggal Masuk', 'Tanggal Expired', 'Stok Sistem', 'Stok Fisik',
  'Harga Satuan (Rp)', 'Status Mutu', 'Petugas', 'Keterangan'
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Dasbor Stock Opname – Gudang Farmasi')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Cari spreadsheet: (1) ID, (2) spreadsheet induk, (3) nama file di Drive. */
function openSpreadsheet_() {
  if (SPREADSHEET_ID) {
    try { return SpreadsheetApp.openById(SPREADSHEET_ID); }
    catch (e) { throw new Error('SPREADSHEET_ID tidak valid atau file belum berformat Google Sheets. ' + e.message); }
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  while (files.hasNext()) {
    const f = files.next();
    if (f.getMimeType() === MimeType.GOOGLE_SHEETS) return SpreadsheetApp.openById(f.getId());
  }
  throw new Error('File Google Sheet bernama "' + SPREADSHEET_NAME + '" tidak ditemukan di Drive. ' +
    'Pastikan namanya sama persis dan formatnya Google Sheets (bukan .xlsx).');
}

function getData() {
  const ss = openSpreadsheet_();
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('Tab "' + SHEET_NAME + '" tidak ditemukan. Tab yang ada: ' +
    ss.getSheets().map(function (s) { return s.getName(); }).join(', '));

  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];

  const head = values.shift().map(function (h) { return String(h).trim(); });
  const tz = ss.getSpreadsheetTimeZone();
  const idxKode = head.indexOf('Kode Barang');
  if (idxKode < 0) throw new Error('Kolom "Kode Barang" tidak ditemukan di baris 1.');

  return values
    .filter(function (r) { return r[idxKode] !== ''; })
    .map(function (r) {
      const o = {};
      head.forEach(function (h, i) {
        if (KEEP.indexOf(h) === -1) return;
        let v = r[i];
        if (v instanceof Date) v = Utilities.formatDate(v, tz, 'yyyy-MM-dd');
        o[h] = v;
      });
      return o;
    });
}

/** Jalankan manual dari editor untuk tes + memberi izin akses. */
function testGetData() {
  const rows = getData();
  Logger.log('Jumlah baris: ' + rows.length);
  Logger.log(JSON.stringify(rows[0]));
}
