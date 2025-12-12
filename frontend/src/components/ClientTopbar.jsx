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

        <div className="flex-1"></div>

        {/* Botones de navegación */}
        <div className="flex items-center gap-4">
          <button
            className="px-6 py-2 rounded-lg font-semibold text-sm bg-[#085297] text-white"
          >
            Empleados
          </button>
          <button
            className="px-6 py-2.5 rounded-lg bg-[#D5E8F7] text-black flex flex-col items-center justify-center"
          >
            <span className="font-bold text-sm">{userName}</span>
            <span className="text-xs">Director</span>
          </button>
        </div>

        {/* Botón de logout */}
        <div className="relative ml-4" ref={tooltipRef}>
          <button
            onClick={logout}
            className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            title="Cerrar Sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3-3l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
