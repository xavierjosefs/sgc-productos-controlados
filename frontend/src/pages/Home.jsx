import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import RequestSummaryCard from '../components/RequestSummaryCard';
import BadgeEstado from '../components/BadgeEstado';
import useRequestsAPI from '../hooks/useRequestsAPI';
import useServicesAPI from '../hooks/useServicesAPI';

/**
 * Dashboard principal del Cliente (Home)
 * Muestra resumen de estados y ├║ltimas 5 solicitudes
 */
export default function Home() {
  const navigate = useNavigate();
  const { getUserRequests } = useRequestsAPI();
  
  const [allRequests, setAllRequests] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [errorRequests, setErrorRequests] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  // Estado para tipos de servicio din├ímicos
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errorServices, setErrorServices] = useState('');
  // Estados para filtros
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  // Cargar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      setLoadingRequests(true);
      try {
        const data = await getUserRequests();
        // El backend responde { ok: true, requests } o directamente un array
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
  }, [getUserRequests]);

  // Aplicar filtros a las solicitudes
  const applyFilters = useCallback((requests) => {
    let filtered = [...requests];
    
    // Filtrar por tipo de servicio
    if (filterTipo) {
      filtered = filtered.filter(r => 
        (r.tipo_servicio || '').toLowerCase().includes(filterTipo.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (filterEstado) {
      filtered = filtered.filter(r => 
        (r.estado || r.estado_actual || '').toLowerCase() === filterEstado.toLowerCase()
      );
    }
    
    // Mostrar solo las ├║ltimas 5 solicitudes filtradas
    setRecentRequests(filtered.slice(0, 5));
  }, [filterTipo, filterEstado]);

  // Handler para aplicar filtros
  const handleApplyFilters = () => {
    applyFilters(allRequests);
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setFilterTipo('');
    setFilterEstado('');
    setRecentRequests(allRequests.slice(0, 5));
  };

  // Cargar tipos de servicio din├ímicos cuando se abre el men├║
  const { getServiceTypes } = useServicesAPI();
  const handleOpenCreateMenu = async () => {
    setShowCreateMenu(!showCreateMenu);
    if (!showCreateMenu && serviceTypes.length === 0) {
      setLoadingServices(true);
      setErrorServices('');
      try {
        const types = await getServiceTypes();
        // Asegurar estructura: si la API devuelve { data: [...] } o [...]
        setServiceTypes(Array.isArray(types) ? types : (types.data || []));
      } catch (err) {
        console.error('Error cargando tipos de servicio:', err);
        setErrorServices(err.message || 'Error al cargar tipos de servicio');
      } finally {
        setLoadingServices(false);
      }
    }
  };

  // Contar solicitudes por estado
  const countByStatus = {
    enviadas: allRequests.filter(r => (r.estado || '').toLowerCase() === 'enviada').length,
    aprobadas: allRequests.filter(r => (r.estado || '').toLowerCase() === 'aprobada').length,
    devueltas: allRequests.filter(r => (r.estado || '').toLowerCase() === 'devuelta').length,
    pendientes: allRequests.filter(r => (r.estado || '').toLowerCase() === 'pendiente').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <ClientTopbar />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado con t├¡tulo y bot├│n crear */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
          
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {loadingServices ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Cargando tipos de servicio...</div>
                ) : errorServices ? (
                  <div className="px-4 py-3 text-sm text-red-500">{errorServices}</div>
                ) : serviceTypes.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Los tipos de servicio se cargar├ín desde el backend</div>
                ) : (
                  <ul>
                    {serviceTypes.map(type => (
                      <li key={type.id}>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => {/* navegar al flujo correspondiente */}}>
                          {type.nombre}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => navigate('/requests/estado/enviadas')}
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
            onClick={() => navigate('/requests/estado/aprobadas')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Aprobadas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#10B981]">{countByStatus.aprobadas}</p>
          </div>

          <div 
            onClick={() => navigate('/requests/estado/devueltas')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Devueltas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#F59E0B]">{countByStatus.devueltas}</p>
          </div>

          <div 
            onClick={() => navigate('/requests/estado/pendientes')}
            className="bg-white rounded-xl border border-gray-200 p-6 relative cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Pendientes</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#EC4899]">{countByStatus.pendientes}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-end">
            <div className="flex gap-4">
              <div className="relative">
                <select 
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10"
                >
                  <option value="">Todos los tipos</option>
                  {/* Los tipos se mostrar├ín din├ímicamente cuando el backend implemente el endpoint */}
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

        {/* Tabla de solicitudes - Desktop */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#4A8BDF]">
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">ID</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Tipo de Servicio</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Estado</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Fecha Creaci├│n</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingRequests ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Cargando...</td></tr>
              ) : errorRequests ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-red-500">{errorRequests}</td></tr>
              ) : recentRequests.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No tienes solicitudes registradas a├║n</td></tr>
              ) : (
                recentRequests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700">{request.id}</td>
                    <td className="px-6 py-5 text-sm text-gray-700">{request.tipo_servicio}</td>
                    <td className="px-6 py-5"><BadgeEstado estado={request.estado} /></td>
                    <td className="px-6 py-5 text-sm text-gray-700">{request.fecha_creacion ? new Date(request.fecha_creacion).toLocaleDateString('es-ES') : '-'}</td>
                    <td className="px-6 py-5">
                      <button className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg" onClick={() => navigate(`/requests/${request.id}`)}>
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
            <div className="text-center py-12 text-gray-500">No tienes solicitudes registradas a├║n</div>
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
                      <span><BadgeEstado estado={request.estado} /></span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-gray-500">Fecha</span>
                      <span className="text-sm text-gray-700">{request.fecha_creacion ? new Date(request.fecha_creacion).toLocaleDateString('es-ES') : '-'}</span>
                    </div>
                    <div className="pt-2">
                      <button className="w-full px-4 py-2 rounded-lg text-xs font-semibold bg-[#4A8BDF] text-white" onClick={() => navigate(`/requests/${request.id}`)}>
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
