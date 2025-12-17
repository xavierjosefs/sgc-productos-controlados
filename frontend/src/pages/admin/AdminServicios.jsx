/**
 * AdminServicios - Catálogo de Servicios
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAPI, useAdminData } from '../../hooks/useAdminAPI';
import { useToast } from '../../hooks/useToast';
import { SkeletonTable } from '../../components/SkeletonLoaders';

export default function AdminServicios() {
  const navigate = useNavigate();
  const toast = useToast();
  const api = useAdminAPI();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFormulario, setTipoFormulario] = useState('');

  const { data, loading, error } = useAdminData(async () => {
    const [servicesRes, formsRes] = await Promise.all([
      api.getServices(),
      api.getForms()
    ]);
    
    return {
      services: servicesRes.services || [],
      forms: formsRes.forms || []
    };
  });

  const servicios = data?.services || [];
  const tiposFormulario = data?.forms || [];

  if (error) {
    toast.error(error);
  }

  const filteredServicios = servicios.filter((servicio) => {
    const nombre = servicio.nombre_servicio || '';
    const codigo = servicio.codigo_servicio || '';
    const formulario = servicio.formulario_nombre || '';
    
    const matchesSearch = 
        nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        codigo.toLowerCase().includes(searchTerm.toLowerCase());
        
    const matchesTipo = !tipoFormulario || formulario === tipoFormulario;
    
    return matchesSearch && matchesTipo;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Catálogo de Servicios</h1>
        <SkeletonTable 
          rows={6} 
          columns={4}
          headers={['Código', 'Nombre', 'Precio', 'Tipo Formulario']}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#4A8BDF]">Catálogo de Servicios</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por nombre o código
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] pr-10"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Formulario
          </label>
          <select
            value={tipoFormulario}
            onChange={(e) => setTipoFormulario(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
          >
            <option value="">Todos</option>
            {tiposFormulario.map((tipo) => (
                <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => navigate('/admin/servicios/crear')}
          className="px-8 py-3 bg-[#A8C5E8] text-gray-700 rounded-lg hover:bg-[#97b4d7] transition-colors font-medium"
        >
          Crear Servicio
        </button>
      </div>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServicios.map((servicio) => (
          <div
            key={servicio.codigo_servicio}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/admin/servicios/${servicio.codigo_servicio}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[#085297] font-semibold text-lg flex-1 hover:underline">
                {servicio.nombre_servicio}
              </h3>
            </div>
            
            <p className="text-xs text-gray-500 font-bold mb-3">{servicio.codigo_servicio}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio:</span>
                <span className="font-semibold text-gray-900">
                  {servicio.precio ? `RD$ ${parseFloat(servicio.precio).toFixed(2)}` : 'Sin Costo'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo de Formulario:</span>
                <span className="font-semibold text-gray-900">{servicio.formulario_nombre}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/servicios/${servicio.codigo_servicio}/editar`);
              }}
              className="w-full px-4 py-2 bg-[#085297] text-white rounded-lg hover:bg-[#064175] transition-colors font-medium text-sm"
            >
              Editar
            </button>
          </div>
        ))}
      </div>

      {filteredServicios.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">No se encontraron servicios</p>
        </div>
      )}
    </div>
  );
}
