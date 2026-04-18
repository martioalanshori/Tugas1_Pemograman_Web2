const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, 'databases');
if (!require('fs').existsSync(dbDir)) {
    require('fs').mkdirSync(dbDir);
}

// Connect to SQLite database
const db = new sqlite3.Database(path.join(dbDir, 'users.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            nim TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `;

    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table created/verified');
        }
    });
}

// Helper functions for database operations
const dbHelpers = {
    // Get all users
    getAllUsers: () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, nama, nim FROM users ORDER BY id', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    // Get user by ID
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, nama, nim FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },

    // Create user
    createUser: (userData) => {
        return new Promise((resolve, reject) => {
            const { nama, nim, password } = userData;
            db.run(
                'INSERT INTO users (nama, nim, password) VALUES (?, ?, ?)',
                [nama, nim, password],
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, nama, nim });
                    }
                }
            );
        });
    },

    // Update user
    updateUser: (id, userData) => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(userData);
            if (fields.length === 0) {
                return resolve(false);
            }

            const setClause = fields.map(f => `${f} = ?`).join(', ');
            const values = fields.map(f => userData[f]);
            values.push(id);

            db.run(
                `UPDATE users SET ${setClause} WHERE id = ?`,
                values,
                function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes > 0);
                    }
                }
            );
        });
    },

    // Delete user
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    },

    // Check if NIM exists (except for specific ID)
    nimExists: (nim, excludeId = null) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT COUNT(*) as count FROM users WHERE nim = ?';
            let params = [nim];

            if (excludeId) {
                query += ' AND id != ?';
                params.push(excludeId);
            }

            db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }
};

module.exports = { db, dbHelpers };