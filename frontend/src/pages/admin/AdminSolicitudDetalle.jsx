import { useParams, useNavigate } from 'react-router-dom';
import { useAdminAPI, useAdminData } from '../../hooks/useAdminAPI';
import BadgeEstado from '../../components/BadgeEstado';

export default function AdminSolicitudDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useAdminAPI();

  const { data: requestData, loading, error } = useAdminData(
    () => api.getRequestById(id),
    [id]
  );
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/admin/solicitudes')}
          className="text-[#4A8BDF] hover:text-[#3875C8] font-medium mb-4 flex items-center gap-2"
        >
          ← Volver a Solicitudes
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Error al cargar la solicitud</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!requestData || !requestData.request) {
    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/admin/solicitudes')}
          className="text-[#4A8BDF] hover:text-[#3875C8] font-medium mb-4 flex items-center gap-2"
        >
          ← Volver a Solicitudes
        </button>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-600 font-medium">Solicitud no encontrada</p>
        </div>
      </div>
    );
  }

  const solicitud = requestData.request;
  const formData = solicitud.form_data || {};
  const documentos = solicitud.documentos || [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const estadoBadge = solicitud.estado_actual ? solicitud.estado_actual.toLowerCase() : 'pendiente';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/solicitudes')}
          className="text-[#4A8BDF] hover:text-[#3875C8] font-medium mb-4 flex items-center gap-2"
        >
          ← Volver a Solicitudes
        </button>
        <h1 className="text-3xl font-bold text-[#4A8BDF] mb-4">
          Detalle de Solicitud #{solicitud.id}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">ID de Solicitud</p>
            <p className="text-lg font-semibold text-gray-900">#{solicitud.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Usuario (Cédula)</p>
            <p className="text-lg font-semibold text-gray-900">{solicitud.user_id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Fecha de Creación</p>
            <p className="text-lg font-semibold text-gray-900">{formatDate(solicitud.fecha_creacion)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            <BadgeEstado estado={estadoBadge} />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Tipo de Servicio</p>
            <p className="text-lg font-semibold text-gray-900">{solicitud.tipo_servicio || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Tipo de Solicitud</p>
            <p className="text-lg font-semibold text-gray-900">{solicitud.tipo_solicitud || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Datos del Solicitante</h2>
        
        {Object.keys(formData).length === 0 ? (
          <p className="text-gray-500 text-sm">No hay datos del formulario disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-gray-600 capitalize">
                  {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-base font-medium text-gray-900">
                  {Array.isArray(value) ? (
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {value.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : typeof value === 'object' && value !== null ? (
                    key === 'actividades' ? (
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {Object.entries(value)
                          .filter(([_, isActive]) => isActive === true)
                          .map(([actName]) => (
                            <span
                              key={actName}
                              className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full capitalize"
                            >
                              {actName.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                         {Object.values(value).every(v => v !== true) && (
                            <span className="text-gray-500 italic">Ninguna seleccionada</span>
                         )}
                      </div>
                    ) : (
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    )
                  ) : (
                    value || 'N/A'
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card de documentos */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Adjuntos</h2>
        
        {documentos.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay documentos adjuntos</p>
        ) : (
          <div className="space-y-3">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900 block">
                      {doc.tipo_documento || doc.nombre_archivo || 'Documento'}
                    </span>
                    {doc.nombre_archivo && (
                      <span className="text-xs text-gray-500">{doc.nombre_archivo}</span>
                    )}
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Cargado
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
