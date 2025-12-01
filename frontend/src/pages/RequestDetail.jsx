import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useRequestsAPI from '../hooks/useRequestsAPI';
import BadgeEstado from '../components/BadgeEstado';
import ModalDocumento from '../components/ModalDocumento';

const RequestDetail = () => {
  const { id } = useParams();
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
    await uploadDocument(requestId, file);
    await fetchDetail();
  };

  // Reemplazar documento
  const handleReplace = async (requestId, file, documentId) => {
    await updateDocument(requestId, documentId, file);
    await fetchDetail();
  };

  // Eliminar documento
  const handleDelete = async (documentId) => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteDocument(id, documentId);
      await fetchDetail();
    } catch (error) {
      console.error('Error deleting document:', error);
      setDeleteError(error?.message || 'Error al eliminar el documento');
    } finally {
      setDeleteLoading(false);
      setSelectedDocument(null);
    }
  };

  if (loading) return <div className="py-12 text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;
  if (!request) return <div className="py-12 text-center text-gray-500">Solicitud no encontrada</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#4A8BDF] mb-4">Detalle de Solicitud</h1>
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
        {/* Botón subir documento */}
        <button className="px-4 py-2 bg-[#4A8BDF] text-white rounded-lg mb-4" onClick={() => setModalOpen(true)}>
          Subir documento
        </button>
      </div>
      {/* Campos din├ímicos del formulario */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Datos del Formulario</h2>
        {request.form_data ? (
          <div className="space-y-2">
            {Object.entries(request.form_data).map(([key, value]) => (
              <div key={key} className="flex gap-4">
                <span className="text-gray-500 font-medium min-w-[120px]">{key}</span>
                <span className="text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No hay datos de formulario</div>
        )}
      </div>
      {/* Documentos asociados */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Documentos</h2>
        {request.documentos && request.documentos.length > 0 ? (
          <ul className="space-y-4">
            {request.documentos.map(doc => (
              <li key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <span className="font-medium text-gray-900">{doc.nombre}</span>
                  <span className="ml-2 text-xs text-gray-500">{doc.tipo}</span>
                </div>
                <div className="flex gap-2">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-blue-600 underline text-xs">Ver</a>
                  <button className="px-2 py-1 bg-yellow-500 text-white rounded text-xs" onClick={() => { setSelectedDocument(doc); setModalReplaceOpen(true); }}>Reemplazar</button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded text-xs" onClick={() => alert('Eliminar documentos no est├í soportado por el backend actualmente.')}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No hay documentos asociados</div>
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
      {/* Nota: eliminación de documentos no soportada por backend actualmente */}
    </div>
  );
};

export default RequestDetail;
