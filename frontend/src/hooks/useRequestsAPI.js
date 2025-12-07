import { useState, useCallback } from 'react';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper para obtener el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre_servicio: data.nombre_servicio || data.tipo_servicio || data.serviceName,
        formulario: data.formulario || data.form_data || data.formData || data,
      };
      const response = await axios.post(`${baseURL}/api/requests/create-requests`, payload, {
        withCredentials: true,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear la solicitud';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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
      const response = await axios.get(`${baseURL}/api/requests/get-requests`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener las solicitudes';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener detalle de una solicitud específica
   * @param {string} id - ID de la solicitud
   */
  const getRequestDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}/api/requests/${id}/details`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return response.data.request || response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener el detalle de la solicitud';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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
      const response = await axios.get(`${baseURL}/api/requests/${id}/documents`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener los documentos';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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
      formData.append('archivo', file);

      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });

      if (metadata.tipo_documento) {
        formData.set('tipo_documento', metadata.tipo_documento);
      } else if (metadata.tipo) {
        formData.set('tipo_documento', metadata.tipo);
      }

      const response = await axios.post(
        `${baseURL}/api/requests/${requestId}/documents`,
        formData,
        {
          withCredentials: true,
          headers: {
            ...getAuthHeaders(),  // ✔ sin content-type
          },
        }
      );

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al subir el documento';
      setError(errorMessage);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

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
      const response = await axios.delete(`${baseURL}/api/requests/${requestId}/documents/${documentId}`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el documento';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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

      const response = await axios.put(`${baseURL}/api/requests/${requestId}/documents/${documentId}`, formData, {
        withCredentials: true,
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el documento';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
  /**
   * Obtener solicitudes para Ventanilla (estado ENVIADA)
   * Solo accesible para usuarios con rol ventanilla
   */
  const getVentanillaRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}/api/ventanilla/requests`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener las solicitudes de ventanilla';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener detalle de solicitud con validaciones previas
   * Específico para ventanilla
   */
  const getVentanillaRequestDetail = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseURL}/api/ventanilla/request/${id}`, {
        withCredentials: true,
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al obtener el detalle de la solicitud';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Validar solicitud (Cumple / No Cumple)
   * @param {string} requestId
   * @param {string} status - 'aprobado_vus' | 'devuelto_vus'
   * @param {string} reasons - Razones si es rechazada
   * @param {Object} documentValidation - Validaciones de documentos
   * @param {Object} formDataValidation - Validaciones de campos de formulario
   */
  const validateRequest = useCallback(async (requestId, status, reasons, documentValidation, formDataValidation) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${baseURL}/api/ventanilla/validate/${requestId}`,
        { status, reasons, documentValidation, formDataValidation },
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al validar la solicitud';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
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
    getVentanillaRequests,
    getVentanillaRequestDetail,

    // Las siguientes funciones están disponibles pero se usarán en features específicos:
    // createRequest - Para formularios de creación de solicitudes
    // getRequestDocuments - Para ver documentos de una solicitud
    // uploadDocument - Para subir documentos
    // deleteDocument - Para eliminar documentos
    // updateDocument - Para actualizar documentos
    createRequest,
    getRequestDocuments,
    uploadDocument,
    deleteDocument,
    updateDocument,
    validateRequest,
  };
}

export default useRequestsAPI;
