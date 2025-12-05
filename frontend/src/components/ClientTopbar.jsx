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
  const userName = user.full_name || user.nombre || user.name || 'Usuario';
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

        {/* Usuario con logout */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <span className="text-gray-700 font-medium text-sm">{userName}</span>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            title="Cerrar sesión"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
