/**
 * Topbar del cliente
 * Logo + Navegación + Usuario
 */
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function ClientTopbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.nombre || user.name || 'Usuario';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isHome = location.pathname === '/';
  const isSupport = location.pathname === '/support';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="w-20">
          <Logo />
        </div>

        {/* Centro - Botones de navegación */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isHome
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
            }`}
          >
            Mis Solicitudes
          </button>
          <button
            onClick={() => navigate('/support')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isSupport
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
            }`}
          >
            Soporte
          </button>
        </div>

        {/* Usuario con dropdown */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
