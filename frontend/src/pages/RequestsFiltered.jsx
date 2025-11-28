import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientTopbar, Card, Select, Button, Table } from '../components';
import useRequestsAPI from '../hooks/useRequestsAPI';

/**
 * Página de solicitudes filtradas por estado
 */
export default function RequestsFiltered() {
  const { status } = useParams();
  const navigate = useNavigate();
  const { getUserRequests } = useRequestsAPI();
  
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mapeo de nombres de estados con colores
  const statusConfig = {
    enviadas: { name: 'Enviadas', color: '#4A8BDF' },
    aprobadas: { name: 'Aprobadas', color: '#10B981' },
    devueltas: { name: 'Devueltas', color: '#F59E0B' },
    pendientes: { name: 'Pendientes', color: '#EC4899' }
  };

  const currentStatus = statusConfig[status] || statusConfig.enviadas;

  // Cargar y filtrar solicitudes
  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const data = await getUserRequests();
        const statusKey = status.replace('s', ''); // enviadas -> enviada
        const filtered = data.filter(r => r.estado === statusKey || r.estado === status);
        setFilteredRequests(filtered);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        setFilteredRequests([]);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [status, getUserRequests]);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado con flecha y título */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-[#4A8BDF] hover:text-[#3875C8] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#4A8BDF]">Mis Solicitudes</h1>
        </div>

        {/* Card único del estado filtrado */}
        <div className="mb-8">
          <Card className="inline-block min-w-[280px]">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm text-gray-600">{currentStatus.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            <p className="text-4xl font-bold" style={{ color: currentStatus.color }}>{filteredRequests.length}</p>
          </Card>
        </div>

        {/* Filtro y tabla */}
        <Card padding={false} className="overflow-hidden">
          {/* Filtro de Tipo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-end items-center gap-4">
              <Select
                placeholder="Tipo"
                options={[]}
                className="min-w-[200px]"
              />
              <Button variant="secondary">
                Filtrar
              </Button>
            </div>
          </div>

          <Table
            columns={[
              { header: 'CÓDIGO', accessor: 'codigo' },
              { 
                header: 'FECHA CREACIÓN', 
                accessor: 'fecha_creacion',
                render: (row) => new Date(row.fecha_creacion).toLocaleDateString('es-ES')
              },
              { 
                header: 'TIPO DE SERVICIO', 
                accessor: 'tipo_servicio',
                render: (row) => (
                  <div className="flex items-center justify-between">
                    <span>{row.tipo_servicio}</span>
                    <button className="text-[#4A8BDF] font-medium text-sm hover:text-[#3875C8] transition-colors">
                      Ver Detalle
                    </button>
                  </div>
                )
              }
            ]}
            data={filteredRequests}
            loading={loading}
            emptyMessage="No hay solicitudes con este estado"
          />
        </Card>
      </div>
    </div>
  );
}
