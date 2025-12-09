/**
 * AdminSolicitudes - Gestión de solicitudes con filtros
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminSolicitudes() {
  const navigate = useNavigate();
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ aprobadas: 0, devueltas: 0, pendientes: 0 });
  
  const [tiposServicio, setTiposServicio] = useState([]);
  const [estadosSolicitud, setEstadosSolicitud] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            
            const response = await axios.get(`${apiUrl}/api/admin/get-all-requests`, {
                 withCredentials: true
            });
            const reqs = response.data.requests || [];
            setSolicitudes(reqs);

            const counts = reqs.reduce((acc, curr) => {
                const status = (curr.estado || '').toLowerCase();
                if (status.includes('aprobada')) acc.aprobadas++;
                else if (status.includes('devuelta')) acc.devueltas++;
                else if (status.includes('pendiente')) acc.pendientes++;
                return acc;
            }, { aprobadas: 0, devueltas: 0, pendientes: 0 });

            setStats(counts);

            const servicesResponse = await axios.get(`${apiUrl}/api/admin/get-services`, {
                withCredentials: true
            });
            setTiposServicio(servicesResponse.data.services || []);

            const statusesResponse = await axios.get(`${apiUrl}/api/admin/get-request-statuses`, {
                withCredentials: true
            });
            setEstadosSolicitud(statusesResponse.data.statuses || []);

        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error cargando datos de solicitudes");
        } finally {
            setLoading(false);
        }
    };
    fetchRequests();
  }, []);

  const statsCards = [
    { label: 'Pendientes', value: stats.pendientes, color: 'text-gray-600' },
    { label: 'Aprobadas', value: stats.aprobadas, color: 'text-green-600' },
    { label: 'Devueltas', value: stats.devueltas, color: 'text-orange-600' },
  ];

  const filteredSolicitudes = solicitudes.filter((sol) => {
    const solEstado = (sol.estado || '').toLowerCase();
    
    let matchesEstado = true;
    if (filterEstado !== 'todos') {
         matchesEstado = solEstado.includes(filterEstado.toLowerCase());
    }
    
    const matchesTipo = filterTipo === 'todos' || (sol.nombre_servicio || '').toLowerCase().includes(filterTipo.toLowerCase());

    return matchesTipo && matchesEstado;
  }).sort((a, b) => {
      const dateA = new Date(a.fecha_creacion);
      const dateB = new Date(b.fecha_creacion);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-6">Gestión de Solicitudes</h1>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
          >
            <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros y tabla */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {/* Controles de filtros */}
        <div className="flex gap-4 mb-6 flex-wrap">
          
          {/* TIPO FILTER */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            >
              <option value="todos">Todos</option>
              {tiposServicio.map(service => (
                  <option key={service.codigo_servicio} value={service.nombre_servicio}>
                      {service.nombre_servicio}
                  </option>
              ))}
            </select>
          </div>

          {/* ESTADO FILTER */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            >
              <option value="todos">Todos</option>
              {estadosSolicitud.map(status => (
                  <option key={status.id} value={status.nombre_mostrar || status.nombre_interno}>
                      {status.nombre_mostrar}
                  </option>
              ))}
            </select>
          </div>

          {/* FECHA FILTER */}
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            >
              <option value="desc">Más recientes primero</option>
              <option value="asc">Más antiguos primero</option>
            </select>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#4A8BDF] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">CÓDIGO</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">NOMBRE</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">FECHA CREACIÓN</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">TIPO DE SERVICIO</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">ESTADO</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Cargando...</td></tr>
              ) : filteredSolicitudes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron solicitudes
                  </td>
                </tr>
              ) : (
                filteredSolicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {solicitud.codigo_solicitud || solicitud.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{solicitud.usuario_nombre || solicitud.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{
                        solicitud.fecha_creacion ? new Date(solicitud.fecha_creacion).toLocaleDateString() : 'N/A'
                    }</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{solicitud.nombre_servicio}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          (solicitud.estado || '').toLowerCase().includes('aprobada')
                            ? 'bg-green-100 text-green-800'
                            : (solicitud.estado || '').toLowerCase().includes('pendiente')
                            ? 'bg-blue-100 text-blue-800'
                            : (solicitud.estado || '').toLowerCase().includes('devuelta')
                            ? 'bg-yellow-100 text-yellow-800'
                            : (solicitud.estado || '').toLowerCase().includes('rechazada')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {solicitud.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => navigate(`/admin/solicitudes/${solicitud.id}`)}
                        className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg hover:bg-[#3875C8] text-sm font-medium transition-colors"
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
      </div>
    </div>
  );
}
