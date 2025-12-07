/**
 * AdminDashboard - Panel principal con estadísticas
 */
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const solicitudesStats = [
    { label: 'Total Solicitudes', value: 20, color: 'text-[#4A8BDF]', route: '/admin/solicitudes' },
    { label: 'Pendientes', value: 15, color: 'text-gray-600', route: '/admin/solicitudes' },
    { label: 'Aprobadas', value: 5, color: 'text-green-600', route: '/admin/solicitudes' },
    { label: 'Rechazadas', value: 4, color: 'text-orange-600', route: '/admin/solicitudes' },
    { label: 'Devueltas', value: 10, color: 'text-gray-600', route: '/admin/solicitudes' },
    { label: 'Total Servicios', value: 5, color: 'text-[#4A8BDF]', route: '/admin/servicios' },
  ];

  const empleadosStats = [
    { label: 'Total Empleados', value: 15, color: 'text-[#4A8BDF]', route: '/admin/empleados' },
    { label: 'Activos', value: 10, color: 'text-green-600', route: '/admin/empleados' },
    { label: 'Inactivos', value: 10, color: 'text-orange-600', route: '/admin/empleados' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Resumen General</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card de Solicitudes */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <div className="grid grid-cols-2 gap-6">
            {solicitudesStats.map((stat, index) => (
              <button
                key={index}
                onClick={() => navigate(stat.route)}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-[#4A8BDF] transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm font-medium">{stat.label}</span>
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="text-[#4A8BDF]"
                  >
                    <path 
                      d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className={`text-5xl font-bold ${stat.color}`}>{stat.value}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Card de Empleados */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
          <div className="flex flex-col gap-6">
            {empleadosStats.map((stat, index) => (
              <button
                key={index}
                onClick={() => navigate(stat.route)}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-[#4A8BDF] transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm font-medium">{stat.label}</span>
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="text-[#4A8BDF]"
                  >
                    <path 
                      d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className={`text-5xl font-bold ${stat.color}`}>{stat.value}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
