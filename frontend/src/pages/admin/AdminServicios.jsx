/**
 * AdminServicios - Catálogo de Servicios
 * Solo botón de crear servicio (la tabla le toca al compañero)
 */
import { useNavigate } from 'react-router-dom';

export default function AdminServicios() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#4A8BDF]">Catálogo de Servicios</h1>
        <button 
          onClick={() => navigate('/admin/servicios/crear')}
          className="px-6 py-2 bg-[#4A8BDF] text-white rounded-lg hover:bg-[#3875C8] font-medium transition-colors"
        >
          Crear Servicio
        </button>
      </div>

      {/* Placeholder - La tabla la implementará otro compañero */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">
          La tabla de servicios será implementada por otro equipo
        </p>
      </div>
    </div>
  );
}
