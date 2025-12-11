import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

function DirectorTecnicoTopbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Logo />
                    
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/director-tecnico')}
                            className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors"
                        >
                            Solicitudes
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#4A8BDF] rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {user?.email?.substring(0, 2).toUpperCase() || 'DT'}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-900">{user?.nombre || 'Director de Técnico'}</p>
                                <p className="text-xs text-gray-500">Director de Técnico</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Cerrar sesión"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DirectorTecnicoTopbar;
