const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { success, error, validationError } = require('../response');
const { db, dbHelpers } = require('../database');

// Middleware to parse JSON
router.use(express.json());

// Validation helper
const validateAuthData = (data) => {
    const errors = [];

    if (!data.nama || typeof data.nama !== 'string' || data.nama.trim() === '') {
        errors.push('Nama is required and must be a non-empty string');
    }

    if (!data.nim || typeof data.nim !== 'string' || data.nim.trim() === '') {
        errors.push('NIM is required and must be a non-empty string');
    }

    if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
        errors.push('Password is required and must be at least 6 characters long');
    }

    return errors;
};

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { nama, nim, password } = req.body;

        // Validate input
        const validationErrors = validateAuthData({ nama, nim, password });
        if (validationErrors.length > 0) {
            return validationError(res, validationErrors);
        }

        // Check if NIM already exists
        const nimExists = await dbHelpers.nimExists(nim);
        if (nimExists) {
            return error(res, 'NIM already exists', 409);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userData = { nama, nim, password: hashedPassword };
        const result = await dbHelpers.createUser(userData);

        success(res, result, 'User registered successfully', 201);
    } catch (err) {
        console.error('Registration error:', err);
        error(res, 'Internal server error', 500);
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { nim, password } = req.body;

        // Validate input
        if (!nim || !password) {
            return validationError(res, ['NIM and password are required']);
        }

        // Check if user exists
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE nim = ?', [nim], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!user) {
            return error(res, 'Invalid NIM or password', 401);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return error(res, 'Invalid NIM or password', 401);
        }

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;

        success(res, userWithoutPassword, 'Login successful');
    } catch (err) {
        console.error('Login error:', err);
        error(res, 'Internal server error', 500);
    }
});

module.exports = router;