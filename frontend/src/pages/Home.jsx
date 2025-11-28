import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';
import RequestSummaryCard from '../components/RequestSummaryCard';
import BadgeEstado from '../components/BadgeEstado';
import useRequestsAPI from '../hooks/useRequestsAPI';

/**
 * Dashboard principal del Cliente (Home)
 * Muestra resumen de estados y últimas 5 solicitudes
 */
export default function Home() {
  const navigate = useNavigate();
  const { getUserRequests } = useRequestsAPI();
  
  const [allRequests, setAllRequests] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // Cargar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      setLoadingRequests(true);
      try {
        const data = await getUserRequests();
        setAllRequests(data);
        // Mostrar solo las últimas 5 solicitudes
        setRecentRequests(data.slice(0, 5));
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setAllRequests([]);
        setRecentRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };
    loadRequests();
  }, [getUserRequests]);

  // Contar solicitudes por estado
  const countByStatus = {
    enviadas: allRequests.filter(r => r.estado === 'enviada').length,
    aprobadas: allRequests.filter(r => r.estado === 'aprobada').length,
    devueltas: allRequests.filter(r => r.estado === 'devuelta').length,
    pendientes: allRequests.filter(r => r.estado === 'pendiente').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <ClientTopbar />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado con título y botón crear */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
          
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="px-6 py-2.5 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors flex items-center gap-2"
            >
              Crear Solicitud
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 text-sm text-gray-500">
                  Los tipos de servicio se cargarán desde el backend
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#F59E0B]">{countByStatus.devueltas}</p>
          </div>

          <div 
            onClick={() => navigate('/requests/pendientes')}
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
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10">
                  <option value="">Tipo</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              
              <div className="relative">
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10">
                  <option value="">Estado</option>
                  <option value="enviada">Enviada</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="devuelta">Devuelta</option>
                  <option value="pendiente">Pendiente</option>
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
        </div>

        {/* Tabla de solicitudes */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabla - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#4A8BDF]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">CÓDIGO</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">FECHA CREACIÓN</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">TIPO DE SERVICIO</th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {loadingRequests ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No tienes solicitudes registradas aún
                    </td>
                  </tr>
                ) : (
                  recentRequests.map((request, index) => (
                    <tr 
                      key={request.id} 
                      className={`${index % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-white'} hover:bg-gray-100 transition-colors cursor-pointer`}
                    >
                      <td className="px-6 py-5 text-sm text-gray-700">{request.codigo}</td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        {new Date(request.fecha_creacion).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">{request.tipo_servicio}</td>
                      <td className="px-6 py-5">
                        <span className="inline-block px-4 py-1 rounded-lg text-xs font-semibold bg-[#4A8BDF] text-white">
                          Ver Detalle
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Cards - Mobile */}
          <div className="md:hidden">
            {loadingRequests ? (
              <div className="text-center py-12 text-gray-500">Cargando solicitudes...</div>
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No tienes solicitudes registradas aún</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentRequests.map((request, index) => (
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
