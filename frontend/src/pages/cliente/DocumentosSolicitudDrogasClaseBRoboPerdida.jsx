import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModalConfirmacionEnvio from '../../components/ModalConfirmacionEnvio';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import { useSolicitudClaseB } from '../../contexts/SolicitudClaseBContext';
import { validateFile } from '../../utils/fileValidation';

// Documentos para ROBO O PÉRDIDA - Todos obligatorios
const FIELD_LIST_ROBO_PERDIDA = [
  { key: 'cedula', label: 'Cédula de Identidad y Electoral' },
  { key: 'certificadoRobo', label: 'Certificación de Robo o Pérdida Emitida por la Policía Nacional' },
  { key: 'reciboPago', label: 'Recibo de Depósito del Pago (no debe tener más de tres (03) meses de emitida)' },
];

const DocumentosSolicitudDrogasClaseBRoboPerdida = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, clearFormData } = useSolicitudClaseB();
  const [files, setFiles] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const inputRefs = useRef({});
  
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
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleRemoveFile = (key) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[key];
      return newFiles;
    });
    if (inputRefs.current[key]) {
      inputRefs.current[key].value = '';
    }
  };

  const triggerFileInput = (key) => {
    if (inputRefs.current[key]) inputRefs.current[key].click();
  };

  const allFilled = FIELD_LIST_ROBO_PERDIDA.every(f => files[f.key]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allFilled) return;
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
      
      if (!fromDetail && !fromForm && !existingRequestId) {
        const resp = await createRequest({
          nombre_servicio: 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados',
          formulario: formData
        });
        const newRequest = resp.request || resp;
        requestId = newRequest.id || newRequest.request?.id;

        if (!requestId) {
          throw new Error('No se pudo obtener el ID de la solicitud creada');
        }
      }

      const entries = Object.entries(files);
      for (const [key, file] of entries) {
        if (!file) continue;
        await uploadDocument(requestId, file, { tipo_documento: key });
      }

      clearFormData();
      navigate('/solicitud-drogas-clase-b/exito');
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

        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#2B6CB0] mb-8">Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 mx-auto" style={{ maxWidth: 620 }}>
          <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Documentos</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {FIELD_LIST_ROBO_PERDIDA.map(field => (
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

export default DocumentosSolicitudDrogasClaseBRoboPerdida;
