import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data: { name: string }) => api.post('/categories', data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const productApi = {
  getAll: () => api.get('/products'),
  create: (data: any) => api.post('/products', data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export default api;
