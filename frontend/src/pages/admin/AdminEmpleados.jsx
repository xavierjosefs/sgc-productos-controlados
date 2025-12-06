/**
 * AdminEmpleados - Tabla de empleados con filtros
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminEmpleados() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const mockEmpleados = [
    { id: 1, codigo: 'EMP001', fecha: '2024-01-15', nombre: 'Juan Pérez García', rol: 'VUS', activo: true },
    { id: 2, codigo: 'EMP002', fecha: '2024-01-20', nombre: 'María López Hernández', rol: 'UPC', activo: true },
    { id: 3, codigo: 'EMP003', fecha: '2024-02-01', nombre: 'Carlos Rodríguez Sánchez', rol: 'Dirección', activo: false },
    { id: 4, codigo: 'EMP004', fecha: '2024-02-10', nombre: 'Ana Martínez Torres', rol: 'DNCD', activo: true },
    { id: 5, codigo: 'EMP005', fecha: '2024-02-15', nombre: 'Luis González Ramírez', rol: 'VUS', activo: true },
    { id: 6, codigo: 'EMP006', fecha: '2024-03-01', nombre: 'Laura Fernández López', rol: 'UPC', activo: false },
    { id: 7, codigo: 'EMP007', fecha: '2024-03-05', nombre: 'Pedro Sánchez García', rol: 'VUS', activo: true },
    { id: 8, codigo: 'EMP008', fecha: '2024-03-10', nombre: 'Carmen Jiménez Ruiz', rol: 'Dirección', activo: true },
  ];

  const statsCards = [
    { label: 'Total Empleados', value: 15, color: 'text-[#4A8BDF]' },
    { label: 'Activos', value: 10, color: 'text-green-600' },
    { label: 'Inactivo', value: 5, color: 'text-orange-600' },
  ];

  const filteredEmpleados = mockEmpleados.filter((emp) => {
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.rol.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      filterStatus === 'todos' ||
      (filterStatus === 'activos' && emp.activo) ||
      (filterStatus === 'inactivos' && !emp.activo);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#4A8BDF]">Gestión de Empleados</h1>
        <button 
          onClick={() => navigate('/admin/empleados/crear')}
          className="px-6 py-2 bg-[#4A8BDF] text-white rounded-lg hover:bg-[#3875C8] font-medium transition-colors"
        >
          Crear Empleado
        </button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      {/* Controles de búsqueda y filtros */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex gap-4">
          {/* Buscador */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            />
          </div>

          {/* Filtro de rol */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="px-6 py-2 bg-[#085297] text-white rounded-lg hover:bg-[#064175] font-medium">
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#4A8BDF] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">CÓDIGO</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">FECHA CREACIÓN</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">NOMBRE</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">ROL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">ESTADO</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmpleados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron empleados
                  </td>
                </tr>
              ) : (
                filteredEmpleados.map((empleado) => (
                  <tr key={empleado.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {empleado.codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{empleado.fecha}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{empleado.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{empleado.rol}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          empleado.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {empleado.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/admin/empleados/editar/${empleado.id}`)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        >
                          Editar
                        </button>
                        <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors">
                          Ver Detalle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen de resultados */}
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredEmpleados.length} de {mockEmpleados.length} empleados
      </div>
    </div>
  );
}
