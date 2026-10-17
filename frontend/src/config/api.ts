// API & Asset URL resolver for local development and production deployments (Vercel + Render)

const envApiUrl = import.meta.env.VITE_API_URL;

// In production on Vercel, use relative paths ('') so requests route seamlessly to same-origin /api/*
export const API_BASE_URL: string = (() => {
  if (import.meta.env.PROD) {
    if (!envApiUrl || envApiUrl.includes('localhost') || envApiUrl.includes('127.0.0.1')) {
      return '';
    }
  }
  return (envApiUrl || '').replace(/\/+$/, '');
})();

export const getApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) return clean;
  return `${API_BASE_URL}${clean}`;
};

export const getImageUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return clean;
  return `${API_BASE_URL}${clean}`;
};
