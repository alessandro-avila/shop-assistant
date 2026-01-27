/**
 * Application Configuration
 * 
 * Centralized configuration for environment-specific settings.
 */

/**
 * Backend API Base URL
 * 
 * Default: http://localhost:5250/api (matches backend default port)
 * Override with NEXT_PUBLIC_API_URL environment variable
 */
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5250/api';

/**
 * Enable API integration
 * 
 * Set to 'false' to use mocked data (useful for development without backend)
 * Default: true
 */
export const USE_API = 
  process.env.NEXT_PUBLIC_USE_API !== 'false';

/**
 * API request timeout (milliseconds)
 */
export const API_TIMEOUT = 30000; // 30 seconds

/**
 * Mock API delay (milliseconds)
 * Only used when USE_API is false
 */
export const MOCK_API_DELAY = 300;
