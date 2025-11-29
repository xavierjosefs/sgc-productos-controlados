import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';

export default function SolicitudClaseB3() {
  const navigate = useNavigate();
  const location = useLocation();
  const datosFormulario = location.state?.formData || {};
  const vieneDeP2 = location.state?.vieneDeP2 || false;
  
  const [documents] = useState({
    cedulaRepresentante: null,
    cedulaDirector: null,
    tituloDirector: null,
    exequaturDirector: null,
    permisoApertura: null,
    reciboPago: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario completado:', { ...datosFormulario, documents });
    // Navegar a la pantalla final
    navigate('/solicitud-clase-b-4', { state: { formData: { ...datosFormulario, documents } } });
  };

  const documentos = [
    {
      key: 'cedulaRepresentante',
      label: 'Cédula del Representante Legal del Establecimiento',
    },
    {
      key: 'cedulaDirector',
      label: 'Cédula del Director Técnico',
    },
    {
      key: 'tituloDirector',
      label: 'Título del Director Técnico',
    },
    {
      key: 'exequaturDirector',
      label: 'Exequátur del Director Técnico',
    },
    {
      key: 'permisoApertura',
      label: 'Permiso de apertura y/o habilitación del establecimiento vigente, o copia del volante de renovación sellado por Ventanilla Única de Servicios.',
    },
    {
      key: 'reciboPago',
      label: 'Recibo de Depósito del Pago',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ClientTopbar - Navbar superior */}
      <ClientTopbar />

      {/* Header específico de la página */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/solicitud-clase-b-2')}
              className="text-blue-500 hover:text-blue-700 text-3xl flex-shrink-0"
            >
              ←
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-blue-600 leading-tight">
                Solicitud de Certificado de Inscripción de Drogas Controladas Clase B<br />
                para Establecimientos Privados
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECCIÓN: Documentos - Aparece siempre */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-blue-600 font-bold text-lg mb-6">Documentos</h2>
            <div className="space-y-6">
              {documentos.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      readOnly
                      value="Solo se permiten archivos PNG, JPG o PDF"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded text-sm text-gray-500 bg-white"
                    />
                    <button
                      type="button"
                      className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded text-sm flex-shrink-0"
                    >
                      Subir Documento
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() => {
                if (vieneDeP2) {
                  navigate('/solicitud-clase-b-2');
                } else {
                  navigate('/solicitud-clase-b');
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-12 rounded-lg"
            >
              Volver
            </button>
            <button
              type="submit"
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-12 rounded-lg"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
