const express = require('express');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files (for potential landing page)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Student Authentication API',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            users: {
                list: 'GET /api/users',
                get: 'GET /api/users/:id',
                create: 'POST /api/users',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            }
        },
        documentation: 'See rest-client/ folder for testing examples'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Tugas Pemograman Web 2`);
    console.log(`Muhammad Martio Al Anshori (23552011350)`);
    console.log(`--------------------------------------------`);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('  POST /api/auth/register');
    console.log('  POST /api/auth/login');
    console.log('  GET /api/users');
    console.log('  GET /api/users/:id');
    console.log('  POST /api/users');
    console.log('  PUT /api/users/:id');
    console.log('  DELETE /api/users/:id');
    console.log(`--------------------------------------------`);

});

module.exports = app;