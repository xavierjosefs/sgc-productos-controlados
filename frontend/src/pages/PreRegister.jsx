import { useState } from 'react';
import Logo from '../components/Logo';
import axios from 'axios';

export default function PreRegister() {
  
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [formData, setFormData] = useState({
    full_name: '',
    cedula: '',
    email: ''
  });

  const [errors, setErrors] = useState({
    full_name: '',
    cedula: '',
    email: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');


  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de cédula (formato: 000-0000000-0)
  const validateCedula = (cedula) => {
    const cedulaRegex = /^[0-9]{11}$/;
    return cedulaRegex.test(cedula.replace(/-/g, ''));
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Este campo es requerido';
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.cedula) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!validateCedula(formData.cedula)) {
      newErrors.cedula = 'La cédula ingresada está incompleta';
    }

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const full_name = fd.get('full_name').toString().trim();
    const cedula = fd.get('cedula').toString().trim();
    const email = fd.get('email').toString().trim();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await axios.post(
        `${baseURL}/api/auth/pre-register`,
        { full_name, cedula, email },
        { headers: { "Content-Type": "application/json" } }
      );

      setApiSuccess(response.data.message);   // ✔ Muestra mensaje de éxito
      setApiError('');                       // ✔ Limpia errores si había
    }catch (error) {
      console.error('Error en registro:', error);
      setApiError(error.message || 'Error al registrar usuario. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-[460px] space-y-5">
          {/* Logo */}
          <div className="flex justify-center scale-90">
            <Logo />
          </div>

          {/* Título y descripción */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-center" style={{ color: '#4A8BDF' }}>
              ¡Crea tu cuenta en segundos!
            </h1>
            <p className="text-gray-600 text-xs text-center">
              Regístrate y gestiona tus solicitudes sin filas, sin estrés y desde cualquier lugar
            </p>
          </div>

          {/* Mensaje de error general */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Mensaje de éxito */}
          {apiSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {apiSuccess}
            </div>
          )}


          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de Nombre */}
            <div>
              <label htmlFor="full_name" className="block text-xs font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ '--tw-ring-color': '#4A8BDF' }}
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
              )}
            </div>

            {/* Campo de Cédula */}
            <div>
              <label htmlFor="cedula" className="block text-xs font-medium text-gray-700 mb-1">
                Cédula
              </label>
              <input
                type="text"
                id="cedula"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                placeholder="000-0000000-0"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.cedula ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ '--tw-ring-color': '#4A8BDF' }}
              />
              {errors.cedula && (
                <p className="mt-1 text-sm text-red-500">{errors.cedula}</p>
              )}
            </div>

            {/* Campo de Correo */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Correo
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@gmail.com"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ '--tw-ring-color': '#4A8BDF' }}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Botón de Validar Correo */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-2.5 text-sm rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#085297', '--tw-ring-color': '#085297' }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#064073')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#085297')}
            >
              {isLoading ? 'Enviando...' : 'Validar Correo'}
            </button>
          </form>

          {/* Línea divisoria */}
          <div className="border-t border-black"></div>

          {/* Iniciar sesión */}
          <p className="text-center text-sm text-gray-600 -mt-4">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="font-medium transition-colors" style={{ color: '#4A8BDF' }} onMouseEnter={(e) => e.target.style.color = '#3A7BCF'} onMouseLeave={(e) => e.target.style.color = '#4A8BDF'}>
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>

      {/* Lado derecho - Imagen de fondo */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden rounded-l-[48px]">
        {/* Imagen de fondo */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/Registrar-Backgroung.jpg)',
          }}
        ></div>
        
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    </div>
  );
}
