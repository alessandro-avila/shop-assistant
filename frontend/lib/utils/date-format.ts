/**
 * Date formatting utilities for order confirmation and display
 */

/**
 * Format ISO date string to readable order date format
 * 
 * @param isoDate - ISO 8601 date string (e.g., "2026-01-28T10:30:00Z")
 * @returns Formatted date string (e.g., "January 28, 2026 at 10:30 AM")
 * 
 * @example
 * formatOrderDate("2026-01-28T10:30:00Z")
 * // Returns: "January 28, 2026 at 10:30 AM"
 */
export function formatOrderDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('Failed to format date:', error);
    return 'Invalid date';
  }
}

/**
 * Format ISO date string to short date format
 * 
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date string (e.g., "Jan 28, 2026")
 * 
 * @example
 * formatShortDate("2026-01-28T10:30:00Z")
 * // Returns: "Jan 28, 2026"
 */
export function formatShortDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Failed to format date:', error);
    return 'Invalid date';
  }
}

/**
 * Format ISO date string to estimated delivery date (adds 5-7 business days)
 * 
 * @param orderDate - ISO 8601 date string of order creation
 * @returns Formatted delivery estimate (e.g., "February 2-4, 2026")
 */
export function formatEstimatedDelivery(orderDate: string): string {
  try {
    const date = new Date(orderDate);
    
    if (isNaN(date.getTime())) {
      return 'TBD';
    }
    
    // Add 5 days for minimum delivery
    const minDate = new Date(date);
    minDate.setDate(minDate.getDate() + 5);
    
    // Add 7 days for maximum delivery
    const maxDate = new Date(date);
    maxDate.setDate(maxDate.getDate() + 7);
    
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(minDate);
    const year = minDate.getFullYear();
    
    // Same month
    if (minDate.getMonth() === maxDate.getMonth()) {
      return `${month} ${minDate.getDate()}-${maxDate.getDate()}, ${year}`;
    }
    
    // Different months
    const maxMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(maxDate);
    return `${month} ${minDate.getDate()} - ${maxMonth} ${maxDate.getDate()}, ${year}`;
  } catch (error) {
    console.error('Failed to calculate delivery estimate:', error);
    return 'TBD';
  }
}
