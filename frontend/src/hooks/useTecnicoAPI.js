import axios from 'axios';
import { useState, useCallback } from 'react';

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

export default function useTecnicoAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listar solicitudes para técnico
  const getRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/tecnico-upc/requests');
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener solicitudes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener detalle de solicitud
  const getRequestDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/tecnico-upc/requests/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener detalle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar validación técnica
  const sendValidacionTecnica = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/api/tecnico-upc/request/${id}/validacion-tecnica`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar validación');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getRequests,
    getRequestDetail,
    sendValidacionTecnica,
  };
}
