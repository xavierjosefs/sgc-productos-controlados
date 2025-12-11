import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            const response = await axios.get('http://localhost:8000/api/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
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

    const filteredRequests = requests.filter(req => {
        const estadoLower = req.estado_actual?.toLowerCase() || '';
        
        // Director Técnico solo ve solicitudes "En evaluación técnica"
        if (estadoLower !== 'en evaluación técnica') {
            return false;
        }

        const matchesTipo = !appliedFilterTipo || req.tipo_servicio === appliedFilterTipo;
        const matchesEstado = !appliedFilterEstado || req.estado_actual === appliedFilterEstado;

        return matchesTipo && matchesEstado;
    });

    const pendientesCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'en evaluación técnica'
    ).length;

    const aprobadasCount = requests.filter(r => 
        r.estado_actual?.toLowerCase() === 'aprobada por director técnico'
    ).length;

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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Pendientes</p>
                            <p className="text-4xl font-bold text-[#4A8BDF]">{pendientesCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#4A8BDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Aprobadas</p>
                            <p className="text-4xl font-bold text-green-600">{aprobadasCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Filtros */}
                <div className="flex justify-end gap-4 mb-6">
                    <select
                        value={filterTipo}
                        onChange={(e) => setFilterTipo(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A8BDF]"
                    >
                        <option value="">Tipo</option>
                        <option value="Solicitud de Certificado de Inscripción de Drogas Controladas Clase A">Clase A</option>
                        <option value="Solicitud de Certificado de Inscripción de Drogas Controladas Clase B">Clase B</option>
                        <option value="Solicitud de Certificado de Inscripción de Drogas Controladas Clase B Capa C">Clase B Capa C</option>
                    </select>

                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4A8BDF]"
                    >
                        <option value="">Estado</option>
                        <option value="En evaluación técnica">En evaluación técnica</option>
                    </select>

                    <button
                        onClick={handleFilter}
                        className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors"
                    >
                        Filtrar
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#4A8BDF]">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">CÓDIGO</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">FECHA CREACIÓN</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">SOLICITANTE</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">TIPO DE SERVICIO</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white">ESTADO</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-white"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.codigo || request.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {request.created_at ? new Date(request.created_at).toLocaleDateString('es-ES') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.nombre_solicitante || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.tipo_servicio || '-'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {request.estado_actual}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => navigate(`/director-tecnico/solicitud/${request.id}`)}
                                            className="text-[#4A8BDF] hover:text-[#085297] font-medium"
                                        >
                                            {request.estado_actual?.toLowerCase() === 'en evaluación técnica' ? 'Validar' : 'Ver Detalle'}
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
