# Student Authentication REST API

REST API sederhana untuk autentikasi dan manajemen data mahasiswa menggunakan Express.js dan SQLite.

- Nama: Muhammad Martio Al Anshori  
- NIM: 23552011350  
- Kelas: TIF 23 PK  

---

## Overview

API ini menyediakan fitur:
- Registrasi
- Login
- CRUD data mahasiswa

Menggunakan arsitektur modular dengan Express.js dan SQLite.

---

## Features

- Registrasi dengan NIM unik
- Login menggunakan NIM & password
- CRUD data mahasiswa
- Password hashing (bcrypt)
- Validasi input
- Format response konsisten (JSON)
- Pencegahan duplikasi NIM

---

## Tech Stack

- Node.js
- Express.js
- SQLite3
- bcrypt
- Axios (testing)
- Nodemon (development)

---

## Project Structure

```

tugas_pemograman_web2/
├── app.js
├── database.js
├── response.js
├── test-api.js
├── package.json
│
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
│
├── rest-client/
│   ├── auth.http
│   └── users.http
│
├── databases/
│   └── users.sqlite
│
└── public/
└── index.html

````

---

## Installation

```bash
git clone https://github.com/username/tugas_pemograman_web2.git
cd tugas_pemograman_web2
npm install
````

Run server:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

Server: `http://localhost:3000`

---

## API

Base URL:

```
http://localhost:3000/api
```

### Auth

#### Register

`POST /auth/register`

```json
{
  "nama": "Budi",
  "nim": "123456",
  "password": "password123"
}
```

#### Login

`POST /auth/login`

```json
{
  "nim": "123456",
  "password": "password123"
}
```

---

### Users

#### Get All

`GET /users`

#### Get by ID

`GET /users/:id`

#### Create

`POST /users`

```json
{
  "nama": "Andi",
  "nim": "789012",
  "password": "password123"
}
```

#### Update

`PUT /users/:id`

```json
{
  "nama": "Updated",
  "nim": "789013",
  "password": "newpassword"
}
```

#### Delete

`DELETE /users/:id`

---

## Testing

### Automated

```bash
npm start
node test-api.js
```

### Manual

* REST Client (folder `rest-client`)
* Postman
* cURL

---

## Database

Table: `users`

| Field    | Type    | Notes            |
| -------- | ------- | ---------------- |
| id       | INTEGER | Primary key      |
| nama     | TEXT    | Not null         |
| nim      | TEXT    | Unique, not null |
| password | TEXT    | Hashed (bcrypt)  |

---

## Response Format

Success:

```json
{
  "status": "success",
  "message": "...",
  "data": {}
}
```

Error:

```json
{
  "status": "error",
  "message": "..."
}
```

Validation:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": []
}
```
