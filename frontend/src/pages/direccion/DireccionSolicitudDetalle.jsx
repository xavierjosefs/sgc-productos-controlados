import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import BadgeEstado from '../../components/BadgeEstado';

/**
 * DireccionSolicitudDetalle
 * Pantalla de detalle de solicitud con botones Aprobar/Reprobar
 */
const DireccionSolicitudDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        getDireccionRequestDetail,
        validateDireccionRequest,
        downloadCertificatePDF
    } = useRequestsAPI();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados de modales
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showFormDataModal, setShowFormDataModal] = useState(false);
    const [rejectReasons, setRejectReasons] = useState('');
    const [validating, setValidating] = useState(false);
    const [actionError, setActionError] = useState('');

    // Cargar detalle de solicitud
    const fetchDetail = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Cargando detalle de solicitud ID:', id);
            const data = await getDireccionRequestDetail(id);
            console.log('Datos recibidos:', data);
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

    // Acción de Reprobar
    const executeReject = async () => {
        if (!rejectReasons.trim()) {
            setActionError('Debes ingresar el motivo del rechazo');
            return;
        }
        setValidating(true);
        setActionError('');
        try {
            await validateDireccionRequest(id, 'rechazado_direccion', rejectReasons);

            // Descargar certificado PDF automáticamente
            try {
                await downloadCertificatePDF(id);
            } catch (pdfError) {
                console.error('Error descargando PDF:', pdfError);
                // No bloqueamos la navegación si falla la descarga del PDF
            }

            setShowRejectModal(false);
            navigate('/direccion');
        } catch (err) {
            setActionError(err.message);
            setValidating(false);
        }
    };

    // Acción de Aprobar
    const executeApprove = async () => {
        setValidating(true);
        setActionError('');
        try {
            await validateDireccionRequest(id, 'aprobado_direccion', '');

            // Descargar certificado PDF automáticamente
            try {
                await downloadCertificatePDF(id);
            } catch (pdfError) {
                console.error('Error descargando PDF:', pdfError);
                // No bloqueamos la navegación si falla la descarga del PDF
            }

            setShowApproveModal(false);
            navigate('/direccion');
        } catch (err) {
            setActionError(err.message);
            setValidating(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">{error}</div>;
    if (!request) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Solicitud no encontrada</div>;

    const formData = request.form_data || {};

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/direccion')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-[#4A8BDF]">Solicitud #{request.id}</h1>
                </div>

                {/* Información del Solicitante y Detalles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Información del Solicitante */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-[#4A8BDF] font-bold text-lg mb-6">Información del Solicitante</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Cédula de Identidad o Pasaporte</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.cedula || formData.rnc || formData.rncEmpresa || request.user_id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Nombre del Profesional</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.nombre || formData.nombreEmpresa || request.nombre_cliente || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Exequatur</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.exequatur || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Dirección</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.direccion || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalles de la Solicitud */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-[#4A8BDF] font-bold text-lg mb-6">Detalles de la Solicitud</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Tipo</p>
                                    <p className="text-gray-900 font-medium text-sm">{request.tipo_servicio}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Estado</p>
                                    <BadgeEstado estado={request.estado_actual} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Condición</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.condicion || formData.condicionSolicitud || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Fecha de Creación</p>
                                    <p className="text-gray-900 font-medium text-sm">
                                        {request.fecha_creacion ? new Date(request.fecha_creacion).toLocaleDateString('es-DO') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documentos */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-[#4A8BDF] font-bold text-lg mb-6">Documentos Adjuntos</h2>

                    {/* Botón para ver formulario */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value="Formulario de Solicitud"
                                readOnly
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                            />
                            <button
                                onClick={() => setShowFormDataModal(true)}
                                className="px-6 py-2.5 bg-[#085297] text-white rounded-lg text-sm font-medium hover:bg-[#064073] transition-colors"
                            >
                                Ver
                            </button>
                        </div>
                    </div>

                    {/* Lista de documentos */}
                    {request.documentos && request.documentos.length > 0 ? (
                        <div className="space-y-4">
                            {request.documentos.map((doc, index) => {
                                const docLabel = (doc.tipo_documento || doc.nombre || `Documento ${index + 1}`)
                                    .replace(/_/g, ' ')
                                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                                    .replace(/^./, str => str.toUpperCase());
                                return (
                                    <div key={doc.id} className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={docLabel}
                                            readOnly
                                            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                                        />
                                        {doc.url ? (
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-2.5 bg-[#085297] text-white rounded-lg text-sm font-medium hover:bg-[#064073] transition-colors"
                                            >
                                                Ver
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-xs italic px-6 py-2.5">No enviado</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No hay documentos cargados</p>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/direccion')}
                        className="px-8 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors"
                    >
                        Volver
                    </button>
                    <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                        Reprobar
                    </button>
                    <button
                        onClick={() => setShowApproveModal(true)}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                        Aprobar
                    </button>
                </div>

                {actionError && (
                    <p className="text-red-600 text-sm font-medium text-center mt-4">{actionError}</p>
                )}
            </div>

            {/* Modal de Confirmación de Aprobación */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4 text-center">Confirmar Aprobación</h3>
                        <p className="text-gray-600 text-center mb-8">
                            ¿Desea aprobar y firmar esta solicitud?<br />
                            Una vez aprobada, la solicitud continuará al siguiente paso del proceso.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                disabled={validating}
                                className="flex-1 px-6 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeApprove}
                                disabled={validating}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {validating ? 'Procesando...' : 'Aprobar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Rechazo */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4 text-center">Reprobar Solicitud</h3>
                        <p className="text-gray-600 text-center mb-4">
                            Ingrese el motivo del rechazo:
                        </p>
                        <textarea
                            value={rejectReasons}
                            onChange={(e) => setRejectReasons(e.target.value)}
                            placeholder="Explique por qué se rechaza la solicitud..."
                            className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#4A8BDF] resize-none mb-6"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReasons('');
                                    setActionError('');
                                }}
                                disabled={validating}
                                className="flex-1 px-6 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeReject}
                                disabled={validating || !rejectReasons.trim()}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {validating ? 'Procesando...' : 'Reprobar'}
                            </button>
                        </div>
                        {actionError && (
                            <p className="text-red-600 text-sm font-medium text-center mt-4">{actionError}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Modal de Datos del Formulario */}
            {showFormDataModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#4A8BDF]">Datos del Formulario de Solicitud</h3>
                            <button
                                onClick={() => setShowFormDataModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {(() => {
                            // Función para aplanar campos anidados
                            function flattenFields(obj, prefix = '') {
                                let fields = {};
                                for (const [key, value] of Object.entries(obj || {})) {
                                    if (
                                        value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0
                                    ) {
                                        fields = { ...fields, ...flattenFields(value, prefix + key + '.') };
                                    } else {
                                        fields[prefix + key] = value;
                                    }
                                }
                                return fields;
                            }
                            const allFields = flattenFields(formData);

                            if (Object.entries(allFields).filter(([, value]) => value && value !== '' && value !== null && value !== undefined).length === 0) {
                                return (
                                    <div className="text-center py-12">
                                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Formulario sin completar</h4>
                                        <p className="text-gray-500">
                                            El cliente no ha completado los datos del formulario de solicitud.
                                        </p>
                                    </div>
                                );
                            }

                            return (
                                <div className="space-y-4">
                                    {Object.entries(allFields).map(([key, value]) => {
                                        if (!value || value === '' || value === null || value === undefined) {
                                            return null;
                                        }
                                        const fieldName = key
                                            .replace(/_/g, ' ')
                                            .replace(/\./g, ' ')
                                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                                            .replace(/^./, str => str.toUpperCase());
                                        return (
                                            <div key={key} className="border-b border-gray-200 pb-3">
                                                <p className="text-sm text-gray-500 mb-1">{fieldName}</p>
                                                <p className="text-base text-gray-900 font-medium">{String(value)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowFormDataModal(false)}
                                className="px-6 py-2 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DireccionSolicitudDetalle;
