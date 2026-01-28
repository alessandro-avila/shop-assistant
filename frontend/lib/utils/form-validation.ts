/**
 * Form validation utilities
 * 
 * Validation rules matching backend AddressDto validation requirements.
 */

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email regex matching backend validation
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone regex matching backend validation (flexible format)
 * Accepts: +1234567890, (123) 456-7890, 123-456-7890, etc.
 */
export const PHONE_REGEX = /^[\d\s\-\(\)\+]+$/;

/**
 * Postal code regex matching backend validation (flexible format)
 * Accepts: 12345, 12345-6789, A1A 1A1, etc.
 */
export const POSTAL_CODE_REGEX = /^[\w\s\-]+$/;

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    maxLength: 100,
    pattern: EMAIL_REGEX,
  },
  phone: {
    required: true,
    minLength: 10,
    maxLength: 20,
    pattern: PHONE_REGEX,
  },
  streetAddress: {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  state: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  postalCode: {
    required: true,
    minLength: 3,
    maxLength: 20,
    pattern: POSTAL_CODE_REGEX,
  },
  country: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
} as const;

/**
 * Validate a required field
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true };
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  fieldName: string,
  minLength?: number,
  maxLength?: number
): ValidationResult {
  const trimmedValue = value.trim();

  if (minLength && trimmedValue.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  if (maxLength && trimmedValue.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate pattern match
 */
export function validatePattern(
  value: string,
  fieldName: string,
  pattern: RegExp,
  errorMessage?: string
): ValidationResult {
  if (!pattern.test(value)) {
    return {
      isValid: false,
      error: errorMessage || `${fieldName} format is invalid`,
    };
  }
  return { isValid: true };
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(email, 'Email');
  if (!requiredResult.isValid) return requiredResult;

  // Max length
  const lengthResult = validateLength(email, 'Email', undefined, 100);
  if (!lengthResult.isValid) return lengthResult;

  // Pattern
  return validatePattern(email, 'Email', EMAIL_REGEX, 'Please enter a valid email address');
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(phone, 'Phone');
  if (!requiredResult.isValid) return requiredResult;

  // Length
  const lengthResult = validateLength(phone, 'Phone', 10, 20);
  if (!lengthResult.isValid) return lengthResult;

  // Pattern
  return validatePattern(
    phone,
    'Phone',
    PHONE_REGEX,
    'Please enter a valid phone number (digits, spaces, dashes, parentheses allowed)'
  );
}

/**
 * Validate postal code
 */
export function validatePostalCode(postalCode: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(postalCode, 'Postal code');
  if (!requiredResult.isValid) return requiredResult;

  // Length
  const lengthResult = validateLength(postalCode, 'Postal code', 3, 20);
  if (!lengthResult.isValid) return lengthResult;

  // Pattern
  return validatePattern(
    postalCode,
    'Postal code',
    POSTAL_CODE_REGEX,
    'Please enter a valid postal code'
  );
}

/**
 * Validate full name
 */
export function validateFullName(fullName: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(fullName, 'Full name');
  if (!requiredResult.isValid) return requiredResult;

  // Length
  return validateLength(fullName, 'Full name', 2, 100);
}

/**
 * Validate street address
 */
export function validateStreetAddress(streetAddress: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(streetAddress, 'Street address');
  if (!requiredResult.isValid) return requiredResult;

  // Length
  return validateLength(streetAddress, 'Street address', 5, 200);
}

/**
 * Validate city
 */
export function validateCity(city: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(city, 'City');
  if (!requiredResult.isValid) return requiredResult;

  // Length
  return validateLength(city, 'City', 2, 100);
}

/**
 * Validate state
 */
export function validateState(state: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(state, 'State');
  if (!requiredResult.isValid) return requiredResult;

  // Length
  return validateLength(state, 'State', 2, 100);
}

/**
 * Validate country
 */
export function validateCountry(country: string): ValidationResult {
  // Required
  const requiredResult = validateRequired(country, 'Country');
  if (!requiredResult.isValid) return requiredResult;

  // Length
  return validateLength(country, 'Country', 2, 100);
}

/**
 * Validate all shipping address fields
 */
export interface ShippingAddressErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ShippingAddressData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Validate complete shipping address form
 */
export function validateShippingAddress(data: ShippingAddressData): {
  isValid: boolean;
  errors: ShippingAddressErrors;
} {
  const errors: ShippingAddressErrors = {};

  // Validate each field
  const fullNameResult = validateFullName(data.fullName);
  if (!fullNameResult.isValid) errors.fullName = fullNameResult.error;

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) errors.email = emailResult.error;

  const phoneResult = validatePhone(data.phone);
  if (!phoneResult.isValid) errors.phone = phoneResult.error;

  const streetAddressResult = validateStreetAddress(data.streetAddress);
  if (!streetAddressResult.isValid) errors.streetAddress = streetAddressResult.error;

  const cityResult = validateCity(data.city);
  if (!cityResult.isValid) errors.city = cityResult.error;

  const stateResult = validateState(data.state);
  if (!stateResult.isValid) errors.state = stateResult.error;

  const postalCodeResult = validatePostalCode(data.postalCode);
  if (!postalCodeResult.isValid) errors.postalCode = postalCodeResult.error;

  const countryResult = validateCountry(data.country);
  if (!countryResult.isValid) errors.country = countryResult.error;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
