import React from 'react';
import Logo from './Logo';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DncdTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.full_name || user?.nombre || user?.name || 'Usuario';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="w-20 shrink-0">
          <Logo />
        </div>
        {/* Navegación centrada */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dncd')}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${location.pathname === '/dncd' ? 'bg-[#085297] text-white' : 'bg-gray-100 text-[#085297] hover:bg-[#D5E8F7]'}`}
            >
              Solicitudes
            </button>
          </div>
        </div>
        {/* Usuario y logout */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-4 py-2 rounded-lg bg-[#D5E8F7] text-black flex flex-col items-center justify-center min-w-[100px]">
            <span className="font-bold text-sm">{userName}</span>
            <span className="text-xs text-gray-600">DNCD</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            title="Cerrar sesión"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
