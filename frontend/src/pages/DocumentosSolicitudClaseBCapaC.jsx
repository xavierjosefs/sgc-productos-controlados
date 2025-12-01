import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ClientTopbar from "../components/ClientTopbar";
import ModalConfirmacionEnvio from "../components/ModalConfirmacionEnvio";
import { useSolicitudClaseBCapaC } from "../contexts/SolicitudClaseBCapaCContext";
import useRequestsAPI from "../hooks/useRequestsAPI";

const FIELD_LIST = [
  { key: 'cedulaRepresentante', label: 'Cédula del Representante de la Entidad' },
  { key: 'cedulaFarmaceutico', label: 'Cédula del Farmacéutico Responsable' },
  { key: 'tituloFarmaceutico', label: 'Título del Farmacéutico Responsable' },
  { key: 'exequaturFarmaceutico', label: 'Exequátur del Farmacéutico Responsable' },
  { key: 'reciboPago', label: 'Recibo de Depósito del Pago' },
];

export default function DocumentosSolicitudClaseBCapaC() {
  const navigate = useNavigate();
  const { formData, clearFormData } = useSolicitudClaseBCapaC();
  const { createRequest, uploadDocument } = useRequestsAPI();
  
  const [files, setFiles] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!allFilled) {
      alert('Por favor, sube todos los documentos requeridos');
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setIsSubmitting(true);
    
    try {
      // Crear solicitud
      const resp = await createRequest({
        nombre_servicio: 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B - Capa C',
        formulario: formData
      });
      
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

      // Limpiar datos del contexto
      clearFormData();
      
      // Navegar a pantalla de éxito
      navigate('/solicitud-drogas-clase-b-capa-c/exito');
    } catch (error) {
      console.error('Error durante el envío de documentos:', error);
      alert(error?.message || 'Error al enviar la solicitud. Por favor, intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setConfirmOpen(false);

  const handleBack = () => {
    // Verificar si viene de página 2 (con actividades especiales)
    const actividadesEspeciales = ["Importadora", "Exportadora", "Fabricante"];
    const tieneActividadEspecial = formData.actividades?.some((act) =>
      actividadesEspeciales.includes(act)
    );
    
    if (tieneActividadEspecial) {
      navigate('/solicitud-drogas-clase-b-capa-c/paso-2');
    } else {
      navigate('/solicitud-drogas-clase-b-capa-c');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="text-[#4A8BDF] mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A8BDF]">
            Documentos - Solicitud de Certificado de Inscripción de Drogas Controladas Clase B - Capa C
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN: Documentos */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Documentos Requeridos</h2>
            <p className="text-gray-600 mb-8">Suba los siguientes documentos en formato PDF:</p>
            <div className="space-y-6">
              {FIELD_LIST.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => triggerFileInput(field.key)}
                      className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-bold py-2 px-6 rounded-lg text-sm shrink-0 whitespace-nowrap"
                    >
                      Subir Documento
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Solo se permiten archivos PNG, JPG o PDF</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!allFilled || isSubmitting}
              className="bg-[#0B57A6] hover:bg-[#084c8a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </div>
        </form>
      </div>

      <ModalConfirmacionEnvio 
        open={confirmOpen} 
        onCancel={handleCancel} 
        onConfirm={handleConfirm} 
      />
    </div>
  );
}
