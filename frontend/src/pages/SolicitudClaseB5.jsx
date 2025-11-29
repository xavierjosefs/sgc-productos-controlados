import { useNavigate } from 'react-router-dom';
import ClientTopbar from '../components/ClientTopbar';

export default function SolicitudClaseB5() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ClientTopbar - Navbar superior */}
      <ClientTopbar />

      {/* Header específico de la página */}
      <div className="bg-white border-b border-gray-200 px-6 py-8 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
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
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          {/* Título de éxito */}
          <h2 className="text-4xl font-bold text-blue-600 mb-8">
            ¡Solicitud enviada!
          </h2>

          {/* Icono de checkmark */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje de confirmación */}
          <p className="text-gray-700 text-sm mb-8 leading-relaxed">
            La solicitud se envió correctamente. Pronto recibirás novedades sobre<br />
            su estado.
          </p>

          {/* Botón para ir a Mis Solicitudes */}
          <button
            onClick={() => navigate('/')}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-lg inline-block"
          >
            Ir a "Mis Solicitudes"
          </button>
        </div>
      </div>
    </div>
  );
}
