/**
 * Helper module for consistent API responses
 */

// Success response
const success = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        message: message,
        data: data
    });
};

// Error response
const error = (res, message = 'Error', statusCode = 400, details = null) => {
    const response = {
        status: 'error',
        message: message
    };

    if (details) {
        response.details = details;
    }

    res.status(statusCode).json(response);
};

// Validation error response
const validationError = (res, errors) => {
    res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors
    });
};

module.exports = {
    success,
    error,
    validationError
};