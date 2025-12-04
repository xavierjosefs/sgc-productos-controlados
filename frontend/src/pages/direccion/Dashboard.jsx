import ClientTopbar from '../../components/ClientTopbar';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard de Dirección
 * Panel ejecutivo con vista general del sistema
 */
export default function DireccionDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A8BDF]">Panel de Dirección</h1>
                        <p className="text-gray-600 mt-1">Bienvenido, {user?.full_name || 'Director'}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Solicitudes Totales</span>
                        <p className="text-4xl font-bold text-[#4A8BDF] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">En Proceso</span>
                        <p className="text-4xl font-bold text-[#F59E0B] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Finalizadas Este Mes</span>
                        <p className="text-4xl font-bold text-[#10B981] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Usuarios Activos</span>
                        <p className="text-4xl font-bold text-[#8B5CF6] mt-2">0</p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Ejecutivas</h2>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors">
                            Ver Reportes Generales
                        </button>
                        <button className="px-6 py-3 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors">
                            Estadísticas
                        </button>
                        <button className="px-6 py-3 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#4F46E5] transition-colors">
                            Configuración del Sistema
                        </button>
                    </div>
                </div>

                {/* Resumen */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Resumen de Actividad</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-500 text-center py-8">
                            El panel ejecutivo mostrará estadísticas y métricas del sistema.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
