import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../../components/ClientTopbar';
import { useAuth } from '../../context/AuthContext';
import BadgeEstado from '../../components/BadgeEstado';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import useServicesAPI from '../../hooks/useServicesAPI';
import useSortableTable from '../../hooks/useSortableTable';

/**
 * Dashboard principal del Cliente (Home)
 * Muestra resumen de estados y últimas 5 solicitudes
 */
export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const requestsAPI = useRequestsAPI();
  const servicesAPI = useServicesAPI();

  const [allRequests, setAllRequests] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]); // Will be renamed to filteredRequests
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  // Estado para tipos de servicio dinámicos
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  // Estados para filtros
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  // Cargar solicitudes solo una vez al montar
  useEffect(() => {
    const loadRequests = async () => {
      setLoadingRequests(true);
      try {
        const data = await requestsAPI.getUserRequests();

        // El backend responde { ok: true, requests } o directamente un array
        const normalized = Array.isArray(data) ? data : (data?.requests || data?.data || []);
        setAllRequests(normalized);
        setRecentRequests(normalized); // Show all by default
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar tipos de servicio solo una vez al montar
  useEffect(() => {
    const loadServiceTypes = async () => {
      setLoadingServices(true);
      try {
        const types = await servicesAPI.getServiceTypes();
        console.log('Tipos de servicio recibidos:', types);

        setServiceTypes(Array.isArray(types) ? types : (types.data || []));
      } catch (err) {
        console.error('Error cargando tipos de servicio:', err);
        setServiceTypes([]);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServiceTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Business-rule-driven filtering logic (mirroring RequestsFiltered.jsx)
  const applyFilters = useCallback((requests) => {
    let filtered = [...requests];
    // Filtrar por tipo de servicio
    if (filterTipo) {
      filtered = filtered.filter(r => (r.tipo_servicio || '').toLowerCase().includes(filterTipo.toLowerCase()));
    }
    // Filtrar por estado según reglas de negocio
    if (filterEstado) {
      const estado = filterEstado.toLowerCase();
      filtered = filtered.filter(r => {
        const est = (r.estado || r.estado_actual || '').toString().toLowerCase();
        if (estado === 'aprobada') {
          return est.includes('finalizada') || est.includes('autorizada');
        }
        if (estado === 'pendiente') {
          return est.includes('pendiente') || est.includes('borrador') || est.includes('incompleta');
        }
        if (estado === 'enviada') {
          return est.includes('enviada') || est.includes('en proceso') || est.includes('progreso');
        }
        if (estado === 'devuelta') {
          return est.includes('devuelta') || est.includes('rechazada');
        }
        return false;
      });
    }
    setRecentRequests(filtered);
  }, [filterTipo, filterEstado]);

  // Handler para aplicar filtros
  const handleApplyFilters = () => {
    applyFilters(allRequests);
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setFilterTipo('');
    setFilterEstado('');
    setRecentRequests(allRequests);
  };

  // Alternar el menú de creación de solicitudes
  const handleOpenCreateMenu = () => {
    setShowCreateMenu(!showCreateMenu);
  };

  // Estado para mostrar sub-menú de fases
  const [selectedServiceForPhase, setSelectedServiceForPhase] = useState(null);

  // Función para navegar según el tipo de servicio
  const handleSelectService = (serviceName) => {
    // Servicios que requieren selección de fase
    const servicesWithPhases = [
      'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas',
      'Solicitud de Permiso de Importación de Medicamentos con Sustancia Controlada'
    ];

    if (servicesWithPhases.includes(serviceName)) {
      // Mostrar sub-menú de fases
      setSelectedServiceForPhase(serviceName);
      return;
    }

    setShowCreateMenu(false);

    // Mapeo de nombres de servicio a rutas
    const routeMap = {
      'Solicitud de Certificado de Inscripción de Drogas Controladas Clase A': '/solicitud-drogas-clase-a',
      'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados': '/solicitud-drogas-clase-b',
      'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas': '/solicitud-clase-b-capa-c/actividades',
    };

    const route = routeMap[serviceName];
    if (route) {
      navigate(route);
    } else {
      console.error('Ruta no encontrada para el servicio:', serviceName);
    }
  };

  // Función para navegar a una fase específica
  const handleSelectPhase = (phase) => {
    setShowCreateMenu(false);
    setSelectedServiceForPhase(null);

    if (selectedServiceForPhase === 'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas') {
      navigate(phase === 1 ? '/solicitud-importacion-materia-prima' : '/solicitud-importacion-materia-prima/fase-2');
    } else if (selectedServiceForPhase === 'Solicitud de Permiso de Importación de Medicamentos con Sustancia Controlada') {
      navigate(phase === 1 ? '/solicitud-importacion-medicamentos' : '/solicitud-importacion-medicamentos/fase-2');
    }
  };

  // Función para volver al menú principal
  const handleBackToMainMenu = () => {
    setSelectedServiceForPhase(null);
  };

  // Contar solicitudes por estado
  const countByStatus = {
    enviadas: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('enviada')).length,
    aprobadas: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('finalizada') || (r.estado_actual || '').toLowerCase().includes('autorizada') || (r.estado_actual || '').toLowerCase().includes('aprobada dncd')).length,
    devueltas: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('devuelta')).length,
    rechazadas: allRequests.filter(r => r.estado_id === 18 || (r.estado_actual || '').toLowerCase().includes('rechazada_direccion')).length,
    pendientes: allRequests.filter(r => (r.estado_actual || '').toLowerCase().includes('pendiente') || (r.estado_actual || '').toLowerCase().includes('revisión') || (r.estado_actual || '').toLowerCase().includes('evaluación')).length,
  };

  // Hook para ordenamiento de tabla
  const { sortedData, SortableHeader } = useSortableTable(recentRequests, { key: 'id', direction: 'desc' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <ClientTopbar />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado con título y botón crear */}
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
                  // Sub-menú para seleccionar fase
                  <div>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <button
                        onClick={handleBackToMainMenu}
                        className="flex items-center text-sm text-[#4A8BDF] hover:text-[#3875C8]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Volver
                      </button>
                      <div className="text-xs text-gray-600 mt-2">{selectedServiceForPhase}</div>
                    </div>
                    <ul>
                      <li>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 border-b border-gray-100"
                          onClick={() => handleSelectPhase(1)}
                        >
                          <div className="font-medium text-[#4A8BDF]">Fase 01</div>
                          <div className="text-xs text-gray-600 mt-1">Primera fase del proceso</div>
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                          onClick={() => handleSelectPhase(2)}
                        >
                          <div className="font-medium text-[#4A8BDF]">Fase 02</div>
                          <div className="text-xs text-gray-600 mt-1">Segunda fase del proceso</div>
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  // Menú principal de servicios
                  <ul>
                    {serviceTypes.map(type => (
                      <li key={type.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 border-b border-gray-100 last:border-0"
                          onClick={() => handleSelectService(type.nombre_servicio)}
                        >
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

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div
            onClick={() => navigate('/requests/enviadas')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Enviadas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#4A8BDF]">{countByStatus.enviadas}</p>
          </div>

          <div
            onClick={() => navigate('/requests/aprobadas')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Aprobadas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#10B981]">{countByStatus.aprobadas}</p>
          </div>

          <div
            onClick={() => navigate('/requests/devueltas')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Devueltas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#F59E0B]">{countByStatus.devueltas}</p>
          </div>

          <div
            onClick={() => navigate('/requests/rechazadas')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Rechazadas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#EF4444]">{countByStatus.rechazadas}</p>
          </div>

          <div
            onClick={() => navigate('/requests/pendientes')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Pendientes</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#EC4899]">{countByStatus.pendientes}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-end">
            <div className="flex gap-4">
              <div className="relative w-48">
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10 truncate"
                  title={filterTipo || "Todos los tipos"}
                >
                  <option value="">Todos los tipos</option>
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.nombre_servicio}>
                      {type.nombre_servicio}
                    </option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div className="relative">
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10"
                >
                  <option value="">Todos los estados</option>
                  <option value="enviada">Enviada</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="devuelta">Devuelta</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="pendiente">Pendiente</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors"
              >
                Filtrar
              </button>

              {(filterTipo || filterEstado) && (
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de solicitudes - Desktop con barra de desplazamiento */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full">
            <thead className="sticky top-0">
              <tr className="bg-[#4A8BDF]">
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                  <SortableHeader columnKey="id">ID</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                  <SortableHeader columnKey="tipo_servicio">Tipo de Servicio</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                  <SortableHeader columnKey="estado_actual">Estado</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                  <SortableHeader columnKey="fecha_creacion">Fecha Creación</SortableHeader>
                </th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingRequests ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Cargando...</td></tr>
              ) : errorRequests ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-red-500">{errorRequests}</td></tr>
              ) : sortedData.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No tienes solicitudes registradas aún</td></tr>
              ) : (
                sortedData.map(request => (
                  <tr key={request.id} className="hover:bg-gray-100 transition-colors border-b border-gray-100">
                    <td className="px-6 py-5 text-sm text-gray-700 font-medium">#{request.id}</td>
                    <td className="px-6 py-5 text-sm text-gray-700">{request.tipo_servicio || '-'}</td>
                    <td className="px-6 py-5"><BadgeEstado estado={request.estado_actual} /></td>
                    <td className="px-6 py-5 text-sm text-gray-700">{request.fecha_creacion ? new Date(request.fecha_creacion).toLocaleDateString('es-ES') : '-'}</td>
                    <td className="px-6 py-5">
                      <button className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors" onClick={() => navigate(`/requests/${request.id}/details`)}>
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Cards mobile */}
        <div className="md:hidden">
          {loadingRequests ? (
            <div className="text-center py-12 text-gray-500">Cargando...</div>
          ) : errorRequests ? (
            <div className="text-center py-12 text-red-500">{errorRequests}</div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No tienes solicitudes registradas aún</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentRequests.map(request => (
                <div key={request.id} className="bg-white p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-500">ID</span>
                      <span className="font-semibold text-sm text-gray-900">{request.id}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-500">Servicio</span>
                      <span className="text-sm text-gray-700">{request.tipo_servicio}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-500">Estado</span>
                      <span><BadgeEstado estado={request.estado_actual} /></span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-500">Fecha</span>
                      <span className="text-sm text-gray-700">{request.fecha_creacion ? new Date(request.fecha_creacion).toLocaleDateString('es-ES') : '-'}</span>
                    </div>
                    <div className="pt-2">
                      <button className="w-full px-4 py-2 rounded-lg text-xs font-semibold bg-[#4A8BDF] text-white" onClick={() => navigate(`/requests/${request.id}/details`)}>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

