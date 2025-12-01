import { useState } from 'react';
import Logo from '../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validación de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar cambio en el input
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  // Manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('El correo es requerido');
      return;
    }

    if (!validateEmail(email)) {
      setError('Ingresa un correo válido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al enviar enlace');
      }

      console.log('Enlace de recuperación enviado a:', email);
      setIsSuccess(true);
      
    } catch (error) {
      console.error('Error en recuperación:', error);
      setError(error.message || 'Error al enviar enlace. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Contenido centrado */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px] space-y-5">
          {/* Flecha de regreso y Logo */}
          <div className="space-y-4">
            <a 
              href="/login" 
              className="inline-flex items-center transition-colors"
              style={{ color: '#4A8BDF' }}
              onMouseEnter={(e) => e.target.style.color = '#3A7BCF'}
              onMouseLeave={(e) => e.target.style.color = '#4A8BDF'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div className="flex justify-center scale-90">
              <Logo />
            </div>
          </div>

          {!isSuccess ? (
            <>
              {/* Título y descripción */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-center" style={{ color: '#4A8BDF' }}>
                  Olvidaste tu contraseña?
                </h1>
                <p className="text-gray-600 text-xs text-center">
                  Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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
                    value={email}
                    onChange={handleChange}
                    placeholder="ejemplo@gmail.com"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    style={{ '--tw-ring-color': '#4A8BDF' }}
                  />
                </div>

                {/* Botón de Enviar */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white py-2.5 text-sm rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#085297', '--tw-ring-color': '#085297' }}
                  onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#064073')}
                  onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#085297')}
                >
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>

              {/* Línea divisoria */}
              <div className="border-t border-black"></div>

              {/* Link para reenviar */}
              <p className="text-center text-sm text-gray-600 -mt-4">
                ¿No has recibido el enlace?{' '}
                <a 
                  href="#" 
                  className="font-medium transition-colors" 
                  style={{ color: '#4A8BDF' }} 
                  onMouseEnter={(e) => e.target.style.color = '#3A7BCF'} 
                  onMouseLeave={(e) => e.target.style.color = '#4A8BDF'}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLoading && email && validateEmail(email)) {
                      handleSubmit(e);
                    }
                  }}
                >
                  Reenvíalo aquí
                </a>
              </p>
            </>
          ) : (
            /* Mensaje de éxito */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4A8BDF20' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#4A8BDF" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold" style={{ color: '#4A8BDF' }}>
                  ¡Correo enviado!
                </h2>
                <p className="text-gray-600 text-sm">
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                </p>
              </div>
              <a 
                href="/login"
                className="inline-block font-medium transition-colors text-sm"
                style={{ color: '#4A8BDF' }}
                onMouseEnter={(e) => e.target.style.color = '#3A7BCF'}
                onMouseLeave={(e) => e.target.style.color = '#4A8BDF'}
              >
                Volver al inicio de sesión
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
