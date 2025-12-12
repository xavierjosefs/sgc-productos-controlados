import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * DireccionSolicitudDetalle
 * Vista de detalle de solicitud para Dirección con opciones de Aprobar/Rechazar
 */
export default function DireccionSolicitudDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successAction, setSuccessAction] = useState('');
    const [comentario, setComentario] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/direccion/requests/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            if (data.ok) {
                setRequest(data.detalle);
            } else {
                toast.error(data.error || 'Error al cargar solicitud');
            }
        } catch (error) {
            console.error('Error al cargar solicitud:', error);
            toast.error('Error al cargar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = () => {
        setShowRejectModal(true);
    };

    const handleApprove = () => {
        setShowApproveModal(true);
    };

    const executeReject = async () => {
        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/direccion/requests/${id}/decision`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    decision: 'RECHAZAR',
                    comentario: ''
                })
            });

            const data = await response.json();
            if (data.ok) {
                setShowRejectModal(false);
                setSuccessAction('Rechazada');
                setShowSuccessModal(true);
            } else {
                toast.error(data.error || 'Error al rechazar solicitud');
            }
        } catch (error) {
            console.error('Error al rechazar:', error);
            toast.error('Error al rechazar la solicitud');
        } finally {
            setProcessing(false);
        }
    };

    const executeApprove = async () => {
        setProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/api/direccion/requests/${id}/decision`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    decision: 'APROBAR',
                    comentario: comentario || ''
                })
            });

            const data = await response.json();
            if (data.ok) {
                setShowApproveModal(false);
                setSuccessAction('Aprobada');
                setShowSuccessModal(true);
            } else {
                toast.error(data.error || 'Error al aprobar solicitud');
            }
        } catch (error) {
            console.error('Error al aprobar:', error);
            toast.error('Error al aprobar la solicitud');
        } finally {
            setProcessing(false);
        }
    };

    const goToSolicitudes = () => {
        navigate('/direccion');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Cargando...</div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Solicitud no encontrada</div>
            </div>
        );
    }

    // Determinar si está aprobada o rechazada
    const isApproved = request.estado_id === 8;
    const isRejected = request.estado_id === 18;
    const isPending = request.estado_id === 7;

    return (
        <div className="max-w-[1400px] mx-auto px-8 py-8">
            {/* Header con botón volver */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/direccion')}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-[#4A8BDF]">Solicitud #{id}</h1>
            </div>

            {/* Título completo de la solicitud */}
            {request.tipo_servicio && (
                <h2 className="text-2xl font-bold text-[#4A8BDF] mb-8">
                    {request.tipo_servicio}
                </h2>
            )}

            {/* Sección de Documento */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="text-[#4A8BDF] font-bold text-lg mb-4">Documento</h3>
                        
                        {/* Badge de estado solo si está aprobada o rechazada */}
                        {(isApproved || isRejected) && (
                            <div className="mb-6">
                                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                                    isApproved 
                                        ? 'bg-green-50 text-green-600 border-green-200' 
                                        : 'bg-orange-50 text-orange-600 border-orange-200'
                                }`}>
                                    {isApproved ? 'Aprobada' : 'Rechazada'}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                value={`Solicitud de ${request.tipo_servicio || 'Certificado'}.pdf`}
                                readOnly
                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700"
                            />
                            <button
                                onClick={() => {
                                    // Abrir el PDF de la plantilla
                                    const pdfUrl = `http://localhost:8000/api/direccion/certificate/${id}`;
                                    window.open(pdfUrl, '_blank');
                                }}
                                className="px-8 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064078] transition-colors"
                            >
                                Ver
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción solo si está pendiente */}
            {isPending && (
                <div className="flex justify-center gap-6">
                    <button
                        onClick={handleReject}
                        disabled={processing}
                        className="px-12 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors disabled:opacity-50"
                    >
                        Rechazar
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="px-12 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064078] transition-colors disabled:opacity-50"
                    >
                        Aprobar
                    </button>
                </div>
            )}

            {/* Modal de Rechazo */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4 text-center">Confirmar Rechazo</h3>
                        <p className="text-gray-600 text-center mb-8">
                            ¿Está seguro de que desea rechazar esta solicitud?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setComentario('');
                                }}
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeReject}
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064078] transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Procesando...' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Aprobación */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4 text-center">Confirmar Aprobación</h3>
                        <p className="text-gray-600 text-center mb-8">
                            ¿Está seguro de que desea aprobar esta solicitud?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeApprove}
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064078] transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Procesando...' : 'Aprobar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
                        <h3 className="text-2xl font-bold text-[#4A8BDF] mb-6">Solicitud {successAction}</h3>
                        
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-[#4A8BDF] flex items-center justify-center">
                            <Check className="w-12 h-12 text-[#4A8BDF]" strokeWidth={3} />
                        </div>

                        <p className="text-gray-600 mb-8">
                            La solicitud se ha firmado correctamente
                        </p>

                        <button
                            onClick={goToSolicitudes}
                            className="w-full px-6 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064078] transition-colors"
                        >
                            Ir a &quot;Solicitudes&quot;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
