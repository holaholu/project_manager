export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[;]/g, '') // Remove semicolons
    .replace(/[\\\/]/g, '') // Remove slashes
    .trim(); // Remove leading/trailing whitespace
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) && // Must have uppercase
    /[a-z]/.test(password) && // Must have lowercase
    /[0-9]/.test(password) && // Must have number
    /[^A-Za-z0-9]/.test(password) // Must have special char
  );
};

export const validateLength = (input: string, min: number, max: number): boolean => {
  const length = input.trim().length;
  return length >= min && length <= max;
};

export interface ValidationError {
  field: string;
  message: string;
}

export const validateProjectInput = (
  name: string,
  description: string
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!validateLength(name, 3, 50)) {
    errors.push({
      field: 'name',
      message: 'Project name must be between 3 and 50 characters'
    });
  }
  
  if (!validateLength(description, 10, 500)) {
    errors.push({
      field: 'description',
      message: 'Description must be between 10 and 500 characters'
    });
  }
  
  return errors;
};

export const validateTaskInput = (
  title: string,
  description: string
): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!validateLength(title, 3, 100)) {
    errors.push({
      field: 'title',
      message: 'Task title must be between 3 and 100 characters'
    });
  }
  
  if (!validateLength(description, 10, 1000)) {
    errors.push({
      field: 'description',
      message: 'Description must be between 10 and 1000 characters'
    });
  }
  
  return errors;
};
