/**
 * AdminSolicitudes - Gestión de solicitudes con filtros
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminSolicitudes() {
  const navigate = useNavigate();
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  const mockSolicitudes = [
    { id: 'SOL001', codigo: 'SOL-2024-001', nombre: 'Juan Pérez García', fechaCreacion: '2024-01-15', tipo: 'Clase A', estado: 'Pendiente' },
    { id: 'SOL002', codigo: 'SOL-2024-002', nombre: 'María López Hernández', fechaCreacion: '2024-01-20', tipo: 'Clase B', estado: 'Aprobada' },
    { id: 'SOL003', codigo: 'SOL-2024-003', nombre: 'Carlos Rodríguez Sánchez', fechaCreacion: '2024-02-01', tipo: 'Capa C', estado: 'Devuelta' },
    { id: 'SOL004', codigo: 'SOL-2024-004', nombre: 'Ana Martínez Torres', fechaCreacion: '2024-02-10', tipo: 'Clase A', estado: 'Enviada' },
    { id: 'SOL005', codigo: 'SOL-2024-005', nombre: 'Luis González Ramírez', fechaCreacion: '2024-02-15', tipo: 'Clase B', estado: 'Aprobada' },
  ];

  const statsCards = [
    { label: 'Enviadas', value: 20, color: 'text-[#4A8BDF]' },
    { label: 'Aprobadas', value: 8, color: 'text-green-600' },
    { label: 'Devueltas', value: 2, color: 'text-orange-600' },
    { label: 'Pendientes', value: 10, color: 'text-gray-600' },
  ];

  const filteredSolicitudes = mockSolicitudes.filter((sol) => {
    const matchesTipo = filterTipo === 'todos' || sol.tipo === filterTipo;
    const matchesEstado = filterEstado === 'todos' || sol.estado === filterEstado;
    return matchesTipo && matchesEstado;
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
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            >
              <option value="todos">Todos</option>
              <option value="Clase A">Clase A</option>
              <option value="Clase B">Clase B</option>
              <option value="Capa C">Capa C</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            >
              <option value="todos">Todos</option>
              <option value="Enviada">Enviada</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Devuelta">Devuelta</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="px-6 py-2 bg-[#085297] text-white rounded-lg hover:bg-[#064175] font-medium">
              Filtrar
            </button>
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
              {filteredSolicitudes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron solicitudes
                  </td>
                </tr>
              ) : (
                filteredSolicitudes.map((solicitud) => (
                  <tr key={solicitud.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {solicitud.codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{solicitud.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{solicitud.fechaCreacion}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{solicitud.tipo}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          solicitud.estado === 'Aprobada'
                            ? 'bg-green-100 text-green-800'
                            : solicitud.estado === 'Enviada'
                            ? 'bg-blue-100 text-blue-800'
                            : solicitud.estado === 'Devuelta'
                            ? 'bg-yellow-100 text-yellow-800'
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
