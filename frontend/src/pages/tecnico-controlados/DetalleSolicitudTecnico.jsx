import React, { useEffect, useState } from 'react';
import Modal from '../../components/ConfirmationModal';
import BadgeEstado from '../../components/BadgeEstado';
import { useParams, useNavigate } from 'react-router-dom';
import useTecnicoAPI from '../../hooks/useTecnicoAPI';
import TecnicoTopbar from '../../components/TecnicoTopbar';
import { toast } from 'react-hot-toast';

const DetalleSolicitudTecnico = () => {
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [showAprobarModal, setShowAprobarModal] = useState(false);
  const [procesado, setProcesado] = useState(false);
  const [tipoAccion, setTipoAccion] = useState(null); // 'APROBADO' o 'NO_APROBADO'

  const { id } = useParams();
  const navigate = useNavigate();
  const { getRequestDetail, validateTecnicoRequest } = useTecnicoAPI();

  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentosEstado, setDocumentosEstado] = useState([]);
  const [formValidaciones, setFormValidaciones] = useState([]);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Función para formatear nombres de campos
  const formatearNombreCampo = (texto) => {
    let result = texto.replace(/([a-z])([A-Z])/g, '$1 $2');
    result = result.replace(/([a-zA-Z])(\d)/g, '$1 $2');
    result = result.replace(/[_-]/g, ' ');
    result = result.split(' ').map(palabra => {
      if (palabra.length === 0) return palabra;
      return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    }).join(' ');
    return result;
  };

  useEffect(() => {
    async function fetchDetalle() {
      setLoading(true);
      try {
        const res = await getRequestDetail(id);
        const data = res.detalle;

        setDetalle(data);

        // Inicializar documentos
        setDocumentosEstado(
          (data.documentos || []).map(doc => ({ id: doc.id, cumple: null }))
        );

        // Inicializar validaciones del formulario CON SOPORTE PARA OBJETOS ANIDADOS
        if (data.solicitud?.form_data) {
          const validaciones = [];

          Object.entries(data.solicitud.form_data).forEach(([key, value]) => {
            // Si es un objeto anidado, agregar cada subcampo
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              Object.entries(value).forEach(([subKey]) => {
                validaciones.push({ key: `${key}-${subKey}`, cumple: null });
              });
            } else {
              // Si es un valor simple, agregarlo directamente
              validaciones.push({ key, cumple: null });
            }
          });

          setFormValidaciones(validaciones);
        }
      } catch (error) {
        console.error(error);
        toast.error('No se pudo cargar la solicitud');
        navigate(-1);
      }
      setLoading(false);
    }
    fetchDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDocumentoChange = (docId, cumple) => {
    setDocumentosEstado(prev =>
      prev.map(d => d.id === docId ? { ...d, cumple } : d)
    );
  };

  // Cambia la validación de un campo (por key)
  const handleFormChange = (keyOrIdx, cumple) => {
    setFormValidaciones(prev =>
      prev.map((f, i) => (f.key === keyOrIdx || i === keyOrIdx) ? { ...f, cumple } : f)
    );
  };

  const todosSeleccionados =
    formValidaciones.length > 0 &&
    formValidaciones.every(f => f.cumple !== null) &&
    documentosEstado.length > 0 &&
    documentosEstado.every(d => d.cumple !== null);

  const todosCumplen =
    todosSeleccionados &&
    formValidaciones.every(f => f.cumple === true) &&
    documentosEstado.every(d => d.cumple === true);

  const algunNoCumple =
    todosSeleccionados &&
    (formValidaciones.some(f => f.cumple === false) ||
      documentosEstado.some(d => d.cumple === false));

  const handleSubmitAprobar = (e) => {
    e.preventDefault();
    if (!todosCumplen) {
      toast.error('Solo puede aprobar si todos los campos y documentos cumplen');
      return;
    }
    setShowAprobarModal(true);
  };

  const handleSubmitRechazar = () => {
    if (!algunNoCumple) {
      toast.error('Debe marcar al menos un campo o documento como "No Cumple"');
      return;
    }
    if (!comentario.trim()) {
      toast.error('Debe agregar un comentario explicando el rechazo');
      return;
    }
    setShowRechazoModal(true);
  };

  const enviarValidacion = async (recomendacion) => {
    setEnviando(true);
    try {
      const formulario_cumple = formValidaciones.every(f => f.cumple === true);

      // 👇 NUEVO: convertir validaciones a objeto
      const formulario_detalle = formValidaciones.reduce((acc, f) => {
        acc[f.key] = f.cumple;
        return acc;
      }, {});

      const documentos = documentosEstado.map(doc => ({
        id: doc.id,
        cumple: doc.cumple
      }));

      const comentario_general = comentario || '';
      console.log(formValidaciones);


      await validateTecnicoRequest(
        id,
        recomendacion,
        comentario_general,
        documentos,
        formulario_cumple,
        formulario_detalle // 👈 NUEVO
      );

      setTipoAccion(recomendacion);
      setProcesado(true);
    } catch {
      toast.error('Error al enviar validación');
    }
    setEnviando(false);
  };


  if (procesado) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-[#085297] mb-4">
          {tipoAccion === 'APROBADO' ? 'Aprobación Técnica Enviada' : 'Rechazo Técnico Enviado'}
        </h1>
        <div className="mb-6">
          <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="#085297">
            <circle cx="12" cy="12" r="10" strokeWidth="2" fill="#fff" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
          La solicitud ha sido enviada al Director para revisión y decisión final.
        </p>
        <button
          className="bg-[#085297] text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-[#0a63b7] transition"
          onClick={() => navigate('/tecnico-controlados')}
        >
          Volver a Solicitudes
        </button>
      </div>
    );
  }

  if (loading || !detalle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TecnicoTopbar />
        <div className="p-8">Cargando...</div>
      </div>
    );
  }

  const { solicitud, cliente, documentos } = detalle;
  // Mostrar comentario del director si la solicitud fue devuelta por director UPC (estado_id 16)
  const mostrarComentarioDirector = solicitud.estado_id === 16 && solicitud.comentario_director_upc;
  const modoSoloLectura = solicitud.estado && solicitud.estado.toLowerCase().includes('devuelta');

  return (
    <div className="min-h-screen bg-gray-50">
      <TecnicoTopbar />
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/tecnico-controlados')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Volver al dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-[#085297]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#4A8BDF]">
            Solicitud #{solicitud.id}
          </h1>
          {modoSoloLectura && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              Solo lectura
            </span>
          )}
        </div>

        {/* Información del Solicitante y Detalles (Sin cambios) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="font-semibold text-[#4A8BDF] mb-4">Información del Solicitante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
              <div><div className="font-medium text-gray-500">Cédula de Identidad y Electoral</div><div className="font-bold text-lg">{cliente.cedula}</div></div>
              <div><div className="font-medium text-gray-500">Nombre del Profesional</div><div className="font-bold text-lg">{cliente.nombre}</div></div>
              <div><div className="font-medium text-gray-500">Contacto</div><div className="font-bold text-lg">{cliente.contacto || '-'}</div></div>
              <div><div className="font-medium text-gray-500">Dirección</div><div className="font-bold text-lg">{cliente.direccion || '-'}</div></div>
              <div className="col-span-2"><div className="font-medium text-gray-500">Email</div><div className="font-bold text-lg">{cliente.email}</div></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <h2 className="font-semibold text-[#4A8BDF] mb-4">Detalles de la Solicitud</h2>
            <div className="flex flex-col gap-3 text-gray-700">
              <div><span className="font-medium text-gray-500">Tipo:</span> <span className="font-bold text-lg">{solicitud.tipo_solicitud}</span></div>
              <div><span className="font-medium text-gray-500">Servicio:</span> <span className="font-bold text-lg">{solicitud.servicio}</span></div>
              <div><span className="font-medium text-gray-500">Fecha:</span> <span className="font-bold text-lg">{new Date(solicitud.fecha_creacion).toLocaleDateString()}</span></div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-500">Estado:</span>
                <BadgeEstado estado={
                  solicitud.estado_actual && solicitud.estado_actual.trim() !== ''
                    ? solicitud.estado_actual
                    : solicitud.estado && solicitud.estado.trim() !== ''
                      ? solicitud.estado
                      : solicitud.estado_id === 7
                        ? 'Aprobado'
                        : solicitud.estado_id === 6
                          ? 'Pendiente'
                          : 'Sin estado'
                } />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Validación */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200 mb-8">
          {/* Comentario del director UPC si fue devuelta */}
          {mostrarComentarioDirector && (
            <div className="mb-8 p-4 border-l-4 border-yellow-500 bg-yellow-50">
              <div className="font-semibold text-yellow-700 mb-2">Comentario del Director UPC:</div>
              <div className="text-gray-800 whitespace-pre-line">{solicitud.comentario_director_upc}</div>
            </div>
          )}
          {/* Comentario de Dirección si fue devuelta/rechazada */}
          {solicitud.comentario_direccion && (
            <div className="mb-8 p-4 border-l-4 border-orange-500 bg-orange-50">
              <div className="font-semibold text-orange-700 mb-2">Comentario de Dirección:</div>
              <div className="text-gray-800 whitespace-pre-line">{solicitud.comentario_direccion}</div>
            </div>
          )}
          {/* NUEVO: Subtítulo para el Formulario */}
          <div className="mb-8">
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h3 className="text-xl font-bold text-[#4A8BDF]">Datos del Formulario</h3>
              <p className="text-sm text-gray-500">Información capturada digitalmente en la solicitud.</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              {solicitud.form_data && typeof solicitud.form_data === 'object' ? (
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(solicitud.form_data).map(([key, value]) => (
                      typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                        Object.entries(value).map(([subKey, subValue]) => {
                          const validIdx = `${key}-${subKey}`;
                          const validacion = formValidaciones.find(f => f.key === validIdx) || { key: validIdx, cumple: null };
                          return (
                            <tr key={validIdx} className="border-b border-gray-200 last:border-0">
                              <td className="py-3 pr-6 font-semibold text-gray-600 w-1/4">
                                {formatearNombreCampo(subKey)}
                              </td>
                              <td className="py-3 text-gray-800 w-1/2">{subValue === true ? 'Sí' : subValue === false ? 'No' : String(subValue)}</td>
                              <td className="py-3 w-1/4">
                                {!modoSoloLectura ? (
                                  <div className="flex gap-8">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`campo-cumple-${validIdx}`}
                                        checked={validacion.cumple === true}
                                        onChange={() => handleFormChange(validIdx, true)}
                                        className="accent-[#085297] w-5 h-5"
                                      />
                                      <span className="text-base">Sí Cumple</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`campo-cumple-${validIdx}`}
                                        checked={validacion.cumple === false}
                                        onChange={() => handleFormChange(validIdx, false)}
                                        className="accent-[#085297] w-5 h-5"
                                      />
                                      <span className="text-base">No Cumple</span>
                                    </label>
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr key={key} className="border-b border-gray-200 last:border-0">
                          <td className="py-3 pr-6 font-semibold text-gray-600 w-1/4">
                            {formatearNombreCampo(key)}
                          </td>
                          <td className="py-3 text-gray-800 w-1/2">{String(value)}</td>
                          <td className="py-3 w-1/4">
                            {!modoSoloLectura ? (
                              <div className="flex gap-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`campo-cumple-${key}`}
                                    checked={formValidaciones.find(f => f.key === key)?.cumple === true}
                                    onChange={() => handleFormChange(key, true)}
                                    className="accent-[#085297] w-5 h-5"
                                  />
                                  <span className="text-base">Sí Cumple</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`campo-cumple-${key}`}
                                    checked={formValidaciones.find(f => f.key === key)?.cumple === false}
                                    onChange={() => handleFormChange(key, false)}
                                    className="accent-[#085297] w-5 h-5"
                                  />
                                  <span className="text-base">No Cumple</span>
                                </label>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500">No hay datos de formulario.</div>
              )}
            </div>
          </div>

          {/* NUEVO: Subtítulo para Documentos */}
          <div className="mb-8">
            <div className="border-b border-gray-200 pb-2 mb-6 mt-10">
              <h3 className="text-xl font-bold" style={{ color: '#4A8BDF' }}>Documentación Requerida</h3>
              <p className="text-sm text-gray-500">
                Archivos adjuntos correspondientes a la solicitud #{solicitud.id}.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="space-y-8">
                {documentos.map((doc, idx) => (
                  <div key={doc.id} className="mb-2">
                    <div className="font-semibold mb-2" style={{ color: '#4A8BDF' }}>
                      {formatearNombreCampo(doc.nombre_descriptivo || doc.tipo_documento || `Documento ${idx + 1}`)}
                    </div>
                    <div className="flex items-center gap-6">
                      <input
                        type="text"
                        value={doc.nombre_archivo || ''}
                        readOnly
                        className="border border-gray-300 rounded-lg px-5 py-3 font-medium text-gray-700 min-w-[300px] bg-gray-50 focus:outline-none"
                      />
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#4A8BDF] text-white rounded-lg px-7 py-3 font-semibold shadow hover:bg-[#0a63b7] transition whitespace-nowrap"
                      >
                        Ver
                      </a>
                      {!modoSoloLectura && (
                        <div className="flex gap-8 ml-4">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`doc-cumple-${doc.id}`}
                              checked={documentosEstado.find(d => d.id === doc.id)?.cumple === true}
                              onChange={() => handleDocumentoChange(doc.id, true)}
                              className="accent-[#4A8BDF] w-5 h-5"
                            />
                            <span className="text-base">Sí Cumple</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={`doc-cumple-${doc.id}`}
                              checked={documentosEstado.find(d => d.id === doc.id)?.cumple === false}
                              onChange={() => handleDocumentoChange(doc.id, false)}
                              className="accent-[#4A8BDF] w-5 h-5"
                            />
                            <span className="text-base">No Cumple</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comentario General */}
          {!modoSoloLectura && (
            <div className="mb-8">
              <label className="font-semibold block mb-3">
                Comentario general {algunNoCumple && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full text-base focus:outline-none focus:ring-2 focus:ring-[#085297]"
                rows={3}
                placeholder={algunNoCumple ? "Requerido: explique por qué no cumple" : "Observaciones, detalles, etc. (opcional)"}
              />
            </div>
          )}

          {/* Botones de Acción */}
          {!modoSoloLectura && (
            <div className="flex gap-6 justify-end">
              <button
                type="button"
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition ${!todosSeleccionados || !algunNoCumple
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 shadow'
                  }`}
                onClick={handleSubmitRechazar}
                disabled={enviando || !todosSeleccionados || !algunNoCumple}
              >
                Rechazar
              </button>

              <button
                type="button"
                className={`px-8 py-3 rounded-lg font-semibold text-lg transition ${!todosSeleccionados || !todosCumplen
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#085297] text-white hover:bg-[#0a63b7] shadow'
                  }`}
                onClick={handleSubmitAprobar}
                disabled={enviando || !todosSeleccionados || !todosCumplen}
              >
                Aprobar
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showAprobarModal}
        title="Confirmar Aprobación Técnica"
        message={
          <>
            ¿Desea aprobar técnicamente esta solicitud?<br />
            Esta aprobación es temporal y será enviada al Director para su revisión y decisión final.
          </>
        }
        confirmText="Aprobar"
        confirmColor="blue"
        onConfirm={() => enviarValidacion('APROBADO')}
        onClose={() => setShowAprobarModal(false)}
        loading={enviando}
      />

      <Modal
        isOpen={showRechazoModal}
        title="Confirmar Rechazo Técnico"
        message={
          <>
            ¿Desea rechazar técnicamente esta solicitud?<br />
            El Director revisará este rechazo y determinará si lo <b>mantiene o lo modifica</b>.
          </>
        }
        confirmText="Rechazar"
        confirmColor="red"
        onConfirm={() => enviarValidacion('NO_APROBADO')}
        onClose={() => setShowRechazoModal(false)}
        loading={enviando}
      />
    </div>
  );
};

export default DetalleSolicitudTecnico;