// src/utils/validators.ts
import Joi from 'joi';

// A simple validator for a login request body
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});