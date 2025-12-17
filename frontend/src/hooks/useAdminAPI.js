import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function para hacer peticiones a la API
const apiRequest = async (endpoint, options = {}) => {
    const response = await axios({
        url: `${API_URL}${endpoint}`,
        withCredentials: true,
        ...options,
    });
    return response.data;
};


// Hook para admin
export const useAdminAPI = () => {
    // ========== USARIOS/EMPLEADOS ==========
    const getUsers = () => apiRequest('/api/admin/get-users');

    const getUserByCedula = (cedula) =>
        apiRequest(`/api/admin/users/${cedula}`);

    const createUser = (data) =>
        apiRequest('/api/admin/create-user', { method: 'POST', data });

    const updateUser = (cedula, updates) =>
        apiRequest(`/api/admin/users/${cedula}`, {
            method: 'PUT',
            data: updates
        });

    const updateUserRole = (cedula, newRole) =>
        apiRequest('/api/admin/change-role', {
            method: 'PUT',
            data: { cedula, newRole }
        });

    const updateUserStatus = (cedula, isActive) =>
        apiRequest(`/api/admin/users/${cedula}/status`, {
            method: 'PUT',
            data: { isActive }
        });

    const getRoles = () => apiRequest('/api/admin/get-roles');

    // ========== SERVICIOS ==========
    const getServices = () => apiRequest('/api/admin/get-services');

    const getServiceByCode = (code) =>
        apiRequest(`/api/admin/services/${code}`);

    const createService = (data) =>
        apiRequest('/api/admin/create-service', { method: 'POST', data });

    const updateService = (id, data) =>
        apiRequest(`/api/admin/services/${id}`, { method: 'PUT', data });

    // ========== FORMULARIOS ==========
    const getForms = () => apiRequest('/api/admin/get-forms');

    // ========== SOLICITUDES ==========
    const getAllRequests = () => apiRequest('/api/admin/get-all-requests');

    const getRequestById = (id) =>
        apiRequest(`/api/requests/${id}/details`);

    const getRequestStatuses = () =>
        apiRequest('/api/admin/get-request-statuses');

    const getStats = () => apiRequest('/api/admin/stats');

    return {
        // Empleados/Usuarios
        getUsers,
        getUserByCedula,
        createUser,
        updateUser,
        updateUserRole,
        updateUserStatus,
        getRoles,
        // Servicios
        getServices,
        getServiceByCode,
        createService,
        updateService,
        // Formularios
        getForms,
        // Solicitudes
        getAllRequests,
        getRequestById,
        getRequestStatuses,
        getStats,
    };
};

/**
 * Custom hook para obtener datos con manejo automatico de estado
 * @param {Function} fetchFn - Funcion que retorna una promesa
 * @param {Array} deps - Array de dependencias para useEffect
 * @returns {Object} { data, loading, error, refetch }
 */
export const useAdminData = (fetchFn, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            console.error('Error obteniendo datos:', err);
            setError(err.response?.data?.error || err.message || 'Error cargando datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // 
    }, deps);

    return { data, loading, error, refetch: fetchData };
};
