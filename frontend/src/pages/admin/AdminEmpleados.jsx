/**
 * AdminEmpleados - Tabla de empleados con filtros
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAPI, useAdminData } from '../../hooks/useAdminAPI';
import { useToast } from '../../hooks/useToast';
import { SkeletonStatsGrid, SkeletonTable } from '../../components/SkeletonLoaders';

export default function AdminEmpleados() {
  const navigate = useNavigate();
  const toast = useToast();
  const api = useAdminAPI();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  const { data: usersData, loading, error } = useAdminData(api.getUsers);

  const empleados = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.filter(u => (u.role || '').toLowerCase() !== 'cliente');
  }, [usersData]);

  const stats = useMemo(() => {
    const total = empleados.length;
    const activos = empleados.filter(u => u.is_active).length;
    const inactivos = total - activos;
    return { total, activos, inactivos };
  }, [empleados]);

  if (error) {
    toast.error(error);
  }

  const statsCards = [
    { label: 'Total Empleados', value: stats.total, color: 'text-[#4A8BDF]' },
    { label: 'Activos', value: stats.activos, color: 'text-green-600' },
    { label: 'Inactivos', value: stats.inactivos, color: 'text-orange-600' },
  ];

  const filteredEmpleados = empleados.filter((emp) => {
    // Mapeamos los campos del backend a los campos de la tabla
    const matchesSearch =
      (emp.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.cedula || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // bool de is_active 
    const isActive = emp.is_active;
    const matchesStatus =
      filterStatus === 'todos' ||
      (filterStatus === 'activos' && isActive) ||
      (filterStatus === 'inactivos' && !isActive);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Gestión de Empleados</h1>
        <SkeletonStatsGrid cards={3} labels={['Total Empleados', 'Activos', 'Inactivos']} />
        <SkeletonTable 
          rows={5} 
          columns={5}
          headers={['Cédula', 'Nombre', 'Email', 'Rol', 'Estado']}
        />
      </div>
    );
  }

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
              placeholder="Buscar por nombre, cédula o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
            />
          </div>

          {/* Filtro de Estado */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
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
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full">
            <thead className="bg-[#4A8BDF] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">CÉDULA</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">EMAIL</th>
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
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredEmpleados.map((empleado) => (
                  <tr key={empleado.cedula} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {empleado.cedula}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{empleado.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{empleado.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{
                        empleado.role
                    }</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          empleado.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {empleado.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/admin/empleados/${empleado.cedula}/editar`)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/empleados/${empleado.cedula}`)}
                          className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                        >
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
          
      <div className="mt-4 text-sm text-gray-600">
        Mostrando {filteredEmpleados.length} de {empleados.length} usuarios
      </div>
    </div>
  );
}
