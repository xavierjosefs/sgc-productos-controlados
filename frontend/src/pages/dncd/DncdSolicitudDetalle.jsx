import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import DncdTopbar from '../../components/DncdTopbar';
import useRequestsAPI from '../../hooks/useRequestsAPI';

/**
 * DncdSolicitudDetalle
 * Vista de detalle de solicitud para DNCD con acceso al PDF del certificado
 */
export default function DncdSolicitudDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const { getDncdRequestDetail } = useRequestsAPI();

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const data = await getDncdRequestDetail(id);
                if (data?.ok && data.detalle) {
                    setRequest(data.detalle);
                } else if (data?.detalle) {
                    setRequest(data.detalle);
                } else {
                    setRequest(data);
                }
            } catch (error) {
                console.error('Error al cargar solicitud:', error);
                toast.error(error?.message || 'Error al cargar la solicitud');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const verCertificado = async () => {
        const token = localStorage.getItem('token');

        const response = await fetch(
            `http://localhost:8000/api/dncd/certificate/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            toast.error('No autorizado para ver el certificado');
            return;
        }

        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DncdTopbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-gray-500">Cargando...</div>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DncdTopbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-gray-500">Solicitud no encontrada</div>
                </div>
            </div>
        );
    }

    // Determinar estado
    // Estado 10: Aprobada
    // Estado 18: Rechazada
    const isApproved = request.estado_id === 10;
    const isRejected = request.estado_id === 18;

    return (
        <div className="min-h-screen bg-gray-50">
            <DncdTopbar />
            <div className="max-w-[1400px] mx-auto px-8 py-8">
                {/* Header con botón volver */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dncd')}
                        className="focus:outline-none group"
                        aria-label="Volver"
                    >
                        <ArrowLeft className="w-7 h-7 text-[#085297] cursor-pointer group-hover:scale-110 transition-transform" />
                    </button>
                    <h1 className="text-3xl font-bold text-[#4A8BDF]">Solicitud #{id}</h1>
                </div>

                {/* Información del cliente */}
                {request.cliente && (
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 max-w-xl mx-auto shadow-sm mb-6">
                        <h3 className="text-[#4A8BDF] font-bold text-lg mb-4">Información del Solicitante</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nombre:</span>
                                <span className="font-medium">{request.cliente.nombre}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Cédula:</span>
                                <span className="font-medium">{request.cliente.cedula}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tipo de Servicio:</span>
                                <span className="font-medium">{request.tipo_servicio}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Condición:</span>
                                <span className="font-medium">{request.tipo_solicitud}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fecha:</span>
                                <span className="font-medium">
                                    {new Date(request.fecha_creacion).toLocaleDateString('es-DO', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sección de Documento */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 max-w-xl mx-auto shadow-sm mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[#4A8BDF] font-bold text-lg">Documento</h3>
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${isApproved
                                    ? 'bg-green-50 text-green-600 border-green-200'
                                    : 'bg-orange-50 text-orange-600 border-orange-200'
                                    }`}>
                                    {isApproved ? 'Aprobada' : 'Rechazada'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={`Solicitud de ${request.tipo_servicio || 'Certificado'}.pdf`}
                                    readOnly
                                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700"
                                />
                                <button
                                    onClick={verCertificado}
                                    className="px-8 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064078] transition-colors"
                                >
                                    Ver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón para volver */}
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate('/dncd')}
                        className="px-12 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors"
                    >
                        Volver a Solicitudes
                    </button>
                </div>
            </div>
        </div>
    );
}
