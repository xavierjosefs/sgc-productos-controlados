import { useState } from 'react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';

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
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="w-full max-w-[526px] space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo />
          </div>

          {/* Título y descripción */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-center" style={{ color: '#4A8BDF' }}>
              ¡Nos alegra verte de nuevo!
            </h1>
            <p className="text-gray-600 text-sm text-center">
              Ingresa y controla todos tus procesos desde un solo lugar, cuando quieras y donde quieras
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Campo de Contraseña */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  style={{ '--tw-ring-color': '#4A8BDF' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 hover:opacity-80 transition-opacity"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4A8BDF" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4A8BDF" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Recuérdame y Recuperar Contraseña */}
            <div className="flex items-center justify-between -mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 border-gray-300 rounded focus:ring-2"
                  style={{ accentColor: '#4A8BDF', '--tw-ring-color': '#4A8BDF' }}
                />
                <span className="ml-2 text-xs text-gray-700">Recuérdame</span>
              </label>
              <a href="/forgot-password" className="text-xs transition-colors" style={{ color: '#4A8BDF' }} onMouseEnter={(e) => e.target.style.color = '#3A7BCF'} onMouseLeave={(e) => e.target.style.color = '#4A8BDF'}>
                Recuperar Contraseña
              </a>
            </div>

            {/* Botón de Iniciar Sesión */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-2.5 text-sm rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#085297', '--tw-ring-color': '#085297' }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#064073')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#085297')}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Línea divisoria */}
          <div className="border-t border-black"></div>

          {/* Registrarse */}
          <p className="text-center text-xs text-gray-600 -mt-4">
            ¿Aún no tienes una cuenta?{' '}
            <Link to="/pre-register" className="font-medium transition-colors" style={{ color: '#4A8BDF' }} onMouseEnter={(e) => e.target.style.color = '#3A7BCF'} onMouseLeave={(e) => e.target.style.color = '#4A8BDF'}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      {/* Lado derecho - Imagen de fondo */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden rounded-l-[48px]">
        {/* Imagen de fondo con overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/login-background.jpg)',
          }}
        ></div>
        
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
    </div>
  );
}
