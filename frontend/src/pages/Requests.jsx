import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import RequestSummaryCard from '../components/RequestSummaryCard';
import BadgeEstado from '../components/BadgeEstado';
import useRequestsAPI from '../hooks/useRequestsAPI';

/**
 * Pantalla principal de Solicitudes del Cliente
 * Muestra resumen de estados y tabla de solicitudes
 */
export default function Requests() {
  const navigate = useNavigate();
  const { getUserRequests, loading } = useRequestsAPI();

  const [allRequests, setAllRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Datos de ejemplo (será reemplazado por datos de API)
  const mockRequests = [
    { id: 1, codigo: 'SOL-001', fecha_creacion: '2024-11-20', tipo_servicio: 'Permiso de Construcción', estado: 'enviada' },
    { id: 2, codigo: 'SOL-002', fecha_creacion: '2024-11-18', tipo_servicio: 'Licencia de Funcionamiento', estado: 'aprobada' },
    { id: 3, codigo: 'SOL-003', fecha_creacion: '2024-11-15', tipo_servicio: 'Permiso de Construcción', estado: 'devuelta' },
    { id: 4, codigo: 'SOL-004', fecha_creacion: '2024-11-10', tipo_servicio: 'Certificado', estado: 'pendiente' },
    { id: 5, codigo: 'SOL-005', fecha_creacion: '2024-11-08', tipo_servicio: 'Licencia de Funcionamiento', estado: 'aprobada' },
  ];

  // Cargar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      setLoadingRequests(true);
      try {
        // Por ahora usar datos mock, después será: await getUserRequests()
        setAllRequests(mockRequests);
        setFilteredRequests(mockRequests);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
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
          <button
            onClick={() => navigate('/requests/create')}
            className="px-6 py-2 bg-[#4A8BDF] text-white rounded-lg font-semibold hover:bg-[#3875C8] transition-colors"
          >
            Crear Solicitud
          </button>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <RequestSummaryCard
            title="Enviadas"
            count={countByStatus.enviadas}
            color="#4A8BDF"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M2.25 2.25a.75.75 0 000 1.5h.006l.231 4.171A2.25 2.25 0 005.666 9.75h12.668c1.012 0 1.925.516 2.452 1.299l.879 1.464c.236.392.645.643 1.11.643h1.675a.75.75 0 000-1.5H21.9c.082-.089.157-.185.225-.288l.879-1.464A3.75 3.75 0 0018.334 8.25H5.666a.75.75 0 01-.75-.75L4.935 2.75H2.25z" />
              </svg>
            }
            onClick={() => handleStatusFilter('enviada')}
          />
          <RequestSummaryCard
            title="Aprobadas"
            count={countByStatus.aprobadas}
            color="#10B981"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-green-500">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.060.03l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            }
            onClick={() => handleStatusFilter('aprobada')}
          />
          <RequestSummaryCard
            title="Devueltas"
            count={countByStatus.devueltas}
            color="#F59E0B"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-orange-500">
                <path fillRule="evenodd" d="M9.401 3.003c1.492-2.004 4.716-2.004 6.208 0l5.724 7.684c1.348 1.811.216 4.5-1.75 5.078L12 20.348l-7.583-4.583c-1.966-.578-3.098-3.267-1.75-5.078L9.401 3.003z" clipRule="evenodd" />
              </svg>
            }
            onClick={() => handleStatusFilter('devuelta')}
          />
          <RequestSummaryCard
            title="Pendientes"
            count={countByStatus.pendientes}
            color="#EC4899"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-pink-500">
                <path fillRule="evenodd" d="M2.25 12c0-6.215 5.785-11.25 12-11.25s12 5.035 12 11.25S19.215 23.25 12 23.25s-12-5.035-12-11.25zm8.695-6.905a.75.75 0 00-1.06 1.061L10.939 12l-1.045 1.044a.75.75 0 101.06 1.061L12 13.061l1.044 1.045a.75.75 0 101.061-1.06L13.061 12l1.045-1.044a.75.75 0 10-1.06-1.061L12 10.939l-1.044-1.045z" clipRule="evenodd" />
              </svg>
            }
            onClick={() => handleStatusFilter('pendiente')}
          />
        </div>

        {/* Tabla de solicitudes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Filtros */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
              >
                <option value="">Tipo de Servicio</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
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
                  <th className="px-4 py-3 text-left font-semibold">ACCIÓN</th>
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
                      No hay solicitudes que coincidan con los filtros
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{request.codigo}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(request.fecha_creacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{request.tipo_servicio}</td>
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
            {filteredRequests.map((request) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
