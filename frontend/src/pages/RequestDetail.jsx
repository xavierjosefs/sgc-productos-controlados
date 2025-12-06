import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRequestsAPI from '../hooks/useRequestsAPI';
import BadgeEstado from '../components/BadgeEstado';
import ModalDocumento from '../components/ModalDocumento';
import ModalConfirmacionEliminar from '../components/ModalConfirmacionEliminar';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getRequestDetail,
    uploadDocument,
    deleteDocument,
    updateDocument
  } = useRequestsAPI();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReplaceOpen, setModalReplaceOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Cargar detalle de solicitud
  const fetchDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getRequestDetail(id);
      setRequest(data);
    } catch (error) {
      console.error('Error fetching request detail:', error);
      setError(error?.message || 'No se pudo cargar la solicitud');
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line
  }, [id]);

  // Subir documento
  const handleUpload = async (requestId, file) => {
    // Se envía un tipo de documento por defecto si no se especifica otro
    await uploadDocument(requestId, file, { tipo_documento: 'Documento General' });
    await fetchDetail();
  };

  // Reemplazar documento
  const handleReplace = async (requestId, file, documentId) => {
    await updateDocument(requestId, documentId, file);
    await fetchDetail();
  };

  // Abrir modal de confirmación de eliminación
  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setDeleteModalOpen(true);
  };

  // Cancelar eliminación
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
    setDeleteError('');
  };

  // Confirmar y ejecutar eliminación
  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteDocument(id, documentToDelete.id);
      setDeleteModalOpen(false);
      setDocumentToDelete(null);
      await fetchDetail();
    } catch (error) {
      console.error('Error deleting document:', error);
      setDeleteError(error?.message || 'Error al eliminar el documento');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <div className="py-12 text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;
  if (!request) return <div className="py-12 text-center text-gray-500">Solicitud no encontrada</div>;

  // Determinar si es editable (solo pendientes)
  // Usar la misma lógica que Home.jsx y RequestsFiltered.jsx
  const estadoLower = (request.estado_actual || '').toLowerCase();
  const isPending = estadoLower.includes('pendiente') || estadoLower.includes('revisión') || estadoLower.includes('evaluación');
  const formData = request.form_data || {};

  // Función para navegar a la pantalla de subir documentos correspondiente
  const handleGoToUploadDocuments = () => {
    const serviceName = request.tipo_servicio;
    
    // Para Clase A, verificar si es renovación o extraviado
    if (serviceName === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase A') {
      const esRenovacion = formData.condicion === 'Renovación';
      const esExtraviado = formData.condicion === 'Robo o Perdida';
      
      let route = '/solicitud-drogas-clase-a/documentos';
      if (esRenovacion) {
        route = '/solicitud-drogas-clase-a/documentos-renovacion';
      } else if (esExtraviado) {
        route = '/solicitud-drogas-clase-a/documentos-extraviado';
      }
      
      navigate(route, { state: { requestId: request.id, fromDetail: true } });
      return;
    }
    
    // Para Clase B Establecimientos Privados, verificar si es extraviado
    if (serviceName === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados') {
      const esExtraviado = formData.condicion === 'e) Robo o Perdida';
      const route = esExtraviado 
        ? '/solicitud-drogas-clase-b/documentos-extraviado'
        : '/solicitud-drogas-clase-b/documentos';
      navigate(route, { state: { requestId: request.id, fromDetail: true } });
      return;
    }
    
    // Para Clase B Capa C (Hospitales Públicos), verificar si es renovación o extraviado
    if (serviceName === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas') {
      const esRenovacion = formData.condicionSolicitud === 'Renovación';
      const esExtraviado = formData.condicionSolicitud === 'Robo o Perdida';
      
      let route = '/solicitud-clase-b-capa-c/documentos';
      if (esRenovacion) {
        route = '/solicitud-clase-b-capa-c/documentos-renovacion';
      } else if (esExtraviado) {
        route = '/solicitud-clase-b-capa-c/documentos-extraviado';
      }
      
      navigate(route, { state: { requestId: request.id, fromDetail: true } });
      return;
    }
    
    // Mapeo de servicios a rutas de documentos (resto de servicios)
    const routeMap = {
      'Solicitud de Permiso de Importación de Materia Prima de Sustancias Controladas': '/solicitud-importacion-materia-prima/documentos',
      'Solicitud de Permiso de Importación de Medicamentos con Sustancia Controlada': '/solicitud-importacion-medicamentos/documentos',
    };
    
    const route = routeMap[serviceName];
    if (route) {
      // Pasar el ID de la solicitud como state para que la pantalla de documentos lo use
      navigate(route, { state: { requestId: request.id, fromDetail: true } });
    } else {
      console.error('Ruta de documentos no encontrada para:', serviceName);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/')} className="text-[#4A8BDF] mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-[#4A8BDF]">
          {isPending ? 'Completar Solicitud' : 'Detalle de Solicitud'}
        </h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-6 items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">ID</span>
            <div className="font-semibold text-lg text-gray-900">{request.id}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Servicio</span>
            <div className="text-gray-700">{request.tipo_servicio}</div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Estado</span>
            <BadgeEstado estado={request.estado_actual} />
          </div>
          <div>
            <span className="text-sm text-gray-500">Fecha</span>
            <div className="text-gray-700">{new Date(request.fecha_creacion).toLocaleDateString('es-ES')}</div>
          </div>
        </div>
      </div>
      {/* Formulario Completo - Dinámico según tipo de solicitud */}
      <div className="space-y-6">
        {/* CLASE A - Profesional */}
        {request.tipo_servicio === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase A' && (
          <>
            {/* Identificación */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Identificación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Nombre Completo del Profesional</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.nombre || '-'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Dirección/Correo Postal (P.O.B)</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.direccion || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cédula de Identidad y Electoral</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.cedula || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Exequátur</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.exequatur || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">No. Colegiatura</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.colegiatura || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Celular</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.celular || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Teléfono(s)</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.telefonos || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Correo Electrónico</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.email || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Lugar de Trabajo</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.lugarTrabajo || '-'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Dirección del Lugar de Trabajo</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.direccionTrabajo || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Profesión */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Profesión</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Profesión Seleccionada</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.profesion || '-'}
                      {formData.profesion === 'Otra' && formData.profesionOtra && ` (${formData.profesionOtra})`}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Categorías de Drogas Controladas</label>
                    <div className="flex gap-4">
                      <span className={`px-3 py-1 rounded ${formData.categoriaII ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>II</span>
                      <span className={`px-3 py-1 rounded ${formData.categoriaIII ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>III</span>
                      <span className={`px-3 py-1 rounded ${formData.categoriaIV ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>IV</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CLASE B - Establecimiento Privado */}
        {request.tipo_servicio === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados' && (
          <>
            {/* Identificación de la Empresa */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Identificación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Nombre de la Empresa / Razón Social</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.nombreEmpresa || '-'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.direccion || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">RNC</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.rnc || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.telefono || '-'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Correo Electrónico</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.correoElectronico || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actividades */}
            {formData.actividades && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Actividades</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.actividades.importadora && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Importadora</span>}
                  {formData.actividades.exportadora && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Exportadora</span>}
                  {formData.actividades.fabricante && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Fabricante</span>}
                  {formData.actividades.distribuidor && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Distribuidor</span>}
                  {formData.actividades.laboratorioAnalitico && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Laboratorio Analítico</span>}
                  {formData.actividades.farmacia && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Farmacia</span>}
                  {formData.actividades.clinicaPrivada && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Clínica Privada</span>}
                  {formData.actividades.clinicaVeterinaria && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Clínica Veterinaria</span>}
                  {formData.actividades.institucionEnsenanza && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Institución de Enseñanza Superior</span>}
                  {formData.actividades.hospitalPublico && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Hospital Público</span>}
                  {formData.actividades.investigacion && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Investigación Categoría I</span>}
                  {formData.actividades.otra && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      Otra: {formData.actividades.otra}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Regente Farmacéutico */}
            {formData.nombreRegente && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Regente Farmacéutico</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Nombre del Regente</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.nombreRegente || '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.direccionRegente || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cédula</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.cedulaRegente || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Exequátur</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.exequaturRegente || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.telefonoRegente || '-'}
                    </div>
                  </div>
                  {formData.otroLugarTrabajo && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Otro Lugar de Trabajo</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                        {formData.otroLugarTrabajo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sustancias Controladas (si tiene actividades especiales) */}
            {formData.categoriasOption && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Sustancias Controladas</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Categorías</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.categoriasOption}
                    </div>
                  </div>
                  {formData.codigoGrupo && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Código del Grupo</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                        {formData.codigoGrupo}
                      </div>
                    </div>
                  )}
                  {formData.designacionSustancias && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Designación de Sustancias</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                        {formData.designacionSustancias}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Administrador/Propietario (si tiene actividades especiales) */}
            {formData.nombreAdministrador && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Administrador/Propietario</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.nombreAdministrador || '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.direccionAdministrador || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cédula</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.cedulaAdministrador || '-'}
                    </div>
                  </div>
                  {formData.telefonoAdministrador && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                        {formData.telefonoAdministrador}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Agente Aduanero (si tiene actividades especiales) */}
            {formData.nombreAgenteAduanero && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Agente Aduanero</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.nombreAgenteAduanero || '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.direccionAgenteAduanero || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cédula</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.cedulaAgenteAduanero || '-'}
                    </div>
                  </div>
                  {formData.telefonoAgenteAduanero && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                        {formData.telefonoAgenteAduanero}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* CAPA C - Hospital Público */}
        {request.tipo_servicio === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas' && (
          <>
            {/* Identificación de la Empresa */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Identificación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Nombre de la Empresa / Razón Social</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.nombreEmpresa || '-'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Dirección/Cama Postal (Local)</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.direccionCamaPostal || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">RNC</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.rncEmpresa || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.telefonoEmpresa || '-'}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Correo Electrónico</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.correoEmpresa || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actividades */}
            {formData.actividades && formData.actividades.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Actividades</h2>
                <div className="flex flex-wrap gap-2">
                  {formData.actividades.map((act, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      {act}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Regente Farmacéutico */}
            {formData.nombreRegente && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Regente Farmacéutico</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Nombre del Regente</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.nombreRegente || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Cédula</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.cedulaRegente || '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Exequátur</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {formData.exequaturRegente || '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sustancias Controladas (condicional) */}
            {formData.categoriasSustancias && formData.categoriasSustancias.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Sustancias Controladas</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Categorías</label>
                    <div className="flex gap-2">
                      {formData.categoriasSustancias.map((cat, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  {formData.designacionSustancias && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Designación de Sustancias</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                        {formData.designacionSustancias}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Condición de Solicitud (común para todos) */}
        {(formData.condicionSolicitud || formData.condicion) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Condición de Solicitud</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Condición</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {formData.condicionSolicitud || formData.condicion}
                  {formData.condicionOtra && ` - ${formData.condicionOtra}`}
                </div>
              </div>
              {(formData.especifiqueNoGdc || formData.noCIDC) && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">No. {formData.especifiqueNoGdc ? 'GDC' : 'CIDC'}</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.especifiqueNoGdc || formData.noCIDC}
                  </div>
                </div>
              )}
              {(formData.especifiqueElMotivo || formData.motivo) && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Motivo</label>
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {formData.especifiqueElMotivo || formData.motivo}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Documentos asociados */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Documentos</h2>
        </div>
        {request.documentos && request.documentos.length > 0 ? (
          <ul className="space-y-4">
            {request.documentos.map(doc => (
              <li key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <span className="font-medium text-gray-900">{doc.nombre_archivo || doc.nombre || 'Documento'}</span>
                  <span className="ml-2 text-xs text-gray-500">{doc.tipo_documento || doc.tipo || 'Sin tipo'}</span>
                </div>
                <div className="flex gap-2">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-blue-600 underline text-xs">Ver</a>
                  {isPending && (
                    <>
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600" onClick={() => { setSelectedDocument(doc); setModalReplaceOpen(true); }}>Reemplazar</button>
                      <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700" onClick={() => handleDeleteClick(doc)}>Eliminar</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No hay documentos asociados</div>
        )}

        {isPending && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-yellow-800 mb-3">
                  ⚠️ Esta solicitud está pendiente. Debes subir los documentos requeridos y enviar la solicitud para que sea procesada.
                </p>
              </div>
            </div>
            <button
              onClick={handleGoToUploadDocuments}
              className="w-full mt-3 px-6 py-3 bg-[#4A8BDF] text-white rounded-lg font-medium hover:bg-[#3875C8] transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Ir a Subir Documentos
            </button>
          </div>
        )}
      </div>

      {/* Mostrar error de eliminación si existe */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">❌ {deleteError}</p>
        </div>
      )}

      {/* Modal subir documento */}
      <ModalDocumento
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUpload}
        requestId={id}
        isReplace={false}
      />

      {/* Modal reemplazar documento */}
      <ModalDocumento
        open={modalReplaceOpen}
        onClose={() => { setModalReplaceOpen(false); setSelectedDocument(null); }}
        onSubmit={handleReplace}
        requestId={id}
        isReplace={true}
        initialDocument={selectedDocument}
      />

      {/* Modal confirmar eliminación */}
      <ModalConfirmacionEliminar
        open={deleteModalOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        documentName={documentToDelete?.nombre_archivo || documentToDelete?.nombre || 'Documento'}
        loading={deleteLoading}
      />
    </div>
  );
};

export default RequestDetail;
