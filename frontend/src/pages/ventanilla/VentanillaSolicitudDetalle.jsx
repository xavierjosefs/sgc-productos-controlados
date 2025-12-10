import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import BadgeEstado from '../../components/BadgeEstado';

/**
 * VentanillaSolicitudDetalle
 * Pantalla de validación de documentos (requisitos)
 */
const VentanillaSolicitudDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        getVentanillaRequestDetail,
        validateRequest
    } = useRequestsAPI();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Estados para validación de documentos y campos del formulario
    const [documentValidation, setDocumentValidation] = useState({});
    const [formFieldsValidation, setFormFieldsValidation] = useState({});
    const [comments, setComments] = useState('');
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    
    // Estados de modales
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFormDataModal, setShowFormDataModal] = useState(false);
    const [successType, setSuccessType] = useState(''); // 'devuelta' o 'aprobada'
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [validating, setValidating] = useState(false);

    // Cargar detalle de solicitud
    const fetchDetail = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Cargando detalle de solicitud ID:', id);
            const data = await getVentanillaRequestDetail(id);
            console.log('Datos recibidos:', data);
            setRequest(data);
            
            // Verificar si la solicitud ya fue aprobada
            const alreadyApproved = data.estado_actual?.toLowerCase() === 'en evaluación técnica' ||
                                    data.estado_actual?.toLowerCase() === 'aprobada por upc' ||
                                    data.estado_actual?.toLowerCase() === 'firmada por dirección' ||
                                    data.estado_actual?.toLowerCase() === 'en revisión dncd' ||
                                    data.estado_actual?.toLowerCase() === 'autorizada dncd' ||
                                    data.estado_actual?.toLowerCase() === 'finalizada';

            // Si hay validaciones previas del backend, usarlas
            // Si no, inicializar según el estado
            if (data.documentValidation && Object.keys(data.documentValidation).length > 0) {
                // Cargar validaciones previas
                setDocumentValidation(data.documentValidation);
            } else if (data.documentos && data.documentos.length > 0) {
                // Inicializar nuevas validaciones
                const initialValidation = {};
                data.documentos.forEach(doc => {
                    initialValidation[doc.id] = alreadyApproved ? true : null;
                });
                setDocumentValidation(initialValidation);
            }
            
            console.log('✅ Todo cargado correctamente, cambiando loading a false');
        } catch (error) {
            console.error('❌ Error fetching request detail:', error);
            setError(error?.message || 'No se pudo cargar la solicitud');
            setRequest(null);
        } finally {
            console.log('🏁 Finally block - setting loading to false');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        // eslint-disable-next-line
    }, [id]);

    // Manejar validación de documento
    const handleDocumentValidation = (docId, value) => {
        // Si la solicitud está devuelta, solo permitir cambiar los que NO cumplen
        // No permitir cambiar los que ya están marcados como "Sí Cumple"
        const isReturned = request?.estado_actual?.toLowerCase() === 'devuelta por vus';
        if (isReturned && documentValidation[docId] === true) {
            return; // No permitir cambiar los que ya cumplen
        }
        
        setDocumentValidation(prev => ({
            ...prev,
            [docId]: value
        }));
        
        // Verificar si todos los campos están validados para limpiar errores
        const documentosLength = request?.documentos?.length || 0;
        
        // CORRECCIÓN 1: Se cambió 'formularioValidation' (no definido) por 'formFieldsValidation'
        const allValidated = formFieldsValidation !== null && 
            Object.keys({...documentValidation, [docId]: value}).length === documentosLength &&
            Object.values({...documentValidation, [docId]: value}).every(val => val !== null);
        
        if (allValidated) {
            setShowValidationErrors(false);
        }
    };

    // Manejar validación de campo del formulario
    const handleFormFieldValidation = (fieldKey, value) => {
        setFormFieldsValidation(prev => ({
            ...prev,
            [fieldKey]: value
        }));
        // Limpiar error si todos los campos están validados
        const allFields = Object.keys(request?.form_data || {});
            const allValidated = allFields.length > 0 &&
                allFields.every(k => formFieldsValidation[k] !== undefined && formFieldsValidation[k] !== null);
        if (allValidated) {
            setShowValidationErrors(false);
        }
    };

    // Acción de Devolver
    const executeReject = async () => {
        setValidating(true);
        try {
            await validateRequest(id, 'devuelto_vus', comments, documentValidation, {});
            setShowRejectModal(false);
            setSuccessType('devuelta');
            setShowSuccessModal(true);
        } catch (err) {
            setHasError(true);
            setErrorMessage(err.message);

            setValidating(false);
            setShowRejectModal(false);
        }
    };

    // Acción de Aprobar
    const executeApprove = async () => {
        setValidating(true);
        try {
            await validateRequest(id, 'aprobado_vus', comments, documentValidation, {});
            setShowApproveModal(false);
            navigate('/ventanilla');
        } catch (err) {
            setHasError(true);
            setErrorMessage(err.message);

            setValidating(false);
            setShowApproveModal(false);
        }
    };

    // Verificar si hay algún documento o campo del formulario marcado como "No Cumple"
    const hasRejectedDocuments = Object.values(documentValidation).some(val => val === false);
    const hasRejectedFormFields = Object.values(formFieldsValidation).some(val => val === false);
    const hasAnyRejection = hasRejectedDocuments || hasRejectedFormFields;

    // Verificar si la solicitud ya fue aprobada (está en evaluación técnica o estados posteriores)
    const isAlreadyApproved = request?.estado_actual?.toLowerCase() === 'en evaluación técnica' ||
                               request?.estado_actual?.toLowerCase() === 'aprobada por upc' ||
                               request?.estado_actual?.toLowerCase() === 'firmada por dirección' ||
                               request?.estado_actual?.toLowerCase() === 'en revisión dncd' ||
                               request?.estado_actual?.toLowerCase() === 'autorizada dncd' ||
                               request?.estado_actual?.toLowerCase() === 'finalizada';

    // Verificar si la solicitud está devuelta por VUS
    const isReturned = request?.estado_actual?.toLowerCase() === 'devuelta por vus';

    // Manejar Click en Devolver
    const handleRejectClick = () => {
        if (isAlreadyApproved) {
            setHasError(true);
            setErrorMessage("No se puede devolver una solicitud que ya fue aprobada y está en evaluación técnica o en etapas posteriores.");
            return;
        }
        // Verificar que todos los campos estén validados
        const documentosLength = request?.documentos?.length || 0;
        const formFieldsLength = Object.keys(request?.form_data || {}).length;
        const allFieldsValidated = formFieldsLength > 0 &&
            Object.keys(formFieldsValidation).length === formFieldsLength &&
            Object.values(formFieldsValidation).every(val => val !== null) &&
            Object.keys(documentValidation).length === documentosLength &&
            Object.values(documentValidation).every(val => val !== null);
        if (!allFieldsValidated) {
            setShowValidationErrors(true);
            setHasError(true);
            setErrorMessage("Debes validar todos los requisitos (Formulario y Documentos) antes de devolver la solicitud.");
            return;
        }
        if (!hasAnyRejection) {
            setHasError(true);
            setErrorMessage("Debes marcar al menos un requisito como 'No Cumple' para devolver la solicitud.");
            return;
        }
        if (!comments.trim()) {
            setHasError(true);
            setErrorMessage("Debes ingresar los comentarios explicando por qué no cumple.");
            return;
        }
        setShowRejectModal(true);
    };

    // Manejar Click en Aprobar
    const handleApproveClick = () => {
        // Verificar que todos los campos estén validados
        const documentosLength = request?.documentos?.length || 0;
        const formFieldsLength = Object.keys(request?.form_data || {}).length;
        const allFieldsValidated = formFieldsLength > 0 &&
            Object.keys(formFieldsValidation).length === formFieldsLength &&
            Object.values(formFieldsValidation).every(val => val !== null) &&
            Object.keys(documentValidation).length === documentosLength &&
            Object.values(documentValidation).every(val => val !== null);
        if (!allFieldsValidated) {
            setShowValidationErrors(true);
            setHasError(true);
            setErrorMessage("Debes validar todos los requisitos (Formulario y Documentos) antes de aprobar la solicitud.");
            return;
        }
        // Verificar que todos los documentos y campos del formulario estén marcados como "Sí Cumple"
        const allDocsApproved = Object.values(documentValidation).every(val => val === true);
        const allFormFieldsApproved = Object.values(formFieldsValidation).every(val => val === true);
        if (!allDocsApproved || !allFormFieldsApproved) {
            setHasError(true);
            setErrorMessage("Todos los documentos y campos del formulario deben estar marcados como 'Sí Cumple' para aprobar la solicitud.");
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
                        <h2 className="text-[#4A8BDF] font-bold text-lg mb-6">Informacion del Solicitante</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Cédula de Identidad y Electoral</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.cedula || formData.rnc || formData.rncEmpresa || request.user_id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Nombre del Profesional</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.nombre || formData.nombreEmpresa || request.nombre_cliente || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Contacto</p>
                                    <p className="text-gray-900 font-medium text-sm">{formData.telefono || formData.contacto || 'N/A'}</p>
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
                                    <p className="text-gray-900 font-medium text-sm">{formData.condicion || formData.condicionSolicitud || 'Renovacion'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requisitos */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-[#4A8BDF] font-bold text-lg mb-6">Requisitos</h2>
                    {/* Formulario de Solicitud - Todos los campos validables */}
                    <div className="mb-6">
                        <p className="text-gray-700 font-medium text-sm mb-3">
                            Formulario de Solicitud de Inscripción de {request.tipo_servicio}
                        </p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600">Campo</th>
                                        <th className="py-2 px-4 text-left text-xs font-semibold text-gray-600">Valor</th>
                                        <th className="py-2 px-4 text-center text-xs font-semibold text-gray-600">Validación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(formData).map(([key, value]) => {
                                        // Formatear nombre del campo
                                            const fieldName = key
                                                .replace(/_/g, ' ')
                                                .replace(/([a-z])([A-Z])/g, '$1 $2')
                                                .replace(/^./, str => str.toUpperCase());
                                        let displayValue = value;
                                        if (typeof value === 'boolean') {
                                            displayValue = value ? 'Sí' : 'No';
                                        }
                                        if (typeof value === 'object' && value !== null) {
                                            displayValue = Array.isArray(value)
                                                ? value.join(', ')
                                                : Object.entries(value).map(([k, v]) => `${k}: ${v === true ? 'Sí' : v === false ? 'No' : v}`).join(', ');
                                        }
                                        return (
                                            <tr key={key} className="border-b border-gray-100">
                                                <td className="py-2 px-4 text-gray-700 text-sm font-medium">{fieldName}</td>
                                                <td className="py-2 px-4 text-gray-900 text-sm">{displayValue}</td>
                                                <td className="py-2 px-4 text-center">
                                                    <div className="flex justify-center gap-4">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`formfield-cumple-${key}`}
                                                                checked={formFieldsValidation[key] === true}
                                                                onChange={() => !isAlreadyApproved && handleFormFieldValidation(key, true)}
                                                                disabled={isAlreadyApproved}
                                                                className="accent-[#085297] w-5 h-5"
                                                            />
                                                            <span className="text-base">Sí Cumple</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={`formfield-cumple-${key}`}
                                                                checked={formFieldsValidation[key] === false}
                                                                onChange={() => !isAlreadyApproved && handleFormFieldValidation(key, false)}
                                                                disabled={isAlreadyApproved}
                                                                className="accent-[#085297] w-5 h-5"
                                                            />
                                                            <span className="text-base">No Cumple</span>
                                                        </label>
                                                    </div>
                                                    {showValidationErrors && (formFieldsValidation[key] === undefined || formFieldsValidation[key] === null) && (
                                                        <p className="text-red-500 text-xs mt-2 font-semibold">* Debes validar este campo obligatoriamente</p>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Lista de documentos */}
                    {request.documentos && request.documentos.length > 0 ? (
                        <div className="space-y-4">
                            {[...new Map(request.documentos.map(doc => [doc.nombre + doc.tipo_documento, doc])).values()].map((doc, index) => {
                                // Formatear el nombre del documento
                                const docLabel = (doc.tipo_documento || doc.nombre || `Documento ${index + 1}`)
                                    .replace(/_/g, ' ')
                                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                                    .replace(/^./, str => str.toUpperCase());
                                return (
                                    <div key={doc.id}>
                                        <p className="text-gray-700 font-medium text-sm mb-3">{docLabel}</p>
                                        <div className="flex items-center gap-3">
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
                                                <span className="text-gray-400 text-xs italic">No enviado</span>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => !isAlreadyApproved && !(isReturned && documentValidation[doc.id] === true) && handleDocumentValidation(doc.id, true)}
                                                    disabled={isAlreadyApproved || (isReturned && documentValidation[doc.id] === true)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                                                        documentValidation[doc.id] === true
                                                            ? 'bg-[#085297] text-white'
                                                            : (isAlreadyApproved || (isReturned && documentValidation[doc.id] === true))
                                                            ? 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
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
                                                    onClick={() => !isAlreadyApproved && !(isReturned && documentValidation[doc.id] === true) && handleDocumentValidation(doc.id, false)}
                                                    disabled={isAlreadyApproved || (isReturned && documentValidation[doc.id] === true)}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                                                        documentValidation[doc.id] === false
                                                            ? 'bg-[#085297] text-white'
                                                            : (isAlreadyApproved || (isReturned && documentValidation[doc.id] === true))
                                                            ? 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
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
                                        {showValidationErrors && (documentValidation[doc.id] === undefined || documentValidation[doc.id] === null) && (
                                            <p className="text-red-500 text-xs mt-2 font-semibold">* Debes validar este campo obligatoriamente</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No hay documentos cargados</p>
                    )}

                    {/* Campo de comentarios - Solo habilitado si hay documentos que no cumplen */}
                    <div className="mt-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Observaciones
                            {hasAnyRejection && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            disabled={!hasAnyRejection}
                            placeholder={hasAnyRejection ? "Explica por qué el/los documento(s) no cumplen con los requisitos..." : "Selecciona 'No Cumple' en algún documento para habilitar este campo"}
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
                            disabled={isAlreadyApproved || !hasRejectedDocuments || !comments.trim()}
                            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                                !isAlreadyApproved && hasRejectedDocuments && comments.trim()
                                    ? 'bg-[#085297] text-white hover:bg-[#064073]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={isAlreadyApproved ? "No se puede devolver una solicitud ya aprobada" : ""}
                        >
                            Devolver
                        </button>
                        <button
                            onClick={handleApproveClick}
                            disabled={isAlreadyApproved}
                            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                                !isAlreadyApproved 
                                    ? 'bg-[#085297] text-white hover:bg-[#064073]'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            title={isAlreadyApproved ? "Esta solicitud ya fue aprobada" : ""}
                        >
                            Aprobar
                        </button>
                    </div>
                    {hasError && (
                        <span className="text-red-600 text-sm font-medium mb-4 inline-block mt-5">
                            {errorMessage}
                        </span>
                    )}

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


                        {/* Unificar todos los campos del formulario, incluyendo los adicionales de cualquier nivel */}
                        {(() => {
                            // Función recursiva para aplanar todos los campos de un objeto anidado
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
                            // Si no hay datos, mostrar mensaje
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
                            // Mostrar todos los campos
                            return (
                                <div className="space-y-4">
                                    {Object.entries(allFields).map(([key, value]) => {
                                        if (!value || value === '' || value === null || value === undefined) {
                                            return null;
                                        }
                                        // Formatear el nombre del campo: separa camelCase, snake_case, puntos y pone mayúsculas
                                        const fieldName = key
                                            .replace(/_/g, ' ')
                                            .replace(/\./g, ' ')
                                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                                            .replace(/^./, str => str.toUpperCase());
                                        let displayValue = value;
                                        if (key.endsWith('actividades') && typeof value === 'string') {
                                            try {
                                                const actividadesObj = JSON.parse(value);
                                                const actividadesActivas = Object.entries(actividadesObj)
                                                    .filter(([, isActive]) => isActive === true)
                                                    .map(([nombre]) => nombre.charAt(0).toUpperCase() + nombre.slice(1));
                                                displayValue = actividadesActivas.length > 0 
                                                    ? actividadesActivas.join(', ') 
                                                    : 'Ninguna';
                                            } catch {
                                                // CORRECCIÓN 2: Eliminado _err del catch
                                                displayValue = value;
                                            }
                                        }
                                        return (
                                            <div key={key} className="border-b border-gray-200 pb-3">
                                                <p className="text-sm text-gray-500 mb-1">{fieldName}</p>
                                                <p className="text-base text-gray-900 font-medium">{displayValue}</p>
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

export default VentanillaSolicitudDetalle;