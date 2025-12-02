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
  const isPending = request.estado_actual && request.estado_actual.toLowerCase().includes('pendiente');
  const formData = request.form_data || {};

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
      {/* Formulario Completo */}
      <div className="space-y-6">
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
            <div>
              <label className="block text-sm text-gray-600 mb-1">Profesión Seleccionada</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {formData.profesion || '-'}
                {formData.profesion === 'Otra' && formData.profesionOtra && ` (${formData.profesionOtra})`}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Categorías de Drogas Controladas</label>
              <div className="flex gap-4">
                <span className={`px-3 py-1 rounded ${formData.categoriaII ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>II</span>
                <span className={`px-3 py-1 rounded ${formData.categoriaIII ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>III</span>
                <span className={`px-3 py-1 rounded ${formData.categoriaIV ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>IV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Condición de Solicitud */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#2B6CB0] mb-4">Condición de Solicitud</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Condición</label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                {formData.condicion || '-'}
                {formData.condicion === 'Otra' && formData.condicionOtra && ` (${formData.condicionOtra})`}
              </div>
            </div>
            {formData.noCIDC && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">No. CIDC</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {formData.noCIDC}
                </div>
              </div>
            )}
            {formData.motivo && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Motivo</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {formData.motivo}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Documentos asociados */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Documentos</h2>
          {isPending && (
            <button
              className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg hover:bg-[#3a7bcf]"
              onClick={() => setModalOpen(true)}
            >
              Subir documento
            </button>
          )}
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
            <p className="text-sm text-yellow-800">
              ⚠️ Esta solicitud está pendiente. Sube los documentos faltantes y envía la solicitud para que sea procesada.
            </p>
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
