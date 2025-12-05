import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import BadgeEstado from '../components/BadgeEstado';
import useRequestsAPI from '../hooks/useRequestsAPI';
import useServicesAPI from '../hooks/useServicesAPI';

/**
 * Página de solicitudes filtradas por estado
 */
export default function RequestsFiltered() {
  const { status } = useParams();
  const navigate = useNavigate();
  const { getUserRequests } = useRequestsAPI();
  const servicesAPI = useServicesAPI();
  
  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterTipo, setFilterTipo] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Mapeo de nombres de estados con colores
  const statusConfig = {
    enviadas: { name: 'Enviadas', color: '#4A8BDF' },
    aprobadas: { name: 'Aprobadas', color: '#10B981' },
    devueltas: { name: 'Devueltas', color: '#F59E0B' },
    pendientes: { name: 'Pendientes', color: '#EC4899' }
  };

  const currentStatus = statusConfig[status] || statusConfig.enviadas;

  // Cargar tipos de servicio
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

  // Cargar y filtrar solicitudes por estado
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const data = await getUserRequests();
        const normalized = Array.isArray(data) ? data : (data?.requests || data?.data || []);
        
        // Filtrar según el estado solicitado
        const filtered = normalized.filter(r => {
          const s = (r.estado || r.estado_actual || '').toString().toLowerCase();
          
          switch (status) {
            case 'enviadas':
              return s.includes('enviada');
            case 'aprobadas':
              return s.includes('finalizada') || s.includes('autorizada') || s.includes('aprobada');
            case 'devueltas':
              return s.includes('devuelta') || s.includes('rechazada');
            case 'pendientes':
              return s.includes('pendiente') || s.includes('revisión') || s.includes('evaluación');
            default:
              return false;
          }
        });
        
        setAllRequests(filtered);
        setFilteredRequests(filtered);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setAllRequests([]);
        setFilteredRequests([]);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [status, getUserRequests]);

  // Aplicar filtro adicional por tipo
  const handleApplyFilter = () => {
    if (!filterTipo) {
      setFilteredRequests(allRequests);
      return;
    }
    const filtered = allRequests.filter(r => 
      (r.tipo_servicio || '').toLowerCase().includes(filterTipo.toLowerCase())
    );
    setFilteredRequests(filtered);
  };

  // Resetear filtro
  const handleResetFilter = () => {
    setFilterTipo('');
    setFilteredRequests(allRequests);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado con flecha y título */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-[#4A8BDF] hover:text-[#3875C8] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
        </div>

        {/* Card único del estado filtrado */}
        <div className="mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 inline-block min-w-[280px]">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">{currentStatus.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold" style={{ color: currentStatus.color }}>{filteredRequests.length}</p>
          </div>
        </div>

        {/* Filtro y tabla */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Filtro de Tipo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-end items-center gap-4">
              <div className="relative w-48">
                <select 
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10 truncate"
                  title={filterTipo || "Todos los tipos"}
                  disabled={loadingServices}
                >
                  <option value="">Todos los tipos</option>
                  {serviceTypes.map((service) => (
                    <option key={service.id} value={service.nombre_servicio}>
                      {service.nombre_servicio}
                    </option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <button 
                onClick={handleApplyFilter}
                className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors"
              >
                Filtrar
              </button>
              {filterTipo && (
                <button 
                  onClick={handleResetFilter}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Tabla - Desktop */}
          <div className="hidden md:block overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#4A8BDF]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">ID</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">FECHA CREACIÓN</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">TIPO DE SERVICIO</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No hay solicitudes con este estado
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => (
                    <tr 
                      key={request.id} 
                      className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-5 text-sm text-gray-700">{request.id}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {new Date(request.fecha_creacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">{request.tipo_servicio}</td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => navigate(`/requests/${request.id}/details`)}
                          className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg hover:bg-[#3875C8] transition-colors text-sm font-medium"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Cargando solicitudes...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No hay solicitudes con este estado</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRequests.map((request, index) => (
                  <div 
                    key={request.id} 
                    className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'} p-4`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-500">ID</span>
                        <span className="font-semibold text-sm text-gray-900">{request.id}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-500">Fecha</span>
                        <span className="text-sm text-gray-700">
                          {new Date(request.fecha_creacion).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-500">Servicio</span>
                        <span className="text-sm text-gray-700 text-right">{request.tipo_servicio}</span>
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => navigate(`/requests/${request.id}/details`)}
                          className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-[#4A8BDF] text-white hover:bg-[#3875C8] transition-colors"
                        >
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
    </div>
  );
}
