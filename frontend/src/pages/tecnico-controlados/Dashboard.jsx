import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TecnicoTopbar from '../../components/TecnicoTopbar';
import useTecnicoAPI from '../../hooks/useTecnicoAPI';
import BadgeEstado from '../../components/BadgeEstado';
import useSortableTable from '../../hooks/useSortableTable';

/**
 * Dashboard del Técnico de Controlados
 * Panel para evaluación técnica de solicitudes
 */

export default function TecnicoControladosDashboard() {
    const navigate = useNavigate();
    const { getRequests } = useTecnicoAPI();

    const [allRequests, setAllRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [errorRequests, setErrorRequests] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    // Cargar solicitudes
    useEffect(() => {
        const loadRequests = async () => {
            setLoadingRequests(true);
            try {
                const data = await getRequests();
                const normalized = Array.isArray(data) ? data : (data?.requests || data?.data || []);
                setAllRequests(normalized);
                setFilteredRequests(normalized);
                setErrorRequests('');
            } catch (error) {
                setAllRequests([]);
                setFilteredRequests([]);
                setErrorRequests(error?.message || 'Error al cargar solicitudes');
            } finally {
                setLoadingRequests(false);
            }
        };
        loadRequests();
    }, [getRequests]);

    // Aplicar filtros automáticamente cuando cambian
    useEffect(() => {
        let filtered = [...allRequests];

        if (filterTipo) {
            filtered = filtered.filter(r =>
                (r.tipo_servicio || '').toLowerCase().includes(filterTipo.toLowerCase())
            );
        }

        if (filterEstado) {
            filtered = filtered.filter(r =>
                (r.estado_actual || '') === filterEstado
            );
        }

        setFilteredRequests(filtered);
    }, [filterTipo, filterEstado, allRequests]);

    const handleResetFilters = () => {
        setFilterTipo('');
        setFilterEstado('');
    };

    // Verificar si una solicitud puede ser validada (editable)
    const puedeValidar = (estado) => {
        return estado === 'En evaluación técnica' || estado === 'Rechazada por Director UPC';
    };

    // Contar solicitudes por estado
    const countByStatus = {
        pendientes: allRequests.filter(r =>
            r.estado_actual === 'En evaluación técnica'
        ).length,
        devueltas: allRequests.filter(r =>
            r.estado_actual === 'Rechazada por Director UPC'
        ).length,
        enviadasDirector: allRequests.filter(r =>
            r.estado_actual && (
                r.estado_actual.toLowerCase().includes('revisión') &&
                r.estado_actual.toLowerCase().includes('director')
            ) || r.estado_id === 6
        ).length,
    };

    // Hook para ordenamiento de tabla
    const { sortedData, SortableHeader } = useSortableTable(filteredRequests, { key: 'id', direction: 'desc' });

    // Tipos de servicio únicos
    const tiposUnicos = [...new Set(allRequests.map(r => r.tipo_servicio).filter(Boolean))];
    const estadosUnicos = [...new Set(allRequests.map(r => r.estado_actual).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gray-50">
            <TecnicoTopbar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    {/* CAMBIO: Color del título actualizado */}
                    <h1 className="text-3xl font-bold text-[#4A8BDF]">Gestión de Solicitudes</h1>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div
                        onClick={() => setFilterEstado('En evaluación técnica')}
                        className={`bg-white rounded-xl border-2 p-6 relative cursor-pointer hover:shadow-lg transition-all ${filterEstado === 'En evaluación técnica' ? 'border-[#4A8BDF] shadow-lg' : 'border-gray-200'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Pendientes</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-[#4A8BDF]">{countByStatus.pendientes}</p>
                    </div>
                    <div
                        onClick={() => setFilterEstado('Rechazada por Director UPC')}
                        className={`bg-white rounded-xl border-2 p-6 relative cursor-pointer hover:shadow-lg transition-all ${filterEstado === 'Rechazada por Director UPC' ? 'border-[#F59E0B] shadow-lg' : 'border-gray-200'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Devueltas</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-[#F59E0B]">{countByStatus.devueltas}</p>
                    </div>
                    <div
                        onClick={() => setFilterEstado('En revisión por Director')}
                        className={`bg-white rounded-xl border-2 p-6 relative cursor-pointer hover:shadow-lg transition-all ${filterEstado && filterEstado.toLowerCase().includes('director') && !filterEstado.toLowerCase().includes('rechazada') ? 'border-[#10B981] shadow-lg' : 'border-gray-200'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm text-gray-600">Enviadas a Director</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold text-[#10B981]">{countByStatus.enviadasDirector}</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-700">Filtros</h2>
                        <div className="flex flex-wrap gap-4">
                            <div className="relative w-48">
                                {/* CAMBIO: focus:ring actualizado */}
                                <select
                                    value={filterTipo}
                                    onChange={(e) => setFilterTipo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10 bg-white"
                                    title={filterTipo || "Todos los tipos"}
                                >
                                    <option value="">Todos los tipos</option>
                                    {tiposUnicos.map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>

                            <div className="relative w-56">
                                {/* CAMBIO: focus:ring actualizado */}
                                <select
                                    value={filterEstado}
                                    onChange={(e) => setFilterEstado(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] appearance-none pr-10 bg-white"
                                >
                                    <option value="">Todos los estados</option>
                                    {estadosUnicos.map(estado => (
                                        <option key={estado} value={estado}>{estado}</option>
                                    ))}
                                </select>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>

                            {(filterTipo || filterEstado) && (
                                <button
                                    onClick={handleResetFilters}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabla Desktop */}
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="max-h-[600px] overflow-y-auto">
                            <table className="w-full">
                                <thead className="sticky top-0 z-10">
                                    {/* CAMBIO: Fondo del header de tabla actualizado */}
                                    <tr className="bg-[#4A8BDF]">
                                        <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                                            <SortableHeader columnKey="id">ID</SortableHeader>
                                        </th>
                                        <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                                            <SortableHeader columnKey="fecha_creacion">Fecha</SortableHeader>
                                        </th>
                                        <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                                            <SortableHeader columnKey="nombre_cliente">Solicitante</SortableHeader>
                                        </th>
                                        <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                                            <SortableHeader columnKey="tipo_servicio">Tipo de Servicio</SortableHeader>
                                        </th>
                                        <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                                            <SortableHeader columnKey="estado_actual">Estado</SortableHeader>
                                        </th>
                                        <th className="px-6 py-4 text-left text-white font-semibold text-sm">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingRequests ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex justify-center items-center gap-2">
                                                    {/* CAMBIO: Spinner color actualizado */}
                                                    <svg className="animate-spin h-5 w-5 text-[#4A8BDF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Cargando solicitudes...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : errorRequests ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-red-500">
                                                {errorRequests}
                                            </td>
                                        </tr>
                                    ) : sortedData.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                {filterTipo || filterEstado ? 'No se encontraron solicitudes con los filtros aplicados' : 'No hay solicitudes registradas aún'}
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedData.map(request => (
                                            <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    #{request.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {request.fecha_creacion
                                                        ? new Date(request.fecha_creacion).toLocaleDateString('es-DO', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : '-'
                                                    }
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {request.nombre_cliente || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {request.tipo_servicio || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <BadgeEstado estado={request.estado_actual} />
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex gap-3">
                                                        <button
                                                            /* CAMBIO: Texto del botón actualizado */
                                                            className={`font-medium hover:underline transition-colors ${puedeValidar(request.estado_actual)
                                                                ? 'text-[#4A8BDF] hover:text-[#064175]'
                                                                : 'text-gray-600 hover:text-gray-800'
                                                                }`}
                                                            onClick={() => navigate(`/tecnico-controlados/solicitud/${request.id}`)}
                                                        >
                                                            {puedeValidar(request.estado_actual) ? 'Validar' : 'Ver Detalle'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Cards Mobile */}
                <div className="md:hidden space-y-4">
                    {loadingRequests ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="flex justify-center items-center gap-2">
                                {/* CAMBIO: Spinner color actualizado */}
                                <svg className="animate-spin h-5 w-5 text-[#4A8BDF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cargando...
                            </div>
                        </div>
                    ) : errorRequests ? (
                        <div className="text-center py-12 text-red-500">{errorRequests}</div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {filterTipo || filterEstado ? 'No se encontraron solicitudes' : 'No hay solicitudes registradas'}
                        </div>
                    ) : (
                        filteredRequests.map(request => (
                            <div key={request.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-gray-500">ID</span>
                                        {/* CAMBIO: Usando clase Tailwind en lugar de style inline */}
                                        <span className="font-bold text-sm text-[#4A8BDF]">#{request.id}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-gray-500">Solicitante</span>
                                        <span className="text-sm text-gray-700 text-right">{request.nombre_cliente || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-gray-500">Servicio</span>
                                        <span className="text-sm text-gray-700 text-right">{request.tipo_servicio || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-gray-500">Estado</span>
                                        <BadgeEstado estado={request.estado_actual} />
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-gray-500">Fecha</span>
                                        <span className="text-sm text-gray-700">
                                            {request.fecha_creacion
                                                ? new Date(request.fecha_creacion).toLocaleDateString('es-DO')
                                                : '-'
                                            }
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                        <button
                                            /* CAMBIO: Fondo del botón actualizado */
                                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${puedeValidar(request.estado_actual)
                                                ? 'bg-[#4A8BDF] text-white hover:bg-[#064175]'
                                                : 'bg-gray-500 text-white hover:bg-gray-600'
                                                }`}
                                            onClick={() => navigate(`/tecnico-controlados/solicitud/${request.id}`)}
                                        >
                                            {puedeValidar(request.estado_actual) ? 'Validar' : 'Ver Detalle'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}