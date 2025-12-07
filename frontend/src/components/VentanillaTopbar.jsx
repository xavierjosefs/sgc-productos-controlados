import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function VentanillaTopbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Get current path to highlight nav item
    const path = window.location.pathname;
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Logo className="h-10 w-10" />
                    </div>

                    {/* Navegación */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => navigate('/ventanilla')}
                            className={
                                `font-bold transition-colors px-6 py-2 rounded-xl ` +
                                (path === '/ventanilla'
                                    ? 'bg-[#085297] text-white'
                                    : 'text-[#085297] hover:bg-[#085297] hover:text-white')
                            }
                        >
                            Solicitudes
                        </button>
                    </nav>

                    {/* Usuario y Logout */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#085297] flex items-center justify-center text-white font-semibold">
                                {user?.full_name?.charAt(0) || 'V'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'Ventanilla'}</p>
                                <p className="text-xs text-gray-500">Ventanilla</p>
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
            </div>
        </header>
    );
}
