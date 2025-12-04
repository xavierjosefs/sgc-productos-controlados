import ClientTopbar from '../../components/ClientTopbar';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeEstado from '../../components/BadgeEstado';
import { useRequestsAPI } from '../../hooks/useRequestsAPI';

/**
 * Dashboard de Ventanilla
 * Panel para recepción y gestión de solicitudes entrantes
 */
export default function VentanillaDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getVentanillaRequests, loading, error } = useRequestsAPI();
    const [requests, setRequests] = useState([]);

    // Cargar solicitudes al montar el componente
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getVentanillaRequests();
                if (response.ok) {
                    setRequests(response.requests || []);
                }
            } catch (err) {
                console.error('Error al cargar solicitudes:', err);
            }
        };
        fetchRequests();
    }, [getVentanillaRequests]);

    // Formatear fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A8BDF]">Panel de Ventanilla</h1>
                        <p className="text-gray-600 mt-1">Bienvenido, {user?.full_name || 'Ventanilla'}</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Solicitudes Recibidas Hoy</span>
                        </div>
                        <p className="text-4xl font-bold text-[#4A8BDF]">
                            {requests.filter(r => {
                                const today = new Date().toDateString();
                                return new Date(r.fecha_creacion).toDateString() === today;
                            }).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Total Solicitudes Enviadas</span>
                        </div>
                        <p className="text-4xl font-bold text-[#F59E0B]">{requests.length}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Enviadas a Técnico</span>
                        </div>
                        <p className="text-4xl font-bold text-[#10B981]">0</p>
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors">
                            Recibir Nueva Solicitud
                        </button>
                        <button className="px-6 py-3 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors">
                            Buscar Solicitud
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Tabla de solicitudes recientes */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Solicitudes Enviadas</h2>
                    </div>

                    {loading ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            Cargando solicitudes...
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#4A8BDF]">
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">ID</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Solicitante</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Tipo de Servicio</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Fecha</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Estado</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No hay solicitudes enviadas
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((request) => (
                                        <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                #{request.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {request.nombre_cliente}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {request.tipo_servicio}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(request.fecha_creacion)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <BadgeEstado estado={request.estado_actual} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => navigate(`/ventanilla/solicitud/${request.id}`)}
                                                    className="text-[#4A8BDF] hover:text-[#3875C8] font-medium text-sm"
                                                >
                                                    Ver Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
