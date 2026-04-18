const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

/**
 * Script ini menguji fungsionalitas dasar API:
 * 1. Register User Baru
 * 2. Login
 * 3. Ambil List User
 * 4. Update User
 * 5. Hapus User
 */

async function runTests() {
    console.log('--- Memulai Pengujian API ---\n');

    let testUserId = null;
    const testUser = {
        nama: "Test User " + Date.now(),
        nim: "NIM-" + Math.floor(Math.random() * 10000),
        password: "password123"
    };

    try {
        // 1. TEST REGISTER
        console.log('[1/5] Menguji Registrasi...');
        const regRes = await axios.post(`${BASE_URL}/auth/register`, testUser);
        testUserId = regRes.data.data.id;
        console.log('Registrasi Berhasil. ID User:', testUserId);

        // 2. TEST LOGIN
        console.log('\n[2/5] Menguji Login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            nim: testUser.nim,
            password: testUser.password
        });
        console.log('Login Berhasil. Selamat datang,', loginRes.data.data.nama);

        // 3. TEST GET USERS
        console.log('\n[3/5] Menguji Ambil Semua User...');
        const usersRes = await axios.get(`${BASE_URL}/users`);
        console.log(`Berhasil mengambil ${usersRes.data.data.length} user.`);

        // 4. TEST UPDATE USER
        console.log('\n[4/5] Menguji Update User...');
        const updateData = {
            nama: testUser.nama + " (Updated)",
            password: "newpassword123"
        };
        await axios.put(`${BASE_URL}/users/${testUserId}`, updateData);
        console.log('Update Berhasil.');

        // 5. TEST DELETE USER
        console.log('\n[5/5] Menguji Hapus User...');
        await axios.delete(`${BASE_URL}/users/${testUserId}`);
        console.log('Penghapusan Berhasil.');

        console.log('\n--- SEMUA PENGUJIAN BERHASIL ---');

    } catch (error) {
        console.error('\n PENGUJIAN GAGAL!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Pesan:', error.response.data.message || error.response.data.errors);
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Jalankan tes
runTests();