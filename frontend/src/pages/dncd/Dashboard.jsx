import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import DncdTopbar from '../../components/DncdTopbar';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import useSortableTable from '../../hooks/useSortableTable';

/**
 * DncdDashboard
 * Dashboard principal de DNCD - muestra solicitudes aprobadas y rechazadas por Dirección
 */
export default function DncdDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [appliedTipo, setAppliedTipo] = useState('');
  const [appliedEstado, setAppliedEstado] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  const { getDncdRequests, approveDncdRequest } = useRequestsAPI();

  // Tipos de servicio dinámicos según las solicitudes cargadas
  const tiposServicio = Array.from(new Set(requests.map(r => r.tipo_servicio).filter(Boolean)));

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await getDncdRequests();
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
  }, [getDncdRequests]);

  // Filtrar solicitudes según filtros aplicados
  const filteredRequests = requests.filter(request => {
    if (appliedTipo && !request.tipo_servicio?.toLowerCase().includes(appliedTipo.toLowerCase())) {
      return false;
    }
    if (appliedEstado) {
      // Estado 8: Pendiente DNCD
      // Estado 10: Aprobada
      // Estado 18: Rechazada
      if (appliedEstado === 'pendiente' && request.estado_id !== 8) {
        return false;
      }
      if (appliedEstado === 'aprobada' && request.estado_id !== 10) {
        return false;
      }
      if (appliedEstado === 'rechazada' && request.estado_id !== 18) {
        return false;
      }
    }
    return true;
  });

  // Calcular contadores
  // Estado 8: Pendientes (aprobadas por Dirección, pendientes DNCD)
  // Estado 10: Aprobadas (aprobadas por DNCD)
  // Estado 18: Rechazadas
  const pendientesCount = requests.filter(r => r.estado_id === 8).length;
  const aprobadasCount = requests.filter(r => r.estado_id === 10).length;
  const rechazadasCount = requests.filter(r => r.estado_id === 18).length;

  const handleFilter = () => {
    setAppliedTipo(filterTipo);
    setAppliedEstado(filterEstado);
  };

  const handleClearFilters = () => {
    setFilterTipo('');
    setFilterEstado('');
    setAppliedTipo('');
    setAppliedEstado('');
  };

  const handleCardFilter = (estado) => {
    setFilterEstado(estado);
    setAppliedEstado(estado);
  };

  // Hook para ordenamiento de tabla
  const { sortedData, SortableHeader } = useSortableTable(filteredRequests, { key: 'id', direction: 'desc' });

  const handleVerDetalle = (id) => {
    navigate(`/dncd/solicitud/${id}`);
  };

  const verCertificado = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8000/api/dncd/certificate/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      alert('No autorizado para ver el certificado');
      return;
    }

    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  };

  const handleApprove = async (id) => {
    if (approvingId) return;
    setApprovingId(id);
    try {
      const result = await approveDncdRequest(id);
      if (result.ok) {
        alert('Solicitud aprobada y certificado enviado al cliente');
        // Refresh the list
        const data = await getDncdRequests();
        if (data?.ok && data.requests) {
          setRequests(data.requests);
        }
      }
    } catch (error) {
      alert(error.message || 'Error al aprobar la solicitud');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DncdTopbar />
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
              <thead className="sticky top-0">
                <tr className="bg-[#4A8BDF]">
                  <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">
                    <SortableHeader columnKey="id">Código</SortableHeader>
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">
                    <SortableHeader columnKey="fecha_creacion">Fecha Creación</SortableHeader>
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">
                    <SortableHeader columnKey="tipo_servicio">Tipo de Servicio</SortableHeader>
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold uppercase tracking-wide">
                    <SortableHeader columnKey="estado_id">Estado</SortableHeader>
                  </th>
                  <th className="px-6 py-4 text-center text-white font-semibold uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : sortedData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No hay solicitudes disponibles
                    </td>
                  </tr>
                ) : (
                  sortedData.map((request) => (
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
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${request.estado_id === 10
                          ? 'bg-green-100 text-green-700'
                          : request.estado_id === 8
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                          }`}>
                          {request.estado_id === 10 ? 'Aprobada' : request.estado_id === 8 ? 'Pendiente' : 'Rechazada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {request.estado_id === 8 && (
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={approvingId === request.id}
                            className="px-4 py-2 bg-[#22C55E] text-white rounded-lg text-sm font-medium mr-2 hover:bg-[#16A34A] transition-colors disabled:opacity-50"
                          >
                            {approvingId === request.id ? 'Aprobando...' : 'Aprobar'}
                          </button>
                        )}
                        {request.estado_id !== 8 && (
                          <button
                            onClick={() => verCertificado(request.id)}
                            className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg text-sm font-medium mr-2 hover:bg-[#3A7BCF] transition-colors"
                          >
                            PDF
                          </button>
                        )}
                        <button
                          onClick={() => handleVerDetalle(request.id)}
                          className="px-4 py-2 bg-white border border-[#4A8BDF] text-[#4A8BDF] rounded-lg text-sm font-medium hover:bg-[#4A8BDF] hover:text-white transition-colors"
                        >
                          Ver
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
    </div>
  );
}
