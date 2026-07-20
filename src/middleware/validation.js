// src/middleware/validation.js
const { error } = require('../utils/logger');

const validate = (schema) => {
    return (req, res, next) => {
        const { error: validationError } = schema.validate(req.body);
        
        if (validationError) {
            error(`Validation error: ${validationError.details[0].message}`);
            return res.status(400).json({
                success: false,
                message: validationError.details[0].message
            });
        }
        next();
    };
};

module.exports = { validate };