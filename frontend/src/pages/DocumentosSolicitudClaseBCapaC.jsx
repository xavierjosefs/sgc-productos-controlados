import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSolicitudClaseBCapaC } from "../contexts/SolicitudClaseBCapaCContext";
import { useRequestsAPI } from "../hooks/useRequestsAPI";
import ModalConfirmacionEnvio from "../components/ModalConfirmacionEnvio";

export default function DocumentosSolicitudClaseBCapaC() {
  const navigate = useNavigate();
  const { formData, clearFormData } = useSolicitudClaseBCapaC();
  const { createRequest, uploadDocument } = useRequestsAPI();

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para los archivos
  const [cedulaRepresentante, setCedulaRepresentante] = useState(null);
  const [cedulaFarmaceutico, setCedulaFarmaceutico] = useState(null);
  const [tituloFarmaceutico, setTituloFarmaceutico] = useState(null);
  const [exequaturFarmaceutico, setExequaturFarmaceutico] = useState(null);
  const [reciboPago, setReciboPago] = useState(null);

  const handleBack = () => {
    // Verificar si tiene actividades especiales para saber a dónde volver
    const actividadesEspeciales = ["Importadora", "Exportadora", "Fabricante"];
    const tieneActividadEspecial = formData.actividades?.some((act) =>
      actividadesEspeciales.includes(act)
    );

    if (tieneActividadEspecial) {
      navigate("/solicitud-drogas-clase-b-capa-c/paso-2");
    } else {
      navigate("/solicitud-drogas-clase-b-capa-c");
    }
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Solo se permiten archivos PDF, JPG o PNG");
        e.target.value = "";
        return;
      }
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB");
        e.target.value = "";
        return;
      }
      setter(file);
    }
  };

  const handleSubmit = async () => {
    // Validar que todos los archivos estén cargados
    if (
      !cedulaRepresentante ||
      !cedulaFarmaceutico ||
      !tituloFarmaceutico ||
      !exequaturFarmaceutico ||
      !reciboPago
    ) {
      alert("Debe cargar todos los documentos requeridos");
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar el objeto de formulario para el backend
      const formularioData = {
        // Actividades
        actividades: formData.actividades,
        
        // Sustancias Controladas (solo si tiene actividades especiales)
        categoriasSustancias: formData.categoriasSustancias,
        codigoGrupo: formData.codigoGrupo,
        designacionSustancias: formData.designacionSustancias,
        
        // Administrador/Propietario (solo si tiene actividades especiales)
        nombreAdministrador: formData.nombreAdministrador,
        direccionAdministrador: formData.direccionAdministrador,
        cedulaAdministrador: formData.cedulaAdministrador,
        rnc: formData.rnc,
        telefonoAdministrador: formData.telefonoAdministrador,
        lugarTrabajoAdministrador: formData.lugarTrabajoAdministrador,
        
        // Agente Aduanero (solo si tiene actividades especiales)
        nombreAgenteAduanero: formData.nombreAgenteAduanero,
        direccionAgenteAduanero: formData.direccionAgenteAduanero,
        cedulaAgenteAduanero: formData.cedulaAgenteAduanero,
        rnc2: formData.rnc2,
        telefonoAgenteAduanero: formData.telefonoAgenteAduanero,
        lugarTrabajoAgenteAduanero: formData.lugarTrabajoAgenteAduanero,
      };

      // Obtener la cédula del usuario desde localStorage
      const cedula = localStorage.getItem("cedula");
      if (!cedula) {
        alert("No se pudo obtener la información del usuario");
        setIsSubmitting(false);
        return;
      }

      // Crear la solicitud
      const tipoServicioId = 5; // ID para Drogas Clase B Capa C
      const solicitudResponse = await createRequest(
        cedula,
        tipoServicioId,
        formularioData
      );

      if (!solicitudResponse || !solicitudResponse.id) {
        throw new Error("No se pudo crear la solicitud");
      }

      const solicitudId = solicitudResponse.id;

      // Subir los documentos
      const documentos = [
        { file: cedulaRepresentante, nombre: "Cédula del Representante de la Entidad" },
        { file: cedulaFarmaceutico, nombre: "Cédula del Farmacéutico Responsable" },
        { file: tituloFarmaceutico, nombre: "Título del Farmacéutico Responsable" },
        { file: exequaturFarmaceutico, nombre: "Exequátur del Farmacéutico Responsable" },
        { file: reciboPago, nombre: "Recibo de Depósito del Pago" },
      ];

      for (const doc of documentos) {
        await uploadDocument(solicitudId, doc.file, doc.nombre);
      }

      // Limpiar el formulario
      clearFormData();

      // Navegar a la página de éxito
      navigate("/solicitud-drogas-clase-b-capa-c/exito");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert(
        "Ocurrió un error al enviar la solicitud. Por favor, intente nuevamente."
      );
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-[#4A8BDF]">
            Solicitud de Certificado de Inscripción de Drogas Controladas Clase B
            para Hospitales Públicos y/u otras Instituciones Públicas
          </h1>
        </div>

        {/* Formulario de Documentos */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">Documentos</h2>

          <div className="space-y-6">
            {/* Cédula del Representante */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula del Representante de la Entidad
                </label>
                <p className="text-xs text-gray-500">
                  Solo se permiten archivos PNG, JPG o PDF
                </p>
              </div>
              <div className="ml-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setCedulaRepresentante)}
                    className="hidden"
                  />
                  <span className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-block">
                    {cedulaRepresentante ? "Cambiar Documento" : "Subir Documento"}
                  </span>
                </label>
                {cedulaRepresentante && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {cedulaRepresentante.name}
                  </p>
                )}
              </div>
            </div>

            {/* Cédula del Farmacéutico */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula del Farmacéutico Responsable
                </label>
                <p className="text-xs text-gray-500">
                  Solo se permiten archivos PNG, JPG o PDF
                </p>
              </div>
              <div className="ml-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setCedulaFarmaceutico)}
                    className="hidden"
                  />
                  <span className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-block">
                    {cedulaFarmaceutico ? "Cambiar Documento" : "Subir Documento"}
                  </span>
                </label>
                {cedulaFarmaceutico && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {cedulaFarmaceutico.name}
                  </p>
                )}
              </div>
            </div>

            {/* Título del Farmacéutico */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Farmacéutico Responsable
                </label>
                <p className="text-xs text-gray-500">
                  Solo se permiten archivos PNG, JPG o PDF
                </p>
              </div>
              <div className="ml-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setTituloFarmaceutico)}
                    className="hidden"
                  />
                  <span className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-block">
                    {tituloFarmaceutico ? "Cambiar Documento" : "Subir Documento"}
                  </span>
                </label>
                {tituloFarmaceutico && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {tituloFarmaceutico.name}
                  </p>
                )}
              </div>
            </div>

            {/* Exequátur del Farmacéutico */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exequátur del Farmacéutico Responsable
                </label>
                <p className="text-xs text-gray-500">
                  Solo se permiten archivos PNG, JPG o PDF
                </p>
              </div>
              <div className="ml-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setExequaturFarmaceutico)}
                    className="hidden"
                  />
                  <span className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-block">
                    {exequaturFarmaceutico ? "Cambiar Documento" : "Subir Documento"}
                  </span>
                </label>
                {exequaturFarmaceutico && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {exequaturFarmaceutico.name}
                  </p>
                )}
              </div>
            </div>

            {/* Recibo de Pago */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recibo de Depósito del Pago
                </label>
                <p className="text-xs text-gray-500">
                  Solo se permiten archivos PNG, JPG o PDF
                </p>
              </div>
              <div className="ml-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setReciboPago)}
                    className="hidden"
                  />
                  <span className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 inline-block">
                    {reciboPago ? "Cambiar Documento" : "Subir Documento"}
                  </span>
                </label>
                {reciboPago && (
                  <p className="text-xs text-green-600 mt-1">✓ {reciboPago.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            disabled={isSubmitting}
            className="bg-[#0B57A6] hover:bg-[#084c8a] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      {showModal && (
        <ModalConfirmacionEnvio
          onConfirm={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
