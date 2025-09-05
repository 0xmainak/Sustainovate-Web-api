// src/utils/validators.test.ts
import { loginSchema } from './validators';

describe('Login Validator', () => {
  it('should pass validation for correct email and password', () => {
    const validData = { email: 'test@example.com', password: 'password123' };
    const { error } = loginSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail validation for an invalid email', () => {
    const invalidData = { email: 'not-an-email', password: 'password123' };
    const { error } = loginSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"email" must be a valid email');
  });

  it('should fail validation for a password that is too short', () => {
    const invalidData = { email: 'test@example.com', password: '123' };
    const { error } = loginSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error?.details[0].message).toBe('"password" length must be at least 6 characters long');
  });
});