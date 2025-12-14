import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function DireccionTopbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

        return (
            <header
                className="h-20 w-full flex items-center justify-center bg-white border border-[#9B9A9A] shadow-[inset_0_0_4px_rgba(0,0,0,0.25)] rounded-2xl mt-6 max-w-7xl mx-auto"
                style={{ boxSizing: 'border-box' }}
            >
                <div className="w-full flex items-center justify-between px-8 gap-x-8">
                    {/* Logo */}
                    <div className="w-20 shrink-0">
                        <Logo className="h-10 w-10" />
                    </div>

                    {/* Navegación */}
                    <nav className="flex-1 flex justify-center items-center gap-8">
                        <button
                            onClick={() => navigate('/direccion')}
                            className={
                                `font-bold transition-colors px-6 py-2 rounded-xl ` +
                                (window.location.pathname === '/direccion'
                                    ? 'bg-[#085297] text-white'
                                    : 'text-[#4A8BDF] hover:bg-[#4A8BDF]/90 hover:text-white')
                            }
                        >
                            Solicitudes
                        </button>
                    </nav>

                    {/* Usuario y Logout */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#4A8BDF] flex items-center justify-center text-white font-semibold">
                                {user?.full_name?.charAt(0) || 'D'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'Dirección'}</p>
                                <p className="text-xs text-gray-500">Dirección</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-600 transition-colors"
                            title="Cerrar sesión"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
        );
}

export default DireccionTopbar;
