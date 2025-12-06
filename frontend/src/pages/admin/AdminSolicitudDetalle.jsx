/**
 * AdminSolicitudDetalle - Vista de detalle de solicitud (solo lectura)
 * Muestra ID, Usuario, y toda la información de la solicitud
 */
import { useParams, useNavigate } from 'react-router-dom';
import BadgeEstado from '../../components/BadgeEstado';

export default function AdminSolicitudDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - en producción vendría del backend
  const mockSolicitud = {
    id: parseInt(id),
    usuario: 'Juan Pérez García',
    usuarioEmail: 'juan.perez@example.com',
    fechaCreacion: '2024-01-15',
    estado: 'pendiente',
    tipoServicio: 'Drogas Controladas Clase A',
    datos: {
      nombre: 'Juan Pérez García',
      cedula: '001-1234567-8',
      exequatur: 'EXE-12345',
      profesion: 'Médico',
      categorias: ['II', 'III'],
      condicion: 'Primera solicitud'
    },
    documentos: [
      { id: 1, nombre: 'Cédula de Identidad', estado: 'cargado' },
      { id: 2, nombre: 'Certificado Médico', estado: 'cargado' },
      { id: 3, nombre: 'Exequátur', estado: 'cargado' },
      { id: 4, nombre: 'Recibo de Pago', estado: 'pendiente' }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header con información principal */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/solicitudes')}
          className="text-[#4A8BDF] hover:text-[#3875C8] font-medium mb-4 flex items-center gap-2"
        >
          ← Volver a Solicitudes
        </button>
        <h1 className="text-3xl font-bold text-[#4A8BDF] mb-4">
          Detalle de Solicitud #{mockSolicitud.id}
        </h1>
      </div>

      {/* Card de información general */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">ID de Solicitud</p>
            <p className="text-lg font-semibold text-gray-900">#{mockSolicitud.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Usuario</p>
            <p className="text-lg font-semibold text-gray-900">{mockSolicitud.usuario}</p>
            <p className="text-sm text-gray-500">{mockSolicitud.usuarioEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Fecha de Creación</p>
            <p className="text-lg font-semibold text-gray-900">{mockSolicitud.fechaCreacion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Estado</p>
            <BadgeEstado estado={mockSolicitud.estado} />
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-1">Tipo de Servicio</p>
            <p className="text-lg font-semibold text-gray-900">{mockSolicitud.tipoServicio}</p>
          </div>
        </div>
      </div>

      {/* Card de datos del formulario */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Datos del Solicitante</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nombre Completo</p>
            <p className="text-base font-medium text-gray-900">{mockSolicitud.datos.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cédula</p>
            <p className="text-base font-medium text-gray-900">{mockSolicitud.datos.cedula}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Exequátur</p>
            <p className="text-base font-medium text-gray-900">{mockSolicitud.datos.exequatur}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profesión</p>
            <p className="text-base font-medium text-gray-900">{mockSolicitud.datos.profesion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Categorías Solicitadas</p>
            <div className="flex gap-2 mt-1">
              {mockSolicitud.datos.categorias.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">Condición de Solicitud</p>
            <p className="text-base font-medium text-gray-900">{mockSolicitud.datos.condicion}</p>
          </div>
        </div>
      </div>

      {/* Card de documentos */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Documentos Adjuntos</h2>
        <div className="space-y-3">
          {mockSolicitud.documentos.map((doc) => (
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
                <span className="font-medium text-gray-900">{doc.nombre}</span>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  doc.estado === 'cargado'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {doc.estado === 'cargado' ? 'Cargado' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
