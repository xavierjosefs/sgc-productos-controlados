import ClientTopbar from '../../components/ClientTopbar';
import { useAuth } from '../../context/AuthContext';

/**
 * Dashboard de DNCD
 * Panel para revisión y aprobación de DNCD
 */
export default function DncdDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A8BDF]">Panel DNCD</h1>
                        <p className="text-gray-600 mt-1">Bienvenido, {user?.full_name || 'DNCD'}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Pendientes de Revisión</span>
                        <p className="text-4xl font-bold text-[#F59E0B] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Aprobadas</span>
                        <p className="text-4xl font-bold text-[#10B981] mt-2">0</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <span className="text-sm text-gray-600">Observadas</span>
                        <p className="text-4xl font-bold text-[#EF4444] mt-2">0</p>
                    </div>
                </div>

                {/* Acciones */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones</h2>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors">
                            Ver Solicitudes Pendientes
                        </button>
                        <button className="px-6 py-3 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors">
                            Historial de Revisiones
                        </button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Solicitudes Pendientes de Revisión DNCD</h2>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#4A8BDF]">
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">ID</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Solicitante</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Tipo</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Sustancias</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Fecha</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    No hay solicitudes pendientes de revisión
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
