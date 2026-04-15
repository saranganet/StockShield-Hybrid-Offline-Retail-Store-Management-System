import axios from 'axios';
import { syncEngine } from './SyncEngine';
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

// Offline Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!navigator.onLine && error.config && ['post', 'put', 'delete'].includes(error.config.method?.toLowerCase() || '')) {
      console.log('Offline detected. Queuing mutation in IndexedDB...');
      let dataToQueue = {};
      try {
        dataToQueue = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
      } catch (e) {}
      
      await syncEngine.addTask(error.config.url!, error.config.method!, dataToQueue);
      return Promise.resolve({ data: { offlineQueued: true, message: 'Saved offline. Will sync when reconnected.' } });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const salesApi = {
  getStats: () => api.get('/sales/stats'),
  getAll: () => api.get('/sales'),
  create: (data: any) => api.post('/sales', data)
};

export const auditApi = {
  getAll: () => api.get('/audit')
};

export const userApi = {
  getAll: () => api.get('/users'),
  updateRole: (id: string, role: string) => api.put(`/users/${id}/role`, { role })
};

export const supplierApi = {
  getAll: () => api.get('/suppliers'),
  getById: (id: string) => api.get(`/suppliers/${id}`),
  create: (data: any) => api.post('/suppliers', data),
  update: (id: string, data: any) => api.put(`/suppliers/${id}`, data),
  delete: (id: string) => api.delete(`/suppliers/${id}`)
};

export const poApi = {
  getAll: () => api.get('/purchase-orders'),
  getById: (id: string) => api.get(`/purchase-orders/${id}`),
  create: (data: any) => api.post('/purchase-orders', data),
  receive: (id: string) => api.post(`/purchase-orders/${id}/receive`)
};

export default api;
