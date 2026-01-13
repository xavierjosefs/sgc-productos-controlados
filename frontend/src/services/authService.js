
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
   * Recuperar contraseña (Enviar OTP)
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

  /**
   * Verificar OTP
   * @param {string} email - Correo del usuario
   * @param {string} otp - Código OTP
   * @returns {Promise<Object>}
   */
  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Código inválido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en verificación de OTP:', error);
      throw error;
    }
  },

  /**
   * Restablecer contraseña
   * @param {string} email - Correo del usuario
   * @param {string} otp - Código OTP
   * @param {string} password - Nueva contraseña
   * @returns {Promise<Object>}
   */
  resetPassword: async (email, otp, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al restablecer contraseña');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en restablecimiento de contraseña:', error);
      throw error;
    }
  },
};

export default authService;
