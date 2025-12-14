
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import DireccionTopbar from '../../components/DireccionTopbar';
import useRequestsAPI from '../../hooks/useRequestsAPI';

/**
 * DireccionSolicitudes
 * Dashboard principal de Dirección
 */
export default function DireccionSolicitudes() {
    // Limpiar filtros
    const handleClearFilters = () => {
        setFilterTipo('');
        setFilterEstado('');
        setAppliedTipo('');
        setAppliedEstado('');
    };
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTipo, setFilterTipo] = useState('');
    const [filterEstado, setFilterEstado] = useState(''); // Puede ser 'pendiente', 'aprobada', 'rechazada' o ''
    const [appliedTipo, setAppliedTipo] = useState('');
    const [appliedEstado, setAppliedEstado] = useState('');
    // Tipos de servicio dinámicos según las solicitudes cargadas
    const tiposServicio = Array.from(new Set(requests.map(r => r.tipo_servicio).filter(Boolean)));
    const { getDireccionRequests } = useRequestsAPI();

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const data = await getDireccionRequests();
                // El backend responde { ok, requests } o solo requests
                if (data?.ok && data.requests) {
                    setRequests(data.requests);
                } else if (Array.isArray(data)) {
                    setRequests(data);
                } else if (data?.requests) {
                    setRequests(data.requests);
                } else {
                    setRequests([]);
                }
            } catch (error) {
                console.error('Error al cargar solicitudes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [getDireccionRequests]);

    // Filtrar solicitudes según filtros aplicados
    const filteredRequests = requests.filter(request => {
        // Filtro por tipo de servicio
        if (appliedTipo && !request.tipo_servicio?.toLowerCase().includes(appliedTipo.toLowerCase())) {
            return false;
        }
        // Filtro por estado usando estado_id
        if (appliedEstado) {
            if (appliedEstado === 'pendiente' && request.estado_id !== 7) {
                return false;
            }
            if (appliedEstado === 'aprobada' && request.estado_id !== 8) {
                return false;
            }
            if (appliedEstado === 'rechazada' && request.estado_id !== 18) {
                return false;
            }
        }
        return true;
    });

    // Calcular contadores basados en el estado_id
    // Estado 7: FIRMADA_DIRECCION (Pendientes de aprobación por Dirección)
    // Estado 8: EN_DNCD (Aprobadas por Dirección)
    // Estado 18: rechazada_direccion (Rechazadas por Dirección)
    const pendientesCount = requests.filter(r => r.estado_id === 7).length;
    const aprobadasCount = requests.filter(r => r.estado_id === 8).length;
    const rechazadasCount = requests.filter(r => r.estado_id === 18).length;

    const handleFilter = () => {
        setAppliedTipo(filterTipo);
        setAppliedEstado(filterEstado);
    };

    const handleCardFilter = (estado) => {
        setFilterEstado(estado);
        setAppliedEstado(estado);
    };

    const handleVerDetalle = (id) => {
        navigate(`/direccion/solicitud/${id}`);
    };

    return (
        <>
            <DireccionTopbar />
            <div className="max-w-[1400px] mx-auto px-8 py-8">
            {/* Título */}
            <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Solicitudes</h1>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Pendientes */}
                <div 
                    onClick={() => handleCardFilter('pendiente')}
                    className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm cursor-pointer hover:border-[#60A5FA] hover:shadow-md transition-all"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-700 font-medium">Pendientes</span>
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-5xl font-bold text-[#60A5FA] mt-3">{pendientesCount}</p>
                </div>

                {/* Aprobadas */}
                <div 
                    onClick={() => handleCardFilter('aprobada')}
                    className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm cursor-pointer hover:border-[#22C55E] hover:shadow-md transition-all"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-700 font-medium">Aprobadas</span>
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-5xl font-bold text-[#22C55E] mt-3">{aprobadasCount}</p>
                </div>

                {/* Rechazadas */}
                <div 
                    onClick={() => handleCardFilter('rechazada')}
                    className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm cursor-pointer hover:border-[#F97316] hover:shadow-md transition-all"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-gray-700 font-medium">Rechazadas</span>
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-5xl font-bold text-[#F97316] mt-3">{rechazadasCount}</p>
                </div>
            </div>

            {/* Sección de tabla */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm">
                {/* Filtros */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex gap-4 items-end justify-end">
                        <div>
                            <select
                                value={filterTipo}
                                onChange={(e) => setFilterTipo(e.target.value)}
                                className="min-w-40 max-w-[220px] px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] bg-white"
                            >
                                <option value="">Tipo</option>
                                {tiposServicio.map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                                className="min-w-40 max-w-[220px] px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] bg-white"
                            >
                                <option value="">Estado</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="aprobada">Aprobada</option>
                                <option value="rechazada">Rechazada</option>
                            </select>
                        </div>
                        <button
                            onClick={handleFilter}
                            className="px-8 py-2.5 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064078] transition-colors"
                        >
                            Filtrar
                        </button>
                        {(filterTipo || filterEstado || appliedTipo || appliedEstado) && (
                            <button
                                onClick={handleClearFilters}
                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors ml-2"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#4A8BDF]">
                                <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">Código</th>
                                <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">Fecha Creación</th>
                                <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">Tipo de Servicio</th>
                                <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">Estado</th>
                                <th className="px-6 py-4 text-right text-white font-semibold uppercase tracking-wide">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        Cargando solicitudes...
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No hay solicitudes disponibles
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-medium">#{request.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">
                                                {new Date(request.fecha_creacion).toLocaleDateString('es-DO', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">{request.tipo_servicio}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700">
                                                {request.estado_id === 7 ? 'Firmada por directorUPC' : request.estado_actual}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleVerDetalle(request.id)}
                                                className="text-[#085297] font-semibold hover:underline"
                                            >
                                                Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </>
    );
}
