# 🎓 Student Authentication REST API

> **Tugas Pemrograman Web 2** — REST API untuk autentikasi dan manajemen data mahasiswa menggunakan Express.js dan SQLite.

Nama : Muhammad Martio Al Anshori
NIM : 23552011350
Kelas : TIF 23 PK

---

## 📋 Deskripsi

Proyek ini merupakan REST API sederhana yang menyediakan fitur **registrasi**, **login**, dan **CRUD** (Create, Read, Update, Delete) data mahasiswa. API ini dibangun menggunakan arsitektur modular dengan Express.js sebagai framework backend dan SQLite sebagai database.

### Fitur Utama

- ✅ **Registrasi** mahasiswa baru dengan NIM unik
- ✅ **Login** menggunakan NIM dan password
- ✅ **CRUD User** — Tambah, lihat, update, dan hapus data mahasiswa
- ✅ **Password Hashing** menggunakan bcrypt
- ✅ **Validasi Input** pada setiap endpoint
- ✅ **Penanganan Error** yang konsisten dengan format JSON
- ✅ **NIM Unik** — Duplikasi NIM dicegah pada registrasi dan update

---

## 🛠️ Tech Stack

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **Node.js** | v24+ | JavaScript runtime |
| **Express.js** | ^4.18.2 | Web framework |
| **SQLite3** | ^5.1.6 | Database ringan berbasis file |
| **bcrypt** | ^5.1.0 | Hashing password |
| **Axios** | ^1.15.0 | HTTP client (untuk testing) |
| **Nodemon** | ^3.0.1 | Auto-restart development server |

---

## 📁 Struktur Proyek

```
tugas_pemograman_web2/
├── app.js                  # Entry point aplikasi & konfigurasi Express
├── database.js             # Koneksi SQLite & helper functions
├── response.js             # Helper untuk format response API
├── test-api.js             # Script pengujian otomatis
├── package.json            # Dependensi & konfigurasi npm
│
├── routes/
│   ├── authRoutes.js       # Endpoint autentikasi (register, login)
│   └── userRoutes.js       # Endpoint CRUD user
│
├── rest-client/
│   ├── auth.http           # Contoh request autentikasi (VS Code REST Client)
│   └── users.http          # Contoh request CRUD user (VS Code REST Client)
│
├── databases/
│   └── users.sqlite        # File database SQLite (auto-generated)
│
└── public/
    └── index.html          # Landing page statis
```

---

## 🚀 Instalasi & Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) v18 atau lebih baru

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/username/tugas_pemograman_web2.git
cd tugas_pemograman_web2

# 2. Install dependensi
npm install

# 3. Jalankan server
npm start

# Atau gunakan mode development (auto-restart)
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/api
```

---

### 🔐 Authentication

#### `POST /api/auth/register`

Registrasi mahasiswa baru.

**Request Body:**

```json
{
    "nama": "Budi Santoso",
    "nim": "123456",
    "password": "password123"
}
```

**Response Sukses** `201`:

```json
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "id": 1,
        "nama": "Budi Santoso",
        "nim": "123456"
    }
}
```

**Response Error** `409` (NIM sudah terdaftar):

```json
{
    "status": "error",
    "message": "NIM already exists"
}
```

---

#### `POST /api/auth/login`

Login menggunakan NIM dan password.

**Request Body:**

```json
{
    "nim": "123456",
    "password": "password123"
}
```

**Response Sukses** `200`:

```json
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "id": 1,
        "nama": "Budi Santoso",
        "nim": "123456"
    }
}
```

**Response Error** `401`:

```json
{
    "status": "error",
    "message": "Invalid NIM or password"
}
```

---

### 👥 Users (CRUD)

#### `GET /api/users`

Mengambil semua data mahasiswa.

**Response Sukses** `200`:

```json
{
    "status": "success",
    "message": "Users retrieved successfully",
    "data": [
        {
            "id": 1,
            "nama": "Budi Santoso",
            "nim": "123456"
        }
    ]
}
```

---

#### `GET /api/users/:id`

Mengambil data mahasiswa berdasarkan ID.

**Response Sukses** `200`:

```json
{
    "status": "success",
    "message": "User retrieved successfully",
    "data": {
        "id": 1,
        "nama": "Budi Santoso",
        "nim": "123456"
    }
}
```

**Response Error** `404`:

```json
{
    "status": "error",
    "message": "User not found"
}
```

---

#### `POST /api/users`

Menambahkan mahasiswa baru.

**Request Body:**

```json
{
    "nama": "Andi Wijaya",
    "nim": "789012",
    "password": "password123"
}
```

**Response Sukses** `201`:

```json
{
    "status": "success",
    "message": "User created successfully",
    "data": {
        "id": 2,
        "nama": "Andi Wijaya",
        "nim": "789012"
    }
}
```

---

#### `PUT /api/users/:id`

Mengupdate data mahasiswa (mendukung partial update).

**Request Body** (semua field opsional):

```json
{
    "nama": "Andi Wijaya Updated",
    "nim": "789013",
    "password": "newpassword123"
}
```

**Response Sukses** `200`:

```json
{
    "status": "success",
    "message": "User updated successfully",
    "data": {
        "id": 2,
        "nama": "Andi Wijaya Updated",
        "nim": "789013"
    }
}
```

---

#### `DELETE /api/users/:id`

Menghapus data mahasiswa berdasarkan ID.

**Response Sukses** `200`:

```json
{
    "status": "success",
    "message": "User deleted successfully",
    "data": null
}
```

---

## 🧪 Pengujian

### Pengujian Otomatis

Jalankan script test bawaan yang menguji seluruh alur API secara otomatis:

```bash
# Pastikan server sedang berjalan terlebih dahulu
npm start

# Di terminal lain, jalankan test
node test-api.js
```

**Output yang diharapkan:**

```
--- Memulai Pengujian API ---

[1/5] Menguji Registrasi...
Registrasi Berhasil. ID User: 1

[2/5] Menguji Login...
Login Berhasil. Selamat datang, Test User

[3/5] Menguji Ambil Semua User...
Berhasil mengambil 1 user.

[4/5] Menguji Update User...
Update Berhasil.

[5/5] Menguji Hapus User...
Penghapusan Berhasil.

--- SEMUA PENGUJIAN BERHASIL ---
```

### Pengujian Manual

Gunakan salah satu cara berikut:

- **VS Code REST Client** — Buka file di folder `rest-client/` dan klik "Send Request"
- **Postman** — Import endpoint dari dokumentasi di atas
- **cURL** — Contoh:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Budi","nim":"123456","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nim":"123456","password":"password123"}'

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"nama":"Budi Updated"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 📊 Skema Database

### Tabel `users`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | INTEGER | Primary key, auto increment |
| `nama` | TEXT | Nama lengkap mahasiswa (NOT NULL) |
| `nim` | TEXT | Nomor Induk Mahasiswa (UNIQUE, NOT NULL) |
| `password` | TEXT | Password yang di-hash bcrypt (NOT NULL) |

---

## 📝 Format Response

Semua response API menggunakan format JSON yang konsisten:

**Sukses:**
```json
{
    "status": "success",
    "message": "...",
    "data": { }
}
```

**Error:**
```json
{
    "status": "error",
    "message": "..."
}
```

**Validation Error:**
```json
{
    "status": "error",
    "message": "Validation failed",
    "errors": ["..."]
}
```

---

## 👤 Author

**Muhammad Martio Al Anshori**
- NIM: `23552011350`
- Tugas: Pemrograman Web 2
