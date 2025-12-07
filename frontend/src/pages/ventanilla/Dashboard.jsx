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
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filterTipo, setFilterTipo] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [activeCard, setActiveCard] = useState('all'); // 'all', 'pendientes', 'aprobadas', 'devueltas'

    // Cargar solicitudes al montar el componente
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getVentanillaRequests();
                if (response.ok) {
                    setRequests(response.requests || []);
                    setFilteredRequests(response.requests || []);
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

    // Calcular contadores - usando el nombre del estado
    const pendientesCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'pendiente'
    ).length;
    
    const aprobadasCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'en evaluación técnica'
    ).length;
    
    const devueltasCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'devuelta por vus'
    ).length;

    // Filtrar solicitudes
    const handleFilter = () => {
        let filtered = [...requests];

        // Filtro por card clickeada
        if (activeCard === 'pendientes') {
            filtered = filtered.filter(r => 
                r.estado_actual?.toLowerCase() === 'pendiente'
            );
        } else if (activeCard === 'aprobadas') {
            filtered = filtered.filter(r => 
                r.estado_actual?.toLowerCase() === 'en evaluación técnica'
            );
        } else if (activeCard === 'devueltas') {
            filtered = filtered.filter(r => 
                r.estado_actual?.toLowerCase() === 'devuelta por vus'
            );
        }

        // Filtro por tipo
        if (filterTipo) {
            filtered = filtered.filter(r => r.tipo_servicio && r.tipo_servicio.toLowerCase().includes(filterTipo.toLowerCase()));
        }

        // Filtro por estado
        if (filterEstado) {
            filtered = filtered.filter(r => r.estado_actual && r.estado_actual.toLowerCase() === filterEstado.toLowerCase());
        }

        setFilteredRequests(filtered);
    };

    // Aplicar filtros cuando cambien
    useEffect(() => {
        handleFilter();
    }, [activeCard, filterTipo, filterEstado, requests]);

    // Manejar click en card
    const handleCardClick = (cardType) => {
        setActiveCard(cardType);
        setFilterEstado(''); // Limpiar filtro de estado cuando se clickea una card
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#4A8BDF]">Gestión de Solicitudes</h1>
                    <p className="text-gray-600 mt-2">
                        Revisa y valida las solicitudes enviadas por los usuarios
                    </p>
                </div>

                {/* Summary Cards - Clickeables */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card Pendientes */}
                    <div
                        onClick={() => handleCardClick('pendientes')}
                        className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                            activeCard === 'pendientes' ? 'border-[#4A8BDF] shadow-lg' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-700">Pendientes de Revisión</span>
                            <svg
                                className="w-5 h-5 text-[#4A8BDF]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-5xl font-bold text-[#4A8BDF]">{pendientesCount}</p>
                        <p className="text-xs text-gray-500 mt-2">Solicitudes en estado Pendiente</p>
                    </div>

                    {/* Card Aprobadas */}
                    <div
                        onClick={() => handleCardClick('aprobadas')}
                        className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                            activeCard === 'aprobadas' ? 'border-green-500 shadow-lg' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-700">Aprobadas</span>
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <p className="text-5xl font-bold text-green-600">{aprobadasCount}</p>
                        <p className="text-xs text-gray-500 mt-2">Validadas por ventanilla</p>
                    </div>

                    {/* Card Devueltas */}
                    <div
                        onClick={() => handleCardClick('devueltas')}
                        className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                            activeCard === 'devueltas' ? 'border-orange-500 shadow-lg' : 'border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-700">Devueltas</span>
                            <svg
                                className="w-5 h-5 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <p className="text-5xl font-bold text-orange-600">{devueltasCount}</p>
                        <p className="text-xs text-gray-500 mt-2">Requieren corrección</p>
                    </div>
                </div>



                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo
                            </label>
                            <select
                                value={filterTipo}
                                onChange={(e) => setFilterTipo(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                            >
                                <option value="">Todos</option>
                                <option value="Clase A">Clase A</option>
                                <option value="Clase B">Clase B</option>
                                <option value="Capa C">Capa C</option>
                                <option value="Importación">Importación</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <select
                                value={filterEstado}
                                onChange={(e) => setFilterEstado(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                            >
                                <option value="">Todos</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="devuelta por vus">Devuelta</option>
                                <option value="en evaluación técnica">Aprobada</option>
                            </select>
                        </div>

                        {(activeCard !== 'all' || filterTipo || filterEstado) && (
                            <button
                                onClick={() => {
                                    setActiveCard('all');
                                    setFilterTipo('');
                                    setFilterEstado('');
                                }}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabla de solicitudes */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {activeCard === 'pendientes' ? 'Solicitudes Pendientes de Revisión' :
                             activeCard === 'aprobadas' ? 'Solicitudes Aprobadas' :
                             activeCard === 'devueltas' ? 'Solicitudes Devueltas' :
                             'Todas las Solicitudes'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeCard === 'pendientes' ? 'Solicitudes nuevas y reenviadas que requieren validación' :
                             activeCard === 'aprobadas' ? 'Solicitudes validadas correctamente por ventanilla' :
                             activeCard === 'devueltas' ? 'Solicitudes devueltas que requieren corrección del usuario' :
                             'Vista general de todas las solicitudes'}
                        </p>
                    </div>

                    {loading ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            Cargando solicitudes...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="bg-[#4A8BDF]">
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">CÓDIGO</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">FECHA CREACIÓN</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">SOLICITANTE</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">TIPO DE SERVICIO</th>
                                    <th className="px-6 py-4 text-left text-white font-semibold text-sm">ESTADO</th>
                                    <th className="px-6 py-4 text-center text-white font-semibold text-sm">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No hay solicitudes que mostrar
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                #{request.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(request.fecha_creacion)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {request.nombre_cliente}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {request.tipo_servicio}
                                            </td>
                                            <td className="px-6 py-4">
                                                <BadgeEstado estado={request.estado_actual} />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => navigate(`/ventanilla/solicitud/${request.id}`)}
                                                    className="text-[#4A8BDF] hover:text-[#3875C8] font-medium text-sm"
                                                >
                                                    {request.estado_actual?.toLowerCase() === 'pendiente' ? 'Validar' : 'Ver Detalle'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
