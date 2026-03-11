/**
 * Checkout Form Validation Utility
 *
 * Client-side validation for the shipping information form.
 * Returns field-level errors compatible with the Input component's `error` prop.
 */

export type ValidationErrors = Record<string, string>;

/**
 * Validate shipping information fields.
 *
 * @param info - Shipping form values
 * @returns Record of field name → error message (empty if valid)
 */
export function validateShippingInfo(info: {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!info.firstName.trim()) errors.firstName = 'First name is required';
  if (!info.lastName.trim()) errors.lastName = 'Last name is required';

  if (!info.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!info.address.trim()) errors.address = 'Address is required';
  if (!info.city.trim()) errors.city = 'City is required';
  if (!info.state.trim()) errors.state = 'State is required';
  if (!info.zipCode.trim()) errors.zipCode = 'ZIP code is required';
  if (!info.country.trim()) errors.country = 'Country is required';

  return errors;
}

/**
 * Check whether a validation errors record contains any errors.
 *
 * @param errors - Validation errors record
 * @returns true if there is at least one error
 */
export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
