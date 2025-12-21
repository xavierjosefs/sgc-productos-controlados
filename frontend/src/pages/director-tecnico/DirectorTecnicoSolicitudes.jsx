import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSortableTable from '../../hooks/useSortableTable';



function DirectorTecnicoSolicitudes() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTipo, setFilterTipo] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [appliedFilterTipo, setAppliedFilterTipo] = useState('');
    const [appliedFilterEstado, setAppliedFilterEstado] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/director-upc/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data.requests);
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleFilter = () => {
        setAppliedFilterTipo(filterTipo);
        setAppliedFilterEstado(filterEstado);
    };

    // Solo mostrar tipos de solicitud que existen en los datos
    const tiposUnicos = Array.from(new Set(requests.map(r => r.tipo_servicio))).filter(Boolean);

    const filteredRequests = requests.filter(req => {
        const matchesTipo = !appliedFilterTipo || req.tipo_servicio === appliedFilterTipo;
        // Estado visual: solo 'Aprobado' (estado_id 7) y 'Pendiente' (estado_id 6)
        let estadoVisual = req.estado_id === 7 ? 'Aprobado' : 'Pendiente';
        const matchesEstado = !appliedFilterEstado || estadoVisual === appliedFilterEstado;
        return matchesTipo && matchesEstado;
    });


    // Las pendientes son las que vienen del backend (estado 6)
    const pendientesCount = requests.filter(r => r.estado_id === 6).length;
    // Las aprobadas son solo las que el director mandó a dirección (estado 7)
    const aprobadasCount = requests.filter(r => r.estado_id === 7).length;

    // Hook para ordenamiento de tabla
    const { sortedData, SortableHeader } = useSortableTable(filteredRequests, { key: 'id', direction: 'desc' });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#085297] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Gestión de Solicitudes</h1>

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Card Pendientes */}
                <button
                    type="button"
                    className={`group bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left transition ring-2 ring-transparent flex flex-col justify-between h-full cursor-pointer hover:shadow-lg hover:bg-blue-50 ${appliedFilterEstado === 'Pendiente' ? 'ring-[#085297] bg-blue-50' : ''}`}
                    style={{ minHeight: 140 }}
                    onClick={() => {
                        setAppliedFilterEstado('Pendiente');
                        setAppliedFilterTipo('');
                    }}
                >
                    <div className="flex items-start justify-between w-full mb-2">
                        <span className="text-base font-medium text-black">Pendientes</span>
                        <span className="inline-flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
                                <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="#085297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.5 2.5H17.5V7.5" stroke="#085297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.33398 11.6667L17.5007 2.5" stroke="#085297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                    <div>
                        <span className="text-5xl font-bold" style={{ color: '#7BA9E6' }}>{pendientesCount}</span>
                    </div>
                </button>

                {/* Card Aprobadas */}
                <button
                    type="button"
                    className={`group bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left transition ring-2 ring-transparent flex flex-col justify-between h-full cursor-pointer hover:shadow-lg hover:bg-green-50 ${appliedFilterEstado === 'Aprobado' ? 'ring-[#085297] bg-green-50' : ''}`}
                    style={{ minHeight: 140 }}
                    onClick={() => {
                        setAppliedFilterEstado('Aprobado');
                        setAppliedFilterTipo('');
                    }}
                >
                    <div className="flex items-start justify-between w-full mb-2">
                        <span className="text-base font-medium text-black">Aprobadas</span>
                        <span className="inline-flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
                                <path d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667" stroke="#085297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.5 2.5H17.5V7.5" stroke="#085297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.33398 11.6667L17.5007 2.5" stroke="#085297" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                    <div>
                        <span className="text-5xl font-bold" style={{ color: '#4FC37B' }}>{aprobadasCount}</span>
                    </div>
                </button>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Filtros */}
                <form className="flex flex-wrap justify-end gap-4 mb-6 items-end" onSubmit={e => { e.preventDefault(); handleFilter(); }}>
                    <div className="w-full sm:w-64">
                        <select
                            value={filterTipo}
                            onChange={e => setFilterTipo(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A8BDF]"
                        >
                            <option value="">Tipo</option>
                            {tiposUnicos.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full sm:w-64">
                        <select
                            value={filterEstado}
                            onChange={e => setFilterEstado(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A8BDF]"
                        >
                            <option value="">Estado</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors"
                    >
                        Filtrar
                    </button>
                    {(filterTipo || filterEstado || appliedFilterEstado) && (
                        <button
                            type="button"
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            onClick={() => {
                                setFilterTipo('');
                                setFilterEstado('');
                                setAppliedFilterTipo('');
                                setAppliedFilterEstado('');
                            }}
                        >
                            Limpiar
                        </button>
                    )}
                </form>

                {/* Tabla */}
                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#4A8BDF]">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                                    <SortableHeader columnKey="id">CÓDIGO</SortableHeader>
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                                    <SortableHeader columnKey="fecha_creacion">FECHA CREACIÓN</SortableHeader>
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                                    <SortableHeader columnKey="cliente_nombre">SOLICITANTE</SortableHeader>
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                                    <SortableHeader columnKey="tipo_servicio">TIPO DE SERVICIO</SortableHeader>
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">
                                    <SortableHeader columnKey="estado_id">ESTADO</SortableHeader>
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedData.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {request.fecha_creacion ? new Date(request.fecha_creacion).toLocaleDateString('es-ES') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.cliente_nombre || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.tipo_servicio || '-'}</td>
                                    {/* columna de recomendación técnico eliminada, solo queda estado */}
                                    <td className="px-6 py-4 text-sm">
                                        {request.estado_id === 7 ? (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Aprobado</span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => navigate(`/director-tecnico/solicitud/${request.id}`)}
                                            className={`text-[#4A8BDF] hover:text-[#085297] font-medium ${request.estado_id === 7 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                            disabled={request.estado_id === 7}
                                        >
                                            Validar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No hay solicitudes para mostrar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DirectorTecnicoSolicitudes;
