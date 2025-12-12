import React from 'react';
import DncdTopbar from '../../components/DncdTopbar';

export default function DncdDashboard() {
  // Simulación de solicitudes aprobadas (vacío para mostrar el mensaje)
  const [filterTipo, setFilterTipo] = React.useState("");
  const solicitudesAprobadas = [];
  // const solicitudesAprobadas = [{}, {}, ...]; // Descomenta y agrega objetos para simular datos
  const handleResetFilter = () => setFilterTipo("");
  return (
    <div className="min-h-screen bg-gray-50">
      <DncdTopbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Solicitudes</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8">
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-8 min-w-[220px] text-center shadow-lg">
              <span className="text-base text-gray-600">Aprobadas</span>
              <p className="text-5xl font-bold text-[#10B981] mt-3">{solicitudesAprobadas.length}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <select
                value={filterTipo}
                onChange={e => setFilterTipo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10 truncate"
                title="Tipo"
              >
                <option value="">Tipo</option>
                <option value="tipo1">Tipo 1</option>
                <option value="tipo2">Tipo 2</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <button className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064175] transition-colors">Filtrar</button>
            {filterTipo && (
              <button
                onClick={handleResetFilter}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full">
            <thead>
              <tr className="bg-[#4A8BDF] text-white">
                <th className="px-6 py-4 text-left text-sm font-semibold">CÓDIGO</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">FECHA CREACIÓN</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">TIPO DE SERVICIO</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {solicitudesAprobadas.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-lg">No hay solicitudes aprobadas</td>
                </tr>
              ) : (
                solicitudesAprobadas.map((sol, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-700">{{/* sol.codigo */}}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{{/* sol.fecha_creacion */}}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{{/* sol.tipo_servicio */}}</td>
                    <td className="px-6 py-4 text-center">
                      <button className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg text-sm font-medium mr-2">Imprimir</button>
                      <button className="px-4 py-2 bg-white border border-[#4A8BDF] text-[#4A8BDF] rounded-lg text-sm font-medium">Ver</button>
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
