/**
 * AdminDashboard - Panel principal con estadísticas
 */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/admin/stats`, {
             withCredentials: true
        });
        console.log("Stats received from:", `${apiUrl}/api/admin/stats`);
        console.log("Stats data:", response.data);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        alert("Error cargando estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando estadísticas...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">No se pudieron cargar los datos.</div>;

  // Debug por si algo sale mal
  if (!stats.solicitudes || !stats.empleados || !stats.servicios) {
      return (
          <div className="p-8 text-center">
              <p className="text-red-500 font-bold mb-4">Error: Datos con formato incorrecto recibidos</p>
              <pre className="text-left bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {typeof stats === 'object' ? JSON.stringify(stats, null, 2) : String(stats)}
              </pre>
          </div>
      );
  }

  const solicitudesStats = [
    { label: 'Total Solicitudes', value: stats.solicitudes.total, color: 'text-[#4A8BDF]', route: '/admin/solicitudes' },
    { label: 'Pendientes', value: stats.solicitudes.pendientes, color: 'text-gray-600', route: '/admin/solicitudes' },
    { label: 'Aprobadas', value: stats.solicitudes.aprobadas, color: 'text-green-600', route: '/admin/solicitudes' },
    { label: 'Rechazadas', value: stats.solicitudes.rechazadas, color: 'text-orange-600', route: '/admin/solicitudes' },
    { label: 'Devueltas', value: stats.solicitudes.devueltas, color: 'text-gray-600', route: '/admin/solicitudes' },
    { label: 'Total Servicios', value: stats.servicios.total, color: 'text-[#4A8BDF]', route: '/admin/servicios' },
  ];

  const empleadosStats = [
    { label: 'Total Empleados', value: stats.empleados.total, color: 'text-[#4A8BDF]', route: '/admin/empleados' },
    { label: 'Activos', value: stats.empleados.activos, color: 'text-green-600', route: '/admin/empleados' },
    { label: 'Inactivos', value: stats.empleados.inactivos, color: 'text-orange-600', route: '/admin/empleados' },
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
