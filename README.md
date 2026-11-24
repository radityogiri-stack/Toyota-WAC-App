# Toyota Beyond - WAC & Rekomendasi Servis GR Engine

Aplikasi desktop khusus untuk modul **Walk Around Check (WAC) & Rekomendasi Servis General Repair (GR)** yang terhubung langsung (**real-time bidirectional sync**) dengan portal resmi **Toyota Beyond** (`https://beyond.toyota.astra.co.id`).

---

## 🚀 Fitur Utama

1. **Akses Langsung Tanpa Ribet**:
   - Tidak perlu lagi membuka menu berjenjang (*After Sales -> Servis GR -> WAC & Rekomendasi Servis GR*).
   - Langsung menampilkan daftar kendaraan WAC Servis GR dengan pencarian nomor polisi/nama dan filter status (*Semua, OPEN, Selesai*).
   - Dilengkapi navigasi halaman (*Pagination*).

2. **Sinkronisasi 2 Arah (Actual & Real-time)**:
   - Terhubung langsung ke APIM resmi Toyota Astra Motor melalui sesi SSO TAM Passport.
   - Perubahan data (Simpan Draft / Finalisasi Selesai) langsung ter-update di portal Beyond Toyota dan mToyota pelanggan.

3. **1-Klik Isi Rekomendasi (⚡ Auto-Fill Engine)**:
   - Otomatis mengisi seluruh checklist fisik & interior komponen menjadi **BAIK** (dan Ban Cadangan = ADA).
   - Menyetel kondisi 4 titik ban menjadi **HIJAU (Aman)** tahun produksi terbaru.
   - Menghitung KM, indikator bahan bakar (60%), dan rekomendasi paket oli (TMO), aki (TGB), dan Car Care.

4. **Digital Signature Canvas**:
   - Pad tanda tangan digital interaktif untuk Pelanggan dan Service Advisor (SA), serta dukungan mode SA Offline.

5. **Tampilan Lengkap**:
   - Checklist Fisik & Interior Mesin
   - Solusi Ban (4 Roda)
   - Paket Rekomendasi Servis (TMO, TGB, Car Care, CR7 / Carry-over)
   - TCO & Status Asuransi / Telematics T-Intouch

---

## 💻 Cara Menjalankan

### Cara Cepat (1-Klik):
Cukup klik ganda (double-click) file:
👉 **`Buka_Aplikasi_WAC.bat`**

Aplikasi akan otomatis mengaktifkan engine backend dan membuka antarmuka di peramban (Chrome/Edge) pada alamat `http://localhost:5050`.

### Cara Manual via Terminal:
```bash
# Jalankan server
& ".venv\Scripts\python.exe" "toyota_wac_app\server.py"
```
Lalu buka browser ke: `http://localhost:5050`

---

## 🔒 Akun & Kredensial
- **User ID**: `TUT.UserBM`
- **Role**: Branch Manager (Tunas Toyota)
- **Koneksi APIM**: Staging / Production APIM TAM Gateway

