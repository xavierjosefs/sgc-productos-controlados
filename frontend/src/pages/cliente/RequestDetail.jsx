import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientTopbar from '../../components/ClientTopbar';
import useRequestsAPI from '../../hooks/useRequestsAPI';
import BadgeEstado from '../../components/BadgeEstado';
import ModalDocumento from '../../components/ModalDocumento';
import ModalConfirmacionEliminar from '../../components/ModalConfirmacionEliminar';

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
    // Se env�a un tipo de documento por defecto si no se especifica otro
    await uploadDocument(requestId, file, { tipo_documento: 'Documento General' });
    await fetchDetail();
  };

  // Reemplazar documento
  const handleReplace = async (requestId, file, documentId) => {
    await updateDocument(requestId, documentId, file);
    await fetchDetail();
  };

  // Abrir modal de confirmaci�n de eliminaci�n
  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setDeleteModalOpen(true);
  };

  // Cancelar eliminaci�n
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
    setDeleteError('');
  };

  // Confirmar y ejecutar eliminaci�n
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
  const isPending = request.estado_actual && request.estado_actual.toLowerCase().includes('pendiente');
  const formData = request.form_data || {};

  // Funci�n para navegar a la pantalla de subir documentos correspondiente
  const handleGoToUploadDocuments = () => {
    const serviceName = request.tipo_servicio;
    
    // Para Clase A, verificar la condición para determinar la ruta correcta
    if (serviceName === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase A') {
      let route = '/solicitud-drogas-clase-a/documentos';
      
      if (formData.condicion === 'Renovación') {
        route = '/solicitud-drogas-clase-a/documentos-renovacion';
      } else if (formData.condicion === 'Robo o pérdida') {
        route = '/solicitud-drogas-clase-a/documentos-robo-perdida';
      }
      
      navigate(route, { state: { requestId: request.id, fromDetail: true } });
      return;
    }
    
    // Para Clase B, verificar la condición
    if (serviceName === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados') {
      const esRoboPerdida = formData.condicion === 'e) Robo o pérdida';
      const route = esRoboPerdida 
        ? '/solicitud-drogas-clase-b/documentos-robo-perdida'
        : '/solicitud-drogas-clase-b/documentos';
      navigate(route, { state: { requestId: request.id, fromDetail: true } });
      return;
    }
    
    // Para Capa C, verificar la condición
    if (serviceName === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas') {
      const esRoboPerdida = formData.condicionSolicitud === 'Robo o pérdida';
      const route = esRoboPerdida 
        ? '/solicitud-clase-b-capa-c/documentos-robo-perdida'
        : '/solicitud-clase-b-capa-c/documentos';
      navigate(route, { state: { requestId: request.id, fromDetail: true } });
      return;
    }
    
    // Mapeo de servicios a rutas de documentos (resto de servicios)
    const routeMap = {
      'Solicitud de Certificado de Inscripci�n de Drogas Controladas Clase B para Establecimientos Privados': '/solicitud-drogas-clase-b/documentos',
      'Solicitud de Certificado de Inscripci�n de Drogas Controladas Clase B para Hospitales P�blicos y/u otras Instituciones P�blicas': '/solicitud-clase-b-capa-c/documentos',
      'Solicitud de Permiso de Importaci�n de Materia Prima de Sustancias Controladas': '/solicitud-importacion-materia-prima/documentos',
      'Solicitud de Permiso de Importaci�n de Medicamentos con Sustancia Controlada': '/solicitud-importacion-medicamentos/documentos',
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
    <div className="min-h-screen bg-gray-50">
      <ClientTopbar />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/cliente')} className="text-[#4A8BDF] hover:text-[#3875C8] mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-[#4A8BDF]">
            {isPending ? 'Completar Solicitud' : 'Detalle de Solicitud'}
          </h1>
        </div>

        {/* Card de resumen principal */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-1">ID de Solicitud</span>
              <div className="font-bold text-xl text-gray-900">#{request.id}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-1">Estado</span>
              <BadgeEstado estado={request.estado_actual} />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-1">Fecha de Creación</span>
              <div className="text-gray-900 font-medium">{new Date(request.fecha_creacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 block mb-1">Última Actualización</span>
              <div className="text-gray-900 font-medium">
                {request.fecha_actualizacion ? new Date(request.fecha_actualizacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-500 block mb-2">Tipo de Servicio</span>
            <div className="text-gray-900 font-medium text-lg">{request.tipo_servicio}</div>
          </div>
        </div>
        {/* Formulario Completo - Dinámico según tipo de solicitud */}
        <div className="space-y-6">
        {/* CLASE A - Profesional */}
        {request.tipo_servicio === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase A' && (
          <>
            {/* Identificación */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#4A8BDF] mb-6 pb-3 border-b border-gray-200">Identificación del Profesional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.nombre && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo del Profesional</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium">
                      {formData.nombre}
                    </div>
                  </div>
                )}
                {formData.direccion && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección/Correo Postal (P.O.B)</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                      {formData.direccion}
                    </div>
                  </div>
                )}
                {formData.cedula && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cédula de Identidad y Electoral</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium">
                      {formData.cedula}
                    </div>
                  </div>
                )}
                {formData.exequatur && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Exequátur</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium">
                      {formData.exequatur}
                    </div>
                  </div>
                )}
                {formData.colegiatura && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">No. Colegiatura</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                      {formData.colegiatura}
                    </div>
                  </div>
                )}
                {formData.celular && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Celular</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                      {formData.celular}
                    </div>
                  </div>
                )}
                {formData.telefonos && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono(s)</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                      {formData.telefonos}
                    </div>
                  </div>
                )}
                {formData.email && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                      {formData.email}
                    </div>
                  </div>
                )}
                {formData.lugarTrabajo && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lugar de Trabajo</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                      {formData.lugarTrabajo}
                    </div>
                  </div>
                )}
                {formData.direccionTrabajo && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección del Lugar de Trabajo</label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                      {formData.direccionTrabajo}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profesión */}
            {(formData.profesion || formData.categoriaII || formData.categoriaIII || formData.categoriaIV) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#4A8BDF] mb-6 pb-3 border-b border-gray-200">Información Profesional</h2>
                <div className="space-y-6">
                  {formData.profesion && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Profesión Seleccionada</label>
                      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-medium">
                        {formData.profesion}
                        {formData.profesion === 'Otra' && formData.profesionOtra && ` (${formData.profesionOtra})`}
                      </div>
                    </div>
                  )}
                  {(formData.categoriaII || formData.categoriaIII || formData.categoriaIV) && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Categorías de Drogas Controladas</label>
                      <div className="flex gap-4">
                        <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${formData.categoriaII ? 'bg-[#4A8BDF] text-white' : 'bg-gray-200 text-gray-400'}`}>Categoría II</span>
                        <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${formData.categoriaIII ? 'bg-[#4A8BDF] text-white' : 'bg-gray-200 text-gray-400'}`}>Categoría III</span>
                        <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${formData.categoriaIV ? 'bg-[#4A8BDF] text-white' : 'bg-gray-200 text-gray-400'}`}>Categoría IV</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </>
        )}

        {/* CLASE B - Establecimiento Privado */}
        {request.tipo_servicio === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Establecimientos Privados' && Object.keys(formData).length > 0 && (
          <>
            {/* Identificaci�n de la Empresa */}
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
                  {formData.actividades.laboratorioAnalitico && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Laboratorio Anal�tico</span>}
                  {formData.actividades.farmacia && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Farmacia</span>}
                  {formData.actividades.clinicaPrivada && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Cl�nica Privada</span>}
                  {formData.actividades.clinicaVeterinaria && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Cl�nica Veterinaria</span>}
                  {formData.actividades.institucionEnsenanza && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Instituci�n de Ense�anza Superior</span>}
                  {formData.actividades.hospitalPublico && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Hospital P�blico</span>}
                  {formData.actividades.investigacion && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">Investigaci�n Categor�a I</span>}
                  {formData.actividades.otra && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                      Otra: {formData.actividades.otra}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Regente Farmac�utico */}
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
                    <label className="block text-sm text-gray-600 mb-1">Exequétur</label>
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
        {request.tipo_servicio === 'Solicitud de Certificado de Inscripción de Drogas Controladas Clase B para Hospitales Públicos y/u otras Instituciones Públicas' && Object.keys(formData).length > 0 && (
          <>
            {/* Identificaci�n de la Empresa */}
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

            {/* Regente Farmac�utico */}
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

        {/* Condici�n de Solicitud (com�n para todos) */}
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
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
            <p className="text-sm text-red-800">⚠️ {deleteError}</p>
          </div>
        )}
      </div>

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

      {/* Modal confirmar eliminaci�n */}
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

