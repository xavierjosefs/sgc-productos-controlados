import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import BadgeEstado from '../../components/BadgeEstado';

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

    // Estados para validación de documentos
    const [documentValidation, setDocumentValidation] = useState({});
    const [formDataValidation, setFormDataValidation] = useState({});
    const [comments, setComments] = useState('');
    
    // Estados de modales
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successType, setSuccessType] = useState(''); // 'devuelta' o 'aprobada'
    
    const [validating, setValidating] = useState(false);

    // Cargar detalle de solicitud
    const fetchDetail = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getRequestDetail(id);
            setRequest(data);
            
            // Inicializar estado de validación para cada documento
            if (data.documentos && data.documentos.length > 0) {
                const initialValidation = {};
                data.documentos.forEach(doc => {
                    initialValidation[doc.id] = null; // null = no seleccionado, true = cumple, false = no cumple
                });
                setDocumentValidation(initialValidation);
            }
            
            // Inicializar estado de validación para cada campo del formulario
            if (data.form_data) {
                const initialFormValidation = {};
                Object.keys(data.form_data).forEach(key => {
                    // Solo validar campos que no sean de información básica y que tengan valor
                    if (!['cedula', 'rnc', 'rncEmpresa', 'nombre', 'nombreEmpresa'].includes(key) && 
                        data.form_data[key] && data.form_data[key] !== '') {
                        initialFormValidation[key] = null;
                    }
                });
                setFormDataValidation(initialFormValidation);
            }
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

    // Manejar validación de documento
    const handleDocumentValidation = (docId, value) => {
        setDocumentValidation(prev => ({
            ...prev,
            [docId]: value
        }));
    };

    // Manejar validación de campo del formulario
    const handleFormDataValidation = (fieldKey, value) => {
        setFormDataValidation(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    };

    // Acción de Devolver
    const executeReject = async () => {
        setValidating(true);
        try {
            await validateRequest(id, 'devuelto_vus', comments);
            setShowRejectModal(false);
            setSuccessType('devuelta');
            setShowSuccessModal(true);
        } catch (err) {
            alert(err.message);
            setValidating(false);
            setShowRejectModal(false);
        }
    };

    // Acción de Aprobar
    const executeApprove = async () => {
        setValidating(true);
        try {
            await validateRequest(id, 'aprobado_vus', comments);
            setShowApproveModal(false);
            navigate('/ventanilla');
        } catch (err) {
            alert(err.message);
            setValidating(false);
            setShowApproveModal(false);
        }
    };

    // Verificar si hay algún documento o campo marcado como "No Cumple"
    const hasRejectedDocuments = Object.values(documentValidation).some(val => val === false);
    const hasRejectedFormData = Object.values(formDataValidation).some(val => val === false);
    const hasAnyRejection = hasRejectedDocuments || hasRejectedFormData;

    // Manejar Click en Devolver
    const handleRejectClick = () => {
        if (!hasAnyRejection) {
            alert("Debes marcar al menos un documento o campo del formulario como 'No Cumple' para devolver la solicitud.");
            return;
        }
        if (!comments.trim()) {
            alert("Debes ingresar los comentarios explicando por qué no cumple.");
            return;
        }
        setShowRejectModal(true);
    };

    // Manejar Click en Aprobar
    const handleApproveClick = () => {
        // Verificar que todos los documentos y campos estén marcados como "Sí Cumple"
        const allDocsApproved = Object.values(documentValidation).every(val => val === true);
        const allFormDataApproved = Object.values(formDataValidation).every(val => val === true);
        
        if (!allDocsApproved || !allFormDataApproved) {
            alert("Todos los documentos y campos del formulario deben estar marcados como 'Sí Cumple' para aprobar la solicitud.");
            return;
        }
        setShowApproveModal(true);
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
                        onClick={() => navigate('/ventanilla')}
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
                        <h2 className="text-[#085297] font-bold text-lg mb-4">Información del Solicitante</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-gray-500 text-sm">Cédula de Identidad o Pasaporte</p>
                                <p className="text-gray-900 font-semibold">{formData.cedula || formData.rnc || formData.rncEmpresa || request.user_id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Nombre Completo del Solicitante</p>
                                <p className="text-gray-900 font-semibold">{formData.nombre || formData.nombreEmpresa || request.nombre_cliente || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Detalles de la Solicitud */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-[#085297] font-bold text-lg mb-4">Detalles de la Solicitud</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-gray-500 text-sm">Tipo</p>
                                <p className="text-gray-900 font-semibold">{request.tipo_servicio}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Condición</p>
                                <p className="text-gray-900 font-semibold">{formData.condicion || formData.condicionSolicitud || 'Nueva Solicitud'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Estado</p>
                                <BadgeEstado estado={request.estado_actual} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Datos del Formulario */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-[#085297] font-bold text-lg mb-4">Datos del Formulario</h2>
                    <div className="space-y-4">
                        {Object.entries(formData).map(([key, value]) => {
                            // Excluir campos de información básica
                            if (['cedula', 'rnc', 'rncEmpresa', 'nombre', 'nombreEmpresa'].includes(key)) {
                                return null;
                            }
                            
                            // Validar que el campo tenga valor
                            if (!value || value === '' || value === null || value === undefined) {
                                return null;
                            }
                            
                            // Formatear el nombre del campo
                            const fieldName = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase());
                            
                            // Procesar el valor - si es Actividades, parsear el JSON
                            let displayValue = value;
                            if (key === 'actividades' && typeof value === 'string') {
                                try {
                                    const actividadesObj = JSON.parse(value);
                                    const actividadesActivas = Object.entries(actividadesObj)
                                        .filter(([_, isActive]) => isActive === true)
                                        .map(([nombre]) => {
                                            // Formatear nombre de actividad
                                            return nombre.charAt(0).toUpperCase() + nombre.slice(1);
                                        });
                                    displayValue = actividadesActivas.length > 0 
                                        ? actividadesActivas.join(', ') 
                                        : 'Ninguna';
                                } catch (e) {
                                    displayValue = value;
                                }
                            }
                            
                            return (
                                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">{fieldName}</p>
                                        <p className="text-base text-gray-900 font-semibold">
                                            {displayValue}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                        <button
                                            onClick={() => handleFormDataValidation(key, true)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                                                formDataValidation[key] === true
                                                    ? 'bg-[#085297] text-white'
                                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#085297]'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                formDataValidation[key] === true ? 'border-white bg-white' : 'border-gray-400'
                                            }`}>
                                                {formDataValidation[key] === true && (
                                                    <div className="w-3 h-3 rounded-full bg-[#085297]"></div>
                                                )}
                                            </div>
                                            Sí Cumple
                                        </button>
                                        <button
                                            onClick={() => handleFormDataValidation(key, false)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                                                formDataValidation[key] === false
                                                    ? 'bg-[#085297] text-white'
                                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#085297]'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                formDataValidation[key] === false ? 'border-white bg-white' : 'border-gray-400'
                                            }`}>
                                                {formDataValidation[key] === false && (
                                                    <div className="w-3 h-3 rounded-full bg-[#085297]"></div>
                                                )}
                                            </div>
                                            No Cumple
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {Object.keys(formData).filter(key => 
                            !['cedula', 'rnc', 'rncEmpresa', 'nombre', 'nombreEmpresa'].includes(key) &&
                            formData[key] && formData[key] !== ''
                        ).length === 0 && (
                            <div className="text-center py-6 text-gray-500">
                                No hay datos adicionales del formulario
                            </div>
                        )}
                    </div>
                </div>

                {/* Requisitos */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-[#085297] font-bold text-lg mb-6">Requisitos</h2>
                    
                    {/* Nombre del servicio */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-medium mb-2">
                            Formulario de Solicitud de Inscripción de {request.tipo_servicio}
                        </p>
                    </div>

                    {/* Lista de documentos */}
                    {request.documentos && request.documentos.length > 0 ? (
                        <div className="space-y-4">
                            {request.documentos.map((doc, index) => (
                                <div key={doc.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                                    <div className="flex items-center gap-4 flex-1">
                                        <span className="text-gray-700 font-medium">{doc.tipo_documento || doc.nombre || `Documento ${index + 1}`}</span>
                                        {doc.url && (
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-[#085297] text-white rounded-lg text-sm font-medium hover:bg-[#064073] transition-colors"
                                            >
                                                Ver
                                            </a>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleDocumentValidation(doc.id, true)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                                                documentValidation[doc.id] === true
                                                    ? 'bg-[#085297] text-white'
                                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#085297]'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                documentValidation[doc.id] === true ? 'border-white bg-white' : 'border-gray-400'
                                            }`}>
                                                {documentValidation[doc.id] === true && (
                                                    <div className="w-3 h-3 rounded-full bg-[#085297]"></div>
                                                )}
                                            </div>
                                            Sí Cumple
                                        </button>
                                        <button
                                            onClick={() => handleDocumentValidation(doc.id, false)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                                                documentValidation[doc.id] === false
                                                    ? 'bg-[#085297] text-white'
                                                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#085297]'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                documentValidation[doc.id] === false ? 'border-white bg-white' : 'border-gray-400'
                                            }`}>
                                                {documentValidation[doc.id] === false && (
                                                    <div className="w-3 h-3 rounded-full bg-[#085297]"></div>
                                                )}
                                            </div>
                                            No Cumple
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No hay documentos cargados</p>
                    )}

                    {/* Campo de comentarios - Solo habilitado si hay documentos o campos que no cumplen */}
                    <div className="mt-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Observaciones
                            {hasAnyRejection && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            disabled={!hasAnyRejection}
                            placeholder={hasAnyRejection ? "Explica por qué el/los documento(s) o campo(s) del formulario no cumplen con los requisitos..." : "Selecciona 'No Cumple' en algún documento o campo para habilitar este campo"}
                            className={`w-full h-32 px-4 py-3 border-2 rounded-xl focus:outline-none resize-none transition-all ${
                                hasAnyRejection
                                    ? 'border-gray-300 focus:border-[#4A8BDF] bg-white'
                                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                        />
                        {hasAnyRejection && (
                            <p className="text-xs text-red-500 mt-1">* Campo obligatorio para devolver la solicitud</p>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => navigate('/ventanilla')}
                            className="px-8 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleRejectClick}
                            disabled={!hasRejectedDocuments || !comments.trim()}
                            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                                hasRejectedDocuments && comments.trim()
                                    ? 'bg-[#085297] text-white hover:bg-[#064073]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Devolver
                        </button>
                        <button
                            onClick={handleApproveClick}
                            className="px-8 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064073] transition-colors"
                        >
                            Aprobar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación de Devolución */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4 text-center">Confirmar Devolución</h3>
                        <p className="text-gray-600 text-center mb-8">
                            ¿Está seguro de que desea devolver esta solicitud al usuario?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={validating}
                                className="flex-1 px-6 py-3 bg-[#A8C5E8] text-[#085297] rounded-lg font-semibold hover:bg-[#8FB5DC] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={executeReject}
                                disabled={validating}
                                className="flex-1 px-6 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064073] transition-colors disabled:opacity-50"
                            >
                                {validating ? 'Procesando...' : 'Devolver'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación de Aprobación */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-[#4A8BDF] mb-4 text-center">Confirmar Aprobación</h3>
                        <p className="text-gray-600 text-center mb-8">
                            ¿Desea aprobar esta solicitud?<br/>
                            Una vez aprobada, continuará al siguiente paso del proceso y no podrá ser modificada.
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
                                className="flex-1 px-6 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064073] transition-colors disabled:opacity-50"
                            >
                                {validating ? 'Procesando...' : 'Aprobar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Éxito - Solicitud Devuelta */}
            {showSuccessModal && successType === 'devuelta' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-12 max-w-md w-full shadow-2xl text-center">
                        <div className="w-20 h-20 bg-[#4A8BDF] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-[#4A8BDF]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#4A8BDF] mb-4">Solicitud Devuelta</h2>
                        <p className="text-gray-600 mb-8">
                            El usuario ha sido notificado y la solicitud quedó en estado Devuelta.
                        </p>
                        <button
                            onClick={() => navigate('/ventanilla')}
                            className="w-full px-6 py-3 bg-[#085297] text-white rounded-lg font-semibold hover:bg-[#064073] transition-colors"
                        >
                            Ir a "Solicitudes"
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VentanillaRequestDetail;
