import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalConfirmacionEnvio from '../../components/ModalConfirmacionEnvio';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import { useSolicitudClaseBCapaC } from '../../contexts/SolicitudClaseBCapaCContext';
import { validateFile } from '../../utils/fileValidation';

// Documentos para PRIMERA SOLICITUD - Solo 4 documentos según Figma
const FIELD_LIST = [
  { key: 'cedulaRepresentante', label: 'Cédula del Representante de la Entidad' },
  { key: 'cedulaFarmaceutico', label: 'Cédula del Farmacéutico Responsable' },
  { key: 'tituloFarmaceutico', label: 'Título del Farmacéutico Responsable' },
  { key: 'exequaturFarmaceutico', label: 'Exequátur del Farmacéutico Responsable' },
];

const DocumentosSolicitudClaseBCapaC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, clearFormData } = useSolicitudClaseBCapaC();
  const [files, setFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef({});
  
  // Detectar si viene desde RequestDetail o desde el formulario con una solicitud existente
  const existingRequestId = location.state?.requestId;
  const fromDetail = location.state?.fromDetail;
  const fromForm = location.state?.fromForm;

  const handleFileChange = (key, file) => {
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileErrors((prev) => ({ ...prev, [key]: error }));
      setFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[key];
        return newFiles;
      });
      return;
    }

    setFileErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleRemoveFile = (key) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
    // Limpiar el input file
    if (inputRefs.current[key]) {
      inputRefs.current[key].value = '';
    }
  };

  const triggerFileInput = (key) => {
    if (inputRefs.current[key]) inputRefs.current[key].click();
  };

  const allFilled = FIELD_LIST.every(f => files[f.key]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allFilled) return;
    // Abrir modal de confirmación
    setConfirmOpen(true);
  };

  const handleBack = () => {
    navigate('/cliente');
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { createRequest, uploadDocument, deleteDocument } = useRequestsAPI();

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      let requestId = existingRequestId;
      
      // Si no viene desde el detalle NI desde el formulario, crear una nueva solicitud
      if (!fromDetail && !fromForm && !existingRequestId) {
        const resp = await createRequest({
          nombre_servicio: 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas',
          formulario: formData
        });
        // El controller responde { ok: true, request }
        const newRequest = resp.request || resp;
        requestId = newRequest.id || newRequest.request?.id;

        if (!requestId) {
          throw new Error('No se pudo obtener el ID de la solicitud creada');
        }
      }

      // Subir todos los archivos
      const entries = Object.entries(files);
      for (const [key, file] of entries) {
        if (!file) continue;
        await uploadDocument(requestId, file, { tipo_documento: key });
      }

      // Limpiar datos del formulario del context
      clearFormData();
      
      // Siempre ir a la página de éxito después de subir documentos
      navigate('/solicitud-clase-b-capa-c/exito');
    } catch (error) {
      console.error('Error durante el envío de documentos:', error);
      alert(error?.message || 'Error al enviar la solicitud. Revisa la consola.');
      setSubmitting(false);
    }
  };

  const handleCancel = () => setConfirmOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto px-6 py-12">
        <button onClick={handleBack} className="text-[#4A8BDF] mb-6 inline-flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#2B6CB0] mb-8">Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mx-auto" style={{ maxWidth: 620 }}>
          <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Documentos</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELD_LIST.map(field => (
              <div key={field.key} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-2">{field.label}</label>
                  <div className="flex gap-3">
                    <input
                      ref={el => (inputRefs.current[field.key] = el)}
                      type="file"
                      name={field.key}
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(field.key, e.target.files[0])}
                    />

                    <input
                      readOnly
                      placeholder="Solo se permiten archivos PNG, JPG o PDF"
                      value={files[field.key]?.name || ''}
                      className={`flex-1 px-4 py-3 border rounded-lg bg-white placeholder-gray-400 ${fileErrors[field.key] ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {files[field.key] && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(field.key)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                        title="Eliminar archivo"
                      >
                        ✕
                      </button>
                    )}
                    <button type="button" onClick={() => triggerFileInput(field.key)} className="px-4 py-2 bg-[#0B57A6] hover:bg-[#084c8a] text-white rounded-lg whitespace-nowrap">Subir Documento</button>
                  </div>
                  {fileErrors[field.key] ? (
                    <p className="text-xs text-red-500 mt-2">{fileErrors[field.key]}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-2">Solo se permiten archivos PNG, JPG o PDF</p>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center gap-6 mt-6">
              <button type="button" onClick={handleBack} disabled={submitting} className="px-8 py-3 bg-white border border-[#4A8BDF] text-[#4A8BDF] rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Volver</button>
              <button type="submit" disabled={!allFilled || submitting} className={`${allFilled && !submitting ? 'bg-[#0B57A6] hover:bg-[#084c8a] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'} px-8 py-3 rounded-lg font-semibold flex items-center gap-2`}>
                {submitting && (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {submitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </form>
        </div>
        <ModalConfirmacionEnvio open={confirmOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
      </div>
    </div>
  );
};

export default DocumentosSolicitudClaseBCapaC;

