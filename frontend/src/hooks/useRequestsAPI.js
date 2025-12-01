import { useState, useCallback } from 'react';
import axios from 'axios';

// Configuraci├│n base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
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

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inv├ílido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Hook para consumir la API de solicitudes
 * Proporciona funciones para CRUD de solicitudes y documentos
 */
export function useRequestsAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Crear una nueva solicitud
   * @param {Object} data - { tipo_servicio, form_data }
   */
  const createRequest = useCallback(async (data) => {
    // El backend expone POST /create-requests que espera { nombre_servicio, formulario }
    setLoading(true);
    setError(null);
    try {
      // Normalizar el payload si el caller envia otro formato
      const payload = {
        nombre_servicio: data.nombre_servicio || data.tipo_servicio || data.serviceName,
        formulario: data.formulario || data.form_data || data.formData || data,
      };
      const response = await api.post('/requests/create-requests', payload);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear la solicitud';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener todas las solicitudes del usuario
   */
  const getUserRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // El backend expone GET /get-requests
      const response = await api.get('/requests/get-requests');
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener las solicitudes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener detalle de una solicitud espec├¡fica
   * @param {string} id - ID de la solicitud
   */
  const getRequestDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      // El backend expone GET /:id/details
      const response = await api.get(`/requests/${id}/details`);
      // El controller devuelve { ok: true, request }
      return response.data.request || response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener el detalle de la solicitud';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener documentos de una solicitud
   * @param {string} id - ID de la solicitud
   */
  const getRequestDocuments = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/requests/${id}/documents`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener los documentos';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Subir un documento a una solicitud
   * @param {string} requestId - ID de la solicitud
   * @param {File} file - Archivo a subir
   * @param {Object} metadata - Metadatos del documento (tipo, nombre, etc.)
   */
  const uploadDocument = useCallback(async (requestId, file, metadata = {}) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      // El backend espera el campo del archivo con nombre 'archivo'
      formData.append('archivo', file);
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });
      // Asegurar que el tipo de documento se envie como 'tipo_documento'
      if (metadata.tipo_documento) {
        formData.set('tipo_documento', metadata.tipo_documento);
      } else if (metadata.tipo) {
        formData.set('tipo_documento', metadata.tipo);
      }

      const response = await api.post(`/requests/${requestId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al subir el documento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar un documento
   * @param {string} requestId - ID de la solicitud
   * @param {string} documentId - ID del documento
   */
  const deleteDocument = useCallback(async (requestId, documentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/requests/${requestId}/documents/${documentId}`);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el documento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar/Reemplazar un documento
   * @param {string} requestId - ID de la solicitud
   * @param {string} documentId - ID del documento
   * @param {File} file - Nuevo archivo
   */
  const updateDocument = useCallback(async (requestId, documentId, file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.put(`/requests/${requestId}/documents/${documentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el documento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Estados
    loading,
    error,
    
    // Solicitudes
    getUserRequests,
    getRequestDetail,
    
    // Las siguientes funciones est├ín disponibles pero se usar├ín en features espec├¡ficos:
    // createRequest - Para formularios de creaci├│n de solicitudes
    // getRequestDocuments - Para ver documentos de una solicitud
    // uploadDocument - Para subir documentos
    // deleteDocument - Para eliminar documentos
    // updateDocument - Para actualizar documentos
    createRequest,
    getRequestDocuments,
    uploadDocument,
    deleteDocument,
    updateDocument,
  };
}

export default useRequestsAPI;
