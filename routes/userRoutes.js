const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { success, error, validationError } = require('../response');
const { db, dbHelpers } = require('../database');

// Validation helper
const validateUserData = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.nama !== undefined) {
        if (!data.nama || typeof data.nama !== 'string' || data.nama.trim() === '') {
            errors.push('Nama is required and must be a non-empty string');
        }
    }

    if (!isUpdate || data.password !== undefined) {
        if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
            errors.push('Password is required and must be at least 6 characters long');
        }
    }

    return errors;
};

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await dbHelpers.getAllUsers();
        success(res, users, 'Users retrieved successfully');
    } catch (err) {
        console.error('Get all users error:', err);
        error(res, 'Internal server error', 500);
    }
});

// GET user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return error(res, 'Invalid user ID', 400);
        }

        const user = await dbHelpers.getUserById(userId);
        if (!user) {
            return error(res, 'User not found', 404);
        }

        success(res, user, 'User retrieved successfully');
    } catch (err) {
        console.error('Get user error:', err);
        error(res, 'Internal server error', 500);
    }
});

// POST create user
router.post('/', async (req, res) => {
    try {
        const { nama, nim, password } = req.body;

        // Validate input
        const validationErrors = validateUserData({ nama, password });
        if (validationErrors.length > 0) {
            return validationError(res, validationErrors);
        }

        if (!nim || typeof nim !== 'string' || nim.trim() === '') {
            return validationError(res, ['NIM is required and must be a non-empty string']);
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

        success(res, result, 'User created successfully', 201);
    } catch (err) {
        console.error('Create user error:', err);
        error(res, 'Internal server error', 500);
    }
});

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return error(res, 'Invalid user ID', 400);
        }

        // Ambil nama, password, DAN nim dari body
        const { nama, password, nim } = req.body;

        // Validate input
        const validationErrors = validateUserData({ nama, password }, true);
        if (validationErrors.length > 0) {
            return validationError(res, validationErrors);
        }

        const existingUser = await dbHelpers.getUserById(userId);
        if (!existingUser) {
            return error(res, 'User not found', 404);
        }

        // PERBAIKAN: Cek NIM unik jika user mencoba mengubah NIM
        if (nim && nim !== existingUser.nim) {
            const nimExists = await dbHelpers.nimExists(nim, userId);
            if (nimExists) {
                return error(res, 'NIM already exists', 409);
            }
        }

        const updateData = {};
        if (nama) updateData.nama = nama;
        if (nim) updateData.nim = nim; // Tambahkan NIM ke data update jika ada
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const result = await dbHelpers.updateUser(userId, updateData);
        if (!result) {
            return error(res, 'Failed to update user or no changes made', 500);
        }

        const updatedUser = await dbHelpers.getUserById(userId);
        success(res, updatedUser, 'User updated successfully');
    } catch (err) {
        console.error('Update user error:', err);
        error(res, 'Internal server error', 500);
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return error(res, 'Invalid user ID', 400);
        }

        const existingUser = await dbHelpers.getUserById(userId);
        if (!existingUser) {
            return error(res, 'User not found', 404);
        }

        const result = await dbHelpers.deleteUser(userId);
        if (!result) {
            return error(res, 'Failed to delete user', 500);
        }

        success(res, null, 'User deleted successfully');
    } catch (err) {
        console.error('Delete user error:', err);
        error(res, 'Internal server error', 500);
    }
});

module.exports = router;