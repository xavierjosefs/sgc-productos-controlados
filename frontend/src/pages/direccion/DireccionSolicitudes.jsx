import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import BadgeEstado from '../../components/BadgeEstado';

/**
 * DireccionSolicitudes
 * Listado de solicitudes pendientes de aprobación por Dirección
 */
export default function DireccionSolicitudes() {
    const navigate = useNavigate();
    const { getDireccionRequests, loading, error } = useRequestsAPI();
    const [requests, setRequests] = useState([]);
    const [filterTipo, setFilterTipo] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getDireccionRequests();
                if (response.ok) {
                    setRequests(response.requests || []);
                }
            } catch (err) {
                console.error("Error al cargar solicitudes:", err);
            }
        };
        fetchRequests();
    }, [getDireccionRequests]);

    // Filtrar solicitudes
    const filteredRequests = requests.filter(request => {
        if (filterTipo && !request.tipo_servicio?.toLowerCase().includes(filterTipo.toLowerCase())) {
            return false;
        }
        return true;
    });

    // Navegar al detalle
    const handleRowClick = (id) => {
        navigate(`/direccion/solicitud/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#4A8BDF]">Gestión de Solicitudes - Dirección</h1>
                <p className="text-gray-600 mt-1">Solicitudes pendientes de aprobación</p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <span className="text-sm text-gray-600">Pendientes de firma</span>
                    <p className="text-4xl font-bold text-[#F59E0B] mt-2">{requests.length}</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-48">
                        <label className="block text-sm text-gray-600 mb-2">Tipo de Servicio</label>
                        <input
                            type="text"
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            placeholder="Buscar por tipo..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                        />
                    </div>
                    <button
                        onClick={() => setFilterTipo('')}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Tabla de solicitudes */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Solicitudes Pendientes de Firma</h2>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        Cargando solicitudes...
                    </div>
                ) : error ? (
                    <div className="px-6 py-12 text-center text-red-500">
                        {error}
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#4A8BDF]">
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">ID</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">CLIENTE</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">TIPO DE SERVICIO</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">FECHA</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">ESTADO</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No hay solicitudes pendientes de aprobación
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr
                                        key={request.id}
                                        onClick={() => handleRowClick(request.id)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4 text-sm text-[#085297] font-medium">
                                            #{request.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {request.nombre_cliente}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {request.tipo_servicio}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(request.fecha_creacion).toLocaleDateString('es-DO')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <BadgeEstado estado={request.estado_actual} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
