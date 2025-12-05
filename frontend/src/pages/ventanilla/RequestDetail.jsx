import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import BadgeEstado from '../../components/BadgeEstado';
import ConfirmationModal from '../../components/ConfirmationModal';

const VentanillaRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        getRequestDetail,
        validateRequest
    } = useRequestsAPI();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para validación
    const [validating, setValidating] = useState(false);
    const [comments, setComments] = useState('');

    // Estado del Modal de Confirmación
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        confirmColor: 'blue',
        onConfirm: () => { }
    });

    // Cargar detalle de solicitud
    const fetchDetail = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getRequestDetail(id);
            setRequest(data);
        } catch (error) {
            console.error('Error fetching request detail:', error);
            setError(error?.message || 'No se pudo cargar la solicitud');
            setRequest(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        // eslint-disable-next-line
    }, [id]);

    // Acción Real de Aprobar
    const executeApprove = async () => {
        setValidating(true);
        try {
            await validateRequest(id, 'aprobado_vus', comments);
            // alert('Solicitud validada correctamente'); // Opcional, feedback visual mejorado
            navigate('/ventanilla');
        } catch (err) {
            alert(err.message);
        } finally {
            setValidating(false);
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    // Acción Real de Rechazar
    const executeReject = async () => {
        setValidating(true);
        try {
            await validateRequest(id, 'devuelto_vus', comments);
            navigate('/ventanilla');
        } catch (err) {
            alert(err.message);
        } finally {
            setValidating(false);
            setModalConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    // Manejar Click en Validar
    const handleApprove = () => {
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Validación',
            message: '¿Estás seguro de que deseas validar esta solicitud? Se notificará al usuario y el proceso avanzará a la siguiente etapa.',
            confirmText: 'Validar Solicitud',
            confirmColor: 'green',
            onConfirm: executeApprove
        });
    };

    // Manejar Click en Devolver
    const handleReject = () => {
        if (!comments.trim()) {
            alert("Debes ingresar los comentarios o razones de la devolución.");
            return;
        }
        setModalConfig({
            isOpen: true,
            title: 'Confirmar Devolución',
            message: '¿Estás seguro de que deseas devolver esta solicitud? Se enviará un correo al usuario con las observaciones ingresadas.',
            confirmText: 'Devolver Solicitud',
            confirmColor: 'red',
            onConfirm: executeReject
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">{error}</div>;
    if (!request) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Solicitud no encontrada</div>;

    const formData = request.form_data || {};

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12 font-sans text-gray-600">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header simple y limpio */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/ventanilla')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#4A8BDF] hover:border-[#4A8BDF] transition-all shadow-sm"
                        title="Volver"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">Solicitud #{request.id}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="font-medium">{new Date(request.fecha_creacion).toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600">{request.tipo_servicio}</span>
                        </div>
                    </div>
                    <div className="ml-auto">
                        <BadgeEstado estado={request.estado_actual} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna Principal: Información y Documentos */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Tarjeta de Información del Solicitante */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Información del Solicitante</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1.5">Nombre / Razón Social</label>
                                        <div className="text-gray-900 font-semibold text-base">{formData.nombre || formData.nombreEmpresa || request.nombre_cliente}</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1.5">Identificación</label>
                                        <div className="text-gray-900 font-medium">{formData.cedula || formData.rnc || formData.rncEmpresa || '-'}</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1.5">Contacto</label>
                                        <div className="text-gray-900 font-medium">{formData.celular || formData.telefono || '-'}</div>
                                        <div className="text-gray-500 text-sm mt-0.5">{formData.email || formData.correoEmpresa || '-'}</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1.5">Dirección</label>
                                        <div className="text-gray-900 text-sm leading-relaxed">{formData.direccion || formData.direccionCamaPostal || '-'}</div>
                                    </div>

                                    {/* Campos específicos */}
                                    {formData.exequatur && (
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1.5">Exequátur</label>
                                            <div className="text-gray-900 font-medium">{formData.exequatur}</div>
                                        </div>
                                    )}
                                    {formData.colegiatura && (
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1.5">Colegiatura</label>
                                            <div className="text-gray-900 font-medium">{formData.colegiatura}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Detalles Específicos (Condicional) */}
                        {(formData.nombreRegente || formData.condicionSolicitud || formData.condicion) && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40">
                                    <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Detalles Adicionales</h2>
                                </div>
                                <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-8">
                                    {formData.nombreRegente && (
                                        <div className="col-span-2">
                                            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                </div>
                                                Regente Farmacéutico
                                            </h3>
                                            <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-xs text-gray-400 uppercase font-medium block mb-1">Nombre</span>
                                                    <span className="font-medium text-gray-900">{formData.nombreRegente}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-400 uppercase font-medium block mb-1">Exequátur</span>
                                                    <span className="font-medium text-gray-900">{formData.exequaturRegente}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {(formData.condicionSolicitud || formData.condicion) && (
                                        <div className="col-span-2">
                                            <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium mb-1.5">Condición de la Solicitud</label>
                                            <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100">
                                                {formData.condicionSolicitud || formData.condicion}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tarjeta de Documentos */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Documentos Adjuntos</h2>
                                <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{request.documentos?.length || 0}</span>
                            </div>
                            <div className="p-4">
                                {request.documentos && request.documentos.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {request.documentos.map(doc => (
                                            <div key={doc.id} className="group flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200">
                                                <div className="w-10 h-10 rounded-lg bg-red-50 flex flex-shrink-0 items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5" title={doc.nombre_archivo || doc.nombre}>
                                                        {doc.nombre_archivo || doc.nombre || 'Documento'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">{doc.tipo_documento || doc.tipo}</p>
                                                </div>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver documento"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-500">No hay documentos adjuntos</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Columna Lateral: Evaluación */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#4A8BDF]/5 to-transparent">
                                <h2 className="font-bold text-[#4A8BDF] flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Evaluación
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <label htmlFor="comments" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Observaciones / Comentarios
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="comments"
                                            rows={8}
                                            className="block w-full px-4 py-3 rounded-xl border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[#4A8BDF] focus:ring-2 focus:ring-[#4A8BDF]/20 text-sm resize-none transition-all shadow-sm"
                                            placeholder="Indique los documentos faltantes, correcciones necesarias o notas de aprobación..."
                                            value={comments}
                                            onChange={(e) => setComments(e.target.value)}
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none bg-white/50 px-1 rounded">
                                            {comments.length}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        Requerido para devolver la solicitud
                                    </p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <button
                                        onClick={handleApprove}
                                        disabled={validating}
                                        className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                    >
                                        {!validating ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                VALIDAR (CUMPLE)
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleReject}
                                        disabled={validating || !comments.trim()}
                                        className={`w-full py-3.5 px-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${!comments.trim()
                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                : 'bg-white text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 hover:text-red-700 hover:shadow-lg hover:shadow-red-50 transform hover:-translate-y-0.5'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                        </svg>
                                        DEVOLVER (NO CUMPLE)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                confirmColor={modalConfig.confirmColor}
                loading={validating}
            />
        </div>
    );
};

export default VentanillaRequestDetail;
