import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
});

// Inject token only for authenticated routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API (NO token ever)
export const publicApi = axios.create({
  baseURL: BASE_URL,
});
