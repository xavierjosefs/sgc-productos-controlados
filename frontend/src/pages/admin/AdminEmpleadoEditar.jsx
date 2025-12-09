import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminEmpleadoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [rol, setRol] = useState('');
  const [activo, setActivo] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.get(`${apiUrl}/api/admin/users/${id}`, {
                withCredentials: true
            });
            const userData = response.data.user;
            setEmployee(userData);
            setRol(userData.role); 
            setActivo(userData.is_active);

        } catch (error) {
            console.error("Error fetching user:", error);
            alert("Error cargando usuario");
            navigate('/admin/empleados');
        } finally {
            setLoading(false);
        }
    };
    fetchUser();
  }, [id, navigate]);

  const rolesDisponibles = [
    { value: 'ventanilla', label: 'Ventanilla' },
    { value: 'tecnico_controlados', label: 'Técnico Controlados' },
    { value: 'director_controlados', label: 'Director Controlados' },
    { value: 'direccion', label: 'Dirección' },
    { value: 'dncd', label: 'DNCD' },
    { value: 'admin', label: 'Administrador' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!rol) {
      newErrors.rol = 'Debe seleccionar un rol';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        // 1. Update Role
        if (rol !== employee.role) {
            await axios.put(`${apiUrl}/api/admin/change-role`, {
                cedula: id,
                newRole: rol
            }, { withCredentials: true });
        }

        // 2. Update Status
        if (activo !== employee.is_active) {
             await axios.put(`${apiUrl}/api/admin/users/${id}/status`, {
                isActive: activo
            }, { withCredentials: true });
        }
        
        alert('Empleado actualizado exitosamente');
        navigate('/admin/empleados');

    } catch (error) {
        console.error("Error updating user:", error);
        alert("Error al actualizar el empleado");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando datos...</div>;
  if (!employee) return null;

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
              value={employee.cedula}
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
              value={employee.full_name}
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
              value={employee.email}
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
              disabled={isSubmitting}
              className={`flex-1 bg-[#085297] text-white rounded-lg px-8 py-3 hover:bg-[#064175] transition-colors font-medium ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
