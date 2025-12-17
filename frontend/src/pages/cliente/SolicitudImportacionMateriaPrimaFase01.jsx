import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ClientTopbar from "../../components/ClientTopbar";
import ModalConfirmacionEnvio from "../../components/ModalConfirmacionEnvio";
import useRequestsAPI from "../../hooks/useRequestsAPI";

const DOCUMENTOS_FASE_01 = [
  { key: 'cartaSolicitud', label: 'Carta de Solicitud o Comunicación del Importador' },
  { key: 'facturaProforma', label: 'Factura Proforma o Comercial de Importación' },
  { key: 'cartaAutorizacion', label: 'Carta de Autorización de Sustancia Emitida por la DNCD' },
];

export default function SolicitudImportacionMateriaPrimaFase01() {
  const navigate = useNavigate();
  const { createRequest, uploadDocument } = useRequestsAPI();
  
  const [documentos, setDocumentos] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef({});

  const handleFileChange = (key, file) => {
    setDocumentos(prev => ({ ...prev, [key]: file }));
  };

  const triggerFileInput = (key) => {
    if (inputRefs.current[key]) inputRefs.current[key].click();
  };

  const todosDocumentosCargados = DOCUMENTOS_FASE_01.every(doc => documentos[doc.key]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!todosDocumentosCargados) {
      alert('Por favor, sube todos los documentos requeridos');
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setIsSubmitting(true);
    
    try {
      // Crear solicitud para Fase 01
      const resp = await createRequest({
        nombre_servicio: 'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas',
        formulario: { fase: 1 }
      });
      
      const newRequest = resp.request || resp;
      const requestId = newRequest.id || newRequest.request?.id;

      if (!requestId) {
        throw new Error('No se pudo obtener el ID de la solicitud creada');
      }

      // Subir documentos de fase 1
      for (const doc of DOCUMENTOS_FASE_01) {
        const file = documentos[doc.key];
        if (file) {
          await uploadDocument(requestId, file, { 
            tipo_documento: doc.label,
            fase: 1
          });
        }
      }

      // Navegar a pantalla de éxito
      navigate('/solicitud-importacion-materia-prima/exito');
    } catch (error) {
      console.error('Error durante el envío de fase 1:', error);
      alert(error?.message || 'Error al enviar la fase 1. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setConfirmOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/cliente')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A8BDF] mb-2">
            Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas
          </h1>
          <p className="text-xl text-[#85B6EC] font-semibold">FASE 01</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Documentos</h2>

          <div className="space-y-6">
            {DOCUMENTOS_FASE_01.map(doc => (
              <div key={doc.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {doc.label}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    readOnly
                    placeholder="Solo se permiten archivos PNG, JPG o PDF"
                    value={documentos[doc.key]?.name || ''}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400"
                  />
                  <input
                    ref={el => inputRefs.current[doc.key] = el}
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(doc.key, file);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => triggerFileInput(doc.key)}
                    className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-bold py-2 px-6 rounded-lg text-sm shrink-0 whitespace-nowrap"
                  >
                    Subir Documento
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Solo se permiten archivos PNG, JPG o PDF</p>
              </div>
            ))}
          </div>

          {/* Botón enviar */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={!todosDocumentosCargados || isSubmitting}
              className="bg-[#0B57A6] hover:bg-[#084c8a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacionEnvio
        open={confirmOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

