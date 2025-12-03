import { useState, useCallback } from 'react';
import axios from 'axios';

// Crear instancia axios similar a useRequestsAPI
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default function useServicesAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getServiceTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/service-types');
      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener tipos de servicio';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getServiceTypes,
  };
}
