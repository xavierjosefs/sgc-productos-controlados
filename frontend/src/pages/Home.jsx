import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import RequestSummaryCard from '../components/RequestSummaryCard';
import BadgeEstado from '../components/BadgeEstado';
import useRequestsAPI from '../hooks/useRequestsAPI';

/**
 * Dashboard principal del Cliente (Home)
 * Muestra resumen de estados y tabla de solicitudes
 */
export default function Home() {
  const navigate = useNavigate();
  const { getUserRequests, loading } = useRequestsAPI();

  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // Cargar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      setLoadingRequests(true);
      try {
        const data = await getUserRequests();
        setAllRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setAllRequests([]);
        setFilteredRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };
    loadRequests();
  }, []);

  // Contar solicitudes por estado
  const countByStatus = {
    enviadas: allRequests.filter(r => r.estado === 'enviada').length,
    aprobadas: allRequests.filter(r => r.estado === 'aprobada').length,
    devueltas: allRequests.filter(r => r.estado === 'devuelta').length,
    pendientes: allRequests.filter(r => r.estado === 'pendiente').length,
  };

  // Filtrar solicitudes
  const handleStatusFilter = (status) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  // Manejar creación de solicitud
  const handleCreateRequest = (tipoServicio) => {
    setShowCreateMenu(false);
    // Navegar a la pantalla de creación con el tipo de servicio
    navigate(`/requests/create?tipo=${encodeURIComponent(tipoServicio)}`);
  };

  useEffect(() => {
    let filtered = allRequests;

    if (selectedStatus) {
      filtered = filtered.filter(r => r.estado === selectedStatus);
    }

    if (typeFilter) {
      filtered = filtered.filter(r => r.tipo_servicio.includes(typeFilter));
    }

    setFilteredRequests(filtered);
  }, [selectedStatus, typeFilter, allRequests]);

  // Obtener tipos de servicios únicos
  const serviceTypes = [...new Set(allRequests.map(r => r.tipo_servicio))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <ClientTopbar />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="px-6 py-2 bg-[#4A8BDF] text-white rounded-lg font-semibold hover:bg-[#3875C8] transition-colors flex items-center gap-2"
            >
              Crear Solicitud
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button
                  onClick={() => handleCreateRequest('Permiso de Construcción')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Permiso de Construcción
                </button>
                <button
                  onClick={() => handleCreateRequest('Licencia de Funcionamiento')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Licencia de Funcionamiento
                </button>
                <button
                  onClick={() => handleCreateRequest('Certificado')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                >
                  Certificado
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <RequestSummaryCard
            title="Enviadas"
            count={countByStatus.enviadas}
            color="#4A8BDF"
            onClick={() => handleStatusFilter('enviada')}
          />
          <RequestSummaryCard
            title="Aprobadas"
            count={countByStatus.aprobadas}
            color="#10B981"
            onClick={() => handleStatusFilter('aprobada')}
          />
          <RequestSummaryCard
            title="Devueltas"
            count={countByStatus.devueltas}
            color="#F59E0B"
            onClick={() => handleStatusFilter('devuelta')}
          />
          <RequestSummaryCard
            title="Pendientes"
            count={countByStatus.pendientes}
            color="#EC4899"
            onClick={() => handleStatusFilter('pendiente')}
          />
        </div>

        {/* Tabla de solicitudes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Filtros */}
          <div className="flex items-center justify-end gap-4 mb-6">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] min-w-[200px]"
            >
              <option value="">Tipo</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] min-w-[200px]"
            >
              <option value="">Estado</option>
              <option value="enviada">Enviada</option>
              <option value="aprobada">Aprobada</option>
              <option value="devuelta">Devuelta</option>
              <option value="pendiente">Pendiente</option>
            </select>
            <button
              className="px-6 py-2 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064073] transition-colors"
            >
              Filtrar
            </button>
          </div>

          {/* Tabla - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#4A8BDF] text-white">
                  <th className="px-4 py-3 text-left font-semibold">CÓDIGO</th>
                  <th className="px-4 py-3 text-left font-semibold">FECHA CREACIÓN</th>
                  <th className="px-4 py-3 text-left font-semibold">TIPO DE SERVICIO</th>
                  <th className="px-4 py-3 text-left font-semibold">ESTADO</th>
                  <th className="px-4 py-3 text-left font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {loadingRequests ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No tienes solicitudes registradas
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-700">{request.codigo}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {new Date(request.fecha_creacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{request.tipo_servicio}</td>
                      <td className="px-4 py-4">
                        <BadgeEstado estado={request.estado} />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => navigate(`/requests/${request.id}`)}
                          className="text-[#4A8BDF] font-semibold text-sm hover:text-[#3875C8] transition-colors"
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

          {/* Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {loadingRequests ? (
              <div className="text-center py-8 text-gray-500">Cargando solicitudes...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No tienes solicitudes registradas</div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-gray-900">{request.codigo}</span>
                    <BadgeEstado estado={request.estado} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.tipo_servicio}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(request.fecha_creacion).toLocaleDateString('es-ES')}
                  </p>
                  <button
                    onClick={() => navigate(`/requests/${request.id}`)}
                    className="text-[#4A8BDF] font-semibold text-sm hover:text-[#3875C8] transition-colors"
                  >
                    Ver Detalle
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
