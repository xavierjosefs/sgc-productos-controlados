import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientTopbar, Button, Select, Card, Table } from '../components';
import useRequestsAPI from '../hooks/useRequestsAPI';

/**
 * Dashboard principal del Cliente (Home)
 * Muestra resumen de estados y últimas 5 solicitudes
 */
export default function Home() {
  const navigate = useNavigate();
  const { getUserRequests } = useRequestsAPI();
  
  const [allRequests, setAllRequests] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  // Cargar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      setLoadingRequests(true);
      try {
        const data = await getUserRequests();
        setAllRequests(data);
        // Mostrar solo las últimas 5 solicitudes
        setRecentRequests(data.slice(0, 5));
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setAllRequests([]);
        setRecentRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };
    loadRequests();
  }, [getUserRequests]);

  // Contar solicitudes por estado
  const countByStatus = {
    enviadas: allRequests.filter(r => r.estado === 'enviada').length,
    aprobadas: allRequests.filter(r => r.estado === 'aprobada').length,
    devueltas: allRequests.filter(r => r.estado === 'devuelta').length,
    pendientes: allRequests.filter(r => r.estado === 'pendiente').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <ClientTopbar />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado con título y botón crear */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
          
          <div className="relative">
            <Button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center gap-2"
            >
              Crear Solicitud
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </Button>
            {showCreateMenu && (
              <Card className="absolute right-0 mt-2 w-64 shadow-lg py-2 z-50" padding={false}>
                <div className="px-4 py-3 text-sm text-gray-500">
                  
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            onClick={() => navigate('/requests/enviadas')}
            hover
            className="relative cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Enviadas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#4A8BDF]">{countByStatus.enviadas}</p>
          </Card>

          <Card 
            onClick={() => navigate('/requests/aprobadas')}
            hover
            className="relative cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Aprobadas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#10B981]">{countByStatus.aprobadas}</p>
          </Card>

          <Card 
            onClick={() => navigate('/requests/devueltas')}
            hover
            className="relative cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Devueltas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#F59E0B]">{countByStatus.devueltas}</p>
          </Card>

          <Card 
            onClick={() => navigate('/requests/pendientes')}
            hover
            className="relative cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">Pendientes</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-[#EC4899]">{countByStatus.pendientes}</p>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-end">
            <div className="flex gap-4">
              <Select
                placeholder="Tipo"
                options={[]}
              />
              
              <Select
                placeholder="Estado"
                options={[
                  { value: 'enviada', label: 'Enviada' },
                  { value: 'aprobada', label: 'Aprobada' },
                  { value: 'devuelta', label: 'Devuelta' },
                  { value: 'pendiente', label: 'Pendiente' }
                ]}
              />

              <Button variant="secondary">
                Filtrar
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabla de solicitudes */}
        <Table
          columns={[
            { header: 'CÓDIGO', accessor: 'codigo' },
            { 
              header: 'FECHA CREACIÓN', 
              accessor: 'fecha_creacion',
              render: (row) => new Date(row.fecha_creacion).toLocaleDateString('es-ES')
            },
            { header: 'TIPO DE SERVICIO', accessor: 'tipo_servicio' },
            {
              header: 'ESTADO',
              render: () => (
                <span className="inline-block px-4 py-1 rounded-lg text-xs font-semibold bg-[#4A8BDF] text-white">
                  Ver Detalle
                </span>
              )
            }
          ]}
          data={recentRequests}
          loading={loadingRequests}
          emptyMessage="No tienes solicitudes registradas aún"
        />
      </div>
    </div>
  );
}
