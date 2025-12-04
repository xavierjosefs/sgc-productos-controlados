import ClientTopbar from '../../components/ClientTopbar';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard de Administrador
 * Panel completo de administración del sistema
 */
export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A8BDF]">Panel de Administración</h1>
                        <p className="text-gray-600 mt-1">Bienvenido, {user?.full_name || 'Administrador'}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Usuarios Totales</span>
                        <p className="text-4xl font-bold text-[#4A8BDF] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Solicitudes Activas</span>
                        <p className="text-4xl font-bold text-[#F59E0B] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Servicios Configurados</span>
                        <p className="text-4xl font-bold text-[#10B981] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Roles del Sistema</span>
                        <p className="text-4xl font-bold text-[#8B5CF6] mt-2">7</p>
                    </div>
                </div>

                {/* Acciones de Administración */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Usuarios</h2>
                        <div className="flex flex-col gap-3">
                            <button className="px-6 py-3 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors text-left">
                                Ver Todos los Usuarios
                            </button>
                            <button className="px-6 py-3 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors text-left">
                                Crear Nuevo Usuario
                            </button>
                            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-left">
                                Gestionar Roles
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Configuración del Sistema</h2>
                        <div className="flex flex-col gap-3">
                            <button className="px-6 py-3 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#4F46E5] transition-colors text-left">
                                Tipos de Servicio
                            </button>
                            <button className="px-6 py-3 bg-[#8B5CF6] text-white rounded-lg font-medium hover:bg-[#7C3AED] transition-colors text-left">
                                Estados de Solicitud
                            </button>
                            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-left">
                                Configuración General
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Actividad Reciente del Sistema</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-500 text-center py-8">
                            El registro de actividad del sistema se mostrará aquí.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
