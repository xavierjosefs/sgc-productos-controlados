import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeEstado from '../../components/BadgeEstado';
import { useRequestsAPI } from '../../hooks/useRequestsAPI';
import useServicesAPI from '../../hooks/useServicesAPI';

/**
 * VentanillaSolicitudes
 * Listado y filtros de solicitudes para el rol Ventanilla
 */
export default function VentanillaSolicitudes() {
    const navigate = useNavigate();
    const { getVentanillaRequests, loading, error } = useRequestsAPI();
    const { getServiceTypes } = useServicesAPI();
    const [requests, setRequests] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [filterTipo, setFilterTipo] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [appliedFilterTipo, setAppliedFilterTipo] = useState('');
    const [appliedFilterEstado, setAppliedFilterEstado] = useState('');
    const [activeCard, setActiveCard] = useState('all'); // 'all', 'pendientes', 'aprobadas', 'devueltas'

    // Cargar solicitudes y tipos de servicio al montar el componente
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

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const types = await getServiceTypes();
                setServiceTypes(types || []);
            } catch {
                setServiceTypes([]);
            }
        };
        fetchServiceTypes();
    }, [getServiceTypes]);

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

    // Calcular contadores - Pendientes son las "Enviadas" por el cliente
    const pendientesCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'enviada'
    ).length;
    
    // Aprobadas son las que pasaron validación de VUS
    const aprobadasCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'en evaluación técnica'
    ).length;
    
    // Devueltas por VUS
    const devueltasCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'devuelta por vus'
    ).length;

    // Filtrar solicitudes con useMemo para evitar cascadas
    const filteredRequests = useMemo(() => {
        let filtered = [...requests];

        // Filtro por card clickeada
        if (activeCard === 'pendientes') {
            // Mostrar solo las "Enviadas" que están esperando revisión
            filtered = filtered.filter(r => 
                r.estado_actual?.toLowerCase() === 'enviada'
            );
        } else if (activeCard === 'aprobadas') {
            // Mostrar las que pasaron validación de VUS
            filtered = filtered.filter(r => 
                r.estado_actual?.toLowerCase() === 'en evaluación técnica'
            );
        } else if (activeCard === 'devueltas') {
            // Mostrar las devueltas por VUS
            filtered = filtered.filter(r => 
                r.estado_actual?.toLowerCase() === 'devuelta por vus'
            );
        }

        // Filtro por tipo (solo se aplica después de hacer clic en Filtrar)
        if (appliedFilterTipo) {
            filtered = filtered.filter(r => r.tipo_servicio && r.tipo_servicio.toLowerCase().includes(appliedFilterTipo.toLowerCase()));
        }

        // Filtro por estado (solo se aplica después de hacer clic en Filtrar)
        if (appliedFilterEstado) {
            filtered = filtered.filter(r => r.estado_actual && r.estado_actual.toLowerCase() === appliedFilterEstado.toLowerCase());
        }

        return filtered;
    }, [activeCard, appliedFilterTipo, appliedFilterEstado, requests]);

    // Manejar click en card
    const handleCardClick = (cardType) => {
        setActiveCard(cardType);
        setAppliedFilterEstado(''); // Limpiar filtro aplicado de estado cuando se clickea una card
    };

    // Manejar click en botón Filtrar
    const handleFilter = () => {
        setAppliedFilterTipo(filterTipo);
        setAppliedFilterEstado(filterEstado);
    };

    // Manejar click en botón Limpiar
    const handleClear = () => {
        setActiveCard('all');
        setFilterTipo('');
        setFilterEstado('');
        setAppliedFilterTipo('');
        setAppliedFilterEstado('');
    };

    return (
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
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.5 2.5H17.5V7.5" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8.33398 11.6667L17.5007 2.5" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <p className="text-5xl font-bold text-[#4A8BDF]">{pendientesCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Nuevas solicitudes enviadas</p>
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
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.5 2.5H17.5V7.5" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8.33398 11.6667L17.5007 2.5" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <p className="text-5xl font-bold text-green-600">{aprobadasCount}</p>
                    <p className="text-xs text-gray-500 mt-2">Pasaron validación de VUS</p>
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
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.5 2.5H17.5V7.5" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8.33398 11.6667L17.5007 2.5" stroke="#085297" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                            {serviceTypes.map((tipo) => (
                                <option key={tipo.id} value={tipo.nombre_servicio}>{tipo.nombre_servicio}</option>
                            ))}
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
                            <option value="enviada">Enviada (Pendiente)</option>
                            <option value="en revisión por vus">En Revisión</option>
                            <option value="devuelta por vus">Devuelta</option>
                            <option value="en evaluación técnica">Aprobada por VUS</option>
                        </select>
                    </div>

                    <button
                        onClick={handleFilter}
                        className="px-8 py-3 bg-[#085297] text-white rounded-lg hover:bg-[#064073] transition-colors font-medium"
                    >
                        Filtrar
                    </button>

                    {(activeCard !== 'all' || appliedFilterTipo || appliedFilterEstado) && (
                        <button
                            onClick={handleClear}
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
                        {activeCard === 'pendientes' ? 'Solicitudes Enviadas (Pendientes de Revisión)' :
                         activeCard === 'aprobadas' ? 'Solicitudes Aprobadas por VUS' :
                         activeCard === 'devueltas' ? 'Solicitudes Devueltas por VUS' :
                         'Todas las Solicitudes'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {activeCard === 'pendientes' ? 'Solicitudes enviadas por clientes que esperan validación de Ventanilla' :
                         activeCard === 'aprobadas' ? 'Solicitudes que pasaron la validación formal y están en evaluación técnica' :
                         activeCard === 'devueltas' ? 'Solicitudes devueltas al cliente por no cumplir requisitos formales' :
                         'Vista general de todas las solicitudes gestionadas por Ventanilla'}
                    </p>
                </div>

                {loading ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                        Cargando solicitudes...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div style={{ maxHeight: '400px', overflowY: filteredRequests.length > 5 ? 'auto' : 'visible' }}>
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
                                filteredRequests.map((request) => {
                                    const isDevuelta = request.estado_actual?.toLowerCase() === 'devuelta por vus';
                                    const isEnviada = request.estado_actual?.toLowerCase() === 'enviada';
                                    
                                    return (
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
                                                {isDevuelta ? (
                                                    <span 
                                                        className="text-gray-400 font-medium text-sm cursor-not-allowed"
                                                        title="Esta solicitud está en manos del cliente para corrección"
                                                    >
                                                        En corrección
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => navigate(`/ventanilla/solicitud/${request.id}`)}
                                                        className="text-[#4A8BDF] hover:text-[#3875C8] font-medium text-sm"
                                                    >
                                                        {isEnviada ? 'Validar' : 'Ver Detalle'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
