
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Función para formatear nombres de campos (igual que en técnico)
function formatearNombreCampo(texto) {
    let result = texto.replace(/([a-z])([A-Z])/g, '$1 $2');
    result = result.replace(/([a-zA-Z])([0-9])/g, '$1 $2');
    result = result.replace(/[_-]/g, ' ');
    result = result.split(' ').map(palabra => {
        if (palabra.length === 0) return palabra;
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    }).join(' ');
    return result;
}

function DirectorTecnicoSolicitudDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successType, setSuccessType] = useState('');
    const [validating, setValidating] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchDetail();
        // eslint-disable-next-line
    }, [id]);

    const fetchDetail = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/api/director-upc/requests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequest(response.data.detalle);
        } catch (error) {
            console.error('Error al cargar detalle:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectClick = () => {
        if (!comments.trim()) {
            setErrorMessage('El comentario es obligatorio para devolver la solicitud');
            return;
        }
        setErrorMessage('');
        setShowRejectModal(true);
    };

    const handleApproveClick = () => {
        setErrorMessage('');
        setShowApproveModal(true);
    };

    const executeReject = async () => {
        setValidating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:8000/api/director-upc/requests/${id}/decision`,
                {
                    decision: 'RECHAZAR',
                    comentario: comments
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowRejectModal(false);
            setSuccessType('devuelta');
            setShowSuccessModal(true);
        } catch (err) {
            alert(err.response?.data?.error || 'Error al devolver la solicitud');
            setValidating(false);
            setShowRejectModal(false);
        }
    };

    const executeApprove = async () => {
        setValidating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:8000/api/director-upc/requests/${id}/decision`,
                {
                    decision: 'APROBAR',
                    comentario: comments || ''
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowApproveModal(false);
            setSuccessType('aprobada');
            setShowSuccessModal(true);
        } catch (err) {
            alert(err.response?.data?.error || 'Error al aprobar la solicitud');
            setValidating(false);
            setShowApproveModal(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#085297] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando solicitud...</p>
                </div>
            </div>
        );
    }

    if (!request) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">No se encontró la solicitud</p>
            </div>
        );
    }

    const tecnicoValidation = request.validaciones_tecnico || {};
    // Usar los datos planos del request si no hay arrays especiales
    const formData = request.form_data || {};
    const documentos = request.documentos || [];
    // Estado de validación del formulario (booleano o null)
    // const formularioCumple = tecnicoValidation.formulario_estado;
    // Validaciones por campo (si existen)
    const camposValidaciones = tecnicoValidation.formulario_detalle || {};

    // Estado visual: mostrar solo "Aprobada" o "Rechazada" según recomendacion_tecnico si existe
    let estadoVisual = '';
    let estadoColor = '';
    const recomendacion = tecnicoValidation.recomendacion;
    if (typeof recomendacion !== 'undefined' && recomendacion !== null) {
        if (recomendacion === true || recomendacion === 1 || recomendacion === 'true' || recomendacion === 'APROBADO') {
            estadoVisual = 'Aprobada';
            estadoColor = 'bg-green-100 text-green-800';
        } else {
            estadoVisual = 'Rechazada';
            estadoColor = 'bg-orange-100 text-orange-800';
        }
    } else if (request.estado_actual?.toLowerCase().includes('rechazada')) {
        estadoVisual = 'Rechazada';
        estadoColor = 'bg-orange-100 text-orange-800';
    } else if (request.estado_actual?.toLowerCase().includes('aprobada')) {
        estadoVisual = 'Aprobada';
        estadoColor = 'bg-green-100 text-green-800';
    } else {
        estadoVisual = request.estado_actual || '-';
        estadoColor = 'bg-blue-100 text-blue-800';
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/director-tecnico')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-bold text-[#4A8BDF]">Solicitud #{request.codigo || request.id}</h1>
            </div>

            {/* Cards de Información */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Información del Solicitante */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Solicitante</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Cédula de Identidad o RNC</p>
                            <p className="text-sm font-medium text-gray-900">{request.cedula_rnc || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Nombre del Profesional</p>
                            <p className="text-sm font-medium text-gray-900">{request.nombre_solicitante || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                            <p className="text-sm font-medium text-gray-900">{request.telefono || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Dirección</p>
                            <p className="text-sm font-medium text-gray-900">{request.direccion || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Detalles de la Solicitud */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Solicitud</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Tipo</p>
                            <p className="text-sm font-medium text-gray-900">{request.tipo_servicio || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Condición</p>
                            <p className="text-sm font-medium text-gray-900">{request.condicion || 'Nueva'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Estado</p>
                            <p className="text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColor}`}>
                                    {estadoVisual}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Evaluación del Técnico (solo lectura, igual a técnico) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Evaluación del Técnico</h2>
                {/* Formulario validado por el técnico */}
                <div className="mb-8">
                    <div className="border-b border-gray-200 pb-2 mb-4">
                        <h3 className="text-base font-bold text-[#4A8BDF]">Datos del Formulario</h3>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        {formData && typeof formData === 'object' && Object.keys(formData).length > 0 ? (
                            <table className="w-full text-left">
                                <tbody>
                                    {Object.entries(formData).map(([key, value]) => (
                                        typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                                            Object.entries(value).map(([subKey, subValue]) => {
                                                const campoKey = `${key}-${subKey}`;
                                                const validacion = camposValidaciones[campoKey];
                                                let estado = 'Sin validar', color = 'bg-gray-100 text-gray-500';
                                                if (validacion === true || validacion === 'APROBADO') { estado = 'Sí Cumple'; color = 'bg-green-100 text-green-700'; }
                                                else if (validacion === false || validacion === 'RECHAZADO') { estado = 'No Cumple'; color = 'bg-orange-100 text-orange-700'; }
                                                return (
                                                    <tr key={campoKey} className="border-b border-gray-200 last:border-0">
                                                        <td className="py-3 pr-6 font-semibold text-gray-600 w-1/4">{formatearNombreCampo(subKey)}</td>
                                                        <td className="py-3 text-gray-800 w-1/2">{String(subValue)}</td>
                                                        <td className="py-3 w-1/4">
                                                            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${color}`}>{estado}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            (() => {
                                                const campoKey = key;
                                                const validacion = camposValidaciones[campoKey];
                                                let estado = 'Sin validar', color = 'bg-gray-100 text-gray-500';
                                                if (validacion === true || validacion === 'APROBADO') { estado = 'Sí Cumple'; color = 'bg-green-100 text-green-700'; }
                                                else if (validacion === false || validacion === 'RECHAZADO') { estado = 'No Cumple'; color = 'bg-orange-100 text-orange-700'; }
                                                return (
                                                    <tr key={campoKey} className="border-b border-gray-200 last:border-0">
                                                        <td className="py-3 pr-6 font-semibold text-gray-600 w-1/4">{formatearNombreCampo(key)}</td>
                                                        <td className="py-3 text-gray-800 w-1/2">{String(value)}</td>
                                                        <td className="py-3 w-1/4">
                                                            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${color}`}>{estado}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })()
                                        )
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-gray-500">No hay datos de formulario validados por el técnico.</div>
                        )}
                    </div>
                </div>

                {/* Documentos validados por el técnico */}
                <div className="mb-8">
                    <div className="border-b border-gray-200 pb-2 mb-4">
                        <h3 className="text-base font-bold text-[#4A8BDF]">Documentación Requerida</h3>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        {Array.isArray(documentos) && documentos.length > 0 ? (
                            <div className="space-y-6">
                                {documentos.map((doc, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-b pb-3 last:border-b-0">
                                        <div className="flex-1 font-semibold mb-2" style={{ color: '#4A8BDF' }}>{formatearNombreCampo(doc.nombre_descriptivo || doc.tipo_documento || doc.nombre || `Documento ${idx+1}`)}</div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={doc.nombre_archivo || doc.nombre || ''}
                                                readOnly
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {doc.url && (
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors"
                                                >
                                                    Ver
                                                </a>
                                            )}
                                            <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                                doc.estado === 'APROBADO' ? 'bg-green-100 text-green-700' :
                                                doc.estado === 'RECHAZADO' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-500'}`}
                                            >
                                                {doc.estado === 'APROBADO' ? 'Sí Cumple' : doc.estado === 'RECHAZADO' ? 'No Cumple' : 'Sin validar'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500">No hay documentos validados por el técnico.</div>
                        )}
                    </div>
                </div>

                {/* Comentario del Técnico */}
                <div>
                    <p className="text-gray-700 font-medium text-sm mb-3">Comentario del Técnico</p>
                    <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm min-h-[100px]">
                        {tecnicoValidation.comentarios || 'Sin comentario.'}
                    </div>
                </div>
            </div>

            {/* Comentario de Director */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Comentario de Director</h2>
                <textarea
                    value={comments}
                    onChange={(e) => {
                        setComments(e.target.value);
                        setErrorMessage('');
                    }}
                    placeholder="Justifique"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4A8BDF] resize-none"
                    rows="5"
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-4">
                <button
                    onClick={handleRejectClick}
                    disabled={validating}
                    className="px-8 py-3 bg-[#A8C5E2] text-[#085297] rounded-lg font-medium hover:bg-[#8FB0D0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Devolver
                </button>
                <button
                    onClick={handleApproveClick}
                    disabled={validating}
                    className="px-8 py-3 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Aprobar
                </button>
            </div>

            {/* Modal Confirmar Devolución */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4">Confirmar Devolución</h3>
                        <p className="text-gray-700 mb-6">
                            ¿Desea devolver esta solicitud al Técnico para una reevaluación?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={validating}
                                className="px-6 py-2.5 bg-[#A8C5E2] text-[#085297] rounded-lg font-medium hover:bg-[#8FB0D0] transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeReject}
                                disabled={validating}
                                className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors disabled:opacity-50"
                            >
                                {validating ? 'Procesando...' : 'Devolver'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Aprobación */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4">Confirmar Aprobación</h3>
                        <p className="text-gray-700 mb-6">
                            ¿Desea aprobar esta solicitud y remitirla al Director General para su firma final?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                disabled={validating}
                                className="px-6 py-2.5 bg-[#A8C5E2] text-[#085297] rounded-lg font-medium hover:bg-[#8FB0D0] transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeApprove}
                                disabled={validating}
                                className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors disabled:opacity-50"
                            >
                                {validating ? 'Procesando...' : 'Aprobar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-[#4A8BDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#4A8BDF] mb-3">
                            {successType === 'devuelta' ? 'Solicitud Devuelta' : 'Solicitud Aprobada'}
                        </h3>
                        <p className="text-gray-700 mb-6">
                            {successType === 'devuelta'
                                ? 'Solicitud devuelta correctamente. El Técnico procederá con la revisión.'
                                : 'La solicitud ha sido aprobada y enviada al Director General para firma.'
                            }
                        </p>
                        <button
                            onClick={() => navigate('/director-tecnico')}
                            className="w-full px-6 py-3 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors"
                        >
                            Ir a "Solicitudes"
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DirectorTecnicoSolicitudDetalle;
