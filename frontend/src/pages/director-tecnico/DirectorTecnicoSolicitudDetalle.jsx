import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            const response = await axios.get(`http://localhost:8000/api/requests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequest(response.data);
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
                `http://localhost:8000/api/requests/${id}/validate-director-tecnico`,
                {
                    accion: 'devuelto_tecnico',
                    comentarios: comments
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowRejectModal(false);
            setSuccessType('devuelta');
            setShowSuccessModal(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error al devolver la solicitud');
            setValidating(false);
            setShowRejectModal(false);
        }
    };

    const executeApprove = async () => {
        setValidating(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:8000/api/requests/${id}/validate-director-tecnico`,
                {
                    accion: 'aprobado_director_tecnico',
                    comentarios: comments || ''
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowApproveModal(false);
            setSuccessType('aprobada');
            setShowSuccessModal(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Error al aprobar la solicitud');
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
    const formularioEstado = tecnicoValidation.formulario_estado;
    const documentosValidados = tecnicoValidation.documentos_validados || {};

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
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    request.estado_actual?.toLowerCase().includes('rechazada')
                                        ? 'bg-orange-100 text-orange-800'
                                        : request.estado_actual?.toLowerCase().includes('aprobada')
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {request.estado_actual}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Evaluación del Técnico */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Evaluación del Técnico</h2>

                <div className="space-y-6">
                    {/* Formulario de Solicitud de Inscripción */}
                    <div>
                        <p className="text-gray-700 font-medium text-sm mb-3">Formulario de Solicitud de Inscripción de Drogas Controladas Clase A</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value="Formulario de Solicitud"
                                readOnly
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                            />
                            <button className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors">
                                Ver
                            </button>
                            <div className="flex items-center gap-2 ml-2">
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    formularioEstado === true
                                        ? 'bg-green-100 text-green-700'
                                        : formularioEstado === false
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {formularioEstado === true ? 'Sí Cumple' : formularioEstado === false ? 'No Cumple' : 'Sin validar'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cálculo de Cantidad y Pacientes */}
                    <div>
                        <p className="text-gray-700 font-medium text-sm mb-3">Cálculo de Cantidad y Pacientes</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value="Cedulario"
                                readOnly
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                            />
                            <button className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors">
                                Ver
                            </button>
                            <div className="flex items-center gap-2 ml-2">
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    documentosValidados['Cedulario'] === true
                                        ? 'bg-green-100 text-green-700'
                                        : documentosValidados['Cedulario'] === false
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {documentosValidados['Cedulario'] === true ? 'Sí Cumple' : documentosValidados['Cedulario'] === false ? 'No Cumple' : 'Sin validar'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Hoja Solicitante y/o Especialidad */}
                    <div>
                        <p className="text-gray-700 font-medium text-sm mb-3">Hoja Solicitante y/o Especialidad</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value="Exequatur"
                                readOnly
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                            />
                            <button className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors">
                                Ver
                            </button>
                            <div className="flex items-center gap-2 ml-2">
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    documentosValidados['Exequatur'] === true
                                        ? 'bg-green-100 text-green-700'
                                        : documentosValidados['Exequatur'] === false
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {documentosValidados['Exequatur'] === true ? 'Sí Cumple' : documentosValidados['Exequatur'] === false ? 'No Cumple' : 'Sin validar'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Fotocopia */}
                    <div>
                        <p className="text-gray-700 font-medium text-sm mb-3">Fotocopia</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value="Paseprint.pdf"
                                readOnly
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                            />
                            <button className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors">
                                Ver
                            </button>
                            <div className="flex items-center gap-2 ml-2">
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    documentosValidados['Paseprint'] === true
                                        ? 'bg-green-100 text-green-700'
                                        : documentosValidados['Paseprint'] === false
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {documentosValidados['Paseprint'] === true ? 'Sí Cumple' : documentosValidados['Paseprint'] === false ? 'No Cumple' : 'Sin validar'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recibida Especial del Pago */}
                    <div>
                        <p className="text-gray-700 font-medium text-sm mb-3">Recibida Especial del Pago</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value="Pagopadf"
                                readOnly
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg bg-white text-gray-700 text-sm"
                            />
                            <button className="px-6 py-2.5 bg-[#085297] text-white rounded-lg font-medium hover:bg-[#064073] transition-colors">
                                Ver
                            </button>
                            <div className="flex items-center gap-2 ml-2">
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    documentosValidados['Pagopadf'] === false
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}>
                                    No Cumple
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Comentario del Técnico */}
                    <div>
                        <p className="text-gray-700 font-medium text-sm mb-3">Comentario del Técnico</p>
                        <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm min-h-[100px]">
                            {tecnicoValidation.comentarios || 'El recibo de pago tiene más de 3 meses realizado.'}
                        </div>
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
