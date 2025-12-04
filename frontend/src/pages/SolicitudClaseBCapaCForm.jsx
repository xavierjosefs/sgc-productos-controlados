import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ClientTopbar from "../components/ClientTopbar";
import { useSolicitudClaseBCapaC } from "../contexts/SolicitudClaseBCapaCContext";
import useRequestsAPI from '../hooks/useRequestsAPI';

export default function SolicitudClaseBCapaCForm() {
  const navigate = useNavigate();
  const { formData, updateFormData } = useSolicitudClaseBCapaC();
  const { createRequest } = useRequestsAPI();
  const [submitting, setSubmitting] = useState(false);

  const [categoriasSustancias, setCategoriasSustancias] = useState(
    formData.categoriasSustancias || []
  );
  const [codigoGrupo, setCodigoGrupo] = useState(formData.codigoGrupo || "");
  const [designacionSustancias, setDesignacionSustancias] = useState(
    formData.designacionSustancias || ""
  );

  // Administrador/Propietario
  const [nombreAdministrador, setNombreAdministrador] = useState(
    formData.nombreAdministrador || ""
  );
  const [direccionAdministrador, setDireccionAdministrador] = useState(
    formData.direccionAdministrador || ""
  );
  const [cedulaAdministrador, setCedulaAdministrador] = useState(
    formData.cedulaAdministrador || ""
  );
  const [rnc, setRnc] = useState(formData.rnc || "");
  const [telefonoAdministrador, setTelefonoAdministrador] = useState(
    formData.telefonoAdministrador || ""
  );
  const [lugarTrabajoAdministrador, setLugarTrabajoAdministrador] = useState(
    formData.lugarTrabajoAdministrador || ""
  );

  // Agente Aduanero
  const [nombreAgenteAduanero, setNombreAgenteAduanero] = useState(
    formData.nombreAgenteAduanero || ""
  );
  const [direccionAgenteAduanero, setDireccionAgenteAduanero] = useState(
    formData.direccionAgenteAduanero || ""
  );
  const [cedulaAgenteAduanero, setCedulaAgenteAduanero] = useState(
    formData.cedulaAgenteAduanero || ""
  );
  const [rnc2, setRnc2] = useState(formData.rnc2 || "");
  const [telefonoAgenteAduanero, setTelefonoAgenteAduanero] = useState(
    formData.telefonoAgenteAduanero || ""
  );
  const [lugarTrabajoAgenteAduanero, setLugarTrabajoAgenteAduanero] = useState(
    formData.lugarTrabajoAgenteAduanero || ""
  );

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Validaciones
  const errors = useMemo(() => {
    if (!attemptedSubmit) return {};
    
    const newErrors = {};

    // Sustancias Controladas
    if (categoriasSustancias.length === 0) newErrors.categoriasSustancias = "Debe seleccionar al menos una categoría";
    if (!codigoGrupo.trim()) newErrors.codigoGrupo = "Este campo es obligatorio";
    if (!designacionSustancias.trim()) newErrors.designacionSustancias = "Este campo es obligatorio";

    // Administrador/Propietario
    if (!nombreAdministrador.trim()) newErrors.nombreAdministrador = "Este campo es obligatorio";
    if (!direccionAdministrador.trim()) newErrors.direccionAdministrador = "Este campo es obligatorio";
    if (!cedulaAdministrador.trim()) {
      newErrors.cedulaAdministrador = "Este campo es obligatorio";
    } else if (cedulaAdministrador.length !== 11) {
      newErrors.cedulaAdministrador = "La cédula debe tener 11 dígitos";
    }

    // Agente Aduanero
    if (!nombreAgenteAduanero.trim()) newErrors.nombreAgenteAduanero = "Este campo es obligatorio";
    if (!direccionAgenteAduanero.trim()) newErrors.direccionAgenteAduanero = "Este campo es obligatorio";
    if (!cedulaAgenteAduanero.trim()) {
      newErrors.cedulaAgenteAduanero = "Este campo es obligatorio";
    } else if (cedulaAgenteAduanero.length !== 11) {
      newErrors.cedulaAgenteAduanero = "La cédula debe tener 11 dígitos";
    }

    return newErrors;
  }, [
    attemptedSubmit,
    categoriasSustancias,
    codigoGrupo,
    designacionSustancias,
    nombreAdministrador,
    direccionAdministrador,
    cedulaAdministrador,
    nombreAgenteAduanero,
    direccionAgenteAduanero,
    cedulaAgenteAduanero,
  ]);

  const isValid = Object.keys(errors).length === 0;

  const handleCategoriaChange = (categoria) => {
    setCategoriasSustancias((prev) => {
      if (prev.includes(categoria)) {
        return prev.filter((c) => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const handleBack = () => {
    navigate("/solicitud-clase-b-capa-c/actividades");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Primero activamos attemptedSubmit para mostrar errores
    if (!attemptedSubmit) {
      setAttemptedSubmit(true);
      // Forzar que React recalcule antes de continuar
      setTimeout(() => {
        const hasErrors = Object.keys(errors).length > 0;
        if (hasErrors) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
      return; // Salir y esperar al siguiente submit
    }

    // En el segundo submit, verificar si es válido
    if (!isValid || submitting) {
      if (!isValid) window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Datos de este formulario
    const currentFormData = {
      categoriasSustancias,
      codigoGrupo,
      designacionSustancias,
      nombreAdministrador,
      direccionAdministrador,
      cedulaAdministrador,
      rnc,
      telefonoAdministrador,
      lugarTrabajoAdministrador,
      nombreAgenteAduanero,
      direccionAgenteAduanero,
      cedulaAgenteAduanero,
      rnc2,
      telefonoAgenteAduanero,
      lugarTrabajoAgenteAduanero,
    };

    // Guardar en el contexto
    updateFormData(currentFormData);

    // Crear la solicitud con TODOS los datos
    setSubmitting(true);
    try {
      const fullFormData = { ...formData, ...currentFormData };
      const resp = await createRequest({
        nombre_servicio: 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas',
        formulario: fullFormData
      });
      
      const newRequest = resp.request || resp;
      const requestId = newRequest.id || newRequest.request?.id;

      if (!requestId) {
        throw new Error('No se pudo crear la solicitud');
      }

      // Determinar a qué pantalla de documentos ir según la condición
      const esExtraviado = fullFormData.condicionSolicitud === 'Robo o Perdida';
      const rutaDocumentos = esExtraviado 
        ? '/solicitud-clase-b-capa-c/documentos-extraviado'
        : '/solicitud-clase-b-capa-c/documentos';

      navigate(rutaDocumentos, { 
        state: { requestId, fromForm: true } 
      });
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      alert(error?.message || 'Error al guardar la solicitud. Por favor intenta de nuevo.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sustancias Controladas */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Sustancias Controladas
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categorías de drogas controladas que solicita <span className="text-red-500">*</span>
                </label>
                {errors.categoriasSustancias && <p className="text-xs text-red-500 mb-3">{errors.categoriasSustancias}</p>}
                <div className="flex flex-wrap gap-4">
                  {["II", "III", "IV"].map((categoria) => (
                    <label
                      key={categoria}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={categoriasSustancias.includes(categoria)}
                        onChange={() => handleCategoriaChange(categoria)}
                        className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                      />
                      <span className="text-sm text-gray-700">{categoria}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de los Grupos de Complejidad II y IV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={codigoGrupo}
                  onChange={(e) => setCodigoGrupo(e.target.value)}
                  className={`${errors.codigoGrupo ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Ingrese el código"
                  aria-invalid={!!errors.codigoGrupo}
                />
                {errors.codigoGrupo && <p className="text-xs text-red-500 mt-2">{errors.codigoGrupo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designación de Sustancias Controladas <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={designacionSustancias}
                  onChange={(e) => setDesignacionSustancias(e.target.value)}
                  rows={4}
                  className={`${errors.designacionSustancias ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Describa las sustancias"
                  aria-invalid={!!errors.designacionSustancias}
                />
                {errors.designacionSustancias && <p className="text-xs text-red-500 mt-2">{errors.designacionSustancias}</p>}
              </div>
            </div>
          </div>

          {/* Administrador/Propietario */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Administrador/Propietario
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Administrador / Propietario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombreAdministrador}
                  onChange={(e) => setNombreAdministrador(e.target.value)}
                  className={`${errors.nombreAdministrador ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Nombre completo"
                  aria-invalid={!!errors.nombreAdministrador}
                />
                {errors.nombreAdministrador && <p className="text-xs text-red-500 mt-2">{errors.nombreAdministrador}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={direccionAdministrador}
                  onChange={(e) => setDireccionAdministrador(e.target.value)}
                  className={`${errors.direccionAdministrador ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Dirección completa"
                  aria-invalid={!!errors.direccionAdministrador}
                />
                {errors.direccionAdministrador && <p className="text-xs text-red-500 mt-2">{errors.direccionAdministrador}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cedulaAdministrador}
                  onChange={(e) =>
                    setCedulaAdministrador(e.target.value.replace(/\D/g, ""))
                  }
                  className={`${errors.cedulaAdministrador ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="000-0000000-0"
                  maxLength={11}
                  aria-invalid={!!errors.cedulaAdministrador}
                />
                {errors.cedulaAdministrador && <p className="text-xs text-red-500 mt-2">{errors.cedulaAdministrador}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC
                </label>
                <input
                  type="text"
                  value={rnc}
                  onChange={(e) => setRnc(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="000-00000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s)
                </label>
                <input
                  type="tel"
                  value={telefonoAdministrador}
                  onChange={(e) => setTelefonoAdministrador(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="809-000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  value={lugarTrabajoAdministrador}
                  onChange={(e) => setLugarTrabajoAdministrador(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Lugar de trabajo"
                />
              </div>
            </div>
          </div>

          {/* Agente Aduanero */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Agente Aduanero
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Agente Aduanero <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombreAgenteAduanero}
                  onChange={(e) => setNombreAgenteAduanero(e.target.value)}
                  className={`${errors.nombreAgenteAduanero ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Nombre completo"
                  aria-invalid={!!errors.nombreAgenteAduanero}
                />
                {errors.nombreAgenteAduanero && <p className="text-xs text-red-500 mt-2">{errors.nombreAgenteAduanero}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={direccionAgenteAduanero}
                  onChange={(e) => setDireccionAgenteAduanero(e.target.value)}
                  className={`${errors.direccionAgenteAduanero ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Dirección completa"
                  aria-invalid={!!errors.direccionAgenteAduanero}
                />
                {errors.direccionAgenteAduanero && <p className="text-xs text-red-500 mt-2">{errors.direccionAgenteAduanero}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cedulaAgenteAduanero}
                  onChange={(e) =>
                    setCedulaAgenteAduanero(e.target.value.replace(/\D/g, ""))
                  }
                  className={`${errors.cedulaAgenteAduanero ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="000-0000000-0"
                  maxLength={11}
                  aria-invalid={!!errors.cedulaAgenteAduanero}
                />
                {errors.cedulaAgenteAduanero && <p className="text-xs text-red-500 mt-2">{errors.cedulaAgenteAduanero}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC
                </label>
                <input
                  type="text"
                  value={rnc2}
                  onChange={(e) => setRnc2(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="000-00000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s)
                </label>
                <input
                  type="tel"
                  value={telefonoAgenteAduanero}
                  onChange={(e) => setTelefonoAgenteAduanero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="809-000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  value={lugarTrabajoAgenteAduanero}
                  onChange={(e) => setLugarTrabajoAgenteAduanero(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Lugar de trabajo"
                />
              </div>
            </div>
          </div>

          {/* Botón de Continuar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={attemptedSubmit && !isValid}
              className="bg-[#0B57A6] hover:bg-[#084c8a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
