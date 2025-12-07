import { useParams, useNavigate } from 'react-router-dom';

export default function AdminEmpleadoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock: Simular carga de datos del empleado
  const mockEmpleados = {
    1: { id: 1, cedula: '001-1234567-8', nombre: 'Juan Pérez García', email: 'juan.perez@example.com', rol: 'ventanilla', activo: true },
    2: { id: 2, cedula: '001-9876543-2', nombre: 'María López Hernández', email: 'maria.lopez@example.com', rol: 'tecnico_controlados', activo: true },
    3: { id: 3, cedula: '001-5555555-5', nombre: 'Carlos Rodríguez Sánchez', email: 'carlos.rodriguez@example.com', rol: 'direccion', activo: false },
  };

  const mockEmpleado = mockEmpleados[id] || mockEmpleados[1];

  const rolesDisponibles = {
    ventanilla: 'Ventanilla',
    tecnico_controlados: 'Técnico Controlados',
    director_controlados: 'Director Controlados',
    direccion: 'Dirección',
    dncd: 'DNCD',
    admin: 'Administrador',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/admin/empleados')}
        className="flex items-center text-[#4A8BDF] mb-6 hover:text-[#3875C8] transition-colors"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>
      
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Detalle de Empleado</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-[620px] mx-auto">
        <h2 className="text-lg font-bold text-[#4A8BDF] mb-6">Información</h2>
        
        <div className="space-y-4">
          {/* Cédula - SOLO LECTURA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cédula de Identidad y Electoral
            </label>
            <input
              type="text"
              value={mockEmpleado.cedula}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Nombre Completo - SOLO LECTURA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={mockEmpleado.nombre}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Correo Electrónico - SOLO LECTURA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={mockEmpleado.email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Rol - SOLO LECTURA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <input
              type="text"
              value={rolesDisponibles[mockEmpleado.rol] || mockEmpleado.rol}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Estado - SOLO LECTURA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={mockEmpleado.activo === true}
                  disabled
                  className="w-4 h-4 text-[#4A8BDF] cursor-not-allowed"
                />
                <span className="text-gray-700">Activo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={mockEmpleado.activo === false}
                  disabled
                  className="w-4 h-4 text-[#4A8BDF] cursor-not-allowed"
                />
                <span className="text-gray-700">Inactivo</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
