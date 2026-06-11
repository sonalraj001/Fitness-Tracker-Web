const BASE_URL = 'http://localhost:8080/api';

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (userId) {
    headers.set('X-User-ID', userId);
  }
  headers.set('Content-Type', 'application/json');

  console.log(`[API Request] ${options.method || 'GET'} ${BASE_URL}${endpoint}`);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log(`[API Response] ${response.status} ${endpoint}`);

    if (response.status === 401 || response.status === 403) {
      // Don't redirect if we are already on login or register or root
      const isPublicPath = typeof window !== 'undefined' && 
        (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/');
      
      if (!isPublicPath) {
        console.warn('Unauthorized access detected, redirecting to login...');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
};
