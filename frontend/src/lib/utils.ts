import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates a password to ensure it meets security requirements
 * @param password The password to validate
 * @returns An object with isValid indicating if the password meets all requirements,
 *          and message containing the validation error message if not valid
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  // Check for minimum length of 8 characters
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long"
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter"
    };
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number"
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character"
    };
  }

  // Password meets all requirements
  return {
    isValid: true,
    message: ""
  };
}