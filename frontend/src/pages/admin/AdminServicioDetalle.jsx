import { useParams, useNavigate } from 'react-router-dom';
import { useAdminAPI, useAdminData } from '../../hooks/useAdminAPI';
import { useToast } from '../../hooks/useToast';
import { SkeletonForm } from '../../components/SkeletonLoaders';

export default function AdminServicioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const api = useAdminAPI();

  const { data: serviceData, loading, error } = useAdminData(() => api.getServiceByCode(id), [id]);
  const servicio = serviceData?.service;

  if (error) {
    toast.error(error);
    navigate('/admin/servicios');
    return null;
  }

  if (loading) return <SkeletonForm fields={6} />;
  if (!servicio) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/admin/servicios')}
        className="flex items-center text-[#4A8BDF] mb-6 hover:text-[#3875C8] transition-colors"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>
      
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">Detalle del Servicio</h1>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código del Servicio
            </label>
            <p className="text-lg text-gray-900">{servicio.codigo_servicio}</p>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio
            </label>
            <p className="text-lg text-gray-900">{servicio.nombre_servicio}</p>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio
            </label>
            <p className="text-lg text-gray-900">
              {servicio.precio && Number(servicio.precio) > 0 
                ? `RD$ ${Number(servicio.precio).toFixed(2)}` 
                : 'Sin costo'}
            </p>
          </div>

          {/* Tipo de Formulario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Formulario
            </label>
            <p className="text-lg text-gray-900">{servicio.formulario_nombre || 'N/A'}</p>
          </div>

          {/* Documentos Requeridos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Documentos Requeridos
            </label>
            
            {servicio.documentos_requeridos ? (
              <div className="space-y-4">
                {/* Nueva Solicitud */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Nueva Solicitud</h3>
                  {servicio.documentos_requeridos.nueva && servicio.documentos_requeridos.nueva.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {servicio.documentos_requeridos.nueva.map((doc, index) => {
                        const docName = typeof doc === 'string' ? doc : (doc.codigo || doc.nombre);
                        if (!docName || docName.trim() === '') return null;
                        return (
                          <li key={index} className="text-gray-700">
                            {docName}
                            {(typeof doc === 'object' && doc.obligatorio) && <span className="text-red-500 ml-1">*</span>}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">N/A</p>
                  )}
                </div>

                {/* Renovacion */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Renovación</h3>
                  {servicio.documentos_requeridos.renovacion && servicio.documentos_requeridos.renovacion.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {servicio.documentos_requeridos.renovacion.map((doc, index) => {
                        const docName = typeof doc === 'string' ? doc : (doc.codigo || doc.nombre);
                        if (!docName || docName.trim() === '') return null;
                        return (
                          <li key={index} className="text-gray-700">
                            {docName}
                            {(typeof doc === 'object' && doc.obligatorio) && <span className="text-red-500 ml-1">*</span>}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">N/A</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Robo/Pérdida</h3>
                  {(servicio.documentos_requeridos.robo || servicio.documentos_requeridos.perdida) && 
                   (servicio.documentos_requeridos.robo?.length > 0 || servicio.documentos_requeridos.perdida?.length > 0) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {(servicio.documentos_requeridos.robo || servicio.documentos_requeridos.perdida).map((doc, index) => {
                        const docName = typeof doc === 'string' ? doc : (doc.codigo || doc.nombre);
                        if (!docName || docName.trim() === '') return null;
                        return (
                          <li key={index} className="text-gray-700">
                            {docName}
                            {(typeof doc === 'object' && doc.obligatorio) && <span className="text-red-500 ml-1">*</span>}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">N/A</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">N/A</p>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate(`/admin/servicios/${servicio.codigo_servicio}/editar`)}
              className="flex-1 bg-[#085297] text-white rounded-lg px-8 py-3 hover:bg-[#064175] transition-colors font-medium"
            >
              Editar Servicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
