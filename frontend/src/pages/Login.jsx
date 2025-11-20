import { useState } from 'react';
import Logo from '../components/Logo';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validación de contraseña
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar errores al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Conectar con el endpoint del backend cuando esté listo
      // const response = await fetch('http://localhost:3000/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: formData.email,
      //     password: formData.password
      //   })
      // });
      // const data = await response.json();
      
      // Simulación temporal del login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Guardar token en localStorage cuando el backend esté listo
      // if (data.token) {
      //   localStorage.setItem('token', data.token);
      //   if (formData.rememberMe) {
      //     localStorage.setItem('rememberMe', 'true');
      //   }
      //   // Redirigir al dashboard
      //   window.location.href = '/dashboard';
      // }

      console.log('Login exitoso con:', formData);
      alert('Login simulado exitosamente. Conectar con backend cuando esté listo.');
      
    } catch (error) {
      console.error('Error en login:', error);
      setErrors(prev => ({ 
        ...prev, 
        password: 'Error al iniciar sesión. Verifica tus credenciales.' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo - Formulario */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-2 flex justify-center">
            <Logo />
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-blue-500 mb-2 text-center">
            ¡Nos alegra verte de nuevo!
          </h1>
          <p className="text-gray-600 mb-4 text-sm text-center">
            Ingresa y controla todos tus procesos desde un solo lugar, cuando quieras y donde quieras
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de Correo */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@gmail.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Campo de Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Recuérdame y Recuperar Contraseña */}
            <div className="flex items-center justify-between -mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Recuérdame</span>
              </label>
              <a href="#" className="text-sm text-blue-500 hover:text-blue-600 transition-colors">
                Recuperar Contraseña
              </a>
            </div>

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Registrarse */}
          <p className="mt-6 text-center text-sm text-gray-600">
            ¿Aún no tienes una cuenta?{' '}
            <a href="#" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>

      {/* Lado derecho - Imagen de fondo */}
      <div className="hidden lg:flex flex-1 relative bg-gray-800">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop)',
          }}
        ></div>
        
        {/* Iconos decorativos superpuestos */}
        <div className="relative z-20 flex items-center justify-center w-full">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
            {/* Ícono de documento con check */}
            <rect x="100" y="80" width="80" height="100" rx="8" stroke="white" strokeWidth="3" fill="none"/>
            <line x1="115" y1="105" x2="165" y2="105" stroke="white" strokeWidth="3"/>
            <line x1="115" y1="125" x2="165" y2="125" stroke="white" strokeWidth="3"/>
            <line x1="115" y1="145" x2="150" y2="145" stroke="white" strokeWidth="3"/>
            <circle cx="155" cy="155" r="15" fill="white"/>
            <path d="M148 155L153 160L162 150" stroke="#1E293B" strokeWidth="2" fill="none"/>

            {/* Ícono de carpeta */}
            <rect x="220" y="100" width="90" height="70" rx="8" stroke="white" strokeWidth="3" fill="none"/>
            <path d="M220 115L245 115L252 108L220 108Z" stroke="white" strokeWidth="3" fill="none"/>
            <line x1="235" y1="130" x2="285" y2="130" stroke="white" strokeWidth="2"/>
            <line x1="235" y1="145" x2="275" y2="145" stroke="white" strokeWidth="2"/>

            {/* Ícono de checklist */}
            <rect x="150" y="220" width="100" height="120" rx="8" stroke="white" strokeWidth="3" fill="none"/>
            <circle cx="170" cy="245" r="8" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M167 245L169 247L173 242" stroke="white" strokeWidth="2" fill="none"/>
            <line x1="185" y1="245" x2="230" y2="245" stroke="white" strokeWidth="2"/>
            
            <circle cx="170" cy="270" r="8" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M167 270L169 272L173 267" stroke="white" strokeWidth="2" fill="none"/>
            <line x1="185" y1="270" x2="230" y2="270" stroke="white" strokeWidth="2"/>
            
            <circle cx="170" cy="295" r="8" stroke="white" strokeWidth="2" fill="none"/>
            <line x1="185" y1="295" x2="230" y2="295" stroke="white" strokeWidth="2"/>
            
            <circle cx="170" cy="320" r="8" stroke="white" strokeWidth="2" fill="none"/>
            <line x1="185" y1="320" x2="215" y2="320" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
