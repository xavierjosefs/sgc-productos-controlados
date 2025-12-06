import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function ClientTopbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef(null);

  const { user, logout } = useAuth();

  const userName = user?.full_name || user?.nombre || user?.name || 'Usuario';
  const userEmail = user?.email || 'correo@ejemplo.com';
  const userRole = user?.role_name || 'Usuario';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  // Cerrar tooltip al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipRef]);

  const isHome = location.pathname === '/' || location.pathname === '/cliente' || location.pathname.startsWith('/requests');
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
            onClick={() => navigate('/cliente')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${isHome
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
              }`}
          >
            Mis Solicitudes
          </button>
          <button
            onClick={() => navigate('/support')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${isSupport
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
              }`}
          >
            Soporte
          </button>
        </div>

        {/* Usuario con dropdown */}
        <div className="relative" ref={tooltipRef}>
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white font-bold text-sm hover:bg-[#3a7bc0] transition-colors">
              {initials}
            </div>
            <div className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${showTooltip ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-4 px-5 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col gap-1 mb-4">
                <span className="font-bold text-gray-900 text-base truncate" title={userName}>{userName}</span>
                <span className="text-sm text-gray-500 truncate" title={userEmail}>{userEmail}</span>
                <span className="text-xs font-medium text-[#085297] bg-blue-50 px-2 py-1 rounded-md w-fit mt-1">
                  {userRole}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
