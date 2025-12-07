/**
 * AdminServicios - Catálogo de Servicios
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminServicios() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFormulario, setTipoFormulario] = useState('');

  const mockServicios = [
    {
      id: 1,
      nombre: 'Solicitud de Certificado de Inscripción de Drogas Controladas',
      precio: 150.00,
      tipoFormulario: 'Clase A',
    },
    {
      id: 2,
      nombre: 'Solicitud de Certificado de Inscripción de Drogas Controladas para Instituciones Públicas',
      precio: null,
      tipoFormulario: 'Clase B',
    },
    {
      id: 3,
      nombre: 'Solicitud de Certificado de Inscripción de Drogas Controladas para Establecimientos Privados',
      precio: 500.00,
      tipoFormulario: 'Clase B',
    },
    {
      id: 4,
      nombre: 'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas',
      precio: null,
      tipoFormulario: 'Sin Formulario',
    },
    {
      id: 5,
      nombre: 'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas',
      precio: null,
      tipoFormulario: 'Sin Formulario',
    },
  ];

  const filteredServicios = mockServicios.filter((servicio) => {
    const matchesSearch = servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = !tipoFormulario || servicio.tipoFormulario === tipoFormulario;
    return matchesSearch && matchesTipo;
  });

  const handleFilter = () => {
    // El filtro ya está activo en tiempo real
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#4A8BDF]">Catálogo de Servicios</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por nombre
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre"
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
            <option value="Clase A">Clase A</option>
            <option value="Clase B">Clase B</option>
            <option value="Capa C">Capa C</option>
            <option value="Sin Formulario">Sin Formulario</option>
          </select>
        </div>

        <button
          onClick={handleFilter}
          className="px-8 py-3 bg-[#085297] text-white rounded-lg hover:bg-[#064175] transition-colors font-medium"
        >
          Filtrar
        </button>

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
            key={servicio.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/admin/servicios/${servicio.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[#085297] font-semibold text-base flex-1 hover:underline">
                {servicio.nombre}
              </h3>
              <svg
                className="w-5 h-5 text-[#085297] flex-shrink-0 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio:</span>
                <span className="font-semibold text-gray-900">
                  {servicio.precio ? `RD$ ${servicio.precio.toFixed(2)}` : 'Sin Costo'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo de Formulario:</span>
                <span className="font-semibold text-gray-900">{servicio.tipoFormulario}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/servicios/${servicio.id}/editar`);
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
