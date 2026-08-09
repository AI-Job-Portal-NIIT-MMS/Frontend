/**
 * Base API Client Configuration
 * Supports environment variable base URL resolution and fallback mock execution.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'; // Default to mock data if true or unconfigured

/**
 * Helper to simulate network latency for hardcoded/mock responses
 */
export const simulateNetworkDelay = (ms = 300) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Core request wrapper
 * @param {string} endpoint - API relative path (e.g. '/jobs')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @param {any} mockFallback - Hardcoded fallback data to return if mock mode is on or API fails
 */
export async function apiRequest(endpoint, options = {}, mockFallback = null) {
  // If mock mode is explicitly active, return hardcoded mock data with simulated delay
  if (USE_MOCK_DATA && mockFallback !== null) {
    await simulateNetworkDelay(250);
    return mockFallback;
  }

  try {
    const token = localStorage.getItem('auth_token');
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.warn(`[API Client] Network request to ${endpoint} failed. Using mock fallback if available.`, err.message);
    if (mockFallback !== null) {
      await simulateNetworkDelay(200);
      return mockFallback;
    }
    throw err;
  }
}

export { API_BASE_URL, USE_MOCK_DATA };
