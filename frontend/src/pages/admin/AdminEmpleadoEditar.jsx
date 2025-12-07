import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminEmpleadoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock: Simular carga de datos del empleado
  const mockEmpleados = {
    1: { id: 1, cedula: '001-1234567-8', nombre: 'Juan Pérez García', email: 'juan.perez@example.com', rol: 'ventanilla', activo: true },
    2: { id: 2, cedula: '001-9876543-2', nombre: 'María López Hernández', email: 'maria.lopez@example.com', rol: 'tecnico_controlados', activo: true },
    3: { id: 3, cedula: '001-5555555-5', nombre: 'Carlos Rodríguez Sánchez', email: 'carlos.rodriguez@example.com', rol: 'direccion', activo: false },
  };

  const mockEmpleado = mockEmpleados[id] || mockEmpleados[1];
  
  const [rol, setRol] = useState(mockEmpleado.rol);
  const [activo, setActivo] = useState(mockEmpleado.activo);
  const [errors, setErrors] = useState({});

  const rolesDisponibles = [
    { value: 'ventanilla', label: 'Ventanilla' },
    { value: 'tecnico_controlados', label: 'Técnico Controlados' },
    { value: 'director_controlados', label: 'Director Controlados' },
    { value: 'direccion', label: 'Dirección' },
    { value: 'dncd', label: 'DNCD' },
    { value: 'admin', label: 'Administrador' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!rol) {
      newErrors.rol = 'Debe seleccionar un rol';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    alert('Empleado actualizado exitosamente (mock)');
    navigate('/admin/empleados');
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
      
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Edición de Empleado</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-[620px] mx-auto">
        <h2 className="text-lg font-bold text-[#4A8BDF] mb-6">Información</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Rol - EDITABLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                errors.rol ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccione un rol</option>
              {rolesDisponibles.map((rolOption) => (
                <option key={rolOption.value} value={rolOption.value}>
                  {rolOption.label}
                </option>
              ))}
            </select>
            {errors.rol && (
              <p className="text-red-500 text-sm mt-1">{errors.rol}</p>
            )}
          </div>

          {/* Estado - EDITABLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="activo"
                  checked={activo === true}
                  onChange={() => setActivo(true)}
                  className="w-4 h-4 text-[#4A8BDF] focus:ring-[#4A8BDF]"
                />
                <span className="text-gray-700">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="activo"
                  checked={activo === false}
                  onChange={() => setActivo(false)}
                  className="w-4 h-4 text-[#4A8BDF] focus:ring-[#4A8BDF]"
                />
                <span className="text-gray-700">Inactivo</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-6 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/empleados')}
              className="flex-1 bg-[#A8C5E8] text-gray-700 rounded-lg px-8 py-3 hover:bg-[#97b4d7] transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#085297] text-white rounded-lg px-8 py-3 hover:bg-[#064175] transition-colors font-medium"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
