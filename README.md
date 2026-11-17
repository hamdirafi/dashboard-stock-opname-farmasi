# Dasbor Stock Opname – Gudang Pabrik Farmasi

Dashboard interaktif untuk memantau hasil stock opname barang di gudang pabrik farmasi:
bahan aktif (API), eksipien, kemasan primer/sekunder, dan obat jadi, termasuk batch yang
mendekati atau sudah melewati tanggal expired.

> Seluruh data adalah **data dummy (fiktif)** untuk keperluan portofolio.

![Preview dashboard](docs/preview.png)

## Demo
- **Versi web statis (GitHub Pages):** https://hamdirafi.github.io/dashboard-stock-opname-farmasi/
- **Versi Google Apps Script (terhubung ke Google Sheets):** [APPS_SCRIPT_URL](https://script.google.com/macros/s/AKfycbw0meTlh7-zh_Gg546nZkp28my0Pvr6Drf7-FdPbCx3-C0EpGtKzguutTZGhUfPfxQ/exec)

## Fitur
- Filter: tanggal opname, tanggal masuk, tanggal expired, jenis barang, status expired, gudang, status mutu, selisih stok, dan pencarian nama/kode/batch
- Ringkasan: jumlah batch, nilai stok fisik, akurasi stok, selisih bersih, dan batch expired
- Jalur status expired (Expired, Kritis ≤ 90 hari, Waspada 91–180 hari, Aman > 180 hari) yang bisa diklik untuk memfilter
- Grafik: nilai stok per jenis barang dan gudang, selisih per bulan opname, barang masuk per bulan, 10 selisih terbesar
- Daftar prioritas batch expired dan kritis (prinsip FEFO)
- Tabel rincian yang bisa diurutkan, dibagi per halaman, dan diekspor ke CSV
- Bisa memuat file Excel sendiri lewat tombol "Muat file Excel"

## Struktur repositori
```
├── index.html                  # Dashboard statis (data dummy tertanam)
├── data/
│   └── Data_Stock_Opname_Gudang_Farmasi.xlsx   # Database dummy (280 batch, 4 sheet)
├── apps-script/
│   ├── Code.gs                 # Backend: membaca Google Sheets
│   └── Index.html              # Tampilan untuk web app Apps Script
└── docs/preview.png
```

## Data
`data/Data_Stock_Opname_Gudang_Farmasi.xlsx` berisi sheet `Stock_Opname` (data utama dengan rumus selisih,
nilai selisih, sisa hari, dan status expired), `Master_Barang`, `Ringkasan`, dan `Petunjuk`.

Aturan status expired: sisa hari = tanggal expired − tanggal opname.
Expired (< 0), Kritis (0–90), Waspada (91–180), Aman (> 180).

## Cara menjalankan
**Versi statis:** buka `index.html` di browser (perlu internet untuk memuat Chart.js dan font).

**Versi Apps Script:**
1. Unggah file Excel ke Google Drive dan simpan sebagai Google Sheets
2. Buat proyek di script.google.com, tempel `Code.gs` dan buat file HTML bernama `Index` dari `apps-script/Index.html`
3. Jalankan `testGetData` sekali untuk memberi izin akses
4. Deploy → New deployment → Web app (Execute as: Me)

## Teknologi
HTML, CSS, JavaScript, Chart.js, SheetJS, Google Apps Script, Google Sheets.
