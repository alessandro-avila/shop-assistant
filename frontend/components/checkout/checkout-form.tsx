'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  type ShippingAddressData,
  type ShippingAddressErrors,
  validateShippingAddress,
  validateFullName,
  validateEmail,
  validatePhone,
  validateStreetAddress,
  validateCity,
  validateState,
  validatePostalCode,
  validateCountry,
} from '@/lib/utils/form-validation';

const STORAGE_KEY = 'checkout-form-data';

/**
 * Initial form data
 */
const INITIAL_FORM_DATA: ShippingAddressData = {
  fullName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'United States',
};

export interface CheckoutFormProps {
  onSubmit: (data: ShippingAddressData) => void;
  isSubmitting?: boolean;
  submitError?: string;
}

/**
 * Checkout form component with shipping address fields
 */
export function CheckoutForm({ onSubmit, isSubmitting = false, submitError }: CheckoutFormProps) {
  const [formData, setFormData] = useState<ShippingAddressData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ShippingAddressErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Load form data from sessionStorage on mount
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as ShippingAddressData;
        setFormData(parsed);
      }
    } catch (error) {
      console.error('Failed to load checkout form data from sessionStorage:', error);
    }
  }, []);

  // Save form data to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error('Failed to save checkout form data to sessionStorage:', error);
    }
  }, [formData]);

  /**
   * Handle input change
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate field if it's been touched
    if (touched[name]) {
      validateField(name as keyof ShippingAddressData, value);
    }
  };

  /**
   * Handle input blur (mark field as touched)
   */
  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof ShippingAddressData, value);
  };

  /**
   * Validate single field
   */
  const validateField = (fieldName: keyof ShippingAddressData, value: string) => {
    let result;

    switch (fieldName) {
      case 'fullName':
        result = validateFullName(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'phone':
        result = validatePhone(value);
        break;
      case 'streetAddress':
        result = validateStreetAddress(value);
        break;
      case 'city':
        result = validateCity(value);
        break;
      case 'state':
        result = validateState(value);
        break;
      case 'postalCode':
        result = validatePostalCode(value);
        break;
      case 'country':
        result = validateCountry(value);
        break;
      default:
        return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (result.isValid) {
        delete newErrors[fieldName];
      } else {
        newErrors[fieldName] = result.error;
      }
      return newErrors;
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate all fields
    const validation = validateShippingAddress(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(formData);
  };

  /**
   * Clear sessionStorage data (called after successful order)
   */
  const clearStoredData = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear checkout form data from sessionStorage:', error);
    }
  };

  // Expose clearStoredData for parent component
  useEffect(() => {
    (window as any).__clearCheckoutFormData = clearStoredData;
    return () => {
      delete (window as any).__clearCheckoutFormData;
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-1 text-sm text-red-600">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Street Address */}
          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="streetAddress"
              name="streetAddress"
              type="text"
              value={formData.streetAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.streetAddress}
              aria-describedby={errors.streetAddress ? 'streetAddress-error' : undefined}
              className={errors.streetAddress ? 'border-red-500' : ''}
            />
            {errors.streetAddress && (
              <p id="streetAddress-error" className="mt-1 text-sm text-red-600">
                {errors.streetAddress}
              </p>
            )}
          </div>

          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'city-error' : undefined}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p id="city-error" className="mt-1 text-sm text-red-600">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-2">
                State/Province <span className="text-red-500">*</span>
              </label>
              <Input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? 'state-error' : undefined}
                className={errors.state ? 'border-red-500' : ''}
              />
              {errors.state && (
                <p id="state-error" className="mt-1 text-sm text-red-600">
                  {errors.state}
                </p>
              )}
            </div>
          </div>

          {/* Postal Code and Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <Input
                id="postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={!!errors.postalCode}
                aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
                className={errors.postalCode ? 'border-red-500' : ''}
              />
              {errors.postalCode && (
                <p id="postalCode-error" className="mt-1 text-sm text-red-600">
                  {errors.postalCode}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <Input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? 'country-error' : undefined}
                className={errors.country ? 'border-red-500' : ''}
              />
              {errors.country && (
                <p id="country-error" className="mt-1 text-sm text-red-600">
                  {errors.country}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing Order...' : 'Place Order'}
      </Button>
    </form>
  );
}
