import ClientTopbar from '../../components/ClientTopbar';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import useServicesAPI from '../../hooks/useServicesAPI';
import BadgeEstado from '../../components/BadgeEstado';

/**
 * Dashboard del Cliente
 * Muestra solicitudes del usuario y permite crear nuevas
 */
export default function ClienteDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const requestsAPI = useRequestsAPI();
    const servicesAPI = useServicesAPI();

    const [allRequests, setAllRequests] = useState([]);
    const [recentRequests, setRecentRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [errorRequests, setErrorRequests] = useState('');
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loadingServices, setLoadingServices] = useState(false);
    const [filterTipo, setFilterTipo] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [selectedServiceForPhase, setSelectedServiceForPhase] = useState(null);

    // Cargar solicitudes
    useEffect(() => {
        const loadRequests = async () => {
            setLoadingRequests(true);
            try {
                const data = await requestsAPI.getUserRequests();
                const normalized = Array.isArray(data) ? data : (data?.requests || data?.data || []);
                setAllRequests(normalized);
                setRecentRequests(normalized.slice(0, 5));
                setErrorRequests('');
            } catch (error) {
                console.error('Error al cargar solicitudes:', error);
                setAllRequests([]);
                setRecentRequests([]);
                setErrorRequests(error?.message || 'Error al cargar solicitudes');
            } finally {
                setLoadingRequests(false);
            }
        };
        loadRequests();
    }, []);

    // Cargar tipos de servicio
    useEffect(() => {
        const loadServiceTypes = async () => {
            setLoadingServices(true);
            try {
                const types = await servicesAPI.getServiceTypes();
                setServiceTypes(Array.isArray(types) ? types : (types.data || []));
            } catch (err) {
                console.error('Error cargando tipos de servicio:', err);
                setServiceTypes([]);
            } finally {
                setLoadingServices(false);
            }
        };
        loadServiceTypes();
    }, []);

    // Filtros
    const applyFilters = useCallback((requests) => {
        let filtered = [...requests];
        if (filterTipo) {
            filtered = filtered.filter(r => (r.tipo_servicio || '').toLowerCase().includes(filterTipo.toLowerCase()));
        }
        if (filterEstado) {
            filtered = filtered.filter(r => (r.estado || r.estado_actual || '').toLowerCase() === filterEstado.toLowerCase());
        }
        setRecentRequests(filtered.slice(0, 5));
    }, [filterTipo, filterEstado]);

    const handleApplyFilters = () => applyFilters(allRequests);
    const handleResetFilters = () => {
        setFilterTipo('');
        setFilterEstado('');
        setRecentRequests(allRequests.slice(0, 5));
    };

    // Menú de creación
    const handleOpenCreateMenu = () => setShowCreateMenu(!showCreateMenu);

    const handleSelectService = (serviceName) => {
        const servicesWithPhases = [
            'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas',
            'Solicitud de Permiso de Importación de Medicamentos con Sustancia Controlada'
        ];

        if (servicesWithPhases.includes(serviceName)) {
            setSelectedServiceForPhase(serviceName);
            return;
        }

        setShowCreateMenu(false);
        const routeMap = {
            'Solicitud de Certificado de Inscripción de Drogas Controladas Clase A': '/solicitud-drogas-clase-a',
            'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados': '/solicitud-drogas-clase-b',
            'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas': '/solicitud-clase-b-capa-c/actividades',
        };

        const route = routeMap[serviceName];
        if (route) navigate(route);
    };

    const handleSelectPhase = (phase) => {
        setShowCreateMenu(false);
        setSelectedServiceForPhase(null);

        if (selectedServiceForPhase === 'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas') {
            navigate(phase === 1 ? '/solicitud-importacion-materia-prima' : '/solicitud-importacion-materia-prima/fase-2');
        } else if (selectedServiceForPhase === 'Solicitud de Permiso de Importación de Medicamentos con Sustancia Controlada') {
            navigate(phase === 1 ? '/solicitud-importacion-medicamentos' : '/solicitud-importacion-medicamentos/fase-2');
        }
    };

    const handleBackToMainMenu = () => setSelectedServiceForPhase(null);

    // Contadores
    const countByStatus = {
        enviadas: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('enviada')).length,
        aprobadas: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('finalizada') || (r.estado_actual || '').toLowerCase().includes('autorizada')).length,
        devueltas: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('devuelta') || (r.estado_actual || '').toLowerCase().includes('rechazada')).length,
        pendientes: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('pendiente') || (r.estado_actual || '').toLowerCase().includes('revisión') || (r.estado_actual || '').toLowerCase().includes('evaluación')).length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientTopbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
                        <p className="text-gray-600 mt-1">Bienvenido, {user?.full_name || 'Cliente'}</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={handleOpenCreateMenu}
                            className="px-6 py-2.5 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors flex items-center gap-2"
                        >
                            Crear Solicitud
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                        {showCreateMenu && (
                            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                {loadingServices ? (
                                    <div className="px-4 py-3 text-sm text-gray-500">Cargando tipos de servicio...</div>
                                ) : serviceTypes.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-gray-500">No hay tipos de servicio disponibles</div>
                                ) : selectedServiceForPhase ? (
                                    <div>
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <button onClick={handleBackToMainMenu} className="flex items-center text-sm text-[#4A8BDF] hover:text-[#3875C8]">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                                Volver
                                            </button>
                                            <div className="text-xs text-gray-600 mt-2">{selectedServiceForPhase}</div>
                                        </div>
                                        <ul>
                                            <li>
                                                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 border-b border-gray-100" onClick={() => handleSelectPhase(1)}>
                                                    <div className="font-medium text-[#4A8BDF]">Fase 01</div>
                                                    <div className="text-xs text-gray-600 mt-1">Primera fase del proceso</div>
                                                </button>
                                            </li>
                                            <li>
                                                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700" onClick={() => handleSelectPhase(2)}>
                                                    <div className="font-medium text-[#4A8BDF]">Fase 02</div>
                                                    <div className="text-xs text-gray-600 mt-1">Segunda fase del proceso</div>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                ) : (
                                    <ul>
                                        {serviceTypes.map(type => (
                                            <li key={type.id}>
                                                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 border-b border-gray-100 last:border-0" onClick={() => handleSelectService(type.nombre_servicio)}>
                                                    <div className="text-sm text-gray-800">{type.nombre_servicio}</div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div onClick={() => navigate('/requests/enviadas')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Enviadas</span>
                        </div>
                        <p className="text-4xl font-bold text-[#4A8BDF]">{countByStatus.enviadas}</p>
                    </div>
                    <div onClick={() => navigate('/requests/aprobadas')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Aprobadas</span>
                        </div>
                        <p className="text-4xl font-bold text-[#10B981]">{countByStatus.aprobadas}</p>
                    </div>
                    <div onClick={() => navigate('/requests/devueltas')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Devueltas</span>
                        </div>
                        <p className="text-4xl font-bold text-[#F59E0B]">{countByStatus.devueltas}</p>
                    </div>
                    <div onClick={() => navigate('/requests/pendientes')} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Pendientes</span>
                        </div>
                        <p className="text-4xl font-bold text-[#EC4899]">{countByStatus.pendientes}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-end">
                        <div className="flex gap-4">
                            <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]">
                                <option value="">Todos los tipos</option>
                                {serviceTypes.map(type => (
                                    <option key={type.id} value={type.nombre_servicio}>{type.nombre_servicio}</option>
                                ))}
                            </select>
                            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]">
                                <option value="">Todos los estados</option>
                                <option value="enviada">Enviada</option>
                                <option value="aprobada">Aprobada</option>
                                <option value="devuelta">Devuelta</option>
                                <option value="pendiente">Pendiente</option>
                            </select>
                            <button onClick={handleApplyFilters} className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors">Filtrar</button>
                            {(filterTipo || filterEstado) && (
                                <button onClick={handleResetFilters} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">Limpiar</button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#4A8BDF]">
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">ID</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Tipo de Servicio</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Estado</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Fecha Creación</th>
                                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingRequests ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Cargando...</td></tr>
                            ) : errorRequests ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-red-500">{errorRequests}</td></tr>
                            ) : recentRequests.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No tienes solicitudes registradas aún</td></tr>
                            ) : (
                                recentRequests.map(request => (
                                    <tr key={request.id} className="hover:bg-gray-100 transition-colors">
                                        <td className="px-6 py-5 text-sm text-gray-700">{request.id}</td>
                                        <td className="px-6 py-5 text-sm text-gray-700">{request.tipo_servicio || '-'}</td>
                                        <td className="px-6 py-5"><BadgeEstado estado={request.estado_actual} /></td>
                                        <td className="px-6 py-5 text-sm text-gray-700">{request.fecha_creacion ? new Date(request.fecha_creacion).toLocaleDateString('es-ES') : '-'}</td>
                                        <td className="px-6 py-5">
                                            <button className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg" onClick={() => navigate(`/requests/${request.id}/details`)}>Ver detalles</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
