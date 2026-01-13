import { useState } from 'react';
import axios from 'axios';
import Logo from '../components/Logo';
import { authService } from '../services/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Timer state
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = () => {
    setTimer(30);
    setCanResend(false);
  };

  // Validation helpers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email) return setError('El correo es requerido');
    if (!validateEmail(email)) return setError('Ingresa un correo válido');

    setIsLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      setStep(2);
      startTimer();
    } catch (err) {
      setError(err.message || 'Error al enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Ingresa el código');
    if (otp.length !== 6) return setError('El código debe tener 6 dígitos');

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyOtp(email.trim().toLowerCase(), otp);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Código inválido');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password) return setError('La contraseña es requerida');
    if (!validatePassword(password)) return setError('Mínimo 6 caracteres');
    if (password !== confirmPassword) return setError('Las contraseñas no coinciden');

    setIsLoading(true);
    setError('');

    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      await axios.post(`${baseURL}/api/auth/forgot-password`, 
        { email: email.trim().toLowerCase() },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      console.log('Enlace de recuperación enviado a:', email);
      setIsSuccess(true);
      
    } catch (error) {
      console.error('Error en recuperación:', error);
      setError(error.response?.data?.message || error.message || 'Error al enviar enlace. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    if (!canResend) return;
    await handleSendOtp();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px] space-y-5">
          {/* Header */}
          <div className="space-y-4">
            <a href="/login" className="inline-flex items-center text-[#4A8BDF] hover:text-[#3A7BCF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </a>
            <div className="flex justify-center scale-90">
              <Logo />
            </div>
          </div>

          {/* Content based on step */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {step === 1 && (
              <>
                <div className="text-center space-y-2 mb-6">
                  <h1 className="text-2xl font-bold text-[#4A8BDF]">Recuperar Contraseña</h1>
                  <p className="text-gray-500 text-sm">Ingresa tu correo para recibir un código de recuperación.</p>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent outline-none transition-all"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#085297] hover:bg-[#064073] text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Código'}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center space-y-2 mb-6">
                  <h1 className="text-2xl font-bold text-[#4A8BDF]">Verificar Código</h1>
                  <p className="text-gray-500 text-sm">Ingresa el código de 6 dígitos enviado a {email}</p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Código OTP</label>
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent outline-none transition-all text-center tracking-widest text-lg"
                      placeholder="000000"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#085297] hover:bg-[#064073] text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Verificando...' : 'Verificar'}
                  </button>
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={!canResend || isLoading}
                      className={`text-sm font-medium ${canResend ? 'text-[#4A8BDF] hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      {canResend ? 'Reenviar código' : `Reenviar en ${timer}s`}
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center space-y-2 mb-6">
                  <h1 className="text-2xl font-bold text-[#4A8BDF]">Nueva Contraseña</h1>
                  <p className="text-gray-500 text-sm">Crea una nueva contraseña segura.</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#085297] hover:bg-[#064073] text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </button>
                </form>
              </>
            )}

            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-[#4A8BDF]">¡Contraseña Actualizada!</h2>
                  <p className="text-gray-600 text-sm">Tu contraseña ha sido restablecida exitosamente.</p>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#085297] hover:bg-[#064073] text-white py-2.5 rounded-lg font-semibold transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
