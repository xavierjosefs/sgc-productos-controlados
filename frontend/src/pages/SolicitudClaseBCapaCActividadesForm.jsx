import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientTopbar from "../components/ClientTopbar";
import { useSolicitudClaseBCapaC } from "../contexts/SolicitudClaseBCapaCContext";
import useRequestsAPI from '../hooks/useRequestsAPI';

export default function SolicitudClaseBCapaCActividadesForm() {
  const navigate = useNavigate();
  const { formData, updateFormData, clearFormData } = useSolicitudClaseBCapaC();
  const { createRequest } = useRequestsAPI();
  const [submitting, setSubmitting] = useState(false);

  // Limpiar el contexto cuando se monta el componente (nueva solicitud)
  useEffect(() => {
    clearFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Identificación
  const [nombreEmpresa, setNombreEmpresa] = useState(formData.nombreEmpresa || "");
  const [direccionCamaPostal, setDireccionCamaPostal] = useState(formData.direccionCamaPostal || "");
  const [rncEmpresa, setRncEmpresa] = useState(formData.rncEmpresa || "");
  const [telefonoEmpresa, setTelefonoEmpresa] = useState(formData.telefonoEmpresa || "");
  const [correoEmpresa, setCorreoEmpresa] = useState(formData.correoEmpresa || "");

  // Actividades
  const [actividades, setActividades] = useState(formData.actividades || []);

  // Condición de Solicitud
  const [condicionSolicitud, setCondicionSolicitud] = useState(formData.condicionSolicitud || "");
  const [otraCondicion, setOtraCondicion] = useState(formData.otraCondicion || "");
  const [especifiqueNoGdc, setEspecifiqueNoGdc] = useState(formData.especifiqueNoGdc || "");
  const [especifiqueElMotivo, setEspecifiqueElMotivo] = useState(formData.especifiqueElMotivo || "");

  // Regente Farmacéutico
  const [nombreRegente, setNombreRegente] = useState(formData.nombreRegente || "");
  const [direccionRegente, setDireccionRegente] = useState(formData.direccionRegente || "");
  const [cedulaRegente, setCedulaRegente] = useState(formData.cedulaRegente || "");
  const [exequaturRegente, setExequaturRegente] = useState(formData.exequaturRegente || "");
  const [telefonoRegente, setTelefonoRegente] = useState(formData.telefonoRegente || "");
  const [lugarTrabajoRegente, setLugarTrabajoRegente] = useState(formData.lugarTrabajoRegente || "");

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Validaciones
  const errors = useMemo(() => {
    if (!attemptedSubmit) return {};
    
    const newErrors = {};

    // Identificación
    if (!nombreEmpresa.trim()) newErrors.nombreEmpresa = "Este campo es obligatorio";
    if (!direccionCamaPostal.trim()) newErrors.direccionCamaPostal = "Este campo es obligatorio";
    if (!rncEmpresa.trim()) newErrors.rncEmpresa = "Este campo es obligatorio";
    if (!telefonoEmpresa.trim()) newErrors.telefonoEmpresa = "Este campo es obligatorio";
    if (!correoEmpresa.trim()) {
      newErrors.correoEmpresa = "Este campo es obligatorio";
    } else if (!/^\S+@\S+\.\S+$/.test(correoEmpresa)) {
      newErrors.correoEmpresa = "Correo electrónico inválido";
    }

    // Actividades
    if (actividades.length === 0) newErrors.actividades = "Debe seleccionar al menos una actividad";
    if (actividades.includes("Otra (especifique):") && !otraCondicion.trim()) {
      newErrors.otraCondicionActividad = "Debe especificar la actividad";
    }

    // Condición de Solicitud
    if (!condicionSolicitud) newErrors.condicionSolicitud = "Debe seleccionar una condición";
    if (condicionSolicitud === "Otro, especifique" && !otraCondicion.trim()) {
      newErrors.otraCondicion = "Debe especificar la condición";
    }

    // Regente Farmacéutico
    if (!nombreRegente.trim()) newErrors.nombreRegente = "Este campo es obligatorio";
    if (!direccionRegente.trim()) newErrors.direccionRegente = "Este campo es obligatorio";
    if (!cedulaRegente.trim()) {
      newErrors.cedulaRegente = "Este campo es obligatorio";
    } else if (cedulaRegente.length !== 11) {
      newErrors.cedulaRegente = "La cédula debe tener 11 dígitos";
    }
    if (!exequaturRegente.trim()) newErrors.exequaturRegente = "Este campo es obligatorio";
    if (!telefonoRegente.trim()) newErrors.telefonoRegente = "Este campo es obligatorio";

    return newErrors;
  }, [
    attemptedSubmit,
    nombreEmpresa,
    direccionCamaPostal,
    rncEmpresa,
    telefonoEmpresa,
    correoEmpresa,
    actividades,
    otraCondicion,
    condicionSolicitud,
    nombreRegente,
    direccionRegente,
    cedulaRegente,
    exequaturRegente,
    telefonoRegente,
  ]);

  const isValid = Object.keys(errors).length === 0;

  const handleActividadChange = (actividad) => {
    setActividades((prev) => {
      if (prev.includes(actividad)) {
        return prev.filter((a) => a !== actividad);
      } else {
        return [...prev, actividad];
      }
    });
  };

  const handleBack = () => {
    navigate("/");
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
      nombreEmpresa,
      direccionCamaPostal,
      rncEmpresa,
      telefonoEmpresa,
      correoEmpresa,
      actividades,
      condicionSolicitud,
      otraCondicion,
      especifiqueNoGdc,
      especifiqueElMotivo,
      nombreRegente,
      direccionRegente,
      cedulaRegente,
      exequaturRegente,
      telefonoRegente,
      lugarTrabajoRegente,
    };
    
    // Guardar datos en el contexto
    updateFormData(currentFormData);

    // Verificar si seleccionaron Importadora, Exportadora o Fabricante
    const tieneActividadesEspeciales = actividades.some(act => 
      ['Importadora', 'Exportadora', 'Fabricante'].includes(act)
    );

    if (tieneActividadesEspeciales) {
      // Si tienen actividades especiales, ir a la segunda pantalla (sustancias/admin/agente)
      navigate("/solicitud-clase-b-capa-c");
    } else {
      // Si NO tienen actividades especiales, crear la solicitud directamente
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
        const esRenovacion = condicionSolicitud === 'Renovación';
        const esExtraviado = condicionSolicitud === 'Robo o Perdida';
        
        let rutaDocumentos = '/solicitud-clase-b-capa-c/documentos';
        if (esRenovacion) {
          rutaDocumentos = '/solicitud-clase-b-capa-c/documentos-renovacion';
        } else if (esExtraviado) {
          rutaDocumentos = '/solicitud-clase-b-capa-c/documentos-extraviado';
        }

        navigate(rutaDocumentos, { 
          state: { requestId, fromForm: true } 
        });
      } catch (error) {
        console.error('Error al crear solicitud:', error);
        alert(error?.message || 'Error al guardar la solicitud. Por favor intenta de nuevo.');
        setSubmitting(false);
      }
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
          {/* Identificación */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Identificación
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa / Razón Social <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  className={`${errors.nombreEmpresa ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Nombre completo de la empresa"
                  aria-invalid={!!errors.nombreEmpresa}
                />
                {errors.nombreEmpresa && <p className="text-xs text-red-500 mt-2">{errors.nombreEmpresa}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección/Cama Postal (Local) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={direccionCamaPostal}
                  onChange={(e) => setDireccionCamaPostal(e.target.value)}
                  className={`${errors.direccionCamaPostal ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Dirección completa"
                  aria-invalid={!!errors.direccionCamaPostal}
                />
                {errors.direccionCamaPostal && <p className="text-xs text-red-500 mt-2">{errors.direccionCamaPostal}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RNC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rncEmpresa}
                  onChange={(e) => setRncEmpresa(e.target.value)}
                  className={`${errors.rncEmpresa ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="000-00000-0"
                  aria-invalid={!!errors.rncEmpresa}
                />
                {errors.rncEmpresa && <p className="text-xs text-red-500 mt-2">{errors.rncEmpresa}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={telefonoEmpresa}
                  onChange={(e) => setTelefonoEmpresa(e.target.value)}
                  className={`${errors.telefonoEmpresa ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="809-000-0000"
                  aria-invalid={!!errors.telefonoEmpresa}
                />
                {errors.telefonoEmpresa && <p className="text-xs text-red-500 mt-2">{errors.telefonoEmpresa}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={correoEmpresa}
                  onChange={(e) => setCorreoEmpresa(e.target.value)}
                  className={`${errors.correoEmpresa ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="ejemplo@correo.com"
                  aria-invalid={!!errors.correoEmpresa}
                />
                {errors.correoEmpresa && <p className="text-xs text-red-500 mt-2">{errors.correoEmpresa}</p>}
              </div>
            </div>
          </div>

          {/* Actividades */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Actividad(es) <span className="text-red-500">*</span>
            </h2>

            {errors.actividades && <p className="text-xs text-red-500 mb-3">{errors.actividades}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Importadora")}
                  onChange={() => handleActividadChange("Importadora")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Importadora</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Exportadora")}
                  onChange={() => handleActividadChange("Exportadora")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Exportadora</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Fabricante")}
                  onChange={() => handleActividadChange("Fabricante")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Fabricante</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Distribuidora")}
                  onChange={() => handleActividadChange("Distribuidora")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Distribuidora</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Farmacia")}
                  onChange={() => handleActividadChange("Farmacia")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Farmacia</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Droguería")}
                  onChange={() => handleActividadChange("Droguería")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Droguería</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Hospital")}
                  onChange={() => handleActividadChange("Hospital")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Hospital</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Clínica")}
                  onChange={() => handleActividadChange("Clínica")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Clínica</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actividades.includes("Otra (especifique):")}
                  onChange={() => handleActividadChange("Otra (especifique):")}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 rounded focus:ring-[#4A8BDF]"
                />
                <span className="text-sm text-gray-700">Otra (especifique):</span>
              </label>

              {actividades.includes("Otra (especifique):") && (
                <div className="ml-7">
                  <input
                    type="text"
                    value={otraCondicion}
                    onChange={(e) => setOtraCondicion(e.target.value)}
                    className={`${errors.otraCondicionActividad ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                    placeholder="Especifique"
                    aria-invalid={!!errors.otraCondicionActividad}
                  />
                  {errors.otraCondicionActividad && <p className="text-xs text-red-500 mt-2">{errors.otraCondicionActividad}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Condición de Solicitud */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Condición de Solicitud <span className="text-red-500">*</span>
            </h2>

            {errors.condicionSolicitud && <p className="text-xs text-red-500 mb-3">{errors.condicionSolicitud}</p>}

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="condicionSolicitud"
                  value="Primera solicitud"
                  checked={condicionSolicitud === "Primera solicitud"}
                  onChange={(e) => setCondicionSolicitud(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 focus:ring-[#4A8BDF] mt-1"
                />
                <span className="text-sm text-gray-700">a) Primera solicitud</span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="condicionSolicitud"
                  value="Renovación"
                  checked={condicionSolicitud === "Renovación"}
                  onChange={(e) => setCondicionSolicitud(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 focus:ring-[#4A8BDF] mt-1"
                />
                <span className="text-sm text-gray-700">b) Renovación</span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="condicionSolicitud"
                  value="Solicitud-cambiar negocio"
                  checked={condicionSolicitud === "Solicitud-cambiar negocio"}
                  onChange={(e) => setCondicionSolicitud(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 focus:ring-[#4A8BDF] mt-1"
                />
                <span className="text-sm text-gray-700">c) Solicitud-cambiar negocio</span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="condicionSolicitud"
                  value="QFC revalidado, suspendido"
                  checked={condicionSolicitud === "QFC revalidado, suspendido"}
                  onChange={(e) => setCondicionSolicitud(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 focus:ring-[#4A8BDF] mt-1"
                />
                <span className="text-sm text-gray-700">d) QFC revalidado, suspendido</span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="condicionSolicitud"
                  value="Robo o Perdida"
                  checked={condicionSolicitud === "Robo o Perdida"}
                  onChange={(e) => setCondicionSolicitud(e.target.value)}
                  className="w-4 h-4 text-[#4A8BDF] border-gray-300 focus:ring-[#4A8BDF] mt-1"
                />
                <span className="text-sm text-gray-700">e) Robo o Perdida</span>
              </label>

              <div className="space-y-2">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="condicionSolicitud"
                    value="Otro, especifique"
                    checked={condicionSolicitud === "Otro, especifique"}
                    onChange={(e) => setCondicionSolicitud(e.target.value)}
                    className="w-4 h-4 text-[#4A8BDF] border-gray-300 focus:ring-[#4A8BDF] mt-1"
                  />
                  <span className="text-sm text-gray-700">f) Otro, especifique</span>
                </label>

                {condicionSolicitud === "Otro, especifique" && (
                  <div className="ml-7">
                    <input
                      type="text"
                      value={otraCondicion}
                      onChange={(e) => setOtraCondicion(e.target.value)}
                      className={`${errors.otraCondicion ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                      placeholder="Especifique"
                      aria-invalid={!!errors.otraCondicion}
                    />
                    {errors.otraCondicion && <p className="text-xs text-red-500 mt-2">{errors.otraCondicion}</p>}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Si su respuesta fue <strong>b</strong> o <strong>c</strong>, especifique el No. GDC:
                    </label>
                    <input
                      type="text"
                      value={especifiqueNoGdc}
                      onChange={(e) => setEspecifiqueNoGdc(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Si su respuesta fue <strong>d</strong> o <strong>e</strong>, especifique el motivo:
                    </label>
                    <textarea
                      value={especifiqueElMotivo}
                      onChange={(e) => setEspecifiqueElMotivo(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regente Farmacéutico */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-6">
              Regente Farmacéutico
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Regente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombreRegente}
                  onChange={(e) => setNombreRegente(e.target.value)}
                  className={`${errors.nombreRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Nombre completo"
                  aria-invalid={!!errors.nombreRegente}
                />
                {errors.nombreRegente && <p className="text-xs text-red-500 mt-2">{errors.nombreRegente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={direccionRegente}
                  onChange={(e) => setDireccionRegente(e.target.value)}
                  className={`${errors.direccionRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Dirección completa"
                  aria-invalid={!!errors.direccionRegente}
                />
                {errors.direccionRegente && <p className="text-xs text-red-500 mt-2">{errors.direccionRegente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cédula de Identidad y Electoral <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cedulaRegente}
                  onChange={(e) => setCedulaRegente(e.target.value.replace(/\D/g, ""))}
                  className={`${errors.cedulaRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="000-0000000-0"
                  maxLength={11}
                  aria-invalid={!!errors.cedulaRegente}
                />
                {errors.cedulaRegente && <p className="text-xs text-red-500 mt-2">{errors.cedulaRegente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exequátur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={exequaturRegente}
                  onChange={(e) => setExequaturRegente(e.target.value)}
                  className={`${errors.exequaturRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="Número de exequátur"
                  aria-invalid={!!errors.exequaturRegente}
                />
                {errors.exequaturRegente && <p className="text-xs text-red-500 mt-2">{errors.exequaturRegente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono(s) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={telefonoRegente}
                  onChange={(e) => setTelefonoRegente(e.target.value)}
                  className={`${errors.telefonoRegente ? 'border-red-500' : 'border-gray-300'} w-full px-4 py-3 border rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF]`}
                  placeholder="809-000-0000"
                  aria-invalid={!!errors.telefonoRegente}
                />
                {errors.telefonoRegente && <p className="text-xs text-red-500 mt-2">{errors.telefonoRegente}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Otro Lugar de Trabajo
                </label>
                <input
                  type="text"
                  value={lugarTrabajoRegente}
                  onChange={(e) => setLugarTrabajoRegente(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A8BDF] focus:border-transparent"
                  placeholder="Lugar de trabajo"
                />
              </div>
            </div>
          </div>

          {/* Pago */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-lg font-bold text-[#2B6CB0] mb-4">Pago</h2>
            <div className="text-gray-700 text-sm leading-relaxed space-y-2">
              <p><span className="font-medium">Cuenta de Ingresos Externos – DNCD (BanReservas)</span></p>
              <p>No.: 100-01-240-012653-9</p>
              <p className="font-semibold">Costo del Servicio: RD$500.00</p>
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
