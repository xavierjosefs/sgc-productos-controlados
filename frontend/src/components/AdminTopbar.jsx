/**
 * Topbar del Administrador
 * Logo + Navegación + Usuario + Logout
 */
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function AdminTopbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isInicio = location.pathname === '/admin';
  const isSolicitudes = location.pathname === '/admin/solicitudes';
  const isEmpleados = location.pathname === '/admin/empleados';
  const isServicios = location.pathname === '/admin/servicios';

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
            onClick={() => navigate('/admin')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isInicio
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => navigate('/admin/solicitudes')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isSolicitudes
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
            }`}
          >
            Solicitudes
          </button>
          <button
            onClick={() => navigate('/admin/empleados')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isEmpleados
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
            }`}
          >
            Empleados
          </button>
          <button
            onClick={() => navigate('/admin/servicios')}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              isServicios
                ? 'bg-[#085297] text-white'
                : 'text-gray-700 hover:text-[#085297]'
            }`}
          >
            Servicios
          </button>
        </div>

        {/* Usuario con logout */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white font-bold text-sm">
            XF
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 font-medium text-sm">Xavier Fernandez</span>
            <span className="text-gray-500 text-xs">Administrador</span>
          </div>
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
