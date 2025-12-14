
import axios from 'axios';
// Configuración del endpoint del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Servicio de autenticación
 * Conectar con el backend cuando esté disponible
 */

export const authService = {
  /**
   * Iniciar sesión
   * @param {string} email - Correo del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} - Token y datos del usuario
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  },

  /**
   * Obtener token almacenado
   * @returns {string|null} - Token JWT
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Verificar si hay sesión activa
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener usuario actual
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Recuperar contraseña
   * @param {string} email - Correo del usuario
   * @returns {Promise<Object>}
   */
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      throw error;
    }
  },
};

export default authService;
