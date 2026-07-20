// src/validators/queueValidator.js
const Joi = require('joi');

// src/validators/queueValidator.js

const generateQueueSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name cannot exceed 100 characters',
            'any.required': 'Name is required'
        }),
    
    phone: Joi.string()
        .pattern(/^[0-9]{11}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone must be 11 digits (e.g., 08012345678)',
            'any.required': 'Phone number is required'
        }),
    
    email: Joi.string()
        .email()
        .optional()
        .allow('', null)
        .messages({
            'string.email': 'Invalid email format'
        })
});

const updateCapacitySchema = Joi.object({
    capacity: Joi.number()
        .integer()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'number.base': 'Capacity must be a number',
            'number.min': 'Capacity must be at least 1',
            'number.max': 'Capacity cannot exceed 1000',
            'any.required': 'Capacity is required'
        })
});

module.exports = { generateQueueSchema, updateCapacitySchema };