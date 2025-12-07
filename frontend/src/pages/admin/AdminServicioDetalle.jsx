import { useParams, useNavigate } from 'react-router-dom';

export default function AdminServicioDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock: Servicios con documentos completos
  const mockServicios = {
    1: {
      id: 1,
      nombre: 'Solicitud de Certificado de Inscripción de Drogas Controladas',
      precio: 150.00,
      tipoFormulario: 'Clase A',
      documentosNuevaSolicitud: [
        { nombre: 'Cédula de Identidad y Electoral', obligatorio: true },
        { nombre: 'Título Universitario de Especialidad', obligatorio: true },
        { nombre: 'Exequátur', obligatorio: true },
        { nombre: 'Recibo de Depósito de Pago', obligatorio: true },
      ],
      documentosRenovacion: [
        { nombre: 'Cédula de Identidad y Electoral', obligatorio: true },
        { nombre: 'Certificado Anterior', obligatorio: true },
        { nombre: 'Recibo de Depósito de Pago', obligatorio: true },
      ],
      documentosRoboPerdida: [
        { nombre: 'Cédula de Identidad y Electoral', obligatorio: true },
        { nombre: 'Certificación de Robo o Pérdida emitida por la DNCD', obligatorio: true },
        { nombre: 'Recibo de Depósito de Pago', obligatorio: true },
      ],
    },
    2: {
      id: 2,
      nombre: 'Solicitud de Certificado de Inscripción de Drogas Controladas para Instituciones Públicas',
      precio: null,
      tipoFormulario: 'Clase B',
      documentosNuevaSolicitud: [
        { nombre: 'Documento de Identidad', obligatorio: true },
        { nombre: 'Certificado de Institución Pública', obligatorio: true },
      ],
      documentosRenovacion: [],
      documentosRoboPerdida: [],
    },
  };

  const mockServicio = mockServicios[id] || mockServicios[1];

  const renderDocumentos = (documentos, titulo) => {
    if (!documentos || documentos.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">{titulo}</h3>
        {documentos.map((doc, index) => (
          <div key={index} className="flex gap-3 items-center mb-3">
            <input
              type="text"
              value={doc.nombre}
              disabled
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <span className="text-sm text-gray-700 w-24 text-center">
              {doc.obligatorio ? 'Obligatorio' : 'Opcional'}
            </span>
          </div>
        ))}
      </div>
    );
  };

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
      
      <h1 className="text-3xl font-bold text-[#4A8BDF] mb-8">{mockServicio.nombre}</h1>
      
      {/* Card Información */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 max-w-[620px] mx-auto">
        <h2 className="text-lg font-bold text-[#085297] mb-6">Información</h2>
        
        <div className="space-y-4">
          {/* Nombre del Servicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio
            </label>
            <input
              type="text"
              value={mockServicio.nombre}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Tipo de Formulario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Formulario
            </label>
            <input
              type="text"
              value={mockServicio.tipoFormulario}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={mockServicio.precio !== null}
                  disabled
                  className="w-4 h-4 text-[#4A8BDF] cursor-not-allowed"
                />
                <span className="text-gray-700">RD$</span>
                <input
                  type="text"
                  value={mockServicio.precio || ''}
                  disabled
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={mockServicio.precio === null}
                  disabled
                  className="w-4 h-4 text-[#4A8BDF] cursor-not-allowed"
                />
                <span className="text-gray-700">Sin Costo</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Card Documentos Requeridos */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 max-w-[620px] mx-auto">
        <h2 className="text-lg font-bold text-[#085297] mb-6">Documentos Requeridos</h2>
        
        {renderDocumentos(mockServicio.documentosNuevaSolicitud, 'Nueva Solicitud')}
        {renderDocumentos(mockServicio.documentosRenovacion, 'Renovación')}
        {renderDocumentos(mockServicio.documentosRoboPerdida, 'Robo o Pérdida')}
      </div>
    </div>
  );
}
