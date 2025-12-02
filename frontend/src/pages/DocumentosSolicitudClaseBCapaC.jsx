import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalConfirmacionEnvio from '../components/ModalConfirmacionEnvio';
import useRequestsAPI from '../hooks/useRequestsAPI';
import { useSolicitudClaseBCapaC } from '../contexts/SolicitudClaseBCapaCContext';

const FIELD_LIST = [
  { key: 'cedulaRepresentante', label: 'Cédula del Representante de la Entidad' },
  { key: 'cedulaFarmaceutico', label: 'Cédula del Farmacéutico Responsable' },
  { key: 'tituloFarmaceutico', label: 'Título del Farmacéutico Responsable' },
  { key: 'exequaturFarmaceutico', label: 'Exequátur del Farmacéutico Responsable' },
  { key: 'reciboPago', label: 'Recibo de Depósito del Pago' },
];

const DocumentosSolicitudClaseBCapaC = ({ onBack }) => {
  const navigate = useNavigate();
  const { formData, clearFormData } = useSolicitudClaseBCapaC();
  const [files, setFiles] = useState({});
  const inputRefs = useRef({});

  const handleFileChange = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
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
    if (typeof onBack === 'function') return onBack();
    navigate(-1);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  const { createRequest, uploadDocument } = useRequestsAPI();

  const handleConfirm = async () => {
    setConfirmOpen(false);
    try {
      // Crear solicitud con datos reales del formulario desde Context
      const resp = await createRequest({ 
        nombre_servicio: 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B - Capa C', 
        formulario: formData 
      });
      // El controller responde { ok: true, request }
      const newRequest = resp.request || resp;
      const requestId = newRequest.id || newRequest.request?.id;

      if (!requestId) {
        throw new Error('No se pudo obtener el ID de la solicitud creada');
      }

      // Subir todos los archivos
      const entries = Object.entries(files);
      for (const [key, file] of entries) {
        if (!file) continue;
        await uploadDocument(requestId, file, { tipo_documento: key });
      }

      // Limpiar datos del formulario del context
      clearFormData();
      navigate('/solicitud-clase-b-capa-c/exito');
    } catch (error) {
      console.error('Error durante el envío de documentos:', error);
      alert(error?.message || 'Error al enviar la solicitud. Revisa la consola.');
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

        <h1 className="text-2xl md:text-3xl font-bold text-center text-[#2B6CB0] mb-8">Solicitud de Certificado de Inscripción de Drogas Controladas Clase B - Capa C</h1>

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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400"
                    />
                    <button type="button" onClick={() => triggerFileInput(field.key)} className="px-4 py-2 bg-[#0B57A6] hover:bg-[#084c8a] text-white rounded-lg whitespace-nowrap">Subir Documento</button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Solo se permiten archivos PNG, JPG o PDF</p>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center gap-6 mt-6">
              <button type="button" onClick={handleBack} className="px-8 py-3 bg-white border border-[#4A8BDF] text-[#4A8BDF] rounded-lg font-semibold">Volver</button>
              <button type="submit" disabled={!allFilled} className={`${allFilled ? 'bg-[#0B57A6] hover:bg-[#084c8a] text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'} px-8 py-3 rounded-lg font-semibold`}>Enviar</button>
            </div>
          </form>
        </div>
        <ModalConfirmacionEnvio open={confirmOpen} onCancel={handleCancel} onConfirm={handleConfirm} />
      </div>
    </div>
  );
};

export default DocumentosSolicitudClaseBCapaC;
