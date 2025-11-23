import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";

export default function CompleteRegister() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [preData, setPreData] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Traer datos del backend usando el token
  useEffect(() => {
    if (!token) {
      setError("Token no encontrado en la URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/auth/pre-data?token=${token}`
        );
        setPreData(res.data);
      } catch (err) {
        setError("Este enlace es inválido o ha expirado.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, [token, baseURL]);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post(
        `${baseURL}/api/auth/register-complete`,
        {
          token,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess(true);
    } catch (err) {
      setError("Hubo un error al completar el registro.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error && !preData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">¡Registro Completado!</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-4 text-white font-medium rounded-lg transition-colors duration-200"
            style={{ backgroundColor: '#085297' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#064073'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#085297'}
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Formulario */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#4A8BDF' }}>
            ¡Solo falta crear tu contraseña!
          </h1>
          <p className="text-center text-gray-600 text-sm mb-8">
            Tu correo fue validado con éxito. Ingresa una nueva contraseña para finalizar tu registro.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all"
                  style={{ focusRing: '#4A8BDF' }}
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: '#4A8BDF' }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmo tu contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all"
                  placeholder=""
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: '#4A8BDF' }}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 text-white font-semibold rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#085297' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#064073'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#085297'}
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>

      {/* Lado derecho - Imagen con overlay */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="/Password-Background.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 840 1117" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path d="M0 48C0 21.4904 21.4903 0 48 0H933V1117H48C21.4904 1117 0 1095.51 0 1069V48Z" fill="black" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}
