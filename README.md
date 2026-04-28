# Sistem E-Commerce Kustomisasi Tas Kulit
<img width="1900" height="903" alt="image" src="https://github.com/user-attachments/assets/ba25f5f0-3d0c-4d08-9dfa-2960a9fb2708" />
Aplikasi e-commerce berbasis web yang dirancang khusus untuk memberikan pengalaman kustomisasi produk kulit secara interaktif. Sistem ini memungkinkan pengguna untuk merancang tas mereka sendiri dengan memilih berbagai bagian (parts), bentuk fisik (variants), bahan/warna (textures), hingga ukuran (sizes) dengan kalkulasi harga yang dinamis secara *real-time*.

## Tech Stack

Proyek ini menggunakan arsitektur pemisahan antara *Frontend* dan *Backend* (Headless CMS/API-driven):

**Frontend:**
* [Next.js](https://nextjs.org/) - Framework React untuk antarmuka pengguna yang cepat dan SEO-friendly.
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework untuk styling desain yang modern dan responsif.

**Backend:**
* [Laravel](https://laravel.com/) - Framework PHP tangguh untuk membangun RESTful API dan logika bisnis.
* [MySQL](https://www.mysql.com/) / PostgreSQL - Relational Database Management System (RDBMS) dengan struktur *Composite Key* tingkat lanjut.

---

## ⚙️ Fitur Utama

* **Advanced Customization Engine:** Hierarki data 4 tingkat (Products ➔ Parts ➔ Variants ➔ Textures) untuk kustomisasi produk yang detail.
* **Dynamic Pricing:** Perhitungan total harga otomatis berdasarkan kombinasi part, varian, tekstur, dan ukuran yang dipilih pengguna.
* **Dynamic Image Composition:** Perubahan visual *real-time* menggunakan konvensi penamaan file gambar berlapis.
* **CMS Ready:** Struktur *database* relasional yang terenkapsulasi rapi, siap diintegrasikan dengan panel admin untuk manajemen produk, galeri, dimensi, dan blok marketing.

---

## 🛠️ Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem kamu sudah terinstal:
* [Node.js](https://nodejs.org/) (versi 18.x atau terbaru) & npm/yarn
* [PHP](https://www.php.net/) (versi 8.1 atau terbaru)
* [Composer](https://getcomposer.org/)
* Database Server (MySQL/MariaDB)

---

## 💻 Cara Instalasi & Setup

Proyek ini terbagi menjadi dua *directory* utama: `frontend` dan `backend`. Buka dua terminal (command line) terpisah untuk menjalankan keduanya secara bersamaan.

### 1. Setup Backend (Laravel API)

Buka terminal dan arahkan ke direktori backend:

```bash
# 1. Masuk ke direktori backend
cd backend

# 2. Install semua dependensi PHP
composer install

# 3. Salin file environment
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Jalankan migrasi database (beserta composite keys)
php artisan migrate:fresh

# 6. (Opsional) Jalankan seeder untuk mengisi data awal produk
php artisan db:seed

# 7. Jalankan server lokal backend
php artisan serve
```

### 2. Setup Fronted (Next Js)

Buka terminal dan arahkan ke direktori frontend:

```bash
# 1. Masuk ke direktori frontend
cd frontend

# 2. Install semua dependensi Node.js
npm install

# (Opsional) Buat file .env.local dan masukkan URL API Backend
# NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)

# 3. Jalankan server lokal frontend
npm run dev
```

### 3. Akses 

Frontend : 
```bash
http://127.0.0.1:3000/
```
Backend : 
```bash
http://127.0.0.1:8000/
```

## API Testing & Kolaborasi Tim (Hoppscotch)

Untuk dokumentasi dan pengujian API (*API Testing*) secara kolaboratif, proyek ini menggunakan **Hoppscotch**. 

**Cara Setup & Bergabung ke Tim:**

1. Install atau buka aplikasi Hoppscotch melalui situs resminya: [hoppscotch.io](https://hoppscotch.io/) (Kamu bisa menggunakan versi Web, PWA, atau Desktop App).
2. Buat akun atau *login* menggunakan akun Google kamu.
3. **Kirimkan alamat Gmail kamu ke saya** agar saya bisa mengundang (*invite*) kamu ke dalam *Workspace Team* proyek ini. Setelah bergabung, kamu bisa mengakses semua *collection API* yang sudah dibuat.
