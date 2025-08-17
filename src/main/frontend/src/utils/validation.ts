/**
 * Form validation utilities for common validation scenarios
 */

/**
 * Validates that a value is not empty
 * @param value The value to validate
 * @returns Error message if invalid, empty string if valid
 */
export const required = (value: any): string => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }
  return '';
};

/**
 * Validates that a string is a valid email address
 * @param value The email to validate
 * @returns Error message if invalid, empty string if valid
 */
export const email = (value: string): string => {
  if (!value) return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return '';
};

/**
 * Validates that a string meets minimum length requirements
 * @param length The minimum length
 * @returns A validation function
 */
export const minLength = (length: number) => (value: string): string => {
  if (!value) return '';
  
  if (value.length < length) {
    return `Must be at least ${length} characters`;
  }
  return '';
};

/**
 * Validates that a string doesn't exceed maximum length
 * @param length The maximum length
 * @returns A validation function
 */
export const maxLength = (length: number) => (value: string): string => {
  if (!value) return '';
  
  if (value.length > length) {
    return `Cannot exceed ${length} characters`;
  }
  return '';
};

/**
 * Validates that a number is within a specified range
 * @param min The minimum value
 * @param max The maximum value
 * @returns A validation function
 */
export const numberRange = (min: number, max: number) => (value: number): string => {
  if (value === undefined || value === null) return '';
  
  if (value < min || value > max) {
    return `Value must be between ${min} and ${max}`;
  }
  return '';
};

/**
 * Validates that a string matches a pattern
 * @param pattern The regex pattern
 * @param message The error message
 * @returns A validation function
 */
export const pattern = (pattern: RegExp, message: string) => (value: string): string => {
  if (!value) return '';
  
  if (!pattern.test(value)) {
    return message;
  }
  return '';
};

/**
 * Combines multiple validators and returns the first error
 * @param validators Array of validator functions
 * @returns A validation function that runs all validators
 */
export const compose = (validators: Array<(value: any) => string>) => (value: any): string => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return '';
};