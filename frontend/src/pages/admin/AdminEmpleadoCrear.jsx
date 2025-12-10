import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAPI, useAdminData } from '../../hooks/useAdminAPI';
import { useToast } from '../../hooks/useToast';
import { employeeSchema, validateWithSchema } from '../../utils/validation';
import { SkeletonForm } from '../../components/SkeletonLoaders';

export default function AdminEmpleadoCrear() {
  const navigate = useNavigate();
  const toast = useToast();
  const api = useAdminAPI();
  
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: rolesData, loading: loadingRoles } = useAdminData(api.getRoles);
  const rolesDisponibles = rolesData?.roles || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validacion con zod
    const validation = validateWithSchema(employeeSchema, {
      cedula,
      nombre,
      email,
      rol
    });
    
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSubmitting(true);
    try {
        await api.createUser({
            cedula,
            full_name: nombre,
            email,
            role: rol
        });

        toast.success('Empleado creado exitosamente. Se ha enviado un correo para completar el registro.');
        navigate('/admin/empleados');

    } catch (error) {
        console.error("Error creando empleado:", error);
        const msg = error.response?.data?.error || "Error al crear el empleado";
        toast.error(msg);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCedulaChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length >= 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
      }
      if (value.length >= 11) {
        value = value.slice(0, 11) + '-' + value.slice(11);
      }
      setCedula(value);
    }
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
      
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Creación de Empleado</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-[620px] mx-auto">
        <h2 className="text-lg font-bold text-[#4A8BDF] mb-6">Información</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cédula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cédula de Identidad y Electoral
            </label>
            <input
              type="text"
              placeholder="000-0000000-0"
              value={cedula}
              onChange={handleCedulaChange}
              maxLength={13}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                errors.cedula ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cedula && (
              <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>
            )}
          </div>

          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Rol */}
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
              {loadingRoles ? (
                <option disabled>Cargando roles...</option>
              ) : (
                rolesDisponibles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))
              )}
            </select>
            {errors.rol && (
              <p className="text-red-500 text-sm mt-1">{errors.rol}</p>
            )}
          </div>

           <div className="text-sm text-gray-500 italic">
               Nota: El usuario se creará en estado pendiente y deberá activar su cuenta vía correo.
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
              {isSubmitting ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
