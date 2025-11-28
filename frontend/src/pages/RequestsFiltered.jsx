import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import BadgeEstado from '../components/BadgeEstado';
import useRequestsAPI from '../hooks/useRequestsAPI';

/**
 * Página de solicitudes filtradas por estado
 */
export default function RequestsFiltered() {
  const { status } = useParams();
  const navigate = useNavigate();
  const { getUserRequests } = useRequestsAPI();
  
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mapeo de nombres de estados con colores
  const statusConfig = {
    enviadas: { name: 'Enviadas', color: '#4A8BDF' },
    aprobadas: { name: 'Aprobadas', color: '#10B981' },
    devueltas: { name: 'Devueltas', color: '#F59E0B' },
    pendientes: { name: 'Pendientes', color: '#EC4899' }
  };

  const currentStatus = statusConfig[status] || statusConfig.enviadas;

  // Cargar y filtrar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const data = await getUserRequests();
        const statusKey = status.replace('s', ''); // enviadas -> enviada
        const filtered = data.filter(r => r.estado === statusKey || r.estado === status);
        setFilteredRequests(filtered);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setFilteredRequests([]);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [status, getUserRequests]);

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
              <div className="relative">
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10 min-w-[200px]">
                  <option value="">Tipo</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <button className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors">
                Filtrar
              </button>
            </div>
          </div>

          {/* Tabla - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#4A8BDF]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">CÓDIGO</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">FECHA CREACIÓN</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">TIPO DE SERVICIO</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      No hay solicitudes con este estado
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request, index) => (
                    <tr 
                      key={request.id} 
                      className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                    >
                      <td className="px-6 py-5 text-sm text-gray-700">{request.codigo}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {new Date(request.fecha_creacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700 flex items-center justify-between">
                        <span>{request.tipo_servicio}</span>
                        <button className="text-[#4A8BDF] font-medium text-sm hover:text-[#3875C8] transition-colors">
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
                        <span className="text-xs text-gray-500">Código</span>
                        <span className="font-semibold text-sm text-gray-900">{request.codigo}</span>
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
                        <button className="w-full px-4 py-2 rounded-lg text-xs font-semibold bg-[#4A8BDF] text-white hover:bg-[#3875C8] transition-colors">
                          Ver Detalle
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
