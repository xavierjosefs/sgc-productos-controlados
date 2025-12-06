import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../../components/ClientTopbar';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import BadgeEstado from '../../components/BadgeEstado';

const Requests = () => {
  const navigate = useNavigate();
  const { getUserRequests } = useRequestsAPI();
  const [allRequests, setAllRequests] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getUserRequests();
        const normalized = Array.isArray(data) ? data : (data?.requests || data?.data || []);
        setAllRequests(normalized);
        setRequests(normalized);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError(error?.message || 'Error al cargar solicitudes');
        setAllRequests([]);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [getUserRequests]);

  const handleApplyFilters = () => {
    let filtered = [...allRequests];
    
    if (filterTipo) {
      filtered = filtered.filter(r => 
        (r.tipo_servicio || '').toLowerCase().includes(filterTipo.toLowerCase())
      );
    }
    
    if (filterEstado) {
      filtered = filtered.filter(r => 
        (r.estado || r.estado_actual || '').toLowerCase() === filterEstado.toLowerCase()
      );
    }
    
    setRequests(filtered);
  };

  const handleResetFilters = () => {
    setFilterTipo('');
    setFilterEstado('');
    setRequests(allRequests);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors"
          >
            Crear Solicitud
          </button>
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

        {/* Tabla desktop */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-x-auto">
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
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Cargando...</td></tr>
              ) : error ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-red-500">{error}</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No tienes solicitudes registradas aún</td></tr>
              ) : (
                requests.map(request => (
                  <tr key={request.id} className="hover:bg-gray-100 transition-colors">
                    <td className="px-6 py-5 text-sm text-gray-700">{request.id}</td>
                    <td className="px-6 py-5 text-sm text-gray-700">{request.tipo_servicio}</td>
                    <td className="px-6 py-5"><BadgeEstado estado={request.estado_actual} /></td>
                    <td className="px-6 py-5 text-sm text-gray-700">{new Date(request.fecha_creacion).toLocaleDateString('es-ES')}</td>
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
          {loading ? (
            <div className="text-center py-12 text-gray-500">Cargando...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No tienes solicitudes registradas aún</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requests.map(request => (
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
                      <span className="text-sm text-gray-700">{new Date(request.fecha_creacion).toLocaleDateString('es-ES')}</span>
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
};

export default Requests;

